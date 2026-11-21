// Weekly-ish keep-alive for the Vercel cron job (see vercel.json). Vercel sends "Authorization: Bearer <CRON_SECRET>".
// Not under /api/admin on purpose: no one is logged in. It refuses everything when CRON_SECRET is not set.
import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'node:crypto';
import { keepAlive } from '../../lib/admin';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const secret = import.meta.env.CRON_SECRET as string | undefined;
  const got = Buffer.from(request.headers.get('authorization') ?? '');
  const want = Buffer.from(`Bearer ${secret ?? ''}`);
  if (!secret || got.length !== want.length || !timingSafeEqual(got, want)) return new Response('Unauthorized', { status: 401 });
  const err = await keepAlive();
  return new Response(err ?? 'ok', { status: err ? 500 : 200, headers: { 'Cache-Control': 'no-store' } });
};
