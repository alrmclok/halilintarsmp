// Login and roles (Part O). Server only: the pages and endpoints under /admin and /api/admin use this.
// Roles: the Google email in SUPER_ADMIN_EMAIL is "super"; emails in the `admins` table are "admin"; everyone else gets null.
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';
import { AsyncLocalStorage } from 'node:async_hooks';

export type Role = 'super' | 'admin';

// Who is acting in the current request. The middleware sets it (Part S), so admin.ts can write the change log
// and check the role without every caller passing the user along. Empty outside a guarded request.
export const actorStore = new AsyncLocalStorage<{ email: string; role: Role }>();
export const currentActor = () => actorStore.getStore() ?? null;

const SB_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const PUBLISHABLE_KEY = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined;

// The client that knows who is logged in (it reads and writes the login cookies). It uses the public key.
export function createAuthClient(request: Request, cookies: AstroCookies): SupabaseClient {
  if (!SB_URL || !PUBLISHABLE_KEY) {
    throw new Error('Supabase is not set up: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY are missing.');
  }
  return createServerClient(SB_URL, PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '').map((c) => ({ name: c.name, value: c.value ?? '' }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookies.set(name, value, options));
      },
    },
  });
}

// The strong client (secret key). It ignores the access rules, so it is used only here on the server, never sent to a browser.
let adminClient: SupabaseClient | undefined;
export function adminDb(): SupabaseClient {
  const secret = import.meta.env.SUPABASE_SECRET_KEY as string | undefined;
  if (!SB_URL || !secret) {
    throw new Error('Supabase is not set up: SUPABASE_SECRET_KEY is missing (set it in .env and in Vercel).');
  }
  adminClient ??= createClient(SB_URL, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  return adminClient;
}

// Decides the role of a logged-in user. Any doubt (no email, not a Google login, database error) means no access.
export async function getRole(user: User): Promise<Role | null> {
  const email = user.email?.trim().toLowerCase();
  if (!email || !user.email_confirmed_at) return null;
  if (user.app_metadata?.provider !== 'google') return null;

  const superEmail = ((import.meta.env.SUPER_ADMIN_EMAIL as string | undefined) ?? '').trim().toLowerCase();
  if (superEmail && email === superEmail) return 'super';

  const { data, error } = await adminDb().from('admins').select('email').eq('email', email).maybeSingle();
  if (error) {
    console.error(`[auth] Could not read the admins table: ${error.message}`);
    return null;
  }
  return data ? 'admin' : null;
}