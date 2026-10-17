// Liest eine Projekt-Notiz (notizen/<id>.md) und liefert nur die öffentlichen Abschnitte als Blöcke.
// Block = { type: 'p', text } | { type: 'ul', items: string[] }. Inline erlaubt ist nur **fett**.

export const PUBLIC_SECTIONS = {
  problem: 'Problem',
  ersetzt: 'Was es ersetzt',
  umfang: 'Umfang v1',
};

/** Zerlegt Markdown in Abschnitte nach "## Überschrift". */
export function splitSections(markdown) {
  const sections = new Map();
  let current = null;
  for (const raw of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const h = /^##\s+(.+?)\s*$/.exec(raw);
    if (h) {
      current = h[1].replace(/\s*\(.*\)\s*$/, '').trim(); // "Technik (umgesetzt in v0.1)" -> "Technik"
      if (!sections.has(current)) sections.set(current, []);
      continue;
    }
    if (/^#\s/.test(raw)) { current = null; continue; }
    if (current) sections.get(current).push(raw);
  }
  return sections;
}

/** Wandelt die Zeilen eines Abschnitts in Absätze und Listen. */
export function toBlocks(lines) {
  const blocks = [];
  let para = [];
  let list = null;
  const flushPara = () => {
    if (para.length) blocks.push({ type: 'p', text: para.join(' ').trim() });
    para = [];
  };
  const flushList = () => {
    if (list && list.items.length) blocks.push(list);
    list = null;
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    const item = /^\s*[-*]\s+(.*)$/.exec(line);
    if (item) {
      flushPara();
      if (!list) list = { type: 'ul', items: [] };
      list.items.push(item[1].trim());
      continue;
    }
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    if (list && /^\s{2,}\S/.test(line)) {
      // Fortsetzungszeile eines Listenpunkts
      list.items[list.items.length - 1] += ' ' + line.trim();
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  // Leere Punkte ("- ") entfernen
  return blocks
    .map((b) => (b.type === 'ul' ? { ...b, items: b.items.filter((i) => i && i !== '…') } : b))
    .filter((b) => (b.type === 'ul' ? b.items.length > 0 : b.text && b.text !== '…'));
}

/** Teilt einen Absatz in Sätze (deutsch, einfache Heuristik; "z. B." u. Ä. bleiben ganz). */
export function sentences(text) {
  const protectedText = text.replace(/(?<![\p{L}])(z|u|d|o|v|a|B|Ä|bzw|ca|evtl|ggf|inkl|max|min|Nr|vgl|usw|etc|Abs|Art)\.(?=\s)/gu, '$1\u0000');
  return protectedText
    .split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ„"(0-9])/)
    .map((s) => s.replace(/\u0000/g, '.').trim())
    .filter(Boolean);
}
