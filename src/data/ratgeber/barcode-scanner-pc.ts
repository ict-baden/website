// Ratgeber „Barcode-Scanner für den PC“ – die gängigen Wege, Barcodes und QR-Codes am PC zu lesen; das eigene Produkt ist
// Lupe. Ausrichtung (Recherche 2026-10-21): „barcode scanner for pc“ hat Hardware-Absicht, deshalb der Handscanner ehrlich
// vorn; gewinnbar sind „Webcam als Barcodescanner / Laptop-Kamera“, „QR-Code vom Bildschirm, aus Screenshot, PDF,
// Videocall“, „Tastatur-Emulation ohne Handscanner (keyboard wedge software)“, „Data Matrix am PC“, „Linux/Mac“.
// Quellen (abgerufen 2026-10-21):
// - Tastaturmodus ohne Herstellertreiber: Microsoft Learn „Keyboard and mouse HID client drivers“
//   (learn.microsoft.com/en-us/windows-hardware/drivers/hid/keyboard-and-mouse-hid-client-drivers): „Vendor drivers aren't
//   required for keyboards and mice that are compliant with the supported HID Usages …“; HID-Klassentreiber für USB und
//   Bluetooth.
// - Betriebsart „HID POS“ mit Treiber von Windows, Herstellertreiber nur für Scanner ohne diesen Standard, Bluetooth SPP,
//   Kamera: Microsoft Learn „Point of Service Hardware Support“
//   (learn.microsoft.com/en-us/windows/apps/develop/devices-sensors/pos/device-support): „It is recommended that you use a
//   camera that supports Auto Focus and a minimum resolution of 1920 x 1440. Some lower resolution cameras can read
//   standard barcodes if the barcode is printed large enough. Barcodes with thinner elements may require higher resolution
//   cameras.“
// - Fixfokus: Raymond Chen (Microsoft), The Old New Thing, 2020-11-30 (devblogs.microsoft.com/oldnewthing/20201130-00/
//   ?p=104495): eine Kamera mit festem Fokus liefert nur im richtigen Abstand ein scharfes Bild, und dort ist der Code klein;
//   Autofokus-Kameras schneiden deutlich besser ab.
// - Kamera-App von Windows 10 und 11 liest QR-Codes (Link) und Barcodes (Text zum Kopieren): support.microsoft.com
//   „How to use the Windows Camera app“.
// - Tastaturlayout: Zebra-Support DS2200-Serie („If Windows is configured for a region's local keyboard and does not use an
//   English keyboard layout, transferred barcode data may appear inaccurate“ → Einstellbarcode für das Länderlayout);
//   Enter bzw. Tab nach dem Code per Einstellbarcode: Zebra LS1203 Quick Start Guide.
// - Laser- und lineare Scanner lesen Strichcodes, manche auch PDF417, Matrixcodes (QR, Data Matrix) brauchen einen
//   2D-Imager: Dynamsoft „Laser-Based Barcode Scanners vs. 2D Imagers“ (dynamsoft.com/blog/insights/
//   laser-barcode-scanners-vs-2d-imagers/).
// - Smartphone: Apple-Support „Scan a QR code with your iPhone or iPad“ (support.apple.com/HT208843). Apps, die das Handy
//   zum Scanner für den PC machen: über das lokale Netz mit einem Programm auf dem PC (Herstellerseite barcodetopc.com:
//   „Data is transmitted privately over your LAN“, Tastatur-Emulation am PC) oder als Bluetooth-Tastatur ab Android 9 ohne
//   Software auf dem PC (F-Droid, dev.fabik.bluetoothhid: „works by utilizing the Bluetooth HID feature accessible on
//   devices running Android 9 or later“, „No special software on the receiving side required“) – hier ohne Namen.
// - Data Matrix auf Arzneimittelpackungen: Delegierte Verordnung (EU) 2016/161, Art. 5.
// - Lupe: ict-baden/lupe origin/main 637ff77 (Release v0.1.1): README.md (Funktionen, 22 Formate, Data Matrix quadratisch
//   und rechteckig, GS1-128 mit Gruppentrennzeichen nach Feldern variabler Länge, GS1 DataBar Expanded in Klammern,
//   „Limits, honestly“: nicht signiert; auf einem echten Mac bisher nur gestartet, Bildschirmscan, Eintippen, Tastenkürzel
//   und echte Kamera dort ungetestet), docs/usage.md (ab Werk nur kopieren, „Eintippen“ einschalten, Kamera tippt wie ein
//   Handscanner in das Programm vorn, Bildschirmscan in das Fenster davor), docs/limitations.md (Kamera nur gegen eine
//   simulierte Bildquelle getestet; Kamerabild um 1280 × 720, keine Steuerung von Fokus und Belichtung, keine hellen
//   Strichcodes auf dunklem Grund; verkleinerte Strichcodes „about one pixel per bar … usually not readable“; keine Eingabe
//   in Administrator-Fenster; Programme, die rohe Tastencodes lesen, nehmen die Unicode-Eingabe womöglich nicht an;
//   Steuerzeichen werden nicht getippt, die Zwischenablage behält sie; Wayland über Desktop-Portale), docs/command-line.md
//   (Muster wie C:\Scans\*.png, kein Ordner), docs/data-and-privacy.md (nichts geht ins Internet);
//   src/data/produktseiten/qr-scanner.ts. Version und Status kommen aus products.json ({version}).
// Nicht behaupten (wie auf der Produktseite): „tippt in jede Anwendung“, echte Webcam oder Funktionen auf einem echten Mac
// getestet, Alleinstellung, QR-Codes erzeugen. Keine Fremdprodukte und keine Scanner-Marken nennen.
import type { Guide } from '../../lib/ratgeber';

const guide: Guide = {
  id: 'barcode-scanner-pc',
  product: 'qr-scanner',
  published: '2026-10-21',
  de: {
    slug: 'barcode-scanner-pc',
    title: 'Barcode-Scanner für den PC: Handscanner oder Webcam?',
    description: 'Barcodes und QR-Codes am PC lesen: USB-Handscanner, Webcam, direkt vom Bildschirm oder per Handy – was jeder Weg kann, was er kostet, was wann passt.',
    h1: 'Barcode-Scanner für den PC: Handscanner, Webcam oder Bildschirm?',
    short: 'Barcode-Scanner für den PC',
    teaser: 'Handscanner, Webcam, Bildschirm oder Smartphone: welcher Weg wann passt – ehrlich verglichen.',
    lead: 'Für viele Barcodes von Papier ist ein USB-Handscanner der einfachste Weg: Er arbeitet am PC wie eine Tastatur und tippt jeden Code in das Feld, in dem der Cursor steht – ohne zusätzliche Software. Für gelegentliche Codes, vor allem QR-Codes, und für Codes, die schon auf dem Bildschirm stehen, genügt eine Software, die per Webcam oder direkt vom Bildschirm liest.',
    sections: [
      {
        id: 'handscanner',
        title: 'USB- und Bluetooth-Handscanner: der Scanner als Tastatur',
        toc: 'Handscanner',
        blocks: [
          { type: 'p', text: 'Ein Handscanner für den PC arbeitet üblicherweise als Tastatur – man spricht von Tastatur-Emulation oder „Keyboard Wedge“. Windows erkennt ihn als gewöhnliche Tastatur und bringt die nötigen Treiber selbst mit. Jeder gelesene Code kommt als Folge von Tastendrücken an, und zwar dort, wo der Cursor steht: in Excel, im Formular der Warenwirtschaft oder im Suchfeld eines Webshops. Bei vielen Geräten lässt sich einstellen, dass danach die Enter- oder Tab-Taste folgt.' },
          { type: 'p', text: 'Bluetooth-Modelle verbinden sich über einen eigenen Empfänger am USB-Anschluss oder direkt per Bluetooth und tippen genauso. Daneben haben viele Scanner Betriebsarten für Programme mit eigener Scanner-Anbindung, etwa eine serielle Schnittstelle oder „HID POS“. Für das Eintippen in beliebige Programme ist der Tastaturmodus der übliche Weg.' },
          { type: 'p', text: 'Beim Kauf auf die Bauart achten: Laserscanner und lineare Scanner lesen Strichcodes (1D) wie EAN oder Code 128, manche auch gestapelte Codes wie PDF417 – QR-Codes und Data Matrix aber nicht. Dafür braucht es einen 2D-Imager, der ein Bild des ganzen Codes aufnimmt.' },
          { type: 'p', text: 'Eine typische Stolperfalle ist das Tastaturlayout: Der Scanner tippt nach dem Layout, auf das er eingestellt ist. Passt es nicht zum Layout von Windows, kommen falsche Zeichen an – mit deutschem Tastaturlayout zum Beispiel Y statt Z. Abhilfe schafft der Einstell-Barcode für das passende Länderlayout aus dem Handbuch des Scanners.' },
          { type: 'p', text: 'Ein Handscanner lohnt sich, wenn regelmäßig Codes von Papier, Etiketten oder Waren gelesen werden: anvisieren, Taste drücken, fertig – auch bei vielen Codes am Stück. Dafür braucht jeder Arbeitsplatz ein eigenes Gerät.' },
        ],
      },
      {
        id: 'webcam',
        title: 'Webcam als Barcodescanner – auch die Laptop-Kamera',
        toc: 'Webcam als Barcodescanner',
        blocks: [
          { type: 'p', text: 'Ohne zusätzliches Gerät geht es mit der Webcam, etwa der eingebauten Kamera des Laptops: Man hält den Code vor die Kamera, eine Software erkennt ihn im Videobild. Unter Windows 10 und 11 hat schon die Kamera-App von Windows einen Modus dafür: Bei einem QR-Code zeigt sie den Link, bei einem Barcode den Text, den man in die Zwischenablage kopieren kann. Für einen gelegentlichen Code reicht das.' },
          { type: 'p', text: 'Die Grenzen liegen in der Kamera. Für den Kamera-Barcodescanner von Windows empfiehlt Microsoft eine Kamera mit Autofokus und mindestens 1920 × 1440 Pixeln; Codes mit dünnen Strichen können eine höhere Auflösung brauchen, groß gedruckte Codes gehen auch mit weniger. Eine Webcam mit festem Fokus zeigt den Code nur in einem bestimmten Abstand scharf, und dort ist er oft schon klein. Bei einem Strichcode kommt es auf die Breite jedes einzelnen Strichs an – kleine Strichcodes sind für eine einfache Webcam deshalb schwieriger als ein QR-Code. Gutes Licht und ein ruhig gehaltener Code helfen.' },
          { type: 'p', text: 'Soll der Code nicht nur angezeigt, sondern gleich in ein Programm übernommen werden, braucht es eine Software, die wie ein Handscanner tippt – mehr dazu unter [Tastatur-Emulation](#eintippen).' },
        ],
      },
      {
        id: 'bildschirm',
        title: 'QR-Code vom Bildschirm lesen: Screenshot, PDF, E-Mail, Videocall',
        toc: 'Codes vom Bildschirm lesen',
        blocks: [
          { type: 'p', text: 'Oft steht der Code gar nicht auf Papier, sondern schon auf dem Bildschirm: in einer PDF-Rechnung, einer E-Mail, auf einer Webseite oder im geteilten Bildschirm eines Videocalls. Dann ist es ein Umweg, einen Scanner auf den Monitor zu richten oder das Handy davorzuhalten. Eine Software, die direkt vom Bildschirm liest, nimmt den Code so, wie er angezeigt wird – ohne Kamera, ohne Unschärfe, ohne Spiegelungen.' },
          { type: 'p', text: 'In [Lupe](/produkte/lupe/) geht das per Tastenkürzel: In jedem Programm Win+Umschalt+Q drücken und ein Rechteck um den Code ziehen, über alle Monitore; ein Klick ohne Ziehen nimmt den ganzen Monitor. Gespeicherte Screenshots und Bilder öffnen Sie, ziehen sie ins Fenster oder fügen sie mit Strg+V aus der Zwischenablage ein. Eine Grenze gibt es auch hier: Ist ein Strichcode stark verkleinert, etwa in einer halb so großen Vorschau, reicht die Auflösung oft nicht – dann hineinzoomen oder das Original öffnen.' },
        ],
      },
      {
        id: 'eintippen',
        title: 'Tastatur-Emulation ohne Handscanner: Codes in Excel und Formulare tippen',
        toc: 'Tastatur-Emulation',
        blocks: [
          { type: 'p', text: 'Der große Vorteil des Handscanners ist, dass der Code ohne Umweg im richtigen Feld landet. Das kann auch Software: Sie gibt das Ergebnis als Tastatureingabe an das Programm weiter, als hätte jemand den Code getippt – eine Tastatur-Emulation ohne zusätzliches Gerät.' },
          { type: 'p', text: 'In Lupe heißt diese Aktion „Eintippen“ und wird in den Einstellungen eingeschaltet; ab Werk kopiert Lupe nur in die Zwischenablage. Nach einem Bildschirmscan tippt Lupe in das Fenster, das vor dem Scan aktiv war. Mit der Webcam tippt Lupe jeden erkannten Code in das Programm im Vordergrund – die Webcam arbeitet dann wie ein Handscanner. Auf Wunsch folgt die Enter- oder Tab-Taste. Lupe tippt per Unicode, unabhängig vom Tastaturlayout, sodass Umlaute und Sonderzeichen in einem gewöhnlichen Eingabefeld so ankommen, wie sie im Code stehen.' },
          { type: 'p', text: 'Die Grenzen: In Programme, die als Administrator laufen, kann Lupe nicht tippen – Lupe erkennt das und meldet es. Programme, die rohe Tastencodes statt Zeichen lesen, etwa manche Remote-Desktop- oder Terminal-Programme, nehmen die Unicode-Eingabe womöglich nicht an; dort hilft Kopieren. Und Steuerzeichen werden nicht getippt, etwa das Gruppentrennzeichen in GS1-Codes; in der Zwischenablage bleibt es erhalten.' },
        ],
      },
      {
        id: 'smartphone',
        title: 'Smartphone-App: praktisch unterwegs, umständlich am PC',
        toc: 'Smartphone',
        blocks: [
          { type: 'p', text: 'Die Kamera-App vieler Smartphones erkennt QR-Codes von selbst – für einen Link auf einem Plakat oder einer Verpackung ist das ideal. Wird der Inhalt aber am PC gebraucht, beginnt der Umweg: Das Ergebnis liegt auf dem Handy und muss erst per E-Mail, Chat oder Synchronisation auf den PC.' },
          { type: 'p', text: 'Apps, die das Handy zum Scanner für den PC machen, gibt es in zwei Arten: Die einen schicken die Codes über das lokale Netz an ein Programm auf dem PC, die anderen melden sich – bei Android ab Version 9 – per Bluetooth wie eine Tastatur am PC an und brauchen dort keine Software. Beides funktioniert, man hat dafür aber ein zweites Gerät in der Hand. Und einen Code, der schon auf dem PC-Bildschirm steht, mit dem Handy abzufotografieren, bleibt ein doppelter Umweg.' },
        ],
      },
      {
        id: 'data-matrix',
        title: 'Data Matrix und GS1-Codes am PC auslesen',
        toc: 'Data Matrix und GS1',
        blocks: [
          { type: 'p', text: 'Data Matrix ist der kleine quadratische 2D-Code, der zum Beispiel auf vielen Arzneimittelpackungen in der EU steht. Gelesen wird er wie ein QR-Code: mit einem 2D-fähigen Handscanner, per Webcam oder direkt vom Bildschirm, wenn er in einer PDF oder auf einem Foto steckt.' },
          { type: 'p', text: 'Lupe liest Data Matrix in quadratischer und rechteckiger Form, dazu GS1-Formate wie GS1-128 und GS1 DataBar – insgesamt 22 Formate. Bei GS1-128 trennt ein unsichtbares Steuerzeichen die Felder variabler Länge: Beim Kopieren bleibt es erhalten, beim Eintippen fällt es weg. GS1 DataBar Expanded gibt Lupe mit den Feldnummern in Klammern aus.' },
        ],
      },
      {
        id: 'lupe',
        title: 'Lupe: Webcam, Bildschirm und Dateien in einem Programm',
        toc: 'Lupe',
        blocks: [
          { type: 'p', text: 'Lupe ist unser QR-Code- und Barcode-Leser für Windows, Linux und macOS. Lupe bündelt die Wege ohne Zusatzgerät: Codes per Webcam, aus jedem Bildschirmausschnitt, aus Bilddateien und aus der Zwischenablage, in 22 Formaten von QR Code und Data Matrix bis EAN-13 und Code 128. Das Ergebnis wird kopiert, eingetippt oder per Link-Regel als Link geöffnet; alles Gelesene steht im Verlauf, mit CSV-Export für Excel. Für Skripte gibt es die Befehlszeile (`Lupe.exe lesen *.png`). Lupe arbeitet offline, ohne Telemetrie, und ist {lizenz}.' },
          { type: 'p', text: 'Ehrlich gesagt: Lupe ist eine Vorabversion ({version}) und noch nicht signiert – Windows warnt beim ersten Start. Die Kamera ist bisher nur mit einer simulierten Bildquelle getestet, nicht mit einer echten Webcam; sie nutzt ein Bild von etwa 1280 × 720 Pixeln und stellt Fokus und Belichtung nicht selbst ein, kleine Codes gehören also nah an die Kamera. Linux und macOS sind neuer und weniger getestet als Windows: Auf einem echten Mac ist Lupe bisher nur gestartet worden, Bildschirmscan, Eintippen und Tastenkürzel sind dort noch nicht erprobt; unter Wayland hängen sie von Desktop-Portalen ab, die nicht jeder Desktop anbietet.{download}' },
          { type: 'product', text: 'Webcam, Bildschirm per Tastenkürzel, Bilddateien und Zwischenablage – kopieren, eintippen oder als Link öffnen; für Windows, Linux und macOS.' },
        ],
      },
      {
        id: 'vergleich',
        title: 'Barcode-Scanner für den PC im Vergleich',
        toc: 'Vergleich',
        blocks: [
          {
            type: 'table',
            caption: 'Wege, Barcodes am PC zu lesen, im Vergleich',
            head: ['Lösung', 'Hardware', 'Kosten', 'Strichcodes (1D)', 'QR und Data Matrix (2D)', 'Tippt in Programme', 'Offline'],
            rows: [
              ['USB- oder Bluetooth-Handscanner', 'Scanner je Arbeitsplatz', 'Kauf des Geräts', 'ja', 'nur mit 2D-Imager', 'ja, als Tastatur', 'ja'],
              ['Webcam mit Software', 'Webcam, oft eingebaut', 'je nach Software', 'eingeschränkt, kleine Codes schwierig', 'ja', 'je nach Software', 'je nach Software'],
              ['Software für Bildschirm und Dateien', 'keine', 'je nach Software', 'ja, wenn groß genug angezeigt', 'ja', 'je nach Software', 'je nach Software'],
              ['Smartphone-App', 'Smartphone', 'oft kostenlos', 'je nach App', 'ja', 'nur mit passender App: über das Netz oder als Bluetooth-Tastatur', 'je nach App'],
              ['Lupe (ICT Baden)', 'keine, Webcam optional', '{lizenz}', 'ja; per Webcam eingeschränkt (Bild um 1280 × 720)', 'ja', 'ja, mit Ausnahmen wie Administrator-Fenstern', 'ja'],
            ],
            key: 4,
            note: '„Je nach Software“: Funktionen und Preise unterscheiden sich von Programm zu Programm. Die Kamera-App von Windows 10 und 11 liest QR-Codes und Barcodes per Webcam und zeigt das Ergebnis an.',
          },
        ],
      },
      {
        id: 'was-passt',
        title: 'Was passt wann?',
        blocks: [
          {
            type: 'cases',
            items: [
              { title: 'Viele Codes von Papier, Etiketten oder Waren', text: 'Ein Handscanner im Tastaturmodus. Kommen auch QR- oder Data-Matrix-Codes vor, ein Modell mit 2D-Imager.' },
              { title: 'Ab und zu ein QR-Code auf Papier', text: 'Die Webcam reicht: die Kamera-App von Windows zum Anzeigen, eine Software wie Lupe, wenn das Ergebnis gleich weiterverarbeitet werden soll.' },
              { title: 'Der Code steht schon auf dem Bildschirm', text: 'Eine Software, die direkt vom Bildschirm liest – in Lupe per Win+Umschalt+Q, ohne Kamera und ohne Handy.' },
              { title: 'Der Inhalt soll in Excel, ins ERP-System oder in ein Formular', text: 'Ein Handscanner oder eine Software mit Tastatur-Emulation, die das Ergebnis eintippt.' },
              { title: 'Viele Bilddateien oder Scans', text: 'Eine Software, die Dateien liest; Lupes Befehlszeile liest viele Bilder auf einmal, etwa alle PNG-Dateien eines Ordners.' },
              { title: 'Unterwegs, ohne PC', text: 'Die Kamera-App des Smartphones.' },
              { title: 'Linux oder Mac statt Windows', text: 'Ein Handscanner im Tastaturmodus arbeitet auch dort als Tastatur. Als Software gibt es Lupe auch für Linux und macOS, dort neuer und weniger getestet.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Brauche ich für einen USB-Barcodescanner einen Treiber?', a: 'In der Regel nicht. Im Tastaturmodus meldet sich der Scanner als Tastatur an, und Windows bringt die nötigen Treiber selbst mit; der Code erscheint dort, wo der Cursor steht. Treiber des Herstellers braucht es höchstens für besondere Betriebsarten – und selbst für „HID POS“, mit der Programme einen Scanner direkt ansteuern, hat Windows einen eigenen Treiber.' },
      { q: 'Kann ich die Webcam als Barcodescanner nutzen?', a: 'Ja. Unter Windows 10 und 11 erkennt schon die Kamera-App QR-Codes und Barcodes. Lupe kann zusätzlich jeden erkannten Code wie ein Handscanner in das Programm im Vordergrund tippen; die Kamera-Funktion von Lupe ist allerdings bisher nur mit einer simulierten Bildquelle getestet. Am besten klappt es mit QR-Codes und groß gedruckten Strichcodes; kleine Strichcodes müssen nah an die Kamera, und eine Kamera mit Autofokus hilft.' },
      { q: 'Wie lese ich einen QR-Code vom Bildschirm, ohne Handy?', a: 'Mit einer Software, die den Bildschirm ausliest. In Lupe drücken Sie Win+Umschalt+Q und ziehen ein Rechteck um den Code – in einer PDF, einer E-Mail, auf einer Webseite oder im Videocall. Der Inhalt landet in der Zwischenablage, auf Wunsch auch als Tastatureingabe im vorherigen Fenster. Lupe ist derzeit eine Vorabversion ({version}).{download}' },
      { q: 'Liest jeder Barcodescanner auch QR-Codes?', a: 'Nein. Laserscanner und lineare Scanner lesen Strichcodes (1D), aber keine QR-Codes und keine Data-Matrix-Codes – dafür braucht es einen 2D-Imager, der ein Bild des ganzen Codes aufnimmt. Lupe liest beides, per Webcam, vom Bildschirm und aus Bildern.' },
      { q: 'Warum tippt der Barcodescanner falsche Zeichen, etwa Y statt Z?', a: 'Meist passt dann das Tastaturlayout des Scanners nicht zu dem von Windows. Mit dem Einstell-Barcode für das passende Länderlayout aus dem Handbuch stellen Sie den Scanner um. Lupe tippt per Unicode und hängt deshalb nicht vom Tastaturlayout ab.' },
      { q: 'Gibt es einen Barcode-Scanner für Linux oder den Mac?', a: 'Handscanner im Tastaturmodus arbeiten auch dort als Tastatur. Als Software gibt es Lupe auch für Linux (x64 und arm64, X11 und Wayland) und für macOS ab Version 12; beide Fassungen sind neuer und weniger getestet als die für Windows, auf einem echten Mac ist Lupe bisher nur gestartet worden.{download}' },
    ],
    trademarks: 'QR Code ist eine eingetragene Marke der DENSO WAVE INCORPORATED. Microsoft, Windows und Excel sind Marken der Microsoft-Unternehmensgruppe, macOS und Mac sind Marken von Apple Inc., Android ist eine Marke von Google LLC, Linux ist eine eingetragene Marke von Linus Torvalds; Bluetooth ist eine eingetragene Marke der Bluetooth SIG, Inc., GS1 eine eingetragene Marke von GS1 AISBL, Unicode eine eingetragene Marke von Unicode, Inc. Sie werden nur genannt, um Funktionen und Kompatibilität zu beschreiben.',
  },
  en: {
    slug: 'barcode-scanner-for-pc',
    title: 'Barcode scanner for PC: handheld scanner, webcam or screen?',
    description: 'Read barcodes and QR codes on a PC: handheld USB scanner, webcam, the screen or a phone – what each option can do, what it costs, when it fits.',
    h1: 'Barcode scanner for PC: handheld scanner, webcam or screen?',
    short: 'Barcode scanner for PC',
    teaser: 'Handheld scanner, webcam, screen or phone: which option fits when – compared honestly.',
    lead: 'For lots of barcodes on paper, a USB handheld scanner is the simplest option: it works like a keyboard on the PC and types each code into the field where the cursor is – no extra software needed. For the occasional code, especially QR codes, and for codes that are already on the screen, software that reads from a webcam or straight from the screen is enough.',
    sections: [
      {
        id: 'hand-scanner',
        title: 'USB and Bluetooth handheld scanners: the scanner as a keyboard',
        toc: 'Handheld scanners',
        blocks: [
          { type: 'p', text: 'A barcode scanner for the PC usually works as a keyboard – this is called keyboard emulation or a “keyboard wedge”. Windows recognises it as an ordinary keyboard and already includes the drivers it needs. Every code arrives as a series of keystrokes wherever the cursor is: in Excel, in a form of your ERP system or in the search box of a web shop. Many devices can be set to send Enter or Tab after the code.' },
          { type: 'p', text: 'Bluetooth models connect through their own receiver on a USB port or directly via Bluetooth and type the same way. Many scanners also offer modes for programs with their own scanner integration, such as a serial interface or “HID POS”. For typing into any program, keyboard mode is the usual way.' },
          { type: 'p', text: 'Check the type before you buy: laser scanners and linear scanners read barcodes (1D) such as EAN or Code 128, some also stacked codes such as PDF417 – but not QR codes or Data Matrix. Those need a 2D imager, which takes a picture of the whole code.' },
          { type: 'p', text: 'A classic pitfall is the keyboard layout: the scanner types according to the layout it is set to. If that does not match the layout in Windows, wrong characters arrive – with a German layout, for example, Y instead of Z. The fix is the configuration barcode for the matching country layout in the scanner’s manual.' },
          { type: 'p', text: 'A handheld scanner pays off when codes on paper, labels or goods are read regularly: aim, pull the trigger, done – even for many codes in a row. The price is one device per workstation.' },
        ],
      },
      {
        id: 'webcam',
        title: 'Webcam as a barcode scanner – the laptop camera included',
        toc: 'Webcam as a barcode scanner',
        blocks: [
          { type: 'p', text: 'Without extra hardware, the webcam can do the job, for example the built-in camera of a laptop: you hold the code in front of the camera, and software recognises it in the video image. On Windows 10 and 11 the Windows Camera app already has a mode for this: for a QR code it shows the link, for a barcode the text, which you can copy to the clipboard. For the occasional code, that is enough.' },
          { type: 'p', text: 'The limits lie in the camera. For the camera barcode scanner in Windows, Microsoft recommends a camera with autofocus and at least 1920 × 1440 pixels; codes with thin bars may need a higher resolution, while codes printed large also work with less. A fixed-focus webcam shows a code sharply only at one particular distance, and there it is often already small. With a barcode, the width of every single bar matters – which is why small barcodes are harder for a simple webcam than a QR code. Good light and holding the code still help.' },
          { type: 'p', text: 'If the code should go straight into a program rather than just being displayed, you need software that types like a handheld scanner – see [keyboard wedge software](#typing).' },
        ],
      },
      {
        id: 'screen',
        title: 'Read a QR code from the screen: screenshot, PDF, e-mail, video call',
        toc: 'Codes on the screen',
        blocks: [
          { type: 'p', text: 'Often the code is not on paper at all but already on the screen: in a PDF invoice, an e-mail, on a web page or in a shared screen during a video call. In that case, pointing a scanner at the monitor or holding a phone in front of it is a detour. Software that reads straight from the screen takes the code exactly as it is displayed – no camera, no blur, no reflections.' },
          { type: 'p', text: 'In [Lupe](/en/products/lupe/) this works with a hotkey: press Win+Shift+Q in any program and drag a rectangle around the code, across all monitors; a click without dragging takes the whole monitor. Saved screenshots and images can be opened, dragged into the window or pasted from the clipboard with Ctrl+V. There is a limit here too: if a barcode is shown heavily reduced, for example in a half-size preview, the resolution is often not enough – zoom in or open the original.' },
        ],
      },
      {
        id: 'typing',
        title: 'Keyboard wedge software: type codes into Excel and forms without a handheld scanner',
        toc: 'Keyboard wedge software',
        blocks: [
          { type: 'p', text: 'The big advantage of a handheld scanner is that the code lands in the right field without a detour. Software can do that too: it passes the result to the program as keyboard input, as if someone had typed the code – a keyboard wedge without extra hardware.' },
          { type: 'p', text: 'In Lupe this action is called “Type” and is switched on in the settings; out of the box, Lupe only copies to the clipboard. After a screen scan, Lupe types into the window that was active before the scan. From the webcam it types every recognised code into the program in front – the webcam then works like a handheld scanner. Enter or Tab can follow. Lupe types with Unicode input, independent of the keyboard layout, so umlauts and special characters arrive in an ordinary input field exactly as they are in the code.' },
          { type: 'p', text: 'The limits: Lupe cannot type into programs that run as administrator – it detects this and says so. Programs that read raw key codes instead of characters, such as some remote-desktop or terminal programs, may not accept the Unicode input; copying helps there. And control characters are not typed, such as the group separator in GS1 codes; the clipboard keeps them.' },
        ],
      },
      {
        id: 'smartphone',
        title: 'Phone apps: handy on the go, awkward at the PC',
        toc: 'Smartphone',
        blocks: [
          { type: 'p', text: 'The camera app of many smartphones recognises QR codes by itself – ideal for a link on a poster or a package. But if the content is needed on the PC, the detour begins: the result is on the phone and first has to get to the PC by e-mail, chat or sync.' },
          { type: 'p', text: 'Apps that turn the phone into a scanner for the PC come in two kinds: some send the codes over the local network to a program on the PC, others – on Android 9 or later – connect to the PC via Bluetooth like a keyboard and need no software there. Both work, but you have a second device in your hand for it. And using the phone to photograph a code that is already on the PC screen remains a detour twice over.' },
        ],
      },
      {
        id: 'data-matrix',
        title: 'Reading Data Matrix and GS1 codes on a PC',
        toc: 'Data Matrix and GS1',
        blocks: [
          { type: 'p', text: 'Data Matrix is the small square 2D code found, for example, on many medicine packs in the EU. It is read like a QR code: with a 2D-capable handheld scanner, with a webcam, or straight from the screen when it is in a PDF or a photo.' },
          { type: 'p', text: 'Lupe reads Data Matrix in square and rectangular form, plus GS1 formats such as GS1-128 and GS1 DataBar – 22 formats in total. In GS1-128 an invisible control character separates fields of variable length: copying keeps it, typing drops it. GS1 DataBar Expanded is output with the field numbers in brackets.' },
        ],
      },
      {
        id: 'lupe',
        title: 'Lupe: webcam, screen and files in one program',
        toc: 'Lupe',
        blocks: [
          { type: 'p', text: 'Lupe is our QR code and barcode reader for Windows, Linux and macOS. It brings together the options that need no extra device: codes from a webcam, from any part of the screen, from image files and from the clipboard, in 22 formats from QR Code and Data Matrix to EAN-13 and Code 128. The result is copied, typed or opened as a link through a link rule; everything read is kept in a history with CSV export for Excel. For scripts there is a command line (`Lupe.exe read *.png`). Lupe works offline, without telemetry, and is {lizenz}.' },
          { type: 'p', text: 'Honestly: Lupe is a pre-release ({version}) and not code-signed yet – Windows warns on first start. The camera has been tested against a simulated frame source only, not with a real webcam; it uses a picture of about 1280 × 720 pixels and does not set focus or exposure itself, so small codes need to come close to the camera. Linux and macOS are newer and less tested than Windows: on a real Mac, Lupe has so far only been started – screen scan, typing and the hotkey have not been tried there yet; on Wayland they depend on desktop portals that not every desktop offers.{download}' },
          { type: 'product', text: 'Webcam, screen by hotkey, image files and clipboard – copy, type or open as a link; for Windows, Linux and macOS.' },
        ],
      },
      {
        id: 'comparison',
        title: 'Barcode scanners for PC compared',
        toc: 'Comparison',
        blocks: [
          {
            type: 'table',
            caption: 'Ways to read barcodes on a PC compared',
            head: ['Option', 'Hardware', 'Cost', 'Barcodes (1D)', 'QR and Data Matrix (2D)', 'Types into programs', 'Offline'],
            rows: [
              ['USB or Bluetooth handheld scanner', 'scanner per workstation', 'buying the device', 'yes', 'only with a 2D imager', 'yes, as a keyboard', 'yes'],
              ['Webcam with software', 'webcam, often built in', 'depends on the software', 'limited, small codes are hard', 'yes', 'depends on the software', 'depends on the software'],
              ['Software for screen and files', 'none', 'depends on the software', 'yes, if shown large enough', 'yes', 'depends on the software', 'depends on the software'],
              ['Phone app', 'smartphone', 'often free', 'depends on the app', 'yes', 'only with a suitable app: over the network or as a Bluetooth keyboard', 'depends on the app'],
              ['Lupe (ICT Baden)', 'none, webcam optional', '{lizenz}', 'yes; limited from the webcam (picture about 1280 × 720)', 'yes', 'yes, with exceptions such as administrator windows', 'yes'],
            ],
            key: 4,
            note: '“Depends on the software”: features and prices differ from program to program. The Windows Camera app on Windows 10 and 11 reads QR codes and barcodes from the webcam and shows the result.',
          },
        ],
      },
      {
        id: 'which',
        title: 'Which option fits when?',
        blocks: [
          {
            type: 'cases',
            items: [
              { title: 'Many codes on paper, labels or goods', text: 'A handheld scanner in keyboard mode. If QR or Data Matrix codes come up too, a model with a 2D imager.' },
              { title: 'Now and then a QR code on paper', text: 'The webcam is enough: the Windows Camera app to display it, software such as Lupe if the result should be processed right away.' },
              { title: 'The code is already on the screen', text: 'Software that reads straight from the screen – in Lupe with Win+Shift+Q, without a camera or a phone.' },
              { title: 'The content should go into Excel, an ERP system or a form', text: 'A handheld scanner, or keyboard wedge software that types the result.' },
              { title: 'Many image files or scans', text: 'Software that reads files; Lupe’s command line reads many images at once, for example all PNG files in a folder.' },
              { title: 'On the go, without a PC', text: 'The smartphone’s camera app.' },
              { title: 'Linux or Mac instead of Windows', text: 'A handheld scanner in keyboard mode works as a keyboard there too. As software, Lupe is also available for Linux and macOS, where it is newer and less tested.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Do I need a driver for a USB barcode scanner?', a: 'Usually not. In keyboard mode the scanner registers as a keyboard, and Windows already includes the drivers it needs; the code appears wherever the cursor is. A manufacturer’s driver is only needed for special modes at most – and even for “HID POS”, which programs use to control a scanner directly, Windows has its own driver.' },
      { q: 'Can I use my webcam as a barcode scanner?', a: 'Yes. On Windows 10 and 11 the Windows Camera app already recognises QR codes and barcodes. Lupe can also type every recognised code into the program in front, like a handheld scanner; its camera function has, however, only been tested against a simulated frame source so far. It works best with QR codes and barcodes printed large; small barcodes need to come close to the camera, and a camera with autofocus helps.' },
      { q: 'How do I read a QR code from my screen without a phone?', a: 'With software that reads the screen. In Lupe, press Win+Shift+Q and drag a rectangle around the code – in a PDF, an e-mail, on a web page or in a video call. The content goes to the clipboard and, if you like, is typed into the previous window. Lupe is currently a pre-release ({version}).{download}' },
      { q: 'Can every barcode scanner read QR codes?', a: 'No. Laser scanners and linear scanners read barcodes (1D), but not QR codes or Data Matrix codes – those need a 2D imager that takes a picture of the whole code. Lupe reads both, from a webcam, the screen and images.' },
      { q: 'Why does my barcode scanner type the wrong characters?', a: 'Usually because the scanner’s keyboard layout does not match the one in Windows – with a German layout, for example, Y and Z are swapped. The configuration barcode for the matching country layout in the scanner’s manual fixes it. Lupe types with Unicode input and therefore does not depend on the keyboard layout.' },
      { q: 'Is there a barcode scanner for Linux or Mac?', a: 'Handheld scanners in keyboard mode work as a keyboard there too. As software, Lupe is also available for Linux (x64 and arm64, X11 and Wayland) and for macOS 12 or later; both versions are newer and less tested than the Windows one, and on a real Mac Lupe has so far only been started.{download}' },
    ],
    trademarks: 'QR Code is a registered trademark of DENSO WAVE INCORPORATED. Microsoft, Windows and Excel are trademarks of the Microsoft group of companies, macOS and Mac are trademarks of Apple Inc., Android is a trademark of Google LLC, Linux is a registered trademark of Linus Torvalds; Bluetooth is a registered trademark of Bluetooth SIG, Inc., GS1 a registered trademark of GS1 AISBL, Unicode a registered trademark of Unicode, Inc. They are named only to describe features and compatibility.',
  },
};

export default guide;
