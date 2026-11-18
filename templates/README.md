# Making your own member page

A custom page is a small folder with plain HTML, CSS and JS. You do not need to know Astro.

## How to make one

1. Copy the folder `templates/custom-member/`.
2. Put the copy in `public/members/` and rename it to your file name. If your data file is `src/content/members/mina.json`, the folder is `public/members/mina/`.
3. In your data file (`src/content/members/mina.json`) add `"custom": true`. This tells the site not to make the default page for you.
4. Edit `index.html`, `style.css` and `script.js` in your folder.
5. Your page is then at `/members/mina/`. The Members list links to the same address, so nothing else changes.

If you do not want to use GitHub, send your folder to Almira. They add it for you.

## Rules

- Only change files inside your own folder.
- One of the three people with access to the project looks at your page before it goes live, because your script runs on the site.
- Keep pictures small: about 1200 px wide at most and under 300 KB each.
- Keep the link back to `/members/`.

## The site look

To get the box look, link the shared style in your `<head>`:

```html
<link rel="stylesheet" href="/style.css">
```

You can also ignore it and write only your own `style.css`. Whether a custom page must follow the site's style rules is not decided yet.
