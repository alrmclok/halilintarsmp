# HalilintarSMP: roadmap

Last updated: 2026-11-21

This file is written for the AI that helps Almira build the site. It lists the work in ordered parts (A, B, C and so on). Each part is small enough to finish in one chat, and the next part is started in another chat. The context for everything is in `halilintarsmp-main.md`. This file only tracks progress.

Parts A to LA built the site from files (condensed below to save tokens; the main document describes the real site). From Part M on, the work is the move to Supabase and the dashboards. The plan for that is Part 3 of the main document.

## Rules for the AI

1. Almira sends both files at the start of every chat: the main document and this roadmap. Both live in the `docs/` folder of the project. The guide `docs/guide-for-editors.md` is sent only when the work changes something it explains. From Part M on, also send `supabase/schema.sql` once it exists.
2. Read the main document first, then find the first part here that is not Done. Work only on that part.
3. Before starting a part, say in a few plain words what it will do. Then do it.
4. When the part is finished and nothing in the plan changed: update only this file. Set the status to Done, tick the checklist, and write short notes under "Notes".
5. When something in the real app changes what the main document says (a file or folder name, a decision, a color or size, a rule): update the main document too, so it matches the real site. If the guide for editors explains it too, update the guide.
6. At the end of the chat, hand back the updated files.
7. Write plainly. Almira is learning, so explain new words in a short line. Write any mentioned person with they/them.
8. Do not add pages, features or boxes that are not in the main document. If an idea comes up, write it under "Open decisions" and ask.
9. Never commit `.env` or `.vercel/` (see "Deploying on Vercel" in the main document). Remind Almira if a push or a deploy looks odd.

Status words: **Not started**, **In progress**, **Done**.

---

## Parts A to LA: Done (condensed on 2026-11-20)

Details are in the main document. Only what a later chat may still need is kept here.

| Part | What was built | Remember |
|---|---|---|
| A | Astro 5.14.1 project, GitHub, Vercel | The invite for Katz and Kate waits for their yes. It blocks nothing. Empty folders hold a `.gitkeep` |
| B | `style.css`, `Base.astro`, `Box.astro` | Second bar links: Join, Rules, Server address, News |
| C | Home page | Each list box shows 3 rows (`SHOW = 3` in `index.astro`) |
| CA, DA | Look matched to the screenshot, phone layout (700 px breakpoint) | Hero button classes are `btn-top` and `btn-bottom`. Member article headings use `.article > section > h2` |
| D | Members list, default member page | `custom: true` skips the default page. `src/lib/slug.js` is the one `toSlug` |
| E | Fandoms list and pages, built from members' fandoms | Two spellings are one fandom when `toSlug` gives the same result (accents dropped) |
| EA | Pronouns and fandom pictures. Made by Almira with another AI | The `public/fandoms/` scan is a fallback until Part R |
| F, FA | Gallery, picture pages, lightbox, `@handle` and credit links | `mentions.js` links only when a member is found |
| G | About and Credits pages | Real About text and the "made by" line are still placeholders |
| H | Custom member page template and test page | `npm run dev` does not open folders in `public/`: use `npm run build` then `npm run preview` |
| I | Phone check, link-preview tags, splatters | `SITE` and `PREVIEW_IMAGE` are at the top of `Base.astro`. Tab icon and preview are still `putinxtrump.png` |
| J | `docs/guide-for-editors.md` | Out of date since Part N (the content is in Supabase). Rewritten in Part T. Button names came from the AI's knowledge, not a screen |
| K | News, Join and Rules pages | `SERVER_ADDRESS` in `join.astro` is a masked placeholder. Both corner links go to Join |
| L | Search box (`search.json.js`, `public/search.js`) | If the Members row line in `members/index.astro` changes, `searchedText()` in `search.js` must change too |
| LA | Member form (`member-form.astro`, Web3Forms). Made by Almira | The key in the file is the placeholder `xxxxx`. Small local changes by Almira were not written down |

---

## Part M: Supabase setup, tables and import

Status: Done

Goal: a Supabase project with the tables, the access rules and all current content copied in. Nothing on the public site changes yet.

- [x] Almira made the Supabase project.
- [x] `.env.example` lists the setting names without values.
- [x] Almira makes `.env` with the three keys for this part and adds `.env` to `.gitignore` (steps in the chat).
- [x] `supabase/schema.sql`: the tables from Part 3 section 3.3, final names and types, and the read rules (the public key reads only rows that are not hidden, and cannot write).
- [x] Almira runs `supabase/schema.sql` in the Supabase SQL Editor.
- [x] `scripts/import-json.mjs`: copies `src/content/members/*.json`, `gallery.json` and `news.json` into the tables, builds the fandom list from the members and links them. Safe to run again without making doubles.
- [x] Each member `slug` equals the old file name, and each gallery `slug` equals its old address, so no address changes.
- [x] Pictures keep their current paths in `public/`.
- [x] Almira runs `npm run db:import:dry`, then `npm run db:import`, and compares the counts with the JSON files.
- [x] Almira runs `npm run db:check`: the public key cannot write and cannot read hidden rows.
- [ ] Almira runs `supabase/migrations.sql` once in the SQL Editor (drops the unused `site_text` table), then `npm run db:check` again.
- [x] Update Part 3 in the main document where the real tables differ from the draft.

Notes:

- The JSON files stay in place. They are removed in Part T.
- New files: `supabase/schema.sql`, `scripts/import-json.mjs`, `scripts/check-access.mjs`, `.env.example`. Changed: `package.json` (the `@supabase/supabase-js` package and three scripts: `db:import:dry`, `db:import`, `db:check`) and `.gitignore` (`.env`).
- Tested on the AI's side with a local PostgreSQL 16 and PostgREST 12.2.12 behind a small stand-in for Supabase's address, with Almira's real files (1 member, 12 fandoms, 2 gallery pictures, 7 news items). The schema ran twice without errors. The import ran several times without doubles, kept `hidden` as it was, stopped before writing anything on a bad file, and `--only-new` kept existing rows. `db:check` passed, and failed when the rules were broken on purpose. Not run on Almira's real Supabase project yet.
- New names for the keys: `PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` instead of `..._ANON_KEY` and `..._SERVICE_ROLE_KEY`, because Supabase plans to retire the old `anon` and `service_role` keys by the end of 2026. `SUPER_ADMIN_EMAIL`, `VERCEL_DEPLOY_HOOK_URL` and `CRON_SECRET` are listed in `.env.example` but are not needed until Parts O, P and S.
- The Vercel settings are not needed yet, because nothing deployed reads Supabase before Part N. They move to Part N (its list already has them).
- A `site_text` table was made first and then dropped (Almira's decision): the Join, Rules, About and Credits texts and the server address stay in the page code. The database holds only members, fandoms, gallery and news, plus the admin tables. `supabase/migrations.sql` removes the empty table from the real project, and `schema.sql` no longer has it.
- The real data had things the documents did not say, so the tables allow them: a news item may have no `title` and may have a `pic`; a member's fandoms keep their order (`member_fandoms.position`); news and gallery keep their file order (`position`).
- News rows have no address, so the import finds them again by `import_key`, a fingerprint of title, author, date and summary. If a news item is edited in `news.json` after the import, a second import adds it as a new row and leaves the old one. The report lists database rows that are not in the files.
- The import fills `fandoms.picture` from `public/fandoms/`. Four pictures there match no fandom today (`deltarune.jpg`, `multifandom.jpg`, `placeholder.png`, `undertale.jpg`), so they are not used, the same as on the site now.
- The import copies fields as they are and does not fix wording. It checks that `joined`, `edited` and `added` are real dates, and stops before writing if a file is wrong.
- A normal import run overwrites existing rows with the file contents. After the dashboards are in use, run it only with `--only-new`, or not at all.
- Almira confirmed in the Part N chat: the `.env` is filled, the schema was run, the data is in the database and correct, and `db:check` passed. `migrations.sql` was not mentioned, so its box stays open. The empty `site_text` table is harmless, and `schema.sql` no longer makes it.

---

## Part N: Public pages read from Supabase

Status: Done

Goal: the public site is built from the database and looks and works exactly as before.

- [x] `src/lib/db.js`: one small client and the shared loaders (members, fandoms, gallery, news).
- [x] Replace the JSON reading in the home page, the Members, Fandoms, Gallery, News and Credits pages, `mentions.js`, `fandoms.js`, `gallery.js` and `search.json.js`.
- [x] Keep the warning in the build log for a bad row, like the old member schema did.
- [x] Fandom pictures come from the `fandoms` table. Until Part R, keep the `public/fandoms/` scan as a fallback for a fandom with no picture.
- [x] Add the `@astrojs/vercel` adapter. Keep the site prerendered by default.
- [x] Set the Supabase settings in Vercel (the two `PUBLIC_` keys).
- [ ] Make the Vercel deploy hook and keep its address in `VERCEL_DEPLOY_HOOK_URL`. Moved to Part P, where the Publish button first needs it.
- [x] Check: the list of built addresses is the same as before, the search works, custom member pages still work, and a build with Supabase unreachable fails clearly.

Notes:

- The site must not call Supabase when a visitor opens a page. Only the build does.
- Check what `news.astro` and the home News box do with a news item that has no `title`, and with a `pic`. The real data has both, and the old documents did not mention them. The `news` table keeps both.
- Order: the home News box takes the first three by `position`. The News page sorts by `date`. Gallery sorts by `added`, newest first, and `position` breaks ties.
- New file `src/lib/db.js` has the loaders `getMembers`, `getMemberEntries`, `getFandomRows`, `getGalleryRows` and `getNews`. It uses the public key, so hidden rows never come back. It reads in pages of 1000 rows, remembers each answer for the whole build, warns in the build log for a bad row (a member missing a required field, a section with no text), and stops the build with a clear message when Supabase cannot be read or the settings are missing.
- The loaders give the same shapes as the old files, so the pages changed very little. `getMemberEntries()` returns `{ id, data }` like Astro's old content entries, so `e.id` and `e.data` still work in the pages. Part T can remove this bridge.
- `getFandoms()` and `getGallery()` are now async, so the pages call them with `await`. A fandom's name, picture and description come from the `fandoms` table first. The `public/fandoms/` scan stays as the fallback until Part R.
- Gallery addresses come from the `slug` column (made once at import), so no address changed. Order: `added` newest first, `position` breaks ties.
- News: `by` is read from the `author` column. A missing `title` or `pic` comes back as `undefined`, like the old JSON.
- `mentions.js` needed no change. `content.config.ts` and the JSON files stay until Part T, because the import still reads them.
- `astro.config.mjs` now uses the `@astrojs/vercel` adapter (`^8.0.0` in `package.json`). Pages are still built ahead of time.
- The build needs only the two `PUBLIC_` settings. The secret key is not used by the build.
- In `npm run dev` each loader asks Supabase once, so a change in the database shows after the dev server restarts.
- Important for editors: editing the JSON files no longer changes the site. Until Part P, change rows in the Supabase Table Editor (or edit the JSON and run `npm run db:import`), then rebuild the site (push a commit or press Redeploy in Vercel). `docs/guide-for-editors.md` still says the old way and needs fixing (Part T, or sooner if Katz or Kate start editing).
- Almira ran `npm run build` on the real project: it passes with no errors. The AI only syntax-checked the new files here (no network, no Astro run).
- Not checked in a chat: how `news.astro` and the home News box show an item with no `title` or with a `pic`, and what a build does when Supabase is unreachable (the code stops with a clear message, but nobody tried it on purpose).
- Two slips while editing, both fixed: the find-and-replace also changed the function lines in `fandoms.js` and `gallery.js`, and `await getFandoms(...).slice(...)` needed brackets. Remember both if the pages are edited by search-and-replace again.

---

## Part O: Login and roles

Status: Done

Goal: Google login that lets in only the super-admin and the admins on the list.

- [x] Google Cloud OAuth client and Supabase Auth set up (Almira, with the AI's steps).
- [x] `/admin/login`, the callback, logout, and the "not allowed" page.
- [x] `src/middleware.ts` guards `/admin/*` and `/api/admin/*`.
- [x] Role check: the email in `SUPER_ADMIN_EMAIL` is super-admin, emails in `admins` are admins, everyone else is refused.
- [x] Check: a listed email gets in, an unlisted Google account is refused, logged out means no access, and the browser's public key cannot write.

Notes:

- The first admin emails are added by hand in the table until Part S makes the screen for it.
- New files: `src/lib/auth.ts`, `src/middleware.ts`, `src/env.d.ts`, and in `src/pages/admin/`: `login.astro`, `callback.ts`, `logout.ts`, `not-allowed.astro`, `index.astro`. New package: `@supabase/ssr`. Details of the flow and the rules are in Part 3, section 3.4 of the main document.
- `/admin/index.astro` is a plain stand-in that shows who is signed in and a Log out button. Part P replaces it.
- Settings: `SUPER_ADMIN_EMAIL` is in `.env` and in Vercel. `SUPABASE_SECRET_KEY` is now also in Vercel, because the server reads the `admins` table with it. It is never sent to a browser.
- Supabase and Google Cloud were set up by Almira with the AI's steps (Google provider on, Email provider off, redirect addresses, Google app published). The first admin emails were added by hand in the `admins` table, in lowercase.
- Almira tested on the real project: a listed email gets in, an unlisted Google account lands on the not-allowed page, and after Log out `/admin/` sends the person back to the login. The AI only syntax-checked the files here.
- Known and accepted: Google's login screen shows the Supabase project address instead of the site name (see "Open decisions").
- A rule to keep: the middleware must stay out of the public pages. Those pages are built ahead of time and must not read cookies. It returns early for every address outside `/admin` and `/api/admin`.

---

## Part OA: Vercel deploy fix (made outside the parts list)

Status: Done

Goal: the live site is built from the current code, including the admin pages.

- [x] Remove `.vercel/` from git and add it to `.gitignore`.
- [x] Remove the committed secret file from the latest commit (Almira).
- [x] Set `engines.node` to 22.x and the Node.js Version in Vercel to 22.x.
- [x] Update the adapter to `@astrojs/vercel@9` (peer Astro ^5).
- [ ] Rotate `SUPABASE_SECRET_KEY` (and any other key that was in the committed file, such as the deploy hook or `CRON_SECRET`), then update `.env` and Vercel. Not confirmed yet.
- [ ] Check `/admin/login/` end to end on the live site (login, `/admin/`, log out).

Notes:

- Symptom: `/admin/` gave a Vercel 404 and a footer text change did not show, although the deployment was green. Cause: a committed `.vercel/output` folder, so Vercel logged "Using prebuilt build artifacts" and skipped the build.
- Next error: the adapter 8.0.0 did not know Node 22 and fell back to Node 18, which Vercel refuses ("invalid runtime nodejs18.x"). The 8.x line stopped at 8.2.11, 10.x needs Astro 6 and 11.x needs Astro 7, so 9.x was chosen.
- A secret file reached git history. Removing it from the latest commit does not remove it from history, so treat the key as leaked.
- Local Node 24 gives an EBADENGINE warning: harmless. `npm audit` shows 10 issues, not looked at (do not run `audit fix --force`). npm blocked the install scripts of `esbuild` and `sharp` locally: if a local build complains, run `npm install-scripts approve <pkg>`.
- The footer line was changed to "futer 2" as a smoke test. Set it to the wanted text.
- Almira said the deploy works now. The AI saw only the build logs, not the live site.

---

## Part P: Admin dashboard (content)

Status: Done

Goal: admins edit members, fandoms, gallery and news without GitHub.

- [x] Code written (not tested): `src/lib/admin.ts`, `AdminNav.astro`, `admin/index.astro`, `admin/[kind]/index.astro`, `admin/[kind]/[id].astro`, `api/admin/publish.ts`.
- [x] Fix the editor error "Property 'user' does not exist on type 'Locals'" (in `admin/index.astro`). It is only editor typing, the build ignores it. Fix: restart the TS server and run `npx astro sync`, or make `src/env.d.ts` use `declare global` (see Notes).
- [x] Check that the `.adm-*` styles exist in `style.css` (`adm-form`, `adm-err`, `adm-ok`, `adm-check`, `adm-sec`, `adm-btn`, `adm-stats`, `adm-pub`). The form styles seen were only for `.smp-form`.
- [x] Make the member save safer: it deletes the member's fandom links and then inserts the new ones, so a failed insert leaves a member with no fandoms. Insert first and delete after, or use one database function.
- [x] Make the Vercel deploy hook, and keep its address in `VERCEL_DEPLOY_HOOK_URL` (`.env` and Vercel).
- [x] Decide who may press Publish: admins and the super-admin (decided 2026-11-20). `publish.ts` and the home button already allowed both.
- [ ] Test on the live site: create, edit, hide, unhide, Publish, and the unpublished counter.
- [ ] Phone check.

Notes:

- Reviewed by the AI on 2026-11-20: `admin.ts`, `[kind]/[id].astro` and `admin/index.astro`. The rules match the old data files. Not seen: `AdminNav.astro`, `[kind]/index.astro`, `publish.ts`.
- `[kind]/[id].astro` puts its small `<script>` after `</Base>`. It works but is not valid HTML: move it inside the Box.
- A fandom's address is always `toSlug(name)`, so renaming a fandom changes its page address. The form's help text should say so.
- The unpublished counter reads and then writes, so two admins saving at once can miscount. Accepted.
- Fix for the Locals error: `src/env.d.ts` needs `/// <reference types="astro/client" />` and `declare namespace App { interface Locals { user: { email: string; role: 'super' | 'admin' } } }`. If the file has any top-level `import` or `export`, wrap it in `declare global { ... }` and end the file with `export {};`.
- Look: same Box and colors as the site, plain forms (proposed, see Open decisions).
- 2026-11-20 fixes: `.adm-*` styles added at the end of `style.css` (they were missing). `env.d.ts` now has `/// <reference types="astro/client" />` (restart the TS server if the Locals error stays). The member save keeps the old fandom links and puts them back if the new insert fails (not one database transaction, but no member is left without fandoms). The form's `<script>` is inside the Box. The fandom help text says renaming changes the page address. `AdminNav.astro` and `[kind]/index.astro` were not reviewed.

---

## Part Q: Public requests and review

Status: Done

Goal: anyone can ask for a new member page, a change to a member page or a new fandom description. Admins review in the dashboard.

- [x] `member_requests` gets `kind`, `member_id`, `reason`, `ip_hash`; new table `fandom_requests` (`supabase/migration-2.sql`, and `schema.sql` updated).
- [ ] Almira runs `supabase/migration-2.sql` once in the SQL Editor, then `npm run db:check`.
- [x] `src/pages/api/request.ts`: saves a pending request (same-origin, trap field, length limits, Turnstile, rate limit).
- [ ] Almira makes the Cloudflare Turnstile widget (free) and sets `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in `.env` and in Vercel.
- [x] `member-form.astro` and the new edit pages use `RequestForm.astro`. Web3Forms removed.
- [x] Requests screens: `/admin/requests/`, `member/[id]`, `fandom/[id]`; a Requests link in the admin menu; a waiting count on the dashboard.
- [x] Typed fandom names are matched by slug; "Create fandoms that do not exist yet" makes the missing ones.
- [ ] Test: send each kind from localhost (Cloudflare test keys), approve, reject, Publish, check the site, check the rate limit (4th request in an hour is refused).
- [x] `noindex` on the form and edit pages (`noindex` prop in `Base.astro`), and "Edit this page" links on member and fandom pages. The fandom page also shows the description now (check that it appears).
- [x] Add the member form and the edit pages to the pages table in the main document.

Notes:

- Decided by Almira on 2026-11-20: drop the Web3Forms email; trap field + rate limit + Turnstile; edit requests for members and fandoms open to everyone like a wiki; no editor role (admins review).
- Fandom edit requests change only the description. A fandom rename changes its address, so it stays an admin job.
- The edit pages are built with the site, so they show the content of the last Publish. Two people editing the same page: the reviewer sees "Now" against "Proposed" and the last approval wins.
- Not atomic: the rate limit reads then writes, so a burst can slip a request or two past it. Accepted.
- Requests are never applied by themselves. See Part 3 section 3.6.
- Tested by Almira on 2026-11-20 and works.


---

## Part R: Picture uploads

Status: Done

Goal: pictures are uploaded in the dashboard and stored in Supabase Storage.

- [x] Storage bucket and rules (in `supabase/schema.sql`: public bucket `pictures`, only the secret key writes).
- [x] A choose-a-picture control for members, fandoms and gallery. The browser shrinks the picture (about 1200 px wide, under 300 KB) before it uploads.
- [x] The row stores the picture's address. The gallery `alt` field stays required.
- [x] Remove the `public/fandoms/` scan from `src/lib/fandoms.js`.
- [x] Optional: `npm run db:move-pictures` (written, not run yet) moves the old pictures into Storage.

Notes:

- Site art (logo, hero, splatters) stays in `public/`.
- Written by the AI first (no Astro run, no database). Tested by Almira on 2026-11-20: works. Old files in `public/gallery/` and `public/fandoms/` can go once `npm run db:move-pictures` has been run and the site checked.
- The browser sends the shrunk picture with the form; the server uploads it (`applyUploads` in `lib/admin.ts`). The address text box stays for pasting an address or emptying it. Names: members `<slug>-photo-profile`, fandoms `<fandom-slug>`, gallery `<title-slug>-<timestamp>` (the move script uses the same rule). The replaced file is removed after a successful save unless another row uses it. News pictures stay a text box.
- The live address is `halilintarsmp-dev.vercel.app` first (the main domain stays hidden). Almira set the Supabase and Google URLs.

---

## Part S: Super-admin dashboard

Status: Done

Goal: the things only Almira can do, plus a private change log.

- [x] Code written: `/admin/super/` (admins, keep-alive), delete buttons in the lists, `/admin/log/`, `src/pages/api/keepalive.ts`, `vercel.json`, `supabase/migration-3.sql`.
- [x] Almira runs `supabase/migration-3.sql` once in the SQL Editor.
- [x] Set `CRON_SECRET` (a long random text) in Vercel and in `.env`, then push so the cron job is registered (Vercel, Settings, Cron Jobs).
- [x] Test: add and remove an admin (a removed admin loses access on the next click); an admin cannot open `/admin/super/`; hide then delete a row (members, fandoms, gallery, news); a fandom that members use is refused; the picture file leaves Storage; Ping now shows the time; the log shows each action.
- [x] Phone check.

Notes:

- Tested by Almira on 2026-11-21 and working.
- Decided by Almira on 2026-11-20: delete for members, fandoms, gallery and news only (not requests); a row must be hidden first and DELETE typed; a fandom still used by members cannot be deleted (my choice, since "y" did not say block or unlink); deleting also removes the row's picture from Storage unless another row uses it; one super-admin page; keep-alive every 5 days (`0 3 */5 * *`: days 1, 6, 11, 16, 21, 26, 31, so never more than 5 days apart; Supabase free pauses after about 7); a change log, private to the dashboards (admins and the super-admin see it, the public never does).
- Unhide already worked for both roles since Part P. Delete is super-admin only: checked in the page and again in `deleteRow` (it reads the role from `actorStore` in `lib/auth.ts`, set by the middleware, so no existing call had to change).
- The change log (`change_log` table) is written by `logChange` in `lib/admin.ts`: create, edit (lists the changed fields), hide, unhide, delete, publish, admin added or removed. Approving a request is logged as a create or edit. Rejecting a request is logged as `reject` (added on 2026-11-21, in both review pages). Lines older than 180 days are removed by the keep-alive. Keep-alive pings are not logged.
- Deleting a member with a custom page leaves its folder in `public/members/` (GitHub); the log line says so.
- The cron endpoint is `/api/keepalive` (outside `/api/admin`, since no one is logged in). It needs `Authorization: Bearer <CRON_SECRET>`, which Vercel sends by itself when `CRON_SECRET` is set, and refuses everything when it is not. Cron runs only on the Production deployment.
- Written by the AI first (syntax check only, no Astro run, no database).

---

## Part BAHDNNYBGTSOOMFF: News requests and templates README

Status: In progress

Goal: anyone can suggest a news item, and `templates/README.md` is correct again. (The name is intended. There is no Part SA. The order is S, BAHDNNYBGTSOOMFF, T.)

- [x] Dropped by Almira on 2026-11-21: `/members.json` and any member data for custom pages. A custom page is detached from its member page instead (written in `templates/README.md` and the main document).

### News request form

- [x] `supabase/migration-4.sql` (also in `schema.sql`): the `news_requests` table, same access rules as the other request tables.
- [x] `src/pages/news-form.astro` (new), with a "Suggest a news item" link at the bottom of `news.astro`.
- [x] `RequestForm.astro` and `api/request.ts` take the new type `news-new` (same Turnstile check, trap field, rate limit and length limits).
- [x] `admin/requests/index.astro` lists news requests, and `admin/index.astro` counts them as waiting.
- [x] `admin/requests/news/[id].astro` (new): review, Approve (through `saveRow`), Reject (logged).
- [ ] Almira runs `supabase/migration-4.sql` once in the SQL Editor, then `npm run db:check`.
- [ ] Test: a form sent while not logged in; the 4th request in an hour is refused (all three request tables count together); approve shows on the site after Publish; reject does not; the phone layout.

### templates/README.md

- [x] Rewritten for members (what "custom" means, the steps, pictures, rules).
- [ ] Check that every step works after `npm run build` then `npm run preview`.

Notes:

- Written by the AI first (no Astro run, no database). Based on `request.ts`, `RequestForm.astro`, `member-form.astro`, `admin.ts`, the requests queue, the fandom review page, the admin home, `news.astro`, `migration-2.sql`, `schema.sql`, `templates/README.md` and `templates/custom-member/index.html` (that file is unchanged).
- Proposed and used (Almira did not answer, so she can change them): the sender types a name that becomes the author and the reviewer may change it; there is no picture on the form, and the reviewer pastes an address in the review screen (news has no upload button).
- The form also asks for an optional date. If empty, the server uses today in Jakarta time.
- `request.ts` now sends the member and fandom edit lookups only for `member-edit` and `fandom-edit` (it used to be "anything but member-new").
- The fandom review page `fandom/[id].astro` sent to the AI has `finish()` without a redirect after it saves (the news page has `return Astro.redirect('/admin/requests/?done=1')` at the end of `finish`). If approving or rejecting a fandom request shows an odd page, check that file and the member review page. Not changed, because it was not asked for.
- A custom page is detached from its member row: it does not read it, nothing syncs, there is no edit page, and the Members list, search, fandoms and the Featured member box still use the row.

---

## Part T: Docs, guides and clean up

Status: Not started

Goal: the documents match the real site, and the old JSON files are gone.

- [ ] Fold Part 3 of the main document into Part 1 (tech stack, folder layout, pages, data, who can change what).
- [ ] Rewrite `docs/guide-for-editors.md`: Katz and Kate use GitHub for code and custom pages only.
- [ ] Write `docs/guide-for-admins.md`: how to log in, edit, review requests.
- [ ] Update `README.md` with the Supabase and `.env` steps.
- [ ] Add `scripts/export-json.mjs`: writes the tables out as JSON, as a backup.
- [ ] Delete `src/content/members/*.json`, `gallery.json`, `news.json` and the unused schema, once Almira has checked the live site.
- [ ] `docs/guide-for-admins.md` also covers news requests and the private change log. `docs/guide-for-editors.md` explains that a custom page is detached from its member page and does not call Supabase.
- [ ] `scripts/export-json.mjs` also exports `news_requests`, `admins` and `change_log`.
- [ ] Final check of every page and every dashboard screen on a phone.

---

## Open decisions

Ask about these when the part that needs them starts. Do not decide them silently.

- Real facts for the hero list. Placeholders for now. Not confirmed yet; stays open and does not hold production. (Part C)
- The orange line on the hero button, which is the bottom line of the big button ("Ask an admin" is a first try). Stays open and does not hold production. (Part C)
- May custom member pages break the Part 2 style rules, or must they follow them? Not tested yet; stays open. (Part H)
- The drawn logo, header figure and hero title picture. Placeholders until drawn.
- The real text for About, and the real "made by" line for Credits. Placeholders for now. (Part G)
- Tab icon and link preview stay putinxtrump.png, and the footer line stays futer, until Almira changes them. (The footer was set to "futer 2" as a deploy test on 2026-11-20: set it to the wanted text.)
- Which folder holds member pictures. The main document says only "path to a small square picture", so the guide tells members to send theirs to Almira for now. Part R (uploads) settles this. (Part J)
- What Enter does in the search box when no line is highlighted: now it opens the first match, and if there is none it searches the Members. Almira can change this. (Part L)
- Which files Katz and Kate may edit. The guide suggests data files, pictures and custom page folders only, and "ask Almira first" for code (`.astro`, `.js`, `.ts`, `style.css`). Almira can loosen or tighten this. The guide is rewritten in Part T. (Part J)
- The look of the dashboards. Proposed: the same Box and colors as the site, plain forms. (Part P)
- Google's login screen shows the Supabase address, not the site name. To show the site name: verify the branding in Google Cloud (needs a domain Almira owns, and can take days or weeks) or buy a Supabase custom domain. Left as it is for now, since only admins see it. (Part O)
- Member pictures: members keep sending theirs to Almira, and the reviewer uploads it on approval. Almira can change this. (Part Q, Part R)
- How often to export the tables to JSON as a backup. (Part T)
- News request form (Part BAHDNNYBGTSOOMFF): built with the proposal (the sender types a name and the reviewer may change it; no picture on the form, the reviewer pastes an address). Almira can change this.

## Progress log

One line per finished part: date, part, what was done.

- 2026-11-18, Part A: Astro project made, put on GitHub, live on Vercel with a test page. README written.
- 2026-11-18, Part B: colors, frame (header, tabs, maroon bar, footer) and Box built. Search is a stub.
- 2026-11-18, Part C: home page built (hero, gallery highlights, featured member, fandoms, members, news) from placeholder data files.
- 2026-11-18, Part CA: look reworked to match the screenshot (separate top block and content, slanted tab, fonts, full hero picture).
- 2026-11-18, Part D: Members list, default member page (article style), three placeholder members, home boxes read from the same data.
- 2026-11-18, Part DA: look check against the screenshot (measured spacing, wider boxes, flush hero, tilted button with a hero figure placeholder), phone layout, two bugs fixed.
- 2026-11-18, Part E: Fandoms list and one page per fandom, built from member data with one shared helper. Same-fandom matching ignores capitals, spaces and symbols.
- 2026-11-18, Part F: Gallery page (list with captions) and shared helper, `alt` field and `alt`/`note` on Row, `public/gallery/` folder, docs now live in `docs/`.
- 2026-11-18, Part FA: Gallery rework: a page per picture with a lightbox, rows link to it, @member and credit links only when a member is found, two columns.
- 2026-11-18, Part G: About page (placeholder text) and Credits page (note, Winamp disclaimer, fonts, and a list of all member names).
- 2026-11-18, Part H: custom member page folder template, test page and member note made; the test page and the skip rule checked with build and preview.
- 2026-11-18, Part I: link-preview tags with full addresses, two small phone fixes, ink splatters (SVG) and the stripe strip; real phone tested.
- 2026-11-19, Part EA: optional member pronouns (infobox and Featured member) and automatic fandom pictures from `public/fandoms/`; made by Almira with another AI, now in the docs. Part H status corrected to Done.
- 2026-11-19, Part J: `docs/guide-for-editors.md` written for Katz and Kate.
- 2026-11-19, Part K: News, Join and Rules pages built (placeholder words, masked server address); corner, second-bar, hero and News box links now lead to them. Phone check done by Almira.
- 2026-11-19, Part L: search box built: a list made at build time (`/search.json`), `public/search.js` with the dropdown and fuzzy matching, and the filter on the Members, Fandoms and News lists. Almira checked it and said it is done.
- 2026-11-20, Part LA: member form page (`member-form.astro`, Web3Forms email) written down. Made by Almira outside the parts list.
- 2026-11-20, planning: Supabase move planned (Parts M to T). Decided: hybrid (public pages built, dashboards server-rendered), Google login, Publish button, add/remove admin emails, fandoms as their own list, member form becomes a request queue, keep-alive button plus weekly cron. Plan is Part 3 of the main document.
- 2026-11-20, Part M: Supabase project, tables, access rules and import done; the data is in the database and `db:check` passes. `migrations.sql` not confirmed (harmless).
- 2026-11-20, Part N: the public pages and the search list now read Supabase at build time through `src/lib/db.js`; `@astrojs/vercel` adapter added; build passes. Deploy hook moved to Part P.
- 2026-11-20, Part O: Google login with roles (super-admin, admins list, everyone else refused), `/admin/*` and `/api/admin/*` guarded by `src/middleware.ts`, plain admin home. Tested by Almira.
- 2026-11-20, Part OA: fixed the deploy: `.vercel/` removed from git, Node 22.x, adapter updated to 9.x. The live site now builds. Key rotation and a live login check still open.
- 2026-11-20, Part P: dashboard code written (admin.ts, AdminNav, index, list, form, publish endpoint). Reviewed in part, not tested. Status In progress.
- 2026-11-20, Part P: fixes done (styles, env types, safer member save, script placement, help text); admins may Publish too. Live test and phone check still open.
- 2026-11-20, Part P: tested by Almira (fandoms with no members and a stale dev server were the only issues). Part P done.
- 2026-11-20, Part Q: public requests and review written (api/request.ts, RequestForm, edit pages, requests screens, migration-2.sql). Not tested.
- 2026-11-20, docs: roadmap Parts A to LA condensed; main document updated for Part P, the deploy rules and the folder layout.
- 2026-11-20, Part R: picture uploads tested by Almira and working. Part R done.
- 2026-11-20, Part S: super-admin page, delete for good, change log and keep-alive written (api/keepalive.ts, vercel.json, migration-3.sql).
- 2026-11-21, Part S: tested by Almira and working; rejecting a request is now logged too. Part S done.
- 2026-11-21, Part BAHDNNYBGTSOOMFF: news request form (`news-form.astro`, `news_requests`, `migration-4.sql`, review screen) and the new `templates/README.md` written. `/members.json` dropped. Not tested. Status In progress.
