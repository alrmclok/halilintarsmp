# HalilintarSMP: roadmap

Last updated: 2026-11-20

This file is written for the AI that helps Almira build the site. It lists the work in ordered parts (A, B, C and so on). Each part is small enough to finish in one chat, and the next part is started in another chat. The context for everything is in `halilintarsmp-main.md`. This file only tracks progress.

Parts A to L built the site from files. From Part M on, the work is the move to Supabase and the dashboards. The plan for that is Part 3 of the main document.

## Rules for the AI

1. Almira sends both files at the start of every chat: the main document and this roadmap. Both live in the `docs/` folder of the project. The guide `docs/guide-for-editors.md` is sent only when the work changes something it explains. From Part M on, also send `supabase/schema.sql` once it exists.
2. Read the main document first, then find the first part here that is not Done. Work only on that part.
3. Before starting a part, say in a few plain words what it will do. Then do it.
4. When the part is finished and nothing in the plan changed: update only this file. Set the status to Done, tick the checklist, and write short notes under "Notes".
5. When something in the real app changes what the main document says (a file or folder name, a decision, a color or size, a rule): update the main document too, so it matches the real site. If the guide for editors explains it too, update the guide.
6. At the end of the chat, hand back the updated files.
7. Write plainly. Almira is learning, so explain new words in a short line. Write any mentioned person with they/them.
8. Do not add pages, features or boxes that are not in the main document. If an idea comes up, write it under "Open decisions" and ask.

Status words: **Not started**, **In progress**, **Done**.

---

## Part A: Project setup

Status: Done

Goal: an empty Astro site that is on GitHub and live on Vercel.

- [x] Create the Astro project with the folder layout from the main document (Part 1, "Folder layout").
- [x] Put it in the GitHub project.
- [x] Connect the GitHub project to Vercel, so a push rebuilds the site.
- [x] Check that a one-line test page shows on the Vercel address.
- [x] Write a short `README.md` that says how to run the site on a computer and how a change goes live.
- [ ] When Katz and Kate say yes, invite them to the GitHub project.

Notes:

- The project is made and builds without errors on the AI's side (Astro 5.14.1). It has the folder layout, a one-line test page (`src/pages/index.astro`), the starter folder `templates/custom-member/` and the README.
- Almira did the GitHub and Vercel steps by hand and checked that the test page shows on the Vercel address.
- The invite for Katz and Kate is still open. It waits until they say yes. It does not block any other part.
- Empty folders hold a `.gitkeep` file, because Git does not keep empty folders. Delete the `.gitkeep` once a folder has real files.

## Part B: Look base

Status: Done

Goal: the colors, the layout frame and the Box, so every later page is built from them.

- [x] Write `public/style.css`: the colors from Part 2 section 3 as variables, the font stack, the square flat look, the dotted row lines.
- [x] Build `Base.astro`: header band, yellow tab bar, maroon second bar, footer (Part 2 section 4).
- [x] Tabs: Home, Members, Fandoms, Gallery, About. Credits in the footer.
- [x] Build `Box.astro`: maroon title bar, yellow "More" link with the orange arrow, light body, rows with a small square picture (Part 2 section 5).
- [x] Use the placeholder logo `halilintarsmp-logo.png` in the header, the tab icon and the link preview.
- [x] Header figure: a plain empty labeled box.
- [x] Black corner box: Discord and WhatsApp links, with placeholder addresses.
- [x] Check text sizes and contrast against Part 2.

Notes:

- Files made: `public/style.css`, `src/layouts/Base.astro`, `src/components/Box.astro`, `public/halilintarsmp-logo.png` (a plain placeholder), and a test home page with one Box.
- `Base.astro` loads the style with a normal link to `/style.css`, so custom member pages can link to the same file later.
- Second bar links (Almira picked the suggested ones): Join, Rules, Server address, News. They point to `#` for now, because there is no Rules or Server address page yet.
- Search box is a stub: it shows, but does nothing. Almira's plan for it later is in the main document.
- Tab links go to `/members/`, `/fandoms/`, `/gallery/` and `/about/`. They show a "not found" page until Parts D to G make them.
- Splatters and the stripe strip are not in yet. They wait for the drawn pictures.
- Link previews: the preview picture needs the full web address, so it is set properly in Part I.

---

## Part C: Home page

Status: Done

Goal: the home page with placeholder content.

- [x] Hero box: a gray placeholder for the title picture, four placeholder facts with round bullets, and the big button ("Join the SMP" in white, "Ask an admin" in orange).
- [x] Row one: Gallery highlights (wide) and Featured member (narrow).
- [x] Row two: Fandoms, Members list and News (three equal boxes).
- [x] Fill every box with placeholder rows built from data files, not typed into the page.
- [x] A small news data file for the News box.

Notes:

- Home page is `src/pages/index.astro`. Every box reads from data files: members in `src/content/members/` (one JSON file each), gallery in `src/content/gallery.json`, news in `src/content/news.json`. The Fandoms box is made from the fandoms listed in the members' files.
- New small helper `src/components/Row.astro` (one row: square picture, bold title, smaller line), so every box builds its rows the same way. New `src/content.config.ts` tells Astro what a member file must contain, and warns if one is wrong. Part D can use both.
- The featured member is simply the first member for now. How it is picked is decided in Part D.
- Gallery highlights shows the three newest pictures, using an `added` date in the gallery file.
- The "News" link in the maroon bar now jumps to the News box on the home page. "More news" points to `#` because there is no news page.
- All words and members here are placeholders. Boxes fill with real text later.
- The grid stacks on phones in Part I, not here.
- Later change: every list box on the home page (Gallery highlights, Fandoms, Members, News) shows at most 3 rows. The number is one line, `SHOW = 3`, at the top of `src/pages/index.astro`. Members shows the newest three. News shows the first three items in `news.json`, so keep the newest on top there.

---

## Part CA: Look rework to match the screenshot

Status: Done

Goal: make the look much closer to the Winamp screenshot (shapes, spacing, fonts, hero).

- [x] Colors compared with the screenshot. The content background is now `#d0ccbf` (measured).
- [x] The top block (logo, tabs, maroon bar) and the content are two separate blocks, with a strip of page color between them.
- [x] Active tab: slanted left edge, sticks up above the bar. Yellow bar end slanted. Black corner box starts higher and has one rounded corner.
- [x] Fonts: Verdana for text, Trebuchet MS bold for the bars, box titles and "More" links.
- [x] Spacing and sizes closer to the screenshot: 6 px gaps, picture 76 x 58 px, "More" arrow points up and right.
- [x] Hero is one full picture. The facts and the button sit on top of it. Placeholder `public/hero-title.png`.

Notes:

- Almira draws the hero picture and saves it over `public/hero-title.png` (1520 x 660 px). Leave room at the bottom left (facts) and bottom right (button).
- Not done yet: ink splatters, stripe strip, small pictures in the title bars. They wait for the drawn pictures.
- Phones are still Part I. The tab bar and the hero text will need that part.
- Not seen on a real screen yet by the AI. Almira checks it on Vercel.

---

## Part D: Members

Status: Done

Goal: the Members list and the default member page.

- [x] Member data files, one per member, with: name, handle, picture, fandoms, joined date, a one-line intro and a `custom` flag.
- [x] A few placeholder members to test with.
- [x] Members list page.
- [x] Default member page `members/[slug].astro` in the article style: title, one-line intro, infobox on the right, sections, categories line at the bottom, "Last edited" line (Part 2 section 7).
- [x] Skip members with `custom: true` so their folder is used instead.
- [x] Home page boxes (Featured member, Members list) read from the same data.

Notes:

- New files: `src/pages/members/index.astro` (list, A to Z), `src/pages/members/[slug].astro` (default page), `src/lib/slug.js` (one shared `toSlug`, so every link matches; the home page now uses it too). Two new placeholder members: `member-two.json`, `member-three.json`.
- Three optional fields were added to the member data file, so the article has something to show: `sections`, `edited` and `featured`. They are in `src/content.config.ts` and listed in the main document ("The member data file").
- Featured member: a member with `"featured": true` is shown. If nobody has it, the first member is shown. Almira can change this rule. (Placeholder: Member Two has the flag, to test it.)
- Home page Members box now shows the newest six by `joined` date, newest first.
- A member with `custom: true` gets no default page (tested). The Members list still links to `/members/name/`.
- Fandom links on member pages (`/fandoms/fandom-a/`) show "not found" until Part E.
- Not done: the contents box (the main document says "if the page is long"). Add it when a member page really gets long.
- Built and tested with a real Astro build (5.14.1) on the AI's side. Not seen on a real screen. Almira checks it on Vercel.
- The infobox floats right at 220 px. On phones it still needs the stack rule in Part I.

---

## Part DA: Look check, round 2, and phones

Status: Done

Goal: match the Winamp screenshot more closely (spacing, sizes, hero) and make the site work on a phone.

- [x] Measured the screenshot. Content edge to box edge is 7 px, gap between boxes 7 px sideways and 10 px between rows, title bar 23 px, sub bar 25 px, rows 6 px from the box edge. The CSS now uses these.
- [x] Boxes are wider inside: less padding in the box body, hero flush with the content block (it is shown at its real 760 px).
- [x] Row one is 1.45 to 1 (it was 2 to 1), so "Featured member" and "More members" fit on one line.
- [x] The big hero button is tilted, and a placeholder "Hero figure" box stands behind its top edge.
- [x] Phone layout (see Part I, most of its list is done here).

Notes:

- Bug fixed: the hero button text used the class names `top` and `bottom`, and `.top` is also the header block, so the button was about 66 px too tall. They are now `btn-top` and `btn-bottom`.
- Bug fixed from Part D: the infobox title on member pages was maroon on maroon. Section headings on the article are now `.article > section > h2` only.
- The hero figure is a placeholder box (`.hero-figure`). Remove it when the figure is drawn into `hero-title.png` or a real picture is added.
- Tested in a real browser engine on the AI's side at 830 px and at 375 px wide (no sideways scroll). The logo and hero pictures used there were gray placeholders. Almira still checks on a real phone and with the real logo, because the logo width decides if it fits next to the corner box.
- Not done: ink splatters, stripe strip, small pictures in the title bars (they wait for the drawn pictures), and the extra space at the bottom of the content block that the screenshot has for the splatter.

---

## Part E: Fandoms

Status: Done

Goal: the Fandoms list and one category page per fandom, made from member data.

- [x] Fandoms list page.
- [x] A page for each fandom that lists its members.
- [x] The categories line on member pages links to these pages.
- [x] Home page Fandoms box reads from the same data.

Notes:

- New files: `src/lib/fandoms.js` (one helper that builds the fandom list from the members, used by every fandom page and the home page), `src/pages/fandoms/index.astro` (list, A to Z, with member counts) and `src/pages/fandoms/[slug].astro` (one fandom: a Box with its members as rows, "All fandoms" link in the title bar).
- Changed: `src/lib/slug.js` now drops accents ("Pokémon" becomes `pokemon`). `src/pages/index.astro` now gets its Fandoms box from the helper.
- Decision: two spellings are the same fandom when they make the same address piece, so capitals, extra spaces and symbols do not matter ("Fandom A", "fandom  a" and "FANDOM-A" are one fandom). The name shown is the first spelling found, going through members in file-name order. A fandom name with no letters or numbers is skipped with a warning in the build log.
- The member page "Categories" line and infobox already linked with `toSlug`, so they needed no change. They now work, because the pages exist.
- Members with `custom: true` are still listed in their fandoms, and link to their own folder.
- The Home page Fandoms box shows every fandom. If the list gets long, cut it to the biggest few (like the Members box does with six).
- Not run on the AI's side (no Astro here). Almira checks `/fandoms/` and `/fandoms/fandom-a/` on Vercel and reads the build log for warnings.

---

## Part EA: Pronouns and fandom pictures (made outside the parts list)

Status: Done

Goal: a member can show pronouns, and a fandom can show a picture, with no new page or data file.

- [x] Optional `pronouns` field in the member data (`z.string().optional()` in `src/content.config.ts`).
- [x] A Pronouns row under the handle in the infobox of `src/pages/members/[slug].astro`, only when pronouns are given.
- [x] Pronouns also shown in the home page "Featured member" box, only when given.
- [x] `src/lib/fandoms.js` reads `public/fandoms/` at build time, drops the extension from each file name, cleans it and gives each fandom a `pic` (`/fandoms/<file name>`).
- [x] `pic` is passed to `Row` in `src/pages/fandoms/index.astro` and `src/pages/index.astro`. No picture = the gray square.

Notes:

- Made by Almira with another AI on 2026-11-19. This AI only read the summary of that work and did not see the code. Almira checks with `npm run build` and `npm run preview`.
- The documents now describe it: the `pronouns` row in "The member data file", the new "Fandom pictures" part, the `public/fandoms/` folder and the infobox line in Part 2 section 7.
- The summary named a file `src/components/FeaturedMember.astro`. It exists (the home page imports it), so it is now in the folder layout of the main document.
- Check: the build still works when `public/fandoms/` is empty (an empty folder needs a `.gitkeep`, and the scan should skip it). Check also what happens when two files clean to the same name. The docs say "one picture per fandom" for now.
- Not changed: the page for one fandom (`fandoms/[slug].astro`) was not mentioned, so it shows no picture.

---

## Part F: Gallery

Status: Done

Goal: the gallery as a list with captions.

- [x] A gallery data file: each picture has a file, a title, a short description and a credit.
- [x] Gallery page.
- [x] Gallery highlights box on the home page, newest first.
- [x] Pictures are small files and have alt text.

Notes:

- New files: `src/lib/gallery.js` (reads and tidies the list, newest first; used by the home page and the Gallery page) and `src/pages/gallery/index.astro` (one Box, one row per picture: thumbnail, title, description, "by credit"). New empty folder `public/gallery/` (with a `.gitkeep`) for the pictures.
- Changed: `gallery.json` has a new field `alt`. `Row.astro` has two new optional props: `alt` (what the picture shows) and `note` (a second small line, used for the credit). `src/pages/index.astro` now gets the highlights from `await getGallery()`.
- Each Gallery row links to that picture's own page (see Part FA).
- Pictures are not shrunk by the site (files in `public/` are served as they are). The rule is in the main document: about 1200 px wide at most and under 300 KB. Almira can change this number.
- The gallery list is not checked by Astro like the member files are. `gallery.js` gives safe defaults for a missing field instead.
- The three gallery entries are still placeholders with no files. Almira adds real pictures to `public/gallery/` and real entries to `gallery.json`.
- Not run on the AI's side (no Astro here). Almira checks `/gallery/` on Vercel, and on a phone.

---

## Part FA: Gallery rework (picture pages, lightbox, member links)

Status: Done

Goal: the gallery pictures can be seen big, and member names in gallery text link to the member.

- [x] Each picture has its own page at `/gallery/title/`, with the big picture.
- [x] Clicking the picture on that page opens a lightbox.
- [x] Gallery rows link to those pages (the thumbnail and the title).
- [x] A word starting with `@` in a description links to the member with that handle, only when one is found.
- [x] The credit links to the member with that name, only when one is found.
- [x] The Gallery list is in two columns on a computer, one column on a phone.

Notes:

- New files: `src/pages/gallery/[slug].astro` (the picture page and the lightbox, a small script using the built-in `<dialog>` element: click anywhere or press Esc to close), `src/lib/mentions.js` (finds members and makes the links), `src/components/Parts.astro` (shows text with links inside it).
- Changed: `gallery.js` gives every picture a slug from its title (duplicates get -2, -3). `Row.astro` now makes the thumbnail a link when the row has a link, and `sub` / `note` can hold links. The home highlights link to the picture pages and link the credit. `style.css` has the mention color, the two columns, the picture page and the lightbox (and the phone rules at the end).
- Rule for @: matches a member's `handle`, not their file name, so a changed handle stops matching and the old text stays as it was. "@member_one!" links `@member_one`; the "!" stays plain. The credit matches a member's `name` or `handle`. Capitals do not matter.
- Pictures without a file still get a page (a gray box, no lightbox), so no link leads to "not found".
- "2 rows" was read as two columns. Almira can say if they meant something else.
- The first placeholder entry in `gallery.json` now says "Say hi to @member_one!" and is credited to "Member One", so the links can be tested with the placeholder member.
- Changing a picture's title changes the address of its page. Almira can add an optional `slug` field later if that becomes a problem.
- Not run on the AI's side (no Astro here). Almira checks `/gallery/`, one picture page and the lightbox on Vercel, and on a phone.

---

## Part G: About and Credits

Status: Done

Goal: the last two pages.

- [x] About page with placeholder text about the SMP.
- [x] Credits page, linked from the footer.

Notes:

- New files: `src/pages/about.astro` (one Box with three placeholder paragraphs) and `src/pages/credits.astro` (two Boxes). Neither needs new CSS or new components: they only use `Base.astro` and `Box.astro`.
- The footer and the About tab already linked to `/credits/` and `/about/` (Part B), so `Base.astro` did not change.
- Credits box one is a short note: the look is inspired by the Winamp website but not connected to it, the pictures are drawn by us, and the two fonts. Almira said yes to this idea. The line about who built the site is still a placeholder.
- Credits box two ("Members") lists every member's name, A to Z. It reads the same member files as the Members list, and each name links to `/members/<file name>/`. A member with a custom page links to the same address, so it works for both kinds.
- The lists are plain `<ul>` and `<p>` text inside the Box. If the spacing looks cramped on Vercel, Almira can send `public/style.css` and the AI will add a small rule.
- Spotted in `Base.astro`, not changed: the link-preview picture and the tab icon point to `/putinxtrump.png`, while this document says the placeholder logo `halilintarsmp-logo.png`. The footer line still says "futer". Both are for Almira to decide.
- Not run on the AI's side (no Astro here). Almira checks `/about/` and `/credits/` on Vercel, and on a phone.

---

## Part H: Custom member pages

Status: Done

Goal: members can have their own page as a plain folder.

- [x] Make `templates/custom-member/` with `index.html`, an empty `style.css`, an empty `script.js` and a link back to `/members/`.
- [x] Make one test custom page in `public/members/`.
- [x] Set `custom: true` for that member.
- [x] Write the "Rules for custom pages" from the main document into a short note for members.
- [x] Check the test page at `/members/custom-test/` on Vercel (the box look shows, and the line "The script works." shows).
- [x] Check that the default page maker skipped that member (no second page, and the Members list and the Fandoms page still link to `/members/custom-test/`).

Notes:

- New files: `templates/custom-member/` (`index.html`, empty `style.css`, empty `script.js`), `templates/README.md` (the member note: how to make a page, the rules, the shared look), `public/members/custom-test/` (the test page, with a one-line script), `src/content/members/custom-test.json` (a test member with `"custom": true`).
- The starter `index.html` already has the same box markup as `Box.astro`. The line that links `/style.css` is commented out, so a member who wants the box look removes the arrows. This keeps the open decision open (see below). The test page does link `/style.css`, which is how "a custom page can link to the shared style" is tested.
- The folder from Part A may have had a simpler starter. These files replace it.
- The note for members is `templates/README.md`, not inside `public/`, because everything in `public/` is shown on the site.
- The test member is a placeholder with the fandom "Fandom A". Delete `src/content/members/custom-test.json` and `public/members/custom-test/` when a real custom page exists.
- Checked by Almira with `npm run build` and `npm run preview` on 2026-11-18: the test page opens at `/members/custom-test/` (HTML, the CSS override and the script all work), no second page is made, and the Members list and Fandoms page link to it.
- `npm run dev` shows a 404 for `/members/custom-test/` (only `/members/custom-test/index.html` opens), because the dev server does not open a folder's `index.html` from `public/`. Vercel does, so it is not fixed. To test custom pages on a computer, use `npm run build` then `npm run preview`.
- The open decision "may custom pages break the Part 2 style rules?" is still open. The starter leaves the shared look switched off, so members can choose.
- Status was "In progress" by mistake: every checkbox was ticked and the progress log already listed it. Set to Done on 2026-11-19.

---

## Part I: Phone check and polish

Status: Done

Goal: the site works well on a phone.

- [x] Boxes stack in one column. (Done in Part DA.)
- [x] The tab bar scrolls sideways. (Done in Part DA.)
- [x] The header drawing becomes small or goes away. (Done in Part DA.)
- [x] Two or three ink splatters at most. (Waits for the drawn splatters.)
- [x] Buttons and links are at least 44 px tall. Text is at least 14 px. (Done in Part DA; check again as new pages are added.)
- [x] Test on a real phone.
- [x] Each page has its own title and link-preview tags. (Titles are done. The preview picture needs the full web address.)

Notes:

- Most of this part was done early in Part DA. What is left needs the drawn pictures or a real phone.
- New pages (Fandoms, Gallery, About, Credits) must be checked on a phone when they are built. About and Credits (Part G) still need that check. The Gallery list and the picture page with its lightbox (Part FA) are among them.
- Link previews: `Base.astro` now has `SITE` (https://halilintarsmp.vercel.app) and `PREVIEW_IMAGE` at the top. Every page gets the full address in `og:image`, plus `og:url`, `og:type`, `og:site_name` and a canonical link. Checked by Almira: the picture shows in the WhatsApp preview. The tab icon and preview are still `putinxtrump.png` for now. Change `PREVIEW_IMAGE` when the art is ready.
- Phone fixes in `style.css`: box titles may wrap (long fandom names), and on phones 400 px wide or less the logo gets smaller so it does not touch the corner box.
- Splatters: four SVG files made by the AI (`public/splat-1.svg` to `splat-4.svg`, two maroon and two yellow). They are placed in `style.css` with `::before` and `::after` (tab bar end, bottom right of the content, left of the footer). The content block has 50 px of extra space at the bottom for one of them. The stripe strip is CSS in the footer's bottom left. On phones only one splatter shows. They can be replaced with Almira's own drawings by using the same file names.
- Left for later: the search box is under 44 px tall on phones (it is a stub), and a second hero picture for phones may be needed once the hero is drawn.

---

## Part J: Guide for the people who edit

Status: Done

Goal: a short plain guide for Katz and Kate.

- [x] How to get the invite and open the project.
- [x] How to edit a file in the browser on GitHub and save it (a "commit").
- [x] Where member files, custom pages and gallery files are.
- [x] The rules for custom pages.
- [x] What to do if something breaks (GitHub keeps old versions).

Notes:

- New file: `docs/guide-for-editors.md`. It is also listed in the folder layout of the main document. It covers the invite, editing and adding files, where things are, adding a member (with a small example), fandom pictures, a gallery picture, news, custom pages and fixing a mistake.
- The button names (pencil icon, "Commit changes", "Add file", "History") come from the AI's knowledge of GitHub, not from a screen. Katz and Kate (or Almira) should follow the steps once when the first invite goes out, and fix any wording that is off.
- For fixing a mistake the guide says to copy the old text back from the History page. As far as the AI knows, GitHub's website has no one-click undo for a single change.
- The guide says Vercel keeps showing the last working version when a build fails. That is how Vercel normally works. Almira can confirm in the Vercel dashboard.
- The invite for Katz and Kate is still open (Part A). The guide does not depend on it.
- Two things the guide had to leave open or suggest (see "Open decisions"): where member pictures go, and which files Katz and Kate may edit.

---

## Part K: News, Join and Rules pages

Status: Done

Goal: the links that still point to `#` lead to real pages. Almira picked pages, not pop-ups.

- [x] News page (`/news/`): all items from `news.json`, newest first, built with the same Box and Row as the other lists. "More news" and each news row on the home page point to it.
- [x] Join page (`/join/`): how to join, and the server address in its own Box with the address `server-address` (so `/join/#server-address` jumps to it). The second-bar link "Join" and the hero button lead to this page. The second-bar link "Server address" leads to `/join/#server-address`.
- [x] Rules page (`/rules/`): the second-bar link "Rules" leads here.
- [x] Discord and WhatsApp links in the black corner box: decided to send both to the Join page (see Notes).
- [x] Add the three pages to the pages table and the folder layout in the main document.
- [x] Check every new page on a phone (Almira).

Notes:

- New files: `src/pages/news.astro`, `src/pages/join.astro`, `src/pages/rules.astro`. Changed: `src/layouts/Base.astro` (corner links and second-bar links) and `src/pages/index.astro` (the hero link, the "More news" link and the news rows). No new CSS and no new components: the pages only use `Base`, `Box` and `Row`.
- News page: sorted by `date`, newest first, so the order of the file does not matter there. The home page News box still shows the first three items of the file, so keep the newest on top in `news.json`. Each item shows its title, "by name, date" and its `summary` as the second small line. A news row has no page of its own, so on the home page every row and "More news" go to `/news/`.
- The maroon bar link "News" now goes to `/news/` (it used to jump to the News box on the home page, see Part C). The News box still has its `news` id, so `/#news` still works.
- Join page: two Boxes. "How to join" is placeholder text (waiting for the admins; joining is mostly in person). "Server address" has the id `server-address`. The address is one line at the top of `join.astro` (`SERVER_ADDRESS`) and is a masked placeholder until the admins approve it.
- Discord and WhatsApp: Almira decided both corner links go to the Join page, because a WhatsApp number does not belong on a public website. The labels still say "Discord" and "WhatsApp". Almira can rename them (for example "Join"), since they no longer open those apps.
- Rules page: one Box with placeholder text and three placeholder rules.
- Built here in a small test Astro project (5.14.1) with the real `Base`, `Box` and `Row`: the three pages build, the titles show, the order is newest first, the `server-address` id exists and the bar links are right. The edited `index.astro` was not built here, because it needs the whole project. Almira checks it with `npm run build` and on Vercel.
- Almira checked the new pages and the home page, and said Part K is done. Small changes will be made locally by Almira.

---

## Part L: Search box

Status: Done

Goal: the search box in the maroon bar works, as planned in the main document (Part 2 section 4).

- [x] `src/pages/search.json.js`: makes `/search.json` when the site builds, from the member files, the fandoms and `news.json`.
- [x] `public/search.js`: the dropdown with fuzzy matches (each with its kind on the right) and, always under them, the three lines "Search ... in Fandoms / Members / Posts".
- [x] The three list pages (`/members/`, `/fandoms/`, `/news/`) hide the rows that do not match when the address ends in `?q=words`, with a note and a "Show all" link.
- [x] `Base.astro`: the real search form and the script link. `public/style.css`: the dropdown, the note, the phone sizes.
- [x] Look at it on Vercel and on a phone (Almira).

Notes:

- New files: `src/pages/search.json.js`, `public/search.js`. Changed: `src/layouts/Base.astro` (the form, and one script line at the end) and `public/style.css` (a new block before the phone rules, three phone lines). The three list pages did not change: the script finds their rows by itself (only `/members/`, `/fandoms/` and `/news/`).
- No outside library. The fuzzy matching is a few small functions in `search.js`. It cleans both sides (capitals, accents and symbols do not matter), then scores each entry: same, starts with, a word starts with, inside, letters in order (short names only), or a few typos (a swapped, missing, extra or wrong letter; 1 allowed for words of 4 to 5 letters, 2 for 6 or more). A member also matches on their handle, a bit lower. At most 6 matches show.
- A news item has no page of its own, so picking a post opens `/news/` filtered to its title.
- Enter or GO: the highlighted line if there is one, else the first match, else "Search in Members" (that last choice is the AI's own, see "Open decisions"). Arrow keys move the highlight, Escape closes the list.
- Without JavaScript the form still works: GO opens `/members/?q=...`.
- Each list filter only searches its own kind (Almira's choice): Members = name and handle, Fandoms = fandom name, News = title and summary. The row text is read from the page, so if the Members row line (`handle · fandoms`) in `members/index.astro` changes, `searchedText()` in `search.js` must change too.
- The word filter on the list pages also forgives a typo ("grain" finds "Grian"), and the search box shows the typed words again on those pages.
- Names with only non-Latin letters (for example only Arabic or Japanese letters) are cleaned to nothing, like in `toSlug`, so they cannot be found. Latin names with accents work.
- Tested here: a real Astro build (5.14.1) of a small test project with the real `Base.astro`, `Row.astro`, `slug.js`, `fandoms.js`, the three list pages and three test members: `/search.json` is made with all kinds, and a fake browser (jsdom) ran the dropdown, the keys and the filter on the built pages. `Box.astro` and `Parts.astro` were simple stand-ins. Almira checked it on the real site and said it is done.

---

## Part LA: Member form (made outside the parts list)

Status: Done

Goal: members can send their profile to the admins from a page on the site.

- [x] `src/pages/member-form.astro`: one Box with a form (display name, handle, pronouns, fandoms, joined date, short intro, any number of sections).
- [x] The page builds a ready-to-paste member JSON and sends it by email with Web3Forms.
- [x] A hidden trap field (`botcheck`) against bots.

Notes:

- Made by Almira, not by this AI. The AI read the file on 2026-11-20 and did not run it.
- Fields: `name`, `handle` and `intro` are required, the rest are optional. Fandoms are typed as text and split at commas. Sections start with one called "About" and members can add more (and remove them). The JSON sets `picture` to `/putinxtrump.png` and `custom` to `false`. The form text tells members to send their picture to Almira.
- The Web3Forms key in the file is the placeholder `xxxxx`, with a note to move it to `.env`. Part Q replaces Web3Forms, so the key goes away then.
- The page is not in the tabs or the maroon bar. Members get its link privately. It is not in the pages table of the main document until Part Q.
- The form's own CSS classes (`form-wrap`, `smp-form`, and so on) are not in any file the AI has seen. They are probably in `public/style.css`.
- Almira said small changes were also made locally and not written down. The next chat should say if any of them change a file name, a field or a rule.

---

## Part M: Supabase setup, tables and import

Status: In progress

Goal: a Supabase project with the tables, the access rules and all current content copied in. Nothing on the public site changes yet.

- [x] Almira made the Supabase project.
- [x] `.env.example` lists the setting names without values.
- [ ] Almira makes `.env` with the three keys for this part and adds `.env` to `.gitignore` (steps in the chat).
- [x] `supabase/schema.sql`: the tables from Part 3 section 3.3, final names and types, and the read rules (the public key reads only rows that are not hidden, and cannot write).
- [ ] Almira runs `supabase/schema.sql` in the Supabase SQL Editor.
- [x] `scripts/import-json.mjs`: copies `src/content/members/*.json`, `gallery.json` and `news.json` into the tables, builds the fandom list from the members and links them. Safe to run again without making doubles.
- [x] Each member `slug` equals the old file name, and each gallery `slug` equals its old address, so no address changes.
- [x] Pictures keep their current paths in `public/`.
- [ ] Almira runs `npm run db:import:dry`, then `npm run db:import`, and compares the counts with the JSON files.
- [ ] Almira runs `npm run db:check`: the public key cannot write and cannot read hidden rows.
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

---

## Part N: Public pages read from Supabase

Status: Not started

Goal: the public site is built from the database and looks and works exactly as before.

- [ ] `src/lib/db.js`: one small client and the shared loaders (members, fandoms, gallery, news).
- [ ] Replace the JSON reading in the home page, the Members, Fandoms, Gallery, News and Credits pages, `mentions.js`, `fandoms.js`, `gallery.js` and `search.json.js`.
- [ ] Keep the warning in the build log for a bad row, like the old member schema did.
- [ ] Fandom pictures come from the `fandoms` table. Until Part R, keep the `public/fandoms/` scan as a fallback for a fandom with no picture.
- [ ] Add the `@astrojs/vercel` adapter. Keep the site prerendered by default.
- [ ] Set the Supabase settings in Vercel. Make the Vercel deploy hook and keep its address in a setting.
- [ ] Check: the list of built addresses is the same as before, the search works, custom member pages still work, and a build with Supabase unreachable fails clearly.

Notes:

- The site must not call Supabase when a visitor opens a page. Only the build does.
- Check what `news.astro` and the home News box do with a news item that has no `title`, and with a `pic`. The real data has both, and the old documents did not mention them. The `news` table keeps both.
- Order: the home News box takes the first three by `position`. The News page sorts by `date`. Gallery sorts by `added`, newest first, and `position` breaks ties.

---

## Part O: Login and roles

Status: Not started

Goal: Google login that lets in only the super-admin and the admins on the list.

- [ ] Google Cloud OAuth client and Supabase Auth set up (Almira, with the AI's steps).
- [ ] `/admin/login`, the callback, logout, and the "not allowed" page.
- [ ] `src/middleware.ts` guards `/admin/*` and `/api/admin/*`.
- [ ] Role check: the email in `SUPER_ADMIN_EMAIL` is super-admin, emails in `admins` are admins, everyone else is refused.
- [ ] Check: a listed email gets in, an unlisted Google account is refused, logged out means no access, and the browser's public key cannot write.

Notes:

- The first admin emails are added by hand in the table until Part S makes the screen for it.

---

## Part P: Admin dashboard (content)

Status: Not started

Goal: admins edit members, fandoms, gallery and news without GitHub.

- [ ] `/admin/` home: counts, the unpublished changes count, last publish time.
- [ ] A list and a form for each of members, fandoms, gallery and news: create, edit, hide, unhide.
- [ ] The same rules as the old data files: required fields, date format, slug rules, and a warning for a duplicate slug or a fandom with the same address piece.
- [ ] The picture field is a text box for an address until Part R.
- [ ] Every save writes to the database and raises the unpublished changes count.
- [ ] The Publish button (super-admin only) calls the deploy hook and resets the count.
- [ ] Role checks on the server for every write.
- [ ] Phone check.

Notes:

- Look: same Box and colors as the site, plain forms (proposed, see Open decisions).

---

## Part Q: Member form into the request queue

Status: Not started

Goal: the member form saves requests that an admin approves or rejects.

- [ ] `member_requests` table and a server endpoint that saves a request as `pending`.
- [ ] `member-form.astro` sends to that endpoint instead of Web3Forms. Same fields, same look.
- [ ] Protection: keep `botcheck`, add a rate limit and length limits, add `noindex`.
- [ ] Requests screen in the dashboard: list, open one, fix words, Approve (creates the member), Reject (with a note).
- [ ] Fandom names in a request are matched to existing fandoms. A name with no match is shown to the reviewer.
- [ ] Add the member form to the pages table in the main document.

Notes:

- Requests are never applied by themselves. See Part 3 section 3.6.

---

## Part R: Picture uploads

Status: Not started

Goal: pictures are uploaded in the dashboard and stored in Supabase Storage.

- [ ] Storage bucket and rules.
- [ ] A choose-a-picture control for members, fandoms and gallery. The browser shrinks the picture (about 1200 px wide, under 300 KB) before it uploads.
- [ ] The row stores the picture's address. The gallery `alt` field stays required.
- [ ] Remove the `public/fandoms/` scan from `src/lib/fandoms.js`.
- [ ] Optional: move the existing pictures from `public/gallery/` and `public/fandoms/` into Storage.

Notes:

- Site art (logo, hero, splatters) stays in `public/`.

---

## Part S: Super-admin dashboard

Status: Not started

Goal: the things only Almira can do.

- [ ] Add and remove admins by Google email.
- [ ] Delete rows for good, and unhide.
- [ ] Keep-alive: the button, the endpoint, the weekly Vercel cron job, and the last ping time on the screen.
- [ ] Phone check.

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
- [ ] Final check of every page and every dashboard screen on a phone.

---

## Open decisions

Ask about these when the part that needs them starts. Do not decide them silently.

- Real facts for the hero list. Placeholders for now. (Part C)
- The orange line on the hero button ("Ask an admin" is a first try). (Part C)
- May custom member pages break the Part 2 style rules, or must they follow them? (Part H)
- The drawn logo, header figure and hero title picture. Placeholders until drawn.
- The real text for About, and the real "made by" line for Credits. Placeholders for now. (Part G)
- Tab icon and link preview stay putinxtrump.png, and the footer line stays futer, until Almira changes them.
- Which folder holds member pictures. The main document says only "path to a small square picture", so the guide tells members to send theirs to Almira for now. Part R (uploads) settles this. (Part J)
- What Enter does in the search box when no line is highlighted: now it opens the first match, and if there is none it searches the Members. Almira can change this. (Part L)
- Which files Katz and Kate may edit. The guide suggests data files, pictures and custom page folders only, and "ask Almira first" for code (`.astro`, `.js`, `.ts`, `style.css`). Almira can loosen or tighten this. The guide is rewritten in Part T. (Part J)
- Who may press Publish. This plan says the super-admin only. Almira can allow admins too. (Part P)
- The look of the dashboards. Proposed: the same Box and colors as the site, plain forms. (Part P)
- Who the first admins are (their Google emails). (Part O)
- Should the member form have an "update my page" choice, or only new members? Without a member login a request cannot prove who sent it. (Part Q)
- Keep the Web3Forms email as a backup notice for new requests, or drop it? (Part Q)
- Only the hidden trap field plus a rate limit, or also a free captcha (for example Cloudflare Turnstile)? (Part Q)
- Member pictures: members keep sending theirs to Almira, and the reviewer uploads it on approval. Almira can change this. (Part Q, Part R)
- Show "last edited by" or keep a change log in the dashboard? (Part S)
- How often to export the tables to JSON as a backup. (Part T)

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
