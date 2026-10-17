#!/usr/bin/env node
// Bildschirmfotos aller Seiten in 390 px und 1440 px, hell und dunkel (für die Sichtprüfung).
//   node scripts/screenshots.mjs [--out .screenshots] [--only /produkte/,/] [--widths 390,1440] [--themes light,dark] [--viewport]
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { serve } from './lib/static-server.mjs';
import { launch } from './lib/browser.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const dist = resolve('dist');
const out = resolve(opt('out', '.screenshots'));
const widths = opt('widths', '390,1440').split(',').map(Number);
const themes = opt('themes', 'light,dark').split(',');
const viewportOnly = args.includes('--viewport');

function pagesFromSitemap() {
  const file = join(dist, 'sitemap.xml');
  if (!existsSync(file)) return ['/'];
  return [...readFileSync(file, 'utf8').matchAll(/<loc>[^<]*?(\/[^<]*)<\/loc>/g)].map((m) => new URL(m[1], 'http://x').pathname);
}
const pages = opt('only') ? opt('only').split(',') : pagesFromSitemap();

mkdirSync(out, { recursive: true });
const { server, url } = await serve(dist);
const browser = await launch();
try {
  for (const theme of themes) {
    for (const w of widths) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: w < 600 ? 844 : 900 },
        deviceScaleFactor: 1,
        colorScheme: theme,
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();
      for (const p of pages) {
        await page.goto(url + p, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        // Lazy-Bilder laden: einmal durch die Seite scrollen
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
          window.scrollTo(0, 0);
        });
        await page.waitForLoadState('networkidle');
        const name = (p.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'start') + `-${w}-${theme}.png`;
        await page.screenshot({ path: join(out, name), fullPage: !viewportOnly });
        console.log(name);
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}
