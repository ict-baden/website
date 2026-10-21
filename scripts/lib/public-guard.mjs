// Prüft, dass in den öffentlichen Produktdaten nichts Internes steht.
// Wird beim Sync (vor dem Schreiben) und in der CI (scripts/check-products.mjs) ausgeführt.

// Felder, die ein Produkt in src/data/products.json haben darf – alles andere ist ein Fehler.
export const ALLOWED_PRODUCT_KEYS = new Set([
  'id', 'slug', 'nr', 'name', 'kind', 'tagline', 'linie', 'status', 'statusKey', 'statusLabel', 'version',
  'text', 'sections', 'highlights', 'facts', 'media', 'updated',
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
      if (path === 'updated') {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) problems.push(`${p.id}.updated: kein Datum "${s}"`);
        continue;
      }
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

// Namen fremder Produkte und vergleichende Formulierungen. Sie dürfen nur erscheinen, wo ein Mensch (und vor dem
// Livegang ein Anwalt) den Vergleich geprüft hat: "ersetzt": true in scripts/public-overrides.json. Gilt für alle
// Textfelder eines Produkts, nicht nur für den Abschnitt "Was es ersetzt" (Kurztext und Meta-Beschreibung zählen mit).
export const COMPETITOR_PATTERNS = [
  /Alternative zu|alternative to/i,
  /\bNachbau\b|\bKlon\b|\bclone of\b|feature parity|funktionsgleich/i,
  /tenfold|Varonis|8MAN|protected networks|SolarWinds|Netwrix|Lepide|ManageEngine|AccessEnum/i,
  // Produktnamen in Großschreibung; klein geschrieben ("transparent screen lock") ist es der beschreibende Gattungsbegriff
  /Transparent Screen Lock|Transparent Lock Screen|TScreenLock/,
  /e-motional|Softros|DigitalPersona|KeyFreeze|ClearLock|ScreenBlur/i,
  /ZebraDesigner|Zebra Designer|BarTender|NiceLabel|Loftware|CODESOFT|ZPLab|gLabels|Labelary/i,
  /HardeningKitty|CIS-CAT|Policy Analyzer|Nessus|OpenVAS|HardeningLens/i,
  /CodeTwo|barcodrod|bcWebCam|BarcodeCam|ShareX/i,
  /NTFS Permissions Reporter|Cjwdev|HID Global|\bIvanti\b/i,
  /Enterprise Keyboard|Hacker'?s Keyboard|Fully Kiosk|SureFox|SOTI Surf|Ivanti Velocity|StayLinked|Zebra Enterprise Browser|Honeywell Enterprise Browser/i,
  /WinCC-Alternative|PCS[- ]?7-Alternative|Ziath|DataPaq|UaExpert|iReasoning|YABE|OPSWAT/i,
  // Produktname in Großschreibung ("Kiosk Browser Lockdown", Samsung Knox "Kiosk Browser" u. a.); die Gattung schreibt sich
  // "Kiosk-Browser" bzw. "kiosk browser". Ausgenommen ist unser eigener Produktname "Industrial Kiosk Browser" (2026-10-22).
  /(?<!Industrial )\bKiosk Browser\b/,
  // Fremde Marke als Namensbestandteil unseres Produkts ("Zebra keyboard app", "DataWedge browser", "ZPL-Designer").
  // Kompatibilität wird nominativ beschrieben: "Tastatur für Zebra-Geräte", "label designer for Zebra printers (ZPL)".
  /\b(?:Zebra|DataWedge|Honeywell)[ -](?:keyboard|label (?:software|designer|editor)|browser|Tastatur(?:-App)?|Browser|Etikettensoftware|Etiketten-Software|Label-Software)\b/i,
  /\bZPL[ -](?:Designer|Editor|label designer|label editor)\b/i,
];

/** Erwähnungen fremder Produkte in nicht freigegebenen Produkten (approved = Menge der Produkt-ids mit "ersetzt": true). */
export function findCompetitorMentions(data, approved = new Set()) {
  const problems = [];
  for (const p of data.products ?? []) {
    if (approved.has(p.id)) continue;
    for (const [path, s] of strings(p)) {
      if (path.startsWith('media.') && s.startsWith('/')) continue;
      for (const re of COMPETITOR_PATTERNS) {
        if (re.test(s)) problems.push(`${p.id}.${path}: Fremdprodukt oder Vergleich ohne Freigabe ("ersetzt": true) – "${s.length > 120 ? s.slice(0, 117) + '…' : s}"`);
      }
    }
  }
  return problems;
}

/** Prüft beliebigen Text (z. B. gebaute Produktseiten) auf Fremdprodukte; liefert die gefundenen Muster. */
export function competitorHits(text) {
  return COMPETITOR_PATTERNS.filter((re) => re.test(text)).map((re) => text.match(re)[0]);
}
