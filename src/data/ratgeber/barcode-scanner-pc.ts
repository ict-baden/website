// Ratgeber „Barcode-Scanner für den PC“ – alle Wege, Barcodes und QR-Codes am PC zu lesen; das eigene Produkt ist Lupe.
// Ausrichtung (Recherche 2026-10-21): „barcode scanner for pc“ hat Hardware-Absicht, deshalb der Handscanner ehrlich vorn;
// gewinnbar sind „Webcam als Barcodescanner / Laptop-Kamera“, „QR-Code vom Bildschirm, aus Screenshot, PDF, Videocall“,
// „Tastatur-Emulation ohne Handscanner (keyboard wedge software)“, „Data Matrix am PC“, „Linux/Mac“.
// Quellen (abgerufen 2026-10-21):
// - Tastaturmodus ohne Herstellertreiber: Microsoft Learn „Keyboard and mouse HID client drivers“
//   (learn.microsoft.com/en-us/windows-hardware/drivers/hid/keyboard-and-mouse-hid-client-drivers): „Vendor drivers aren't
//   required for keyboards and mice that are compliant with the supported HID Usages …“; HID-Klassentreiber für USB und
//   Bluetooth.
// - Betriebsarten HID POS und Bluetooth SPP sowie die Kamera: Microsoft Learn „Point of Service Hardware Support“
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
// - Laser- und lineare Scanner lesen nur 1D, Matrixcodes brauchen einen 2D-Imager: Dynamsoft „Laser-Based Barcode Scanners
//   vs. 2D Imagers“ (dynamsoft.com/blog/insights/laser-barcode-scanners-vs-2d-imagers/).
// - Smartphone: Apple-Support „Scan a QR code with your iPhone or iPad“ (support.apple.com/HT208843); Apps, die das Handy
//   zum Scanner für den PC machen, brauchen ein Programm auf dem PC, ein gemeinsames Netz und eine Firewall-Freigabe
//   (Beschreibungen solcher Apps im App Store) – hier ohne Namen.
// - Data Matrix auf Arzneimittelpackungen: Delegierte Verordnung (EU) 2016/161, Art. 5.
// - Lupe: ict-baden/lupe origin/main 6ecab93 = Tag v0.1.0: README.md (Funktionen, 22 Formate, Data Matrix quadratisch und
//   rechteckig, GS1-128, GS1 DataBar, „Limits, honestly“), docs/usage.md (ab Werk nur kopieren, „Eintippen“ einschalten,
//   Kamera tippt wie ein Handscanner in das Programm vorn, Bildschirm-Scan in das Fenster davor), docs/limitations.md
//   (Kamera nur gegen eine simulierte Bildquelle getestet; verkleinerte Strichcodes „about one pixel per bar … usually not
//   readable“; keine Eingabe in Administrator-Fenster; Steuerzeichen wie das Gruppentrennzeichen werden nicht getippt, die
//   Zwischenablage behält sie; Linux und macOS weniger getestet, macOS-Build lief noch nicht auf einem echten Mac),
//   docs/data-and-privacy.md (nichts geht ins Internet); src/data/produktseiten/qr-scanner.ts.
// Nicht behaupten (wie auf der Produktseite): „tippt in jede Anwendung“, echte Webcam oder echter Mac getestet,
// Alleinstellung, QR-Codes erzeugen. Keine Fremdprodukte und keine Scanner-Marken nennen.
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
          { type: 'p', text: 'Ein Handscanner für den PC arbeitet üblicherweise als Tastatur – man spricht von Tastatur-Emulation oder „Keyboard Wedge“. Windows erkennt ihn als gewöhnliche Tastatur und bringt die nötigen Treiber selbst mit. Jeder gelesene Code kommt als Folge von Tastendrücken an, und zwar dort, wo der Cursor steht: in Excel, im Formular der Warenwirtschaft oder im Suchfeld eines Webshops. Bei vielen Geräten lässt sich einstellen, dass danach die Eingabe- oder Tab-Taste folgt.' },
          { type: 'p', text: 'Bluetooth-Modelle verbinden sich über einen eigenen Empfänger am USB-Anschluss oder direkt per Bluetooth und tippen genauso. Daneben haben viele Scanner Betriebsarten für Programme mit eigener Scanner-Anbindung, etwa eine serielle Schnittstelle oder „HID POS“. Für das Eintippen in beliebige Programme ist der Tastaturmodus der übliche Weg.' },
          { type: 'p', text: 'Beim Kauf auf die Bauart achten: Laserscanner und lineare Scanner lesen nur Strichcodes (1D) wie EAN oder Code 128. Für QR-Codes und Data Matrix braucht es einen 2D-Imager, der ein Bild des ganzen Codes aufnimmt.' },
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
          { type: 'p', text: 'In Lupe heißt diese Aktion „Eintippen“ und wird in den Einstellungen eingeschaltet; ab Werk kopiert Lupe nur in die Zwischenablage. Nach einem Bildschirm-Scan tippt Lupe in das Fenster, das vor dem Scan aktiv war. Mit der Webcam tippt es jeden erkannten Code in das Programm im Vordergrund – die Webcam arbeitet dann wie ein Handscanner. Auf Wunsch folgt Enter oder Tab. Lupe tippt per Unicode, unabhängig vom Tastaturlayout: Umlaute und Sonderzeichen kommen an, wie sie im Code stehen.' },
          { type: 'p', text: 'Zwei Grenzen: In Programme, die als Administrator laufen, kann Lupe nicht tippen – es erkennt das und meldet es. Und Steuerzeichen werden nicht getippt, etwa das Gruppentrennzeichen in GS1-Codes; in der Zwischenablage bleibt es erhalten.' },
        ],
      },
      {
        id: 'smartphone',
        title: 'Smartphone-App: praktisch unterwegs, umständlich am PC',
        toc: 'Smartphone',
        blocks: [
          { type: 'p', text: 'Die Kamera-App vieler Smartphones erkennt QR-Codes von selbst – für einen Link auf einem Plakat oder einer Verpackung ist das ideal. Wird der Inhalt aber am PC gebraucht, beginnt der Umweg: Das Ergebnis liegt auf dem Handy und muss erst per E-Mail, Chat oder Synchronisation auf den PC.' },
          { type: 'p', text: 'Apps, die das Handy zum Scanner für den PC machen, brauchen ein Gegenstück auf dem PC, in der Regel beide Geräte im selben Netzwerk und eine Freigabe in der Firewall. Das funktioniert, ist aber eine weitere Software auf zwei Geräten. Und einen Code, der schon auf dem PC-Bildschirm steht, mit dem Handy abzufotografieren, ist ein doppelter Umweg.' },
        ],
      },
      {
        id: 'data-matrix',
        title: 'Data Matrix und GS1-Codes am PC auslesen',
        toc: 'Data Matrix und GS1',
        blocks: [
          { type: 'p', text: 'Data Matrix ist der kleine quadratische 2D-Code, der zum Beispiel auf vielen Arzneimittelpackungen in der EU steht. Gelesen wird er wie ein QR-Code: mit einem 2D-fähigen Handscanner, per Webcam oder direkt vom Bildschirm, wenn er in einer PDF oder auf einem Foto steckt.' },
          { type: 'p', text: 'Lupe liest Data Matrix in quadratischer und rechteckiger Form, dazu GS1-Formate wie GS1-128 und GS1 DataBar – insgesamt 22 Formate. Bei GS1-Codes trennt ein unsichtbares Steuerzeichen die Datenfelder: Beim Kopieren bleibt es erhalten, beim Eintippen fällt es weg.' },
        ],
      },
      {
        id: 'lupe',
        title: 'Lupe: Webcam, Bildschirm und Dateien in einem Programm',
        toc: 'Lupe',
        blocks: [
          { type: 'p', text: 'Lupe ist unser QR-Code- und Barcode-Leser für Windows, Linux und macOS. Er bündelt die Wege ohne Zusatzgerät: Codes per Webcam, aus jedem Bildschirmausschnitt, aus Bilddateien und aus der Zwischenablage, in 22 Formaten von QR Code und Data Matrix bis EAN-13 und Code 128. Das Ergebnis wird kopiert, eingetippt oder per Link-Regel als Link geöffnet; alles Gelesene steht im Verlauf, mit CSV-Export für Excel. Für Skripte gibt es die Befehlszeile (`Lupe.exe lesen *.png`). Lupe arbeitet offline, ohne Telemetrie, und ist {lizenz}.' },
          { type: 'p', text: 'Ehrlich gesagt: Lupe ist eine Vorabversion (0.1.0) und noch nicht signiert – Windows SmartScreen warnt beim ersten Start. Die Kamera ist bisher nur mit einer simulierten Bildquelle getestet, nicht mit einer echten Webcam. Die Fassungen für Linux und macOS sind neuer und weniger getestet als die für Windows; die für macOS lief noch nicht auf einem echten Mac.{download}' },
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
              ['Smartphone-App', 'Smartphone', 'oft kostenlos', 'je nach App', 'ja', 'nur mit Gegenstück auf dem PC', 'je nach App'],
              ['Lupe (ICT Baden)', 'keine, Webcam optional', '{lizenz}', 'ja; per Webcam mit denselben Grenzen', 'ja', 'ja, außer in Administrator-Fenster', 'ja'],
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
              { title: 'Der Inhalt soll in Excel, ERP oder ein Formular', text: 'Ein Handscanner oder eine Software mit Tastatur-Emulation, die das Ergebnis eintippt.' },
              { title: 'Viele Bilddateien oder Scans', text: 'Eine Software, die Dateien liest; Lupe liest über die Befehlszeile auch ganze Ordner.' },
              { title: 'Unterwegs, ohne PC', text: 'Die Kamera-App des Smartphones.' },
              { title: 'Linux oder Mac statt Windows', text: 'Ein Handscanner im Tastaturmodus arbeitet auch dort als Tastatur. Als Software gibt es Lupe auch für Linux und macOS, dort neuer und weniger getestet.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Brauche ich für einen USB-Barcodescanner einen Treiber?', a: 'In der Regel nicht. Im Tastaturmodus meldet sich der Scanner als Tastatur an, und Windows bringt die nötigen Treiber selbst mit; der Code erscheint dort, wo der Cursor steht. Software oder Treiber des Herstellers braucht es nur für andere Betriebsarten, etwa wenn ein Programm den Scanner direkt ansteuert.' },
      { q: 'Kann ich die Webcam als Barcodescanner nutzen?', a: 'Ja. Unter Windows 10 und 11 erkennt schon die Kamera-App QR-Codes und Barcodes. Lupe geht weiter und tippt auf Wunsch jeden erkannten Code wie ein Handscanner in das Programm im Vordergrund. Am besten klappt es mit QR-Codes und groß gedruckten Strichcodes; für kleine Strichcodes empfiehlt sich eine Kamera mit Autofokus.' },
      { q: 'Wie lese ich einen QR-Code vom Bildschirm, ohne Handy?', a: 'Mit einer Software, die den Bildschirm ausliest. In Lupe drücken Sie Win+Umschalt+Q und ziehen ein Rechteck um den Code – in einer PDF, einer E-Mail, auf einer Webseite oder im Videocall. Der Inhalt landet in der Zwischenablage, auf Wunsch auch als Tastatureingabe im vorherigen Fenster.' },
      { q: 'Liest jeder Barcodescanner auch QR-Codes?', a: 'Nein. Laserscanner und lineare Scanner lesen nur Strichcodes (1D). Für QR-Codes und Data Matrix braucht es einen 2D-Imager, der ein Bild des ganzen Codes aufnimmt. Lupe liest beides, per Webcam, vom Bildschirm und aus Bildern.' },
      { q: 'Warum tippt der Barcodescanner falsche Zeichen, etwa Y statt Z?', a: 'Dann passt das Tastaturlayout des Scanners nicht zu dem von Windows. Mit dem Einstell-Barcode für das passende Länderlayout aus dem Handbuch stellen Sie den Scanner um. Lupe ist davon nicht betroffen, weil es per Unicode tippt.' },
      { q: 'Gibt es einen Barcode-Scanner für Linux oder den Mac?', a: 'Handscanner im Tastaturmodus arbeiten auch dort als Tastatur. Als Software gibt es Lupe auch für Linux (x64 und arm64, X11 und Wayland) und für macOS ab Version 12; beide Fassungen sind neuer und weniger getestet als die für Windows.{download}' },
    ],
    trademarks: 'QR Code ist eine eingetragene Marke der DENSO WAVE INCORPORATED. Windows und Excel sind Marken der Microsoft-Unternehmensgruppe, macOS und Mac sind Marken von Apple Inc., Linux ist eine eingetragene Marke von Linus Torvalds; Bluetooth ist eine eingetragene Marke der Bluetooth SIG, Inc., GS1 eine eingetragene Marke von GS1 AISBL. Sie werden nur genannt, um Funktionen und Kompatibilität zu beschreiben.',
  },
  en: {
    slug: 'barcode-scanner-for-pc',
    title: 'Barcode scanner for PC: hand scanner, webcam or screen?',
    description: 'Read barcodes and QR codes on a PC: USB hand scanner, webcam, straight from the screen or a phone – what each option can do, what it costs, when it fits.',
    h1: 'Barcode scanner for PC: hand scanner, webcam or screen?',
    short: 'Barcode scanner for PC',
    teaser: 'Hand scanner, webcam, screen or phone: which option fits when – compared honestly.',
    lead: 'For lots of barcodes on paper, a USB hand scanner is the simplest option: it works like a keyboard on the PC and types each code into the field where the cursor is – no extra software needed. For the occasional code, especially QR codes, and for codes that are already on the screen, software that reads from a webcam or straight from the screen is enough.',
    sections: [
      {
        id: 'hand-scanner',
        title: 'USB and Bluetooth hand scanners: the scanner as a keyboard',
        toc: 'Hand scanners',
        blocks: [
          { type: 'p', text: 'A barcode scanner for the PC usually works as a keyboard – this is called keyboard emulation or a “keyboard wedge”. Windows recognises it as an ordinary keyboard and brings the drivers it needs. Every code arrives as a series of keystrokes wherever the cursor is: in Excel, in a form of your ERP system or in the search box of a web shop. Many devices can be set to send Enter or Tab after the code.' },
          { type: 'p', text: 'Bluetooth models connect through their own receiver on a USB port or directly via Bluetooth and type the same way. Many scanners also offer modes for programs with their own scanner integration, such as a serial interface or “HID POS”. For typing into any program, keyboard mode is the usual way.' },
          { type: 'p', text: 'Check the type before you buy: laser scanners and linear scanners read only barcodes (1D) such as EAN or Code 128. QR codes and Data Matrix need a 2D imager, which takes a picture of the whole code.' },
          { type: 'p', text: 'A classic pitfall is the keyboard layout: the scanner types according to the layout it is set to. If that does not match the layout in Windows, wrong characters arrive – with a German layout, for example, Y instead of Z. The fix is the configuration barcode for the matching country layout in the scanner’s manual.' },
          { type: 'p', text: 'A hand scanner pays off when codes on paper, labels or goods are read regularly: aim, pull the trigger, done – even for many codes in a row. The price is one device per workstation.' },
        ],
      },
      {
        id: 'webcam',
        title: 'Webcam as a barcode scanner – the laptop camera included',
        toc: 'Webcam as a barcode scanner',
        blocks: [
          { type: 'p', text: 'Without extra hardware, the webcam can do the job, for example the built-in camera of a laptop: you hold the code in front of the camera, and software recognises it in the video image. On Windows 10 and 11 the Windows Camera app already has a mode for this: for a QR code it shows the link, for a barcode the text, which you can copy to the clipboard. For the occasional code, that is enough.' },
          { type: 'p', text: 'The limits lie in the camera. For the camera barcode scanner in Windows, Microsoft recommends a camera with autofocus and at least 1920 × 1440 pixels; codes with thin bars may need a higher resolution, while codes printed large also work with less. A fixed-focus webcam shows a code sharply only at one particular distance, and there it is often already small. With a barcode, the width of every single bar matters – which is why small barcodes are harder for a simple webcam than a QR code. Good light and holding the code still help.' },
          { type: 'p', text: 'If the code should go straight into a program rather than just being displayed, you need software that types like a hand scanner – see [keyboard wedge software](#typing).' },
        ],
      },
      {
        id: 'screen',
        title: 'Read a QR code from the screen: screenshot, PDF, e-mail, video call',
        toc: 'Codes on the screen',
        blocks: [
          { type: 'p', text: 'Often the code is not on paper at all but already on the screen: in a PDF invoice, an e-mail, on a web page or in a shared screen during a video call. Pointing a scanner at the monitor or holding a phone in front of it is a detour then. Software that reads straight from the screen takes the code exactly as it is displayed – no camera, no blur, no reflections.' },
          { type: 'p', text: 'In [Lupe](/en/products/lupe/) this works with a hotkey: press Win+Shift+Q in any program and drag a rectangle around the code, across all monitors; a click without dragging takes the whole monitor. Saved screenshots and images can be opened, dragged into the window or pasted from the clipboard with Ctrl+V. There is a limit here too: if a barcode is shown heavily reduced, for example in a half-size preview, the resolution is often not enough – zoom in or open the original.' },
        ],
      },
      {
        id: 'typing',
        title: 'Keyboard wedge software: type codes into Excel and forms without a hand scanner',
        toc: 'Keyboard wedge software',
        blocks: [
          { type: 'p', text: 'The big advantage of a hand scanner is that the code lands in the right field without a detour. Software can do that too: it passes the result to the program as keyboard input, as if someone had typed the code – a keyboard wedge without extra hardware.' },
          { type: 'p', text: 'In Lupe this action is called “Type” and is switched on in the settings; out of the box, Lupe only copies to the clipboard. After a screen scan, Lupe types into the window that was active before the scan. From the webcam it types every recognised code into the program in front – the webcam then works like a hand scanner. Enter or Tab can follow. Lupe types with Unicode input, independent of the keyboard layout: umlauts and special characters arrive exactly as they are in the code.' },
          { type: 'p', text: 'Two limits: Lupe cannot type into programs that run as administrator – it detects this and says so. And control characters are not typed, such as the group separator in GS1 codes; the clipboard keeps them.' },
        ],
      },
      {
        id: 'smartphone',
        title: 'Phone apps: handy on the go, awkward at the PC',
        toc: 'Smartphone',
        blocks: [
          { type: 'p', text: 'The camera app of many smartphones recognises QR codes by itself – ideal for a link on a poster or a package. But if the content is needed on the PC, the detour begins: the result is on the phone and first has to get to the PC by e-mail, chat or sync.' },
          { type: 'p', text: 'Apps that turn the phone into a scanner for the PC need a counterpart on the PC, usually both devices on the same network and an exception in the firewall. That works, but it is one more piece of software on two devices. And photographing a code with the phone that is already on the PC screen is a detour twice over.' },
        ],
      },
      {
        id: 'data-matrix',
        title: 'Reading Data Matrix and GS1 codes on a PC',
        toc: 'Data Matrix and GS1',
        blocks: [
          { type: 'p', text: 'Data Matrix is the small square 2D code found, for example, on many medicine packs in the EU. It is read like a QR code: with a 2D-capable hand scanner, with a webcam, or straight from the screen when it is in a PDF or a photo.' },
          { type: 'p', text: 'Lupe reads Data Matrix in square and rectangular form, plus GS1 formats such as GS1-128 and GS1 DataBar – 22 formats in total. In GS1 codes an invisible control character separates the data fields: copying keeps it, typing drops it.' },
        ],
      },
      {
        id: 'lupe',
        title: 'Lupe: webcam, screen and files in one program',
        toc: 'Lupe',
        blocks: [
          { type: 'p', text: 'Lupe is our QR code and barcode reader for Windows, Linux and macOS. It brings together the options that need no extra device: codes from a webcam, from any part of the screen, from image files and from the clipboard, in 22 formats from QR Code and Data Matrix to EAN-13 and Code 128. The result is copied, typed or opened as a link through a link rule; everything read is kept in a history with CSV export for Excel. For scripts there is a command line (`Lupe.exe read *.png`). Lupe works offline, without telemetry, and is {lizenz}.' },
          { type: 'p', text: 'Honestly: Lupe is a pre-release (0.1.0) and not code-signed yet – Windows SmartScreen warns on first start. The camera has been tested against a simulated frame source only, not with a real webcam. The Linux and macOS versions are newer and less tested than the Windows one; the macOS build has not run on a real Mac yet.{download}' },
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
              ['USB or Bluetooth hand scanner', 'scanner per workstation', 'buying the device', 'yes', 'only with a 2D imager', 'yes, as a keyboard', 'yes'],
              ['Webcam with software', 'webcam, often built in', 'depends on the software', 'limited, small codes are hard', 'yes', 'depends on the software', 'depends on the software'],
              ['Software for screen and files', 'none', 'depends on the software', 'yes, if shown large enough', 'yes', 'depends on the software', 'depends on the software'],
              ['Phone app', 'smartphone', 'often free', 'depends on the app', 'yes', 'only with a counterpart on the PC', 'depends on the app'],
              ['Lupe (ICT Baden)', 'none, webcam optional', '{lizenz}', 'yes; from the webcam with the same limits', 'yes', 'yes, except into administrator windows', 'yes'],
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
              { title: 'Many codes on paper, labels or goods', text: 'A hand scanner in keyboard mode. If QR or Data Matrix codes come up too, a model with a 2D imager.' },
              { title: 'Now and then a QR code on paper', text: 'The webcam is enough: the Windows Camera app to display it, software such as Lupe if the result should be processed right away.' },
              { title: 'The code is already on the screen', text: 'Software that reads straight from the screen – in Lupe with Win+Shift+Q, without a camera or a phone.' },
              { title: 'The content should go into Excel, an ERP system or a form', text: 'A hand scanner, or keyboard wedge software that types the result.' },
              { title: 'Many image files or scans', text: 'Software that reads files; Lupe’s command line also reads whole folders.' },
              { title: 'On the go, without a PC', text: 'The smartphone’s camera app.' },
              { title: 'Linux or Mac instead of Windows', text: 'A hand scanner in keyboard mode works as a keyboard there too. As software, Lupe is also available for Linux and macOS, where it is newer and less tested.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Do I need a driver for a USB barcode scanner?', a: 'Usually not. In keyboard mode the scanner registers as a keyboard, and Windows brings the drivers it needs; the code appears wherever the cursor is. The manufacturer’s software or driver is only needed for other modes, for example when a program controls the scanner directly.' },
      { q: 'Can I use my webcam as a barcode scanner?', a: 'Yes. On Windows 10 and 11 the Windows Camera app already recognises QR codes and barcodes. Lupe goes further and, if you switch it on, types every recognised code into the program in front, like a hand scanner. It works best with QR codes and barcodes printed large; for small barcodes a camera with autofocus is recommended.' },
      { q: 'How do I read a QR code from my screen without a phone?', a: 'With software that reads the screen. In Lupe, press Win+Shift+Q and drag a rectangle around the code – in a PDF, an e-mail, on a web page or in a video call. The content goes to the clipboard and, if you like, is typed into the previous window.' },
      { q: 'Can every barcode scanner read QR codes?', a: 'No. Laser scanners and linear scanners read only barcodes (1D). QR codes and Data Matrix need a 2D imager that takes a picture of the whole code. Lupe reads both, from a webcam, the screen and images.' },
      { q: 'Why does my barcode scanner type the wrong characters?', a: 'Usually because the scanner’s keyboard layout does not match the one in Windows – with a German layout, for example, Y and Z are swapped. The configuration barcode for the matching country layout in the scanner’s manual fixes it. Lupe is not affected because it types with Unicode input.' },
      { q: 'Is there a barcode scanner for Linux or Mac?', a: 'Hand scanners in keyboard mode work as a keyboard there too. As software, Lupe is also available for Linux (x64 and arm64, X11 and Wayland) and for macOS 12 or later; both versions are newer and less tested than the Windows one.{download}' },
    ],
    trademarks: 'QR Code is a registered trademark of DENSO WAVE INCORPORATED. Windows and Excel are trademarks of the Microsoft group of companies, macOS and Mac are trademarks of Apple Inc., Linux is a registered trademark of Linus Torvalds; Bluetooth is a registered trademark of Bluetooth SIG, Inc., GS1 a registered trademark of GS1 AISBL. They are named only to describe features and compatibility.',
  },
};

export default guide;
