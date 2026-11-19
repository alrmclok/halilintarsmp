// Makes /search.json when the site builds: one small list of everything the search box can find.
// Members, fandoms and news items. It reads the same data as the pages, so nothing is typed twice.
// public/search.js loads this file and does the matching in the browser.
import { getCollection } from 'astro:content';
import { getFandoms } from '../lib/fandoms.js';
import news from '../content/news.json';

export async function GET() {
  const entries = await getCollection('members');
  const members = entries.map((e) => ({ ...e.data, slug: e.id }));

  const list = [];
  // A member also matches on their handle (the "extra" word). Fandoms are not searched through members.
  for (const m of members) {
    list.push({ kind: 'member', name: m.name, url: `/members/${m.slug}/`, extra: [m.handle] });
  }
  for (const f of getFandoms(members)) {
    list.push({ kind: 'fandom', name: f.name, url: `/fandoms/${f.slug}/`, extra: [] });
  }
  // A news item has no page of its own, so it opens the News list filtered to its title.
  for (const n of news) {
    list.push({ kind: 'post', name: n.title, url: `/news/?q=${encodeURIComponent(n.title)}`, extra: [] });
  }

  return new Response(JSON.stringify(list), { headers: { 'Content-Type': 'application/json' } });
}
