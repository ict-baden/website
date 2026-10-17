// Zugriff auf die erzeugten Produktdaten (src/data/products.json, siehe scripts/sync-products.mjs).
import data from '../data/products.json';
import type { IconName } from './icons';

export type Block = { type: 'p'; text: string } | { type: 'ul'; items: string[] };
export interface ImageSet { src: string; srcset: string; width: number; height: number }
export interface Shot { name: string; title: string; caption: string | null; alt: string; light: ImageSet; dark: ImageSet | null }
export interface Media {
  logo: string | null;
  colors: [string, string] | null;
  banner: (ImageSet & { alt: string }) | null;
  demo: { src: string; still: string; width: number; height: number; alt: string; caption: string | null } | null;
  screenshots: Shot[];
  galleryNote: string | null;
}
export type StatusKey = 'verfuegbar' | 'vorabversion' | 'in-entwicklung' | 'geplant';
export interface Product {
  id: string;
  slug: string;
  nr: number;
  name: string;
  kind: string | null;
  tagline: string | null;
  linie: string;
  status: string;
  statusKey: StatusKey;
  statusLabel: string;
  version: string | null;
  text: string;
  sections: { problem: Block[] | null; ersetzt: Block[] | null; umfang: Block[] | null };
  highlights: string[];
  facts: { label: string; value: string }[];
  media: Media;
}
export interface Linie { id: string; name: string; text: string }

export const linien: Linie[] = data.linien;
export const products: Product[] = data.products as Product[];
export const stand: string | null = data.stand;

/** Symbol und Kurzbeschreibung je Produktlinie (Symbol für erzeugte Motive). */
export const LINE_ICON: Record<string, IconName> = {
  android: 'scanner',
  labor: 'flask',
  ot: 'shield',
  explorer: 'radar',
  service: 'wrench',
  server: 'server',
  neu: 'sparkle',
};

export const STATUS_ORDER: StatusKey[] = ['verfuegbar', 'vorabversion', 'in-entwicklung', 'geplant'];
export const STATUS_LABEL: Record<StatusKey, string> = {
  verfuegbar: 'Verfügbar',
  vorabversion: 'Vorabversion',
  'in-entwicklung': 'In Entwicklung',
  geplant: 'Geplant',
};
/** Erklärung der Status-Bezeichnungen (Legende, keine Produktaussage). */
export const STATUS_HELP: Record<StatusKey, string> = {
  verfuegbar: 'fertig entwickelt',
  vorabversion: 'funktionsfähige Version vor dem Release 1.0',
  'in-entwicklung': 'wird zurzeit gebaut',
  geplant: 'Konzept, Entwicklung noch nicht begonnen',
};

export const lineById = (id: string): Linie => {
  const l = linien.find((x) => x.id === id);
  if (!l) throw new Error(`Unbekannte Produktlinie ${id}`);
  return l;
};
export const productsOfLine = (id: string) => products.filter((p) => p.linie === id);
/** Klassen für die Farbgebung: Produktlinie, bei eigenem Logo die Markenfarben des Produkts. */
export const colorClasses = (p: Product) => [`art--${p.linie}`, p.media.colors ? `pc--${p.slug}` : null];
export const productUrl = (p: Product) => `/produkte/${p.slug}/`;
export const lineAnchor = (id: string) => `/produkte/#linie-${id}`;

/** Produkte mit eigenen Bildern zuerst – für die Startseite. */
export const featured = products
  .filter((p) => p.media.screenshots.length > 0 && (p.statusKey === 'verfuegbar' || p.statusKey === 'vorabversion'))
  .sort((a, b) => b.media.screenshots.length - a.media.screenshots.length || a.nr - b.nr);

export function statusCounts(list: Product[]) {
  const c: Record<StatusKey, number> = { verfuegbar: 0, vorabversion: 0, 'in-entwicklung': 0, geplant: 0 };
  for (const p of list) c[p.statusKey]++;
  return c;
}

/** "1 Produkt" / "38 Produkte" */
export const plural = (n: number, one: string, many: string) => `${n.toLocaleString('de-DE')} ${n === 1 ? one : many}`;
