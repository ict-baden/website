// Datenschutzerklärungen der Android-Apps unter /datenschutz/<app>/ (Google Play). Die Seiten kommen aus
// src/pages/datenschutz/[app].astro (PR #1); solange es die Datei nicht gibt, ist die Liste leer und die
// Produktseiten verlinken nichts, das 404 liefern würde. Die Sitemap nimmt die Seiten von hier.
type Entry = { params: { app: string }; props?: { name?: string } };
type PageModule = { getStaticPaths?: () => Entry[] | Promise<Entry[]> };

const modules = import.meta.glob('../pages/datenschutz/*.astro', { eager: true }) as Record<string, PageModule>;

/** Slugs der vorhandenen App-Datenschutzseiten. */
export async function appPrivacyPages(): Promise<string[]> {
  const out: string[] = [];
  for (const [file, mod] of Object.entries(modules)) {
    if (!/\[app\]\.astro$/.test(file) || typeof mod.getStaticPaths !== 'function') continue;
    for (const e of await mod.getStaticPaths()) out.push(e.params.app);
  }
  return out;
}
