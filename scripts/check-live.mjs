#!/usr/bin/env node
// Prüft die gebaute Livegang-Fassung (SITE_STAGING=0, SITE_URL=https://ict-baden.de), bevor sie als Image erscheint:
// kein noindex, keine Vorschauleiste, keine Vorschau-Adresse, robots.txt ohne "Disallow: /", kanonische Adressen auf
// https://ict-baden.de, die Pflichtseiten sind da (auch die Adressen, die die Apps verlinken), und keine Weiterleitung
// oder 410 in deploy/nginx.conf verdeckt eine gebaute Seite (so war /produkte/ früher auf /#produkte umgeleitet).
//   node scripts/check-live.mjs [dist-live]
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
// Pflichtseiten: Startseiten, Produktübersichten, Produktseiten und die Adressen, die die Apps selbst verlinken
// (/impressum/, /datenschutz/<app>/, /produkte/<slug>/)
const products = JSON.parse(readFileSync(resolve(import.meta.dirname, '../src/data/products.json'), 'utf8')).products;
const REQUIRED = ['/', '/en/', '/produkte/', '/en/products/', '/impressum/', '/datenschutz/', '/werkzeuge/pulswertigkeit/',
  ...products.flatMap((p) => [`/produkte/${p.slug}/`, `/en/products/${p.slug}/`]),
  ...['vitrine', 'lupe', 'zutritt', 'riegel', 'industrial-kiosk-browser', 'industrialkeyboard'].map((a) => `/datenschutz/${a}/`)];
const built = new Set();
for (const file of files(DIST)) {
  const rel = '/' + relative(DIST, file).split('\\').join('/');
  if (rel.endsWith('/index.html')) built.add(rel.slice(0, -'index.html'.length));
  else built.add(rel);
}
for (const r of REQUIRED) if (!built.has(r)) problems.push(`${r}: Seite fehlt`);

// Weiterleitungen und 410 aus deploy/nginx.conf (location = /pfad und location ~ ^regex$ mit return 301/410) dürfen
// keine gebaute Seite treffen – sonst sieht niemand die Seite, und die Sitemap nennt eine Adresse, die umleitet
const nginx = readFileSync(resolve(import.meta.dirname, '../deploy/nginx.conf'), 'utf8');
// (nur ein return direkt im location-Block; ein return in einem if, etwa für ?page=, gilt nicht für jede Anfrage)
const routes = [...nginx.matchAll(/^\s*location\s+(=|~|~\*)\s+(\S+)\s*\{(?:(?!\bif\b)[^}])*?\breturn\s+(301|302|308|410)\b/gm)]
  .map(([, op, pat, code]) => ({ code, pat, test: op === '=' ? (u) => u === pat : (u) => new RegExp(pat, op === '~*' ? 'i' : '').test(u) }));
for (const u of built) {
  if (!u.endsWith('/') && !u.endsWith('.html')) continue;
  const path = u.endsWith('/index.html') ? u.slice(0, -'index.html'.length) : u;
  for (const r of routes) if (r.test(path)) problems.push(`${path}: nginx antwortet mit ${r.code} (location ${r.pat}) statt die gebaute Seite zu zeigen`);
}

const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (/^Disallow:\s*\/\s*$/m.test(robots)) problems.push('robots.txt: Disallow: /');
if (!robots.includes(`Sitemap: ${LIVE}/sitemap.xml`)) problems.push('robots.txt: Sitemap fehlt');
if (problems.length) {
  console.error(`Livegang-Fassung: ${problems.length} Problem(e)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`Livegang-Fassung in Ordnung: ${pages} Seiten indexierbar, alles auf ${LIVE}, ${REQUIRED.length} Pflichtseiten da, keine der ${routes.length} Weiterleitungen und 410-Regeln in nginx verdeckt eine Seite.`);
