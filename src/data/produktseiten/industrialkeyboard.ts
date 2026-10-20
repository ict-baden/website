// Industrial Keyboard – Bildschirmtastatur (Android-Eingabemethode) für robuste Android-Geräte.
// Quellen (ict-baden/industrialKeyboard): README.md (deutscher Hinweis, Features, Quick start, Vorlagen, Funktionstasten,
// Scannen, MIT), docs/configuration.md (Tastenhöhe 70–160 %, 120–140 % für Handschuhe), docs/deployment.md (Managed
// Configuration, Datei, StageNow, „Make it the keyboard“ per MX UI Manager), app/src/main/AndroidManifest.xml (nur
// VIBRATE), docs/data-and-privacy.md, docs/play-store.md, CHANGELOG.md (2.0.0, Test auf Zebra HC20, Honeywell
// ungetestet). Nicht behaupten: RDP, SAP, Honeywell auf Hardware getestet.
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'industrialkeyboard',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android 8.0 oder neuer',
  softwareRequirements: 'Android 8.0 (API 26) oder neuer',
  uiLanguages: ['en', 'de', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/industrialkeyboard/releases/tag/latest',
    source: 'https://github.com/ict-baden/industrialkeyboard',
  },
  related: ['enterprisebrowser', 'labeldesigner'],
  privacyApp: 'industrialkeyboard',
  de: {
    title: 'Industrial Keyboard: Android-Tastatur mit F1–F24 für MDE',
    description: 'Bildschirmtastatur für robuste Android-Geräte von Zebra und Honeywell: große Tasten für Handschuhe, Scan-Taste, F1–F24, per MDM konfigurierbar, ohne Internet.',
    lead: 'Industrial Keyboard ist eine Bildschirmtastatur für robuste Android-Geräte (MDE-Geräte) von Zebra und Honeywell: große Tasten für Handschuhe, eine eingebaute Scan-Taste, F1–F24 für Terminal-Emulation – und die ganze Tastatur zentral per MDM konfigurierbar. Für Android 8.0 oder neuer, ohne Internetberechtigung, {lizenz}.',
    sections: [
      {
        id: 'wofuer',
        title: 'Schnelle Dateneingabe auf MDE-Geräten',
        blocks: [
          { type: 'p', text: 'In Lager, Logistik und Produktion wird auf Handhelds getippt – oft mit Handschuhen, oft in Terminal-Emulationen, die Funktionstasten brauchen, und meist dort, wo gleich danach gescannt wird. Industrial Keyboard ist eine Android-Eingabemethode genau für diese Arbeit: Sie erscheint in jedem Eingabefeld und lässt sich für die ganze Geräteflotte zentral einstellen.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Funktionen',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Für Handschuhe gemacht', text: 'Tastenhöhe 70–160 % (120–140 % für Handschuhe), großzügige Trefferflächen, Vorschau über dem Finger, Rollover-Tippen und ein kontrastreiches Design.' },
              { title: 'Funktionstasten F1–F24', text: 'Fn-Reiter mit F1–F12, mit Umschalt F13–F24, dazu Esc, Einfg, Entf, Pos1, Ende, Bild auf/ab und Pfeiltasten – auf Wunsch als feste Reihe über den Buchstaben.' },
              { title: 'Scan-Taste eingebaut', text: 'Scan-Reiter mit großer Auslösefläche: tippen für einen Scan, halten für Dauerscan. Zebra DataWedge und Honeywell werden automatisch erkannt, andere Scanner-Apps per Intent ausgelöst.' },
              { title: 'Die richtigen Tasten je Feld', text: 'Zahlenfelder öffnen den Ziffernblock (Telefon- oder Rechner-Reihenfolge, PIN, Datum, Uhrzeit), E-Mail- und URL-Felder bekommen @, / und .com, Enter zeigt die Aktion des Felds.' },
              { title: 'Eigene Layouts und Makros', text: 'Eigene Tastaturen wie OK / Überspringen / Beschädigt als zusätzliche Reiter, in JSON festgelegt – ohne App-Update. Makros wie `{TAB}`, `{F13}`, `OK{ENTER}` oder `{SCAN}`.' },
              { title: 'Alphabete', text: 'QWERTY, QWERTZ, AZERTY, Nordisch und Spanisch, Akzente per langem Druck, optionale Ziffernreihe.' },
              { title: 'Zentral konfigurieren', text: 'Managed Configuration aus jedem EMM (SOTI MobiControl, Microsoft Intune, Workspace ONE), Konfigurationsdatei – auf Zebra auch unter `/enterprise/usr` – oder StageNow-Broadcast; ein Admin-Kennwort schützt die Einstellungen.' },
              { title: 'Privat by Design', text: 'Keine Internetberechtigung, kein Wörterbuch, nichts Getipptes wird gespeichert oder gelernt; die Konfiguration ist von Sicherungen ausgenommen.' },
            ],
          },
        ],
      },
      {
        id: 'terminal',
        title: 'F13–F24 für Terminal-Emulation (5250)',
        blocks: [
          { type: 'p', text: 'Android kennt keine Tastencodes über F12. Industrial Keyboard sendet F13–F24 deshalb als Umschalt+F1…F12 – die Zuordnung, die 5250-Terminal-Emulatoren verwenden. Die Vorlage `terminal-emulation.json` bringt eine Funktionstastenreihe, eine Esc-Taste und einen Reiter „Host“ mit F13–F24, Field exit und Reset.' },
          { type: 'p', text: 'Weitere Vorlagen: `warehouse-gloves.json` für das Lager mit hohem Kontrast, 135 % großen Tasten, Rechner-Ziffernblock und Scan-Taste, `custom-layout.json` mit einem Reiter für die Kommissionierung und `classic-keys.json` ohne Reiterleiste.' },
        ],
      },
    ],
    requirements: [
      ['Betriebssystem', 'Android 8.0 oder neuer'],
      ['Scanner', 'Software-Auslöser für Zebra DataWedge und Honeywell, andere Scanner-Apps per Intent'],
      ['Getestet', 'auf einem Zebra HC20 mit Android 15 und DataWedge'],
      ['Berechtigungen', 'nur Vibration – keine Internetberechtigung'],
      ['Verteilung', 'APK per MDM oder adb; Google Play ist vorbereitet'],
      ['Sprache', 'Englisch, Deutsch, Spanisch, Französisch, Chinesisch'],
    ],
    limits: [
      'Getestet ist auf einem Zebra HC20 (Android 15, DataWedge). Der Honeywell-Auslöser folgt der Herstellerdokumentation und ist noch nicht auf einem Honeywell-Gerät getestet.',
      'Die Übersetzungen sind maschinell vorübersetzt und werden vor dem ersten öffentlichen Release von Muttersprachlern gegengelesen.',
      'Kein Wörterbuch und keine Wortvorschläge – bewusst, damit nichts Getipptes gespeichert wird.',
      'Google Play ist vorbereitet, aber noch nicht veröffentlicht.',
    ],
    faq: [
      { q: 'Wie bekomme ich F1–F12 auf die Bildschirmtastatur eines Android-MDE-Geräts?', a: 'Mit Industrial Keyboard: Der Reiter Fn zeigt F1–F12, Esc, Einfg, Entf, Pos1, Ende, Bild auf/ab und die Pfeiltasten. Wer die Tasten immer sehen will, schaltet die Funktionstastenreihe über den Buchstaben ein.' },
      { q: 'Gibt es eine Android-Tastatur mit F13–F24 für Terminal-Emulation?', a: 'Ja. Umschalt macht aus den oberen Reihen F13–F24. Weil Android keine Tastencodes über F12 kennt, sendet Industrial Keyboard sie als Umschalt+F1…F12, wie es 5250-Emulatoren erwarten.' },
      { q: 'Welche Bildschirmtastatur eignet sich für die Bedienung mit Handschuhen?', a: 'Eine mit großen Tasten und großzügigen Trefferflächen. In Industrial Keyboard ist die Tastenhöhe von 70 bis 160 % einstellbar, für Handschuhe sind 120–140 % empfohlen; dazu kommen die Vorschau über dem Finger und ein kontrastreiches Design.' },
      { q: 'Kann die Tastatur den Scanner auslösen?', a: 'Ja. Der Scan-Reiter und die optionale Scan-Taste ziehen den Software-Auslöser: Zebra DataWedge und Honeywell werden automatisch erkannt, andere Scanner-Apps lassen sich per Intent auslösen.' },
      { q: 'Kann ich die Tastatur zentral per MDM konfigurieren?', a: 'Ja, als Managed Configuration (Schlüssel `config_json`) in SOTI MobiControl, Microsoft Intune oder Workspace ONE, als Konfigurationsdatei oder per StageNow-Broadcast. Auf Zebra-Geräten macht ein MX-Profil (UI Manager) sie zur Standardtastatur.' },
      { q: 'Speichert oder sendet die Tastatur, was getippt wird?', a: 'Nein. Industrial Keyboard hat keine Internetberechtigung und kein Wörterbuch und speichert oder lernt nichts Getipptes. Gespeichert wird nur die Konfiguration, das Admin-Kennwort als gesalzener Hash.' },
      { q: 'Ist Industrial Keyboard kostenlos?', a: 'Ja, {lizenz}, ohne Werbung und ohne In-App-Käufe. Support mit garantierten Reaktionszeiten gibt es per Supportvertrag.{download}' },
    ],
    aka: ['Android-Tastatur mit Funktionstasten', 'Bildschirmtastatur für Handschuhe', 'MDE-Tastatur', 'Tastatur-App für Zebra-Geräte', 'virtuelle Tastatur mit F-Tasten', 'Tastatur für Terminal-Emulation'],
    trademarks: 'Industrial Keyboard ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden. Zebra, DataWedge und StageNow sind Marken von Zebra Technologies, Honeywell ist eine Marke von Honeywell International; Android, SOTI MobiControl, Microsoft Intune und Workspace ONE sind Marken ihrer jeweiligen Inhaber. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Android 8.0 or later',
    softwareRequirements: 'Android 8.0 (API 26) or later',
    title: 'Industrial Keyboard: rugged Android keyboard with F1–F24',
    description: 'On-screen keyboard for rugged Android devices from Zebra and Honeywell: big keys for gloves, scan button, F1–F24, configured by MDM, no internet permission.',
    kind: 'On-screen keyboard for rugged Android devices',
    tagline: 'Fast, reliable data entry on rugged Android devices.',
    lead: 'Industrial Keyboard is an on-screen keyboard for rugged Android devices from Zebra and Honeywell: big keys for gloves, a scanner trigger built in, F1–F24 for terminal emulation – and the whole keyboard configurable from your MDM. For Android 8.0 or later, without internet permission, {lizenz}.',
    sections: [
      {
        id: 'why',
        title: 'Fast, reliable data entry on rugged handhelds',
        blocks: [
          { type: 'p', text: 'In warehouses, logistics and production, people type on handhelds – often with gloves, often in terminal emulations that need function keys, and usually right before or after a scan. Industrial Keyboard is an Android input method built for exactly that work: it appears in every input field and is configured centrally for the whole fleet.' },
        ],
      },
      {
        id: 'features',
        title: 'Features',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Made for gloves', text: 'Key height 70–160 % (120–140 % for gloves), forgiving touch targets, preview bubble above the finger, rollover typing and a high-contrast theme.' },
              { title: 'Function keys F1–F24', text: 'Fn tab with F1–F12, Shift for F13–F24, plus Esc, Ins, Del, Home, End, PgUp, PgDn and arrows – optionally as a fixed row above the letters.' },
              { title: 'Scanner built in', text: 'Scan tab with a large trigger pad: tap for one scan, hold for continuous scanning. Zebra DataWedge and Honeywell are detected automatically, other scanner apps are triggered by intent.' },
              { title: 'The right keys for every field', text: 'Number fields open the numeric pad (phone or calculator order, PIN, date, time), e-mail and URL fields get @, / and .com, Enter shows the field’s action.' },
              { title: 'Custom layouts and macros', text: 'Your own keyboards such as OK / Skip / Damaged as extra tabs, defined in JSON – no app update needed. Macros such as `{TAB}`, `{F13}`, `OK{ENTER}` or `{SCAN}`.' },
              { title: 'Alphabets', text: 'QWERTY, QWERTZ, AZERTY, Nordic and Spanish, accents on long press, optional number row.' },
              { title: 'Central configuration', text: 'Managed configuration from any EMM (SOTI MobiControl, Microsoft Intune, Workspace ONE), configuration file – on Zebra also in `/enterprise/usr` – or StageNow broadcast; an admin password protects the settings.' },
              { title: 'Private by design', text: 'No internet permission, no dictionary, nothing you type is stored or learned; the configuration is excluded from backups.' },
            ],
          },
        ],
      },
      {
        id: 'terminal',
        title: 'F13–F24 for terminal emulation (5250)',
        blocks: [
          { type: 'p', text: 'Android has no key codes above F12, so Industrial Keyboard sends F13–F24 as Shift+F1…F12 – the mapping 5250 terminal emulators use. The `terminal-emulation.json` template brings a function key row, an Esc key and a Host tab with F13–F24, Field exit and Reset.' },
          { type: 'p', text: 'More templates: `warehouse-gloves.json` with high contrast, 135 % keys, calculator pad and scan key, `custom-layout.json` with a picking tab, and `classic-keys.json` without a tab bar.' },
        ],
      },
    ],
    requirements: [
      ['Operating system', 'Android 8.0 or later'],
      ['Scanner', 'soft trigger for Zebra DataWedge and Honeywell, other scanner apps via intent'],
      ['Tested', 'on a Zebra HC20 with Android 15 and DataWedge'],
      ['Permissions', 'vibration only – no internet permission'],
      ['Distribution', 'APK via MDM or adb; Google Play is prepared'],
      ['Language', 'English, German, Spanish, French, Chinese'],
    ],
    limits: [
      'Tested on a Zebra HC20 (Android 15, DataWedge). The Honeywell trigger follows the vendor documentation and has not been tested on a Honeywell device yet.',
      'The translations are machine pre-translated and will be reviewed by native speakers before the first public release.',
      'No dictionary and no word suggestions – deliberately, so that nothing typed is stored.',
      'Google Play is prepared but not published yet.',
    ],
    faq: [
      { q: 'How do I get function keys F1–F12 on an Android on-screen keyboard?', a: 'With Industrial Keyboard: the Fn tab shows F1–F12, Esc, Ins, Del, Home, End, PgUp, PgDn and the arrows. To see them all the time, switch on the function key row above the letters.' },
      { q: 'How are F13–F24 sent on Android when there are no key codes above F12?', a: 'Shift turns the top rows into F13–F24, which Industrial Keyboard sends as Shift+F1…F12 – the mapping 5250 terminal emulators expect.' },
      { q: 'Which Android keyboard works well with gloves?', a: 'One with big keys and forgiving touch targets. Industrial Keyboard’s key height goes from 70 to 160 %, with 120–140 % recommended for gloves, plus a preview above the finger and a high-contrast theme.' },
      { q: 'Can the keyboard trigger the barcode scanner?', a: 'Yes. The scan tab and the optional scan key pull the soft trigger: Zebra DataWedge and Honeywell are detected automatically, other scanner apps can be triggered by intent.' },
      { q: 'Can I configure the keyboard through my MDM?', a: 'Yes, as a managed configuration (key `config_json`) in SOTI MobiControl, Microsoft Intune or Workspace ONE, as a configuration file or by StageNow broadcast. On Zebra devices an MX profile (UI Manager) makes it the default keyboard.' },
      { q: 'Does the keyboard store or send what I type?', a: 'No. Industrial Keyboard has no internet permission and no dictionary, and stores or learns nothing you type. Only the configuration is stored, the admin password as a salted hash.' },
      { q: 'Is Industrial Keyboard free?', a: 'Yes, {lizenz}, with no ads and no in-app purchases. Support with guaranteed response times is available with a support contract.{download}' },
    ],
    aka: ['Android keyboard with function keys', 'glove-friendly keyboard', 'keyboard for rugged handhelds', 'Zebra keyboard app', 'virtual keyboard with F-keys', 'keyboard for terminal emulation'],
    facts: [
      ['Platform', 'Android 8.0 or later, rugged devices from Zebra and Honeywell'],
      ['Keys', 'F1–F24, Esc, Ins, Del, arrows, custom keys and macros'],
      ['Layouts', 'QWERTY, QWERTZ, AZERTY, Nordic and Spanish'],
      ['Management', 'managed configuration via MDM (SOTI, Intune, Workspace ONE), configuration file, StageNow'],
      ['Privacy', 'no internet permission, no dictionary, nothing typed is stored'],
    ],
    trademarks: 'Industrial Keyboard is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell. Zebra, DataWedge and StageNow are trademarks of Zebra Technologies, Honeywell is a trademark of Honeywell International; Android, SOTI MobiControl, Microsoft Intune and Workspace ONE are trademarks of their respective owners. They are named only to describe compatibility.',
  },
};

export default page;
