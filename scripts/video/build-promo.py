# Baut die HyperFrames-Komposition des Portfolio-Videos für die Startseite (video/ict-baden-promo/index.html).
# Alle Zeiten in Sekunden aus den Wortzeitmarken der ElevenLabs-Aufnahme (Transkript mit eleven_scribe_v1, SCRIPT.md).
# Die erste Fassung (Produkt-Promo) steht in build-promo-v1.py.
#
#   python scripts/video/build-promo.py
#   cd video/ict-baden-promo && npx hyperframes check && npx hyperframes render --quality delivery --output renders/ict-baden-promo.mp4
import html
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROJ = os.path.join(ROOT, 'video', 'ict-baden-promo')
OUT = os.path.join(PROJ, 'index.html')
ICONS = json.load(open(os.path.join(PROJ, 'assets', 'icons.json'), encoding='utf-8'))
MUSIC = os.path.exists(os.path.join(PROJ, 'assets', 'music.mp3'))

VO_DURATION = 51.12
TOTAL = 53.6
# Szenen: Intro, Leistungen, Themen, Firma, Produkte, Outro
CUTS = [0, 4.5, 13.85, 22.95, 32.1, 48.1, TOTAL]

E = html.escape


def icon(name, cls='ic'):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')


def up(sel, t, dy=40, d=0.7, ease='power3.out'):
    return f'tl.fromTo("{sel}", {{ opacity: 0, y: {dy} }}, {{ opacity: 1, y: 0, duration: {d}, ease: "{ease}" }}, {t:.2f});'


def rise(sel, t, d=0.75):
    """Zeile steigt aus ihrer Maske (.mask > .line)."""
    return f'tl.fromTo("{sel}", {{ yPercent: 110 }}, {{ yPercent: 0, duration: {d}, ease: "power4.out" }}, {t:.2f});'


# Szene 2: Leistungen – Schichten von der Steuerung bis in die Cloud (unten zuerst, im Takt von „control … cloud“)
STACK = [('cloud', 'Cloud', 'Azure · AWS · Docker', 8.56), ('window', 'Applications', 'Web · Desktop · Services', 8.25),
         ('chip', 'Edge & IoT', 'Raspberry Pi · ESP32 · IoT Edge', 7.9), ('plc', 'Control systems', 'Siemens · WAGO · Beckhoff', 7.56)]
TECH = [('C#', 9.6), ('.NET', 10.32), ('Linux', 11.2), ('Windows', 11.76), ('Embedded C/C++', 12.68)]

# Szene 3: Themengebiete (Raster 3 × 2) und ihre Verbindungen
TILES = [('chip', 'Industry 4.0 & IoT', 14.2), ('bolt', 'Energy management', 16.64), ('antenna', 'Telecommunications', 17.8),
         ('plc', 'Control systems', 15.68), ('cloud', 'Hosting & cloud', 19.04), ('database', 'Databases', 19.6)]
TILE_W, TILE_H, TILE_GX, TILE_GY = 500, 210, 40, 40
TILE_X0, TILE_Y0 = 170, 420
LINKS = [(0, 1), (1, 2), (0, 3), (3, 4), (4, 5), (1, 4), (2, 5), (0, 4)]

# Szene 5: Produkte (Windows oben, Android unten)
PRODUCTS = [
    ('lupe', 'Lupe', 'QR code and barcode reader', 'lupe-qr-code-vom-bildschirm-scannen-light-1600.webp', 'logos/lupe.svg', 37.68),
    ('vitrine', 'Vitrine', 'Transparent screen lock', 'vitrine-transparente-bildschirmsperre-light-1600.webp', 'logos/vitrine.svg', 38.32),
    ('zutritt', 'Zutritt', 'File share permissions report', 'zutritt-zugriffsrechte-person-light-1600.webp', 'logos/zutritt.svg', 39.12),
    ('riegel', 'Riegel', 'Windows hardening check', 'riegel-windows-haertung-pruefen-light-1600.webp', 'logos/riegel.svg', 39.84),
    ('eb', 'EnterpriseBrowser', 'Kiosk browser', 'enterprisebrowser-kiosk-browser-profile-light-520.webp', 'logos/enterprisebrowser.webp', 41.28),
    ('ik', 'Industrial Keyboard', 'On-screen keyboard', 'industrial-keyboard-funktionstasten-f1-f24-light-520.webp', 'logos/industrial-keyboard.webp', 42.68),
]


def wipe_html(n, t):
    return (f'<div id="wipe{n}" class="clip wipe" data-start="{t - 0.45:.2f}" data-duration="0.9" data-track-index="2">'
            f'<div class="wipe-move" id="wipe{n}-move"><div class="wipe-skew"><i></i></div></div></div>')


def wipe_js(n, t):
    return f'tl.fromTo("#wipe{n}-move", {{ x: -2900 }}, {{ x: 2300, duration: 0.9, ease: "power2.inOut" }}, {t - 0.45:.2f});'


def build():
    c = CUTS
    js = []

    s1 = f'''
      <section id="s-intro" class="clip brand" data-start="0" data-duration="{c[1]}" data-track-index="0">
        <div class="brand-bar"><i id="intro-bar"></i></div>
        <img id="intro-logo" class="wordmark" src="assets/logos/ict-baden-wort.svg" alt="ICT Baden" />
        <div class="mask intro-sub"><p class="line" id="intro-l1">Software development</p></div>
        <div class="mask intro-sub2"><p class="line" id="intro-l2">from Karlsruhe, Germany</p></div>
      </section>'''
    js += [
        'tl.fromTo("#intro-bar", { x: 700 }, { x: 0, duration: 1.0, ease: "power4.out" }, 0);',
        up('#intro-logo', 0.1, 50, 0.8),
        rise('#intro-l1', 1.6), rise('#intro-l2', 2.75),
    ]

    stack = ''.join(
        f'<li class="layer" id="layer{k}">{icon(ic)}<div><b>{E(t)}</b><span>{E(sub)}</span></div></li>'
        for k, (ic, t, sub, _) in enumerate(STACK))
    tech = ''.join(f'<li class="tech" id="tech{k}">{E(t)}</li>' for k, (t, _) in enumerate(TECH))
    s2 = f'''
      <section id="s-services" class="clip scene" data-start="{c[1]}" data-duration="{c[2] - c[1]:.2f}" data-track-index="0">
        <div class="paper"></div><div class="glow glow--r"></div>
        <div class="col-l">
          <p class="eyebrow" id="sv-eyebrow"><i></i>What we do</p>
          <div class="mask"><h2 class="line" id="sv-h1">Custom software</h2></div>
          <div class="mask"><h2 class="line" id="sv-h2">for our clients.</h2></div>
          <p class="lead" id="sv-lead">From the <mark>control system</mark> to the <mark>cloud</mark>.</p>
          <ul class="techs">{tech}</ul>
        </div>
        <ul class="stack">{stack}</ul>
      </section>'''
    js += [up('#sv-eyebrow', 4.6, 20, 0.5), rise('#sv-h1', 4.72), rise('#sv-h2', 5.6), up('#sv-lead', 7.2, 26, 0.6)]
    js += [f'tl.fromTo("#layer{k}", {{ opacity: 0, y: -70 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" }}, {at:.2f});'
           for k, (_, _, _, at) in enumerate(STACK)]
    js += [f'tl.fromTo("#tech{k}", {{ opacity: 0, y: 24, scale: 0.9 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }}, {at:.2f});'
           for k, (_, at) in enumerate(TECH)]

    def tile_xy(k):
        col, row = k % 3, k // 3
        return TILE_X0 + col * (TILE_W + TILE_GX), TILE_Y0 + row * (TILE_H + TILE_GY)
    tiles = ''
    for k, (ic, t, _) in enumerate(TILES):
        x, y = tile_xy(k)
        tiles += f'<div class="tile" id="tile{k}" style="left:{x}px;top:{y}px">{icon(ic)}<b>{E(t)}</b></div>'
    lines = ''
    for n, (a, b) in enumerate(LINKS):
        (ax, ay), (bx, by) = tile_xy(a), tile_xy(b)
        lines += (f'<path id="link{n}" d="M {ax + TILE_W / 2:.0f} {ay + TILE_H / 2:.0f} L {bx + TILE_W / 2:.0f} {by + TILE_H / 2:.0f}" '
                  f'pathLength="1" />')
    s3 = f'''
      <section id="s-fields" class="clip scene" data-start="{c[2]}" data-duration="{c[3] - c[2]:.2f}" data-track-index="0">
        <div class="paper"></div><div class="glow glow--l"></div>
        <div class="fields-head">
          <p class="eyebrow" id="fd-eyebrow"><i></i>Fields of expertise</p>
          <div class="mask" data-layout-allow-occlusion data-layout-allow-overflow><h2 class="line" id="fd-h" data-layout-allow-occlusion>We know how these systems work together.</h2></div>
        </div>
        <svg class="links" viewBox="0 0 1920 1080" aria-hidden="true">{lines}</svg>
        {tiles}
      </section>'''
    js += [up('#fd-eyebrow', 13.95, 20, 0.5)]
    js += [f'tl.fromTo("#tile{k}", {{ opacity: 0, y: 40, scale: 0.94 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)" }}, {at:.2f});'
           for k, (_, _, at) in enumerate(TILES)]
    js += [rise('#fd-h', 20.72, 0.8)]
    js += [f'tl.fromTo("#link{n}", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }}, {20.8 + n * 0.12:.2f});'
           for n in range(len(LINKS))]
    js += [f'tl.to("#tile{k}", {{ borderColor: "#e2001a", duration: 0.3 }}, {21.0 + k * 0.1:.2f});' for k in range(len(TILES))]

    # Firma: Luftbild von Durlach (LGL DOP20, wie auf der Kontaktseite), ICT-Standort aus src/data/luftbild.json
    px, py = 869.6 * 2 - 6, 283.3 * 2
    s4 = f'''
      <section id="s-company" class="clip scene" data-start="{c[3]}" data-duration="{c[4] - c[3]:.2f}" data-track-index="0">
        <img class="aerial" src="assets/luftbild.webp" alt="" />
        <div class="aerial-shade"></div>
        <p class="credit">Aerial image: LGL-BW (2026), dl-de/by-2-0</p>
        <div class="pin" id="co-pin" style="left:{px:.0f}px;top:{py:.0f}px"><span class="ring" id="co-ring"></span><span class="dot"></span>
          <span class="pin-tag" id="co-tag">ICT Baden · Karlsruhe-Durlach</span></div>
        <div class="co-card" id="co-card">
          <p class="eyebrow" id="co-eyebrow"><i></i>Who we are</p>
          <h2 id="co-h">A compact team with experienced partners.</h2>
          <ul class="facts">
            <li id="co-f0">{icon('pin')}<div><b>Based in Karlsruhe-Durlach</b><span>Baden-Württemberg, Germany</span></div></li>
            <li id="co-f1">{icon('code')}<div><b>Active in the developer community</b><span>Co-founder of the .NET User Group Karlsruhe, 2004</span></div></li>
            <li id="co-f2">{icon('globe')}<div><b>Working remotely with large companies</b><span>for many years</span></div></li>
          </ul>
        </div>
      </section>'''
    js += [
        f'tl.fromTo("#co-card", {{ opacity: 0, x: -60 }}, {{ opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }}, {c[3] + 0.15:.2f});',
        up('#co-eyebrow', 23.1, 16, 0.5), up('#co-h', 23.25, 30, 0.7),
        up('#co-f0', 26.5, 24, 0.6), up('#co-f1', 28.0, 24, 0.6), up('#co-f2', 29.76, 24, 0.6),
        'tl.fromTo("#co-pin", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(2)" }, 26.5);',
        'tl.fromTo("#co-tag", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, 26.9);',
        'tl.fromTo("#co-ring", { scale: 0.4, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 1.6, ease: "power2.out", repeat: 2 }, 27.0);',
    ]

    cards = ''
    for pid, name, kind, shot, logo, _ in PRODUCTS:
        android = pid in ('eb', 'ik')
        cards += (f'<div class="card{" card--android" if android else ""}" id="card-{pid}">'
                  f'<div class="thumb"><img src="assets/shots/{shot}" alt="" /></div>'
                  f'<div class="card-b"><img class="cl" src="assets/{logo}" alt="" /><div><b>{E(name)}</b><span>{E(kind)}</span></div></div></div>')
    s5 = f'''
      <section id="s-products" class="clip scene" data-start="{c[4]}" data-duration="{c[5] - c[4]:.2f}" data-track-index="0">
        <div class="paper"></div><div class="glow glow--r"></div>
        <div class="pr-head">
          <p class="eyebrow" id="pr-eyebrow"><i></i>Alongside client projects</p>
          <div class="mask" data-layout-allow-occlusion data-layout-allow-overflow><h2 class="line" id="pr-h">Our own software for industry, labs and IT.</h2></div>
        </div>
        <p class="row-label" id="pr-win">{icon('window')}For Windows</p>
        <p class="row-label row-label--2" id="pr-and">{icon('chip')}For rugged Android devices</p>
        <div class="grid">{cards}
          <div class="mit" id="pr-mit"><b id="pr-free">Free.</b><span id="pr-lic">Open source under the <em>MIT licence</em>.</span></div>
        </div>
      </section>'''
    js += [up('#pr-eyebrow', 32.3, 16, 0.5), rise('#pr-h', 34.4, 0.8)]
    js += [f'tl.fromTo("#card-{p[0]}", {{ opacity: 0, y: 60 }}, {{ opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }}, {p[5]:.2f});'
           for p in PRODUCTS]
    js += [up('#pr-win', 40.4, 14, 0.5), up('#pr-and', 43.76, 14, 0.5),
           'tl.fromTo("#pr-mit", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, 45.4);',
           up('#pr-lic', 46.85, 16, 0.5)]

    s6 = f'''
      <section id="s-outro" class="clip brand" data-start="{c[5]}" data-duration="{TOTAL - c[5]:.2f}" data-track-index="0">
        <div class="brand-bar"><i id="outro-bar"></i></div>
        <img id="outro-logo" class="wordmark" src="assets/logos/ict-baden-wort.svg" alt="ICT Baden" />
        <div class="mask outro-mask"><h1 class="line" id="outro-h">Getting Things Done<span id="outro-dot"></span></h1></div>
        <p id="outro-meta">Software development · Karlsruhe, Germany · ict-baden.de</p>
      </section>'''
    js += [
        f'tl.fromTo("#outro-bar", {{ x: 700 }}, {{ x: 0, duration: 1.0, ease: "power4.out" }}, {c[5]});',
        up('#outro-logo', 48.3, 50, 0.8),
        rise('#outro-h', 49.85, 0.8),
        'tl.fromTo("#outro-dot", { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }, 50.6);',
        up('#outro-meta', 50.9, 20, 0.6),
    ]

    wipes = [wipe_html(n, t) for n, t in enumerate(c[1:-1])]
    js += [wipe_js(n, t) for n, t in enumerate(c[1:-1])]
    music = (f'<audio id="music" src="assets/music.mp3" data-start="0" data-duration="{TOTAL}" data-track-index="6" data-volume="1"></audio>'
             if MUSIC else '')

    doc = f'''<!doctype html>
<!-- Erzeugt von scripts/video/build-promo.py – nicht von Hand ändern -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>ICT Baden – portfolio</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      @font-face {{ font-family: "Archivo"; src: url("assets/fonts/archivo.woff2") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }}
      @font-face {{ font-family: "Inter"; src: url("assets/fonts/inter.woff2") format("woff2"); font-weight: 100 900; }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #faf9f5; }}
      #root {{ position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Inter", sans-serif; color: #111111; background: #faf9f5; }}
      .clip {{ position: absolute; inset: 0; overflow: hidden; }}
      .mask {{ overflow: hidden; padding-bottom: 0.08em; }}
      .line {{ display: block; }}
      .ic {{ width: 44px; height: 44px; flex: none; }}

      /* Markenfläche: gelb mit einem roten Schrägbalken rechts (Baden) */
      .brand {{ background: #ffd200; }}
      .brand-bar {{ position: absolute; top: -10%; right: 120px; width: 270px; height: 120%; }}
      .brand-bar i {{ display: block; width: 100%; height: 100%; background: #e2001a; transform: skewX(26.565deg); }}
      .wordmark {{ position: absolute; left: 150px; width: 420px; }}
      #intro-logo {{ top: 190px; }}
      .intro-sub, .intro-sub2 {{ position: absolute; left: 160px; width: 1300px; }}
      .intro-sub {{ top: 610px; }}
      .intro-sub2 {{ top: 722px; }}
      #intro-l1 {{ font-family: "Archivo"; font-weight: 850; font-stretch: 112%; font-size: 92px; letter-spacing: -0.03em; line-height: 1; }}
      #intro-l2 {{ font-size: 52px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.1; }}
      #outro-logo {{ top: 140px; }}
      .outro-mask {{ position: absolute; left: 150px; top: 560px; width: 1400px; }}
      #outro-h {{ font-family: "Archivo"; font-weight: 850; font-stretch: 115%; font-size: 150px; line-height: 0.95; letter-spacing: -0.035em; }}
      #outro-dot {{ display: inline-block; width: 0.2em; height: 0.2em; background: #e2001a; margin-left: 0.05em; }}
      #outro-meta {{ position: absolute; left: 156px; top: 900px; font-size: 36px; font-weight: 600; }}

      /* Szenen auf Papier */
      .paper {{ position: absolute; inset: 0; background:
          linear-gradient(rgb(17 17 17 / 0.035) 1px, transparent 1px) 0 0 / 80px 80px,
          linear-gradient(90deg, rgb(17 17 17 / 0.035) 1px, transparent 1px) 0 0 / 80px 80px, #faf9f5; }}
      .glow {{ position: absolute; width: 1400px; height: 1400px; border-radius: 50%; background: radial-gradient(circle, rgb(255 210 0 / 0.30), transparent 65%); }}
      .glow--r {{ right: -460px; top: -520px; }}
      .glow--l {{ left: -520px; bottom: -640px; }}
      .eyebrow {{ display: flex; align-items: center; gap: 16px; font-size: 24px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #3a3935; margin-bottom: 26px; }}
      .eyebrow i {{ width: 46px; height: 12px; background: linear-gradient(116.565deg, #ffd200 0 58%, #e2001a 58% 80%, #ffd200 80%); }}
      h2 {{ font-family: "Archivo"; font-weight: 850; font-stretch: 112%; font-size: 104px; line-height: 1; letter-spacing: -0.035em; }}
      mark {{ background: linear-gradient(transparent 58%, rgb(255 210 0 / 0.85) 58%); color: inherit; padding: 0 0.05em; }}

      /* Leistungen */
      .col-l {{ position: absolute; left: 150px; top: 200px; width: 900px; }}
      .lead {{ margin-top: 40px; font-size: 48px; font-weight: 600; line-height: 1.2; letter-spacing: -0.01em; }}
      .techs {{ margin-top: 70px; display: flex; flex-wrap: wrap; gap: 16px; list-style: none; }}
      .tech {{ padding: 16px 30px; border-radius: 999px; background: #111111; color: #ffffff; font-size: 30px; font-weight: 650; }}
      .stack {{ position: absolute; right: 150px; top: 190px; width: 620px; display: grid; gap: 18px; list-style: none; }}
      .layer {{ display: flex; align-items: center; gap: 26px; padding: 30px 34px; border-radius: 24px; background: #ffffff; border: 1px solid #e3e0d6;
          box-shadow: 0 24px 50px -30px rgb(0 0 0 / 0.45); }}
      .layer .ic {{ width: 64px; height: 64px; padding: 12px; border-radius: 16px; background: #ffd200; color: #111111; }}
      .layer b {{ display: block; font-family: "Archivo"; font-weight: 800; font-size: 38px; letter-spacing: -0.015em; }}
      .layer span {{ display: block; margin-top: 4px; font-size: 24px; color: #5d5b54; font-weight: 500; }}
      .layer:first-child {{ background: #111111; border-color: #111111; color: #ffffff; }}
      .layer:first-child span {{ color: #c6c5bf; }}

      /* Themengebiete */
      .fields-head {{ position: absolute; left: 150px; top: 120px; width: 1620px; }}
      .fields-head h2 {{ font-size: 88px; }}
      .links {{ position: absolute; inset: 0; width: 1920px; height: 1080px; }}
      .links path {{ fill: none; stroke: #e2001a; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0.85; }}
      .tile {{ position: absolute; width: {TILE_W}px; height: {TILE_H}px; display: flex; flex-direction: column; justify-content: space-between; padding: 30px 34px;
          border-radius: 26px; background: #ffffff; border: 2px solid #e3e0d6; box-shadow: 0 24px 50px -30px rgb(0 0 0 / 0.4); }}
      .tile .ic {{ width: 64px; height: 64px; padding: 12px; border-radius: 16px; background: #ffd200; color: #111111; }}
      .tile b {{ font-family: "Archivo"; font-weight: 800; font-size: 40px; letter-spacing: -0.015em; line-height: 1.05; }}

      /* Firma */
      .aerial {{ position: absolute; left: -6px; top: 0; width: 1932px; height: 1080px; }}
      .aerial-shade {{ position: absolute; inset: 0; background: linear-gradient(90deg, rgb(17 17 17 / 0.55) 0%, rgb(17 17 17 / 0.15) 55%, transparent 75%); }}
      .credit {{ position: absolute; right: 20px; bottom: 14px; padding: 4px 10px; border-radius: 6px; background: rgb(17 17 17 / 0.72); font-size: 16px; color: #ffffff; }}
      .co-card {{ position: absolute; left: 110px; top: 130px; width: 880px; padding: 54px 56px 50px; border-radius: 32px; background: rgb(250 249 245 / 0.96);
          box-shadow: 0 50px 100px -40px rgb(0 0 0 / 0.6); }}
      .co-card h2 {{ font-size: 68px; line-height: 1.04; }}
      .facts {{ margin-top: 44px; list-style: none; display: grid; gap: 30px; }}
      .facts li {{ display: flex; gap: 26px; align-items: center; }}
      .facts .ic {{ width: 64px; height: 64px; padding: 13px; border-radius: 16px; background: #ffd200; }}
      .facts b {{ display: block; font-size: 34px; font-weight: 700; letter-spacing: -0.01em; }}
      .facts span {{ display: block; margin-top: 4px; font-size: 25px; color: #5d5b54; font-weight: 500; }}
      .pin {{ position: absolute; width: 0; height: 0; }}
      .pin .dot {{ position: absolute; left: -16px; top: -16px; width: 32px; height: 32px; border-radius: 50%; background: #e2001a; border: 5px solid #ffffff; box-shadow: 0 6px 18px rgb(0 0 0 / 0.5); }}
      .pin .ring {{ position: absolute; left: -24px; top: -24px; width: 48px; height: 48px; border-radius: 50%; border: 4px solid #ffd200; }}
      .pin-tag {{ position: absolute; right: 30px; top: -96px; white-space: nowrap; padding: 16px 26px; border-radius: 16px; background: #ffd200; color: #111111;
          font-size: 28px; font-weight: 750; box-shadow: 0 16px 34px -14px rgb(0 0 0 / 0.6); }}

      /* Produkte */
      .pr-head {{ position: absolute; left: 120px; top: 90px; width: 1680px; }}
      .pr-head h2 {{ font-size: 74px; }}
      .row-label {{ position: absolute; left: 120px; top: 318px; display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #3a3935; }}
      .row-label .ic {{ width: 30px; height: 30px; }}
      .row-label--2 {{ top: 672px; }}
      .grid {{ position: absolute; left: 120px; top: 362px; width: 1680px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 74px 28px; }}
      .card {{ height: 280px; border-radius: 22px; overflow: hidden; background: #ffffff; border: 1px solid #e3e0d6; box-shadow: 0 30px 60px -36px rgb(0 0 0 / 0.5);
          display: flex; flex-direction: column; }}
      .thumb {{ height: 168px; overflow: hidden; background: #f1efe9; border-bottom: 1px solid #ebe8df; }}
      .thumb img {{ display: block; width: 100%; height: 100%; object-fit: cover; object-position: top left; }}
      .card--android .thumb {{ background: linear-gradient(135deg, #e8eefc, #f3f1ea); display: flex; justify-content: center; }}
      .card--android .thumb img {{ width: 170px; object-position: top center; }}
      .card-b {{ flex: 1; display: flex; align-items: center; gap: 18px; padding: 0 24px; }}
      .card-b .cl {{ width: 60px; height: 60px; border-radius: 15px; flex: none; }}
      .card-b b {{ display: block; font-family: "Archivo"; font-weight: 800; font-size: 32px; letter-spacing: -0.015em; line-height: 1.05; }}
      .card-b span {{ display: block; margin-top: 4px; font-size: 21px; color: #5d5b54; font-weight: 500; line-height: 1.2; }}
      .mit {{ grid-column: span 2; height: 280px; border-radius: 22px; background: #ffd200; position: relative; overflow: hidden; padding: 44px 50px;
          display: flex; flex-direction: column; justify-content: center; }}
      .mit::after {{ content: ""; position: absolute; top: -20%; right: 70px; width: 110px; height: 140%; background: #e2001a; transform: skewX(26.565deg); }}
      .mit b {{ font-family: "Archivo"; font-weight: 850; font-stretch: 112%; font-size: 92px; line-height: 1; letter-spacing: -0.035em; }}
      .mit span {{ margin-top: 14px; font-size: 34px; font-weight: 600; max-width: 560px; }}
      .mit em {{ font-style: normal; font-weight: 800; }}

      /* Übergang: gelbe Fläche mit rotem Balken (Baden), Richtung wie im Logo */
      .wipe {{ pointer-events: none; }}
      .wipe-move {{ position: absolute; top: 0; left: 0; width: 2600px; height: 1080px; }}
      .wipe-skew {{ position: absolute; inset: -200px 0; background: #ffd200; transform: skewX(26.565deg); }}
      .wipe-skew i {{ position: absolute; top: 0; bottom: 0; right: 380px; width: 160px; background: #e2001a; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1920" data-height="1080">
      <audio id="voiceover" src="assets/voiceover.mp3" data-start="0" data-duration="{VO_DURATION}" data-track-index="5" data-volume="1"></audio>
      {music}
{s1}{s2}{s3}{s4}{s5}{s6}

      {chr(10).join('      ' + w for w in wipes).strip()}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      {chr(10).join('      ' + j for j in js).strip()}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        f.write(doc)
    print('geschrieben:', os.path.relpath(OUT, ROOT), f'({TOTAL} s, Musik: {"ja" if MUSIC else "nein"})')


build()
