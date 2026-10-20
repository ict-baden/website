# Baut das Luftbild der Anfahrt (Kontaktseite) samt Wegen:
#   public/media/kontakt/luftbild-1932.webp, luftbild-966.webp  – Orthofoto DOP20 des LGL Baden-Württemberg
#   src/data/luftbild.json                                       – Wege, Markierungen, Maßstab in Bildkoordinaten
#
#   python scripts/make-luftbild.py
#
# Quellen (nur beim Bauen abgefragt, nie beim Besuch der Seite):
#   Luftbild: WMS_LGL-BW_ATKIS_DOP_20_C, Datenlizenz Deutschland – Namensnennung – Version 2.0 (Quellenvermerk auf der Seite)
#   Wege:     OSRM auf OpenStreetMap-Daten (routing.openstreetmap.de), © OpenStreetMap-Mitwirkende, ODbL
import io
import json
import math
import os
import sys
import urllib.parse
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'ict-baden-website-build (Anfahrt)'}
R = 6378137.0

# Ausschnitt: Ausfahrt der A5 (West) bis Seboldstraße (Ost), Seitenverhältnis wie der Plan (966 × 540)
VB_W, VB_H = 966, 540
CENTER = (49.0014, 8.4570)
WIDTH_M = 2200
SCALE_M = 300

ICT = (49.0011288, 8.4690563)            # Seboldstraße 9 (OpenStreetMap)
BAHNHOF = (49.0026082, 8.4625733)        # Haltestelle Karlsruhe-Durlach Bahnhof
AUER = (49.0004421, 8.4634778)           # Haltestelle Auer Straße/Dr. Willmar Schwabe
# Herkunft der Autowege: die Route wird wirklich von dort berechnet und am Bildrand abgeschnitten
FRANKFURT = (50.11, 8.68)                # A5 nach Süden, Ausfahrt Karlsruhe-Durlach
STUTTGART = (48.78, 9.18)                # A8 bis Dreieck Karlsruhe, dann A5 nach Norden
CROSS = (49.0019457, 8.4670985)          # Pforzheimer Straße × Pfinzstraße
PFINZ_END = (49.0017813, 8.4690696)      # Pfinzstraße auf Höhe ICT


def merc(lat, lon):
    return R * math.radians(lon), R * math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


k = 1 / math.cos(math.radians(CENTER[0]))
H_M = WIDTH_M * VB_H / VB_W
cx, cy = merc(*CENTER)
BBOX = (cx - WIDTH_M * k / 2, cy - H_M * k / 2, cx + WIDTH_M * k / 2, cy + H_M * k / 2)


def xy(lat, lon):
    x, y = merc(lat, lon)
    return ((x - BBOX[0]) / (BBOX[2] - BBOX[0]) * VB_W, (BBOX[3] - y) / (BBOX[3] - BBOX[1]) * VB_H)


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()


def luftbild():
    w, h = 2400, round(2400 * VB_H / VB_W)
    q = {'SERVICE': 'WMS', 'VERSION': '1.3.0', 'REQUEST': 'GetMap', 'LAYERS': 'IMAGES_DOP_20_RGB', 'STYLES': '',
         'CRS': 'EPSG:3857', 'BBOX': ','.join(f'{v:.2f}' for v in BBOX), 'WIDTH': w, 'HEIGHT': h, 'FORMAT': 'image/jpeg'}
    img = Image.open(io.BytesIO(get('https://owsproxy.lgl-bw.de/owsproxy/ows/WMS_LGL-BW_ATKIS_DOP_20_C?' + urllib.parse.urlencode(q)))).convert('RGB')
    out = os.path.join(ROOT, 'public', 'media', 'kontakt')
    for width in (1932, 966):
        img.resize((width, round(width * VB_H / VB_W)), Image.LANCZOS).save(os.path.join(out, f'luftbild-{width}.webp'), quality=80, method=6)


def route(profile, pts):
    coords = ';'.join(f'{lon},{lat}' for lat, lon in pts)
    r = json.loads(get(f'https://routing.openstreetmap.de/routed-{profile}/route/v1/driving/{coords}?overview=full&geometries=geojson&steps=true'))
    rt = r['routes'][0]
    line = [xy(lat, lon) for lon, lat in rt['geometry']['coordinates']]
    clean = [line[0]]
    for p in line[1:]:
        if math.dist(p, clean[-1]) > 0.6:
            clean.append(p)
    steps = [s for leg in rt['legs'] for s in leg['steps']]
    return clean, steps, rt['distance']


def d(points):
    return 'M ' + ' L '.join(f'{x:.1f} {y:.1f}' for x, y in points)


def frac_of(points, target):
    """Anteil des Weges bis zum Punkt, der target am nächsten liegt."""
    total = sum(math.dist(points[i], points[i + 1]) for i in range(len(points) - 1))
    i = min(range(len(points)), key=lambda j: math.dist(points[j], target))
    return round(sum(math.dist(points[j], points[j + 1]) for j in range(i)) / total, 3)


luftbild()
def clip(points, margin=60):
    """Ab dem Punkt, an dem der Weg zum letzten Mal ins Bild kommt (mit Rand), bis zum Ziel."""
    inside = lambda p: -margin <= p[0] <= VB_W + margin and -margin <= p[1] <= VB_H + margin
    i = len(points) - 1
    while i > 0 and inside(points[i - 1]):
        i -= 1
    return points[i:]


def car_route(origin):
    pts, steps, _ = route('car', [origin, PFINZ_END])
    return clip(pts), steps


car_f, steps_f = car_route(FRANKFURT)
car_s, steps_s = car_route(STUTTGART)
zug, _, _ = route('foot', [BAHNHOF, ICT])
tram, _, _ = route('foot', [AUER, ICT])

# Anteile der Schritte aus den Abbiegungen der Route (B10, Durlacher Allee weiter, Pforzheimer, Pfinzstraße)
def at_step(points, steps, pred):
    # die letzte passende Abbiegung (frühere liegen am Startort der langen Route)
    for s in reversed(steps):
        if pred(s):
            lon, lat = s['maneuver']['location']
            return frac_of(points, xy(lat, lon))
    sys.exit('Abbiegung nicht gefunden – Route prüfen')


def fractions(points, steps):
    off = at_step(points, steps, lambda s: s['maneuver']['type'] == 'off ramp')
    allee = at_step(points, steps, lambda s: s['name'] == 'Durlacher Allee' and s['maneuver']['type'] == 'turn')
    fork = at_step(points, steps, lambda s: s['name'] == 'Durlacher Allee' and s['maneuver']['type'] == 'fork')
    pforz = at_step(points, steps, lambda s: s['name'] == 'Pforzheimer Straße' and s['maneuver']['type'] == 'turn')
    pfinz = at_step(points, steps, lambda s: s['name'] == 'Pfinzstraße' and s['maneuver']['type'] == 'turn')
    return off, allee, fork, pforz, pfinz


f_off, f_allee, f_fork, f_pforz, f_pfinz = fractions(car_f, steps_f)
s_off, s_allee, s_fork, s_pforz, s_pfinz = fractions(car_s, steps_s)

data = {
    '$comment': 'Erzeugt von scripts/make-luftbild.py – nicht von Hand ändern',
    'viewBox': [VB_W, VB_H],
    'meterPerUnit': WIDTH_M / VB_W,
    'scale': {'meters': SCALE_M, 'units': round(SCALE_M / (WIDTH_M / VB_W), 1)},
    'ict': [round(v, 1) for v in xy(*ICT)],
    'bahnhof': [round(v, 1) for v in xy(*BAHNHOF)],
    'auer': [round(v, 1) for v in xy(*AUER)],
    # A5: aus Richtung Frankfurt (Ausfahrt über die Schleife), A8: über das Dreieck Karlsruhe nach Norden (südliche Abfahrt)
    'a5': [d(car_f)], 'a8': [d(car_s)], 'zug': d(zug), 'tram': d(tram),
    # Schritte A5 (Ausfahrt, B10, Allee weiter, Pforzheimer, Pfinzstraße, Hofeinfahrt, links, Parkplatz) nach dem Weg aus Frankfurt;
    # A8 (A8 bis Dreieck, A5 Richtung Frankfurt, Ausfahrt, weiter wie A5)
    'satA5': [f_off, f_allee, f_fork, f_pforz, f_pfinz, 1, 1, 1],
    'satA8': [0, 0, s_off, s_allee],
}
with open(os.path.join(ROOT, 'src', 'data', 'luftbild.json'), 'w', encoding='utf-8', newline='\n') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(json.dumps({k: v for k, v in data.items() if k not in ('a5', 'a8', 'zug', 'tram')}, ensure_ascii=False))
