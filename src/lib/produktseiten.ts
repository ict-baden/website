// Kuratierte Inhalte der Produktseiten (deutsch und englisch): Titel, Beschreibung, Abschnitte, FAQ, Suchbegriffe.
// Die Inhalte stehen in src/data/produktseiten/<id>.ts. Jede Aussage ist aus der README bzw. der Doku des
// Produkt-Repos belegt (siehe Kommentar in der jeweiligen Datei) – nichts hinzudichten.
import type { Product } from './products';

export type Lang = 'de' | 'en';

export interface Item { title: string; text: string }
export type Block =
  | { type: 'p'; text: string }
  | { type: 'items'; items: Item[] }
  | { type: 'list'; items: string[] }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] };
export interface Section { id: string; title: string; blocks: Block[] }
export interface Faq { q: string; a: string }

export interface PageCopy {
  /** <title> ohne Marke; " | ICT Baden" wird angehängt, wenn es in 65 Zeichen passt */
  title: string;
  /** Meta-Beschreibung, 120–160 Zeichen */
  description: string;
  /** Art des Produkts für die H1 (deutsch: aus products.json, hier nur für Englisch nötig) */
  kind?: string;
  /** Leitsatz (deutsch: aus products.json, hier nur für Englisch nötig) */
  tagline?: string;
  /** Antwort zuerst: was, für wen, Plattform, Lizenz – ein bis zwei Sätze, die KI-Antworten zitieren können */
  lead: string;
  sections: Section[];
  requirements: [string, string][];
  limits: string[];
  faq: Faq[];
  /** Weitere Bezeichnungen und Suchbegriffe – sichtbar als „Auch bekannt als“, auch alternateName im JSON-LD */
  aka: string[];
  /** Eckdaten für die englische Seite (die deutsche nimmt die Fakten aus products.json) */
  facts?: [string, string][];
  /** Hinweis auf Marken Dritter, die zur Beschreibung der Kompatibilität genannt werden */
  trademarks?: string;
  /** Betriebssysteme und Voraussetzungen in dieser Sprache (JSON-LD); fehlt es, gilt die Angabe der Produktseite */
  operatingSystem?: string;
  softwareRequirements?: string;
}

export interface ProductPage {
  id: string;
  /** schema.org applicationCategory, z. B. SecurityApplication */
  applicationCategory: string;
  operatingSystem: string;
  softwareRequirements?: string;
  /** Sprachen der Oberfläche (BCP 47) */
  uiLanguages: string[];
  /**
   * Download und Quellcode. public: false, solange das Repo privat ist – dann zeigt die Seite „Download folgt“,
   * nennt „Open Source“ nicht und setzt kein downloadUrl/sameAs. Beim Veröffentlichen auf true setzen.
   */
  download: { public: boolean; url?: string; source?: string; play?: string };
  /** Verwandte Produkte (ids) mit beschreibendem Linktext */
  related: string[];
  /** Slug der App-Datenschutzseite /datenschutz/<app>/ (PR #1), wird nur verlinkt, wenn die Seite existiert */
  privacyApp?: string;
  /**
   * Abschnitt „Alternative zu …“: wird NUR angezeigt, wenn approved = true (nach rechtlicher Prüfung,
   * wie "ersetzt" in scripts/public-overrides.json). Sachlich und nominativ, nie im Titel oder in der H1.
   */
  alternatives?: { approved: boolean; names: string[]; de: string; en: string };
  de: PageCopy;
  en: PageCopy;
}

/** Ist das Produkt schon veröffentlicht (Release vorhanden)? In Entwicklung und geplant: nein. */
export const isReleased = (p: Product) => p.statusKey === 'verfuegbar' || p.statusKey === 'vorabversion';

/** Platzhalter in den Texten: {lizenz} (mit „Open Source“ nur bei öffentlichem Quellcode), {download}. */
export function fill(text: string, page: ProductPage, p: Product, lang: Lang): string {
  const open = page.download.public;
  const lizenz = lang === 'de'
    ? open ? 'kostenlos und Open Source (MIT-Lizenz)' : 'kostenlos unter der MIT-Lizenz'
    : open ? 'free and open source (MIT licence)' : 'free of charge under the MIT licence';
  const download = open || !isReleased(p) ? '' : lang === 'de'
    ? ' Der Download folgt mit der Veröffentlichung.'
    : ' The download follows with the public release.';
  return text.replaceAll('{lizenz}', lizenz).replaceAll('{download}', download);
}

/** Text mit `Code` als HTML (sonst nur Text). */
export function inline(text: string): string {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return esc.replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** Klartext ohne Code-Markierung (Meta-Daten, JSON-LD). */
export const plain = (text: string) => text.replace(/`([^`]+)`/g, '$1');

const modules = import.meta.glob('../data/produktseiten/*.ts', { eager: true }) as Record<string, { default: ProductPage }>;
const pages = new Map(Object.values(modules).map((m) => [m.default.id, m.default]));

export function pageFor(p: Product): ProductPage {
  const page = pages.get(p.id);
  if (!page) throw new Error(`Keine Produktseite für ${p.id} in src/data/produktseiten/`);
  return page;
}

/** Titel mit Marke, wenn es in 65 Zeichen passt. */
export function seoTitle(title: string): string {
  const withBrand = `${title} | ICT Baden`;
  return withBrand.length <= 65 ? withBrand : title;
}

export const productUrlFor = (p: Product, lang: Lang) => (lang === 'de' ? `/produkte/${p.slug}/` : `/en/products/${p.slug}/`);

/** Oberflächentexte der Produktseiten. */
export const UI = {
  de: {
    home: 'Start',
    products: 'Produkte',
    otherLang: 'English',
    otherLangLabel: 'Diese Seite auf Englisch',
    status: { verfuegbar: 'Verfügbar', vorabversion: 'Vorabversion', 'in-entwicklung': 'In Entwicklung', geplant: 'Geplant' },
    statusHelp: {
      verfuegbar: 'fertig entwickelt',
      vorabversion: 'funktionsfähige Version vor dem Release 1.0',
      'in-entwicklung': 'wird zurzeit gebaut',
      geplant: 'Konzept, Entwicklung noch nicht begonnen',
    },
    download: 'Download',
    downloadSoon: 'Download folgt',
    downloadSoonHelp: 'Download und Quellcode werden mit der Veröffentlichung freigegeben.',
    inDevelopmentHelp: 'Noch nicht veröffentlicht – schreiben Sie uns, wenn Sie informiert werden möchten.',
    source: 'Quellcode',
    play: 'Google Play',
    enquiry: 'Anfrage senden',
    enquirySubject: (n: string) => `Anfrage zu ${n}`,
    support: 'Support-Vertrag anfragen',
    supportSubject: (n: string) => `Support-Vertrag für ${n}`,
    glance: 'Auf einen Blick',
    line: 'Produktlinie',
    version: 'Version',
    updated: 'Stand',
    licence: 'Lizenz',
    licenceValue: (open: boolean) => (open ? 'MIT, kostenlos, Open Source' : 'MIT, kostenlos'),
    requirements: 'Systemvoraussetzungen',
    limits: 'Grenzen, ehrlich gesagt',
    faq: 'Häufige Fragen',
    aka: 'Auch bekannt als',
    gallery: (n: string) => `So sieht ${n} aus`,
    galleryOpen: (t: string) => `${t}: Bild in voller Größe öffnen`,
    related: 'Passende Produkte',
    privacy: 'Datenschutzerklärung der App',
    alternatives: 'Alternative zu …',
    askTitle: 'Fragen zum Einsatz?',
    askText: (n: string) => `Fragen zu ${n}, Einsatz oder Support? Schreiben Sie uns – wir melden uns persönlich.`,
    write: 'E-Mail schreiben',
    contactTitle: (n: string) => `Interesse an ${n}?`,
    contactText: 'Schreiben Sie uns, wofür Sie das Produkt einsetzen möchten – wir melden uns persönlich.',
    highlights: 'Schwerpunkte',
    crumbs: 'Brotkrumen',
    date: (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }),
  },
  en: {
    home: 'ICT Baden',
    products: 'Products',
    otherLang: 'Deutsch',
    otherLangLabel: 'This page in German',
    status: { verfuegbar: 'Available', vorabversion: 'Pre-release', 'in-entwicklung': 'In development', geplant: 'Planned' },
    statusHelp: {
      verfuegbar: 'fully developed',
      vorabversion: 'working version before release 1.0',
      'in-entwicklung': 'currently being built',
      geplant: 'concept, development not started',
    },
    download: 'Download',
    downloadSoon: 'Download to follow',
    downloadSoonHelp: 'Download and source code will be published with the public release.',
    inDevelopmentHelp: 'Not released yet – write to us if you would like to be informed.',
    source: 'Source code',
    play: 'Google Play',
    enquiry: 'Send an enquiry',
    enquirySubject: (n: string) => `Enquiry about ${n}`,
    support: 'Ask about a support contract',
    supportSubject: (n: string) => `Support contract for ${n}`,
    glance: 'At a glance',
    line: 'Product line',
    version: 'Version',
    updated: 'Last updated',
    licence: 'Licence',
    licenceValue: (open: boolean) => (open ? 'MIT, free, open source' : 'MIT, free of charge'),
    requirements: 'System requirements',
    limits: 'Limits, honestly',
    faq: 'Frequently asked questions',
    aka: 'Also known as',
    gallery: (n: string) => `What ${n} looks like`,
    galleryOpen: (t: string) => `${t}: open full-size image`,
    related: 'Related products',
    privacy: 'App privacy policy',
    alternatives: 'An alternative to …',
    askTitle: 'Questions?',
    askText: (n: string) => `Questions about ${n}, deployment or support? Write to us – we will get back to you personally.`,
    write: 'Write an e-mail',
    contactTitle: (n: string) => `Interested in ${n}?`,
    contactText: 'Tell us what you would like to use the product for – we will get back to you personally.',
    highlights: 'Highlights',
    crumbs: 'Breadcrumb',
    date: (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  },
} as const;

/** Englische Namen der Produktlinien (die deutschen stehen in products.json). */
export const LINE_EN: Record<string, { name: string; text: string }> = {
  ot: { name: 'OT security & compliance', text: 'Lock screens, check Windows hardening, document access rights – for plants, labs and control rooms' },
  android: { name: 'Android & Zebra', text: 'Browser and keyboard for rugged Android devices in warehouses and logistics' },
  codes: { name: 'Barcodes & labels', text: 'Read QR codes and barcodes on the PC, design labels for Zebra printers' },
};
