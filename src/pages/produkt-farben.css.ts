// Markenfarben der Produkte mit eigenem Logo als Stylesheet (statt style-Attributen, wegen der CSP).
import type { APIRoute } from 'astro';
import { products } from '../lib/products';

export const GET: APIRoute = () => {
  const css = products
    .filter((p) => p.media.colors)
    .map((p) => `.pc--${p.slug}.pc--${p.slug}{--l1:${p.media.colors![0]};--l2:${p.media.colors![1]}}`)
    .join('\n');
  return new Response(`/* erzeugt aus src/data/products.json */\n${css}\n`, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
};
