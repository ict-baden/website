#!/usr/bin/env node
// Prüft den Pulswertigkeit-Rechner gegen die Formeln der bisherigen Seite counter-pulse.html.
// Die Referenz unten ist das Original-Skript (calc()) unverändert, nur ohne DOM: Eingaben als Text.
import assert from 'node:assert/strict';
import { parseNumber, pulseFromFactor, pulseFromMeter, transformerFactor } from '../public/js/pulse-core.js';

// --- Original (counter-pulse.html), Werte kommen dort als Strings aus den Eingabefeldern ---
function originalCalc(v) {
  const impulses = v.impulses;
  const factor = v.factor;
  const pulse = ((factor * 1000) / impulses).toString();
  const MwImpulses = v.MwImpulses;
  const MwVolts = v.MwVolts;
  const MwVoltsDiv = v.MwVoltsDiv;
  const MwAmps = v.MwAmps;
  const MwAmpsDiv = v.MwAmpsDiv;
  const MwVoltsFactor = MwVolts / MwVoltsDiv;
  const MwAmpsFactor = MwAmps / MwAmpsDiv;
  const MwFactor = MwVoltsFactor * MwAmpsFactor;
  const MwPulse = ((MwFactor * 1000) / MwImpulses).toString();
  return { pulse, MwPulse };
}

const cases = [
  { name: 'Startwerte der Seite', impulses: '20000', factor: '100', MwImpulses: '20000', MwVolts: '20000', MwVoltsDiv: '100', MwAmps: '100', MwAmpsDiv: '5', expect: { pulse: 5, MwPulse: 200 } },
  { name: 'Direktmessung 3 x 230/400 5(100), 250 Imp/kWh', impulses: '250', factor: '1', MwImpulses: '250', MwVolts: '400', MwVoltsDiv: '400', MwAmps: '5', MwAmpsDiv: '5', expect: { pulse: 4, MwPulse: 4 } },
  { name: '3 x 58/100 1(6), 20000 Imp/kWh, 20 kV/100 V, 150/1 A', impulses: '20000', factor: '30000', MwImpulses: '20000', MwVolts: '20000', MwVoltsDiv: '100', MwAmps: '150', MwAmpsDiv: '1', expect: { pulse: 1500, MwPulse: 1500 } },
  { name: '3 x 58/100 1(2), 100000 Imp/kWh, 110 kV/100 V, 300/1 A', impulses: '100000', factor: '330000', MwImpulses: '100000', MwVolts: '110000', MwVoltsDiv: '100', MwAmps: '300', MwAmpsDiv: '1', expect: { pulse: 3300, MwPulse: 3300 } },
  { name: '3 x 230/400 1(6), 5000 Imp/kWh, Stromwandler 200/5 A', impulses: '5000', factor: '40', MwImpulses: '5000', MwVolts: '400', MwVoltsDiv: '400', MwAmps: '200', MwAmpsDiv: '5', expect: { pulse: 8, MwPulse: 8 } },
  { name: 'krumme Werte', impulses: '12500', factor: '7.5', MwImpulses: '12500', MwVolts: '6000', MwVoltsDiv: '110', MwAmps: '75', MwAmpsDiv: '5', expect: null },
];

const rows = [];
for (const c of cases) {
  const orig = originalCalc(c);
  const n = (k) => parseNumber(c[k]);
  const pulse = pulseFromFactor(n('impulses'), n('factor'));
  const mw = pulseFromMeter(n('MwImpulses'), n('MwVolts'), n('MwVoltsDiv'), n('MwAmps'), n('MwAmpsDiv'));
  assert.equal(pulse, Number(orig.pulse), `${c.name}: pulse`);
  assert.equal(mw, Number(orig.MwPulse), `${c.name}: MwPulse`);
  if (c.expect) {
    assert.equal(pulse, c.expect.pulse, `${c.name}: erwarteter Wert pulse`);
    assert.equal(mw, c.expect.MwPulse, `${c.name}: erwarteter Wert MwPulse`);
  }
  rows.push({
    Beispiel: c.name,
    'Wandlerfaktor': transformerFactor(n('MwVolts'), n('MwVoltsDiv'), n('MwAmps'), n('MwAmpsDiv')),
    'Original pulse [Wh]': orig.pulse,
    'Neu pulse [Wh]': pulse,
    'Original MwPulse [Wh]': orig.MwPulse,
    'Neu MwPulse [Wh]': mw,
  });
}
console.table(rows);

// Eingaben in deutscher Schreibweise (das Original rechnete hier mit NaN bzw. falschen Werten)
assert.equal(parseNumber('0,5'), 0.5);
assert.equal(parseNumber('20.000'), 20000);
assert.equal(parseNumber('1.234,5'), 1234.5);
assert.equal(parseNumber(' 100 '), 100);
assert.equal(parseNumber('7.5'), 7.5);
assert.ok(Number.isNaN(parseNumber('')));
assert.ok(Number.isNaN(parseNumber('abc')));
console.log('Pulswertigkeit: alle Rechenbeispiele stimmen mit der Originalformel überein.');
