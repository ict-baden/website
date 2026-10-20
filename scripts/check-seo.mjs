#!/usr/bin/env node
// Prüft die gebaute Website (dist/) auf das, was Suchmaschinen und KI-Suche brauchen:
//   - Titel (≤ 70 Zeichen), Meta-Beschreibung (70–170), genau eine H1, kanonische Adresse, og:image:alt
//   - hreflang: jede Sprachfassung existiert und verweist zurück, x-default vorhanden
//   - JSON-LD: gültiges JSON, Pflichtfelder je Typ, FAQ-Fragen auch sichtbar auf der Seite
//   - Bilder: jedes <img> hat ein alt-Attribut; Bildschirmfotos der Produktseiten haben einen Alternativtext
//   - keine Namen fremder Produkte auf Produktseiten ohne Freigabe ("ersetzt" in scripts/public-overrides.json)
//   - robots.txt (Vorschau: alles gesperrt; live: Sitemap), sitemap.xml (nur vorhandene Seiten), llms.txt
//
//   node scripts/check-seo.mjs [dist]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { competitorHits } from './lib/public-guard.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = resolve(process.argv[2] ?? join(ROOT, 'dist'));
const SITE_URL = (process.env.SITE_URL || 'https://ictbaden.netgetvpn.de').replace(/\/+$/, '');
const STAGING = (process.env.SITE_STAGING ?? '1') !== '0';
const products = JSON.parse(readFileSync(join(ROOT, 'src/data/products.json'), 'utf8')).products;
const overrides = JSON.parse(readFileSync(join(ROOT, 'scripts/public-overrides.json'), 'utf8')).products ?? {};

const problems = [];
const warn = [];
const fail = (page, msg) => problems.push(`${page}: ${msg}`);

function* htmlFiles(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (f.endsWith('.html')) yield p;
  }
}

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#x27;/g, "'");
// Attributwert; ein leeres Attribut steht nach compressHTML ohne Wert da (alt statt alt="")
const attr = (tag, name) => {
  const m = new RegExp(`\\s${name}(?:=(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?(?=[\\s/>])`, 'i').exec(tag);
  return m ? decode(m[1] ?? m[2] ?? m[3] ?? '') : null;
};
const textOf = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const urlToFile = (u) => {
  if (!u.startsWith(SITE_URL)) return null;
  const path = u.slice(SITE_URL.length).split('#')[0];
  return path.endsWith('/') ? join(DIST, path, 'index.html') : join(DIST, path);
};

const pages = new Map();
for (const file of htmlFiles(DIST)) {
  const rel = '/' + relative(DIST, file).split('\\').join('/').replace(/index\.html$/, '');
  if (rel.startsWith('/og-vorlage/')) continue;
  pages.set(rel, readFileSync(file, 'utf8'));
}

const REQUIRED = {
  Organization: ['name', 'url', 'logo', 'address'],
  WebSite: ['name', 'url'],
  WebPage: ['url', 'name', 'inLanguage'],
  SoftwareApplication: ['name', 'description', 'url', 'applicationCategory', 'operatingSystem', 'publisher', 'license'],
  FAQPage: ['mainEntity'],
  BreadcrumbList: ['itemListElement'],
  ItemList: ['itemListElement'],
};
const types = (n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]);

let ldCount = 0;
for (const [page, html] of pages) {
  const is404 = page === '/404.html';
  const head = html.slice(0, html.indexOf('</head>'));
  const title = decode(/<title>([^<]*)<\/title>/.exec(head)?.[1] ?? '');
  const desc = attr(/<meta name="description"[^>]*>/.exec(head)?.[0] ?? '', 'content') ?? '';
  if (!title) fail(page, 'kein <title>');
  else if (title.length > 70) fail(page, `Titel zu lang (${title.length}): ${title}`);
  if (!desc) fail(page, 'keine Meta-Beschreibung');
  else if (!is404 && (desc.length < 70 || desc.length > 170)) fail(page, `Meta-Beschreibung ${desc.length} Zeichen (70–170): ${desc}`);
  const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1 !== 1) fail(page, `${h1} H1-Überschriften`);
  if (!is404) {
    const canonical = attr(/<link rel="canonical"[^>]*>/.exec(head)?.[0] ?? '', 'href');
    if (canonical !== `${SITE_URL}${page}`) fail(page, `kanonische Adresse ${canonical}`);
    if (!/<meta property="og:image:alt" content="[^"]+"/.test(head)) fail(page, 'og:image:alt fehlt');
  }

  // hreflang
  const alts = [...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: m[2] }));
  if (alts.length) {
    if (!alts.some((a) => a.lang === 'x-default')) fail(page, 'hreflang ohne x-default');
    if (!alts.some((a) => a.href === `${SITE_URL}${page}`)) fail(page, 'hreflang nennt die Seite selbst nicht');
    for (const a of alts) {
      const target = a.href.slice(SITE_URL.length);
      const other = pages.get(target);
      if (!other) { fail(page, `hreflang ${a.lang} → ${a.href} existiert nicht`); continue; }
      if (!other.includes(`hreflang="${a.lang === 'x-default' ? 'x-default' : a.lang}"`) || !other.includes(`href="${SITE_URL}${page}"`)) {
        fail(page, `hreflang ${a.lang} → ${target} verweist nicht zurück`);
      }
    }
    const lang = /<html lang="([^"]+)"/.exec(html)?.[1];
    if (!alts.some((a) => a.lang === lang && a.href === `${SITE_URL}${page}`)) fail(page, `hreflang passt nicht zu <html lang="${lang}">`);
  }

  // Bilder
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (attr(img[0], 'alt') === null) fail(page, `<img> ohne alt: ${img[0].slice(0, 120)}`);
  }
  const shots = html.match(/<ul class="shots[^"]*"[\s\S]*?<\/ul>/)?.[0] ?? '';
  for (const img of shots.matchAll(/<img\b[^>]*>/g)) {
    const alt = attr(img[0], 'alt');
    if (!alt || alt.length < 20) fail(page, `Bildschirmfoto ohne aussagekräftigen Alternativtext: ${attr(img[0], 'src')}`);
    else if (alt.length > 200) warn.push(`${page}: Alternativtext ${alt.length} Zeichen: ${alt.slice(0, 60)}…`);
  }

  // JSON-LD
  const visible = textOf(html);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    ldCount++;
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      fail(page, `JSON-LD ungültig: ${e.message}`);
      continue;
    }
    if (data['@context'] !== 'https://schema.org') fail(page, 'JSON-LD ohne @context https://schema.org');
    const nodes = data['@graph'] ?? [data];
    for (const n of nodes) {
      for (const t of types(n)) {
        for (const key of REQUIRED[t] ?? []) if (n[key] === undefined || n[key] === '' || (Array.isArray(n[key]) && !n[key].length)) fail(page, `JSON-LD ${t}: ${key} fehlt`);
      }
      const t = types(n);
      if (t.includes('SoftwareApplication')) {
        if (n.offers && (n.offers.price === undefined || !n.offers.priceCurrency)) fail(page, 'SoftwareApplication.offers ohne price/priceCurrency');
        if (n.aggregateRating || n.review) fail(page, 'SoftwareApplication mit Bewertungen – nicht ohne echte Bewertungen');
        for (const u of [n.url, n.image, ...(n.screenshot ?? []).map((s) => s.url)]) {
          if (typeof u === 'string' && u.startsWith(SITE_URL) && !existsSync(urlToFile(u))) fail(page, `JSON-LD verweist auf fehlende Datei ${u}`);
        }
      }
      if (t.includes('FAQPage')) {
        for (const q of n.mainEntity) {
          if (!q.name || !q.acceptedAnswer?.text) fail(page, 'FAQPage: Frage ohne Text oder Antwort');
          else if (!visible.includes(q.name)) fail(page, `FAQPage: Frage nicht sichtbar auf der Seite: ${q.name}`);
        }
      }
      if (t.includes('BreadcrumbList')) {
        n.itemListElement.forEach((it, i) => {
          if (it.position !== i + 1) fail(page, 'BreadcrumbList: Positionen nicht fortlaufend');
          if (!String(it.item).startsWith('http')) fail(page, 'BreadcrumbList: item ohne absolute Adresse');
        });
      }
    }
  }

  // Fremdprodukte auf Produktseiten nur mit Freigabe
  const prod = products.find((p) => page === `/produkte/${p.slug}/` || page === `/en/products/${p.slug}/`);
  if (prod && overrides[prod.id]?.ersetzt !== true) {
    const hits = competitorHits(visible + ' ' + head);
    if (hits.length) fail(page, `Fremdprodukt ohne Freigabe genannt: ${[...new Set(hits)].join(', ')}`);
  }
}

// Produktseiten vollständig (deutsch und englisch)
for (const p of products) {
  for (const path of [`/produkte/${p.slug}/`, `/en/products/${p.slug}/`]) {
    const html = pages.get(path);
    if (!html) { fail(path, 'Produktseite fehlt'); continue; }
    if (!html.includes('"@type":"SoftwareApplication"')) fail(path, 'kein SoftwareApplication-JSON-LD');
    if (!html.includes('"@type":"FAQPage"')) fail(path, 'kein FAQPage-JSON-LD');
  }
}

// robots.txt, sitemap.xml, llms.txt
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (STAGING && !/User-agent: \*\nDisallow: \//.test(robots)) problems.push('robots.txt: Vorschau sperrt nicht alles');
if (!STAGING && (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`) || /Disallow: \/\s*$/m.test(robots))) problems.push('robots.txt: live ohne Sitemap oder mit Disallow');
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
for (const u of locs) if (!existsSync(urlToFile(u) ?? '')) problems.push(`sitemap.xml: ${u} existiert nicht`);
for (const [page] of pages) if (page !== '/404.html' && !locs.includes(`${SITE_URL}${page}`)) problems.push(`sitemap.xml: ${page} fehlt`);
for (const m of sitemap.matchAll(/<xhtml:link rel="alternate" hreflang="[^"]+" href="([^"]+)"\/>/g)) if (!existsSync(urlToFile(decode(m[1])) ?? '')) problems.push(`sitemap.xml: hreflang-Ziel ${m[1]} existiert nicht`);
for (const f of ['llms.txt', 'llms-full.txt']) {
  const t = existsSync(join(DIST, f)) ? readFileSync(join(DIST, f), 'utf8') : '';
  if (!t.startsWith('# ICT Baden')) problems.push(`${f} fehlt oder beginnt nicht mit "# ICT Baden"`);
  for (const p of products) if (!t.includes(`${SITE_URL}/produkte/${p.slug}/`)) problems.push(`${f}: ${p.name} fehlt`);
}

for (const w of warn) console.warn(`Hinweis: ${w}`);
if (problems.length) {
  console.error(`SEO-Prüfung: ${problems.length} Problem(e)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`SEO in Ordnung: ${pages.size} Seiten, ${ldCount} JSON-LD-Blöcke, hreflang wechselseitig, ${locs.length} Adressen in der Sitemap.`);
