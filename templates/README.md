# Making your own member page

A custom page is a small folder with plain HTML, CSS and JS. You do not need to know Astro, and you do not need a database.

## Before you start: what "custom" means

You get a member page automatically when an admin adds you (through the member form, or in the dashboard). That default page is made from your member entry: your name, handle, intro, sections and picture.

A **custom page replaces that default page**. Once your entry is marked as custom, the site stops making the default page and shows your folder instead, at the same address (`/members/<slug>/`).

This also means your custom page is **detached from your member entry**:

- Your page does not read anything from your entry. If your name, intro or sections change there, your page does not change. If you change your page, your entry does not change. You keep your own text up to date yourself.
- Your entry is still used by the rest of the site: the Members list (name, handle, picture), the search, your fandoms, the home page "Featured member" box and the Credits. Ask an admin to keep those details right.
- A custom page has **no "Edit this page" link and no edit page**. Nobody can send a change request for it. To change it, change your folder.
- If an admin turns "custom" off again, the default page comes back and your folder is no longer used (it stays in GitHub until someone removes it).

## How to make one

1. Make sure you already have a member entry (use the member form at `/member-form/`, and wait until an admin approves it and the site is published). Your **slug** is the last part of your page address, for example `kate-m` in `/members/kate-m/`. An admin can tell you what it is (it is shown as "Address piece (slug)" in the dashboard).
2. Copy the folder `templates/custom-member/`.
3. Put the copy in `public/members/` and rename it to your slug. For the slug `kate-m`, the folder is `public/members/kate-m/`.
4. Edit `index.html`, `style.css` and `script.js` in your folder.
5. Put the folder live first. Then ask an admin to tick **Custom page** on your member entry in the dashboard and press Publish. If the box is ticked before the folder is live, your link in the Members list leads to nothing.
6. Your page is then at `/members/<slug>/`. The Members list links to the same address, so nothing else changes.

If you do not want to use GitHub, send your folder to Almira. They add it for you. Any of the three people with access to the project can put it live.

## Pictures

- A picture you use inside your page goes in your own folder. Keep it small: about 1200 px wide at most and under 300 KB.
- The small square picture in the Members list belongs to your member entry, not to your page. Send it to Almira. An admin uploads it for you.

## Rules

- Only change files inside your own folder.
- One of the three people with access to the project looks at your page before it goes live, because your script runs on the site.
- Do not put keys, passwords or private links in your files. Everything in your folder is public.
- Keep the link back to `/members/`.

## The site look

To get the box look, link the shared style in your `<head>`:

```html
<link rel="stylesheet" href="/style.css">
```

You can also ignore it and write only your own `style.css`. Whether a custom page must follow the site's style rules is not decided yet.
