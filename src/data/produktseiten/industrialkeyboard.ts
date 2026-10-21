// Industrial Keyboard – Bildschirmtastatur (Android-Eingabemethode) für robuste Android-Geräte.
// Quellen (ict-baden/industrialkeyboard, Stand 2.1.0, Tag v2.1.0 vom 2026-10-21): README.md (deutscher Hinweis, Features,
// Quick start, Vorlagen, Funktionstasten, Scannen, MIT), docs/configuration.md (Tastenhöhe 70–160 %, 120–140 % für
// Handschuhe), docs/deployment.md (Managed Configuration, Datei, StageNow, „Make it the keyboard“ per MX UI Manager),
// docs/integration.md (Scan-Eingang per Broadcast, scanner.input), docs/limitations.md (getestet nur Zebra HC20,
// Honeywell nur nach Herstellerdoku, Übersetzungen maschinell, Admin-Kennwort ist keine Gerätesperre, bewusst ohne
// Wortvorschläge/Autokorrektur/Wischen/Spracheingabe/Emoji), app/src/main/AndroidManifest.xml (nur VIBRATE),
// docs/data-and-privacy.md, docs/play-store.md, CHANGELOG.md (2.1.0: fünf Sprachen, Fehlercodes IK-…, Scans per
// Broadcast ab Werk aus, nie in Passwortfelder, Sperre nach 5 Fehlversuchen für 5 Minuten; 2.0.0: Test auf Zebra HC20).
// Nicht behaupten: RDP, SAP, Honeywell auf Hardware getestet, dass die feste Reihe (functionRow) mehr als F1–F12 zeigt –
// Esc, Einfg, Entf, Pos1/Ende, Bild auf/ab und Pfeile gibt es nur auf dem Fn-Reiter –, Kompatibilität mit der
// Konfiguration anderer Tastatur-Apps. Fremdprodukte stehen ausschließlich im Abschnitt alternatives.
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'industrialkeyboard',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android 8.0 oder neuer',
  softwareRequirements: 'Android 8.0 (API 26) oder neuer',
  uiLanguages: ['en', 'de', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/industrialkeyboard/releases/latest',
    source: 'https://github.com/ict-baden/industrialkeyboard',
  },
  related: ['enterprisebrowser', 'labeldesigner'],
  privacyApp: 'industrialkeyboard',
  alternatives: {
    approved: true,
    names: ['Zebra Enterprise Keyboard'],
    de: {
      title: 'Umstieg von Zebra Enterprise Keyboard: Industrial Keyboard als Alternative',
      blocks: [
        { type: 'p', text: 'Für Teams, die auf Zebra-Geräten heute Zebra Enterprise Keyboard nutzen und eine Bildschirmtastatur suchen, die auch auf Geräten anderer Hersteller läuft. Industrial Keyboard erfüllt dieselbe Aufgabe – eine Eingabemethode für robuste Android-Geräte mit Funktionstasten, Scan-Taste und zentraler Konfiguration – und ist {lizenz}.' },
        {
          type: 'list',
          items: [
            'Läuft auf jedem Android-Gerät ab Android 8.0; Software-Auslöser für Zebra DataWedge und Honeywell, andere Scanner-Apps per Intent.',
            'F1–F24 (F13–F24 als Umschalt+F1…F12), große Tasten für Handschuhe, eigene Layouts und Makros in JSON.',
            'Konfiguration als Managed Configuration aus jedem EMM, als Datei oder per StageNow; auf Zebra-Geräten macht ein MX-Profil sie zur Standardtastatur.',
            'Keine Internetberechtigung, kein Wörterbuch, nichts Getipptes wird gespeichert.',
          ],
        },
        { type: 'p', text: 'Ehrlich für Umsteiger: Industrial Keyboard übernimmt keine Konfiguration anderer Tastatur-Apps – Layouts und Einstellungen werden neu in JSON angelegt. Wortvorschläge, Autokorrektur, Wischen und Spracheingabe gibt es bewusst nicht. Getestet ist bisher ein Zebra HC20.' },
      ],
      faq: [
        { q: 'Gibt es eine kostenlose Alternative zu Zebra Enterprise Keyboard?', a: 'Ja: Industrial Keyboard ist eine Bildschirmtastatur für robuste Android-Geräte, {lizenz}, ohne Werbung und ohne In-App-Käufe. Sie bietet F1–F24, eine Scan-Taste für DataWedge und Honeywell, große Tasten für Handschuhe und Konfiguration per MDM – und läuft auch auf Geräten anderer Hersteller.' },
      ],
      trademark: 'Zebra Enterprise Keyboard ist ein Produkt von Zebra Technologies. ICT Baden steht in keiner Verbindung zu Zebra Technologies; der Name wird nur genannt, um den Vergleich zu beschreiben.',
    },
    en: {
      title: 'Switching from Zebra Enterprise Keyboard: Industrial Keyboard as an alternative',
      blocks: [
        { type: 'p', text: 'For teams that use Zebra Enterprise Keyboard on Zebra devices today and want an on-screen keyboard that also runs on devices from other vendors. Industrial Keyboard does the same job – an input method for rugged Android devices with function keys, a scan key and central configuration – and is {lizenz}.' },
        {
          type: 'list',
          items: [
            'Runs on any Android device with Android 8.0 or later; soft trigger for Zebra DataWedge and Honeywell, other scanner apps via intent.',
            'F1–F24 (F13–F24 sent as Shift+F1…F12), big keys for gloves, custom layouts and macros in JSON.',
            'Configuration as a managed configuration from any EMM, as a file or via StageNow; on Zebra devices an MX profile makes it the default keyboard.',
            'No internet permission, no dictionary, nothing you type is stored.',
          ],
        },
        { type: 'p', text: 'Honestly, for anyone switching: Industrial Keyboard does not import the configuration of other keyboard apps – layouts and settings are set up again in JSON. Word suggestions, autocorrect, swipe typing and voice input are deliberately left out. So far it has been tested on a Zebra HC20.' },
      ],
      faq: [
        { q: 'Is there a free alternative to Zebra Enterprise Keyboard?', a: 'Yes: Industrial Keyboard is an on-screen keyboard for rugged Android devices, {lizenz}, with no ads and no in-app purchases. It offers F1–F24, a scan key for DataWedge and Honeywell, big keys for gloves and configuration through your MDM – and it also runs on devices from other vendors.' },
      ],
      trademark: 'Zebra Enterprise Keyboard is a product of Zebra Technologies. ICT Baden is not affiliated with Zebra Technologies; the name is used only to describe the comparison.',
    },
  },
  de: {
    title: 'Android-Tastatur mit F-Tasten (F1–F24) – Industrial Keyboard',
    description: 'Bildschirmtastatur für robuste Android-Geräte von Zebra und Honeywell: große Tasten für Handschuhe, Scan-Taste, F1–F24, MDM-Konfiguration, ohne Internet.',
    lead: 'Industrial Keyboard ist eine Bildschirmtastatur für robuste Android-Geräte (MDE-Geräte) von Zebra und Honeywell: große Tasten für Handschuhe, eine eingebaute Scan-Taste, F1–F24 für Terminal-Emulation – und die ganze Tastatur zentral per MDM konfigurierbar. Für Android 8.0 oder neuer, ohne Internetberechtigung, {lizenz}.',
    independence: 'Industrial Keyboard ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden.',
    sections: [
      {
        id: 'wofuer',
        title: 'Android-Tastatur mit F-Tasten für MDE-Geräte',
        blocks: [
          { type: 'p', text: 'In Lager, Logistik und Produktion wird auf Handhelds getippt – oft mit Handschuhen, oft in Terminal-Emulationen, die Funktionstasten brauchen, und meist dort, wo gleich danach gescannt wird. Industrial Keyboard ist eine MDE-Tastatur für genau diese Arbeit: Als Android-Eingabemethode erscheint sie in jedem Eingabefeld und lässt sich für die ganze Geräteflotte zentral einstellen.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Funktionen der Bildschirmtastatur',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Für Handschuhe gemacht', text: 'Tastenhöhe 70–160 % (120–140 % für Handschuhe), großzügige Trefferflächen, Vorschau über dem Finger, Rollover-Tippen und ein kontrastreiches Design.' },
              { title: 'Funktionstasten F1–F24', text: 'Fn-Reiter mit F1–F12, mit Umschalt F13–F24, dazu Esc, Einfg, Entf, Pos1, Ende, Bild auf/ab und Pfeiltasten; auf Wunsch zusätzlich eine feste Reihe F1–F12 über den Buchstaben.' },
              { title: 'Scan-Taste eingebaut', text: 'Scan-Reiter mit großer Auslösefläche: tippen für einen Scan, halten für Dauerscan. Zebra DataWedge und Honeywell werden automatisch erkannt, andere Scanner-Apps per Intent ausgelöst. Scans, die nur als Broadcast kommen, tippt die Tastatur auf Wunsch selbst ein – ab Werk aus und nie in Passwortfelder.' },
              { title: 'Die richtigen Tasten je Feld', text: 'Zahlenfelder öffnen den Ziffernblock (Telefon- oder Rechner-Reihenfolge, PIN, Datum, Uhrzeit), E-Mail- und URL-Felder bekommen @, / und .com, Enter zeigt die Aktion des Felds.' },
              { title: 'Eigene Layouts und Makros', text: 'Eigene Tastaturen wie OK / Überspringen / Beschädigt als zusätzliche Reiter, in JSON festgelegt – ohne App-Update. Makros wie `{TAB}`, `{F13}`, `OK{ENTER}` oder `{SCAN}`.' },
              { title: 'Alphabete', text: 'QWERTY, QWERTZ, AZERTY, Nordisch und Spanisch, Akzente per langem Druck, optionale Ziffernreihe.' },
              { title: 'Zentral konfigurieren', text: 'Managed Configuration aus jedem EMM (SOTI MobiControl, Microsoft Intune, Workspace ONE), Konfigurationsdatei – auf Zebra auch unter `/enterprise/usr` – oder StageNow-Broadcast. Ein Admin-Kennwort schützt Einstellungen und Fernkonfiguration; nach 5 Fehlversuchen ist 5 Minuten Pause. Fehlermeldungen tragen Codes wie `IK-0100`.' },
              { title: 'Privat by Design', text: 'Keine Internetberechtigung, kein Wörterbuch, nichts Getipptes wird gespeichert oder gelernt; die Konfiguration ist von Sicherungen ausgenommen.' },
            ],
          },
        ],
      },
      {
        id: 'terminal',
        title: 'F13–F24 für Terminal-Emulation (5250)',
        blocks: [
          { type: 'p', text: 'Android kennt keine Tastencodes über F12. Industrial Keyboard sendet F13–F24 deshalb als Umschalt+F1…F12 – die Zuordnung, die 5250-Terminal-Emulatoren verwenden. Die Vorlage `terminal-emulation.json` richtet die Tastatur für Terminal-Emulation ein: Funktionstastenreihe, Esc-Taste und ein Reiter „Host“ mit F13–F24, Field exit und Reset.' },
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
      ['Sprache', 'Englisch und Deutsch; Spanisch, Französisch und Chinesisch maschinell übersetzt'],
    ],
    limits: [
      'Getestet ist auf einem Zebra HC20 (Android 15, DataWedge). Der Honeywell-Auslöser folgt der Herstellerdokumentation und ist noch nicht auf einem Honeywell-Gerät getestet.',
      'Spanisch, Französisch und Chinesisch sind maschinell übersetzt und noch nicht von Muttersprachlern gegengelesen; die Tastenbeschriftungen werden nicht übersetzt.',
      'Kein Wörterbuch, keine Wortvorschläge, keine Autokorrektur, kein Wischen, keine Spracheingabe und keine Emoji-Auswahl – bewusst, damit nichts Getipptes gespeichert oder gelernt wird.',
      'Das Admin-Kennwort schützt Einstellungen und Fernkonfiguration, ist aber keine Gerätesperre: Wer die App deinstallieren oder ihre Daten löschen kann, bekommt die Standardwerte.',
      'Google Play ist vorbereitet, aber noch nicht veröffentlicht.',
    ],
    faq: [
      { q: 'Gibt es eine Android-Tastatur mit Funktionstasten (F1–F24) für MDE-Geräte?', a: 'Ja, Industrial Keyboard: Der Reiter Fn zeigt F1–F12, mit Umschalt F13–F24, dazu Esc, Einfg, Entf, Pos1, Ende, Bild auf/ab und die Pfeiltasten. Wer F1–F12 immer sehen will, schaltet die Funktionstastenreihe über den Buchstaben ein.' },
      { q: 'Gibt es eine Android-Tastatur mit F13–F24 für Terminal-Emulation?', a: 'Ja. Umschalt macht aus den oberen Reihen F13–F24. Weil Android keine Tastencodes über F12 kennt, sendet Industrial Keyboard sie als Umschalt+F1…F12, wie es 5250-Emulatoren erwarten.' },
      { q: 'Welche Bildschirmtastatur eignet sich für die Bedienung mit Handschuhen?', a: 'Eine Bildschirmtastatur für Handschuhe braucht große Tasten und großzügige Trefferflächen. In Industrial Keyboard ist die Tastenhöhe von 70 bis 160 % einstellbar, mit Handschuhen sind 120–140 % empfohlen; dazu kommen die Vorschau über dem Finger und ein kontrastreiches Design.' },
      { q: 'Kann die Tastatur den Scanner auslösen?', a: 'Ja. Der Scan-Reiter und die optionale Scan-Taste ziehen den Software-Auslöser: Zebra DataWedge und Honeywell werden automatisch erkannt, andere Scanner-Apps lassen sich per Intent auslösen.' },
      { q: 'Kann ich die Tastatur zentral per MDM konfigurieren?', a: 'Ja, als Managed Configuration (Schlüssel `config_json`) in SOTI MobiControl, Microsoft Intune oder Workspace ONE, als Konfigurationsdatei oder per StageNow-Broadcast. Auf Zebra-Geräten macht ein MX-Profil (UI Manager) sie zur Standardtastatur.' },
      { q: 'Speichert oder sendet die Tastatur, was getippt wird?', a: 'Nein. Industrial Keyboard hat keine Internetberechtigung und kein Wörterbuch und speichert oder lernt nichts Getipptes. Gespeichert wird nur die Konfiguration, das Admin-Kennwort als gesalzener Hash.' },
      { q: 'Ist Industrial Keyboard kostenlos?', a: 'Ja, {lizenz}, ohne Werbung und ohne In-App-Käufe. Support mit garantierten Reaktionszeiten gibt es per Supportvertrag.{download}' },
    ],
    aka: ['Android-Tastatur mit F-Tasten', 'Android-Tastatur mit Funktionstasten', 'Bildschirmtastatur für Handschuhe', 'MDE-Tastatur', 'Tastatur für Terminal-Emulation'],
    trademarks: 'Industrial Keyboard ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden. Zebra, DataWedge und StageNow sind Marken von Zebra Technologies, Honeywell ist eine Marke von Honeywell International; Android, SOTI MobiControl, Microsoft Intune und Workspace ONE sind Marken ihrer jeweiligen Inhaber. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Android 8.0 or later',
    softwareRequirements: 'Android 8.0 (API 26) or later',
    title: 'Android keyboard with function keys – Industrial Keyboard',
    description: 'On-screen keyboard for rugged Android devices from Zebra and Honeywell: big keys for gloves, scan key, F1–F24, configured by MDM, no internet permission.',
    kind: 'On-screen keyboard for rugged Android devices',
    tagline: 'Fast, reliable data entry on rugged Android devices.',
    lead: 'Industrial Keyboard is an on-screen keyboard for rugged Android devices from Zebra and Honeywell: big keys for gloves, a scanner trigger built in, F1–F24 for terminal emulation – and the whole keyboard configurable from your MDM. For Android 8.0 or later, without internet permission, {lizenz}.',
    independence: 'Industrial Keyboard is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell.',
    sections: [
      {
        id: 'why',
        title: 'An Android keyboard with function keys (F1–F24) for rugged handhelds',
        blocks: [
          { type: 'p', text: 'In warehouses, logistics and production, people type on handhelds – often with gloves, often in terminal emulations that need function keys, and usually right before or after a scan. Industrial Keyboard is a keyboard for rugged handhelds built for exactly that work: as an Android input method it appears in every input field and is configured centrally for the whole fleet.' },
        ],
      },
      {
        id: 'features',
        title: 'On-screen keyboard features',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Made for gloves', text: 'Key height 70–160 % (120–140 % for gloves), forgiving touch targets, preview bubble above the finger, rollover typing and a high-contrast theme.' },
              { title: 'Function keys F1–F24', text: 'Fn tab with F1–F12, Shift for F13–F24, plus Esc, Ins, Del, Home, End, PgUp, PgDn and arrows; optionally an extra fixed F1–F12 row above the letters.' },
              { title: 'Scanner built in', text: 'Scan tab with a large trigger pad: tap for one scan, hold for continuous scanning. Zebra DataWedge and Honeywell are detected automatically, other scanner apps are triggered by intent. Scans that only arrive as a broadcast can be typed by the keyboard itself – off by default and never into password fields.' },
              { title: 'The right keys for every field', text: 'Number fields open the numeric pad (phone or calculator order, PIN, date, time), e-mail and URL fields get @, / and .com, Enter shows the field’s action.' },
              { title: 'Custom layouts and macros', text: 'Your own keyboards such as OK / Skip / Damaged as extra tabs, defined in JSON – no app update needed. Macros such as `{TAB}`, `{F13}`, `OK{ENTER}` or `{SCAN}`.' },
              { title: 'Alphabets', text: 'QWERTY, QWERTZ, AZERTY, Nordic and Spanish, accents on long press, optional number row.' },
              { title: 'Central configuration', text: 'Managed configuration from any EMM (SOTI MobiControl, Microsoft Intune, Workspace ONE), configuration file – on Zebra also in `/enterprise/usr` – or StageNow broadcast. An admin password protects the settings and remote configuration; 5 wrong attempts lock it for 5 minutes. Error messages carry codes such as `IK-0100`.' },
              { title: 'Private by design', text: 'No internet permission, no dictionary, nothing you type is stored or learned; the configuration is excluded from backups.' },
            ],
          },
        ],
      },
      {
        id: 'terminal',
        title: 'F13–F24 for terminal emulation (5250)',
        blocks: [
          { type: 'p', text: 'Android has no key codes above F12, so Industrial Keyboard sends F13–F24 as Shift+F1…F12 – the mapping 5250 terminal emulators use. The `terminal-emulation.json` template configures the keyboard for terminal emulation: a function key row, an Esc key and a Host tab with F13–F24, Field exit and Reset.' },
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
      ['Language', 'English and German; Spanish, French and Chinese machine-translated'],
    ],
    limits: [
      'Tested on a Zebra HC20 (Android 15, DataWedge). The Honeywell trigger follows the vendor documentation and has not been tested on a Honeywell device yet.',
      'Spanish, French and Chinese are machine translations and have not yet been proofread by native speakers; key labels are not translated.',
      'No dictionary, no word suggestions, no autocorrect, no swipe typing, no voice input and no emoji picker – deliberately, so that nothing typed is stored or learned.',
      'The admin password protects the settings and remote configuration but is not a device lock: whoever can uninstall the app or clear its data gets the defaults.',
      'Google Play is prepared but not published yet.',
    ],
    faq: [
      { q: 'Is there an Android keyboard with F1–F24 function keys for rugged devices?', a: 'Yes, Industrial Keyboard: the Fn tab shows F1–F12, Shift adds F13–F24, plus Esc, Ins, Del, Home, End, PgUp, PgDn and the arrows. To keep F1–F12 always visible, switch on the function key row above the letters.' },
      { q: 'How are F13–F24 sent on Android when there are no key codes above F12?', a: 'Shift turns the top rows into F13–F24, which Industrial Keyboard sends as Shift+F1…F12 – the mapping 5250 terminal emulators expect.' },
      { q: 'Which Android keyboard works well with gloves?', a: 'A glove-friendly keyboard needs big keys and forgiving touch targets. Industrial Keyboard’s key height goes from 70 to 160 %, with 120–140 % recommended for gloves, plus a preview above the finger and a high-contrast theme.' },
      { q: 'Can the keyboard trigger the barcode scanner?', a: 'Yes. The scan tab and the optional scan key pull the soft trigger: Zebra DataWedge and Honeywell are detected automatically, other scanner apps can be triggered by intent.' },
      { q: 'Can I configure the keyboard through my MDM?', a: 'Yes, as a managed configuration (key `config_json`) in SOTI MobiControl, Microsoft Intune or Workspace ONE, as a configuration file or by StageNow broadcast. On Zebra devices an MX profile (UI Manager) makes it the default keyboard.' },
      { q: 'Does the keyboard store or send what I type?', a: 'No. Industrial Keyboard has no internet permission and no dictionary, and stores or learns nothing you type. Only the configuration is stored, the admin password as a salted hash.' },
      { q: 'Is Industrial Keyboard free?', a: 'Yes, {lizenz}, with no ads and no in-app purchases. Support with guaranteed response times is available with a support contract.{download}' },
    ],
    aka: ['Android keyboard with function keys', 'Android keyboard with F1–F24', 'glove-friendly keyboard', 'keyboard for rugged handhelds', 'keyboard for terminal emulation'],
    facts: [
      ['Platform', 'Android 8.0 or later, rugged devices from Zebra and Honeywell'],
      ['Keys', 'F1–F24, Esc, Ins, Del, arrows, custom keys and macros'],
      ['Layouts', 'QWERTY, QWERTZ, AZERTY, Nordic and Spanish'],
      ['Management', 'managed configuration via MDM (SOTI, Intune, Workspace ONE), configuration file, StageNow'],
      ['Privacy', 'no internet permission, no dictionary, nothing typed is stored'],
      ['User interface', 'English and German; Spanish, French and Chinese machine-translated'],
    ],
    trademarks: 'Industrial Keyboard is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell. Zebra, DataWedge and StageNow are trademarks of Zebra Technologies, Honeywell is a trademark of Honeywell International; Android, SOTI MobiControl, Microsoft Intune and Workspace ONE are trademarks of their respective owners. They are named only to describe compatibility.',
  },
};

export default page;
