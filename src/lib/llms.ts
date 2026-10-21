// Inhalt von /llms.txt und /llms-full.txt (Markdown für KI-Assistenten, siehe https://llmstxt.org).
// Erzeugt beim Build aus products.json und den kuratierten Produktseiten – dieselben belegten Aussagen wie auf der Website,
// deutsch und englisch (die englischen Produktseiten liegen unter /en/products/<slug>/).
import { COMPANY, SITE_URL } from '../config';
import { lineById, products, type Product } from './products';
import { fill, isReleased, LINE_EN, pageFor, plain, productsUrlFor, productUrlFor, statusLabelFor, type Lang } from './produktseiten';

const url = (path: string) => `${SITE_URL}${path}`;
/** Text einer Produktseite ohne Code-Markierung und ohne den Satz „Der Download folgt …“: den Download-Stand nennt
 *  jeder Eintrag einmal selbst (download()), sonst stünde er doppelt da. */
const text = (s: string, p: Product, lang: Lang) => plain(fill(s, pageFor(p), p, lang, { download: false }));
const kindOf = (p: Product, lang: Lang) => (lang === 'de' ? p.kind : pageFor(p).en.kind ?? p.kind);

/** Status wie auf der Produktseite, solange der Download nicht öffentlich ist mit „Veröffentlichung in Kürze“. */
function status(p: Product, lang: Lang): string {
  const soon = pageFor(p).download.public ? '' : lang === 'de' ? ' – Veröffentlichung in Kürze' : ' – public release coming soon';
  return statusLabelFor(p, lang) + soon;
}

/** Bekommt man das Produkt schon? Dieselbe Aussage wie auf der Produktseite; „Veröffentlichung in Kürze“ steht schon
 *  im Status und wird hier nicht wiederholt. */
function download(p: Product, lang: Lang): string {
  const page = pageFor(p);
  if (page.download.public && page.download.url) return `Download: ${page.download.url}`;
  if (lang === 'en') return isReleased(p) ? 'Download: not publicly available yet' : 'Not released yet, no download';
  return isReleased(p) ? 'Download: noch nicht öffentlich erhältlich' : 'Noch nicht veröffentlicht, kein Download';
}

function intro(): string[] {
  return [
    '# ICT Baden',
    '',
    `> ${COMPANY.name} aus Karlsruhe-Durlach: Beratung und Softwareentwicklung im Auftrag – und eigene Software-Produkte für Industrie, Labor und IT. Alle Produkte sind kostenlos unter der MIT-Lizenz; Support gibt es auf Wunsch per Supportvertrag.`,
    '',
    `Kontakt: ${COMPANY.email}, ${COMPANY.mobile}. ${COMPANY.name}, ${COMPANY.street}, ${COMPANY.zip} ${COMPANY.city}, Deutschland.`,
    `Die Website ist deutsch; die englische Fassung unter ${url('/en/')} umfasst die Startseite, die Produktübersicht ${url(productsUrlFor('en'))} und eine Seite je Produkt.`,
    '',
    `English: ${COMPANY.name} from Karlsruhe-Durlach, Germany, offers consulting and custom software development and builds its own software products for industry, labs and IT. All products are free of charge under the MIT licence; support is available with a support contract. The English website is at ${url('/en/')}, the product overview at ${url(productsUrlFor('en'))}, and every product has an English page.`,
    '',
  ];
}

/** Kurzfassung: ein Absatz je Produkt und Sprache mit Links (llms.txt). */
export function llmsTxt(): string {
  const lines = [...intro(), '## Produkte', ''];
  for (const p of products) {
    const page = pageFor(p);
    const independence = page.de.independence ? ` ${page.de.independence}` : '';
    lines.push(`- [${p.name} – ${kindOf(p, 'de')}](${url(productUrlFor(p, 'de'))}): ${text(page.de.lead, p, 'de')}${independence} Status: ${status(p, 'de')}. ${download(p, 'de')}.`);
  }
  lines.push('', '## Products (English)', '');
  for (const p of products) {
    const page = pageFor(p);
    const independence = page.en.independence ? ` ${page.en.independence}` : '';
    lines.push(`- [${p.name} – ${kindOf(p, 'en')}](${url(productUrlFor(p, 'en'))}): ${text(page.en.lead, p, 'en')}${independence} Status: ${status(p, 'en')}. ${download(p, 'en')}.`);
  }
  lines.push(
    '',
    '## Website',
    '',
    `- [Produkte](${url(productsUrlFor('de'))}): Übersicht aller Produkte nach Produktlinien ([English](${url(productsUrlFor('en'))}))`,
    `- [Leistungen](${url('/#leistungen')}): Softwareentwicklung im Auftrag – C# und .NET, Linux, Windows und Cloud, C/C++ für Embedded ([English](${url('/en/#services')}))`,
    `- [Bewährte Lösungen](${url('/#bewaehrt')}): Informant, CallCenter, ModbusExplorer für Modbus TCP, Pulswertigkeit für Energiezähler`,
    `- [Rechner für die Pulswertigkeit von Energiezählern](${url('/werkzeuge/pulswertigkeit/')})`,
    `- [Kontakt](${url('/#kontakt')}) ([English](${url('/en/#contact')})), [Impressum](${url('/impressum/')}), [Datenschutz](${url('/datenschutz/')})`,
    '',
    '## Optional',
    '',
    `- [Alle Produktfakten ausführlich, deutsch und englisch](${url('/llms-full.txt')})`,
    '',
  );
  return lines.join('\n');
}

/** Ausführlich: Funktionen, Voraussetzungen, Grenzen und FAQ je Produkt, dazu Einleitung und FAQ auf Englisch (llms-full.txt). */
export function llmsFullTxt(): string {
  const lines = [...intro()];
  for (const p of products) {
    const page = pageFor(p);
    const c = page.de;
    const f = (s: string) => text(s, p, 'de');
    lines.push(`## ${p.name} – ${kindOf(p, 'de')}`, '');
    lines.push(`Seite: ${url(productUrlFor(p, 'de'))} · English: ${url(productUrlFor(p, 'en'))}`);
    lines.push(`Produktlinie: ${lineById(p.linie).name} · Status: ${status(p, 'de')}${p.updated ? ` · Stand: ${p.updated}` : ''} · Lizenz: MIT, kostenlos`);
    lines.push(`${download(p, 'de')}.`);
    lines.push('', f(c.lead), '');
    if (c.independence) lines.push(c.independence, '');
    for (const s of c.sections) {
      lines.push(`### ${s.title}${s.planned ? ' (in Arbeit, noch nicht im Produkt)' : ''}`, '');
      for (const b of s.blocks) {
        if (b.type === 'p') lines.push(f(b.text), '');
        else if (b.type === 'list') lines.push(...b.items.map((x) => `- ${f(x)}`), '');
        else if (b.type === 'items') lines.push(...b.items.map((x) => `- **${x.title}:** ${f(x.text)}`), '');
        else lines.push(`| ${b.head.join(' | ')} |`, `|${b.head.map(() => '---').join('|')}|`, ...b.rows.map((r) => `| ${r.join(' | ')} |`), '');
      }
    }
    const cmp = page.alternatives?.approved ? page.alternatives.de : null;
    if (cmp) {
      lines.push(`### ${cmp.title}`, '');
      for (const b of cmp.blocks) {
        if (b.type === 'p') lines.push(f(b.text), '');
        else if (b.type === 'list') lines.push(...b.items.map((x) => `- ${f(x)}`), '');
        else lines.push(...b.items.map((x) => `- **${x.title}:** ${f(x.text)}`), '');
      }
      lines.push(cmp.trademark, '');
    }
    lines.push('### Systemvoraussetzungen', '', ...c.requirements.map(([k, v]) => `- **${k}:** ${f(v)}`), '');
    lines.push('### Grenzen', '', ...c.limits.map((x) => `- ${f(x)}`), '');
    lines.push('### Häufige Fragen', '');
    for (const q of [...c.faq, ...(cmp?.faq ?? [])]) lines.push(`**${f(q.q)}**`, f(q.a), '');
    lines.push(`Weitere Bezeichnungen: ${c.aka.join(', ')}`, '');
    if (c.trademarks) lines.push(`Marken: ${c.trademarks}`, '');

    // Englisch: Einleitung, Stand und FAQ der englischen Produktseite
    const e = page.en;
    const fe = (s: string) => text(s, p, 'en');
    const cmpEn = page.alternatives?.approved ? page.alternatives.en : null;
    const lineEn = LINE_EN[p.linie]?.name ?? lineById(p.linie).name;
    lines.push(`### ${p.name} in English – ${kindOf(p, 'en')}`, '');
    lines.push(`Page: ${url(productUrlFor(p, 'en'))} · Product line: ${lineEn} · Status: ${status(p, 'en')} · Licence: MIT, free of charge`);
    lines.push(`${download(p, 'en')}.`, '', fe(e.lead), '');
    if (e.independence) lines.push(e.independence, '');
    lines.push('Frequently asked questions:', '');
    for (const q of [...e.faq, ...(cmpEn?.faq ?? [])]) lines.push(`**${fe(q.q)}**`, fe(q.a), '');
    lines.push(`Also known as: ${e.aka.join(', ')}`, '');
    if (cmpEn) lines.push(cmpEn.trademark, '');
    if (e.trademarks) lines.push(`Trademarks: ${e.trademarks}`, '');
  }
  return lines.join('\n');
}
