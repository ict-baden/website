// Plakette (Projekt-id labeldesigner) – Etiketten-Designer für Zebra- und kompatible Etikettendrucker.
// Quellen (ict-baden/plakette, Stand Tag v0.2.0 vom 2026-10-21 – laut CHANGELOG „Vorabversion für Pilotkunden“):
// README.md („What Plakette does“, Quick start, „Limits, honestly“, Status „verified against the virtual printer only“),
// CHANGELOG.md ([0.2.0] und [0.1.0] mit „Bekannte Lücken“: Abnahmebericht der Werkbank fehlt noch), docs/installation.md
// (Desktop-App, nichts im Browser; unterstützte Systeme: Windows 11 und 10 22H2 x64, Linux x64/arm64 glibc, kein macOS;
// MSI, Plakette.exe, Plakette.Cli.exe, deb amd64/arm64), docs/usage.md (Barcodes Stufe A, Variablen und Daten,
// Verbindungen TCP 9100/TLS 9143/Spooler/Datei/virtuell, gespeicherte Formate, Druckstation), docs/command-line.md
// (Befehle, *planned*-Kennzeichnung: epl2/cpcl, render --pdf, migrate, --values, watch), docs/data-and-privacy.md
// (keine Telemetrie, keine Update-Prüfung, kein Lizenzserver, kein Port), docs/limitations.md (Desktop-App: X11 bzw.
// XWayland, IME nur headless, Windows on ARM ungetestet, Windows 10 vor 22H2 best effort; Druckerschrift 0 annähernd),
// docs/migration-from-zebradesigner.md (Wege Druck in Datei / Store / Store-Mitschnitt, was verloren geht, keine
// .nlbl, Werkbank: erste Funktionen, Regeldateien/Massenordner/visueller Vergleich/Abnahmebericht folgen),
// samples/README.md (Beispieletiketten).
// Nicht behaupten: Funktionsgleichheit oder vollständiger Ersatz eines Fremdprodukts (Ziel laut Repo, nicht Stand),
// Abnahmebericht der Werkbank (widersprüchlich: usage.md ja, CHANGELOG/Migrationsdoku „folgt“), ADMX-Vorlagen (laut
// limitations „sobald vorhanden“), Tests an echten Druckern, macOS.
// ADMX am 2026-10-22 nachgeprüft (origin/main 89870d8): Das Release-Paket Plakette-policies.zip enthält nur das Schema
// von defaults.json und eine Kurzanleitung, „ADMX/ADML sobald vorhanden“ (docs/limitations.md „Policy templates“,
// CHANGELOG [0.1.0], installer/policies-readme.txt); im Repo liegt keine .admx- oder .adml-Datei. docs/installation.md
// und CHANGELOG [0.1.0] („Richtlinienvorlagen“ in der MSI) klingen, als gäbe es die Vorlagen schon; die README-Zeile
// „policy catalogue (defaults.json, Group Policy, ADMX)“ beschreibt den Richtlinienkatalog – das Verbot bleibt. ZPL ist eine Marke von ZIH Corp. (Zebra): nur
// beschreibend („druckt ZPL“, „Etiketten-Designer für ZPL“), nicht als Namensbestandteil. Versionsnummer nur in den
// Kommentaren; im Text „Vorabversion“.
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'labeldesigner',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Windows 10 (22H2), Windows 11 (x64), Linux (x64, arm64)',
  softwareRequirements: 'Windows 11 oder Windows 10 22H2 (x64); Linux x64/arm64 mit glibc, Oberfläche unter X11 oder Wayland über XWayland',
  uiLanguages: ['de', 'en', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/plakette/releases/latest',
    source: 'https://github.com/ict-baden/plakette',
  },
  related: ['qr-scanner', 'industrialkeyboard'],
  alternatives: {
    approved: true,
    names: ['ZebraDesigner', 'NiceLabel'],
    de: {
      title: 'Umstieg von ZebraDesigner oder NiceLabel: Plakette als Alternative',
      blocks: [
        { type: 'p', text: 'Wer Etiketten bisher mit ZebraDesigner oder NiceLabel gestaltet und auf Zebra- oder kompatiblen Druckern ausgibt, erledigt mit Plakette dieselbe Aufgabe: Etiketten gestalten und als ZPL drucken – {lizenz}, ohne Druckertreiber, ohne Lizenzserver, ohne Administratorrechte und neben Windows auch unter Linux.' },
        {
          type: 'list',
          items: [
            'Etiketten aus ZebraDesigner (3 und 2) kommen über ZPL herüber: per „Druck in Datei“ als .prn oder per „Store“ als gespeichertes Format. Plakette macht daraus bearbeitbare Vorlagen und schreibt einen Importbericht.',
            'Bei „Druck in Datei“ kommen Eingabeaufforderungen, Datenbankfelder, Skripte und Zähler als fester Text an, TrueType-Text als Bild; die Migrationswerkbank macht daraus wieder Variablen, Datenspalten, Barcodes oder Text. Über „Store“ bleiben Variablenplätze mit Eingabeaufforderung, Druckerzähler und Druckeruhr erhalten.',
            'Die .nlbl-Dateien von ZebraDesigner öffnet Plakette nicht – das Format ist geschützt. Datenquellen, Skripte und Bedingungen werden in Plakette neu angelegt.',
            'Etiketten aus anderen Programmen lassen sich genauso übernehmen, wenn das Programm die ZPL für den Drucker in eine Datei schreiben kann.',
          ],
        },
        { type: 'p', text: 'Ehrlich gesagt: Plakette ist eine Vorabversion. Die Ausgabe ist bisher nur gegen den virtuellen Drucker geprüft, und noch nicht jede Funktion eines ausgewachsenen Etikettenprogramms ist umgesetzt. Drucken Sie vor dem Umstieg ein Testetikett auf dem Zieldrucker.' },
      ],
      faq: [
        { q: 'Gibt es eine kostenlose Alternative zu ZebraDesigner, die auch unter Linux läuft?', a: 'Plakette gestaltet Etiketten und druckt ZPL direkt auf Zebra- und kompatible Drucker, unter Windows und Linux, {lizenz}. Es ist eine Vorabversion, deren Ausgabe bisher nur gegen den virtuellen Drucker geprüft ist.{download}' },
        { q: 'Kann ich Etiketten aus ZebraDesigner in Plakette übernehmen?', a: 'Ja, über ZPL: Lassen Sie ZebraDesigner das Etikett in eine Datei drucken oder als gespeichertes Format („Store“) ausgeben, und importieren Sie die Datei in Plakette. .nlbl-Dateien öffnet Plakette nicht; dynamische Inhalte richten Sie mit der Migrationswerkbank wieder ein.' },
      ],
      trademark: 'ZebraDesigner, Zebra und ZPL sind Marken der Zebra Technologies Corporation bzw. der ZIH Corp.; NiceLabel ist eine Marke ihres jeweiligen Inhabers, das Produkt gehört heute zu Loftware. ICT Baden steht in keiner Verbindung zu diesen Unternehmen; die Namen werden nur genannt, um den Vergleich zu beschreiben.',
    },
    en: {
      title: 'Switching from ZebraDesigner or NiceLabel: Plakette as an alternative',
      blocks: [
        { type: 'p', text: 'If you design labels with ZebraDesigner or NiceLabel and print them on Zebra or compatible printers, Plakette does the same job: design labels and print them as ZPL – {lizenz}, without a printer driver, licence server or admin rights, and on Linux as well as Windows.' },
        {
          type: 'list',
          items: [
            'Labels from ZebraDesigner (3 and 2) move across through ZPL: “print to file” as a .prn, or “Store” as a stored format. Plakette turns them into editable templates and writes an import report.',
            'With “print to file”, prompts, database fields, scripts and counters arrive as fixed text and TrueType text as pictures; the migration workbench turns them back into variables, data columns, barcodes or text. With “Store”, variable slots with their prompts, printer counters and the printer clock are kept.',
            'Plakette does not open ZebraDesigner’s .nlbl files – the format is protected. Data sources, scripts and conditions are set up again in Plakette.',
            'Labels from other programs can be taken over the same way, as long as the program can write the printer’s ZPL to a file.',
          ],
        },
        { type: 'p', text: 'Honestly: Plakette is a pre-release. Its output is verified against the virtual printer only, and not every feature of a full-grown label program is there yet. Print a test label on the target printer before you switch.' },
      ],
      faq: [
        { q: 'Is there a free alternative to ZebraDesigner that also runs on Linux?', a: 'Plakette designs labels and prints ZPL straight to Zebra and compatible printers, on Windows and Linux, {lizenz}. It is a pre-release whose output is verified against the virtual printer only.{download}' },
        { q: 'Can I move my labels from ZebraDesigner to Plakette?', a: 'Yes, through ZPL: let ZebraDesigner print the label to a file or write it as a stored format (“Store”), and import the file into Plakette. Plakette does not open .nlbl files; you set up dynamic content again with the migration workbench.' },
      ],
      trademark: 'ZebraDesigner, Zebra and ZPL are trademarks of Zebra Technologies Corporation or ZIH Corp.; NiceLabel is a trademark of its respective owner, the product now belongs to Loftware. ICT Baden is not affiliated with these companies; the names are used only to describe the comparison.',
    },
  },
  de: {
    title: 'Etiketten-Designer für Zebra-Drucker und ZPL – Plakette',
    description: 'Etikettensoftware für Windows und Linux: Plakette gestaltet Etiketten und druckt ZPL ohne Treiber direkt auf Zebra- und kompatible Drucker. Vorabversion.',
    lead: 'Plakette ist eine Etikettensoftware für Zebra- und kompatible Etikettendrucker: eine Desktop-App für Windows und Linux, die Etiketten gestaltet und als ZPL direkt an den Drucker schickt – ohne Druckertreiber, ohne Lizenzserver und ohne Administratorrechte. Dazu kommen eine Befehlszeile für Skripte, ein Druckstationsmodus und ein ZPL-Import. Plakette liegt als Vorabversion vor und ist {lizenz}.{download}',
    independence: 'Plakette ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies verbunden.',
    sections: [
      {
        id: 'wofuer',
        title: 'Etiketten gestalten und als ZPL drucken – ohne Treiber',
        blocks: [
          { type: 'p', text: 'Zebra-Etikettendrucker und kompatible Geräte verstehen ZPL, die Druckersprache von Zebra. Plakette gestaltet Etiketten am eigenen Rechner und schickt sie als ZPL direkt an den Drucker – ein Druckertreiber, ein Lizenzserver oder Administratorrechte sind dafür nicht nötig. Plakette ist eine Desktop-App mit eigenen Fenstern, hell und dunkel; nichts läuft im Browser und nichts lauscht im Netzwerk.' },
          { type: 'p', text: 'Die Zeichenfläche zeigt das Etikett in den Punkten des Druckers. Markierungen zeigen, wo der Drucker genau das druckt, was Sie sehen; die Pixelansicht zeigt die Bits, die beim Drucker ankommen.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Was der Etiketten-Designer für ZPL kann',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Gestalten', text: 'Text in Druckerschriften oder TrueType, Barcodes, Bilder, Rechtecke, Linien, Ellipsen und Umkehrflächen; mit Werkzeugkasten, Eigenschaften-Bereich und vollständiger Tastaturbedienung.' },
              { title: 'Barcodes mit eingebauten Standards', text: 'Code 128, GS1-128, SSCC, EAN-13, EAN-8, UPC-A, UPC-E, Interleaved 2 of 5, ITF-14, Code 39, QR Code, Data Matrix und PDF417 – mit GS1-Prüfung und Prüfziffern.' },
              { title: 'Variablen und Zähler', text: 'Tastatureingabe beim Drucken, Datum und Uhrzeit in der Zeitzone der Vorlage, Funktionen, VBScript und Zähler, die sich nie wiederholen: Jeder Auftrag reserviert seine Nummern vor dem Druck und bestätigt sie danach.' },
              { title: 'Mehrere Datenquellen je Etikett', text: 'CSV- und Textdateien, Excel ohne installiertes Office (führende Nullen, etwa einer 18-stelligen SSCC, bleiben erhalten), ODBC und SQLite. Datensatzauswahl, Filter, Kopien je Datensatz und Nachschlagen per Scan. Vorlagen speichern keine Kennwörter.' },
              { title: 'Drucken ohne Treiber', text: 'Über das Netzwerk (TCP 9100, TLS 9143 mit fest hinterlegtem Zertifikat), über den Windows-Spooler (RAW), in eine Datei oder auf einen virtuellen Drucker. Gespeicherte Formate im Drucker tragen eine Revisionsmarke.' },
              { title: 'Offenes Vorlagenformat', text: 'Vorlagen im dokumentierten Format .plakette, das sich auch in Git verwalten lässt.' },
            ],
          },
        ],
      },
      {
        id: 'beispiele',
        title: 'GS1-SSCC-Etikett, Röhrchen- und Inventaretikett',
        blocks: [
          { type: 'p', text: 'Die mitgelieferten Beispielvorlagen zeigen, wofür Plakette als Barcode-Etiketten-Software gedacht ist: ein A6-Palettenetikett mit SSCC (GS1-128) aus einer Excel-Tabelle, ein 50 × 20 mm großes Röhrchenetikett mit Code 128 und Data Matrix bei 300 dpi, bei dem die gescannte Proben-ID den Datensatz wählt, und ein 50 × 30 mm großes Inventaretikett mit fortlaufender Nummer und QR-Code. Mit `--demo` lassen sie sich ohne Drucker ausprobieren: Virtuelle Drucker mit 203, 300 und 600 dpi zeigen, was gedruckt würde.' },
        ],
      },
      {
        id: 'linux',
        title: 'Zebra-Etiketten unter Linux drucken',
        blocks: [
          { type: 'p', text: 'Für den Etikettendruck unter Linux läuft Plakette auf x64 und arm64 – als deb-Paket für Debian und Ubuntu mit Menüeintrag und Dateizuordnung oder als einzelne Datei. Die Desktop-App braucht X11 oder Wayland über XWayland; die Befehlszeile läuft ohne Bildschirm, also auch auf einem Server. So lässt sich ZPL unter Linux erzeugen, bearbeiten und an den Drucker schicken – mit denselben Vorlagen wie unter Windows.' },
        ],
      },
      {
        id: 'it',
        title: 'Befehlszeile, Druckstation und Verteilung',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Befehlszeile', text: '`Plakette.Cli.exe` (Windows) bzw. `plakette` (Linux) erzeugt ZPL, druckt, importiert, speichert Formate im Drucker und prüft Vorlagen – mit dokumentierten Exitcodes und JSON-Ausgabe für Skripte und geplante Aufgaben.' },
              { title: 'Druckstation', text: 'Per Richtlinie wird Plakette zur reinen Etikettendruck-Software: Sichtbar ist nur der Druckbereich, Vorlagen kommen aus freigegebenen Ordnern, nur erlaubte Drucker sind wählbar, Bearbeiten ist gesperrt. Mit der Freigabesperre drucken nur Vorlagen, deren Prüfsumme auf der Freigabeliste steht.' },
              { title: 'Druckprotokoll', text: 'Auf Wunsch ein zuordenbares Protokoll jedes Drucks, verkettet über Prüfsummen.' },
              { title: 'Verteilung und Richtlinien', text: 'MSI für Intune und Gruppenrichtlinie (`msiexec /i Plakette-x64.msi /qn`), deb-Pakete, Einstellungen per Richtlinie in der Registry oder über defaults.json.' },
              { title: 'Daten bleiben lokal', text: 'Keine Telemetrie, keine Update-Prüfung, kein Lizenzserver; Plakette öffnet keinen Netzwerkport.' },
            ],
          },
        ],
      },
      {
        id: 'zpl-import',
        title: 'ZPL importieren und Etiketten übernehmen',
        blocks: [
          { type: 'p', text: 'ZPL aus „Druck in Datei“ oder aus gespeicherten Formaten wird zu einer bearbeitbaren Vorlage: Text in Druckerschriften, Barcodes, Rahmen, Linien und Bilder werden zu Elementen, Variablenplätze mit Eingabeaufforderung, Druckerzähler und Druckeruhr zu Variablen. TrueType-Text, den das Ursprungsprogramm als Grafik gedruckt hat, bleibt ein Bild. Jeder Import schreibt einen Bericht, der für jeden ZPL-Befehl sagt, was daraus wurde.' },
          { type: 'p', text: 'Die Migrationswerkbank importiert mehrere Dateien und führt je Vorlage einen Status (importiert, zu prüfen, freigegeben, fehlgeschlagen). Sie macht aus festem Text eine Variable oder eine Spalte der Datenquelle, benennt Variablenplätze um und wandelt ein Bild mit erkanntem Barcode in einen echten Barcode.' },
        ],
      },
      {
        id: 'geplant',
        title: 'Was als Nächstes kommt',
        planned: true,
        blocks: [
          {
            type: 'list',
            items: [
              'Weitere Barcode-Arten über die oben genannten hinaus.',
              'Für die Migrationswerkbank: wiederverwendbare Zuordnungsregeln, ganze Ordner auf einmal, ein visueller Vergleich von Original und Ergebnis und ein Abnahmebericht.',
              'Werte-Dateien beim Drucken und PDF-Proben von Etiketten.',
              'Die Druckersprachen EPL2 und CPCL neben ZPL.',
              'Ein Druckserver, der dieselben Vorlagen unverändert druckt.',
            ],
          },
        ],
      },
    ],
    requirements: [
      ['Windows', 'Windows 11 und Windows 10 22H2, x64 – MSI für Intune/GPO, einzelne Plakette.exe oder ZIP (mit installierter .NET-10-Laufzeit)'],
      ['Linux', 'x64 und arm64 (glibc) – deb für Debian und Ubuntu oder einzelne Datei; Oberfläche unter X11 oder Wayland über XWayland, Befehlszeile ohne Bildschirm'],
      ['Drucker', 'Zebra- und kompatible Etikettendrucker mit ZPL – über Netzwerk, Windows-Spooler oder Datei'],
      ['Druckertreiber', 'nicht nötig'],
      ['Rechte', 'keine Administratorrechte zur Laufzeit'],
      ['Sprache', 'Deutsch und Englisch; Spanisch, Französisch und Chinesisch (vereinfacht) maschinell vorübersetzt'],
    ],
    limits: [
      'Vorabversion: Plakette wird in Stufen gebaut, weitere Funktionen folgen in den nächsten Versionen.',
      'Die Druckausgabe ist bisher nur gegen den virtuellen Drucker von Plakette und gegen Referenzbeispiele aus dem öffentlichen ZPL-Handbuch geprüft, nicht an echten Druckern. Die Hardware-Abnahme steht aus und läuft vor dem ersten Pilotbetrieb.',
      'Spanisch, Französisch und Chinesisch sind maschinelle Übersetzungen, die noch niemand mit Muttersprache gegengelesen hat.',
      'Die Vorschau der Zebra-Druckerschrift 0 ist nur annähernd genau, weil die Schrift nicht mitgeliefert wird.',
      'Geschützte Etikettendateien anderer Programme öffnet Plakette nicht; Etiketten kommen über ZPL (Druck in Datei oder gespeichertes Format).',
      'Linux: Oberfläche unter X11 oder Wayland über XWayland; Eingabemethoden (IME) sind bisher nur automatisiert getestet. Windows auf ARM läuft nur per Emulation und ist ungetestet, Windows 10 vor 22H2 ohne Gewähr. Für macOS gibt es keine Fassung.',
      'Noch nicht signiert: Windows kann vor dem ersten Start warnen.',
    ],
    faq: [
      { q: 'Kann ich ohne Druckertreiber auf einen Zebra-Drucker drucken?', a: 'Ja, das ist der Kern von Plakette: Es schickt ZPL direkt an den Drucker – über das Netzwerk (Port 9100 oder TLS), über den Windows-Spooler als RAW oder in eine Datei. Das geht mit Zebra- und kompatiblen Druckern, die ZPL verstehen.' },
      { q: 'Wie drucke ich Zebra-Etiketten unter Linux?', a: 'Plakette als deb-Paket oder einzelne Datei installieren und in der Desktop-App drucken – oder auf der Befehlszeile, etwa `plakette print etikett.plakette --printer tcp://drucker:9100`. Die Befehlszeile braucht keinen Bildschirm.' },
      { q: 'Kann ich mit Plakette ein GS1-SSCC-Etikett für Paletten erstellen?', a: 'Ja. Plakette kennt SSCC und GS1-128 mit Prüfziffer und GS1-Prüfung. Eine Beispielvorlage für ein A6-Palettenetikett liest die Daten aus einer Excel-Tabelle; führende Nullen der SSCC bleiben erhalten.' },
      { q: 'Kann ich vorhandene ZPL-Etiketten importieren und bearbeiten?', a: 'Ja. ZPL aus „Druck in Datei“ oder aus gespeicherten Formaten wird zu einer bearbeitbaren Vorlage, und ein Bericht nennt für jeden Befehl, was daraus wurde.' },
      { q: 'Kann ich Etiketten aus Skripten oder geplanten Aufgaben drucken?', a: 'Ja, mit der Befehlszeile (`Plakette.Cli.exe` unter Windows, `plakette` unter Linux). Sie nutzt dieselbe Druck-Engine wie die Desktop-App und meldet das Ergebnis mit dokumentierten Exitcodes.' },
      { q: 'Brauche ich Administratorrechte oder einen Lizenzschlüssel?', a: 'Nein. Plakette braucht zur Laufzeit weder Administratorrechte noch einen Lizenzserver; es ist {lizenz}.' },
      { q: 'Bleiben meine Etikettendaten auf dem Rechner?', a: 'Ja. Plakette hat keine Telemetrie, keine Update-Prüfung und keinen Lizenzserver und öffnet keinen Netzwerkport. Daten gehen nur an die Drucker, auf die Sie drucken.' },
      { q: 'Ist Plakette schon für den Produktivbetrieb geprüft?', a: 'Noch nicht. Plakette ist eine Vorabversion; die Druckausgabe ist bisher nur gegen den virtuellen Drucker geprüft. Die Abnahme an echten Druckern steht aus und läuft vor dem ersten Pilotbetrieb.{download}' },
    ],
    aka: ['Etiketten-Designer', 'Etiketten-Designer für ZPL', 'Etikettensoftware', 'Etikettendruck-Software', 'Barcode-Etiketten-Software', 'Etikettendruck unter Linux'],
    trademarks: 'Plakette ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies verbunden. Zebra ist eine Marke von Zebra Technologies, ZPL und ZPL II sind Marken der ZIH Corp. (Zebra Technologies); Windows, Excel und Office sind Marken der Microsoft-Unternehmensgruppe; Linux ist eine eingetragene Marke von Linus Torvalds; Debian ist eine eingetragene Marke von Software in the Public Interest, Inc., Ubuntu eine Marke von Canonical Ltd.; GS1 ist eine eingetragene Marke von GS1 AISBL; QR Code ist eine eingetragene Marke der DENSO WAVE INCORPORATED. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Windows 10 (22H2), Windows 11 (x64), Linux (x64, arm64)',
    softwareRequirements: 'Windows 11 or Windows 10 22H2 (x64); Linux x64/arm64 with glibc, user interface on X11 or Wayland through XWayland',
    title: 'Label designer for Zebra printers and ZPL – Plakette',
    description: 'Label design software for Windows and Linux: Plakette designs labels and prints ZPL straight to Zebra and compatible printers – no driver. Pre-release.',
    kind: 'Label designer for Zebra printers (ZPL)',
    tagline: 'Design labels, print ZPL.',
    lead: 'Plakette is label design software for Zebra and compatible label printers: a desktop app for Windows and Linux that designs labels and sends them as ZPL straight to the printer – no printer driver, no licence server, no admin rights. It comes with a command line for scripts, a print-station mode and ZPL import. Plakette is available as a pre-release and is {lizenz}.{download}',
    independence: 'Plakette is an independent product of ICT Baden and is not affiliated with Zebra Technologies.',
    sections: [
      {
        id: 'why',
        title: 'Design labels and print ZPL – without a driver',
        blocks: [
          { type: 'p', text: 'Zebra label printers and compatible devices understand ZPL, Zebra’s printer language. Plakette designs labels on your own computer and sends them as ZPL straight to the printer – no printer driver, licence server or administrator rights needed. Plakette is a desktop app with its own windows, light and dark; nothing runs in a browser and nothing listens on the network.' },
          { type: 'p', text: 'The canvas shows the label at the printer’s dots. Fidelity markers show where the printer draws exactly what you see; the pixel view shows the very bits the printer receives.' },
        ],
      },
      {
        id: 'features',
        title: 'Features of a label designer for ZPL',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Design', text: 'Text in printer fonts or TrueType, barcodes, pictures, boxes, lines, ellipses and inverse areas; with a toolbox, property panel and full keyboard operation.' },
              { title: 'Barcodes with the standards built in', text: 'Code 128, GS1-128, SSCC, EAN-13, EAN-8, UPC-A, UPC-E, Interleaved 2 of 5, ITF-14, Code 39, QR Code, Data Matrix and PDF417 – with GS1 validation and check digits.' },
              { title: 'Variables and counters', text: 'Keyboard input when printing, date and time in the template’s time zone, functions, VBScript and counters that never repeat: each job reserves its numbers before printing and confirms them afterwards.' },
              { title: 'Several data sources per label', text: 'CSV and text files, Excel without Office installed (leading zeros, such as those of an 18-digit SSCC, are kept), ODBC and SQLite. Record selection, filters, copies per record and lookup by scan. Templates store no passwords.' },
              { title: 'Print without a driver', text: 'Over the network (TCP 9100, TLS 9143 with a pinned certificate), through the Windows spooler (RAW), to a file or to a virtual printer. Formats stored in the printer carry a revision marker.' },
              { title: 'Open template format', text: 'Templates in the documented .plakette format, which also works in Git.' },
            ],
          },
        ],
      },
      {
        id: 'samples',
        title: 'GS1 SSCC label, tube label and asset tag',
        blocks: [
          { type: 'p', text: 'The bundled sample templates show what Plakette is meant for as barcode label software: an A6 pallet label with an SSCC (GS1-128) driven by an Excel sheet, a 50 × 20 mm tube label at 300 dpi with Code 128 and Data Matrix where the scanned sample ID picks the record, and a 50 × 30 mm asset tag with a counter and a QR code. With `--demo` you can try them without a printer: virtual printers at 203, 300 and 600 dpi show what would be printed.' },
        ],
      },
      {
        id: 'linux',
        title: 'Print Zebra labels on Linux',
        blocks: [
          { type: 'p', text: 'For label printing on Linux, Plakette runs on x64 and arm64 – as a deb package for Debian and Ubuntu with menu entry and file association, or as a single file. The desktop app needs X11, or Wayland through XWayland; the command line runs without a display, so on a server too. That lets you create and edit ZPL on Linux and send it to the printer – with the same templates as on Windows.' },
        ],
      },
      {
        id: 'it',
        title: 'Command line, print station and deployment',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Command line', text: '`Plakette.Cli.exe` (Windows) or `plakette` (Linux) generates ZPL, prints, imports, stores formats in the printer and validates templates – with documented exit codes and JSON output for scripts and scheduled tasks.' },
              { title: 'Print station', text: 'A policy turns Plakette into pure label printing software: only the print pane is shown, templates come from approved folders, only allowed printers can be chosen, editing is refused. With the approved-template lock, only templates whose hash is on the approved list may print.' },
              { title: 'Print log', text: 'Optionally an attributable, hash-chained log of every print.' },
              { title: 'Deployment and policies', text: 'MSI for Intune and Group Policy (`msiexec /i Plakette-x64.msi /qn`), deb packages, settings by policy in the registry or through defaults.json.' },
              { title: 'Data stays local', text: 'No telemetry, no update check, no licence server; Plakette opens no network port.' },
            ],
          },
        ],
      },
      {
        id: 'zpl-import',
        title: 'Import ZPL and take over existing labels',
        blocks: [
          { type: 'p', text: 'ZPL from “print to file” or from stored formats becomes an editable template: printer-font text, barcodes, boxes, lines and pictures become elements; variable slots with prompts, printer counters and the printer clock become variables. TrueType text that the original program printed as a graphic stays a picture. Every import writes a report that says what became of each ZPL command.' },
          { type: 'p', text: 'The migration workbench imports several files and keeps a status per template (imported, needs review, signed off, failed). It turns fixed text into a variable or a data-source column, renames variable slots and converts a picture with a recognised barcode into a native barcode.' },
        ],
      },
      {
        id: 'planned',
        title: 'What comes next',
        planned: true,
        blocks: [
          {
            type: 'list',
            items: [
              'More barcode types beyond those listed above.',
              'For the migration workbench: reusable mapping rules, whole folders at once, a visual diff of source and result, and a sign-off report.',
              'Values files when printing and PDF proofs of labels.',
              'The printer languages EPL2 and CPCL alongside ZPL.',
              'A print server that prints the same templates unchanged.',
            ],
          },
        ],
      },
    ],
    requirements: [
      ['Windows', 'Windows 11 and Windows 10 22H2, x64 – MSI for Intune/GPO, single Plakette.exe, or ZIP (with the .NET 10 Runtime installed)'],
      ['Linux', 'x64 and arm64 (glibc) – deb for Debian and Ubuntu or a single file; user interface on X11 or Wayland through XWayland, command line without a display'],
      ['Printers', 'Zebra and compatible label printers with ZPL – over the network, the Windows spooler or to a file'],
      ['Printer driver', 'not needed'],
      ['Rights', 'no administrator rights at runtime'],
      ['Language', 'English and German; Spanish, French and Chinese (simplified) machine pre-translated'],
    ],
    limits: [
      'Pre-release: Plakette is built in tiers; more features follow in the next versions.',
      'Printer output is verified only against Plakette’s virtual printer and reference samples from Zebra’s public ZPL guide, not on real printers. The hardware acceptance test is still open and runs before the first pilot.',
      'Spanish, French and Chinese are machine translations that no native speaker has reviewed yet.',
      'The preview of Zebra’s printer font 0 is approximate, because the font is not shipped.',
      'Plakette does not open other programs’ protected label files; labels come in through ZPL (print to file or stored format).',
      'Linux: user interface on X11 or Wayland through XWayland; input methods (IME) are tested by automated tests only so far. Windows on ARM runs under emulation only and is untested, Windows 10 before 22H2 is best effort. There is no macOS version.',
      'Not code-signed yet: Windows may warn before the first start.',
    ],
    faq: [
      { q: 'Can I print to a Zebra printer without a driver?', a: 'Yes, that is the core of Plakette: it sends ZPL straight to the printer – over the network (port 9100 or TLS), through the Windows spooler as RAW, or to a file. This works with Zebra and compatible printers that understand ZPL.' },
      { q: 'How do I print Zebra labels on Linux?', a: 'Install Plakette as a deb package or single file and print from the desktop app – or from the command line, e.g. `plakette print label.plakette --printer tcp://printer:9100`. The command line needs no display.' },
      { q: 'Can I create a GS1 SSCC label for pallets with Plakette?', a: 'Yes. Plakette knows SSCC and GS1-128 with check digit and GS1 validation. A sample template for an A6 pallet label reads its data from an Excel sheet; the SSCC keeps its leading zeros.' },
      { q: 'Can I import and edit existing ZPL labels?', a: 'Yes. ZPL from “print to file” or from stored formats becomes an editable template, and a report says what became of each command.' },
      { q: 'Can I print labels from scripts or scheduled tasks?', a: 'Yes, with the command line (`Plakette.Cli.exe` on Windows, `plakette` on Linux). It uses the same print engine as the desktop app and reports the result with documented exit codes.' },
      { q: 'Do I need admin rights or a licence key?', a: 'No. Plakette needs neither administrator rights at runtime nor a licence server; it is {lizenz}.' },
      { q: 'Does my label data stay on my computer?', a: 'Yes. Plakette has no telemetry, no update check and no licence server, and opens no network port. Data goes only to the printers you print to.' },
      { q: 'Is Plakette verified for production use yet?', a: 'Not yet. Plakette is a pre-release; its output is verified against the virtual printer only. The acceptance test on real printers is still open and runs before the first pilot.{download}' },
    ],
    aka: ['label designer', 'label designer for ZPL', 'label design software', 'barcode label software', 'label printing software', 'label printing on Linux'],
    facts: [
      ['Platform', 'Windows 11 and 10 (22H2, x64), Linux (x64, arm64)'],
      ['Printers', 'Zebra and compatible label printers (ZPL), no driver'],
      ['User interface', 'English and German; Spanish, French and Chinese machine pre-translated'],
      ['Data', 'stays on the computer, no telemetry'],
      ['Delivery', 'MSI or single Plakette.exe (Windows), deb or single file (Linux)'],
    ],
    trademarks: 'Plakette is an independent product of ICT Baden and is not affiliated with Zebra Technologies. Zebra is a trademark of Zebra Technologies, ZPL and ZPL II are trademarks of ZIH Corp. (Zebra Technologies); Windows, Excel and Office are trademarks of the Microsoft group of companies; Linux is a registered trademark of Linus Torvalds; Debian is a registered trademark of Software in the Public Interest, Inc., Ubuntu a trademark of Canonical Ltd.; GS1 is a registered trademark of GS1 AISBL; QR Code is a registered trademark of DENSO WAVE INCORPORATED. They are named only to describe compatibility.',
  },
};

export default page;
