// Google sends the person back here. We swap the one-time code for a login, then check the role.
import type { APIRoute } from 'astro';
import { createAuthClient, getRole } from '../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, url, redirect }) => {
  const code = url.searchParams.get('code');
  if (!code) return redirect('/admin/login/?error=1');

  const supabase = createAuthClient(request, cookies);
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return redirect('/admin/login/?error=1');

  const role = await getRole(data.user);
  if (!role) {
    await supabase.auth.signOut();
    return redirect('/admin/not-allowed/');
  }
  return redirect('/admin/');
};
