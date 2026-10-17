// Produktsymbole: erzeugt im Stil der App-Icon-Vorlage (src/assets/product-icons/<id>.svg, siehe
// scripts/make-product-icons.mjs), sonst das eigene Symbol aus dem Repo (media.logo).
import type { Product } from './products';

const files = import.meta.glob('../assets/product-icons/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const generated = new Map(Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -4), url]));

/** URL des Produktsymbols oder null (dann zeichnet ProductIcon ein Ersatzsymbol). */
export function productIconUrl(p: Pick<Product, 'id' | 'media'>): string | null {
  return generated.get(p.id) ?? p.media.logo ?? null;
}

/** true, wenn das Symbol aus dem Repo stammt (eigenes App-Icon), false bei erzeugten Symbolen. */
export const hasOwnIcon = (p: Pick<Product, 'id' | 'media'>) => !generated.has(p.id) && Boolean(p.media.logo);
