// Industrial Kiosk Browser (früher Pforte, davor EnterpriseBrowser) – Kiosk-Browser für robuste Android-Geräte
// (MDE-Geräte), zum Beispiel von Zebra und Honeywell. Projekt-id 'industrialkioskbrowser'.
// Quellen (ict-baden/industrialkioskbrowser, früher ict-baden/EnterpriseBrowser bzw. ict-baden/pforte; letztes Release
// v0.6.1 vom 2026-10-21 unter dem Namen Pforte, mit SBOM und Prüfsummen, noch ohne APK; 0.7.0 bringt den neuen Namen):
// README.md, CHANGELOG.md (Unreleased: neuer Name, Paket de.ictbaden.industrialkioskbrowser, industrialkioskbrowser.json,
// window.IndustrialKioskBrowser, Ereignis industrialkioskbrowser:scan, Fehlercodes IKB-…; 0.6.0/0.6.1), docs/configuration.md,
// docs/web-integration.md, docs/deployment.md, docs/limitations.md, docs/data-and-privacy.md, docs/play-store.md,
// tools/screenshots/README.md. Keine einzelnen Testgeräte nennen (Till 2026-10-22).
// Nicht behaupten: Kompatibilität mit Zebra EB/RhoElements (deren APIs und Konfiguration), Terminal-Emulation
// (Telnet, 5250/3270, VT), Offline-Modus, Honeywell-Gerätetest, Test anderer Zebra-Modelle, SAP-Zertifizierung, dass
// die Allowlist auch Unterressourcen (Skripte, Bilder, iframes, XHR) blockiert – sie gilt für Navigationen im
// Hauptfenster und Formular-POSTs (docs/configuration.md „Applies to main-frame navigations“, BrowserActivity.kt).
// Name: In 0.6.0 umbenannt, weil „Enterprise Browser“ ein Produktname anderer Hersteller ist (CHANGELOG). Der alte Name
// „EnterpriseBrowser“ wird nur als früherer Name unseres Produkts genannt (FAQ, lead), nie als Gattung; Fremdprodukte
// stehen ausschließlich im Abschnitt alternatives.
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'industrialkioskbrowser',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android 8.0 oder neuer',
  softwareRequirements: 'Android 8.0 (API 26) oder neuer',
  uiLanguages: ['en', 'de', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/industrialkioskbrowser/releases/latest',
    source: 'https://github.com/ict-baden/industrialkioskbrowser',
  },
  related: ['industrialkeyboard', 'qr-scanner'],
  privacyApp: 'industrial-kiosk-browser',
  alternatives: {
    approved: true,
    names: ['Ivanti Velocity', 'Zebra Enterprise Browser'],
    de: {
      title: 'Umstieg von Ivanti Velocity oder Zebra Enterprise Browser: Industrial Kiosk Browser als Alternative',
      blocks: [
        { type: 'p', text: 'Für Teams, die Web-Apps auf robusten Android-Geräten heute mit Ivanti Velocity oder dem Zebra Enterprise Browser betreiben und eine kostenlose Lösung prüfen. Industrial Kiosk Browser erfüllt dieselbe Grundaufgabe – Web-Apps im Kioskmodus öffnen und Barcode-Scans ins Webformular bringen – und ist {lizenz}.' },
        {
          type: 'list',
          items: [
            'Scans von Zebra DataWedge, Honeywell oder jeder Scanner-App per Intent landen wie Tastatureingaben im aktiven Feld, auf Wunsch mit Tab oder Enter; Web-Apps funktionieren ohne Änderung.',
            'Kioskmodus, URL-Allowlist, Profile, eigenes Design, eigenes CSS und JavaScript.',
            'Konfiguration als JSON per Managed Configuration aus jedem Android-Enterprise-EMM, als Datei, per StageNow oder QR-Code.',
            'Keine Telemetrie, kein Konto.',
          ],
        },
        { type: 'p', text: 'Ehrlich für Umsteiger: Industrial Kiosk Browser ist ein reiner Webbrowser, keine Terminal-Emulation (Telnet, 5250, 3270, VT). Die besonderen JavaScript-APIs und die Konfigurationsdateien des Zebra Enterprise Browser unterstützt Industrial Kiosk Browser nicht; Web-Apps, die darauf aufbauen, nutzen stattdessen die Tastatureingabe, das Ereignis `industrialkioskbrowser:scan` oder die JavaScript-API `window.IndustrialKioskBrowser`. Industrial Kiosk Browser ist eine Vorabversion (0.x).' },
      ],
      faq: [
        { q: 'Gibt es eine kostenlose Alternative zu Ivanti Velocity oder dem Zebra Enterprise Browser für Web-Apps?', a: 'Ja, für Web-Apps: Industrial Kiosk Browser ist ein Kiosk-Browser für robuste Android-Geräte, {lizenz}, ohne Werbung und ohne In-App-Käufe. Er bringt Scans von DataWedge, Honeywell oder per Intent ins Webformular und wird per MDM konfiguriert. Terminal-Emulation und die besonderen APIs des Zebra Enterprise Browser bietet Industrial Kiosk Browser nicht.' },
      ],
      trademark: 'Ivanti Velocity ist ein Produkt von Ivanti; Zebra Enterprise Browser ist ein Produkt von Zebra Technologies. ICT Baden steht in keiner Verbindung zu diesen Unternehmen; die Namen werden nur genannt, um den Vergleich zu beschreiben.',
    },
    en: {
      title: 'Switching from Ivanti Velocity or Zebra Enterprise Browser: Industrial Kiosk Browser as an alternative',
      blocks: [
        { type: 'p', text: 'For teams that run web apps on rugged Android devices with Ivanti Velocity or Zebra Enterprise Browser today and are looking at a free option. Industrial Kiosk Browser does the same core job – open web apps in kiosk mode and bring barcode scans into the web form – and is {lizenz}.' },
        {
          type: 'list',
          items: [
            'Scans from Zebra DataWedge, Honeywell or any scanner app via intent are typed into the focused field, optionally followed by Tab or Enter; web apps work without changes.',
            'Kiosk mode, URL allow list, profiles, custom design, custom CSS and JavaScript.',
            'Configuration as JSON via managed configuration from any Android Enterprise EMM, as a file, via StageNow or as a QR code.',
            'No telemetry, no account.',
          ],
        },
        { type: 'p', text: 'Honestly, for anyone switching: Industrial Kiosk Browser is a web browser only, not a terminal emulator (Telnet, 5250, 3270, VT). It does not support the specific JavaScript APIs or configuration files of Zebra Enterprise Browser; web apps built on them use keyboard input, the `industrialkioskbrowser:scan` event or the `window.IndustrialKioskBrowser` JavaScript API instead. Industrial Kiosk Browser is a pre-release (0.x).' },
      ],
      faq: [
        { q: 'Is there a free alternative to Ivanti Velocity or Zebra Enterprise Browser for web apps?', a: 'Yes, for web apps: Industrial Kiosk Browser is a kiosk browser for rugged Android devices, {lizenz}, with no ads and no in-app purchases. It brings scans from DataWedge, Honeywell or any scanner app via intent into the web form and is configured through your MDM. It does not offer terminal emulation or the specific APIs of Zebra Enterprise Browser.' },
      ],
      trademark: 'Ivanti Velocity is a product of Ivanti; Zebra Enterprise Browser is a product of Zebra Technologies. ICT Baden is not affiliated with these companies; the names are used only to describe the comparison.',
    },
  },
  de: {
    title: 'Industrial Kiosk Browser – Kiosk-Browser für MDE-Geräte',
    description: 'Industrial Kiosk Browser – Kiosk-Browser für Android-MDE-Geräte von Zebra und Honeywell: Barcode-Scan ins Webformular, URL-Allowlist, Kioskmodus, MDM.',
    lead: 'Industrial Kiosk Browser (früher Pforte und EnterpriseBrowser) ist ein Kiosk-Browser für Android-MDE-Geräte, zum Beispiel von Zebra und Honeywell: Er öffnet Ihre Web-Apps, schreibt Barcode-Scans direkt in das aktive Eingabefeld und lässt sich per MDM zentral konfigurieren. Für Android 8.0 oder neuer, {lizenz}.',
    independence: 'Industrial Kiosk Browser ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden.',
    sections: [
      {
        id: 'wofuer',
        title: 'Industriebrowser für Web-Apps auf MDE-Geräten – mit Scanner',
        blocks: [
          { type: 'p', text: 'Wareneingang, Kommissionierung oder Versand laufen oft als Web-App. Auf einem Handheld mit eingebautem Scanner braucht es dafür einen MDE-Browser, der den Scan ins richtige Feld bringt, nur erlaubte Seiten öffnet und sich nicht von jedem verstellen lässt. Dafür ist Industrial Kiosk Browser gebaut: ein schlanker Kiosk-Browser für Handscanner, auf Basis von Android WebView, geschrieben in Kotlin.' },
          { type: 'p', text: 'Wer von Terminal-Emulation auf Web-Apps umstellt, etwa auf SAP ITS mobile, bekommt mit Industrial Kiosk Browser den Browser für die Handhelds dazu. Industrial Kiosk Browser selbst ist ein Webbrowser, keine Terminal-Emulation.' },
        ],
      },
      {
        id: 'scannen',
        title: 'Kiosk-Browser für Zebra-Geräte: Barcode-Scan direkt ins Webformular',
        blocks: [
          { type: 'p', text: 'Scans von Zebra DataWedge, von Honeywell oder von jeder Scanner-App per Intent schreibt Industrial Kiosk Browser wie eine Tastatureingabe in das aktive Feld, auf Wunsch gefolgt von Tab oder Enter – und meldet sie zusätzlich als JavaScript-Ereignis `industrialkioskbrowser:scan`. Vorhandene Web-Apps funktionieren ohne Änderung: input- und change-Ereignisse werden ausgelöst, auch React und Vue übernehmen den Wert. Beim Start legt die App ein eigenes DataWedge-Profil „Industrial Kiosk Browser“ an und lässt die Decoder-Einstellungen in Ruhe.' },
          { type: 'p', text: 'Den allgemeinen Scan-Broadcast, den jede App senden kann, nimmt Industrial Kiosk Browser ab Werk nur auf Geräten ohne Zebra- oder Honeywell-Scanner an; die Einstellung `scanner.genericIntent` schaltet ihn überall ein oder ganz aus.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Funktionen des Kiosk-Browsers für Android',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Profile', text: 'Start-Adresse, erlaubte Hosts, User-Agent, Viewport und Farben je Profil – mehrere Web-Apps auf einem Gerät, auf Wunsch mit Autostart.' },
              { title: 'Kioskmodus', text: 'Werkzeugleiste und Systemleisten ausblenden, Beenden ausblenden oder mit Kennwort schützen, Lock-Task-Modus als dediziertes Gerät (Device Owner).' },
              { title: 'URL-Allowlist', text: 'Mit einer Allowlist öffnet der Browser nur Seiten erlaubter Hosts samt Subdomains; Navigationen und Formular-POSTs zu anderen Hosts werden gestoppt, bevor sie laden.' },
              { title: 'Für Web-Entwickler', text: 'Die Meta-Tags `scanner` und `ScannerNavigate` steuern das Scannen je Seite; die JavaScript-API `window.IndustrialKioskBrowser` für Scanner, Ton, Vibration und Hinweise gibt es nur für erlaubte Hosts.' },
              { title: 'Tastatur und Tasten', text: 'Bildschirmtastatur nur bei Bedarf, Hardwaretasten umbelegen, Hotkeys und Makros wie `{F1}` oder `{TAB}`.' },
              { title: 'Eigenes CSS und JavaScript', text: 'Eigenes CSS, JavaScript oder HTML in fremde Web-Apps einfügen – passend zur Adresse, ohne Flackern.' },
              { title: 'Eigenes Design', text: 'Titel, Untertitel, Logo, Markenfarbe und Farben je Profil – per Konfiguration oder direkt in der App. Klare Fehlerseiten mit Codes wie `PFT-0001` in der Markenfarbe.' },
              { title: 'Sicherheit', text: 'Strenge TLS-Prüfung, Client-Zertifikate, Kennwörter nur als PBKDF2-Hash; Konfiguration von anderen Apps nur mit Admin-Kennwort oder auf EMM-verwalteten Geräten, nach 5 Fehlversuchen 15 Minuten Sperre. Jedes Release enthält eine SBOM (CycloneDX).' },
            ],
          },
        ],
      },
      {
        id: 'verteilen',
        title: 'Verteilung per MDM: SOTI MobiControl, Intune, Workspace ONE, StageNow',
        blocks: [
          { type: 'p', text: 'Die APK verteilen Sie über Ihr MDM oder per adb. Die Konfiguration kommt als Managed Configuration aus jedem Android-Enterprise-EMM (Schlüssel `config_json`), als Datei `industrialkioskbrowser.json` – auf Zebra-Geräten auch dauerhaft unter `/enterprise/usr` –, per StageNow-Intent oder als QR-Code. Für SOTI MobiControl gibt es eine Schritt-für-Schritt-Anleitung.' },
          { type: 'p', text: 'Fertige Vorlagen gibt es für eine einzelne Web-App, den vollen Kioskmodus, mehrere Profile mit eigenem Design, Injektionen mit Tastenbelegung und SAP ITS mobile mit Enter nach jedem Scan.' },
        ],
      },
    ],
    requirements: [
      ['Betriebssystem', 'Android 8.0 oder neuer'],
      ['Scanner', 'Zebra DataWedge, Honeywell (Intent-API des Data Collection Service) oder jede Scanner-App per Intent'],
      ['Verteilung', 'APK per MDM oder adb; Google Play ist vorbereitet'],
      ['Sprache', 'Englisch und Deutsch; Spanisch, Französisch und Chinesisch maschinell übersetzt'],
    ],
    limits: [
      'Die Honeywell-Anbindung folgt der dokumentierten Intent-API des Herstellers und ist noch nicht auf einem Honeywell-Gerät geprüft; Android 8–10 ist nur per Unit-Tests abgedeckt.',
      'Eine leere Allowlist erlaubt jeden Host – auf Kioskgeräten immer eine Allowlist setzen.',
      'Bewusst fürs Intranet: Einfaches HTTP und vom Nutzer installierte CA-Zertifikate werden akzeptiert, die JavaScript-API gibt es auch für http-Seiten erlaubter Hosts. Wo möglich HTTPS verwenden.',
      'Echter Kioskmodus (Lock Task) braucht ein EMM im Modus „dediziertes Gerät“ (Device Owner); sonst blendet Industrial Kiosk Browser nur das Beenden aus.',
      'Die JavaScript-API fehlt auf Servern mit Nicht-Standard-Port; Scans, Scan-Ereignis und Meta-Tags funktionieren dort.',
      'Umbenennung in 0.7.0 (vorher Pforte bzw. EnterpriseBrowser): Android sieht den Industrial Kiosk Browser als neue App – kein Update an Ort und Stelle; Konfiguration neu ausrollen, alte App entfernen.',
      'Bis der Signaturschlüssel für den neuen Paketnamen eingerichtet ist, enthalten Releases SBOM und Prüfsummen, aber keine APK. Google Play ist vorbereitet, aber noch nicht veröffentlicht.',
      'Version 0.x: Einstellungen, JSON-Format und JavaScript-API können sich noch ändern. Spanisch, Französisch und Chinesisch sind maschinell übersetzt.',
      'Die Bildschirmfotos sind aus dem Code der Oberfläche gerendert und in einen neutralen Geräterahmen gesetzt, nicht auf einem Gerät fotografiert.',
    ],
    faq: [
      { q: 'Welcher Kiosk-Browser eignet sich für Web-Apps auf Zebra-Geräten mit DataWedge?', a: 'Ein Kiosk-Browser, der DataWedge-Scans in die Web-App bringt. Industrial Kiosk Browser legt dafür beim Start ein eigenes DataWedge-Profil an und schreibt jeden Scan in das aktive Eingabefeld, auf Wunsch mit Tab oder Enter danach.' },
      { q: 'Muss ich meine Web-App für den Scanner anpassen?', a: 'Nein. Der Scan kommt wie eine Tastatureingabe an; input- und change-Ereignisse werden ausgelöst, sodass auch React- oder Vue-Apps den Wert übernehmen. Wer mehr steuern will, nutzt das Ereignis `industrialkioskbrowser:scan`, die Meta-Tags oder die JavaScript-API `window.IndustrialKioskBrowser`.' },
      { q: 'Wie sperre ich ein Android-Gerät auf eine Web-App?', a: 'Mit dem Kioskmodus: ein Profil mit Start-Adresse und Allowlist, Werkzeug- und Systemleisten ausblenden, Beenden ausblenden oder mit Kennwort schützen und – als Device Owner – den Lock-Task-Modus einschalten.' },
      { q: 'Wie verteile ich Browser und Konfiguration per SOTI MobiControl, Intune oder StageNow?', a: 'Die APK verteilen Sie über Ihr MDM. Die Konfiguration kommt als Managed Configuration (Schlüssel `config_json`), als Datei `industrialkioskbrowser.json`, per StageNow-Intent oder als QR-Code; für SOTI MobiControl gibt es eine Schritt-für-Schritt-Anleitung.' },
      { q: 'Wir stellen von Terminal-Emulation auf Web-Apps um – eignet sich Industrial Kiosk Browser dafür?', a: 'Für die Web-Apps ja: Industrial Kiosk Browser bringt Scans ins Webformular, sperrt das Gerät auf die Anwendung und wird per MDM verteilt. Für SAP ITS mobile gibt es eine fertige Vorlage mit Enter nach jedem Scan und gerätebreitem Viewport. Eine Terminal-Emulation für Hosts, die noch nicht umgestellt sind, ist Industrial Kiosk Browser nicht.' },
      { q: 'Funktioniert Industrial Kiosk Browser mit Honeywell-Scannern?', a: 'Ja, über die Intent-API des Honeywell Data Collection Service, außerdem mit jeder Scanner-App, die Scans per Intent sendet. Ein Test auf einem Honeywell-Gerät steht noch aus.' },
      { q: 'Sendet der Browser Daten an ICT Baden?', a: 'Nein. Keine Telemetrie, keine Absturzberichte, keine Update-Prüfung, kein Konto. Der Browser verbindet sich nur mit den Web-Apps, die Sie konfigurieren, und den Seiten, zu denen sie führen. Die Android System WebView prüft Adressen wie üblich mit Google Safe Browsing.' },
      { q: 'Hieß der Industrial Kiosk Browser früher anders?', a: 'Ja. Bis Version 0.5.0 hieß er EnterpriseBrowser, in den Versionen 0.6.x Pforte. Seit 0.7.0 heißt er Industrial Kiosk Browser, passend zu Industrial Keyboard, mit dem Paketnamen `de.ictbaden.industrialkioskbrowser`. Android und das EMM sehen ihn deshalb als neue App: den Industrial Kiosk Browser verteilen, die Konfiguration neu ausrollen (gleiches JSON-Format, Datei jetzt `industrialkioskbrowser.json`) und die alte App entfernen. Mit dem Namen geändert haben sich JavaScript-API, Scan-Ereignis, DataWedge-Profil und Fehlercodes (`IKB-…`, gleiche Nummern wie `PFT-…` und `EB-…`).' },
      { q: 'Was kostet Industrial Kiosk Browser?', a: 'Nichts: Industrial Kiosk Browser ist {lizenz}, ohne Werbung und ohne In-App-Käufe. Support mit garantierten Reaktionszeiten gibt es per Supportvertrag.{download}' },
    ],
    aka: ['Kiosk-Browser für Android', 'Kiosk-Browser für Zebra-Geräte', 'Industriebrowser', 'MDE-Browser', 'Browser für Handscanner'],
    trademarks: 'Industrial Kiosk Browser ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden. Zebra, DataWedge und StageNow sind Marken von Zebra Technologies, Honeywell ist eine Marke von Honeywell International; QR Code ist eine eingetragene Marke der DENSO WAVE INCORPORATED; SOTI MobiControl, Microsoft Intune, Workspace ONE, SAP und Android sind Marken ihrer jeweiligen Inhaber. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Android 8.0 or later',
    softwareRequirements: 'Android 8.0 (API 26) or later',
    title: 'Industrial Kiosk Browser – kiosk browser for rugged Android',
    description: 'Industrial Kiosk Browser – kiosk browser for rugged Android devices from Zebra and Honeywell: barcode scans into web forms, allow list, kiosk mode, MDM.',
    kind: 'Kiosk browser for rugged Android devices',
    tagline: 'Web apps on rugged Android devices.',
    lead: 'Industrial Kiosk Browser (formerly Pforte and EnterpriseBrowser) is a kiosk browser for rugged Android devices, for example from Zebra and Honeywell: it opens your web apps, types barcode scans straight into the focused input field and is configured centrally through your MDM. For Android 8.0 or later, {lizenz}.',
    independence: 'Industrial Kiosk Browser is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell.',
    sections: [
      {
        id: 'why',
        title: 'An industrial browser for web apps on rugged handhelds',
        blocks: [
          { type: 'p', text: 'Goods receipt, picking or shipping often run as web apps. On a handheld with a built-in scanner, that takes a browser that puts the scan into the right field, opens only allowed pages and cannot be changed by anyone who picks up the device. Industrial Kiosk Browser is built for exactly that: a lean kiosk browser for handheld computers, based on Android WebView and written in Kotlin.' },
          { type: 'p', text: 'Replacing terminal emulation with web apps, for example SAP ITS mobile? Industrial Kiosk Browser is the browser for the handhelds. It is a web browser itself, not a terminal emulator.' },
        ],
      },
      {
        id: 'scanning',
        title: 'Kiosk browser for Zebra devices: scan a barcode straight into a web form',
        blocks: [
          { type: 'p', text: 'Scans from Zebra DataWedge, Honeywell or any scanner app via intent are typed into the focused field like keyboard input, optionally followed by Tab or Enter – and reported as the JavaScript event `industrialkioskbrowser:scan` as well. Existing web apps work without changes: input and change events fire, so React and Vue pick up the value. On start, the app creates its own DataWedge profile “Industrial Kiosk Browser” and leaves the decoder settings alone.' },
          { type: 'p', text: 'The generic scan broadcast, which any app can send, is accepted by default only on devices without a Zebra or Honeywell scanner; the `scanner.genericIntent` setting turns it on everywhere or off completely.' },
        ],
      },
      {
        id: 'features',
        title: 'Features of the kiosk browser for Android',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Profiles', text: 'Start URL, allowed hosts, user agent, viewport and colours per profile – several web apps on one device, optionally opened at app start.' },
              { title: 'Kiosk mode', text: 'Hide toolbar and system bars, hide exit or protect it with a password, lock task as a dedicated device (device owner).' },
              { title: 'URL allow list', text: 'With an allow list, the browser only navigates to allowed hosts and their subdomains; navigations and form posts to other hosts are stopped before they load.' },
              { title: 'For web developers', text: 'The `scanner` and `ScannerNavigate` meta tags control scanning per page; the `window.IndustrialKioskBrowser` JavaScript API for scanner, beep, vibration and toasts is available on allowed hosts only.' },
              { title: 'Keyboard and keys', text: 'On-screen keyboard only on demand, hardware key remapping, hotkeys and macros such as `{F1}` or `{TAB}`.' },
              { title: 'Custom CSS and JavaScript', text: 'Add your own CSS, JavaScript or HTML to third-party web apps – matched by URL, without flicker.' },
              { title: 'Custom design', text: 'Title, subtitle, logo, brand colour and profile colours – via configuration or right in the app. Clear error pages with codes such as `PFT-0001` in the brand colour.' },
              { title: 'Security', text: 'Strict TLS checks, client certificates, passwords stored only as PBKDF2 hashes; configuration from other apps only with the admin password or on EMM-managed devices, locked for 15 minutes after 5 wrong attempts. Every release includes an SBOM (CycloneDX).' },
            ],
          },
        ],
      },
      {
        id: 'deployment',
        title: 'Deployment: SOTI MobiControl, Intune, Workspace ONE, StageNow',
        blocks: [
          { type: 'p', text: 'Distribute the APK with your MDM or install it with adb. The configuration comes as a managed configuration from any Android Enterprise EMM (key `config_json`), as a file `industrialkioskbrowser.json` – on Zebra devices also persistently in `/enterprise/usr` –, as a StageNow intent or as a QR code. There is a step-by-step guide for SOTI MobiControl.' },
          { type: 'p', text: 'Ready-made templates cover a single web app, full kiosk mode, several profiles with custom branding, injections with key remapping, and SAP ITS mobile with Enter after each scan.' },
        ],
      },
    ],
    requirements: [
      ['Operating system', 'Android 8.0 or later'],
      ['Scanner', 'Zebra DataWedge, Honeywell (Intent API of the Data Collection Service) or any scanner app via intent'],
      ['Distribution', 'APK via MDM or adb; Google Play is prepared'],
      ['Language', 'English and German; Spanish, French and Chinese machine-translated'],
    ],
    limits: [
      'The Honeywell integration follows the vendor’s documented intent API and has not been verified on a Honeywell device yet; Android 8–10 is covered by unit tests only.',
      'An empty allow list allows every host – always set one on kiosk devices.',
      'Deliberately for intranets: plain HTTP and user-installed CA certificates are accepted, and the JavaScript API is also offered to http pages of allowed hosts. Use HTTPS wherever possible.',
      'Real kiosk mode (lock task) needs an EMM in dedicated device mode (device owner); without it, Industrial Kiosk Browser only hides the exit.',
      'The JavaScript API is not available on servers with a non-default port; scans, the scan event and the meta tags still work there.',
      'Renamed in 0.7.0 (formerly Pforte and EnterpriseBrowser): Android treats Industrial Kiosk Browser as a new app – there is no in-place update; roll out the configuration again and remove the old app.',
      'Until the signing key for the new package name is set up, releases contain the SBOM and checksums but no APK. Google Play is prepared but not published yet.',
      'Version 0.x: settings, JSON format and JavaScript API may still change. Spanish, French and Chinese are machine translations.',
      'The screenshots are rendered from the UI code and placed in a neutral device frame, not photographed on a device.',
    ],
    faq: [
      { q: 'Which kiosk browser works for web apps on Zebra devices with DataWedge?', a: 'A kiosk browser that brings DataWedge scans into the web app. Industrial Kiosk Browser creates its own DataWedge profile on start and types every scan into the focused input field, optionally followed by Tab or Enter.' },
      { q: 'Do I have to change my web app for the scanner?', a: 'No. The scan arrives like keyboard input; input and change events fire, so React or Vue apps pick up the value. For more control, use the `industrialkioskbrowser:scan` event, the meta tags or the `window.IndustrialKioskBrowser` JavaScript API.' },
      { q: 'How do I lock an Android device to a single web app?', a: 'With kiosk mode: a profile with start URL and allow list, hidden toolbar and system bars, exit hidden or password-protected and – as device owner – lock task mode.' },
      { q: 'How do I deploy browser and configuration with SOTI MobiControl, Intune or StageNow?', a: 'Distribute the APK with your MDM. The configuration comes as a managed configuration (key `config_json`), as a file `industrialkioskbrowser.json`, as a StageNow intent or as a QR code; there is a step-by-step guide for SOTI MobiControl.' },
      { q: 'Is Industrial Kiosk Browser a terminal emulation replacement for web-based warehouse apps?', a: 'For web apps, yes: Industrial Kiosk Browser brings scans into the web form, locks the device to the application and is deployed through your MDM. There is a ready-made template for SAP ITS mobile with Enter after each scan and a device-width viewport. It is not a terminal emulator for hosts that have not moved to the web yet.' },
      { q: 'Does Industrial Kiosk Browser work with Honeywell scanners?', a: 'Yes, through the Intent API of the Honeywell Data Collection Service, and with any scanner app that sends scans by intent. A test on a Honeywell device is still open.' },
      { q: 'Does the browser send data to ICT Baden?', a: 'No. No telemetry, no crash reports, no update check, no account. The browser connects only to the web apps you configure and the pages they lead to. As usual, the Android System WebView checks addresses with Google Safe Browsing.' },
      { q: 'Did Industrial Kiosk Browser have a different name before?', a: 'Yes. Up to version 0.5.0 it was called EnterpriseBrowser, in the 0.6.x versions Pforte. Since 0.7.0 it is called Industrial Kiosk Browser, matching Industrial Keyboard, with the package name `de.ictbaden.industrialkioskbrowser`. Android and the EMM therefore see it as a new app: distribute Industrial Kiosk Browser, roll out the configuration again (same JSON format, file now `industrialkioskbrowser.json`) and remove the old app. The JavaScript API, scan event, DataWedge profile and error codes (`IKB-…`, same numbers as `PFT-…` and `EB-…`) changed with the name.' },
      { q: 'What does Industrial Kiosk Browser cost?', a: 'Nothing: Industrial Kiosk Browser is {lizenz}, with no ads and no in-app purchases. Support with guaranteed response times is available with a support contract.{download}' },
    ],
    aka: ['industrial browser', 'kiosk browser for Android', 'kiosk browser for Zebra devices', 'browser for handheld computers'],
    facts: [
      ['Platform', 'Android 8.0 or later, rugged devices from Zebra and Honeywell'],
      ['Scanning', 'Zebra DataWedge, Honeywell or any scanner app via intent'],
      ['Management', 'managed configuration via MDM (SOTI, Intune, Workspace ONE), configuration file, StageNow, QR code'],
      ['Security', 'strict TLS checks, client certificates, passwords only as hashes, SBOM with every release'],
      ['User interface', 'English and German; Spanish, French and Chinese machine-translated'],
      ['Former names', 'Pforte (0.6.x), EnterpriseBrowser (up to 0.5.0)'],
    ],
    trademarks: 'Industrial Kiosk Browser is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell. Zebra, DataWedge and StageNow are trademarks of Zebra Technologies, Honeywell is a trademark of Honeywell International; QR Code is a registered trademark of DENSO WAVE INCORPORATED; SOTI MobiControl, Microsoft Intune, Workspace ONE, SAP and Android are trademarks of their respective owners. They are named only to describe compatibility.',
  },
};

export default page;
