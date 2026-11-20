// Checks the access rules of the database, as a visitor would meet them:
//   - the public key can read the public tables, but only rows that are not hidden
//   - the public key cannot write anything, and cannot touch the admin tables
// Run it with: npm run db:check
//
// It needs all three keys in .env. For the hidden-rows test it makes a few temporary rows named "zz-access-test..."
// with the secret key, looks at them with the public key, and deletes them again (also if something goes wrong).
// It never touches your real rows.

import { createClient } from '@supabase/supabase-js';

const url = process.env.PUBLIC_SUPABASE_URL;
const publicKey = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !publicKey || !secretKey) {
  console.error('PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY must be set in .env (see .env.example). Use "npm run db:check".');
  process.exit(1);
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const visitor = createClient(url, publicKey, opts); // what the browser and the build have
const admin = createClient(url, secretKey, opts); // server only

let failed = 0;
function check(label, ok, detail = '') {
  if (!ok) failed++;
  console.log(`  ${ok ? 'ok     ' : 'FAILED '} ${label}${detail ? `  (${detail})` : ''}`);
}

const TEST = 'zz-access-test';
async function cleanup() {
  await admin.from('members').delete().like('slug', `${TEST}%`); // links go with them
  await admin.from('fandoms').delete().like('slug', `${TEST}%`);
  await admin.from('gallery').delete().like('slug', `${TEST}%`);
  await admin.from('news').delete().like('import_key', `${TEST}%`);
}

try {
  await cleanup(); // leftovers from an earlier run that stopped halfway

  console.log('\n1. The public key can read the public tables');
  for (const t of ['members', 'fandoms', 'member_fandoms', 'gallery', 'news']) {
    const { error } = await visitor.from(t).select('*', { count: 'exact', head: true });
    check(`read ${t}`, !error, error?.message);
  }

  console.log('\n2. The public key cannot write');
  const attempts = [
    ['members', { slug: `${TEST}-w`, name: 'x', handle: 'x', joined: '2026-01-01', intro: 'x' }],
    ['fandoms', { slug: `${TEST}-w`, name: 'x' }],
    ['member_fandoms', { member_id: '00000000-0000-0000-0000-000000000000', fandom_id: '00000000-0000-0000-0000-000000000000' }],
    ['gallery', { slug: `${TEST}-w`, title: 'x', added: '2026-01-01' }],
    ['news', { author: 'x', date: '2026-01-01', import_key: `${TEST}-w` }],
  ];
  for (const [t, row] of attempts) {
    const ins = await visitor.from(t).insert(row);
    check(`insert into ${t} is refused`, !!ins.error, ins.error?.message);
  }
  for (const t of ['members', 'fandoms', 'gallery', 'news']) {
    const upd = await visitor.from(t).update({ updated_at: new Date().toISOString() }).not('id', 'is', null); // matches every row, so a mistake here would really show
    check(`update ${t} is refused`, !!upd.error, upd.error?.message);
    const del = await visitor.from(t).delete().not('id', 'is', null);
    check(`delete from ${t} is refused`, !!del.error, del.error?.message);
  }

  console.log('\n3. The public key cannot touch the admin tables');
  for (const t of ['admins', 'member_requests', 'heartbeat', 'publish_state']) {
    const sel = await visitor.from(t).select('*').limit(1);
    check(`read ${t} is refused`, !!sel.error, sel.error?.message);
  }
  const reqIns = await visitor.from('member_requests').insert({ name: 'x', handle: 'x', intro: 'x' });
  check('insert into member_requests is refused (the form will use a server endpoint)', !!reqIns.error, reqIns.error?.message);

  console.log('\n4. Hidden rows are not returned to the public key');
  const ins = async (table, rows) => {
    const { data, error } = await admin.from(table).insert(rows).select();
    if (error) throw new Error(`could not make test rows in ${table}: ${error.message}`);
    return data;
  };
  const [hiddenMember, visibleMember] = await ins('members', [
    { slug: `${TEST}-hidden`, name: 'T', handle: 't', joined: '2026-01-01', intro: 't', hidden: true },
    { slug: `${TEST}-visible`, name: 'T', handle: 't', joined: '2026-01-01', intro: 't', hidden: false },
  ]);
  const [hiddenFandom, visibleFandom] = await ins('fandoms', [
    { slug: `${TEST}-hidden`, name: 'T', hidden: true },
    { slug: `${TEST}-visible`, name: 'T', hidden: false },
  ]);
  await ins('member_fandoms', [
    { member_id: visibleMember.id, fandom_id: hiddenFandom.id }, // visible member + hidden fandom: must not show
    { member_id: visibleMember.id, fandom_id: visibleFandom.id }, // both visible: must show
    { member_id: hiddenMember.id, fandom_id: visibleFandom.id }, // hidden member + visible fandom: must not show
  ]);
  await ins('gallery', [{ slug: `${TEST}-hidden`, title: 'T', added: '2026-01-01', hidden: true }]);
  await ins('news', [{ import_key: `${TEST}-hidden`, author: 'T', date: '2026-01-01', hidden: true }]);

  const seen = async (table, col, like) => (await visitor.from(table).select(col).like(col, like)).data ?? [];
  const members = await seen('members', 'slug', `${TEST}%`);
  check('a hidden member is not returned (the visible one is)', members.length === 1 && members[0].slug === `${TEST}-visible`, `${members.length} row(s) seen`);
  const fandoms = await seen('fandoms', 'slug', `${TEST}%`);
  check('a hidden fandom is not returned (the visible one is)', fandoms.length === 1 && fandoms[0].slug === `${TEST}-visible`, `${fandoms.length} row(s) seen`);
  const links = (await visitor.from('member_fandoms').select('member_id, fandom_id').in('member_id', [hiddenMember.id, visibleMember.id])).data ?? [];
  check('a link is returned only when its member and its fandom are both visible', links.length === 1 && links[0].fandom_id === visibleFandom.id && links[0].member_id === visibleMember.id, `${links.length} link(s) seen, expected 1`);
  check('a hidden gallery picture is not returned', (await seen('gallery', 'slug', `${TEST}%`)).length === 0);
  check('a hidden news item is not returned', (await visitor.from('news').select('id').like('import_key', `${TEST}%`)).data?.length === 0);
} catch (e) {
  failed++;
  console.error(`\nThe check stopped: ${e.message}`);
} finally {
  await cleanup();
}

console.log(failed ? `\n${failed} check(s) FAILED. Do not publish anything until this is fixed.` : '\nAll checks passed. The public key reads only visible rows and cannot write.');
process.exit(failed ? 1 : 0);