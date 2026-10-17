// Build-Einstellungen aus der Umgebung (siehe README, Abschnitt "Staging").

/** Kanonische Basisadresse ohne abschließenden Schrägstrich. */
export const SITE_URL = (process.env.SITE_URL || 'https://ictbaden.netgetvpn.de').replace(/\/+$/, '');

/** Vorschau-Modus: noindex, robots.txt sperrt alles, Hinweisleiste. Standard: an. */
export const STAGING = (process.env.SITE_STAGING ?? '1') !== '0';

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
