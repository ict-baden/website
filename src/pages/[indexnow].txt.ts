// IndexNow-Schlüsseldatei /<INDEXNOW_KEY>.txt (nur wenn INDEXNOW_KEY gesetzt ist, siehe src/config.ts und README).
import type { APIRoute } from 'astro';
import { INDEXNOW_KEY } from '../config';

export function getStaticPaths() {
  return INDEXNOW_KEY ? [{ params: { indexnow: INDEXNOW_KEY } }] : [];
}

export const GET: APIRoute = () => new Response(`${INDEXNOW_KEY}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
