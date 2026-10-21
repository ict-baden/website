#!/usr/bin/env node
// Prüft die gebaute Livegang-Fassung (SITE_STAGING=0, SITE_URL=https://ict-baden.de), bevor sie als Image erscheint:
// kein noindex, keine Vorschauleiste, keine Vorschau-Adresse, robots.txt ohne "Disallow: /", kanonische Adressen auf
// https://ict-baden.de.   node scripts/check-live.mjs [dist-live]
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const DIST = resolve(process.argv[2] ?? 'dist-live');
const LIVE = 'https://ict-baden.de';
const problems = [];
function* files(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(html|txt|xml|webmanifest)$/.test(f)) yield p;
  }
}
let pages = 0;
for (const file of files(DIST)) {
  const rel = '/' + relative(DIST, file).split('\\').join('/');
  if (rel.startsWith('/og-vorlage/')) continue;
  const t = readFileSync(file, 'utf8');
  if (/netgetvpn/i.test(t)) problems.push(`${rel}: Vorschau-Adresse`);
  if (!rel.endsWith('.html')) continue;
  pages++;
  if (rel !== "/404.html" && /<meta name="robots"[^>]*noindex/i.test(t)) problems.push(`${rel}: meta noindex`);
  if (/class="[^"]*staging/i.test(t)) problems.push(`${rel}: Vorschauleiste`);
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(t)?.[1];
  if (rel !== '/404.html' && !canonical?.startsWith(`${LIVE}/`)) problems.push(`${rel}: canonical ${canonical}`);
}
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (/^Disallow:\s*\/\s*$/m.test(robots)) problems.push('robots.txt: Disallow: /');
if (!robots.includes(`Sitemap: ${LIVE}/sitemap.xml`)) problems.push('robots.txt: Sitemap fehlt');
if (problems.length) {
  console.error(`Livegang-Fassung: ${problems.length} Problem(e)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`Livegang-Fassung in Ordnung: ${pages} Seiten indexierbar, alles auf ${LIVE}.`);
