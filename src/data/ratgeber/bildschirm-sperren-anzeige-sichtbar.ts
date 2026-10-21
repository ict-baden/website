// Ratgeber „PC sperren, Bildschirm bleibt sichtbar“ – was Windows bietet und wann eine transparente (durchsichtige)
// Bildschirmsperre nötig ist; das eigene Produkt ist Vitrine.
// Ausrichtung (Recherche 2026-10-21): „PC sperren, Bildschirm bleibt sichtbar“, „Tastatur und Maus sperren ohne
// Bildschirmsperre“, „Dashboard-/Wallboard-/Leitstand-PC sperren, view only“, „Messrechner während des Laufs sperren,
// GxP“, „PC sperren, während ein Build oder KI-Agent läuft“ (passt zu Vitrine: Programme laufen weiter, Anzeige bleibt
// sichtbar; über Agenten, die selbst Maus und Tastatur bedienen, wird nichts behauptet).
// Quellen (abgerufen 2026-10-21):
// - Win+L: support.microsoft.com „Keyboard shortcuts in Windows“ („Windows logo key + L – Lock your PC“); Strg+Alt+Entf
//   öffnet den Sicherheitsbildschirm (dieselbe Seite).
// - Sperren verdeckt die Fenster, die Sitzung bleibt: Microsoft Learn „LockWorkStation function“ („Locks the
//   workstation's display … To unlock the workstation, the user must log in“) und „How to Lock the Workstation“ („the
//   workstation is in use and has been locked by the user“; „To determine whether the workstation is locked, test whether
//   your window is visible“).
// - Bildschirmschoner und Inaktivität: Microsoft Learn „Interactive logon: Machine inactivity limit“ („the user's session
//   locks by invoking the screen saver“; Wert 0 = nie sperren; „if the device is used by … trusted individuals, such as in
//   a restricted manufacturing area, automatically locking the device might hinder productivity“); Policy CSP
//   ADMX_ControlPanelDisplay „Password protect the screen saver“.
// - Kiosk-Modus: Microsoft Learn „Assigned Access overview“ (Kiosk: eine App im Vollbild über dem Sperrbildschirm, „Users
//   can only use that application“; eingeschränkte Benutzeroberfläche: feste Liste von Apps; Editionen Pro, Enterprise,
//   Education, IoT Enterprise).
// - Tastaturfilter: Microsoft Learn „Keyboard Filter“ (unterdrückt Tasten und Tastenkombinationen, auch Strg+Alt+Entf; für
//   Geräte mit festem Zweck; Editionen Enterprise, Education, IoT Enterprise, jeweils auch LTSC).
// - Strg+Alt+Entf kann keine Anwendung abfangen: Microsoft Learn „Initializing Winlogon“ („ensuring that no other
//   application has hooked that key sequence“); Larry Osterman (Microsoft), 2005-01-24: „a keystroke sequence that couldn't
//   be intercepted by any application“.
// - 21 CFR Part 11 § 11.10(d) (Zugriff nur für berechtigte Personen) und EU GMP Annex 11 – nur so weit, wie docs/gxp.md von
//   Vitrine sie nennt.
// - Vitrine: ict-baden/vitrine origin/main a093761 (0.1.0, 2026-10-21): README.md, docs/usage.md (Sperrwege, durchsichtig mit
//   8 % Abdunkelung, Hinweistext, Bildschirm bleibt an, ein Overlay je Monitor, verdeckt/abgedeckte Bereiche/nur
//   ausgewählte Programme, Strg+Alt+Entf eingeschränkt), docs/sign-in.md (Entsperren mit Windows-Kennwort oder Windows
//   Hello; Microsoft Entra ID in den Release-Paketen nicht zum Entsperren), docs/limitations.md (normaler Benutzerprozess,
//   Administratoren können ihn beenden, „protects against people at the keyboard, not against malware in the session“,
//   nicht auf echten Geräten getestet), docs/gxp.md (Bausteine, kein validiertes Produkt, keine Konformitätszusage);
//   src/data/produktseiten/vitrine.ts.
// Nicht behaupten (wie auf der Produktseite): Remotedesktop oder mehrere Monitore getestet, „manipulationssicher“,
// Konformität mit Part 11, Entsperren mit Entra ID in den Release-Paketen. Keine Fremdprodukte nennen – der Vergleich mit
// benannten Sperren steht auf der Produktseite (Abschnitt #alternative bzw. #alternative-to).
import type { Guide } from '../../lib/ratgeber';

const guide: Guide = {
  id: 'bildschirm-sperren-anzeige-sichtbar',
  product: 'vitrine',
  published: '2026-10-21',
  de: {
    slug: 'bildschirm-sperren-anzeige-sichtbar',
    title: 'PC sperren, Bildschirm bleibt sichtbar: so geht es unter Windows',
    description: 'Windows sperren, ohne die Anzeige zu verdecken: was Win+L, Bildschirmschoner und Kiosk-Modus leisten und wann eine durchsichtige Bildschirmsperre hilft.',
    h1: 'PC sperren, Bildschirm bleibt sichtbar: so geht es unter Windows',
    short: 'PC sperren, Bildschirm sichtbar',
    teaser: 'Was Win+L, Bildschirmschoner und Kiosk-Modus leisten – und wann eine durchsichtige Bildschirmsperre die richtige Wahl ist.',
    lead: 'Die Sperre von Windows verdeckt die Anzeige: Win+L und der Bildschirmschoner mit Kennwort schützen den PC, aber vom Bildschirm ist danach nichts mehr zu sehen. Wer den Bildschirm sperren und die Anzeige trotzdem sichtbar lassen will – für ein Dashboard, ein Anlagenbild oder eine laufende Messung –, braucht dafür in der Regel ein Zusatzprogramm: eine transparente (durchsichtige) Bildschirmsperre, die nur Tastatur und Maus sperrt, während die Programme sichtbar bleiben und weiterlaufen.',
    sections: [
      {
        id: 'wofuer',
        title: 'Wofür: Leitstand, Dashboard, Messrechner',
        toc: 'Wofür',
        blocks: [
          { type: 'p', text: 'Es gibt Arbeitsplätze, an denen ein Bildschirm beobachtet, aber nicht bedient werden soll – ansehen, nicht anfassen:' },
          {
            type: 'list',
            items: [
              'Leitstand- und Bedien-PCs, auf denen Anlagenbilder und Meldungen sichtbar bleiben müssen',
              'Dashboard- und Wallboard-PCs in Produktion, Lager oder IT, die Kennzahlen zeigen',
              'Messrechner im Labor, auf denen eine Messung läuft, die niemand versehentlich abbrechen soll',
              'lange Läufe – ein Build, ein Datenimport oder ein KI-Agent, der im Hintergrund oder im Terminal arbeitet –, deren Fortschritt man im Blick behalten will',
            ],
          },
          { type: 'p', text: 'In regulierten Umgebungen kommt hinzu, dass nur berechtigte Personen ein System bedienen dürfen, in der Pharmaindustrie etwa nach 21 CFR Part 11 und EU GMP Annex 11. Gleichzeitig weist Microsoft darauf hin, dass automatisches Sperren die Arbeit behindern kann, etwa in einem abgegrenzten Fertigungsbereich, in dem nur vertraute Personen arbeiten. Gesucht ist also eine Sperre, die schützt, ohne die Anzeige zu verstecken.' },
        ],
      },
      {
        id: 'windows',
        title: 'Was Windows selbst bietet – und warum die Anzeige dabei verschwindet',
        toc: 'Was Windows bietet',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Sperren mit Win+L', text: 'Windows zeigt den Sperrbildschirm, die Fenster der Programme sind nicht mehr zu sehen. Die Programme laufen weiter, entsperrt wird mit der Windows-Anmeldung. Zum Schutz ideal – für eine Anzeige, die sichtbar bleiben soll, nicht.' },
              { title: 'Bildschirmschoner und automatische Sperre', text: 'Nach einer Leerlaufzeit startet der Bildschirmschoner; mit Kennwortschutz oder der Richtlinie für Inaktivität sperrt er die Sitzung. Auch hier ist die Anzeige verdeckt.' },
              { title: 'Kiosk-Modus (zugewiesener Zugriff)', text: 'Beschränkt ein Gerät auf eine App im Vollbild oder auf eine feste Auswahl an Apps. Diese Apps bleiben aber bedienbar: Der Kiosk-Modus legt fest, was benutzt werden darf, nicht dass niemand eingreift.' },
              { title: 'Tastaturfilter', text: 'Unterdrückt in den Editionen Enterprise, Education und IoT Enterprise einzelne Tasten und Tastenkombinationen. Er ist für Geräte mit festem Zweck gedacht, wird von Administratoren eingerichtet (etwa per WMI) und filtert nur die Tastatur.' },
              { title: 'Keine Sperre', text: 'Ohne automatische Sperre bleibt die Anzeige sichtbar, der PC aber offen: Jeder kann ihn bedienen – genau davor soll die Sperre schützen.' },
            ],
          },
          { type: 'p', text: 'Die Sperrfunktionen von Windows schützen den PC also, indem sie die Anzeige verdecken. Für „gesperrt, aber sichtbar“ ist ein eigenes Programm der übliche Weg.' },
        ],
      },
      {
        id: 'transparente-sperre',
        title: 'Tastatur und Maus sperren, Bildschirm sichtbar: die transparente Bildschirmsperre',
        toc: 'Transparente Bildschirmsperre',
        blocks: [
          { type: 'p', text: 'Eine transparente oder durchsichtige Bildschirmsperre fängt Tastatur und Maus systemweit ab und legt eine durchsichtige Fläche über den Bildschirm. Darunter bleiben alle Fenster sichtbar und die Programme laufen weiter; entsperrt wird mit einer Anmeldung. Solche Programme gibt es von mehreren Herstellern – einen sachlichen Vergleich mit bekannten Produkten finden Sie [auf der Produktseite von Vitrine](/produkte/vitrine/#alternative).' },
          { type: 'p', text: 'Worauf Sie bei der Auswahl achten sollten:' },
          {
            type: 'list',
            items: [
              'Entsperren: Windows-Kennwort und Windows Hello oder ein eigenes Kennwort? Wer darf entsperren – nur die angemeldete Person oder auch andere?',
              'Vertrauliches: Lassen sich Bereiche abdecken oder der ganze Bildschirm verdecken, wenn nicht alles sichtbar sein soll?',
              'Bildschirm bleibt an: Werden Bildschirmschoner und Energiesparmodus während der Sperre unterdrückt, damit ein Wallboard nicht dunkel wird?',
              'Mehrere Monitore: Deckt die Sperre jeden Monitor ab, auch bei unterschiedlicher Skalierung?',
              'Nachweis: Wird protokolliert, wer wann gesperrt, entsperrt oder es vergeblich versucht hat?',
              'Verteilung: MSI-Paket, Gruppenrichtlinie oder Intune für viele PCs?',
              'Pflege: Ist das Programm für aktuelle Windows-Versionen gebaut und wird es weiterentwickelt?',
            ],
          },
        ],
      },
      {
        id: 'vitrine',
        title: 'Vitrine: die durchsichtige Bildschirmsperre von ICT Baden',
        toc: 'Vitrine',
        blocks: [
          { type: 'p', text: 'Vitrine ist unsere transparente Bildschirmsperre für Windows 10 und 11. Strg+Alt+L oder ein Klick im Infobereich sperrt Tastatur und Maus; die Programme bleiben sichtbar und laufen weiter, darüber liegt nur eine leichte Abdunkelung. Auf Wunsch erscheint ein Hinweis wie „Messung läuft – bitte nicht berühren“. Entsperrt wird mit dem Windows-Kennwort oder Windows Hello.' },
          {
            type: 'items',
            items: [
              { title: 'Viele Wege zu sperren', text: 'Per Tastenkürzel, im Infobereich, nach Leerlaufzeit, nach Zeitplan oder schon beim Start – für Leitstand- und Wallboard-PCs.' },
              { title: 'Bildschirm bleibt an', text: 'Während der Sperre kein Bildschirmschoner und kein Energiesparmodus; ein Overlay je Monitor, passend zur Skalierung.' },
              { title: 'Verdeckt, wo nötig', text: 'Verdeckter Modus mit großer Uhr, abgedeckte Bereiche oder nur die Fenster ausgewählter Programme sichtbar.' },
              { title: 'Wer darf entsperren', text: 'Die angemeldete Person, Administratoren, Gruppen oder einzelne Konten – festgelegt in den Einstellungen oder per Richtlinie.' },
              { title: 'Protokoll', text: 'Jede Sperre, Entsperrung und jeder Fehlversuch mit UTC-Zeit und Verfahren. Die SHA-256-Hash-Kette macht Änderungen sichtbar, verhindert sie aber nicht; eine Kopie auf einer Netzwerkfreigabe und das Windows-Ereignisprotokoll sind unabhängige Gegenstücke.' },
              { title: 'Zentral verteilen', text: 'MSI für die stille Installation, 52 Richtlinien als ADMX/ADML-Vorlagen für Gruppenrichtlinie und Intune.' },
            ],
          },
          { type: 'p', text: 'Für GxP-Arbeitsplätze bringt Vitrine Bausteine mit: Zugriffskontrolle, Audit-Trail, elektronische Signaturen und automatisches Sperren. Ein validiertes Produkt ist Vitrine nicht; ICT Baden macht keine Konformitätszusage, Validierung und Risikobewertung liegen beim Betreiber.' },
          { type: 'p', text: 'Ehrlich gesagt: Vitrine ist eine Vorabversion ({version}), noch nicht signiert und noch nicht auf echten Geräten durchgetestet – unter anderem Windows Hello, mehrere Monitore, Remotedesktop und die Bedienung per Touch stehen noch aus. Vitrine schützt vor Personen an Tastatur und Maus, nicht vor Schadsoftware in der Sitzung, und Administratoren können Vitrine beenden. Durchsichtig heißt sichtbar: Für vertrauliche Inhalte den verdeckten Modus wählen. Vitrine ist {lizenz}.{download}' },
          { type: 'product', text: 'Tastatur und Maus gesperrt, alle Programme sichtbar und aktiv – entsperren mit Windows-Kennwort oder Windows Hello; für Windows 10 und 11.', compare: { label: 'Vergleich mit anderen Sperren', href: '/produkte/vitrine/#alternative' } },
        ],
      },
      {
        id: 'vergleich',
        title: 'Die Möglichkeiten im Überblick',
        toc: 'Vergleich',
        blocks: [
          {
            type: 'table',
            caption: 'Möglichkeiten, einen Windows-PC zu sperren, im Vergleich',
            head: ['Möglichkeit', 'Anzeige sichtbar', 'Programme laufen weiter', 'Tastatur und Maus gesperrt', 'Entsperren', 'Zusätzliche Software'],
            rows: [
              ['Win+L (Sperrbildschirm)', 'nein', 'ja', 'ja', 'Windows-Anmeldung', 'nein'],
              ['Bildschirmschoner mit Kennwort', 'nein', 'ja', 'ja', 'Windows-Anmeldung', 'nein'],
              ['Kiosk-Modus (zugewiesener Zugriff)', 'ja, die erlaubten Apps', 'nur die erlaubten Apps', 'nein, die erlaubten Apps bleiben bedienbar', '–', 'nein'],
              ['Tastaturfilter', 'ja', 'ja', 'nur gewählte Tasten', '–', 'nein'],
              ['Keine Sperre', 'ja', 'ja', 'nein', '–', 'nein'],
              ['Transparente Bildschirmsperre, z. B. Vitrine', 'ja', 'ja', 'ja', 'je nach Programm; Vitrine: Windows-Kennwort oder Windows Hello', 'ja'],
            ],
            key: 5,
            note: 'Kiosk-Modus und Tastaturfilter sind Funktionen von Windows für Geräte mit festem Zweck: den zugewiesenen Zugriff gibt es in Pro, Enterprise, Education und IoT Enterprise, den Tastaturfilter in Enterprise, Education und IoT Enterprise.',
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
              { title: 'Der PC soll geschützt sein, die Anzeige darf verschwinden', text: 'Win+L und die automatische Sperre von Windows genügen.' },
              { title: 'Die Anzeige muss sichtbar bleiben, niemand soll eingreifen', text: 'Eine transparente Bildschirmsperre, zum Beispiel Vitrine.' },
              { title: 'Das Gerät soll nur eine bestimmte App zeigen, die bedienbar bleibt', text: 'Der Kiosk-Modus (zugewiesener Zugriff) von Windows.' },
              { title: 'Auf dem Bildschirm stehen vertrauliche Daten', text: 'Verdeckt sperren oder Bereiche abdecken – durchsichtig heißt lesbar.' },
              { title: 'Messrechner im GxP-Labor', text: 'Eine Sperre mit Protokoll samt unabhängiger Kopie und festgelegten Entsperr-Berechtigungen, eingebunden in die eigene Validierung.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Kann ich den PC sperren und trotzdem sehen, was auf dem Bildschirm läuft?', a: 'Mit Win+L oder dem Bildschirmschoner nicht – beide verdecken die Anzeige. Eine transparente Bildschirmsperre wie Vitrine sperrt dagegen nur Tastatur und Maus; die Programme bleiben sichtbar und laufen weiter. Vitrine ist derzeit eine Vorabversion ({version}).{download}' },
      { q: 'Laufen Programme weiter, wenn ich Windows mit Win+L sperre?', a: 'Ja. Die Sitzung bleibt bestehen und die Programme werden nicht beendet, ihre Fenster sind aber hinter dem Sperrbildschirm verborgen, bis sich jemand anmeldet.' },
      { q: 'Wie sperre ich Tastatur und Maus, ohne den Bildschirm zu sperren?', a: 'Mit einer transparenten Bildschirmsperre. Bei Vitrine genügt Strg+Alt+L oder ein Klick im Infobereich; Tastatur und Maus sind dann gesperrt, entsperrt wird mit dem Windows-Kennwort oder Windows Hello. Windows Hello ist dabei noch nicht auf echten Geräten getestet.' },
      { q: 'Hilft der Kiosk-Modus von Windows?', a: 'Nur, wenn das Gerät auf bestimmte Apps beschränkt werden soll. Der zugewiesene Zugriff legt fest, welche Apps laufen; diese bleiben aber bedienbar. Eine Sperre, bei der niemand eingreifen kann, ist er nicht.' },
      { q: 'Lässt sich Strg+Alt+Entf sperren?', a: 'Eine Anwendung kann sie nicht abfangen – Windows reserviert diese Tastenkombination für den eigenen Sicherheitsbildschirm. Windows selbst kann sie mit dem Tastaturfilter der Editionen Enterprise, Education und IoT Enterprise unterdrücken. Vitrine blendet dort während der Sperre Task-Manager, Abmelden und Kennwort ändern aus; Sperren und Benutzer wechseln bleiben.' },
      { q: 'Eignet sich eine durchsichtige Sperre für Messrechner im GxP-Umfeld?', a: 'Als Baustein ja: Vitrine bringt Zugriffskontrolle, Audit-Trail, elektronische Signaturen und automatisches Sperren mit. Ein validiertes Produkt ist Vitrine aber nicht, und Version {version} ist noch nicht auf echten Geräten getestet; ob der Einsatz 21 CFR Part 11 oder EU GMP Annex 11 genügt, bewertet der Betreiber in seiner Validierung.' },
    ],
    trademarks: 'Microsoft, Windows, Windows Hello und Intune sind Marken der Microsoft-Unternehmensgruppe. Sie werden nur genannt, um Funktionen und Kompatibilität zu beschreiben.',
  },
  en: {
    slug: 'lock-pc-keep-screen-visible',
    title: 'Lock a Windows PC but keep the screen visible | ICT Baden',
    description: 'How to lock a Windows PC without hiding the display: what Win+L, screen savers and kiosk mode do, and when a transparent, see-through screen lock helps.',
    h1: 'Lock a Windows PC but keep the screen visible',
    short: 'Lock the PC, keep the screen visible',
    teaser: 'What Win+L, screen savers and kiosk mode can do – and when a see-through screen lock is the right choice.',
    lead: 'Windows’ own lock hides the display: Win+L and a password-protected screen saver protect the PC, but nothing on the screen stays visible. To lock the screen and still keep it visible – for a dashboard, a plant display or a running measurement – you usually need an extra program: a transparent (see-through) screen lock that locks only keyboard and mouse while every program stays visible and keeps running.',
    sections: [
      {
        id: 'why',
        title: 'Why: control rooms, dashboards, measurement PCs',
        toc: 'Why',
        blocks: [
          { type: 'p', text: 'Some workstations must be watched but not operated – look, don’t touch:' },
          {
            type: 'list',
            items: [
              'control-room and operator PCs whose plant displays and alarms must stay visible',
              'dashboard and wallboard PCs in production, warehouses or IT that show key figures',
              'measurement PCs in the lab running a measurement nobody should cancel by accident',
              'long runs – a build, a data import or an AI agent working in the background or in a terminal – whose progress you want to keep an eye on',
            ],
          },
          { type: 'p', text: 'In regulated environments, only authorised people may operate a system as well – in pharma, for example, under 21 CFR Part 11 and EU GMP Annex 11. At the same time, Microsoft points out that automatic locking can hinder productivity, for example in a restricted manufacturing area used by trusted people. What is needed is a lock that protects without hiding the display.' },
        ],
      },
      {
        id: 'windows',
        title: 'What Windows offers – and why the display disappears',
        toc: 'What Windows offers',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Locking with Win+L', text: 'Windows shows the lock screen, and the program windows are no longer visible. Programs keep running; unlocking needs a Windows sign-in. Ideal for protection – not for a display that must stay visible.' },
              { title: 'Screen saver and automatic lock', text: 'After an idle time the screen saver starts; with password protection or the machine inactivity policy it locks the session. The display is covered here too.' },
              { title: 'Kiosk mode (assigned access)', text: 'Restricts a device to one full-screen app or a fixed set of apps. Those apps stay usable, though: kiosk mode decides what may be used, not that nobody can interfere.' },
              { title: 'Keyboard Filter', text: 'Suppresses single keys and key combinations in the Enterprise, Education and IoT Enterprise editions. It is meant for dedicated devices, is set up by administrators (for example through WMI) and filters the keyboard only.' },
              { title: 'No lock', text: 'Without an automatic lock the display stays visible, but the PC is open: anyone can use it – exactly what a lock is meant to prevent.' },
            ],
          },
          { type: 'p', text: 'So the lock functions of Windows protect the PC by hiding the display. For “locked but visible”, a separate program is the usual way.' },
        ],
      },
      {
        id: 'transparent-lock',
        title: 'Lock keyboard and mouse, keep the screen visible: the transparent screen lock',
        toc: 'Transparent screen lock',
        blocks: [
          { type: 'p', text: 'A transparent screen lock – also called a see-through or transparent lock screen – intercepts keyboard and mouse system-wide and lays a see-through layer over the screen. Underneath, every window stays visible and programs keep running; unlocking needs a sign-in. Several vendors offer such programs – a factual comparison with well-known products is [on the Vitrine product page](/en/products/vitrine/#alternative-to).' },
          { type: 'p', text: 'What to look for when choosing one:' },
          {
            type: 'list',
            items: [
              'Unlocking: Windows password and Windows Hello, or a separate password? Who may unlock – only the signed-in person or others too?',
              'Confidential content: can areas be covered, or the whole screen, when not everything should be visible?',
              'Screen stays on: are screen saver and sleep suppressed while locked, so that a wallboard does not go dark?',
              'Several monitors: does the lock cover every monitor, even with different scaling?',
              'Audit trail: is it recorded who locked, unlocked or tried and failed, and when?',
              'Deployment: MSI package, Group Policy or Intune for many PCs?',
              'Maintenance: is the program built for current Windows versions and still actively maintained?',
            ],
          },
        ],
      },
      {
        id: 'vitrine',
        title: 'Vitrine: the see-through screen lock by ICT Baden',
        toc: 'Vitrine',
        blocks: [
          { type: 'p', text: 'Vitrine is our transparent screen lock for Windows 10 and 11. Ctrl+Alt+L or a click in the notification area locks keyboard and mouse; programs stay visible and keep running, with only a light dimming on top. Optionally a notice such as “Measurement running – please do not touch” is shown. Unlock with the Windows password or Windows Hello.' },
          {
            type: 'items',
            items: [
              { title: 'Lock in many ways', text: 'Hotkey, notification area, idle time, schedule or right at startup – for control-room and wallboard PCs.' },
              { title: 'Screen stays on', text: 'No screen saver and no sleep while locked; one overlay per monitor, matched to its scaling.' },
              { title: 'Covered where needed', text: 'Covered mode with a large clock, covered areas, or only the windows of selected programs visible.' },
              { title: 'Who may unlock', text: 'The signed-in person, administrators, groups or single accounts – set in the settings or by policy.' },
              { title: 'Audit log', text: 'Every lock, unlock and failed attempt with UTC time and method. The SHA-256 hash chain makes changes visible but cannot prevent them; a copy on a network share and the Windows event log add independent records.' },
              { title: 'Central deployment', text: 'MSI for silent installation, 52 policies as ADMX/ADML templates for Group Policy and Intune.' },
            ],
          },
          { type: 'p', text: 'For GxP workstations, Vitrine provides building blocks: access control, an audit trail, electronic signatures and automatic locking. It is not a validated product; ICT Baden makes no compliance claim, and validation and risk assessment are up to the operator.' },
          { type: 'p', text: 'Honestly: Vitrine is a pre-release ({version}), not code-signed yet and not yet tested end to end on real devices – Windows Hello, multiple monitors, Remote Desktop and touch input, among others, are still open. It protects against people at keyboard and mouse, not against malware in the session, and administrators can stop it. Transparent means visible: choose the covered mode for confidential content. Vitrine is {lizenz}.{download}' },
          { type: 'product', text: 'Keyboard and mouse locked, every program visible and running – unlock with the Windows password or Windows Hello; for Windows 10 and 11.', compare: { label: 'Comparison with other screen locks', href: '/en/products/vitrine/#alternative-to' } },
        ],
      },
      {
        id: 'comparison',
        title: 'The options at a glance',
        toc: 'Comparison',
        blocks: [
          {
            type: 'table',
            caption: 'Ways to lock a Windows PC compared',
            head: ['Option', 'Display visible', 'Programs keep running', 'Keyboard and mouse locked', 'Unlock', 'Extra software'],
            rows: [
              ['Win+L (lock screen)', 'no', 'yes', 'yes', 'Windows sign-in', 'no'],
              ['Screen saver with password', 'no', 'yes', 'yes', 'Windows sign-in', 'no'],
              ['Kiosk mode (assigned access)', 'yes, the allowed apps', 'only the allowed apps', 'no, the allowed apps stay usable', '–', 'no'],
              ['Keyboard Filter', 'yes', 'yes', 'only selected keys', '–', 'no'],
              ['No lock', 'yes', 'yes', 'no', '–', 'no'],
              ['Transparent screen lock, e.g. Vitrine', 'yes', 'yes', 'yes', 'depends on the program; Vitrine: Windows password or Windows Hello', 'yes'],
            ],
            key: 5,
            note: 'Kiosk mode and Keyboard Filter are Windows features for dedicated devices: assigned access is available in Pro, Enterprise, Education and IoT Enterprise, Keyboard Filter in Enterprise, Education and IoT Enterprise.',
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
              { title: 'The PC must be protected, the display may disappear', text: 'Win+L and the automatic lock of Windows are enough.' },
              { title: 'The display must stay visible, nobody should interfere', text: 'A transparent screen lock, for example Vitrine.' },
              { title: 'The device should show one app that stays usable', text: 'Kiosk mode (assigned access) in Windows.' },
              { title: 'Confidential data on the screen', text: 'Lock with the screen covered, or cover areas – see-through means readable.' },
              { title: 'Measurement PC in a GxP lab', text: 'A lock with an audit log, including an independent copy, and defined unlock permissions, embedded in your own validation.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Can I lock my PC and still see what is on the screen?', a: 'Not with Win+L or the screen saver – both hide the display. A transparent screen lock such as Vitrine locks only keyboard and mouse instead; programs stay visible and keep running. Vitrine is currently a pre-release ({version}).{download}' },
      { q: 'Do programs keep running when I lock Windows with Win+L?', a: 'Yes. The session stays open and programs are not closed, but their windows are hidden behind the lock screen until someone signs in.' },
      { q: 'How do I lock keyboard and mouse without locking the screen?', a: 'With a transparent screen lock. In Vitrine, Ctrl+Alt+L or a click in the notification area is enough; keyboard and mouse are then locked, and you unlock with the Windows password or Windows Hello. Windows Hello has not yet been tested on real devices.' },
      { q: 'Does Windows kiosk mode help?', a: 'Only if the device should be restricted to certain apps. Assigned access decides which apps run, but those apps stay usable. It is not a lock that keeps everyone from interfering.' },
      { q: 'Can Ctrl+Alt+Del be blocked?', a: 'An application cannot intercept it – Windows reserves this key combination for its own security screen. Windows itself can suppress it with Keyboard Filter in the Enterprise, Education and IoT Enterprise editions. While locked, Vitrine hides Task Manager, Sign out and Change a password there; Lock and Switch user remain.' },
      { q: 'Is a see-through lock suitable for measurement PCs in a GxP environment?', a: 'As a building block, yes: Vitrine brings access control, an audit trail, electronic signatures and automatic locking. It is not a validated product, though, and version {version} has not yet been tested on real devices; whether its use meets 21 CFR Part 11 or EU GMP Annex 11 is for the operator to assess in their validation.' },
    ],
    trademarks: 'Microsoft, Windows, Windows Hello and Intune are trademarks of the Microsoft group of companies. They are named only to describe features and compatibility.',
  },
};

export default guide;
