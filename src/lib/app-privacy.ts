// Datenschutzerklärungen der Apps unter /datenschutz/<slug>/ (src/data/app-datenschutz.ts, gerendert von
// src/pages/datenschutz/[app].astro). Produktseiten und Sitemap nehmen die Liste von hier, damit nichts auf eine
// fehlende Seite verlinkt.
import apps from '../data/app-datenschutz';

/** Slugs der vorhandenen App-Datenschutzseiten. */
export async function appPrivacyPages(): Promise<string[]> {
  return apps.map((a) => a.slug);
}
