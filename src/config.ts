// Build-Einstellungen aus der Umgebung (siehe README, Abschnitt "Staging").

/** Kanonische Basisadresse ohne abschließenden Schrägstrich. */
export const SITE_URL = (process.env.SITE_URL || 'https://ictbaden.netgetvpn.de').replace(/\/+$/, '');

/** Vorschau-Modus: noindex, robots.txt sperrt alles, Hinweisleiste. Standard: an. */
export const STAGING = (process.env.SITE_STAGING ?? '1') !== '0';

/** Bestätigungscodes für die Google Search Console und Bing Webmaster Tools (nur Meta-Tag auf der Startseite;
 *  alternativ per DNS-TXT-Eintrag bestätigen, dann leer lassen). Siehe README, Abschnitt "Going live". */
export const VERIFY = {
  google: (process.env.GOOGLE_SITE_VERIFICATION ?? '').trim(),
  bing: (process.env.BING_SITE_VERIFICATION ?? '').trim(),
};

/** IndexNow-Schlüssel (8–128 Zeichen a-z, A-Z, 0-9, -): erzeugt /<schlüssel>.txt; deploy/deploy.sh meldet geänderte
 *  Adressen beim Livegang an IndexNow (Bing, Yandex u. a.). Leer = kein IndexNow. */
export const INDEXNOW_KEY = (process.env.INDEXNOW_KEY ?? '').trim();
if (INDEXNOW_KEY && !/^[A-Za-z0-9-]{8,128}$/.test(INDEXNOW_KEY)) throw new Error('INDEXNOW_KEY: 8–128 Zeichen aus a-z, A-Z, 0-9 und -');

export const COMPANY = {
  name: 'ICT Baden GmbH',
  claim: 'Getting Things Done',
  district: 'Baden-Durlach',
  street: 'Seboldstraße 9',
  zip: '76227',
  city: 'Karlsruhe',
  navAddress: 'Zur Gießerei 20',
  contactPerson: 'Frank Pfattheicher',
  email: 'fpf@ict-baden.de',
  /** Schreibweise wie im bisherigen Impressum; den Umbruch verhindert CSS (Klasse .tel in base.css) */
  mobile: '+49 172-7207196',
  mobileHref: 'tel:+491727207196',
  phone: '+49 721-9415787',
  phoneHref: 'tel:+497219415787',
  court: 'Amtsgericht Mannheim',
  hrb: 'HRB 706949',
  taxNo: '34413/57689',
  vatId: 'DE 265276745',
  ceo: 'Frank Pfattheicher',
} as const;

export const NAV = [
  { href: '/leistungen/', label: 'Leistungen' },
  { href: '/produkte/', label: 'Produkte' },
  { href: '/downloads/', label: 'Downloads' },
  { href: '/ueber-uns/', label: 'Über uns' },
  { href: '/kontakt/', label: 'Kontakt' },
] as const;

/** mailto-Link mit vorbelegtem Betreff. */
export function mailto(subject?: string): string {
  return `mailto:${COMPANY.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}
