#!/usr/bin/env node
// Prüft src/data/products.json: nur öffentliche Felder, keine internen Inhalte, Bilder vorhanden.
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { findCompetitorMentions, findLeaks } from './lib/public-guard.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const data = JSON.parse(readFileSync(join(ROOT, 'src/data/products.json'), 'utf8'));
const overrides = JSON.parse(readFileSync(join(ROOT, 'scripts/public-overrides.json'), 'utf8'));
const approved = new Set(Object.entries(overrides.products ?? {}).filter(([, r]) => r.ersetzt === true).map(([id]) => id));
const problems = [...findLeaks(data), ...findCompetitorMentions(data, approved)];

// Genau die Produkte aus "veroeffentlicht" (scripts/public-overrides.json) – nicht mehr und nicht weniger
const published = overrides.veroeffentlicht ?? [];
const ids = data.products.map((p) => p.id);
for (const id of published) if (!ids.includes(id)) problems.push(`${id}: steht in "veroeffentlicht", fehlt aber in products.json (Sync ausführen)`);
for (const id of ids) if (!published.includes(id)) problems.push(`${id}: ist in products.json, steht aber nicht in "veroeffentlicht"`);
for (const l of data.linien) if (!data.products.some((p) => p.linie === l.id)) problems.push(`Linie ${l.id} hat keine Produkte`);

const slugs = new Set();
for (const p of data.products) {
  if (slugs.has(p.slug)) problems.push(`doppelter Slug ${p.slug}`);
  slugs.add(p.slug);
  if (!data.linien.some((l) => l.id === p.linie)) problems.push(`${p.id}: unbekannte Linie ${p.linie}`);
  const urls = JSON.stringify(p.media).match(/\/media\/produkte\/[a-z0-9-]+\/[a-z0-9.-]+/g) ?? [];
  for (const u of new Set(urls)) if (!existsSync(join(ROOT, 'public', u))) problems.push(`${p.id}: Bild fehlt ${u}`);
  for (const s of p.media.screenshots) if (!s.alt || s.alt.length < 10) problems.push(`${p.id}: Alternativtext fehlt für ${s.name}`);
  // Jedes Produkt braucht ein Symbol: erzeugt (npm run icons) oder eigenes aus dem Repo
  if (!existsSync(join(ROOT, 'src', 'assets', 'product-icons', `${p.id}.svg`)) && !p.media.logo) problems.push(`${p.id}: kein Produktsymbol (scripts/product-icons.mjs ergänzen)`);
  // Jede Produktseite braucht kuratierte Inhalte (deutsch und englisch)
  if (!existsSync(join(ROOT, 'src', 'data', 'produktseiten', `${p.id}.ts`))) problems.push(`${p.id}: src/data/produktseiten/${p.id}.ts fehlt`);
  for (const s of p.media.screenshots) if (!s.en?.alt) problems.push(`${p.id}: englischer Alternativtext fehlt für ${s.name}`);
}

if (problems.length) {
  console.error(`Produktdaten: ${problems.length} Problem(e)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`Produktdaten in Ordnung: ${data.products.length} Produkte (wie "veroeffentlicht"), ${data.linien.length} Linien, keine internen Inhalte, keine Fremdprodukte ohne Freigabe.`);
