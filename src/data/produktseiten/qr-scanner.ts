// Lupe – QR-Code- und Barcode-Scanner für Windows, Linux und macOS.
// Quellen (ict-baden/lupe, Stand Tag v0.1.1 vom 2026-10-21): README.md (Funktionen, „And also“, Quick start, Downloads –
// .deb nur für x64, glibc 2.31, 22 Formate, nicht unterstützte Formate, fünf Sprachen, „Limits, honestly“ mit
// „Not code-signed yet“, auf einem echten Mac bisher nur gestartet, MIT), CHANGELOG.md ([0.1.1]: Befehlszeile und MSI
// englisch, Kamera-Schleife; [0.1.0] – 2026-10-21: erste Version mit Tag, englische
// Befehlsnamen `read`, Sprachen es/fr/zh-Hans maschinell übersetzt), docs/command-line.md (`lesen`/`read`, Exitcodes
// 0/1/3, `lupe` unter Linux), docs/installation.md (Windows 10 1809 / 11, Bildformate unter Windows, macOS nicht
// notarisiert), docs/platform-linux.md und docs/architecture-platforms.md (Bildformate unter Linux und macOS),
// docs/usage.md (PDF, E-Mail, Webseite, Videocall; Kamera wie ein Handscanner, Lupe dahinter oder minimiert; Eintippen
// nach dem Bildschirmscan in das Fenster von vorher), docs/settings.md („On a detected code“: Type für Kamera und
// Bildschirmausschnitt), docs/data-and-privacy.md (kein Netzwerkcode, keine Bilder gespeichert). Vergleich:
// CodeTwo-Produktseite https://www.codetwo.com/freeware/qr-code-desktop-reader/ („This tool is deprecated, which means
// it’s no longer available for download“; keine Weiterentwicklung, keine Pflege, kein Support – abgerufen 2026-10-21).
// Nicht behaupten: „tippt in jede Anwendung“ (nicht in Admin-Fenster), echte Webcam oder echter Mac getestet,
// Alleinstellung („es gibt keinen guten …“), QR-Codes erzeugen (Lupe liest nur).
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'qr-scanner',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Windows 10 (ab Version 1809), Windows 11, Linux (x64, arm64), macOS 12 oder neuer',
  softwareRequirements: 'Windows 10 Version 1809 oder neuer (x64), Linux x64/arm64 (glibc 2.31 oder neuer) mit X11 oder Wayland, macOS 12 oder neuer',
  uiLanguages: ['de', 'en', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/lupe/releases/latest',
    source: 'https://github.com/ict-baden/lupe',
  },
  related: ['labeldesigner', 'enterprisebrowser'],
  alternatives: {
    approved: true,
    names: ['CodeTwo QR Code Desktop Reader'],
    de: {
      title: 'Umstieg von CodeTwo QR Code Desktop Reader: Lupe als Alternative',
      blocks: [
        { type: 'p', text: 'Wer bisher CodeTwo QR Code Desktop Reader genutzt hat, um QR-Codes am PC vom Bildschirm oder aus Bilddateien zu lesen: Das Programm wird laut Hersteller nicht mehr zum Download angeboten und nicht mehr weiterentwickelt (Produktseite von CodeTwo, Stand Oktober 2026). Lupe erfüllt dieselbe Aufgabe und bietet:' },
        {
          type: 'list',
          items: [
            'Bildschirmscan per Tastenkürzel (Win+Umschalt+Q) über alle Monitore, auch bei geschlossenem Fenster',
            'Codes aus Bilddateien, aus der Zwischenablage und per Webcam – 22 Formate, nicht nur QR Code',
            'Ergebnis kopieren, in das vorherige Programm eintippen oder per Link-Regel als Link öffnen',
            'Windows 10 und 11, Linux und macOS; offline, ohne Telemetrie, {lizenz}',
          ],
        },
        { type: 'p', text: 'Lupe liest Codes, erzeugt aber keine – ein QR-Code-Generator ist nicht enthalten.' },
      ],
      faq: [
        { q: 'Gibt es eine kostenlose Alternative zu CodeTwo QR Code Desktop Reader?', a: 'Ja. Lupe liest QR-Codes und Barcodes vom Bildschirm, aus Bilddateien, aus der Zwischenablage und per Webcam, unter Windows, Linux und macOS, offline und {lizenz}. Anders als CodeTwo QR Code Desktop Reader & Generator erzeugt Lupe keine QR-Codes, es liest sie nur.{download}' },
      ],
      trademark: 'CodeTwo QR Code Desktop Reader ist ein Produkt von CodeTwo; CodeTwo ist eine Marke ihres Inhabers. ICT Baden steht in keiner Verbindung zu CodeTwo; der Name wird nur genannt, um den Vergleich zu beschreiben.',
    },
    en: {
      title: 'Switching from CodeTwo QR Code Desktop Reader: Lupe as an alternative',
      blocks: [
        { type: 'p', text: 'If you have been using CodeTwo QR Code Desktop Reader to read QR codes on your PC from the screen or from image files: according to its maker, the program is no longer available for download and no longer developed (CodeTwo product page, as of October 2026). Lupe does the same job and offers:' },
        {
          type: 'list',
          items: [
            'Screen scan by hotkey (Win+Shift+Q) across all monitors, also with the window closed',
            'Codes from image files, the clipboard and a webcam – 22 formats, not just QR Code',
            'Copy the result, type it into the program you came from, or open it as a link through a link rule',
            'Windows 10 and 11, Linux and macOS; offline, no telemetry, {lizenz}',
          ],
        },
        { type: 'p', text: 'Lupe reads codes but does not create them – there is no QR code generator built in.' },
      ],
      faq: [
        { q: 'Is there a free alternative to CodeTwo QR Code Desktop Reader?', a: 'Yes. Lupe reads QR codes and barcodes from the screen, image files, the clipboard and a webcam, on Windows, Linux and macOS, offline and {lizenz}. Unlike CodeTwo QR Code Desktop Reader & Generator, Lupe does not create QR codes – it only reads them.{download}' },
      ],
      trademark: 'CodeTwo QR Code Desktop Reader is a product of CodeTwo; CodeTwo is a trademark of its owner. ICT Baden is not affiliated with CodeTwo; the name is used only to describe the comparison.',
    },
  },
  de: {
    title: 'QR-Code- und Barcode-Scanner für den PC – Lupe',
    description: 'Barcode-Scanner-Software für Windows, Linux und macOS: Lupe liest QR-Codes und Barcodes am PC per Webcam, vom Bildschirm und aus Bildern – offline.',
    lead: 'Lupe ist eine Barcode-Scanner-Software für Windows, Linux und macOS: Sie liest QR-Codes und Barcodes per Webcam, aus jedem Bildschirmausschnitt, aus Bilddateien und aus der Zwischenablage – und kopiert das Ergebnis, tippt es in das Programm, aus dem Sie kamen, oder öffnet es als Link. Lupe arbeitet offline und ist {lizenz}.',
    sections: [
      {
        id: 'wofuer',
        title: 'QR-Code am PC scannen – ohne Handy',
        blocks: [
          { type: 'p', text: 'QR-Codes und Barcodes stehen oft genau dort, wo das Handy nicht weiterhilft: in einer PDF-Rechnung, in einer E-Mail, auf einer Webseite, im Videocall oder auf einem Lieferschein neben dem Rechner. Als QR-Scanner für den PC liest Lupe sie direkt und gibt den Inhalt dorthin weiter, wo er gebraucht wird – in die Zwischenablage, als Tastatureingabe in ein Formular oder als Link.' },
        ],
      },
      {
        id: 'bildschirm',
        title: 'QR-Code vom Bildschirm lesen – auch Barcodes',
        blocks: [
          { type: 'p', text: 'In jedem Programm Win+Umschalt+Q drücken und ein Rechteck um den Code ziehen – über alle Monitore, auch wenn das Lupe-Fenster geschlossen ist. Ein Klick ohne Ziehen nimmt den ganzen Monitor, Esc bricht ab; auf dem Mac ist das Kürzel ⌘+⌥+Q. Kleine Codes auf großen Bildschirmen findet Lupe über eine Übersicht und überlappende Kacheln in voller Auflösung, notfalls in einem zweiten, gründlicheren Durchgang. Genauso scannen Sie einen Barcode vom Bildschirm, etwa die EAN aus einem Webshop oder den Code 128 auf einem Lieferschein-PDF.' },
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
          { type: 'p', text: 'Bild öffnen, auf die Seite „Datei“ ziehen oder mit Strg+V einfügen: Lupe findet jeden Code im Bild und nummeriert ihn in Lesereihenfolge. Welche Bildformate gehen, hängt vom System ab: unter Windows PNG, JPEG, BMP, GIF, TIFF, ICO und JPEG XR, mit der passenden Erweiterung aus dem Microsoft Store auch WebP, HEIC, AVIF und JPEG XL; unter Linux PNG, JPEG, BMP, GIF, WebP und ICO; auf dem Mac PNG, JPEG, GIF, BMP, TIFF, HEIC, WebP und ICO.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Codes eintippen, kopieren oder als Link öffnen',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Eintippen unabhängig vom Tastaturlayout', text: 'Unicode-Tastatureingabe: Umlaute, € und Emoji kommen an, wie sie sind – in das Fenster, das vor dem Scan aktiv war, auf Wunsch gefolgt von Enter oder Tab.' },
              { title: 'Link-Regeln', text: 'Ein regulärer Ausdruck und ein Präfix machen aus einem Code einen Link, zum Beispiel aus einer EAN die Artikelseite in der Warenwirtschaft. Geöffnet werden nur http- und https-Links; hinter einem Präfix mit Host bleibt der Host fest.' },
              { title: 'Alle Codes im Bild', text: 'Mehrere Codes kommen in Lesereihenfolge. Nach einem Bildschirmscan wählen Sie einen aus oder kopieren alle, einen pro Zeile.' },
              { title: 'Verlauf mit CSV-Export', text: 'Alles Gelesene ist durchsuchbar und als CSV für Excel exportierbar – pro Benutzer gespeichert oder abgeschaltet, dann wird die Datei gelöscht.' },
              { title: 'Befehlszeile', text: '`Lupe.exe lesen *.png` (oder `read`; unter Linux `lupe lesen`) gibt eine Zeile pro Code aus (Format, Tab, Inhalt), mit den Exitcodes 0, 1 und 3 für Skripte – ohne Fenster und ohne etwas zu speichern.' },
              { title: 'Infobereich und Autostart', text: 'Lupe läuft im Infobereich weiter, das Tastenkürzel bleibt aktiv; auf Wunsch startet Lupe mit Windows.' },
            ],
          },
        ],
      },
      {
        id: 'formate',
        title: 'Unterstützte Formate: QR Code, Data Matrix und Barcodes',
        blocks: [
          { type: 'p', text: '22 Formate über die Bibliothek zxing-cpp: QR Code, Micro QR Code, rMQR, Data Matrix, Aztec, PDF417, MicroPDF417, MaxiCode, Code 128 (auch GS1-128), Code 39, Code 93, Codabar, ITF (auch ITF-14), EAN-13, EAN-8, UPC-A, UPC-E, GS1 DataBar, GS1 DataBar Expanded, GS1 DataBar Limited, Telepen und der DX-Code auf 35-mm-Film.' },
          { type: 'p', text: 'Helle Codes auf dunklem Grund – Dark Mode, Displays – liest Lupe beim Bildschirmscan, aus Dateien, der Zwischenablage und der Befehlszeile; die Kamera liest helle 2D-Codes.' },
        ],
      },
    ],
    requirements: [
      ['Windows', 'Windows 10 ab Version 1809 oder Windows 11, x64 – MSI, einzelne Lupe.exe oder ZIP'],
      ['Linux', 'x64 und arm64, X11 und Wayland, glibc 2.31 oder neuer (ab Ubuntu 20.04, Debian 11) – .deb (x64) für Debian und Ubuntu, tar.gz für x64 und arm64'],
      ['macOS', 'ab macOS 12, Apple Silicon und Intel – Lupe.app (noch nicht notarisiert)'],
      ['.NET', 'in allen Paketen enthalten, außer im Framework-ZIP'],
      ['Kamera', 'optional; unter Windows jede Webcam, die Windows den Apps anbietet'],
      ['Sprache', 'Deutsch und Englisch; Spanisch, Französisch und Chinesisch (vereinfacht) maschinell übersetzt, noch nicht gegengelesen – folgt der Systemsprache, umschaltbar'],
    ],
    limits: [
      'Vorabversion 0.1.1, nicht signiert und unter macOS nicht notarisiert: SmartScreen und Gatekeeper warnen beim ersten Start.',
      'Die Kamera ist bisher nur gegen eine simulierte Bildquelle getestet, nicht mit einer echten Webcam.',
      'Linux und macOS sind neu und weniger getestet als Windows; auf einem echten Mac ist Lupe bisher nur gestartet (Fenster, Demokamera, Befehlszeile) – Bildschirmscan, Eintippen, Tastenkürzel und eine echte Kamera sind dort noch nicht ausprobiert. Unter Wayland laufen Bildschirmscan, Eintippen und Tastenkürzel über die Desktop-Portale, die nicht jeder Desktop anbietet.',
      'In Programme, die als Administrator laufen, kann Lupe nicht tippen – es erkennt das und sagt es.',
      'Steuerzeichen werden nicht getippt, etwa das Gruppentrennzeichen in GS1-Codes. Zusatzcodes von EAN und UPC sind nicht Teil des Ergebnisses; Intelligent Mail, MSI, Pharmacode und Plessey werden nicht gelesen.',
    ],
    faq: [
      { q: 'Wie scanne ich einen QR-Code am PC ohne Handy?', a: 'Mit Lupe drücken Sie Win+Umschalt+Q und ziehen ein Rechteck um den Code auf dem Bildschirm – oder halten den Code vor die Webcam. Der Inhalt landet in der Zwischenablage, auf Wunsch auch als Tastatureingabe oder als geöffneter Link.' },
      { q: 'Kann ich Barcodes am PC ohne Barcode-Scanner scannen?', a: 'Ja. Lupe macht die Webcam zum Barcodeleser: Mit der Aktion „Eintippen“ arbeitet sie wie ein Handscanner und tippt jeden erkannten Code in das Programm im Vordergrund. Codes auf dem Bildschirm, etwa in einer PDF, liest der Bildschirmscan ganz ohne Scanner und Kamera: Win+Umschalt+Q drücken (auf dem Mac ⌘+⌥+Q), ein Rechteck um den Code ziehen – auf Wunsch tippt Lupe den Inhalt in das Fenster, aus dem Sie kamen.' },
      { q: 'Kann ich einen QR-Code aus einem Screenshot, einer PDF oder einem Bild auslesen?', a: 'Ja. Bilddateien öffnen oder auf die Seite „Datei“ ziehen, Screenshots mit Strg+V einfügen. Codes in einer geöffneten PDF oder E-Mail liest der Bildschirmscan direkt.' },
      { q: 'Kann ich die Webcam als Barcodescanner nutzen, der in Excel oder ins ERP tippt?', a: 'Ja. Mit der Aktion „Eintippen“ für die Kamera arbeitet die Webcam als Tastaturweiche: Lupe tippt jeden erkannten Code in das Programm im Vordergrund, auf Wunsch mit Enter oder Tab danach – auch wenn Lupe selbst dahinter liegt oder minimiert ist.' },
      { q: 'Welche Barcode-Formate liest Lupe – auch Data Matrix?', a: 'Ja, Lupe ist auch ein Data-Matrix-Leser: 22 Formate, darunter QR Code, Micro QR, Data Matrix, Aztec, PDF417, Code 128 mit GS1-128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF-14 und GS1 DataBar.' },
      { q: 'Was passiert, wenn mehrere Codes auf einem Bild sind?', a: 'Lupe findet alle und meldet sie in Lesereihenfolge. Nach einem Bildschirmscan wählen Sie einen aus oder kopieren alle, einen pro Zeile.' },
      { q: 'Werden meine Bilder oder Scans ins Internet geschickt?', a: 'Nein. Lupe hat keine Erkennung in der Cloud, keine Telemetrie und keine Update-Prüfung und speichert nie ein Bild. Nur der Verlauf liegt lokal pro Benutzer – oder ist abgeschaltet.' },
      { q: 'Läuft Lupe unter Linux und auf dem Mac?', a: 'Ja, es gibt Pakete für Linux (x64 und arm64, X11 und Wayland) und für macOS ab Version 12. Beide sind neuer und weniger getestet als die Windows-Fassung.' },
      { q: 'Gibt es einen kostenlosen QR-Code-Leser für Windows, der offline arbeitet?', a: 'Ja. Lupe ist ein QR-Code-Scanner für Windows 10 und 11, Linux und macOS, arbeitet vollständig offline und ist {lizenz}.{download}' },
    ],
    aka: ['QR-Code-Leser', 'QR-Code-Scanner für Windows', 'QR-Scanner für den PC', 'Barcode-Scanner-Software', 'Barcodeleser', 'Data-Matrix-Leser', 'Webcam als Tastaturweiche'],
    trademarks: 'QR Code ist eine eingetragene Marke der DENSO WAVE INCORPORATED. Windows, Excel und Microsoft Store sind Marken der Microsoft-Unternehmensgruppe, macOS und Mac sind Marken von Apple Inc.; Linux ist eine eingetragene Marke von Linus Torvalds, Ubuntu eine Marke von Canonical Ltd., Debian eine eingetragene Marke von Software in the Public Interest, Inc.; GS1 ist eine eingetragene Marke von GS1 AISBL. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Windows 10 (version 1809 or later), Windows 11, Linux (x64, arm64), macOS 12 or later',
    softwareRequirements: 'Windows 10 version 1809 or later (x64), Linux x64/arm64 (glibc 2.31 or later) with X11 or Wayland, macOS 12 or later',
    title: 'QR code & barcode scanner for PC – Lupe',
    description: 'Barcode scanner software for Windows, Linux and macOS: Lupe reads QR codes and barcodes on the PC from a webcam, the screen or image files – offline.',
    kind: 'QR code and barcode scanner for the PC',
    tagline: 'Every code, from anywhere.',
    lead: 'Lupe is barcode scanner software for Windows, Linux and macOS: it reads QR codes and barcodes from a webcam, from any part of the screen, from image files and from the clipboard – and copies the content, types it into the window you were working in, or opens it as a link. Lupe works offline and is {lizenz}.',
    sections: [
      {
        id: 'why',
        title: 'Scan a QR code on your PC – without a phone',
        blocks: [
          { type: 'p', text: 'QR codes and barcodes often sit exactly where a phone does not help: in a PDF invoice, an e-mail, a web page, a video call or on a delivery note next to the computer. As a QR code reader for PC, Lupe reads them directly and hands the content on to where it is needed – the clipboard, keyboard input into a form, or a link.' },
        ],
      },
      {
        id: 'screen',
        title: 'Read a QR code from the screen – and barcodes too',
        blocks: [
          { type: 'p', text: 'Press Win+Shift+Q in any program and drag a rectangle around the code – across all monitors, also with the Lupe window closed. A click without dragging takes the whole monitor, Esc cancels; on the Mac the shortcut is ⌘+⌥+Q. Small codes on big screens are found through an overview plus overlapping tiles in full resolution, and if needed in a thorough second pass. You scan a barcode from the screen the same way, for example the EAN in a web shop or the Code 128 on a delivery note PDF.' },
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
          { type: 'p', text: 'Open an image, drag it onto the File page or press Ctrl+V: Lupe finds every code in the picture and numbers it in reading order. Which image formats work depends on the system: on Windows PNG, JPEG, BMP, GIF, TIFF, ICO and JPEG XR, plus WebP, HEIC, AVIF and JPEG XL with the matching image extension from the Microsoft Store; on Linux PNG, JPEG, BMP, GIF, WebP and ICO; on the Mac PNG, JPEG, GIF, BMP, TIFF, HEIC, WebP and ICO.' },
        ],
      },
      {
        id: 'features',
        title: 'Type, copy or open codes as links',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Typing independent of the keyboard layout', text: 'Unicode keyboard input: umlauts, € and emoji arrive as they are – in the window that was active before the scan, optionally followed by Enter or Tab.' },
              { title: 'Link rules', text: 'A regular expression and an optional prefix turn a code into a link, e.g. an EAN into the item page of your ERP. Only http and https are ever opened; behind a prefix with a host, the host stays fixed.' },
              { title: 'Every code in the picture', text: 'Several codes are reported in reading order. After a screen scan you pick one or copy them all, one per line.' },
              { title: 'History with CSV export', text: 'Everything Lupe has read, searchable and exportable as CSV for Excel – stored per user, or switched off, which deletes the file.' },
              { title: 'Command line', text: '`Lupe.exe read *.png` (or `lesen`; on Linux `lupe read`) prints one line per code (format, tab, content) with exit codes 0, 1 and 3 for scripts – without a window and without storing anything.' },
              { title: 'Notification area and autostart', text: 'Lupe keeps running in the notification area with its shortcut active; optionally it starts with Windows.' },
            ],
          },
        ],
      },
      {
        id: 'formats',
        title: 'Supported formats: QR Code, Data Matrix and barcodes',
        blocks: [
          { type: 'p', text: '22 formats through the zxing-cpp library: QR Code, Micro QR Code, rMQR, Data Matrix, Aztec, PDF417, MicroPDF417, MaxiCode, Code 128 (including GS1-128), Code 39, Code 93, Codabar, ITF (including ITF-14), EAN-13, EAN-8, UPC-A, UPC-E, GS1 DataBar, GS1 DataBar Expanded, GS1 DataBar Limited, Telepen and the DX code on 35 mm film.' },
          { type: 'p', text: 'Light codes on dark backgrounds – dark mode, displays – are read by the screen scan, from files, the clipboard and the command line; the camera reads light 2D codes.' },
        ],
      },
    ],
    requirements: [
      ['Windows', 'Windows 10 version 1809 or later, or Windows 11, x64 – MSI, single Lupe.exe or ZIP'],
      ['Linux', 'x64 and arm64, X11 and Wayland, glibc 2.31 or later (Ubuntu 20.04, Debian 11 and newer) – .deb (x64) for Debian and Ubuntu, tar.gz for x64 and arm64'],
      ['macOS', 'macOS 12 or later, Apple Silicon and Intel – Lupe.app (not yet notarised)'],
      ['.NET', 'included in every package except the framework ZIP'],
      ['Camera', 'optional; on Windows any webcam that Windows offers to apps'],
      ['Language', 'English and German; Spanish, French and Chinese (simplified) machine-translated, not yet reviewed – follows the system language, can be switched'],
    ],
    limits: [
      'Pre-release 0.1.1, not code-signed and not notarised on macOS: SmartScreen and Gatekeeper warn on first start.',
      'The camera path is tested against a simulated frame source only, not with a real webcam.',
      'Linux and macOS are new and less tested than Windows; on a real Mac, Lupe has so far only been started (window, demo camera, command line) – the screen scan, typing, the shortcut and a real camera are untested there. On Wayland, the screen scan, typing and the shortcut go through the desktop portals, which not every desktop offers.',
      'Lupe cannot type into a program that runs as administrator – it detects this and says so.',
      'Control characters are not typed, e.g. the group separator in GS1 codes. EAN/UPC add-ons are not part of the result; Intelligent Mail, MSI, Pharmacode and Plessey are not supported.',
    ],
    faq: [
      { q: 'How do I scan a QR code on my PC without a phone?', a: 'With Lupe, press Win+Shift+Q and drag a rectangle around the code on the screen – or hold the code in front of the webcam. The content goes to the clipboard and, if you like, is typed as keyboard input or opened as a link.' },
      { q: 'Can I scan barcodes on a PC without a barcode scanner?', a: 'Yes. Lupe can serve as a webcam barcode scanner: with typing switched on, the webcam works like a hand scanner and types every recognised code into the program in front. Codes on the screen, such as in a PDF, are read without a scanner or camera at all: press Win+Shift+Q (⌘+⌥+Q on the Mac) and drag a rectangle around the code – if you like, Lupe types the content into the window you came from.' },
      { q: 'Can I read a QR code from a screenshot, a PDF or an image file?', a: 'Yes. Open image files or drag them onto the File page, paste screenshots with Ctrl+V. Codes in an open PDF or e-mail are read directly by the screen scan.' },
      { q: 'Can I use my webcam as a barcode scanner that types into Excel (keyboard wedge)?', a: 'Yes. With typing switched on for the camera, Lupe works as a webcam keyboard wedge and types every code into the program in front, optionally followed by Enter or Tab – also while Lupe itself is behind that program or minimised.' },
      { q: 'Which barcode formats does Lupe read – does it work as a Data Matrix reader?', a: 'Yes, Lupe is a Data Matrix reader too: 22 formats, including QR Code, Micro QR, Data Matrix, Aztec, PDF417, Code 128 with GS1-128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF-14 and GS1 DataBar.' },
      { q: 'What happens when there are several codes in one picture?', a: 'Lupe finds all of them and reports them in reading order. After a screen scan you pick one or copy them all, one per line.' },
      { q: 'Are my images or scans sent to the internet?', a: 'No. Lupe has no cloud recognition, no telemetry and no update check, and never stores an image. Only the history is kept locally per user – or switched off.' },
      { q: 'Does Lupe run on Linux and macOS?', a: 'Yes, there are packages for Linux (x64 and arm64, X11 and Wayland) and for macOS 12 or later. Both are newer and less tested than the Windows version.' },
      { q: 'Is there a free QR code reader for Windows that works offline?', a: 'Yes. Lupe is a QR code scanner for Windows 10 and 11, Linux and macOS, works entirely offline and is {lizenz}.{download}' },
    ],
    aka: ['QR code reader for PC', 'QR code scanner for Windows', 'barcode scanner software', 'webcam barcode scanner', 'Data Matrix reader', 'webcam keyboard wedge'],
    facts: [
      ['Platform', 'Windows 10 (1809 or later) and 11, Linux (x64, arm64; X11 and Wayland), macOS 12 or later'],
      ['User interface', 'English and German; Spanish, French and Chinese (simplified) machine-translated'],
      ['Data', 'stays on the computer, nothing is sent to the internet'],
      ['Formats', '22 formats, including QR Code, Data Matrix, Code 128, EAN-13 and PDF417'],
      ['Delivery', 'MSI or single Lupe.exe (Windows), .deb (x64) and tar.gz (Linux), Lupe.app (macOS)'],
    ],
    trademarks: 'QR Code is a registered trademark of DENSO WAVE INCORPORATED. Windows, Excel and Microsoft Store are trademarks of the Microsoft group of companies, macOS and Mac are trademarks of Apple Inc.; Linux is a registered trademark of Linus Torvalds, Ubuntu a trademark of Canonical Ltd., Debian a registered trademark of Software in the Public Interest, Inc.; GS1 is a registered trademark of GS1 AISBL. They are named only to describe compatibility.',
  },
};

export default page;
