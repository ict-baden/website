// Lupe – QR-Code- und Barcode-Leser für Windows, Linux und macOS.
// Quellen (ict-baden/lupe): README.md (Funktionen, „And also“, Quick start, Downloads, 22 Formate, nicht unterstützte
// Formate, „Limits, honestly“, MIT), docs/installation.md (Windows 10 1809 / 11, Bildformate, Sprache), docs/usage.md
// (PDF, E-Mail, Webseite, Videocall; Kamera wie ein Handscanner), docs/data-and-privacy.md (kein Netzwerkcode, keine
// Bilder gespeichert), CHANGELOG.md. Nicht behaupten: „tippt in jede Anwendung“ (nicht in Admin-Fenster),
// echte Webcam oder echter Mac getestet, Alleinstellung („es gibt keinen guten …“).
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'qr-scanner',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Windows 10 (ab Version 1809), Windows 11, Linux (x64, arm64), macOS 12 oder neuer',
  softwareRequirements: 'Windows 10 Version 1809 oder neuer (x64), Linux x64/arm64 mit X11 oder Wayland, macOS 12 oder neuer',
  uiLanguages: ['de', 'en'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/lupe/releases/tag/latest',
    source: 'https://github.com/ict-baden/lupe',
  },
  related: ['labeldesigner', 'enterprisebrowser'],
  de: {
    title: 'QR-Code & Barcode am PC scannen – Lupe',
    description: 'Lupe liest QR-Codes und Barcodes am PC – vom Bildschirm per Tastenkürzel, per Webcam, aus Bilddateien und der Zwischenablage. Kopiert, tippt oder öffnet das Ergebnis.',
    lead: 'Lupe ist ein QR-Code- und Barcode-Leser für Windows, Linux und macOS: Er liest Codes per Webcam, aus jedem Bildschirmausschnitt, aus Bilddateien und aus der Zwischenablage – und kopiert das Ergebnis, tippt es in das Programm, aus dem Sie kamen, oder öffnet es als Link. Lupe arbeitet offline und ist {lizenz}.',
    sections: [
      {
        id: 'wofuer',
        title: 'QR-Code am PC scannen – ohne Handy',
        blocks: [
          { type: 'p', text: 'QR-Codes und Barcodes stehen oft genau dort, wo das Handy nicht weiterhilft: in einer PDF-Rechnung, in einer E-Mail, auf einer Webseite, im Videocall oder auf einem Lieferschein neben dem PC. Lupe liest sie direkt am Rechner und gibt den Inhalt dorthin weiter, wo er gebraucht wird – in die Zwischenablage, als Tastatureingabe in ein Formular oder als Link.' },
        ],
      },
      {
        id: 'bildschirm',
        title: 'QR-Code vom Bildschirm scannen',
        blocks: [
          { type: 'p', text: 'In jedem Programm Win+Umschalt+Q drücken und ein Rechteck um den Code ziehen – über alle Monitore, auch wenn das Lupe-Fenster geschlossen ist. Ein Klick ohne Ziehen nimmt den ganzen Monitor, Esc bricht ab; auf dem Mac ist das Kürzel ⌘+⌥+Q. Kleine Codes auf großen Bildschirmen findet Lupe über eine Übersicht und überlappende Kacheln in voller Auflösung, notfalls in einem zweiten, gründlicheren Durchgang.' },
        ],
      },
      {
        id: 'webcam',
        title: 'Webcam als Barcodescanner',
        blocks: [
          { type: 'p', text: 'Code vor die Kamera halten: Lupe markiert ihn und piept. Mit der Aktion „Eintippen“ arbeitet die Webcam wie ein Handscanner und tippt jeden erkannten Code in das Programm im Vordergrund, etwa in Excel oder ein Formular der Warenwirtschaft. Derselbe Code wird erst wieder gemeldet, wenn er drei Sekunden nicht zu sehen war.' },
        ],
      },
      {
        id: 'dateien',
        title: 'Codes aus Bild, Screenshot oder Zwischenablage',
        blocks: [
          { type: 'p', text: 'Bild öffnen, auf die Seite „Datei“ ziehen oder mit Strg+V einfügen: Lupe findet jeden Code im Bild und nummeriert ihn in Lesereihenfolge. Gelesen werden PNG, JPEG, BMP, GIF, TIFF, ICO und JPEG XR, unter Windows mit der passenden Store-Erweiterung auch WebP, HEIC, AVIF und JPEG XL.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Eintippen, kopieren, als Link öffnen',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Eintippen unabhängig vom Tastaturlayout', text: 'Unicode-Tastatureingabe: Umlaute, € und Emoji kommen an, wie sie sind – in das Fenster, das vor dem Scan aktiv war, auf Wunsch gefolgt von Enter oder Tab.' },
              { title: 'Link-Regeln', text: 'Ein regulärer Ausdruck und ein Präfix machen aus einem Code einen Link, zum Beispiel aus einer EAN die Artikelseite in der Warenwirtschaft. Geöffnet werden nur http- und https-Links; hinter einem Präfix mit Host bleibt der Host fest.' },
              { title: 'Alle Codes im Bild', text: 'Mehrere Codes kommen in Lesereihenfolge. Nach einem Bildschirmscan wählen Sie einen aus oder kopieren alle, einen pro Zeile.' },
              { title: 'Verlauf mit CSV-Export', text: 'Alles Gelesene ist durchsuchbar und als CSV für Excel exportierbar – pro Benutzer gespeichert oder abgeschaltet, dann wird die Datei gelöscht.' },
              { title: 'Befehlszeile', text: '`Lupe.exe lesen *.png` gibt eine Zeile pro Code aus (Format, Tab, Inhalt), mit Exitcodes für Skripte – ohne Fenster und ohne etwas zu speichern.' },
              { title: 'Infobereich und Autostart', text: 'Lupe läuft im Infobereich weiter, das Tastenkürzel bleibt aktiv; auf Wunsch startet Lupe mit Windows.' },
            ],
          },
        ],
      },
      {
        id: 'formate',
        title: 'Unterstützte Formate',
        blocks: [
          { type: 'p', text: '22 Formate über die Bibliothek zxing-cpp: QR Code, Micro QR Code, rMQR, Data Matrix, Aztec, PDF417, MicroPDF417, MaxiCode, Code 128 (auch GS1-128), Code 39, Code 93, Codabar, ITF (auch ITF-14), EAN-13, EAN-8, UPC-A, UPC-E, GS1 DataBar, GS1 DataBar Expanded, GS1 DataBar Limited, Telepen und der DX-Code auf 35-mm-Film.' },
          { type: 'p', text: 'Helle Codes auf dunklem Grund – Dark Mode, Displays – liest Lupe beim Bildschirmscan, aus Dateien, der Zwischenablage und der Befehlszeile; die Kamera liest helle 2D-Codes.' },
        ],
      },
    ],
    requirements: [
      ['Windows', 'Windows 10 ab Version 1809 oder Windows 11, x64 – MSI, einzelne Lupe.exe oder ZIP'],
      ['Linux', 'x64 und arm64, X11 und Wayland – .deb für Debian und Ubuntu oder tar.gz'],
      ['macOS', 'ab macOS 12, Apple Silicon und Intel – Lupe.app'],
      ['.NET', 'in allen Paketen enthalten, außer im Framework-ZIP'],
      ['Kamera', 'optional; unter Windows jede Webcam, die Windows den Apps anbietet'],
      ['Sprache', 'Deutsch und Englisch, folgt der Systemsprache'],
    ],
    limits: [
      'Vorabversion 0.1.0, nicht signiert: SmartScreen und Gatekeeper warnen beim ersten Start.',
      'Die Kamera ist bisher nur gegen eine simulierte Bildquelle getestet, nicht mit einer echten Webcam.',
      'Linux und macOS sind neu und weniger getestet als Windows; der macOS-Build lief noch nicht auf einem echten Mac. Unter Wayland laufen Bildschirmscan, Eintippen und Tastenkürzel über die Desktop-Portale, die nicht jeder Desktop anbietet.',
      'In Programme, die als Administrator laufen, kann Lupe nicht tippen – es erkennt das und sagt es.',
      'Steuerzeichen werden nicht getippt, etwa das Gruppentrennzeichen in GS1-Codes. Zusatzcodes von EAN und UPC sind nicht Teil des Ergebnisses; Intelligent Mail, MSI, Pharmacode und Plessey werden nicht gelesen.',
    ],
    faq: [
      { q: 'Wie scanne ich einen QR-Code am PC ohne Handy?', a: 'Mit Lupe drücken Sie Win+Umschalt+Q und ziehen ein Rechteck um den Code auf dem Bildschirm – oder halten den Code vor die Webcam. Der Inhalt landet in der Zwischenablage, auf Wunsch auch als Tastatureingabe oder als geöffneter Link.' },
      { q: 'Kann ich einen QR-Code aus einem Screenshot, einer PDF oder einem Bild auslesen?', a: 'Ja. Bilddateien öffnen oder auf die Seite „Datei“ ziehen, Screenshots mit Strg+V einfügen. Codes in einer geöffneten PDF oder E-Mail liest der Bildschirmscan direkt.' },
      { q: 'Kann ich die Webcam als Barcodescanner nutzen, der in Excel oder ins ERP tippt?', a: 'Ja. Mit der Aktion „Eintippen“ für die Kamera tippt Lupe jeden erkannten Code wie ein Handscanner in das Programm im Vordergrund, auf Wunsch mit Enter oder Tab danach.' },
      { q: 'Welche Barcode-Formate liest Lupe?', a: '22 Formate, darunter QR Code, Data Matrix, Aztec, PDF417, Code 128 mit GS1-128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF-14 und GS1 DataBar.' },
      { q: 'Was passiert, wenn mehrere Codes auf einem Bild sind?', a: 'Lupe findet alle und meldet sie in Lesereihenfolge. Nach einem Bildschirmscan wählen Sie einen aus oder kopieren alle, einen pro Zeile.' },
      { q: 'Werden meine Bilder oder Scans ins Internet geschickt?', a: 'Nein. Lupe hat keine Erkennung in der Cloud, keine Telemetrie und keine Update-Prüfung und speichert nie ein Bild. Nur der Verlauf liegt lokal pro Benutzer – oder ist abgeschaltet.' },
      { q: 'Läuft Lupe unter Linux und auf dem Mac?', a: 'Ja, es gibt Pakete für Linux (x64 und arm64, X11 und Wayland) und für macOS ab Version 12. Beide sind neuer und weniger getestet als die Windows-Fassung.' },
      { q: 'Ist Lupe kostenlos?', a: 'Ja, Lupe ist {lizenz}.{download}' },
    ],
    aka: ['QR-Code-Leser', 'QR-Scanner für den PC', 'Barcode-Scanner-Software', 'Barcodeleser', 'Data-Matrix-Leser', 'Webcam als Tastaturweiche'],
    trademarks: 'QR Code ist eine eingetragene Marke der DENSO WAVE INCORPORATED. Windows ist eine Marke der Microsoft-Unternehmensgruppe, macOS eine Marke von Apple Inc.',
  },
  en: {
    operatingSystem: 'Windows 10 (version 1809 or later), Windows 11, Linux (x64, arm64), macOS 12 or later',
    softwareRequirements: 'Windows 10 version 1809 or later (x64), Linux x64/arm64 with X11 or Wayland, macOS 12 or later',
    title: 'QR code & barcode reader for the PC – Lupe',
    description: 'Lupe reads QR codes and barcodes on your PC – any screen region by hotkey, webcam, image files or the clipboard – and copies, types or opens the result. Offline.',
    kind: 'QR code and barcode reader for the PC',
    tagline: 'Every code, from anywhere.',
    lead: 'Lupe is a QR code and barcode reader for Windows, Linux and macOS: it reads codes from a webcam, from any part of the screen, from image files and from the clipboard – and copies the content, types it into the window you were working in, or opens it as a link. Lupe works offline and is {lizenz}.',
    sections: [
      {
        id: 'why',
        title: 'Scan a QR code on your PC – without a phone',
        blocks: [
          { type: 'p', text: 'QR codes and barcodes often sit exactly where a phone does not help: in a PDF invoice, an e-mail, a web page, a video call or on a delivery note next to the PC. Lupe reads them right on the computer and hands the content on to where it is needed – the clipboard, keyboard input into a form, or a link.' },
        ],
      },
      {
        id: 'screen',
        title: 'Read a QR code from the screen',
        blocks: [
          { type: 'p', text: 'Press Win+Shift+Q in any program and drag a rectangle around the code – across all monitors, also with the Lupe window closed. A click without dragging takes the whole monitor, Esc cancels; on the Mac the shortcut is ⌘+⌥+Q. Small codes on big screens are found through an overview plus overlapping tiles in full resolution, and if needed in a thorough second pass.' },
        ],
      },
      {
        id: 'webcam',
        title: 'Webcam as a barcode scanner',
        blocks: [
          { type: 'p', text: 'Hold a code in front of the camera: Lupe marks it and beeps. With typing switched on, the webcam works like a hand scanner and types every code into the program in front, such as Excel or an ERP form. The same code is reported again only after it has been out of sight for three seconds.' },
        ],
      },
      {
        id: 'files',
        title: 'Codes from images, screenshots or the clipboard',
        blocks: [
          { type: 'p', text: 'Open an image, drag it onto the Datei page or press Ctrl+V: Lupe finds every code in the picture and numbers it in reading order. PNG, JPEG, BMP, GIF, TIFF, ICO and JPEG XR work out of the box; on Windows, WebP, HEIC, AVIF and JPEG XL work with the matching image extension from the Microsoft Store.' },
        ],
      },
      {
        id: 'features',
        title: 'Type, copy or open as a link',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Typing independent of the keyboard layout', text: 'Unicode keyboard input: umlauts, € and emoji arrive as they are – in the window that was active before the scan, optionally followed by Enter or Tab.' },
              { title: 'Link rules', text: 'A regular expression and an optional prefix turn a code into a link, e.g. an EAN into the item page of your ERP. Only http and https are ever opened; behind a prefix with a host, the host stays fixed.' },
              { title: 'Every code in the picture', text: 'Several codes are reported in reading order. After a screen scan you pick one or copy them all, one per line.' },
              { title: 'History with CSV export', text: 'Everything Lupe has read, searchable and exportable as CSV for Excel – stored per user, or switched off, which deletes the file.' },
              { title: 'Command line', text: '`Lupe.exe lesen *.png` prints one line per code (format, tab, content) with exit codes for scripts – without a window and without storing anything.' },
              { title: 'Notification area and autostart', text: 'Lupe keeps running in the notification area with its shortcut active; optionally it starts with Windows.' },
            ],
          },
        ],
      },
      {
        id: 'formats',
        title: 'Supported formats',
        blocks: [
          { type: 'p', text: '22 formats through the zxing-cpp library: QR Code, Micro QR Code, rMQR, Data Matrix, Aztec, PDF417, MicroPDF417, MaxiCode, Code 128 (including GS1-128), Code 39, Code 93, Codabar, ITF (including ITF-14), EAN-13, EAN-8, UPC-A, UPC-E, GS1 DataBar, GS1 DataBar Expanded, GS1 DataBar Limited, Telepen and the DX code on 35 mm film.' },
          { type: 'p', text: 'Light codes on dark backgrounds – dark mode, displays – are read by the screen scan, from files, the clipboard and the command line; the camera reads light 2D codes.' },
        ],
      },
    ],
    requirements: [
      ['Windows', 'Windows 10 version 1809 or later, or Windows 11, x64 – MSI, single Lupe.exe or ZIP'],
      ['Linux', 'x64 and arm64, X11 and Wayland – .deb for Debian and Ubuntu, or tar.gz'],
      ['macOS', 'macOS 12 or later, Apple Silicon and Intel – Lupe.app'],
      ['.NET', 'included in every package except the framework ZIP'],
      ['Camera', 'optional; on Windows any webcam that Windows offers to apps'],
      ['Language', 'English and German, follows the system language'],
    ],
    limits: [
      'Pre-release 0.1.0, not code-signed: SmartScreen and Gatekeeper warn on first start.',
      'The camera path is tested against a simulated frame source only, not with a real webcam.',
      'Linux and macOS are new and less tested than Windows; the macOS build has not run on a real Mac yet. On Wayland, the screen scan, typing and the shortcut go through the desktop portals, which not every desktop offers.',
      'Lupe cannot type into a program that runs as administrator – it detects this and says so.',
      'Control characters are not typed, e.g. the group separator in GS1 codes. EAN/UPC add-ons are not part of the result; Intelligent Mail, MSI, Pharmacode and Plessey are not supported.',
    ],
    faq: [
      { q: 'How do I scan a QR code on my PC without a phone?', a: 'With Lupe, press Win+Shift+Q and drag a rectangle around the code on the screen – or hold the code in front of the webcam. The content goes to the clipboard and, if you like, is typed as keyboard input or opened as a link.' },
      { q: 'Can I read a QR code from a screenshot, a PDF or an image file?', a: 'Yes. Open image files or drag them onto the Datei page, paste screenshots with Ctrl+V. Codes in an open PDF or e-mail are read directly by the screen scan.' },
      { q: 'Can I use my webcam as a barcode scanner that types into Excel (keyboard wedge)?', a: 'Yes. With typing switched on for the camera, Lupe types every code like a hand scanner into the program in front, optionally followed by Enter or Tab.' },
      { q: 'Which barcode formats does Lupe read?', a: '22 formats, including QR Code, Data Matrix, Aztec, PDF417, Code 128 with GS1-128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF-14 and GS1 DataBar.' },
      { q: 'What happens when there are several codes in one picture?', a: 'Lupe finds all of them and reports them in reading order. After a screen scan you pick one or copy them all, one per line.' },
      { q: 'Are my images or scans sent to the internet?', a: 'No. Lupe has no cloud recognition, no telemetry and no update check, and never stores an image. Only the history is kept locally per user – or switched off.' },
      { q: 'Does Lupe run on Linux and macOS?', a: 'Yes, there are packages for Linux (x64 and arm64, X11 and Wayland) and for macOS 12 or later. Both are newer and less tested than the Windows version.' },
      { q: 'Is Lupe free?', a: 'Yes, Lupe is {lizenz}.{download}' },
    ],
    aka: ['QR code reader for PC', 'QR scanner for Windows', 'barcode reader software', 'webcam barcode scanner', 'Data Matrix reader', 'keyboard wedge for a webcam'],
    facts: [
      ['Platform', 'Windows 10 (1809 or later) and 11, Linux (x64, arm64; X11 and Wayland), macOS 12 or later'],
      ['User interface', 'English and German, follows the system language'],
      ['Data', 'stays on the computer, nothing is sent to the internet'],
      ['Formats', '22 formats, including QR Code, Data Matrix, Code 128, EAN-13 and PDF417'],
      ['Delivery', 'MSI or single Lupe.exe (Windows), .deb and tar.gz (Linux), Lupe.app (macOS)'],
    ],
    trademarks: 'QR Code is a registered trademark of DENSO WAVE INCORPORATED. Windows is a trademark of the Microsoft group of companies, macOS a trademark of Apple Inc.',
  },
};

export default page;
