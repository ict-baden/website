// Schreibt src/styles/product-colors.css: das Farbpaar jedes Produkts als --l1/--l2 (Klasse pc--<slug>).
// Quelle: erzeugtes Produktsymbol (scripts/product-icons.mjs), sonst die Farben des eigenen Logos aus dem Repo.
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ICON_SPECS } from '../product-icons.mjs';

const ROOT = resolve(import.meta.dirname, '..', '..');
const OUT = join(ROOT, 'src', 'styles', 'product-colors.css');

/** Farbpaar eines Produkts [oben, unten] oder null. */
export function productColors(p) {
  return ICON_SPECS[p.id]?.colors ?? p.media?.colors ?? null;
}

export function writeProductColors(products) {
  const lines = products
    .map((p) => [p, productColors(p)])
    .filter(([, c]) => c)
    .map(([p, [a, b]]) => `.pc--${p.slug}.pc--${p.slug} { --l1: ${a}; --l2: ${b}; }`);
  writeFileSync(OUT, `/* Erzeugt von scripts/make-product-icons.mjs und scripts/sync-products.mjs – nicht von Hand ändern */\n${lines.join('\n')}\n`);
  return lines.length;
}
