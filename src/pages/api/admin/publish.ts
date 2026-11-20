// Publish: asks Vercel to rebuild the site (the deploy hook), then resets the unpublished count.
// Both the super-admin and listed admins may press it; src/middleware.ts has already checked the login.
import type { APIRoute } from 'astro';
import { adminDb } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ redirect }) => {
  const back = (msg: string) => redirect('/admin/?error=' + encodeURIComponent(msg), 303);
  const hook = import.meta.env.VERCEL_DEPLOY_HOOK_URL as string | undefined;
  if (!hook) return back('VERCEL_DEPLOY_HOOK_URL is not set (in .env and in Vercel).');

  let ok = false;
  try {
    ok = (await fetch(hook, { method: 'POST' })).ok;
  } catch (e) {
    console.error('[publish] deploy hook failed', e);
  }
  if (!ok) return back('Vercel did not accept the deploy hook. Check the address and try again.');

  await adminDb().from('publish_state').update({ last_published_at: new Date().toISOString(), pending_changes: 0 }).eq('id', 1);
  return redirect('/admin/?published=1', 303);
};
