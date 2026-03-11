# ruiqing.wang

Personal website — photography, essays, and tech blog.

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import in Vercel (https://vercel.com/new)
3. Framework: Astro (auto-detected)
4. Add custom domain: ruiqing.wang

## Content Structure

```
src/content/
├── photography/    # Photography projects (Markdown)
├── blog/           # Tech blog posts (Markdown/MDX)
└── essays/         # Essays, reviews, thoughts (Markdown/MDX)
```

### Add a photography project

Create `src/content/photography/my-project.md`:

```yaml
---
title: "Project Title"
date: "2026-03"
cover: "/images/cover.jpg"
images:
  - "/images/photo1.jpg"
  - "/images/photo2.jpg"
description: "Short description"
order: 1
---

Optional body text about this project.
```

### Add a blog post

Create `src/content/blog/my-post.md`:

```yaml
---
title: "Post Title"
date: "2026-03-11"
tags: ["LLM", "Agent"]
description: "Brief description"
draft: false
---

Your content here...
```

### Add an essay/review

Create `src/content/essays/my-essay.md`:

```yaml
---
title: "Essay Title"
date: "2026-03-11"
category: "film-review"  # essay | film-review | book-review | thought
description: "Brief description"
---

Your content here...
```

## Images

Place images in `public/images/` and reference as `/images/filename.jpg`.
