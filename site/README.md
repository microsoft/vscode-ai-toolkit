# Foundry DevPack site

A static Foundry DevPack landing page and changelog published to GitHub Pages by
[`publish-changelog.yml`](../.github/workflows/publish-changelog.yml).

The DevPack landing page is authored in [`landing.html`](landing.html). `WHATS_NEW.md` stays the
single source of release truth — edit releases there, never in this folder.

## Local development

```bash
cd site
npm install
npm run build      # writes site/dist
npx http-server dist -p 8099 -c-1
```

`site/dist` and `site/node_modules` are git-ignored; the site is built in CI on every push.

## How it works

- `build.mjs` copies the DevPack landing page to `/` and emits the generated release archive at
  `/changelog/`.
- `build.mjs` splits `WHATS_NEW.md` on each `## Version <version> - <date>` heading and renders
  each release body with [marked](https://marked.js.org/).
- `assets/landing.css` and `assets/landing.js` provide the landing page layout, OS-aware installer,
  command copy behavior, and theme control.
- `assets/styles.css` and `assets/app.js` provide changelog filtering (press `/` to focus),
  scroll-spy navigation, and theme control.
- `###` headings inside a release become linkable document sections and populate the latest
  release's **In this update** outline.
- A `.nojekyll` marker is emitted so Pages serves the output as-is.

## One-time repository setup

In **Settings → Pages**, set **Source** to **GitHub Actions**. The workflow then deploys on
every push to `main` that touches `WHATS_NEW.md` or `site/`, and via **Run workflow**.
