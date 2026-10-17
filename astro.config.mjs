// @ts-check
import { defineConfig } from 'astro/config';

// Kanonische Adresse der Website. Für die Vorschau auf docker01 ist das ictbaden.netgetvpn.de,
// für den Livegang SITE_URL=https://ict-baden.de setzen (siehe README).
const SITE_URL = (process.env.SITE_URL || 'https://ictbaden.netgetvpn.de').replace(/\/+$/, '');

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  compressHTML: true,
  devToolbar: { enabled: false },
  build: {
    format: 'directory',
    // Kein Inline-CSS: die Content-Security-Policy erlaubt nur Stylesheets vom eigenen Server
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Zielbrowser für den CSS-Minifier (lightningcss): ohne Ziele fasst er backdrop-filter und
      // -webkit-backdrop-filter zur Präfix-Fassung zusammen, die Chrome und Firefox ignorieren.
      // Mit Zielen ergänzt er das Präfix für Safari selbst (Baseline "weitgehend verfügbar").
      cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16.4'],
      // Ein gemeinsames Stylesheet für alle Seiten: eine Anfrage, danach aus dem Cache
      cssCodeSplit: false,
      // Keine data:-URIs für Schriften oder Bilder – alles als eigene Datei mit Hash im Namen
      assetsInlineLimit: 0,
    },
  },
});
