import type { APIRoute } from 'astro';
import { createAuthClient } from '../../lib/auth';

export const prerender = false;

// POST only (the Log out button is a small form), so a stray link cannot log anyone out.
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  await createAuthClient(request, cookies).auth.signOut();
  return redirect('/admin/login/', 303);
};
