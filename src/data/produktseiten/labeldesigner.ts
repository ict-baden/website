// Plakette (Projekt-id labeldesigner) – Etiketten-Designer für Zebra- und kompatible Etikettendrucker.
// Quellen (ict-baden/plakette): README.md (Kurzbeschreibung, deutscher Hinweis, „in development“, „Limits, honestly“,
// MIT), CHANGELOG.md (Durchstich, Befehlszeile zpl/info), samples/README.md (Beispieletiketten), docs/data-sources.md
// (Datenquellen CSV, Excel ohne Office, ODBC, SQLite: „available“ in der Entwicklung), docs/fragments/limitations
// (Barcodes Stufe A, Zähler ohne Wiederholung). Status: in Entwicklung, keine Veröffentlichung – deshalb keine
// Version, kein Download, kein Angebot im JSON-LD.
// Nicht behaupten: Funktionsgleichheit mit einem Fremdprodukt (Ziel der Spezifikation, rechtlich prüfen), fertige
// Funktionen über die README hinaus, Tests mit echter Druckerhardware. Der Abschnitt „Woran gearbeitet wird“ ist
// planned: kein Haken, nicht im featureList des JSON-LD. ZPL ist eine Marke von ZIH Corp. (Zebra): nur beschreibend
// („druckt ZPL“, „Drucker mit ZPL“), nicht als Namensbestandteil („ZPL-Designer“).
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'labeldesigner',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Windows 10, Windows 11, Linux (x64, arm64)',
  uiLanguages: ['de', 'en', 'es', 'fr', 'zh-Hans'],
  download: { public: false, source: 'https://github.com/ict-baden/plakette' },
  related: ['qr-scanner', 'industrialkeyboard'],
  alternatives: {
    approved: false,
    names: ['ZebraDesigner 3 (Zebra Technologies)'],
    de: 'Ziel von Plakette ist der Funktionsumfang von ZebraDesigner 3, dazu Linux, eine Befehlszeile, ZPL-Import und Funktionen für Druckstationen.',
    en: 'Plakette aims at the feature set of ZebraDesigner 3, plus Linux, a command line, ZPL import and print-station features.',
  },
  de: {
    title: 'Plakette – Etiketten-Designer für Zebra-Drucker (ZPL)',
    description: 'Etiketten-Designer für Zebra- und kompatible Drucker: druckt ZPL direkt – ohne Druckertreiber, Lizenzserver oder Adminrechte. Windows und Linux, in Entwicklung.',
    lead: 'Plakette ist ein Etiketten-Designer für Zebra- und kompatible Etikettendrucker: Er druckt ZPL direkt auf den Drucker – ohne Druckertreiber, ohne Lizenzserver und ohne Administratorrechte – und läuft unter Windows und Linux. Plakette ist in Entwicklung und wird {lizenz} erscheinen; eine Veröffentlichung gibt es noch nicht.',
    independence: 'Plakette ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies verbunden.',
    sections: [
      {
        id: 'wofuer',
        title: 'Etiketten gestalten und als ZPL drucken',
        blocks: [
          { type: 'p', text: 'Zebra-Etikettendrucker und kompatible Geräte verstehen ZPL, die Druckersprache von Zebra. Plakette gestaltet Etiketten und schickt sie als ZPL direkt an den Drucker – ein Druckertreiber, ein Lizenzserver oder Administratorrechte sind dafür nicht nötig. Bedient wird Plakette über eine lokale Weboberfläche im Browser, dazu kommt eine Befehlszeile.' },
        ],
      },
      {
        id: 'stand',
        title: 'Was es heute schon gibt',
        blocks: [
          {
            type: 'list',
            items: [
              'Ein Durchstich von der Vorlage bis zum Drucker: Druckerschrift, TrueType-Text, Rahmen, Code 128 und QR-Code werden als ZPL ausgegeben, an einen virtuellen Drucker geschickt und im Editor angezeigt.',
              'Eine Befehlszeile, die aus einer Vorlage ZPL erzeugt (`plakette zpl`) und Informationen ausgibt (`plakette info`).',
              'Das Vorlagenmodell mit JSON-Schemata und die Oberfläche auf Deutsch und Englisch; Spanisch, Französisch und vereinfachtes Chinesisch sind maschinell vorübersetzt.',
            ],
          },
        ],
      },
      {
        id: 'in-arbeit',
        title: 'Woran gearbeitet wird',
        planned: true,
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Mehrere Datenquellen je Etikett', text: 'CSV- und Textdateien, Excel-Arbeitsmappen ohne installiertes Office, Datenbanken über ODBC und SQLite – unter Windows und Linux. Vorlagen speichern keine Kennwörter.' },
              { title: 'Barcodes', text: 'Code 128 mit GS1-128 und SSCC, EAN-13, EAN-8, UPC-A, UPC-E, Interleaved 2 of 5, ITF-14, Code 39, QR Code, Data Matrix und PDF417, mit GS1-Prüfungen.' },
              { title: 'Zähler ohne Wiederholung', text: 'Fortlaufende Nummern, die sich nie wiederholen: Lücken sind erlaubt, Doppelte nie.' },
              { title: 'Weitere Pläne', text: 'ZPL-Import und Funktionen für Druckstationen. Was die erste Version enthält, steht hier, sobald sie veröffentlicht ist.' },
            ],
          },
        ],
      },
      {
        id: 'beispiele',
        title: 'Beispieletiketten',
        blocks: [
          { type: 'p', text: 'Die Beispielvorlagen im Projekt zeigen, wofür Plakette gedacht ist: ein A6-Palettenetikett mit SSCC (GS1-128) aus einer Excel-Tabelle, ein 50 × 20 mm großes Röhrchenetikett mit Code 128 und Data Matrix bei 300 dpi, bei dem die gescannte Proben-ID den Datensatz wählt, und ein 50 × 30 mm großes Inventaretikett mit fortlaufender Nummer und QR-Code.' },
        ],
      },
    ],
    requirements: [
      ['Betriebssystem', 'Windows 10 und 11, Linux (x64 und arm64)'],
      ['Drucker', 'Zebra- und kompatible Etikettendrucker mit ZPL'],
      ['Druckertreiber', 'nicht nötig'],
      ['Oberfläche', 'lokale Weboberfläche im Browser; Deutsch und Englisch'],
      ['Stand', 'in Entwicklung, noch keine Veröffentlichung'],
    ],
    limits: [
      'Es gibt noch keine Veröffentlichung und keinen Download.',
      'Gedruckt wird bisher nur auf einen virtuellen Drucker; der Test mit echter Hardware kommt vor dem ersten Pilotbetrieb.',
      'Die Vorschau der eingebauten Zebra-Druckerschriften ist nur annähernd genau, weil diese Schriften nicht mitgeliefert werden.',
    ],
    faq: [
      { q: 'Kann ich ohne Druckertreiber auf einen Zebra-Drucker drucken?', a: 'Ja, das ist der Kern von Plakette: Es schickt ZPL direkt an den Drucker, ohne Druckertreiber.' },
      { q: 'Läuft Plakette unter Linux?', a: 'Ja, Plakette ist für Windows 10 und 11 sowie Linux (x64 und arm64) gebaut.' },
      { q: 'Brauche ich Administratorrechte oder einen Lizenzschlüssel?', a: 'Nein. Plakette braucht weder Administratorrechte noch einen Lizenzserver; es steht unter der MIT-Lizenz.' },
      { q: 'Funktioniert Plakette auch mit anderen Druckern als Zebra?', a: 'Plakette ist für Zebra- und kompatible Etikettendrucker gebaut, also Drucker, die ZPL verstehen.' },
      { q: 'Bleiben meine Etikettendaten auf dem Rechner?', a: 'Ja. Die Oberfläche ist eine lokale Weboberfläche auf dem eigenen Rechner, kein Cloud-Dienst; die Daten bleiben lokal.' },
      { q: 'Wann erscheint Plakette?', a: 'Plakette ist in Entwicklung; einen Termin gibt es noch nicht. Schreiben Sie uns, wenn Sie bei der Veröffentlichung informiert werden möchten.' },
    ],
    aka: ['Etikettendesigner', 'Etikettensoftware', 'Etikettendruck-Software', 'Label-Designer', 'Barcode-Etiketten-Software'],
    trademarks: 'Plakette ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies verbunden. Zebra ist eine Marke von Zebra Technologies, ZPL und ZPL II sind Marken der ZIH Corp. (Zebra Technologies); Windows, Excel und Office sind Marken der Microsoft-Unternehmensgruppe; Linux ist eine eingetragene Marke von Linus Torvalds; GS1 ist eine eingetragene Marke von GS1 AISBL; QR Code ist eine eingetragene Marke der DENSO WAVE INCORPORATED. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    title: 'Plakette – label designer for Zebra printers (ZPL)',
    description: 'Label designer for Zebra and compatible printers: prints ZPL directly – no printer driver, licence server or admin rights. Windows and Linux, in development.',
    kind: 'Label designer for Zebra printers (ZPL)',
    tagline: 'Design labels, print ZPL.',
    lead: 'Plakette is a label designer for Zebra and compatible label printers: it prints ZPL directly to the printer – no printer driver, no licence server, no admin rights – and runs on Windows and Linux. Plakette is in development and will be released {lizenz}; there is no release yet.',
    independence: 'Plakette is an independent product of ICT Baden and is not affiliated with Zebra Technologies.',
    sections: [
      {
        id: 'why',
        title: 'Design labels, print ZPL',
        blocks: [
          { type: 'p', text: 'Zebra label printers and compatible devices understand ZPL, Zebra’s printer language. Plakette designs labels and sends them as ZPL straight to the printer – no printer driver, licence server or administrator rights needed. You work in a local web UI in the browser, and there is a command line.' },
        ],
      },
      {
        id: 'today',
        title: 'What exists today',
        blocks: [
          {
            type: 'list',
            items: [
              'A walking skeleton from template to printer: printer-font text, TrueType text, a box, Code 128 and QR are output as ZPL, sent to a virtual printer and shown in the editor.',
              'A command line that turns a template into ZPL (`plakette zpl`) and prints information (`plakette info`).',
              'The template model with JSON schemas and the user interface in German and English; Spanish, French and simplified Chinese are machine pre-translated.',
            ],
          },
        ],
      },
      {
        id: 'in-progress',
        title: 'What is being built',
        planned: true,
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Several data sources per label', text: 'CSV and text files, Excel workbooks without Office installed, databases via ODBC, and SQLite – on Windows and Linux. Templates store no passwords.' },
              { title: 'Barcodes', text: 'Code 128 with GS1-128 and SSCC, EAN-13, EAN-8, UPC-A, UPC-E, Interleaved 2 of 5, ITF-14, Code 39, QR Code, Data Matrix and PDF417, with GS1 checks.' },
              { title: 'Counters that never repeat', text: 'Sequential numbers that never repeat: gaps are allowed, duplicates never.' },
              { title: 'More plans', text: 'ZPL import and print-station features. What the first version contains will be listed here once it is released.' },
            ],
          },
        ],
      },
      {
        id: 'samples',
        title: 'Sample labels',
        blocks: [
          { type: 'p', text: 'The sample templates show what Plakette is meant for: an A6 pallet label with an SSCC (GS1-128) driven by an Excel sheet, a 50 × 20 mm tube label at 300 dpi with Code 128 and Data Matrix where the scanned sample ID picks the record, and a 50 × 30 mm asset tag with a counter and a QR code.' },
        ],
      },
    ],
    requirements: [
      ['Operating system', 'Windows 10 and 11, Linux (x64 and arm64)'],
      ['Printers', 'Zebra and compatible label printers with ZPL'],
      ['Printer driver', 'not needed'],
      ['User interface', 'local web UI in the browser; German and English'],
      ['Status', 'in development, no release yet'],
    ],
    limits: [
      'There is no release and no download yet.',
      'Printing is tested against a virtual printer only; the hardware acceptance test runs before the first pilot.',
      'The preview of Zebra’s built-in printer fonts is approximate, because those fonts are not shipped.',
    ],
    faq: [
      { q: 'Can I print to a Zebra printer without a driver?', a: 'Yes, that is the core of Plakette: it sends ZPL straight to the printer, without a printer driver.' },
      { q: 'Does Plakette run on Linux?', a: 'Yes, Plakette is built for Windows 10 and 11 and for Linux (x64 and arm64).' },
      { q: 'Do I need admin rights or a licence key?', a: 'No. Plakette needs neither administrator rights nor a licence server; it is under the MIT licence.' },
      { q: 'Does it work with printers other than Zebra?', a: 'Plakette is built for Zebra and compatible label printers, i.e. printers that understand ZPL.' },
      { q: 'Does my label data stay on my computer?', a: 'Yes. The user interface is a local web UI on your own computer, not a cloud service; the data stays local.' },
      { q: 'When will Plakette be released?', a: 'Plakette is in development; there is no date yet. Write to us if you would like to be informed about the release.' },
    ],
    aka: ['label designer', 'label design software', 'barcode label software', 'label printing software', 'label editor'],
    facts: [
      ['Platform', 'Windows 10 and 11, Linux (x64, arm64)'],
      ['Printers', 'Zebra and compatible label printers (ZPL)'],
      ['User interface', 'German and English; Spanish, French and Chinese machine pre-translated'],
      ['Data', 'stays on the computer'],
    ],
    trademarks: 'Plakette is an independent product of ICT Baden and is not affiliated with Zebra Technologies. Zebra is a trademark of Zebra Technologies, ZPL and ZPL II are trademarks of ZIH Corp. (Zebra Technologies); Windows, Excel and Office are trademarks of the Microsoft group of companies; Linux is a registered trademark of Linus Torvalds; GS1 is a registered trademark of GS1 AISBL; QR Code is a registered trademark of DENSO WAVE INCORPORATED. They are named only to describe compatibility.',
  },
};

export default page;
