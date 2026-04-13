# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:4321)
npm run build    # Production build
npm run preview  # Preview production build locally
```

No test suite or linter configured.

## Architecture

Astro 5 static site deployed on Vercel. SPA-style navigation via `<ClientRouter />` (Astro View Transitions).

### Layouts

- **BaseLayout.astro** — Shell for all pages: `<head>`, nav, footer, Google Fonts, KaTeX CSS, page view tracking script. Nav uses `startsWith()` for active state detection.
- **PostLayout.astro** — Shared layout for blog and essay detail pages. Accepts optional `maxWidth` prop (blog defaults to 860px, essays pass 720px). Contains all prose styles: headings, blockquotes, callouts, tables, KaTeX display blocks.

### Content Collections (`src/content.config.ts`)

Three collections using Astro's glob loader:
- **photography** — Each `.md` defines a collection with `images` array and `featured` array (featured photos appear on homepage)
- **blog** — Tech posts with `tags`, supports LaTeX and Obsidian callouts
- **essays** — Literary writing with `category` enum: essay, film-review, book-review, thought, poem

### Static Assets

- `public/photos/` — Photography images organized by city/project subdirectories
- `public/blog-images/` — Images referenced in blog posts

### Key Patterns

**View Transitions compatibility:** All client-side scripts must use `document.addEventListener('astro:page-load', ...)` instead of bare `<script>` or DOMContentLoaded, because scripts don't re-execute on SPA navigation. Pages with client JS: index (photography), essays index (filter), guestbook.

**Markdown pipeline:** `remark-math` + `rehype-katex` for LaTeX, `remark-obsidian-callout` for `>[!question]`-style callouts. Code highlighting via Shiki (github-light theme).

## Obsidian Migration

Blog posts are often drafted in Obsidian. Required conversions:
- `![[image.png]]` → `![alt](/blog-images/image.png)` (copy file to `public/blog-images/`)
- `# Heading` → `## Heading` (h1 reserved for page title in PostLayout)
- `**$formula$**` → separate bold and math tokens (remark can't parse mixed)
- Block `$$` formulas need blank lines above and below
- Obsidian callouts (`>[!question]`) work natively via remark-obsidian-callout
