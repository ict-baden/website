// Ratgeber „Verwaiste SIDs und ‚Jeder‘-Rechte finden“ – wie Admins auf einem gewachsenen Windows-Fileserver verwaiste SIDs,
// breite Gruppen mit Schreibrecht, unterbrochene Vererbung und Rechte an einzelnen Personen finden, mit Bordmitteln oder einem
// Bericht; das eigene Produkt ist Zutritt (liest nur, ändert nichts).
// Ausrichtung (docs/sichtbarkeit.md, Abschnitt 3.3): „verwaiste SIDs finden“, „‚Jeder‘-Rechte“, „Vererbung unterbrochen“ /
// „find orphaned SIDs“ (DE hoch, EN mittel), dazu „wer hat Zugriff auf Ordner“ und die Berechtigungsprüfung vor einem Audit.
// Kein Vergleich mit Suiten, die Rechte ändern – Zutritt liest nur.
// Quellen (abgerufen 2026-10-22):
// - SIDs, bekannte SIDs, Domänenteil und RID, SID-Verlauf, Gruppen statt Personen, Präfix der Funktions-SIDs: Microsoft Learn
//   „Security identifiers“ (learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-identifiers):
//   „they never reuse SIDs for deleted accounts“; S-1-5-11 Authenticated Users „includes authenticated security principals
//   from any trusted domain“; S-1-5-domain-513 Domain Users „the user is automatically added to this group“; S-1-5-32-545
//   Users „the only member is the Authenticated Users group“; SIDHistory: „An ACL might have the user's old SID but not the
//   new one.“; „you should allow or deny access to a group, not to an individual“; „The prefix of all capability SIDs is
//   S-1-15-3.“
// - „Jeder“ = S-1-1-0, Anmeldesitzung = S-1-5-5-X-Y: Microsoft Learn „Well-known SIDs“
//   (learn.microsoft.com/en-us/windows/win32/secauthz/well-known-sids): „Everyone or World, which is a group that includes all
//   users.“
// - Funktions-SIDs (Capability SIDs): Microsoft Learn „Some SIDs don't resolve into friendly names“, KB 4502539
//   (learn.microsoft.com/en-us/troubleshoot/windows-server/windows-security/sids-not-resolve-into-friendly-names): seit Windows
//   Server 2012 und Windows 8, im Datei-Explorer ohne Namen, „By design, a Capability SID doesn't resolve to a friendly name.“;
//   „Don't delete Capability SIDs from either the registry or file system permissions.“ (nach dem Entfernen nicht über die
//   Oberfläche wieder eintragbar); Liste unter …\SecurityManager\CapabilityClasses\AllCachedCapabilities. Deutscher Begriff
//   „Funktions-SID“ aus der deutschen Fassung derselben Seite.
// - Name nicht gefunden trotz bestehendem Konto, vertraute Domänen, Anmeldesitzungen ohne Kontonamen: Microsoft Learn
//   „LookupAccountSidW function“ (learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidw): „This can
//   occur if a network time-out prevents the function from finding the name.“; „checked against the trusted domains that
//   correspond to their SID prefixes“; SID-Verlauf: „can look up SIDs for any account in any domain in the forest,
//   including SIDs that appear only in the SIDhistory field of an account in the forest“.
// - Gelöschtes Konto in der Sicherheitsliste als „Account Unknown“ mit SID: Microsoft Learn „Migrate a Certification Authority
//   in Windows Server“ (learn.microsoft.com/en-us/windows-server/identity/ad-cs/migrate-certification-authority): „displayed
//   (as Account Unknown with a security identifier following it)“. Die deutsche Beschriftung ist in keiner Microsoft-Quelle
//   belegt (die maschinelle Übersetzung schreibt „Unbekanntes Konto“) – „Konto unbekannt“ steht deshalb nur als Suchbegriff in
//   Teaser und FAQ-Frage, im Text „unbekanntes Konto mit der SID“.
// - icacls: Microsoft Learn „icacls“ (learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls): Syntax
//   „icacls name [/save aclfile] [/setowner user] [/findsid Sid] [/verify] [/reset] [/T] [/C] [/L] [/Q]“; /findsid findet
//   Dateien, die „contain a DACL explicitly mentioning the specified security identifier“; „affix the wildcard character * to
//   the beginning of the SID“; /c „Error messages are still shown.“; /verify „ACLs that aren't canonical“; /save „Stores DACLs
//   for all matching files“; /remove „Removes all occurrences of the specified SID from the DACL.“; kanonische Reihenfolge in
//   den Remarks; Beispiele „icacls c:\windows\* /save aclfile /t“ und „icacls c:\windows\ /restore aclfile“.
// - Reihenfolge der Einträge: Microsoft Learn „How AccessCheck Works“ (learn.microsoft.com/en-us/windows/win32/secauthz/
//   how-dacls-control-access-to-an-object): „The system examines each ACE in sequence until one of the following events
//   occurs“; „Order of ACEs in a DACL“: Rechte „could vary depending on the order of ACEs in the DACL“.
// - PowerShell: Microsoft Learn „Get-Acl“ (learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-acl):
//   „"Access", a list (array) of the access control entries“, -LiteralPath; „Get-ChildItem“ 5.1 (…/microsoft.powershell.
//   management/get-childitem?view=powershell-5.1): „You can use the Recurse parameter with Directory.“, mit -Recurse
//   „Use LiteralPath to specify the target directory“, gibt nur die Kinder eines Ordners zurück; „Export-Csv“ 5.1
//   (…/microsoft.powershell.utility/export-csv?view=powershell-5.1): -Encoding „The default value is ASCII.“, -UseCulture
//   „Uses the list separator for the current culture as the item delimiter.“, Werte per ToString().
// - .NET: „FileSystemAccessRule“ (IdentityReference, FileSystemRights, AccessControlType, IsInherited), „FileSystemRights“
//   (FullControl, Modify, Write), „ObjectSecurity.SetAccessRuleProtection“: „Protected access rules cannot be modified by
//   parent objects through inheritance.“ (AreAccessRulesProtected: „true if the DACL is protected“),
//   „IdentityReferenceCollection.Translate“: nicht zuordenbare Identitäten werden „copied without being converted“ – Konten
//   ohne Namen bleiben SIDs (alle learn.microsoft.com/en-us/dotnet/api/system.security.…).
// - Freigabeberechtigungen per PowerShell: Microsoft Learn „Get-SmbShareAccess“ (learn.microsoft.com/en-us/powershell/module/
//   smbshare/get-smbshareaccess): „Retrieves the ACL of the SMB share.“; -CimSession „Enter a computer name or a session
//   object“.
// - Freigabe und NTFS: Microsoft Learn, archiviert (Windows Server 2008) „Share and NTFS Permissions on a File Server“
//   (learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754178(v=ws.10)): „The more
//   restrictive permissions are then applied.“; „set Share permissions to Full Control for Everyone“ (manche Administratoren
//   regeln alles über NTFS); Freigaberechte gelten nicht für lokale und Terminalserver-Benutzer. Dazu support.microsoft.com
//   „When you share a folder with Everyone, you seem to have unexpected results“: Dialog „Advanced Sharing“, „the most
//   restrictive combination of the descriptors“.
// - Effektive Rechte im Explorer: Microsoft Learn, archiviert (Windows 7, Server 2008 R2) „View Effective Permissions on Files
//   and Folders“ (…/windows-server-2008-R2-and-2008/cc771586(v=ws.11)): Sicherheit › Erweitert › Registerkarte für eine
//   gewählte Person oder Gruppe; bei „Jeder“ und „Authentifizierte Benutzer“ „the effective rights always include those
//   permissions“. Die heutige Bezeichnung „Effektiver Zugriff“ ist die der Oberfläche (aktuelle Microsoft-Seite dazu nicht
//   gefunden).
// - Lange Pfade: Microsoft Learn „Maximum Path Length Limitation“ (learn.microsoft.com/en-us/windows/win32/fileio/
//   maximum-file-path-limitation): „the maximum length for a path is MAX_PATH, which is defined as 260 characters“; seit
//   Windows 10 1607 nur für Programme, die sich dafür einrichten („your app must opt-in“).
// - Eigene SID: Microsoft Learn „whoami“ (learn.microsoft.com/en-us/windows-server/administration/windows-commands/whoami):
//   /user „Displays the current domain and user name and the security identifier (SID).“
// - Zutritt: ict-baden/zutritt origin/main 0bdbcae (Tag v0.1.1, 2026-10-21): README.md (Funktionen, „Orphaned is really
//   orphaned“, 15 Regeln, „Limits, honestly“), docs/rules.md (ZT01, ZT02, ZT03, ZT04 – „Not reported“: Domäne nicht erreichbar
//   → Unbekannt, nie für Funktionen, App-Pakete, Dienste, Anmeldesitzungen –, ZT05, ZT06 ab Ebene 3 einstellbar, ZT08 Info,
//   ZT12, ZT14, ZT15; Befunde nach Verweigern-Einträgen und dort, wo der Eintrag gesetzt ist), docs/how-it-works.md
//   (Identitäten, LSA findet vertraute Domänen und SID-Verlauf, Freigabe ∩ NTFS, \\?\-Pfade, Namen der bekannten Konten in der
//   Sprache von Windows, Domänengruppen behalten ihren AD-Namen), docs/limitations.md (AD nur eigene Domäne, vertraute Domänen
//   nicht aufgelöst, nur gegen ein simuliertes Verzeichnis getestet, im Zweifel mehr Zugriff), docs/installation.md
//   (Freigaberechte nur mit Administratorrechten, Unlesbares als ZT09/ZT13 statt still übersprungen), docs/usage.md,
//   docs/excel-and-pdf.md (Blätter, PDF mit Abzeichnen und „Bemerkungen“), docs/command-line.md (Exitcodes), CHANGELOG.md;
//   src/data/produktseiten/freigaben-berechtigungen.ts. Version und Status kommen aus products.json ({version}).
// Nicht behaupten (wie auf der Produktseite): NAS-Unterstützung, Dauer-Monitoring, Rechte ändern, in einer echten Domäne
// getestet, Compliance-Zusage. Keine Fremdprodukte nennen – der Vergleich mit benannten Berichtswerkzeugen steht auf der
// Produktseite (Abschnitt #alternative bzw. #alternative-to).
import type { Guide } from '../../lib/ratgeber';

const guide: Guide = {
  id: 'verwaiste-sids-jeder-rechte-finden',
  product: 'freigaben-berechtigungen',
  published: '2026-10-22',
  de: {
    slug: 'verwaiste-sids-jeder-rechte-finden',
    title: 'Verwaiste SIDs und „Jeder“-Rechte auf dem Fileserver finden',
    description: 'Verwaiste SIDs, „Jeder“ mit Schreibrecht, unterbrochene Vererbung: So finden Sie riskante NTFS-Rechte – mit Explorer, icacls, PowerShell oder Bericht.',
    h1: 'Verwaiste SIDs und „Jeder“-Rechte auf Windows-Fileservern finden',
    short: 'Verwaiste SIDs und „Jeder“-Rechte',
    teaser: '„Konto unbekannt“, „Jeder“ darf schreiben, Vererbung unterbrochen: So finden Sie riskante Rechte auf dem Fileserver – mit Bordmitteln oder einem Bericht.',
    lead: 'Eine verwaiste SID ist ein Eintrag in den NTFS-Berechtigungen, dessen Konto es nicht mehr gibt: Windows findet keinen Namen dazu und zeigt statt eines Namens die SID, etwa S-1-5-21-…-1107. Einzelne Ordner prüfen Sie im Explorer; über einen ganzen Fileserver sucht `icacls /findsid` nach einer bekannten SID wie „Jeder“ (S-1-1-0), und ein kurzes PowerShell-Skript mit `Get-Acl` exportiert alle Einträge für Excel. Löschen Sie nichts blind – auch Konten, deren Domänencontroller gerade nicht erreichbar ist, und Funktions-SIDs von Windows erscheinen ohne Namen.',
    sections: [
      {
        id: 'begriffe',
        title: 'Worum es geht: verwaiste SIDs, breite Gruppen, versteckte Ausnahmen',
        toc: 'Worum es geht',
        blocks: [
          { type: 'p', text: 'Windows speichert in den Zugriffslisten von Ordnern keine Namen, sondern Sicherheitskennungen (SIDs). Jedes Konto und jede Gruppe bekommt bei der Anlage eine eigene SID, und Windows vergibt sie nie ein zweites Mal – auch nicht an ein neues Konto mit demselben Namen. Wird ein Konto gelöscht, bleiben seine Einträge in den NTFS-Berechtigungen stehen. Windows findet dazu keinen Namen mehr und zeigt ein unbekanntes Konto mit der SID dahinter, etwa S-1-5-21-…-1107: eine verwaiste SID. Allerdings ist nicht jede SID ohne Namen verwaist – mehr dazu unter [Nicht jede SID ohne Namen ist verwaist](#nicht-verwaist).' },
          { type: 'p', text: 'Breite Gruppen sind Gruppen, in denen praktisch alle stecken. Ihre SIDs stehen fest oder enden auf eine feste Zahl:' },
          {
            type: 'list',
            items: [
              '„Jeder“: S-1-1-0 – alle Benutzer',
              '„Authentifizierte Benutzer“: S-1-5-11 – alle angemeldeten Benutzer und Computer, auch aus vertrauten Domänen',
              '„Domänen-Benutzer“: S-1-5-21-…-513 – jedes Benutzerkonto der Domäne; neue Konten kommen automatisch hinzu',
              '„VORDEFINIERT\\Benutzer“: S-1-5-32-545 – enthält nach der Installation nur „Authentifizierte Benutzer“',
            ],
          },
          { type: 'p', text: 'Darf eine dieser Gruppen schreiben oder ändern oder hat sie Vollzugriff, kann praktisch jede angemeldete Person dort Dateien anlegen, ändern oder löschen – und mit ihr jede Schadsoftware, die unter ihrem Konto läuft. Zwei weitere Muster machen eine Prüfung schwer: Vererbung, die tief im Ordnerbaum unterbrochen ist – solche Ausnahmen sieht man von oben nicht –, und Rechte, die direkt an einzelne Personen statt an Gruppen vergeben sind. Microsoft empfiehlt, Zugriff über Gruppen zu vergeben: Wechselt jemand die Abteilung, ändert sich dann nur die Gruppenmitgliedschaft.' },
          { type: 'p', text: 'Typische Anlässe: Ein gewachsener Fileserver soll aufgeräumt oder umgezogen werden, oder eine Berechtigungsprüfung steht an – intern oder vor einem Audit, etwa nach ISO/IEC 27001.' },
        ],
      },
      {
        id: 'nicht-verwaist',
        title: 'Nicht jede SID ohne Namen ist verwaist',
        toc: 'Nicht jede SID ist verwaist',
        blocks: [
          { type: 'p', text: '„Unbekannt“ heißt zunächst nur, dass Windows zu dieser SID gerade keinen Namen gefunden hat. Dafür gibt es Gründe, bei denen das Konto noch existiert oder gar kein Benutzerkonto ist:' },
          {
            type: 'items',
            items: [
              { title: 'Funktions-SIDs (S-1-15-3-…)', text: 'Seit Windows 8 und Windows Server 2012 gibt es SIDs für Funktionen (englisch Capabilities), über die Windows-Komponenten und Apps auf Ressourcen zugreifen. Sie haben absichtlich keinen Anzeigenamen. Microsoft rät ausdrücklich, sie nicht aus Datei- oder Registrierungsberechtigungen zu löschen: Funktionen können danach nicht mehr richtig arbeiten, und über die Oberfläche lassen sie sich nicht wieder eintragen. Die bekannten stehen unter `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\SecurityManager\\CapabilityClasses\\AllCachedCapabilities`.' },
              { title: 'Domänencontroller nicht erreichbar', text: 'Verhindert eine Zeitüberschreitung im Netz die Namenssuche, erscheint die SID ebenfalls ohne Namen – obwohl das Konto existiert.' },
              { title: 'Konten aus anderen Domänen', text: 'SIDs, die die eigene Domäne nicht kennt, sucht Windows in den vertrauten Domänen. Ist die Vertrauensstellung gestört oder die andere Domäne nicht erreichbar, bleibt der Name aus.' },
              { title: 'Migrierte Konten', text: 'Zieht ein Konto in eine andere Domäne um, bekommt es eine neue SID; die alte kann im SID-Verlauf (SIDHistory) des Kontos erhalten bleiben und gibt dann weiter Zugriff. Solche alten SIDs kann Windows in allen Domänen der Gesamtstruktur nachschlagen und zeigt dann den Namen des migrierten Kontos; ist die zuständige Domäne nicht erreichbar, bleibt der Name aus. Klären Sie deshalb vor dem Löschen einer SID aus einer früheren Domäne, ob ein migriertes Konto sie noch trägt – sonst nehmen Sie ihm Rechte.' },
              { title: 'Anmeldesitzungen', text: 'SIDs einer Anmeldesitzung (S-1-5-5-…) haben grundsätzlich keinen Kontonamen.' },
            ],
          },
          { type: 'p', text: 'Echte verwaiste SIDs geben in der Regel niemandem mehr Zugriff, weil Windows keine SID neu vergibt. Ein Befund sind sie trotzdem: Niemand kann mehr sagen, wem das Recht einmal gegeben wurde. Riskanter als der Eintrag selbst ist das Löschen von Einträgen, die nur verwaist aussehen. Ein erster Anhaltspunkt ist der Domänenteil – alles vor der letzten Zahl einer SID wie S-1-5-21-…-1107. Mit einem Domänenkonto angemeldet, zeigt `whoami /user` Ihre eigene SID: Stimmt deren Domänenteil mit dem des unbekannten Eintrags überein, stammt er aus Ihrer Domäne.' },
        ],
      },
      {
        id: 'explorer',
        title: 'Im Explorer: Sicherheit und „Effektiver Zugriff“',
        toc: 'Explorer',
        blocks: [
          { type: 'p', text: 'Für einen einzelnen Ordner genügen die Bordmittel. Eigenschaften › Sicherheit zeigt die NTFS-Berechtigungen, unter „Erweitert“ stehen die Einträge einzeln. Die Registerkarte „Effektiver Zugriff“ berechnet, was eine ausgewählte Person oder Gruppe an diesem Ordner darf; Rechte von „Jeder“ und „Authentifizierte Benutzer“ zählen dabei mit. Verwaiste SIDs erscheinen dort als SID ohne Namen – ob eine solche SID wirklich verwaist ist, klärt der Abschnitt [Nicht jede SID ohne Namen ist verwaist](#nicht-verwaist).' },
          { type: 'p', text: 'Die Grenzen: Der Explorer zeigt einen Ordner und beim effektiven Zugriff eine Person auf einmal. Die Freigabeberechtigungen stehen getrennt unter „Freigabe“ › „Erweiterte Freigabe“. Eine Liste über den ganzen Ordnerbaum, einen Export oder einen Vergleich mit dem letzten Stand gibt es nicht. Für Stichproben reicht das, für einen gewachsenen Fileserver mit Tausenden Ordnern nicht.' },
        ],
      },
      {
        id: 'icacls',
        title: 'icacls: den ganzen Ordnerbaum nach einer SID durchsuchen',
        toc: 'icacls',
        blocks: [
          { type: 'p', text: '`icacls` zeigt und ändert Zugriffslisten an der Eingabeaufforderung; `icacls D:\\Daten\\Projekt` zeigt die Liste eines Ordners. Für die Suche über einen ganzen Baum gibt es `/findsid`: Der Schalter findet alle Dateien und Ordner, deren Zugriffsliste die angegebene SID ausdrücklich nennt. Eine SID in Zahlenform bekommt ein `*` vorangestellt:' },
          {
            type: 'list',
            items: [
              '`icacls D:\\Daten\\* /findsid *S-1-1-0 /t /c` – alle Dateien und Ordner unter D:\\Daten, in deren Zugriffsliste „Jeder“ steht',
              '`icacls D:\\Daten\\* /findsid *S-1-5-11 /t /c` – dasselbe für „Authentifizierte Benutzer“',
              '`icacls D:\\Daten\\* /findsid *S-1-5-21-…-1107 /t /c` – wo eine bestimmte verwaiste SID noch eingetragen ist',
              '`icacls D:\\Daten\\* /verify /t /c` – Zugriffslisten, die nicht kanonisch sind',
            ],
          },
          { type: 'p', text: '`/t` nimmt alle Unterordner mit, `/c` macht bei Fehlern wie „Zugriff verweigert“ weiter und zeigt sie trotzdem an. Kanonisch heißt: ausdrückliche Verweigerungen vor ausdrücklichen Erlaubnissen, danach die geerbten Einträge – in anderer Reihenfolge kann Windows anderes gewähren, als die Einträge auf den ersten Blick versprechen.' },
          { type: 'p', text: 'Die Grenzen: `/findsid` meldet, wo eine SID vorkommt, nicht welches Recht sie dort hat; ob „Jeder“ nur lesen oder auch schreiben darf, zeigt erst die Liste des einzelnen Ordners. Nach verwaisten SIDs allgemein kann `icacls` nicht suchen, nur nach einer SID, die Sie schon kennen. Gruppenmitgliedschaften und Freigabeberechtigungen kennt `icacls` nicht, und auf großen Freigaben kann die Suche lange dauern.' },
        ],
      },
      {
        id: 'powershell',
        title: 'PowerShell: alle Einträge als Liste für Excel',
        toc: 'PowerShell',
        blocks: [
          { type: 'p', text: 'Eine vollständige Liste, die sich in Excel filtern lässt, liefert ein kurzes PowerShell-Skript. Ein Beispiel für Windows PowerShell 5.1, das für jeden Unterordner von D:\\Daten jeden Eintrag als Zeile in eine CSV-Datei schreibt:' },
          { type: 'p', text: '`Get-ChildItem -LiteralPath D:\\Daten -Directory -Recurse | ForEach-Object { $p = $_.FullName; (Get-Acl -LiteralPath $p).Access | Select-Object @{Name="Pfad";Expression={$p}}, IdentityReference, FileSystemRights, AccessControlType, IsInherited } | Export-Csv D:\\Bericht\\rechte.csv -NoTypeInformation -Encoding UTF8 -UseCulture`' },
          { type: 'p', text: '`-Encoding UTF8` erhält Umlaute in Pfaden und Namen – Windows PowerShell 5.1 schreibt sonst ASCII –, `-UseCulture` trennt die Spalten mit dem Listentrennzeichen der Ländereinstellung. In Excel filtern Sie dann IdentityReference nach den breiten Gruppen und FileSystemRights nach Werten wie FullControl, Modify oder Write. Einträge, die mit S-1-5-21-… statt mit einem Namen dastehen, sind Kandidaten für verwaiste SIDs; IsInherited trennt eigene von geerbten Einträgen. Den Startordner selbst prüfen Sie mit `(Get-Acl -LiteralPath D:\\Daten).Access`.' },
          { type: 'p', text: 'Unterbrochene Vererbung zeigt die Eigenschaft AreAccessRulesProtected: Sie ist True, wenn ein Ordner keine Rechte vom übergeordneten Ordner übernimmt. Alle solchen Ordner listet `Get-ChildItem -LiteralPath D:\\Daten -Directory -Recurse | Where-Object { (Get-Acl -LiteralPath $_.FullName).AreAccessRulesProtected } | Select-Object FullName`. Die Berechtigungen einer Freigabe liest `Get-SmbShareAccess -Name Daten -CimSession FS01` – in der Regel mit Administratorrechten auf dem Server.' },
          { type: 'p', text: 'Wo Skripte enden: `Get-Acl` liefert Einträge, keine effektiven Rechte. Windows prüft die Einträge der Reihe nach, bis eine Verweigerung oder eine ausreichende Erlaubnis greift; wer über verschachtelte Gruppen dazugehört, was Verweigern-Einträge wegnehmen und wie Freigabe- und NTFS-Recht zusammenspielen, rechnet das Skript nicht aus. Ordner, die das prüfende Konto nicht lesen darf, landen als Fehlermeldung in der Konsole statt als Zeile in der Liste. Pfade mit mehr als 260 Zeichen verarbeiten Programme nur, wenn sie dafür eingerichtet sind. Und jeder Lauf beginnt von vorn: Den Vergleich mit dem letzten Mal und einen Nachweis zum Abzeichnen bauen Sie selbst.' },
        ],
      },
      {
        id: 'freigabe',
        title: 'Freigabe und NTFS: „Jeder: Vollzugriff“ auf der Freigabe',
        toc: 'Freigabe und NTFS',
        blocks: [
          { type: 'p', text: 'Auf einem Fileserver gelten zwei unabhängige Sätze von Berechtigungen: die der Freigabe und die NTFS-Berechtigungen der Ordner. Über das Netz gilt jeweils das strengere von beiden. Wer lokal oder per Remotedesktop auf dem Server arbeitet, für den zählen nur die NTFS-Rechte.' },
          { type: 'p', text: '„Jeder: Vollzugriff“ auf der Freigabe ist deshalb nicht automatisch ein Fehler. Microsoft beschreibt diesen Weg ausdrücklich: Manche Administratoren setzen die Freigabe grundsätzlich auf Vollzugriff für „Jeder“ und regeln den Zugriff allein über NTFS. Dann müssen aber die NTFS-Rechte stimmen – „Jeder“ mit Schreibrecht in NTFS ist der eigentliche Befund. Umgekehrt kann eine strenge Freigabe großzügige NTFS-Rechte einschränken: Wer nur NTFS prüft, sieht dann mehr Zugriff, als über das Netz möglich ist.' },
        ],
      },
      {
        id: 'aufraeumen',
        title: 'Aufräumen: erst sichern, dann gezielt ändern',
        toc: 'Aufräumen',
        blocks: [
          { type: 'p', text: 'Finden ist das eine, ändern das andere – eine Änderung kann Zugriff nehmen, der noch gebraucht wird. Ein vorsichtiger Ablauf:' },
          {
            type: 'list',
            items: [
              'Sichern: `icacls D:\\Daten\\* /save D:\\Sicherung\\acl-daten.txt /t /c` speichert die Zugriffslisten aller Dateien und Ordner unter D:\\Daten – ohne den Ordner D:\\Daten selbst. `icacls D:\\Daten\\ /restore D:\\Sicherung\\acl-daten.txt` schreibt sie zurück – und überschreibt dabei auch spätere Änderungen.',
              'Klären: Ist die SID wirklich verwaist – oder eine Funktions-SID, ein Konto aus einer anderen Domäne, ein migriertes Konto? Berechtigungen in den Systemordnern von Windows lassen Sie unangetastet.',
              'Am Ursprung ändern: Geerbte Einträge kommen von einem übergeordneten Ordner und werden dort entfernt, wo sie ausdrücklich gesetzt sind – im Explorer oder mit `icacls D:\\Daten\\Projekt /remove *S-1-5-21-…-1107`, das alle Einträge dieser SID aus der Zugriffsliste des Ordners entfernt.',
              'Breite Gruppen ersetzen: Statt „Jeder“ oder „Domänen-Benutzer“ eine Gruppe berechtigen, die genau die zuständigen Personen enthält.',
              'Kontrollieren: Danach erneut prüfen und mit dem Stand von vorher vergleichen.',
            ],
          },
          { type: 'p', text: 'Wichtig: `/remove`, `/restore` und Änderungen im Explorer wirken sofort. Probieren Sie Befehle, die Rechte ändern, zuerst in einer Testumgebung oder an einer Kopie aus, und ändern Sie produktive Freigaben nur mit Sicherung und in einem abgesprochenen Zeitfenster. Ein Berechtigungsbericht wie [Zutritt](/produkte/zutritt/) ändert selbst nichts – er liefert die Befunde vorher und den Vergleich danach.' },
        ],
      },
      {
        id: 'zutritt',
        title: 'Zutritt: verwaiste SIDs und breite Gruppen im Berechtigungsbericht',
        toc: 'Zutritt',
        blocks: [
          { type: 'p', text: 'Zutritt ist unser Berechtigungsbericht für Windows-Dateifreigaben. Zutritt liest die Freigabe- und NTFS-Berechtigungen einer Freigabe, eines ganzen Servers oder lokaler Ordner, löst Gruppen bis zur einzelnen Person auf und rechnet die effektiven Rechte wie Windows – mit der gespeicherten Reihenfolge der Einträge, Verweigern-Einträgen, Vererbung und Freigabe und NTFS zusammen. 15 Prüfregeln melden, was in diesem Ratgeber gesucht wird, jeweils mit Erklärung und Empfehlung:' },
          {
            type: 'items',
            items: [
              { title: 'Verwaiste SID (ZT04)', text: 'Einträge, Besitzer und Freigabeberechtigungen, deren Konto es nicht mehr gibt – aber nur, wenn die zuständige Kontendatenbank erreichbar war und die SID nicht kennt. Sonst steht dort „Unbekannt“. Funktions-SIDs, App-Pakete, Dienst-SIDs und Anmeldesitzungen gelten nie als verwaist.' },
              { title: 'Breite Gruppe darf schreiben oder lesen (ZT01, ZT02)', text: '„Jeder“, „Authentifizierte Benutzer“, „Domänen-Benutzer“ und ähnliche Gruppen mit Schreibrecht (Hoch) oder Leserecht (Mittel) – gemeldet an dem Ordner, an dem der Eintrag gesetzt ist, mit dem Recht, das nach Verweigern-Einträgen übrig bleibt.' },
              { title: 'Versteckte Ausnahmen und verschobene Ordner (ZT06, ZT14)', text: 'Vererbung tief im Baum unterbrochen – ab Ebene 3 unter dem geprüften Ziel, einstellbar – und Ordner, die beim Verschieben ihre alten geerbten Rechte mitgenommen haben.' },
              { title: 'Personen, deaktivierte Konten, Vollzugriff (ZT03, ZT12, ZT05)', text: 'Rechte direkt an einer Person statt an einer Gruppe, eigene Rechte deaktivierter Konten und Vollzugriff für Konten und Gruppen ohne Administratorrolle.' },
              { title: '„Wer darf hier rein?“ und Freigabe für alle (ZT08)', text: '„Wer darf hier rein?“ zeigt pro Ordner jede Person mit ihrem effektiven Recht über Freigabe und NTFS. „Jeder“ oder „Authentifizierte Benutzer“ mit mindestens Ändern auf der Freigabe meldet Zutritt nur als Hinweis (Info).' },
              { title: 'Excel, PDF und Vergleich', text: 'Filterbare Excel-Arbeitsmappe mit jedem Eintrag, PDF mit Block zum Abzeichnen und der Vergleich mit dem letzten Lauf: neue und erledigte Befunde und wer jetzt mehr oder weniger darf. Was nicht lesbar war, steht als Befund im Bericht, statt still zu fehlen.' },
            ],
          },
          { type: 'p', text: 'Zutritt liest nur: Es ändert keine Berechtigungen, Dateien oder Konten und braucht keinen Server, keinen Agenten und keinen Dienst. Im Zweifel zeigt Zutritt eher zu viel Zugriff als zu wenig. Für geplante Läufe gibt es eine Befehlszeile mit Exitcodes.' },
          { type: 'p', text: 'Ehrlich gesagt: Zutritt ist eine Vorabversion ({version}) und noch nicht signiert – SmartScreen kann warnen. Zutritt läuft unter Windows 10 ab Version 1809 und Windows 11 (x64). Active Directory löst es nur für die Domäne des prüfenden PCs auf; Gruppen aus vertrauten Domänen werden genannt, aber nicht aufgelöst, und die Auflösung ist bisher nur gegen ein simuliertes Verzeichnis getestet, noch nicht in einer echten Domäne. Freigabeberechtigungen liest Zutritt nur mit Administratorrechten auf dem Server, sonst rechnet es mit NTFS allein. Zutritt überwacht nicht dauerhaft, sondern läuft bei Bedarf oder als geplante Aufgabe. Zutritt ist {lizenz}.{download}' },
          { type: 'product', text: 'Freigabe- und NTFS-Rechte bis zur Person, 15 Prüfregeln von der verwaisten SID bis „Jeder darf schreiben“, Excel und PDF zum Abzeichnen – nur lesend, für Windows 10 und 11.', compare: { label: 'Vergleich mit anderen Berechtigungsberichten', href: '/produkte/zutritt/#alternative' } },
        ],
      },
      {
        id: 'vergleich',
        title: 'Die Wege im Vergleich',
        toc: 'Vergleich',
        blocks: [
          {
            type: 'table',
            caption: 'Wege, verwaiste SIDs und Rechte breiter Gruppen zu finden, im Vergleich',
            head: ['Weg', 'Umfang', 'Verwaiste SIDs', 'Breite Gruppen mit Schreibrecht', 'Freigabe und NTFS', 'Ergebnis', 'Vergleich mit dem letzten Stand'],
            rows: [
              ['Explorer: Sicherheit und „Effektiver Zugriff“', 'ein Ordner, eine Person', 'zu sehen als SID ohne Namen', 'im einzelnen Ordner ablesen', 'getrennt eingestellt: Sicherheit und Erweiterte Freigabe', 'Anzeige am Bildschirm', 'nein'],
              ['`icacls`', 'ganzer Baum mit `/t`', 'nur eine bekannte SID, mit `/findsid`', '`/findsid` zeigt, wo die Gruppe steht, nicht ihr Recht', 'nur NTFS', 'Textausgabe; `/save` sichert die Listen', 'von Hand'],
              ['PowerShell-Skript (`Get-Acl`, `Get-SmbShareAccess`)', 'ganzer Baum, Skript selbst pflegen', 'als SID statt Name, in Excel filterbar', 'in Excel filtern; Gruppen und Verweigern-Einträge nicht ausgewertet', 'beide lesbar, zusammenführen von Hand', 'CSV für Excel', 'von Hand'],
              ['Berechtigungsbericht, z. B. Zutritt', 'je nach Werkzeug; Zutritt: Freigabe, Server oder lokale Ordner', 'Zutritt: ZT04, nur wenn die Kontendatenbank erreichbar war', 'Zutritt: ZT01, Recht nach Abzug der Verweigern-Einträge', 'Zutritt: effektives Recht, das strengere von beiden', 'Zutritt: Excel und PDF zum Abzeichnen', 'Zutritt: ja, mit dem letzten Lauf'],
            ],
            key: 3,
            note: 'Über das Netz gilt jeweils das strengere von Freigabe- und NTFS-Recht. „Von Hand“ heißt: möglich, aber mit eigener Arbeit, etwa zwei Exporte vergleichen. Zutritt löst Active Directory nur für die Domäne des prüfenden PCs auf und ist dabei bisher nur gegen ein simuliertes Verzeichnis getestet.',
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
              { title: 'Ein einzelner Ordner, eine Frage', text: 'Der Explorer: Sicherheit, „Erweitert“ und „Effektiver Zugriff“.' },
              { title: 'Wo steht überall „Jeder“ oder eine bestimmte SID?', text: '`icacls … /findsid … /t /c` über den ganzen Baum – danach das Recht im einzelnen Ordner prüfen.' },
              { title: 'Alle Einträge als Liste zum Filtern', text: 'Ein PowerShell-Skript mit `Get-Acl` und `Export-Csv` – oder ein Berechtigungsbericht, der die Liste fertig liefert.' },
              { title: 'Regelmäßige Berechtigungsprüfung mit Nachweis', text: 'Ein Berechtigungsbericht mit effektiven Rechten, Vergleich mit dem letzten Lauf und PDF zum Abzeichnen, zum Beispiel Zutritt.' },
              { title: 'Die SID beginnt mit S-1-15-3', text: 'Eine Funktions-SID von Windows: nicht entfernen.' },
              { title: 'Aufräumen', text: 'Erst `icacls … /save`, dann jeden Befund klären und am Ursprung ändern – ein Bericht ändert selbst nichts.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Was bedeutet „Konto unbekannt“ in den NTFS-Berechtigungen?', a: 'Windows konnte der SID dieses Eintrags keinen Namen zuordnen und zeigt deshalb statt eines Namens die SID. Dahinter kann ein gelöschtes Konto stecken – aber auch ein Konto aus einer anderen Domäne, deren Domänencontroller gerade nicht erreichbar ist, oder eine Funktions-SID von Windows (beginnt mit S-1-15-3), die absichtlich keinen Namen hat und nicht gelöscht werden darf.' },
      { q: 'Wie finde ich alle Ordner, auf die „Jeder“ schreiben darf?', a: 'Mit Bordmitteln in zwei Schritten: `icacls D:\\Daten\\* /findsid *S-1-1-0 /t /c` zeigt, wo „Jeder“ eingetragen ist; welches Recht dort gilt, zeigt die Liste des Ordners oder ein PowerShell-Export, den Sie in Excel nach FullControl, Modify und Write filtern. Prüfen Sie dasselbe für „Authentifizierte Benutzer“ (S-1-5-11) und „Domänen-Benutzer“. Zutritt meldet Schreibrechte breiter Gruppen direkt als Befund ZT01 – mit dem Recht, das nach Verweigern-Einträgen bleibt, an dem Ordner, an dem der Eintrag gesetzt ist; Zutritt ist derzeit eine Vorabversion ({version}).{download}' },
      { q: 'Kann ich verwaiste SIDs einfach löschen?', a: 'Nicht blind. Prüfen Sie zuerst, ob die SID wirklich zu einem gelöschten Konto gehört: Funktions-SIDs (S-1-15-3-…) dürfen nicht entfernt werden, Konten aus vertrauten Domänen erscheinen ohne Namen, wenn deren Domänencontroller nicht erreichbar ist, und nach einer Migration können alte SIDs über den SID-Verlauf noch Zugriff geben. Sichern Sie vorher die Zugriffslisten mit `icacls … /save` und entfernen Sie Einträge dort, wo sie ausdrücklich gesetzt sind. Zutritt, derzeit eine Vorabversion ({version}), meldet eine SID nur dann als verwaist (ZT04), wenn die zuständige Kontendatenbank erreichbar war und die SID nicht kennt – sonst steht dort „Unbekannt“. Die Prüfung gegen Active Directory ist bisher nur mit einem simulierten Verzeichnis getestet.' },
      { q: 'Ist „Jeder: Vollzugriff“ auf der Freigabe ein Sicherheitsproblem?', a: 'Nicht für sich allein. Über das Netz gilt das strengere von Freigabe- und NTFS-Recht, und Microsoft beschreibt es als möglichen Weg, die Freigabe für „Jeder“ auf Vollzugriff zu setzen und den Zugriff allein über NTFS zu regeln. Entscheidend ist dann, dass die NTFS-Rechte stimmen – vor allem, dass „Jeder“ und andere breite Gruppen dort nicht schreiben dürfen.' },
      { q: 'Wie finde ich Ordner mit unterbrochener Vererbung?', a: 'In PowerShell über die Eigenschaft AreAccessRulesProtected von `Get-Acl`, zum Beispiel mit `Get-ChildItem -LiteralPath D:\\Daten -Directory -Recurse | Where-Object { (Get-Acl -LiteralPath $_.FullName).AreAccessRulesProtected } | Select-Object FullName`. Nicht jede Unterbrechung ist ein Fehler – wichtig sind die tief im Baum, die man von oben nicht sieht. Zutritt, derzeit eine Vorabversion ({version}), meldet sie als ZT06 (ab Ebene 3 unter dem geprüften Ziel, einstellbar) und Ordner, die beim Verschieben alte Rechte mitgenommen haben, als ZT14.' },
      { q: 'Welche SIDs haben „Jeder“, „Authentifizierte Benutzer“ und „Domänen-Benutzer“?', a: '„Jeder“ ist S-1-1-0, „Authentifizierte Benutzer“ S-1-5-11 – auf jedem Windows gleich. „Domänen-Benutzer“ setzt sich aus der SID der Domäne und der Endung 513 zusammen (S-1-5-21-…-513), „VORDEFINIERT\\Benutzer“ ist S-1-5-32-545. In `icacls` schreiben Sie eine SID mit vorangestelltem Stern, etwa `*S-1-1-0`.' },
    ],
    trademarks: 'Microsoft, Windows, Windows Server, Active Directory, Excel, PowerShell und SmartScreen sind Marken der Microsoft-Unternehmensgruppe. Sie werden nur genannt, um Funktionen und Kompatibilität zu beschreiben.',
  },
  en: {
    slug: 'find-orphaned-sids-everyone-permissions',
    title: 'Find orphaned SIDs and Everyone permissions on a file server',
    description: 'Find orphaned SIDs, Everyone with write access and broken inheritance on Windows file servers – with Explorer, icacls, PowerShell or a report.',
    h1: 'Find orphaned SIDs and Everyone permissions on Windows file servers',
    short: 'Orphaned SIDs and Everyone permissions',
    teaser: 'Account Unknown, Everyone can write, inheritance broken: how to find risky permissions on a file server – with built-in tools or a report.',
    lead: 'An orphaned SID is an entry in NTFS permissions whose account no longer exists: Windows finds no name for it and shows Account Unknown with the bare SID, such as S-1-5-21-…-1107. A single folder can be checked in Explorer; across a whole file server, `icacls /findsid` searches for a known SID such as Everyone (S-1-1-0), and a short PowerShell script built on `Get-Acl` exports every entry for Excel. Don’t delete anything blindly – accounts whose domain controller cannot be reached and Windows capability SIDs show up without a name as well.',
    sections: [
      {
        id: 'basics',
        title: 'What this is about: orphaned SIDs, broad groups, hidden exceptions',
        toc: 'The basics',
        blocks: [
          { type: 'p', text: 'Windows does not store names in the access lists of folders but security identifiers (SIDs). Every account and group gets its own SID when it is created, and Windows never issues the same SID again – not even to a new account with the same name. When an account is deleted, its entries remain in the NTFS permissions. Windows can no longer find a name for them and shows Account Unknown followed by the SID, for example S-1-5-21-…-1107: an orphaned SID. Not every SID without a name is orphaned, though – see [Not every SID without a name is orphaned](#not-orphaned).' },
          { type: 'p', text: 'Broad groups are groups that contain practically everyone. Their SIDs are fixed or end in a fixed number:' },
          {
            type: 'list',
            items: [
              'Everyone: S-1-1-0 – all users',
              'Authenticated Users: S-1-5-11 – all authenticated users and computers, including those from trusted domains',
              'Domain Users: S-1-5-21-…-513 – every user account in the domain; new accounts are added automatically',
              'BUILTIN\\Users: S-1-5-32-545 – after installation it contains just Authenticated Users',
            ],
          },
          { type: 'p', text: 'If one of these groups can write or modify, or has full control, practically every signed-in person can create, change or delete files there – and so can any malware running under their account. Two more patterns make a review hard: inheritance broken deep in the folder tree – such exceptions are invisible from above – and rights given directly to individual people instead of groups. Microsoft recommends granting access through groups, so that a move to another department only changes a group membership.' },
          { type: 'p', text: 'Typical occasions: a file server that has grown over the years is to be cleaned up or migrated, or an access review is due – internally or ahead of an audit, for example under ISO/IEC 27001.' },
        ],
      },
      {
        id: 'not-orphaned',
        title: 'Not every SID without a name is orphaned',
        toc: 'Not every SID is orphaned',
        blocks: [
          { type: 'p', text: 'Unknown at first only means that Windows has not found a name for this SID right now. There are reasons for that where the account still exists, or is not a user account at all:' },
          {
            type: 'items',
            items: [
              { title: 'Capability SIDs (S-1-15-3-…)', text: 'Since Windows 8 and Windows Server 2012, capabilities let Windows components and apps access resources, and each capability has its own SID. By design these SIDs have no friendly name. Microsoft explicitly advises against deleting them from file system or registry permissions: features may no longer work correctly, and they cannot be added back through the user interface. Known ones are listed under `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\SecurityManager\\CapabilityClasses\\AllCachedCapabilities`.' },
              { title: 'Domain controller not reachable', text: 'If a network time-out prevents the name lookup, the SID also appears without a name – although the account exists.' },
              { title: 'Accounts from other domains', text: 'SIDs that the own domain does not recognise are looked up in trusted domains. If the trust is broken or the other domain cannot be reached, no name comes back.' },
              { title: 'Migrated accounts', text: 'An account that moves to another domain gets a new SID; the old one can be kept in the account’s SID history and then still grants access. Windows can look up such old SIDs in every domain of the forest and then shows the migrated account’s name; if the responsible domain cannot be reached, no name comes back. So before deleting a SID from a former domain, check whether a migrated account still carries it – otherwise you take rights away from it.' },
              { title: 'Logon sessions', text: 'SIDs of a logon session (S-1-5-5-…) never have an account name.' },
            ],
          },
          { type: 'p', text: 'Genuinely orphaned SIDs usually grant nobody access any more, because Windows never reuses a SID. They are still a finding: nobody can tell any longer whom the right was once given to. Deleting entries that only look orphaned is the bigger risk. A first clue is the domain part – everything before the last number of a SID such as S-1-5-21-…-1107. Signed in with a domain account, `whoami /user` shows your own SID: if its domain part matches that of the unknown entry, the entry comes from your domain.' },
        ],
      },
      {
        id: 'explorer',
        title: 'In Explorer: Security and Effective Access',
        toc: 'Explorer',
        blocks: [
          { type: 'p', text: 'For a single folder, the built-in tools are enough. Properties › Security shows the NTFS permissions, and Advanced lists the entries one by one. The Effective Access tab works out what a selected person or group may do with this folder; rights granted to Everyone and Authenticated Users are included. Orphaned SIDs appear there as a SID without a name – whether such a SID really is orphaned is covered in [Not every SID without a name is orphaned](#not-orphaned).' },
          { type: 'p', text: 'The limits: Explorer shows one folder – and, for effective access, one person – at a time. Share permissions sit separately under Sharing › Advanced Sharing. There is no list across the whole folder tree, no export and no comparison with the last check. Fine for spot checks, not for a file server with thousands of folders.' },
        ],
      },
      {
        id: 'icacls',
        title: 'icacls: search a whole folder tree for a SID',
        toc: 'icacls',
        blocks: [
          { type: 'p', text: '`icacls` displays and changes access lists from the command prompt; `icacls D:\\Data\\Project` shows the list of a single folder. To search a whole tree there is `/findsid`, which finds every file and folder whose access list explicitly mentions the given SID. A SID in numeric form needs a leading `*`:' },
          {
            type: 'list',
            items: [
              '`icacls D:\\Data\\* /findsid *S-1-1-0 /t /c` – every file and folder under D:\\Data whose access list contains Everyone',
              '`icacls D:\\Data\\* /findsid *S-1-5-11 /t /c` – the same for Authenticated Users',
              '`icacls D:\\Data\\* /findsid *S-1-5-21-…-1107 /t /c` – where a particular orphaned SID is still listed',
              '`icacls D:\\Data\\* /verify /t /c` – access lists that are not canonical',
            ],
          },
          { type: 'p', text: '`/t` includes all subfolders, and `/c` carries on after errors such as access denied while still showing them. Canonical means explicit denies before explicit allows, followed by the inherited entries – in a different order, Windows may grant something other than the entries seem to promise.' },
          { type: 'p', text: 'The limits: `/findsid` tells you where a SID appears, not which right it has there; whether Everyone can only read or also write is shown by the list of that one folder. `icacls` cannot search for orphaned SIDs in general, only for a SID you already know. It knows nothing about group memberships or share permissions, and on large shares the search can take a long time.' },
        ],
      },
      {
        id: 'powershell',
        title: 'PowerShell: every entry as a list for Excel',
        toc: 'PowerShell',
        blocks: [
          { type: 'p', text: 'A short PowerShell script produces a complete list you can filter in Excel. An example for Windows PowerShell 5.1 that writes every entry of every subfolder of D:\\Data as a row in a CSV file:' },
          { type: 'p', text: '`Get-ChildItem -LiteralPath D:\\Data -Directory -Recurse | ForEach-Object { $p = $_.FullName; (Get-Acl -LiteralPath $p).Access | Select-Object @{Name="Path";Expression={$p}}, IdentityReference, FileSystemRights, AccessControlType, IsInherited } | Export-Csv D:\\Reports\\permissions.csv -NoTypeInformation -Encoding UTF8 -UseCulture`' },
          { type: 'p', text: '`-Encoding UTF8` keeps accented characters in paths and names intact – Windows PowerShell 5.1 otherwise writes ASCII – and `-UseCulture` separates the columns with the list separator of the regional settings. In Excel, filter IdentityReference for the broad groups and FileSystemRights for values such as FullControl, Modify or Write. Entries that show S-1-5-21-… instead of a name are candidates for orphaned SIDs; IsInherited separates explicit entries from inherited ones. Check the starting folder itself with `(Get-Acl -LiteralPath D:\\Data).Access`.' },
          { type: 'p', text: 'Broken inheritance shows up in the AreAccessRulesProtected property: it is True when a folder does not take over rights from its parent. This lists all such folders: `Get-ChildItem -LiteralPath D:\\Data -Directory -Recurse | Where-Object { (Get-Acl -LiteralPath $_.FullName).AreAccessRulesProtected } | Select-Object FullName`. The permissions of a share are read by `Get-SmbShareAccess -Name Data -CimSession FS01` – usually with administrator rights on the server.' },
          { type: 'p', text: 'Where scripts stop: `Get-Acl` returns entries, not effective permissions. Windows checks the entries in order until a deny or a sufficient allow applies; who belongs through nested groups, what deny entries take away and how share and NTFS permissions combine is not worked out by the script. Folders the scanning account cannot read end up as error messages in the console rather than as rows in the list. Paths longer than 260 characters only work in programs prepared for them. And every run starts from scratch: the comparison with last time and evidence to sign off are up to you.' },
        ],
      },
      {
        id: 'share-and-ntfs',
        title: 'Share and NTFS permissions: Everyone with Full Control on the share',
        toc: 'Share and NTFS',
        blocks: [
          { type: 'p', text: 'A file server has two independent sets of permissions: those of the share and the NTFS permissions of the folders. Over the network, the more restrictive of the two applies. For anyone working on the server locally or through Remote Desktop, only the NTFS permissions count.' },
          { type: 'p', text: 'Everyone with Full Control on the share is therefore not a mistake in itself. Microsoft describes this approach explicitly: some administrators always set the share to Full Control for Everyone and control access through NTFS alone. Then, however, the NTFS permissions have to be right – Everyone with write access in NTFS is the real finding. Conversely, a strict share can limit generous NTFS permissions: if you only check NTFS, you see more access than is possible over the network.' },
        ],
      },
      {
        id: 'clean-up',
        title: 'Cleaning up: back up first, then change with care',
        toc: 'Cleaning up',
        blocks: [
          { type: 'p', text: 'Finding is one thing, changing another – a change can take away access that is still needed. A careful sequence:' },
          {
            type: 'list',
            items: [
              'Back up: `icacls D:\\Data\\* /save D:\\Backup\\acl-data.txt /t /c` saves the access lists of all files and folders under D:\\Data – not the folder D:\\Data itself. `icacls D:\\Data\\ /restore D:\\Backup\\acl-data.txt` writes them back – overwriting any later changes as well.',
              'Clarify: is the SID really orphaned – or a capability SID, an account from another domain, a migrated account? Leave the permissions of Windows system folders alone.',
              'Change at the source: inherited entries come from a parent folder and are removed where they are set explicitly – in Explorer, or with `icacls D:\\Data\\Project /remove *S-1-5-21-…-1107`, which removes all entries for this SID from the folder’s access list.',
              'Replace broad groups: instead of Everyone or Domain Users, grant access to a group that contains exactly the people responsible.',
              'Check: review again afterwards and compare with the state before.',
            ],
          },
          { type: 'p', text: 'Important: `/remove`, `/restore` and changes in Explorer take effect immediately. Try commands that change permissions in a test environment or on a copy first, and change production shares only with a backup and in an agreed time window. A permissions report such as [Zutritt](/en/products/zutritt/) changes nothing itself – it provides the findings beforehand and the comparison afterwards.' },
        ],
      },
      {
        id: 'zutritt',
        title: 'Zutritt: orphaned SIDs and broad groups in a permissions report',
        toc: 'Zutritt',
        blocks: [
          { type: 'p', text: 'Zutritt is our permissions report for Windows file shares. It reads the share and NTFS permissions of a share, a whole server or local folders, resolves groups down to individual people and computes effective permissions like Windows – with the stored order of the entries, deny entries, inheritance, and share and NTFS combined. 15 rules report what this guide is looking for, each with an explanation and a recommendation:' },
          {
            type: 'items',
            items: [
              { title: 'Orphaned SID (ZT04)', text: 'Entries, owners and share permissions whose account no longer exists – but only when the responsible account database was reachable and does not know the SID. Otherwise the result is Unknown. Capability SIDs, app packages, service SIDs and logon sessions are never treated as orphaned.' },
              { title: 'Broad group can write or read (ZT01, ZT02)', text: 'Everyone, Authenticated Users, Domain Users and similar groups with write access (high) or read access (medium) – reported on the folder where the entry is set, with the right that remains after deny entries.' },
              { title: 'Hidden exceptions and moved folders (ZT06, ZT14)', text: 'Inheritance broken deep in the tree – from level 3 below the scanned target, adjustable – and folders that carried their old inherited rights along when they were moved.' },
              { title: 'People, disabled accounts, full control (ZT03, ZT12, ZT05)', text: 'Rights given directly to a person instead of a group, rights of disabled accounts and full control for accounts and groups without an administrator role.' },
              { title: 'Who can get in here, and shares open to everyone (ZT08)', text: 'The folder view “who can get in here” shows every person with their effective right over share and NTFS. Everyone or Authenticated Users with at least Change on the share is reported as information only.' },
              { title: 'Excel, PDF and comparison', text: 'A filterable Excel workbook with every entry, a PDF with a sign-off block and the comparison with the last run: new and resolved findings, and who can now access more or less. Anything that could not be read appears as a finding in the report instead of silently missing.' },
            ],
          },
          { type: 'p', text: 'Zutritt only reads: it changes no permissions, files or accounts and needs no server, agent or service. When in doubt, it shows more access rather than less. A command line with exit codes serves scheduled runs.' },
          { type: 'p', text: 'Honestly: Zutritt is a pre-release ({version}) and not code-signed yet – SmartScreen may warn. It runs on Windows 10 version 1809 or later and Windows 11 (x64). It resolves Active Directory only for the scanning PC’s own domain; groups from trusted domains are named but not expanded, and the resolution has so far been tested against a simulated directory only, not yet in a real domain. Share permissions can only be read with administrator rights on the server; otherwise Zutritt works from NTFS alone. Zutritt does not monitor continuously but runs on demand or as a scheduled task. Zutritt is {lizenz}.{download}' },
          { type: 'product', text: 'Share and NTFS permissions down to each person, 15 rules from orphaned SIDs to Everyone can write, Excel and PDF to sign off – read-only, for Windows 10 and 11.', compare: { label: 'Comparison with other permission reports', href: '/en/products/zutritt/#alternative-to' } },
        ],
      },
      {
        id: 'comparison',
        title: 'The options compared',
        toc: 'Comparison',
        blocks: [
          {
            type: 'table',
            caption: 'Ways to find orphaned SIDs and permissions of broad groups compared',
            head: ['Option', 'Scope', 'Orphaned SIDs', 'Broad groups with write access', 'Share and NTFS', 'Result', 'Comparison with last time'],
            rows: [
              ['Explorer: Security and Effective Access', 'one folder, one person', 'visible as a SID without a name', 'read off folder by folder', 'set separately: Security and Advanced Sharing', 'on screen', 'no'],
              ['`icacls`', 'whole tree with `/t`', 'only a known SID, with `/findsid`', '`/findsid` shows where the group is listed, not its right', 'NTFS only', 'text output; `/save` backs up the lists', 'by hand'],
              ['PowerShell script (`Get-Acl`, `Get-SmbShareAccess`)', 'whole tree, script maintained by you', 'as a SID instead of a name, filterable in Excel', 'filter in Excel; groups and deny entries not evaluated', 'both readable, combined by hand', 'CSV for Excel', 'by hand'],
              ['Permissions report, e.g. Zutritt', 'depends on the tool; Zutritt: share, server or local folders', 'Zutritt: ZT04, only if the account database was reachable', 'Zutritt: ZT01, net of deny entries', 'Zutritt: effective right, the stricter of both', 'Zutritt: Excel and a PDF to sign off', 'Zutritt: yes, with the last run'],
            ],
            key: 3,
            note: 'Over the network, the more restrictive of share and NTFS permission applies. “By hand” means possible, but with your own effort, such as comparing two exports. Zutritt resolves Active Directory only for the scanning PC’s own domain and has so far been tested against a simulated directory only.',
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
              { title: 'One folder, one question', text: 'Explorer: Security, Advanced and Effective Access.' },
              { title: 'Where is Everyone – or a particular SID – listed?', text: '`icacls … /findsid … /t /c` across the whole tree, then check the right in the individual folder.' },
              { title: 'Every entry as a list to filter', text: 'A PowerShell script with `Get-Acl` and `Export-Csv` – or a permissions report that delivers the list ready-made.' },
              { title: 'A recurring access review with evidence', text: 'A permissions report with effective permissions, a comparison with the last run and a PDF to sign off, such as Zutritt.' },
              { title: 'The SID starts with S-1-15-3', text: 'A Windows capability SID: do not remove it.' },
              { title: 'Cleaning up', text: 'First `icacls … /save`, then clarify each finding and change it at the source – a report changes nothing itself.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'What does Account Unknown mean in NTFS permissions?', a: 'Windows could not map the SID of this entry to a name and therefore shows the SID instead of a name. It may belong to a deleted account – but it can also be an account from another domain whose domain controller cannot be reached at the moment, or a Windows capability SID (starting with S-1-15-3), which has no name by design and must not be deleted.' },
      { q: 'How do I find every folder that Everyone can write to?', a: 'With built-in tools, in two steps: `icacls D:\\Data\\* /findsid *S-1-1-0 /t /c` shows where Everyone is listed; the right it has there is shown by the folder’s own list or by a PowerShell export that you filter in Excel for FullControl, Modify and Write. Do the same for Authenticated Users (S-1-5-11) and Domain Users. Zutritt reports write access for broad groups directly as finding ZT01 – net of deny entries, on the folder where the entry is set; Zutritt is currently a pre-release ({version}).{download}' },
      { q: 'Can I just delete orphaned SIDs?', a: 'Not blindly. First check that the SID really belongs to a deleted account: capability SIDs (S-1-15-3-…) must not be removed, accounts from trusted domains appear without a name when their domain controller cannot be reached, and after a migration old SIDs can still grant access through SID history. Back up the access lists with `icacls … /save` beforehand and remove entries where they are set explicitly. Zutritt, currently a pre-release ({version}), only reports a SID as orphaned (ZT04) when the responsible account database was reachable and does not know it – otherwise the result is Unknown. Active Directory lookups have so far been tested against a simulated directory only.' },
      { q: 'Is Everyone with Full Control on a share a security problem?', a: 'Not in itself. Over the network, the more restrictive of share and NTFS permission applies, and Microsoft describes setting the share to Full Control for Everyone and controlling access through NTFS alone as one way of working. What matters then is that the NTFS permissions are right – above all, that Everyone and other broad groups cannot write there.' },
      { q: 'How do I find folders with broken inheritance?', a: 'In PowerShell through the AreAccessRulesProtected property of `Get-Acl`, for example with `Get-ChildItem -LiteralPath D:\\Data -Directory -Recurse | Where-Object { (Get-Acl -LiteralPath $_.FullName).AreAccessRulesProtected } | Select-Object FullName`. Not every break is a mistake – what matters are the ones deep in the tree that cannot be seen from above. Zutritt, currently a pre-release ({version}), reports them as ZT06 (from level 3 below the scanned target, adjustable) and folders that carried old rights along when moved as ZT14.' },
      { q: 'What are the SIDs of Everyone, Authenticated Users and Domain Users?', a: 'Everyone is S-1-1-0 and Authenticated Users S-1-5-11 – the same on every Windows system. Domain Users consists of the domain’s SID followed by 513 (S-1-5-21-…-513), and BUILTIN\\Users is S-1-5-32-545. In `icacls`, put an asterisk in front of a numeric SID, for example `*S-1-1-0`.' },
    ],
    trademarks: 'Microsoft, Windows, Windows Server, Active Directory, Excel, PowerShell and SmartScreen are trademarks of the Microsoft group of companies. They are named only to describe features and compatibility.',
  },
};

export default guide;
