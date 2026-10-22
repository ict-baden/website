# Sichtbarkeit der sieben Produkte – Plan und fertige Texte

> **Stand 2026-10-22 (Till, Claude):** Pforte heißt jetzt **Industrial Kiosk Browser** (Repo `ict-baden/industrialkioskbrowser`, Seite `/produkte/industrial-kiosk-browser/`, Datenschutz `/datenschutz/industrial-kiosk-browser/`, Paket `de.ictbaden.industrialkioskbrowser`). **Plakette** ist nicht fertig und vorerst nicht auf der Webseite. Wo unten Pforte oder Plakette steht, gilt das entsprechend.

Stand 2026-10-21. Für Jo und Till: die Schritte mit eigenem Konto, die anstehen, sobald die neue Website auf
ict-baden.de live ist und die Produkt-Repos öffentlich sind. Claude hat hier nur geplant und geschrieben – nichts ist
eingereicht, angemeldet, gepostet oder verschickt.

- **Grundlage:** Recherche „Auffindbarkeit der 7 Produkte“ vom 2026-10-21 (Suchbegriffe, Trefferlisten, Listen,
  Kanäle, KI-Suche); Produktfakten nur aus den Produkt-Repos (`origin/main` vom 2026-10-21 abends: Vitrine 0.1.0 noch
  ohne Tag-Release, Lupe v0.1.1, Zutritt v0.1.0, Riegel v0.1.2, Plakette v0.2.0, Pforte v0.6.1, Industrial
  Keyboard v2.1.1); die „Nicht behaupten“-Regeln in den Kopfkommentaren von `src/data/produktseiten/*.ts`.
- **Adressen** am 2026-10-21 geprüft. AlternativeTo, Softpedia, SourceForge, Reddit, ComputerBase, deskmodder, die
  DATEV-Community, developer.zebra.com und Neowin sperren automatische Abrufe zumindest zeitweise (403 oder
  Verbindungsabbruch); dort wurde über einen Lesedienst, eine Schnittstelle oder das Webarchiv geprüft, bei Softpedia
  gar nicht (im Browser öffnen). Die Produktseiten auf ict-baden.de und die GitHub-Repos antworten erst nach Livegang
  bzw. Veröffentlichung.
- **Ist-Stand:** ict-baden.de zeigt noch die alte Seite (Zone bei GoDaddy, Einzelheiten in der README unter „State of
  the domain today“), die neue Seite läuft als `noindex`-Vorschau hinter Cloudflare, alle Produkt-Repos sind privat
  (0 Sterne), Releases gibt es nur dort. Ein `google-site-verification`-TXT-Eintrag existiert, Search Console ist also
  vermutlich eingerichtet.

> [!IMPORTANT]
> **Regeln für jeden Text in diesem Dokument**
> - Erst verwenden, wenn das Repo öffentlich ist und `download.public: true` gesetzt ist – vorher sind „Open Source“
>   und jeder Download-Link falsch.
> - Vor dem Absenden mit README und „Limits, honestly“ des Produkts abgleichen: Version, Teststand, Signatur.
> - Keine Superlative, kein „besser als“, Fremdprodukte nur beschreibend („an alternative to X“). Nichts aus den
>   Abschnitten „Nicht schreiben“.
> - Bei jedem Beitrag offenlegen, dass wir die Hersteller sind – in Foren, auf Reddit und Hacker News, in Listen-PRs,
>   in Kommentaren auf AlternativeTo und bei Korrekturen auf fremden Seiten: „Disclosure: I work for ICT Baden, which
>   makes this free open-source tool.“ Ein Beitrag pro Thread, keine Zweitkonten.
> - Keine Stimmen, Likes, Daumen, Sterne oder Upvotes aus dem eigenen Umfeld (Jo, Till, Kollegen, Kunden) und keine
>   Links zum Abstimmen herumschicken.
> - Unsere Repos sind mit KI-Unterstützung entstanden (`CLAUDE.md`, Claude als Co-Autor in den Commits). Wo eine
>   Plattform danach fragt, das offen sagen; wo sie KI-Code ablehnt (IzzyOnDroid, awesome-windows), nicht einreichen.
> - Die Entwürfe sind Vorlagen. Mehrere Listen und Foren lehnen KI-geschriebene Beiträge ab – in eigene Worte bringen
>   und selbst abschicken. Ganz verboten ist generierter Text bei Hacker News, in r/sysadmin und r/Intune;
>   administrator.de verlangt eine Kennzeichnung mit Modellnamen. Dafür gibt es hier nur Stichpunkte.
> - administrator.de und ComputerBase verlangen ein als Firma gekennzeichnetes Konto.

## 1 Kurzfassung

- **Was gewinnt:** Problem- und Alternativ-Suchen mit schwachen Trefferlisten (Webcam als Barcodescanner, ZebraDesigner
  unter Linux, F13–F24 auf Android, Windows-Härtung offline prüfen, verwaiste SIDs, „open source alternative to …“)
  und die Drittseiten, aus denen KI-Antworten schöpfen: AlternativeTo, Softpedia, Snapfiles, GitHub, winget, Foren.
- **Was nicht gewinnt:** Kopfbegriffe wie „barcode scanner for pc“, „android kiosk browser“ oder „NTFS permissions
  report“ – dort stehen in sechs Monaten weiter Händler, MDM-Anbieter und Herstellerseiten.
- **Reihenfolge:** ① Livegang indexierbar und für Crawler offen → ② Search Console, Bing, Brave → ③ Repos öffentlich,
  `download.public`, Code-Signing beantragen → ④ AlternativeTo am ersten Tag, winget, Scoop → ⑤ Portale, Stores,
  Listen und Foren nach und nach, höchstens ein bis zwei Show HN → ⑥ monatlich messen.
- **Warten bei:** Vitrine (kein Tag-Release mit versionierten Dateien), Pforte (Releases ohne APK), Plakette (nur gegen
  den virtuellen Drucker geprüft).

## 2 Reihenfolge für Menschen

Den Livegang selbst beschreibt die README („Going live – checklist“, Schritte 1–11); dort stehen die Einzelheiten,
hier nur, was für die Sichtbarkeit dazukommt. **Mensch** = braucht ein Konto oder eine Entscheidung, **Claude** = kann
vorbereiten oder automatisieren.

1. **Livegang nach README, Schritte 1–7** – Mensch (Anwalt, docker01, Domainverwaltung, Cloudflare) · hängt an der
   Anwaltsprüfung. Die README regelt rechtliche Prüfung, `INDEXNOW_KEY`, Live-Container, den Umzug der Zone von GoDaddy
   zu Cloudflare mit allen MX- und TXT-Einträgen und der Mail-Prüfung, Tunnel, HTTPS und HSTS, die 301-Weiterleitung
   der Alias-Domains und die Prüfung von außen mit IndexNow. Für die Sichtbarkeit zählt dabei vor allem: Der TXT-Eintrag
   `google-site-verification=…` muss den Umzug überstehen (sonst verliert Search Console die Bestätigung), und die
   Alias-Domains antworten mit 301 statt mit eigenem Inhalt. – Claude: Zonenvergleich per `dig` und die Prüfungen aus
   README Schritt 7.
2. **Cloudflare für Such- und KI-Crawler öffnen** – Mensch · 30 Min. · gehört zu README Schritt 4 (Zone anlegen) und
   Schritt 5 (Security › Bots); die README nennt die Schalter, hier die Einzelheiten laut Recherche und
   [Cloudflare-Doku](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) (Bezeichnungen
   im Dashboard können leicht abweichen):
   - Beim Anlegen der Zone die Onboarding-Frage nach KI-Crawlern mit **„erlauben“** beantworten (Cloudflare fragt
     seit 01.07.2025 und schlägt „blockieren“ vor).
   - Security → Settings → „Configure AI bot policies“: **Search = Allow, Agent = Allow, Training = Allow**. Neue
     Zonen sperren seit 15.09.2026 Training und Agent auf Seiten mit Werbung; Crawler, die suchen und trainieren,
     fallen unter jede Trainingssperre.
   - Legacy-Schalter „Block AI bots“ **aus**,
     [Managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
     **aus** (sonst stellt Cloudflare `Disallow` für GPTBot, ClaudeBot, Google-Extended und andere vor unsere eigene
     robots.txt), [Crawler Hints](https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/)
     **an** (meldet Änderungen per IndexNow, auch im Free-Plan), Bot Fight Mode darf verifizierte Bots nicht
     herausfordern.
   - **Entscheidung Training (Jo und Till):** Empfehlung **erlauben** – dann kennen Sprachmodelle die Tools auch ohne
     Websuche, und eine Trainingssperre kann über Mischcrawler auch Suche kosten. Gegenargument: Seiteninhalte gehen
     ohne Gegenleistung in Trainingsdaten; die Seite enthält aber nur öffentliche Produktinfos. Entscheidung in
     `offen.md` im Projekt-Repo festhalten.
   - Danach in [AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/) bzw. Analytics prüfen, dass
     Googlebot, Bingbot, OAI-SearchBot, PerplexityBot und Claude-SearchBot mit 200 durchkommen. Googlebot nie sperren:
     Brave hat keinen eigenen User-Agent und crawlt nur, was Googlebot darf.
3. **Google Search Console (README Schritt 8)** – Mensch (Google-Konto) · 30 Min., Daten nach einigen Tagen · hängt
   an 1. [Search Console](https://search.google.com/search-console): prüfen, ob die bestehende Property eine
   Domain-Property ist und wer Zugriff hat; Sitemap `https://ict-baden.de/sitemap.xml` einreichen; Indexierung der
   Startseite, der Produktübersichten `/produkte/` und `/en/products/`, der 14 Produktseiten (de und en) und der
   Ratgeber (Übersichten `/ratgeber/` und `/en/guides/` und die Seiten darunter) anfordern. Unter Einstellungen → **„Search generative AI“** prüfen, dass „einbeziehen“ gesetzt ist (Standard,
   weltweit seit 31.08.2026; „ausschließen“ nimmt die Seite aus AI Overviews, AI Mode und den KI-Funktionen in
   Discover, [Hilfe](https://support.google.com/webmasters/answer/16908024)). Seit demselben Tag zeigt der Bericht
   „Generative AI performance“ die Impressionen aus AI Overviews und AI Mode
   ([Hilfe](https://support.google.com/webmasters/answer/16984139)). Für AI Overviews genügt eine indexierte Seite mit
   Snippet ([Google](https://developers.google.com/search/docs/appearance/ai-features)).
4. **Bing Webmaster Tools (README Schritt 9)** – Mensch (Microsoft-Konto) · 20 Min. · hängt an 3.
   [Bing Webmaster Tools](https://www.bing.com/webmasters): aus Search Console importieren, Sitemap einreichen,
   [IndexNow](https://www.indexnow.org/) läuft über `INDEXNOW_KEY` und `deploy/deploy.sh` (dazu Crawler Hints). Den
   Bericht **„AI Performance“** beobachten (Vorschau seit 02/2026: Zitate in Copilot und Bing-KI-Antworten, zitierte
   Seiten, „grounding queries“,
   [Bericht](https://www.searchenginejournal.com/bing-webmaster-tools-adds-ai-citation-performance-data/566874/)). Bing
   speist Copilot und Teile von ChatGPT Search.
5. **Brave Search** – Mensch · 10 Min. · hängt an 1. Startseite, Produktübersichten, die 14 Produktseiten und die
   Ratgeber einzeln unter [search.brave.com/submit-url](https://search.brave.com/submit-url) melden. Claude nutzt
   Brave Search für die Websuche; laut Profound (06/2026) kommen rund 79 % der Claude-Zitate aus den Brave-Top-10.
6. **Repos öffentlich und `download.public` (README Schritt 11)** – Jo und Till entscheiden je Produkt · 15–30 Min.
   je Produkt · unabhängig vom Livegang, aber vor jedem Eintrag in Abschnitt 3.
   - Vorher je Repo: README, `docs/` und Kommentare auf interne Hinweise prüfen (Beispiel: am Ende der Plakette-README
     steht ein interner HTML-Kommentar zum Impressum), Secrets-Scan. Homepage-Feld und Topics sind gesetzt.
   - **Markenprüfung vor jedem Eintrag:** README Schritt 1 lässt Produktnamen, Vergleiche und den Gebrauch der
     Gattungsbegriffe „transparent screen lock“/„transparent lock screen“ (Produktnamen von e-motional und Softros)
     vom Anwalt prüfen. Laut `docs/limitations.md` der Repos offen: die Namen Vitrine und Riegel (dort ausdrücklich auch
     gegen „RIEGL“) und die Beschreibung von Vitrine als Alternative zu anderen transparenten Sperren. Vorher nichts
     unter diesen Namen und keine „Alternative zu …“-Einträge; Ausweichformulierungen für Vitrine stehen in 3.1.
   - Release-Stand: Für Vitrine fehlt ein Tag-Release mit versionierten Dateinamen (der Release-Lauf zum Tag `v0.1.0`
     schlug am 2026-10-21 zweimal fehl, eine Korrektur war in Arbeit – vor winget nachsehen); Pforte-Releases (auch
     0.6.1) enthalten bis zum Signaturschlüssel für `de.ictbaden.pforte` keine APK.
   - Website: je Produkt eine Zeile `download.public: true` und danach `npm run brand -- --only <slug>`:
     `vitrine.ts`, `qr-scanner.ts` (Lupe), `freigaben-berechtigungen.ts` (Zutritt), `haertungs-check.ts` (Riegel),
     `labeldesigner.ts` (Plakette), `enterprisebrowser.ts` (Pforte), `industrialkeyboard.ts` (Industrial Keyboard),
     alle in `src/data/produktseiten/`. – Claude: als PR, sobald ein Repo öffentlich ist.
7. **Code-Signing** – Mensch mit Firmenunterlagen und Ausweis · Antrag 1 Std., Prüfung 1–20 Werktage · parallel zu 6.
   - Empfehlung Windows: [Azure Artifact Signing](https://learn.microsoft.com/en-us/azure/artifact-signing/) (für eine
     Firma in Deutschland möglich, ab 9,99 $/Monat, Zertifikat auf ICT Baden; die Zutritt-README plant es bereits).
     Alternative: [SignPath Foundation](https://signpath.org/) – kostenlos für Open Source, Zertifikat lautet auf
     SignPath; Bedingungen ([Terms](https://signpath.org/terms)): nachprüfbare Reputation für Programme,
     Code-Signing-Richtlinie auf der Projektseite, MFA für alle Beteiligten, Freigabe jedes Releases; Hacking-Werkzeuge und
     Schwachstellenscanner sind ausgeschlossen – für Riegel und Zutritt vorher klären.
   - [Apple Developer Program](https://developer.apple.com/programs/) (99 $/Jahr) für Lupe auf dem Mac
     (Notarisierung, Voraussetzung für Homebrew Cask).
   - Ohne Signatur: SmartScreen-Warnung, kein Win32-Paket im Microsoft Store, kein Homebrew Cask, schlechter erster
     Eindruck in Foren; Riegel-README: kein Kundenpilot auf OT-Rechnern mit unsigniertem Sammler.
   - Claude: Signierschritt in die Release-Workflows, sobald die Zugangsdaten als Secrets hinterlegt sind.
8. **AlternativeTo** – Mensch (Konto mit bestätigter Mail-Adresse) · 3 Std. plus Warteschlange · hängt an 6, am ersten
   Tag starten. Texte in Abschnitt 3.
   - Eigene Apps eintragen ist erlaubt („Suggest new application“). Jede neue App geht durch eine Warteschlange mit
     mehreren tausend Einträgen; eine bezahlte Prioritätsprüfung (meist 1–2 Werktage) ändert nichts an Freigabe oder
     Rang ([FAQ](https://alternativeto.net/faq/), [Terms](https://alternativeto.net/about/terms/)).
   - In Beschreibungen keine Links und Kontaktdaten, am Website-Link keine UTM-Parameter. Verboten ist jede
     Manipulation von Likes, Stimmen oder Bewertungen.
   - Ablehnungsgründe laut FAQ: nur angekündigte Apps, geschlossene oder private Betas, Einladung oder Early Access,
     nicht englische Apps, wenig Aufwand oder übersättigte Kategorien (ein Risiko für Lupe). Öffentliche Betas werden
     laut FAQ wahrscheinlich angenommen – die Versionsangabe ehrlich lassen. Industrial Keyboard zuerst (Release mit
     APK, kein Sperrpunkt).
   - Keine Fremdseiten anlegen, nur um ein eigenes Produkt daranzuhängen.
   - „Als Alternative zu …“ nur dort vorschlagen, wo die Hauptaufgabe übereinstimmt; die Seiten stehen je Produkt.
     Unsere Namen sind auf AlternativeTo frei (alle sieben Slugs 404).
9. **Paketquellen und Stores** – Claude bereitet vor, Mensch reicht unter eigenem Konto ein · Vorbereitung 1 Tag,
   Prüfzeiten Tage bis Wochen · hängt an 6 (Store und Homebrew auch an 7).
    - **winget** (Vitrine, Lupe, Zutritt, Riegel, Plakette): versionierte HTTPS-URL direkt vom Herausgeber (GitHub-Release),
      stille Installation (`msiexec … /qn`), Signatur nicht Pflicht
      ([Microsoft Learn](https://learn.microsoft.com/en-us/windows/package-manager/package/repository),
      [winget-pkgs](https://github.com/microsoft/winget-pkgs)). Claude: Manifeste mit
      [wingetcreate](https://github.com/microsoft/winget-create) und später ein Release-Job, der den PR öffnet (braucht
      einen Token eines Menschenkontos als Secret).
    - **Scoop:** eigener Bucket (z. B. `ict-baden/scoop-bucket`) sofort, mit Autoupdate – Claude; der Bucket „Extras“
      später ([Buckets](https://github.com/ScoopInstaller/Scoop/wiki/Buckets),
      [Extras](https://github.com/ScoopInstaller/Extras)).
    - **Chocolatey:** Konto, jede Version wird von Menschen moderiert (Tage bis Wochen,
      [Moderation](https://docs.chocolatey.org/en-us/community-repository/moderation/)) – Mensch; Claude schreibt die
      `.nuspec`. Niedrige Priorität.
    - **Microsoft Store** (Lupe zuerst – Store-Apps ranken bei „barcode scanner for pc“): Firmenkonto über
      [storedeveloper.microsoft.com](https://storedeveloper.microsoft.com/) ohne Gebühr, D-U-N-S oder Registerauszug
      und Mail auf der Firmendomain; Win32-MSI/EXE nur signiert und mit versionierter URL, MSIX signiert der Store
      selbst. – Mensch; Claude: Store-Texte, MSIX-Paket.
    - **Flathub** (Lupe, Plakette) – **erst nach einigen Monaten echter Nutzung, ganz von Hand:** Apps mit sehr kurzer
      Geschichte nimmt Flathub in der Regel nicht an; KI-erzeugter Code muss offengelegt werden, Manifeste dürfen keine
      KI-erzeugten oder KI-unterstützten Inhalte enthalten, und KI darf keine Einreichungs-PRs öffnen
      ([Anforderungen](https://docs.flathub.org/docs/for-app-authors/requirements),
      [Einreichung](https://docs.flathub.org/docs/for-app-authors/submission)). Technisch nötig: Build aus dem
      Quellcode ohne Netz, AppStream-Metainfo, App-IDs `de.ict_baden.Lupe` und `de.ict_baden.Plakette`, Domain-Nachweis
      für den Haken. Manifest, PR und Antworten schreibt ein Mensch; Claude hält sich hier heraus.
    - **AUR** (Lupe, Plakette): Claude schreibt `PKGBUILD`; Mensch mit [AUR](https://aur.archlinux.org/)-Konto pusht.
    - **Homebrew:** offizieller Cask erst ab 75 Sternen oder 30 Forks/Watchern (bei Selbsteinreichung das Dreifache,
      Repo mindestens 30 Tage alt) und mit Notarisierung
      ([Acceptable Casks](https://docs.brew.sh/Acceptable-Casks)); bis dahin eigener Tap `ict-baden/homebrew-tap` –
      Claude.
    - **IzzyOnDroid – nicht einreichen:** Die Regeln lehnen Apps ab, die ganz oder teilweise mit generativer KI
      erstellt sind („vibe-coded“ sicher), der Code soll frei von LLM-Ausgabe sein, verschwiegene KI-Nutzung führt zur
      Ablehnung ([AI policy](https://izzyondroid.org/docs/general/AppInclusionPolicy/)). Beide Android-Repos haben
      `CLAUDE.md` und Claude als Co-Autor. Höchstens nach einer offenen Rückfrage mit voller Offenlegung
      ([Issues](https://codeberg.org/IzzyOnDroid/repodata/issues)).
    - **F-Droid** (der Weg in einen Open-Source-Store; die Inclusion Policy nennt keine KI-Regel): Build aus dem Quellcode, keine proprietären Bibliotheken (beide Apps nutzen nur AndroidX und
      Material; DataWedge und Honeywell laufen über Intents), Fastlane-Metadaten liegen in beiden Repos
      ([Inclusion Policy](https://f-droid.org/docs/Inclusion_Policy/),
      [Quick Start](https://f-droid.org/docs/Submitting_to_F-Droid_Quick_Start_Guide/)). Claude: Metadaten für
      `fdroiddata`; Mensch: Merge Request mit GitLab-Konto.
    - **Google Play** (Pforte, Industrial Keyboard; für Managed Google Play mit Intune oder SOTI nötig):
      Organisationskonto mit D-U-N-S (25 $), dort kein Test mit 12 Testern; ab 2027 gilt die Developer Verification
      weltweit auch fürs Sideloading. Store-Texte stehen in `docs/play-store.md` beider Repos. Die APK nicht vorab als private App in Managed Google Play
      hochladen – das belegt den Paketnamen in ganz Google Play (Industrial-Keyboard-Doku `docs/deployment.md`). –
      Mensch.
10. **Portale** – Mensch · 3 Std. plus Wochen Prüfzeit · hängt an 6, besser nach 7.
    - **Softpedia** (Windows, Linux, macOS, Android): Formular „Submit Program“ auf softpedia.com, nur für
      Rechteinhaber. Softpedia sperrt automatische Abrufe (403) – im Browser öffnen.
    - **Snapfiles** (nur Windows): neue Entwicklerkonten werden zurzeit nicht angelegt; Vorschläge per Mail an die
      Adresse im [Developer Center](https://www.snapfiles.com/dev/).
    - **heise Download** (deutsch): Entwicklerkonto über
      [heise.de/download/developer/join](https://www.heise.de/download/developer/join), danach Formular; die Redaktion
      prüft (Wochen).
    - **SourceForge:** Spiegel per
      [GitHub Importer](https://sourceforge.net/p/forge/documentation/GitHub%20Importer/), neue Releases auf Wunsch
      automatisch. Chip: kein offizieller Weg gefunden – auslassen.
    - Optional nach dem Livegang je eine kurze, sachliche Mail an Redaktionen, die zu den Themen ranken (heise-Tipps,
      WindowsPro, giga) – nur Fakten und Link, kein Nachfassen.
11. **Listen, Foren, Show HN** – Mensch · 1–2 Std. pro Woche über 4–8 Wochen · hängt an 6. Je Produkt in Abschnitt 3.
    Insgesamt höchstens ein bis zwei Show HN (Kandidaten: Lupe, danach Riegel), erst nach dem Code-Signing und
    erster echter Nutzung, von Konten mit normaler HN-Historie und nur, wenn man den Tag über antworten kann – HN soll
    nicht vorwiegend der Werbung dienen
    ([Regeln](https://news.ycombinator.com/showhn.html): ausprobierbar ohne Anmeldung, keine Landingpage, Macher antwortet
    selbst, nicht um Stimmen bitten, Titel beginnt mit „Show HN“; laut
    [Guidelines](https://news.ycombinator.com/newsguidelines.html) kein generierter oder KI-bearbeiteter Text). Von den
    23 Foren- und Reddit-Threads der Recherche lohnt keiner mehr eine Antwort: archiviert, geschlossen, gelöst,
    jahrealt oder unpassend. Antworten nur auf neue Fragen, nach den Stichpunkten je Produkt.
12. **Messen** – Mensch · 1 Std. im Monat · ab vier Wochen nach dem Livegang. Abschnitt 4.

**Übersicht: Kanäle je Produkt** (✓ = sobald das Repo öffentlich ist)

| Kanal | Vitrine | Lupe | Zutritt | Riegel | Plakette | Pforte | Industrial Keyboard |
|---|---|---|---|---|---|---|---|
| AlternativeTo | ✓ | ✓ | ✓ | ✓ | ✓ mit Vermerk | nach APK | ✓ zuerst |
| winget, Scoop | nach Tag-Release | ✓ | ✓ | ✓ Auswerte-App | ✓ | – | – |
| Chocolatey | später | später | später | später | später | – | – |
| Microsoft Store | nach Signatur | zuerst, nach Signatur | nach Signatur | – | nach Signatur | – | – |
| AUR | – | ✓ | – | – | ✓ | – | – |
| Flathub | – | nach Monaten, von Hand | – | – | nach Monaten, von Hand | – | – |
| Homebrew | – | eigener Tap; Cask nach Notarisierung | – | – | – | – | – |
| F-Droid | – | – | – | – | – | nach APK | ✓ |
| IzzyOnDroid | – | – | – | – | – | nein (KI-Regel) | nein (KI-Regel) |
| Google Play | – | – | – | – | – | nach APK | ✓ |
| Softpedia, heise Download | ✓ | ✓ | ✓ | ✓ | ✓ | nach APK | ✓ |
| Snapfiles (nur Windows) | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| Awesome-Listen | – | 2 Listen, Mac-Liste ab 5 Sternen | ab 10/2027 | 2 Listen, nach Nutzung | 1 Liste | ab 04/2027 | ab 04/2027 |
| Show HN (höchstens 1–2) | – | Kandidat 1 | – | Kandidat 2 | – | – | – |

## 3 Je Produkt

Gleicher Aufbau je Produkt: belegte Fakten, „Nicht schreiben“, Zielsuchen, Orte, dann die Texte für AlternativeTo,
Portale und Listen, die geprüften Foren-Threads und ein Gerüst für Show HN. Chancen aus der
Recherche (Top 3 in sechs Monaten, mit öffentlichem Download; ohne Download eine Stufe tiefer). Website-Adressen gelten
ab dem Livegang, GitHub-Adressen ab der Veröffentlichung. Alle Produkte stehen außerdem auf den Übersichten
`https://ict-baden.de/produkte/` und `https://ict-baden.de/en/products/` – passend als Firmen-Link, wo ein Portal nach
einer Herstellerseite fragt. Für Lupe, Vitrine, Zutritt, Riegel, Industrial Kiosk Browser und Industrial Keyboard gibt es
zusätzlich **Ratgeber** (Übersichten
`https://ict-baden.de/ratgeber/` und `https://ict-baden.de/en/guides/`): Sie beantworten die Problemfrage mit den
üblichen Wegen und nennen unser Produkt nur als eine gekennzeichnete Möglichkeit, ohne Namen von Konkurrenzprodukten.
Für Forenantworten und als Ziel bei Problem-Suchen passen sie oft besser als die Produktseite; bei „Alternative zu …“
bleibt es die Produktseite mit ihrem Vergleichsabschnitt (`#alternative` deutsch, `#alternative-to` englisch).

### 3.1 Vitrine – transparente Bildschirmsperre für Windows

- **Belegt** (README, `docs/`, Stand `main` 2026-10-21): sperrt Tastatur und Maus, Bildschirm bleibt sichtbar,
  Programme laufen weiter; Sperren per Strg+Alt+L, Infobereich, Leerlaufzeit, Zeitplan, beim Start, als
  Bildschirmschoner; entsperren mit Windows-Kennwort oder Windows Hello; verdeckter Modus, verdeckte Bereiche,
  Hinweistext; elektronische Signaturen für Fachanwendungen (auch mit Microsoft Entra ID); manipulationserkennendes
  Protokoll mit SHA-256-Hash-Kette; MSI (`/qn`), 52 Richtlinien (ADMX/ADML) für Gruppenrichtlinie und Intune; fünf
  Sprachen (es, fr, zh maschinell); keine Telemetrie, keine Update-Prüfung. Windows 10 ab 1809 und 11, x64.
  Vorabversion 0.1.0, nicht signiert, noch nicht auf echten Geräten durchgetestet.
- **Nicht schreiben:** Entsperren mit Entra ID in den Release-Paketen (fehlt dort, nur Signaturen und
  Administratorbestätigung), „manipulationssicher“ (nur manipulationserkennend), Konformität mit Part 11 oder Annex 11,
  Remotedesktop oder mehrere Monitore getestet, Chipkarten-Anbindung.
- **Ausweichformulierung**, falls die Anwaltsprüfung den Gattungsbegriff „transparent screen lock“ nicht freigibt:
  EN „see-through screen lock“ oder „screen lock that keeps programs visible“, DE „durchsichtige Bildschirmsperre“;
  dann auch Kurztexte, Show-HN-Titel und das Topic `transparent-screen-lock` anpassen.
- **Seiten:** `https://ict-baden.de/produkte/vitrine/`, `https://ict-baden.de/en/products/vitrine/`,
  `https://github.com/ict-baden/vitrine`; Ratgeber `https://ict-baden.de/ratgeber/bildschirm-sperren-anzeige-sichtbar/`
  und `https://ict-baden.de/en/guides/lock-pc-keep-screen-visible/` – Ziel für die Problem-Suchen und Forenantworten. In winget erst eintragen, wenn es ein Tag-Release mit versionierten
  Dateinamen gibt.

| Zielsuche (EN / DE) | Chance |
|---|---|
| transparent screen lock alternative, free, open source | hoch über AlternativeTo und GitHub, Seite mittel |
| PC sperren, Bildschirm bleibt sichtbar / lock computer but keep screen visible | DE hoch, EN mittel |
| transparente Bildschirmsperre / transparent screen lock | DE hoch, EN niedrig |
| Leitstand-PC sperren, Dashboard-PC sperren / dashboard PC lock, HMI view only | DE hoch, EN mittel |
| Tastatur und Maus sperren ohne Bildschirmsperre / lock keyboard and mouse without locking screen | DE mittel, EN niedrig |
| Messrechner sperren, GxP / lock instrument PC during run, 21 CFR Part 11 screen lock | mittel (nur „Bausteine“, keine Konformität) |
| PC sperren, während ein KI-Agent oder Build läuft / lock screen while AI agent runs | mittel |

**Wo eintragen**

- AlternativeTo, neu eintragen und als Alternative vorschlagen bei:
  [Transparent Screen Lock](https://alternativeto.net/software/transparent-screen-lock/about/) (e-motional, 5
  Alternativen, keine davon Open Source für Windows),
  [Transparent Lock Screen](https://alternativeto.net/software/transparent-lock-screen/about/) (Softros, ebenso),
  [BlueLife KeyFreeze](https://alternativeto.net/software/bluelife-keyfreeze/about/),
  [LiteLockr](https://alternativeto.net/software/litelockr/about/) (Open Source, Repo archiviert). Auf
  der Funktionsseite [Screen lock](https://alternativeto.net/feature/screen-locker/) stehen für Windows nur zwei
  Open-Source-Apps.
- Portale: Softpedia und Snapfiles zuerst (führen bei „transparent screen lock“), dann heise Download.
- Paketquellen: winget (Softros ist dort), Scoop, Chocolatey; Microsoft Store nach dem Code-Signing.
- Awesome-Listen: keine passende. [awesome-windows](https://github.com/0PandaDEV/awesome-windows) lehnt KI-erstellte
  Beiträge ausdrücklich ab und will keine „vibecoded“ Tools; unsere Repos enthalten `CLAUDE.md`. Empfehlung: dort
  nicht einreichen.
- GitHub-Topics: gesetzt (u. a. `screen-lock`, `transparent-screen-lock`, `keyboard-lock`, `21-cfr-part-11`).

**AlternativeTo – Name**

```text
Vitrine
```

**AlternativeTo – Kurzbeschreibung** (1 Satz)

```text
Transparent screen lock for Windows: keyboard and mouse are locked while programs stay visible and keep running.
```

**AlternativeTo – Beschreibung** (600–900 Zeichen, ohne Links)

```text
Vitrine locks keyboard and mouse on a Windows 10 or 11 PC while the screen stays visible and every program keeps running – for lab instrument PCs, production lines, control rooms and dashboards that must be watched but not operated. Lock with Ctrl+Alt+L, from the notification area, after idle time, on a schedule or at startup; unlock with the Windows password or Windows Hello. A covered mode hides the screen, and single areas can stay covered. Line-of-business applications can request electronic signatures through a local interface, also with Microsoft Entra ID. Every lock, unlock and signature goes into a tamper-evident audit log with a SHA-256 hash chain. MSI for silent deployment, 52 policies for Group Policy and Intune. No telemetry. Pre-release 0.1.0, not code-signed yet. Free and open source (MIT).
```

**AlternativeTo – Felder**

```text
Platforms: Windows
License: Open Source (MIT), Free
Tags/Features (vorhandene wählen): Screen lock, Keyboard lock, Mouse lock, Group Policy, Audit log, Portable, Ad-free, No tracking
Alternative to: Transparent Screen Lock, Transparent Lock Screen (Softros), BlueLife KeyFreeze, LiteLockr
Website: https://ict-baden.de/en/products/vitrine/
```

**Portal EN kurz** (≤ 160 Zeichen)

```text
Transparent screen lock for Windows: locks keyboard and mouse, the screen stays visible and programs keep running. Free and open source (MIT).
```

**Portal EN lang** (rund 800 Zeichen)

```text
Vitrine is a transparent screen lock for 64-bit Windows 10 (1809 or later) and Windows 11. It blocks keyboard and mouse input while the desktop stays visible and every program keeps running, so a measurement, a plant display or a dashboard can be watched but not operated. Lock with Ctrl+Alt+L, from the notification area, after idle time, on a schedule, at startup or as a screen saver; unlock with the Windows password or Windows Hello. Optional: a covered mode, covered screen areas, a notice text, electronic signatures for line-of-business applications and a tamper-evident audit log. Administrators install the MSI silently and manage it through 52 policies for Group Policy or Intune. No telemetry, no update check. Pre-release 0.1.0, not code-signed yet. Free and open source software (MIT licence) by ICT Baden.
```

**Portal DE kurz** (≤ 160 Zeichen)

```text
Durchsichtige Bildschirmsperre für Windows: Tastatur und Maus gesperrt, Bildschirm sichtbar, Programme laufen weiter. Kostenlos, Open Source (MIT).
```

**Portal DE lang** (rund 800 Zeichen)

```text
Vitrine ist eine transparente Bildschirmsperre für Windows 10 (ab 1809) und Windows 11, 64 Bit. Sie sperrt Tastatur und Maus, während der Bildschirm sichtbar bleibt und alle Programme weiterlaufen – für Messrechner im Labor, Bedienrechner an der Linie und Leitstände, an denen ein Prozess beobachtet, aber nicht bedient werden soll. Gesperrt wird mit Strg+Alt+L, über den Infobereich, nach Leerlaufzeit, nach Zeitplan oder beim Start; entsperrt mit dem Windows-Kennwort oder Windows Hello. Dazu kommen ein verdeckter Modus, verdeckte Bereiche, elektronische Signaturen für Fachanwendungen und ein manipulationserkennendes Protokoll. Verteilung als MSI, Verwaltung über 52 Richtlinien für Gruppenrichtlinie und Intune. Keine Telemetrie. Vorabversion 0.1.0, noch nicht signiert. Kostenlose Open-Source-Software (MIT) von ICT Baden.
```

**Foren und Reddit** – Threads aus der Recherche, geprüft am 2026-10-21 (Reddit sperrte automatische Abrufe zeitweise; Stand und Daten aus dem Archiv, die Archivierung je Subreddit anhand der Kommentare geschätzt.)

| Thread | Stand | Entscheidung |
|---|---|---|
| [r/sysadmin „Transparent screen lock recs“](https://www.reddit.com/r/sysadmin/comments/1rgqvqp/) | 02/2026, seit etwa 08/2026 archiviert | nicht antworten – genau die Frage, aber geschlossen |
| [r/Windows10: transparente Sperre für einen Dashboard-PC](https://www.reddit.com/r/Windows10/comments/c91jpk/) | 2019, archiviert | nicht antworten |
| [r/PLC „View only various scadas/hmis“](https://www.reddit.com/r/PLC/comments/1faiqwa/view_only_various_scadashmis/) | 2024, offen | nicht antworten – gesucht ist Fernzugriff nur zum Ansehen, und r/PLC verbietet Produktangebote |
| [administrator.de „Tastatur und Maus Sperren“](https://administrator.de/forum/tastatur-und-maus-sperren-27507.html) | 2006–2009 | nicht antworten – Moderatoren werten Herstellerantworten in alten Threads als „Nekro-SEO“ |

Neue Threads zur transparenten Sperre kommen in r/sysadmin immer wieder. Dort dürfen Hersteller in bestehenden
Diskussionen mit Offenlegung antworten, KI-Text ist verboten – also selbst schreiben. Stichpunkte:

- Erst die Frage beantworten: Win+L zeigt den Sperrbildschirm; gesucht ist eine transparente Sperre, die nur die
  Eingabe sperrt. Als Link den Ratgeber nehmen (`https://ict-baden.de/en/guides/lock-pc-keep-screen-visible/`), nicht
  die Produktseite – er vergleicht die üblichen Wege.
- Offenlegung, dann Vitrine: Tastatur und Maus gesperrt, Bildschirm sichtbar, Entsperren mit Windows-Kennwort oder
  Windows Hello, MSI und 52 Richtlinien für GPO und Intune, MIT.
- Grenzen: Vorabversion 0.1.0, nicht auf echten Geräten durchgetestet, Strg+Alt+Entf lässt sich nicht abfangen, kein
  Entsperren mit Entra ID in den Release-Paketen.

**Show HN – Titel** (Vorschlag, nur falls statt Lupe oder Riegel)

```text
Show HN: Vitrine – open-source transparent screen lock for Windows
```

**Show HN – Gerüst** (3–5 Sätze **selbst** schreiben: HN verbietet generierten und KI-bearbeiteten Text in Posts; URL: das GitHub-Repo)

- What: locks keyboard and mouse on Windows 10/11; the screen stays visible, programs keep running.
- Why: lab instrument and control-room PCs that must be watched but not touched; Win+L hides everything.
- How: unlock with Windows password or Windows Hello; hash-chained audit log; MSI plus ADMX for Group Policy and Intune.
- Status: 0.1 pre-release, not yet tested end to end on real devices.
- Ask: reports from Remote Desktop and multi-monitor setups. MIT, no telemetry.

### 3.2 Lupe – QR-Code- und Barcode-Scanner für den PC

- **Belegt** (README, `docs/`, Tag v0.1.1): liest Codes per Webcam, aus jedem Bildschirmausschnitt (Win+Umschalt+Q,
  alle Monitore, auch bei geschlossenem Fenster; macOS ⌘+⌥+Q), aus Bilddateien und der Zwischenablage; findet alle
  Codes im Bild; kopieren, eintippen (Unicode, unabhängig vom Tastaturlayout; von der Kamera wie ein Handscanner) oder
  per Link-Regel öffnen (nur http/https); 22 Formate über zxing-cpp; Verlauf mit CSV-Export; Befehlszeile mit
  Exitcodes; offline, keine Telemetrie, keine Update-Prüfung. Windows 10 ab 1809 und 11 (x64), Linux x64/arm64 (X11 und
  Wayland, glibc 2.31), macOS ab 12 (nicht notarisiert). Oberfläche Avalonia. Vorabversion 0.1.1, nicht signiert; Linux
  bisher nur in Containern getestet, auf einem echten Mac nur gestartet (Fenster, Demo-Kamera, Befehlszeile).
- **Nicht schreiben:** „tippt in jede Anwendung“ (nicht in Programme, die als Administrator laufen), mit echter Webcam
  oder echtem Mac getestet (Kamera bisher nur gegen eine simulierte Quelle; Bildschirmscan, Eintippen und Tastenkürzel auf dem Mac noch nicht
  ausprobiert),
  Alleinstellung („es gibt keinen guten …“, barcodrod.io ist ein direkter Open-Source-Gegner), QR-Codes erzeugen.
- **Seiten:** `https://ict-baden.de/produkte/lupe/`, `https://ict-baden.de/en/products/lupe/`,
  `https://github.com/ict-baden/lupe`; Ratgeber `https://ict-baden.de/ratgeber/barcode-scanner-pc/` und
  `https://ict-baden.de/en/guides/barcode-scanner-for-pc/` – Ziel für die Problem-Suchen und Forenantworten. Auf der
  Website heißt Lupe „QR-Code- und Barcode-Scanner für den PC“ bzw. „QR code & barcode scanner for PC“ – diese
  Bezeichnung in den Texten beibehalten.

| Zielsuche (EN / DE) | Chance |
|---|---|
| Webcam als Barcodescanner, Barcode mit Laptop-Kamera scannen / webcam as barcode scanner | DE hoch, EN mittel |
| Data-Matrix-Code am PC lesen (Frankierung, GS1, UDI) / read data matrix on pc | DE hoch, EN mittel |
| CodeTwo QR Code Desktop Reader alternative | mittel–hoch |
| QR-Code aus Screenshot, PDF oder Videocall auslesen / read qr code from screen, hotkey | mittel |
| Tastatur-Emulation Barcode ohne Handscanner / keyboard wedge software | mittel |
| QR-Code scannen Mac ohne iPhone / qr code scanner mac, linux | mittel |
| QR-Code-Scanner PC kostenlos, barcode scanner for pc | niedrig (Store-Apps, Händler, Listicles) |

**Wo eintragen**

- AlternativeTo, als Alternative vorschlagen bei:
  [CodeTwo QR Code Desktop Reader](https://alternativeto.net/software/codetwo-qr-code-desktop-reader/about/)
  (eingestellt, rankt trotzdem), [bcWebCam](https://alternativeto.net/software/bcwebcam/about/) (Webcam als Scanner
  unter Windows), [ZBar bar code reader](https://alternativeto.net/software/zbar-bar-code-reader/about/),
  [CoBang](https://alternativeto.net/software/cobang/about/) (Linux),
  [Barcode to PC](https://alternativeto.net/software/barcode-to-pc-wi-fi-scanner/about/) (gleiche Aufgabe mit dem
  Handy). NormCap nicht – Hauptaufgabe ist dort Texterkennung. Als Open-Source-Alternativen für Windows stehen dort
  schon ZBar, Barcode to PC und Barcodrod.io.
- Weitere Vergleichsseite:
  [SaaSHub – CodeTwo-Alternativen](https://www.saashub.com/codetwo-qr-code-desktop-reader-alternatives), Eintrag mit
  Konto über [Submit a Product](https://www.saashub.com/services/submit).
- Portale: Softpedia, Snapfiles, heise Download, SourceForge-Spiegel.
- Paketquellen und Stores: Microsoft Store (wichtigster Kanal), winget, Scoop, Chocolatey, AUR, eigener
  Homebrew-Tap; Flathub erst nach einigen Monaten Nutzung (Schritt 9).
- Awesome-Listen: awesome-avalonia, awesome-qr-code; open-source-mac-os-apps erst nach Test auf einem echten Mac und
  ab 5 Sternen (der Maintainer schließt PRs darunter, ein Workflow prüft alle Links). Nicht awesome-windows (siehe
  Vitrine).
- GitHub-Topics: gesetzt (u. a. `qr-code-scanner`, `barcode-reader`, `keyboard-wedge`, `webcam`, `data-matrix`).

**AlternativeTo – Name**

```text
Lupe
```

**AlternativeTo – Kurzbeschreibung** (1 Satz)

```text
QR code and barcode scanner for PC: reads codes on Windows, Linux and macOS from the screen, a webcam, image files and the clipboard.
```

**AlternativeTo – Beschreibung** (600–900 Zeichen, ohne Links)

```text
Lupe is a QR code and barcode scanner for the PC: press Win+Shift+Q and drag a rectangle around a code anywhere on the screen, across all monitors, hold a code in front of the webcam, open an image file or paste a screenshot. The result is copied, typed into the program you are working in (from the camera like a hand scanner) or opened as a link through your own link rules. 22 formats via zxing-cpp, including QR Code, Micro QR, Data Matrix, Aztec, PDF417, Code 128/GS1-128, EAN/UPC and GS1 DataBar. History with CSV export and a command line. Lupe reads codes only, it does not create them. Works offline, no telemetry. Windows 10 (1809+) and 11, Linux x64/arm64, macOS 12+. Pre-release 0.1.1: the camera is so far tested with a simulated source only, Linux only in containers, and on a real Mac only the window, demo camera and command line. Free and open source (MIT).
```

**AlternativeTo – Felder**

```text
Platforms: Windows, Linux, Mac
License: Open Source (MIT), Free
Tags/Features (vorhandene wählen): QR code reader, Barcode scanner, Screen capture, Webcam, Keyboard wedge, Offline, Portable, No tracking
Alternative to: CodeTwo QR Code Desktop Reader, bcWebCam, ZBar bar code reader, CoBang, Barcode to PC
Website: https://ict-baden.de/en/products/lupe/
```

**Portal EN kurz** (≤ 160 Zeichen)

```text
QR code and barcode scanner for PC (Windows, Linux, macOS): reads codes from the screen by hotkey, a webcam, image files or the clipboard. Offline, MIT.
```

**Portal EN lang** (rund 800 Zeichen)

```text
Lupe is a QR code and barcode scanner for the PC. Press Win+Shift+Q in any program and drag a rectangle around a code – in a PDF, an e-mail, a web page or a video call, across all monitors. Lupe also reads codes from a webcam, image files and the clipboard and finds every code in a picture. The content is copied, typed into the window you were working in (independent of the keyboard layout) or opened as a link through your own rules. It reads 22 formats, among them QR Code, Data Matrix, Aztec, PDF417, Code 128, EAN-13 and GS1 DataBar; it reads codes only and does not create them. History with CSV export and a command line are included. Lupe works offline, without telemetry. Windows 10 (1809+) and 11, Linux (x64, arm64), macOS 12+; Linux and macOS are less tested. Pre-release 0.1.1, not code-signed. Free and open source (MIT) by ICT Baden.
```

**Portal DE kurz** (≤ 160 Zeichen)

```text
QR-Code- und Barcode-Scanner für den PC (Windows, Linux, macOS): liest Codes vom Bildschirm per Tastenkürzel, per Webcam, aus Bildern. Offline, MIT.
```

**Portal DE lang** (rund 800 Zeichen)

```text
Lupe ist ein QR-Code- und Barcode-Scanner für den PC. In jedem Programm Win+Umschalt+Q drücken und ein Rechteck um den Code ziehen – in einer PDF, einer E-Mail, auf einer Webseite oder im Videocall, über alle Monitore. Lupe liest Codes außerdem per Webcam, aus Bilddateien und aus der Zwischenablage und findet jeden Code im Bild. Das Ergebnis wird kopiert, in das vorherige Programm eingetippt (unabhängig vom Tastaturlayout) oder per Link-Regel geöffnet. 22 Formate, darunter QR Code, Data Matrix, Aztec, PDF417, Code 128, EAN-13 und GS1 DataBar; Lupe liest nur und erzeugt keine Codes. Mit Verlauf, CSV-Export und Befehlszeile. Arbeitet offline, ohne Telemetrie. Für Windows 10 (ab 1809) und 11, Linux (x64, arm64) und macOS ab 12; Linux und macOS sind weniger getestet. Vorabversion 0.1.1, nicht signiert. Kostenlos und Open Source (MIT), von ICT Baden.
```

**awesome-avalonia** – Abschnitt „Samples and Projects › Productivity“, alphabetisch
([Regeln](https://github.com/AvaloniaCommunity/awesome-avalonia/blob/master/CONTRIBUTING.md): `[Name](link) - Description.`,
Beschreibung unter 100 Zeichen mit Punkt)

```text
- [Lupe](https://github.com/ict-baden/lupe) - Cross-platform QR code and barcode scanner for the screen, webcam, image files and clipboard.
```

**awesome-qr-code** – Abschnitt „Apps › Readers“
([Regeln](https://github.com/make-github-pseudonymous-again/awesome-qr-code/blob/main/CONTRIBUTING.md): „QR code“ nicht
in der Beschreibung, PR-Titel „Add Lupe“ mit Begründung; die Liste mergt ab 5 Daumen und lädt zum Abstimmen ein – wir
bitten trotzdem niemanden darum; Liste wenig aktiv)

```text
- [Lupe](https://github.com/ict-baden/lupe) - Desktop reader for Windows, Linux and macOS that scans the screen, a webcam, image files and the clipboard.
```

**open-source-mac-os-apps** – Eintrag in `applications.json`, erst nach Test auf einem echten Mac, Notarisierung und
5 Sternen
([Regeln](https://github.com/serhii-londar/open-source-mac-os-apps/blob/master/CONTRIBUTING.md))

```json
{
  "short_description": "QR code and barcode scanner that reads codes from the screen, a webcam, image files and the clipboard.",
  "categories": ["utilities"],
  "repo_url": "https://github.com/ict-baden/lupe",
  "title": "Lupe",
  "icon_url": "",
  "screenshots": [],
  "official_site": "https://ict-baden.de/en/products/lupe/",
  "languages": ["c_sharp"]
}
```

**Foren und Reddit** – Threads aus der Recherche, geprüft am 2026-10-21 (Reddit sperrte automatische Abrufe zeitweise; Stand und Daten aus dem Archiv, die Archivierung je Subreddit anhand der Kommentare geschätzt.)

| Thread | Stand | Entscheidung |
|---|---|---|
| [r/software „Use webcam as barcode scanner? Not QR code.“](https://www.reddit.com/r/software/comments/1k545kt/) | 04/2025, archiviert | nicht antworten – genau die Frage, aber geschlossen |
| [r/mildlyinfuriating „My PC webcam can't scan a QR code“](https://www.reddit.com/r/mildlyinfuriating/comments/1whc6s9/my_pc_webcam_cant_scan_a_qr_code/) | 09/2026, offen | nicht antworten – Frust-Subreddit, ein Produkthinweis wirkt dort wie Spam |
| [deskmodder „QR-Code am Desktop auslesen“](https://www.deskmodder.de/phpBB3/viewtopic.php?p=443803) | 05/2025, offen | nicht antworten – der Fragesteller nutzt ShareX und ist zufrieden; das Forum verbietet Werbung |
| [DATEV-Community: Data Matrix der Post-Frankierung](https://www.datev-community.de/t5/Freie-Themen/l%C3%A4sst-sich-der-Datamatrixcode-Deutsche-Post-Frankierung-von/td-p/326872) | 2022, gelöst (Seite sperrt Abrufe, per Schnittstelle gelesen) | nicht antworten |
| [Microsoft Q&A 1103269](https://learn.microsoft.com/en-gb/answers/questions/1103269/is-there-any-free-or-open-source-library-for-barco) | 2022, offen | nicht antworten – gesucht ist eine Bibliothek, Lupe ist eine App |

Statt alter Threads: r/software lässt laut seinen Regeln Release-Beiträge für neue kostenlose, möglichst quelloffene
Programme zu – einmal, nach dem Code-Signing, selbst geschrieben, mit Offenlegung und von einem etablierten
persönlichen Konto (der AutoModerator entfernt Beiträge unter einer nicht genannten Karma-Schwelle). Stichpunkte für neue Fragen („QR-Code am PC
scannen“, „Webcam als Barcodescanner“):

- Erst die Bordmittel: Die Windows-Kamera-App liest QR-Codes und Barcodes im Modus „Barcode“
  ([Microsoft](https://support.microsoft.com/en-us/windows/hardware/camera/how-to-use-the-windows-camera-app)). Als Link
  den Ratgeber nehmen (`https://ict-baden.de/en/guides/barcode-scanner-for-pc/`), der Handscanner, Kamera-App, Webcam
  und Bildschirm vergleicht.
- Offenlegung, dann Lupe: Bildschirmscan per Tastenkürzel, Eintippen in das Programm im Vordergrund, Linux und macOS,
  offline, MIT.
- Grenzen: Kamera bisher nur gegen eine simulierte Quelle getestet, Linux nur in Containern, auf dem Mac nur
  gestartet; Vorabversion 0.1.1.

**Show HN – Titel** (Vorschlag, Kandidat 1)

```text
Show HN: Lupe – read QR codes and barcodes from your screen or webcam
```

**Show HN – Gerüst** (3–5 Sätze **selbst** schreiben: HN verbietet generierten und KI-bearbeiteten Text in Posts; URL: das GitHub-Repo)

- What: reads QR codes and barcodes from the screen (Win+Shift+Q, drag a box), a webcam, image files and the clipboard.
- Result: copied, typed into the window you were working in, or opened through a link rule; webcam works like a hand scanner.
- Tech: Windows, Linux, macOS; .NET 10, Avalonia, zxing-cpp (22 formats); offline, no telemetry.
- Status: 0.1.1; camera only tested against a simulated source, Linux only in containers, on a real Mac only started.
- Ask: reports from real webcams and Macs. MIT.

### 3.3 Zutritt – Berechtigungsbericht für Windows-Dateifreigaben

- **Belegt** (README, `docs/`, Tag v0.1.0): liest Freigabe- (SMB) und NTFS-Berechtigungen einer Freigabe, eines
  Servers, lokaler Ordner oder aller Freigaben des PCs; effektive Rechte wie Windows (gespeicherte Reihenfolge,
  Verweigern, Vererbung, Freigabe mit NTFS), gegen die Zugriffsprüfung von Windows getestet; Gruppen bis zur Person
  (lokale Konten und Gruppen, Active Directory der eigenen Domäne); 15 Prüfregeln; Vergleich mit dem letzten Lauf;
  Excel und PDF mit Block zum Abzeichnen; Befehlszeile mit Exitcodes; nur lesend, kein Server, kein Agent, kein
  Dienst; keine Telemetrie; `Zutritt.exe --demo`. Windows 10 ab 1809 und 11, x64. Vorabversion 0.1.0, nicht signiert.
- **Nicht schreiben:** NAS-Unterstützung, Dauer-Monitoring, Rechte ändern, in einer echten Domäne getestet (AD bisher
  nur gegen ein simuliertes Verzeichnis), Compliance-Zusage. Nicht „Alternative zu 8MAN/SolarWinds ARM“ – das sind
  Suiten, die Rechte ändern; Zutritt liest nur.
- **Seiten:** `https://ict-baden.de/produkte/zutritt/`, `https://ict-baden.de/en/products/zutritt/`,
  `https://github.com/ict-baden/zutritt`; Ratgeber `https://ict-baden.de/ratgeber/verwaiste-sids-jeder-rechte-finden/` und
  `https://ict-baden.de/en/guides/find-orphaned-sids-everyone-permissions/` – Ziel für die Problem-Suchen (verwaiste SIDs,
  „Jeder“-Rechte, Vererbung, NTFS-Rechte nach Excel) und Forenantworten.

| Zielsuche (EN / DE) | Chance |
|---|---|
| NTFS Permissions Reporter / AccessEnum alternative open source | hoch |
| verwaiste SIDs finden, „Jeder“-Rechte, Vererbung unterbrochen / find orphaned SIDs | DE hoch, EN mittel |
| Berechtigungsreport ISO 27001, TISAX, NIS2, Rezertifizierung / file server access review | DE hoch, EN mittel |
| Berechtigungsanalyse Fileserver kostenlos / free folder permissions report tool | mittel |
| wer hat Zugriff auf Ordner, effektive Berechtigungen / who has access to this folder | DE mittel, EN niedrig |
| NTFS-Berechtigungen auslesen, nach Excel exportieren / NTFS permissions report, export to Excel | DE mittel, EN niedrig |

**Wo eintragen**

- AlternativeTo, als Alternative vorschlagen bei:
  [NTFS Permissions Reporter](https://alternativeto.net/software/ntfs-permissions-reporter/about/) (4 Alternativen,
  alle proprietär), [Permissions Reporter](https://alternativeto.net/software/permissions-reporter/about/),
  [NTFS Permissions Auditor](https://alternativeto.net/software/ntfs-permissions-auditor/about/). Die Funktionsseite
  [NTFS permissions](https://alternativeto.net/feature/ntfs-permissions/) führt sechs Apps, keine Open Source.
  AccessEnum hat keine eigene Seite (nur in der Sysinternals Suite).
- Portale: heise Download (Thema ist im Deutschen stark), Softpedia, Snapfiles.
- Paketquellen: winget (der NTFS Permissions Reporter ist dort), Scoop, Chocolatey.
- Awesome-Listen: [awesome-sysadmin](https://github.com/awesome-foss/awesome-sysadmin) passt fachlich, aber nicht vor
  10/2027: Einträge nur über [awesome-sysadmin-data](https://github.com/awesome-foss/awesome-sysadmin-data), erste
  Veröffentlichung muss über 12 Monate zurückliegen, eigene Software nur mit gesunder Gemeinschaft mehrerer
  Beitragender, nicht regelkonforme LLM-Beiträge führen zum Bann. Nicht selbst und nicht über Dritte einreichen.
- Redaktion: WindowsPro hat den NTFS Permissions Reporter vorgestellt – nach dem Release eine kurze Mail.
- GitHub-Topics: gesetzt (u. a. `ntfs-permissions`, `access-review`, `effective-permissions`, `share-permissions`).

**AlternativeTo – Name**

```text
Zutritt
```

**AlternativeTo – Kurzbeschreibung** (1 Satz)

```text
Shows who can access which folder on Windows file shares: NTFS and share permissions, groups resolved down to people, Excel or PDF report.
```

**AlternativeTo – Beschreibung** (600–900 Zeichen, ohne Links)

```text
Zutritt reads SMB share permissions and NTFS ACLs of a share, a whole server or local folders and shows who can access what – and through which group. It computes effective permissions like Windows (stored entry order, deny entries, inheritance, share and NTFS combined), resolves local groups and the Active Directory of the scanning PC's domain down to individual people, and checks them against 15 rules, such as broad groups that can write, orphaned SIDs or moved folders with old rights. A comparison with the previous run shows what changed. Reports: a filterable Excel workbook and a PDF with a sign-off block for access reviews. Read-only; no server, agent or service; command line with exit codes for scheduled tasks. Windows 10 (1809+) and 11, x64. No telemetry. Pre-release 0.1.0, Active Directory tested against a simulated directory so far. Free and open source (MIT).
```

**AlternativeTo – Felder**

```text
Platforms: Windows
License: Open Source (MIT), Free
Tags/Features (vorhandene wählen): NTFS permissions, File server, Active Directory, Access review, Audit, Reporting, Portable, No tracking
Alternative to: NTFS Permissions Reporter, Permissions Reporter, NTFS Permissions Auditor
Website: https://ict-baden.de/en/products/zutritt/
```

**Portal EN kurz** (≤ 160 Zeichen)

```text
Who can access what on Windows file shares? Reads NTFS and share permissions, resolves groups to people and writes an Excel or PDF report. MIT.
```

**Portal EN lang** (rund 800 Zeichen)

```text
Zutritt answers a recurring audit question for Windows file servers: who can access which folder, and through which group? It reads SMB share permissions and NTFS ACLs of a share, a whole server or local folders, computes effective permissions like Windows and resolves local groups and the Active Directory of the scanning PC's domain down to individual people. 15 rules point out risky or unclear permissions – broad groups that can write, orphaned SIDs, rights given to individuals, moved folders – each with an explanation and a recommendation. A comparison with the previous run shows new and resolved findings. Results go into a filterable Excel workbook and a PDF with a sign-off block. Zutritt only reads: no server, no agent, no service, no telemetry; a command line serves scheduled tasks. Windows 10 (1809+) and 11, x64. Pre-release 0.1.0. Free and open source (MIT) by ICT Baden.
```

**Portal DE kurz** (≤ 160 Zeichen)

```text
Wer darf worauf zugreifen? Liest Freigabe- und NTFS-Berechtigungen, löst Gruppen bis zur Person auf, Bericht als Excel oder PDF. Kostenlos, MIT.
```

**Portal DE lang** (rund 800 Zeichen)

```text
Zutritt beantwortet die Frage jeder Berechtigungsprüfung: Wer darf auf welchen Ordner des Fileservers zugreifen – und über welche Gruppe? Es liest Freigabe- und NTFS-Berechtigungen einer Freigabe, eines ganzen Servers oder lokaler Ordner, rechnet die effektiven Rechte wie Windows und löst lokale Gruppen und das Active Directory der eigenen Domäne bis zur einzelnen Person auf. 15 Prüfregeln melden riskante oder unklare Rechte – breite Gruppen mit Schreibrecht, verwaiste SIDs, Rechte direkt an Personen, verschobene Ordner –, jeweils mit Erklärung und Empfehlung. Der Vergleich mit dem letzten Lauf zeigt, was sich geändert hat. Ergebnis: filterbare Excel-Arbeitsmappe und PDF zum Abzeichnen. Zutritt liest nur, braucht keinen Server, keinen Agenten und keinen Dienst und hat keine Telemetrie. Für Windows 10 (ab 1809) und 11. Vorabversion 0.1.0. Kostenlos und Open Source (MIT).
```

**Foren** – Threads aus der Recherche, geprüft am 2026-10-21

| Thread | Stand | Entscheidung |
|---|---|---|
| [administrator.de Tutorial „Benutzerrechte anzeigen über alle Verzeichnisse hinweg“](https://administrator.de/tutorial/howto-benutzerrechte-anzeigen-ueber-alle-verzeichnisse-hinweg-6775.html) | 2005–2011, Anleitung | nicht antworten – dort rügt ein Moderator Herstellerbeiträge in alten Threads als „Nekro-SEO“ |
| [administrator.de „Suche Berechtigungsmanagement Tool“](https://administrator.de/forum/suche-berechtigungsmanagement-tool-287303.html) | 2015–2016 | nicht antworten – gesucht ist Rechteverwaltung, Zutritt liest nur |
| [ComputerBase „NTFS-Berechtigungen auslesen“](https://www.computerbase.de/forum/threads/ntfs-berechtigungen-auslesen.876997/) | 2011–2012 | nicht antworten – 14 Jahre alt |
| [PowerShell.org: verwaiste SIDs entfernen](https://forums.powershell.org/t/resolved-removing-orphaned-sids-from-directories/10701) | 2018, geschlossen | nicht antworten |

Für neue Fragen: Auf administrator.de ([Regeln](https://administrator.de/help/8),
[Leitfaden für Unternehmen](https://administrator.de/help/73)) helfen, ohne das eigene Produkt zu nennen oder zu
verlinken – Produkte gehören dort in den Showcase-Bereich, das Konto soll ein Business Account sein; vollständig
KI-erzeugte Texte müssen mit Modellnamen gekennzeichnet werden. ComputerBase
([Regeln](https://www.computerbase.de/forum/help/terms/)) will keine Werbung; wer für eine Firma spricht, legt das
offen und bekommt die Firma als Benutzertitel. Stichpunkte für Foren, in denen eine offengelegte Nennung erlaubt ist:

- Erst den Weg mit Bordmitteln nennen (icacls, Get-Acl) und wo er endet: Freigaberechte, verschachtelte Gruppen,
  Nachweis für das Audit.
- Offenlegung, dann Zutritt: Freigabe- und NTFS-Rechte, Gruppen bis zur Person, 15 Regeln, Excel und PDF, nur lesend,
  MIT.
- Grenzen: Active Directory nur der eigenen Domäne und bisher nur gegen ein simuliertes Verzeichnis getestet,
  Vorabversion 0.1.0.

**Show HN – Titel** (Vorschlag, nur falls statt Lupe oder Riegel)

```text
Show HN: Zutritt – who can access what on Windows file shares
```

**Show HN – Gerüst** (3–5 Sätze **selbst** schreiben: HN verbietet generierten und KI-bearbeiteten Text in Posts; URL: das GitHub-Repo)

- What: reads share and NTFS permissions, computes effective access like Windows (ACE order, deny, inheritance, share and NTFS).
- Output: groups resolved down to people, 15 rules, comparison with the last run, Excel workbook and PDF to sign.
- Try: read-only, no server or agent; `Zutritt.exe --demo` opens two sample runs without a file server.
- Status: 0.1.0; Active Directory resolution so far tested against a simulated directory only.
- Ask: results from real domains. MIT.

### 3.4 Riegel – Windows-Härtung offline prüfen

- **Belegt** (README, `docs/`, Tag v0.1.2): portabler Sammler (rund 130 KB), ausgelegt für Windows 7 SP1 bis 11 und
  Server 2008 R2 bis 2025 (.NET Framework 3.5.1 oder 4.x), installiert nichts, ändert keine Konfiguration, öffnet keine
  Netzwerkverbindung; Auswerte-App für Windows 10 ab 1809 und Server 2019; Linux-Befehlszeile zum Nachrechnen; 153
  Regeln (Regelwerk 2026.10.1, belegt durch ACSC, Microsoft-Dokumentation, DISA STIGs); begründete und freigegebene
  Ausnahmen mit Ablauf; Vergleich mit dem freigegebenen Stand; PDF zum Abzeichnen, Excel, CSV, Nachweispaket mit
  `verify`; Abhilfe nur als Dateien; Nagios-Exitcodes; `Riegel.exe --demo`. Getestet mit Testdaten und auf CI-Rechnern
  (Server 2022, 2025, Windows 11 Arm64), dazu ein Referenz-Snapshot eines Windows-11-Arbeitsplatzes aus Messungen.
  Vorabversion 0.1, nicht signiert.
- **Nicht schreiben:** prüft CIS-Benchmarks oder BSI SiSyPHuS (enthält keine Inhalte davon), „erfüllt NIS2/IEC 62443“
  (nur „unterstützt Nachweise“), signiert, auf echten Altsystemen getestet. „Härtung“ nie ohne „Windows“, „IT“ oder
  „OT“. Die MSI ist nicht für OT-Rechner – dort nur der Sammler.
- **Seiten:** `https://ict-baden.de/produkte/riegel/`, `https://ict-baden.de/en/products/riegel/`,
  `https://github.com/ict-baden/riegel`; Ratgeber `https://ict-baden.de/ratgeber/windows-haertung-offline-pruefen/` und
  `https://ict-baden.de/en/guides/check-windows-hardening-offline/` – Ziel für „Windows-Härtung OT/Leitstand, offline, ohne
  Agent“ und Forenantworten.

| Zielsuche (EN / DE) | Chance |
|---|---|
| HardeningKitty alternative | hoch (nur Aggregatoren) |
| Windows Härtung OT, Leitstand / harden HMI, engineering workstation | DE hoch, EN mittel |
| Lynis for Windows / Lynis Windows Alternative | mittel |
| Härtung offline prüfen ohne Agent / check security baseline offline, air-gapped | mittel |
| IEC 62443 Windows-Härtung Checkliste / IEC 62443 windows hardening checklist | mittel (nur „unterstützt Nachweise“) |
| CIS-CAT alternative | mittel – nur mit Abgrenzung wie auf der Produktseite (keine CIS-Inhalte), nicht über AlternativeTo |
| Windows Härtung prüfen / windows hardening check tool | DE mittel, EN niedrig |
| CIS benchmark check windows free | niedrig – nicht ansteuern, Riegel prüft keine CIS-Benchmarks |

**Wo eintragen**

- AlternativeTo, als Alternative vorschlagen bei: [Lynis](https://alternativeto.net/software/lynis/about/) (Linux,
  macOS, BSD; die Seite rankt für „Lynis for Windows“) und [Apotrope](https://alternativeto.net/software/apotrope/about/)
  (MIT, offline, rund 55 Prüfungen – ein direkter Open-Source-Gegner, auf den Seiten von Lynis und OpenSCAP schon die
  Windows-Alternative Nr. 1). Nicht bei OpenSCAP (SCAP-Compliance-Scanner), PingCastle (prüft Active Directory) und
  Hardentools (setzt Härtung). HardeningKitty, CIS-CAT und der Policy Analyzer haben keine Seite – keine anlegen.
- Portale: heise Download, Softpedia, Snapfiles.
- Paketquellen: winget, Scoop, Chocolatey – für die Auswerte-App; in der Paketbeschreibung sagen, dass auf
  Anlagen-PCs der Sammler aus dem Tag-Release läuft.
- Awesome-Listen: awesome-security-hardening, awesome-industrial-control-system-security; awesome-sysadmin erst ab
  10/2027 (siehe Zutritt).
- GitHub-Topics: gesetzt (u. a. `windows-hardening`, `security-baseline`, `ot-security`, `iec-62443`). Bewusst ohne
  `cis-benchmark` und `stig`; `compliance`, `compliance-report` und `nis2` überdenken – Riegel macht keine
  Compliance-Aussage.

**AlternativeTo – Name**

```text
Riegel
```

**AlternativeTo – Kurzbeschreibung** (1 Satz)

```text
Offline, read-only hardening check for Windows PCs in plants, labs and control rooms, with 153 rules, justified exceptions and a report to sign.
```

**AlternativeTo – Beschreibung** (600–900 Zeichen, ohne Links)

```text
Riegel checks the security configuration of Windows machines that nobody manages centrally: plant PCs, HMIs, lab and control-room computers. A portable collector of about 130 KB, designed for Windows 7 SP1 to 11 and Server 2008 R2 to 2025, installs nothing, changes no configuration and opens no network connection. Another PC evaluates the snapshot against 153 rules (network, credentials, Defender, firewall, audit, RDP, TLS and more). Settings that must stay open are recorded as justified, approved exceptions with an expiry date. Riegel compares with the approved state and writes a PDF report to sign, Excel and CSV, and an evidence pack that auditors can re-check. Remediation comes as files only; Riegel never applies settings. Contains no CIS Benchmark or BSI SiSyPHuS content. Pre-release 0.1, not code-signed, not yet tested on real Windows 7 machines. Free and open source (MIT).
```

**AlternativeTo – Felder**

```text
Platforms: Windows
License: Open Source (MIT), Free
Tags/Features (vorhandene wählen): Security audit, Hardening, Offline, Portable, Reporting, No tracking
Alternative to: Lynis, Apotrope
Website: https://ict-baden.de/en/products/riegel/
```

**Portal EN kurz** (≤ 160 Zeichen)

```text
Offline, read-only Windows hardening check for plant, lab and control-room PCs: 153 rules, justified exceptions and a PDF report to sign. MIT.
```

**Portal EN lang** (rund 800 Zeichen)

```text
Riegel produces evidence of hardening for Windows machines outside central IT: plant PCs, HMIs, lab and control-room computers, some of them without a network. A portable collector of about 130 KB runs from a USB stick, installs nothing, changes no configuration and opens no network connection; it is designed for Windows 7 SP1 to 11 and Server 2008 R2 to 2025. An analysis PC (Windows 10 1809+ or Server 2019+) evaluates the snapshot against 153 rules backed by ACSC, Microsoft documentation and DISA STIGs. Deliberately open settings become justified, approved exceptions with expiry. Riegel compares with the approved state and writes a plant report to sign, Excel and CSV, and an evidence pack that auditors re-check, also on Linux. Remediation is delivered as files only. Pre-release 0.1, not code-signed. Free and open source (MIT) by ICT Baden.
```

**Portal DE kurz** (≤ 160 Zeichen)

```text
Windows-Härtung offline prüfen: nur lesend, nichts auf dem Anlagen-PC installiert, 153 Regeln, begründete Ausnahmen, Bericht zum Abzeichnen. MIT.
```

**Portal DE lang** (rund 800 Zeichen)

```text
Riegel liefert den Härtungsnachweis für Windows-Rechner außerhalb der zentralen IT: Anlagen-PCs, Bedienrechner (HMI), Labor- und Leitstandsrechner, manche ohne Netz. Ein portabler Sammler (rund 130 KB) läuft vom USB-Stick, installiert nichts, ändert keine Konfiguration und öffnet keine Netzwerkverbindung; ausgelegt ist er für Windows 7 SP1 bis 11 und Server 2008 R2 bis 2025. Ein Auswerte-PC prüft die Erhebung gegen 153 Regeln, belegt durch ACSC, Microsoft-Dokumentation und DISA STIGs. Bewusst Offenes wird als begründete, freigegebene Ausnahme mit Ablaufdatum festgehalten. Riegel vergleicht mit dem freigegebenen Stand und schreibt einen Bericht zum Abzeichnen, Excel und CSV sowie ein Nachweispaket für Prüfer. Abhilfe gibt es nur als Dateien. Keine Inhalte von CIS oder BSI SiSyPHuS. Vorabversion 0.1, nicht signiert. Kostenlos und Open Source (MIT).
```

**awesome-security-hardening** – Abschnitt „Tools › Tools to check security hardening › Windows“
([Liste](https://github.com/decalage2/awesome-security-hardening), Vorschläge als Issue oder PR; der Maintainer stellt
brandneue, möglicherweise KI-generierte Tools zurück, bis es positive Rückmeldungen gibt (PR #138) – erst nach Nutzung
durch Dritte einreichen, Eigenentwicklung und KI-Anteil im PR offenlegen)

```text
- [Riegel](https://github.com/ict-baden/riegel) - offline, read-only hardening check for plant, lab and control-room Windows PCs (153 rules, justified exceptions, report to sign); collector designed for Windows 7 SP1 to 11 and Server 2008 R2 to 2025, older systems not yet tested
```

**awesome-industrial-control-system-security** – Abschnitt „Tools“, Tabellenzeile im vorhandenen HTML-Format
([Liste](https://github.com/hslatman/awesome-industrial-control-system-security), ein PR je Vorschlag, letzte
Änderung 10/2025)

```html
    <tr>
        <td>
            <a href="https://github.com/ict-baden/riegel" target="_blank">Riegel</a>
        </td>
        <td>
            Offline, read-only hardening check for Windows plant PCs and HMIs: a portable collector reads the configuration without installing anything, another PC evaluates 153 rules, records justified exceptions and writes a report to sign.
        </td> 
    </tr>
```

**Foren und Reddit** – Threads aus der Recherche, geprüft am 2026-10-21 (Reddit sperrte automatische Abrufe zeitweise; Stand und Daten aus dem Archiv, die Archivierung je Subreddit anhand der Kommentare geschätzt.)

| Thread | Stand | Entscheidung |
|---|---|---|
| [r/sysadmin „Windows security audit tool recommendations?“](https://www.reddit.com/r/sysadmin/comments/1i9rh9n/) | 01/2025, vom Spamfilter entfernt und archiviert | nicht antworten |

Für neue Fragen (r/sysadmin: Offenlegung Pflicht, kein KI-Text) – Stichpunkte, selbst formulieren:

- Erst klären, was geprüft werden soll: Konfiguration (Härtung) oder Schwachstellen; die Bordmittel `secedit`,
  `auditpol` und `reg` reichen für einzelne Werte.
- Offenlegung, dann Riegel: offline und nur lesend, portabler Sammler, 153 Regeln, begründete Ausnahmen, Bericht zum
  Abzeichnen, MIT.
- Grenzen: keine Inhalte von CIS oder BSI SiSyPHuS, keine Compliance-Aussage, Vorabversion, nicht signiert.

**Show HN – Titel** (Vorschlag, Kandidat 2)

```text
Show HN: Riegel – offline, read-only Windows hardening check for plant PCs
```

**Show HN – Gerüst** (3–5 Sätze **selbst** schreiben: HN verbietet generierten und KI-bearbeiteten Text in Posts; URL: das GitHub-Repo)

- What: hardening check for Windows machines that can't take an agent or an install (HMIs, lab and control-room PCs).
- How: ~130 KB collector from a USB stick; installs nothing, changes no configuration, writes only its snapshot; another PC evaluates 153 rules (ACSC, Microsoft docs, DISA STIGs).
- Output: justified exceptions with approving role and expiry, report to sign, evidence pack auditors re-verify; remediation only as files.
- Try: `Riegel.exe --demo` opens a sample plant.
- Status: 0.1; tested on fixtures and CI runners plus a reference snapshot of a Windows 11 workstation, not yet on real Windows 7/2008 R2 machines. MIT.

### 3.5 Plakette – Etiketten-Designer für Zebra-Drucker (ZPL)

- **Belegt** (README, `docs/`, Tag v0.2.0): Desktop-App für Windows 11 und 10 22H2 (x64) und Linux x64/arm64 (X11
  oder XWayland), kein macOS; Zeichenfläche in Druckerpunkten; Druckerschriften und TrueType, Barcodes (Code 128,
  GS1-128, SSCC, EAN/UPC, ITF-14, Code 39, QR Code, Data Matrix, PDF417 mit GS1-Prüfung); Variablen, Zähler ohne
  Wiederholung, Daten aus CSV, Excel ohne Office, ODBC, SQLite; Druck ohne Treiber über TCP 9100, TLS 9143,
  Windows-Spooler (RAW) oder Datei; ZPL-Import (Druck in Datei, gespeicherte Formate); Befehlszeile, Druckstation,
  `--demo` mit virtuellen Druckern; keine Telemetrie, keine Update-Prüfung, kein Lizenzserver; Oberfläche Avalonia.
  Vorabversion, Ausgabe nur gegen den virtuellen Drucker geprüft, nicht signiert.
- **Nicht schreiben:** Funktionsgleichheit oder vollständiger Ersatz eines Fremdprodukts (Ziel, nicht Stand),
  Abnahmebericht der Migrationswerkbank, ADMX-Vorlagen (Website-Regel; README und `docs/installation.md` nennen
  inzwischen `Plakette-policies.zip` – erst nach Abgleich der Regel erwähnen), Tests an echten Druckern, macOS. ZPL nur beschreibend
  („prints ZPL“), nie als Namensbestandteil; Plakette ist nicht mit Zebra verbunden.
- **Seiten:** `https://ict-baden.de/produkte/plakette/`, `https://ict-baden.de/en/products/plakette/`,
  `https://github.com/ict-baden/plakette`.
- **Zeitpunkt:** AlternativeTo und Portale gehen mit dem Vermerk „verified against a virtual printer only“; Show HN
  und Foren erst nach der Hardware-Abnahme an echten Druckern.

| Zielsuche (EN / DE) | Chance |
|---|---|
| Zebra-Etiketten unter Linux / zebra designer linux, zebra label software linux | mittel, mit Download hoch |
| Etiketten aus Excel, fortlaufende Nummern / print labels from excel zebra | DE mittel–hoch, EN mittel |
| ZPL unter Linux drucken / print zpl from linux, „zebra prints code instead of label“ | mittel |
| SSCC-Etikett, GS1-128, Laborröhrchen / SSCC label, cryo tube labels | DE mittel |
| ZebraDesigner Alternative / zebra designer alternative | DE mittel, EN niedrig (über AlternativeTo leichter) |
| ZPL Editor kostenlos / ZPL designer, editor | niedrig–mittel |
| BarTender oder NiceLabel Alternative kostenlos | niedrig, über Verzeichnisse mittel |

**Wo eintragen**

- AlternativeTo, als Alternative vorschlagen bei:
  [ZebraDesigner](https://alternativeto.net/software/zebradesigner/about/) (22 Alternativen, Open Source nur gLabels,
  QZ Tray, ZPLab), [NiceLabel](https://alternativeto.net/software/nicelabel/about/),
  [gLabels](https://alternativeto.net/software/glabels/about/), [ZPLab](https://alternativeto.net/software/zplab/about/)
  (MIT, Browser und Desktop – direkter Gegner). [Seagull BarTender](https://alternativeto.net/software/seagull-bartender/about/)
  erst, wenn die Pilotfunktionen stehen.
- Portale: Softpedia (Windows und Linux), heise Download, Snapfiles.
- Paketquellen: winget, Scoop, Chocolatey, AUR; Flathub erst nach einigen Monaten Nutzung (Schritt 9); deb-Pakete
  gibt es schon.
- Awesome-Listen: awesome-avalonia. Awesome-Linux-Software ist archiviert.
- GitHub-Topics: gesetzt (u. a. `zpl`, `label-designer`, `zebra-printer`, `sscc`).

**AlternativeTo – Name**

```text
Plakette
```

**AlternativeTo – Kurzbeschreibung** (1 Satz)

```text
Label designer for Zebra and compatible printers: design labels on Windows or Linux and print ZPL directly, without a printer driver.
```

**AlternativeTo – Beschreibung** (600–900 Zeichen, ohne Links)

```text
Plakette is a desktop label designer for Zebra and compatible label printers. The canvas shows the label at the printer's dots: text in printer fonts or TrueType, barcodes (Code 128, GS1-128/SSCC, EAN/UPC, ITF-14, Code 39, QR Code, Data Matrix, PDF417 with GS1 validation), pictures and shapes. Variables, counters that never repeat and data from CSV, Excel (without Office), ODBC or SQLite. Plakette sends ZPL straight to the printer over TCP 9100, TLS, the Windows spooler (RAW) or to a file – no printer driver, no licence server, no admin rights. Existing labels can be imported from ZPL (print to file or stored formats). Command line for scripts and a print-station mode. Windows 10 22H2 and 11 (x64), Linux x64/arm64; no macOS. No telemetry. Pre-release: output verified against a virtual printer only so far. Free and open source (MIT).
```

**AlternativeTo – Felder**

```text
Platforms: Windows, Linux
License: Open Source (MIT), Free
Tags/Features (vorhandene wählen): Label printing, Label designer, Barcode, ZPL, Zebra printers, Command line, No tracking
Alternative to: ZebraDesigner, NiceLabel, gLabels, ZPLab
Website: https://ict-baden.de/en/products/plakette/
```

**Portal EN kurz** (≤ 160 Zeichen)

```text
Label designer for Zebra and compatible printers on Windows and Linux: design labels and print ZPL directly – no driver, no licence server. MIT.
```

**Portal EN lang** (rund 800 Zeichen)

```text
Plakette designs labels for Zebra and compatible label printers and sends them as ZPL straight to the printer – over the network (port 9100 or TLS), through the Windows spooler as RAW or to a file. No printer driver, licence server or administrator rights are needed. The desktop app shows the label at the printer's dots and supports printer fonts and TrueType, common barcodes with GS1 validation, variables, non-repeating counters and data from CSV, Excel, ODBC or SQLite. Existing labels come in through ZPL import. A command line prints from scripts, and a print-station mode limits a PC to templates from approved folders and to allowed printers. Windows 10 22H2 and 11 (x64), Linux (x64, arm64). No telemetry. Pre-release: printing is verified against a virtual printer so far, not yet on real printers. Free and open source (MIT) by ICT Baden.
```

**Portal DE kurz** (≤ 160 Zeichen)

```text
Etiketten-Designer für Zebra- und kompatible Drucker unter Windows und Linux: gestalten und ZPL direkt drucken – ohne Treiber und Lizenzserver. MIT.
```

**Portal DE lang** (rund 800 Zeichen)

```text
Plakette gestaltet Etiketten für Zebra- und kompatible Etikettendrucker und schickt sie als ZPL direkt an den Drucker – über das Netzwerk (Port 9100 oder TLS), über den Windows-Spooler als RAW oder in eine Datei. Druckertreiber, Lizenzserver oder Administratorrechte sind nicht nötig. Die Desktop-App zeigt das Etikett in den Punkten des Druckers und kennt Druckerschriften und TrueType, gängige Barcodes mit GS1-Prüfung, Variablen, Zähler ohne Wiederholung und Daten aus CSV, Excel, ODBC oder SQLite. Vorhandene Etiketten kommen per ZPL-Import herüber. Eine Befehlszeile druckt aus Skripten, der Druckstationsmodus beschränkt einen PC auf Vorlagen aus freigegebenen Ordnern und erlaubte Drucker. Für Windows 10 22H2 und 11 (x64) und Linux (x64, arm64). Keine Telemetrie. Vorabversion: Druckausgabe bisher nur gegen einen virtuellen Drucker geprüft. Kostenlos und Open Source (MIT).
```

**awesome-avalonia** – Abschnitt „Samples and Projects › Productivity“, alphabetisch

```text
- [Plakette](https://github.com/ict-baden/plakette) - Label designer for Zebra and compatible printers that prints ZPL directly, on Windows and Linux.
```

**Foren** – Threads aus der Recherche, geprüft am 2026-10-21

| Thread | Stand | Entscheidung |
|---|---|---|
| developer.zebra.com, Thread 32115 (Etiketten aus Excel) | 2016, Seite gelöscht (404) | – |
| [administrator.de „Software Lizenz Zebra Drucker“](https://administrator.de/forum/software-lizenz-zebra-drucker-311481.html) | 2016, gelöst | nicht antworten – anderes Thema (Druckerverwaltung) |

Neue Fragen erst nach der Hardware-Abnahme beantworten. Stichpunkte, etwa zu „ZPL unter Linux drucken“:

- Erst den Weg ohne Zusatzprogramm nennen: ZPL als Rohdaten an Port 9100 oder über eine Raw-Warteschlange.
- Offenlegung, dann Plakette: gestalten und ZPL direkt drucken, Windows und Linux, Befehlszeile, MIT.
- Grenzen: Vorabversion, Ergebnis der Hardware-Abnahme nennen.

**Show HN – Titel** (Vorschlag, nur falls statt Lupe oder Riegel, erst nach der Hardware-Abnahme)

```text
Show HN: Plakette – a label designer for Zebra printers on Windows and Linux
```

**Show HN – Gerüst** (3–5 Sätze **selbst** schreiben: HN verbietet generierten und KI-bearbeiteten Text in Posts; URL: das GitHub-Repo)

- What: label designer that sends ZPL straight to Zebra and compatible printers (port 9100, TLS, Windows spooler, file).
- No printer driver, licence server or admin rights; canvas in printer dots; barcodes with GS1 validation.
- Data from CSV, Excel, ODBC, SQLite; ZPL import of existing labels; command line; `--demo` with virtual printers.
- Status: name the result of the hardware acceptance test (until then: verified against a virtual printer only).
- Ask: which labels and printers people would test it with. Windows and Linux, MIT.

### 3.6 Pforte – Kiosk-Browser für Android-MDE-Geräte

- **Belegt** (README, `docs/`, Tag v0.6.1): Kiosk-Browser auf Basis von Android WebView; Scans von Zebra DataWedge,
  Honeywell oder jeder Scanner-App per Intent als Tastatureingabe ins aktive Feld (Tab/Enter) und als Ereignis
  `pforte:scan`; Web-Apps ohne Änderung; Profile, Kioskmodus, URL-Allowlist (Navigationen und Formular-POSTs im
  Hauptfenster), Lock Task als Device Owner, Meta-Tags, JavaScript-API, eigenes CSS/JS, Tastenbelegung; Konfiguration
  per Managed Configuration aus jedem Android-Enterprise-EMM, Datei, StageNow oder QR-Code; kein Konto, keine Werbung,
  keine Telemetrie; Android 8.0+; auf echter Hardware getestet: Zebra HC20 (mit 0.5.0). Früher „EnterpriseBrowser“.
- **Nicht schreiben:** Kompatibilität mit den APIs oder der Konfiguration des Zebra Enterprise Browser,
  Terminal-Emulation (Telnet, 5250, 3270, VT), Offline-Modus, Honeywell-Gerätetest, Test anderer Zebra-Modelle,
  SAP-Zertifizierung, dass die Allowlist Skripte, Bilder, iframes oder XHR blockiert. „EnterpriseBrowser“ nur als
  früherer Name, nie als Gattung.
- **Seiten:** `https://ict-baden.de/produkte/pforte/`, `https://ict-baden.de/en/products/pforte/`,
  `https://github.com/ict-baden/pforte`. Ratgeber (zum Industrial Kiosk Browser):
  `https://ict-baden.de/ratgeber/barcode-scan-im-browser-mde/` und
  `https://ict-baden.de/en/guides/barcode-scan-web-app-android-handheld/` – Ziel für „Scan kommt im Browser nicht an“ und
  Forenantworten wie die unten skizzierte.
- **Zeitpunkt:** erst eintragen, wenn ein Release eine signierte APK enthält (heute nur SBOM und Prüfsummen).

| Zielsuche (EN / DE) | Chance |
|---|---|
| open source enterprise browser zebra honeywell; Fully Kiosk / SureFox alternative open source | hoch über AlternativeTo |
| Browser für MDE-Geräte, Webbrowser Handscanner Lager / browser for handheld scanner | mittel–hoch |
| Alternative zu Zebra Enterprise Browser, EB-Lizenzkosten / zebra enterprise browser alternative | mittel |
| Kiosk-Browser mit Barcodescanner / kiosk browser barcode scanner android | mittel |
| „Scanner schreibt nicht in Browser“ / datawedge web app javascript | mittel |
| Intune / SOTI / StageNow kiosk browser | mittel |
| ivanti velocity alternative | mittel – nur mit Abgrenzung wie auf der Produktseite (nur Web-Apps, keine Terminal-Emulation), nicht über AlternativeTo |
| Kiosk-Browser Android / android kiosk browser | niedrig (MDM-Anbieter) |

**Wo eintragen**

- AlternativeTo, als Alternative vorschlagen bei: [Fully kiosk](https://alternativeto.net/software/fully-kiosk/about/)
  (0 Alternativen – Pforte wäre die erste), [SureFox](https://alternativeto.net/software/surefox/about/) (8
  Alternativen, alle proprietär). Auf der Funktionsseite
  [Kiosk browser](https://alternativeto.net/feature/kiosk-browser/) steht kein Open-Source-Kiosk-Browser für Android.
  Zebra Enterprise Browser und Ivanti Velocity haben keine Seite – keine anlegen (Velocity ist vor allem
  Terminal-Emulation).
- Stores: Google Play (für Managed Google Play), F-Droid; nicht IzzyOnDroid (KI-Regel, Schritt 9); Softpedia (Android)
  und heise Download.
- Awesome-Listen: [android-foss](https://github.com/offa/android-foss), Rubrik „Browser“, frühestens ab 04/2027 (mindestens
  sechs Monate aktive Entwicklung; nur Links auf das Repo, F-Droid oder IzzyOnDroid, keine Play-Links). Dort steht
  schon „Webview Kiosk“ als Open-Source-Kiosk-Browser – also nicht „der einzige“ schreiben.
- GitHub-Topics: gesetzt (u. a. `kiosk-browser`, `datawedge`, `industrial-browser`, `android-kiosk`).

**AlternativeTo – Name**

```text
Pforte
```

**AlternativeTo – Kurzbeschreibung** (1 Satz)

```text
Kiosk browser for rugged Android devices: barcode scans from DataWedge, Honeywell or intents go straight into web forms, configured by MDM.
```

**AlternativeTo – Beschreibung** (600–900 Zeichen, ohne Links)

```text
Pforte runs web apps on rugged Android handhelds in warehouses, production and logistics. Scans from Zebra DataWedge, Honeywell scanners or other scanner apps via intent are typed into the focused field like keyboard input, optionally followed by Tab or Enter, and are also reported as a JavaScript event, so existing web apps work without changes. Kiosk mode hides toolbar and system bars and can password-protect the exit; with a URL allow list, navigation to other hosts is stopped; lock task mode on device-owner devices. Profiles for several web apps, custom CSS and JavaScript. Configuration as JSON via managed configuration from any Android Enterprise EMM, as a file, via StageNow or a QR code. No account, no ads, no telemetry. Android 8.0+. A web browser, not a terminal emulator. Version 0.6; the device test on a Zebra HC20 was with 0.5. Free and open source (MIT).
```

**AlternativeTo – Felder**

```text
Platforms: Android
License: Open Source (MIT), Free
Tags/Features (vorhandene wählen): Kiosk browser, Kiosk mode, Barcode scanner, MDM, Android Enterprise, Ad-free, No tracking
Alternative to: Fully Kiosk Browser, SureFox
Website: https://ict-baden.de/en/products/pforte/
```

**Portal EN kurz** (≤ 160 Zeichen)

```text
Kiosk browser for rugged Android devices (Zebra, Honeywell): scans go straight into web forms, kiosk mode, URL allow list, MDM. MIT.
```

**Portal EN lang** (rund 800 Zeichen)

```text
Pforte is a kiosk browser for rugged Android devices, for example from Zebra and Honeywell. It opens your web apps and types barcode scans from Zebra DataWedge, Honeywell scanners or other scanner apps via intent straight into the focused input field, optionally followed by Tab or Enter. Existing web apps work without changes; web developers can also use a scan event, meta tags and a JavaScript API. Kiosk mode hides the toolbar and system bars and can hide or password-protect the exit, a URL allow list stops navigation to other hosts, and profiles hold several web apps on one device. The configuration comes as JSON from your MDM, as a file, via StageNow or a QR code. No account, no ads, no telemetry. Android 8.0 or later. A web browser, not a terminal emulator. Version 0.6; the device test on a Zebra HC20 was with 0.5. Free and open source (MIT) by ICT Baden.
```

**Portal DE kurz** (≤ 160 Zeichen)

```text
Kiosk-Browser für robuste Android-Geräte (Zebra, Honeywell): Scans direkt ins Webformular, Kioskmodus, URL-Allowlist, Konfiguration per MDM. MIT.
```

**Portal DE lang** (rund 800 Zeichen)

```text
Pforte ist ein Kiosk-Browser für robuste Android-Geräte, zum Beispiel von Zebra und Honeywell. Er öffnet Ihre Web-Apps und schreibt Barcode-Scans von Zebra DataWedge, von Honeywell-Scannern oder von anderen Scanner-Apps per Intent direkt in das aktive Eingabefeld, auf Wunsch mit Tab oder Enter danach. Vorhandene Web-Apps funktionieren ohne Änderung; dazu gibt es ein Scan-Ereignis, Meta-Tags und eine JavaScript-API. Der Kioskmodus blendet Werkzeug- und Systemleisten aus und kann das Beenden ausblenden oder mit Kennwort schützen; eine URL-Allowlist stoppt Navigationen zu anderen Hosts. Die Konfiguration kommt als JSON aus dem MDM, als Datei, per StageNow oder QR-Code. Kein Konto, keine Werbung, keine Telemetrie. Ab Android 8.0. Ein Webbrowser, keine Terminal-Emulation. Version 0.6; der Gerätetest auf einem Zebra HC20 lief mit 0.5. Kostenlos und Open Source (MIT).
```

**android-foss** – Rubrik „Browser“, alphabetisch, frühestens 04/2027; der Repo-Link genügt, den F-Droid-Link
`<sup>**[[F-Droid](https://f-droid.org/packages/de.ictbaden.pforte)]**</sup>` erst anhängen, wenn es den Eintrag gibt
([Kriterien](https://github.com/offa/android-foss/blob/master/CONTRIBUTING.md))

```text
* [**Pforte**](https://github.com/ict-baden/pforte)
```

**Foren und Reddit** – Threads aus der Recherche, geprüft am 2026-10-21 (Reddit sperrte automatische Abrufe zeitweise; Stand und Daten aus dem Archiv, die Archivierung je Subreddit anhand der Kommentare geschätzt.)

| Thread | Stand | Entscheidung |
|---|---|---|
| [r/sysadmin „Zebra MC930B is going to get me fired“](https://www.reddit.com/r/sysadmin/comments/1jw3h72/) | 04/2025, archiviert | nicht antworten |
| [r/honeywell „Enterprise Brower“](https://www.reddit.com/r/honeywell/comments/z8xl0z/enterprise_brower/) | 2022, offen | nicht antworten – die Geräte des Fragestellers (CT50, Android 6.0.1) liegen unter Pfortes Mindestversion Android 8.0, und die Enterprise-Browser-APIs unterstützt Pforte nicht |
| [r/Intune „Deploy files to Android Devices“](https://www.reddit.com/r/Intune/comments/1fpaqrc/deploy_files_to_android_devices/) | 2024, offen | nicht antworten – es geht um das Verteilen eines DataWedge-Profils für eine eigene App; r/Intune verbietet KI-Kommentare |
| developer.zebra.com, Thread 35251 | Blogbeitrag von Zebra, keine Frage | – |

Für neue Fragen (etwa „Scan kommt in der Web-App nicht an“) – Stichpunkte, selbst formulieren:

- Erst bei der eigentlichen Frage helfen (DataWedge-Profil und Ausgabe der App), soweit möglich.
- Offenlegung, dann Pforte: Kiosk-Browser, Scans ins aktive Feld, legt ein eigenes DataWedge-Profil an,
  Konfiguration per MDM, MIT.
- Grenzen: Webbrowser, keine Terminal-Emulation, keine Enterprise-Browser-APIs, Android 8.0 oder neuer, bisher nur
  auf einem Zebra HC20 getestet (mit 0.5).

**Show HN – Titel** (Vorschlag, nur falls statt Lupe oder Riegel, erst mit APK im Release)

```text
Show HN: Pforte – open-source kiosk browser for rugged Android scanners
```

**Show HN – Gerüst** (3–5 Sätze **selbst** schreiben: HN verbietet generierten und KI-bearbeiteten Text in Posts; URL: das GitHub-Repo)

- What: kiosk browser for rugged Android handhelds; scans from DataWedge, Honeywell or intents go into the focused web field.
- Existing web apps need no changes; scan event and a small JavaScript API for more control.
- Kiosk mode, URL allow list, profiles; one JSON pushed by the MDM as managed configuration.
- Limits: web browser, not a terminal emulator; device test so far on one Zebra HC20 (with 0.5).
- Ask: reports from other Zebra models and Honeywell devices. MIT, no telemetry.

### 3.7 Industrial Keyboard – Android-Tastatur mit F1–F24 für MDE-Geräte

- **Belegt** (README, `docs/`, Tag v2.1.1): Android-Eingabemethode; Tastenhöhe 70–160 % (120–140 % für Handschuhe),
  Vorschau über dem Finger, kontrastreiches Design; Fn-Reiter mit F1–F12, Esc, Einfg, Entf, Pos1, Ende, Bild auf/ab,
  Pfeiltasten, mit Umschalt F13–F24 (gesendet als Umschalt+F1…F12, wie 5250-Emulatoren es erwarten); Scan-Reiter mit
  Software-Auslöser für Zebra DataWedge, Honeywell und andere Scanner-Apps per Intent; passende Ziffernblöcke je Feld;
  eigene Layouts und Makros in JSON; QWERTY, QWERTZ, AZERTY, Nordisch, Spanisch; Konfiguration per Managed
  Configuration, Datei oder StageNow, Admin-Kennwort; keine Internetberechtigung, kein Wörterbuch, nichts Getipptes
  gespeichert; Android 8.0+; getestet auf einem Zebra HC20, Honeywell-Auslöser nur nach Herstellerdoku. APK 6,2 MB im
  Tag-Release.
- **Nicht schreiben:** RDP, SAP, Honeywell auf Hardware getestet, dass die feste Reihe mehr als F1–F12 zeigt (Esc,
  Einfg, Entf, Pos1/Ende, Bild auf/ab und Pfeile gibt es nur auf dem Fn-Reiter), Übernahme der Konfiguration anderer
  Tastatur-Apps. Den Zusatz „for RDP & SAP“ aus der Recherche nicht verwenden.
- **Name:** „Industrial Keyboard“ ist ein Hardware-Begriff – in Titeln immer mit Zusatz, z. B. „Industrial Keyboard –
  Android keyboard with F1–F24 for rugged devices“.
- **Seiten:** `https://ict-baden.de/produkte/industrial-keyboard/`, `https://ict-baden.de/en/products/industrial-keyboard/`,
  `https://github.com/ict-baden/industrialkeyboard`; Ratgeber
  `https://ict-baden.de/ratgeber/android-tastatur-f-tasten-terminal-emulation/` und
  `https://ict-baden.de/en/guides/android-keyboard-function-keys-terminal-emulation/` – Ziel für „F13–F24 auf Android“ und
  Forenantworten.

| Zielsuche (EN / DE) | Chance |
|---|---|
| Tastatur F13 bis F24 Android / android keyboard F13–F24 | hoch (keine Bildschirmtastatur im Index, wenig Nachfrage) |
| Zebra Enterprise Keyboard alternative, Honeywell keyboard F keys | mittel–hoch |
| Terminal-Emulation Tastatur, 5250, Ziffernblock-Enter, Einfg-Taste Android / terminal emulator keyboard | mittel bis hoch |
| Android Tastatur mit F-Tasten / android keyboard with function keys F1–F12 | DE mittel, EN niedrig |
| Hacker's Keyboard alternative | niedrig, über AlternativeTo mittel |
| keyboard with F keys for RDP android; SAP F keys Zebra scanner | nicht ansteuern, solange RDP und SAP nicht getestet sind |

**Wo eintragen**

- AlternativeTo, als Alternative vorschlagen bei:
  [Hacker's Keyboard](https://alternativeto.net/software/hackerand-39-s-keyboard/about/) (eingestellt, 48
  Alternativen), [Unexpected Keyboard](https://alternativeto.net/software/unexpected-keyboard/about/). Zebra Enterprise
  Keyboard hat keine Seite. Erster Kandidat für AlternativeTo: Release mit APK, kein Sperrpunkt.
- Stores: Google Play, F-Droid; nicht IzzyOnDroid (KI-Regel, Schritt 9); Softpedia (Android). Die APK (6,2 MB)
  liegt im Tag-Release.
- Awesome-Listen: android-foss, Rubrik „Keyboard“, frühestens 04/2027 (wie Pforte).
- GitHub-Topics: gesetzt (u. a. `android-keyboard`, `function-keys`, `terminal-emulation`); `android-ime` fehlt noch.

**AlternativeTo – Name**

```text
Industrial Keyboard
```

**AlternativeTo – Kurzbeschreibung** (1 Satz)

```text
On-screen keyboard for rugged Android devices with F1–F24, big keys for gloves, a scan key and configuration through your MDM.
```

**AlternativeTo – Beschreibung** (600–900 Zeichen, ohne Links)

```text
Industrial Keyboard is an Android input method for warehouse, production and logistics handhelds. The Fn tab holds F1–F12, Esc, Ins, Del, Home/End, PgUp/PgDn and arrows; Shift turns the function keys into F13–F24, sent as Shift+F1…F12, the mapping 5250 terminal emulators use. Key height 70–160 % for gloves, a scan tab that pulls the soft trigger of Zebra DataWedge, Honeywell or other scanner apps, number fields that open the matching numeric pad, custom layouts and macros in JSON, and QWERTY, QWERTZ, AZERTY, Nordic and Spanish layouts. The whole keyboard is configured from any EMM through managed configuration, a file or StageNow, protected by an admin password. No internet permission, no dictionary, nothing typed is stored. Android 8.0+, tested on a Zebra HC20; the Honeywell trigger follows the vendor documentation. Free and open source (MIT).
```

**AlternativeTo – Felder**

```text
Platforms: Android
License: Open Source (MIT), Free
Tags/Features (vorhandene wählen): Keyboard, Function keys, On-screen keyboard, Barcode scanner, MDM, Privacy focused, Ad-free, No tracking
Alternative to: Hacker's Keyboard, Unexpected Keyboard
Website: https://ict-baden.de/en/products/industrial-keyboard/
```

**Portal EN kurz** (≤ 160 Zeichen)

```text
On-screen keyboard for rugged Android devices: F1–F24, glove-sized keys, a scan key, configured by MDM, no internet permission. MIT licence.
```

**Portal EN lang** (rund 800 Zeichen)

```text
Industrial Keyboard is an on-screen keyboard for rugged Android devices in warehouses, production and logistics, for example from Zebra and Honeywell. Big keys for gloves (key height 70–160 %), a scan tab with a large trigger area for Zebra DataWedge, Honeywell or any scanner app via intent, and a Fn tab with F1–F12, Esc, Ins, Del, Home, End, page and arrow keys – Shift adds F13–F24 for terminal emulation. Number fields open the matching numeric pad. Custom layouts such as OK / Skip / Damaged and macros are defined in JSON without an app update. The keyboard is configured centrally through managed configuration from any EMM, a configuration file or StageNow, protected by an admin password. No internet permission, no dictionary, nothing typed is stored. Android 8.0 or later, tested on a Zebra HC20. Free and open source (MIT) by ICT Baden.
```

**Portal DE kurz** (≤ 160 Zeichen)

```text
Bildschirmtastatur für robuste Android-Geräte: F1–F24, große Tasten für Handschuhe, Scan-Taste, per MDM konfigurierbar, ohne Internet. MIT.
```

**Portal DE lang** (rund 800 Zeichen)

```text
Industrial Keyboard ist eine Bildschirmtastatur für robuste Android-Geräte in Lager, Logistik und Produktion, zum Beispiel von Zebra und Honeywell. Große Tasten für Handschuhe (Tastenhöhe 70–160 %), ein Scan-Reiter für Zebra DataWedge, Honeywell oder jede Scanner-App per Intent und ein Fn-Reiter mit F1–F12, Esc, Einfg, Entf, Pos1, Ende, Bild- und Pfeiltasten – mit Umschalt kommen F13–F24 für Terminal-Emulationen dazu. Zahlenfelder öffnen den passenden Ziffernblock. Eigene Layouts wie OK / Überspringen / Beschädigt und Makros werden in JSON festgelegt, ohne App-Update. Konfiguriert wird zentral per Managed Configuration aus jedem EMM, als Datei oder per StageNow, geschützt durch ein Admin-Kennwort. Keine Internetberechtigung, kein Wörterbuch, nichts Getipptes wird gespeichert. Ab Android 8.0, getestet auf einem Zebra HC20. Kostenlos und Open Source (MIT).
```

**android-foss** – Rubrik „Keyboard“, alphabetisch, frühestens 04/2027; F-Droid-Link wie bei Pforte erst mit Eintrag

```text
* [**Industrial Keyboard**](https://github.com/ict-baden/industrialkeyboard)
```

**Foren** – Threads aus der Recherche, geprüft am 2026-10-21

| Thread | Stand | Entscheidung |
|---|---|---|
| [developer.zebra.com „MC3300 keyboard“](https://developer.zebra.com/content/mc3300-keyboard) | 11/2024, offen; die einzige Antwort schlägt schon die Bildschirmtastatur des RDP-Clients oder eine Tastenumbelegung vor | nicht antworten – fast zwei Jahre alt, und RDP ist bei uns ungetestet |
| [Devolutions-Forum „FN key in Devolutions Mobile on Android“](https://forum.devolutions.net/topics/33259) | 2020, vom Hersteller gelöst | nicht antworten |
| [Neowin „Looking for alternative to Hacker's Keyboard“](https://www.neowin.net/forum/topic/1386436-looking-for-alternative-to-hackers-keyboard/) | 2019, geschlossen (Seite sperrt Abrufe, Stand aus dem Webarchiv) | nicht antworten |

Für neue Fragen nach F-Tasten in RDP- oder SAP-Sitzungen gilt: Erst wenn ein Test mit einem RDP-Client auf einem
Gerät bestanden ist, das Ergebnis in `docs/limitations.md` des Repos eintragen, dann die Regel „Nicht behaupten: RDP“
in `src/data/produktseiten/industrialkeyboard.ts` anpassen – und erst danach in Foren erwähnen, mit Offenlegung.

**Show HN – Titel** (Vorschlag, nur falls statt Lupe oder Riegel)

```text
Show HN: Industrial Keyboard – Android keyboard with F1–F24 for rugged devices
```

**Show HN – Gerüst** (3–5 Sätze **selbst** schreiben: HN verbietet generierten und KI-bearbeiteten Text in Posts; URL: das GitHub-Repo)

- What: Android input method for warehouse handhelds: big keys for gloves, scan tab with soft trigger, matching number pads.
- Fn tab with F1–F12; Shift gives F13–F24, sent as Shift+F1…F12 (Android has key codes above F12 only since Android 16; the 5250 mapping).
- Layouts, macros and settings from one JSON an MDM can push; no internet permission, no dictionary, nothing typed is stored.
- Status: tested on a Zebra HC20; Honeywell trigger built from the vendor documentation.
- Ask: reports from Honeywell devices. MIT.

## 4 KI-Sichtbarkeit messen

Einmal im Monat, ab vier Wochen nach dem Livegang, dieselben Fragen an **ChatGPT** (mit Websuche), **Perplexity**,
**Microsoft Copilot**, **Google AI Mode** und **Claude** (mit Websuche) stellen – jeweils in einer neuen Sitzung ohne
Verlauf, wortgleich, Datum und Dienst notieren. Ergebnis in einer Tabelle festhalten:
Datum · Dienst · Frage · genannt (ja/nein) · zitiert (welche URL) · Fakten richtig · Fehler · zitierte Fremdquellen.

**Was prüfen**

- **Genannt?** Taucht das Produkt in der Antwort auf, und an welcher Stelle?
- **Zitiert?** Verlinkt die Antwort ict-baden.de, das GitHub-Repo oder eine Drittseite (AlternativeTo, Portal, Forum)?
  Zitierte Drittseiten, auf denen wir fehlen, sind die nächsten Einträge.
- **Richtig?** Plattform, Lizenz (MIT, kostenlos), Version und die Grenzen aus „Nicht schreiben“. Typische Fehler,
  die wir korrigieren wollen: Vitrine „entsperrt mit Entra ID“, Riegel „prüft CIS-Benchmarks“, Pforte „kann
  Terminal-Emulation (5250, VT)“, Lupe „erzeugt QR-Codes“, Industrial Keyboard „für RDP/SAP getestet“. Bei Fehlern die Quelle
  suchen, aus der die Antwort schöpft, und dort mit Offenlegung korrigieren; die Website nur ändern, wenn sie selbst missverständlich ist.

**Testfragen**

| Produkt | Fragen |
|---|---|
| Vitrine | How can I lock keyboard and mouse on a Windows PC but keep the screen visible? · Is there a free open-source alternative to Transparent Screen Lock? · Wie sperre ich einen Leitstand-PC, ohne dass der Bildschirm verschwindet? · Transparente Bildschirmsperre für Windows kostenlos |
| Lupe | How can I use my laptop webcam as a barcode scanner that types into Excel? · What can replace CodeTwo QR Code Desktop Reader? · Wie lese ich einen QR-Code vom Bildschirm am PC aus? · Data-Matrix-Code am PC lesen ohne Handscanner · QR code reader for the Linux desktop |
| Zutritt | Free tool to report NTFS and share permissions of a file server to Excel · How do I find orphaned SIDs in folder permissions? · Wie sehe ich, wer auf welchen Ordner unseres Fileservers zugreifen darf? · Berechtigungsbericht Fileserver für ISO-27001-Audit kostenlos |
| Riegel | How can I check Windows hardening on an air-gapped HMI without installing software? · Open-source alternative to HardeningKitty with a report for auditors · Windows-Härtung offline prüfen ohne Agent · Härtungsnachweis für Anlagen-PCs nach IEC 62443 |
| Plakette | Is there a ZebraDesigner alternative that runs on Linux? · How do I print ZPL labels from Linux without a driver? · Zebra-Etiketten aus Excel mit fortlaufender Nummer drucken, kostenlos · ZPL-Editor kostenlos |
| Pforte | Open-source kiosk browser for Zebra devices with DataWedge scanning · My scanner beeps but nothing arrives in the web app on a Zebra handheld – which browser helps? · Kiosk-Browser für MDE-Geräte mit Scanner, kostenlos · Alternative zum Zebra Enterprise Browser für Web-Apps |
| Industrial Keyboard | Android keyboard with F13–F24 keys · Alternative to Zebra Enterprise Keyboard that also runs on Honeywell devices · Android-Tastatur mit F-Tasten für MDE-Geräte · Bildschirmtastatur für Handschuhe unter Android |

**Wo die Daten stehen**

- **Google Search Console** → Leistung → Suchergebnisse: Suchanfragen und Seiten je Produktseite und Ratgeber; AI Overviews und
  AI Mode stecken dort in den Web-Zahlen ([Google](https://developers.google.com/search/docs/appearance/ai-features)).
  Getrennt zeigt sie seit 31.08.2026 der Bericht „Generative AI performance“: Impressionen je Seite, Land und Gerät
  ([Hilfe](https://support.google.com/webmasters/answer/16984139)).
- **Bing Webmaster Tools** → „AI Performance“: Zitate in Copilot und Bing-KI-Antworten, zitierte Seiten, „grounding
  queries“ (Stichprobe).
- **Cloudflare AI Crawl Control:** welche Such- und KI-Crawler die Seite abrufen und mit welchem Status – fällt ein
  Crawler auf 403, ist eine Einstellung aus Schritt 2 zurückgesprungen.
- **GitHub** → Insights → Traffic je Repo: verweisende Seiten (z. B. chatgpt.com, perplexity.ai), Klone, Besuche – sichtbar
  für alle mit Schreibrechten, nur 14 Tage rückwirkend, also monatlich abschreiben.

## 5 Was wir bewusst nicht tun

- Kein Keyword-Stuffing, kein versteckter Text, keine Massen-Seiten aus KI-Texten, keine Doorway-Seiten je Suchbegriff.
- Kein Linkkauf, keine Linktausch-Netzwerke, keine Gastartikel nur für Links.
- Keine Fake-Bewertungen, keine Zweit- oder Sockenkonten, niemanden um Likes, Daumen, Upvotes oder Sterne bitten
  (AlternativeTo und Hacker News verbieten es ausdrücklich).
- Kein automatisches Posten, keine Bots in Foren oder auf Reddit, kein KI-Text dort, wo er verboten ist (Hacker News,
  r/sysadmin, r/Intune, awesome-windows, awesome-sysadmin), und keine Beiträge ohne Kennzeichnung, wo sie verlangt wird
  (administrator.de).
- Keine Antworten in archivierten oder jahrealten Threads, keine Beiträge ohne Offenlegung, keine Werbung als
  Antwort auf eine Frage, die das Tool nicht löst.
- Keine Fremdseiten (etwa auf AlternativeTo) anlegen, nur um ein eigenes Produkt daranzuhängen.
- Keine Aussagen über Fremdprodukte außer der beschreibenden Nennung, keine Behauptung über das hinaus, was README und
  „Limits, honestly“ belegen.
