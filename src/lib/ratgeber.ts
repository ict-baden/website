// Ratgeber (deutsch unter /ratgeber/<slug>/, englisch unter /en/guides/<slug>/): Seiten, die eine Frage aus Labor,
// Produktion, Lager oder IT beantworten und alle Lösungswege ehrlich vergleichen – das eigene Produkt ist einer davon,
// klar als solches beschrieben. Inhalte: src/data/ratgeber/<id>.ts (deutsch und englisch, Quellen im Dateikopf).
//
// Regeln: keine Namen fremder Produkte (auch kein „Alternative zu …“) – der sachliche Vergleich mit benannten Produkten
// steht nur auf der Produktseite (scripts/check-seo.mjs prüft beides). Aussagen über Windows und Hardware nur, wenn sie
// in der Herstellerdoku nachgelesen sind; Aussagen über das eigene Produkt nur aus dessen README/Doku und der
// Produktseite (src/data/produktseiten/<id>.ts, dort auch „Nicht behaupten“).
import { execFileSync } from 'node:child_process';
import { SITE_URL } from '../config';
import { products, type Product } from './products';
import { fill, pageFor, productUrlFor, UI, type Faq, type Item, type Lang, type ProductPage } from './produktseiten';
import { breadcrumbs, faqPage, ORG_ID, organization, productOgImage, softwareId, WEBSITE_ID, website } from './seo';

// organization() und softwareId() nehmen in neueren Fassungen von seo.ts die Sprache der Seite (Texte der Organisation,
// @id des SoftwareApplication je Sprachfassung); ältere Fassungen ignorieren das Argument. So stimmen beide Stände.
const organizationIn = organization as (lang?: Lang) => ReturnType<typeof organization>;
const softwareIdIn = softwareId as (p: Product, lang?: Lang) => string;

export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  /** Karten mit Titel und Text */
  | { type: 'items'; items: Item[] }
  /** „Was passt wann?“: Situation (title) → Empfehlung (text) */
  | { type: 'cases'; items: Item[] }
  /** Vergleichstabelle; key = Zeile des eigenen Produkts (wird markiert), note = Fußnote */
  | { type: 'table'; caption: string; head: string[]; rows: string[][]; key?: number; note?: string }
  /** Karte des eigenen Produkts mit Link zur Produktseite (und optional zu deren Vergleichsabschnitt) */
  | { type: 'product'; text: string; compare?: { label: string; href: string } };

export interface GuideSection {
  id: string;
  title: string;
  /** Kürzerer Eintrag im Inhaltsverzeichnis (sonst der Titel) */
  toc?: string;
  blocks: GuideBlock[];
}

export interface GuideCopy {
  /** Letzter Teil der Adresse */
  slug: string;
  /** <title> genau so, wie er erscheint (mit „| ICT Baden“ nur, wenn es in etwa 580 px bei 20 px Arial passt) */
  title: string;
  /** Meta-Beschreibung, 110–155 Zeichen */
  description: string;
  h1: string;
  /** Kurzname: Brotkrumen, Fußzeile der anderen Ratgeber, Verweis von der Produktseite */
  short: string;
  /** Ein Satz für die Übersicht, die Produktseite und llms.txt */
  teaser: string;
  /** Antwort zuerst: ein bis zwei Sätze, die Suchmaschinen und KI-Antworten zitieren können */
  lead: string;
  sections: GuideSection[];
  faq: Faq[];
  /** Markenhinweis für alle Marken Dritter, die auf der Seite stehen (Windows, QR Code …) */
  trademarks: string;
}

export interface Guide {
  /** = Dateiname in src/data/ratgeber/ und deutscher slug */
  id: string;
  /** Projekt-id des eigenen Produkts, um das es auch geht (Produktkarte, mentions im JSON-LD, Verweis zurück) */
  product: string;
  /** Erstveröffentlichung (JJJJ-MM-TT) */
  published: string;
  de: GuideCopy;
  en: GuideCopy;
}

const modules = import.meta.glob('../data/ratgeber/*.ts', { eager: true }) as Record<string, { default: Guide }>;

/** Prüft beim Build, was sonst erst in der SEO-Prüfung auffiele (Längen, Fragen ohne Formatierung, eindeutige Anker). */
function check(g: Guide, file: string): Guide {
  const problems: string[] = [];
  if (`../data/ratgeber/${g.id}.ts` !== file) problems.push(`id ${g.id} passt nicht zum Dateinamen`);
  if (g.de.slug !== g.id) problems.push('deutscher slug ≠ id');
  if (!products.some((p) => p.id === g.product)) problems.push(`unbekanntes Produkt ${g.product}`);
  for (const lang of ['de', 'en'] as const) {
    const c = g[lang];
    if (c.title.length > 65) problems.push(`${lang}: Titel ${c.title.length} Zeichen`);
    if (c.description.length < 110 || c.description.length > 155) problems.push(`${lang}: Beschreibung ${c.description.length} Zeichen`);
    const ids = c.sections.map((s) => s.id);
    if (new Set(ids).size !== ids.length) problems.push(`${lang}: doppelte Abschnitts-id`);
    for (const f of c.faq) if (/[`[\]]/.test(f.q)) problems.push(`${lang}: Frage mit Formatierung: ${f.q}`);
  }
  if (problems.length) throw new Error(`Ratgeber ${file}: ${problems.join('; ')}`);
  return g;
}

/** Alle Ratgeber, älteste zuerst (Reihenfolge der Übersicht und der Sitemap). */
export const guides: Guide[] = Object.entries(modules)
  .map(([file, m]) => check(m.default, file))
  .sort((a, b) => a.published.localeCompare(b.published) || a.id.localeCompare(b.id));

export const guideUrl = (g: Guide, lang: Lang) => (lang === 'de' ? `/ratgeber/${g.de.slug}/` : `/en/guides/${g.en.slug}/`);

/** Übersichtsseite je Sprache (Ziel der Brotkrumen und des Links in der Fußzeile). */
export const HUB = {
  de: { url: '/ratgeber/', label: 'Ratgeber' },
  en: { url: '/en/guides/', label: 'Guides' },
} as const;

export const guidesForProduct = (productId: string) => guides.filter((g) => g.product === productId);

/** Produkt des Ratgebers mit seiner Produktseite. */
export function productOf(g: Guide): { p: Product; page: ProductPage } {
  const p = products.find((x) => x.id === g.product)!;
  return { p, page: pageFor(p) };
}

/** Platzhalter {lizenz} und {download} wie auf der Produktseite (Open Source erst mit öffentlichem Quellcode). */
export function filler(g: Guide, lang: Lang) {
  const { p, page } = productOf(g);
  return (text: string) => fill(text, page, p, lang);
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const codeHtml = (s: string) => s.replace(/`([^`]+)`/g, '<code>$1</code>');
/** [Text](/pfad/) oder [Text](#anker): nur interne Ziele */
const LINK = /\[([^\]]+)\]\((\/[^)\s]*|#[^)\s]+)\)/g;

/** Text als HTML: `Code` und interne Links [Text](/pfad/), sonst nur Text. */
export function rich(text: string): string {
  let out = '';
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    out += codeHtml(escapeHtml(text.slice(last, m.index)));
    out += `<a href="${escapeHtml(m[2])}">${codeHtml(escapeHtml(m[1]))}</a>`;
    last = m.index! + m[0].length;
  }
  return out + codeHtml(escapeHtml(text.slice(last)));
}

/** Klartext ohne Code- und Link-Markierung (Meta-Daten, JSON-LD). */
export const plainText = (text: string) => text.replace(LINK, '$1').replace(/`([^`]+)`/g, '$1');

/** Markdown mit absoluten Links (llms-full.txt). */
const markdown = (text: string) => text.replace(LINK, (_m, label: string, href: string) => (href.startsWith('#') ? label : `[${label}](${SITE_URL}${href})`));

/**
 * Letzte inhaltliche Änderung (Sitemap lastmod, JSON-LD dateModified, „Stand“ auf der Seite): letzter Commit der Datei in
 * src/data/ratgeber/, nie vor der Erstveröffentlichung. Ohne Git-Verlauf (flacher Klon) gilt die Erstveröffentlichung.
 */
const modifiedDates = new Map<string, string>();
let gitHistory: boolean | null = null;
export function guideModified(g: Guide): string {
  const cached = modifiedDates.get(g.id);
  if (cached) return cached;
  let date: string | null = null;
  try {
    gitHistory ??= execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === 'false';
    if (gitHistory) {
      date = execFileSync('git', ['log', '-1', '--format=%cs', '--', `src/data/ratgeber/${g.id}.ts`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
    }
  } catch {
    gitHistory = false;
  }
  const result = date && date > g.published ? date : g.published;
  modifiedDates.set(g.id, result);
  return result;
}

/** Oberflächentexte der Ratgeber. */
export const GUIDE_UI = {
  de: {
    eyebrow: 'Ratgeber',
    toc: 'Inhalt',
    updated: 'Stand',
    by: 'ICT Baden',
    faq: 'Häufige Fragen',
    more: 'Weitere Ratgeber',
    ours: 'Unser Produkt',
    productCta: (n: string) => `Mehr zu ${n}`,
    teaser: 'Ratgeber',
    contactTitle: 'Fragen zu Ihrem Einsatz?',
    contactText: 'Schreiben Sie uns, wofür Sie eine Lösung suchen – wir melden uns persönlich.',
    contactSubject: (s: string) => `Frage zum Ratgeber: ${s}`,
    hubTitle: 'Ratgeber für Labor, Produktion und IT | ICT Baden',
    hubDescription: 'Ratgeber von ICT Baden: Barcodes und QR-Codes am PC lesen, Windows sperren und die Anzeige sichtbar lassen – jeweils alle Lösungswege im Vergleich.',
    hubH1: 'Ratgeber',
    hubLead: 'Antworten auf Fragen aus Labor, Produktion, Lager und IT – mit allen Lösungswegen im Vergleich, nicht nur mit unseren eigenen Produkten.',
    hubProduct: 'Mit unserem Produkt',
    read: 'Ratgeber lesen',
  },
  en: {
    eyebrow: 'Guide',
    toc: 'Contents',
    updated: 'Last updated',
    by: 'ICT Baden',
    faq: 'Frequently asked questions',
    more: 'More guides',
    ours: 'Our product',
    productCta: (n: string) => `More about ${n}`,
    teaser: 'Guide',
    contactTitle: 'Questions about your setup?',
    contactText: 'Tell us what you are looking for – we will get back to you personally.',
    contactSubject: (s: string) => `Question about the guide: ${s}`,
    hubTitle: 'Guides for labs, production and IT | ICT Baden',
    hubDescription: 'Guides by ICT Baden: reading barcodes and QR codes on a PC, locking Windows while the screen stays visible – every option compared, not just ours.',
    hubH1: 'Guides',
    hubLead: 'Answers to questions from labs, production, warehouses and IT – with every option compared, not just our own products.',
    hubProduct: 'With our product',
    read: 'Read the guide',
  },
} as const;

const abs = (path: string) => `${SITE_URL}${path}`;

/** Brotkrumen Start → Ratgeber → Seite (sichtbar und als BreadcrumbList). */
export function guideCrumbs(g: Guide | null, lang: Lang) {
  const home = lang === 'de' ? '/' : '/en/';
  const list = [{ name: UI[lang].home, url: home }, { name: HUB[lang].label, url: HUB[lang].url }];
  return g ? [...list, { name: g[lang].short, url: guideUrl(g, lang) }] : list;
}

/** Bild für Open Graph und JSON-LD: das Bild des Produkts in der Sprache der Seite. */
export function guideImage(g: Guide, lang: Lang): { src: string; alt: string } {
  const { p, page } = productOf(g);
  const kind = lang === 'de' ? p.kind : page.en.kind ?? p.kind;
  return { src: productOgImage(p, lang) ?? '/og/ict-baden.png', alt: kind ? `${p.name} – ${kind}` : p.name };
}

/**
 * JSON-LD eines Ratgebers als @graph: Organization, WebSite, WebPage, TechArticle (Autor und Herausgeber = die
 * Organisation, mentions = das Produkt der Produktseite, nur als Verweis auf dessen @id), BreadcrumbList und FAQPage
 * mit denselben Fragen wie auf der Seite.
 */
export function guideJsonLd(g: Guide, lang: Lang) {
  const c = g[lang];
  const f = filler(g, lang);
  const url = abs(guideUrl(g, lang));
  const { p } = productOf(g);
  const image = abs(guideImage(g, lang).src);
  const modified = guideModified(g);
  return [
    organizationIn(lang),
    website(),
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: c.title,
      description: c.description,
      inLanguage: lang,
      isPartOf: { '@id': WEBSITE_ID },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      mainEntity: { '@id': `${url}#article` },
      primaryImageOfPage: { '@type': 'ImageObject', url: image },
      datePublished: g.published,
      dateModified: modified,
    },
    {
      '@type': 'TechArticle',
      '@id': `${url}#article`,
      headline: c.h1,
      description: c.description,
      abstract: plainText(f(c.lead)),
      inLanguage: lang,
      url,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      image,
      datePublished: g.published,
      dateModified: modified,
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      articleSection: GUIDE_UI[lang].eyebrow,
      // Nur ein Verweis auf das SoftwareApplication der Produktseite (ohne @type, damit hier kein zweites, unvollständiges
      // Software-Element entsteht); Name und Adresse, damit der Verweis auch ohne die Produktseite lesbar ist
      mentions: [{ '@id': softwareIdIn(p, lang), name: p.name, url: abs(productUrlFor(p, lang)) }],
    },
    { ...breadcrumbs(guideCrumbs(g, lang)), '@id': `${url}#breadcrumb` },
    faqPage(guideUrl(g, lang), c.faq.map((x) => ({ q: plainText(f(x.q)), a: plainText(f(x.a)) })), lang),
  ];
}

/** JSON-LD der Übersicht: CollectionPage mit der Liste der Ratgeber. */
export function hubJsonLd(lang: Lang) {
  const t = GUIDE_UI[lang];
  const url = abs(HUB[lang].url);
  return [
    organizationIn(lang),
    website(),
    {
      '@type': 'CollectionPage',
      '@id': `${url}#webpage`,
      url,
      name: t.hubTitle,
      description: t.hubDescription,
      inLanguage: lang,
      isPartOf: { '@id': WEBSITE_ID },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: guides.length,
        itemListElement: guides.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(guideUrl(g, lang)), name: g[lang].h1 })),
      },
    },
    { ...breadcrumbs(guideCrumbs(null, lang)), '@id': `${url}#breadcrumb` },
  ];
}

/** Einträge für sitemap.xml: Übersicht und Ratgeber, je mit Sprachfassungen und lastmod. */
export function guideSitemapEntries() {
  const pair = (de: string, en: string) => [
    { lang: 'de', href: de },
    { lang: 'en', href: en },
    { lang: 'x-default', href: de },
  ];
  const latest = guides.map(guideModified).sort().at(-1) ?? null;
  const hub = pair(HUB.de.url, HUB.en.url);
  return [
    { loc: HUB.de.url, lastmod: latest, alternates: hub },
    { loc: HUB.en.url, lastmod: latest, alternates: hub },
    ...guides.flatMap((g) => {
      const alternates = pair(guideUrl(g, 'de'), guideUrl(g, 'en'));
      const lastmod = guideModified(g);
      return [
        { loc: guideUrl(g, 'de'), lastmod, alternates },
        { loc: guideUrl(g, 'en'), lastmod, alternates },
      ];
    }),
  ];
}

/** Abschnitt „Ratgeber“ für /llms.txt (beginnt mit einer Leerzeile): je Ratgeber die Antwort und die englische Fassung. */
export function guidesLlms(): string[] {
  if (!guides.length) return [];
  return [
    '',
    '## Ratgeber',
    '',
    ...guides.map((g) => `- [${g.de.h1}](${abs(guideUrl(g, 'de'))}): ${plainText(filler(g, 'de')(g.de.lead))} English: [${g.en.h1}](${abs(guideUrl(g, 'en'))})`),
  ];
}

/** Ratgeber vollständig für /llms-full.txt (deutsch): Abschnitte, Tabellen, Fragen. */
export function guidesLlmsFull(): string[] {
  const lines: string[] = [];
  for (const g of guides) {
    const c = g.de;
    const f = (s: string) => markdown(filler(g, 'de')(s));
    const { p } = productOf(g);
    lines.push(`## Ratgeber: ${c.h1}`, '');
    lines.push(`Seite: ${abs(guideUrl(g, 'de'))} · English: ${abs(guideUrl(g, 'en'))} · Stand: ${guideModified(g)} · Produkt: ${p.name} (${abs(productUrlFor(p, 'de'))})`);
    lines.push('', f(c.lead), '');
    for (const s of c.sections) {
      lines.push(`### ${s.title}`, '');
      for (const b of s.blocks) {
        if (b.type === 'p') lines.push(f(b.text), '');
        else if (b.type === 'list') lines.push(...b.items.map((x) => `- ${f(x)}`), '');
        else if (b.type === 'items' || b.type === 'cases') lines.push(...b.items.map((x) => `- **${f(x.title)}:** ${f(x.text)}`), '');
        else if (b.type === 'table') {
          lines.push(`| ${b.head.join(' | ')} |`, `|${b.head.map(() => '---').join('|')}|`, ...b.rows.map((r) => `| ${r.map(f).join(' | ')} |`), '');
          if (b.note) lines.push(f(b.note), '');
        } else lines.push(`${GUIDE_UI.de.ours}: **${p.name}** – ${p.kind ?? ''} (${abs(productUrlFor(p, 'de'))}): ${f(b.text)}`, '');
      }
    }
    lines.push('### Häufige Fragen', '');
    for (const q of c.faq) lines.push(`**${f(q.q)}**`, f(q.a), '');
    lines.push(`Marken: ${c.trademarks}`, '');
  }
  return lines;
}
