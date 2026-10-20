# Baut die Demo-Animation von Vitrine für die Produktseite: scripts/media/vitrine-demo.webp
#
#   python scripts/make-vitrine-demo.py <vitrine-repo>
#
# Die Vitrine-Teile sind echte Bildschirmfotos aus <vitrine-repo>/docs/assets/screenshots (Sperrleiste aus
# lock-light.png, Entsperr-Dialog unlock-entra-light.png). Nur der Hintergrund ist gezeichnet: eine neutrale,
# erfundene Messsoftware, die zeigt, wofür Vitrine da ist – das Programm bleibt unter der Sperre sichtbar und läuft
# weiter. Ablauf: gesperrt (Kurve läuft) › Klick öffnet den Entsperr-Dialog › entsperrt.
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

repo = sys.argv[1] if len(sys.argv) > 1 else os.path.join('..', 'vitrine')
shots = os.path.join(repo, 'docs', 'assets', 'screenshots')
out = os.path.join(os.path.dirname(__file__), 'media', 'vitrine-demo.webp')

W, H = 1600, 1000
FONT = 'C:/Windows/Fonts/segoeui.ttf' if os.name == 'nt' else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_B = 'C:/Windows/Fonts/segoeuib.ttf' if os.name == 'nt' else '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f = lambda s, b=False: ImageFont.truetype(FONT_B if b else FONT, s)

INK, MUTED, LINE, ACCENT = (32, 32, 32), (110, 110, 110), (228, 228, 228), (0, 103, 192)


def peak(x, c, h, w):
    return h * math.exp(-((x - c) ** 2) / (2 * w * w))


def signal(x):
    return 6 + peak(x, 0.18, 120, 0.010) + peak(x, 0.31, 260, 0.014) + peak(x, 0.47, 90, 0.012) \
        + peak(x, 0.62, 330, 0.016) + peak(x, 0.78, 150, 0.013) + 3 * math.sin(x * 90)


def app(progress):
    """Erfundene Messsoftware (Chromatogramm), Lauf bis progress (0..1)."""
    im = Image.new('RGB', (W, H), (243, 243, 243))
    d = ImageDraw.Draw(im)
    # Titelleiste
    d.rectangle([0, 0, W, 44], fill=(255, 255, 255))
    d.text((20, 11), 'Chromatographie – Messung läuft', font=f(18), fill=INK)
    d.line([0, 44, W, 44], fill=LINE)
    # Probenliste links
    d.rectangle([0, 45, 300, H], fill=(250, 250, 250))
    d.line([300, 45, 300, H], fill=LINE)
    d.text((24, 66), 'Sequenz', font=f(20, True), fill=INK)
    rows = [('Standard 1', 'fertig'), ('Standard 2', 'fertig'), ('Probe 4711-01', 'läuft'), ('Probe 4711-02', 'wartet'),
            ('Probe 4711-03', 'wartet'), ('Blindwert', 'wartet')]
    for i, (n, st) in enumerate(rows):
        y = 112 + i * 52
        if st == 'läuft':
            d.rounded_rectangle([12, y - 8, 288, y + 36], 6, fill=(229, 241, 251))
            d.rectangle([12, y + 2, 15, y + 26], fill=ACCENT)
        d.text((28, y), n, font=f(17), fill=INK)
        d.text((200, y + 1), st, font=f(15), fill=ACCENT if st == 'läuft' else MUTED)
    # Kopf des Messbereichs
    d.text((340, 64), 'Probe 4711-01 · Detektor UV 254 nm', font=f(24, True), fill=INK)
    t = int(30 * progress * 60)
    d.text((340, 110), f'Laufzeit {t // 60:02d}:{t % 60:02d} von 30:00 min', font=f(17), fill=MUTED)
    # Diagramm
    x0, y0, x1, y1 = 340, 160, W - 40, H - 150
    d.rounded_rectangle([x0, y0, x1, y1], 10, fill=(255, 255, 255), outline=LINE)
    for k in range(1, 5):
        yy = y0 + (y1 - y0) * k / 5
        d.line([x0 + 50, yy, x1 - 20, yy], fill=(240, 240, 240))
    for k in range(0, 7):
        xx = x0 + 50 + (x1 - x0 - 70) * k / 6
        d.text((xx - 8, y1 - 34), str(k * 5), font=f(14), fill=MUTED)
    d.text((x1 - 70, y1 - 34), 'min', font=f(14), fill=MUTED)
    pts = []
    n = int(600 * progress)
    for i in range(n + 1):
        x = i / 600
        px = x0 + 50 + (x1 - x0 - 70) * x
        py = y1 - 50 - signal(x) * (y1 - y0 - 90) / 360
        pts.append((px, py))
    if len(pts) > 1:
        d.line(pts, fill=ACCENT, width=3, joint='curve')
        d.ellipse([pts[-1][0] - 6, pts[-1][1] - 6, pts[-1][0] + 6, pts[-1][1] + 6], fill=ACCENT)
    # Fußzeile
    d.text((340, 136), 'Druck 182 bar · Fluss 1,0 ml/min · Säule 30 °C', font=f(15), fill=MUTED)
    return im


def pill():
    """Sperrleiste aus dem echten Bildschirmfoto, mit runder Maske freigestellt."""
    src = Image.open(os.path.join(shots, 'lock-light.png')).convert('RGBA')
    sx = src.width / 2000
    box = (int(704 * sx), int(1196 * sx), int(1298 * sx), int(1288 * sx))
    p = src.crop(box)
    mask = Image.new('L', p.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([4, 4, p.width - 5, p.height - 5], (p.height - 8) // 2, fill=255)
    p.putalpha(mask)
    scale = 0.9
    return p.resize((int(p.width * scale), int(p.height * scale)), Image.LANCZOS)


def shadow(img, radius=18, offset=6, alpha=70):
    sh = Image.new('RGBA', (img.width + radius * 4, img.height + radius * 4), (0, 0, 0, 0))
    m = img.split()[-1].point(lambda a: alpha if a > 0 else 0)
    sh.paste((0, 0, 0, 255), (radius * 2, radius * 2 + offset), m)
    return sh.filter(ImageFilter.GaussianBlur(radius))


def locked(progress, with_dialog=False):
    im = app(progress).convert('RGBA')
    p = pill()
    px, py = (W - p.width) // 2, H - p.height - 40
    s = shadow(p, 14, 4, 90)
    im.alpha_composite(s, (px - 28, py - 28))
    im.alpha_composite(p, (px, py))
    if with_dialog:
        dim = Image.new('RGBA', im.size, (0, 0, 0, 60))
        im.alpha_composite(dim)
        dlg = Image.open(os.path.join(shots, 'unlock-entra-light.png')).convert('RGBA')
        k = 760 / dlg.height
        dlg = dlg.resize((int(dlg.width * k), int(dlg.height * k)), Image.LANCZOS)
        dx, dy = (W - dlg.width) // 2, (H - dlg.height) // 2 - 20
        # Die Karte des Dialogs ist im Bildschirmfoto halbdurchsichtig (Acryl): undurchsichtig hinterlegen
        card = ImageDraw.Draw(im)
        card.rounded_rectangle([dx + int(84 * k), dy + int(84 * k), dx + int(914 * k), dy + int(946 * k)], int(30 * k), fill=(249, 249, 249, 255))
        im.alpha_composite(dlg, (dx, dy))
    return im.convert('RGB')


frames, durations = [], []
for i in range(14):                       # gesperrt, die Messung läuft weiter
    frames.append(locked(0.30 + i * 0.012)); durations.append(180)
durations[-1] = 1200
frames.append(locked(0.47, with_dialog=True)); durations.append(2600)   # Klick: Entsperr-Dialog
frames.append(app(0.48)); durations.append(2200)                        # entsperrt
os.makedirs(os.path.dirname(out), exist_ok=True)
frames[0].save(out, save_all=True, append_images=frames[1:], duration=durations, loop=0, quality=80, method=6)
print(f'{out}: {len(frames)} Bilder, {os.path.getsize(out) // 1024} KB')
