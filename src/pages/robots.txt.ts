// robots.txt: in der Vorschau (SITE_STAGING=1) alles sperren. Live: alles erlauben und die wichtigen Such- und
// KI-Crawler ausdrücklich nennen (dokumentiert die Absicht; "User-agent: *" deckt sie ohnehin ab). Ob Trainings-Crawler
// (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) zugelassen werden, ist eine geschäftliche Entscheidung –
// für größtmögliche Sichtbarkeit in KI-Antworten sind sie erlaubt. Achtung: Cloudflare kann KI-Crawler unabhängig davon
// blockieren ("Block AI bots", verwaltete robots.txt) – siehe README, "Going live".
import type { APIRoute } from 'astro';
import { SITE_URL, STAGING } from '../config';

const CRAWLERS = [
  // Suchmaschinen
  'Googlebot', 'Bingbot', 'DuckDuckBot', 'Applebot', 'YandexBot',
  // KI-Suche und Abruf auf Anfrage von Nutzern
  'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User',
  // KI-Training
  'GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot',
];

export const GET: APIRoute = () => {
  const body = STAGING
    ? '# Vorschau – nicht indexieren\nUser-agent: *\nDisallow: /\n'
    : [
        '# ICT Baden – Suchmaschinen und KI-Crawler sind willkommen.',
        ...CRAWLERS.map((ua) => `User-agent: ${ua}`),
        'Allow: /',
        '',
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        '',
      ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
