# Design

<!-- impeccable:design-schema 1 -->

## Direction

The changelog is a release document in the Visual Studio Code ecosystem: restrained, dense, and built for scanning rather than promotion. It borrows the information architecture and interaction grammar of VS Code release notes while keeping Foundry Toolkit's own name, content, and destinations.

## Color

- Use neutral white (`#ffffff`) and near-black (`#0d1014`) page fields.
- Use VS Code blue (`#0078d4`) for the primary action, active navigation, and product mark.
- Use accessible theme-specific link colors (`#005fb8` light, `#4daafc` dark).
- Prefer subtle alpha borders and flat neutral surfaces over shadows.
- Reserve the pale blue field for the current-release announcement.

## Typography

- Use the platform system UI stack throughout.
- Release titles are light-weight, tightly tracked, and 30–40px depending on viewport.
- Section headings are plain document headings, not chips or cards.
- Body copy stays at 16px with a 72ch maximum measure and 1.6 line height.
- Monospace is reserved for code, keyboard hints, and preformatted content.

## Layout

- The desktop page uses a 1170px shell with a 180px version rail, a 760px article, and a 180px latest-release outline.
- Keep the product navigation sticky and compact; the release announcement sits directly below it.
- Version and section rails remain sticky while the article scrolls.
- Releases form one continuous document separated by horizontal rules, never a card stack.
- Below 1050px, remove the right outline. Below 760px, replace the left rail with a native release selector.

## Components

- **Product bar:** Foundry Toolkit wordmark, active Changelog link, GitHub link, release search, theme switch, and Marketplace action.
- **Announcement:** a single factual link to the latest generated version.
- **Version navigation:** year-grouped text links with a blue active rule.
- **Release article:** version title, latest label, release date, summary, and semantic Markdown content.
- **Latest outline:** direct links to the newest release's generated `###` sections.
- **Footer:** source-of-truth and copyright details separated from the document by one hairline.

## Interaction

- `/` focuses release search.
- Search filters release articles, version links, and mobile selector options together.
- Scroll position updates both desktop and mobile version navigation.
- Deep links target releases and generated section anchors.
- Theme choice persists locally and respects the system preference initially.
- Reduced-motion preferences disable smooth scrolling and anchor fades.

## Accessibility

Use semantic landmarks, one page-level heading, ordered heading depth, a skip link, visible focus, native mobile selection, readable theme contrast, and explicit control labels. Do not communicate active state by color alone; the version rail also uses weight and a rule.
