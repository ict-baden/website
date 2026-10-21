// Kuratierte Inhalte der Produktseiten (deutsch und englisch): Titel, Beschreibung, Abschnitte, FAQ, Suchbegriffe.
// Die Inhalte stehen in src/data/produktseiten/<id>.ts. Jede Aussage ist aus der README bzw. der Doku des
// Produkt-Repos belegt (siehe Kommentar in der jeweiligen Datei) – nichts hinzudichten.
import { execFileSync } from 'node:child_process';
import type { Product } from './products';

export type Lang = 'de' | 'en';

export interface Item { title: string; text: string }
export type Block =
  | { type: 'p'; text: string }
  | { type: 'items'; items: Item[] }
  | { type: 'list'; items: string[] }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] };
export interface Section {
  id: string;
  title: string;
  blocks: Block[];
  /** Geplant bzw. in Arbeit, noch nicht im Produkt: kein Haken auf der Seite, nicht im featureList des JSON-LD */
  planned?: boolean;
}
export interface Faq { q: string; a: string }

/**
 * Sachlicher Vergleich mit benannten Fremdprodukten („Umstieg von … / Alternative zu …“). Zulässig als vergleichende
 * Werbung (§ 6 UWG: objektiv, nachprüfbar, nicht herabsetzend) und beschreibende Markennennung (§ 23 MarkenG): nur
 * Fakten (Lizenz, Preis, offline, Plattformen, Funktionen), kein „besser als“, keine Logos, keine Aussagen über
 * Preise oder Qualität der Fremdprodukte, die wir nicht belegen können. Fremdnamen stehen NUR hier (Abschnitt + eigene
 * FAQ-Fragen), nie in Titel, H1, Beschreibung, aka oder keywords – scripts/check-seo.mjs prüft das.
 */
export interface Comparison {
  /** H2 des Abschnitts, z. B. „Umstieg von Transparent Screen Lock oder Softros: Vitrine als Alternative“ */
  title: string;
  /** Nur Absätze, Listen und Punkte (keine Tabellen – die Prüfung erkennt den Abschnitt am schließenden </section>) */
  blocks: Exclude<Block, { type: 'table' }>[];
  /** Zusätzliche Fragen; erscheinen am Ende der FAQ (und im FAQPage-JSON-LD) */
  faq: Faq[];
  /** Pflicht: nennt JEDEN Fremdnamen des Abschnitts mit Inhaber und „keine Verbindung“ */
  trademark: string;
}

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
  /**
   * Weitere Bezeichnungen und Suchbegriffe – sichtbar als „Auch bekannt als“, im JSON-LD als keywords (nicht als
   * alternateName: das sind keine Namen des Produkts). Nur Gattungsbegriffe, keine fremden Marken als Namensbestandteil
   * („Zebra-Tastatur“, „DataWedge browser“) – Kompatibilität gehört in den Fließtext („für Zebra-Geräte“).
   */
  aka: string[];
  /** Eckdaten für die englische Seite (die deutsche nimmt die Fakten aus products.json) */
  facts?: [string, string][];
  /** Hinweis auf Marken Dritter, die zur Beschreibung der Kompatibilität genannt werden (alle Marken der Seite) */
  trademarks?: string;
  /** „Eigenständiges Produkt, nicht verbunden mit …“ – steht direkt unter dem ersten Absatz und in llms.txt */
  independence?: string;
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
   * Download und Quellcode – DER Schalter je Produkt. public: false, solange das Repo privat ist: Status
   * „Vorabversion … – Veröffentlichung in Kürze“, kein Download-/Quellcode-Link, kein „Open Source“, im JSON-LD kein
   * offers/downloadUrl/codeRepository/softwareVersion. public: true (eine Zeile) schaltet all das ein und zeigt den
   * Status aus products.json („Verfügbar“). url = Tag-Release „Latest“ (…/releases/latest), nicht der rollierende
   * CI-Build „latest“.
   */
  download: { public: boolean; url?: string; source?: string; play?: string };
  /** Verwandte Produkte (ids) mit beschreibendem Linktext */
  related: string[];
  /** Veraltet: die Datenschutzseite der App kommt aus src/data/app-datenschutz.ts (productId) */
  privacyApp?: string;
  /**
   * Abschnitt „Umstieg von … / Alternative zu …“ (siehe Comparison). Angezeigt, wenn approved = true. Entscheidung
   * 2026-10-21: sachliche, nennende Vergleiche sind an (§ 6 UWG, § 23 MarkenG); die anwaltliche Prüfung steht noch aus
   * (README, „Going live“). names = alle genannten Fremdprodukte (jedes muss im trademark-Text vorkommen).
   */
  alternatives?: { approved: boolean; names: string[]; de: Comparison; en: Comparison };
  de: PageCopy;
  en: PageCopy;
}

/** Gibt es eine Release-Version (fertig oder Vorabversion)? In Entwicklung und geplant: nein. Ob man sie schon
 *  herunterladen kann, sagt download.public. */
export const isReleased = (p: Product) => p.statusKey === 'verfuegbar' || p.statusKey === 'bereit' || p.statusKey === 'vorabversion';

/** Status in der Sprache der Seite, bei Vorabversionen mit Version (die deutsche Bezeichnung steht in products). */
export const statusLabelFor = (p: Product, lang: Lang) =>
  lang === 'de' ? p.statusLabel : `${UI.en.status[p.statusKey]}${p.statusKey === 'vorabversion' && p.version ? ` ${p.version}` : ''}`;

/**
 * Datum der letzten Änderung am Inhalt der Produktseite (Sitemap lastmod, JSON-LD dateModified): letzter Commit, der
 * src/data/produktseiten/<id>.ts, die Bilder oder das OG-Bild des Produkts geändert hat. Der „Stand“ auf der Seite
 * bleibt der letzte Commit im Produkt-Repo (products.json "updated"). Ohne Git-Verlauf (flacher Klon im CI) gilt
 * dieser auch hier.
 */
const pageDates = new Map<string, string | null>();
let gitHistory: boolean | null = null;
export function pageModified(p: Product): string | null {
  if (pageDates.has(p.id)) return pageDates.get(p.id)!;
  let date: string | null = null;
  try {
    gitHistory ??= execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === 'false';
    if (gitHistory) {
      const files = [`src/data/produktseiten/${p.id}.ts`, `public/media/produkte/${p.slug}`, `public/og/produkte/${p.slug}.jpg`, `public/og/en/produkte/${p.slug}.jpg`];
      date = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
    }
  } catch {
    gitHistory = false;
  }
  const result = date ?? p.updated;
  pageDates.set(p.id, result);
  return result;
}

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

/** Produktseite zu einer Projekt-id (oder undefined). */
export const pageById = (id: string): ProductPage | undefined => pages.get(id);

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
    status: { verfuegbar: 'Verfügbar', bereit: 'Veröffentlichung folgt', vorabversion: 'Vorabversion', 'in-entwicklung': 'In Entwicklung', geplant: 'Geplant' },
    statusHelp: {
      verfuegbar: 'fertig entwickelt und erhältlich',
      bereit: 'fertig entwickelt, Download folgt mit der Veröffentlichung',
      vorabversion: 'funktionsfähige Vorabversion, Veröffentlichung in Kürze',
      'in-entwicklung': 'wird zurzeit gebaut',
      geplant: 'Konzept, Entwicklung noch nicht begonnen',
    },
    download: 'Download',
    downloadSoon: 'Veröffentlichung in Kürze',
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
    status: { verfuegbar: 'Available', bereit: 'Release pending', vorabversion: 'Pre-release', 'in-entwicklung': 'In development', geplant: 'Planned' },
    statusHelp: {
      verfuegbar: 'fully developed and available',
      bereit: 'fully developed, download follows with the public release',
      vorabversion: 'working pre-release, public release coming soon',
      'in-entwicklung': 'currently being built',
      geplant: 'concept, development not started',
    },
    download: 'Download',
    downloadSoon: 'Public release coming soon',
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
  android: { name: 'Mobile data capture (Android)', text: 'Browser and keyboard for rugged Android devices in warehouses and logistics' },
  codes: { name: 'Barcodes & labels', text: 'Read QR codes and barcodes on the PC, design labels for Zebra printers' },
};
