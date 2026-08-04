# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers and technical evaluators who build on Microsoft Foundry, need a ready local toolchain, or want to understand what changed between Foundry Toolkit releases.

## Product Purpose

The site introduces Foundry DevPack as the fastest way to install the developer tools used across Microsoft Foundry, then preserves the repository's release history as a readable, searchable archive. Success means a developer can understand the platform, install the toolchain in one command, and still find and scan any Foundry Toolkit release.

## Positioning

The DevPack landing page and generated changelog share one static site. The release archive is generated directly from the extension's canonical `WHATS_NEW.md`, so public release notes stay aligned with repository-authored content.

## Operating Context

Developers arrive from Foundry documentation, the Foundry Toolkit repository, Visual Studio Marketplace, or a shared release link. They learn how the editor, terminal, canvas, and coding-agent surfaces fit together, copy the correct installer command for their operating system, browse releases, follow deep links, switch themes, and continue to first-party documentation when needed.

## Capabilities and Constraints

- `WHATS_NEW.md` remains the single source of release content.
- The DevPack page remains available at `/`, and the changelog remains available at `/changelog/`.
- The static site is assembled by `site/build.mjs` and published through GitHub Pages.
- Release filtering, keyboard search focus, scroll-spy navigation, deep links, responsive layouts, and light/dark themes must remain available.
- Windows and macOS/Linux installation commands must be exact, copyable, and usable without JavaScript.
- Generated output in `site/dist` is not edited directly.

## Brand Commitments

Use the Microsoft Foundry, Foundry DevPack, and Foundry Toolkit for VS Code names and link to first-party Microsoft, GitHub, and Visual Studio Marketplace destinations. The landing page draws from Microsoft Foundry's typography and purple action language without reproducing its branded hero composition, while the changelog independently retains the familiar structure and visual language of the Visual Studio Code release-notes site.

## Evidence on Hand

- Release content: `WHATS_NEW.md`
- Landing page source: `site/landing.html`
- Existing generator and interactions: `site/build.mjs`, `site/assets/app.js`
- Existing static-site deployment documentation: `site/README.md`
- Visual reference confirmed by the user: `https://code.visualstudio.com/updates/v1_131`
- DevPack visual and product references supplied by the user in the landing-page brief.

## Product Principles

- Release content stays authoritative and unembellished.
- The installer command is the landing page's primary action and is never obscured by decoration.
- The platform and bundled tools are explained through the real developer workflow.
- Reading and version wayfinding take priority over decorative UI.
- Familiar VS Code release-note conventions reduce orientation cost.
- Every interaction remains usable with keyboard, touch, and narrow screens.

## Accessibility & Inclusion

Preserve semantic navigation, headings, skip links, visible keyboard focus, reduced-motion support, and readable contrast in both themes.
