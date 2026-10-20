// Texte des One-Pagers in Deutsch und Englisch. Die deutsche Fassung liegt unter /, die englische unter /en/.
// Abschnitts-Anker je Sprache; die Navigation, die Markierung beim Scrollen und die Sprachumschaltung nutzen sie.
import type { IconName } from '../lib/icons';
import type { Part } from '../data/portfolio';

export type Lang = 'de' | 'en';

export const HOME: Record<Lang, string> = { de: '/', en: '/en/' };

export const IDS = {
  de: { services: 'leistungen', products: 'produkte', proven: 'bewaehrt', about: 'ueber-uns', contact: 'kontakt', directions: 'anfahrt' },
  en: { services: 'services', products: 'products', proven: 'proven', about: 'about', contact: 'contact', directions: 'directions' },
} as const;

export const NAV_I18N: Record<Lang, { key: keyof typeof IDS.de; label: string }[]> = {
  de: [
    { key: 'services', label: 'Leistungen' },
    { key: 'products', label: 'Produkte' },
    { key: 'proven', label: 'Bewährt' },
    { key: 'about', label: 'Über uns' },
    { key: 'contact', label: 'Kontakt' },
  ],
  en: [
    { key: 'services', label: 'Services' },
    { key: 'products', label: 'Products' },
    { key: 'proven', label: 'Proven' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
  ],
};

/** Link auf einen Abschnitt der Startseite in der Sprache */
export const sectionHref = (lang: Lang, key: keyof typeof IDS.de) => `${HOME[lang]}#${IDS[lang][key]}`;

export const UI_SITE = {
  de: {
    skip: 'Zum Inhalt springen',
    home: 'Start',
    menu: 'Menü', menuClose: 'Menü schließen',
    request: 'Anfrage senden', requestSubject: 'Anfrage über die Website',
    toHome: 'ICT Baden – zur Startseite',
    darkMode: 'Dunkles Design',
    langSwitch: 'Sprache', langOther: 'English', langOtherShort: 'EN', langSelfShort: 'DE',
    footerClaim: 'Softwareentwicklung', website: 'Website', products: 'Produkte', tools: 'Werkzeuge', legal: 'Rechtliches',
    pulse: 'Energiezähler-Pulswertigkeit', imprint: 'Impressum', privacy: 'Datenschutz',
    footerNote: 'Statische Website ohne Tracking', staging: ' · Vorschau, nicht für Suchmaschinen freigegeben',
  },
  en: {
    skip: 'Skip to content',
    home: 'Home',
    menu: 'Menu', menuClose: 'Close menu',
    request: 'Send enquiry', requestSubject: 'Enquiry via the website',
    toHome: 'ICT Baden – to the home page',
    darkMode: 'Dark theme',
    langSwitch: 'Language', langOther: 'Deutsch', langOtherShort: 'DE', langSelfShort: 'EN',
    footerClaim: 'Software development', website: 'Website', products: 'Products', tools: 'Tools', legal: 'Legal',
    pulse: 'Energy meter pulse value (German)', imprint: 'Imprint (German)', privacy: 'Privacy policy (German)',
    footerNote: 'Static website without tracking', staging: ' · preview, not released for search engines',
  },
};

export const HERO = {
  de: {
    eyebrow: 'ICT Baden · Softwareentwicklung in Karlsruhe-Durlach',
    lead: 'Wir bieten Beratung und Softwareentwicklung im Auftrag – und entwickeln eigene Software-Produkte für Industrie, Labor und IT.',
    ctaProducts: 'Produkte ansehen', ctaServices: 'Leistungen', ctaVideo: 'Video ansehen', pointsLabel: 'Schwerpunkte',
    points: [['code', 'C# · Mono bis .NET 10'], ['layers', 'Linux · Windows · Cloud'], ['chip', 'C/C++ für Embedded']] as [IconName, string][],
    chipVitrine: 'Ansehen, nicht anfassen.', chipZutritt: 'Wer darf wohin?',
  },
  en: {
    eyebrow: 'ICT Baden · Software development in Karlsruhe-Durlach, Germany',
    lead: 'We offer consulting and software development for our clients – and build our own software products for industry, labs and IT.',
    ctaProducts: 'View products', ctaServices: 'Services', ctaVideo: 'Watch the video', pointsLabel: 'Focus areas',
    points: [['code', 'C# · Mono to .NET 10'], ['layers', 'Linux · Windows · Cloud'], ['chip', 'C/C++ for embedded']] as [IconName, string][],
    chipVitrine: 'Look, don’t touch.', chipZutritt: 'Who may go where?',
  },
};

export const SERVICES_I18N = {
  de: {
    eyebrow: 'Leistungen',
    title: 'Beratung und Software­entwicklung im Auftrag',
    lead: 'Wir bieten Beratung und Softwareentwicklung im Auftrag. Über die Jahre haben sich Erfahrung und Themengebiete angesammelt – von der Steuerung bis in die Cloud.',
    topics: 'Themengebiete',
    topicsLead: 'Von der Steuerung bis in die Cloud – mit Links zu freien Werkzeugen, Bibliotheken und Vorträgen.',
    topicsMore: 'Mehr bei den bewährten Lösungen',
  },
  en: {
    eyebrow: 'Services',
    title: 'Consulting and custom software development',
    lead: 'We offer consulting and software development for our clients. Over the years we have built up experience in many fields – from PLCs to the cloud.',
    topics: 'Fields of expertise',
    topicsLead: 'From PLCs to the cloud – with links to free tools, libraries and talks.',
    topicsMore: 'More under proven solutions',
  },
};

/** Leistungspunkte auf Englisch (gleiche Reihenfolge und Symbole wie SERVICES.points) */
export const SERVICE_POINTS_EN = [
  { title: 'C# and .NET', text: 'C# is our preferred programming language – from Mono to .NET 10.' },
  { title: 'Linux, Windows and cloud', text: 'Target platforms are Linux, Windows and the cloud.' },
  { title: 'C/C++ for embedded', text: 'For special applications and embedded platforms we also use C/C++.' },
];

const STONEHENGE = 'https://github.com/FrankPfattheicher/stonehenge4';
/** Themengebiete auf Englisch (gleiche Reihenfolge wie TOPICS) */
export const TOPICS_EN: { title: string; items: Part[][] }[] = [
  { title: 'Application software', items: [
    ['Web – ', { t: 'stonehenge framework', href: STONEHENGE }],
    ['Desktop applications for Windows / Linux / macOS – ', { t: 'stonehenge framework', href: STONEHENGE }],
    ['System services for Windows / Linux'],
    ['Windows desktop (WPF)'],
  ] },
  { title: 'Software protocols', items: [
    ['OPC UA and Classic'],
    ['Modbus TCP – ', { t: 'ModbusExplorer (free)', href: '#modbus' }],
    ['IEC 60870-5-101 / 104'],
  ] },
  { title: 'Industry 4.0 – IoT – Embedded', items: [
    ['Azure IoT Edge – ', { t: 'Install Azure IoT-Edge on RevolutionPi (Core 3)', href: 'https://github.com/FrankPfattheicher/IotEdgeRevPi' }],
    [
      'Raspberry Pi & co – NuGet packages: ',
      { t: 'RasPi', href: 'https://www.nuget.org/packages/IctBaden.Raspi/' }, ', ',
      { t: 'RevolutionPi', href: 'https://www.nuget.org/packages/IctBaden.RevolutionPi/' }, ', ',
      { t: 'PiXtend', href: 'https://www.nuget.org/packages/IctBaden.PiXtend/' },
      ' · user group talk: ',
      { t: '.NET on RasPi (German)', href: 'https://github.com/FrankPfattheicher/RaspiDotnet/blob/master/Slides/RaspiDotnet.pdf' },
    ],
    ['ESP8266 / ESP32'],
  ] },
  { title: 'Control systems', items: [
    ['Siemens S7 (TIA Portal)'],
    ['WAGO (CoDeSys / e!COCKPIT) – ', { t: 'WagoLoader', href: 'https://github.com/FrankPfattheicher/WagoLoader' }],
    ['Beckhoff TwinCAT'],
  ] },
  { title: 'Telecommunications', items: [
    ['SIP VoIP – ', { t: '.NET wrapper for PJSIP', href: 'https://github.com/FrankPfattheicher/IctBaden.pjsua2' }],
    ['5G/LTE modems and routers'],
    ['Sending SMS'],
  ] },
  { title: 'Energy management systems (EMS)', items: [
    ['Data acquisition – ', { t: 'meters', href: '/werkzeuge/pulswertigkeit/' }, ', measured values'],
    ['Control – batteries, loads'],
    ['Monitoring – current data, distribution, trends, alarms'],
    ['Reports – operations log'],
  ] },
  { title: 'In-house developments: Monitoring & alerting', items: [
    ['Informant – alerting in industrial environments'],
    ['CallCenter – industrial answering machine and telephone exchange'],
    ['Monitoring'],
  ] },
  { title: 'Hosting & cloud', items: [['Microsoft Azure'], ['Amazon Web Services (AWS)'], ['Docker / Kubernetes']] },
  { title: 'Databases', items: [['MongoDB'], ['SQL Server'], ['Cosmos DB']] },
];

export const PRODUCTS_I18N = {
  de: { eyebrow: 'Eigene Produkte', title: 'Software-Produkte für Industrie, Labor und IT', more: 'Mehr erfahren' },
  en: { eyebrow: 'Own products', title: 'Software products for industry, labs and IT', more: 'Learn more' },
};

export const PROVEN = {
  de: {
    eyebrow: 'Bewährte Lösungen', title: 'Eigenentwicklungen und Werkzeuge',
    lead: 'Seit Jahren im Einsatz: Alarmierung und Telefonie für die Industrie richten wir für Ihre Anlage ein und passen sie an. Die Werkzeuge sind kostenlos.',
    terms: 'Die kostenlosen Werkzeuge sind zur Verwendung „wie sie sind“ gedacht; für ihre Funktion wird keine Garantie gegeben.',
    inUse: 'Im Einsatz · auf Anfrage', free: 'Kostenlos', ask: 'Anfragen', askAbout: 'Anfrage zu', download: 'Download',
    modbusNote: 'Download auf modbus.de', modbusExt: '(externe Seite modbus.de)', calc: 'Zum Rechner',
    items: {
      informant: ['Alarmierung', 'Alarmierung im industriellen Umfeld.'],
      callcenter: ['Telefonie', 'Industrieller Anrufbeantworter und Telefonzentrale.'],
      modbus: ['Modbus', 'Kostenloses Werkzeug für Modbus TCP.'],
      pulse: ['Online-Werkzeug', 'Berechnung der Pulswertigkeit aus Wandlerkonstante oder den Daten eines Messwandlerzählers – direkt im Browser.', 'Energiezähler | Pulswertigkeit'],
    },
  },
  en: {
    eyebrow: 'Proven solutions', title: 'In-house developments and tools',
    lead: 'In use for years: we set up and adapt alerting and telephony for industrial plants. The tools are free of charge.',
    terms: 'The free tools are provided “as is”; no warranty is given for their function.',
    inUse: 'In use · on request', free: 'Free', ask: 'Enquire', askAbout: 'Enquiry about', download: 'Download',
    modbusNote: 'Download on modbus.de', modbusExt: '(external site modbus.de)', calc: 'Calculator (German)',
    items: {
      informant: ['Alerting', 'Alerting in industrial environments.'],
      callcenter: ['Telephony', 'Industrial answering machine and telephone exchange.'],
      modbus: ['Modbus', 'Free tool for Modbus TCP.'],
      pulse: ['Online tool', 'Calculates the pulse value of an energy meter from the meter constant or the data of a transformer-rated meter – right in the browser.', 'Energy meter | pulse value'],
    },
  },
};

export const CONTACT_I18N = {
  de: {
    eyebrow: 'Kontakt', title: 'Sprechen wir über Ihr Projekt.', attn: 'z.Hd.',
    inPerson: 'Persönlich und per Post', address: 'Adresse', email: 'E-Mail', phone: 'Telefon', fax: 'Fax', faxValue: 'NICHT MÖGLICH',
    write: 'E-Mail schreiben', call: 'Anrufen', profiles: 'Profile', external: '(externer Link)',
    profileItems: [['freelance', 'Profil und Verfügbarkeit'], ['LinkedIn', 'Profil'], ['Github', 'Open Source Repositories']],
    directionsEyebrow: 'Anfahrt', directionsTitle: 'So finden Sie uns', country: '',
  },
  en: {
    eyebrow: 'Contact', title: 'Let’s talk about your project.', attn: 'Attn.',
    inPerson: 'In person and by post', address: 'Address', email: 'Email', phone: 'Phone', fax: 'Fax', faxValue: 'not available',
    write: 'Write an email', call: 'Call', profiles: 'Profiles', external: '(external link)',
    profileItems: [['freelance', 'Profile and availability'], ['LinkedIn', 'Profile'], ['GitHub', 'Open source repositories']],
    directionsEyebrow: 'Directions', directionsTitle: 'How to find us', country: 'Germany',
  },
};
