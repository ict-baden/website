#!/usr/bin/env node
// Erzeugt Favicons, App-Symbole und Open-Graph-Bilder. Ergebnis wird eingecheckt; nur nach Änderungen an
// Wortmarke, Produktdaten oder OG-Vorlage neu ausführen:  npm run brand
//
//  - public/favicon.svg, public/favicon.ico (16/32/48), public/apple-touch-icon.png
//  - public/brand/icon-192.png, icon-512.png, ict-baden-wordmark(-dark).svg
//  - public/og/ict-baden.png und public/og/produkte/<slug>.jpg (Vorlage: src/components/OgCard.astro)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { serve } from './lib/static-server.mjs';
import { launch } from './lib/browser.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const mark = JSON.parse(readFileSync(join(ROOT, 'src/assets/brand/wordmark.json'), 'utf8'));
const pub = (...p) => join(ROOT, 'public', ...p);
mkdirSync(pub('brand'), { recursive: true });
mkdirSync(pub('og', 'produkte'), { recursive: true });

const c = mark.colors;
const gradient = `<linearGradient id="y" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${c.yellowTop}"/><stop offset="0.55" stop-color="${c.yellowMid}"/><stop offset="1" stop-color="${c.yellowBottom}"/></linearGradient>`;
const tile = `<rect x="0.5" y="0.5" width="63" height="63" rx="11.5" fill="url(#y)" stroke="${c.edge}" stroke-opacity="0.55"/><path d="${mark.ict}" fill="${c.red}"/>`;

// Favicon (Kachel mit "ICT")
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>${gradient}</defs>${tile}</svg>\n`;
writeFileSync(pub('favicon.svg'), faviconSvg);

// Wortmarke für Dokumente und Weitergabe
const wordmark = (baden) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mark.width} 64" width="${mark.width * 4}" height="256"><title>ICT Baden</title><defs>${gradient}</defs>${tile}<path d="${mark.baden}" fill="${baden}"/></svg>\n`;
writeFileSync(pub('brand', 'ict-baden-wordmark.svg'), wordmark('#14161b'));
writeFileSync(pub('brand', 'ict-baden-wordmark-dark.svg'), wordmark('#f3f4f6'));

// PNG-Symbole
const png = (size, pad = 0, bg = null) => {
  const inner = Math.round(size * (1 - 2 * pad));
  const svg = Buffer.from(faviconSvg.replace('<svg ', `<svg width="${inner}" height="${inner}" `));
  return sharp({ create: { width: size, height: size, channels: 4, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: svg, left: Math.round((size - inner) / 2), top: Math.round((size - inner) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};
writeFileSync(pub('brand', 'icon-192.png'), await png(192, 0.04));
writeFileSync(pub('brand', 'icon-512.png'), await png(512, 0.04));
writeFileSync(pub('apple-touch-icon.png'), await png(180, 0.1, { r: 255, g: 255, b: 255, alpha: 1 }));

// favicon.ico mit eingebetteten PNGs (16, 32, 48)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync(pub('favicon.ico'), Buffer.concat([header, ...images]));
console.log('Favicons und Symbole geschrieben');

// Open-Graph-Bilder: Vorlagen mit Astro bauen und mit Chromium abfotografieren
if (!process.argv.includes('--no-og')) {
  const outDir = join(ROOT, '.og-build');
  rmSync(outDir, { recursive: true, force: true });
  execFileSync(process.execPath, [join(ROOT, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build', '--outDir', outDir], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, OG_TEMPLATES: '1', ASTRO_TELEMETRY_DISABLED: '1' },
  });
  const products = JSON.parse(readFileSync(join(ROOT, 'src/data/products.json'), 'utf8')).products;
  const { server, url } = await serve(outDir);
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    for (const slug of ['ict-baden', ...products.map((p) => p.slug)]) {
      await page.goto(`${url}/og-vorlage/${slug}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const shot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
      if (slug === 'ict-baden') writeFileSync(pub('og', 'ict-baden.png'), await sharp(shot).png({ compressionLevel: 9, palette: false }).toBuffer());
      else writeFileSync(pub('og', 'produkte', `${slug}.jpg`), await sharp(shot).jpeg({ quality: 84, mozjpeg: true }).toBuffer());
    }
  } finally {
    await browser.close();
    server.close();
    rmSync(outDir, { recursive: true, force: true });
  }
  console.log(`Open-Graph-Bilder geschrieben (${products.length + 1})`);
}
