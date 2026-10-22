// Ratgeber „Android-Tastatur mit F-Tasten für Terminal-Emulation“ – wie F1–F24 und Sondertasten (Esc, Einfg, Entf,
// Pos1/Ende, Bild auf/ab, Pfeile, Feldende, Reset) auf Android-Handhelds kommen; das eigene Produkt ist Industrial Keyboard.
// Ausrichtung (docs/sichtbarkeit.md, Abschnitt 3.7): „Tastatur F13 bis F24 Android / android keyboard F13–F24“ (hoch),
// „Terminal-Emulation Tastatur, 5250, Ziffernblock-Enter, Einfg-Taste Android / terminal emulator keyboard“ (mittel bis
// hoch), „Android Tastatur mit F-Tasten“ (DE mittel). „Industrial Keyboard“ ist ein Hardware-Begriff und steht deshalb nicht
// im Titel. RDP und SAP werden nicht erwähnt, auch nicht als Anwendungsfall.
// Quellen (abgerufen 2026-10-22):
// - Tastencodes: developer.android.com „KeyEvent“ (developer.android.com/reference/android/view/KeyEvent): KEYCODE_F1 …
//   KEYCODE_F12 „Added in API level 11“; KEYCODE_F13 … KEYCODE_F24 „Added in API level 36“ („Key code constant: F13 key.“);
//   KEYCODE_INSERT „Toggles insert / overwrite edit mode.“; KEYCODE_NUMPAD_ENTER „Numeric keypad Enter key.“. Klassen-
//   beschreibung zu Bildschirmtastaturen: kein Tastenereignis garantiert, „sending such events is discouraged“, „the
//   default software keyboard will never send any key event“ (an Apps ab Jelly Bean).
// - API-Level und Android-Version: developer.android.com „<uses-sdk>“ (developer.android.com/guide/topics/manifest/
//   uses-sdk-element): „Android 16 | 36 | BAKLAVA“, „Android 15 | 35“, „Android 3.0.x | 11 | HONEYCOMB“.
// - 5250 und 3270 am PC: IBM Docs, Personal Communications 14.0 „Key Functions and Keyboard Setup“, Table 12 „Default Key
//   Functions for a 5250 Layout“ (ibm.com/docs/api/v1/content/SSEQ5Y_14.0.0/com.ibm.pcomm.doc/books/html/
//   emulator_reference10.htm): PF13 to PF24 „Shift+F1 to F12“ (ebenso in der 3270-Belegung); Field Exit „Enter(pad)“;
//   Reset „Left Ctrl“; Attention „Esc“. Andere Emulationen: HCL, Standardbelegung einer 3270/5250/VT-Web-Emulation
//   (help.hcl-software.com/zie/zieweb/2.0/help/keyboard.html): „F13-24 | Shift+F1-12“, Field Exit „Ctrl+Enter“, Reset
//   „Not mapped“ („can be mapped to a supported key“), Fußnote „VT supports function keys F1 through F20.“; G&R,
//   Tastenkürzel einer Emulation (down.gar.no/doc/ios/div/keymappings.htm): „F13 to F24 : shift+F1 to shift+F12 or
//   alt+F1 to alt+F12“.
// - VT: Digital VT220 Programmer Reference Manual, Kapitel 3 (vt100.net/docs/vt220-rm/chapter3.html): „There are 20
//   top-row function keys, F1 through F20.“
// - Hardware-Tastaturen: source.android.com „Keyboard devices“ (source.android.com/docs/core/interaction/input/
//   keyboard-devices): „compact embedded QWERTY keyboards, and fully featured PC-style external keyboards“. Zebra-Doku,
//   Product Reference Guide einer Handheld-Serie, Seiten „Special Characters“ (docs.zebra.com/us/en/mobile-computers/
//   handheld/mc9-series/mc93xx-product-reference-guide/keypads/special-characters.html: „color-coded to indicate the
//   alternate function key (blue/orange) values“, „the Shift + <num> combinations generate F11-F20 keys“ auf den
//   5250-, 3270- und VT-Tastaturen) und „53-Keys IBM-5250 Emulator Keypad“ – auf der Seite ohne Hersteller und Modell.
// - Tastenleisten der Emulationen: G&R „Terminal Emulation for Android“ (web.gar.no/terminal-emulation-for-android-tn5250-
//   tn3270-telnet-ssh): „Configurable multiline toolbar with function keys and macros“, Hardware-Tasten auf Makros und
//   Emulationsfunktionen legen; IT Jungle, 2010-03-02, über eine TN5250-Emulation für Android
//   (itjungle.com/2010/03/02/fhs030210-story05/): „The software emulates 24 F keys“, „link 5250 functions to hard keys“ –
//   auf der Seite ohne Namen. Allgemeine Bildschirmtastaturen mit F-Tasten: docs/sichtbarkeit.md, Abschnitt 3.7 (Foren
//   und Verzeichnisse) – Namen bewusst nicht genannt.
// - Datenschutz: Warnung von Android beim Einschalten einer Tastatur, AOSP frameworks/base/packages/SettingsLib
//   res/values/strings.xml „ime_security_warning“ („This input method may be able to collect all the text you type“),
//   deutsch in values-de („Diese Eingabemethode kann den gesamten von dir eingegebenen Text erfassen“).
// - MDM: developer.android.com „Set up managed configurations“ (developer.android.com/work/managed-configurations): „allow
//   the organization's IT admin to remotely specify settings for apps“; „DevicePolicyManager.setPermittedInputMethods“:
//   „set the permitted input methods services for this user“.
// - Handschuhe: developer.android.com „Make apps more accessible“, Abschnitt „Use large, simple controls“
//   (developer.android.com/guide/topics/ui/accessibility/apps): „of at least 48dpx48dp. Larger is even better.“;
//   Zebra-Doku „Setting Touch Panel Mode“ (docs.zebra.com/us/en/mobile-computers/handheld/tc7-series/
//   tc72-tc77-product-reference-guide/settings/display-settings/setting-touch-panel-mode.html): Modus „Glove and Finger“,
//   ab Werk „Finger Only“ – auf der Seite ohne Hersteller.
// - Industrial Keyboard: ict-baden/industrialkeyboard origin/main 8cfb964 (seit Tag v2.1.1 nur CI und Versionsnummer
//   geändert): README.md (Fn-Reiter mit F1–F12, Esc, Ins, Del, Home, End, PgUp, PgDn und Pfeilen; Umschalt für einen
//   Tastendruck F13–F24, Doppeltipp bis zum nächsten Umschalt; Funktionstastenreihe; Vorlage terminal-emulation.json),
//   examples/terminal-emulation.json (dunkles Design, functionRow, alpha.p1 = {ESC}, numeric.p4 = {TAB}, keine automatische
//   Großschreibung, Reiter „Host“ mit F13–F24, „Field exit“ = {TAB}, „Reset“ = {ESC}, PgUp, PgDn, „Send“ = {ENTER}),
//   docs/configuration.md (Tastenhöhe 70–160 %, 100 % = 54 dp, 120–140 für Handschuhe; Vibration 30–40 ms durch Handschuhe
//   spürbar; Makros: Tab, Enter, Esc, Rückschritt, Entf, Einfg, Pos1, Ende, Bild auf/ab, Pfeile, F1–F24 – keine Strg- oder
//   Alt-Tasten, kein Ziffernblock-Enter; unbekannte Makros werden abgelehnt; Ziffernblock nach Android-Feldtyp),
//   docs/integration.md (F1 … F12 als KEYCODE_F1 … KEYCODE_F12, F13 … F24 als KEYCODE_F1 … KEYCODE_F12 mit META_SHIFT_ON;
//   Sondertasten als Tastenereignisse, Buchstaben als Text; Scan-Auslöser DataWedge, Honeywell, Intent; Keystroke-Ausgabe
//   „simplest“; Scans per Broadcast nie in Passwortfelder und Felder ohne Texteditor, „some terminal emulators“),
//   docs/deployment.md (Managed Configuration config_json, Datei, StageNow, MX UI Manager; manche EMMs setzen die
//   Standardtastatur), docs/limitations.md (Honeywell nur nach Herstellerdoku), docs/data-and-privacy.md,
//   app/src/main/AndroidManifest.xml (nur VIBRATE); Code layout/Layouts.kt (feste Reihe immer F1–F12 ohne Umschalt; Fn-Reiter
//   mit Tab und Enter), layout/Macro.kt, ime/KeyboardService.kt (sendKey mit META_SHIFT_ON, ohne Versionsabfrage);
//   src/data/produktseiten/industrialkeyboard.ts. Version und Status aus products.json ({version}).
// Nicht behaupten (wie auf der Produktseite): RDP, SAP, Honeywell auf Hardware getestet, dass die feste Reihe mehr als
// F1–F12 zeigt (Esc, Einfg, Entf, Pos1/Ende, Bild auf/ab und Pfeile nur auf dem Fn-Reiter), Kompatibilität mit der
// Konfiguration anderer Tastatur-Apps; keine Testgeräte; nicht, dass eine bestimmte Emulation Umschalt+F1…F12 als F13–F24
// auswertet oder „Field exit“ (Tab) und „Reset“ (Esc) der Vorlage als Feldende und Reset versteht. Abweichend von der
// Produktseite: „Android kennt keine Tastencodes über F12“ gilt nur bis Android 15 (API-Level 35). Keine Fremdprodukte –
// der Vergleich mit benannten Tastaturen steht auf der Produktseite (Abschnitt #alternative bzw. #alternative-to).
import type { Guide } from '../../lib/ratgeber';

const guide: Guide = {
  id: 'android-tastatur-f-tasten-terminal-emulation',
  product: 'industrialkeyboard',
  published: '2026-10-22',
  de: {
    slug: 'android-tastatur-f-tasten-terminal-emulation',
    title: 'Android-Tastatur mit F-Tasten: F13–F24 für Terminal-Emulation',
    description: 'F1 bis F24 auf dem Android-Handheld: warum Bildschirmtastaturen keine F-Tasten zeigen, wie 5250-Emulationen F13–F24 abbilden und welche Wege es gibt.',
    h1: 'Android-Tastatur mit F-Tasten: F1 bis F24 für Terminal-Emulation auf dem Handheld',
    short: 'Android-Tastatur mit F-Tasten',
    teaser: 'F1–F24, Esc und Einfg auf dem Android-Handheld: Hardware-Tasten, Tastenleiste der Emulation, externe oder Bildschirmtastatur – welcher Weg wann passt.',
    lead: 'Die Bildschirmtastaturen, die auf Android-Geräten vorinstalliert sind, haben in der Regel keine Funktionstasten. Für Terminal-Emulationen (5250, 3270, VT) auf dem Handheld kommen F1–F24 und Sondertasten wie Esc und Einfg deshalb aus der Hardware-Tastatur des Geräts, aus der Tastenleiste der Emulation, von einer externen Tastatur oder von einer Bildschirmtastatur mit Funktionstasten. F13–F24 liegen in 5250- und 3270-Emulationen üblicherweise auf Umschalt+F1…F12; eigene Tastencodes dafür kennt Android erst seit Version 16.',
    sections: [
      {
        id: 'warum',
        title: 'Warum Android-Tastaturen keine F-Tasten zeigen',
        toc: 'Warum keine F-Tasten',
        blocks: [
          { type: 'p', text: 'Bildschirmtastaturen liefern unter Android in der Regel Text: Sie übergeben der App fertige Zeichen, keine einzelnen Tastendrücke. Die Android-Doku sagt ausdrücklich, dass ein Tastendruck auf einer Bildschirmtastatur nicht unbedingt ein Tastenereignis auslöst. Android rät Tastaturen sogar davon ab, solche Ereignisse zu senden, und die Standard-Bildschirmtastatur von Android schickt aktuellen Apps gar keine.' },
          { type: 'p', text: 'Funktionstasten sind aber keine Zeichen. F1, Einfg, Pos1 oder die Pfeiltasten kann eine Terminal-Emulation von einer Tastatur nur als Tastenereignis mit Tastencode empfangen. Eine Bildschirmtastatur für Terminal-Emulation muss diese Tasten also bewusst als Tastenereignisse senden – das unterscheidet sie von einer Tastatur zum Schreiben.' },
          { type: 'p', text: 'Über F12 wird es auch für Android selbst eng: Tastencodes für F1 bis F12 gibt es seit Android 3.0, für F13 bis F24 erst seit Android 16 (API-Level 36). Auf Geräten mit Android 15 oder älter hat F13 also keinen eigenen Tastencode – und auch ab Android 16 helfen die neuen Codes nur, wenn die Emulation sie auswertet.' },
        ],
      },
      {
        id: 'f13-f24',
        title: 'F13–F24, Feldende und Reset: so bilden 5250- und 3270-Emulationen sie ab',
        toc: 'F13–F24 in Emulationen',
        blocks: [
          { type: 'p', text: 'Anwendungen auf IBM i (5250) und auf dem Großrechner (3270) kennen 24 Funktionstasten, eine PC-Tastatur hat nur zwölf. Emulationen legen F13–F24 – bei 3270 heißen sie PF13–PF24 – deshalb üblicherweise auf Umschalt+F1 bis Umschalt+F12. So steht es in der Standardbelegung, die IBM für seine 5250- und 3270-Emulation am PC dokumentiert, und andere Emulationen belegen die Tasten ab Werk ebenso.' },
          { type: 'p', text: 'Ähnlich ist es mit 5250-Tasten, die eine PC-Tastatur gar nicht hat. In der Standardbelegung von IBM liegt Feldende (Field Exit) auf der Enter-Taste des Ziffernblocks, Reset auf der linken Strg-Taste und Attention auf Esc. Andere Emulationen belegen anders – Feldende etwa auf Strg+Enter, Reset auf gar keiner Taste. Was eine Taste auf dem Handheld senden muss, steht deshalb in der Tastenbelegung Ihrer Emulation; dort lässt sie sich in der Regel auch ändern.' },
          { type: 'p', text: 'Bei VT-Emulationen hängt es vom nachgebildeten Terminal ab, welche Funktionstasten es gibt – je nach Typ bis F20 – und auf welchen Tasten sie liegen.' },
        ],
      },
      {
        id: 'wege',
        title: 'Die Wege zu Funktionstasten auf dem Handheld',
        toc: 'Die Wege',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Hardware-Tastatur des Geräts', text: 'Bei Handhelds mit Tastatur sind Funktionstasten häufig Zweitbelegungen, erreichbar über eine farbig markierte Umschalttaste; manche Modelle gibt es mit eigenen Tastaturvarianten für 5250-, 3270- oder VT-Emulation. Echte Tasten brauchen keinen Platz auf dem Bildschirm. Welche F-Tasten es gibt und wie sie belegt sind, hängt aber von Modell und Tastaturvariante ab – und reine Touch-Geräte haben keine.' },
              { title: 'Tastenleiste der Terminal-Emulation', text: 'Terminal-Emulationen für Android bringen häufig eine eigene Leiste oder Tastatur mit Funktionstasten und Makros mit und lassen Hardware-Tasten des Geräts mit Funktionen der Emulation belegen. Weil die Emulation ihre Funktionen selbst kennt, kann eine solche Leiste auch Feldende oder Reset direkt auslösen. Die Leiste gibt es aber nur in dieser einen App, sie braucht Platz auf dem Bildschirm und wird je App eingerichtet.' },
              { title: 'Externe Tastatur per Bluetooth oder USB', text: 'Android unterstützt auch vollwertige externe Tastaturen im PC-Format. F1–F12 kommen dann als echte Tasten an, F13–F24 als Umschalt+F1…F12, wenn die Emulation sie so belegt. Für längere Eingaben an einem festen Platz ist das bequem; mit dem Handheld in der Hand ist es ein zusätzliches Gerät, das gekoppelt oder eingesteckt werden muss.' },
              { title: 'Allgemeine Bildschirmtastaturen mit F-Tasten', text: 'Es gibt Bildschirmtastaturen für Android mit einer Reihe für Funktionstasten. Für die Arbeit mit einer Terminal-Emulation kommt es auf Einzelheiten an: ob sie F13–F24 senden, ob Esc, Einfg, Pos1/Ende und die Pfeiltasten dabei sind, ob die Tasten groß genug sind – und ob die App Internetzugriff verlangt und sich zentral einstellen lässt.' },
              { title: 'Bildschirmtastatur für MDE-Geräte', text: 'Es gibt auch Bildschirmtastaturen, die eigens für robuste Handhelds gebaut sind: mit Funktionstasten bis F24, großen Tasten für Handschuhe, einer Scan-Taste und Konfiguration per MDM. Als Android-Eingabemethode wirkt eine solche Tastatur in jeder App – in der Emulation ebenso wie im Browser oder in eigenen Apps. Voraussetzung: Sie ist auf dem Gerät eingeschaltet und ausgewählt, und die Emulation wertet die gesendeten Tastencodes so aus wie erwartet.' },
            ],
          },
        ],
      },
      {
        id: 'worauf-achten',
        title: 'Worauf Sie bei einer Tastatur für Terminal-Emulation achten sollten',
        toc: 'Worauf achten',
        blocks: [
          { type: 'p', text: 'Ob Hardware oder Bildschirm – diese Punkte entscheiden im Alltag:' },
          {
            type: 'list',
            items: [
              'F13–F24: Sendet die Tastatur sie überhaupt, und in der Form, die Ihre Emulation erwartet – in der Regel Umschalt+F1…F12? Probieren Sie es mit der Tastenbelegung Ihrer Emulation aus.',
              'Sondertasten: Esc, Tab, Einfg (schaltet zwischen Einfügen und Überschreiben um), Entf, Pos1/Ende, Bild auf/ab und die Pfeiltasten. Für 5250 außerdem Feldende und Reset – auf genau der Taste, auf die Ihre Emulation sie legt. Nicht jede Tastatur kann Strg- oder Alt-Kombinationen oder die Enter-Taste des Ziffernblocks senden.',
              'Tastengröße: Android empfiehlt Bedienflächen von mindestens 48 × 48 dp – größer ist besser, mit Handschuhen erst recht. Hilfreich ist eine einstellbare Tastenhöhe. Manche robusten Geräte haben einen Touch-Modus für Handschuhe, der ab Werk ausgeschaltet sein kann.',
              'Ziffernblock: Mengen, Lagerplätze und Artikelnummern sind oft Zahlen – ein großer Ziffernblock in Telefon- oder Rechner-Reihenfolge gehört deshalb dazu. Ob er sich von selbst öffnet, hängt davon ab, welchen Feldtyp die Emulation an Android meldet; sonst wechseln Sie von Hand.',
              'Scanner: Eine Scan-Taste auf der Tastatur löst den Scanner per Software aus – praktisch, wenn ohnehin auf dem Bildschirm getippt wird.',
              'Konfiguration per MDM: Mit Android Enterprise gibt die IT die Einstellungen einer App zentral vor (Managed Configuration) und legt fest, welche Tastaturen erlaubt sind. Gut ist eine Tastatur, deren Layout, Tastengröße und Sondertasten sich so für alle Geräte gleich einstellen lassen.',
              'Datenschutz: Eine Bildschirmtastatur sieht alles, was getippt wird. Android warnt beim Einschalten: „Diese Eingabemethode kann den gesamten von dir eingegebenen Text erfassen“ – Passwörter eingeschlossen. Prüfen Sie, ob die Tastatur Internetzugriff hat, ein Wörterbuch führt oder Getipptes speichert.',
            ],
          },
        ],
      },
      {
        id: 'industrial-keyboard',
        title: 'Industrial Keyboard: die MDE-Tastatur von ICT Baden',
        toc: 'Industrial Keyboard',
        blocks: [
          { type: 'p', text: 'Industrial Keyboard ist unsere Bildschirmtastatur für robuste Android-Geräte ab Android 8.0 – eine Android-Eingabemethode, die in jedem Eingabefeld erscheint. Der Reiter Fn zeigt F1–F12; Umschalt macht daraus für einen Tastendruck F13–F24, nach einem Doppeltipp so lange, bis Sie Umschalt wieder antippen. Daneben liegen Esc, Tab, Einfg, Entf, Pos1, Ende, Bild auf/ab und die Pfeiltasten. Wer F1–F12 immer sehen will, schaltet die feste Funktionstastenreihe über den Buchstaben ein; F13–F24 und die übrigen Sondertasten bleiben auf dem Reiter Fn.' },
          { type: 'p', text: 'F1–F12 sendet Industrial Keyboard als Tastencodes `KEYCODE_F1` bis `KEYCODE_F12`, F13–F24 als Umschalt+F1…F12 – die Belegung, die IBM für 5250- und 3270-Sitzungen am PC dokumentiert. Das gilt für jede Android-Version ab 8.0 – auch für Geräte, die eigene Tastencodes für F13–F24 noch nicht kennen. Esc, Einfg, Pos1 und die anderen Sondertasten kommen ebenfalls als Tastenereignisse an, Buchstaben und Ziffern als Text.' },
          {
            type: 'items',
            items: [
              { title: 'Vorlage für Terminal-Emulation', text: 'Die Vorlage `terminal-emulation.json` stellt ein dunkles Design, die feste F-Tasten-Reihe, Esc auf der frei belegbaren Taste der Buchstabenseite und Tab im Ziffernblock ein und schaltet die automatische Großschreibung ab. Dazu kommt ein Reiter „Host“ mit F13–F24, Bild auf/ab, „Send“ (Enter) und den Tasten „Field exit“ und „Reset“. In der Vorlage sendet „Field exit“ die Tab-Taste und „Reset“ die Esc-Taste.' },
              { title: 'Große Tasten für Handschuhe', text: 'Tastenhöhe 70–160 % – 100 % entsprechen 54 dp Zeilenhöhe, für Handschuhe sind 120–140 % empfohlen. Dazu eine Vorschau über dem Finger, ein kontrastreiches Design und eine Vibration, die sich auf 30–40 ms stellen lässt, damit sie durch Handschuhe zu spüren ist.' },
              { title: 'Scan-Taste', text: 'Der Reiter Scan hat eine große Auslösefläche: tippen für einen Scan, halten für Dauerscan. Zebra DataWedge und Honeywell erkennt die Tastatur selbst, andere Scanner-Apps löst sie per Intent aus. Den Code gibt am einfachsten der Scanner selbst als Tastatureingabe aus. Scans, die nur als Broadcast kommen, tippt die Tastatur auf Wunsch ein – ab Werk aus, nie in Passwortfelder und nicht in Felder ohne Texteditor, wie sie manche Terminal-Emulationen verwenden.' },
              { title: 'Eigene Tasten und Makros', text: 'Weitere Reiter und Tasten legen Sie in JSON fest, ohne App-Update – etwa `{F13}`, `{TAB}{TAB}` oder `{ESC}{F3}`. Makros kennen Tab, Enter, Esc, Rückschritt, Entf, Einfg, Pos1, Ende, Bild auf/ab, die Pfeiltasten und F1–F24; Strg- und Alt-Kombinationen und die Enter-Taste des Ziffernblocks gehören nicht dazu.' },
              { title: 'Zentral einstellen', text: 'Managed Configuration aus jedem EMM (Schlüssel `config_json`), Konfigurationsdatei – auf Zebra-Geräten auch unter `/enterprise/usr` – oder StageNow-Broadcast; ein Admin-Kennwort schützt die Einstellungen. Auf Zebra-Geräten macht ein MX-Profil (UI Manager) Industrial Keyboard zur Standardtastatur.' },
              { title: 'Ohne Internet', text: 'Keine Internetberechtigung – die App fordert nur die Vibration an –, kein Wörterbuch, nichts Getipptes wird gespeichert oder gelernt.' },
            ],
          },
          { type: 'p', text: 'Ehrlich gesagt: Ob Ihre Emulation Umschalt+F1…F12 als F13–F24 auswertet und was sie mit Tab und Esc macht, legt ihre Tastenbelegung fest – in der PC-Standardbelegung von IBM liegen Feldende und Reset auf anderen Tasten (siehe [oben](#f13-f24)). Probieren Sie die Vorlage deshalb mit Ihrer Emulation aus und passen Sie bei Bedarf die Belegung der Emulation oder die Ausgabe der Tasten an. Der Honeywell-Auslöser folgt der Herstellerdokumentation und ist noch nicht auf einem Honeywell-Gerät getestet; Google Play ist vorbereitet, aber noch nicht veröffentlicht. Industrial Keyboard (Version {version}) ist {lizenz}.{download}' },
          { type: 'product', text: 'Bildschirmtastatur für robuste Android-Geräte: F1–F24, Esc, Einfg und Pfeiltasten, große Tasten für Handschuhe, Scan-Taste und Konfiguration per MDM – ohne Internetberechtigung.', compare: { label: 'Vergleich mit anderen MDE-Tastaturen', href: '/produkte/industrial-keyboard/#alternative' } },
        ],
      },
      {
        id: 'vergleich',
        title: 'Die Wege im Vergleich',
        toc: 'Vergleich',
        blocks: [
          {
            type: 'table',
            caption: 'Wege zu Funktionstasten auf Android-Handhelds im Vergleich',
            head: ['Weg', 'F1–F12', 'F13–F24', 'Esc, Einfg, Pos1, Pfeile', 'Funktioniert in', 'Zusätzliches Gerät', 'Zentral einstellbar'],
            rows: [
              ['Hardware-Tastatur des Geräts', 'je nach Modell, oft über Farbtaste', 'je nach Modell und Tastaturvariante', 'je nach Modell', 'jeder App', 'nein', 'je nach Hersteller'],
              ['Tastenleiste der Emulation', 'in der Regel ja', 'je nach Emulation', 'je nach Emulation', 'nur dieser Emulation', 'nein', 'je nach Emulation'],
              ['Externe Tastatur (Bluetooth, USB)', 'ja', 'als Umschalt+F1…F12, wenn die Emulation sie so belegt', 'ja', 'jeder App', 'ja', '–'],
              ['Allgemeine Bildschirmtastatur mit F-Tasten', 'je nach App', 'je nach App', 'je nach App', 'jeder App', 'nein', 'je nach App'],
              ['MDE-Tastatur, z. B. Industrial Keyboard', 'ja: Reiter Fn oder feste Reihe', 'ja, als Umschalt+F1…F12', 'ja, auf dem Reiter Fn', 'jeder App', 'nein', 'ja: Managed Configuration, Datei, StageNow'],
            ],
            key: 4,
            note: '„Je nach …“: Das unterscheidet sich von Gerät zu Gerät und von App zu App. Ob eine Emulation Umschalt+F1…F12 als F13–F24 auswertet, legt ihre Tastenbelegung fest. Eigene Tastencodes für F13–F24 kennt Android erst ab Android 16.',
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
              { title: 'Handhelds mit Tastatur in der passenden Variante', text: 'Die Funktionstasten des Geräts – welche Taste was sendet, steht im Handbuch.' },
              { title: 'Nur eine Emulation im Einsatz, mit eigener Tastenleiste', text: 'Die Leiste der Emulation – sie kann auch Funktionen wie Feldende und Reset direkt auslösen.' },
              { title: 'Touch-Geräte ohne Tastatur, mehrere Apps', text: 'Eine Bildschirmtastatur für MDE-Geräte wie Industrial Keyboard: F1–F24 und Sondertasten in jeder App, große Tasten und eine Scan-Taste.' },
              { title: 'Viel Text an einem festen Platz', text: 'Eine externe Tastatur per Bluetooth oder USB.' },
              { title: 'Viele Geräte, einheitlich eingerichtet', text: 'Eine Tastatur, die sich per MDM einstellen lässt, dazu die Liste der erlaubten Tastaturen im MDM.' },
              { title: 'Arbeit mit Handschuhen', text: 'Große, einstellbare Tasten und – falls das Gerät ihn hat – der Touch-Modus für Handschuhe.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Gibt es eine Android-Tastatur mit F13 bis F24?', a: 'Ja, zum Beispiel Industrial Keyboard: Der Reiter Fn zeigt F1–F12, mit Umschalt F13–F24. Gesendet werden F13–F24 als Umschalt+F1…F12, die übliche Belegung in 5250- und 3270-Emulationen; ob Ihre Emulation sie so auswertet, legt ihre Tastenbelegung fest. Industrial Keyboard (Version {version}) ist {lizenz}.{download}' },
      { q: 'Warum kennt Android keine F-Tasten über F12?', a: 'Bis Android 15 gibt es tatsächlich nur Tastencodes für F1 bis F12. `KEYCODE_F13` bis `KEYCODE_F24` sind erst mit Android 16 (API-Level 36) dazugekommen, und eine App muss sie auch auswerten. Für ältere Geräte bleibt Umschalt+F1…F12 – die Belegung, die 5250- und 3270-Emulationen auch auf der PC-Tastatur verwenden.' },
      { q: 'Wie bekomme ich die Taste Feldende (Field Exit) für 5250 aufs Handheld?', a: 'Feldende hat auf der PC-Tastatur keine eigene Taste, und Emulationen legen die Funktion auf unterschiedliche Tasten – die Standardbelegung von IBM auf die Enter-Taste des Ziffernblocks. Schauen Sie in der Tastenbelegung Ihrer Emulation nach und legen Sie Feldende bei Bedarf auf eine Taste, die Ihre Tastatur senden kann. In der Vorlage `terminal-emulation.json` von Industrial Keyboard sendet die Taste „Field exit“ Tab; ihre Ausgabe lässt sich in der Konfiguration ändern.' },
      { q: 'Funktioniert eine Bildschirmtastatur mit Handschuhen?', a: 'Ja, wenn die Tasten groß genug sind und das Display Handschuhe erkennt. Android empfiehlt Bedienflächen von mindestens 48 × 48 dp, und manche robusten Geräte haben einen eigenen Touch-Modus für Handschuhe. In Industrial Keyboard ist die Tastenhöhe von 70 bis 160 % einstellbar, für Handschuhe sind 120–140 % empfohlen.' },
      { q: 'Kann eine Bildschirmtastatur mitlesen, was ich tippe?', a: 'Technisch ja: Jede Tastatur sieht alles Getippte, und Android weist beim Einschalten ausdrücklich darauf hin – Passwörter und Kreditkartennummern eingeschlossen. Achten Sie deshalb auf Internetzugriff, Wörterbuch und gespeicherte Eingaben. Industrial Keyboard hat keine Internetberechtigung und kein Wörterbuch und speichert oder lernt nichts Getipptes.' },
      { q: 'Lässt sich die Tastatur per MDM auf alle Geräte bringen?', a: 'Ja. Ein MDM mit Android Enterprise verteilt die App, legt die erlaubten Tastaturen fest und gibt die Einstellungen als Managed Configuration vor. Industrial Keyboard nimmt die ganze Konfiguration im Schlüssel `config_json` an, alternativ als Datei oder per StageNow. Manche MDMs machen sie direkt zur Standardtastatur, auf Zebra-Geräten ein MX-Profil; sonst wird sie einmal am Gerät ausgewählt. Google Play ist vorbereitet, aber noch nicht veröffentlicht; bis dahin wird die APK über das MDM oder per adb verteilt.' },
    ],
    trademarks: 'Industrial Keyboard ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden. Android ist eine Marke von Google LLC; IBM und IBM i sind Marken der International Business Machines Corporation; Zebra, DataWedge und StageNow sind Marken von Zebra Technologies, Honeywell ist eine Marke von Honeywell International; Bluetooth ist eine eingetragene Marke der Bluetooth SIG, Inc. Sie werden nur genannt, um Funktionen und Kompatibilität zu beschreiben.',
  },
  en: {
    slug: 'android-keyboard-function-keys-terminal-emulation',
    title: 'Android keyboard with F13–F24 for terminal emulation (5250)',
    description: 'F1 to F24 on Android handhelds: why on-screen keyboards lack function keys, how 5250 emulators map F13–F24 and which options fit when.',
    h1: 'Android keyboard with function keys: F1 to F24 for terminal emulation on handhelds',
    short: 'Android keyboard with function keys',
    teaser: 'F1–F24, Esc and Insert on Android handhelds: hardware keys, the emulator’s toolbar, an external or an on-screen keyboard – which option fits when.',
    lead: 'The on-screen keyboards that come with Android devices usually have no function keys. For terminal emulation (5250, 3270, VT) on a handheld, F1–F24 and special keys such as Esc and Insert therefore come from the device’s hardware keypad, the emulator’s own toolbar, an external keyboard or an on-screen keyboard with function keys. 5250 and 3270 emulators usually map F13–F24 to Shift+F1…F12; Android itself has had key codes of its own for them only since version 16.',
    sections: [
      {
        id: 'why',
        title: 'Why Android keyboards show no function keys',
        toc: 'Why no function keys',
        blocks: [
          { type: 'p', text: 'On Android, on-screen keyboards usually deliver text: they hand the app finished characters, not individual key presses. The Android documentation says explicitly that a key press on an on-screen keyboard need not produce a key event at all. Android even discourages keyboards from sending such events, and Android’s default on-screen keyboard sends none to current apps.' },
          { type: 'p', text: 'Function keys are not characters, though. A terminal emulator can only receive F1, Insert, Home or the arrow keys from a keyboard as key events with a key code. An on-screen keyboard for terminal emulation therefore has to send these keys deliberately as key events – which is what sets it apart from a keyboard for writing.' },
          { type: 'p', text: 'Beyond F12 it gets tight for Android itself: key codes for F1 to F12 have existed since Android 3.0, those for F13 to F24 only since Android 16 (API level 36). On devices with Android 15 or earlier, F13 has no key code of its own – and even from Android 16 on, the new codes only help if the emulator handles them.' },
        ],
      },
      {
        id: 'f13-f24',
        title: 'F13–F24, Field Exit and Reset: how 5250 and 3270 emulators map them',
        toc: 'F13–F24 in emulators',
        blocks: [
          { type: 'p', text: 'Applications on IBM i (5250) and on the mainframe (3270) use 24 function keys; a PC keyboard has twelve. Emulators therefore usually put F13–F24 – called PF13–PF24 in 3270 – on Shift+F1 to Shift+F12. That is the default layout IBM documents for its 5250 and 3270 emulation on the PC, and other emulators ship with the same mapping.' },
          { type: 'p', text: 'The same goes for 5250 keys that a PC keyboard does not have at all. In IBM’s default layout, Field Exit sits on the Enter key of the numeric keypad, Reset on the left Ctrl key and Attention on Esc. Other emulators use other keys – Field Exit on Ctrl+Enter, for example, and Reset on no key at all. What a key on the handheld has to send is therefore defined by your emulator’s key mapping, which can usually be changed there as well.' },
          { type: 'p', text: 'With VT emulation, it depends on the terminal being emulated which function keys exist – up to F20, depending on the type – and which keys they sit on.' },
        ],
      },
      {
        id: 'options',
        title: 'Ways to get function keys on a handheld',
        toc: 'The options',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'The device’s hardware keypad', text: 'On handhelds with a keypad, function keys are often secondary functions reached with a colour-coded modifier key; some models are available with keypad variants for 5250, 3270 or VT emulation. Real keys take up no screen space. Which F-keys exist and how they are mapped depends on the model and keypad variant, though – and touch-only devices have none.' },
              { title: 'The terminal emulator’s toolbar', text: 'Terminal emulators for Android often bring their own toolbar or keyboard with function keys and macros, and let you map the device’s hardware keys to emulator functions. Because the emulator knows its own functions, such a toolbar can also trigger Field Exit or Reset directly. But it only exists in that one app, takes up screen space and is set up per app.' },
              { title: 'External keyboard via Bluetooth or USB', text: 'Android also supports full-size, PC-style external keyboards. F1–F12 then arrive as real keys, F13–F24 as Shift+F1…F12 if the emulator maps them that way. Convenient for longer input at a fixed spot; with the handheld in your hand it is an extra device that has to be paired or plugged in.' },
              { title: 'General on-screen keyboards with F-keys', text: 'There are on-screen keyboards for Android with a row of function keys. For work with a terminal emulator the details matter: whether they send F13–F24, whether Esc, Insert, Home/End and the arrow keys are included, whether the keys are big enough – and whether the app asks for internet access and can be configured centrally.' },
              { title: 'On-screen keyboard for rugged handhelds', text: 'There are also on-screen keyboards built specifically for rugged handhelds: with function keys up to F24, big keys for gloves, a scan key and configuration through your MDM. As an Android input method, such a keyboard works in every app – in the emulator as well as in the browser or your own apps. Prerequisites: it is enabled and selected on the device, and the emulator interprets the key codes it sends as expected.' },
            ],
          },
        ],
      },
      {
        id: 'what-to-look-for',
        title: 'What to look for in a keyboard for terminal emulation',
        toc: 'What to look for',
        blocks: [
          { type: 'p', text: 'Hardware or on-screen – these points decide how well it works day to day:' },
          {
            type: 'list',
            items: [
              'F13–F24: does the keyboard send them at all, and in the form your emulator expects – usually Shift+F1…F12? Try it with your emulator’s key mapping.',
              'Special keys: Esc, Tab, Insert (toggles between insert and overwrite), Delete, Home/End, Page Up/Down and the arrow keys. For 5250 also Field Exit and Reset – on exactly the key your emulator puts them on. Not every keyboard can send Ctrl or Alt combinations or the Enter key of the numeric keypad.',
              'Key size: Android recommends touch targets of at least 48 × 48 dp – larger is better, all the more with gloves. An adjustable key height helps. Some rugged devices have a touch mode for gloves that may be off out of the box.',
              'Numeric pad: quantities, bin locations and item numbers are often numbers, so a large numeric pad in phone or calculator order belongs in the mix. Whether it opens by itself depends on which field type the emulator reports to Android; otherwise you switch by hand.',
              'Scanner: a scan key on the keyboard pulls the scanner’s soft trigger – practical when you are typing on the screen anyway.',
              'Configuration through your MDM: with Android Enterprise, IT sets an app’s settings centrally (managed configuration) and decides which keyboards are allowed. Look for a keyboard whose layout, key size and special keys can be set the same way on every device.',
              'Privacy: an on-screen keyboard sees everything that is typed. When you enable one, Android warns that it “may be able to collect all the text you type” – passwords included. Check whether the keyboard has internet access, keeps a dictionary or stores what is typed.',
            ],
          },
        ],
      },
      {
        id: 'industrial-keyboard',
        title: 'Industrial Keyboard: the rugged-device keyboard by ICT Baden',
        toc: 'Industrial Keyboard',
        blocks: [
          { type: 'p', text: 'Industrial Keyboard is our on-screen keyboard for rugged Android devices with Android 8.0 or later – an Android input method that appears in every input field. The Fn tab shows F1–F12; Shift turns them into F13–F24 for one key press, after a double tap until you tap Shift again. Next to them are Esc, Tab, Insert, Delete, Home, End, Page Up/Down and the arrow keys. To keep F1–F12 always in view, switch on the fixed function key row above the letters; F13–F24 and the other special keys stay on the Fn tab.' },
          { type: 'p', text: 'Industrial Keyboard sends F1–F12 as the key codes `KEYCODE_F1` to `KEYCODE_F12` and F13–F24 as Shift+F1…F12 – the mapping IBM documents for 5250 and 3270 sessions on the PC. This applies on every Android version from 8.0 – including devices that do not know key codes of their own for F13–F24 yet. Esc, Insert, Home and the other special keys arrive as key events too, letters and digits as text.' },
          {
            type: 'items',
            items: [
              { title: 'Template for terminal emulation', text: 'The `terminal-emulation.json` template sets a dark theme, the fixed F-key row, Esc on the programmable key of the letter page and Tab on the numeric pad, and switches off automatic capitalisation. It also adds a Host tab with F13–F24, Page Up/Down, Send (Enter) and the keys “Field exit” and “Reset”. In the template, “Field exit” sends Tab and “Reset” sends Esc.' },
              { title: 'Big keys for gloves', text: 'Key height 70–160 % – 100 % is a 54 dp row, and 120–140 % is recommended for gloves. Plus a preview above the finger, a high-contrast theme and a vibration that can be set to 30–40 ms so that it can be felt through gloves.' },
              { title: 'Scan key', text: 'The scan tab has a large trigger pad: tap for one scan, hold for continuous scanning. The keyboard detects Zebra DataWedge and Honeywell by itself and triggers other scanner apps by intent. The simplest way to get the barcode into the field is the scanner’s own keystroke output. Scans that only arrive as a broadcast can be typed by the keyboard – off by default, never into password fields and not into fields without a text editor, which some terminal emulators use.' },
              { title: 'Custom keys and macros', text: 'Extra tabs and keys are defined in JSON, with no app update – for example `{F13}`, `{TAB}{TAB}` or `{ESC}{F3}`. Macros know Tab, Enter, Esc, Backspace, Delete, Insert, Home, End, Page Up/Down, the arrow keys and F1–F24; Ctrl and Alt combinations and the Enter key of the numeric keypad are not among them.' },
              { title: 'Central configuration', text: 'Managed configuration from any EMM (key `config_json`), a configuration file – on Zebra devices also in `/enterprise/usr` – or a StageNow broadcast; an admin password protects the settings. On Zebra devices an MX profile (UI Manager) makes Industrial Keyboard the default keyboard.' },
              { title: 'No internet', text: 'No internet permission – the app requests vibration only –, no dictionary, nothing you type is stored or learned.' },
            ],
          },
          { type: 'p', text: 'Honestly: whether your emulator reads Shift+F1…F12 as F13–F24, and what it does with Tab and Esc, is up to its key mapping – in IBM’s default PC layout, Field Exit and Reset sit on other keys (see [above](#f13-f24)). So try the template with your emulator first and, where needed, adjust the emulator’s mapping or the output of the keys. The Honeywell trigger follows the vendor documentation and has not been tested on a Honeywell device yet; Google Play is prepared but not published yet. Industrial Keyboard (version {version}) is {lizenz}.{download}' },
          { type: 'product', text: 'On-screen keyboard for rugged Android devices: F1–F24, Esc, Insert and arrow keys, big keys for gloves, a scan key and configuration through your MDM – no internet permission.', compare: { label: 'Comparison with other keyboards for rugged devices', href: '/en/products/industrial-keyboard/#alternative-to' } },
        ],
      },
      {
        id: 'comparison',
        title: 'The options compared',
        toc: 'Comparison',
        blocks: [
          {
            type: 'table',
            caption: 'Ways to get function keys on Android handhelds compared',
            head: ['Option', 'F1–F12', 'F13–F24', 'Esc, Insert, Home, arrows', 'Works in', 'Extra device', 'Central configuration'],
            rows: [
              ['Device’s hardware keypad', 'depends on the model, often via a colour key', 'depends on model and keypad variant', 'depends on the model', 'every app', 'no', 'depends on the vendor'],
              ['Emulator’s toolbar', 'usually yes', 'depends on the emulator', 'depends on the emulator', 'that emulator only', 'no', 'depends on the emulator'],
              ['External keyboard (Bluetooth, USB)', 'yes', 'as Shift+F1…F12, if the emulator maps them that way', 'yes', 'every app', 'yes', '–'],
              ['General on-screen keyboard with F-keys', 'depends on the app', 'depends on the app', 'depends on the app', 'every app', 'no', 'depends on the app'],
              ['Rugged-device keyboard, e.g. Industrial Keyboard', 'yes: Fn tab or fixed row', 'yes, as Shift+F1…F12', 'yes, on the Fn tab', 'every app', 'no', 'yes: managed configuration, file, StageNow'],
            ],
            key: 4,
            note: '“Depends on …”: this differs from device to device and from app to app. Whether an emulator reads Shift+F1…F12 as F13–F24 is defined by its key mapping. Android has key codes of its own for F13–F24 only from Android 16 on.',
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
              { title: 'Handhelds with a keypad in the right variant', text: 'The device’s function keys – the manual says which key sends what.' },
              { title: 'Only one emulator in use, with its own toolbar', text: 'The emulator’s toolbar – it can also trigger functions such as Field Exit and Reset directly.' },
              { title: 'Touch devices without a keypad, several apps', text: 'An on-screen keyboard for rugged handhelds such as Industrial Keyboard: F1–F24 and special keys in every app, big keys and a scan key.' },
              { title: 'Lots of text at a fixed spot', text: 'An external keyboard via Bluetooth or USB.' },
              { title: 'Many devices, set up the same way', text: 'A keyboard that can be configured through your MDM, plus the list of allowed keyboards in the MDM.' },
              { title: 'Working with gloves', text: 'Big, adjustable keys and – if the device has one – the touch mode for gloves.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Is there an Android keyboard with F13 to F24?', a: 'Yes, Industrial Keyboard for example: the Fn tab shows F1–F12, and with Shift F13–F24. They are sent as Shift+F1…F12, the usual mapping in 5250 and 3270 emulators; whether your emulator reads them that way is defined by its key mapping. Industrial Keyboard (version {version}) is {lizenz}.{download}' },
      { q: 'Why does Android have no function keys above F12?', a: 'Up to Android 15 there really are key codes for F1 to F12 only. `KEYCODE_F13` to `KEYCODE_F24` arrived with Android 16 (API level 36), and an app has to handle them too. For older devices, Shift+F1…F12 remains – the mapping that 5250 and 3270 emulators also use on a PC keyboard.' },
      { q: 'How do I get the Field Exit key for 5250 onto a handheld?', a: 'Field Exit has no key of its own on a PC keyboard, and emulators put it on different keys – IBM’s default layout uses the Enter key of the numeric keypad. Check your emulator’s key mapping and, if needed, move Field Exit to a key your keyboard can send. In Industrial Keyboard’s `terminal-emulation.json` template the “Field exit” key sends Tab; its output can be changed in the configuration.' },
      { q: 'Does an on-screen keyboard work with gloves?', a: 'Yes, if the keys are big enough and the display recognises gloves. Android recommends touch targets of at least 48 × 48 dp, and some rugged devices have a touch mode of their own for gloves. In Industrial Keyboard the key height can be set from 70 to 160 %, with 120–140 % recommended for gloves.' },
      { q: 'Can an on-screen keyboard read what I type?', a: 'Technically yes: every keyboard sees everything typed, and Android points this out explicitly when you enable one – passwords and credit card numbers included. So check internet access, dictionaries and stored input. Industrial Keyboard has no internet permission and no dictionary, and stores or learns nothing you type.' },
      { q: 'Can the keyboard be rolled out to every device through an MDM?', a: 'Yes. An MDM with Android Enterprise distributes the app, sets the allowed keyboards and pushes the settings as a managed configuration. Industrial Keyboard takes its whole configuration in the key `config_json`, or as a file or by StageNow. Some MDMs make it the default keyboard directly, on Zebra devices an MX profile does; otherwise it is selected once on the device. Google Play is prepared but not published yet; until then the APK is distributed through the MDM or adb.' },
    ],
    trademarks: 'Industrial Keyboard is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell. Android is a trademark of Google LLC; IBM and IBM i are trademarks of International Business Machines Corporation; Zebra, DataWedge and StageNow are trademarks of Zebra Technologies, Honeywell is a trademark of Honeywell International; Bluetooth is a registered trademark of Bluetooth SIG, Inc. They are named only to describe features and compatibility.',
  },
};

export default guide;
