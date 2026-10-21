#!/usr/bin/env node
// Erzeugt die Produktsymbole im Stil der App-Icon-Vorlage (Definition: scripts/product-icons.mjs):
//
//   npm run icons                      # src/assets/product-icons/<id>.svg, src/styles/product-colors.css, README-Tabelle
//   npm run icons -- --sheet out.png   # zusätzlich Kontaktbogen (16/24/32/64 px, hell und dunkel) zum Ansehen
//
// Prüft dabei: jedes Farbpaar nur einmal und deutlich verschieden von allen anderen (auch von den eigenen
// Logos aus den Repos), Symbol nur aus erlaubten SVG-Elementen.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ICON_SPECS, iconSvg } from './product-icons.mjs';
import { productColors, writeProductColors } from './lib/product-colors.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'src', 'assets', 'product-icons');
const data = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'products.json'), 'utf8'));
const byId = new Map(data.products.map((p) => [p.id, p]));
const problems = [];

// ---------------------------------------------------------------------------------------------
// Prüfen

const HEX = /^#[0-9a-f]{6}$/;
// Nur veröffentlichte Produkte (products.json) ohne eigenes Logo im Repo bekommen ein Symbol; die übrigen Entwürfe bleiben unbenutzt
const ACTIVE = Object.fromEntries(Object.entries(ICON_SPECS).filter(([id]) => byId.has(id) && !byId.get(id).media.logo));
for (const [id, spec] of Object.entries(ICON_SPECS)) {
  if (!spec.colors?.every((c) => HEX.test(c))) problems.push(`${id}: Farben müssen #rrggbb in Kleinbuchstaben sein`);
  if (/<(?!\/?(path|circle|rect|g)\b)/.test(spec.symbol)) problems.push(`${id}: Symbol enthält andere Elemente als path, circle, rect, g`);
  if (/<text|href|style=/i.test(spec.symbol)) problems.push(`${id}: keine Schrift, Verweise oder style-Attribute im Symbol`);
}

// Abstand der Farbpaare in OKLab (Mittel aus oben und unten); 0,045 ist gut unterscheidbar
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
function oklab(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
const dE = (a, b) => Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));
// Mittelton des Verlaufs (Mittel beider Farben in OKLab): so wirkt das Symbol in Kartengröße. Zwei Paare
// mit verschiedenen Enden können denselben Mittelton haben und sehen dann wie Zwillinge aus.
const mid = (c) => oklab(c[0]).map((v, i) => (v + oklab(c[1])[i]) / 2);
const MIN_DISTANCE = 0.04;
const MIN_MID_DISTANCE = 0.05;
const pairs = data.products.map((p) => [p, productColors(p)]).filter(([, c]) => c);
for (let i = 0; i < pairs.length; i++) {
  for (let j = i + 1; j < pairs.length; j++) {
    const [[p, a], [q, b]] = [pairs[i], pairs[j]];
    const d = (dE(a[0], b[0]) + dE(a[1], b[1])) / 2;
    if (d < MIN_DISTANCE) problems.push(`${p.slug} und ${q.slug}: Farbpaare zu ähnlich (${d.toFixed(3)})`);
    const dm = Math.hypot(...mid(a).map((v, k) => v - mid(b)[k]));
    if (dm < MIN_MID_DISTANCE) problems.push(`${p.slug} und ${q.slug}: Mitteltöne der Verläufe zu ähnlich (${dm.toFixed(3)})`);
  }
}
if (problems.length) {
  console.error(`Produktsymbole: ${problems.length} Problem(e)\n  ` + problems.join('\n  '));
  process.exit(1);
}

// ---------------------------------------------------------------------------------------------
// Schreiben

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith('.svg') && !ACTIVE[f.slice(0, -4)]) rmSync(join(OUT, f));
for (const [id, spec] of Object.entries(ACTIVE)) writeFileSync(join(OUT, `${id}.svg`), iconSvg(id, spec));
const n = writeProductColors(data.products);

// Tabelle der Farbpaare im README (zwischen den Markierungen)
const linie = new Map(data.linien.map((l) => [l.id, l.name]));
const rows = data.products.map((p) => {
  const spec = ACTIVE[p.id];
  const c = productColors(p);
  const source = spec ? (spec.repoLogo ? 'generated, symbol from the repo logo' : 'generated') : p.media.logo ? 'own icon from the repo' : '–';
  const sw = (hex) => (hex ? `\`${hex}\`` : '–');
  return `| ${p.name} | ${linie.get(p.linie)} | ${sw(c?.[0])} | ${sw(c?.[1])} | ${spec ? spec.en : 'own'} | ${source} |`;
});
const table = ['| Product | Line | Top | Bottom | Symbol | Source |', '|---|---|---|---|---|---|', ...rows].join('\n');
const readmePath = join(ROOT, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
const START = '<!-- product-icons:start -->';
const END = '<!-- product-icons:end -->';
if (readme.includes(START) && readme.includes(END)) {
  const next = readme.slice(0, readme.indexOf(START) + START.length) + '\n' + table + '\n' + readme.slice(readme.indexOf(END));
  if (next !== readme) writeFileSync(readmePath, next);
} else {
  console.warn('README: Markierungen für die Farbtabelle fehlen, Tabelle nicht geschrieben');
}
console.log(`${Object.keys(ACTIVE).length} Produktsymbole → src/assets/product-icons/, ${n} Farbpaare → src/styles/product-colors.css`);

// ---------------------------------------------------------------------------------------------
// Kontaktbogen (optional)

const sheetArg = process.argv.indexOf('--sheet');
if (sheetArg > 0) {
  const { launch } = await import('./lib/browser.mjs');
  const uri = (s) => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
  const items = data.products.map((p) => {
    const spec = ACTIVE[p.id];
    if (spec) return [p.name, uri(iconSvg(p.id, spec))];
    const file = p.media.logo && join(ROOT, 'public', p.media.logo);
    if (!file || !existsSync(file)) return [p.name, ''];
    const mime = file.endsWith('.svg') ? 'image/svg+xml' : 'image/webp';
    return [`${p.name} (eigen)`, `data:${mime};base64,${readFileSync(file).toString('base64')}`];
  });
  const cell = ([name, src]) => `<div class="c"><div class="r">${[16, 24, 32, 64].map((s) => `<img src="${src}" width="${s}" height="${s}" alt="">`).join('')}</div>${name}</div>`;
  const grid = (cls) => `<div class="g ${cls}">${items.map(cell).join('')}</div>`;
  const html = `<style>body{margin:0;font:12px system-ui,sans-serif}.g{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:12px}.r{display:flex;align-items:end;gap:8px;margin-bottom:4px}.l{background:#f9f8f4;color:#111}.d{background:#111;color:#eee}</style>${grid('l')}${grid('d')}`;
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    await page.setContent(html);
    await page.waitForTimeout(300);
    await page.screenshot({ path: resolve(process.argv[sheetArg + 1]), fullPage: true });
  } finally {
    await browser.close();
  }
  console.log(`Kontaktbogen → ${process.argv[sheetArg + 1]}`);
}
