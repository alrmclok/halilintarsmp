import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Pages are still built ahead of time (static). Supabase is read only while the site builds, never when a visitor opens a page.
export default defineConfig({
  adapter: vercel(),
});