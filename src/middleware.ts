// Guards /admin/* and /api/admin/*. Every other page is untouched (they are built ahead of time and must not read cookies).
import { defineMiddleware } from 'astro:middleware';
import { createAuthClient, getRole } from './lib/auth';

// The pages that must work without being logged in.
const OPEN = new Set(['/admin/login', '/admin/callback', '/admin/logout', '/admin/not-allowed']);

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname.replace(/\/+$/, '') || '/';
  const isApi = path === '/api/admin' || path.startsWith('/api/admin/');
  const isAdmin = path === '/admin' || path.startsWith('/admin/');
  if (!isApi && !isAdmin) return next();

  // Never cache these pages, and keep them out of search engines.
  const finish = (response: Response) => {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  };

  if (OPEN.has(path)) return finish(await next());

  const supabase = createAuthClient(context.request, context.cookies);
  // getUser() asks Supabase to check the login every time (getSession() only trusts the cookie).
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    if (isApi) return finish(new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401, headers: { 'Content-Type': 'application/json' } }));
    return finish(context.redirect('/admin/login/'));
  }

  const role = await getRole(user);
  if (!role) {
    await supabase.auth.signOut(); // an admin who was removed loses the login too
    if (isApi) return finish(new Response(JSON.stringify({ error: 'Not allowed' }), { status: 403, headers: { 'Content-Type': 'application/json' } }));
    return finish(context.redirect('/admin/not-allowed/'));
  }

  context.locals.user = { email: user.email!.toLowerCase(), role };
  return finish(await next());
});