# HalilintarSMP: main document

Last updated: 2026-11-18

This is the main document for the HalilintarSMP website. It says what the site is, how it is built and how it looks. It is the context file. What is done and what comes next is in `halilintarsmp-roadmap.md`.

It has two parts.

- **Part 1** says what the site is and how it is built.
- **Part 2** says how the site looks (the style guide).

## How the two files are used

- Start every chat by sending both files. Read this one for context. Read the roadmap to find the next part to do.
- When a part is finished and nothing in the plan changed, update only the roadmap (its status and notes).
- When something in the real app changes what this file says (a folder or file name, a decision, a color or size, a rule), update this file too, so it always matches the real site.
- At the end of the chat, hand back the updated files.

Writing rule for both files: when a person is mentioned, write them with they/them. This covers Alvira, Kate and anyone added later. Almira is the owner of the project and is written by name.

---

# Part 1: What it is and how it is built

## What the site is

A public website for the HalilintarSMP community, built like a small wiki and dressed in the 2004 Winamp look.

Pages:

| Page | What it is |
|---|---|
| Home | The main page: hero box and a grid of boxes |
| Members | A list of members. Each member has their own page: a default one made from data, or a custom one the member builds as their own folder. |
| Fandoms | A list of fandoms. Each fandom is a category page that lists its members. |
| Gallery | Pictures with a title, a short description and a credit |
| About | Short info about the SMP |
| Credits | Linked from the footer |

## Who can change files

Three people have access to the GitHub project: Almira, Alvira and Kate. Alvira and Kate are trusted people, not SMP admins. They have not been asked yet.

- They edit files on GitHub. Vercel puts the change live by itself.
- Any of the three can put a custom page live. If none of them can, Almira does it.
- Anyone who does not want to use GitHub can send the files to Almira, who adds them.

## Tech stack (decided)

- **The main site uses Astro.** It has reusable components (like the Box), shared layouts and pages made from data.
- **Custom member pages use plain HTML, CSS and JS.** Each one is its own folder. A member only needs to know those three things, and does not need to know Astro.
- **Hosting is Vercel**, connected to the GitHub project.
- **There is no external database.** All the content lives in files in the project: member data files, the gallery list and the pictures.

A change to the site is a code change:

1. Edit or add a file.
2. Push it to GitHub.
3. Vercel rebuilds the site by itself, in about a minute.

### Folder layout

```
src/
  layouts/Base.astro        header, tab bar, footer
  components/Box.astro      the box (Part 2 section 5)
  pages/                    home, members, fandoms, gallery, about, credits
  pages/members/[slug].astro  the default member page, made from data
  content/members/          one data file per member
public/
  style.css                 the shared colors and box look
  members/member-name/      a custom page: index.html, style.css, script.js
templates/custom-member/    a starter folder to copy for a custom page
```

### How the custom pages work

- Everything inside `public/` is served exactly as it is. Astro does not touch it. So `public/members/member-name/index.html` is shown at `/members/member-name/`.
- A member with a custom page has a flag in their data file (for example `custom: true`). The default page maker skips them, so the two never clash. The Members list links to `/members/member-name/` in both cases, so the address looks the same.
- The shared look lives in one file, `public/style.css`. The Astro layout uses it, and a custom page can link to it too if the member wants the box look. A member can also ignore it and write only their own `style.css`.
- The starter folder in `templates/custom-member/` has a ready `index.html`, an empty `style.css`, an empty `script.js` and a link back to `/members/`. It sits outside `public/` so it is not shown on the site.

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
| Content background | `#d4cfc2` | The warm gray area that holds the boxes |
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

1. **Header band.** Logo on the left, a drawn figure on the right, a small black box in the top right corner. The page is about 760 px wide, centered, with the olive color on both sides.
2. **Yellow tab bar.** The main links. The active tab is maroon with white text and joins the bar below it.
3. **Maroon second bar.** Small yellow links on the left, a search box on the right.
4. **Hero box.** A big title picture, a short list of facts with round bullets, and one big button. The big button is black with white and orange text.
5. **Boxes in a grid.** Two boxes on one row (one wide, one narrow), then three boxes on the next row.
6. **Footer.** Maroon bar with yellow links split by dots, and a white copyright line under it.

Ink splatters sit near the right end of the tab bar, above the footer, and at the left of the footer. A strip of diagonal stripes sits at the bottom left of the footer.

### Decided for our home page

- **Top tabs:** Home, Members, Fandoms, Gallery, About. Credits goes in the footer.
- **Corner box (the small black one):** the Discord and WhatsApp links.
- **Maroon second bar, left links:** Join, Rules, Server address, News. They point nowhere yet, until their pages or sections exist.
- **Search box (right side of the second bar):** a stub for now. It is shown but does nothing. Almira's plan for later: while typing, a list drops down with fuzzy matches (spelling does not have to be exact), each with its kind (fandom or member) on the right. Under those matches, always visible, are three lines: Search the typed words in Fandoms, in Members, or in Posts. Picking one opens that page with the search applied. Still open: what "posts" are.
- **Header figure:** a plain empty box with a label until the real one is drawn.
- **Big hero button:** two lines, like the original. Top line in white: "Join the SMP". Bottom line in orange: "Ask an admin". The bottom line is a first try and can change.
- **Hero facts list:** placeholders for now. Use four short lines with round bullets. The first one is bold and red-orange like in the screenshot, the others are bold black. Write real facts later.
- **Boxes in the grid:**
  - Row one: Gallery highlights (wide) and Featured member (narrow).
  - Row two: Fandoms, Members list and News (three equal boxes).
  - Each box has the same build (section 5), and a "More" link in the title bar.

## 5. The box (the main building block)

Every box looks like this:

- A maroon title bar with the title in white bold on the left.
- A small yellow link on the right of the bar, with an orange arrow before it ("More members").
- A light box body under the bar.
- Rows inside the body. Each row has a small square picture on the left, a bold title, and a smaller line under it ("by" and a name).
- A thin dotted line between rows.
- Corners are square. No shadows. No gradients.

Build every box the same way, so a new box is a copy of an old one with new words. This is the thing to protect.

## 6. Type

- The text in the screenshot looks like Verdana or Arial. Use `Verdana, Tahoma, Arial, sans-serif`. These are already on most computers, so nothing has to be downloaded.
- Titles in boxes are bold. Headlines are bold and red-orange. Small links are link red. Body text is black.
- The original text is tiny, about 11 to 12 px. That is part of the charm, but it is hard to read on a phone. We use at least 14 px for normal text, and 16 px on phones.
- The big title in the hero and the logo are pictures, not text.

## 7. The wiki parts

We do not run real wiki software. We only copy how a wiki is organized, so the site is easy to browse and easy to write.

- **Home page = main page.** Boxes such as a featured member, recent additions, fandoms and news.
- **Member page = an article.** A title, a one-line intro, an infobox on the right (picture, handle, fandoms, joined date), a contents box if the page is long, sections with headings, and a "Categories" line at the bottom that links to fandoms.
- **Fandom page = a category page.** A short list of the members in that fandom.
- **Gallery = a list with captions.** Each picture has a title, a short description, and a credit to the artist or who is in it.
- **Recent additions.** A short list on the home page of the newest things, newest first.
- **"Last edited" line.** A small gray line at the bottom of pages, like a wiki.

The infobox and the contents box use the same colors as the other boxes: maroon title bar, light body.

## 8. Phones

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
| Hero title picture | The big title at the top of the home page. |
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
- The drawn logo, header figure, hero title picture, splatters and stripe strip.
- The final words for the orange line on the hero button.
- Whether members with their own custom page may break these style rules. Not decided yet.

## 12. Reference sites

These were shared as inspiration for the wiki side. They are for ideas only. We do not copy their pictures or text.

| Site | Suggested by | Notes |
|---|---|---|
| tolololpedia.org, the Prabowo_Subianto page | Nabil (they suggested it as the joke) | A parody wiki, the Indonesian counterpart of Uncyclopedia. It copies Wikipedia's layout for silly, made-up articles. This page is a joke biography with a Wikipedia-style infobox and sections. Our tool could not open it, so this comes from another AI's description. Nothing on it is a reliable source of facts. |
| tfwiki.net, the Your_mom page | Alvira (they are not sure about it) | Could not be opened, so it is not summarized here. Open it by hand to check. |
| knockoutfangirl.nekoweb.org | Alvira (their site) | Read in full. See below. |

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
