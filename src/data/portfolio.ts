// Themengebiete aus dem bisherigen Portfolio (ict-baden.de/portfolio.html), Inhalt unverändert.
import type { IconName } from '../lib/icons';

export type Part = string | { t: string; href: string };
export interface Topic { title: string; icon: IconName; items: Part[][] }

const STONEHENGE = 'https://github.com/FrankPfattheicher/stonehenge4';

export const PORTFOLIO_INTRO = [
  'Über die Jahre haben sich Erfahrung und Themengebiete angesammelt.',
  'Anbei auch einige Links zu kostenlosen Tools, Bibliotheken und Anleitungen.',
];

export const TOPICS: Topic[] = [
  {
    title: 'Anwendungssoftware',
    icon: 'window',
    items: [
      ['Web – ', { t: 'stonehenge Framework', href: STONEHENGE }],
      ['Desktop Anwendungen Windows / Linux / MacOS – ', { t: 'stonehenge Framework', href: STONEHENGE }],
      ['Systemdienste Windows / Linux'],
      ['Windows Desktop (WPF)'],
    ],
  },
  {
    title: 'Softwareprotokolle',
    icon: 'protocol',
    items: [
      ['OPC-UA und Classic'],
      ['Modbus TCP – ', { t: 'ModbusExplorer (kostenlos)', href: '#modbus' }],
      ['IEC 60870-5-101 / 104'],
    ],
  },
  {
    title: 'Industrie 4.0 – IoT – Embedded',
    icon: 'chip',
    items: [
      ['Azure IoT Edge – ', { t: 'Install Azure IoT-Edge on RevolutionPi (Core 3)', href: 'https://github.com/FrankPfattheicher/IotEdgeRevPi' }],
      [
        'Raspberry Pi & Co – Nuget Pakete: ',
        { t: 'RasPi', href: 'https://www.nuget.org/packages/IctBaden.Raspi/' },
        ', ',
        { t: 'RevolutionPi', href: 'https://www.nuget.org/packages/IctBaden.RevolutionPi/' },
        ', ',
        { t: 'PiXtend', href: 'https://www.nuget.org/packages/IctBaden.PiXtend/' },
        ' · UG-Vortrag: ',
        { t: '.NET auf RasPi', href: 'https://github.com/FrankPfattheicher/RaspiDotnet/blob/master/Slides/RaspiDotnet.pdf' },
      ],
      ['ESP8266 / ESP32'],
    ],
  },
  {
    title: 'Steuerungstechnik',
    icon: 'plc',
    items: [
      ['Siemens S7 (TIA Portal)'],
      ['WAGO (CoDeSys / e!COCKPIT) – ', { t: 'WagoLoader', href: 'https://github.com/FrankPfattheicher/WagoLoader' }],
      ['Beckhoff TwinCAT'],
    ],
  },
  {
    title: 'Telekommunikation',
    icon: 'antenna',
    items: [
      ['SIP VoIP – ', { t: '.NET Wrapper für PJSIP', href: 'https://github.com/FrankPfattheicher/IctBaden.pjsua2' }],
      ['5G/LTE-Modem/Router'],
      ['SMS-Versand'],
    ],
  },
  {
    title: 'Energiemanagement Systeme (EMS)',
    icon: 'bolt',
    items: [
      ['Datenerfassung – ', { t: 'Zähler', href: '/werkzeuge/pulswertigkeit/' }, ', Messwerte'],
      ['Steuerung – Batterien, Lasten'],
      ['Monitoring – Aktuelle Daten, Verteilung, Trends, Alarme'],
      ['Auswertungen – Betriebstagebuch'],
    ],
  },
  {
    title: 'Eigenentwicklungen: Überwachung & Alarmierung',
    icon: 'bell',
    items: [
      ['Informant – Alarmierung im industriellen Umfeld'],
      ['CallCenter – Industrieller Anrufbeantworter und Telefonzentrale'],
      ['Monitoring'],
    ],
  },
  {
    title: 'Hosting & Cloud',
    icon: 'cloud',
    items: [['Microsoft Azure'], ['Amazon Web Services (aws)'], ['Docker / Kubernetes']],
  },
  {
    title: 'Datenbanken',
    icon: 'database',
    items: [['Mongo DB'], ['SQL-Server'], ['Cosmos DB']],
  },
];

/**
 * Bewährte Eigenentwicklungen aus dem bisherigen Portfolio (Überwachung & Alarmierung). Nicht zum Download – Einsatz
 * und Anpassung nur auf Anfrage. Texte nur aus ict-baden.de/portfolio.html, nichts dazuerfunden.
 */
export interface OwnProduct { id: string; name: string; kind: string; text: string; icon: IconName }
export const OWN_PRODUCTS: OwnProduct[] = [
  { id: 'informant', name: 'Informant', kind: 'Alarmierung', text: 'Alarmierung im industriellen Umfeld.', icon: 'bell' },
  { id: 'callcenter', name: 'CallCenter', kind: 'Telefonie', text: 'Industrieller Anrufbeantworter und Telefonzentrale.', icon: 'phone' },
];

/** Leistungen aus der bisherigen Startseite */
export const SERVICES = {
  claim: 'Getting Things Done',
  intro: 'Wir bieten Beratung und Softwareentwicklung im Auftrag.',
  points: [
    { title: 'C# und .NET', icon: 'code' as IconName, text: 'Als Basis dient hierbei vorzugsweise C# als Programmiersprache und Mono bis .NET 10.0.' },
    { title: 'Linux, Windows und Cloud', icon: 'layers' as IconName, text: 'Ziel-Plattformen sind hierbei Linux, Windows und Cloud.' },
    { title: 'C/C++ für Embedded', icon: 'chip' as IconName, text: 'Für spezielle Anwendungen und Embedded-Plattformen wird auch C/C++ verwendet.' },
  ],
};
