// Riegel (Projekt-id haertungs-check) – Härtungs-Check für Windows-Rechner in Anlagen, Laboren und Leitständen.
// Quellen (ict-baden/riegel, Stand Tag v0.1.2 vom 2026-10-21): README.md (Funktionen, „And also“, Quick start,
// Downloads, Regelwerk 2026.10.1 mit 153 Regeln, MITRE ATT&CK und Grundschutz++ als Verweise, „no CIS and no BSI
// SiSyPHuS content“, „For audits“, „Limits, honestly“ inkl. Drittanbieter-Virenschutz/EDR, AppLocker-Erzwingung und
// GPO-Zuordnung experimentell, MIT, keine Daten an ICT-Baden), docs/installation.md (welches Paket wofür,
// Voraussetzungen, kein Netzwerk), docs/baselines.md („Policy Analyzer .PolicyRules files and HardeningKitty lists are
// not imported in 0.1; they are planned for 0.2“, keine Baseline-Inhalte), docs/rule-sources.md, CHANGELOG.md (0.1.0
// vom 2026-10-19, 0.1.1 und 0.1.2 vom 2026-10-21; Sammler unverändert 0.1.0).
// Vergleich (alternatives): über die Fremdprodukte nur, welche Aufgabe sie erfüllen (cisecurity.org: CIS-CAT prüft
// gegen CIS Benchmarks; github.com/scipag/hardeningkitty; Microsoft Learn: Policy Analyzer im Security Compliance
// Toolkit vergleicht GPOs und lokale Richtlinie). Keine Aussagen zu Preis, Lizenz oder Qualität der Fremdprodukte.
// Nicht behaupten: BSI- oder CIS-Prüfung, „erfüllt NIS2/IEC 62443“, signiert, auf echten Altsystemen getestet.
// „Härtung“ nie ohne „Windows“/„IT“/„OT“ (Verwechslung mit Werkstoffprüfung). Markenprüfung „Riegel“ offen.
import type { ProductPage } from '../../lib/produktseiten';

const page: ProductPage = {
  id: 'haertungs-check',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Windows 7 SP1 bis 11 und Windows Server 2008 R2 bis 2025 (Sammler); Windows 10 ab 1809 und Server 2019 (Auswertung); Linux (Befehlszeile)',
  softwareRequirements: 'Sammler: .NET Framework 3.5.1 oder 4.x; Auswerte-App: Windows 10 Version 1809 oder Windows Server 2019 oder neuer',
  uiLanguages: ['de', 'en', 'es', 'fr', 'zh-Hans'],
  download: {
    public: false,
    url: 'https://github.com/ict-baden/riegel/releases/latest',
    source: 'https://github.com/ict-baden/riegel',
  },
  related: ['vitrine', 'freigaben-berechtigungen'],
  alternatives: {
    approved: true,
    names: ['CIS-CAT', 'CIS Benchmarks', 'HardeningKitty', 'Policy Analyzer', 'Microsoft Security Compliance Toolkit'],
    de: {
      title: 'Umstieg von CIS-CAT, HardeningKitty oder Policy Analyzer: Riegel als Alternative',
      blocks: [
        { type: 'p', text: 'Wer die Härtung von Windows-Rechnern bisher mit CIS-CAT gegen die CIS Benchmarks, mit HardeningKitty oder mit dem Policy Analyzer aus dem Microsoft Security Compliance Toolkit prüft, kann mit Riegel dieselbe Aufgabe erledigen: die Sicherheitskonfiguration eines Rechners mit Sollwerten vergleichen. Riegel setzt dabei eigene Schwerpunkte:' },
        {
          type: 'items',
          items: [
            { title: 'Offline und nur lesend', text: 'Ein portabler Sammler (rund 130 KB) installiert nichts, ändert keine Konfiguration und öffnet keine Netzwerkverbindung; ausgewertet wird auf einem anderen PC.' },
            { title: 'Begründete Ausnahmen', text: 'Was bewusst offen bleibt, wird mit Begründung, freigebender Rolle, Nachweis und Ablaufdatum festgehalten.' },
            { title: 'Bericht zum Abzeichnen', text: 'Anlagenbericht als PDF mit Abzeichnung und ein Nachweispaket, das Prüfer mit `verify` nachrechnen.' },
            { title: 'Für Anlagen-PCs', text: 'Ausgelegt für Windows 7 SP1 bis 11 und Server 2008 R2 bis 2025, `--minimal` für empfindliche HMIs, Windows-Bordmittel, Berichtsvorlage „Auslieferungszustand“ für Maschinenbauer.' },
          ],
        },
        { type: 'p', text: 'Wichtig, wenn Sie eine Alternative zu den CIS Benchmarks suchen: Riegel enthält keine Inhalte der CIS Benchmarks und keine aus BSI SiSyPHuS. Das eigene Regelwerk mit 153 Regeln stützt sich auf ACSC, Microsoft-Dokumentation und DISA STIGs; ein Ergebnis von Riegel ist deshalb keine Aussage über die Erfüllung eines CIS Benchmarks. Eigene Vorgaben lassen sich als GPO-Sicherung importieren, auch aus selbst heruntergeladenen Security Baselines. Regeldateien des Policy Analyzer und Listen von HardeningKitty liest Riegel 0.1 noch nicht ein (geplant für 0.2). Riegel ist {lizenz} und setzt Einstellungen nie selbst.' },
      ],
      faq: [
        { q: 'Gibt es eine kostenlose Alternative zu CIS-CAT für die Prüfung der Windows-Härtung?', a: 'Riegel prüft Windows-Rechner lesend und offline gegen ein eigenes Regelwerk mit 153 Regeln und ist {lizenz}. Es enthält keine Inhalte der CIS Benchmarks: Wer die Erfüllung eines CIS Benchmarks nachweisen muss, bekommt diese Aussage von Riegel nicht.{download}' },
        { q: 'Was unterscheidet Riegel von HardeningKitty und dem Policy Analyzer?', a: 'Alle drei vergleichen Windows-Einstellungen mit Sollwerten. Riegel trennt Erhebung und Auswertung: Ein portabler Sammler liest den Rechner offline und nur lesend, ausgewertet wird auf einem anderen PC. Dazu kommen begründete und freigegebene Ausnahmen, der Vergleich mit dem freigegebenen Stand und ein Bericht zum Abzeichnen. Einstellungen setzt Riegel nie selbst; Abhilfe gibt es nur als Dateien.' },
      ],
      trademark: 'CIS-CAT und CIS Benchmarks sind Marken des Center for Internet Security, Inc.; HardeningKitty ist ein Projekt der scip AG (scipag); Policy Analyzer ist Teil des Microsoft Security Compliance Toolkit, Microsoft ist eine Marke der Microsoft-Unternehmensgruppe. ICT Baden steht in keiner Verbindung zu diesen Organisationen; die Namen werden nur genannt, um den Vergleich zu beschreiben.',
    },
    en: {
      title: 'Switching from CIS-CAT, HardeningKitty or Policy Analyzer: Riegel as an alternative',
      blocks: [
        { type: 'p', text: 'If you check Windows hardening with CIS-CAT against the CIS Benchmarks, with HardeningKitty or with Policy Analyzer from the Microsoft Security Compliance Toolkit, Riegel does the same job: comparing a machine’s security configuration with expected values. Its focus is different:' },
        {
          type: 'items',
          items: [
            { title: 'Offline and read-only', text: 'A portable collector (about 130 KB) installs nothing, changes no configuration and opens no network connection; the evaluation runs on another PC.' },
            { title: 'Justified exceptions', text: 'What stays open deliberately is recorded with a justification, an approving role, a record and an expiry date.' },
            { title: 'A report to sign', text: 'Plant report as PDF with sign-off and an evidence pack that auditors re-check with `verify`.' },
            { title: 'Built for plant PCs', text: 'Designed for Windows 7 SP1 to 11 and Server 2008 R2 to 2025, `--minimal` for sensitive HMIs, Windows’ built-in commands, an “as delivered” report preset for machine builders.' },
          ],
        },
        { type: 'p', text: 'Important if you are looking for an alternative to the CIS Benchmarks: Riegel contains no CIS Benchmark and no BSI SiSyPHuS content. Its own catalogue of 153 rules is backed by ACSC, Microsoft documentation and DISA STIGs, so a Riegel result is no statement about conformance with a CIS Benchmark. Your own baselines can be imported as GPO backups, including those inside security baselines you downloaded yourself. Policy Analyzer rule files and HardeningKitty lists are not imported in Riegel 0.1 (planned for 0.2). Riegel is {lizenz} and never applies settings itself.' },
      ],
      faq: [
        { q: 'Is there a free alternative to CIS-CAT for checking Windows hardening?', a: 'Riegel checks Windows machines read-only and offline against its own catalogue of 153 rules and is {lizenz}. It contains no CIS Benchmark content: if you need to show conformance with a CIS Benchmark, Riegel does not give you that statement.{download}' },
        { q: 'How does Riegel differ from HardeningKitty and Policy Analyzer?', a: 'All three compare Windows settings with expected values. Riegel separates collection from evaluation: a portable collector reads the machine offline and read-only, and the evaluation runs on another PC. It adds justified, approved exceptions, a comparison with the approved state and a report to sign. Riegel never applies settings itself; remediation comes as files only.' },
      ],
      trademark: 'CIS-CAT and CIS Benchmarks are trademarks of the Center for Internet Security, Inc.; HardeningKitty is a project of scip AG (scipag); Policy Analyzer is part of the Microsoft Security Compliance Toolkit, and Microsoft is a trademark of the Microsoft group of companies. ICT Baden is not affiliated with these organisations; the names are used only to describe the comparison.',
    },
  },
  de: {
    title: 'Windows-Härtung prüfen für OT- und Anlagen-PCs – Riegel',
    description: 'Riegel prüft Windows-Rechner in Anlagen, Laboren und Leitständen lesend und offline gegen 153 Härtungsregeln – mit begründeten Ausnahmen und Bericht zum Abzeichnen.',
    lead: 'Riegel ist ein Härtungs-Check für Windows-Rechner in Anlagen, Laboren und Leitständen: Es liest die Sicherheitskonfiguration lesend und offline, prüft sie gegen 153 Regeln, hält bewusst Offenes als begründete und freigegebene Ausnahme fest und schreibt einen Bericht zum Abzeichnen. Geprüft werden Windows 7 SP1 bis 11 und Windows Server 2008 R2 bis 2025; Riegel ist {lizenz}.',
    sections: [
      {
        id: 'wofuer',
        title: 'Härtungsnachweis für Rechner, die niemand zentral verwaltet',
        blocks: [
          { type: 'p', text: 'Anlagen-PCs, Bedienrechner (HMI), Labor- und Leitstandsrechner stehen oft außerhalb der zentralen IT – manche ohne Netz, manche mit Software, die eine unsichere Einstellung braucht. Auf solchen Rechnern ist schon eine Installation eine Änderung.' },
          { type: 'p', text: 'Riegel bringt deshalb einen portablen Sammler mit, der nichts installiert, keine Konfiguration ändert und nur seinen Export schreibt; Windows selbst vermerkt lediglich, dass ein Programm lief. Ausgewertet wird auf einem Auswerte-PC: Ergebnis je Regel, begründete Ausnahmen, Vergleich mit dem freigegebenen Stand und ein Bericht zum Abzeichnen.' },
        ],
      },
      {
        id: 'funktionen',
        title: 'Funktionen',
        blocks: [
          {
            type: 'items',
            items: [
              { title: '153 Regeln, ehrliche Ergebnisse', text: 'Netzwerk, Anmeldedaten und NTLM, LSA, Defender und ASR, Anwendungssteuerung, Verschlüsselung, Firewall, Protokollierung und PowerShell, RDP, Wechselmedien und TLS. Erfüllt heißt positiv belegt; was nicht lesbar war, ist „nicht prüfbar“, nie stillschweigend erfüllt.' },
              { title: 'Portabler Sammler', text: 'Rund 130 KB, für Windows 7 SP1 bis 11 und Server 2008 R2 bis 2025; installiert nichts und ändert keine Konfiguration. Wo kein fremdes Programm laufen darf, gehen die Windows-Bordmittel; `--minimal` startet auf empfindlichen HMIs kein weiteres Programm.' },
              { title: 'Begründete Ausnahmen mit Freigabe', text: 'Was bewusst offen bleibt, bekommt Begründung, akzeptierten Wert, freigebende Rolle und einen Nachweis aus dem Änderungs- oder QMS-Verfahren – an den Inhalt gebunden, mit Ablaufdatum und Verlauf. Dazu Zuschnitt je Rolle und ein Maßnahmenplan.' },
              { title: 'Vergleich mit dem freigegebenen Stand', text: 'Was hat sich seit Inbetriebnahme oder Herstellerbesuch geändert? Riegel vergleicht mit dem letzten Lauf und mit dem freigegebenen Stand – Verschlechterungen zuerst, dann Abweichungen der Rohwerte.' },
              { title: 'Dokumente zum Abzeichnen', text: 'Anlagenbericht mit Abzeichnung, Management-Übersicht, Soll-Konfiguration, Freigabeblatt und Erhebungsprotokoll als PDF, dazu Excel, CSV und ein Nachweispaket, das Prüfer mit `verify` nachrechnen – auch unter Linux.' },
              { title: 'Abhilfe nur als Dateien', text: '.reg-Dateien mit Rücknahme, GptTmpl.inf und audit.csv für den Anlagenbauer – Riegel wendet sie nie selbst an.' },
              { title: 'Eigene Vorgaben', text: 'GPO-Sicherungen importieren, auch aus heruntergeladenen Security Baselines, oder eigene Anforderungen als JSON oder CSV schreiben.' },
              { title: 'Überwachung, die bei Änderungen meldet', text: 'Exitcodes nach Nagios-Art und eine Icinga-Zeile für Verschlechterungen, neu offene hohe Befunde, ablaufende Ausnahmen und überfällige Maßnahmen.' },
            ],
          },
        ],
      },
      {
        id: 'regelwerk',
        title: 'Woher die Regeln kommen',
        blocks: [
          { type: 'p', text: 'Das Regelwerk 2026.10.1 hat 153 Regeln in 17 Berichtskategorien und eigene Texte von ICT Baden. Jeder Sollwert ist belegt durch das ACSC, die Windows-Server-Dokumentation von Microsoft, eine Seite auf Microsoft Learn oder einen DISA STIG; Microsoft Security Baselines dienen nur zur Bestätigung. Verweise nennen Gegenmaßnahmen aus MITRE ATT&CK und Kennungen aus Grundschutz++. Das Regelwerk enthält keine Inhalte von CIS und keine aus BSI SiSyPHuS.' },
          { type: 'p', text: 'Für Maschinenbauer gibt es eine Berichtsvorlage „Auslieferungszustand“ mit der Kennung der Maschine und den begründeten Abweichungen ihrer Software; `Riegel.Cli.exe check` läuft auch in der Werksabnahme (FAT).' },
        ],
      },
      {
        id: 'audits',
        title: 'Für Audits: NIS2, ISO 27001, IEC 62443, GMP',
        blocks: [
          { type: 'p', text: 'Riegel unterstützt Nachweise für NIS2 und die Dokumentationspflicht nach § 30 BSIG, ISO/IEC 27001:2022 A.8.9, IEC 62443, TISAX, Fragebögen von Versicherern und periodische Überprüfungen nach GMP. Es macht keine Compliance-Aussage, ist kein validiertes System und deckt das Konfigurationsmanagement ab – nicht MFA, Datensicherung, Vorfallbehandlung oder Netzsegmentierung.' },
        ],
      },
    ],
    requirements: [
      ['Geprüfte Rechner', 'Windows 7 SP1 bis 11 und Windows Server 2008 R2 bis 2025 über den portablen Sammler (.NET Framework 3.5.1 oder 4.x)'],
      ['Ohne fremdes Programm', 'Windows-Bordmittel (secedit, auditpol, reg) über collect-builtin.cmd'],
      ['Auswerte-PC', 'Windows 10 ab Version 1809 oder Windows Server 2019 und neuer – MSI oder Riegel.exe ohne Installation'],
      ['Linux', 'Befehlszeile für x64 und arm64 zum Auswerten und Nachrechnen von Nachweispaketen'],
      ['Netzwerk', 'keines – Riegel öffnet keine Netzwerkverbindung'],
      ['Sprache', 'Deutsch, Englisch, Spanisch, Französisch, Chinesisch (die letzten drei maschinell vorübersetzt)'],
    ],
    limits: [
      'Vorabversion 0.1 (zuletzt 0.1.2, Sammler 0.1.0), nicht signiert: SmartScreen kann warnen, der Sammler lässt sich nur per Hash freigeben. Kein Kundenpilot auf OT- oder validierten Rechnern, bevor der Sammler signiert ist.',
      'Nur Windows-Ziele: Linux-Rechner werden nicht geprüft. Nur Maschineneinstellungen, keine Benutzerrichtlinien; Domänencontroller bekommen keine Bewertung.',
      'Getestet mit Testdaten und auf CI-Rechnern (Windows Server 2022 und 2025, Windows 11 Arm64, ein Windows-11-Arbeitsplatz), noch nicht auf echten Rechnern mit Windows 7, 8.1, 2008 R2 oder 2012 R2, nicht in einer echten Domäne, nicht mit Virenschutz oder EDR anderer Hersteller und nicht mit tatsächlich erzwungenem AppLocker. Die Zuordnung zu Domänen-GPOs ist experimentell.',
      'Ohne Administratorrechte, mit `--minimal` oder über die Bordmittel bleiben viele Regeln unentscheidbar; der Bericht sagt dann „Unvollständige Prüfung“.',
      'Kein PDF/A, keine elektronischen Signaturen; das Nachweispaket ist nicht signiert.',
      'Spanisch, Französisch und Chinesisch sind maschinell vorübersetzt und in jedem Dokument so gekennzeichnet; die Regeltexte sind dort englisch.',
    ],
    faq: [
      { q: 'Wie prüfe ich, ob ein Windows-Rechner gehärtet ist?', a: 'Mit Riegel: den portablen Sammler auf dem Rechner ausführen, die Erhebung auf einem Auswerte-PC importieren und gegen 153 Regeln auswerten. Das Ergebnis zeigt je Regel Status, Soll- und Ist-Wert, Quelle und warum es wichtig ist.' },
      { q: 'Kann ich die Härtung prüfen, ohne Software auf dem Anlagen-PC zu installieren?', a: 'Ja. Der Sammler installiert nichts, ändert keine Konfiguration und schreibt nur seinen Export; Windows selbst vermerkt, dass ein Programm lief. Wo kein fremdes Programm laufen darf, gehen die Windows-Bordmittel.' },
      { q: 'Funktioniert der Härtungs-Check offline, auf Rechnern ohne Netzwerk?', a: 'Ja. Riegel öffnet keine Netzwerkverbindung. Der Sammler läuft vom USB-Stick, die Erhebung kommt auf demselben Weg zum Auswerte-PC.' },
      { q: 'Läuft der Härtungs-Check auch unter Windows 7 oder Server 2008 R2?', a: 'Der Sammler ist für Windows 7 SP1 bis 11 und Server 2008 R2 bis 2025 gebaut und braucht .NET Framework 3.5.1 oder 4.x. Auf echten Rechnern mit Windows 7 und 2008 R2 ist er noch nicht getestet.' },
      { q: 'Was tun, wenn die Anlagensoftware eine unsichere Einstellung braucht?', a: 'Den Befund als begründete Ausnahme festhalten: Begründung, akzeptierter Wert, freigebende Rolle und ein Nachweis aus dem Änderungs- oder QMS-Verfahren. Die Ausnahme ist an ihren Inhalt gebunden, läuft ab und hat einen Verlauf.' },
      { q: 'Reicht der Bericht als Nachweis für NIS2, ISO 27001 oder IEC 62443?', a: 'Riegel unterstützt Nachweise für das Konfigurationsmanagement, etwa nach ISO/IEC 27001:2022 A.8.9, NIS2 und IEC 62443. Es macht keine Compliance-Aussage; ob der Nachweis genügt, entscheidet Ihr Prüfverfahren.' },
      { q: 'Enthält Riegel Inhalte von CIS oder aus BSI SiSyPHuS?', a: 'Nein. Das Regelwerk hat eigene Texte, die Sollwerte sind durch ACSC, Microsoft-Dokumentation oder DISA STIGs belegt. Eigene Vorgaben, etwa aus GPO-Sicherungen, lassen sich importieren.' },
      { q: 'Ist Riegel kostenlos? Sendet es Daten?', a: 'Riegel ist {lizenz}. Es hat keinen Netzwerkcode, keine Telemetrie und keine Update-Prüfung und sendet keine Daten an ICT Baden.{download}' },
    ],
    aka: ['Windows-Härtungscheck', 'Systemhärtung prüfen', 'Security-Baseline-Prüfung', 'Härtungsnachweis', 'Konfigurationsprüfung für Anlagen-PCs', 'Windows-Härtung offline prüfen', 'Windows Hardening Audit'],
    trademarks: 'Windows, PowerShell, Defender und Excel sind Marken der Microsoft-Unternehmensgruppe, Linux ist eine eingetragene Marke von Linus Torvalds. CIS (Center for Internet Security) und das BSI werden nur genannt, um zu sagen, dass Riegel keine Inhalte von ihnen enthält. Genannte Normen und Rahmenwerke werden nur beschrieben; Riegel ist von deren Herausgebern weder geprüft noch zertifiziert.',
  },
  en: {
    operatingSystem: 'Windows 7 SP1 to 11 and Windows Server 2008 R2 to 2025 (collector); Windows 10 1809 or later and Windows Server 2019 or later (evaluation); Linux (command line)',
    softwareRequirements: 'Collector: .NET Framework 3.5.1 or 4.x; evaluation app: Windows 10 version 1809 or Windows Server 2019 or later',
    title: 'Offline Windows hardening checker for OT and plant PCs – Riegel',
    description: 'Riegel is an offline security baseline check for Windows PCs in plants, labs and control rooms: read-only, 153 rules, justified exceptions and a report to sign.',
    kind: 'Windows hardening check for plants, labs and control rooms',
    tagline: 'Hardened where it can be. Documented where it can’t.',
    lead: 'Riegel is a hardening check for Windows machines in plants, laboratories and control rooms: it reads the security configuration read-only and offline, checks it against 153 rules, keeps what is deliberately open as justified and approved exceptions, and writes a report to sign. It checks Windows 7 SP1 to 11 and Windows Server 2008 R2 to 2025; Riegel is {lizenz}.',
    sections: [
      {
        id: 'why',
        title: 'Evidence of hardening for the machines nobody manages centrally',
        blocks: [
          { type: 'p', text: 'Plant PCs, HMIs, lab and control-room machines often sit outside central IT – some without a network, some with software that needs an insecure setting. On such machines, installing software is a change in itself.' },
          { type: 'p', text: 'Riegel therefore brings a portable collector that installs nothing, changes no configuration and writes only its export; Windows itself merely records that a program ran. The evaluation happens on an analysis PC: a result per rule, justified exceptions, a comparison with the approved state and a report to sign.' },
        ],
      },
      {
        id: 'features',
        title: 'Features',
        blocks: [
          {
            type: 'items',
            items: [
              { title: '153 rules, honest results', text: 'Network, credentials and NTLM, LSA, Defender and ASR, application control, encryption, firewall, audit and PowerShell, RDP, removable media and TLS. A pass needs positive evidence; what could not be read is “not checkable”, never a silent pass.' },
              { title: 'Portable collector', text: 'About 130 KB, for Windows 7 SP1 to 11 and Server 2008 R2 to 2025; installs nothing and changes no configuration. Where no foreign program may run, Windows’ built-in commands work; `--minimal` starts no other program on sensitive HMIs.' },
              { title: 'Justified, approved exceptions', text: 'What stays open deliberately gets a justification, the accepted value, an approving role and a change or QMS record – bound to its content, with expiry and history. Tailoring per role and a measures plan sit beside it.' },
              { title: 'Comparison with the approved state', text: 'What changed since commissioning or a vendor visit? Riegel compares with the previous run and with the approved state – worse first, then raw-value drift.' },
              { title: 'Documents to sign', text: 'Plant report with sign-off, management summary, target configuration, approval sheet and collection record as PDF, plus Excel, CSV and an evidence pack that auditors re-check with `verify` – also on Linux.' },
              { title: 'Remediation as files only', text: '.reg files with a rollback, GptTmpl.inf and audit.csv for the plant vendor – never applied by Riegel.' },
              { title: 'Your own baselines', text: 'Import GPO backups, including those inside downloaded security baselines, or write your own requirements as JSON or CSV.' },
              { title: 'Monitoring that alerts on change', text: 'Nagios-style exit codes and an Icinga line for regressions, newly open high findings, expiring exceptions and overdue measures.' },
            ],
          },
        ],
      },
      {
        id: 'rules',
        title: 'Where the security baseline rules come from',
        blocks: [
          { type: 'p', text: 'Catalogue 2026.10.1 has 153 rules in 17 report categories, with texts written by ICT Baden. Every expected value is backed by the ACSC, Microsoft’s Windows Server documentation, a Microsoft Learn page or a DISA STIG; Microsoft Security Baselines only corroborate. References name MITRE ATT&CK mitigations and Grundschutz++ identifiers. The catalogue contains no CIS and no BSI SiSyPHuS content.' },
          { type: 'p', text: 'For machine builders there is an “as delivered” report preset with the machine identity and the justified deviations of the machine’s software; `Riegel.Cli.exe check` also runs in the factory acceptance test (FAT).' },
        ],
      },
      {
        id: 'audits',
        title: 'For audits: NIS2, ISO 27001, IEC 62443, GMP',
        blocks: [
          { type: 'p', text: 'Riegel supports evidence for NIS2 and the documentation duty of § 30 BSIG, ISO/IEC 27001:2022 A.8.9, IEC 62443, TISAX, insurer questionnaires and GMP periodic reviews. It makes no compliance claim, is not a validated system, and covers configuration management – not MFA, backups, incident handling or network segmentation.' },
        ],
      },
    ],
    requirements: [
      ['Checked machines', 'Windows 7 SP1 to 11 and Windows Server 2008 R2 to 2025 via the portable collector (.NET Framework 3.5.1 or 4.x)'],
      ['Without foreign programs', 'Windows’ built-in commands (secedit, auditpol, reg) via collect-builtin.cmd'],
      ['Analysis PC', 'Windows 10 version 1809 or Windows Server 2019 or later – MSI or Riegel.exe without installation'],
      ['Linux', 'command line for x64 and arm64 to evaluate and verify evidence packs'],
      ['Network', 'none – Riegel opens no network connection'],
      ['Language', 'German, English, Spanish, French, Chinese (the last three machine pre-translated)'],
    ],
    limits: [
      'Pre-release 0.1 (latest 0.1.2, collector 0.1.0), not code-signed: SmartScreen may warn, and the collector can only be allow-listed by hash. No customer pilot on OT or validated machines before the collector is signed.',
      'Windows targets only: Linux machines are not checked. Machine settings only, no per-user policies; domain controllers get no score.',
      'Tested on fixtures and CI runners (Windows Server 2022 and 2025, Windows 11 Arm64, a Windows 11 workstation), not yet on real Windows 7, 8.1, 2008 R2 or 2012 R2 machines, in a real domain, with third-party antivirus or EDR, or with real AppLocker enforcement. Domain GPO attribution is experimental.',
      'Without administrator rights, with `--minimal` or from built-in commands, many rules cannot be decided; the report then says “Incomplete check”.',
      'No PDF/A, no electronic signatures; the evidence pack is not signed.',
      'Spanish, French and Chinese are machine pre-translations, marked in every document; rule texts are English there.',
    ],
    faq: [
      { q: 'How do I run a security baseline check to see whether a Windows machine is hardened?', a: 'With Riegel: run the portable collector on the machine, import the snapshot on an analysis PC and evaluate it against 153 rules. The result shows status, expected and actual value, source and why it matters for every rule.' },
      { q: 'Can I audit hardening without installing software on the plant PC?', a: 'Yes. The collector installs nothing, changes no configuration and writes only its export; Windows itself records that a program ran. Where no foreign program may run, Windows’ built-in commands work.' },
      { q: 'Does the Windows hardening check work offline, on air-gapped machines?', a: 'Yes. Riegel opens no network connection. The collector runs from a USB stick, and the snapshot travels to the analysis PC the same way.' },
      { q: 'Can I audit Windows 7 or Server 2008 R2?', a: 'The collector is built for Windows 7 SP1 to 11 and Server 2008 R2 to 2025 and needs .NET Framework 3.5.1 or 4.x. It has not been tested on real Windows 7 and 2008 R2 machines yet.' },
      { q: 'What if the plant software needs an insecure setting?', a: 'Record the finding as a justified exception: justification, accepted value, approving role and a record from the change or QMS process. The exception is bound to its content, expires and keeps a history.' },
      { q: 'Is the report enough evidence for NIS2, ISO 27001 or IEC 62443?', a: 'Riegel supports evidence for configuration management, e.g. ISO/IEC 27001:2022 A.8.9, NIS2 and IEC 62443. It makes no compliance claim; whether the evidence is sufficient is up to your audit.' },
      { q: 'Does Riegel contain content from CIS or BSI SiSyPHuS?', a: 'No. The catalogue has its own texts; expected values are backed by ACSC, Microsoft documentation or DISA STIGs. Your own baselines, e.g. from GPO backups, can be imported.' },
      { q: 'Is Riegel free? Does it send data?', a: 'Riegel is {lizenz}. It has no network code, no telemetry and no update check, and sends no data to ICT Baden.{download}' },
    ],
    aka: ['offline Windows hardening checker', 'security baseline check', 'system hardening audit', 'hardening evidence report', 'OT Windows hardening assessment', 'configuration compliance check'],
    facts: [
      ['Checked machines', 'Windows 7 SP1 to 11, Windows Server 2008 R2 to 2025 (portable collector)'],
      ['Analysis', 'Windows 10 (1809 or later) and Server 2019 or later; command line also for Linux (x64, arm64)'],
      ['Access', 'read-only, offline, nothing installed on the checked machine'],
      ['User interface', 'German, English, Spanish, French, Chinese – reports too'],
      ['Delivery', 'portable collector (ZIP), MSI or Riegel.exe for analysis PCs'],
    ],
    trademarks: 'Windows, PowerShell, Defender and Excel are trademarks of the Microsoft group of companies, Linux is a registered trademark of Linus Torvalds. CIS (Center for Internet Security) and the BSI are named only to say that Riegel contains no content from them. Standards and frameworks are only described; Riegel is neither audited nor certified by their publishers.',
  },
};

export default page;
