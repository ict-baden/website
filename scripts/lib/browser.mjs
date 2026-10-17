// Chromium für Prüfungen finden: CHROMIUM_PATH, sonst von Playwright installierter Browser, sonst Chrome.
import { chromium } from 'playwright-core';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

function playwrightChromium() {
  const bases = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    join(homedir(), 'AppData', 'Local', 'ms-playwright'),
    join(homedir(), '.cache', 'ms-playwright'),
    join(homedir(), 'Library', 'Caches', 'ms-playwright'),
  ].filter(Boolean);
  for (const base of bases) {
    if (!existsSync(base)) continue;
    const dirs = readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse();
    for (const d of dirs) {
      for (const exe of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux64/chrome', 'chrome-linux/chrome',
        'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const p = join(base, d, exe);
        if (existsSync(p)) return p;
      }
    }
  }
  return null;
}

export async function launch() {
  const executablePath = process.env.CHROMIUM_PATH || playwrightChromium();
  if (executablePath) return chromium.launch({ executablePath });
  return chromium.launch({ channel: 'chrome' });
}
