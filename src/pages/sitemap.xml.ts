// Sitemap aller Seiten (statisch erzeugt).
import type { APIRoute } from 'astro';
import { SITE_URL } from '../config';
import { products, stand } from '../lib/products';

const STATIC = ['/', '/leistungen/', '/produkte/', '/downloads/', '/werkzeuge/pulswertigkeit/', '/ueber-uns/', '/kontakt/', '/impressum/', '/datenschutz/', '/datenschutz/enterprisebrowser/', '/datenschutz/industrialkeyboard/'];

export const GET: APIRoute = () => {
  const urls = [...STATIC, ...products.map((p) => `/produkte/${p.slug}/`)];
  const lastmod = stand ? `<lastmod>${stand}</lastmod>` : '';
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc>${u.startsWith('/produkte/') && u !== '/produkte/' ? lastmod : ''}</url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
