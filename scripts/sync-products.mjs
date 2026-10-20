#!/usr/bin/env node
// Erzeugt src/data/products.json und die Produktbilder unter public/media/produkte/ aus dem (privaten)
// Projekt-Repo ict-baden-projekte und – soweit vorhanden – aus den Produkt-Repos.
//
//   node scripts/sync-products.mjs <pfad-zu-ict-baden-projekte> [<ordner-mit-produkt-repos> …]
//
// Produkt-Repos werden in allen angegebenen Ordnern und immer auch neben ict-baden-projekte gesucht
// (z. B. ../lupe); bei mehreren Treffern gilt der zuerst angegebene Ordner.
// Übernommen werden nur öffentliche Felder (siehe scripts/lib/public-guard.mjs) und nur die Produkte aus
// "veroeffentlicht" in scripts/public-overrides.json. Das Ergebnis wird eingecheckt, damit der Build ohne
// Zugriff auf die privaten Repos funktioniert.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { findCompetitorMentions, findLeaks } from './lib/public-guard.mjs';
import { writeProductColors } from './lib/product-colors.mjs';
import { PUBLIC_SECTIONS, sentences, splitSections, toBlocks } from './lib/notes.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_JSON = join(ROOT, 'src', 'data', 'products.json');
const OUT_MEDIA = join(ROOT, 'public', 'media', 'produkte');
const MEDIA_URL = '/media/produkte';

const STATUS = {
  fertig: { key: 'verfuegbar', label: 'Verfügbar', rank: 0 },
  'fast-fertig': { key: 'vorabversion', label: 'Vorabversion', rank: 1 },
  angefangen: { key: 'in-entwicklung', label: 'In Entwicklung', rank: 2 },
  idee: { key: 'geplant', label: 'Geplant', rank: 3 },
};

const SHOT_WIDTHS = [800, 1600];
const BANNER_WIDTHS = [1280, 2560];

// ---------------------------------------------------------------------------------------------
// Aufruf prüfen

const [projektePathArg, ...reposDirArgs] = process.argv.slice(2);
if (!projektePathArg) {
  console.error('Aufruf: node scripts/sync-products.mjs <pfad-zu-ict-baden-projekte> [<ordner-mit-produkt-repos> …]');
  process.exit(2);
}
const projektePath = resolve(projektePathArg);
const reposDirs = [...new Set([...reposDirArgs.map((d) => resolve(d)), dirname(projektePath)])];
const projekteFile = join(projektePath, 'projekte.json');
if (!existsSync(projekteFile)) {
  console.error(`projekte.json nicht gefunden: ${projekteFile}`);
  process.exit(2);
}

const source = JSON.parse(readFileSync(projekteFile, 'utf8'));
const overrideFile = JSON.parse(readFileSync(join(ROOT, 'scripts', 'public-overrides.json'), 'utf8'));
const overrides = overrideFile.products ?? {};
// Nur diese Produkte erscheinen auf der Website (eine Stelle, siehe README "Product selection")
const published = overrideFile.veroeffentlicht ?? [];
if (!published.length) {
  console.error('scripts/public-overrides.json: Liste "veroeffentlicht" fehlt oder ist leer');
  process.exit(2);
}
const missing = published.filter((id) => !source.projekte.some((p) => p.id === id));
if (missing.length) {
  console.error(`In projekte.json fehlen veröffentlichte Produkte: ${missing.join(', ')}`);
  process.exit(2);
}
const mediaConfig = JSON.parse(readFileSync(join(ROOT, 'scripts', 'product-media.json'), 'utf8')).repos ?? {};
const previous = existsSync(OUT_JSON) ? JSON.parse(readFileSync(OUT_JSON, 'utf8')) : { products: [] };
const previousBySlug = new Map(previous.products.map((p) => [p.slug, p]));

// ---------------------------------------------------------------------------------------------
// Texte bereinigen

/** Entfernt interne Verweise, die in Notizen vorkommen können. */
function cleanInline(text) {
  return text
    .replace(/\s*\((?:siehe|vgl\.)\s[^)]*\)/gi, '') // "(siehe `offen.md`)"
    .replace(/\s*\(@\w+\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Sätze mit Arbeitsnotizen entfernen (global, für alle Produkte). */
const GLOBAL_DROP_SENTENCES = ['Arbeitstitel', 'offen.md', '@Jo', '@Till'];

function applyToText(text, rule = {}) {
  let t = text;
  for (const [from, to] of rule.textReplace ?? []) t = t.split(from).join(to);
  for (const [from, to] of rule.replace ?? []) t = t.split(from).join(to);
  const drop = [...GLOBAL_DROP_SENTENCES, ...(rule.dropSentences ?? [])];
  t = sentences(cleanInline(t)).filter((s) => !drop.some((d) => s.includes(d))).join(' ');
  return t.trim();
}

function applyToBlocks(blocks, rule = {}) {
  const dropBlocks = rule.dropBlocks ?? [];
  const dropItems = rule.dropItems ?? [];
  const out = [];
  for (const block of blocks) {
    const flat = block.type === 'p' ? block.text : block.items.join(' ');
    if (dropBlocks.some((d) => flat.includes(d))) continue;
    if (block.type === 'p') {
      const text = applyToText(block.text, { replace: rule.replace, dropSentences: rule.dropSentences });
      if (text) out.push({ type: 'p', text });
    } else {
      const items = block.items
        .filter((i) => !dropItems.some((d) => i.includes(d)))
        .map((i) => applyToText(i, { replace: rule.replace, dropSentences: rule.dropSentences }))
        .filter(Boolean);
      if (items.length) out.push({ type: 'ul', items });
    }
  }
  return out.length ? out : null;
}

// ---------------------------------------------------------------------------------------------
// Namen

function splitName(name) {
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(name);
  if (!m) return { name: name.trim(), kind: null };
  if (/arbeitstitel/i.test(m[2])) return { name: m[1].trim(), kind: null };
  return { name: m[1].trim(), kind: m[2].trim() };
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Produktname aus der README eines Produkt-Repos ("<sub><b>Lupe</b> · …" oder "# Lupe"). */
function readmeName(readme) {
  // Fußzeile der READMEs: <sub><b>Name</b> · Claim …</sub> – die letzte Fundstelle zählt
  const footers = [...readme.matchAll(/<sub><b>([^<]{2,40})<\/b>\s*·/g)];
  if (footers.length) return footers[footers.length - 1][1].trim();
  const heading = /^#\s+([^\n#]{2,40})$/m.exec(readme);
  if (heading) return heading[1].trim();
  const alt = /<img[^>]+alt="([^"–-]{2,40})\s+[–-]/.exec(readme);
  return alt ? alt[1].trim() : null;
}

/** Datum des letzten Commits eines Repos (JJJJ-MM-TT) oder null. */
function lastCommitDate(dir) {
  try {
    const d = execFileSync('git', ['-C', dir, 'log', '-1', '--format=%cs'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------------------------
// Repos und Bilder

const repoCandidates = reposDirs.flatMap((base) => (existsSync(base) ? readdirSync(base) : [])
  .filter((d) => { try { return statSync(join(base, d)).isDirectory(); } catch { return false; } })
  .map((d) => ({ name: d.toLowerCase(), dir: join(base, d) })));

function findRepoDir(repo) {
  if (!repo) return null;
  const name = repo.split('/').pop().toLowerCase();
  const hit = repoCandidates.find((c) => c.name === name && (existsSync(join(c.dir, 'README.md')) || existsSync(join(c.dir, 'docs'))));
  return hit ? hit.dir : null;
}

function sanitizeSvg(svg) {
  if (/<script|on\w+\s*=|href\s*=\s*["'](?!#)|<foreignObject/i.test(svg)) throw new Error('logo.svg enthält aktive Inhalte oder externe Verweise');
  // ohne XML-Kopf und Kommentare (die Datei wird so ausgeliefert)
  return svg.replace(/<\?xml[^>]*>\s*/, '').replace(/<!--[\s\S]*?-->\s*/g, '').trim() + '\n';
}

async function webpVariants(file, outDir, base, widths, quality = 82) {
  const meta = await sharp(file).metadata();
  const usable = widths.filter((w) => w <= meta.width);
  if (!usable.length || usable[usable.length - 1] < meta.width) usable.push(Math.min(meta.width, widths[widths.length - 1]));
  const unique = [...new Set(usable)].sort((a, b) => a - b);
  const entries = [];
  for (const w of unique) {
    const name = `${base}-${w}.webp`;
    await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality, effort: 5, smartSubsample: true }).toFile(join(outDir, name));
    entries.push({ w, url: `${MEDIA_URL}/${basename(outDir)}/${name}` });
  }
  const largest = entries[entries.length - 1];
  const height = Math.round((meta.height * largest.w) / meta.width);
  return {
    src: largest.url,
    srcset: entries.map((e) => `${e.url} ${e.w}w`).join(', '),
    width: largest.w,
    height,
  };
}

/** Eigenes App-Symbol (PNG) in die Geometrie der App-Icon-Vorlage bringen: Kachel 28/32 der Fläche, Rand 2/32,
 *  Eckenradius 7/32. Play-Store-Symbole sind randlos und eckig – so stehen eigene und erzeugte Symbole
 *  gleich groß nebeneinander. */
async function appIconTile(file, size = 256) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] <= 16) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) throw new Error(`${file}: Symbol ist leer`);
  const tile = Math.round((size * 28) / 32);
  const pad = Math.round((size - tile) / 2);
  const radius = Math.round((size * 7) / 32);
  const clear = { r: 0, g: 0, b: 0, alpha: 0 };
  const scaled = await sharp(file)
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .resize(tile, tile, { fit: 'contain', background: clear })
    .png()
    .toBuffer();
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}"><rect width="${tile}" height="${tile}" rx="${radius}" fill="#fff"/></svg>`);
  const clipped = await sharp(scaled).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  return sharp(clipped).extend({ top: pad, bottom: pad, left: pad, right: pad, background: clear });
}

/** Mittlere Farbe der deckenden Pixel eines waagrechten Streifens (Anteil der Höhe). */
async function bandColor(file, at) {
  const { data, info } = await sharp(file).resize(64, 64, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const y = Math.round(at * (info.height - 1));
  let r = 0, g = 0, b = 0, n = 0;
  for (let x = Math.round(info.width * 0.3); x < Math.round(info.width * 0.7); x++) {
    const i = (y * info.width + x) * 4;
    if (data[i + 3] < 250) continue;
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
  }
  if (!n) return null;
  return '#' + [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, '0')).join('');
}

/** Bildschirmfoto suchen: docs/assets/screenshots, docs/assets, docs/images (Android-Apps). */
function findShot(dir, name, variant) {
  const docs = join(dir, 'docs');
  const names = variant === 'light' ? [`${name}-light.png`, `${name}.png`] : [`${name}-dark.png`];
  for (const sub of [join(docs, 'assets', 'screenshots'), join(docs, 'assets'), join(docs, 'images')]) {
    for (const n of names) if (existsSync(join(sub, n))) return join(sub, n);
  }
  return null;
}

async function buildMedia(dir, slug, productName, cfg) {
  const docs = join(dir, 'docs');
  const assets = join(docs, 'assets');
  if (!existsSync(docs)) return null;
  const outDir = join(OUT_MEDIA, slug);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const media = { logo: null, colors: null, banner: null, demo: null, screenshots: [], galleryNote: cfg.galleryNote ?? null, galleryNoteEn: cfg.galleryNoteEn ?? null, source: [] };

  const logo = join(assets, 'logo.svg');
  // App-Symbol als PNG (Android-Apps): erst aus der Doku, sonst das Play-Store-Symbol der App
  const pngLogo = [join(docs, 'images', 'logo.png'), join(assets, 'logo.png'), join(dir, 'app', 'src', 'main', 'ic_launcher-playstore.png')].find(existsSync);
  if (existsSync(logo)) {
    writeFileSync(join(outDir, 'logo.svg'), sanitizeSvg(readFileSync(logo, 'utf8')));
    media.logo = `${MEDIA_URL}/${slug}/logo.svg`;
    // Markenfarben des Produkts: die ersten beiden Verlaufsfarben im Logo
    const stops = [...readFileSync(logo, "utf8").matchAll(/stop-color="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1].toLowerCase());
    if (stops.length >= 2) media.colors = [stops[0], stops[stops.length - 1]];
    media.source.push('logo.svg');
  } else if (pngLogo) {
    await (await appIconTile(pngLogo)).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(join(outDir, 'logo.webp'));
    media.logo = `${MEDIA_URL}/${slug}/logo.webp`;
    // Markenfarben: Fläche oben und unten im Symbol
    const top = await bandColor(pngLogo, 0.1);
    const bottom = await bandColor(pngLogo, 0.9);
    if (top && bottom) media.colors = [top, bottom];
    media.source.push(basename(pngLogo));
  }

  const banner = join(assets, 'banner.png');
  if (cfg.banner === true && existsSync(banner)) {
    media.banner = { ...(await webpVariants(banner, outDir, cfg.bannerFile ? slugify(cfg.bannerFile) : 'banner', BANNER_WIDTHS, 80)), alt: cfg.bannerAlt ?? `${productName}`, altEn: cfg.bannerAltEn ?? null };
    media.source.push('banner.png');
  }

  // Demo-Animation: aus dem Produkt-Repo (demo.file) oder aus diesem Repo (demo.local, z. B. scripts/media/…)
  const demoPath = cfg.demo?.local ? join(ROOT, cfg.demo.local) : cfg.demo?.file ? join(assets, cfg.demo.file) : null;
  if (demoPath && existsSync(demoPath)) {
    const gif = demoPath;
    const meta = await sharp(gif, { animated: true }).metadata();
    const height = meta.pageHeight ?? meta.height;
    await sharp(gif, { animated: true }).webp({ quality: 72, effort: 6 }).toFile(join(outDir, 'demo.webp'));
    await sharp(gif, { pages: 1 }).webp({ quality: 82 }).toFile(join(outDir, 'demo-still.webp'));
    media.demo = {
      src: `${MEDIA_URL}/${slug}/demo.webp`,
      still: `${MEDIA_URL}/${slug}/demo-still.webp`,
      width: meta.width,
      height,
      alt: cfg.demo.alt,
      caption: cfg.demo.caption ?? null,
    };
    media.source.push(cfg.demo.local ?? cfg.demo.file);
  }

  let shots = cfg.screenshots;
  if (!shots) {
    // Ohne Kuratierung: Paare *-light.png / *-dark.png (Android: screen-*.png) in Dateireihenfolge, höchstens sechs
    const found = [];
    for (const sub of [join(assets, 'screenshots'), assets]) {
      if (existsSync(sub)) found.push(...readdirSync(sub).filter((f) => /-light\.png$/.test(f) && !/^about-/.test(f)).map((f) => f.replace(/-light\.png$/, '')));
    }
    if (existsSync(join(docs, 'images'))) found.push(...readdirSync(join(docs, 'images')).filter((f) => /^screen-.*\.png$/.test(f)).map((f) => f.replace(/\.png$/, '')));
    shots = [...new Set(found)].slice(0, 6).map((name) => {
      const title = name.replace(/^screen-/, '').replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
      return { name, title, caption: null, alt: `Bildschirmfoto von ${productName}: ${title}` };
    });
  }
  for (const s of shots) {
    const lightFile = findShot(dir, s.name, 'light');
    if (!lightFile) {
      console.warn(`  ! ${slug}: Bildschirmfoto "${s.name}" nicht gefunden`);
      continue;
    }
    const darkFile = findShot(dir, s.name, 'dark');
    // Dateiname: sprechend, wenn kuratiert ("file", z. B. vitrine-transparente-bildschirmsperre), sonst der Name im Repo
    const base = s.file ? slugify(s.file) : s.name;
    const light = await webpVariants(lightFile, outDir, `${base}-light`, SHOT_WIDTHS);
    const dark = darkFile ? await webpVariants(darkFile, outDir, `${base}-dark`, SHOT_WIDTHS) : null;
    const en = s.en ? { title: s.en.title, caption: s.en.caption ?? null, alt: s.en.alt } : null;
    media.screenshots.push({ name: s.name, title: s.title, caption: s.caption ?? null, alt: s.alt, en, light, dark });
    media.source.push(`${relative(docs, lightFile).split('\\').join('/')}${dark ? ' (+ dark)' : ''}`);
  }
  return media;
}

// ---------------------------------------------------------------------------------------------
// Produkte zusammenstellen

// Produktlinien: aus public-overrides.json ("linien"), sonst aus projekte.json; nur Linien mit Produkten bleiben
const allLinien = (overrideFile.linien ?? source.linien).map(({ id, name, text }) => ({ id, name, text }));
const linieIds = new Set(allLinien.map((l) => l.id));
const products = [];
const report = [];
const seenSlugs = new Set();

for (const p of source.projekte.filter((x) => published.includes(x.id))) {
  const rule = overrides[p.id] ?? {};
  // Korrekturen aus public-overrides.json (Repo nur für die Suche nach README und Bildern, nie veröffentlicht)
  const repo = rule.repo ?? p.repo;
  const repoDir = findRepoDir(repo);
  const repoKey = repo ? repo.split('/').pop().toLowerCase() : null;
  const cfg = (repoKey && mediaConfig[repoKey]) || {};

  // Name: aus der README des Produkt-Repos, sonst aus dem Feld "name" ("Hausmeister (BACnet-Explorer)")
  const base = splitName(p.name);
  let name = base.name;
  let kind = base.kind;
  const fromReadme = repoDir && existsSync(join(repoDir, 'README.md')) ? readmeName(readFileSync(join(repoDir, 'README.md'), 'utf8')) : null;
  // Nur anders geschrieben ("IndustrialKeyboard" -> "Industrial Keyboard") ist keine eigene Art
  const squash = (s) => s.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '');
  if (fromReadme && fromReadme !== name) {
    if (squash(fromReadme) !== squash(name)) kind = kind ?? base.name;
    name = fromReadme;
  }
  if (rule.name) name = rule.name;
  if (cfg.kind) kind = cfg.kind;
  const slug = slugify(name);
  if (seenSlugs.has(slug)) throw new Error(`Doppelter Slug "${slug}" (${p.id})`);
  seenSlugs.add(slug);

  const statusId = rule.status ?? p.status;
  if (!STATUS[statusId]) throw new Error(`${p.id}: unbekannter Status "${statusId}"`);
  const status = STATUS[statusId];
  const version = rule.version ?? (p.version ? String(p.version) : null);
  const linie = rule.linie ?? p.linie;
  if (!linieIds.has(linie)) throw new Error(`${p.id}: unbekannte Linie "${linie}"`);

  // Notiz: nur Problem, Was es ersetzt (wenn freigegeben) und Umfang v1
  const notePath = join(projektePath, 'notizen', `${p.id}.md`);
  const sections = { problem: null, ersetzt: null, umfang: null };
  if (existsSync(notePath)) {
    const all = splitSections(readFileSync(notePath, 'utf8'));
    for (const [key, heading] of Object.entries(PUBLIC_SECTIONS)) {
      if (key === 'ersetzt' && rule.ersetzt !== true) continue;
      if (key === 'problem' && rule.problem === false) continue;
      if (key === 'umfang' && rule.umfang === false) continue;
      const lines = all.get(heading);
      if (lines) sections[key] = applyToBlocks(toBlocks(lines), rule);
    }
  }

  const text = applyToText(rule.text ?? p.text, rule);
  // Viele Notizen wiederholen im Abschnitt "Problem" nur den Kurztext – dann entfällt er
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9äöüß]+/g, ' ').trim();
  if (sections.problem?.length === 1 && sections.problem[0].type === 'p' && norm(text).startsWith(norm(sections.problem[0].text))) {
    sections.problem = null;
  }

  // Bilder: aus dem Repo, sonst (falls das Repo hier fehlt) vom letzten Lauf übernehmen
  let media = repoDir ? await buildMedia(repoDir, slug, name, cfg) : null;
  let mediaFrom = media ? 'repo' : null;
  if (!media && repo) {
    const prev = previousBySlug.get(slug)?.media;
    if (prev && existsSync(join(OUT_MEDIA, slug))) {
      media = prev;
      mediaFrom = 'vorheriger Lauf';
    }
  }
  const sourceList = media?.source ?? [];
  if (media) delete media.source;

  products.push({
    id: p.id,
    slug,
    nr: p.nr,
    name,
    kind,
    tagline: cfg.tagline ?? null,
    linie,
    status: statusId,
    statusKey: status.key,
    statusLabel: statusId === 'fast-fertig' && version ? `${status.label} ${version}` : status.label,
    version,
    // Stand: Datum des letzten Commits im Produkt-Repo (Sitemap lastmod, „Stand“ auf der Seite)
    updated: repoDir ? lastCommitDate(repoDir) : (previousBySlug.get(slug)?.updated ?? null),
    text,
    sections,
    highlights: cfg.highlights ?? [],
    facts: (cfg.facts ?? []).map(([label, value]) => ({ label, value })),
    media: media ?? { logo: null, colors: null, banner: null, demo: null, screenshots: [], galleryNote: null, galleryNoteEn: null },
  });
  report.push({
    id: p.id,
    slug,
    name,
    repo: repo ? (repoDir ? `gefunden (${basename(repoDir)})` : 'nicht lokal vorhanden') : '–',
    media: mediaFrom ? `${mediaFrom}: ${sourceList.join(', ') || 'keine Bilder'}` : 'keine (erzeugtes Motiv)',
  });
}

const linien = allLinien.filter((l) => products.some((p) => p.linie === l.id));
// Reihenfolge: Linie wie in der Liste, darin Reifegrad, dann Reihenfolge in "veroeffentlicht"
const linieOrder = new Map(linien.map((l, i) => [l.id, i]));
products.sort((a, b) =>
  linieOrder.get(a.linie) - linieOrder.get(b.linie) ||
  STATUS[a.status].rank - STATUS[b.status].rank ||
  published.indexOf(a.id) - published.indexOf(b.id));

const output = { stand: source.stand ?? null, linien, products };

const approved = new Set(Object.entries(overrides).filter(([, r]) => r.ersetzt === true).map(([id]) => id));
const leaks = [...findLeaks(output), ...findCompetitorMentions(output, approved)];
if (leaks.length) {
  console.error('Interne Inhalte gefunden – nichts geschrieben:\n  ' + leaks.join('\n  '));
  process.exit(1);
}

// Bilder von Produkten entfernen, die es nicht mehr gibt
if (existsSync(OUT_MEDIA)) {
  for (const d of readdirSync(OUT_MEDIA)) if (!seenSlugs.has(d)) rmSync(join(OUT_MEDIA, d), { recursive: true, force: true });
}
mkdirSync(dirname(OUT_JSON), { recursive: true });
writeFileSync(OUT_JSON, JSON.stringify(output, null, 2) + '\n');

// Farbpaare aller Produkte (Klasse pc--<slug>): erzeugte Symbole und eigene Logos
writeProductColors(products);

console.log(`${products.length} Produkte in ${linien.length} Linien → ${OUT_JSON}`);
console.table(report);
