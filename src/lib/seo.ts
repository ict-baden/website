// Strukturierte Daten (schema.org, JSON-LD) und Hilfen für Suchmaschinen und KI-Suche.
// Nur Angaben aus src/config.ts, products.json und den kuratierten Produktseiten – keine erfundenen Fakten
// (keine Bewertungen, keine Gründungsdaten, keine Koordinaten).
import { existsSync } from 'node:fs';
import { COMPANY, SITE_URL } from '../config';
import { productIconUrl } from './product-icons';
import type { Product } from './products';
import { fill, isReleased, plain, productUrlFor, type Lang, type ProductPage } from './produktseiten';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const MIT_LICENSE = 'https://opensource.org/license/mit';

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`);

/** Unternehmen: Organisation und Dienstleister vor Ort (ProfessionalService ist ein LocalBusiness). */
export function organization() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: COMPANY.name,
    legalName: COMPANY.name,
    alternateName: 'ICT Baden',
    slogan: COMPANY.claim,
    description: 'Beratung und Softwareentwicklung im Auftrag aus Karlsruhe-Durlach – und eigene Software-Produkte für Industrie, Labor und IT.',
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: abs('/brand/icon-512.png'), width: 512, height: 512 },
    image: abs('/og/ict-baden.png'),
    email: COMPANY.email,
    telephone: COMPANY.phoneHref.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street,
      postalCode: COMPANY.zip,
      addressLocality: COMPANY.city,
      addressRegion: 'Baden-Württemberg',
      addressCountry: 'DE',
    },
    vatID: COMPANY.vatId.replace(/\s+/g, ''),
    taxID: COMPANY.taxNo,
    identifier: { '@type': 'PropertyValue', propertyID: 'Handelsregister', value: `${COMPANY.hrb}, ${COMPANY.court}` },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', email: COMPANY.email, telephone: COMPANY.phoneHref.replace('tel:', ''), availableLanguage: ['de'] },
    ],
    employee: {
      '@type': 'Person',
      name: COMPANY.ceo,
      jobTitle: 'Geschäftsführer',
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

/** SoftwareApplication für eine Produktseite. */
export function softwareApplication(p: Product, page: ProductPage, lang: Lang, kind: string) {
  const copy = page[lang];
  const url = abs(productUrlFor(p, lang));
  const released = isReleased(p);
  const icon = productIconUrl(p);
  const og = existsSync(`public/og/produkte/${p.slug}.jpg`) ? `/og/produkte/${p.slug}.jpg` : icon ?? '/og/ict-baden.png';
  const shots = p.media.screenshots.map((s) => ({
    '@type': 'ImageObject',
    url: abs(s.light.src),
    width: s.light.width,
    height: s.light.height,
    caption: lang === 'en' && s.en ? s.en.alt : s.alt,
  }));
  const features = copy.sections.flatMap((s) => s.blocks.flatMap((b) => (b.type === 'items' ? b.items.map((i) => i.title) : [])));
  const node: Record<string, unknown> = {
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: p.name,
    alternateName: [...new Set([kind, ...copy.aka])],
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
  if (released && p.version) node.softwareVersion = p.version;
  if (p.updated) node.dateModified = p.updated;
  if (icon) node.thumbnailUrl = abs(icon);
  if (shots.length) node.screenshot = shots;
  if (features.length) node.featureList = features;
  if (released) node.offers = { '@type': 'Offer', price: '0', priceCurrency: 'EUR', url };
  if (page.download.public) {
    if (page.download.url) node.downloadUrl = page.download.url;
    node.sameAs = [page.download.source, page.download.play].filter(Boolean);
    if (page.download.source) node.codeRepository = page.download.source;
  }
  return node;
}

/** Webseite (WebPage) mit Sprache und Hauptgegenstand. */
export function webPage(url: string, name: string, description: string, lang: Lang, about?: string, image?: string) {
  return {
    '@type': 'WebPage',
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

/** Liste der Produkte (Übersichtsseiten). */
export function productList(list: Product[], lang: Lang, name: string) {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productUrlFor(p, lang)), name: p.name })),
  };
}

/** Mehrere Knoten zu einem @graph zusammenfassen. */
export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
