// Ratgeber „Windows-Härtung offline prüfen, ohne Agent“ – wie man die Windows-Härtung von Anlagen-, Labor- und
// Leitstandsrechnern nachweist, auf denen nichts installiert werden darf; das eigene Produkt ist Riegel.
// Ausrichtung (docs/sichtbarkeit.md 3.4, Recherche 2026-10-21): „Windows Härtung OT, Leitstand / harden HMI“ (DE hoch,
// EN mittel), „Härtung offline prüfen ohne Agent / check security baseline offline, air-gapped“ (mittel), „IEC 62443
// Windows-Härtung Checkliste“ (mittel, nur „unterstützt Nachweise“), „Windows Härtung prüfen“ (DE mittel).
// Quellen (abgerufen 2026-10-22):
// - secedit: Microsoft Learn „secedit export“ (learn.microsoft.com/en-us/windows-server/administration/windows-commands/
//   secedit-export): Syntax „secedit /export [/db <database file name>] [/mergedpolicy] /cfg <configuration file name> …“;
//   /mergedpolicy: „Merges and exports domain and local policy security settings.“; /areas: securitypolicy mit „account
//   policies, audit policies, security options“, user_rights. „secedit commands“ (…/windows-commands/secedit): „If there is no
//   filepath specified, all filenames will default to the current directory.“
// - auditpol: Microsoft Learn „auditpol get“ (…/windows-commands/auditpol-get): /category:* – „all audit categories should be
//   queried“; /r: „Displays the output in report format, comma-separated value (CSV).“; Rechte: „you must have Read
//   permission for that object set in the security descriptor“ oder „Manage auditing and security log (SeSecurityPrivilege)“.
// - Microsoft Learn „Manage auditing and security log“ (learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/
//   security/threat-protection/security-policy-settings/manage-auditing-and-security-log): „By default this setting is
//   Administrators on domain controllers and on stand-alone servers.“ (auch Clients: Administrators); Gruppenrichtlinie
//   „which will overwrite settings on the local computer at the next Group Policy update“.
// - Administratorrechte für secedit und auditpol: außerdem Riegel docs/collector.md („secedit and auditpol need administrator
//   rights“, auf CI-Rechnern gemessen).
// - reg query: Microsoft Learn „reg query“ (…/windows-commands/reg-query): Syntax mit /v und /reg:64 („Specifies the key
//   should be accessed using the 64-bit registry view.“), Rückgabewerte nur „0 Success“ und „1 Failure“; „If the registry key
//   name contains a space, enclose the key name in quotes.“
// - 32-Bit-Ansicht: Microsoft Learn „Registry Redirector“ (learn.microsoft.com/en-us/windows/win32/winprog64/
//   registry-redirector): „HKEY_LOCAL_MACHINE\Software is redirected to HKEY_LOCAL_MACHINE\Software\Wow6432Node“;
//   „File System Redirector“ (…/winprog64/file-system-redirector): Zugriffe 32-Bit-Programme auf System32 – „the access is
//   redirected to an architecture-specific path“ (SysWOW64), also startet ein 32-Bit-Programm die 32-Bit-Befehle.
// - LAN-Manager-Authentifizierung: Microsoft Learn „Network security: LAN Manager authentication level“ (…/security-policy-
//   settings/network-security-lan-manager-authentication-level): Registry
//   „HKLM\System\CurrentControlSet\Control\Lsa\LmCompatibilityLevel“; Standardwerte je Rolle verschieden („Client Computer
//   Effective Default Settings: Not defined“, Stand-alone-Server „Send NTLMv2 response only“); „Modifying this setting may
//   affect compatibility with client devices, services, and applications.“; „Client devices that don't support NTLMv2
//   authentication can't authenticate in the domain“ (bei der strengeren Einstellung).
// - gpresult: Microsoft Learn „gpresult“ (…/windows-commands/gpresult): „/r Displays RSoP summary data.“, /scope computer,
//   /h = HTML-Bericht; Gruppenrichtlinie wirkt „based on their membership in sites, domains, or organizational units“.
// - Automatische Anmeldung: Microsoft Learn „Configure Windows to automate logon“ (learn.microsoft.com/en-us/troubleshoot/
//   windows-server/user-profiles-and-logon/turn-on-automatic-logon): „the password is stored in the registry in plain text“;
//   empfohlen „only for cases in which the computer is physically secured“ und Registry nicht aus der Ferne lesbar.
// - MDM: Microsoft Learn „Mobile Device Management overview“ (learn.microsoft.com/en-us/windows/client-management/
//   mdm-overview): Verwaltungsclient „periodically synchronizes with the management server“; Compliance-Richtlinien als Beispiel:
//   Microsoft Learn „Device compliance policies“ (learn.microsoft.com/en-us/intune/device-security/compliance/overview):
//   „rules and conditions … to evaluate the configuration of your managed devices“ – auf der Seite ohne Produktnamen.
// - EU-GMP Annex 11 (EudraLex Vol. 4, in Kraft seit 30.06.2011; health.ec.europa.eu/system/files/2016-11/
//   annex11_01-2011_en_0.pdf): § 10 „Any changes … including system configurations should only be made in a controlled
//   manner“; § 11 „periodically evaluated to confirm that they remain in a valid state“.
// - NIST SP 800-82r3 „Guide to Operational Technology (OT) Security“ (09/2023, nvlpubs.nist.gov/nistpubs/SpecialPublications/
//   NIST.SP.800-82r3.pdf): „Comparing OT and IT System Security“ – „third-party security solutions are not allowed due to OT
//   vendor licensing“, „support can be lost if third-party applications are installed without vendor … approval“, Updates
//   „need to be thoroughly tested by both the vendor and the end user“, „schedule OT outages days or weeks in advance“, „The
//   OT may also require revalidation“, „many OT utilize older versions of OSs that are no longer supported“; „OT Cybersecurity
//   Program Content“ – „The lifespan of an OT system can exceed 20 years.“, „compensating controls should be considered“;
//   6.2.4.2 – „document the approved baseline configuration for their OT devices“, „document, test, and approve changes
//   before deploying them to the OT environment“; 6.3.2 – Lösungen mit aktivem Scan oder lokalen Ressourcen „should be tested
//   before deployment into the OT system“; 6.3.2.3 – Virenschutz: „Follow vendor recommendations“, auf einer Ersatz-HMI testen;
//   E.2.3 – „Active scans may cause device instability or interfere with the device process state“, „scheduled to occur
//   during planned OT outages whenever possible“.
// - ENISA „Technical Implementation Guidance“ zur Durchführungsverordnung (EU) 2024/2690 (06/2025, enisa.europa.eu/sites/
//   default/files/2025-06/ENISA_Technical_implementation_guidance_on_cybersecurity_risk_management_measures_version_1.0.pdf),
//   gilt für digitale Dienste (DNS, Cloud, Rechenzentren, Managed Services …); 6.3: „Documented and approved exceptions to the
//   configuration baseline containing the alternative measures in place“ (Beispiel für Nachweise).
// - Riegel: ict-baden/riegel origin/main d37a157 (Tag v0.1.2, 2026-10-21): README.md (Hinweis „The MSI is not the way onto OT
//   or validated machines“; „And also“: ~130 KB, Windows 7 SP1 bis 11 und Server 2008 R2 bis 2025, .NET Framework 3.5.1 oder
//   4.x, `--minimal`; Regelwerk 2026.10.1 mit 153 Regeln, „no CIS and no BSI SiSyPHuS content“; „For audits“: „supports
//   evidence“, „no compliance claim“, nicht MFA, Datensicherung, Vorfälle, Segmentierung; „Limits, honestly“: nicht signiert,
//   nur per Hash freigebbar, kein Kundenpilot auf OT- oder validierten Rechnern vor der Signierung, „Not checkable“ ohne
//   Administratorrechte, mit `--minimal` oder über Bordmittel), docs/collector.md (installiert nichts, ändert keine
//   Konfiguration, keine Netzwerkverbindung, Windows vermerkt, dass ein Programm lief; `collect-builtin.cmd`; Datenschleuse;
//   „Do not install .NET on a validated machine just for Riegel“; Übergabeblatt), docs/collector-change-request.md
//   (Änderungsantrag: jeder gelesene Eintrag, jedes gestartete Programm, Spuren), docs/installation.md (MSI nur für
//   Auswerte-PCs, Bordmittel nur `secedit`, `auditpol`, `reg`), docs/exceptions.md (Begründung, akzeptierter Wert, Rolle,
//   Nachweis, Ablauf, an den Inhalt gebunden; abweichender Wert → Befund wieder offen), docs/remediation.md („Riegel never
//   applies anything“), docs/frameworks.md, docs/limitations.md, CHANGELOG.md (0.1.0 vom 2026-10-19, 0.1.2 vom 2026-10-21,
//   Sammler 0.1.0); src/data/produktseiten/haertungs-check.ts. Version und Status aus products.json ({version}).
//   Teststand wie in der Korrektur der Produktseite vom 2026-10-22: Testdaten und CI-Rechner, nicht auf echten Altsystemen,
//   nicht in einer echten Domäne.
// Nicht behaupten (wie auf der Produktseite): BSI- oder CIS-Prüfung, „erfüllt NIS2/IEC 62443“ (nur „unterstützt Nachweise“),
// signiert, auf echten Altsystemen oder auf einem Windows-11-Arbeitsplatz getestet; „Härtung“ nie ohne „Windows“, „IT“ oder
// „OT“; die MSI ist nicht für OT-Rechner, dort nur der Sammler. Keine Fremdprodukte und keine weiteren Werkzeuge nennen – der
// Vergleich mit benannten Prüfwerkzeugen steht auf der Produktseite (#alternative bzw. #alternative-to). Bewusst weggelassen:
// konkrete Sollwerte (nur Fragen je Bereich), Befehle, die etwas setzen, und Einzelanforderungen der IEC 62443 (Normtext
// nicht frei verfügbar).
import type { Guide } from '../../lib/ratgeber';

const guide: Guide = {
  id: 'windows-haertung-offline-pruefen',
  product: 'haertungs-check',
  published: '2026-10-22',
  de: {
    slug: 'windows-haertung-offline-pruefen',
    title: 'Windows-Härtung offline prüfen, ohne Agent: OT und Leitstand',
    description: 'Wie Sie die Windows-Härtung von HMI-, Labor- und Leitstandsrechnern ohne Agent und ohne Installation prüfen: Bordmittel, zentrale Wege, portabler Sammler.',
    h1: 'Windows-Härtung auf Anlagen-, Labor- und Leitstandsrechnern prüfen – offline und ohne Agent',
    short: 'Windows-Härtung offline prüfen',
    teaser: 'Bordmittel, zentrale Werkzeuge oder portabler Sammler: wie Sie die Windows-Härtung von Anlagen-PCs prüfen, ohne etwas zu installieren – ehrlich verglichen.',
    lead: 'Auf Anlagen-, Labor- und Leitstandsrechnern, auf denen kein Agent laufen und nichts installiert werden darf, prüfen Sie die Windows-Härtung lesend und offline: Die Windows-Bordmittel `secedit`, `auditpol` und `reg query` zeigen die Sicherheitseinstellungen ohne Installation, ein portabler Sammler liest sie vom USB-Stick aus, und bewertet wird auf einem anderen PC. Was bewusst offen bleiben muss, halten Sie als begründete, freigegebene Ausnahme fest; Änderungen an der Windows-Konfiguration laufen getrennt davon über das Änderungsverfahren.',
    sections: [
      {
        id: 'warum-kein-agent',
        title: 'Warum Agent, Installation und Netzwerk-Scan auf Anlagen-PCs oft ausscheiden',
        toc: 'Warum kein Agent',
        blocks: [
          { type: 'p', text: 'Bedienrechner (HMI), Engineering-Stationen, Labor- und Leitstandsrechner stehen oft außerhalb der zentralen IT: manche ohne Netz, manche validiert oder vom Anlagenhersteller abgenommen, manche mit Software, die eine unsichere Einstellung braucht. Wer dort die Windows-Härtung nachweisen soll, stößt auf Hürden, die es in der Büro-IT so nicht gibt:' },
          {
            type: 'items',
            items: [
              { title: 'Jede Installation ist eine Änderung', text: 'Ein Prüfprogramm aufzuspielen, verändert das System. Für computergestützte Systeme im GMP-Umfeld sieht EU-GMP Annex 11 vor, dass Änderungen – ausdrücklich auch an der Konfiguration – nur kontrolliert nach einem festgelegten Verfahren erfolgen.' },
              { title: 'Der Anlagenhersteller entscheidet mit', text: 'Der OT-Sicherheitsleitfaden des US-amerikanischen NIST (SP 800-82) weist darauf hin, dass Lizenz- und Serviceverträge der OT-Hersteller Sicherheitslösungen Dritter manchmal ausschließen und der Support entfallen kann, wenn Software Dritter ohne Zustimmung des Herstellers installiert wird.' },
              { title: 'Updates brauchen Tests und Stillstände', text: 'Laut NIST müssen Updates auf OT-Systemen vom Hersteller und vom Betreiber gründlich getestet werden; Stillstände werden Tage oder Wochen im Voraus geplant, manchmal ist eine erneute Validierung nötig. Ein Agent, der sich regelmäßig selbst aktualisiert, passt dazu schlecht.' },
              { title: 'Aktive Netzwerk-Scans können stören', text: 'NIST rät zu äußerster Vorsicht: Aktive Scans können Geräte instabil machen oder in den Prozesszustand eingreifen und sollten möglichst in geplanten Stillständen laufen. Auch Lösungen, die aktiv scannen oder Ressourcen auf dem Rechner selbst nutzen, sollen vor dem Einsatz im OT-System getestet werden.' },
              { title: 'Manche Rechner haben gar kein Netz', text: 'Ein isolierter Messrechner oder eine Bedienstation in einer abgeschotteten Zelle hat keine Verbindung, über die ein Agent melden oder ein Scanner zugreifen könnte.' },
              { title: 'Alte Windows-Versionen bleiben im Einsatz', text: 'Die Lebensdauer eines OT-Systems kann laut NIST über 20 Jahre betragen, und viele OT-Systeme laufen mit Betriebssystemen, für die es keine Updates mehr gibt. Ein Prüfweg muss also auch mit älteren Windows-Versionen zurechtkommen.' },
            ],
          },
          { type: 'p', text: 'Gesucht ist also ein Weg, der nur liest, nichts installiert und ohne Netz auskommt – und dessen Ergebnis als Nachweis taugt.' },
        ],
      },
      {
        id: 'was-pruefen',
        title: 'Checkliste: was eine Prüfung der Windows-Härtung abdecken sollte',
        toc: 'Was prüfen',
        blocks: [
          { type: 'p', text: 'Wer für einen Audit – etwa im Rahmen von IEC 62443, NIS2 oder GMP – die Windows-Härtung belegen muss, braucht zuerst eine Liste dessen, was geprüft wird. Die Sollwerte hängen von Windows-Version, Rolle und Anlagensoftware ab; Microsoft nennt etwa für die LAN-Manager-Authentifizierung je nach Rolle unterschiedliche Standardwerte. Diese Bereiche gehören dazu, hier als Fragen formuliert – die Sollwerte legen Sie mit Ihrer Quelle und dem Anlagenhersteller fest:' },
          {
            type: 'items',
            items: [
              { title: 'Konten und Anmeldung', text: 'Wer ist lokaler Administrator, welche Konten sind aktiv, auch das Gastkonto? Gibt es eine automatische Anmeldung – und ist sie begründet? Dabei kann das Kennwort laut Microsoft im Klartext in der Registry stehen.' },
              { title: 'Anmeldedaten und NTLM', text: 'Welche NTLM-Varianten lässt die LAN-Manager-Authentifizierungsebene zu? Ist der LSA-Schutz aktiv?' },
              { title: 'Netzwerk, Freigaben und Dienste', text: 'Ist SMBv1 aktiv, wird SMB-Signierung verlangt? Welche Freigaben gibt es, und welche Dienste laufen, die die Anlage nicht braucht?' },
              { title: 'Remotedesktop', text: 'Ist Remotedesktop eingeschaltet – und wenn ja, nur mit Authentifizierung auf Netzwerkebene und für wen?' },
              { title: 'Firewall', text: 'Ist die Windows-Firewall in allen Profilen aktiv, und welche eingehenden Regeln gibt es?' },
              { title: 'Virenschutz', text: 'Läuft ein Virenschutz, etwa Microsoft Defender Antivirus? Wie alt sind die Signaturen, welche Ausnahmen sind eingetragen? Auf Anlagenrechnern gelten dafür oft Vorgaben des Herstellers.' },
              { title: 'Überwachung und Protokollierung', text: 'Was zeichnet die Überwachungsrichtlinie auf, wie groß ist das Sicherheitsprotokoll, wird PowerShell protokolliert?' },
              { title: 'Wechselmedien und Autostart', text: 'Wie sind USB-Speicher und der Autostart von Wechselmedien eingestellt?' },
              { title: 'Verschlüsselung und TLS', text: 'Ist das Systemlaufwerk verschlüsselt? Welche Versionen von SSL und TLS lässt Windows zu?' },
              { title: 'Updates und Lebenszyklus', text: 'Bekommt die Windows-Version noch Sicherheitsupdates, und wann wurde zuletzt eines installiert?' },
            ],
          },
        ],
      },
      {
        id: 'bordmittel',
        title: 'Mit Windows-Bordmitteln prüfen: secedit, auditpol, reg query',
        toc: 'Bordmittel',
        blocks: [
          { type: 'p', text: 'Windows bringt Befehle mit, die die Sicherheitseinstellungen auslesen, ohne etwas zu installieren. Öffnen Sie die Eingabeaufforderung mit „Als Administrator ausführen“, denn `secedit` und `auditpol` brauchen Administratorrechte. Wechseln Sie vorher in den Zielordner, etwa auf den USB-Stick: Ohne Pfad landen Ausgabedateien im aktuellen Ordner.' },
          {
            type: 'items',
            items: [
              { title: 'Sicherheitsrichtlinie: secedit', text: '`secedit /export /cfg secpol.inf` schreibt die lokale Sicherheitsrichtlinie als Textdatei, unter anderem Kontorichtlinien, Sicherheitsoptionen und Benutzerrechte. Mit `/mergedpolicy` kommen die Einstellungen aus der Domäne dazu.' },
              { title: 'Überwachungsrichtlinie: auditpol', text: '`auditpol /get /category:*` zeigt die Einstellungen der Überwachungsrichtlinie für alle Kategorien und Unterkategorien; mit `/r` kommt das Ergebnis als CSV.' },
              { title: 'Einzelne Werte: reg query', text: '`reg query HKLM\\System\\CurrentControlSet\\Control\\Lsa /v LmCompatibilityLevel` liest die LAN-Manager-Authentifizierungsebene. Fehlt der Wert, steht in der Registry nichts – welches Verhalten dann gilt, muss man in der Microsoft-Dokumentation für Version und Rolle nachlesen. Am Rückgabewert sehen Sie nicht, ob ein Wert fehlt oder nicht lesbar war: `reg query` kennt nur 0 (Erfolg) und 1 (Fehler).' },
              { title: 'Gruppenrichtlinien: gpresult', text: '`gpresult /scope computer /r` zeigt, welche Gruppenrichtlinien für den Rechner gelten; mit `/h` und einem Dateinamen entsteht ein HTML-Bericht. Das hilft vor allem bei Rechnern in einer Domäne.' },
            ],
          },
          { type: 'p', text: 'Zwei Stolperfallen bei `reg query`: Unter HKLM\\SOFTWARE sieht ein 32-Bit-Programm auf 64-Bit-Windows eine eigene Ansicht der Registry (Wow6432Node). Wurde die Eingabeaufforderung aus einem 32-Bit-Programm heraus gestartet, etwa aus einem Fernwartungswerkzeug, kann ein Wert fehlen, der in Wirklichkeit gesetzt ist; `/reg:64` liest die 64-Bit-Ansicht. Und bei automatischer Anmeldung kann im Schlüssel Winlogon das Kennwort im Klartext stehen – fragen Sie dort nur einzelne Werte ab, etwa `reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" /v AutoAdminLogon`, statt den ganzen Schlüssel auszugeben.' },
          { type: 'p', text: 'Wo die Bordmittel enden:' },
          {
            type: 'list',
            items: [
              'Sie liefern Rohwerte, keine Bewertung: Ob ein Wert passt, steht nicht in der Ausgabe.',
              'Die Sollwerte pflegen Sie selbst – je Windows-Version und Rolle, mit Quelle.',
              'Die Auswertung geschieht von Hand, etwa in einer Tabelle; fehlende Werte und Standardwerte muss man richtig deuten.',
              'Eingestellt heißt nicht wirksam: Ob etwa der Virenschutz wirklich läuft, zeigt eine Richtlinie allein nicht.',
              'Ausnahmen und Freigaben verwalten die Befehle nicht, und es entsteht kein Nachweis, wer wann was erhoben und wer das Ergebnis abgezeichnet hat.',
            ],
          },
        ],
      },
      {
        id: 'zentrale-wege',
        title: 'Zentrale Wege: Gruppenrichtlinie, MDM, Agent, Netzwerk-Scan',
        toc: 'Zentrale Wege',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Gruppenrichtlinie', text: 'In einer Windows-Domäne verteilt die Gruppenrichtlinie Einstellungen nach Standort, Domäne und Organisationseinheit und überschreibt lokale Werte beim nächsten Update. Sie setzt Sollwerte, einen Prüfbericht liefert sie nicht – `gpresult` zeigt nur, welche Richtlinien gelten.' },
              { title: 'MDM mit Compliance-Berichten', text: 'Bei einem MDM-Dienst registrierte Rechner gleichen sich regelmäßig mit dem Verwaltungsserver ab und übernehmen dessen Richtlinien; Compliance-Richtlinien können dabei die Konfiguration der Geräte bewerten. Ohne Verbindung zum Verwaltungsserver geht das nicht.' },
              { title: 'Agent', text: 'Ein Agent ist ein Programm, das in der Regel dauerhaft auf jedem Rechner läuft, die Konfiguration erhebt und an einen Server meldet. Für verwaltete Rechner bequem – auf einem Anlagen-PC ist schon die Installation eine Änderung, und jedes Update des Agenten ist die nächste.' },
              { title: 'Netzwerk-Scan mit Anmeldedaten', text: 'Ein Scanner meldet sich über das Netz mit einem Konto an jedem Rechner an und liest die Konfiguration aus. Das braucht Netzzugang, erreichbare Verwaltungsschnittstellen, ein Konto mit Rechten auf jedem Rechner – und im Anlagennetz die Erlaubnis zu scannen.' },
            ],
          },
          { type: 'p', text: 'Für verwaltete Büro-IT sind das die üblichen Wege. Auf Anlagenrechnern ohne Domäne, ohne Netz oder ohne Freigabe für zusätzliche Software passen sie oft nicht – dort bleiben die Bordmittel oder ein portabler Sammler, der lesend erhebt und die Auswertung einem anderen PC überlässt.' },
        ],
      },
      {
        id: 'pruefen-und-setzen',
        title: 'Prüfen und Setzen trennen',
        blocks: [
          { type: 'p', text: 'Prüfskripte und -programme, die die Konfiguration direkt auf dem Rechner mit einer Liste von Sollwerten vergleichen, gibt es von mehreren Herstellern und Projekten; einen sachlichen Vergleich mit bekannten finden Sie [auf der Produktseite von Riegel](/produkte/riegel/#alternative). Manche setzen die Windows-Härtung im selben Durchgang gleich mit – in der Büro-IT spart das Zeit. Auf einem validierten oder abgenommenen Anlagenrechner ist jede Einstellung, die sie setzen, eine Konfigurationsänderung – mit allem, was dazugehört: Änderungsantrag, Abstimmung mit dem Anlagenhersteller, Test und unter Umständen eine erneute Validierung.' },
          { type: 'p', text: 'Dass eine Einstellung zur Windows-Härtung auch etwas kaputt machen kann, schreibt Microsoft selbst: Eine Änderung der LAN-Manager-Authentifizierungsebene könne die Kompatibilität mit Geräten, Diensten und Anwendungen beeinträchtigen, und Geräte, die NTLMv2 nicht beherrschen, können sich bei der strengeren Einstellung nicht mehr in der Domäne anmelden. NIST empfiehlt für OT, Änderungen vor dem Einsatz zu dokumentieren, zu testen und freizugeben. Sinnvoll ist deshalb diese Reihenfolge:' },
          {
            type: 'list',
            items: [
              'Zuerst lesend prüfen und den Ist-Stand festhalten.',
              'Jede Abweichung entscheiden: beheben, als Ausnahme begründen oder für diese Rolle bewusst aus dem Prüfumfang nehmen.',
              'Änderungen als Dateien vorbereiten, mit einer Rücknahme, und mit dem Anlagenhersteller abstimmen.',
              'Auf einem Testsystem oder einer Ersatzstation testen und im Wartungsfenster über das Änderungsverfahren einspielen.',
              'Danach erneut prüfen und den neuen Stand als freigegebenen Stand festhalten.',
            ],
          },
        ],
      },
      {
        id: 'ausnahmen',
        title: 'Ausnahmen begründen, freigeben und mit dem freigegebenen Stand vergleichen',
        toc: 'Ausnahmen und Vergleich',
        blocks: [
          { type: 'p', text: 'Auf Anlagenrechnern wird nicht jede Regel erfüllt – manchmal aus gutem Grund: Die Bedienstation soll nach einem Neustart ohne Anmeldung wieder laufen, eine ältere Software braucht ein altes Protokoll, der Hersteller gibt einen bestimmten Virenschutz nicht frei. Microsoft empfiehlt die automatische Anmeldung zum Beispiel nur, wenn der Rechner physisch gesichert ist und Unbefugte nicht aus der Ferne auf die Registry zugreifen können. Genau solche Bedingungen gehören in eine begründete Ausnahme – statt in eine stille Abweichung, die beim nächsten Audit niemand mehr erklären kann.' },
          { type: 'p', text: 'Eine Ausnahme ist kein Abhaken, sondern eine dokumentierte Entscheidung. Sie nennt:' },
          {
            type: 'list',
            items: [
              'die Regel und die Rechner oder Gruppen, für die sie gilt',
              'die Begründung und den akzeptierten Wert – ändert sich der Wert später, sollte die Ausnahme nicht mehr greifen',
              'die Ersatzmaßnahme, etwa einen abgeschlossenen Schaltschrank oder ein abgeschottetes Netz',
              'wer sie freigegeben hat, mit Verweis auf den Änderungs- oder QMS-Vorgang',
              'bis wann sie gilt und wann sie wieder überprüft wird',
            ],
          },
          { type: 'p', text: 'Das deckt sich mit Leitfäden: NIST rät für ältere OT-Systeme, die eine Sicherheitsfunktion nicht unterstützen, zu Ersatzmaßnahmen und empfiehlt, die freigegebene Basiskonfiguration der Geräte zu dokumentieren. Die ENISA nennt in ihrer Umsetzungshilfe zu den NIS2-Pflichten digitaler Dienste wie Rechenzentren und IT-Dienstleister dokumentierte und genehmigte Ausnahmen von der Basiskonfiguration samt Ersatzmaßnahmen als Beispiel für einen Nachweis.' },
          { type: 'p', text: 'Ebenso wichtig ist der Vergleich mit dem freigegebenen Stand: Halten Sie nach der Inbetriebnahme oder einer Abnahme fest, wie der Rechner konfiguriert war, und vergleichen Sie spätere Prüfungen damit – etwa nach einem Servicebesuch des Herstellers. So fällt auf, was sich verändert hat, auch wenn es niemand gemeldet hat. Für computergestützte Systeme im GMP-Umfeld sieht EU-GMP Annex 11 ohnehin eine periodische Bewertung vor, ob sie noch in einem validierten Zustand sind.' },
        ],
      },
      {
        id: 'riegel',
        title: 'Riegel: portabler Sammler, Auswertung offline',
        toc: 'Riegel',
        blocks: [
          { type: 'p', text: 'Riegel ist unser Härtungs-Check für Windows-Rechner in Anlagen, Laboren und Leitständen. Riegel trennt Erhebung und Auswertung: Ein portabler Sammler von rund 130 KB läuft vom USB-Stick auf dem Anlagen-PC, installiert nichts, ändert keine Konfiguration, öffnet keine Netzwerkverbindung und schreibt nur seinen Export; Windows selbst vermerkt lediglich, dass ein Programm lief. Ausgewertet wird auf einem Auswerte-PC – dorthin gehören auch die MSI und die Auswerte-App (ab Windows 10 1809 oder Windows Server 2019), nicht auf den Anlagenrechner.' },
          {
            type: 'items',
            items: [
              { title: 'Für Anlagen-PCs ausgelegt', text: 'Der Sammler ist für Windows 7 SP1 bis 11 und Windows Server 2008 R2 bis 2025 gebaut und braucht .NET Framework 3.5.1 oder 4.x. Wo kein fremdes Programm laufen darf, nutzt `collect-builtin.cmd` nur Windows-Bordmittel wie `secedit`, `auditpol` und `reg`; `--minimal` startet auf empfindlichen HMIs kein weiteres Programm.' },
              { title: '153 Regeln, ehrlich bewertet', text: 'Konten, Anmeldedaten und NTLM, Defender, Firewall, Protokollierung und PowerShell, RDP, Wechselmedien, TLS und mehr. Erfüllt heißt positiv belegt; was nicht lesbar war, heißt „nicht prüfbar“, nie stillschweigend erfüllt.' },
              { title: 'Begründete Ausnahmen mit Freigabe', text: 'Begründung, akzeptierter Wert, freigebende Rolle und ein Nachweis aus dem Änderungs- oder QMS-Verfahren – an den Inhalt gebunden, mit Ablaufdatum und Verlauf. Weicht der Wert später ab, ist der Befund wieder offen.' },
              { title: 'Vergleich mit dem freigegebenen Stand', text: 'Was hat sich seit Inbetriebnahme oder Herstellerbesuch geändert? Verschlechterungen zuerst, dann Abweichungen der Rohwerte.' },
              { title: 'Bericht zum Abzeichnen', text: 'Anlagenbericht als PDF, dazu Excel, CSV und ein Nachweispaket, das Prüfer mit `verify` nachrechnen – auch unter Linux.' },
              { title: 'Abhilfe nur als Dateien', text: '.reg-Dateien mit Rücknahme, GptTmpl.inf und audit.csv für den Anlagenbauer; Riegel wendet sie nie selbst an.' },
            ],
          },
          { type: 'p', text: 'Für den Änderungsantrag beschreibt die Dokumentation, welche Einträge der Sammler liest, welche Programme er startet und welche Spuren Windows vermerkt. Das Regelwerk stützt sich auf ACSC, Microsoft-Dokumentation und DISA STIGs; es enthält keine Inhalte von CIS und keine aus BSI SiSyPHuS. Riegel unterstützt Nachweise, macht aber keine Compliance-Aussage.' },
          { type: 'p', text: 'Ehrlich gesagt: Riegel ist eine Vorabversion ({version}) und noch nicht signiert – Windows kann beim Starten der Programme warnen, und der Sammler lässt sich nur über seinen Hash freigeben. Ein Kundenpilot auf OT- oder validierten Rechnern ist deshalb erst vorgesehen, wenn der Sammler signiert ist. Getestet ist Riegel mit Testdaten und auf CI-Rechnern, noch nicht auf echten Rechnern mit Windows 7, 8.1, Server 2008 R2 oder 2012 R2 und nicht in einer echten Domäne. Ohne Administratorrechte, mit `--minimal` oder über die Bordmittel bleiben viele Regeln unentscheidbar; der Bericht sagt dann „Unvollständige Prüfung“. Riegel ist {lizenz}.{download}' },
          { type: 'product', text: 'Windows-Härtung lesend und offline prüfen: portabler Sammler ohne Installation, 153 Regeln, begründete Ausnahmen und Bericht zum Abzeichnen – für Windows 7 SP1 bis 11 und Windows Server 2008 R2 bis 2025.', compare: { label: 'Vergleich mit anderen Prüfwerkzeugen', href: '/produkte/riegel/#alternative' } },
        ],
      },
      {
        id: 'vergleich',
        title: 'Die Wege im Vergleich',
        toc: 'Vergleich',
        blocks: [
          {
            type: 'table',
            caption: 'Wege, die Windows-Härtung von Anlagen-PCs zu prüfen, im Vergleich',
            head: ['Weg', 'Auf dem Anlagen-PC', 'Netz nötig', 'Bewertung gegen Sollwerte', 'Begründete Ausnahmen', 'Passt vor allem für'],
            rows: [
              ['Bordmittel von Hand (`secedit`, `auditpol`, `reg query`)', 'nur Windows-Befehle, als Administrator', 'nein', 'von Hand, Sollwerte selbst pflegen', 'eigene Liste', 'einzelne Werte, Stichproben'],
              ['Gruppenrichtlinie oder MDM', 'nichts zusätzlich; Rechner in der Domäne oder beim MDM-Dienst registriert', 'ja', 'setzt Sollwerte; Prüfberichte je nach Lösung', 'je nach Lösung', 'verwaltete Büro-IT'],
              ['Agent', 'Installation, läuft dauerhaft', 'in der Regel ja', 'je nach Produkt', 'je nach Produkt', 'verwaltete Rechner mit Netz'],
              ['Netzwerk-Scan mit Anmeldedaten', 'keine Installation, Anmeldung über das Netz', 'ja', 'je nach Produkt', 'je nach Produkt', 'Netze, in denen Scans erlaubt sind'],
              ['Portabler Sammler, Auswertung offline, z. B. Riegel', 'Sammler vom USB-Stick, installiert nichts', 'nein', 'ja; Riegel: 153 Regeln und eigene Vorgaben', 'Riegel: mit Freigabe, Nachweis und Ablaufdatum', 'Rechner ohne Netz oder ohne Freigabe für zusätzliche Software'],
            ],
            key: 4,
            note: '„Je nach Produkt“ und „je nach Lösung“: Funktionen unterscheiden sich von Werkzeug zu Werkzeug. Riegel ist eine Vorabversion ({version}) und noch nicht signiert; ein Kundenpilot auf OT- oder validierten Rechnern ist erst mit signiertem Sammler vorgesehen.',
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
              { title: 'Einzelne Werte nachsehen, etwa nach einer Störung oder vor einem Audit', text: 'Die Bordmittel: `reg query` für einzelne Registry-Werte, `auditpol /get` für die Überwachungsrichtlinie, `secedit /export` für die Sicherheitsrichtlinie.' },
              { title: 'Büro-IT in einer Domäne oder im MDM', text: 'Die zentrale Verwaltung mit ihren Berichten, dazu je nach Bedarf Agent oder Netzwerk-Scan.' },
              { title: 'Anlagen-PC ohne Netz oder ohne Freigabe für zusätzliche Software', text: 'Ein portabler Sammler, der nichts installiert, und die Auswertung auf einem anderen PC – oder, wo gar kein fremdes Programm laufen darf, die Bordmittel. Riegel bietet beides, ist aber noch eine Vorabversion ohne Signatur.' },
              { title: 'Validierter Rechner im GMP-Umfeld', text: 'Lesend prüfen, Abweichungen als begründete Ausnahmen mit Freigabe festhalten, Änderungen nur über das Änderungsverfahren – und bei der periodischen Bewertung mit dem freigegebenen Stand vergleichen.' },
              { title: 'Die Anlagensoftware braucht eine unsichere Einstellung', text: 'Eine begründete Ausnahme mit Ersatzmaßnahme, Freigabe und Ablaufdatum statt einer stillen Abweichung.' },
              { title: 'Maschinenbauer vor der Auslieferung', text: 'Den Auslieferungszustand prüfen und die begründeten Abweichungen der eigenen Software mitliefern; Riegel hat dafür die Berichtsvorlage „Auslieferungszustand“ und läuft auch in der Werksabnahme (FAT).' },
              { title: 'Die Windows-Härtung soll umgesetzt werden', text: 'Getrennt vom Prüfen: Änderungen als Dateien vorbereiten, mit dem Anlagenhersteller abstimmen, testen, im Wartungsfenster einspielen und danach erneut prüfen.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'Wie prüfe ich die Windows-Härtung eines Anlagen-PCs, ohne etwas zu installieren?', a: 'Mit Bordmitteln oder mit einem portablen Sammler. `secedit /export`, `auditpol /get` und `reg query` lesen Sicherheitsrichtlinie, Überwachungsrichtlinie und einzelne Registry-Werte aus – die Rohwerte bewerten Sie selbst. Ein portabler Sammler wie der von Riegel liest die Konfiguration vom USB-Stick aus, installiert nichts und ändert keine Konfiguration; ausgewertet wird auf einem anderen PC. Riegel ist derzeit eine Vorabversion ({version}) und noch nicht signiert.{download}' },
      { q: 'Geht das auch auf Rechnern ohne Netzwerk?', a: 'Ja. Die Bordmittel laufen lokal; Agenten, zentrale Richtlinien und Netzwerk-Scans brauchen dagegen eine Verbindung. Der Sammler von Riegel öffnet keine Netzwerkverbindung: Er läuft vom USB-Stick, und die Erhebung kommt auf demselben Weg oder über eine Datenschleuse zum Auswerte-PC. Riegel ist derzeit eine Vorabversion ({version}).' },
      { q: 'Was tun, wenn die Anlagensoftware eine unsichere Einstellung braucht?', a: 'Als begründete Ausnahme festhalten statt still hinnehmen: welche Regel, welcher Wert akzeptiert ist, warum, welche Ersatzmaßnahme greift, wer freigegeben hat – mit Verweis auf den Änderungs- oder QMS-Vorgang – und bis wann. Riegel führt solche Ausnahmen mit Freigabe und Ablaufdatum; die Freigabe ist an den Inhalt gebunden, und ändert sich der Wert später, ist der Befund wieder offen.' },
      { q: 'Läuft das auch auf Windows 7 oder Server 2008 R2?', a: 'Der Sammler von Riegel (Vorabversion {version}) ist für Windows 7 SP1 bis 11 und Windows Server 2008 R2 bis 2025 ausgelegt und braucht .NET Framework 3.5.1 oder 4.x; auf echten Rechnern mit Windows 7 oder 2008 R2 ist er noch nicht getestet. Ohne .NET bleibt die Bordmittel-Variante `collect-builtin.cmd` – .NET nur für die Prüfung nachzuinstallieren wäre auf einem validierten Rechner selbst eine Änderung.' },
      { q: 'Kann ich die Windows-Härtung nicht gleich per Skript setzen?', a: 'Auf einem validierten oder abgenommenen Rechner ist jede Einstellung, die ein Skript setzt, eine Konfigurationsänderung – sie gehört ins Änderungsverfahren, abgestimmt mit dem Anlagenhersteller und vorher getestet. Microsoft warnt etwa, dass eine Änderung der LAN-Manager-Authentifizierungsebene die Kompatibilität mit Geräten, Diensten und Anwendungen beeinträchtigen kann. Prüfen Sie deshalb zuerst lesend und ändern Sie danach gezielt; Riegel setzt nie selbst etwas und liefert Abhilfe nur als Dateien.' },
      { q: 'Reicht das als Nachweis für IEC 62443 oder NIS2?', a: 'Ein Prüfbericht mit Soll- und Ist-Werten, begründeten Ausnahmen und Unterschrift unterstützt Nachweise für das Konfigurationsmanagement; eine Konformitätsaussage ist er nicht. Riegel unterstützt Nachweise unter anderem für IEC 62443 und NIS2, macht aber keine Compliance-Aussage und deckt nur die Konfiguration ab – nicht MFA, Datensicherung, Vorfallbehandlung oder Netzsegmentierung. Ob der Nachweis genügt, entscheidet Ihr Prüfverfahren.' },
    ],
    trademarks: 'Microsoft, Windows, Windows Server, PowerShell, Defender und Excel sind Marken der Microsoft-Unternehmensgruppe, Linux ist eine eingetragene Marke von Linus Torvalds. Sie werden nur genannt, um Funktionen und Kompatibilität zu beschreiben. CIS (Center for Internet Security) und das BSI werden nur genannt, um zu sagen, dass Riegel keine Inhalte von ihnen enthält. Genannte Normen, Leitfäden und Rahmenwerke werden nur beschrieben; Riegel ist von deren Herausgebern weder geprüft noch zertifiziert.',
  },
  en: {
    slug: 'check-windows-hardening-offline',
    title: 'Check Windows hardening offline: air-gapped OT and HMI PCs',
    description: 'Check Windows hardening on air-gapped HMIs, lab and control-room PCs without an agent: built-in commands, central tools and a portable collector compared.',
    h1: 'Check Windows hardening offline – without an agent, on plant, lab and control-room PCs',
    short: 'Check Windows hardening offline',
    teaser: 'Built-in commands, central tools or a portable collector: how to check Windows hardening on plant PCs without installing anything – compared honestly.',
    lead: 'On plant, lab and control-room PCs where no agent may run and nothing may be installed, check Windows hardening read-only and offline: Windows’ built-in `secedit`, `auditpol` and `reg query` show the security settings without installing anything, a portable collector reads them from a USB stick, and the evaluation runs on another PC. Whatever has to stay open is recorded as a justified, approved exception; changes to the Windows configuration go through change control separately.',
    sections: [
      {
        id: 'why-no-agent',
        title: 'Why agents, installations and network scans often don’t work on plant PCs',
        toc: 'Why no agent',
        blocks: [
          { type: 'p', text: 'HMIs, engineering workstations, lab and control-room PCs often sit outside central IT: some without a network, some validated or accepted by the plant vendor, some running software that needs an insecure setting. Anyone who has to show how well Windows is hardened there runs into hurdles that office IT does not have:' },
          {
            type: 'items',
            items: [
              { title: 'Every installation is a change', text: 'Installing a checking tool changes the system. For computerised systems in GMP environments, EU GMP Annex 11 states that changes – explicitly including system configurations – should only be made in a controlled manner, following a defined procedure.' },
              { title: 'The plant vendor has a say', text: 'NIST’s guide to OT security (SP 800-82) points out that OT vendor licensing and service agreements sometimes rule out third-party security solutions, and that support can be lost if third-party applications are installed without the vendor’s approval.' },
              { title: 'Updates need testing and downtime', text: 'According to NIST, updates on OT systems need thorough testing by both the vendor and the end user; outages are planned days or weeks ahead, and revalidation may be needed. An agent that updates itself regularly is a poor fit.' },
              { title: 'Active network scans can disrupt', text: 'NIST advises extreme caution: active scans may cause device instability or interfere with the process state and should run during planned outages where possible. Solutions that scan actively or use resources on the machine itself should be tested before they are deployed in the OT system.' },
              { title: 'Some machines have no network at all', text: 'An isolated measurement PC or an HMI in a sealed-off cell has no connection through which an agent could report or a scanner could reach it.' },
              { title: 'Old Windows versions stay in service', text: 'According to NIST, the lifespan of an OT system can exceed 20 years, and many OT systems run operating systems that no longer receive patches. A way of checking has to cope with older Windows versions too.' },
            ],
          },
          { type: 'p', text: 'What is needed is a way that only reads, installs nothing and works without a network – and produces a result that stands up as evidence.' },
        ],
      },
      {
        id: 'what-to-check',
        title: 'Windows hardening checklist: what a check should cover',
        toc: 'What to check',
        blocks: [
          { type: 'p', text: 'If you have to show Windows hardening for an audit – under IEC 62443, NIS2 or GMP, for example – you first need a list of what is checked. Expected values depend on the Windows version, the role and the plant software; Microsoft, for instance, lists different defaults for the LAN Manager authentication level depending on the role. These areas belong in the check, phrased here as questions – set the expected values with your source and the plant vendor:' },
          {
            type: 'items',
            items: [
              { title: 'Accounts and sign-in', text: 'Who is a local administrator, which accounts are enabled, including Guest? Is automatic logon configured – and is it justified? According to Microsoft, the password can then be stored in the registry in plain text.' },
              { title: 'Credentials and NTLM', text: 'Which NTLM variants does the LAN Manager authentication level allow? Is LSA protection on?' },
              { title: 'Network, shares and services', text: 'Is SMBv1 enabled, is SMB signing required? Which shares exist, and which services run that the plant does not need?' },
              { title: 'Remote Desktop', text: 'Is Remote Desktop on – and if so, only with Network Level Authentication, and for whom?' },
              { title: 'Firewall', text: 'Is Windows Firewall on in every profile, and which inbound rules exist?' },
              { title: 'Antivirus', text: 'Is antivirus running, such as Microsoft Defender Antivirus? How old are the signatures, which exclusions are set? On plant PCs the vendor often has requirements here.' },
              { title: 'Audit and logging', text: 'What does the audit policy record, how large is the Security log, is PowerShell logged?' },
              { title: 'Removable media and AutoRun', text: 'How are USB storage and AutoRun for removable media configured?' },
              { title: 'Encryption and TLS', text: 'Is the system drive encrypted? Which SSL and TLS versions does Windows allow?' },
              { title: 'Updates and lifecycle', text: 'Does the Windows version still receive security updates, and when was the last one installed?' },
            ],
          },
        ],
      },
      {
        id: 'built-in-commands',
        title: 'Checking with Windows’ built-in commands: secedit, auditpol, reg query',
        toc: 'Built-in commands',
        blocks: [
          { type: 'p', text: 'Windows ships with commands that read the security settings without installing anything. Open the command prompt with “Run as administrator”, because `secedit` and `auditpol` need administrator rights. Change to the target folder first, for example the USB stick: without a path, output files land in the current folder.' },
          {
            type: 'items',
            items: [
              { title: 'Security policy: secedit', text: '`secedit /export /cfg secpol.inf` writes the local security policy to a text file, including account policies, security options and user rights. `/mergedpolicy` adds the settings from the domain.' },
              { title: 'Audit policy: auditpol', text: '`auditpol /get /category:*` shows the audit policy settings for all categories and subcategories; `/r` gives the result as CSV.' },
              { title: 'Single values: reg query', text: '`reg query HKLM\\System\\CurrentControlSet\\Control\\Lsa /v LmCompatibilityLevel` reads the LAN Manager authentication level. If the value is missing, the registry simply holds nothing – which behaviour then applies has to be looked up in Microsoft’s documentation for the version and role. The exit code does not tell you whether a value is missing or could not be read: `reg query` only knows 0 (success) and 1 (failure).' },
              { title: 'Group Policy: gpresult', text: '`gpresult /scope computer /r` shows which Group Policy settings apply to the machine; `/h` with a file name writes an HTML report. This helps mainly on domain-joined machines.' },
            ],
          },
          { type: 'p', text: 'Two pitfalls with `reg query`: under HKLM\\SOFTWARE, a 32-bit program on 64-bit Windows sees its own view of the registry (Wow6432Node). If the command prompt was started from a 32-bit program, such as a remote-support tool, a value that is actually set may appear to be missing; `/reg:64` reads the 64-bit view. And with automatic logon, the Winlogon key may hold the password in plain text – query single values there, for example `reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" /v AutoAdminLogon`, rather than printing the whole key.' },
          { type: 'p', text: 'Where the built-in commands stop:' },
          {
            type: 'list',
            items: [
              'They give raw values, not an assessment: whether a value is right is not in the output.',
              'You maintain the expected values yourself – per Windows version and role, with a source.',
              'The evaluation is manual, for example in a spreadsheet; missing values and defaults need careful interpretation.',
              'Configured is not the same as effective: a policy alone does not show whether antivirus is actually running.',
              'The commands do not manage exceptions or approvals, and they leave no record of who collected what and when, or who signed off the result.',
            ],
          },
        ],
      },
      {
        id: 'central-tools',
        title: 'Central options: Group Policy, MDM, agents, network scans',
        toc: 'Central options',
        blocks: [
          {
            type: 'items',
            items: [
              { title: 'Group Policy', text: 'In a Windows domain, Group Policy distributes settings by site, domain and organisational unit and overwrites local values at the next update. It sets expected values but does not produce a check report – `gpresult` only shows which policies apply.' },
              { title: 'MDM with compliance reports', text: 'Machines enrolled with an MDM service synchronise regularly with the management server and take over its policies; compliance policies can also evaluate the device configuration. Without a connection to the management server, none of this works.' },
              { title: 'Agents', text: 'An agent is a program that usually runs permanently on every machine, collects the configuration and reports to a server. Convenient for managed machines – on a plant PC, installing it is already a change, and every agent update is the next one.' },
              { title: 'Network scans with credentials', text: 'A scanner signs in to every machine over the network with an account and reads the configuration. That needs network access, reachable management interfaces, an account with rights on every machine – and, on a plant network, permission to scan.' },
            ],
          },
          { type: 'p', text: 'For managed office IT, these are the usual options. On plant PCs without a domain, without a network or without approval for additional software they often do not fit – what remains are the built-in commands or a portable collector that reads locally and leaves the evaluation to another PC.' },
        ],
      },
      {
        id: 'check-then-change',
        title: 'Keep checking and changing apart',
        toc: 'Checking vs. changing',
        blocks: [
          { type: 'p', text: 'Checking scripts and programs that compare the configuration on the machine itself with a list of expected values are available from several vendors and projects; a factual comparison with well-known ones is [on the Riegel product page](/en/products/riegel/#alternative-to). Some apply Windows hardening in the same run – which saves time in office IT. On a validated or accepted plant PC, every setting they apply is a configuration change – with everything that comes with it: a change request, agreement with the plant vendor, testing and possibly revalidation.' },
          { type: 'p', text: 'Microsoft itself says that a Windows hardening setting can break things: changing the LAN Manager authentication level may affect compatibility with client devices, services and applications, and at the stricter level, devices that do not support NTLMv2 can no longer authenticate in the domain. For OT, NIST recommends documenting, testing and approving changes before deploying them. A sensible order is therefore:' },
          {
            type: 'list',
            items: [
              'Check read-only first and record the current state.',
              'Decide on every deviation: fix it, justify it as an exception, or deliberately take the rule out of scope for this role.',
              'Prepare changes as files, with a rollback, and agree them with the plant vendor.',
              'Test on a test system or a spare station, then apply them in a maintenance window through change control.',
              'Check again afterwards and record the new state as the approved state.',
            ],
          },
        ],
      },
      {
        id: 'exceptions',
        title: 'Justify and approve exceptions, compare with the approved state',
        toc: 'Exceptions and comparison',
        blocks: [
          { type: 'p', text: 'Not every rule is met on plant PCs – sometimes for good reason: the HMI must come back up without a sign-in after a restart, older software needs an old protocol, the vendor does not approve a particular antivirus product. Microsoft, for example, recommends automatic logon only where the computer is physically secured and untrusted users cannot access the registry remotely. Conditions like these belong in a justified exception – not in a silent deviation that nobody can explain at the next audit.' },
          { type: 'p', text: 'An exception is not a ticked box but a documented decision. It names:' },
          {
            type: 'list',
            items: [
              'the rule and the machines or groups it applies to',
              'the justification and the accepted value – if the value changes later, the exception should no longer apply',
              'the compensating measure, such as a locked control cabinet or an isolated network',
              'who approved it, with a reference to the change or QMS record',
              'how long it is valid and when it will be reviewed',
            ],
          },
          { type: 'p', text: 'This matches published guidance: for legacy OT systems that do not support a security control, NIST recommends compensating controls and advises documenting the approved baseline configuration of OT devices. In its guidance on the NIS2 requirements for digital services such as data centres and managed service providers, ENISA lists documented and approved exceptions to the configuration baseline, with the alternative measures in place, as an example of evidence.' },
          { type: 'p', text: 'Comparing with the approved state matters just as much: record how the machine was configured after commissioning or acceptance, and compare later checks with it – for example after a service visit by the vendor. That shows what has changed, even if nobody reported it. For computerised systems in GMP environments, EU GMP Annex 11 calls for periodic evaluation anyway, to confirm that they remain in a valid state.' },
        ],
      },
      {
        id: 'riegel',
        title: 'Riegel: portable collector, offline evaluation',
        toc: 'Riegel',
        blocks: [
          { type: 'p', text: 'Riegel is our Windows hardening check for machines in plants, labs and control rooms. It separates collection from evaluation: a portable collector of about 130 KB runs from a USB stick on the plant PC, installs nothing, changes no configuration, opens no network connection and writes only its export; Windows itself merely records that a program ran. The evaluation happens on an analysis PC – which is also where the MSI and the analysis app (Windows 10 1809 or Windows Server 2019 and later) belong, not on the plant PC.' },
          {
            type: 'items',
            items: [
              { title: 'Built for plant PCs', text: 'The collector is designed for Windows 7 SP1 to 11 and Windows Server 2008 R2 to 2025 and needs .NET Framework 3.5.1 or 4.x. Where no foreign program may run, `collect-builtin.cmd` uses only Windows’ own commands such as `secedit`, `auditpol` and `reg`; `--minimal` starts no other program on sensitive HMIs.' },
              { title: '153 rules, honest results', text: 'Accounts, credentials and NTLM, Defender, firewall, audit and PowerShell, RDP, removable media, TLS and more. A pass needs positive evidence; what could not be read is “not checkable”, never a silent pass.' },
              { title: 'Justified, approved exceptions', text: 'Justification, accepted value, approving role and a change or QMS record – bound to its content, with expiry and history. If the value changes later, the finding is open again.' },
              { title: 'Comparison with the approved state', text: 'What changed since commissioning or a vendor visit? Changes for the worse first, then raw-value drift.' },
              { title: 'A report to sign', text: 'Plant report as PDF, plus Excel, CSV and an evidence pack that auditors re-check with `verify` – also on Linux.' },
              { title: 'Remediation as files only', text: '.reg files with a rollback, GptTmpl.inf and audit.csv for the plant vendor – never applied by Riegel.' },
            ],
          },
          { type: 'p', text: 'For the change request, the documentation lists which items the collector reads, which programs it starts and which traces Windows records. The catalogue is backed by ACSC, Microsoft documentation and DISA STIGs; it contains no CIS and no BSI SiSyPHuS content. Riegel supports evidence but makes no compliance claim.' },
          { type: 'p', text: 'Honestly: Riegel is a pre-release ({version}) and not code-signed yet – Windows may show a warning when Riegel’s programs are started, and the collector can only be allow-listed by its hash. There will therefore be no customer pilot on OT or validated machines until the collector is signed. Riegel has been tested on fixtures and CI runners, not yet on real Windows 7, 8.1, Server 2008 R2 or 2012 R2 machines, and not in a real domain. Without administrator rights, with `--minimal` or from the built-in commands, many rules cannot be decided; the report then says “Incomplete check”. Riegel is {lizenz}.{download}' },
          { type: 'product', text: 'Check Windows hardening read-only and offline: a portable collector with nothing to install, 153 rules, justified exceptions and a report to sign – for Windows 7 SP1 to 11 and Windows Server 2008 R2 to 2025.', compare: { label: 'Comparison with other checking tools', href: '/en/products/riegel/#alternative-to' } },
        ],
      },
      {
        id: 'comparison',
        title: 'The options compared',
        toc: 'Comparison',
        blocks: [
          {
            type: 'table',
            caption: 'Ways to check Windows hardening on plant PCs compared',
            head: ['Option', 'On the plant PC', 'Network needed', 'Assessment against expected values', 'Justified exceptions', 'Mainly suited to'],
            rows: [
              ['Built-in commands by hand (`secedit`, `auditpol`, `reg query`)', 'Windows commands only, as administrator', 'no', 'by hand, expected values maintained yourself', 'your own list', 'single values, spot checks'],
              ['Group Policy or MDM', 'nothing extra; machine in the domain or enrolled with the MDM service', 'yes', 'sets expected values; check reports depend on the solution', 'depends on the solution', 'managed office IT'],
              ['Agent', 'installation, runs permanently', 'usually yes', 'depends on the product', 'depends on the product', 'managed machines with a network'],
              ['Network scan with credentials', 'no installation, sign-in over the network', 'yes', 'depends on the product', 'depends on the product', 'networks where scans are allowed'],
              ['Portable collector, offline evaluation, e.g. Riegel', 'collector from a USB stick, installs nothing', 'no', 'yes; Riegel: 153 rules plus your own baselines', 'Riegel: with approval, record and expiry date', 'machines without a network or without approval for extra software'],
            ],
            key: 4,
            note: '“Depends on the product” and “depends on the solution”: features differ from tool to tool. Riegel is a pre-release ({version}) and not code-signed yet; there will be no customer pilot on OT or validated machines until the collector is signed.',
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
              { title: 'Looking up single values, for example after a fault or before an audit', text: 'The built-in commands: `reg query` for single registry values, `auditpol /get` for the audit policy, `secedit /export` for the security policy.' },
              { title: 'Office IT in a domain or under MDM', text: 'Central management with its reports, plus an agent or a network scan where needed.' },
              { title: 'Plant PC without a network or without approval for extra software', text: 'A portable collector that installs nothing, with the evaluation on another PC – or, where no foreign program may run at all, the built-in commands. Riegel offers both, but is still an unsigned pre-release.' },
              { title: 'Validated machine in a GMP environment', text: 'Check read-only, record deviations as justified, approved exceptions, change things only through change control – and compare with the approved state at the periodic review.' },
              { title: 'The plant software needs an insecure setting', text: 'A justified exception with a compensating measure, approval and expiry date instead of a silent deviation.' },
              { title: 'Machine builder before delivery', text: 'Check the as-delivered state and ship the justified deviations of your own software with it; Riegel has an “as delivered” report preset for this and also runs in the factory acceptance test (FAT).' },
              { title: 'Windows hardening is to be applied', text: 'Separately from checking: prepare changes as files, agree them with the plant vendor, test them, apply them in a maintenance window and check again afterwards.' },
            ],
          },
        ],
      },
    ],
    faq: [
      { q: 'How do I check Windows hardening on a plant PC without installing anything?', a: 'With built-in commands or a portable collector. `secedit /export`, `auditpol /get` and `reg query` read the security policy, the audit policy and single registry values – assessing the raw values is up to you. A portable collector such as Riegel’s reads the configuration from a USB stick, installs nothing and changes no configuration; the evaluation runs on another PC. Riegel is currently a pre-release ({version}) and not code-signed yet.{download}' },
      { q: 'Does this work on machines without a network?', a: 'Yes. The built-in commands run locally; agents, central policies and network scans, by contrast, need a connection. Riegel’s collector opens no network connection: it runs from a USB stick, and the snapshot travels to the analysis PC the same way or through a transfer station. Riegel is currently a pre-release ({version}).' },
      { q: 'What if the plant software needs an insecure setting?', a: 'Record it as a justified exception instead of accepting it silently: which rule, which value is accepted, why, which compensating measure applies, who approved it – with a reference to the change or QMS record – and until when. Riegel keeps such exceptions with approval and expiry date; the approval is bound to the content, and if the value changes later, the finding is open again.' },
      { q: 'Does this work on Windows 7 or Server 2008 R2?', a: 'Riegel’s collector (pre-release {version}) is designed for Windows 7 SP1 to 11 and Windows Server 2008 R2 to 2025 and needs .NET Framework 3.5.1 or 4.x; it has not been tested on real Windows 7 or 2008 R2 machines yet. Without .NET, the built-in variant `collect-builtin.cmd` remains – installing .NET just for the check would itself be a change on a validated machine.' },
      { q: 'Why not apply Windows hardening straight away with a script?', a: 'On a validated or accepted machine, every setting a script applies is a configuration change – it belongs in change control, agreed with the plant vendor and tested beforehand. Microsoft warns, for example, that changing the LAN Manager authentication level may affect compatibility with client devices, services and applications. So check read-only first and change things deliberately afterwards; Riegel never applies settings itself and delivers remediation as files only.' },
      { q: 'Is this enough as evidence for IEC 62443 or NIS2?', a: 'A check report with expected and actual values, justified exceptions and a signature supports evidence for configuration management; it is not a statement of conformance. Riegel supports evidence for IEC 62443 and NIS2, among others, but makes no compliance claim and covers configuration only – not MFA, backups, incident handling or network segmentation. Whether the evidence is sufficient is up to your audit.' },
    ],
    trademarks: 'Microsoft, Windows, Windows Server, PowerShell, Defender and Excel are trademarks of the Microsoft group of companies, Linux is a registered trademark of Linus Torvalds. They are named only to describe features and compatibility. CIS (Center for Internet Security) and the BSI are named only to say that Riegel contains no content from them. Standards, guidelines and frameworks are only described; Riegel is neither audited nor certified by their publishers.',
  },
};

export default guide;
