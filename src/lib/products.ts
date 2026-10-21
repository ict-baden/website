// Zugriff auf die erzeugten Produktdaten (src/data/products.json, siehe scripts/sync-products.mjs).
import data from '../data/products.json';
import type { IconName } from './icons';

export type Block = { type: 'p'; text: string } | { type: 'ul'; items: string[] };
export interface ImageSet { src: string; srcset: string; width: number; height: number }
export interface ShotText { title: string; caption: string | null; alt: string }
export interface Shot { name: string; title: string; caption: string | null; alt: string; en: ShotText | null; light: ImageSet; dark: ImageSet | null }
export interface Media {
  logo: string | null;
  colors: [string, string] | null;
  banner: (ImageSet & { alt: string; altEn: string | null }) | null;
  demo: { src: string; still: string; width: number; height: number; alt: string; caption: string | null } | null;
  screenshots: Shot[];
  galleryNote: string | null;
  galleryNoteEn?: string | null;
}
/**
 * Status auf der Website. Fertige Produkte heißen „Verfügbar“ (Vorgabe Till 2026-10-20), auch wenn der Download
 * noch nicht öffentlich ist – die Produktseite bietet dann „Anfrage“ statt „Download“. 'bereit' bleibt als Schlüssel
 * für die Daten erhalten, wird aber nicht mehr vergeben.
 */
export type StatusKey = 'verfuegbar' | 'bereit' | 'vorabversion' | 'in-entwicklung' | 'geplant';
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
  /** Datum des letzten Commits im Produkt-Repo (JJJJ-MM-TT) */
  updated: string | null;
  text: string;
  sections: { problem: Block[] | null; ersetzt: Block[] | null; umfang: Block[] | null };
  highlights: string[];
  facts: { label: string; value: string }[];
  media: Media;
}
export interface Linie { id: string; name: string; text: string }

export const linien: Linie[] = data.linien;
export const stand: string | null = data.stand;

/** Symbol und Kurzbeschreibung je Produktlinie (Symbol für erzeugte Motive). */
export const LINE_ICON: Record<string, IconName> = {
  android: 'scanner',
  labor: 'flask',
  ot: 'shield',
  codes: 'barcode',
  explorer: 'radar',
  service: 'wrench',
  server: 'server',
  neu: 'sparkle',
};

export const STATUS_ORDER: StatusKey[] = ['verfuegbar', 'bereit', 'vorabversion', 'in-entwicklung', 'geplant'];
export const STATUS_LABEL: Record<StatusKey, string> = {
  verfuegbar: 'Verfügbar',
  bereit: 'Veröffentlichung folgt',
  vorabversion: 'Vorabversion',
  'in-entwicklung': 'In Entwicklung',
  geplant: 'Geplant',
};
/** Erklärung der Status-Bezeichnungen (Legende, keine Produktaussage). */
export const STATUS_HELP: Record<StatusKey, string> = {
  verfuegbar: 'fertig entwickelt und erhältlich',
  bereit: 'fertig entwickelt, Download folgt mit der Veröffentlichung',
  vorabversion: 'funktionsfähige Vorabversion, Veröffentlichung in Kürze',
  'in-entwicklung': 'wird zurzeit gebaut',
  geplant: 'Konzept, Entwicklung noch nicht begonnen',
};
/** Status im Fließtext („2 verfügbar, 5 als Vorabversion …“). */
export const STATUS_PHRASE: Record<StatusKey, string> = {
  verfuegbar: 'verfügbar',
  bereit: 'vor der Veröffentlichung',
  vorabversion: 'als Vorabversion',
  'in-entwicklung': 'in Entwicklung',
  geplant: 'geplant',
};

/**
 * Ein Schalter je Produkt: download.public in src/data/produktseiten/<id>.ts. Solange das Repo privat ist, zeigt die
 * Website ehrlich „Vorabversion <Version>“ (mit „Veröffentlichung in Kürze“ auf der Produktseite) – auch wenn das
 * Produkt laut projekte.json fertig ist. Mit public: true gilt der Status aus products.json.
 */
const pageModules = import.meta.glob('../data/produktseiten/*.ts', { eager: true }) as Record<string, { default: { id: string; download: { public: boolean } } }>;
const publicIds = new Set(Object.values(pageModules).filter((m) => m.default.download.public).map((m) => m.default.id));
const RELEASED: StatusKey[] = ['verfuegbar', 'bereit', 'vorabversion'];
const effective = (p: Product): Product =>
  publicIds.has(p.id) || !RELEASED.includes(p.statusKey)
    ? p
    : { ...p, statusKey: 'vorabversion', statusLabel: `Vorabversion${p.version ? ` ${p.version}` : ''}` };

/** Produkte mit dem Status, den die Website zeigt (siehe StatusKey und download.public). */
export const products: Product[] = (data.products as Product[]).map(effective);
/** Ist der Download öffentlich (download.public)? */
export const isPublic = (p: Pick<Product, 'id'>) => publicIds.has(p.id);

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
export const lineAnchor = (_id: string) => '/#produkte';

/** Reihenfolge der großen Karten auf der Startseite: alle veröffentlichten Produkte, die erste Karte breit. */
const FEATURED = ['vitrine', 'lupe', 'zutritt', 'riegel', 'pforte', 'industrial-keyboard', 'plakette'];
export const featured = [
  ...FEATURED.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => Boolean(p)),
  ...products.filter((p) => !FEATURED.includes(p.slug)),
];

export function statusCounts(list: Product[]) {
  const c: Record<StatusKey, number> = { verfuegbar: 0, bereit: 0, vorabversion: 0, 'in-entwicklung': 0, geplant: 0 };
  for (const p of list) c[p.statusKey]++;
  return c;
}

/** "1 vor der Veröffentlichung, 5 als Vorabversion, 1 in Entwicklung" (nur Status, die vorkommen). */
export const statusSummary = (list: Product[]) => {
  const c = statusCounts(list);
  return STATUS_ORDER.filter((k) => c[k] > 0).map((k) => `${c[k]} ${STATUS_PHRASE[k]}`).join(', ');
};

/** "1 Produkt" / "38 Produkte" */
export const plural = (n: number, one: string, many: string) => `${n.toLocaleString('de-DE')} ${n === 1 ? one : many}`;

// ---------------------------------------------------------------------------------------------
// Umbruch von Produktnamen in großen Überschriften (Detailseite, Open-Graph-Bilder): keine automatische
// Silbentrennung (die trennt Markennamen wie Wörterbuchwörter), sondern Umbruchstellen nach Bindestrich
// und Schrägstrich, an Binnenmajuskeln und weiche Trennstriche an Wortfugen.

/** Namen, die nie geteilt werden: „EnterpriseBrowser“ getrennt sähe aus wie „Enterprise Browser“, der Produktname
 *  von Zebra und Honeywell (Verwechslungsgefahr, siehe PR „Für die Anwaltsprüfung“). */
const NAME_NO_SPLIT = new Set(['EnterpriseBrowser']);

/** Wortfugen für weiche Trennstriche (· = Trennstelle). Nur Anzeige, der Produktname bleibt unverändert. */
const NAME_JOINTS = [
  'Verpackungs·daten', 'Verpackungs·mengen', 'Energie·bericht', 'Drucker·flotte', 'Prozess·leit·system',
  'Visuali·sierung', 'Zertifikats·server', 'Datei·schleuse', 'Label·designer', 'Versio·nierung', 'Prüf·station',
  'Netz·profil', 'Um·schalter', 'Haus·meister', 'Fern·wartung', 'Frame·work',
];

/** Teile eines Namens, zwischen denen umbrochen werden darf (ohne weiche Trennstriche). */
function nameParts(name: string): string[] {
  if (NAME_NO_SPLIT.has(name)) return [name];
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
  if (NAME_NO_SPLIT.has(name)) return escapeHtml(name);
  let html = escapeHtml(name);
  for (const j of NAME_JOINTS) html = html.split(j.replace(/·/g, '')).join(j.replace(/·/g, '&shy;'));
  return html
    .replace(/(?<=\S)([-/])(?=\S)/g, '$1<wbr>')
    .replace(/([a-zäöüß])(?=[A-ZÄÖÜ][a-zäöüß])/g, '$1<wbr>');
}
