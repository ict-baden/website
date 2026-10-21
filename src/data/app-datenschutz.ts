// Datenschutzerklärungen der Apps unter /datenschutz/<slug>/ (die Apps verlinken https://ict-baden.de/datenschutz/<slug>/;
// Google Play verlangt sie für die Android-Apps). Inhalt nach docs/data-and-privacy.md im jeweiligen Produkt-Repo –
// nichts hinzudichten. Deutsch und Englisch, weil die Apps weltweit laufen. Gerendert von src/pages/datenschutz/[app].astro.

export interface AppPrivacyCopy {
  /** „Kurz gesagt“: sendet die App etwas an ICT Baden? Telemetrie, Konten, Werbung, Tracking */
  summary: string;
  /** Wer ist für die Daten verantwortlich (meist der Betreiber/Arbeitgeber), was verarbeitet ICT Baden nicht */
  operator: string;
  /** Was auf dem Gerät/Rechner gespeichert wird (je ein Satz) */
  stored: string[];
  /** Android: Sicherung/Geräteübertragung; Desktop: optionaler Zusatz zu den gespeicherten Daten */
  storedNote?: string;
  /** Desktop: Netzwerkverbindungen [Verbindung, wann und wohin] – nur die, die es gibt */
  connections?: [string, string][];
  /** Android: Berechtigungen [Berechtigung, wofür] */
  permissions?: [string, string][];
  /** Alles löschen (ein bis drei Sätze) */
  deletion: string;
}

export interface AppPrivacy {
  /** Pfad /datenschutz/<slug>/ – so, wie die App ihn verlinkt */
  slug: string;
  name: string;
  platform: 'android' | 'desktop';
  /** Android-Paketname */
  pkg?: string;
  /** Projekt-id der Produktseite (src/data/produktseiten/<id>.ts) – für Produktlink und Repo-Schalter download.public */
  productId: string;
  de: AppPrivacyCopy;
  en: AppPrivacyCopy;
}

const apps: AppPrivacy[] = [
  {
    slug: 'vitrine',
    name: 'Vitrine',
    platform: 'desktop',
    productId: 'vitrine',
    de: {
      summary: 'Vitrine sendet keine Daten an ICT Baden. Es gibt keine Telemetrie, keine Absturzberichte, keine Nutzungsstatistik und keine Update-Prüfung. Verbindungen entstehen nur durch Funktionen, die der Betreiber einrichtet, etwa die Microsoft-Anmeldung.',
      operator: 'Verantwortlicher im Sinne der DSGVO ist der Betreiber, also die Organisation, die Vitrine installiert und konfiguriert. ICT Baden verarbeitet über die Software keine dieser Daten. Vitrine ist eine Bildschirmsperre und nicht zur Überwachung von Verhalten oder Leistung gedacht; ob die Einführung mitbestimmungspflichtig ist, klärt das Unternehmen mit Betriebsrat und Datenschutzbeauftragtem.',
      stored: [
        'Die Gerätekonfiguration. Sie kann Konto-, Gruppen- und Domänennamen, die Entra-Mandanten- und Anwendungs-ID und den gesalzenen Hash des gemeinsamen Entsperrpassworts enthalten.',
        'Das Audit-Protokoll mit personenbezogenen Daten: wer wann gesperrt und entsperrt hat, wer sich vergeblich angemeldet hat und wer was signiert hat (Kontoname, Anzeigename, Konto-IDs, Rechnername, Zeit, bei Signaturen Grund und Bedeutung). Dieselben Einträge gehen in das Windows-Ereignisprotokoll (abschaltbar) und, falls eingerichtet, als Kopie auf einen Dateiserver.',
        'Pro Benutzer die Sprachwahl und, während der Sperre, kurzzeitig eine Sicherung von drei Windows-Richtlinienwerten.',
        'Nicht gespeichert werden Passwörter, Microsoft-Tokens und Windows-Hello-Daten.',
      ],
      storedNote: 'Vitrine löscht Audit-Protokolle nie; wie lange sie aufbewahrt werden, entscheidet der Betreiber. Fachanwendungen auf demselben Rechner, die über die lokale Schnittstelle eine Signatur anfordern, erhalten die Identität der signierenden Person und – nur wenn der Administrator es erlaubt – Microsoft-Tokens.',
      connections: [
        ['Microsoft-Anmeldung (Entra ID)', 'Nur wenn jemand „Mit Microsoft fortfahren“ oder die Testanmeldung wählt: Anmeldeseite von Microsoft im Standardbrowser. Konto und Anmeldedaten gehen an Microsoft, im Rahmen des Vertrags Ihrer Organisation mit Microsoft.'],
        ['Windows-Anmeldung', 'Bei Anmeldung mit Windows-Passwort und beim Auflösen von Gruppen: Ihre Domänencontroller, wie bei jeder Windows-Anmeldung.'],
        ['Dateiserver', 'Nur wenn eine Netzwerkkopie des Audit-Protokolls eingerichtet ist.'],
        ['Plugins und Skripte', 'Nur wenn sie installiert bzw. eingerichtet sind; sie verbinden sich dorthin, wohin sie konfiguriert sind.'],
        ['Links im Info-Fenster', 'Nur beim Anklicken; sie öffnen sich im Browser.'],
      ],
      deletion: 'Vitrine deinstallieren (entfernt Programm, Dienst und Autostart). Konfiguration und Audit-Protokolle bleiben dabei erhalten: die Ordner „ICT-Baden\\Vitrine“ und „Vitrine“ unter %ProgramData%, in jedem Benutzerprofil „Vitrine“ unter %LocalAppData% und %AppData% sowie gegebenenfalls die Netzwerkkopien von Hand löschen – vorher Aufbewahrungspflichten prüfen. Richtlinien entfernt man über Gruppenrichtlinie bzw. Intune.',
    },
    en: {
      summary: 'Vitrine sends no data to ICT Baden. There is no telemetry, no crash reporting, no usage statistics and no update check. Connections only come from features the operator sets up, such as the Microsoft sign-in.',
      operator: 'The controller in the sense of the GDPR is the operator, i.e. the organisation that installs and configures Vitrine. ICT Baden processes none of this data through the software. Vitrine is a screen lock and not intended to monitor the behaviour or performance of employees; whether introducing it is subject to co-determination is for the company to assess with its works council and data protection officer.',
      stored: [
        'The device configuration. It can contain account, group and domain names, the Entra tenant and application ID and the salted hash of the shared unlock password.',
        'The audit log, which contains personal data: who locked and unlocked when, who failed to sign in and who signed what (account name, display name, account IDs, computer name, time, and for signatures the reason and meaning). The same entries go to the Windows event log (can be switched off) and, if set up, as a copy to a file server.',
        'Per user, the language choice and, while locked, a short-lived backup of three Windows policy values.',
        'Not stored: passwords, Microsoft tokens and Windows Hello data.',
      ],
      storedNote: 'Vitrine never deletes audit logs; how long they are kept is up to the operator. Line-of-business applications on the same computer that request a signature through the local interface receive the identity of the person who signed and – only if the administrator allows it – Microsoft tokens.',
      connections: [
        ['Microsoft sign-in (Entra ID)', 'Only when someone chooses “Continue with Microsoft” or the test sign-in: Microsoft’s sign-in page in the default browser. Account and sign-in data go to Microsoft, under your organisation’s agreement with Microsoft.'],
        ['Windows sign-in', 'For a Windows password sign-in and when resolving groups: your domain controllers, as for any Windows logon.'],
        ['File server', 'Only if a network copy of the audit log is set up.'],
        ['Plugins and scripts', 'Only if installed or set up; they connect wherever they are configured to.'],
        ['Links in the About window', 'Only when clicked; they open in the browser.'],
      ],
      deletion: 'Uninstall Vitrine (removes the program, the service and the autostart). This keeps the configuration and the audit logs: delete the folders “ICT-Baden\\Vitrine” and “Vitrine” under %ProgramData%, “Vitrine” under %LocalAppData% and %AppData% in every user profile and, if used, the network copies by hand – check your retention obligations first. Policies are removed through Group Policy or Intune.',
    },
  },
  {
    slug: 'lupe',
    name: 'Lupe',
    platform: 'desktop',
    productId: 'qr-scanner',
    de: {
      summary: 'Lupe sendet keine Daten an ICT Baden und enthält keinen Netzwerkcode: keine Telemetrie, keine Update-Prüfung, keine Lizenzprüfung, keine Cloud-Erkennung. Es gibt kein Benutzerkonto, keine Werbung und kein Tracking.',
      operator: 'Wird Lupe in einem Unternehmen eingesetzt, ist der Betreiber (in der Regel Ihr Arbeitgeber) für die gescannten Inhalte verantwortlich. ICT Baden verarbeitet über die Software keine dieser Daten.',
      stored: [
        'Lupe speichert nie ein Bild: Kamerabilder und Bildschirmausschnitte bleiben nur im Arbeitsspeicher.',
        'Pro Benutzer die Einstellungen, einschließlich Ihrer Link-Regeln und der gewählten Kamera.',
        'Der Verlauf mit Zeit, Inhalt, Format und Quelle jedes gescannten Codes, nur wenn „Verlauf speichern“ eingeschaltet ist – ohne Bilder, Dateinamen oder Fenstertitel. Einträge lassen sich einzeln oder alle löschen; beim Ausschalten wird die Datei gelöscht.',
      ],
      storedNote: '„Kopieren“ legt den Inhalt in die Zwischenablage, „Eintippen“ gibt ihn an ein anderes Programm weiter; was danach damit geschieht, regeln Windows bzw. dieses Programm.',
      connections: [
        ['Keine', 'Lupe selbst öffnet keine Netzwerkverbindung.'],
        ['Links', 'Nur wenn Sie einen gescannten Link öffnen (per Klick oder über eine Link-Regel): Ihr Standardbrowser öffnet ihn, nicht Lupe.'],
      ],
      deletion: 'In den Einstellungen „Mit Windows starten“ ausschalten, Lupe beenden, den Ordner „Lupe“ unter %LocalAppData% löschen (Einstellungen und Verlauf) und das Programm deinstallieren. Die Deinstallation allein lässt diesen Ordner stehen. Unter Linux und macOS liegen die Daten in den üblichen Konfigurations- und Datenordnern des Benutzers.',
    },
    en: {
      summary: 'Lupe sends no data to ICT Baden and contains no network code: no telemetry, no update check, no licence check, no cloud decoding. There is no account, no ads and no tracking.',
      operator: 'When Lupe is used in a company, the operator (usually your employer) is responsible for the scanned contents. ICT Baden processes none of this data through the software.',
      stored: [
        'Lupe never keeps a picture: camera frames and screen regions stay in memory only.',
        'Per user, the settings, including your link rules and the chosen camera.',
        'The history with time, content, format and source of each scanned code, only if “Save history” is on – without pictures, file names or window titles. Entries can be deleted one by one or all at once; switching the history off deletes the file.',
      ],
      storedNote: '“Copy” puts the content on the clipboard, “Type” passes it to another program; what happens to it afterwards is up to Windows or that program.',
      connections: [
        ['None', 'Lupe itself opens no network connection.'],
        ['Links', 'Only when you open a scanned link (by clicking or through a link rule): your default browser opens it, not Lupe.'],
      ],
      deletion: 'Switch off “Start with Windows” in the settings, quit Lupe, delete the folder “Lupe” under %LocalAppData% (settings and history) and uninstall the program. Uninstalling alone leaves that folder in place. On Linux and macOS the data is in the user’s usual configuration and data folders.',
    },
  },
  {
    slug: 'zutritt',
    name: 'Zutritt',
    platform: 'desktop',
    productId: 'freigaben-berechtigungen',
    de: {
      summary: 'Zutritt sendet keine Daten an ICT Baden. Es gibt keine Telemetrie, keine Absturzberichte, keine Nutzungsstatistik und keine Update-Prüfung. Zutritt liest Berechtigungen nur und ändert nichts an Dateien, Freigaben, Konten oder Gruppen.',
      operator: 'Ein Lauf enthält Namen von Personen, ihre Gruppenmitgliedschaften und ihre Zugriffsrechte. Verantwortlicher im Sinne der DSGVO ist, wer Zutritt einsetzt (der Betreiber). ICT Baden verarbeitet über die Software keine dieser Daten.',
      stored: [
        'Pro Benutzer im eigenen Profil eine Datenbank mit den Läufen: Ordner, Freigaben und Berechtigungen sowie Kontonamen, Anzeigenamen und Gruppenmitglieder der beteiligten Konten. Die Läufe bleiben, bis Sie sie löschen.',
        'Ein kurzes Protokoll für den Support, höchstens 7 Tage, ohne Kontonamen, Pfade der gescannten Ordner oder Berechtigungen.',
        'Die Sprachwahl, falls Sie eine wählen.',
        'Excel- und PDF-Berichte, die Sie speichern, enthalten dieselben personenbezogenen Angaben; das PDF ist als vertraulich gekennzeichnet.',
      ],
      storedNote: 'Ein Diagnosepaket für den Support erstellen nur Sie selbst; es enthält keine Läufe und Berichte, Namen und Adressen werden standardmäßig ersetzt.',
      connections: [
        ['Gescannte Server', 'Die Dateiserver, die Sie scannen, und auf Domänen-PCs die Domänencontroller der eigenen Domäne, um Konten und Gruppen aufzulösen.'],
        ['Links auf der Info-Seite', 'Nur beim Anklicken; sie öffnen sich im Browser.'],
      ],
      deletion: 'Einzelne Läufe in der App löschen, oder Zutritt schließen und den Ordner „Zutritt“ unter %LocalAppData% löschen (Datenbank und Protokoll). Die Deinstallation entfernt die Datenbank nicht. Gespeicherte Berichte löschen Sie dort, wo Sie sie abgelegt haben.',
    },
    en: {
      summary: 'Zutritt sends no data to ICT Baden. There is no telemetry, no crash reporting, no usage statistics and no update check. Zutritt only reads permissions and changes nothing on files, shares, accounts or groups.',
      operator: 'A run contains names of people, their group memberships and their access rights. The controller in the sense of the GDPR is whoever runs Zutritt (the operator). ICT Baden processes none of this data through the software.',
      stored: [
        'Per user, in the own profile, a database of the runs: folders, shares and permissions, and the account names, display names and group members of the accounts involved. Runs stay until you delete them.',
        'A short log for support, at most 7 days, without account names, paths of scanned folders or permissions.',
        'The language choice, if you choose one.',
        'Excel and PDF reports you save contain the same personal data; the PDF is marked confidential.',
      ],
      storedNote: 'A diagnostics package for support is only created by you; it contains no runs and reports, and names and addresses are replaced by default.',
      connections: [
        ['Scanned servers', 'The file servers you scan and, on domain-joined PCs, the domain controllers of the own domain to resolve accounts and groups.'],
        ['Links on the Info page', 'Only when clicked; they open in the browser.'],
      ],
      deletion: 'Delete single runs in the app, or close Zutritt and delete the folder “Zutritt” under %LocalAppData% (database and log). Uninstalling does not remove the database. Delete saved reports where you stored them.',
    },
  },
  {
    slug: 'riegel',
    name: 'Riegel',
    platform: 'desktop',
    productId: 'haertungs-check',
    de: {
      summary: 'Riegel sendet keine Daten an ICT Baden und öffnet keine Netzwerkverbindung: keine Telemetrie, keine Update-Prüfung, keine Absturzberichte. Riegel liest die Sicherheitskonfiguration eines Windows-Rechners und ändert dort keine Einstellungen.',
      operator: 'Verantwortlicher für die Daten in Exporten, Anlagenordnern und Berichten ist der Kunde, der Riegel einsetzt. ICT Baden erhält über die Software keine dieser Daten. Riegel prüft Maschinen, nicht Menschen; ob die Einführung mitbestimmungspflichtig ist, klärt das Unternehmen mit Betriebsrat und Datenschutzbeauftragtem.',
      stored: [
        'Der Export des geprüften Rechners (Snapshot) dort, wo Sie ihn ablegen. Er enthält Hostnamen, lokale Kontonamen und SIDs, das Datum der letzten Anmeldung lokaler Konten und die Mitglieder lokaler Gruppen; Passwörter werden nie gelesen.',
        'Der Anlagenordner mit Exporten, Prüfergebnissen und Registern. Namen stehen dort nur, wenn jemand sie einträgt.',
        'PDF- und Excel-Berichte und das Nachweispaket mit Hostnamen und Befunden, die Konten nennen können; sie sind standardmäßig als vertraulich gekennzeichnet.',
        'Pro Benutzer Einstellungen und ein Protokoll (höchstens 7 Tage, ohne Host- und Kontonamen).',
      ],
      storedNote: 'Auf dem geprüften Rechner hält Windows selbst fest, dass ein Programm lief (Ausführungsspuren, Ereignisprotokoll). Mit der Option zur Pseudonymisierung werden Kontonamen im Export ersetzt; das ist pseudonym, nicht anonym.',
      connections: [
        ['Keine', 'Riegel selbst öffnet keine Netzwerkverbindung. Liegt der Anlagenordner auf einer Freigabe, liest und schreibt Windows ihn wie jede Datei.'],
        ['Links auf der Info-Seite', 'Nur beim Anklicken; sie öffnen sich im Browser.'],
      ],
      deletion: 'Exporte auf USB-Sticks nach dem Import löschen; eine Anlage löschen Sie mit ihrem Anlagenordner (und Kopien in Nachweispaketen). Die App-Daten liegen im Ordner „Riegel“ unter %LocalAppData%; die Deinstallation lässt ihn stehen.',
    },
    en: {
      summary: 'Riegel sends no data to ICT Baden and opens no network connection: no telemetry, no update check, no crash reports. Riegel reads the security configuration of a Windows machine and changes no settings there.',
      operator: 'The customer who uses Riegel is the controller of the data in exports, plant folders and reports. ICT Baden receives none of it through the software. Riegel checks machines, not people; whether introducing it is subject to co-determination is for the company to assess with its works council and data protection officer.',
      stored: [
        'The export of the checked machine (snapshot), where you put it. It contains host names, local account names and SIDs, the date of the last logon of local accounts and the members of local groups; passwords are never read.',
        'The plant folder with exports, check results and registers. Names are only in it if someone enters them.',
        'PDF and Excel reports and the evidence pack with host names and findings that can name accounts; they are marked confidential by default.',
        'Per user, settings and a log (at most 7 days, without host and account names).',
      ],
      storedNote: 'On the checked machine, Windows itself records that a program ran (execution traces, event log). The pseudonymisation option replaces account names in the export; this is pseudonymised, not anonymous.',
      connections: [
        ['None', 'Riegel itself opens no network connection. If the plant folder is on a share, Windows reads and writes it like any file.'],
        ['Links on the About page', 'Only when clicked; they open in the browser.'],
      ],
      deletion: 'Delete exports on USB sticks after the import; delete a plant together with its plant folder (and copies in evidence packs). The app data is in the folder “Riegel” under %LocalAppData%; uninstalling leaves it in place.',
    },
  },
  {
    slug: 'industrial-kiosk-browser',
    name: 'Industrial Kiosk Browser',
    platform: 'android',
    pkg: 'de.ictbaden.industrialkioskbrowser',
    productId: 'industrialkioskbrowser',
    de: {
      summary: 'Industrial Kiosk Browser (früher Pforte und EnterpriseBrowser) sendet keine Daten an ICT Baden. Es gibt keine Telemetrie, keine Absturzberichte, keine Update-Prüfung, kein Benutzerkonto, keine Werbung und kein Tracking. Der Browser verbindet sich mit den Web-Anwendungen, die der Betreiber der Geräte konfiguriert, und den Seiten, zu denen sie führen; mit einer Liste erlaubter Hosts nur mit diesen. Das Android System WebView, das die Seiten darstellt, prüft Adressen mit Google Safe Browsing (eine Android-Funktion, per Geräterichtlinie abschaltbar).',
      operator: 'Für die Daten in diesen Web-Anwendungen ist der Betreiber der Geräte bzw. der jeweiligen Web-Anwendung verantwortlich (in der Regel Ihr Arbeitgeber). ICT Baden verarbeitet keine dieser Daten.',
      stored: [
        'Die Konfiguration (Profile, Startadressen, Design). Passwörter nur als gesalzener Hash (PBKDF2).',
        'Welche Konfigurationsquellen bereits angewendet wurden und der letzte Fehler dabei.',
        'Cookies, Cache und Web-Speicher der konfigurierten Web-Anwendungen, wie bei jedem Browser; pro Profil beim Start löschbar.',
        'Dateien, die aus den Web-Anwendungen heruntergeladen werden, nur wenn Downloads erlaubt sind.',
      ],
      storedNote: 'Konfiguration und Browserdaten sind von der Android-Sicherung und der Geräteübertragung ausgenommen.',
      permissions: [
        ['Internet, Netzwerkstatus', 'Laden der konfigurierten Web-Anwendungen, Fehlerseite ohne Netz.'],
        ['Kamera', 'Nur wenn eine geöffnete Web-Anwendung die Kamera anfordert (z. B. Barcode-Scan per Kamera). Sie werden vorher gefragt. Das Bild geht an diese Web-Anwendung, nicht an ICT Baden.'],
        ['Vibration', 'Rückmeldung nach einem Scan.'],
      ],
      deletion: 'Android-Einstellungen → Apps → Industrial Kiosk Browser → Speicher → Speicher löschen, oder die App deinstallieren, entfernt alle Daten der App. Bei ICT Baden liegen keine Daten, die gelöscht werden müssten.',
    },
    en: {
      summary: 'Industrial Kiosk Browser (formerly Pforte and EnterpriseBrowser) sends no data to ICT Baden. There is no telemetry, no crash reporting, no update check, no account, no ads and no tracking. The browser connects to the web applications configured by the operator of the devices and to the pages they lead to; with a list of allowed hosts, only to those. The Android System WebView, which renders the pages, checks addresses with Google Safe Browsing (an Android feature that can be turned off by device policy).',
      operator: 'The operator of the devices or of the respective web application (usually your employer) is responsible for the data in those web applications. ICT Baden processes none of it.',
      stored: [
        'The configuration (profiles, start addresses, design). Passwords only as salted hashes (PBKDF2).',
        'Which configuration sources were applied already, and the last error doing so.',
        'Cookies, cache and web storage of the configured web applications, like any browser; can be cleared per profile at start.',
        'Files downloaded from the web applications, only if downloads are allowed.',
      ],
      storedNote: 'Configuration and browser data are excluded from Android backup and device transfer.',
      permissions: [
        ['Internet, network state', 'Loading the configured web applications, error page without network.'],
        ['Camera', 'Only when an opened web application asks for the camera (e.g. a camera barcode scan). You are asked first. The image goes to that web application, not to ICT Baden.'],
        ['Vibration', 'Feedback after a scan.'],
      ],
      deletion: 'Android Settings → Apps → Industrial Kiosk Browser → Storage → Clear storage, or uninstalling the app, removes all of the app’s data. ICT Baden holds no data that would need to be deleted.',
    },
  },
  {
    slug: 'industrialkeyboard',
    name: 'Industrial Keyboard',
    platform: 'android',
    pkg: 'de.ictbaden.industrialkeyboard',
    productId: 'industrialkeyboard',
    de: {
      summary: 'Industrial Keyboard hat keine Internetberechtigung und kann deshalb keine Daten vom Gerät senden – weder an ICT Baden noch an andere. Es gibt keine Telemetrie, keine Absturzberichte, keine Update-Prüfung, kein Benutzerkonto, keine Werbung und kein Tracking.',
      operator: 'Was Sie tippen, wird an die aktive App weitergegeben und nicht gespeichert: kein Wörterbuch, kein Lernen von Wörtern, kein Verlauf, kein Zugriff auf die Zwischenablage. Die Tastatur liest nur die Art des aktiven Eingabefelds (Zahl, E-Mail, Passwort …), um die passenden Tasten zu zeigen. Für die eingegebenen Daten ist der Betreiber der Geräte verantwortlich (in der Regel Ihr Arbeitgeber); ICT Baden verarbeitet keine davon.',
      stored: [
        'Die Konfiguration (Layout, Design, eigene Tasten). Das Admin-Passwort nur als gesalzener Hash (PBKDF2).',
        'Welche Konfigurationsquellen bereits angewendet wurden und der letzte Fehler dabei.',
      ],
      storedNote: 'Die Konfiguration ist von der Android-Sicherung und der Geräteübertragung ausgenommen. Im Systemprotokoll stehen nur kurze Meldungen zur Konfiguration, nie getippter Text oder Barcodes.',
      permissions: [
        ['Vibration', 'Rückmeldung bei Tastendruck und Scan.'],
        ['Eingabemethode', 'Vom System vergeben, wenn Sie die Tastatur in den Einstellungen aktivieren.'],
      ],
      deletion: 'Android-Einstellungen → Apps → Industrial Keyboard → Speicher → Speicher löschen, oder die App deinstallieren, entfernt alle Daten der App. Bei ICT Baden liegen keine Daten, die gelöscht werden müssten.',
    },
    en: {
      summary: 'Industrial Keyboard has no internet permission and therefore cannot send any data off the device – neither to ICT Baden nor to anyone else. There is no telemetry, no crash reporting, no update check, no account, no ads and no tracking.',
      operator: 'What you type is passed to the focused app and not stored: no dictionary, no word learning, no history, no clipboard access. The keyboard only reads the type of the focused input field (number, e-mail, password …) to show the matching keys. The operator of the devices (usually your employer) is responsible for the data typed; ICT Baden processes none of it.',
      stored: [
        'The configuration (layout, design, custom keys). The admin password only as a salted hash (PBKDF2).',
        'Which configuration sources were applied already, and the last error doing so.',
      ],
      storedNote: 'The configuration is excluded from Android backup and device transfer. The system log only gets short messages about the configuration, never typed text or barcodes.',
      permissions: [
        ['Vibration', 'Feedback on key presses and scans.'],
        ['Input method', 'Granted by the system when you enable the keyboard in the settings.'],
      ],
      deletion: 'Android Settings → Apps → Industrial Keyboard → Storage → Clear storage, or uninstalling the app, removes all of the app’s data. ICT Baden holds no data that would need to be deleted.',
    },
  },
];

export default apps;
