#!/usr/bin/env node
// Erzeugt Favicons, App-Symbole und Open-Graph-Bilder aus der Marke (src/assets/brand/marke.json, Quelle:
// ict-baden/richtlinien, marke/). Ergebnis wird eingecheckt; nur nach Änderungen an der Marke, den
// Produktdaten oder der OG-Vorlage neu ausführen:  npm run brand
//
//  - public/favicon.svg, public/favicon.ico (16/32/48) – Kurzzeichen
//  - public/apple-touch-icon.png (180, volle Fläche), public/brand/icon-32/180/192/512.png, icon-maskable-512.png
//  - public/brand/ict-baden-logo.svg, ict-baden-zeichen.svg – Logo und Kurzzeichen mit Umrissen zum Weitergeben
//  - public/og/ict-baden.png und public/og/produkte/<slug>.jpg (Vorlage: src/components/OgCard.astro)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { serve } from './lib/static-server.mjs';
import { launch } from './lib/browser.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const marke = JSON.parse(readFileSync(join(ROOT, 'src/assets/brand/marke.json'), 'utf8'));
const pub = (...p) => join(ROOT, 'public', ...p);
mkdirSync(pub('brand'), { recursive: true });
mkdirSync(pub('og', 'produkte'), { recursive: true });

const { gelb, schwarz, rot } = marke.colors;
const z = marke.zeichen;
const l = marke.logo;
const [fx, fy, fw, fh, fr] = z.field;

// Kurzzeichen wie in der Vorlage: Feld mit runden Ecken, Balken nur über die rechte obere Ecke
const zeichenBody = (clipId) =>
  `<defs><clipPath id="${clipId}"><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="${fr}"/></clipPath></defs>` +
  `<g clip-path="url(#${clipId})"><rect width="${z.size}" height="${z.size}" fill="${gelb}"/><path d="${z.bar}" fill="${rot}"/></g>` +
  `<path d="${z.ict}" fill="${schwarz}"/>`;
const zeichenSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${z.size} ${z.size}"><title>ICT Baden</title>${zeichenBody('feld')}</svg>\n`;
writeFileSync(pub('favicon.svg'), zeichenSvg);
writeFileSync(pub('brand', 'ict-baden-zeichen.svg'), zeichenSvg.replace('<svg ', '<svg width="256" height="256" '));

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${l.width}" height="${l.height}" viewBox="0 0 ${l.width} ${l.height}"><title>ICT Baden</title>` +
  `<defs><clipPath id="feld"><rect width="${l.width}" height="${l.height}" rx="${l.radius}"/></clipPath></defs>` +
  `<g clip-path="url(#feld)"><rect width="${l.width}" height="${l.height}" fill="${gelb}"/><path d="${l.bar}" fill="${rot}"/></g>` +
  `<path d="${l.ict}" fill="${schwarz}"/><path d="${l.baden}" fill="${schwarz}"/></svg>\n`;
writeFileSync(pub('brand', 'ict-baden-logo.svg'), logoSvg);
for (const old of ['ict-baden-wordmark.svg', 'ict-baden-wordmark-dark.svg']) rmSync(pub('brand', old), { force: true });

// PNG-Symbole aus dem Kurzzeichen. full: gelbe Fläche bis an den Rand (Apple, maskierbar) – das System
// rundet die Ecken selbst; scale: Anteil des Zeichens an der Fläche (Sicherheitszone bei maskable)
const png = async (size, { full = false, scale = 1 } = {}) => {
  const inner = Math.round(size * scale);
  const svg = Buffer.from(zeichenSvg.replace('<svg ', `<svg width="${inner}" height="${inner}" `));
  const base = sharp({ create: { width: size, height: size, channels: 4, background: full ? gelb : { r: 0, g: 0, b: 0, alpha: 0 } } });
  const layers = [];
  if (full && scale === 1) {
    // volle Fläche: Feld ohne runde Ecken, der Balken läuft bis in die Ecke
    const square = zeichenSvg.replace(`rx="${fr}"`, 'rx="0"').replace(`x="${fx}" y="${fy}" width="${fw}" height="${fh}"`, `x="0" y="0" width="${z.size}" height="${z.size}"`);
    layers.push({ input: Buffer.from(square.replace('<svg ', `<svg width="${size}" height="${size}" `)), left: 0, top: 0 });
  } else {
    layers.push({ input: svg, left: Math.round((size - inner) / 2), top: Math.round((size - inner) / 2) });
  }
  return base.composite(layers).png({ compressionLevel: 9 }).toBuffer();
};
for (const s of [32, 180, 192, 512]) writeFileSync(pub('brand', `icon-${s}.png`), await png(s));
writeFileSync(pub('brand', 'icon-maskable-512.png'), await png(512, { full: true, scale: 0.72 }));
writeFileSync(pub('apple-touch-icon.png'), await png(180, { full: true }));

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
console.log('Favicons, App-Symbole und Logo-Dateien geschrieben');

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
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
  const { server, url } = await serve(outDir);
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    for (const slug of ['ict-baden', ...products.map((p) => p.slug)].filter((s) => !only || only.includes(s))) {
      await page.goto(`${url}/og-vorlage/${slug}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Produktname: Schrift verkleinern, bis kein Teil über die Textspalte ragt und er höchstens zwei Zeilen hat
      const fit = await page.evaluate(() => {
        const h = document.querySelector('.og--product h1');
        if (!h) return null;
        let size = parseFloat(getComputedStyle(h).fontSize);
        const lines = () => Math.round(h.getBoundingClientRect().height / (size * 0.98));
        const bad = () => h.scrollWidth > h.clientWidth + 1 || lines() > 2;
        while (bad() && size > 40) {
          size -= 2;
          h.style.fontSize = size + 'px';
        }
        return { size, ok: !bad() };
      });
      if (fit && !fit.ok) throw new Error(`${slug}: Produktname passt auch in ${fit.size} px nicht ins Open-Graph-Bild`);
      const shot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
      if (slug === 'ict-baden') writeFileSync(pub('og', 'ict-baden.png'), await sharp(shot).png({ compressionLevel: 9, palette: false }).toBuffer());
      else writeFileSync(pub('og', 'produkte', `${slug}.jpg`), await sharp(shot).jpeg({ quality: 84, mozjpeg: true }).toBuffer());
    }
  } finally {
    await browser.close();
    server.close();
    rmSync(outDir, { recursive: true, force: true });
  }
  // OG-Bilder von Produkten entfernen, die es nicht mehr gibt (z. B. nach einer Umbenennung)
  const keep = new Set(products.map((p) => `${p.slug}.jpg`));
  for (const f of (await import('node:fs')).readdirSync(pub('og', 'produkte'))) if (!keep.has(f)) rmSync(pub('og', 'produkte', f));
  console.log(`Open-Graph-Bilder geschrieben (${only ? only.length : products.length + 1})`);
}
