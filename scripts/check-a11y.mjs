#!/usr/bin/env node
// Barrierefreiheit mit axe-core: jede Seite der Sitemap plus 404, hell und dunkel, 1440 px und 390 px.
// Verstöße mit Auswirkung "serious" oder "critical" lassen die Prüfung scheitern.
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
} finally {
  await browser.close();
  server.close();
}

if (minor.size) console.log('Hinweise (moderate/minor): ' + [...minor].map(([id, n]) => `${id} ×${n}`).join(', '));
if (failures.length) {
  console.error(`Barrierefreiheit: ${failures.length} Problem(e)\n  ` + failures.join('\n  '));
  process.exit(1);
}
console.log(`Barrierefreiheit in Ordnung: ${runs} Prüfläufe (${pages.length} Seiten × hell/dunkel × 1440/390 px), keine schweren Verstöße.`);
