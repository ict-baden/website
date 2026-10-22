// Ratgeber „Barcode-Scan kommt im Browser des MDE-Geräts nicht an“ – warum Scans in einer Web-App auf Android-MDE-Geräten
// fehlen, unvollständig sind, ohne Enter oder im falschen Feld landen, und welche Wege es gibt; das eigene Produkt ist
// Industrial Kiosk Browser (früher Pforte, davor EnterpriseBrowser).
// Ausrichtung (docs/sichtbarkeit.md, Abschnitt 3.6, noch unter dem Namen Pforte): „Scanner schreibt nicht in Browser /
// datawedge web app javascript“ (mittel), „Browser für MDE-Geräte, Webbrowser Handscanner Lager / browser for handheld
// scanner“ (mittel–hoch), „Kiosk-Browser mit Barcodescanner“ (mittel). Antwort zuerst, dann ehrliche Fehlersuche; das
// Produkt ist einer von vier Wegen. Terminal-Emulation nur zur Abgrenzung.
// Quellen (abgerufen 2026-10-22):
// - Profile, Profile0, Zuordnung: Zebra TechDocs „DataWedge Profiles“ (techdocs.zebra.com/datawedge/latest/guide/profiles/):
//   „default Profile that automatically takes effect for any app that has not been associated …“; „an activity or app
//   can be associated only to a single Profile“; „Profile0 can be disabled to prevent scanning in apps …“; Decoder je
//   Profil („Set the symbologies/decoders the scanner should recognize“).
// - Profil anlegen: Zebra TechDocs „Manage Profiles“ (…/datawedge/latest/guide/createprofile/): „Associated apps“, „tap the
//   asterisk to associate all app activities with the Profile“, „check that Barcode Input and Keystroke Output are enabled“.
// - Scanner liest, Daten kommen nicht an: Zebra TechDocs „DataWedge FAQ“ (…/datawedge/latest/guide/faq/): „I can scan
//   barcodes but they are not sent to my app.“ – „It is likely either a profile is not associated with your app …“
//   (DataWedge scannt dann mit Profile0, weiß aber nicht, wohin mit den Daten).
// - Tastatur-Ausgabe: Zebra TechDocs „Keystroke Output“ (…/datawedge/latest/guide/output/keystroke/): „sends it to the
//   associated application as a series of keystrokes“; TAB und ENTER „might be required by an application to submit
//   acquired data“; „web applications listen to these key events using DOM“; Inter-character delay „Default=0“, „when data is dispatched too
//   quickly for an application to accept“, „increase this value in increments of 100 (to a max. of 1000)“, „can negatively
//   effect application performance“; Multi-byte character delay: „sending Unicode and multi-byte characters to the Android
//   browser“; Key event delay: „key events are sent asynchronously causing data to be delivered in the incorrect order“;
//   Send Characters as Events: „set to send ASCII code 32 to 126 as key events“; ENTER ab Werk „sent as a key event“;
//   ab Android 10: „DataWedge using its own InputMethodService to dispatch data“, die Standardtastatur „disappears briefly
//   during a scan“; die eigene Tastatur von DataWedge (Tastatur-Optionen der Keystroke-Ausgabe; der englische Name steht
//   nicht im Text, weil COMPETITOR_PATTERNS „DataWedge“ + „keyboard“ sperrt) empfiehlt Zebra, um „automatically move to the
//   next text field with ENTER/TAB key after each scan“ („in a webpage or Android application“) und um „prevent the
//   default keyboard from appearing during a continuous scan session“.
// - Intent-Ausgabe: Zebra TechDocs „Intent Output“ (…/datawedge/latest/guide/output/intent/): „sent to the associated
//   foreground application as payload within an Android intent object“; Empfänger sind Komponenten einer App
//   („activities, services and broadcast receivers“, Intent-Filter im AndroidManifest).
// - Enter/Tab anhängen: Zebra TechDocs „Basic Data Formatting“ (…/datawedge/latest/guide/process/bdf/): „Send ENTER key -
//   appends an ENTER character to the processed data“, „Send TAB key - appends a TAB character …“.
// - Scanner steuern nur per Intent einer App: Zebra TechDocs „DataWedge APIs“ (…/datawedge/latest/guide/api/): „DataWedge
//   APIs operate through Android intents“; „Set Disabled App List“ – „prevents the use of DataWedge“; „Soft Scan Trigger“
//   (…/guide/api/softscantrigger/): „Used to start, stop or toggle a software scanning trigger“ (Beispiel mit
//   sendBroadcast).
// - Einstellungen verteilen, Scanner exklusiv: Zebra TechDocs „DataWedge Settings“ (…/datawedge/latest/guide/settings/):
//   „distributed to other devices either manually or using a EMM“; „Control of barcode scanning hardware is exclusive.“
// - Intents: Android Developers „Intents and intent filters“ (developer.android.com/guide/components/intents-filters): „a
//   messaging object you can use to request an action from another app component“.
// - WebView-Schnittstelle: Android Developers „Build web apps in WebView“
//   (developer.android.com/develop/ui/views/layout/webapps/webview): „create interfaces between your JavaScript code and
//   client-side Android code“; „don't use addJavascriptInterface() unless you wrote all of the HTML and JavaScript …“.
// - Lock-Task-Modus: Android Developers „Lock task mode“ (developer.android.com/work/dpc/dedicated-devices/lock-task-mode):
//   „Only apps that have been allowlisted by a device policy controller (DPC) can run“; ab Android 9 „a DPC can start any
//   app's activity into lock task mode“.
// - Web (MDN, developer.mozilla.org/en-US/docs/…): „inputmode“ (…/Web/HTML/Reference/Global_attributes/inputmode): „none –
//   No virtual keyboard.“; „autofocus“ (…/Web/HTML/Reference/Global_attributes/autofocus): „should be focused on page
//   load“; „HTMLElement: focus() method“ (…/Web/API/HTMLElement/focus): „sets focus on the specified element, if it can be
//   focused“; „Element: input event“ (…/Web/API/Element/input_event): „fires when the value of an <input>, <select>, or
//   <textarea> element has been changed“; „Element: keypress event“ (…/Web/API/Element/keypress_event): „Since this event
//   has been deprecated, you should use beforeinput or keydown instead.“
// - WHATWG HTML „Implicit submission“ (html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission):
//   „hitting the "enter" key while a text control is focused implicitly submits the form“ (dort „on some platforms“,
//   deshalb im Text „kann … abschicken“).
// - Honeywell: keine belastbare Herstellerquelle zu Keyboard Wedge und Suffix gefunden (nur Anleitungen Dritter) – daher nur
//   allgemein („Handbuch des Geräts“). Die Honeywell-Anbindung des Produkts steht in dessen Doku.
// - Terminal-Emulation (Telnet, 5250, 3270, VT) nur als Abgrenzung, so wie die Produktseite sie beschreibt; dass es
//   Kiosk-Browser mit Scanner-Anbindung von mehreren Anbietern gibt, zeigt deren Vergleichsabschnitt (#alternative).
// - Industrial Kiosk Browser: ict-baden/industrialkioskbrowser origin/main f63c5c0 (Umbenennung, noch nicht als 0.7.0
//   veröffentlicht): README.md; CHANGELOG.md (Unreleased: neuer Name, Paketname, window.IndustrialKioskBrowser, Ereignis
//   industrialkioskbrowser:scan, DataWedge-Profil „Industrial Kiosk Browser“); docs/configuration.md (scanner.terminator
//   ab Werk enter, injectIntoFocusedField, genericIntent; DataWedge-Profil „intent output on, keystroke off“, Decoder
//   bleiben; Honeywell über den Data Collection Service; keyboard.showOnFocus; Kiosk, Allowlist „Applies to main-frame
//   navigations“); docs/web-integration.md (Ablauf eines Scans, Text ins Feld mit Fokus auch in Shadow DOM und
//   same-origin iframes, input/change, Enter/Tab als echte Tastendrücke, Ereignis, Meta-Tags, JavaScript-API nur für
//   erlaubte Hosts, fehlt bei Nicht-Standard-Port); docs/limitations.md (Honeywell „Untested on hardware“, Android 8–10
//   nur Unit-Tests, Lock Task braucht Device Owner, 0.x, Umbenennung in 0.7.0 = neue App, Releases ohne APK bis zum
//   Signaturschlüssel); docs/deployment.md; Code web/ScanScripts.kt (Scan als Ganzes per value-Setter ins Feld, ohne
//   Feld mit Fokus wird nichts eingefügt, das Ereignis kommt vorher) und scanner/DataWedgeScanner.kt;
//   src/data/produktseiten/industrialkioskbrowser.ts. Version nicht als {version} (products.json steht noch auf 0.6.1 unter
//   dem Namen Pforte), sondern „Vorabversion (0.x)“; APK-Stand so wie auf der Produktseite.
// Nicht behaupten (wie auf der Produktseite): Kompatibilität mit den APIs oder der Konfiguration anderer Industriebrowser,
// Terminal-Emulation (Telnet, 5250/3270, VT), Offline-Modus, Honeywell-Gerätetest, Test von Zebra-Modellen, SAP-Zertifizierung,
// dass die Allowlist auch Unterressourcen blockiert. Keine Testgeräte, keine Fremdprodukte und keine anderen Browser mit
// Namen – der Vergleich mit benannten Produkten steht auf der Produktseite (#alternative bzw. #alternative-to).
import type { Guide } from '../../lib/ratgeber';

const guide: Guide = {
  id: 'barcode-scan-im-browser-mde',
  product: 'industrialkioskbrowser',
  published: '2026-10-22',
  de: {
    slug: 'barcode-scan-im-browser-mde',
    title: 'MDE-Gerät: Scanner schreibt nicht in den Browser – was tun?',
    description: 'Barcode-Scan kommt im Browser des MDE-Geräts nicht, ohne Enter oder im falschen Feld an? Ursachen vom DataWedge-Profil bis zum Fokus und die Lösungswege.',
    h1: 'Barcode-Scan kommt im Browser des MDE-Geräts nicht an: Ursachen und Lösungen',
    short: 'Scan kommt im Browser nicht an',
    teaser: 'Profil, Tastatur-Ausgabe, Fokus, Enter: warum der Barcode-Scan im Browser des MDE-Geräts fehlt – und welcher Lösungsweg wann passt.',
    lead: 'Kommt der Barcode-Scan im Browser des MDE-Geräts nicht an, liegt es meist am Scanner-Profil der Browser-App: Im Standardbrowser erreicht ein Scan die Web-App nur als Tastatureingabe (Keyboard Wedge) in dem Feld, das den Fokus hat – die Intent-Ausgabe des Scanners kann eine Webseite nicht empfangen. Schalten Sie für den Browser die Tastatur-Ausgabe ein, setzen Sie den Fokus auf das Scan-Feld und hängen Sie bei Bedarf Enter oder Tab an; alternativ nimmt ein Kiosk-Browser mit Scanner-Anbindung den Scan selbst per Intent an und schreibt ihn in das aktive Feld.',
    sections: [
      {
        id: 'grundlagen',
        title: 'Wie der Scan in die Web-App kommt: als Tastatureingabe oder als Intent',
        toc: 'Tastatur oder Intent',
        blocks: [
          { type: 'p', text: 'Was der eingebaute Scanner eines MDE-Geräts liest, gibt in der Regel ein Scanner-Dienst des Herstellers an die Apps weiter – auf Zebra-Geräten DataWedge. DataWedge arbeitet mit Profilen: Ein Profil ist einer oder mehreren Apps zugeordnet und gilt, sobald eine davon im Vordergrund ist; jede App gehört zu höchstens einem Profil. Für Apps ohne eigenes Profil gilt das Standardprofil Profile0. Im Profil ist auch festgelegt, wie der Scan an die App geht – für den Browser kommt es auf zwei Wege an:' },
          {
            type: 'items',
            items: [
              { title: 'Tastatur-Ausgabe (Keystroke Output, „Keyboard Wedge“)', text: 'Der Scanner-Dienst tippt den Code, als würde jemand die Tasten drücken – in das Feld, das gerade den Fokus hat. Der Browser gibt diese Eingabe wie jede andere Tastatureingabe an die Webseite weiter. Auf diesem Weg kommt ein Scan im Standardbrowser an.' },
              { title: 'Intent-Ausgabe', text: 'Der Scan geht als Android-Intent an eine App, die ihn mit eigenem Code entgegennimmt – gedacht für native Apps und für Browser mit eigener Scanner-Anbindung. Eine Webseite im Standardbrowser kann einen Intent nicht empfangen: Der Scanner liest, aber im Formular kommt nichts an.' },
            ],
          },
          { type: 'p', text: 'Geräte anderer Hersteller, etwa von Honeywell, haben eigene Scanner-Einstellungen mit anderen Bezeichnungen; wo sie stehen, zeigt das Handbuch des Geräts. Die Beispiele auf dieser Seite nennen die Einstellungen von DataWedge, wie Zebra sie dokumentiert.' },
        ],
      },
      {
        id: 'fehlersuche',
        title: 'Fehlersuche: Ursachen und Lösungen',
        toc: 'Fehlersuche',
        blocks: [
          { type: 'p', text: 'Ein schneller Test vorweg: Tippen Sie in einer einfachen Text-App, etwa einer Notiz-App, auf ein Eingabefeld und scannen Sie. Erscheint der Code dort, arbeiten Scanner und Tastatur-Ausgabe – dann liegt es am Profil der Browser-App oder an der Web-App. Erscheint er auch dort nicht, prüfen Sie zuerst den Scanner selbst: ob DataWedge eingeschaltet ist, ob der Barcode-Typ unter den Decodern aktiviert ist und ob eine andere App den Scanner belegt – laut Zebra kann immer nur eine App die Scan-Hardware steuern.' },
          {
            type: 'items',
            items: [
              { title: 'Für den Browser gilt kein passendes Profil', text: 'Ist die Browser-App keinem Profil zugeordnet, gilt Profile0 – und das kann abgeschaltet oder ohne Tastatur-Ausgabe eingestellt sein. Zebra beschreibt genau dieses Bild: Der Scanner liest, aber die Daten kommen in der App nicht an. Lösung: in DataWedge ein Profil anlegen, unter „Associated apps“ die Browser-App mit allen Aktivitäten (Sternchen) zuordnen und „Barcode Input“ sowie „Keystroke Output“ einschalten – oder Profile0 entsprechend einstellen. Läuft die Web-App in mehreren Browsern, braucht jeder die Zuordnung. Außerdem darf die Browser-App nicht in der Liste der Apps stehen, in denen DataWedge abgeschaltet ist (Disabled App List).' },
              { title: 'Der Scan geht als Intent hinaus', text: 'Ist im Profil des Browsers die Intent-Ausgabe statt der Tastatur-Ausgabe eingeschaltet, schickt DataWedge den Scan als Android-Intent – den nur eine App mit eigenem Code empfangen kann, keine Webseite. Lösung: für den Browser die Tastatur-Ausgabe einschalten. Die Intent-Ausgabe ist der richtige Weg für native Apps und für Browser, die Scans selbst annehmen.' },
              { title: 'Kein Eingabefeld hat den Fokus', text: 'Die Tastatur-Ausgabe schreibt dorthin, wo der Cursor steht. Nach dem Laden einer Seite hat ein Feld nur dann den Fokus, wenn die Web-App ihn setzt oder jemand das Feld antippt; sonst geht der Scan ins Leere. Landet er im falschen Feld, hat ein anderes Feld den Fokus – etwa weil ein angehängtes Tab ihn weitergeschoben hat. Lösung in der Web-App: das Scan-Feld mit dem Attribut `autofocus` versehen und nach jeder Buchung per `focus()` wieder darauf setzen.' },
              { title: 'Zeichen fehlen oder kommen durcheinander', text: 'Kommt der Code schneller, als die App ihn annimmt, können Zeichen fehlen. Dafür hat die Tastatur-Ausgabe von DataWedge eine Verzögerung nach jedem Zeichen („Inter-character delay“, ab Werk 0 ms): Zebra empfiehlt, sie bei Fehlern in Schritten von 100 ms zu erhöhen, bis die Fehler verschwinden, höchstens bis 1000 ms – das kann die App verlangsamen. Mit „Multi-byte character delay“ gilt die Verzögerung nur für Mehrbyte-Zeichen – Unicode- und Mehrbyte-Zeichen können laut Zebra beim Senden an den Android-Browser Probleme machen. Kommt Enter vor den letzten Zeichen an, hilft die Verzögerung vor Tastenereignissen („Key event delay“): Text und Tastenereignisse laufen getrennt und können sich überholen.' },
              { title: 'Enter oder Tab fehlt nach dem Scan', text: 'Viele Web-Apps übernehmen den Code erst mit Enter – Enter in einem Textfeld kann ein Formular abschicken – oder erwarten Tab, um ins nächste Feld zu springen. Lösung: in der Basic Data Formatting des Profils „Send ENTER key“ oder „Send TAB key“ einschalten; DataWedge hängt dann Enter bzw. Tab an den Code an. Soll nach jedem Scan per Enter oder Tab ins nächste Feld einer Webseite gesprungen werden, empfiehlt Zebra ab Android 10 zusätzlich, die eigene Tastatur von DataWedge einzublenden (eine Option der Tastatur-Ausgabe).' },
              { title: 'Die Bildschirmtastatur stört', text: 'Ab Android 10 verschwindet die Standardtastatur während eines Scans kurz und erscheint danach wieder, weil DataWedge die Daten über eine eigene Eingabemethode ausgibt. Damit sie während einer Scan-Serie gar nicht erst erscheint, empfiehlt Zebra ebenfalls die eigene Tastatur von DataWedge. In der Web-App zeigt das Attribut `inputmode="none"` dem Browser an, dass ein Feld keine Bildschirmtastatur braucht – passend für Felder, die nur gescannt werden; vorher auf dem Gerät testen.' },
              { title: 'Die Web-App wertet einzelne Tastendrücke aus', text: 'Manche Web-Apps setzen den Scan aus einzelnen Tastatur-Ereignissen zusammen – mit keydown oder dem veralteten keypress –, statt den Wert des Feldes zu lesen. Ob jedes Zeichen als Tastendruck ankommt, hängt dann vom Ausgabeweg ab: DataWedge gibt ab Android 10 über eine eigene Eingabemethode aus; ausdrücklich als Tastenereignisse schickt es druckbare Zeichen mit der Option „Send Characters as Events“. Robuster ist es, den Wert des Feldes beim input-Ereignis oder bei Enter zu lesen. Lässt sich die Web-App nicht ändern, ist „Send Characters as Events“ einen Versuch wert.' },
            ],
          },
        ],
      },
      {
        id: 'wege',
        title: 'Die Lösungswege: vom Standardbrowser bis zum Kiosk-Browser',
        toc: 'Lösungswege',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Standardbrowser mit Tastatur-Ausgabe', text: 'Der naheliegende Weg ohne zusätzliche Software: ein Scanner-Profil für die Browser-App mit Tastatur-Ausgabe, Enter oder Tab nach Bedarf und, falls nötig, einer Verzögerung nach jedem Zeichen. Die Einstellungen von DataWedge lassen sich exportieren und per MDM auf weitere Geräte verteilen. Grenzen: Die Web-App hängt von Fokus und Tastatureingaben ab und kann den Scanner nicht steuern. Auf eine App sperren lässt sich das Gerät über ein MDM im Lock-Task-Modus (ab Android 9 mit jeder App); ob sich der Browser auf bestimmte Seiten beschränken lässt, hängt vom Browser ab.' },
              { title: 'Web-App an den Scanner anpassen', text: 'Wer die Web-App selbst entwickelt, macht sie robust gegenüber der Scanner-Einstellung: Scan-Feld mit `autofocus`, Fokus nach jeder Buchung zurücksetzen, den Wert beim input-Ereignis oder bei Enter lesen statt einzelner Tastendrücke, `inputmode="none"` für reine Scan-Felder. Das funktioniert unabhängig vom Gerätehersteller, solange der Scanner als Tastatur ausgibt. Voraussetzung ist Zugriff auf den Code der Web-App – bei zugekaufter Software oft nicht gegeben.' },
              { title: 'Native App oder eigene App mit WebView', text: 'Eine Android-App nimmt den Scan per Intent mit eigenem Code an und kann den Scanner auch steuern, etwa per Soft-Trigger. Eine vorhandene Web-App lässt sich in eine eigene App mit Android WebView einbetten, die Scans über eine JavaScript-Schnittstelle an die Seite gibt; Android rät, eine solche Schnittstelle nur zu nutzen, wenn alle Inhalte in der WebView aus eigener Hand stammen. Der Preis: Android-Entwicklung, Pflege, Signierung und Verteilung der App.' },
              { title: 'Kiosk-Browser mit Scanner-Anbindung', text: 'Ein Browser für MDE-Geräte, der den Scan selbst per Intent annimmt und in das aktive Feld schreibt – vorhandene Web-Apps brauchen dann in der Regel keine Änderung. Dazu kommen je nach Produkt Kioskmodus, eine Liste erlaubter Seiten und Konfiguration per MDM. Solche Browser gibt es von mehreren Anbietern; einen sachlichen Vergleich mit bekannten Produkten finden Sie [auf der Produktseite von Industrial Kiosk Browser](/produkte/industrial-kiosk-browser/#alternative).' },
            ],
          },
          { type: 'p', text: 'Zur Abgrenzung: Terminal-Emulation ist für textbasierte Host-Anwendungen über Telnet, 5250, 3270 oder VT gedacht, nicht für Web-Apps. Wer solche Anwendungen noch betreibt, braucht dafür eine Terminal-Emulation; ein Browser – auch Industrial Kiosk Browser – ersetzt sie nicht.' },
        ],
      },
      {
        id: 'industrial-kiosk-browser',
        title: 'Industrial Kiosk Browser: Kiosk-Browser mit Scanner-Anbindung von ICT Baden',
        toc: 'Industrial Kiosk Browser',
        blocks: [
          { type: 'p', text: 'Industrial Kiosk Browser ist unser Kiosk-Browser für Android-MDE-Geräte ab Android 8.0, auf Basis von Android WebView. Er nimmt den Scan selbst an, statt auf die Tastatur-Ausgabe zu setzen: Auf Zebra-Geräten legt er beim Start ein eigenes DataWedge-Profil „Industrial Kiosk Browser“ an – mit Intent-Ausgabe, ohne Tastatur-Ausgabe – und lässt die Decoder-Einstellungen unverändert. Auf Honeywell-Geräten nutzt er die Intent-API des Data Collection Service, auf anderen Geräten jede Scanner-App, die Scans per Intent an den Browser sendet.' },
          { type: 'p', text: 'Den Scan schreibt Industrial Kiosk Browser als Ganzes in das aktive Eingabefeld – auch in Shadow DOM und in iframes derselben Herkunft – und löst input- und change-Ereignisse aus, sodass auch Web-Apps mit React oder Vue den Wert übernehmen. Danach folgt ab Werk Enter als echter Tastendruck; Tab, beides oder nichts stellen Sie in der Konfiguration (`scanner.terminator`) oder je Seite per Meta-Tag ein, etwa `<meta http-equiv="scanner" content="Enable,AutoTab">` für Tab statt Enter. Vorhandene Web-Apps funktionieren so ohne Änderung. Hat kein Textfeld den Fokus, schreibt der Browser nichts ins Formular – das Scan-Ereignis erreicht die Seite trotzdem.' },
          {
            type: 'items',
            items: [
              { title: 'Für Web-Entwickler', text: 'Das abbrechbare Ereignis `industrialkioskbrowser:scan` liefert Code, Symbologie und Quelle, bevor etwas ins Feld geschrieben wird; mit `preventDefault()` übernimmt die Seite den Scan selbst. Die JavaScript-API `window.IndustrialKioskBrowser` startet den Scan per Soft-Trigger (`IndustrialKioskBrowser.scanner.trigger()`), schaltet den Scanner ab und an, gibt Töne, Vibration und Hinweise aus – nur für erlaubte Hosts.' },
              { title: 'Kioskmodus', text: 'Werkzeug- und Systemleisten ausblenden, Beenden ausblenden oder mit Kennwort schützen; als dediziertes Gerät (Device Owner) im Lock-Task-Modus.' },
              { title: 'URL-Allowlist', text: 'Mit einer Allowlist öffnet der Browser nur Seiten erlaubter Hosts samt Subdomains; Navigationen im Hauptfenster und Formular-POSTs zu anderen Hosts werden gestoppt, bevor sie laden.' },
              { title: 'Bildschirmtastatur nach Bedarf', text: 'Auf Wunsch erscheint die Tastatur nicht beim Antippen eines Feldes, sondern nur über die Tastatur-Schaltfläche oder eine Taste.' },
              { title: 'Konfiguration per MDM', text: 'Eine JSON-Datei – als Managed Configuration aus jedem Android-Enterprise-EMM, als Datei oder per StageNow – für viele Geräte gleich.' },
            ],
          },
          { type: 'p', text: 'Ehrlich gesagt: Industrial Kiosk Browser ist eine Vorabversion (0.x); Einstellungen, JSON-Format und JavaScript-API können sich noch ändern. Die Honeywell-Anbindung folgt der dokumentierten Intent-API des Herstellers und ist noch nicht auf einem Honeywell-Gerät geprüft; Android 8 bis 10 ist nur per Unit-Tests abgedeckt. Echter Kioskmodus (Lock Task) braucht ein EMM im Modus „dediziertes Gerät“ (Device Owner), sonst blendet der Browser nur das Beenden aus; eine leere Allowlist erlaubt jeden Host. Die JavaScript-API fehlt auf Servern mit Nicht-Standard-Port – Scans, Scan-Ereignis und Meta-Tags funktionieren dort. Mit Version 0.7.0 bekommt der Browser seinen neuen Namen (vorher Pforte bzw. EnterpriseBrowser): Android sieht ihn als neue App – kein Update an Ort und Stelle; die Konfiguration wird neu ausgerollt, die alte App entfernt. Bis der Signaturschlüssel für den neuen Paketnamen eingerichtet ist, enthalten Releases SBOM und Prüfsummen, aber keine APK. Industrial Kiosk Browser ist ein Webbrowser, keine Terminal-Emulation, und unterstützt nicht die besonderen Schnittstellen und Konfigurationsdateien anderer Industriebrowser. Er ist {lizenz}.{download}' },
          { type: 'product', text: 'Scans von DataWedge, Honeywell oder jeder Scanner-App per Intent direkt ins aktive Feld, auf Wunsch mit Enter oder Tab – mit Kioskmodus, URL-Allowlist und Konfiguration per MDM; ab Android 8.0.', compare: { label: 'Vergleich mit anderen Industriebrowsern', href: '/produkte/industrial-kiosk-browser/#alternative' } },
        ],
      },
      {
        id: 'vergleich',
        title: 'Die Lösungswege im Vergleich',
        toc: 'Vergleich',
        blocks: [
          {
            type: 'table',
            caption: 'Wege, Barcode-Scans in eine Web-App auf dem MDE-Gerät zu bringen, im Vergleich',
            head: ['Weg', 'So kommt der Scan an', 'Änderung an der Web-App', 'Gerät auf die Web-App sperren', 'Einrichtung', 'Kosten'],
            rows: [
              ['Standardbrowser mit Tastatur-Ausgabe', 'Tastatureingabe in das Feld mit Fokus', 'keine, Fokus und Enter müssen aber passen', 'per MDM (Lock-Task-Modus); welche Seiten erreichbar sind, hängt vom Browser ab', 'Scanner-Profil je Gerät; DataWedge-Einstellungen lassen sich exportieren und per MDM verteilen', 'keine zusätzlichen'],
              ['Web-App anpassen', 'Tastatureingabe, robust ausgewertet', 'ja', 'wie beim Standardbrowser', 'Entwicklung an der Web-App', 'Entwicklungsaufwand'],
              ['Native App oder eigene App mit WebView', 'Intent, mit eigenem Code', 'je nach Umsetzung', 'je nach Umsetzung', 'Entwicklung, Pflege und Verteilung der App', 'Entwicklungsaufwand'],
              ['Kiosk-Browser mit Scanner-Anbindung', 'Intent; der Browser schreibt ins aktive Feld', 'in der Regel keine', 'je nach Produkt', 'je nach Produkt', 'je nach Produkt'],
              ['Industrial Kiosk Browser (ICT Baden)', 'Intent von DataWedge, Honeywell oder Scanner-App; Text ins aktive Feld, danach Enter oder Tab', 'keine; optional Ereignis, Meta-Tags, JavaScript-API', 'Kioskmodus; Lock Task nur als Device Owner', 'JSON per MDM (Managed Configuration), Datei oder StageNow', '{lizenz}'],
            ],
            key: 4,
            note: '„Je nach Produkt“ und „je nach Umsetzung“: Funktionen und Preise unterscheiden sich. Terminal-Emulation fehlt in der Tabelle mit Absicht – sie ist für Host-Anwendungen über Telnet, 5250, 3270 oder VT gedacht, nicht für Web-Apps. Industrial Kiosk Browser ist eine Vorabversion (0.x); die Honeywell-Anbindung ist noch nicht auf einem Gerät geprüft.',
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
              { title: 'Der Scan fehlt nur im Browser, in anderen Apps klappt er', text: 'Das Profil der Browser-App prüfen: zugeordnet, „Barcode Input“ und „Keystroke Output“ eingeschaltet.' },
              { title: 'Der Code kommt an, aber ohne Enter oder im falschen Feld', text: 'Enter oder Tab per Basic Data Formatting anhängen und in der Web-App den Fokus auf das Scan-Feld setzen.' },
              { title: 'Bei langen Codes fehlen Zeichen', text: 'Die Verzögerung nach jedem Zeichen in Schritten von 100 ms erhöhen.' },
              { title: 'Sie entwickeln die Web-App selbst', text: 'Die Web-App robust machen – Fokus, input-Ereignis, Enter –, dann genügt die Tastatur-Ausgabe des Scanners.' },
              { title: 'Viele Geräte, eine feste Web-App, das Gerät soll gesperrt sein', text: 'Ein Kiosk-Browser mit Scanner-Anbindung, zum Beispiel Industrial Kiosk Browser – derzeit eine Vorabversion (0.x).' },
              { title: 'Die Anwendung braucht Gerätefunktionen, die ein Browser nicht bietet', text: 'Eine native App oder eine eigene App mit WebView.' },
              { title: 'Host-Anwendungen über Telnet, 5250 oder 3270', text: 'Eine Terminal-Emulation – das leistet kein Browser.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Warum kommt der Barcode-Scan nicht im Browser an?', a: 'Meist passt das Scanner-Profil der Browser-App nicht: Für den Browser gilt kein Profil mit Tastatur-Ausgabe, oder der Scan geht als Intent hinaus – den kann eine Webseite nicht empfangen. Oder es hat kein Eingabefeld den Fokus. Prüfen Sie in DataWedge (Zebra) bzw. in den Scanner-Einstellungen Ihres Geräts, welches Profil für den Browser gilt, und schalten Sie dort die Tastatur-Ausgabe ein.' },
      { q: 'Wie bekomme ich nach dem Scan automatisch Enter?', a: 'Über die Scanner-Einstellungen: In DataWedge hängt die Basic Data Formatting mit „Send ENTER key“ ein Enter an den Code an, mit „Send TAB key“ ein Tab. Bei Geräten anderer Hersteller zeigt das Handbuch, wo sich Enter oder Tab anhängen lässt. In Industrial Kiosk Browser, derzeit eine Vorabversion (0.x), folgt ab Werk Enter auf jeden Scan; Tab, beides oder nichts stellen Sie in der Konfiguration oder je Seite per Meta-Tag ein.' },
      { q: 'Muss ich meine Web-App für den Scanner anpassen?', a: 'Nicht unbedingt. Mit Tastatur-Ausgabe kommt der Scan an, als wäre er getippt; die Web-App braucht dann ein Eingabefeld mit Fokus und sollte den Wert des Feldes lesen, nicht einzelne Tastendrücke. Mit Industrial Kiosk Browser laufen vorhandene Web-Apps ohne Änderung: Er schreibt den Scan ins aktive Feld und löst input- und change-Ereignisse aus. Industrial Kiosk Browser ist derzeit eine Vorabversion (0.x).{download}' },
      { q: 'Kann eine Webseite den Scanner direkt auslösen?', a: 'Im Standardbrowser in der Regel nicht: Scanner-Befehle wie der Soft-Trigger von DataWedge sind Android-Intents, die eine App sendet – eine Webseite hat darauf keinen Zugriff. Dort löst die Scan-Taste des Geräts aus. In Industrial Kiosk Browser, derzeit eine Vorabversion (0.x), startet eine Web-App den Scan über die JavaScript-API mit `IndustrialKioskBrowser.scanner.trigger()` – auf erlaubten Hosts, nicht auf Servern mit Nicht-Standard-Port.' },
      { q: 'Warum fehlen beim Scannen Zeichen im Browser?', a: 'Oft kommt der Code schneller, als die App ihn annimmt. In DataWedge hilft die Verzögerung nach jedem Zeichen in der Tastatur-Ausgabe („Inter-character delay“): Zebra empfiehlt, sie in Schritten von 100 ms zu erhöhen, bis die Fehler verschwinden, höchstens bis 1000 ms. Industrial Kiosk Browser, derzeit eine Vorabversion (0.x), schreibt den Scan dagegen als Ganzes ins Feld, nicht Zeichen für Zeichen.' },
      { q: 'Welcher Browser eignet sich für MDE-Geräte mit Scanner?', a: 'Für wenige Geräte kann der vorinstallierte Browser mit richtig eingestellter Tastatur-Ausgabe genügen. Für viele Geräte mit einer festen Web-App passt ein Kiosk-Browser mit Scanner-Anbindung: Er nimmt den Scan selbst an, beschränkt das Gerät auf die Web-App und wird per MDM konfiguriert. Industrial Kiosk Browser ist ein solcher Browser, {lizenz} – derzeit als Vorabversion (0.x); die Honeywell-Anbindung ist noch nicht auf einem Gerät geprüft.{download}' },
    ],
    trademarks: 'Industrial Kiosk Browser ist ein eigenständiges Produkt von ICT Baden und nicht mit Zebra Technologies oder Honeywell verbunden. Zebra, DataWedge und StageNow sind Marken von Zebra Technologies, Honeywell ist eine Marke von Honeywell International; Android ist eine Marke von Google LLC, JavaScript eine Marke von Oracle; React und Vue sind Marken ihrer jeweiligen Inhaber. Sie werden nur genannt, um Funktionen und Kompatibilität zu beschreiben.',
  },
  en: {
    slug: 'barcode-scan-web-app-android-handheld',
    title: 'Barcode scanner not typing into the browser on Android: fixes',
    description: 'Barcode scans not reaching the browser on an Android handheld? The causes, from the DataWedge profile to focus and Enter, and the fixes compared.',
    h1: 'Barcode scans not arriving in the browser on an Android handheld: causes and fixes',
    short: 'Scans not reaching the browser',
    teaser: 'Profile, keystroke output, focus, Enter: why barcode scans go missing in the browser on Android handhelds – and which fix suits which situation.',
    lead: 'If barcode scans do not show up in the browser on an Android handheld, the usual cause is the scanner profile of the browser app: in the stock browser, a scan reaches the web app only as keyboard input (keyboard wedge) in the field that has focus – a web page cannot receive the scanner’s intent output. Turn on keystroke output for the browser, put the focus on the scan field and add Enter or Tab if needed; alternatively, a kiosk browser with scanner integration receives the scan itself via intent and types it into the focused field.',
    sections: [
      {
        id: 'how-scans-arrive',
        title: 'How a scan gets into the web app: keystrokes or intent',
        toc: 'Keystrokes or intent',
        blocks: [
          { type: 'p', text: 'What the built-in scanner of a rugged handheld reads is usually passed on to apps by a scanning service from the device maker – DataWedge on Zebra devices. DataWedge works with profiles: a profile is associated with one or more apps and applies whenever one of them is in the foreground; each app belongs to one profile at most. Apps without a profile of their own get the default profile, Profile0. The profile also defines how the scan is passed on – for the browser, two outputs matter:' },
          {
            type: 'items',
            items: [
              { title: 'Keystroke output (“keyboard wedge”)', text: 'The scanning service types the code as if someone were pressing the keys – into whichever field has focus. The browser passes this input on to the web page like any other keyboard input. This is how a scan arrives in the stock browser.' },
              { title: 'Intent output', text: 'The scan is sent as an Android intent to an app that receives it with its own code – meant for native apps and for browsers with their own scanner integration. A web page in the stock browser cannot receive an intent: the scanner reads the code, but nothing arrives in the form.' },
            ],
          },
          { type: 'p', text: 'Devices from other makers, such as Honeywell, have their own scanner settings under different names; the device manual shows where to find them. The examples on this page use the DataWedge settings as documented by Zebra.' },
        ],
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting: causes and fixes',
        toc: 'Troubleshooting',
        blocks: [
          { type: 'p', text: 'A quick test first: in a simple text app, such as a notes app, tap an input field and scan. If the code appears there, the scanner and keystroke output work – so the cause lies in the browser app’s profile or in the web app. If it does not appear there either, check the scanner itself first: whether DataWedge is enabled, whether the barcode type is enabled among the decoders, and whether another app is holding the scanner – according to Zebra, only one app at a time can control the scanning hardware.' },
          {
            type: 'items',
            items: [
              { title: 'No suitable profile for the browser', text: 'If the browser app is not associated with a profile, Profile0 applies – and it may be disabled or have no keystroke output. Zebra describes exactly this situation: the scanner reads, but the data never reaches the app. Fix: create a profile in DataWedge, add the browser app under “Associated apps” with all activities (the asterisk), and enable “Barcode Input” and “Keystroke Output” – or set up Profile0 accordingly. If the web app runs in several browsers, each one needs the association. The browser app must also not be on the list of apps in which DataWedge is disabled (Disabled App List).' },
              { title: 'The scan goes out as an intent', text: 'If the browser’s profile uses intent output instead of keystroke output, DataWedge sends the scan as an Android intent – which only an app with its own code can receive, not a web page. Fix: turn on keystroke output for the browser. Intent output is the right choice for native apps and for browsers that receive scans themselves.' },
              { title: 'No input field has focus', text: 'Keystroke output types wherever the cursor is. After a page loads, a field only has focus if the web app sets it or someone taps the field; otherwise the scan goes nowhere. If it lands in the wrong field, another field has focus – for example because an appended Tab moved it on. Fix in the web app: give the scan field the `autofocus` attribute and set the focus back with `focus()` after each submission.' },
              { title: 'Characters go missing or arrive out of order', text: 'If the code arrives faster than the app can accept it, characters can get lost. DataWedge’s keystroke output has a delay after each character for this (“Inter-character delay”, 0 ms by default): Zebra recommends raising it in steps of 100 ms until the errors stop, up to 1000 ms – which can slow the app down. With “Multi-byte character delay”, the delay applies only to multi-byte characters – according to Zebra, Unicode and multi-byte characters can cause problems when sent to the Android browser. If Enter arrives before the last characters, the delay before key events (“Key event delay”) helps: text and key events travel separately and can overtake each other.' },
              { title: 'No Enter or Tab after the scan', text: 'Many web apps only take the code on Enter – Enter in a text field can submit a form – or expect Tab to move to the next field. Fix: in the profile’s Basic Data Formatting, enable “Send ENTER key” or “Send TAB key”; DataWedge then appends Enter or Tab to the code. If every scan should move on to the next field of a web page with Enter or Tab, Zebra also recommends showing DataWedge’s own keyboard (an option of keystroke output) on Android 10 and later.' },
              { title: 'The on-screen keyboard gets in the way', text: 'On Android 10 and later, the default keyboard briefly disappears during a scan and comes back afterwards, because DataWedge delivers the data through its own input method. To keep it from appearing at all during a scanning session, Zebra recommends DataWedge’s own keyboard here too. In the web app, the `inputmode="none"` attribute tells the browser that a field needs no on-screen keyboard – a good fit for fields that are only scanned; test it on the device first.' },
              { title: 'The web app listens to individual key presses', text: 'Some web apps assemble the scan from individual keyboard events – with keydown or the deprecated keypress – instead of reading the field’s value. Whether every character arrives as a key press then depends on the output: from Android 10, DataWedge delivers through its own input method, and it sends printable characters explicitly as key events with the “Send Characters as Events” option. Reading the field’s value on the input event or on Enter is more robust. If the web app cannot be changed, “Send Characters as Events” is worth a try.' },
            ],
          },
        ],
      },
      {
        id: 'options',
        title: 'The options: from the stock browser to a kiosk browser',
        toc: 'Options',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Stock browser with keystroke output', text: 'The obvious way without extra software: a scanner profile for the browser app with keystroke output, Enter or Tab as needed and, if necessary, a delay after each character. DataWedge settings can be exported and distributed to other devices through an MDM. Limits: the web app depends on focus and keyboard input and cannot control the scanner. An MDM can lock the device to one app in lock task mode (to any app from Android 9); whether the browser can be limited to certain sites depends on the browser.' },
              { title: 'Adapt the web app to the scanner', text: 'If you develop the web app yourself, you can make it robust against scanner settings: `autofocus` on the scan field, focus back after each submission, read the value on the input event or on Enter rather than from individual key presses, `inputmode="none"` for scan-only fields. This works whatever the device maker, as long as the scanner outputs keystrokes. It needs access to the web app’s code – often not available for bought-in software.' },
              { title: 'Native app or your own WebView app', text: 'An Android app receives the scan via intent with its own code and can also control the scanner, for example with a soft trigger. An existing web app can be embedded in your own app with Android WebView, which passes scans to the page through a JavaScript interface; Android advises using such an interface only when all the content in the WebView is your own. The price: Android development, maintenance, signing and distribution of the app.' },
              { title: 'Kiosk browser with scanner integration', text: 'A browser for rugged handhelds that receives the scan itself via intent and types it into the focused field – existing web apps then usually need no changes. Depending on the product, kiosk mode, a list of allowed sites and configuration through an MDM come with it. Several vendors offer such browsers; a factual comparison with well-known products is [on the Industrial Kiosk Browser product page](/en/products/industrial-kiosk-browser/#alternative-to).' },
            ],
          },
          { type: 'p', text: 'Not to be confused: terminal emulation is meant for text-based host applications over Telnet, 5250, 3270 or VT, not for web apps. If you still run such applications, you need a terminal emulator for them; a browser – Industrial Kiosk Browser included – does not replace it.' },
        ],
      },
      {
        id: 'industrial-kiosk-browser',
        title: 'Industrial Kiosk Browser: a kiosk browser with scanner integration by ICT Baden',
        toc: 'Industrial Kiosk Browser',
        blocks: [
          { type: 'p', text: 'Industrial Kiosk Browser is our kiosk browser for rugged Android devices with Android 8.0 or later, based on Android WebView. It receives scans itself instead of relying on keystroke output: on Zebra devices it creates its own DataWedge profile “Industrial Kiosk Browser” on start – intent output on, keystroke output off – and leaves the decoder settings alone. On Honeywell devices it uses the intent API of the Data Collection Service, on other devices any scanner app that sends scans to the browser via intent.' },
          { type: 'p', text: 'Industrial Kiosk Browser writes the scan as a whole into the focused input field – also inside shadow DOM and same-origin iframes – and fires input and change events, so web apps built with React or Vue pick up the value too. By default, Enter follows as a real key press; Tab, both or nothing can be set in the configuration (`scanner.terminator`) or per page with a meta tag such as `<meta http-equiv="scanner" content="Enable,AutoTab">` for Tab instead of Enter. Existing web apps work without changes. If no text field has focus, nothing is written into the form – the scan event still reaches the page.' },
          {
            type: 'items',
            items: [
              { title: 'For web developers', text: 'The cancellable `industrialkioskbrowser:scan` event delivers the code, symbology and source before anything is written into the field; with `preventDefault()` the page handles the scan itself. The `window.IndustrialKioskBrowser` JavaScript API starts a scan with a soft trigger (`IndustrialKioskBrowser.scanner.trigger()`), turns the scanner off and on, plays tones, vibrates and shows messages – on allowed hosts only.' },
              { title: 'Kiosk mode', text: 'Hide toolbar and system bars, hide the exit or protect it with a password; lock task mode as a dedicated device (device owner).' },
              { title: 'URL allow list', text: 'With an allow list, the browser only opens pages of allowed hosts and their subdomains; main-frame navigations and form posts to other hosts are stopped before they load.' },
              { title: 'On-screen keyboard on demand', text: 'Optionally, the keyboard does not appear when a field is tapped, only via the keyboard button or a key.' },
              { title: 'Configuration through your MDM', text: 'One JSON file – as a managed configuration from any Android Enterprise EMM, as a file or via StageNow – the same for many devices.' },
            ],
          },
          { type: 'p', text: 'Honestly: Industrial Kiosk Browser is a pre-release (0.x); settings, JSON format and JavaScript API may still change. The Honeywell integration follows the vendor’s documented intent API and has not been verified on a Honeywell device yet; Android 8 to 10 is covered by unit tests only. Real kiosk mode (lock task) needs an EMM in dedicated device mode (device owner); without it, the browser only hides the exit, and an empty allow list allows every host. The JavaScript API is not available on servers with a non-default port – scans, the scan event and the meta tags still work there. Version 0.7.0 brings the new name (formerly Pforte and EnterpriseBrowser): Android treats it as a new app – there is no in-place update; roll out the configuration again and remove the old app. Until the signing key for the new package name is set up, releases contain the SBOM and checksums but no APK. Industrial Kiosk Browser is a web browser, not a terminal emulator, and does not support the specific interfaces and configuration files of other industrial browsers. It is {lizenz}.{download}' },
          { type: 'product', text: 'Scans from DataWedge, Honeywell or any scanner app via intent go straight into the focused field, optionally followed by Enter or Tab – with kiosk mode, URL allow list and configuration through your MDM; Android 8.0 or later.', compare: { label: 'Comparison with other industrial browsers', href: '/en/products/industrial-kiosk-browser/#alternative-to' } },
        ],
      },
      {
        id: 'comparison',
        title: 'The options compared',
        toc: 'Comparison',
        blocks: [
          {
            type: 'table',
            caption: 'Ways to get barcode scans into a web app on an Android handheld compared',
            head: ['Option', 'How the scan arrives', 'Changes to the web app', 'Lock the device to the web app', 'Setup', 'Cost'],
            rows: [
              ['Stock browser with keystroke output', 'keyboard input into the focused field', 'none, but focus and Enter must fit', 'via MDM (lock task mode); which sites can be reached depends on the browser', 'scanner profile per device; DataWedge settings can be exported and distributed through an MDM', 'no extra cost'],
              ['Adapt the web app', 'keyboard input, read robustly', 'yes', 'as with the stock browser', 'development work on the web app', 'development effort'],
              ['Native app or your own WebView app', 'intent, with your own code', 'depends on the implementation', 'depends on the implementation', 'development, maintenance and distribution of the app', 'development effort'],
              ['Kiosk browser with scanner integration', 'intent; the browser types into the focused field', 'usually none', 'depends on the product', 'depends on the product', 'depends on the product'],
              ['Industrial Kiosk Browser (ICT Baden)', 'intent from DataWedge, Honeywell or a scanner app; text into the focused field, then Enter or Tab', 'none; optionally event, meta tags, JavaScript API', 'kiosk mode; lock task only as device owner', 'JSON via MDM (managed configuration), file or StageNow', '{lizenz}'],
            ],
            key: 4,
            note: '“Depends on the product” and “depends on the implementation”: features and prices differ. Terminal emulation is left out on purpose – it is meant for host applications over Telnet, 5250, 3270 or VT, not for web apps. Industrial Kiosk Browser is a pre-release (0.x); its Honeywell integration has not yet been verified on a device.',
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
              { title: 'The scan is missing only in the browser, other apps get it', text: 'Check the browser app’s profile: associated, with “Barcode Input” and “Keystroke Output” enabled.' },
              { title: 'The code arrives, but without Enter or in the wrong field', text: 'Append Enter or Tab with Basic Data Formatting, and set the focus on the scan field in the web app.' },
              { title: 'Characters go missing in long codes', text: 'Raise the delay after each character in steps of 100 ms.' },
              { title: 'You develop the web app yourself', text: 'Make the web app robust – focus, input event, Enter – and the scanner’s keystroke output is enough.' },
              { title: 'Many devices, one web app, the device should be locked down', text: 'A kiosk browser with scanner integration, for example Industrial Kiosk Browser – currently a pre-release (0.x).' },
              { title: 'The application needs device features a browser does not offer', text: 'A native app or your own app with WebView.' },
              { title: 'Host applications over Telnet, 5250 or 3270', text: 'A terminal emulator – no browser does that.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Why does the barcode scan not show up in the browser?', a: 'Usually the scanner profile of the browser app does not fit: no profile with keystroke output applies to the browser, or the scan goes out as an intent – which a web page cannot receive. Or no input field has focus. Check in DataWedge (Zebra) or in your device’s scanner settings which profile applies to the browser, and turn on keystroke output there.' },
      { q: 'How do I get an automatic Enter after each scan?', a: 'Through the scanner settings: in DataWedge, Basic Data Formatting appends Enter to the code with “Send ENTER key” and Tab with “Send TAB key”. On devices from other makers, the manual shows where Enter or Tab can be appended. In Industrial Kiosk Browser, currently a pre-release (0.x), Enter follows every scan by default; Tab, both or nothing can be set in the configuration or per page with a meta tag.' },
      { q: 'Do I have to change my web app for the scanner?', a: 'Not necessarily. With keystroke output, the scan arrives as if it had been typed; the web app then needs an input field with focus and should read the field’s value rather than individual key presses. With Industrial Kiosk Browser, existing web apps run without changes: it writes the scan into the focused field and fires input and change events. Industrial Kiosk Browser is currently a pre-release (0.x).{download}' },
      { q: 'Can a web page trigger the scanner directly?', a: 'Usually not in the stock browser: scanner commands such as the DataWedge soft trigger are Android intents sent by an app – a web page has no access to them. There, the device’s scan button triggers the scanner. In Industrial Kiosk Browser, currently a pre-release (0.x), a web app starts a scan through the JavaScript API with `IndustrialKioskBrowser.scanner.trigger()` – on allowed hosts, not on servers with a non-default port.' },
      { q: 'Why are characters missing from scans in the browser?', a: 'Often the code arrives faster than the app can accept it. In DataWedge, the delay after each character in keystroke output (“Inter-character delay”) helps: Zebra recommends raising it in steps of 100 ms until the errors stop, up to 1000 ms. Industrial Kiosk Browser, currently a pre-release (0.x), writes the scan into the field as a whole rather than character by character.' },
      { q: 'Which browser suits handheld computers with a built-in scanner?', a: 'For a few devices, the stock browser with correctly set keystroke output can be enough. For many devices running one web app, a kiosk browser with scanner integration fits: it receives the scan itself, restricts the device to the web app and is configured through your MDM. Industrial Kiosk Browser is such a browser, {lizenz} – currently a pre-release (0.x), with the Honeywell integration not yet verified on a device.{download}' },
    ],
    trademarks: 'Industrial Kiosk Browser is an independent product of ICT Baden and is not affiliated with Zebra Technologies or Honeywell. Zebra, DataWedge and StageNow are trademarks of Zebra Technologies, Honeywell is a trademark of Honeywell International; Android is a trademark of Google LLC, JavaScript a trademark of Oracle; React and Vue are trademarks of their respective owners. They are named only to describe features and compatibility.',
  },
};

export default guide;
