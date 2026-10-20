// Vitrine – transparente Bildschirmsperre für Windows.
// Quellen (ict-baden/vitrine): README.md (Funktionen, „And also“, Quick start, „Limits, honestly“, Fußzeile: MIT,
// keine Daten an ICT-Baden), docs/installation.md (Voraussetzungen: Windows 10 1809 / 11, x64), docs/usage.md
// (durchsichtig 8 % abgedunkelt, verdeckt, verdeckte Bereiche, nur ausgewählte Programme, Hinweistext, während der
// Sperre, Bildschirm bleibt an), docs/gxp.md („What Vitrine is not“), docs/data-and-privacy.md, CHANGELOG.md (Dienst).
// Nicht behaupten: Remotedesktop oder mehrere Monitore getestet, „manipulationssicher“, Konformität mit Part 11.
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'vitrine',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Windows 10 (ab Version 1809), Windows 11',
  softwareRequirements: 'Windows 10 Version 1809 (Build 17763) oder neuer, 64 Bit',
  uiLanguages: ['en', 'de', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/vitrine/releases/tag/latest',
    source: 'https://github.com/ict-baden/vitrine',
  },
  related: ['haertungs-check', 'freigaben-berechtigungen'],
  alternatives: {
    approved: false,
    names: ['Transparent Screen Lock (e-motional)'],
    de: 'Vitrine ist eine Open-Source-Alternative für Organisationen, die transparente Bildschirmsperren wie Transparent Screen Lock von e-motional einsetzen.',
    en: 'Vitrine is an open-source alternative for organisations that use transparent screen locks such as Transparent Screen Lock by e-motional.',
  },
  de: {
    title: 'Transparente Bildschirmsperre für Windows – Vitrine',
    description: 'Vitrine sperrt Tastatur und Maus, alle Programme bleiben sichtbar und laufen weiter – für Labor, Produktion und Leitstand. Entsperren per Entra ID, Hello oder Kennwort.',
    lead: 'Vitrine ist eine transparente Bildschirmsperre für Windows 10 und 11: Tastatur und Maus sind gesperrt, alle Programme bleiben sichtbar und laufen weiter. Entsperrt wird mit Microsoft Entra ID, dem Windows-Kennwort oder Windows Hello – für Labore, Produktionslinien und Leitstände, {lizenz}.',
    sections: [
      {
        id: 'wofuer',
        title: 'Wofür eine transparente Bildschirmsperre?',
        blocks: [
          { type: 'p', text: 'Die normale Windows-Sperre mit Win+L zeigt den Sperrbildschirm – vom Arbeitsplatz ist dann nichts mehr zu sehen. Im Labor, an der Produktionslinie oder im Leitstand muss ein Prozess aber sichtbar bleiben: Eine Messung läuft, ein Anlagenbild oder ein Dashboard wird beobachtet, nur bedienen soll niemand.' },
          { type: 'p', text: 'Vitrine sperrt deshalb nur die Eingabe. Tastatur und Maus werden systemweit abgefangen, die Programme bleiben sichtbar und laufen weiter – ansehen, nicht anfassen. Wer entsperren darf, legen Sie fest: die angemeldete Person, Administratoren, Gruppen und Entra-App-Rollen, einzelne Konten oder jedes gültige Konto, auf Wunsch auf Domänen eingeschränkt.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Funktionen',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Durchsichtig oder verdeckt sperren', text: 'Standard ist durchsichtig mit leichter Abdunkelung (8 %). Für vertrauliche Inhalte gibt es den verdeckten Modus mit großer Uhr und Datum – die Programme laufen auch dann weiter.' },
              { title: 'Bereiche abdecken, Programme freigeben', text: 'Einzelne Rechtecke bleiben während der Sperre verdeckt, etwa der Teil eines LIMS-Fensters mit Patientennamen. Oder alles ist verdeckt außer den Fenstern ausgewählter Programme.' },
              { title: 'Entsperren mit Microsoft Entra ID', text: 'Über den Windows-Kontobroker mit allen Verfahren, die der Mandant erlaubt: Passkeys und FIDO2-Schlüssel, Authenticator, MFA, Windows Hello for Business, Zertifikate und Conditional Access. Dazu Windows-Kennwort und Windows Hello.' },
              { title: 'Viele Wege zu sperren', text: 'Strg+Alt+L, Infobereich, nach Leerlaufzeit, nach Zeitplan, beim Start, als Bildschirmschoner, mit `Vitrine.exe --lock` oder über die lokale Schnittstelle.' },
              { title: 'Elektronische Signaturen', text: 'Fachanwendungen, etwa ein LIMS, fordern über eine lokale Schnittstelle eine Signatur an. Person, Zeitpunkt, Grund und Bedeutung landen im Protokoll.' },
              { title: 'Manipulationserkennendes Protokoll', text: 'Jede Sperre, Entsperrung, jeder Fehlversuch und jede Signatur mit UTC-Zeit, Person und Verfahren. Die SHA-256-Hash-Kette macht Änderungen sichtbar; Kopie auf einer Netzwerkfreigabe und Windows-Ereignisprotokoll sind unabhängige Gegenstücke.' },
              { title: 'Zentral verwalten', text: 'ADMX/ADML-Vorlagen (Englisch und Deutsch) mit 46 Richtlinien für Gruppenrichtlinie und Intune; per Richtlinie gesetzte Werte sind in den Einstellungen gesperrt. Stille Installation mit `msiexec /i Vitrine-x64.msi /qn`.' },
              { title: 'Dienst und Wächter', text: 'Der Dienst „ICT-Baden Vitrine“ startet Vitrine bei jeder Anmeldung. Endet oder hängt Vitrine während der Sperre, trennt er die Sitzung und startet Vitrine gesperrt neu; ohne Dienst sperrt ein Wächterprozess Windows.' },
              { title: 'Fehlversuche begrenzen', text: 'Wachsende Wartezeit ab dem dritten Versuch; auf Wunsch wird nach zu vielen Versuchen Windows gesperrt, abgemeldet oder heruntergefahren.' },
              { title: 'Fünf Sprachen', text: 'Englisch, Deutsch, Spanisch, Französisch und Chinesisch (vereinfacht); jede Person wählt ihre Sprache, oder eine Richtlinie legt sie fest.' },
            ],
          },
        ],
      },
      {
        id: 'einsatz',
        title: 'Einsatz: Labor, Produktion, Leitstand',
        blocks: [
          { type: 'p', text: 'Typische Arbeitsplätze sind Messrechner im Labor, Bedienrechner an Produktionslinien und Leitstand-PCs, auf denen Anlagenbilder sichtbar bleiben müssen. Vitrine legt ein Overlay pro Monitor, passend zur Skalierung jedes Monitors, und zeigt auf Wunsch einen Hinweis wie „Messung läuft – bitte nicht berühren“. Während der Sperre bleibt der Bildschirm an: kein Bildschirmschoner, kein Energiesparmodus.' },
          { type: 'p', text: 'Für Leitstände und Messrechner kann Vitrine schon beim Start gesperrt sein. Windows-Taste, Alt+Tab, Alt+Esc, Alt+F4 und Strg+Esc bleiben während der Sperre ohne Wirkung, der Mauszeiger steht still.' },
        ],
      },
      {
        id: 'gxp',
        title: 'Pharma und GxP: 21 CFR Part 11 und EU GMP Annex 11',
        blocks: [
          { type: 'p', text: 'Vitrine liefert Bausteine, die GxP-Arbeitsplätze verlangen: Zugriff nur für berechtigte Personen, eindeutige Identifikation, einen Audit-Trail, elektronische Signaturen mit Bedeutung und automatisches Sperren nach Leerlaufzeit oder Zeitplan. Das gemeinsame Entsperrkennwort nimmt Vitrine für Signaturen nicht an, weil es keiner Person zuzuordnen ist.' },
          { type: 'p', text: 'Vitrine ist kein validiertes Produkt, und ICT Baden sagt nicht zu, dass der Einsatz 21 CFR Part 11, EU GMP Annex 11 oder eine andere Vorschrift erfüllt. Validierung und Risikobewertung liegen beim Betreiber; Code und Protokollformat sind bewusst einfach gehalten, damit eine Validierung machbar ist.' },
        ],
      },
    ],
    requirements: [
      ['Betriebssystem', 'Windows 10 ab Version 1809 (Build 17763) oder Windows 11, 64 Bit'],
      ['.NET', 'nicht nötig für die MSI und Vitrine.exe; die ZIP-Variante braucht die .NET 10 Desktop Runtime'],
      ['Installation', 'die MSI braucht Administratorrechte; Vitrine.exe läuft ohne Installation'],
      ['Microsoft Entra ID', 'optional: App-Registrierung im Mandanten; die Anmeldung braucht das Netz'],
      ['Dateien', 'Vitrine-x64.msi, Vitrine.exe, Vitrine-win-x64-framework.zip, SHA256SUMS.txt'],
    ],
    limits: [
      'Vorabversion 0.1.0, noch nicht signiert: Windows SmartScreen warnt. Noch nicht auf echten Geräten durchgetestet – Entra ID mit MFA, Windows Hello, Remotedesktop, mehrere Monitore und die MSI auf einem frischen Rechner stehen aus.',
      'Strg+Alt+Entf kann keine Anwendung abfangen. Vitrine blendet dort Task-Manager, Abmelden und Kennwort ändern aus; Sperren und Benutzer wechseln bleiben.',
      'Vitrine läuft als normaler Benutzerprozess unter Aufsicht eines Dienstes; Administratoren können beide beenden.',
      'Durchsichtig heißt sichtbar – für vertrauliche Inhalte den verdeckten Modus oder abgedeckte Bereiche wählen.',
      'Das Protokoll ist manipulationserkennend: Es macht Änderungen sichtbar, verhindert sie aber nicht.',
      'Die Anmeldung mit Entra ID braucht das Netz; für den Offline-Fall das Windows-Kennwort oder Windows Hello aktiviert lassen.',
      'Spanisch, Französisch und Chinesisch sind maschinell übersetzt und noch nicht von Muttersprachlern geprüft.',
    ],
    faq: [
      { q: 'Wie sperre ich den PC, ohne dass der Bildschirm schwarz wird?', a: 'Mit einer transparenten Bildschirmsperre wie Vitrine: Strg+Alt+L oder ein Klick im Infobereich sperrt Tastatur und Maus, der Bildschirm bleibt sichtbar und alle Programme laufen weiter. Die Windows-Sperre mit Win+L zeigt dagegen den Sperrbildschirm.' },
      { q: 'Läuft eine Messung unter der Sperre weiter?', a: 'Ja. Vitrine sperrt nur die Eingabe; Programme laufen weiter und bleiben sichtbar, auf Wunsch mit einem Hinweis wie „Messung läuft – bitte nicht berühren“. Der Bildschirm bleibt an, ohne Bildschirmschoner und Energiesparmodus.' },
      { q: 'Kann ich mit Microsoft Entra ID (früher Azure AD) entsperren?', a: 'Ja, über den Windows-Kontobroker mit allen Verfahren, die Ihr Mandant erlaubt – auch MFA, Authenticator, Passkeys und Conditional Access. Dafür registrieren Sie eine App in Entra ID. Ohne diese Einrichtung bietet Vitrine das Windows-Kennwort und, wo eingerichtet, Windows Hello an.' },
      { q: 'Wer darf entsperren?', a: 'Das legen Sie fest: die angemeldete Person, Administratoren, Gruppen und Entra-App-Rollen, einzelne Konten oder jedes gültige Konto – kombinierbar und auf Domänen einschränkbar.' },
      { q: 'Lässt sich Strg+Alt+Entf blockieren?', a: 'Nein, das kann keine Anwendung. Vitrine blendet während der Sperre Task-Manager, Abmelden und Kennwort ändern aus; Sperren und Benutzer wechseln bleiben verfügbar.' },
      { q: 'Lässt sich Vitrine per Gruppenrichtlinie oder Intune verteilen?', a: 'Ja. Die MSI installiert still mit `msiexec /i Vitrine-x64.msi /qn`, die ADMX/ADML-Vorlagen bringen 46 Richtlinien für Gruppenrichtlinie und Intune – etwa Mandant, Anwendungs-ID, wer entsperren darf und die Aktion nach Fehlversuchen.' },
      { q: 'Erfüllt Vitrine 21 CFR Part 11 oder EU GMP Annex 11?', a: 'Vitrine liefert Bausteine dafür – Zugriffskontrolle, Audit-Trail, Signatur mit Bedeutung, automatisches Sperren –, ist aber kein validiertes Produkt. ICT Baden macht keine Konformitätszusage; Validierung und Risikobewertung liegen beim Betreiber.' },
      { q: 'Ist Vitrine kostenlos? Sendet es Daten?', a: 'Vitrine ist {lizenz}. Die Software sendet keine Daten an ICT Baden: keine Telemetrie, keine Absturzberichte, keine Update-Prüfung. Anmeldungen mit Entra ID laufen zwischen Windows und Microsoft.{download}' },
    ],
    aka: ['durchsichtige Bildschirmsperre', 'transparenter Sperrbildschirm', 'Tastatur- und Maussperre', 'Eingabesperre', 'Bediensperre', 'Bildschirmsperre mit sichtbarem Desktop'],
    trademarks: 'Microsoft, Windows, Entra, Intune und Windows Hello sind Marken der Microsoft-Unternehmensgruppe. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Windows 10 (version 1809 or later), Windows 11',
    softwareRequirements: 'Windows 10 version 1809 (build 17763) or later, 64-bit',
    title: 'Vitrine – transparent screen lock for Windows',
    description: 'Vitrine locks keyboard and mouse while every program stays visible and keeps running – for labs, production and control rooms. Unlock via Entra ID, Hello or password.',
    kind: 'Transparent screen lock for Windows',
    tagline: 'Look, don’t touch.',
    lead: 'Vitrine is a transparent screen lock for Windows 10 and 11: keyboard and mouse are blocked while every program stays visible and keeps running. Unlock with Microsoft Entra ID, the Windows password or Windows Hello – for laboratories, production lines and control rooms, {lizenz}.',
    sections: [
      {
        id: 'why',
        title: 'Why a transparent screen lock?',
        blocks: [
          { type: 'p', text: 'The normal Windows lock (Win+L) shows the lock screen, and nothing of the workstation stays visible. In a laboratory, on a production line or in a control room, a process must be watched but not touched: a measurement is running, a plant display or a dashboard is being monitored.' },
          { type: 'p', text: 'Vitrine therefore locks only the input. Keyboard and mouse are intercepted system-wide, the programs stay visible and keep running – look, don’t touch. You decide who may unlock: the signed-in person, administrators, groups and Entra app roles, single accounts or any valid account, restrictable to domains.' },
        ],
      },
      {
        id: 'features',
        title: 'Features',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Transparent or covered', text: 'Transparent with a light dimming (8 %) by default. For confidential content, the covered mode shows a large clock and the date – programs still keep running.' },
              { title: 'Cover areas, reveal programs', text: 'Rectangles stay covered while locked, e.g. the part of a LIMS window with patient names. Or everything is covered except the windows of selected programs.' },
              { title: 'Unlock with Microsoft Entra ID', text: 'Through the Windows account broker with every method the tenant allows: passkeys and FIDO2 keys, Authenticator, MFA, Windows Hello for Business, certificates and Conditional Access. Also Windows password and Windows Hello.' },
              { title: 'Lock in many ways', text: 'Ctrl+Alt+L, notification area, idle time, schedule, at startup, as a screen saver, `Vitrine.exe --lock` or the local interface.' },
              { title: 'Electronic signatures', text: 'Line-of-business applications such as a LIMS request a signature over a local interface. Person, time, reason and meaning go into the audit log.' },
              { title: 'Tamper-evident audit log', text: 'Every lock, unlock, failed attempt and signature with UTC time, person and method. The SHA-256 hash chain makes changes visible; a copy on a network share and the Windows event log add independent records.' },
              { title: 'Managed centrally', text: 'ADMX/ADML templates (English and German) with 46 policies for Group Policy and Intune; values set by policy are locked in the settings. Silent install with `msiexec /i Vitrine-x64.msi /qn`.' },
              { title: 'Service and watchdog', text: 'The service “ICT-Baden Vitrine” starts Vitrine at every sign-in. If Vitrine ends or hangs while locked, it disconnects the session and starts Vitrine locked again; without the service, a watchdog locks Windows.' },
              { title: 'Limit failed attempts', text: 'Growing waiting time from the third attempt; optionally lock Windows, sign out or shut down after too many attempts.' },
              { title: 'Five languages', text: 'English, German, Spanish, French and Chinese (simplified); each user picks their own, or a policy sets it.' },
            ],
          },
        ],
      },
      {
        id: 'use-cases',
        title: 'Where it is used: labs, production, control rooms',
        blocks: [
          { type: 'p', text: 'Typical workstations are measurement PCs in laboratories, operator PCs on production lines and control-room PCs whose displays must stay visible. Vitrine places one overlay per monitor, matched to each monitor’s scaling, and optionally shows a notice such as “Measurement running – please do not touch”. While locked, the screen stays on: no screen saver, no sleep.' },
          { type: 'p', text: 'For control rooms and measurement PCs, Vitrine can lock at startup. The Windows key, Alt+Tab, Alt+Esc, Alt+F4 and Ctrl+Esc have no effect while locked, and the mouse pointer is held.' },
        ],
      },
      {
        id: 'gxp',
        title: 'Pharma and GxP: 21 CFR Part 11 and EU GMP Annex 11',
        blocks: [
          { type: 'p', text: 'Vitrine provides building blocks that GxP workstations ask for: access limited to authorised people, unique identification, an audit trail, electronic signatures with a meaning and automatic locking after idle time or on a schedule. The shared unlock password is refused for signatures because it is not attributable to a person.' },
          { type: 'p', text: 'Vitrine is not a validated product, and ICT Baden makes no claim that using it meets 21 CFR Part 11, EU GMP Annex 11 or any other regulation. Validation and the risk assessment are the operator’s responsibility; code and log format are kept simple so that a validation is feasible.' },
        ],
      },
    ],
    requirements: [
      ['Operating system', 'Windows 10 version 1809 (build 17763) or later, or Windows 11, 64-bit'],
      ['.NET', 'not needed for the MSI and Vitrine.exe; the ZIP variant needs the .NET 10 Desktop Runtime'],
      ['Installation', 'the MSI needs administrator rights; Vitrine.exe runs without installation'],
      ['Microsoft Entra ID', 'optional: an app registration in your tenant; sign-in needs the network'],
      ['Files', 'Vitrine-x64.msi, Vitrine.exe, Vitrine-win-x64-framework.zip, SHA256SUMS.txt'],
    ],
    limits: [
      'Pre-release 0.1.0, not code-signed yet: Windows SmartScreen warns. Not yet tested end to end on real devices – Entra ID with MFA, Windows Hello, Remote Desktop, multiple monitors and the MSI on a clean machine are still open.',
      'Ctrl+Alt+Del cannot be intercepted by any application. Vitrine hides Task Manager, Sign out and Change a password there; Lock and Switch user remain.',
      'Vitrine runs as a normal user process supervised by a service; administrators can stop both.',
      'Transparent means visible – choose the covered mode or covered areas for confidential content.',
      'The audit log is tamper-evident: it makes changes visible but cannot prevent them.',
      'Entra ID sign-in needs the network; keep the Windows password or Windows Hello enabled for offline cases.',
      'Spanish, French and Chinese are machine translations and not yet reviewed by native speakers.',
    ],
    faq: [
      { q: 'How do I lock my computer but still see the screen?', a: 'With a transparent screen lock such as Vitrine: Ctrl+Alt+L or a click in the notification area blocks keyboard and mouse, while the screen stays visible and every program keeps running. The Windows lock (Win+L) shows the lock screen instead.' },
      { q: 'Does a running measurement continue while locked?', a: 'Yes. Vitrine only locks the input; programs keep running and stay visible, optionally with a notice such as “Measurement running – please do not touch”. The screen stays on, without screen saver or sleep.' },
      { q: 'Can I unlock with Microsoft Entra ID (formerly Azure AD)?', a: 'Yes, through the Windows account broker with every method your tenant allows – including MFA, Authenticator, passkeys and Conditional Access. You register an app in Entra ID for this. Without that setup, Vitrine offers the Windows password and, where set up, Windows Hello.' },
      { q: 'Who may unlock?', a: 'You decide: the signed-in person, administrators, groups and Entra app roles, single accounts or any valid account – combinable and restrictable to domains.' },
      { q: 'Can Ctrl+Alt+Del be blocked?', a: 'No application can do that. While locked, Vitrine hides Task Manager, Sign out and Change a password; Lock and Switch user remain available.' },
      { q: 'Can Vitrine be deployed with Group Policy or Intune?', a: 'Yes. The MSI installs silently with `msiexec /i Vitrine-x64.msi /qn`, and the ADMX/ADML templates bring 46 policies for Group Policy and Intune – tenant, application ID, who may unlock, the action after failed attempts and more.' },
      { q: 'Is Vitrine compliant with 21 CFR Part 11 or EU GMP Annex 11?', a: 'Vitrine provides building blocks – access control, audit trail, signatures with a meaning, automatic locking – but it is not a validated product. ICT Baden makes no compliance claim; validation and risk assessment are up to the operator.' },
      { q: 'Is Vitrine free? Does it send data?', a: 'Vitrine is {lizenz}. It sends no data to ICT Baden: no telemetry, no crash reports, no update check. Entra ID sign-ins run between Windows and Microsoft.{download}' },
    ],
    aka: ['see-through screen lock', 'transparent lock screen', 'keyboard and mouse lock', 'input lock', 'lock the PC but keep the screen visible', 'screen lock with visible desktop'],
    facts: [
      ['Platform', 'Windows 10 (version 1809 or later) and Windows 11, 64-bit'],
      ['Sign-in', 'Microsoft Entra ID, Windows password, Windows Hello'],
      ['Management', 'Group Policy or Intune via ADMX/ADML with 46 policies'],
      ['User interface', 'English, German, Spanish, French, Chinese'],
      ['Delivery', 'MSI for all users or a single Vitrine.exe without installation'],
    ],
    trademarks: 'Microsoft, Windows, Entra, Intune and Windows Hello are trademarks of the Microsoft group of companies. They are named only to describe compatibility.',
  },
};

export default page;
