// EnterpriseBrowser – Kiosk-Browser für robuste Android-Geräte (MDE-Geräte), zum Beispiel von Zebra und Honeywell.
// Quellen (ict-baden/EnterpriseBrowser): README.md (Features, Quick start, Vorlagen inkl. SAP ITS mobile, Web-Entwickler,
// MIT), docs/configuration.md (allowList inkl. Subdomains, Kiosk, DataWedge-Profil, Tasten nach dem Scan),
// docs/web-integration.md (Web-Apps ohne Änderung, input/change, React/Vue, Meta-Tags, JavaScript-API),
// docs/deployment.md (Managed Configuration config_json, Datei, /enterprise/usr, StageNow, QR-Code),
// docs/data-and-privacy.md, docs/play-store.md (kostenlos, keine Werbung, keine In-App-Käufe), CHANGELOG.md
// (0.5.0, Test auf Zebra HC20, Formular-POSTs außerhalb der Allowlist gestoppt, Release-Signatur).
// Nicht behaupten: Kompatibilität mit Zebra EB/RhoElements, Offline-Modus, Honeywell-Gerätetest, SAP-Zertifizierung,
// dass die Allowlist auch Unterressourcen (Skripte, Bilder, iframes, XHR) blockiert – sie gilt für Navigationen im
// Hauptfenster und Formular-POSTs (docs/configuration.md „Applies to main-frame navigations“, BrowserActivity.kt).
// Name: rechtlich prüfen lassen (Verwechslungsgefahr mit „Enterprise Browser“ von Zebra und Honeywell). Bis dahin
// stehen Zebra und Honeywell nicht in Titel, H1, Kategorie und Produktlinie, nur als Kompatibilität im Text.
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'enterprisebrowser',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android 8.0 oder neuer',
  softwareRequirements: 'Android 8.0 (API 26) oder neuer',
  uiLanguages: ['en', 'de', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/enterprisebrowser/releases/tag/latest',
    source: 'https://github.com/ict-baden/enterprisebrowser',
  },
  related: ['industrialkeyboard', 'qr-scanner'],
  privacyApp: 'enterprisebrowser',
  de: {
    title: 'EnterpriseBrowser – Kiosk-Browser für Android-MDE-Geräte',
    description: 'Kiosk-Browser für robuste Android-Geräte, etwa von Zebra und Honeywell: Scans per DataWedge direkt ins Webformular, URL-Allowlist, Kioskmodus, MDM-Konfiguration.',
    lead: 'EnterpriseBrowser ist ein Kiosk-Browser für robuste Android-Geräte (MDE-Geräte), zum Beispiel von Zebra und Honeywell: Er öffnet Ihre Web-Apps, schreibt Barcode-Scans direkt in das aktive Eingabefeld und lässt sich per MDM zentral konfigurieren. Für Android 8.0 oder neuer, {lizenz}.',
    independence: 'EnterpriseBrowser ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden.',
    sections: [
      {
        id: 'wofuer',
        title: 'Web-Apps auf MDE-Geräten – mit Scanner',
        blocks: [
          { type: 'p', text: 'Wareneingang, Kommissionierung oder Versand laufen oft als Web-App. Auf einem Handheld mit eingebautem Scanner braucht es dafür einen Browser, der den Scan ins richtige Feld bringt, nur erlaubte Seiten öffnet und sich nicht von jedem verstellen lässt. Dafür ist EnterpriseBrowser gebaut: ein schlanker Kiosk-Browser auf Basis von Android WebView, geschrieben in Kotlin.' },
        ],
      },
      {
        id: 'scannen',
        title: 'Barcode-Scan direkt ins Webformular',
        blocks: [
          { type: 'p', text: 'Scans von Zebra DataWedge, von Honeywell oder von jeder Scanner-App per Intent schreibt EnterpriseBrowser wie eine Tastatureingabe in das aktive Feld, auf Wunsch gefolgt von Tab oder Enter – und meldet sie zusätzlich als JavaScript-Ereignis. Vorhandene Web-Apps funktionieren ohne Änderung: input- und change-Ereignisse werden ausgelöst, auch React und Vue übernehmen den Wert. Beim Start legt die App ein eigenes DataWedge-Profil an und lässt die Decoder-Einstellungen in Ruhe.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Funktionen',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Profile', text: 'Start-Adresse, erlaubte Hosts, User-Agent, Viewport und Farben je Profil – mehrere Web-Apps auf einem Gerät, auf Wunsch mit Autostart.' },
              { title: 'Kioskmodus', text: 'Werkzeugleiste und Systemleisten ausblenden, Beenden ausblenden oder mit Kennwort schützen, Lock-Task-Modus als dediziertes Gerät (Device Owner).' },
              { title: 'URL-Allowlist', text: 'Mit einer Allowlist öffnet der Browser nur Seiten erlaubter Hosts samt Subdomains; Navigationen und Formular-POSTs zu anderen Hosts werden gestoppt, bevor sie laden.' },
              { title: 'Für Web-Entwickler', text: 'Die Meta-Tags `scanner` und `ScannerNavigate` steuern das Scannen je Seite; eine JavaScript-API für Scanner, Ton und Vibration gibt es nur für erlaubte Hosts.' },
              { title: 'Tastatur und Tasten', text: 'Bildschirmtastatur nur bei Bedarf, Hardwaretasten umbelegen, Hotkeys und Makros wie `{F1}` oder `{TAB}`.' },
              { title: 'Eigenes CSS und JavaScript', text: 'Eigenes CSS, JavaScript oder HTML in fremde Web-Apps einfügen – passend zur Adresse, ohne Flackern.' },
              { title: 'Eigenes Design', text: 'Titel, Untertitel, Logo, Markenfarbe und Farben je Profil – per Konfiguration oder direkt in der App. Klare Fehlerseiten mit Codes in der Markenfarbe.' },
              { title: 'Sicherheit', text: 'Strenge TLS-Prüfung, Client-Zertifikate, Kennwörter nur als PBKDF2-Hash; Konfigurations-Broadcasts nur mit Admin-Kennwort oder auf EMM-verwalteten Geräten.' },
            ],
          },
        ],
      },
      {
        id: 'verteilen',
        title: 'Verteilung per MDM: SOTI MobiControl, Intune, Workspace ONE, StageNow',
        blocks: [
          { type: 'p', text: 'Die APK verteilen Sie über Ihr MDM oder per adb. Die Konfiguration kommt als Managed Configuration aus jedem Android-Enterprise-EMM (Schlüssel `config_json`), als Datei `enterprisebrowser.json` – auf Zebra-Geräten auch dauerhaft unter `/enterprise/usr` –, per StageNow-Intent oder als QR-Code. Für SOTI MobiControl gibt es eine Schritt-für-Schritt-Anleitung.' },
          { type: 'p', text: 'Fertige Vorlagen gibt es für eine einzelne Web-App, den vollen Kioskmodus, mehrere Profile mit eigenem Design, Injektionen mit Tastenbelegung und SAP ITS mobile mit Enter nach jedem Scan.' },
        ],
      },
    ],
    requirements: [
      ['Betriebssystem', 'Android 8.0 oder neuer'],
      ['Scanner', 'Zebra DataWedge, Honeywell (Intent-API des Data Collection Service) oder jede Scanner-App per Intent'],
      ['Getestet', 'auf einem Zebra HC20 mit Android 15 und DataWedge'],
      ['Verteilung', 'APK per MDM oder adb; Google Play ist vorbereitet'],
      ['Sprache', 'Englisch, Deutsch, Spanisch, Französisch, Chinesisch'],
    ],
    limits: [
      'Dokumentiert getestet auf echter Hardware ist ein Zebra HC20 (Android 15, DataWedge). Ein Test auf einem Honeywell-Gerät ist noch nicht dokumentiert.',
      'Die Bildschirmfotos sind aus dem Code der Oberfläche gerendert, nicht auf einem Gerät fotografiert.',
      'Google Play ist vorbereitet, aber noch nicht veröffentlicht.',
      'Die JavaScript-API gibt es nur auf erlaubten Hosts und nicht auf Nicht-Standard-Ports.',
    ],
    faq: [
      { q: 'Welcher Browser eignet sich für Web-Apps auf Zebra-MDE-Geräten mit DataWedge?', a: 'Ein Kiosk-Browser, der DataWedge-Scans in die Web-App bringt. EnterpriseBrowser legt dafür beim Start ein eigenes DataWedge-Profil an und schreibt jeden Scan in das aktive Eingabefeld, auf Wunsch mit Tab oder Enter danach.' },
      { q: 'Muss ich meine Web-App für den Scanner anpassen?', a: 'Nein. Der Scan kommt wie eine Tastatureingabe an; input- und change-Ereignisse werden ausgelöst, sodass auch React- oder Vue-Apps den Wert übernehmen. Wer mehr steuern will, nutzt das JavaScript-Ereignis, die Meta-Tags oder die JavaScript-API.' },
      { q: 'Wie sperre ich ein Android-Gerät auf eine Web-App?', a: 'Mit dem Kioskmodus: ein Profil mit Start-Adresse und Allowlist, Werkzeug- und Systemleisten ausblenden, Beenden ausblenden oder mit Kennwort schützen und – als Device Owner – den Lock-Task-Modus einschalten.' },
      { q: 'Wie verteile ich Browser und Konfiguration per SOTI MobiControl, Intune oder StageNow?', a: 'Die APK verteilen Sie über Ihr MDM. Die Konfiguration kommt als Managed Configuration (Schlüssel `config_json`), als Datei, per StageNow-Intent oder als QR-Code; für SOTI MobiControl gibt es eine Schritt-für-Schritt-Anleitung.' },
      { q: 'Läuft SAP ITS mobile im EnterpriseBrowser?', a: 'Für SAP ITS mobile gibt es eine fertige Vorlage mit Enter nach jedem Scan und gerätebreitem Viewport.' },
      { q: 'Funktioniert EnterpriseBrowser mit Honeywell-Scannern?', a: 'Ja, über die Intent-API des Honeywell Data Collection Service, außerdem mit jeder Scanner-App, die Scans per Intent sendet. Dokumentiert getestet ist bisher ein Zebra-Gerät; ein Honeywell-Test steht noch aus.' },
      { q: 'Sendet der Browser Daten an ICT Baden?', a: 'Nein. Keine Telemetrie, keine Absturzberichte, keine Update-Prüfung, kein Konto. Der Browser verbindet sich nur mit den Web-Apps, die Sie konfigurieren.' },
      { q: 'Was kostet EnterpriseBrowser?', a: 'Nichts: EnterpriseBrowser ist {lizenz}, ohne Werbung und ohne In-App-Käufe. Support mit garantierten Reaktionszeiten gibt es per Supportvertrag.{download}' },
    ],
    aka: ['Kiosk-Browser für Android', 'Kioskbrowser für MDE-Geräte', 'MDE-Browser', 'Scanner-Browser', 'Industriebrowser', 'Browser für Handscanner'],
    trademarks: 'EnterpriseBrowser ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden. Zebra, DataWedge und StageNow sind Marken von Zebra Technologies, Honeywell ist eine Marke von Honeywell International; QR Code ist eine eingetragene Marke der DENSO WAVE INCORPORATED; SOTI MobiControl, Microsoft Intune, Workspace ONE, SAP und Android sind Marken ihrer jeweiligen Inhaber. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Android 8.0 or later',
    softwareRequirements: 'Android 8.0 (API 26) or later',
    title: 'EnterpriseBrowser – kiosk browser for rugged Android devices',
    description: 'Kiosk browser for rugged Android devices, e.g. from Zebra and Honeywell: DataWedge scans go straight into web forms, URL allow list, kiosk mode, MDM configuration.',
    kind: 'Kiosk browser for rugged Android devices',
    tagline: 'Web apps on rugged Android devices.',
    lead: 'EnterpriseBrowser is a kiosk browser for rugged Android devices, for example from Zebra and Honeywell: it opens your web apps, types barcode scans straight into the focused input field and is configured centrally through your MDM. For Android 8.0 or later, {lizenz}.',
    independence: 'EnterpriseBrowser is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell.',
    sections: [
      {
        id: 'why',
        title: 'Web apps on rugged handhelds – with the scanner',
        blocks: [
          { type: 'p', text: 'Goods receipt, picking or shipping often run as web apps. On a handheld with a built-in scanner, that takes a browser that puts the scan into the right field, opens only allowed pages and cannot be changed by anyone who picks up the device. EnterpriseBrowser is built for exactly that: a lean kiosk browser based on Android WebView, written in Kotlin.' },
        ],
      },
      {
        id: 'scanning',
        title: 'Scan a barcode straight into a web form',
        blocks: [
          { type: 'p', text: 'Scans from Zebra DataWedge, Honeywell or any scanner app via intent are typed into the focused field like keyboard input, optionally followed by Tab or Enter – and reported as a JavaScript event as well. Existing web apps work without changes: input and change events fire, so React and Vue pick up the value. On start, the app creates its own DataWedge profile and leaves the decoder settings alone.' },
        ],
      },
      {
        id: 'features',
        title: 'Features',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Profiles', text: 'Start URL, allowed hosts, user agent, viewport and colours per profile – several web apps on one device, optionally opened at app start.' },
              { title: 'Kiosk mode', text: 'Hide toolbar and system bars, hide exit or protect it with a password, lock task as a dedicated device (device owner).' },
              { title: 'URL allow list', text: 'With an allow list, the browser only navigates to allowed hosts and their subdomains; navigations and form posts to other hosts are stopped before they load.' },
              { title: 'For web developers', text: 'The `scanner` and `ScannerNavigate` meta tags control scanning per page; a JavaScript API for scanner, beep and vibration is available on allowed hosts only.' },
              { title: 'Keyboard and keys', text: 'On-screen keyboard only on demand, hardware key remapping, hotkeys and macros such as `{F1}` or `{TAB}`.' },
              { title: 'Custom CSS and JavaScript', text: 'Add your own CSS, JavaScript or HTML to third-party web apps – matched by URL, without flicker.' },
              { title: 'Custom design', text: 'Title, subtitle, logo, brand colour and profile colours – via configuration or right in the app. Clear error pages with codes in the brand colour.' },
              { title: 'Security', text: 'Strict TLS checks, client certificates, passwords stored only as PBKDF2 hashes; configuration broadcasts only with the admin password or on EMM-managed devices.' },
            ],
          },
        ],
      },
      {
        id: 'deployment',
        title: 'Deployment: SOTI MobiControl, Intune, Workspace ONE, StageNow',
        blocks: [
          { type: 'p', text: 'Distribute the APK with your MDM or install it with adb. The configuration comes as a managed configuration from any Android Enterprise EMM (key `config_json`), as a file `enterprisebrowser.json` – on Zebra devices also persistently in `/enterprise/usr` –, as a StageNow intent or as a QR code. There is a step-by-step guide for SOTI MobiControl.' },
          { type: 'p', text: 'Ready-made templates cover a single web app, full kiosk mode, several profiles with custom branding, injections with key remapping, and SAP ITS mobile with Enter after each scan.' },
        ],
      },
    ],
    requirements: [
      ['Operating system', 'Android 8.0 or later'],
      ['Scanner', 'Zebra DataWedge, Honeywell (Intent API of the Data Collection Service) or any scanner app via intent'],
      ['Tested', 'on a Zebra HC20 with Android 15 and DataWedge'],
      ['Distribution', 'APK via MDM or adb; Google Play is prepared'],
      ['Language', 'English, German, Spanish, French, Chinese'],
    ],
    limits: [
      'The documented real-device test is on a Zebra HC20 (Android 15, DataWedge). A test on a Honeywell device is not documented yet.',
      'The screenshots are rendered from the UI code, not photographed on a device.',
      'Google Play is prepared but not published yet.',
      'The JavaScript API is available on allowed hosts only and not on non-default ports.',
    ],
    faq: [
      { q: 'Which browser works for web apps on Zebra devices with DataWedge?', a: 'A kiosk browser that brings DataWedge scans into the web app. EnterpriseBrowser creates its own DataWedge profile on start and types every scan into the focused input field, optionally followed by Tab or Enter.' },
      { q: 'Do I have to change my web app for the scanner?', a: 'No. The scan arrives like keyboard input; input and change events fire, so React or Vue apps pick up the value. For more control, use the JavaScript event, the meta tags or the JavaScript API.' },
      { q: 'How do I lock an Android device to a single web app?', a: 'With kiosk mode: a profile with start URL and allow list, hidden toolbar and system bars, exit hidden or password-protected and – as device owner – lock task mode.' },
      { q: 'How do I deploy browser and configuration with SOTI MobiControl, Intune or StageNow?', a: 'Distribute the APK with your MDM. The configuration comes as a managed configuration (key `config_json`), as a file, as a StageNow intent or as a QR code; there is a step-by-step guide for SOTI MobiControl.' },
      { q: 'Does SAP ITS mobile run in EnterpriseBrowser?', a: 'There is a ready-made template for SAP ITS mobile with Enter after each scan and a device-width viewport.' },
      { q: 'Does it work with Honeywell scanners?', a: 'Yes, through the Intent API of the Honeywell Data Collection Service, and with any scanner app that sends scans by intent. The documented test so far is on a Zebra device; a Honeywell test is still open.' },
      { q: 'Does the browser send data to ICT Baden?', a: 'No. No telemetry, no crash reports, no update check, no account. The browser connects only to the web apps you configure.' },
      { q: 'What does EnterpriseBrowser cost?', a: 'Nothing: EnterpriseBrowser is {lizenz}, with no ads and no in-app purchases. Support with guaranteed response times is available with a support contract.{download}' },
    ],
    aka: ['kiosk browser for Android', 'kiosk mode browser for rugged devices', 'browser for handheld computers', 'scanner browser', 'industrial browser', 'browser for barcode scanners'],
    facts: [
      ['Platform', 'Android 8.0 or later, rugged devices from Zebra and Honeywell'],
      ['Scanning', 'Zebra DataWedge, Honeywell or any scanner app via intent'],
      ['Management', 'managed configuration via MDM (SOTI, Intune, Workspace ONE), configuration file, StageNow, QR code'],
      ['Security', 'strict TLS checks, client certificates, passwords only as hashes'],
      ['User interface', 'English, German, Spanish, French, Chinese'],
    ],
    trademarks: 'EnterpriseBrowser is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell. Zebra, DataWedge and StageNow are trademarks of Zebra Technologies, Honeywell is a trademark of Honeywell International; QR Code is a registered trademark of DENSO WAVE INCORPORATED; SOTI MobiControl, Microsoft Intune, Workspace ONE, SAP and Android are trademarks of their respective owners. They are named only to describe compatibility.',
  },
};

export default page;
