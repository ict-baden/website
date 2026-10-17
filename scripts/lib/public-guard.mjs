// Prüft, dass in den öffentlichen Produktdaten nichts Internes steht.
// Wird beim Sync (vor dem Schreiben) und in der CI (scripts/check-products.mjs) ausgeführt.

// Felder, die ein Produkt in src/data/products.json haben darf – alles andere ist ein Fehler.
export const ALLOWED_PRODUCT_KEYS = new Set([
  'id', 'slug', 'nr', 'name', 'kind', 'tagline', 'linie', 'status', 'statusKey', 'statusLabel', 'version',
  'text', 'sections', 'highlights', 'facts', 'media',
]);

// Muster, die nie veröffentlicht werden dürfen: Personen aus dem Projekt-Repo, Repo- und Dateiverweise,
// interne Nummern und Arbeitsnotizen.
const FORBIDDEN = [
  [/\b(Jo|Jos|Till|Tills|Papa|Claude)\b/, 'Name einer Person aus dem internen Projekt-Repo'],
  [/\bgear1900\b|\bpieewiee\b/i, 'GitHub-Benutzername'],
  [/github\.com|ict-baden\/|\brepo\b/i, 'Verweis auf ein (privates) Repository'],
  [/`/, 'Code-/Pfad-Markierung aus den Notizen'],
  [/\b[\w.-]+\.(md|json|cs|ps1)\b/i, 'Dateiname'],
  [/offen\.md|in-arbeit|logbuch|notizen/i, 'Verweis auf interne Ablage'],
  [/[A-Za-z]:\\|%\w+%/, 'Dateipfad'],
  [/\bNr\.\s?\d+/, 'interne Projektnummer'],
  [/Arbeitstitel|Einschätzung|TODO|FIXME|\?\?\?/i, 'interne Arbeitsnotiz'],
  [/@\w/, 'Erwähnung oder E-Mail-Adresse'],
];

/** Sammelt alle Zeichenketten eines Werts mit Pfadangabe. */
function* strings(value, path = '') {
  if (typeof value === 'string') yield [path, value];
  else if (Array.isArray(value)) for (const [i, v] of value.entries()) yield* strings(v, `${path}[${i}]`);
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) yield* strings(v, path ? `${path}.${k}` : k);
}

/**
 * Liefert eine Liste von Verstößen (leer = in Ordnung).
 * Medienpfade (media.*.src/srcset) werden nur auf Pfade unter /media/produkte/ geprüft.
 */
export function findLeaks(data) {
  const problems = [];
  for (const p of data.products ?? []) {
    for (const key of Object.keys(p)) {
      if (!ALLOWED_PRODUCT_KEYS.has(key)) problems.push(`${p.id}: unerlaubtes Feld "${key}"`);
    }
    for (const [path, s] of strings(p)) {
      if (path === 'id' || path === 'slug' || path === 'linie' || path === 'status' || path === 'statusKey') continue;
      if (/^media\.colors\[\d\]$/.test(path)) {
        if (!/^#[0-9a-f]{3,8}$/.test(s)) problems.push(`${p.id}.${path}: unerwartete Farbe "${s}"`);
        continue;
      }
      if (path.startsWith('media.') && s.startsWith('/')) {
        // Bildpfade und srcset-Listen: nur Dateien unter /media/produkte/<slug>/
        const urls = s.split(',').map((part) => part.trim().split(/\s+/)[0]);
        for (const u of urls) {
          if (!/^\/media\/produkte\/[a-z0-9-]+\/[a-z0-9.-]+$/.test(u)) problems.push(`${p.id}.${path}: unerwarteter Medienpfad "${u}"`);
        }
        continue;
      }
      for (const [re, why] of FORBIDDEN) {
        if (re.test(s)) problems.push(`${p.id}.${path}: ${why} – "${s.length > 120 ? s.slice(0, 117) + '…' : s}"`);
      }
    }
  }
  return problems;
}
