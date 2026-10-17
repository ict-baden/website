// Rechenkern des Pulswertigkeit-Rechners. Formeln unverändert aus der bisherigen Seite counter-pulse.html:
//   pulse   = (factor * 1000) / impulses
//   MwPulse = ((MwVolts / MwVoltsDiv) * (MwAmps / MwAmpsDiv) * 1000) / MwImpulses
// Ergebnis jeweils in Wh je Impuls. Wird im Browser und im Test (npm test) verwendet.

/** Liest eine Zahl in deutscher Schreibweise: Komma als Dezimalzeichen, Punkt als Tausendertrennzeichen. */
export function parseNumber(input) {
  if (typeof input === 'number') return input;
  let s = String(input ?? '').trim().replace(/\s+/g, '').replace(/−/g, '-');
  if (!s) return NaN;
  if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
  else if (s.includes(',')) s = s.replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  return /^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s) ? Number(s) : NaN;
}

/** Primär-Impulskonstante aus Zähler-Impulskonstante und Wandlerkonstante (Wh je Impuls). */
export function pulseFromFactor(impulses, factor) {
  return (factor * 1000) / impulses;
}

/** Wandlerfaktor eines Messwandlerzählers: Spannungs- mal Stromübersetzung. */
export function transformerFactor(volts, voltsDiv, amps, ampsDiv) {
  return (volts / voltsDiv) * (amps / ampsDiv);
}

/** Primär-Impulskonstante eines Messwandlerzählers (Wh je Impuls). */
export function pulseFromMeter(impulses, volts, voltsDiv, amps, ampsDiv) {
  return (transformerFactor(volts, voltsDiv, amps, ampsDiv) * 1000) / impulses;
}

export function isUsable(n) {
  return typeof n === 'number' && Number.isFinite(n);
}
