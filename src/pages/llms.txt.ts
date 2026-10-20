// /llms.txt – Kurzüberblick für KI-Assistenten (https://llmstxt.org), erzeugt aus den Produktdaten.
import type { APIRoute } from 'astro';
import { llmsTxt } from '../lib/llms';

export const GET: APIRoute = () => new Response(llmsTxt(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
