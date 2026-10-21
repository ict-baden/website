// Zutritt (Projekt-id freigaben-berechtigungen) – Berechtigungsbericht für Windows-Dateifreigaben.
// Quellen (ict-baden/zutritt, Stand Tag v0.1.0 vom 2026-10-21): README.md (Funktionen, „And also“, Quick start,
// Befehlszeile, die 15 Regeln mit deutschen Titeln, Vergleich nach Kategorien, „For audits“, „Limits, honestly“, MIT,
// fünf Sprachen), docs/rules.md (ZT08 „Freigabe: alle dürfen ändern“, ZT15), docs/limitations.md (bedingte
// Verweigern-Einträge, Kürzung großer Berichte, Sprachen), docs/usage.md (Sprachen, Seite „Bericht“: Excel- und
// PDF-Bericht speichern), docs/excel-and-pdf.md (Blatt „Ordner & Rechte“, PDF-Abschnitt „Ordner mit eigenen Rechten“),
// docs/command-line.md (englische Befehle), docs/installation.md (Voraussetzungen, Rechte), docs/data-and-privacy.md
// (keine Daten an ICT-Baden, SQLite pro Benutzer), CHANGELOG.md (0.1.0), docs/assets/report-summary.png („Über das
// Netz gilt jeweils die strengere …“).
// Vergleich (alternatives): über die Fremdprodukte nur, dass sie dieselbe Aufgabe erfüllen (Herstellerseiten
// netwrix.com „Effective Permissions Reporting Tool“, Cjwdev „NTFS Permissions Reporter“); keine Aussagen zu Preis,
// Editionen oder Funktionsumfang der Fremdprodukte.
// Nicht behaupten: NAS-Unterstützung, Dauer-Monitoring, Rechte ändern, echte Domäne getestet. Fremdprodukte nur im
// Feld alternatives.
import type { ProductPage } from '../../lib/produktseiten';

const RULES_DE: string[][] = [
  ['ZT01', 'Hoch', 'Breite Gruppe darf schreiben', 'Jeder, Authentifizierte Benutzer, Domänen-Benutzer o. Ä. haben Schreibrechte'],
  ['ZT02', 'Mittel', 'Breite Gruppe darf lesen', 'eine breite Gruppe hat Leserechte'],
  ['ZT03', 'Mittel', 'Recht direkt an Person vergeben', 'Recht an eine einzelne Person statt an eine Gruppe'],
  ['ZT04', 'Mittel', 'Verwaiste SID', 'Eintrag oder Besitzer zeigt auf ein gelöschtes Konto'],
  ['ZT05', 'Hoch', 'Vollzugriff für Nicht-Admins', 'Vollzugriff für ein Konto oder eine Gruppe, die kein Administrator ist'],
  ['ZT06', 'Niedrig', 'Tief versteckte Ausnahme', 'Vererbung tief im Ordnerbaum unterbrochen'],
  ['ZT07', 'Info', 'Verweigern-Eintrag', 'ausdrücklicher Verweigern-Eintrag'],
  ['ZT08', 'Info', 'Freigabe: alle dürfen ändern', 'Freigabe gibt Jeder oder Authentifizierten Benutzern mindestens Ändern'],
  ['ZT09', 'Info', 'Ordner nicht lesbar', 'Ordner, Datei oder Ziel konnte nicht gelesen werden'],
  ['ZT10', 'Niedrig', 'Besitzer ist ein Benutzerkonto', 'Besitzer ist ein persönliches Benutzerkonto'],
  ['ZT11', 'Niedrig', 'Leere Gruppe berechtigt', 'eine Gruppe ohne Mitglieder hat Rechte'],
  ['ZT12', 'Mittel', 'Deaktiviertes Konto berechtigt', 'ein deaktiviertes Konto hat eigene Rechte'],
  ['ZT13', 'Info', 'Freigabe-Berechtigungen nicht lesbar', 'Freigabe-Berechtigungen konnten nicht gelesen werden'],
  ['ZT14', 'Niedrig', 'Rechte weichen von der Vererbung ab', 'geerbte Einträge passen nicht zum übergeordneten Ordner – typisch für verschobene Ordner'],
  ['ZT15', 'Mittel', 'Einträge nicht in kanonischer Reihenfolge', 'z. B. Verweigern hinter Erlauben – Windows wertet die gespeicherte Reihenfolge aus und gewährt dann anderes, als die Einträge auf den ersten Blick versprechen'],
];

const RULES_EN: string[][] = [
  ['ZT01', 'High', 'Broad group can write', 'Everyone, Authenticated Users, Domain Users or similar can write'],
  ['ZT02', 'Medium', 'Broad group can read', 'a broad group can read'],
  ['ZT03', 'Medium', 'Right granted directly to a person', 'right given to an individual instead of a group'],
  ['ZT04', 'Medium', 'Orphaned SID', 'entry or owner points to a deleted account'],
  ['ZT05', 'High', 'Full control for non-admins', 'full control for an account or group that is not an administrator'],
  ['ZT06', 'Low', 'Deeply hidden exception', 'inheritance broken deep in the folder tree'],
  ['ZT07', 'Info', 'Deny entry', 'explicit deny entry'],
  ['ZT08', 'Info', 'Share: everyone can change', 'share permission gives Everyone or Authenticated Users at least Change'],
  ['ZT09', 'Info', 'Folder not readable', 'folder, file or target could not be read'],
  ['ZT10', 'Low', 'Owner is a user account', 'owner is a personal user account'],
  ['ZT11', 'Low', 'Empty group has rights', 'a group without members has rights'],
  ['ZT12', 'Medium', 'Disabled account has rights', 'a disabled account has its own rights'],
  ['ZT13', 'Info', 'Share permissions not readable', 'share permissions could not be read'],
  ['ZT14', 'Low', 'Permissions differ from inheritance', 'inherited entries do not match the parent – typically a moved folder'],
  ['ZT15', 'Medium', 'Entries not in canonical order', 'e.g. an allow before a deny – Windows evaluates the stored order and then grants something other than the entries seem to promise'],
];

const page: ProductPage = {
  id: 'freigaben-berechtigungen',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Windows 10 (ab Version 1809), Windows 11',
  softwareRequirements: 'Windows 10 Version 1809 (Build 17763) oder neuer, 64 Bit',
  uiLanguages: ['de', 'en', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/zutritt/releases/latest',
    source: 'https://github.com/ict-baden/zutritt',
  },
  related: ['haertungs-check', 'vitrine'],
  alternatives: {
    approved: true,
    names: ['NTFS Permissions Reporter', 'Netwrix Effective Permissions Reporting Tool'],
    de: {
      title: 'Umstieg vom NTFS Permissions Reporter oder dem Netwrix Effective Permissions Reporting Tool: Zutritt als Alternative',
      blocks: [
        { type: 'p', text: 'Wer Berechtigungen auf Dateifreigaben bisher mit dem NTFS Permissions Reporter von Cjwdev oder dem Netwrix Effective Permissions Reporting Tool auswertet, findet in Zutritt ein Werkzeug für dieselbe Aufgabe: zeigen, wer auf welchen Ordner zugreifen darf. Zutritt bietet dafür:' },
        {
          type: 'list',
          items: [
            'Freigabe- und NTFS-Berechtigungen zusammen, effektive Rechte wie Windows sie berechnet – gegen die Zugriffsprüfung von Windows getestet',
            'Gruppen bis zur einzelnen Person: lokale Konten und Gruppen des Servers und Active Directory der eigenen Domäne, verschachtelt',
            '15 Prüfregeln mit Erklärung und Empfehlung und den Vergleich mit dem letzten Lauf',
            'Excel-Arbeitsmappe mit Filtern und PDF mit Block zum Abzeichnen',
            'nur lesend, ohne Server, Agent oder Dienst; Befehlszeile mit Exitcodes für geplante Aufgaben',
            '{lizenz}, ohne Telemetrie',
          ],
        },
        { type: 'p', text: 'Was Umsteiger wissen sollten: Zutritt läuft nur unter Windows 10 ab Version 1809 und Windows 11 (x64), löst Active Directory nur für die Domäne des prüfenden PCs auf und ist dabei bisher nur gegen ein simuliertes Verzeichnis getestet. Es überwacht nicht dauerhaft und ändert keine Rechte.' },
      ],
      faq: [
        { q: 'Gibt es eine kostenlose Alternative zum NTFS Permissions Reporter oder zum Netwrix Effective Permissions Reporting Tool?', a: 'Zutritt erfüllt dieselbe Aufgabe – Freigabe- und NTFS-Berechtigungen auslesen und zeigen, wer worauf zugreifen darf – und ist {lizenz}. Dazu kommen 15 Prüfregeln, der Vergleich mit dem letzten Lauf und ein PDF-Bericht zum Abzeichnen.{download}' },
      ],
      trademark: 'NTFS Permissions Reporter ist ein Produkt von Cjwdev; Netwrix und Netwrix Effective Permissions Reporting Tool sind Marken der Netwrix Corporation. ICT Baden steht in keiner Verbindung zu diesen Unternehmen; die Namen werden nur genannt, um den Vergleich zu beschreiben.',
    },
    en: {
      title: 'Switching from NTFS Permissions Reporter or Netwrix Effective Permissions Reporting Tool: Zutritt as an alternative',
      blocks: [
        { type: 'p', text: 'If you report on file share permissions with NTFS Permissions Reporter by Cjwdev or with the Netwrix Effective Permissions Reporting Tool, Zutritt does the same job: showing who can access which folder. What Zutritt offers:' },
        {
          type: 'list',
          items: [
            'share and NTFS permissions together, effective permissions computed like Windows – tested against the Windows access check',
            'groups down to individual people: local accounts and groups of the server and Active Directory of the own domain, nested',
            '15 rules with an explanation and a recommendation, and a comparison with the last run',
            'Excel workbook with filters and a PDF with a sign-off block',
            'read-only, no server, agent or service; command line with exit codes for scheduled tasks',
            '{lizenz}, no telemetry',
          ],
        },
        { type: 'p', text: 'Worth knowing before you switch: Zutritt runs only on Windows 10 version 1809 or later and Windows 11 (x64), resolves Active Directory only for the scanning PC’s own domain and has so far been tested against a simulated directory only. It does not monitor continuously and does not change permissions.' },
      ],
      faq: [
        { q: 'Is there a free alternative to NTFS Permissions Reporter or the Netwrix Effective Permissions Reporting Tool?', a: 'Zutritt does the same job – reading share and NTFS permissions and showing who can access what – and is {lizenz}. It adds 15 rules, a comparison with the last run and a PDF report to sign.{download}' },
      ],
      trademark: 'NTFS Permissions Reporter is a product of Cjwdev; Netwrix and Netwrix Effective Permissions Reporting Tool are trademarks of Netwrix Corporation. ICT Baden is not affiliated with these companies; the names are used only to describe the comparison.',
    },
  },
  de: {
    title: 'Zutritt: Freigabe- und NTFS-Berechtigungen auslesen',
    description: 'Zutritt liest NTFS- und Freigabeberechtigungen unter Windows aus und zeigt Zugriffsrechte bis zur Person – mit 15 Prüfregeln und Bericht zum Abzeichnen.',
    lead: 'Zutritt ist ein Berechtigungsbericht für Windows-Dateifreigaben: Es liest Freigabe- und NTFS-Berechtigungen, löst Gruppen bis zur einzelnen Person auf, meldet riskante Rechte mit 15 Prüfregeln und schreibt einen Excel- oder PDF-Bericht zum Abzeichnen. Nur lesend, ohne Server und ohne Agent – für Windows 10 und 11, {lizenz}.',
    sections: [
      {
        id: 'wofuer',
        title: 'Zugriffsrechte anzeigen: Wer darf worauf zugreifen – und warum?',
        blocks: [
          { type: 'p', text: 'Auf gewachsenen Fileservern ist oft schwer zu sehen, wer wohin darf: Rechte hängen an verschachtelten Gruppen, die Vererbung ist irgendwo unterbrochen, verschobene Ordner haben ihre alten Rechte mitgenommen. Für eine regelmäßige Berechtigungsprüfung braucht es trotzdem eine klare Antwort und einen Nachweis, etwa einen NTFS-Berechtigungsbericht zum Abzeichnen.' },
          { type: 'p', text: 'Als Berechtigungsanalyse für Fileserver beantwortet Zutritt genau diese Frage – wer darf worauf zugreifen, und warum – für Admins und Prüfer, die die Antwort regelmäßig brauchen, ohne eine neue Plattform einzuführen. Nicht zu verwechseln mit einer Zutrittskontrolle für Türen: Zutritt prüft Zugriffsrechte auf Dateifreigaben.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Funktionen des Berechtigungsberichts',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'NTFS- und Freigabeberechtigungen auslesen', text: 'Eine Freigabe, ein ganzer Server, lokale Ordner oder alle Freigaben dieses PCs. Abzweigungen (Junctions) werden vermerkt, aber nicht verfolgt.' },
              { title: 'Effektive Berechtigungen wie Windows', text: 'Gespeicherte Reihenfolge der Einträge (auch nicht kanonische), Verweigern-Einträge, Vererbung, OWNER RIGHTS und Freigabe mit NTFS zusammen – in der Testsuite gegen die Zugriffsprüfung von Windows geprüft.' },
              { title: 'Gruppen bis zur Person', text: 'Lokale Konten und Gruppen des Servers und, auf Rechnern in einer Domäne, Active Directory – verschachtelt, mit Schutz vor Zyklen.' },
              { title: 'Wer darf hier rein? Wohin darf diese Person?', text: 'Pro Ordner jede Person mit effektivem Recht und Gruppenkette; pro Person jeder erreichbare Ordner – auch über verschachtelte Gruppen und deaktivierte Konten.' },
              { title: '15 Prüfregeln mit Empfehlung', text: 'Breite Gruppe darf schreiben, verwaiste SID, Recht direkt an eine Person, Vollzugriff für Nicht-Admins, versteckte Vererbungsbrüche, verschobene Ordner, Einträge in falscher Reihenfolge – jeweils mit Erklärung und Empfehlung.' },
              { title: 'Vergleich mit dem letzten Lauf', text: 'Neue und erledigte Befunde, geänderte ACL-Einträge und Gruppenmitgliedschaften – und wer jetzt mehr oder weniger darf.' },
              { title: 'Excel und PDF zum Abzeichnen', text: 'Filterbare Excel-Arbeitsmappe mit jedem Eintrag; PDF mit Deckblatt, Zusammenfassung, Befunden und einem Block für „Geprüft von“, Datum, Unterschrift und Bemerkungen.' },
              { title: 'Befehlszeile und geplante Aufgaben', text: '`Zutritt.exe scan` mit Vergleich und Bericht, Exitcodes 0–3 für das Monitoring – etwa jeden Montag früh per Aufgabenplanung. Befehle und Optionen gibt es deutsch und englisch.' },
            ],
          },
        ],
      },
      {
        id: 'regeln',
        title: 'Berechtigungen auswerten: die 15 Prüfregeln',
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
      ['Rechte', 'ein Konto, das die gewünschten Berechtigungen lesen darf; Freigabeberechtigungen brauchen Administratorrechte auf dem Server'],
      ['Active Directory', 'optional, wenn der prüfende PC Mitglied der Domäne ist'],
      ['Sprache', 'Oberfläche, Befehlszeile und Berichte auf Deutsch, Englisch, Spanisch, Französisch und Chinesisch (die letzten drei maschinell übersetzt, noch nicht von Muttersprachlern gegengelesen)'],
    ],
    limits: [
      'Vorabversion 0.1.0, noch nicht signiert: SmartScreen kann warnen; die Downloads lassen sich über SHA256SUMS.txt prüfen.',
      'Active Directory nur für die eigene Domäne des prüfenden PCs; Gruppen aus vertrauten Domänen werden genannt, aber nicht aufgelöst. Bisher gegen ein simuliertes Verzeichnis getestet, noch nicht in einer echten Domäne.',
      'Im Zweifel zeigt Zutritt mehr Zugriff, nicht weniger: bedingte Erlaubnisse zählen, bedingte Verweigerungen nicht, nicht lesbare Freigaberechte bedeuten „nur NTFS“.',
      'Dateien werden nur mit `--dateien` geprüft, und dann nur solche mit eigenen Rechten.',
      'Sehr große Berichte werden mit sichtbarem Hinweis gekürzt – das PDF früher als die Excel-Arbeitsmappe.',
      'Kein Dauer-Monitoring und keine Auswertung von Dateizugriffen; Rechte ändert Zutritt bewusst nicht.',
    ],
    faq: [
      { q: 'Wie kann ich NTFS-Berechtigungen auslesen und für alle Unterordner nach Excel exportieren?', a: 'Mit Zutritt: Freigabe, Server oder Ordner eingeben und den Scan starten. Zutritt liest alle Ordner mit eigenen Rechten; auf der Seite „Bericht“ lassen sich dann die Ordnerberechtigungen exportieren – als filterbare Excel-Arbeitsmappe oder als PDF.' },
      { q: 'Wie zeige ich die Zugriffsrechte an, also wer auf welchen Ordner unseres Fileservers zugreifen darf?', a: 'Die Ansicht „Wer darf hier rein“ zeigt pro Ordner jede Person mit ihrem effektiven Recht über Freigabe und NTFS und die Gruppen, über die der Zugriff kommt.' },
      { q: 'Auf welche Ordner hat ein bestimmter Benutzer Zugriff?', a: 'Die Seite „Personen“ listet jeden Ordner, den eine Person erreicht, mit effektivem Recht und Gruppenkette – auch über verschachtelte Gruppen.' },
      { q: 'Wie ergeben sich die effektiven Berechtigungen aus Freigabe- und NTFS-Rechten?', a: 'Über das Netz gilt jeweils die strengere von beiden. Innerhalb von NTFS zählen die gespeicherte Reihenfolge der Einträge, Verweigern-Einträge und die Vererbung. Zutritt rechnet das wie Windows und ist dagegen getestet; Einträge in nicht kanonischer Reihenfolge meldet Regel ZT15.' },
      { q: 'Wie finde ich verwaiste SIDs in NTFS-Berechtigungen?', a: 'Regel ZT04 meldet Einträge oder Besitzer, die auf gelöschte Konten zeigen – aber nur, wenn die zuständige Kontendatenbank erreichbar war. Sonst steht dort „Unbekannt“ statt eines Löschhinweises.' },
      { q: 'Ändert Zutritt Berechtigungen?', a: 'Nein. Zutritt liest nur; es ändert keine Berechtigungen, Dateien oder Konten und braucht keinen Server, keinen Agenten und keinen Dienst.' },
      { q: 'Werden Daten an ICT Baden gesendet?', a: 'Nein: keine Telemetrie, keine Absturzberichte, keine Update-Prüfung. Die Läufe liegen in einer SQLite-Datei pro Benutzer auf dem prüfenden PC.' },
      { q: 'Ist Zutritt kostenlos?', a: 'Ja, Zutritt ist {lizenz}.{download}' },
    ],
    aka: ['NTFS-Berechtigungen auslesen', 'NTFS-Berechtigungsbericht', 'Berechtigungsanalyse für Fileserver', 'Berechtigungen auswerten', 'Zugriffsrechte anzeigen', 'Freigabeberechtigungen auslesen', 'Ordnerberechtigungen exportieren', 'effektive Berechtigungen', 'Berechtigungsprüfung'],
    trademarks: 'Windows, Active Directory und Excel sind Marken der Microsoft-Unternehmensgruppe. Sie werden nur genannt, um die Kompatibilität zu beschreiben.',
  },
  en: {
    operatingSystem: 'Windows 10 (version 1809 or later), Windows 11',
    softwareRequirements: 'Windows 10 version 1809 (build 17763) or later, 64-bit',
    title: 'Zutritt: NTFS and share permissions report for Windows',
    description: 'Zutritt reads share and NTFS permissions on Windows, computes effective permissions down to each person and writes a PDF or Excel report to sign.',
    kind: 'Share and NTFS permissions report',
    tagline: 'Who can access what?',
    lead: 'Zutritt is a permissions report for Windows file shares: it reads SMB share permissions and NTFS ACLs, resolves groups down to individual people, flags risky permissions with 15 rules and writes an Excel or PDF report you can sign off in an audit. Read-only, no server, no agent – for Windows 10 and 11, in English and German, {lizenz}.',
    sections: [
      {
        id: 'why',
        title: 'Who can access what – and through which group?',
        blocks: [
          { type: 'p', text: 'On file servers that have grown over the years, it is often hard to see who can go where: rights hang on nested groups, inheritance is broken somewhere, moved folders carried their old rights along. A periodic user access review for file shares still needs a clear answer and evidence.' },
          { type: 'p', text: 'Zutritt answers exactly that question – who can access what, and why – with a folder access report for admins and auditors who need the answer regularly without introducing a new platform.' },
        ],
      },
      {
        id: 'features',
        title: 'What the permissions report covers',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Read share and NTFS permissions', text: 'A share, a whole server, local folders or all shares of this PC. Junctions are recorded but not followed.' },
              { title: 'Effective permissions, computed like Windows', text: 'Stored ACE order (non-canonical lists included), deny entries, inheritance, OWNER RIGHTS and share combined with NTFS – checked against the Windows access check in the test suite.' },
              { title: 'Groups down to people', text: 'Local accounts and groups of the scanned server and, on domain-joined PCs, Active Directory – nested, with cycle protection.' },
              { title: 'Who can get in here? Where can this person go?', text: 'Per folder, every person with the effective right and the group chain; per person, every folder they can reach – including nested groups and disabled accounts.' },
              { title: '15 rules with a recommendation', text: 'Broad group can write, orphaned SID, right given to an individual, full control for non-admins, hidden inheritance breaks, moved folders, entries in the wrong order – each with an explanation and a recommendation.' },
              { title: 'Comparison with the last run', text: 'New and resolved findings, changed ACL entries and group memberships – and who can now access more or less.' },
              { title: 'Excel to work with, PDF to sign', text: 'Filterable Excel workbook with every entry; PDF with cover, summary, findings and a sign-off block for reviewer, date, signature and remarks.' },
              { title: 'Command line and scheduled tasks', text: '`Zutritt.exe scan` with comparison and report, exit codes 0–3 for monitoring – e.g. every Monday morning as a scheduled task. Commands and options have English and German spellings.' },
            ],
          },
        ],
      },
      {
        id: 'rules',
        title: 'The 15 rules for auditing folder permissions',
        blocks: [
          { type: 'table', caption: 'Zutritt rules with severity', head: ['Rule', 'Severity', 'Finding', 'Meaning'], rows: RULES_EN },
          { type: 'p', text: 'ACL findings are reported where an entry is set explicitly – not again on every folder that inherits it.' },
        ],
      },
      {
        id: 'audits',
        title: 'For access reviews and audits',
        blocks: [
          { type: 'p', text: 'Periodic reviews of access rights are expected in GMP environments (EU GMP Annex 11), under ISO/IEC 27001 (control A.5.18 “Access rights”) and NIS2. For a file share permissions audit, Zutritt produces the evidence: what was checked, by whom, when, with which result and what changed since last time – and a page to sign.' },
          { type: 'p', text: 'Zutritt is not a validated system and makes no compliance claim. It is a read-only analysis tool; how it is qualified and used in a regulated process is up to the operator.' },
        ],
      },
    ],
    requirements: [
      ['Operating system', 'Windows 10 version 1809 or later, or Windows 11, x64 – Windows only, because NTFS, shares and Active Directory can only be read there'],
      ['.NET', 'not needed for the MSI and Zutritt.exe; the ZIP needs the .NET 10 Desktop Runtime'],
      ['Rights', 'an account that can read the permissions you want to see; share permissions need administrator rights on the server'],
      ['Active Directory', 'optional, when the scanning PC is a member of the domain'],
      ['Language', 'user interface, command-line output and reports in English, German, Spanish, French and Chinese (the last three machine-translated, not yet reviewed by native speakers)'],
    ],
    limits: [
      'Pre-release 0.1.0, not code-signed yet: SmartScreen may warn; the downloads can be checked with SHA256SUMS.txt.',
      'Active Directory only for the scanning PC’s own domain; groups from trusted domains are named but not expanded. Tested against a simulated directory so far, not yet in a real domain.',
      'When in doubt, Zutritt shows more access, not less: conditional allow entries count, conditional deny entries do not, unreadable share permissions mean “NTFS only”.',
      'Files are only examined with `--dateien`, and then only files with their own permissions.',
      'Very large reports are truncated with a visible notice – the PDF earlier than the Excel workbook.',
      'No continuous monitoring and no file-access auditing; Zutritt deliberately does not change permissions.',
    ],
    faq: [
      { q: 'How do I get an NTFS and share permissions report for a whole file server?', a: 'With Zutritt: enter the share, server or folder and start the scan. Zutritt reads every folder with its own permissions; on the report page you can then export folder permissions to Excel as a filterable workbook, or save the report as a PDF.' },
      { q: 'How can I see who has access to this folder – and through which group?', a: 'The folder view (“who can get in here”) shows, per folder, every person with the effective right over share and NTFS and the groups the access comes through.' },
      { q: 'How do I list all folders a user has access to?', a: 'The people page lists every folder a person can reach, with the effective right and the group chain – including nested groups.' },
      { q: 'How do share and NTFS permissions combine into effective permissions?', a: 'Over the network the more restrictive of the two applies. Within NTFS, the stored order of the entries, deny entries and inheritance count. Zutritt computes this like Windows and is tested against it; rule ZT15 reports entries that are not in canonical order.' },
      { q: 'How do I find orphaned SIDs in folder permissions?', a: 'Rule ZT04 reports entries or owners that point to deleted accounts – but only when the responsible account database was reachable. Otherwise the result is “unknown”, not a deletion hint.' },
      { q: 'Does Zutritt change permissions?', a: 'No. Zutritt only reads; it changes no permissions, files or accounts and needs no server, agent or service.' },
      { q: 'Is any data sent to ICT Baden?', a: 'No: no telemetry, no crash reports, no update check. Runs are stored in a per-user SQLite file on the scanning PC.' },
      { q: 'Is Zutritt free?', a: 'Yes, Zutritt is {lizenz}.{download}' },
    ],
    aka: ['NTFS permissions report', 'share permissions report', 'effective permissions', 'export folder permissions to Excel', 'file share permissions audit', 'user access review for file shares', 'folder access report'],
    facts: [
      ['Platform', 'Windows 10 (1809 or later) and 11, 64-bit'],
      ['User interface', 'English and German; Spanish, French and Chinese machine-translated – including command line and reports'],
      ['Access', 'read-only – Zutritt changes no permissions, files or accounts'],
      ['Operation', 'no server, no agent, no service; one program for the desktop and scheduled tasks'],
      ['Delivery', 'MSI for all users or a single Zutritt.exe without installation'],
    ],
    trademarks: 'Windows, Active Directory and Excel are trademarks of the Microsoft group of companies. They are named only to describe compatibility.',
  },
};

export default page;
