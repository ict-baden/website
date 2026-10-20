// Zutritt (Projekt-id freigaben-berechtigungen) – Berechtigungsbericht für Windows-Dateifreigaben.
// Quellen (ict-baden/zutritt): README.md (Funktionen, „And also“, Quick start, Befehlszeile, die 14 Regeln mit deutschen
// Titeln, Vergleich nach Kategorien, „For audits“, „Limits, honestly“, MIT), docs/installation.md (Voraussetzungen,
// Rechte), docs/data-and-privacy.md (keine Daten an ICT-Baden, SQLite pro Benutzer), CHANGELOG.md,
// docs/assets/report-summary.png („Über das Netz gilt jeweils die strengere …“).
// Nicht behaupten: NAS-Unterstützung, Dauer-Monitoring, Rechte ändern, echte Domäne getestet. Keine Fremdprodukte
// ohne Freigabe (früher: „Alternative zu … tenfold“ im Kurztext).
import type { ProductPage } from '../../lib/produktseiten';

const RULES_DE: string[][] = [
  ['ZT01', 'Hoch', 'Breite Gruppe darf schreiben', 'Jeder, Authentifizierte Benutzer, Domänen-Benutzer o. Ä. haben Schreibrechte'],
  ['ZT02', 'Mittel', 'Breite Gruppe darf lesen', 'eine breite Gruppe hat Leserechte'],
  ['ZT03', 'Mittel', 'Recht direkt an Person vergeben', 'Recht an eine einzelne Person statt an eine Gruppe'],
  ['ZT04', 'Mittel', 'Verwaiste SID', 'Eintrag oder Besitzer zeigt auf ein gelöschtes Konto'],
  ['ZT05', 'Hoch', 'Vollzugriff für Nicht-Admins', 'Vollzugriff für ein Konto oder eine Gruppe, die kein Administrator ist'],
  ['ZT06', 'Niedrig', 'Tief versteckte Ausnahme', 'Vererbung tief im Ordnerbaum unterbrochen'],
  ['ZT07', 'Info', 'Verweigern-Eintrag', 'ausdrücklicher Verweigern-Eintrag'],
  ['ZT08', 'Info', 'Freigabe: Jeder Vollzugriff', 'Freigabe gibt Jeder oder Authentifizierten Benutzern mindestens Ändern'],
  ['ZT09', 'Info', 'Ordner nicht lesbar', 'Ordner, Datei oder Ziel konnte nicht gelesen werden'],
  ['ZT10', 'Niedrig', 'Besitzer ist ein Benutzerkonto', 'Besitzer ist ein persönliches Benutzerkonto'],
  ['ZT11', 'Niedrig', 'Leere Gruppe berechtigt', 'eine Gruppe ohne Mitglieder hat Rechte'],
  ['ZT12', 'Mittel', 'Deaktiviertes Konto berechtigt', 'ein deaktiviertes Konto hat eigene Rechte'],
  ['ZT13', 'Info', 'Freigabe-Berechtigungen nicht lesbar', 'Freigabe-Berechtigungen konnten nicht gelesen werden'],
  ['ZT14', 'Niedrig', 'Rechte weichen von der Vererbung ab', 'geerbte Einträge passen nicht zum übergeordneten Ordner – typisch für verschobene Ordner'],
];

const RULES_EN: string[][] = [
  ['ZT01', 'High', 'Broad group can write', 'Everyone, Authenticated Users, Domain Users or similar can write'],
  ['ZT02', 'Medium', 'Broad group can read', 'a broad group can read'],
  ['ZT03', 'Medium', 'Right granted directly to a person', 'right given to an individual instead of a group'],
  ['ZT04', 'Medium', 'Orphaned SID', 'entry or owner points to a deleted account'],
  ['ZT05', 'High', 'Full control for non-admins', 'full control for an account or group that is not an administrator'],
  ['ZT06', 'Low', 'Deeply hidden exception', 'inheritance broken deep in the folder tree'],
  ['ZT07', 'Info', 'Deny entry', 'explicit deny entry'],
  ['ZT08', 'Info', 'Share: Everyone full control', 'share permission gives Everyone or Authenticated Users at least Change'],
  ['ZT09', 'Info', 'Folder not readable', 'folder, file or target could not be read'],
  ['ZT10', 'Low', 'Owner is a user account', 'owner is a personal user account'],
  ['ZT11', 'Low', 'Empty group has rights', 'a group without members has rights'],
  ['ZT12', 'Medium', 'Disabled account has rights', 'a disabled account has its own rights'],
  ['ZT13', 'Info', 'Share permissions not readable', 'share permissions could not be read'],
  ['ZT14', 'Low', 'Permissions differ from inheritance', 'inherited entries do not match the parent – typically a moved folder'],
];

const page: ProductPage = {
  id: 'freigaben-berechtigungen',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Windows 10 (ab Version 1809), Windows 11',
  softwareRequirements: 'Windows 10 Version 1809 (Build 17763) oder neuer, 64 Bit',
  uiLanguages: ['de'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/zutritt/releases/tag/latest',
    source: 'https://github.com/ict-baden/zutritt',
  },
  related: ['haertungs-check', 'vitrine'],
  de: {
    title: 'Zutritt: Freigabe- und NTFS-Berechtigungen auslesen',
    description: 'Wer darf worauf zugreifen? Zutritt liest Freigabe- und NTFS-Rechte, löst AD-Gruppen bis zur Person auf und schreibt einen PDF- oder Excel-Bericht zum Abzeichnen.',
    lead: 'Zutritt ist ein Berechtigungsbericht für Windows-Dateifreigaben: Es liest Freigabe- und NTFS-Berechtigungen, löst Gruppen bis zur einzelnen Person auf, meldet riskante Rechte mit 14 Prüfregeln und schreibt einen Excel- oder PDF-Bericht zum Abzeichnen. Nur lesend, ohne Server und ohne Agent – für Windows 10 und 11, {lizenz}.',
    sections: [
      {
        id: 'wofuer',
        title: 'Wer darf worauf zugreifen – und warum?',
        blocks: [
          { type: 'p', text: 'Auf gewachsenen Fileservern ist oft schwer zu sehen, wer wohin darf: Rechte hängen an verschachtelten Gruppen, die Vererbung ist irgendwo unterbrochen, verschobene Ordner haben ihre alten Rechte mitgenommen. Für eine regelmäßige Berechtigungsprüfung braucht es trotzdem eine klare Antwort und einen Nachweis.' },
          { type: 'p', text: 'Zutritt beantwortet genau diese Frage – wer darf worauf zugreifen, und warum – für Admins und Prüfer, die die Antwort regelmäßig brauchen, ohne eine neue Plattform einzuführen. Nicht zu verwechseln mit einer Zutrittskontrolle für Türen: Zutritt prüft Zugriffsrechte auf Dateifreigaben.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Funktionen',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Freigabe- und NTFS-Rechte auslesen', text: 'Eine Freigabe, ein ganzer Server, lokale Ordner oder alle Freigaben dieses PCs. Abzweigungen (Junctions) werden vermerkt, aber nicht verfolgt.' },
              { title: 'Effektive Rechte wie Windows', text: 'Kanonische Reihenfolge, Verweigern-Einträge, Vererbung, OWNER RIGHTS und Freigabe mit NTFS zusammen – in der Testsuite gegen die Zugriffsprüfung von Windows geprüft.' },
              { title: 'Gruppen bis zur Person', text: 'Lokale Konten und Gruppen des Servers und, auf Rechnern in einer Domäne, Active Directory – verschachtelt, mit Schutz vor Zyklen.' },
              { title: 'Wer darf hier rein? Wohin darf diese Person?', text: 'Pro Ordner jede Person mit effektivem Recht und Gruppenkette; pro Person jeder erreichbare Ordner – auch über verschachtelte Gruppen und deaktivierte Konten.' },
              { title: '14 Prüfregeln mit Empfehlung', text: 'Breite Gruppe darf schreiben, verwaiste SID, Recht direkt an eine Person, Vollzugriff für Nicht-Admins, versteckte Vererbungsbrüche, verschobene Ordner – jeweils mit Erklärung und Empfehlung.' },
              { title: 'Vergleich mit dem letzten Lauf', text: 'Neue und erledigte Befunde, geänderte ACL-Einträge und Gruppenmitgliedschaften – und wer jetzt mehr oder weniger darf.' },
              { title: 'Excel und PDF zum Abzeichnen', text: 'Filterbare Excel-Arbeitsmappe mit jedem Eintrag; PDF mit Deckblatt, Zusammenfassung, Befunden und einem Block für „Geprüft von“, Datum, Unterschrift und Bemerkungen.' },
              { title: 'Befehlszeile und geplante Aufgaben', text: '`Zutritt.exe scan` mit Vergleich und Bericht, Exitcodes 0–3 für das Monitoring – etwa jeden Montag früh per Aufgabenplanung.' },
            ],
          },
        ],
      },
      {
        id: 'regeln',
        title: 'Die 14 Prüfregeln',
        blocks: [
          { type: 'table', caption: 'Prüfregeln von Zutritt mit Schweregrad', head: ['Regel', 'Schweregrad', 'Titel in der App', 'Bedeutung'], rows: RULES_DE },
          { type: 'p', text: 'ACL-Befunde meldet Zutritt dort, wo ein Eintrag ausdrücklich gesetzt ist – nicht noch einmal an jedem Ordner, der ihn erbt.' },
        ],
      },
      {
        id: 'audits',
        title: 'Für Berechtigungsprüfungen und Audits',
        blocks: [
          { type: 'p', text: 'Regelmäßige Prüfungen der Zugriffsrechte werden in GMP-Umgebungen (EU GMP Annex 11), nach ISO/IEC 27001 (Maßnahme A.5.18 „Zugangsrechte“) und unter NIS2 erwartet. Zutritt liefert den Nachweis: was geprüft wurde, von wem, wann, mit welchem Ergebnis und was sich seit dem letzten Mal geändert hat – und eine Seite zum Unterschreiben.' },
          { type: 'p', text: 'Zutritt ist kein validiertes System und macht keine Compliance-Zusage. Es ist ein Analysewerkzeug, das nur liest; wie es in einem regulierten Prozess qualifiziert und eingesetzt wird, entscheidet der Betreiber.' },
        ],
      },
    ],
    requirements: [
      ['Betriebssystem', 'Windows 10 ab Version 1809 oder Windows 11, x64 – nur Windows, weil NTFS, Freigaben und Active Directory nur dort lesbar sind'],
      ['.NET', 'nicht nötig für die MSI und Zutritt.exe; das ZIP braucht die .NET 10 Desktop Runtime'],
      ['Rechte', 'ein Konto, das die gewünschten Berechtigungen lesen darf; Freigabe-Berechtigungen brauchen Administratorrechte auf dem Server'],
      ['Active Directory', 'optional, wenn der prüfende PC Mitglied der Domäne ist'],
      ['Sprache', 'Oberfläche, Befehlszeile und Berichte auf Deutsch'],
    ],
    limits: [
      'Vorabversion, noch nicht signiert: SmartScreen kann warnen.',
      'Active Directory nur für die eigene Domäne des prüfenden PCs; Gruppen aus vertrauten Domänen werden genannt, aber nicht aufgelöst. Bisher gegen ein simuliertes Verzeichnis getestet, noch nicht in einer echten Domäne.',
      'Im Zweifel zeigt Zutritt mehr Zugriff, nicht weniger: bedingte Erlaubnisse zählen, nicht lesbare Freigaberechte bedeuten „nur NTFS“.',
      'Dateien werden nur mit `--dateien` geprüft, und dann nur solche mit eigenen Rechten.',
      'Kein Dauer-Monitoring und keine Auswertung von Dateizugriffen; Rechte ändert Zutritt bewusst nicht.',
    ],
    faq: [
      { q: 'Wie lese ich NTFS-Berechtigungen aller Unterordner aus und exportiere sie nach Excel?', a: 'Mit Zutritt: Freigabe, Server oder Ordner eingeben und den Scan starten. Zutritt liest alle Ordner mit eigenen Rechten und speichert den Bericht als filterbare Excel-Arbeitsmappe oder als PDF.' },
      { q: 'Wer hat Zugriff auf welchen Ordner auf unserem Fileserver?', a: 'Die Ansicht „Wer darf hier rein“ zeigt pro Ordner jede Person mit ihrem effektiven Recht über Freigabe und NTFS und die Gruppen, über die der Zugriff kommt.' },
      { q: 'Auf welche Ordner hat ein bestimmter Benutzer Zugriff?', a: 'Die Seite „Personen“ listet jeden Ordner, den eine Person erreicht, mit effektivem Recht und Gruppenkette – auch über verschachtelte Gruppen.' },
      { q: 'Wie ergeben sich die effektiven Rechte aus Freigabe- und NTFS-Berechtigungen?', a: 'Über das Netz gilt jeweils die strengere von beiden. Innerhalb von NTFS zählen die kanonische Reihenfolge, Verweigern-Einträge und die Vererbung. Zutritt rechnet das wie Windows und ist dagegen getestet.' },
      { q: 'Wie finde ich verwaiste SIDs in NTFS-Berechtigungen?', a: 'Regel ZT04 meldet Einträge oder Besitzer, die auf gelöschte Konten zeigen – aber nur, wenn die zuständige Kontendatenbank erreichbar war. Sonst steht dort „Unbekannt“ statt eines Löschhinweises.' },
      { q: 'Ändert Zutritt Berechtigungen?', a: 'Nein. Zutritt liest nur; es ändert keine Berechtigungen, Dateien oder Konten und braucht keinen Server, keinen Agenten und keinen Dienst.' },
      { q: 'Werden Daten an ICT Baden gesendet?', a: 'Nein: keine Telemetrie, keine Absturzberichte, keine Update-Prüfung. Die Läufe liegen in einer SQLite-Datei pro Benutzer auf dem prüfenden PC.' },
      { q: 'Ist Zutritt kostenlos?', a: 'Ja, Zutritt ist {lizenz}.{download}' },
    ],
    aka: ['NTFS-Berechtigungsbericht', 'Berechtigungsanalyse für Fileserver', 'Freigabeberechtigungen auslesen', 'Ordnerberechtigungen exportieren', 'Access Review für Dateifreigaben', 'Berechtigungsprüfung'],
    trademarks: 'Windows, Active Directory und Excel sind Marken der Microsoft-Unternehmensgruppe. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Windows 10 (version 1809 or later), Windows 11',
    softwareRequirements: 'Windows 10 version 1809 (build 17763) or later, 64-bit',
    title: 'Zutritt: NTFS and share permissions report for Windows',
    description: 'Who can access what on your file shares? Zutritt reads share and NTFS permissions, resolves AD groups down to people and writes a PDF or Excel report to sign.',
    kind: 'Share and NTFS permissions report',
    tagline: 'Who can access what?',
    lead: 'Zutritt is a permissions report for Windows file shares: it reads SMB share permissions and NTFS ACLs, resolves groups down to individual people, flags risky permissions with 14 rules and writes an Excel or PDF report you can sign off in an audit. Read-only, no server, no agent – for Windows 10 and 11, {lizenz}. The application and its reports are in German.',
    sections: [
      {
        id: 'why',
        title: 'Who can access what – and through which group?',
        blocks: [
          { type: 'p', text: 'On file servers that have grown over the years, it is often hard to see who can go where: rights hang on nested groups, inheritance is broken somewhere, moved folders carried their old rights along. A periodic access review still needs a clear answer and evidence.' },
          { type: 'p', text: 'Zutritt answers exactly that question – who can access what, and why – for admins and auditors who need the answer regularly without introducing a new platform.' },
        ],
      },
      {
        id: 'features',
        title: 'Features',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Read share and NTFS permissions', text: 'A share, a whole server, local folders or all shares of this PC. Junctions are recorded but not followed.' },
              { title: 'Effective access, computed like Windows', text: 'Canonical ACE order, deny entries, inheritance, OWNER RIGHTS and share combined with NTFS – checked against the Windows access check in the test suite.' },
              { title: 'Groups down to people', text: 'Local accounts and groups of the scanned server and, on domain-joined PCs, Active Directory – nested, with cycle protection.' },
              { title: 'Who can get in here? Where can this person go?', text: 'Per folder, every person with the effective right and the group chain; per person, every folder they can reach – including nested groups and disabled accounts.' },
              { title: '14 rules with a recommendation', text: 'Broad group can write, orphaned SID, right given to an individual, full control for non-admins, hidden inheritance breaks, moved folders – each with an explanation and a recommendation.' },
              { title: 'Comparison with the last run', text: 'New and resolved findings, changed ACL entries and group memberships – and who can now access more or less.' },
              { title: 'Excel to work with, PDF to sign', text: 'Filterable Excel workbook with every entry; PDF with cover, summary, findings and a sign-off block for reviewer, date, signature and remarks.' },
              { title: 'Command line and scheduled tasks', text: '`Zutritt.exe scan` with comparison and report, exit codes 0–3 for monitoring – e.g. every Monday morning as a scheduled task.' },
            ],
          },
        ],
      },
      {
        id: 'rules',
        title: 'The 14 rules',
        blocks: [
          { type: 'table', caption: 'Zutritt rules with severity', head: ['Rule', 'Severity', 'Finding', 'Meaning'], rows: RULES_EN },
          { type: 'p', text: 'ACL findings are reported where an entry is set explicitly – not again on every folder that inherits it.' },
        ],
      },
      {
        id: 'audits',
        title: 'For access reviews and audits',
        blocks: [
          { type: 'p', text: 'Periodic reviews of access rights are expected in GMP environments (EU GMP Annex 11), under ISO/IEC 27001 (control A.5.18 “Access rights”) and NIS2. Zutritt produces the evidence for such a review: what was checked, by whom, when, with which result and what changed since last time – and a page to sign.' },
          { type: 'p', text: 'Zutritt is not a validated system and makes no compliance claim. It is a read-only analysis tool; how it is qualified and used in a regulated process is up to the operator.' },
        ],
      },
    ],
    requirements: [
      ['Operating system', 'Windows 10 version 1809 or later, or Windows 11, x64 – Windows only, because NTFS, shares and Active Directory can only be read there'],
      ['.NET', 'not needed for the MSI and Zutritt.exe; the ZIP needs the .NET 10 Desktop Runtime'],
      ['Rights', 'an account that can read the permissions you want to see; share permissions need administrator rights on the server'],
      ['Active Directory', 'optional, when the scanning PC is a member of the domain'],
      ['Language', 'user interface, command-line output and reports in German'],
    ],
    limits: [
      'Pre-release, not code-signed yet: SmartScreen may warn.',
      'Active Directory only for the scanning PC’s own domain; groups from trusted domains are named but not expanded. Tested against a simulated directory so far, not yet in a real domain.',
      'When in doubt, Zutritt shows more access, not less: conditional allow entries count, unreadable share permissions mean “NTFS only”.',
      'Files are only examined with `--dateien`, and then only files with their own permissions.',
      'No continuous monitoring and no file-access auditing; Zutritt deliberately does not change permissions.',
    ],
    faq: [
      { q: 'How do I get a report of NTFS and share permissions for a whole file server?', a: 'With Zutritt: enter the share, server or folder and start the scan. Zutritt reads every folder with its own permissions and saves the report as a filterable Excel workbook or a PDF.' },
      { q: 'Who has access to which folder on our file server?', a: 'The view “Wer darf hier rein” (who can get in here) shows, per folder, every person with the effective right over share and NTFS and the groups the access comes through.' },
      { q: 'How do I list all folders a user has access to?', a: 'The people page lists every folder a person can reach, with the effective right and the group chain – including nested groups.' },
      { q: 'How do share and NTFS permissions combine into effective access?', a: 'Over the network the more restrictive of the two applies. Within NTFS, the canonical order, deny entries and inheritance count. Zutritt computes this like Windows and is tested against it.' },
      { q: 'How do I find orphaned SIDs in folder permissions?', a: 'Rule ZT04 reports entries or owners that point to deleted accounts – but only when the responsible account database was reachable. Otherwise the result is “Unbekannt” (unknown), not a deletion hint.' },
      { q: 'Does Zutritt change permissions?', a: 'No. Zutritt only reads; it changes no permissions, files or accounts and needs no server, agent or service.' },
      { q: 'Is any data sent to ICT Baden?', a: 'No: no telemetry, no crash reports, no update check. Runs are stored in a per-user SQLite file on the scanning PC.' },
      { q: 'Is Zutritt free?', a: 'Yes, Zutritt is {lizenz}.{download}' },
    ],
    aka: ['NTFS permissions report', 'file share permissions audit', 'share permissions reporter', 'export folder permissions to Excel', 'user access review for file shares', 'effective access report'],
    facts: [
      ['Platform', 'Windows 10 (1809 or later) and 11, 64-bit'],
      ['User interface', 'German, including command line and reports'],
      ['Access', 'read-only – Zutritt changes no permissions, files or accounts'],
      ['Operation', 'no server, no agent, no service; one program for the desktop and scheduled tasks'],
      ['Delivery', 'MSI for all users or a single Zutritt.exe without installation'],
    ],
    trademarks: 'Windows, Active Directory and Excel are trademarks of the Microsoft group of companies. They are named only to describe compatibility.',
  },
};

export default page;
