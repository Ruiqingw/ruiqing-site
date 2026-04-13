# ruiqing.wang

Personal website — photography, essays, tech blog, notes, and guestbook.

Built with Astro, typeset in Cormorant Garamond & JetBrains Mono, hosted on Vercel.

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

- **Framework:** Astro 5 (static output)
- **Hosting:** Vercel
- **Markdown:** remark-math + rehype-katex (LaTeX), remark-obsidian-callout (callout blocks)
- **Transitions:** Astro View Transitions (SPA-style page navigation)
- **Fonts:** Cormorant Garamond (body/headings), JetBrains Mono (code)

## Pages

| Route | Description |
|---|---|
| `/` | Photography homepage — featured photos from all collections |
| `/photography/:id` | Individual photo collection |
| `/blog` | Tech blog — notes on LLMs, RL, agents |
| `/blog/:id` | Blog post (max-width 860px) |
| `/essays` | Essays, film/book reviews, poems, thoughts |
| `/essays/:id` | Essay post (max-width 720px) |
| `/notes` | Short notes |
| `/guestbook` | Guestbook |
| `/about` | About page |

## Content Structure

```
src/content/
├── photography/    # Photo collections (Markdown frontmatter)
├── blog/           # Tech blog posts (Markdown)
└── essays/         # Essays, reviews, thoughts (Markdown)

public/
├── photos/         # Photography images (organized by city/project)
├── blog-images/    # Images used in blog posts
└── favicon.svg
```

### Add a photography collection

Create `src/content/photography/my-city.md`:

```yaml
---
title: "City Name"
date: "2026-03"
cover: "/photos/city/cover.jpg"
images:
  - src: "/photos/city/01.jpg"
    featured: true
  - src: "/photos/city/02.jpg"
    featured: false
description: "Short description"
order: 1
---
```

Photos with `featured: true` appear on the homepage.

### Add a blog post

Create `src/content/blog/my-post.md`:

```yaml
---
title: "Post Title"
date: 2026-03-11
tags:
  - LLM
  - Agent
description: "Brief description"
---

Content here. Supports LaTeX ($inline$ and $$block$$) and Obsidian callouts (>[!question]).
```

### Add an essay

Create `src/content/essays/my-essay.md`:

```yaml
---
title: "Essay Title"
date: 2026-03-11
category: "film-review"  # essay | film-review | book-review | thought | poem
description: "Brief description"
---
```

## Migrating from Obsidian

Blog posts are often written in Obsidian first. Key conversions needed:

- `![[image.png]]` → `![alt](/blog-images/image.png)` (copy image to `public/blog-images/`)
- `# Heading` → `## Heading` (h1 is reserved for the page title)
- `**$formula$**` → split bold and math into separate tokens
- Block `$$` formulas need blank lines above and below
- Obsidian callouts (`>[!question]`) are supported via `remark-obsidian-callout`

## Deploy

Push to `main` — Vercel auto-deploys on every push.
