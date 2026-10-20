# Baut die HyperFrames-Komposition des Promo-Videos (video/ict-baden-promo/index.html) aus der Szenenbeschreibung
# unten. Alle Zeiten in Sekunden, abgeleitet aus den Sprechpausen der ElevenLabs-Aufnahme (siehe SCRIPT.md).
#
#   python scripts/video/build-promo.py
#   cd video/ict-baden-promo && npx hyperframes check && npx hyperframes render --quality delivery --output renders/ict-baden-promo.mp4
import html
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'video', 'ict-baden-promo', 'index.html')

VO_DURATION = 74.56
TOTAL = 76.5

# Szenengrenzen (Schnitt jeweils kurz vor dem ersten Wort des nächsten Produkts)
CUTS = [0, 8.6, 22.1, 32.2, 42.2, 54.1, 62.7, 71.4, TOTAL]

PRODUCTS = [
    {
        'id': 'lupe', 'name': 'Lupe', 'logo': 'logos/lupe.svg', 'c1': '#f7a531', 'c2': '#e8505b',
        'kind': 'QR code and barcode reader for the PC', 'tag': 'Every code, from anywhere.', 'tag_at': 10.2,
        'device': 'desktop',
        'shots': [('lupe-qr-code-vom-bildschirm-scannen-light-1600.webp', 9.0), ('lupe-barcode-per-webcam-scannen-light-1600.webp', 15.5)],
        'float': ('lupe-ergebnis-eingetippt-light-630.webp', 17.7, 630, 292),
        'chips': [('Hotkey Win+Shift+Q – any code on screen', 12.4), ('Webcam as a hand scanner', 15.5),
                  ('Copied, typed or opened', 17.7), ('100 % offline', 20.4)],
    },
    {
        'id': 'vitrine', 'name': 'Vitrine', 'logo': 'logos/vitrine.svg', 'c1': '#5b8cff', 'c2': '#8b5cf6',
        'kind': 'Transparent screen lock for Windows', 'tag': 'Look, don’t touch.', 'tag_at': 30.5, 'tag_big': True,
        'device': 'desktop',
        'shots': [('demo-still.webp', 22.4), ('vitrine-transparente-bildschirmsperre-light-1600.webp', 27.2)],
        'float': ('vitrine-entsperren-microsoft-entra-id-light-936.webp', 28.6, 360, 372),
        'chips': [('Keyboard and mouse locked', 25.5), ('Programs stay visible and keep running', 27.2),
                  ('Unlock with Microsoft Entra ID', 28.6)],
    },
    {
        'id': 'zutritt', 'name': 'Zutritt', 'logo': 'logos/zutritt.svg', 'c1': '#22c3a6', 'c2': '#3b6cf6',
        'kind': 'Share and NTFS permissions report', 'tag': 'Who can access what?', 'tag_at': 34.6, 'tag_big': True,
        'device': 'desktop',
        'shots': [('zutritt-freigaben-scannen-light-1600.webp', 32.5), ('zutritt-ntfs-berechtigungen-ordner-light-1600.webp', 36.1),
                  ('zutritt-zugriffsrechte-person-light-1600.webp', 38.5), ('zutritt-bericht-excel-pdf-light-1600.webp', 40.3)],
        'chips': [('SMB shares + NTFS permissions', 36.1), ('AD groups resolved down to people', 38.5),
                  ('Excel and PDF report to sign', 40.3)],
    },
    {
        'id': 'riegel', 'name': 'Riegel', 'logo': 'logos/riegel.svg', 'c1': '#f3821d', 'c2': '#ac281b',
        'kind': 'Windows hardening check for plants, labs and control rooms',
        'tag': 'Hardened where it can be. Documented where it can’t.', 'tag_at': 51.1, 'tag_split': 52.6,
        'device': 'desktop',
        'shots': [('riegel-windows-haertung-pruefen-light-1600.webp', 42.5), ('riegel-begruendete-ausnahmen-light-1600.webp', 51.1),
                  ('riegel-haertungsbericht-abzeichnen-light-1600.webp', 52.6)],
        'chips': [('153 hardening rules', 46.4, 153), ('Read-only and offline', 49.2)],
    },
    {
        'id': 'enterprisebrowser', 'name': 'EnterpriseBrowser', 'logo': 'logos/enterprisebrowser.webp', 'c1': '#3b82f6', 'c2': '#0d47a1',
        'kind': 'Kiosk browser for rugged Android devices', 'tag': 'Web apps on rugged Android devices.', 'tag_at': 55.2,
        'device': 'phones',
        'shots': [('enterprisebrowser-kiosk-browser-profile-light-520.webp', 54.5), ('enterprisebrowser-profil-allowlist-light-520.webp', 55.3),
                  ('enterprisebrowser-barcode-scan-webformular-light-520.webp', 56.1)],
        'focus': (2, 60.0),
        'chips': [('Zebra and Honeywell devices', 57.0), ('Kiosk mode and URL allow list', 58.4),
                  ('Barcode scans straight into web forms', 60.0)],
    },
    {
        'id': 'industrial-keyboard', 'name': 'Industrial Keyboard', 'logo': 'logos/industrial-keyboard.webp', 'c1': '#1d6fd8', 'c2': '#0a7099',
        'kind': 'On-screen keyboard for rugged Android devices', 'tag': 'Fast, reliable data entry.', 'tag_at': 63.8,
        'device': 'phones',
        'shots': [('industrial-keyboard-android-tastatur-light-520.webp', 63.0), ('industrial-keyboard-scan-taste-light-520.webp', 63.8),
                  ('industrial-keyboard-funktionstasten-f1-f24-light-520.webp', 64.6)],
        'focus': (2, 67.2),
        'chips': [('Big keys for gloves', 65.2), ('Scan button', 66.3), ('F1 to F24', 67.3), ('Configured centrally by MDM', 69.1)],
    },
]

E = html.escape


def product_html(i, p, start, dur):
    mirror = i % 2 == 1
    pid = p['id']
    chips = ''.join(
        f'<li class="chip" id="{pid}-chip{k}"><span class="dot"></span>'
        + (f'<span class="num" id="{pid}-num">0</span>&nbsp;' + E(c[0].split(' ', 1)[1]) if len(c) > 2 else E(c[0]))
        + '</li>'
        for k, c in enumerate(p['chips']))
    if p.get('tag_split'):
        a, b = p['tag'].split('. ', 1)
        tag = f'<span id="{pid}-tag1" class="tl">{E(a)}.</span> <span id="{pid}-tag2" class="tl">{E(b)}</span>'
    else:
        tag = f'<span id="{pid}-tag1" class="tl">{E(p["tag"])}</span>'
    if p['device'] == 'desktop':
        shots = ''.join(f'<img class="shot" id="{pid}-shot{k}" src="assets/shots/{s}" alt="" />' for k, (s, _) in enumerate(p['shots']))
        stage = (f'<div class="window" id="{pid}-window"><div class="wbar"><i></i><i></i><i></i></div>'
                 f'<div class="screen">{shots}</div></div>')
        if p.get('float'):
            f, _, w, h = p['float']
            fw = 420 if w > 500 else 340
            stage += f'<img class="float" id="{pid}-float" src="assets/shots/{f}" alt="" style="width:{fw}px" />'
    else:
        stage = '<div class="phones">' + ''.join(
            f'<div class="phone" id="{pid}-phone{k}"><img src="assets/shots/{s}" alt="" /></div>' for k, (s, _) in enumerate(p['shots'])) + '</div>'
    prog = ''.join(f'<i class="{"on" if k == i else ""}"></i>' for k in range(6))
    return f'''
      <section id="s-{pid}" class="clip scene{' mirror' if mirror else ''}" data-start="{start}" data-duration="{dur}" data-track-index="0"
        style="--c1:{p['c1']};--c2:{p['c2']}">
        <div class="paper"></div>
        <div class="bloom" id="{pid}-bloom"></div>
        <div class="copy" id="{pid}-copy">
          <p class="eyebrow" id="{pid}-eyebrow"><b>{i + 1:02d}</b> / 06</p>
          <div class="head" id="{pid}-head"><img class="plogo" src="assets/{p['logo']}" alt="" /><h2>{E(p['name'])}</h2></div>
          <p class="kind" id="{pid}-kind">{E(p['kind'])}</p>
          <p class="tag{' tag--big' if p.get('tag_big') else ''}">{tag}</p>
          <ul class="chips">{chips}</ul>
        </div>
        <div class="stage {p['device']}" id="{pid}-stage">{stage}</div>
        <div class="progress"><span>ICT Baden</span><div class="bars">{prog}</div></div>
      </section>'''


def product_js(i, p, start, end):
    pid = p['id']
    mirror = i % 2 == 1
    dx = 60 if mirror else -60
    t0 = start + 0.25
    js = [
        f'tl.fromTo("#{pid}-bloom", {{ opacity: 0, scale: 0.85 }}, {{ opacity: 1, scale: 1.08, duration: {end - start:.2f}, ease: "none" }}, {start});',
        f'tl.fromTo("#{pid}-eyebrow", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }}, {t0:.2f});',
        f'tl.fromTo("#{pid}-head", {{ opacity: 0, x: {dx} }}, {{ opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }}, {t0 + 0.05:.2f});',
        f'tl.fromTo("#{pid}-kind", {{ opacity: 0, y: 18 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }}, {t0 + 0.35:.2f});',
        f'tl.fromTo("#{pid}-tag1", {{ opacity: 0, y: 22 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }}, {p["tag_at"]});',
    ]
    if p.get('tag_split'):
        js.append(f'tl.fromTo("#{pid}-tag2", {{ opacity: 0, y: 22 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }}, {p["tag_split"]});')
    if p.get('tag_big'):
        js.append(f'tl.fromTo("#{pid}-tag1", {{ scale: 0.92 }}, {{ scale: 1, duration: 0.9, ease: "back.out(2)" }}, {p["tag_at"]});')
    for k, c in enumerate(p['chips']):
        js.append(f'tl.fromTo("#{pid}-chip{k}", {{ opacity: 0, x: {dx // 2}, scale: 0.96 }}, {{ opacity: 1, x: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)" }}, {c[1]});')
        if len(c) > 2:
            js.append(f'(function () {{ const n = document.getElementById("{pid}-num"); const o = {{ v: 0 }};'
                      f' tl.to(o, {{ v: {c[2]}, duration: 1.4, ease: "power2.out", onUpdate: () => {{ n.textContent = Math.round(o.v); }} }}, {c[1]}); }})();')
    if p['device'] == 'desktop':
        js.append(f'tl.fromTo("#{pid}-window", {{ opacity: 0, y: 70, rotateX: 8 }}, {{ opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: "power3.out" }}, {start + 0.15:.2f});')
        shots = p['shots']
        for k, (_, at) in enumerate(shots):
            nxt = shots[k + 1][1] if k + 1 < len(shots) else end
            if k > 0:
                js.append(f'tl.fromTo("#{pid}-shot{k}", {{ opacity: 0, x: 40 }}, {{ opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }}, {at});')
            js.append(f'tl.fromTo("#{pid}-shot{k}", {{ scale: 1.0 }}, {{ scale: 1.06, duration: {nxt - at + 0.6:.2f}, ease: "none" }}, {at});')
        if p.get('float'):
            at = p['float'][1]
            js.append(f'tl.fromTo("#{pid}-float", {{ opacity: 0, y: 50, scale: 0.9 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.5)" }}, {at});')
    else:
        for k, (_, at) in enumerate(p['shots']):
            js.append(f'tl.fromTo("#{pid}-phone{k}", {{ opacity: 0, y: 160 }}, {{ opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }}, {at});')
        fk, fat = p['focus']
        js.append(f'tl.to("#{pid}-phone{fk}", {{ scale: 1.12, y: -18, duration: 0.7, ease: "power2.out" }}, {fat});')
        for k in range(len(p['shots'])):
            if k != fk:
                js.append(f'tl.to("#{pid}-phone{k}", {{ opacity: 0.55, scale: 0.94, duration: 0.7, ease: "power2.out" }}, {fat});')
    return '\n      '.join(js)


def wipe_html(n, t):
    return (f'<div id="wipe{n}" class="clip wipe" data-start="{t - 0.45:.2f}" data-duration="0.9" data-track-index="2">'
            f'<div class="wipe-move" id="wipe{n}-move"><div class="wipe-skew"><i></i></div></div></div>')


def wipe_js(n, t):
    return f'tl.fromTo("#wipe{n}-move", {{ x: -2900 }}, {{ x: 2300, duration: 0.9, ease: "power2.inOut" }}, {t - 0.45:.2f});'


def build():
    scenes, js = [], []
    for i, p in enumerate(PRODUCTS):
        start, end = CUTS[i + 1], CUTS[i + 2]
        scenes.append(product_html(i, p, start, round(end - start, 2)))
        js.append(product_js(i, p, start, end))
    wipes = [wipe_html(n, t) for n, t in enumerate(CUTS[1:-1])]
    js += [wipe_js(n, t) for n, t in enumerate(CUTS[1:-1])]

    icons = ''.join(
        f'<li id="intro-ic{k}"><img src="assets/{p["logo"]}" alt="" /><span>{E(p["name"])}</span></li>' for k, p in enumerate(PRODUCTS))
    intro_js = [
        'tl.fromTo("#intro-bar", { x: 900 }, { x: 0, duration: 0.9, ease: "power4.out" }, 0);',
        'tl.fromTo("#intro-logo", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.6)" }, 0.1);',
        'tl.fromTo("#intro-l1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.6);',
        'tl.fromTo("#intro-l2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 3.7);',
        'tl.to("#intro-text", { opacity: 0, y: -40, duration: 0.5, ease: "power2.in" }, 5.75);',
        'tl.to("#intro-logo", { scale: 0.62, y: -150, duration: 0.8, ease: "power3.inOut" }, 5.8);',
        'tl.fromTo("#intro-six", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 6.15);',
    ] + [f'tl.fromTo("#intro-ic{k}", {{ opacity: 0, y: 60, scale: 0.7 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" }}, {6.45 + k * 0.17:.2f});' for k in range(6)]
    outro_js = [
        f'tl.fromTo("#outro-bar", {{ x: 900 }}, {{ x: 0, duration: 0.9, ease: "power4.out" }}, {CUTS[7]});',
        f'tl.fromTo("#outro-logo", {{ opacity: 0, scale: 0.8 }}, {{ opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.6)" }}, {CUTS[7] + 0.2:.2f});',
        f'tl.fromTo("#outro-h", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, 73.2);',
        f'tl.fromTo("#outro-dot", {{ scale: 0 }}, {{ scale: 1, duration: 0.5, ease: "back.out(3)" }}, 73.9);',
        f'tl.fromTo("#outro-meta", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }}, 74.4);',
    ]

    doc = f'''<!doctype html>
<!-- Erzeugt von scripts/video/build-promo.py – nicht von Hand ändern -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>ICT Baden – product promo</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      @font-face {{ font-family: "Archivo"; src: url("assets/fonts/archivo.woff2") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }}
      @font-face {{ font-family: "Inter"; src: url("assets/fonts/inter.woff2") format("woff2"); font-weight: 100 900; }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #faf9f5; }}
      #root {{ position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Inter", sans-serif; color: #111111; background: #faf9f5; }}
      .clip {{ position: absolute; inset: 0; }}

      /* Intro und Outro: Markenfläche gelb mit rotem Schrägbalken wie im Logo */
      .brand {{ background: #ffd200; overflow: hidden; }}
      .brand-bar {{ position: absolute; top: -10%; right: 170px; width: 230px; height: 120%; }}
      .brand-bar i {{ display: block; width: 100%; height: 100%; background: #e2001a; transform: skewX(26.565deg); }}
      #intro-logo, #outro-logo {{ position: absolute; left: 160px; top: 250px; width: 560px; }}
      #intro-text {{ position: absolute; left: 160px; top: 600px; width: 1300px; }}
      .intro-line {{ font-family: "Archivo"; font-weight: 800; font-stretch: 112%; font-size: 76px; line-height: 1.05; letter-spacing: -0.02em; }}
      .intro-line + .intro-line {{ margin-top: 10px; }}
      #intro-six {{ position: absolute; left: 160px; top: 430px; width: 1300px; }}
      #intro-icons {{ position: absolute; left: 160px; right: 400px; top: 600px; display: flex; gap: 34px; list-style: none; }}
      #intro-icons li {{ display: flex; flex-direction: column; align-items: center; gap: 16px; width: 170px; }}
      #intro-icons img {{ width: 128px; height: 128px; border-radius: 30px; box-shadow: 0 18px 40px -16px rgb(0 0 0 / 0.45); }}
      #intro-icons span {{ font-family: "Archivo"; font-weight: 750; font-size: 24px; text-align: center; line-height: 1.15; }}
      #outro-logo {{ top: 210px; width: 520px; }}
      #outro-h {{ position: absolute; left: 160px; top: 560px; font-family: "Archivo"; font-weight: 850; font-stretch: 115%; font-size: 150px; line-height: 0.92; letter-spacing: -0.035em; width: 1300px; }}
      #outro-dot {{ display: inline-block; width: 0.2em; height: 0.2em; background: #e2001a; margin-left: 0.05em; }}
      #outro-meta {{ position: absolute; left: 164px; top: 900px; font-size: 34px; font-weight: 600; letter-spacing: 0.01em; }}

      /* Produktszenen */
      .paper {{ position: absolute; inset: 0; background:
          linear-gradient(rgb(17 17 17 / 0.035) 1px, transparent 1px) 0 0 / 80px 80px,
          linear-gradient(90deg, rgb(17 17 17 / 0.035) 1px, transparent 1px) 0 0 / 80px 80px, #faf9f5; }}
      .bloom {{ position: absolute; right: -380px; top: -420px; width: 1500px; height: 1500px; border-radius: 50%;
          background: radial-gradient(circle, color-mix(in srgb, var(--c1) 34%, transparent), color-mix(in srgb, var(--c2) 12%, transparent) 45%, transparent 70%); }}
      .mirror .bloom {{ right: auto; left: -380px; }}
      .copy {{ position: absolute; z-index: 2; left: 120px; top: 150px; width: 720px; }}
      .mirror .copy {{ left: auto; right: 120px; }}
      .eyebrow {{ font-size: 24px; font-weight: 600; letter-spacing: 0.16em; color: #5d5b54; margin-bottom: 34px; }}
      .eyebrow b {{ color: #111111; }}
      .head {{ display: flex; align-items: center; gap: 30px; }}
      .plogo {{ width: 112px; height: 112px; flex: none; border-radius: 26px; box-shadow: 0 16px 34px -14px rgb(0 0 0 / 0.4); }}
      .head h2 {{ font-family: "Archivo"; font-weight: 850; font-stretch: 112%; font-size: 112px; line-height: 0.95; letter-spacing: -0.03em; }}
      #s-enterprisebrowser .head h2 {{ font-size: 60px; letter-spacing: -0.035em; }}
      #s-enterprisebrowser .stage {{ right: 60px; }}
      #s-industrial-keyboard .head h2 {{ font-size: 84px; }}
      .kind {{ margin-top: 30px; font-size: 36px; line-height: 1.3; color: #3a3935; font-weight: 500; }}
      .tag {{ margin-top: 28px; font-family: "Archivo"; font-weight: 750; font-size: 44px; line-height: 1.2; letter-spacing: -0.01em; }}
      .tag .tl {{ display: inline-block; background: linear-gradient(transparent 60%, rgb(255 210 0 / 0.75) 60%); }}
      .tag--big {{ font-size: 64px; }}
      .chips {{ margin-top: 40px; list-style: none; display: grid; gap: 16px; justify-items: start; }}
      .chip {{ display: inline-flex; align-items: center; gap: 16px; padding: 14px 26px 14px 20px; border-radius: 999px; background: #ffffff;
          border: 1px solid #e3e0d6; font-size: 29px; font-weight: 600; box-shadow: 0 10px 24px -16px rgb(0 0 0 / 0.35); }}
      .chip .dot {{ width: 16px; height: 16px; border-radius: 50%; background: linear-gradient(135deg, var(--c1), var(--c2)); flex: none; }}
      .chip .num {{ font-family: "Archivo"; font-weight: 850; font-stretch: 110%; min-width: 2.2ch; }}
      .stage {{ position: absolute; top: 0; bottom: 0; right: 80px; width: 930px; display: flex; align-items: center; justify-content: center; perspective: 1600px; }}
      .mirror .stage {{ right: auto; left: 80px; }}
      .window {{ position: relative; width: 930px; border-radius: 22px; overflow: hidden; background: #ffffff;
          box-shadow: 0 50px 100px -40px rgb(0 0 0 / 0.55), 0 0 0 1px rgb(0 0 0 / 0.08); }}
      .wbar {{ height: 42px; background: #f1efe9; display: flex; align-items: center; gap: 10px; padding-left: 18px; border-bottom: 1px solid #e3e0d6; }}
      .wbar i {{ width: 13px; height: 13px; border-radius: 50%; background: #d6d2c6; }}
      .screen {{ position: relative; height: 595px; overflow: hidden; background: #f6f5f1; }}
      .shot {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top left; }}
      .float {{ position: absolute; right: -10px; bottom: 150px; border-radius: 18px; box-shadow: 0 40px 70px -30px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(0 0 0 / 0.08); }}
      .mirror .float {{ right: auto; left: -10px; }}
      .phones {{ display: flex; gap: 34px; align-items: center; }}
      .phone {{ width: 272px; padding: 12px; border-radius: 44px; background: #1b1b1d; box-shadow: 0 50px 90px -40px rgb(0 0 0 / 0.65); }}
      .phone img {{ display: block; width: 100%; border-radius: 32px; }}
      .progress {{ position: absolute; left: 120px; right: 120px; bottom: 54px; display: flex; align-items: center; justify-content: space-between;
          font-size: 20px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #5d5b54; }}
      .bars {{ display: flex; gap: 10px; }}
      .bars i {{ width: 54px; height: 6px; border-radius: 3px; background: #dcd8cc; }}
      .bars i.on {{ background: #111111; }}

      /* Übergang: gelbe Fläche mit rotem Streifen fährt durchs Bild */
      .wipe {{ overflow: hidden; pointer-events: none; }}
      .wipe-move {{ position: absolute; top: 0; left: 0; width: 2600px; height: 1080px; }}
      .wipe-skew {{ position: absolute; inset: -200px 0; background: #ffd200; transform: skewX(-26.565deg); }}
      .wipe-skew i {{ position: absolute; top: 0; bottom: 0; right: 380px; width: 150px; background: #e2001a; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1920" data-height="1080">
      <audio id="voiceover" src="assets/voiceover.mp3" data-start="0" data-duration="{VO_DURATION}" data-track-index="5" data-volume="1"></audio>

      <section id="s-intro" class="clip brand" data-start="0" data-duration="{CUTS[1]}" data-track-index="0">
        <div class="brand-bar" id="intro-bar"><i></i></div>
        <img id="intro-logo" src="assets/logos/ict-baden.svg" alt="ICT Baden" />
        <div id="intro-text">
          <p class="intro-line" id="intro-l1">Software from Karlsruhe, Germany –</p>
          <p class="intro-line" id="intro-l2">for industry, labs and IT.</p>
        </div>
        <p class="intro-line" id="intro-six">Six tools that get things done.</p>
        <ul id="intro-icons">{icons}</ul>
      </section>
{''.join(scenes)}

      <section id="s-outro" class="clip brand" data-start="{CUTS[7]}" data-duration="{round(TOTAL - CUTS[7], 2)}" data-track-index="0">
        <div class="brand-bar" id="outro-bar"><i></i></div>
        <img id="outro-logo" src="assets/logos/ict-baden.svg" alt="ICT Baden" />
        <h1 id="outro-h">Getting Things Done<span id="outro-dot"></span></h1>
        <p id="outro-meta">Six tools · free under the MIT licence · ict-baden.de</p>
      </section>

      {chr(10).join('      ' + w for w in wipes).strip()}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      {chr(10).join('      ' + l for l in intro_js).strip()}
      {chr(10).join('      ' + j for j in js).strip()}
      {chr(10).join('      ' + l for l in outro_js).strip()}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        f.write(doc)
    print('geschrieben:', os.path.relpath(OUT, ROOT), f'({TOTAL} s, {len(PRODUCTS)} Produkte)')


build()
