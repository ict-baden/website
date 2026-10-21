#!/usr/bin/env node
// Legt zu jedem Produktbild (public/media/produkte/**/*.webp) und zum Video-Vorschaubild eine AVIF-Fassung an
// (gleicher Name, .avif). ThemeImage.astro bietet sie per <source type="image/avif"> an, wo sie vorhanden ist.
// Animierte Bilder (demo.webp) und Logos bleiben WebP. Wird von scripts/sync-products.mjs aufgerufen; nur fehlende oder
// ältere Dateien werden neu erzeugt.   node scripts/make-avif.mjs
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const DIRS = [join(ROOT, 'public', 'media', 'produkte')];
let made = 0;
async function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { await walk(p); continue; }
    if (!f.endsWith('.webp') || /^(demo|logo)/.test(f)) continue;
    const out = p.replace(/\.webp$/, '.avif');
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(p).mtimeMs) continue;
    await sharp(p).avif({ quality: 55, effort: 6 }).toFile(out);
    made++;
  }
}
for (const d of DIRS) if (existsSync(d)) await walk(d);
console.log(`AVIF: ${made} Datei(en) erzeugt`);
