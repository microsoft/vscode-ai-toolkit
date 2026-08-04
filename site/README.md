# Changelog site

A static changelog page generated from [`WHATS_NEW.md`](../WHATS_NEW.md) and published to
GitHub Pages by [`publish-changelog.yml`](../.github/workflows/publish-changelog.yml).

`WHATS_NEW.md` stays the single source of truth — edit releases there, never in this folder.

## Local development

```bash
cd site
npm install
npm run build      # writes site/dist
npx http-server dist -p 8099 -c-1
```

`site/dist` and `site/node_modules` are git-ignored; the site is built in CI on every push.

## How it works

- `build.mjs` splits `WHATS_NEW.md` on each `## Version <version> - <date>` heading, renders
  each release body with [marked](https://marked.js.org/), and emits a single `index.html`
  with a version sidebar.
- `assets/styles.css` and `assets/app.js` are copied verbatim into `dist`. The script adds
  filtering (press `/` to focus), scroll-spy nav highlighting, and a light/dark toggle.
- `###` headings inside a release become linkable document sections and populate the latest
  release's **In this update** outline.
- A `.nojekyll` marker is emitted so Pages serves the output as-is.

## One-time repository setup

In **Settings → Pages**, set **Source** to **GitHub Actions**. The workflow then deploys on
every push to `main` that touches `WHATS_NEW.md` or `site/`, and via **Run workflow**.
