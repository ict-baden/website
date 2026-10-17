// Erzeugte Titelmotive für Produkte ohne eigene Bilder: ein Motiv je Produktlinie, je Produkt
// zufällig, aber reproduzierbar (Startwert aus dem Slug). Farben kommen per CSS-Klassen
// (src/styles/art.css), damit keine style-Attribute nötig sind (CSP).
import { ICONS } from './icons';
import { LINE_ICON } from './products';

const W = 480;
const H = 300;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

type Rand = () => number;

function explorer(R: Rand): string {
  // Netz aus Knoten und Verbindungen, ein Knoten mit Suchringen
  const nodes: [number, number, number][] = [];
  let guard = 0;
  while (nodes.length < 15 && guard++ < 400) {
    const x = 70 + R() * 390;
    const y = 30 + R() * 240;
    if (x < 150 && y > 170) continue; // Platz für das Symbol unten links
    if (nodes.some(([nx, ny]) => Math.hypot(nx - x, ny - y) < 52)) continue;
    nodes.push([x, y, 2.5 + R() * 3.5]);
  }
  const edges = new Set<string>();
  let out = '';
  nodes.forEach(([x, y], i) => {
    const near = nodes
      .map(([nx, ny], j) => [j, Math.hypot(nx - x, ny - y)] as const)
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2);
    for (const [j] of near) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (edges.has(key)) continue;
      edges.add(key);
      out += `<line class="ln" x1="${r1(x)}" y1="${r1(y)}" x2="${r1(nodes[j][0])}" y2="${r1(nodes[j][1])}"/>`;
    }
  });
  const hub = nodes[Math.floor(R() * nodes.length)] ?? [300, 140, 4];
  out = [70, 120, 175].map((r, k) => `<circle class="ring r${k}" cx="${r1(hub[0])}" cy="${r1(hub[1])}" r="${r}"/>`).join('') + out;
  out += nodes
    .map(([x, y, r], i) => (i % 5 === 0
      ? `<circle class="halo" cx="${r1(x)}" cy="${r1(y)}" r="${r1(r + 7)}"/><circle class="solid" cx="${r1(x)}" cy="${r1(y)}" r="${r1(r + 1.5)}"/>`
      : `<circle class="dot" cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/>`))
    .join('');
  return out;
}

function labor(R: Rand): string {
  // Rack mit 2D-codierten Röhrchen (8 × 12), einzelne Positionen hervorgehoben
  const cols = 12, rows = 8, step = 30, rad = 10.5;
  const ox = 138 + R() * 12, oy = 42;
  let out = `<rect class="frame" x="${r1(ox - 22)}" y="${oy - 22}" width="${cols * step + 14}" height="${rows * step + 14}" rx="18"/>`;
  const picks = new Set([Math.floor(R() * 96), Math.floor(R() * 96), Math.floor(R() * 96)]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = r1(ox + c * step), y = r1(oy + r * step);
      const v = R();
      if (picks.has(i)) out += `<circle class="halo" cx="${x}" cy="${y}" r="${rad + 5}"/><circle class="solid" cx="${x}" cy="${y}" r="${rad}"/>`;
      else if (v < 0.62) out += `<circle class="fill" cx="${x}" cy="${y}" r="${rad}"/><rect class="code" x="${r1(x - 4)}" y="${r1(y - 4)}" width="8" height="8" rx="1"/>`;
      else out += `<circle class="ln" cx="${x}" cy="${y}" r="${rad}"/>`;
    }
  }
  return out;
}

function ot(R: Rand): string {
  // Anlagenraster mit gesperrten Zellen, dahinter ein großer Schild
  let out = '<path class="shield" d="M300 18 196 56v78c0 64 44 114 104 134 60-20 104-70 104-134V56L300 18Z"/>';
  const cols = 9, rows = 6, size = 34, gap = 10;
  const ox = 116, oy = 22;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * (size + gap), y = oy + r * (size + gap);
      if (x < 150 && y > 160) continue;
      const v = R();
      if (v < 0.1) {
        out += `<rect class="solid" x="${x}" y="${y}" width="${size}" height="${size}" rx="8"/>` +
          `<path class="lock" d="M${x + 11} ${y + 16}v-3a6 6 0 0 1 12 0v3M${x + 9} ${y + 16}h16v10H${x + 9}z"/>`;
      } else if (v < 0.55) out += `<rect class="fill" x="${x}" y="${y}" width="${size}" height="${size}" rx="8"/>`;
      else out += `<rect class="ln" x="${x + 0.5}" y="${y + 0.5}" width="${size - 1}" height="${size - 1}" rx="8"/>`;
    }
  }
  return out;
}

function server(R: Rand): string {
  // Server-Schrank: Einschübe mit LEDs und Auslastung
  let out = '';
  const x = 168, w = 280, h = 24, gap = 9;
  out += `<rect class="frame" x="${x - 16}" y="16" width="${w + 32}" height="268" rx="16"/>`;
  for (let i = 0; i < 8; i++) {
    const y = 30 + i * (h + gap);
    out += `<rect class="fill" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
    for (let k = 0; k < 3; k++) out += `<circle class="${R() < 0.55 ? 'solid' : 'dot'}" cx="${x + 16 + k * 13}" cy="${y + h / 2}" r="3.2"/>`;
    const load = 0.2 + R() * 0.75;
    out += `<rect class="ln" x="${x + 70}" y="${y + 9}" width="${w - 90}" height="6" rx="3"/>`;
    out += `<rect class="bar" x="${x + 70}" y="${y + 9}" width="${r1((w - 90) * load)}" height="6" rx="3"/>`;
  }
  return out;
}

function android(R: Rand): string {
  // Strichcode mit Scanlinie
  let out = '';
  let x = 150;
  const y = 54, h = 196;
  while (x < 448) {
    const w = 2 + Math.floor(R() * 4) * 2;
    if (R() < 0.68) out += `<rect class="bar" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    x += w + 2 + Math.floor(R() * 3) * 2;
  }
  const sy = r1(110 + R() * 90);
  out += `<rect class="beam-glow" x="120" y="${r1(sy - 16)}" width="360" height="32"/>`;
  out += `<rect class="beam" x="120" y="${r1(sy - 1.5)}" width="360" height="3" rx="1.5"/>`;
  out += `<path class="corner" d="M138 46v-16h22M460 46v-16h-22M138 258v16h22M460 258v16h-22"/>`;
  return out;
}

function service(R: Rand): string {
  // Signalverläufe (Messung, Übertragung)
  let out = '';
  const n = 7;
  for (let i = 0; i < n; i++) {
    const amp = 12 + R() * 34;
    const ph = R() * Math.PI * 2;
    const y0 = 50 + i * 32;
    let d = '';
    for (let x = 100; x <= W + 10; x += 12) {
      const y = y0 + Math.sin(x / 46 + ph) * amp * (0.45 + (x / W) * 0.55);
      d += `${x === 100 ? 'M' : 'L'}${x} ${r1(y)}`;
    }
    out += `<path class="wave w${i % 3}" d="${d}"/>`;
    const px = 180 + R() * 260;
    out += `<circle class="${i % 3 === 0 ? 'solid' : 'dot'}" cx="${r1(px)}" cy="${r1(y0 + Math.sin(px / 46 + ph) * amp * (0.45 + (px / W) * 0.55))}" r="${i % 3 === 0 ? 5 : 3}"/>`;
  }
  return out;
}

function neu(R: Rand): string {
  // Funken und Lichtpunkte
  let out = '';
  const star = (cx: number, cy: number, s: number, cls: string) =>
    `<path class="${cls}" d="M${r1(cx)} ${r1(cy - s)}C${r1(cx + s * 0.12)} ${r1(cy - s * 0.12)} ${r1(cx + s * 0.12)} ${r1(cy - s * 0.12)} ${r1(cx + s)} ${r1(cy)}C${r1(cx + s * 0.12)} ${r1(cy + s * 0.12)} ${r1(cx + s * 0.12)} ${r1(cy + s * 0.12)} ${r1(cx)} ${r1(cy + s)}C${r1(cx - s * 0.12)} ${r1(cy + s * 0.12)} ${r1(cx - s * 0.12)} ${r1(cy + s * 0.12)} ${r1(cx - s)} ${r1(cy)}C${r1(cx - s * 0.12)} ${r1(cy - s * 0.12)} ${r1(cx - s * 0.12)} ${r1(cy - s * 0.12)} ${r1(cx)} ${r1(cy - s)}Z"/>`;
  out += star(310 + R() * 60, 130 + R() * 40, 74, 'solid-soft');
  for (let i = 0; i < 9; i++) out += star(140 + R() * 320, 30 + R() * 240, 8 + R() * 18, i % 3 ? 'fill' : 'solid');
  for (let i = 0; i < 26; i++) out += `<circle class="dot" cx="${r1(120 + R() * 350)}" cy="${r1(20 + R() * 260)}" r="${r1(1.2 + R() * 2.6)}"/>`;
  return out;
}

const MOTIFS: Record<string, (R: Rand) => string> = { explorer, labor, ot, server, android, service, neu };

/** SVG-Markup des Titelmotivs (16:10). */
export function coverArt(slug: string, linie: string, uid = ""): string {
  const R = rng(hash(`${linie}:${slug}`));
  const id = `g-${slug}${uid}`;
  const motif = (MOTIFS[linie] ?? neu)(R);
  return `<svg class="art art--${linie}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">` +
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop class="s1" offset="0"/><stop class="s2" offset="1"/></linearGradient>` +
    `<radialGradient id="${id}-sh" cx="0.85" cy="0.05" r="0.9"><stop class="sh1" offset="0"/><stop class="sh2" offset="1"/></radialGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#${id})"/><rect width="${W}" height="${H}" fill="url(#${id}-sh)"/>` +
    `<g class="motif">${motif}</g></svg>`;
}

/** Produktsymbol im Stil der Repo-Logos: abgerundete Kachel mit Verlauf und Liniensymbol. */
export function productGlyph(slug: string, linie: string, uid = ""): string {
  const id = `pg-${slug}${uid}`;
  const icon = ICONS[LINE_ICON[linie] ?? 'sparkle'];
  return `<svg class="pglyph art--${linie}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">` +
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop class="s1" offset="0"/><stop class="s2" offset="1"/></linearGradient></defs>` +
    `<rect x="2" y="2" width="28" height="28" rx="7" fill="url(#${id})"/>` +
    `<g transform="translate(6.4 6.4) scale(0.8)" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${icon}</g></svg>`;
}
