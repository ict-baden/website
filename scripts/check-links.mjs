#!/usr/bin/env node
// Prüft alle internen Links, Bilder, Skripte und Anker im gebauten Ordner (Standard: dist).
//   node scripts/check-links.mjs dist [--external]   (--external ruft zusätzlich externe Ziele ab)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const dist = resolve(process.argv[2] || 'dist');
const checkExternal = process.argv.includes('--external');
if (!existsSync(dist)) {
  console.error(`Ordner fehlt: ${dist} (vorher npm run build)`);
  process.exit(2);
}

const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(dist);

const idCache = new Map();
const ids = (file) => {
  if (!idCache.has(file)) idCache.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return idCache.get(file);
};

function resolveTarget(fromFile, url) {
  const pathPart = decodeURI(url.split('#')[0].split('?')[0]);
  if (!pathPart) return fromFile;
  const base = pathPart.startsWith('/') ? dist : join(fromFile, '..');
  let target = join(base, pathPart);
  if (pathPart.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) target = join(target, 'index.html');
  return target;
}

const broken = [];
const external = new Set();
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const where = relative(dist, file).split(sep).join('/');
  const refs = [];
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) for (const part of m[1].split(',')) refs.push(part.trim().split(/\s+/)[0]);
  for (const raw of refs) {
    const url = raw.replace(/&amp;/g, '&');
    if (/^(mailto:|tel:|data:)/.test(url)) continue;
    if (/^https?:\/\//.test(url)) {
      external.add(url);
      continue;
    }
    const target = resolveTarget(file, url);
    if (!existsSync(target)) {
      broken.push(`${where}: ${url} (fehlt)`);
      continue;
    }
    const hash = url.split('#')[1];
    if (hash && target.endsWith('.html') && !ids(target).has(decodeURIComponent(hash))) broken.push(`${where}: ${url} (Anker fehlt)`);
  }
}

if (checkExternal) {
  for (const url of external) {
    try {
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (res.status >= 400) res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
      // 999: LinkedIn blockt automatische Abrufe grundsätzlich
      if (res.status >= 400 && res.status !== 999) broken.push(`extern: ${url} (HTTP ${res.status})`);
    } catch (e) {
      broken.push(`extern: ${url} (${e.message})`);
    }
  }
}

if (broken.length) {
  console.error(`Links: ${broken.length} Fehler\n  ` + broken.join('\n  '));
  process.exit(1);
}
console.log(`Links in Ordnung: ${files.length} Seiten, ${external.size} externe Ziele${checkExternal ? ' erreichbar' : ' (nicht abgerufen, dafür --external)'}.`);
