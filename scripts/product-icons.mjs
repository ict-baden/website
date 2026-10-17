// Produktsymbole im Stil der App-Icon-Vorlage aus ict-baden/richtlinien (marke/app-icon-vorlage.svg):
// Raster 32 × 32, Fläche 28 × 28 ab (2, 2), Eckenradius 7, Verlauf von oben nach unten aus einem eigenen
// Farbpaar je Produkt, Symbol in Weiß (Strich 2–2,6, runde Enden, höchstens zwei, drei Formen), keine Schrift.
//
// Produkte mit eigenem App-Icon im Repo (Lupe, Zutritt, Vitrine, EnterpriseBrowser, Industrial Keyboard)
// behalten es und stehen hier nicht. Hausmeister, Fühler, Frist, Rundgang, Merker und Lotse haben im Repo
// nur ein einfarbiges Liniensymbol ohne Kachel: Es wird hier unverändert übernommen (Umrisse aus
// docs/assets/logo.svg des jeweiligen Repos) und in die Vorlage gesetzt – weiß auf eigenem Verlauf.
//
// Schlüssel = Projekt-id aus projekte.json. Datei: src/assets/product-icons/<id>.svg (npm run icons).

/** Symbol aus einem Repo-Logo: Geometrie unverändert, auf die Symbolfläche skaliert. */
const fromRepo = (shapes, box, size = 16.5, stroke = 2.3) => {
  const [x0, y0, x1, y1] = box;
  const s = size / Math.max(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const r = (n) => Math.round(n * 1000) / 1000;
  return `<g transform="translate(16 16) scale(${r(s)}) translate(${r(-cx)} ${r(-cy)})" stroke-width="${r(stroke / s)}">${shapes}</g>`;
};

export const ICON_SPECS = {
  // ---------------------------------------------------------------- Android & Zebra
  labeldesigner: {
    colors: ['#f995eb', '#9059c0'],
    motif: 'Etikett mit Loch',
    en: 'label tag',
    symbol: '<path d="M16.4 8H23a1 1 0 0 1 1 1v6.6a1.6 1.6 0 0 1-.47 1.13l-7.2 7.2a1.6 1.6 0 0 1-2.26 0l-5.5-5.5a1.6 1.6 0 0 1 0-2.26l7.2-7.2A1.6 1.6 0 0 1 16.4 8Z"/><circle cx="20" cy="12" r="1.5"/>',
  },
  // ---------------------------------------------------------------- Labor
  'vial-scanner': {
    colors: ['#4daaff', '#4651be'],
    motif: 'Probenröhrchen',
    en: 'sample tube',
    symbol: '<g transform="rotate(32 16 16)"><path d="M12.4 6.2h7.2M14 6.2v15a2 2 0 0 0 4 0v-15"/><path d="M14 15.6h4v5.6a2 2 0 0 1-4 0Z" fill="#fff" stroke="none"/></g>',
  },
  // ---------------------------------------------------------------- OT-Sicherheit & Compliance
  'usb-pruefstation': {
    colors: ['#cf5d85', '#7b226d'],
    motif: 'USB-Stecker mit Haken',
    en: 'USB plug with check mark',
    symbol: '<path d="M13 11V7h6v4"/><path d="M10.5 11h11v6.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z"/><path d="m13.4 16.3 1.9 1.9 3.4-3.6"/>',
  },
  securedesktop: {
    colors: ['#579e3c', '#025c3f'],
    motif: 'Programmfenster mit Haken',
    en: 'app window with check mark',
    symbol: '<rect x="7.5" y="8" width="17" height="16" rx="2.5"/><path d="M7.5 12.3h17"/><path d="m12.6 18 2.3 2.3 4.6-4.7"/>',
  },
  'user-review': {
    colors: ['#90e2e1', '#389560'],
    motif: 'Person mit Haken',
    en: 'person with check mark',
    symbol: '<circle cx="13" cy="12" r="3.6"/><path d="M7 24a6 6 0 0 1 12 0"/><path d="m18.6 16.4 2 2 3.9-4.2"/>',
  },
  'haertungs-check': {
    colors: ['#f3821d', '#ac281b'],
    motif: 'Schild mit Haken',
    en: 'shield with check mark',
    symbol: '<path d="M16 6.8 9 9.4v5.4c0 4.3 2.9 7.5 7 9 4.1-1.5 7-4.7 7-9V9.4Z"/><path d="m12.6 15.4 2.3 2.3 4.5-4.7"/>',
  },
  'wincc-audit-trail-viewer': {
    colors: ['#829cb3', '#3c4e66'],
    motif: 'Zeitleiste mit Einträgen',
    en: 'timeline with entries',
    symbol: '<path d="M10 9.5v13"/><path d="M14 10h9M14 16h9M14 22h6"/><g fill="#fff" stroke="none"><circle cx="10" cy="10" r="2"/><circle cx="10" cy="16" r="2"/><circle cx="10" cy="22" r="2"/></g>',
  },
  'gpo-doku': {
    colors: ['#d1a9ff', '#6868d2'],
    motif: 'zwei Dokumente im Vergleich',
    en: 'two documents compared',
    symbol: '<path d="M9 20V9.5A1.5 1.5 0 0 1 10.5 8H18"/><rect x="12.5" y="11" width="11" height="14" rx="2"/><path d="M15.5 16h5M15.5 19.5h5"/>',
  },
  // ---------------------------------------------------------------- Explorer
  'opcua-explorer': {
    colors: ['#88c3fe', '#5c6bd4'],
    motif: 'Knotenbaum',
    en: 'node tree',
    symbol: '<path d="M11 10.6v8.9a1.5 1.5 0 0 0 1.5 1.5h4.3M11 14.8h5.8"/><circle cx="11" cy="8.6" r="2.2"/><circle cx="19.6" cy="14.8" r="2.4"/><circle cx="19.6" cy="21" r="2.4"/>',
  },
  'modbus-explorer': {
    colors: ['#09d8d7', '#0685a0'],
    motif: 'Bus mit drei Teilnehmern',
    en: 'bus with three devices',
    symbol: '<path d="M7 10h18M10 10v6.4M16 10v6.4M22 10v6.4"/><circle cx="10" cy="19.6" r="2.4"/><circle cx="16" cy="19.6" r="2.4"/><circle cx="22" cy="19.6" r="2.4"/>',
  },
  'bacnet-explorer': {
    colors: ['#88d56c', '#068d62'],
    motif: 'Haus (Repo-Logo von Hausmeister)',
    en: 'house (Hausmeister repo logo)',
    repoLogo: true,
    symbol: fromRepo('<path d="M4 15 16 5l12 10M8 12v15h16V12M13 27v-8h6v8"/>', [4, 5, 28, 27], 16.5, 2.4),
  },
  'snmp-explorer': {
    colors: ['#be85f9', '#524dbd'],
    motif: 'Messkurve (Repo-Logo von Fühler)',
    en: 'signal curve (Fühler repo logo)',
    repoLogo: true,
    symbol: fromRepo('<path d="M3 22c4 0 4-12 8-12s4 16 8 16 4-20 8-20"/>', [3, 6, 27, 26], 17, 2.5),
  },
  'zertifikats-ablauf-scanner': {
    colors: ['#f771a0', '#962f86'],
    motif: 'Kalender mit Haken (Repo-Logo von Frist)',
    en: 'calendar with check mark (Frist repo logo)',
    repoLogo: true,
    symbol: fromRepo('<rect x="3" y="5" width="26" height="24" rx="5"/><path d="M3 12h26"/><path d="M10 2.5v5M22 2.5v5"/><path d="M11 20.5l3.5 3.5 7-7.5"/>', [3, 2.5, 29, 29], 17, 2.2),
  },
  'redfish-explorer': {
    colors: ['#747de2', '#004d8f'],
    motif: 'Server-Einschübe (Repo-Logo von Rundgang)',
    en: 'server rack units (Rundgang repo logo)',
    repoLogo: true,
    symbol: fromRepo('<rect x="4" y="4" width="24" height="7" rx="2"/><rect x="4" y="13" width="24" height="7" rx="2"/><rect x="4" y="22" width="24" height="7" rx="2"/><g fill="#fff" stroke="none"><circle cx="9" cy="7.5" r="1.4"/><circle cx="9" cy="16.5" r="1.4"/><circle cx="9" cy="25.5" r="1.4"/></g>', [4, 4, 28, 29], 17, 2),
  },
  'profinet-scanner': {
    colors: ['#8fb51f', '#017530'],
    motif: 'Radar',
    en: 'radar',
    symbol: '<circle cx="16" cy="16" r="8.5"/><path d="M16 16 21.6 10.4"/><circle cx="19.4" cy="18.8" r="1.6" fill="#fff" stroke="none"/>',
  },
  's7-explorer': {
    colors: ['#ffa194', '#bf456e'],
    motif: 'Steuerungsbaugruppe (Repo-Logo von Merker)',
    en: 'PLC module (Merker repo logo)',
    repoLogo: true,
    symbol: fromRepo('<rect x="5" y="6" width="22" height="20" rx="3"/><path d="M10 12h4M10 16h4M10 20h4M19 11v10"/>', [5, 6, 27, 26], 17, 2.4),
  },
  'ethernetip-explorer': {
    colors: ['#00b6de', '#0065a3'],
    motif: 'Steuerrad (Repo-Logo von Lotse)',
    en: 'ship\'s wheel (Lotse repo logo)',
    repoLogo: true,
    symbol: fromRepo('<circle cx="16" cy="16" r="8"/><path d="M16 3v26M3 16h26M6.8 6.8l18.4 18.4M25.2 6.8 6.8 25.2"/>', [3, 3, 29, 29], 18, 2.3),
  },
  'iec61850-browser': {
    colors: ['#efb219', '#b15f01'],
    motif: 'Blitz',
    en: 'lightning bolt',
    symbol: '<path d="M17.6 6.5 10 17.2h5.6l-1.2 8.3L22 14.8h-5.6l1.2-8.3Z"/>',
  },
  'explorer-framework': {
    colors: ['#bc63b1', '#632f8b'],
    motif: 'Ebenen (Module)',
    en: 'stacked layers (modules)',
    symbol: '<path d="m16 7.5 8.5 4.5-8.5 4.5L7.5 12Z"/><path d="m7.5 16.3 8.5 4.5 8.5-4.5M7.5 20.5 16 25l8.5-4.5"/>',
  },
  // ---------------------------------------------------------------- Service-Laptop
  'tftp-sftp-server': {
    colors: ['#a9cf7a', '#8a6a0a'],
    motif: 'Hoch- und Herunterladen',
    en: 'upload and download',
    symbol: '<path d="M12 23V9.5M8.3 13.2 12 9.5l3.7 3.7"/><path d="M20 9v13.5M16.3 18.8 20 22.5l3.7-3.7"/>',
  },
  'netzprofil-umschalter': {
    colors: ['#fd7466', '#a82457'],
    motif: 'Umschalter',
    en: 'toggle switch',
    symbol: '<rect x="6.5" y="10.5" width="19" height="11" rx="5.5"/><circle cx="20" cy="16" r="3" fill="#fff" stroke="none"/>',
  },
  // ---------------------------------------------------------------- Self-hosted Server-Apps
  fernwartung: {
    colors: ['#e078d3', '#7a3daa'],
    motif: 'Bildschirm mit Mauszeiger',
    en: 'screen with pointer',
    symbol: '<path d="M23.5 15V9.5A1.5 1.5 0 0 0 22 8H9.5A1.5 1.5 0 0 0 8 9.5v9A1.5 1.5 0 0 0 9.5 20h4.5M11.5 24h3"/><path d="m17.5 14.5 6.5 2.6-2.8 1.1-1.1 2.8Z"/>',
  },
  'label-print-server': {
    colors: ['#d56054', '#891845'],
    motif: 'Drucker',
    en: 'printer',
    symbol: '<path d="M11 12V7.5h10V12"/><path d="M11 20H8.5A1.5 1.5 0 0 1 7 18.5v-5A1.5 1.5 0 0 1 8.5 12h15a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H21"/><path d="M11 17h10v7.5H11Z"/>',
  },
  zertifikatsserver: {
    colors: ['#d19a00', '#904c00'],
    motif: 'Siegel mit Bändern',
    en: 'seal with ribbons',
    symbol: '<circle cx="16" cy="13" r="5.5"/><path d="m12.6 17.4-1.3 7.1 4.7-2.4 4.7 2.4-1.3-7.1"/>',
  },
  dateischleuse: {
    colors: ['#04a177', '#015956'],
    motif: 'Pfeil durch die Schleuse',
    en: 'arrow through an airlock',
    symbol: '<path d="M8.5 8v16M23.5 8v16"/><path d="M11.8 16h8.4M17 12.6l3.4 3.4-3.4 3.4"/>',
  },
  'update-server': {
    colors: ['#029bab', '#025474'],
    motif: 'Kreispfeil mit Download',
    en: 'circular arrow with download',
    symbol: '<path d="M23.4 13.4A7.8 7.8 0 1 0 24 17"/><path d="M24 8.5v5h-5"/><path d="M16 12v6.8M13.2 16.2 16 19l2.8-2.8"/>',
  },
  'rz-energiebericht': {
    colors: ['#c5c632', '#4a8b10'],
    motif: 'Bericht mit Blitz',
    en: 'report with lightning bolt',
    symbol: '<rect x="8.5" y="6.5" width="15" height="19" rx="2.5"/><path d="m17.2 10.2-3.7 5.6h4.6l-1.3 5.2"/>',
  },
  'zebra-druckerflotte-monitor': {
    colors: ['#ff99c2', '#94468f'],
    motif: 'Drucker mit Pulslinie',
    en: 'printer with pulse line',
    symbol: '<path d="M11 11V7.5h10V11"/><rect x="7" y="11" width="18" height="12" rx="2"/><path d="M10 17.5h3.2l1.6-3 2.6 6 1.6-3H22"/>',
  },
  'plc-versionierung': {
    colors: ['#5ad0ac', '#446a2c'],
    motif: 'Versionszweig',
    en: 'version branch',
    symbol: '<circle cx="11" cy="9" r="2.3"/><circle cx="11" cy="23" r="2.3"/><circle cx="21" cy="12.5" r="2.3"/><path d="M11 11.3v9.4M21 14.8c0 3.6-3.2 4.6-8.4 6.4"/>',
  },
  'pcs7-alternative': {
    colors: ['#9264ef', '#442e9d'],
    motif: 'Anzeigeinstrument',
    en: 'gauge',
    symbol: '<path d="M8.2 21a7.8 7.8 0 1 1 15.6 0"/><path d="m16 21 4.4-5.4"/><path d="M8.5 24h15"/>',
  },
  visualisierung: {
    colors: ['#b47fa2', '#543652'],
    motif: 'Bildschirm mit Kurve',
    en: 'screen with trend curve',
    symbol: '<rect x="7" y="7.5" width="18" height="13" rx="2"/><path d="M13 24.5h6"/><path d="m10.5 16.8 3.2-3.3 2.6 2.4 5.2-5"/>',
  },
  // ---------------------------------------------------------------- Neue Ideen
  'ppwr-verpackungsdaten': {
    colors: ['#cc6c13', '#8d1c11'],
    motif: 'Verpackung',
    en: 'package',
    symbol: '<path d="m16 7 8 4.4v9.2L16 25l-8-4.4v-9.2Z"/><path d="m8 11.4 8 4.4 8-4.4M16 15.8V25"/>',
  },
  'verpackungsmengen-plugin': {
    colors: ['#b59a75', '#6c4932'],
    motif: 'Gewicht',
    en: 'weight',
    symbol: '<path d="M11.4 12.5h9.2l2.6 11H8.8Z"/><path d="M13.6 12.5a2.4 2.4 0 1 1 4.8 0"/>',
  },
};

/** Vollständiges SVG eines Produktsymbols. Ohne Kommentar: die Datei wird so ausgeliefert (Motiv und
 * Quelle stehen in der Tabelle im README). */
export function iconSvg(id, spec) {
  const [top, bottom] = spec.colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="28" height="28" rx="7" fill="url(#g)"/>
  <g fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${spec.symbol}</g>
</svg>
`;
}
