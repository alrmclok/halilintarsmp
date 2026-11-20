# HalilintarSMP: main document

Last updated: 2026-11-20

This is the main document for the HalilintarSMP website. It says what the site is, how it is built and how it looks. It is the context file. What is done and what comes next is in `halilintarsmp-roadmap.md`.

It has three parts.

- **Part 1** says what the site is and how it is built. It describes the real site.
- **Part 2** says how the site looks (the style guide).
- **Part 3** is the plan for moving the content to Supabase and adding the dashboards. Parts M to P of it are built (the database, the public pages reading it, the admin login and the content dashboards). Part Q (public requests and review) is written but not tested yet. The rest is still planned.

## How the two files are used

- Both files live in the `docs/` folder of the project.
- Start every chat by sending both files. Read this one for context. Read the roadmap to find the next part to do.
- When a part is finished and nothing in the plan changed, update only the roadmap (its status and notes).
- When something in the real app changes what this file says (a folder or file name, a decision, a color or size, a rule), update this file too, so it always matches the real site.
- At the end of the chat, hand back the updated files.
- `guide-for-editors.md` (also in `docs/`) is the plain guide for Katz and Kate. It is not sent in every chat. Send it when the work changes something it explains (a data file field, a folder), and update it too.

Writing rule for both files: when a person is mentioned, write them with they/them. This covers Katz, Kate and anyone added later. Almira is the owner of the project and is written by name.

---

# Part 1: What it is and how it is built

## What the site is

A public website for the HalilintarSMP community, built like a small wiki and dressed in the 2004 Winamp look.

Pages:

| Page | What it is |
|---|---|
| Home | The main page: hero box and a grid of boxes |
| Members | A list of members. Each member has their own page: a default one made from data, or a custom one the member builds as their own folder. |
| Fandoms | A list of fandoms. Each fandom is a category page that lists its members. A fandom can have a picture (see "Fandom pictures"). |
| Gallery | Pictures with a title, a short description and a credit |
| About | Short info about the SMP |
| Credits | Linked from the footer. A short note (not connected to Winamp, fonts) and a list of every member's name |
| News, Join, Rules | Three pages, built in Part K. News (`/news/`) lists every news item, newest first. Join (`/join/`) holds how to join and, in its own box, the server address (`/join/#server-address`). Rules (`/rules/`) is its own page. No pop-ups. They have no tab: they are reached from the maroon bar, the hero and the News box. The words on them are placeholders until the admins send the real ones |
| Member form | `/member-form/`, not in the tabs. A public page where someone asks for a new member page (name, handle, pronouns, fandoms, joined date, intro, sections). It saves a pending request; nothing is public until an admin approves it and Publish is pressed (Part Q) |
| Edit pages | `/members/<slug>/edit/` and `/fandoms/<slug>/edit/`, open to everyone, like a wiki. A member edit form is filled with the current page and a fandom edit form has only the description. Sending one saves a pending request. Members with a custom page have no edit page (Part Q). The links to these pages from the member and fandom pages are added in a later step |
| Admin | `/admin/`, behind Google login (built in Part O). Pages: `/admin/login/`, `/admin/not-allowed/`, and `/admin/` (counts, unpublished changes, last publish time and the Publish button), plus `/admin/<members|fandoms|gallery|news>/` lists and forms, and `/admin/requests/` (Part Q: the queue, `member/<id>` and `fandom/<id>` review screens). The dashboards (Part P) are written but not tested yet, see Part 3 |

## Who can change files

Three people have access to the GitHub project: Almira, Katz and Kate. Katz and Kate are trusted people, not SMP admins. They have not been asked yet.

- They edit files on GitHub. Vercel puts the change live by itself.
- Any of the three can put a custom page live. If none of them can, Almira does it.
- Anyone who does not want to use GitHub can send the files to Almira, who adds them.

Part 3 changes this: admins will edit content in a dashboard, and Katz and Kate will keep GitHub for code and custom pages. The login is built (Part O). The dashboards are written (Part P) but not tested yet.

## Tech stack (decided)

- **The main site uses Astro.** It has reusable components (like the Box), shared layouts and pages made from data.
- **Custom member pages use plain HTML, CSS and JS.** Each one is its own folder. A member only needs to know those three things, and does not need to know Astro.
- **Hosting is Vercel**, connected to the GitHub project.
- **The content lives in a Supabase database** (members, fandoms, gallery and news, plus the admin tables). The public pages are still built ahead of time: only the build reads the database, with the public key, under read-only rules (Part N). The old data files in `src/content/` are kept until Part T and are now used only by the import script. Pictures still live in `public/` until Part R. See Part 3.

### Deploying on Vercel (rules learned the hard way, 2026-11-20)

- **Never commit `.vercel/` or `.env`.** A committed `.vercel/output` made Vercel log "Using prebuilt build artifacts" and skip the build, so the live site stayed an old snapshot (new pages gave a Vercel 404). Both folders belong in `.gitignore`. A secret that was committed once stays in git history: replace (rotate) that key.
- **A real build log shows `npm install`, then `astro build`, then the adapter bundling a function.** If it only says "Deploying outputs...", something is wrong.
- **Node is 22.x** (`engines.node` in `package.json`, and the Node.js Version setting in Vercel). Vercel refuses older runtimes. A local Node 24 only gives a harmless EBADENGINE warning.
- **Adapter:** `@astrojs/vercel` 9.x goes with Astro 5. Version 8.0.0 did not know Node 22, 10.x needs Astro 6 and 11.x needs Astro 7. Do not use `--force` to install a newer one.
- **Settings in Vercel (Production):** `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the build needs them), `SUPABASE_SECRET_KEY` and `SUPER_ADMIN_EMAIL` (the admin pages need them when they run), and later `VERCEL_DEPLOY_HOOK_URL` and `CRON_SECRET`.

A change to the site's code is:

1. Edit or add a file.
2. Push it to GitHub.
3. Vercel rebuilds the site by itself, in about a minute.

A change to the content (members, fandoms, gallery, news) is different since Part N: editing the JSON files no longer changes the site, because the pages read the database. Until the dashboard exists (Part P), change a row in the Supabase Table Editor, or edit the JSON file and run `npm run db:import` on a computer that has the `.env` file (it overwrites rows with the file contents). Then the site must be built again: push a commit, or press Redeploy in Vercel. `guide-for-editors.md` still describes the old way and is rewritten in Part T.

### Folder layout

```
docs/
  halilintarsmp-main.md     this file
  halilintarsmp-roadmap.md  what is done and what is next
  guide-for-editors.md      a short plain guide for Katz and Kate (how to edit on GitHub)
src/
  layouts/Base.astro        header, tab bar, search box, footer
  components/Box.astro      the box (Part 2 section 5)
  components/Row.astro      one row inside a box
  components/Parts.astro    shows text with member links inside it
  components/FeaturedMember.astro  the card in the home page "Featured member" box
  components/AdminNav.astro the small menu at the top of the admin screens (Part P)
  lib/slug.js               turns a name into an address piece ("Fandom A" -> "fandom-a")
  lib/db.js                 the one place the site reads Supabase (Part N): members, fandoms, gallery and news, with the public key. Used only while the site builds
  lib/auth.ts               server only (Part O): the login client, the secret-key client, and getRole (super, admin or no access)
  lib/admin.ts              server only (Part P): the field lists, the save rules and the database work behind the content dashboards
  lib/gallery.js            reads the gallery rows from the database, newest first (same day: the old file order), for the home page and Gallery pages. The address of each picture is stored in its row. Async: use `await`
  lib/mentions.js           turns member names in gallery text into links, only when a member is found
  lib/fandoms.js            builds the fandom list from the members (used by the home page and the fandom pages). Name, picture and description come from the `fandoms` table first; the folder public/fandoms/ is only a fallback until Part R. Async: use `await`
  pages/                    home, members, fandoms, gallery, about, credits, news, join, rules (and the search list, search.json.js)
  pages/about.astro         the About page
  pages/credits.astro       the Credits page: a note and every member's name, A to Z
  pages/news.astro          the News page: every news item from the database, newest first
  pages/join.astro          the Join page: how to join, and the server address (a line at the top of the file)
  pages/rules.astro         the Rules page
  pages/member-form.astro   the public form for a new member (Part Q: saves a pending request)
  components/RequestForm.astro  the one form used by the member form and both edit pages: sends JSON to /api/request, Cloudflare Turnstile, hidden trap field
  pages/members/[slug]/edit.astro, pages/fandoms/[slug]/edit.astro  the public edit forms (Part Q)
  pages/api/request.ts      the one PUBLIC endpoint that writes: checks and saves a pending request (Part Q)
  pages/admin/requests/     index.astro (the queue), member/[id].astro and fandom/[id].astro (review: fix, Approve, Reject) (Part Q)
  pages/search.json.js      makes /search.json when the site builds: the list the search box looks in (members, fandoms, news)
  pages/members/index.astro   the Members list
  pages/members/[slug].astro  the default member page, made from data
  pages/fandoms/index.astro   the Fandoms list
  pages/fandoms/[slug].astro  one fandom page: its members
  pages/gallery/index.astro   the Gallery list (two columns)
  pages/gallery/[slug].astro  one picture's own page, with a lightbox
  pages/admin/              the admin pages. Part O: login.astro, callback.ts, logout.ts, not-allowed.astro. Part P: index.astro (home with counts and Publish), [kind]/index.astro (a list) and [kind]/[id].astro (the form; id `new` makes a row). Server-rendered (prerender = false)
  pages/api/admin/publish.ts  the Publish button's endpoint: calls the Vercel deploy hook (Part P)
  middleware.ts             guards /admin/* and /api/admin/* (Part O). Public pages are untouched
  env.d.ts                  tells the editor that Astro.locals.user exists (set by the middleware)
  content.config.ts         what a member data file must contain (only checks the old files; removed in Part T)
  content/members/          one data file per member (old format; now only read by the import script, until Part T)
  content/gallery.json      the gallery list (old format; see "The gallery data file")
  content/news.json         the news list (old format)
public/
  style.css                 the shared colors and box look
  search.js                 the search box script: the dropdown with fuzzy matches, and the filter on the list pages
  gallery/                  the gallery pictures
  fandoms/                  fandom pictures, one per fandom (optional, see "Fandom pictures")
  members/member-name/      a custom page: index.html, style.css, script.js
templates/custom-member/    a starter folder to copy for a custom page
templates/README.md         the steps and rules for custom pages, written for members (outside public/, so it is not shown)
supabase/schema.sql         the database tables and their access rules, as they should be now (Part M). A record; it does not have to be run again
supabase/migrations.sql     changes to run once in the Supabase SQL Editor (migration 1 removes the unused site_text table)
supabase/migration-2.sql    run once in the SQL Editor (Part Q): request columns on member_requests and the fandom_requests table
scripts/import-json.mjs     copies the content files into Supabase (Part M). Safe to run again
scripts/check-access.mjs    checks that the public key reads only visible rows and cannot write (Part M)
.env.example                the names of the settings, without values. The real `.env` is never committed
package.json                scripts, packages and `engines.node` (22.x, needed by Vercel)
.gitignore                  must list `.env`, `.vercel/`, `dist/` and `.astro/`
astro.config.mjs            Astro settings: the `@astrojs/vercel` adapter (pages are still built ahead of time; only the admin pages run on the server)
```

### How the custom pages work

- Everything inside `public/` is served exactly as it is. Astro does not touch it. So `public/members/member-name/index.html` is shown at `/members/member-name/`.
- A member with a custom page has a flag in their data file (for example `custom: true`). The default page maker skips them, so the two never clash. The Members list links to `/members/member-name/` in both cases, so the address looks the same.
- The shared look lives in one file, `public/style.css`. The Astro layout uses it, and a custom page can link to it too if the member wants the box look. A member can also ignore it and write only their own `style.css`.
- The starter folder in `templates/custom-member/` has a ready `index.html`, an empty `style.css`, an empty `script.js` and a link back to `/members/`. It sits outside `public/` so it is not shown on the site.

### The member data file

> Since Part N the site reads the database, not this file. The file is only the source for `npm run db:import` and is removed in Part T. The fields below are still the fields of the database row.

One JSON file per member in `src/content/members/`. The file name is the member's address: `member-one.json` becomes `/members/member-one/`.

| Field | Needed? | What it is |
|---|---|---|
| `name` | yes | The name shown on the page |
| `handle` | yes | Their online name |
| `pronouns` | no | Short text, for example `they/them`. Shown in the infobox under the handle and in the home page "Featured member" box. Empty = nothing is shown. Custom pages do not show it by themselves |
| `picture` | no | Path to a small square picture. Empty = gray box |
| `fandoms` | yes | A list of fandom names. Capitals, extra spaces and symbols do not matter: "Fandom A" and "fandom-a" are the same fandom. The first spelling found is the one shown |
| `joined` | yes | Date, written `2026-11-01` |
| `intro` | yes | One short line |
| `custom` | no | `true` = they have their own page folder, so no default page is made |
| `featured` | no | `true` = shown in the home page "Featured member" box. If nobody has it, the first member is shown |
| `edited` | no | Date for the "Last edited" line. Empty = the joined date |
| `sections` | no | The article body: a list of `heading` and `text`. A blank line in `text` starts a new paragraph |

### Fandom pictures

A fandom can have a small picture. It shows in the rows of the Fandoms list and the home page Fandoms box. A fandom with no picture shows the gray square.

- Put the picture in `public/fandoms/`. Any file type for a picture works (`.png`, `.jpg` and so on).
- Nothing has to be written in a data file. When the site builds, `src/lib/fandoms.js` reads the folder, drops the extension from each file name, cleans the rest the same way as fandom names, and matches it to the fandom. So `fandom-a.png` and `Fandom A.jpg` both belong to "Fandom A". Capitals, spaces and symbols do not matter. Since Part N the `picture` column of the `fandoms` table is used first; this folder is only the fallback until Part R.
- Keep one picture per fandom. Two files that clean to the same name are a mix-up.
- Keep pictures small, like the gallery ones.

### The search box

The search box in the maroon bar is built in Part L. Nothing has to be written in a data file for it.

- **The list.** `src/pages/search.json.js` makes `/search.json` when the site builds. It holds every member (name, link, and their handle as an extra word), every fandom and every news item. A new member, fandom or news item shows up in the search after the next build.
- **The script.** `public/search.js` loads that list the first time the box is used and does the matching in the browser. It is plain JavaScript with no library.
- **Matching.** Capitals, accents and symbols do not matter. A name matches when it is the same as, starts with, has a word that starts with, or contains what was typed, or has the typed letters in order ("grn" finds "Grian"), or is a few typos away ("Grain" finds "Grian"). A member also matches on their handle, a little lower. Fandoms are not searched through members. Up to 6 matches show, each with its kind (member, fandom or post) on the right.
- **The three lines.** Under the matches are always three lines: Search the typed words in Fandoms, in Members or in Posts. They open `/fandoms/`, `/members/` or `/news/` with `?q=` and the typed words on the end.
- **The filter.** On those three list pages the script hides the rows that do not match `?q=`, and shows a note with a "Show all" link. Each list only searches its own kind: Members looks at the name and handle, Fandoms at the fandom name, News at the title and summary (not the author or date). The word filter also forgives a typo. A news item has no page of its own, so picking a post in the dropdown opens the News list filtered to its title.
- **Keys.** Arrow keys move the highlight, Enter opens the highlighted line (if none: the first match, and if there is no match: the Members search), Escape closes the list.
- **No JavaScript.** The form still works: GO opens `/members/?q=...`.
- Names written only in non-Latin letters are cleaned to nothing (like in `toSlug`), so the search cannot find them.

### The gallery data file

> Since Part N the site reads the database, not this file. The file is only the source for `npm run db:import` and is removed in Part T. The fields below are still the fields of the database row.

`src/content/gallery.json` is one list. Each picture is one entry. The picture files go in `public/gallery/`, and `file` is the address of the picture, for example `/gallery/my-picture.png`.

| Field | Needed? | What it is |
|---|---|---|
| `title` | yes | Short title. It also makes the address of the picture's page: "Gallery picture one" becomes `/gallery/gallery-picture-one/`. Two pictures with the same title get -2, -3. Changing a title changes that address |
| `description` | yes | One short line. A word that starts with @ links to a member (see below) |
| `credit` | yes | The artist, or who is in it. Shown as "by ...". Links to a member when the name matches (see below) |
| `file` | no | Address of the picture. Empty = gray box and no link |
| `alt` | yes | A few words about what the picture shows, for screen readers. If empty, the title is used |
| `added` | yes | Date, written `2026-11-01`. Newest first on the Gallery page and the home page |

Member links in gallery text. They are made when the site builds, and only when a member is really found, so a link never leads to a "not found" page.

- In a description, a word that starts with `@` links to that member's page when it matches a member's `handle` (capitals do not matter). "@member_one!" links `@member_one` and leaves the "!" outside the link. If nobody has that handle, the text stays plain. So when a member changes their handle, old descriptions keep their words and the link simply goes away.
- In a credit, the name links when it matches a member's `name` or `handle` (capitals do not matter). If nobody matches, it stays plain.
- The links are red-orange and bold (the `.mention` style).

Keep pictures small: about 1200 px wide at most and under 300 KB each. Files in `public/` are served as they are, so nothing shrinks them for you.

### The news data file

> Since Part N the site reads the database, not this file. The file is only the source for `npm run db:import` and is removed in Part T. The fields below are still the fields of the database row.

`src/content/news.json` is one list. Each item is one entry. Keep the newest on top: the home page News box shows the first three items of the file. The News page sorts by `date` by itself.

| Field | Needed? | What it is |
|---|---|---|
| `title` | no | Short title. Some items have none |
| `pic` | no | Path to a picture, for example `/news/nyan_cat.gif` |
| `by` | yes | Who wrote it |
| `date` | yes | Date, written `2026-11-19` |
| `summary` | yes | The text of the item |

### Rules for custom pages

- A custom page only changes files inside its own folder.
- One of the three people with access looks at it before it goes live, because its script runs on the site.
- Keep pictures small.
- Link back to `/members/`.

---

# Part 2: Style guide

This part says how the HalilintarSMP website should look. It is written for people who are learning, so it uses plain words and small steps. It covers the look only: colors, layout, type, the wiki-style parts and the pictures we draw. How to build it is in Part 1.

The look comes from the Winamp website in 2004 (the screenshot is the reference). We borrow the feel and the colors. We do not borrow anything that belongs to Winamp.

This is the only style for the site. The site has one theme: the light Winamp look. There is no dark theme for now.

---

## 1. The look in short

- Warm gray pages on an olive-gray background.
- Dark red (maroon) title bars on every box.
- A bright yellow bar at the top with the main links.
- Red-orange headlines and links.
- Small, square, flat boxes with a thin dotted line between rows.
- A few ink-splatter decorations in the corners.
- One big drawing at the top of the home page.

It is busy but tidy. It works because every box is built the same way.

## 2. What we borrow and what we do not

We borrow:
- The colors in section 3.
- The layout idea: top bar, tabs, boxes with title bars, footer.
- The small details: dotted lines, little orange arrows, ink splatters.

We do not use:
- The Winamp name, logo or llama.
- The man with the speaker head.
- The picture of the music player.
- Album covers, photos or any text from that page.

All pictures on our site are drawn by us (see section 9).

## 3. Colors

The hex values were picked from the screenshot with a color picker, so they match it. The last row (link red) is the one color we add on purpose, for readability.

| Name | Hex | Where it is used |
|---|---|---|
| Page background | `#6a6a57` | The olive-gray outside the content |
| Content background | `#d0ccbf` | The warm gray area that holds the boxes |
| Box body | `#e8e6e0` | The inside of each box |
| Maroon | `#5e0804` | Box title bars, the second bar under the tabs, the footer, the active tab, small buttons |
| Yellow | `#f9be00` | The top tab bar, "More" links, footer links |
| Orange | `#f28a02` | Little arrows |
| Red-orange | `#e52700` | Big headlines and big links only |
| Link red | `#b81f00` | Small links and any small colored text on the light boxes |
| Ink black | `#010101` | Normal text |
| Black box | `#171411` | The small dark box in the top right corner |
| Tab brown | `#5d4506` | Text on the yellow bar |
| White | `#ffffff` | Text on maroon, copyright line |

Contrast check (how easy the text is to read):
- White on maroon is 13.9 to 1. Yellow on maroon is 8.2 to 1. Brown on yellow is 5.3 to 1. Black on the box body is 16.7 to 1. All good.
- Link red `#b81f00` on the box body is 5.2 to 1. Good for small text.
- Red-orange `#e52700` on the box body is only 3.6 to 1, and on the content background 2.9 to 1. That is too weak for small text, so it is only for big bold headlines.

The blue in the screenshot only belongs to a picture. It is not part of our colors.

## 4. Page layout, top to bottom

1. **Header band.** Logo on the left, a drawn figure on the right, a small black box in the top right corner. The page is about 760 px wide, centered, with the olive color on both sides. The top block (logo, tabs, maroon bar) and the content below are two separate blocks, with a thin strip of the olive page color between them.
2. **Yellow tab bar.** The main links. The active tab is maroon with white text, has a slanted left edge, sticks up a little above the bar and joins the bar below it. The small black corner box sits at the right end of this row. It starts higher than the bar and has one rounded corner (top left). These two shapes are the only places where we break the square-corner rule, because the screenshot has them.
3. **Maroon second bar.** Small yellow links on the left, a search box on the right.
4. **Hero box.** One full picture. The list of facts (round bullets, bottom left) and the big button (bottom right) are real text and a real link placed on top of the picture. The big button is black with white and orange text, and it is tilted a little (4 degrees), like the original. A placeholder box labeled "Hero figure" stands behind its top edge, where the original has the man with the speaker head. It goes away when the figure is drawn into the hero picture. Almira draws the picture and saves it as `public/hero-title.png` (placeholder: 1520 x 660 px, shown 760 px wide).
5. **Boxes in a grid.** Two boxes on one row (one wide, one narrow), then three boxes on the next row.
6. **Footer.** Maroon bar with yellow links split by dots, and a white copyright line under it.

Ink splatters sit near the right end of the tab bar, above the footer, and at the left of the footer. A strip of diagonal stripes sits at the bottom left of the footer.

### Decided for our home page

- **Top tabs:** Home, Members, Fandoms, Gallery, About. Credits goes in the footer.
- **Corner box (the small black one):** the Discord and WhatsApp links. Both lead to the Join page on purpose. A WhatsApp number or invite does not belong on a public website, so how to reach the community is explained on Join.
- **Maroon second bar, left links:** Join (`/join/`), Rules (`/rules/`), Server address (`/join/#server-address`) and News (`/news/`).
- **Search box (right side of the second bar):** built in Part L (see "The search box" in Part 1). While typing, a list drops down under the box with fuzzy matches (spelling does not have to be exact), each with its kind (member, fandom or post) on the right. Under those matches, always visible, are three lines: Search the typed words in Fandoms, in Members, or in Posts. Picking one opens that page with the search applied. "Posts" means the News items. The list is a small box with the same look as the other boxes: light body, dotted lines, and the highlighted line in maroon with white text.
- **Header figure:** a plain empty box with a label until the real one is drawn.
- **Big hero button:** two lines, like the original. Top line in white: "Join the SMP". Bottom line in orange: "Ask an admin". The bottom line is a first try and can change. The whole hero is a link to the Join page.
- **Hero facts list:** placeholders for now. Use four short lines with round bullets. The first one is bold and red-orange like in the screenshot, the others are bold black. Write real facts later.
- **Boxes in the grid:**
  - Row one: Gallery highlights (wide) and Featured member (narrow).
  - Row two: Fandoms, Members list and News (three equal boxes).
  - Each box has the same build (section 5), and a "More" link in the title bar.
  - Each list box (Gallery highlights, Fandoms, Members, News) shows at most 3 rows. The full list is behind its "More" link.

## 5. The box (the main building block)

Measured from the screenshot: 7 px between boxes sideways and 10 px between rows of boxes. The title bar is 23 px tall. Rows start 6 px from the box edge. The wide and narrow boxes on row one are about 1.45 to 1.

Every box looks like this:

- A maroon title bar with the title in white bold on the left.
- A small yellow link on the right of the bar, with an orange arrow before it ("More members").
- A light box body under the bar.
- Rows inside the body. Each row has a small square picture on the left, a bold title, and a smaller line under it ("by" and a name).
- A thin dotted line between rows.
- Corners are square. No shadows. No gradients.

Build every box the same way, so a new box is a copy of an old one with new words. This is the thing to protect.

## 6. Type

- Body text: Verdana (the screenshot text is wide with a big x-height, which fits Verdana). Use `Verdana, Tahoma, Arial, sans-serif`.
- Tab bar, maroon bar, box titles, "More" links and footer links: Trebuchet MS bold, which is the closest match to the narrower bold text in the enlarged screenshot. Use `"Trebuchet MS", Tahoma, Verdana, sans-serif`. This is a best reading from a picture, not a fact from the original code. In the original the box titles look like small pictures with a soft edge. We use plain text. Both fonts are already on most computers, so nothing has to be downloaded.
- Titles in boxes are bold. Headlines are bold and red-orange. Small links are link red. Body text is black.
- The original text is tiny, about 11 to 12 px. That is part of the charm, but it is hard to read on a phone. We use at least 14 px for normal text, and 16 px on phones.
- The big title in the hero and the logo are pictures, not text.

## 7. The wiki parts

We do not run real wiki software. We only copy how a wiki is organized, so the site is easy to browse and easy to write.

- **Home page = main page.** Boxes such as a featured member, recent additions, fandoms and news.
- **Member page = an article.** A title, a one-line intro, an infobox on the right (picture, handle, pronouns when given, fandoms, joined date), a contents box if the page is long, sections with headings, and a "Categories" line at the bottom that links to fandoms.
- **Fandom page = a category page.** A short list of the members in that fandom.
- **Gallery = a list with captions.** Each picture has a title, a short description, and a credit to the artist or who is in it. The list is in two columns on a computer. Each picture also has its own page with the big picture, and clicking that picture opens it in a lightbox (a dark overlay).
- **Recent additions.** A short list on the home page of the newest things, newest first.
- **"Last edited" line.** A small gray line at the bottom of pages, like a wiki.

The infobox and the contents box use the same colors as the other boxes: maroon title bar, light body.

## 8. Phones

Built in Part DA with one breakpoint, 700 px wide and smaller (at the end of `public/style.css`):

- Header: smaller logo, no header figure, the black corner box moves up into the header row.
- Tab bar: one row that scrolls sideways. Tabs are 44 px tall.
- Hero: the picture on top, then the facts, then the button (straight, not tilted). No figure box.
- Boxes in one column. Box title bars are 44 px tall. A whole row is the tap target, not only its title.
- Member page: the infobox goes on top, full width.
- Text is 16 px.
- Search box: it takes the full width under the links. The dropdown is as wide as the box, and its lines are 44 px tall.

What this section asks for:

- Boxes stack in one column.
- The tab bar scrolls sideways instead of wrapping.
- The big drawing in the header becomes small or goes away.
- Keep two or three ink splatters at most.
- Buttons and links are at least 44 px tall so they are easy to tap.
- Text is at least 14 px.
- Test on a real phone, not only by shrinking the browser.

## 9. Pictures we draw ourselves

| Picture | Notes |
|---|---|
| Logo | The wordmark "HalilintarSMP". Until it is drawn, use the placeholder `halilintarsmp-logo.png` everywhere it is needed: the header, the browser tab icon and the link preview. Swap it out in all three places as soon as the real logo exists, and do this before the site is shared widely. |
| Header figure | A character or mascot of our own. Until it is drawn, use a plain empty box with a label. |
| Hero figure | A character standing on top of the big button. Until it is drawn, a plain dashed box with a label (`.hero-figure` in `index.astro`). It can also be drawn into `hero-title.png`, and then the box is removed. |
| Hero title picture | The whole hero, as one full picture with room for the facts list (bottom left) and the big button (bottom right). File `public/hero-title.png`. Until it is drawn, a gray placeholder. |
| Ink splatters | Three or four shapes, in maroon and in yellow. |
| Stripe strip | Diagonal stripes for the footer corner. |
| Arrow | A small orange arrow, used before "More" links. |
| Member pictures | Small squares, all the same size. Gray boxes until they are drawn. |

Tips: draw at twice the size you need, keep files small, and use flat colors so they fit the palette.

## 10. Rules to keep it recognizable

Do:
- Use flat colors from section 3 and nothing else.
- Keep square corners and thin dotted lines.
- Keep every box built the same way.
- Keep titles short.

Do not:
- Add soft shadows, gradients, glows or rounded cards.
- Use emoji as icons.
- Leave big empty areas. This look is dense.
- Copy anything listed under "We do not use" in section 2.

## 11. Still open

Nothing here blocks the start of the build. These are placeholders that get filled in later:

- The real facts for the hero list.
- The real "how to join" steps, the real rules, and the approved server address. All three are placeholders on their pages (the address is a masked placeholder in `join.astro`).
- The drawn logo, header figure, hero title picture, splatters and stripe strip.
- The final words for the orange line on the hero button.
- Whether members with their own custom page may break these style rules. Not decided yet.

## 12. Reference sites

These were shared as inspiration for the wiki side. They are for ideas only. We do not copy their pictures or text.

| Site | Suggested by | Notes |
|---|---|---|
| tolololpedia.org, the Prabowo_Subianto page | Nabil (they suggested it as the joke) | A parody wiki, the Indonesian counterpart of Uncyclopedia. It copies Wikipedia's layout for silly, made-up articles. This page is a joke biography with a Wikipedia-style infobox and sections. Our tool could not open it, so this comes from another AI's description. Nothing on it is a reliable source of facts. |
| tfwiki.net, the Your_mom page | Katz (they are not sure about it) | Could not be opened, so it is not summarized here. Open it by hand to check. |
| knockoutfangirl.nekoweb.org | Katz (their site) | Read in full. See below. |

What we take from tolololpedia: the wiki layout is so recognizable that even a joke site uses it. That supports our member-page layout in section 7 (infobox on the right, sections, categories at the bottom). We take the layout only, not the humor.

When you open the two wiki pages by hand, look at: how the page title and intro sit at the top, where the infobox goes, how the contents box looks, and how the categories line at the bottom links out.

### Ideas from knockoutfangirl.nekoweb.org

This is a personal site, not a wiki, but a few parts fit ours. These are ideas to confirm, not rules.

- **Changelog.** A short list of dated lines ("added the portfolio page"). It matches our "Recent additions" box and the "Last edited" line.
- **Interests grouped by kind.** Their interests are split into media, music, games and other. A member page could group fandoms the same way inside the infobox.
- **Directory row.** One row of plain links to every main section. Our yellow tab bar does the same job.
- **Contact row.** A row of links to where the person is (Discord, Instagram and so on). It could be a line in the member infobox.
- **"Link back" button.** A small button picture that others can put on their own sites. A tiny version of our logo could do this later.
- **A tone to avoid.** That site uses lots of animated GIFs. It suits their site, but it would break our flat, tidy look. We keep pictures still.

---

# Part 3: Supabase and the dashboards (Parts M to P built; Part Q written, not tested)

Status: Parts M to P are built and tested, and Part Q (public requests and the review screens) is written but not tested: the tables, the access rules and the import (section 3.3), the public pages reading the database when the site builds (section 3.2), the Google login with roles (section 3.4), the content dashboards with the Publish button (section 3.5; Part P). The rest is planned. This is the plan for Parts M to T of the roadmap, decided by Almira on 2026-11-20. When a roadmap part is done, move what became real into Part 1 and fix this part so it still matches. Part T folds this whole part into Part 1.

## 3.1 Why

The content moves from files in the project to a Supabase database. So people who are not on GitHub can edit safely, a typo cannot break the build, and members can send their own page for approval. The site stays a built site, so it stays fast.

## 3.2 How the pages get their data

- **Hybrid.** The public pages (Home, Members, Fandoms, Gallery, News, Credits, About, Join, Rules and the search list) stay built pages, like now. When the site builds, they read Supabase instead of the JSON files (done in Part N, through `src/lib/db.js`). They are not made again for each visitor. About, Join and Rules keep their words in the page code.
- **Server-rendered** (`export const prerender = false`, with the `@astrojs/vercel` adapter): only the dashboards, the login and its callback, and the endpoint that receives the member form.
- **Publish button.** Saving in a dashboard writes to the database at once, but the public site does not change. Someone presses Publish (who may is still an open decision, see the roadmap), which calls a Vercel deploy hook, and the site rebuilds in about a minute. The dashboard shows how many changes are not published yet.
- If Supabase is paused or down, the public site keeps working. A build would fail, and Vercel keeps showing the last working version.
- The build reads with the public key, under read-only rules. Hidden rows are not returned.

## 3.3 Tables (made in Part M; the real file is `supabase/schema.sql`)

Ten tables. Access rules are switched on for every one of them. Each public table has a `hidden` column: a hidden row is not returned to the public key.

| Table | Holds |
|---|---|
| `members` | `slug` (the old file name, so no address changes), `name`, `handle`, `pronouns`, `picture`, `joined` (a date), `intro`, `custom`, `featured`, `edited` (a date; empty = use `joined`), `sections` (a JSON list of `heading` and `text`), `hidden` |
| `fandoms` | `slug` (the same address-piece rule as `toSlug`, so two spellings are one fandom), `name`, `picture`, an optional `description`, `hidden` |
| `member_fandoms` | Links a member to a fandom. It has a `position`, so a member's fandoms keep the order the member chose |
| `gallery` | `slug`, `title`, `description`, `credit`, `file`, `alt`, `added` (a date), `position` (the order in the old file; it breaks ties between pictures added on the same day), `hidden` |
| `news` | `title` (optional), `pic` (optional), `author` (called `by` in the old file), `date`, `summary`, `position` (the order in the old file: the home box shows the first three), `import_key` (used only by the import script), `hidden` |
| `admins` | `email` (lowercase), `added_by`, `added_at` |
| `member_requests` | `kind` (`new` or `edit`), `member_id` (for an edit), `status` (`pending`, `approved` or `rejected`), what the form sends (`name`, `handle`, `pronouns`, `fandoms` as typed, `joined`, `intro`, `sections`), `reason` (the sender's note), `ip_hash` (salted hash for the rate limit), `review_note`, `reviewed_by`, `reviewed_at`, `created_at` |
| `fandom_requests` | `fandom_id`, `status`, `description` (the proposed text), `reason`, `ip_hash`, and the same review columns |
| `heartbeat` | Dummy rows for the keep-alive (see 3.8) |
| `publish_state` | One row: `last_published_at` and `pending_changes` |

Who can read what:

- The public key reads `members`, `fandoms`, `member_fandoms`, `gallery` and `news`, and never a hidden row. A member-fandom link is readable only when both its member and its fandom are.
- The public key cannot write anything. It cannot read `admins`, `member_requests`, `fandom_requests`, `heartbeat` or `publish_state` either. Only the secret key (server only) can.
- `npm run db:check` tests all of this against the real project.

Nothing is deleted by an admin. A row is hidden instead, and it can come back.

The database holds only members, fandoms, gallery and news (plus the admin tables). The words of the Join, Rules, About and Credits pages and the server address stay in the page code (Almira's decision).

The import (Part M):

- `npm run db:import:dry` reads the content files, checks them and prints a report. It writes nothing and needs no keys.
- `npm run db:import` copies the files into the tables. Members, fandoms and gallery pictures are matched by `slug`, and news by a fingerprint of its text (`import_key`), so running it again makes no doubles. It never changes `hidden` and never deletes a row.
- A normal run overwrites the fields of rows that already exist with what is in the files. `npm run db:import -- --only-new` adds only rows that are not in the database yet. Once the dashboards are in use, use `--only-new` or do not run the import.
- The fandoms are built from the members the same way as `src/lib/fandoms.js` (same address rule, first spelling shown), and each fandom's `picture` is filled from `public/fandoms/`. Pictures in that folder that match no fandom are listed in the report and not used.

## 3.4 Login and roles

- Login is **Google OAuth**, through Supabase Auth.
- **Super-admin:** the Google email in the setting `SUPER_ADMIN_EMAIL`. Only Almira.
- **Admin:** the Google emails in the `admins` table. The super-admin adds and removes them in the dashboard. There are no shared keys and no secret addresses. The first idea of a key that can be regenerated became Add and Remove.
- Anyone else who signs in sees a "not allowed" page.
- The dashboard is at `/admin/`. The server checks the role on every dashboard page and on every write. The secret key lives only on the server, never in the browser.
- The public key in the browser can read published rows only and cannot write.

Built in Part O:

- **Files:** `src/lib/auth.ts` (the login client, the secret-key client, `getRole`), `src/middleware.ts` (the guard), `src/pages/admin/` (login, callback, logout, not-allowed, and a plain home), `src/env.d.ts` (the type of `Astro.locals.user`).
- **Flow:** the login page has a button (a small form). It sends the person to Google. Google sends them to Supabase, and Supabase sends them to `/admin/callback`, which swaps the one-time code for a login cookie and checks the role. Allowed people land on `/admin/`. A person with no role is signed out at once and sees the not-allowed page.
- **Role rules (`getRole`):** the email must come from a Google login and be confirmed. It is `super` when it equals `SUPER_ADMIN_EMAIL`, `admin` when it is in the `admins` table, and no access otherwise. Any doubt or database error means no access.
- **The guard:** the middleware only acts on `/admin/*` and `/api/admin/*`, so the built public pages never read cookies. It asks Supabase who is logged in on every request (`getUser`, not the cookie alone), sends these pages with no-cache and noindex headers, and answers API calls with 401 (not logged in) or 403 (not allowed). A removed admin loses the login on the next request.
- **Settings outside the code:** in Supabase, the Google provider is on with the Google client id and secret, the Email provider is off (so no one can make an account by email), and the Site URL and the Redirect URLs include `/admin/callback` for localhost:4321 and for the live site. In Google Cloud, the OAuth client is a Web application whose redirect address is the Supabase auth callback, and the app is published (not in test mode).
- **First admins:** added by hand in the `admins` table, with the email in lowercase, until Part S makes the screen.
- **Known and accepted:** Google's login screen shows the Supabase project address instead of the site name. It changes only after Google verifies the branding (needs a domain the project owner owns) or with a paid Supabase custom domain. Only admins see this screen.

## 3.5 Who can do what

| Action | Admin | Super-admin |
|---|---|---|
| Create and edit members, fandoms, gallery, news | yes | yes |
| Hide and unhide | yes | yes |
| Review member requests (fix, approve, reject) | yes | yes |
| Press Publish | yes (decided 2026-11-20) | yes |
| Delete for good | no | yes |
| Add and remove admins | no | yes |
| Keep-alive button | no | yes |

How the content dashboards work (written in Part P, not tested yet):

- `/admin/` shows counts, unpublished changes, the last publish time and the Publish button (it calls `VERCEL_DEPLOY_HOOK_URL`, then resets the count).
- `/admin/<members|fandoms|gallery|news>/` lists rows with Edit and Hide/Unhide. `/admin/<kind>/new/` and `/admin/<kind>/<id>/` are the forms. There is no delete in these screens.
- Every save checks the old data-file rules, writes with the secret key on the server, and raises `pending_changes`. Both roles may write.
- Member and gallery slugs are locked after saving. A fandom's slug is always `toSlug(name)`, and a second fandom with the same slug is refused.
- Member fandoms: a compact checkbox list of all fandoms plus an "Add fandoms not in the list" box. Typed names are created (name only) at save, or linked if the slug exists. The member's old order is kept, newly checked ones follow in list order, typed ones last. (A plain text box was tried first, but one unknown name refused the whole save, which was too hard on long lists.)
- New news items go first (the home box shows the lowest position first); new gallery items go last.
- Code: `src/lib/admin.ts` (rules and database work), `src/components/AdminNav.astro`, `src/pages/admin/index.astro`, `src/pages/admin/[kind]/index.astro`, `src/pages/admin/[kind]/[id].astro`, `src/pages/api/admin/publish.ts`.

## 3.6 Requests from the public (Part Q, written, not tested)

Anyone can send a request. A request is never public by itself. There is no member login, so a request cannot prove who sent it: the reviewer is the check. There is no separate editor role: admins review (Katz and Kate can be admins if they are asked).

- **Three kinds:** a new member (`/member-form/`), a change to a member page (`/members/<slug>/edit/`, filled with the current page), and a new description for a fandom (`/fandoms/<slug>/edit/`; only the description). Members with a custom page have no edit page. All three use `src/components/RequestForm.astro`. The edit pages are built with the site, so they show the content of the last Publish.
- **Sending:** the form posts JSON to `src/pages/api/request.ts`, which saves a `pending` row in `member_requests` or `fandom_requests`. The Web3Forms email is gone (Almira's decision).
- **Protection:** same-origin check; the hidden trap field `botcheck` (filled = a silent fake success); length limits (name 80, handle 40, pronouns 40, intro 300, 12 sections of up to 4000 characters, fandom description 1000, note 300); Cloudflare Turnstile checked on the server; a rate limit of 3 requests per hour and 8 per day for each visitor (a salted hash of the address, in `ip_hash`); and a stop at 200 waiting requests. Turnstile keys are in section 3.10. The endpoint fails closed: with no `TURNSTILE_SECRET_KEY` it refuses.
- **Review:** `/admin/requests/` lists pending first. A member request opens a screen with every field editable, a Now / Proposed table for a change, and a checkbox "Create fandoms that do not exist yet (name only)". Approve runs the same rules as the member dashboard (`saveRow`): a new member gets a row (hidden = no), a change updates the member and sets "Last edited" to today. Reject saves the note. Either way the screen records who and when, and only a pending request can be handled. The site changes at the next Publish.
- **Pictures:** members still send theirs to Almira. The reviewer uploads it when approving (Part R).
- **Links and noindex:** the member page and the fandom page have an "Edit this page" link. `Base.astro` takes a `noindex` prop, used by the form and both edit pages. The fandom page now shows the fandom's `description` when it has one (if it does not show, `src/lib/fandoms.js` does not pass `description` on: send that file).


## 3.7 Pictures

- Part R: Supabase Storage. The dashboard has a choose-a-picture control. The browser shrinks the picture to about 1200 px wide and under 300 KB (the same rule as now) and then uploads it. The row stores the picture's address.
- Fandom pictures become a column on `fandoms`. The scan of `public/fandoms/` in `src/lib/fandoms.js` is removed.
- Until Part R, a picture field is a text box for an address, and the existing pictures stay in `public/`.
- Site art (logo, hero, splatters, stripe strip) stays in `public/`.

## 3.8 Keep-alive

As far as is known, a free Supabase project can pause after a while without activity (check their current rules). The super-admin dashboard has a button that adds a dummy row to `heartbeat` and deletes it right away. A weekly Vercel cron job calls the same endpoint, so it does not depend on remembering. The dashboard shows the time of the last ping. It never touches the real tables.

## 3.9 What stays in files

Code, `public/style.css`, the site art, `templates/`, the docs, and the custom member pages (`public/members/member-name/`). The `custom` flag of a member lives in the member's row. Katz and Kate keep GitHub for code and custom pages.

## 3.10 Settings (secrets)

Kept in `.env` (never committed) and in the Vercel settings. `.env.example` lists the names without values. The names were fixed in Part M. Supabase calls its old key pair `anon` and `service_role` and plans to retire them by the end of 2026, so the new pair (publishable and secret) is used here.

| Name | What it is |
|---|---|
| `PUBLIC_SUPABASE_URL` | The project address |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The public key (starts with `sb_publishable_`), read-only under the rules |
| `SUPABASE_SECRET_KEY` | The strong key (starts with `sb_secret_`). Server only. Also set in Vercel since Part O (the login reads the `admins` table with it). The build does not use it |
| `SUPER_ADMIN_EMAIL` | Almira's Google email. Used by the login since Part O, set in `.env` and in Vercel |
| `VERCEL_DEPLOY_HOOK_URL` | The address the Publish button calls (Part P). Made, and set in `.env` and in Vercel. Treat it like a password |
| `PUBLIC_SITE_URL` | Optional. The live address, like `https://halilintarsmp.vercel.app` (no slash at the end). Used by `Base.astro` for the canonical link and link previews. Empty = `https://halilintarsmp.vercel.app`. The build needs it |
| `PUBLIC_TURNSTILE_SITE_KEY` | The Cloudflare Turnstile site key (Part Q). Public, but the BUILD needs it: set it in `.env` and in Vercel. Cloudflare's test key `1x00000000000000000000AA` always passes (for localhost) |
| `TURNSTILE_SECRET_KEY` | The Turnstile secret key. Server only, in `.env` and in Vercel. The test secret is `1x0000000000000000000000000000000AA` |
| `CRON_SECRET` | Protects the weekly keep-alive call |

The Google client id and secret are set in Supabase's Auth settings, not in the project.

## 3.11 Backup

Part T adds `scripts/export-json.mjs`, which writes the tables out as JSON, so the content is never only in Supabase.
