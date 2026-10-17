import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'ICT Baden',
      short_name: 'ICT Baden',
      lang: 'de',
      start_url: '/',
      display: 'browser',
      background_color: '#faf9f5',
      theme_color: '#ffd200',
      icons: [
        { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    }, null, 2),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
