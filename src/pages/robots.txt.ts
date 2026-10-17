// robots.txt: in der Vorschau (SITE_STAGING=1) alles sperren, sonst alles erlauben und auf die Sitemap verweisen.
import type { APIRoute } from 'astro';
import { SITE_URL, STAGING } from '../config';

export const GET: APIRoute = () => {
  const body = STAGING
    ? '# Vorschau – nicht indexieren\nUser-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
