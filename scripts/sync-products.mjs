#!/usr/bin/env node
// Erzeugt src/data/products.json und die Produktbilder unter public/media/produkte/ aus dem (privaten)
// Projekt-Repo ict-baden-projekte und – soweit vorhanden – aus den Produkt-Repos.
//
//   node scripts/sync-products.mjs <pfad-zu-ict-baden-projekte> [<ordner-mit-produkt-repos>]
//
// Ohne zweiten Parameter werden die Produkt-Repos neben ict-baden-projekte gesucht (z. B. ../lupe).
// Übernommen werden nur öffentliche Felder (siehe scripts/lib/public-guard.mjs). Das Ergebnis wird
// eingecheckt, damit der Build ohne Zugriff auf die privaten Repos funktioniert.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { findLeaks } from './lib/public-guard.mjs';
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

const [projektePathArg, reposDirArg] = process.argv.slice(2);
if (!projektePathArg) {
  console.error('Aufruf: node scripts/sync-products.mjs <pfad-zu-ict-baden-projekte> [<ordner-mit-produkt-repos>]');
  process.exit(2);
}
const projektePath = resolve(projektePathArg);
const reposDir = resolve(reposDirArg ?? dirname(projektePath));
const projekteFile = join(projektePath, 'projekte.json');
if (!existsSync(projekteFile)) {
  console.error(`projekte.json nicht gefunden: ${projekteFile}`);
  process.exit(2);
}

const source = JSON.parse(readFileSync(projekteFile, 'utf8'));
const overrides = JSON.parse(readFileSync(join(ROOT, 'scripts', 'public-overrides.json'), 'utf8')).products ?? {};
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

// ---------------------------------------------------------------------------------------------
// Repos und Bilder

const repoDirs = existsSync(reposDir) ? readdirSync(reposDir).filter((d) => {
  try { return statSync(join(reposDir, d)).isDirectory(); } catch { return false; }
}) : [];

function findRepoDir(repo) {
  if (!repo) return null;
  const name = repo.split('/').pop();
  const hit = repoDirs.find((d) => d.toLowerCase() === name.toLowerCase());
  if (!hit) return null;
  const dir = join(reposDir, hit);
  return existsSync(join(dir, 'README.md')) || existsSync(join(dir, 'docs', 'assets')) ? dir : null;
}

function sanitizeSvg(svg) {
  if (/<script|on\w+\s*=|href\s*=\s*["'](?!#)|<foreignObject/i.test(svg)) throw new Error('logo.svg enthält aktive Inhalte oder externe Verweise');
  return svg.replace(/<\?xml[^>]*>\s*/, '').trim() + '\n';
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

async function buildMedia(dir, slug, productName, cfg) {
  const assets = join(dir, 'docs', 'assets');
  if (!existsSync(assets)) return null;
  const outDir = join(OUT_MEDIA, slug);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const media = { logo: null, banner: null, demo: null, screenshots: [], galleryNote: cfg.galleryNote ?? null, source: [] };

  const logo = join(assets, 'logo.svg');
  if (existsSync(logo)) {
    writeFileSync(join(outDir, 'logo.svg'), sanitizeSvg(readFileSync(logo, 'utf8')));
    media.logo = `${MEDIA_URL}/${slug}/logo.svg`;
    media.source.push('logo.svg');
  }

  const banner = join(assets, 'banner.png');
  if (cfg.banner === true && existsSync(banner)) {
    media.banner = { ...(await webpVariants(banner, outDir, 'banner', BANNER_WIDTHS, 80)), alt: cfg.bannerAlt ?? `${productName}` };
    media.source.push('banner.png');
  }

  if (cfg.demo?.file && existsSync(join(assets, cfg.demo.file))) {
    const gif = join(assets, cfg.demo.file);
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
    media.source.push(cfg.demo.file);
  }

  const shotsDir = join(assets, 'screenshots');
  let shots = cfg.screenshots;
  if (!shots && existsSync(shotsDir)) {
    // Ohne Kuratierung: Paare *-light.png / *-dark.png in Dateireihenfolge, höchstens sechs
    shots = readdirSync(shotsDir)
      .filter((f) => /-light\.png$/.test(f) && !/^about-/.test(f))
      .slice(0, 6)
      .map((f) => {
        const name = f.replace(/-light\.png$/, '');
        const title = name.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
        return { name, title, caption: null, alt: `Bildschirmfoto von ${productName}: ${title}` };
      });
  }
  for (const s of shots ?? []) {
    const lightFile = [join(shotsDir, `${s.name}-light.png`), join(shotsDir, `${s.name}.png`)].find(existsSync);
    if (!lightFile) {
      console.warn(`  ! ${slug}: Bildschirmfoto "${s.name}" nicht gefunden`);
      continue;
    }
    const darkFile = join(shotsDir, `${s.name}-dark.png`);
    const light = await webpVariants(lightFile, outDir, `${s.name}-light`, SHOT_WIDTHS);
    const dark = existsSync(darkFile) ? await webpVariants(darkFile, outDir, `${s.name}-dark`, SHOT_WIDTHS) : null;
    media.screenshots.push({ name: s.name, title: s.title, caption: s.caption ?? null, alt: s.alt, light, dark });
    media.source.push(`screenshots/${basename(lightFile)}${dark ? ' (+ dark)' : ''}`);
  }
  return media;
}

// ---------------------------------------------------------------------------------------------
// Produkte zusammenstellen

const linien = source.linien.map(({ id, name, text }) => ({ id, name, text }));
const linieIds = new Set(linien.map((l) => l.id));
const products = [];
const report = [];
const seenSlugs = new Set();

for (const p of source.projekte) {
  if (!STATUS[p.status]) throw new Error(`${p.id}: unbekannter Status "${p.status}"`);
  if (!linieIds.has(p.linie)) throw new Error(`${p.id}: unbekannte Linie "${p.linie}"`);
  const rule = overrides[p.id] ?? {};
  const repoDir = findRepoDir(p.repo);
  const repoKey = p.repo ? p.repo.split('/').pop().toLowerCase() : null;
  const cfg = (repoKey && mediaConfig[repoKey]) || {};

  // Name: aus der README des Produkt-Repos, sonst aus dem Feld "name" ("Hausmeister (BACnet-Explorer)")
  const base = splitName(p.name);
  let name = base.name;
  let kind = base.kind;
  const fromReadme = repoDir && existsSync(join(repoDir, 'README.md')) ? readmeName(readFileSync(join(repoDir, 'README.md'), 'utf8')) : null;
  if (fromReadme && fromReadme !== name) {
    kind = kind ?? base.name;
    name = fromReadme;
  }
  const slug = slugify(name);
  if (seenSlugs.has(slug)) throw new Error(`Doppelter Slug "${slug}" (${p.id})`);
  seenSlugs.add(slug);

  const status = STATUS[p.status];
  const version = p.version ? String(p.version) : null;

  // Notiz: nur Problem, Was es ersetzt (wenn freigegeben) und Umfang v1
  const notePath = join(projektePath, 'notizen', `${p.id}.md`);
  const sections = { problem: null, ersetzt: null, umfang: null };
  if (existsSync(notePath)) {
    const all = splitSections(readFileSync(notePath, 'utf8'));
    for (const [key, heading] of Object.entries(PUBLIC_SECTIONS)) {
      if (key === 'ersetzt' && rule.ersetzt !== true) continue;
      if (key === 'problem' && rule.problem === false) continue;
      const lines = all.get(heading);
      if (lines) sections[key] = applyToBlocks(toBlocks(lines), rule);
    }
  }

  const text = applyToText(p.text, rule);
  // Viele Notizen wiederholen im Abschnitt "Problem" nur den Kurztext – dann entfällt er
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9äöüß]+/g, ' ').trim();
  if (sections.problem?.length === 1 && sections.problem[0].type === 'p' && norm(text).startsWith(norm(sections.problem[0].text))) {
    sections.problem = null;
  }

  // Bilder: aus dem Repo, sonst (falls das Repo hier fehlt) vom letzten Lauf übernehmen
  let media = repoDir ? await buildMedia(repoDir, slug, name, cfg) : null;
  let mediaFrom = media ? 'repo' : null;
  if (!media && p.repo) {
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
    linie: p.linie,
    status: p.status,
    statusKey: status.key,
    statusLabel: p.status === 'fast-fertig' && version ? `${status.label} ${version}` : status.label,
    version,
    text,
    sections,
    highlights: cfg.highlights ?? [],
    facts: (cfg.facts ?? []).map(([label, value]) => ({ label, value })),
    media: media ?? { logo: null, banner: null, demo: null, screenshots: [], galleryNote: null },
  });
  report.push({
    id: p.id,
    slug,
    name,
    repo: p.repo ? (repoDir ? `gefunden (${basename(repoDir)})` : 'nicht lokal vorhanden') : '–',
    media: mediaFrom ? `${mediaFrom}: ${sourceList.join(', ') || 'keine Bilder'}` : 'keine (erzeugtes Motiv)',
  });
}

// Reihenfolge: Linie wie in projekte.json, darin Reifegrad, dann Nummer
const linieOrder = new Map(linien.map((l, i) => [l.id, i]));
products.sort((a, b) =>
  linieOrder.get(a.linie) - linieOrder.get(b.linie) ||
  STATUS[a.status].rank - STATUS[b.status].rank ||
  a.nr - b.nr);

const output = { stand: source.stand ?? null, linien, products };

const leaks = findLeaks(output);
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

console.log(`${products.length} Produkte in ${linien.length} Linien → ${OUT_JSON}`);
console.table(report);
