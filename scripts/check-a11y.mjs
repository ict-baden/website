#!/usr/bin/env node
// Barrierefreiheit mit axe-core: jede Seite der Sitemap plus 404, hell und dunkel, 1440 px und 390 px.
// Verstöße mit Auswirkung "serious" oder "critical" lassen die Prüfung scheitern.
// Dazu: kein seitliches Scrollen und kein abgeschnittener Inhalt bei 320, 375, 390 und 414 px (axe prüft das nicht) –
// weder die Seite selbst noch ein Element ragt über den Rand (außer in Bereichen, die selbst scrollen, z. B. Tabellen).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { serve } from './lib/static-server.mjs';
import { launch } from './lib/browser.mjs';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const dist = resolve(process.argv[2] || 'dist');
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const pages = [...sitemap.matchAll(/<loc>[^<]*?(\/[^<]*)<\/loc>/g)].map((m) => new URL(m[1], 'http://x').pathname);
pages.push('/404.html');

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/** Seitliches Überlaufen: Breite der Seite und sichtbare Elemente, die rechts über den Rand ragen. */
const overflowProbe = () => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  const doc = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (doc > vw + 1) out.push(`Seite ${doc} px breit`);
  // Elemente, die über den Rand ragen und nicht in einem eigenen Scrollbereich oder bewusst versteckt sind
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if ((o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') && p.getBoundingClientRect().right <= vw + 1) return true;
    }
    return false;
  };
  for (const el of document.querySelectorAll('main *, header *, footer *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.right <= vw + 1) continue;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.visibility === 'hidden' || el.closest('[aria-hidden="true"], .visually-hidden, [hidden], details:not([open])')) continue;
    if (clipped(el)) continue;
    out.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} reicht bis ${Math.round(r.right)} px`);
    if (out.length >= 4) break;
  }
  // Text, der in einem Element mit overflow: hidden/clip abgeschnitten wird (z. B. Karten, Status-Abzeichen)
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n && out.length < 8; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!n.textContent.trim() || !el || el.closest('[aria-hidden="true"], .visually-hidden, .skip-link, [hidden], script, style, details:not([open]) > :not(summary)')) continue;
    range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    if (!r.width) continue;
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.textOverflow === 'ellipsis') break;
      if (cs.overflowX === 'hidden' || cs.overflowX === 'clip') {
        if (r.right > p.getBoundingClientRect().right + 1) out.push(`Text „${n.textContent.trim().slice(0, 30)}“ abgeschnitten in ${p.tagName.toLowerCase()}.${String(p.className).trim().split(/\s+/)[0]}`);
        break;
      }
    }
  }
  return out;
};
const { server, url } = await serve(dist);
const browser = await launch();
const failures = [];
const minor = new Map();
let runs = 0;
try {
  for (const [theme, width] of [['light', 1440], ['dark', 1440], ['light', 390], ['dark', 390]]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const p of pages) {
      await page.goto(url + p, { waitUntil: 'load' });
      await page.evaluate(axeSource);
      const result = await page.evaluate((tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), TAGS);
      runs++;
      for (const v of result.violations) {
        if (v.impact !== 'serious' && v.impact !== 'critical') {
          minor.set(v.id, (minor.get(v.id) ?? 0) + v.nodes.length);
          continue;
        }
        const nodes = v.nodes.slice(0, 4).map((n) => n.target.join(' ')).join('\n      ');
        failures.push(`${p} [${theme}, ${width}px] ${v.id} (${v.impact}): ${v.help}\n      ${nodes}`);
      }
    }
    await ctx.close();
  }
  // Seitliches Überlaufen auf Telefonbreiten (ohne axe; Bewegung aus, damit nichts mitten in einer Animation steht)
  for (const width of [320, 375, 390, 414]) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const p of pages) {
      await page.goto(url + p, { waitUntil: 'load' });
      const found = await page.evaluate(overflowProbe);
      runs++;
      if (found.length) failures.push(`${p} [${width}px] seitlicher Überlauf: ${found.join('; ')}`);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (minor.size) console.log('Hinweise (moderate/minor): ' + [...minor].map(([id, n]) => `${id} ×${n}`).join(', '));
if (failures.length) {
  console.error(`Barrierefreiheit: ${failures.length} Problem(e)\n  ` + failures.join('\n  '));
  process.exit(1);
}
console.log(`Barrierefreiheit in Ordnung: ${runs} Prüfläufe (${pages.length} Seiten × hell/dunkel × 1440/390 px mit axe, × 320/375/390/414 px ohne seitlichen Überlauf), keine schweren Verstöße.`);
