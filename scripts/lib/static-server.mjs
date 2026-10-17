// Kleiner statischer Server für Prüfungen und Bildschirmfotos. Verhält sich wie deploy/nginx.conf:
// Verzeichnis -> index.html, 404.html, gzip für Text und dieselben Cache-Header.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { createGzip } from 'node:zlib';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};
const COMPRESS = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt', '.webmanifest']);

function cacheControl(uri) {
  if (uri.startsWith('/_astro/')) return 'public, max-age=31536000, immutable';
  if (/^\/(media|og|brand)\//.test(uri) || /\.(woff2|webp|png|jpg|svg|ico|pdf)$/.test(uri)) return 'public, max-age=604800';
  if (/\.(css|js|webmanifest)$/.test(uri)) return 'public, max-age=3600, must-revalidate';
  return 'no-cache';
}

export function serve(dir, port = 0) {
  const root = resolve(dir);
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const path = normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '');
    let file = join(root, path);
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!url.pathname.endsWith('/')) { res.writeHead(301, { Location: url.pathname + '/' }).end(); return; }
      file = join(file, 'index.html');
    }
    let status = 200;
    if (!existsSync(file)) { status = 404; file = join(root, '404.html'); }
    if (!existsSync(file)) { res.writeHead(404).end('not found'); return; }
    const ext = extname(file);
    const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream', 'Cache-Control': cacheControl(url.pathname) };
    const gzip = COMPRESS.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');
    if (gzip) { headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding'; }
    res.writeHead(status, headers);
    const stream = createReadStream(file);
    (gzip ? stream.pipe(createGzip({ level: 6 })) : stream).pipe(res);
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok({ server, url: `http://127.0.0.1:${server.address().port}` })));
}
