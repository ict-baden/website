// Strukturierte Daten (schema.org, JSON-LD) und Hilfen für Suchmaschinen und KI-Suche.
// Nur Angaben aus src/config.ts, products.json und den kuratierten Produktseiten – keine erfundenen Fakten
// (keine Bewertungen, keine Gründungsdaten, keine Koordinaten).
import { existsSync } from 'node:fs';
import { COMPANY, SITE_URL } from '../config';
import { productIconUrl } from './product-icons';
import type { Product } from './products';
import { fill, isReleased, pageModified, plain, productUrlFor, type Lang, type ProductPage } from './produktseiten';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const MIT_LICENSE = 'https://opensource.org/license/mit';

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`);
/** Telefonnummer wie auf jeder Seite sichtbar (Fußzeile, Kontaktband, Kontaktseite) – NAP überall gleich */
const PHONE = COMPANY.mobileHref.replace('tel:', '');
/** Veröffentlichung des Portfolio-Videos (Commit 3dd5fa3) */
const VIDEO_UPLOADED = '2026-10-21T01:37:49+02:00';

/** Öffentliche Profile des Unternehmens (sameAs): nur geprüfte Adressen – die GitHub-Organisation antwortet öffentlich
 *  mit 200 (geprüft 2026-10-21). Keine geratenen Profile. */
const ORG_SAME_AS = ['https://github.com/ict-baden'];

/** Texte der Organization je Sprache der Seite – dieselbe @id überall, nur die Sprache der Texte folgt der Seite. */
const ORG_TEXT = {
  de: {
    description: 'Beratung und Softwareentwicklung im Auftrag aus Karlsruhe-Durlach – und eigene Software-Produkte für Industrie, Labor und IT.',
    country: 'Deutschland',
    knowsAbout: ['Softwareentwicklung', 'C#', '.NET', 'Linux', 'Embedded-Systeme', 'Industrielle Kommunikation', 'OT-Sicherheit', 'Barcodes und Etiketten'],
    jobTitle: 'Geschäftsführer',
  },
  en: {
    description: 'Consulting and custom software development from Karlsruhe-Durlach, Germany – and our own software products for industry, labs and IT.',
    country: 'Germany',
    knowsAbout: ['Software development', 'C#', '.NET', 'Linux', 'Embedded systems', 'Industrial communication', 'OT security', 'Barcodes and labels'],
    jobTitle: 'Managing Director',
  },
} as const;

/** Unternehmen: Organization und LocalBusiness (für lokale Suche „Softwareentwicklung Karlsruhe“; ProfessionalService
 *  ist bei schema.org als veraltet markiert). Öffnungszeiten und Koordinaten stehen nirgends belegt – deshalb keine
 *  openingHours und kein geo (Google nimmt die Adresse). Die Steuernummer steht nur im Impressum (vatID genügt).
 *  Kontakt auf Deutsch und Englisch: Die englische Startseite lädt mit „Let’s talk about your project“ zu Anfragen ein. */
export function organization(lang: Lang = 'de') {
  const T = ORG_TEXT[lang];
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORG_ID,
    name: COMPANY.name,
    legalName: COMPANY.name,
    alternateName: 'ICT Baden',
    slogan: COMPANY.claim,
    description: T.description,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: abs('/brand/icon-512.png'), width: 512, height: 512 },
    image: abs('/og/ict-baden.png'),
    email: COMPANY.email,
    telephone: PHONE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street,
      postalCode: COMPANY.zip,
      addressLocality: COMPANY.city,
      addressRegion: 'Baden-Württemberg',
      addressCountry: 'DE',
    },
    areaServed: [
      { '@type': 'City', name: 'Karlsruhe' },
      { '@type': 'State', name: 'Baden-Württemberg' },
      { '@type': 'Country', name: T.country },
    ],
    knowsAbout: T.knowsAbout,
    sameAs: ORG_SAME_AS,
    vatID: COMPANY.vatId.replace(/\s+/g, ''),
    identifier: { '@type': 'PropertyValue', propertyID: 'Handelsregister', value: `${COMPANY.hrb}, ${COMPANY.court}` },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', email: COMPANY.email, telephone: PHONE, availableLanguage: ['de', 'en'] },
    ],
    employee: {
      '@type': 'Person',
      name: COMPANY.ceo,
      jobTitle: T.jobTitle,
      sameAs: ['https://www.linkedin.com/in/frank-pfattheicher', 'https://github.com/FrankPfattheicher'],
    },
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: 'ICT Baden',
    alternateName: COMPANY.name,
    inLanguage: ['de', 'en'],
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: abs(x.url) })),
  };
}

export function faqPage(url: string, faq: { q: string; a: string }[], lang: Lang) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(url)}#faq`,
    inLanguage: lang,
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

/**
 * Eine @id je Sprachfassung (Adresse der Seite + #software): Jede Seite beschreibt das Produkt vollständig in ihrer
 * Sprache – mit eigener url, eigenem OG-Bild, Beschreibung, Suchbegriffen und Funktionsliste. Eine gemeinsame @id für
 * beide Seiten hätte demselben Knoten zwei verschiedene url/image/description gegeben. Die Sprachfassungen verbindet
 * hreflang; das Unternehmen (Organization) bleibt eine @id für alle Seiten.
 */
export const softwareId = (p: Product, lang: Lang) => `${abs(productUrlFor(p, lang))}#software`;

/** Open-Graph-Bild eines Produkts in der Sprache der Seite (scripts/make-brand-assets.mjs), sonst undefined. */
export function productOgImage(p: Product, lang: Lang): string | undefined {
  const path = lang === 'en' ? `/og/en/produkte/${p.slug}.jpg` : `/og/produkte/${p.slug}.jpg`;
  if (existsSync(`public${path}`)) return path;
  return existsSync(`public/og/produkte/${p.slug}.jpg`) ? `/og/produkte/${p.slug}.jpg` : undefined;
}

/** SoftwareApplication für eine Produktseite. */
export function softwareApplication(p: Product, page: ProductPage, lang: Lang, kind: string) {
  const copy = page[lang];
  const url = abs(productUrlFor(p, lang));
  const released = isReleased(p);
  const icon = productIconUrl(p);
  const og = productOgImage(p, lang) ?? icon ?? '/og/ict-baden.png';
  const shots = p.media.screenshots.map((s) => ({
    '@type': 'ImageObject',
    url: abs(s.light.src),
    width: s.light.width,
    height: s.light.height,
    caption: lang === 'en' && s.en ? s.en.alt : s.alt,
  }));
  // Nur Funktionen, die es gibt: Abschnitte mit planned (in Arbeit) zählen nicht
  const features = copy.sections.filter((s) => !s.planned).flatMap((s) => s.blocks.flatMap((b) => (b.type === 'items' ? b.items.map((i) => i.title) : [])));
  const modified = pageModified(p);
  const node: Record<string, unknown> = {
    '@type': 'SoftwareApplication',
    '@id': softwareId(p, lang),
    name: p.name,
    // Suchbegriffe als keywords, nicht als alternateName (das sind keine Namen des Produkts)
    keywords: copy.aka.join(', '),
    description: plain(fill(copy.description, page, p, lang)),
    abstract: plain(fill(copy.lead, page, p, lang)),
    url,
    applicationCategory: page.applicationCategory,
    applicationSubCategory: kind,
    operatingSystem: copy.operatingSystem ?? page.operatingSystem,
    inLanguage: page.uiLanguages,
    license: MIT_LICENSE,
    isAccessibleForFree: true,
    publisher: { '@id': ORG_ID },
    author: { '@id': ORG_ID },
    image: abs(og),
  };
  const requirements = copy.softwareRequirements ?? page.softwareRequirements;
  if (requirements) node.softwareRequirements = requirements;
  // Version, Angebot, Download und Quellcode erst mit öffentlichem Download (der Schalter download.public)
  if (released && page.download.public && p.version) node.softwareVersion = p.version;
  if (modified) node.dateModified = modified;
  if (icon) node.thumbnailUrl = abs(icon);
  if (shots.length) node.screenshot = shots;
  if (features.length) node.featureList = features;
  // Angebot nur, wenn man das Produkt auch bekommt (öffentlicher Download) – vorher wäre es eine falsche Verfügbarkeit
  if (released && page.download.public && page.download.url) {
    node.offers = { '@type': 'Offer', price: '0', priceCurrency: 'EUR', url, availability: 'https://schema.org/InStock' };
  }
  if (page.download.public) {
    if (page.download.url) node.downloadUrl = page.download.url;
    node.sameAs = [page.download.source, page.download.play].filter(Boolean);
    if (page.download.source) node.codeRepository = page.download.source;
  }
  return node;
}

/** Webseite (WebPage, Übersichten als CollectionPage) mit Sprache und Hauptgegenstand. */
export function webPage(url: string, name: string, description: string, lang: Lang, about?: string, image?: string, type: 'WebPage' | 'CollectionPage' = 'WebPage') {
  return {
    '@type': type,
    '@id': `${abs(url)}#webpage`,
    url: abs(url),
    name,
    description,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    ...(about ? { about: { '@id': about }, mainEntity: { '@id': about } } : {}),
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: abs(image) } } : {}),
  };
}

/** Liste der Produkte (Startseite, Produktübersicht); mit id kann die Seite sie als mainEntity nennen. */
export function productList(list: Product[], lang: Lang, name: string, id?: string) {
  return {
    '@type': 'ItemList',
    ...(id ? { '@id': abs(id) } : {}),
    name,
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productUrlFor(p, lang)), name: p.name })),
  };
}

/** Portfolio-Video der Startseite (src/components/sections/Film.astro): ein Video, eine @id auf / und /en/ (dieselbe
 *  Datei, Untertitel deutsch und englisch); Name und Beschreibung in der Sprache der Seite. */
export function videoObject(lang: Lang) {
  const de = lang === 'de';
  return {
    '@type': 'VideoObject',
    '@id': `${SITE_URL}/#video`,
    name: de ? 'ICT Baden in 50 Sekunden' : 'ICT Baden in 50 seconds',
    description: de
      ? 'Was ICT Baden aus Karlsruhe-Durlach macht, wer wir sind und welche Software-Produkte wir selbst entwickeln. Englisch gesprochen, mit deutschen Untertiteln.'
      : 'What ICT Baden from Karlsruhe-Durlach does, who we are and the software products we build ourselves. With English subtitles.',
    thumbnailUrl: abs('/media/video/ict-baden-poster.webp'),
    contentUrl: abs('/media/video/ict-baden-portfolio.mp4'),
    uploadDate: VIDEO_UPLOADED,
    duration: 'PT54S',
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

/** Mehrere Knoten zu einem @graph zusammenfassen. */
export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
