// Bedienung des Pulswertigkeit-Rechners (/werkzeuge/pulswertigkeit/).
import { parseNumber, pulseFromFactor, pulseFromMeter, transformerFactor, isUsable } from './pulse-core.js';

const fmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 6 });
const $ = (id) => document.getElementById(id);

function read(id) {
  const el = $(id);
  const n = parseNumber(el.value);
  const bad = !isUsable(n) || n <= 0;
  el.setAttribute('aria-invalid', bad ? 'true' : 'false');
  return bad ? NaN : n;
}

function show(id, value, kwhId) {
  const ok = isUsable(value);
  $(id).textContent = ok ? fmt.format(value) : '–';
  if (kwhId) $(kwhId).textContent = ok ? `= ${fmt.format(value / 1000)} kWh` : 'Bitte gültige Werte größer 0 eingeben.';
}

function calc() {
  show('pulse', pulseFromFactor(read('impulses'), read('factor')), 'pulse-kwh');

  const mi = read('MwImpulses');
  const v = read('MwVolts'), vd = read('MwVoltsDiv'), a = read('MwAmps'), ad = read('MwAmpsDiv');
  const f = transformerFactor(v, vd, a, ad);
  $('MwFactor').textContent = isUsable(f) ? fmt.format(f) : '–';
  show('MwPulse', pulseFromMeter(mi, v, vd, a, ad), 'MwPulse-kwh');
}

const form = document.querySelector('[data-pulse]');
if (form) {
  form.addEventListener('input', calc);
  form.querySelector('[data-js-hint]')?.remove();
  calc();
}
