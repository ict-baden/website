// Sitemap aller Seiten (statisch erzeugt) mit Sprachfassungen (hreflang) und lastmod.
// Produktseiten: lastmod = letzte Änderung am Inhalt der Seite (pageModified: Seitentext, Bilder, OG-Bild; ohne
// Git-Verlauf der letzte Commit im Produkt-Repo). App-Datenschutzseiten
// (/datenschutz/<app>/) kommen aus src/data/app-datenschutz.ts (src/lib/app-privacy.ts).
import type { APIRoute } from 'astro';
import { SITE_URL } from '../config';
import { products } from '../lib/products';
import { pageModified, productsUrlFor, productUrlFor } from '../lib/produktseiten';
import { appPrivacyPages } from '../lib/app-privacy';
import { guideSitemapEntries } from '../lib/ratgeber';

const STATIC = ['/werkzeuge/pulswertigkeit/', '/impressum/', '/datenschutz/'];

type Entry = { loc: string; lastmod?: string | null; alternates?: { lang: string; href: string }[] };

const latest = products.map((p) => pageModified(p)).filter(Boolean).sort().at(-1) ?? null;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: APIRoute = async () => {
  const pair = (de: string, en: string) => [
    { lang: 'de', href: de },
    { lang: 'en', href: en },
    { lang: 'x-default', href: de },
  ];
  const entries: Entry[] = [
    ...STATIC.map((loc) => ({ loc })),
    { loc: '/', lastmod: latest, alternates: pair('/', '/en/') },
    { loc: '/en/', lastmod: latest, alternates: pair('/', '/en/') },
    // Produktübersicht (src/components/product/ProductOverview.astro): Stand wie die neueste Produktseite
    { loc: productsUrlFor('de'), lastmod: latest, alternates: pair(productsUrlFor('de'), productsUrlFor('en')) },
    { loc: productsUrlFor('en'), lastmod: latest, alternates: pair(productsUrlFor('de'), productsUrlFor('en')) },
    ...products.flatMap((p) => {
      const alts = pair(productUrlFor(p, 'de'), productUrlFor(p, 'en'));
      return [
        { loc: productUrlFor(p, 'de'), lastmod: pageModified(p), alternates: alts },
        { loc: productUrlFor(p, 'en'), lastmod: pageModified(p), alternates: alts },
      ];
    }),
    ...(await appPrivacyPages()).map((app) => ({ loc: `/datenschutz/${app}/` })),
    // Ratgeber und ihre Übersicht (src/lib/ratgeber.ts): lastmod = letzte Änderung am Ratgeber
    ...guideSitemapEntries(),
  ];
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entries
      .map((e) =>
        '  <url>\n' +
        `    <loc>${esc(SITE_URL + e.loc)}</loc>\n` +
        (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : '') +
        (e.alternates ?? []).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${esc(SITE_URL + a.href)}"/>\n`).join('') +
        '  </url>',
      )
      .join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
