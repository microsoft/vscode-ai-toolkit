// Builds the static changelog site published to GitHub Pages.
// Source of truth is WHATS_NEW.md at the repository root; this script only
// transforms it, so the markdown file stays the single place releases are edited.

import { mkdir, readFile, readdir, writeFile, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const siteDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(siteDir, '..');
const sourceFile = join(repoRoot, 'WHATS_NEW.md');
const outDir = join(siteDir, 'dist');

const REPO_URL = 'https://github.com/microsoft/foundry-toolkit';
const MARKETPLACE_URL =
  'https://marketplace.visualstudio.com/items?itemName=ms-windows-ai-studio.windows-ai-studio';
const SITE_TITLE = 'Foundry Toolkit for VS Code';
const SITE_DESCRIPTION = 'Release notes and changelog for the Foundry Toolkit for VS Code extension.';

marked.setOptions({ gfm: true, breaks: false });

/** Escapes a string for interpolation into HTML text or a quoted attribute. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Splits WHATS_NEW.md into an intro block plus one entry per `## Version ...`
 * heading, keeping each release body as raw markdown for later rendering.
 */
function parseChangelog(markdown) {
  const lines = markdown.split(/\r?\n/);
  const releases = [];
  let intro = [];
  let current = null;

  for (const line of lines) {
    const versionHeading = /^##\s+(.*\S)\s*$/.exec(line);
    if (versionHeading) {
      if (current) {
        releases.push(current);
      }
      current = { heading: versionHeading[1], body: [] };
      continue;
    }

    if (/^#\s+/.test(line)) {
      continue; // Page title comes from SITE_TITLE, not the markdown H1.
    }

    if (current) {
      current.body.push(line);
    } else {
      intro.push(line);
    }
  }

  if (current) {
    releases.push(current);
  }

  return {
    intro: intro.join('\n').trim(),
    releases: releases.map(toRelease),
  };
}

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

/** Parses "22 July, 2026" without relying on locale-dependent Date parsing. */
function parseReleaseDate(text) {
  const match = /^(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})$/.exec(text.trim());
  if (!match) {
    return null;
  }

  const monthIndex = MONTHS.indexOf(match[2].toLowerCase());
  if (monthIndex === -1) {
    return null;
  }

  return new Date(Date.UTC(Number(match[3]), monthIndex, Number(match[1])));
}

function toRelease({ heading, body }) {
  const versionMatch = /^Version\s+(\S+)\s*(?:[-–—]\s*(.+))?$/.exec(heading);
  const version = versionMatch ? versionMatch[1] : heading;
  const dateText = versionMatch && versionMatch[2] ? versionMatch[2].trim() : '';
  const date = dateText ? parseReleaseDate(dateText) : null;
  const markdown = body.join('\n').trim();
  const sections = Array.from(markdown.matchAll(/^###\s+(.+?)\s*$/gm), (match) => ({
    title: match[1],
    id: `v-${slugify(version)}-${slugify(match[1])}`,
  }));
  let sectionIndex = 0;
  const html = marked.parse(markdown).replace(/<h3>([\s\S]*?)<\/h3>/g, (headingHtml) => {
    const section = sections[sectionIndex];
    sectionIndex += 1;
    return section ? `<h3 id="${section.id}">${headingHtml.slice(4, -5)}</h3>` : headingHtml;
  });

  return {
    id: `v-${slugify(version)}`,
    version,
    dateText,
    date,
    year: date ? String(date.getUTCFullYear()) : '',
    markdown,
    sections,
    html,
  };
}

function renderRelease(release, isLatest) {
  const latestBadge = isLatest ? '<span class="badge">Latest</span>' : '';
  const headingTag = isLatest ? 'h1' : 'h2';
  const date = release.dateText
    ? `<p class="release__meta"><em>Release date: <time${
        release.date ? ` datetime="${release.date.toISOString().slice(0, 10)}"` : ''
      }>${escapeHtml(release.dateText)}</time></em></p>`
    : '';

  return `
        <article class="release" id="${release.id}" data-version="${escapeHtml(release.version)}">
          <header class="release__header">
            <${headingTag} class="release__title">
              <a class="release__anchor" href="#${release.id}" aria-label="Link to version ${escapeHtml(
                release.version,
              )}">#</a>
              Foundry Toolkit ${escapeHtml(release.version)}
              ${latestBadge}
            </${headingTag}>
            ${date}
          </header>
          <div class="release__body">
${release.html.trim()}
          </div>
        </article>`;
}

function renderNav(releases) {
  const groups = [];
  for (const release of releases) {
    const label = release.year || 'Earlier releases';
    const last = groups.at(-1);
    if (last && last.label === label) {
      last.releases.push(release);
    } else {
      groups.push({ label, releases: [release] });
    }
  }

  return groups
    .map(
      (group) => `
          <div class="nav__group">
            <h3 class="nav__group-title">${escapeHtml(group.label)}</h3>
            <ul class="nav__list">
${group.releases
  .map(
    (release) => `              <li class="nav__item" data-target="${release.id}">
                <a href="#${release.id}">
                  <span class="nav__version">${escapeHtml(release.version)}</span>
                  ${release.dateText ? `<span class="nav__date">${escapeHtml(release.dateText)}</span>` : ''}
                </a>
              </li>`,
  )
  .join('\n')}
            </ul>
          </div>`,
    )
    .join('\n');
}

function renderReleaseSelect(releases) {
  return releases
    .map(
      (release, index) =>
        `<option value="#${release.id}"${index === 0 ? ' selected' : ''}>${escapeHtml(
          release.version,
        )}${release.dateText ? ` · ${escapeHtml(release.dateText)}` : ''}</option>`,
    )
    .join('\n');
}

function renderOnThisPage(release) {
  if (!release || release.sections.length === 0) {
    return '';
  }

  return `
        <aside class="on-this-page" aria-label="In this update">
          <h2>In this update</h2>
          <ul>
${release.sections
  .map(
    (section) =>
      `            <li><a href="#${section.id}">${escapeHtml(section.title)}</a></li>`,
  )
  .join('\n')}
          </ul>
        </aside>`;
}

function renderPage({ intro, releases }) {
  const introHtml = intro ? marked.parse(intro) : '';
  const latest = releases[0];

  return `<!DOCTYPE html>
<!--
THESIS: Release notes should feel native to the editor ecosystem, not like a stack of product cards.
OWN-WORLD: VS Code's restrained blue, workhorse system type, hairline dividers, and document-first controls.
STORY: Pick a version, scan its date and summary, then move through Added, Changed, and Fixed details.
FIRST VIEWPORT: A compact product bar and release banner sit above sticky update navigation, a broad article, and a latest-release outline.
FORM: A faithful release-document layout, chosen directly from the user's VS Code 1.131 reference.
-->
<html lang="en" data-theme="auto">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Changelog · ${escapeHtml(SITE_TITLE)}</title>
    <meta name="description" content="${escapeHtml(SITE_DESCRIPTION)}" />
    <meta property="og:title" content="Changelog · ${escapeHtml(SITE_TITLE)}" />
    <meta property="og:description" content="${escapeHtml(SITE_DESCRIPTION)}" />
    <meta property="og:type" content="website" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230078d4'/%3E%3Cpath d='M9 21V11h4.4a3.3 3.3 0 0 1 0 6.6H12V21z' fill='white'/%3E%3C/svg%3E" />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand" href="#${latest.id}" aria-label="${escapeHtml(SITE_TITLE)} changelog">
          <span>Foundry Toolkit</span>
        </a>
        <nav class="primary-nav" aria-label="Primary navigation">
          <a class="primary-nav__link primary-nav__link--active" href="#${latest.id}">Changelog</a>
          <a class="primary-nav__link" href="${REPO_URL}">GitHub</a>
        </nav>
        <div class="site-header__actions">
          <label class="header-search" for="search">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m11.2 10.5 3 3-.7.7-3-3a5 5 0 1 1 .7-.7ZM7.3 11.6a4.3 4.3 0 1 0 0-8.6 4.3 4.3 0 0 0 0 8.6Z" />
            </svg>
            <span class="visually-hidden">Filter releases</span>
            <input
              id="search"
              type="search"
              placeholder="Search releases"
              autocomplete="off"
              spellcheck="false"
            />
            <kbd>/</kbd>
          </label>
          <button class="theme-switch" type="button" id="theme-toggle" aria-label="Toggle color theme">
            <svg class="theme-switch__sun" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 3.4A4.6 4.6 0 1 0 8 12.6 4.6 4.6 0 0 0 8 3.4Zm0 1A3.6 3.6 0 1 1 8 11.6 3.6 3.6 0 0 1 8 4.4ZM7.5 0h1v2h-1V0Zm0 14h1v2h-1v-2ZM0 7.5h2v1H0v-1Zm14 0h2v1h-2v-1ZM2 2.7l.7-.7 1.4 1.4-.7.7L2 2.7Zm9.9 9.9.7-.7 1.4 1.4-.7.7-1.4-1.4ZM2 13.3l1.4-1.4.7.7L2.7 14l-.7-.7ZM11.9 3.4 13.3 2l.7.7-1.4 1.4-.7-.7Z" />
            </svg>
            <svg class="theme-switch__moon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6.2 1.1a6.8 6.8 0 1 0 8.7 8.7A5.7 5.7 0 0 1 6.2 1.1Zm-1 1.6A6.7 6.7 0 0 0 13.3 11 5.8 5.8 0 1 1 5.2 2.7Z" />
            </svg>
          </button>
          <a class="download-button" href="${MARKETPLACE_URL}">Get the extension</a>
        </div>
      </div>
    </header>

    <div class="release-banner">
      <a href="#${latest.id}">Foundry Toolkit ${escapeHtml(latest.version)} is now available</a>
    </div>

    <div class="layout">
      <aside class="sidebar">
        <label class="release-picker" for="release-select">
          <span>Updates</span>
          <select id="release-select" aria-label="Choose a release">
${renderReleaseSelect(releases)}
          </select>
        </label>
        <nav class="release-nav" aria-label="Updates">
          <h2>Updates</h2>
          <div class="nav" id="nav">
${renderNav(releases)}
          </div>
        </nav>
        <p class="sidebar__empty" id="nav-empty" hidden>No matching releases.</p>
      </aside>

      <main class="content" id="content">
        ${introHtml ? `<section class="intro">${introHtml}</section>` : ''}
        <p class="results" id="results" hidden></p>
${releases.map((release, index) => renderRelease(release, index === 0)).join('\n')}
        <p class="content__empty" id="content-empty" hidden>
          No releases match your filter.
        </p>
      </main>
${renderOnThisPage(latest)}
    </div>

    <footer class="footer">
      <div class="footer__inner">
        <p>© Microsoft Corporation.</p>
        <p>
          Release notes are generated from
          <a href="${REPO_URL}/blob/main/WHATS_NEW.md">WHATS_NEW.md</a>.
        </p>
      </div>
    </footer>

    <script src="./app.js"></script>
  </body>
</html>
`;
}

/**
 * Clears the output directory's contents rather than the directory itself, so a
 * local preview server holding it open doesn't fail the build on Windows.
 */
async function emptyDir(dir) {
  await mkdir(dir, { recursive: true });
  const entries = await readdir(dir);
  await Promise.all(entries.map((entry) => rm(join(dir, entry), { recursive: true, force: true })));
}

async function main() {
  if (!existsSync(sourceFile)) {
    throw new Error(`Changelog source not found: ${sourceFile}`);
  }

  const markdown = await readFile(sourceFile, 'utf8');
  const parsed = parseChangelog(markdown);

  if (parsed.releases.length === 0) {
    throw new Error('No "## Version ..." sections found in WHATS_NEW.md');
  }

  await emptyDir(outDir);
  await writeFile(join(outDir, 'index.html'), renderPage(parsed), 'utf8');
  await cp(join(siteDir, 'assets'), outDir, { recursive: true });
  // Pages would otherwise run the output through Jekyll, which drops files
  // and folders that start with an underscore.
  await writeFile(join(outDir, '.nojekyll'), '', 'utf8');

  console.log(`Built ${parsed.releases.length} releases -> ${join(outDir, 'index.html')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
