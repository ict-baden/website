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

// Geplante Produkte (nur Konzept) zeigt die Webseite nicht – weder in Listen noch als eigene Seite; Produktlinien
// ohne gezeigtes Produkt fallen ebenfalls weg (Entscheidung 2026-10-20)
export const products: Product[] = (data.products as Product[]).filter((p) => p.statusKey !== 'geplant');
export const linien: Linie[] = data.linien.filter((l) => products.some((p) => p.linie === l.id));
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

export const STATUS_ORDER: StatusKey[] = ['verfuegbar', 'vorabversion', 'in-entwicklung'];
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
/** Klassen für die Farbgebung: Motiv der Produktlinie und Farbpaar des Produkts (src/styles/product-colors.css). */
export const colorClasses = (p: Product) => [`art--${p.linie}`, `pc--${p.slug}`];
export const productUrl = (p: Product) => `/produkte/${p.slug}/`;
/** Hochformat (Telefon-Bildschirmfotos der Android-Apps). */
export const isPortrait = (s: Shot) => s.light.height > s.light.width;
export const lineAnchor = (id: string) => `/produkte/#linie-${id}`;

/** Auswahl für die großen Karten auf der Startseite (verfügbar oder Vorabversion, mit Bildschirmfotos). */
const FEATURED = ['vitrine', 'lupe', 'zutritt', 'hausmeister', 'merker'];
export const featured = FEATURED
  .map((slug) => products.find((p) => p.slug === slug))
  .filter((p): p is Product => Boolean(p && p.media.screenshots.length > 0 && (p.statusKey === 'verfuegbar' || p.statusKey === 'vorabversion')));

export function statusCounts(list: Product[]) {
  const c: Record<StatusKey, number> = { verfuegbar: 0, vorabversion: 0, 'in-entwicklung': 0, geplant: 0 };
  for (const p of list) c[p.statusKey]++;
  return c;
}

/** "1 Produkt" / "38 Produkte" */
export const plural = (n: number, one: string, many: string) => `${n.toLocaleString('de-DE')} ${n === 1 ? one : many}`;

// ---------------------------------------------------------------------------------------------
// Umbruch von Produktnamen in großen Überschriften (Detailseite, Open-Graph-Bilder): keine automatische
// Silbentrennung (die trennt Markennamen wie Wörterbuchwörter), sondern Umbruchstellen nach Bindestrich
// und Schrägstrich, an Binnenmajuskeln (Enterprise|Browser) und weiche Trennstriche an Wortfugen.

/** Wortfugen für weiche Trennstriche (· = Trennstelle). Nur Anzeige, der Produktname bleibt unverändert. */
const NAME_JOINTS = [
  'Verpackungs·daten', 'Verpackungs·mengen', 'Energie·bericht', 'Drucker·flotte', 'Prozess·leit·system',
  'Visuali·sierung', 'Zertifikats·server', 'Datei·schleuse', 'Label·designer', 'Versio·nierung', 'Prüf·station',
  'Netz·profil', 'Um·schalter', 'Haus·meister', 'Fern·wartung', 'Frame·work',
];

/** Teile eines Namens, zwischen denen umbrochen werden darf (ohne weiche Trennstriche). */
function nameParts(name: string): string[] {
  return name
    .replace(/(?<=\S)([-/])(?=\S)/g, '$1\n')
    .replace(/([a-zäöüß])(?=[A-ZÄÖÜ][a-zäöüß])/g, '$1\n')
    .split(/\s+|\n/)
    .filter(Boolean);
}

/** Längster Teil ohne Umbruchstelle (ohne weiche Trennstriche). */
export const longestNamePart = (name: string) => Math.max(...nameParts(name).map((s) => s.length));

/** Größenstufe der Überschrift nach dem längsten unteilbaren Teil: '' (normal), 'long' oder 'xlong'. */
export function nameSize(name: string): '' | 'long' | 'xlong' {
  const n = longestNamePart(name);
  return n >= 15 ? 'xlong' : n >= 12 || name.length > 20 ? 'long' : '';
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Name als HTML mit <wbr> und &shy; an den erlaubten Stellen. */
export function nameHtml(name: string): string {
  let html = escapeHtml(name);
  for (const j of NAME_JOINTS) html = html.split(j.replace(/·/g, '')).join(j.replace(/·/g, '&shy;'));
  return html
    .replace(/(?<=\S)([-/])(?=\S)/g, '$1<wbr>')
    .replace(/([a-zäöüß])(?=[A-ZÄÖÜ][a-zäöüß])/g, '$1<wbr>');
}
