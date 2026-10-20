// Inhalt von /llms.txt und /llms-full.txt (Markdown für KI-Assistenten, siehe https://llmstxt.org).
// Erzeugt beim Build aus products.json und den kuratierten Produktseiten – dieselben belegten Aussagen wie auf der Website.
import { COMPANY, SITE_URL } from '../config';
import { lineById, products, type Product } from './products';
import { fill, isReleased, pageFor, plain, productUrlFor } from './produktseiten';

const url = (path: string) => `${SITE_URL}${path}`;
const status = (p: Product) => (p.statusKey === 'vorabversion' && p.version ? `Vorabversion ${p.version}` : p.statusLabel);
/** Bekommt man das Produkt schon? Dieselbe Aussage wie auf der Produktseite („Download folgt“). */
function download(p: Product): string {
  const page = pageFor(p);
  if (page.download.public && page.download.url) return `Download: ${page.download.url}`;
  return isReleased(p) ? 'Download: folgt mit der Veröffentlichung, noch nicht erhältlich' : 'Noch nicht veröffentlicht, kein Download';
}

function intro(): string[] {
  return [
    '# ICT Baden',
    '',
    `> ${COMPANY.name} aus Karlsruhe-Durlach: Beratung und Softwareentwicklung im Auftrag – und eigene Software-Produkte für Industrie, Labor und IT. Alle Produkte sind kostenlos unter der MIT-Lizenz; Support gibt es auf Wunsch per Supportvertrag.`,
    '',
    `Kontakt: ${COMPANY.email}, ${COMPANY.mobile}. ${COMPANY.name}, ${COMPANY.street}, ${COMPANY.zip} ${COMPANY.city}, Deutschland.`,
    'Die Website ist deutsch; jedes Produkt hat zusätzlich eine englische Seite.',
    '',
  ];
}

/** Kurzfassung: ein Absatz je Produkt mit Links (llms.txt). */
export function llmsTxt(): string {
  const lines = [...intro(), '## Produkte', ''];
  for (const p of products) {
    const page = pageFor(p);
    const independence = page.de.independence ? ` ${page.de.independence}` : '';
    lines.push(`- [${p.name} – ${p.kind}](${url(productUrlFor(p, 'de'))}): ${plain(fill(page.de.lead, page, p, 'de'))}${independence} Status: ${status(p)}. ${download(p)}. English: ${url(productUrlFor(p, 'en'))}`);
  }
  lines.push(
    '',
    '## Website',
    '',
    `- [Leistungen](${url('/#leistungen')}): Softwareentwicklung im Auftrag – C# und .NET, Linux, Windows und Cloud, C/C++ für Embedded`,
    `- [Produkte](${url('/#produkte')}): Übersicht aller Produkte ([English](${url('/en/')}))`,
    `- [Bewährte Lösungen](${url('/#bewaehrt')}): Informant, CallCenter, ModbusExplorer für Modbus TCP, Pulswertigkeit für Energiezähler`,
    `- [Rechner für die Pulswertigkeit von Energiezählern](${url('/werkzeuge/pulswertigkeit/')})`,
    `- [Kontakt](${url('/#kontakt')}), [Impressum](${url('/impressum/')}), [Datenschutz](${url('/datenschutz/')})`,
    '',
    '## Optional',
    '',
    `- [Alle Produktfakten ausführlich](${url('/llms-full.txt')})`,
    '',
  );
  return lines.join('\n');
}

/** Ausführlich: Funktionen, Voraussetzungen, Grenzen und FAQ je Produkt (llms-full.txt). */
export function llmsFullTxt(): string {
  const lines = [...intro()];
  for (const p of products) {
    const page = pageFor(p);
    const c = page.de;
    const f = (s: string) => plain(fill(s, page, p, 'de'));
    lines.push(`## ${p.name} – ${p.kind}`, '');
    lines.push(`Seite: ${url(productUrlFor(p, 'de'))} · English: ${url(productUrlFor(p, 'en'))}`);
    lines.push(`Produktlinie: ${lineById(p.linie).name} · Status: ${status(p)}${p.updated ? ` · Stand: ${p.updated}` : ''} · Lizenz: MIT, kostenlos`);
    lines.push(`${download(p)}.`);
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
    lines.push('### Systemvoraussetzungen', '', ...c.requirements.map(([k, v]) => `- **${k}:** ${f(v)}`), '');
    lines.push('### Grenzen', '', ...c.limits.map((x) => `- ${f(x)}`), '');
    lines.push('### Häufige Fragen', '');
    for (const q of c.faq) lines.push(`**${f(q.q)}**`, f(q.a), '');
    lines.push(`Auch bekannt als: ${c.aka.join(', ')}`, '');
    if (c.trademarks) lines.push(`Marken: ${c.trademarks}`, '');
  }
  return lines.join('\n');
}
