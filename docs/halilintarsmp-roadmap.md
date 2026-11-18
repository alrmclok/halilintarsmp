# HalilintarSMP: roadmap

Last updated: 2026-11-18

This file is written for the AI that helps Almira build the site. It lists the work in ordered parts (A, B, C and so on). Each part is small enough to finish in one chat, and the next part is started in another chat. The context for everything is in `halilintarsmp-main.md`. This file only tracks progress.

## Rules for the AI

1. Almira sends both files at the start of every chat: the main document and this roadmap. Both live in the `docs/` folder of the project.
2. Read the main document first, then find the first part here that is not Done. Work only on that part.
3. Before starting a part, say in a few plain words what it will do. Then do it.
4. When the part is finished and nothing in the plan changed: update only this file. Set the status to Done, tick the checklist, and write short notes under "Notes".
5. When something in the real app changes what the main document says (a file or folder name, a decision, a color or size, a rule): update the main document too, so it matches the real site.
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

## Part F: Gallery

Status: Done

Goal: the gallery as a list with captions.

- [x] A gallery data file: each picture has a file, a title, a short description and a credit.
- [x] Gallery page.
- [x] Gallery highlights box on the home page, newest first.
- [x] Pictures are small files and have alt text.

Notes:

- New files: `src/lib/gallery.js` (reads and tidies the list, newest first; used by the home page and the Gallery page) and `src/pages/gallery/index.astro` (one Box, one row per picture: thumbnail, title, description, "by credit"). New empty folder `public/gallery/` (with a `.gitkeep`) for the pictures.
- Changed: `gallery.json` has a new field `alt`. `Row.astro` has two new optional props: `alt` (what the picture shows) and `note` (a second small line, used for the credit). `src/pages/index.astro` now gets the highlights from `getGallery()`.
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

Status: In progress

Goal: members can have their own page as a plain folder.

- [x] Make `templates/custom-member/` with `index.html`, an empty `style.css`, an empty `script.js` and a link back to `/members/`.
- [x] Make one test custom page in `public/members/`.
- [x] Set `custom: true` for that member.
- [x] Write the "Rules for custom pages" from the main document into a short note for members.
- [ ] Check the test page at `/members/custom-test/` on Vercel (the box look shows, and the line "The script works." shows).
- [ ] Check that the default page maker skipped that member (no second page, and the Members list and the Fandoms page still link to `/members/custom-test/`).

Notes:

- New files: `templates/custom-member/` (`index.html`, empty `style.css`, empty `script.js`), `templates/README.md` (the member note: how to make a page, the rules, the shared look), `public/members/custom-test/` (the test page, with a one-line script), `src/content/members/custom-test.json` (a test member with `"custom": true`).
- The starter `index.html` already has the same box markup as `Box.astro`. The line that links `/style.css` is commented out, so a member who wants the box look removes the arrows. This keeps the open decision open (see below). The test page does link `/style.css`, which is how "a custom page can link to the shared style" is tested.
- The folder from Part A may have had a simpler starter. These files replace it.
- The note for members is `templates/README.md`, not inside `public/`, because everything in `public/` is shown on the site.
- The test member is a placeholder with the fandom "Fandom A". Delete `src/content/members/custom-test.json` and `public/members/custom-test/` when a real custom page exists.
- Not run on the AI's side (no Astro here). The two checks above are Almira's, on Vercel. Tick them when they work. This part stays In progress until then.

---

## Part I: Phone check and polish

Status: In progress

Goal: the site works well on a phone.

- [x] Boxes stack in one column. (Done in Part DA.)
- [x] The tab bar scrolls sideways. (Done in Part DA.)
- [x] The header drawing becomes small or goes away. (Done in Part DA.)
- [ ] Two or three ink splatters at most. (Waits for the drawn splatters.)
- [x] Buttons and links are at least 44 px tall. Text is at least 14 px. (Done in Part DA; check again as new pages are added.)
- [ ] Test on a real phone.
- [ ] Each page has its own title and link-preview tags. (Titles are done. The preview picture needs the full web address.)

Notes:

- Most of this part was done early in Part DA. What is left needs the drawn pictures or a real phone.
- New pages (Fandoms, Gallery, About, Credits) must be checked on a phone when they are built. About and Credits (Part G) still need that check. The Gallery list and the picture page with its lightbox (Part FA) are among them.

---

## Part J: Guide for the people who edit

Status: Not started

Goal: a short plain guide for Katz and Kate.

- [ ] How to get the invite and open the project.
- [ ] How to edit a file in the browser on GitHub and save it (a "commit").
- [ ] Where member files, custom pages and gallery files are.
- [ ] The rules for custom pages.
- [ ] What to do if something breaks (GitHub keeps old versions).

Notes:

---

## Part K: News, Join and Rules pages

Status: Not started

Goal: the links that still point to `#` lead to real pages. Almira picked pages, not pop-ups.

- [ ] News page (`/news/`): all items from `news.json`, newest first, built with the same Box and Row as the other lists. "More news" and each news row on the home page point to it.
- [ ] Join page (`/join/`): how to join, and the server address in its own Box with the address `server-address` (so `/join/#server-address` jumps to it). The second-bar link "Join" and the hero button lead to this page. The second-bar link "Server address" leads to `/join/#server-address`.
- [ ] Rules page (`/rules/`): the second-bar link "Rules" leads here.
- [ ] Real addresses for the Discord and WhatsApp links in the black corner box (still `#`).
- [ ] Add the three pages to the pages table and the folder layout in the main document.
- [ ] Check every new page on a phone.

Notes:

---

## Open decisions

Ask about these when the part that needs them starts. Do not decide them silently.

- Real facts for the hero list. Placeholders for now. (Part C)
- The orange line on the hero button ("Ask an admin" is a first try). (Part C)
- May custom member pages break the Part 2 style rules, or must they follow them? (Part H)
- The drawn logo, header figure, hero title picture, ink splatters and stripe strip. Placeholders until drawn.
- The real text for About, and the real "made by" line for Credits. Placeholders for now. (Part G)
- Which picture is the tab icon and link preview (`putinxtrump.png` now, the docs say `halilintarsmp-logo.png`), and the real footer line (now "futer"). (Part I)

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
