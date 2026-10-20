// /llms-full.txt – alle Produktfakten als Markdown (Funktionen, Voraussetzungen, Grenzen, FAQ).
import type { APIRoute } from 'astro';
import { llmsFullTxt } from '../lib/llms';

export const GET: APIRoute = () => new Response(llmsFullTxt(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
