---
name: write-blog-post
description: Write a complete, SEO-optimised blog post for testfeed.ai from a topic or brief, then automatically save it as a draft and open a PR for review. One command covers write + draft + PR. Follows the Structural, UX, and Technical Optimization Blueprint for Astro-Based Content Architectures.
model: claude-sonnet-4-6
---

# Write Blog Post Skill

Write a new SEO-optimised blog post for testfeed.ai, then save it as a draft and open a PR — all in one command.

**Entry Point A** — you have the idea, Claude writes it:
```
/write-blog-post  →  [auto: draft + PR]  →  /publish-blog-post
```

For posts already written and dropped in Drive, use Entry Point B:
```
/coworker  →  [review PRs]  →  /publish-blog-post
```

---

## Blueprint Standards

Every post must comply with the **Structural, UX, and Technical Optimization Blueprint for Astro-Based Content Architectures**. The key rules:

| Element | Rule |
|---|---|
| Key Takeaways box | **Required** — 1–3 direct, citable sentences; positioned above the fold; optimised for AI crawlers (540-word semantic grounding threshold) |
| Author bio | **Required** — full name, headshot, role, credentials, LinkedIn link, internal author page |
| Social share | SVG-only, no external scripts (zero-JS, GDPR/CCPA compliant) — handled by layout |
| Pull-quotes | Use `>` markdown blockquote only — semantic `<blockquote>` HTML, never dynamic injection |
| Inline CTA bands | **Explicitly banned** — primary source of CLS and reader drop-off; never place mid-article |
| Pre-footer newsletter | Handled by layout — do not replicate in body |
| Related posts | **Strongly recommended** — distributes PageRank; keeps deep pages within 2–3 click threshold |
| TOC | Generated from H2/H3 headings — minimum ~1,000 words to justify; no H4+ in structure |
| Post-article CTA | **Required** via `finalCtaSection` frontmatter — placed after article body, before newsletter |
| Schema | `BlogPosting` JSON-LD with `datePublished` AND `dateModified`, author as `Person` |

---

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Gather the Brief

Minimum required: **topic or target keyword**. Ask for anything not provided:

- **Topic / target keyword** (required)
- **Angle or hook** (optional) — what makes this post different from what's already ranking?
- **Target audience** (optional) — defaults to "operators, marketers, and insights professionals"
- **Author** (optional) — defaults to `"TestFeed"`; use `"Millie Marconi"` if specified
- **Related internal posts to link** (optional) — check `/src/content/blog/` for existing slugs

Do not ask for information already given.

### 2. Research the Topic

- Find the top 5 ranking pages for the target keyword
- Identify the angles, headings, and questions they cover
- Find 2–3 authoritative external sources worth citing
- Check existing TestFeed posts to avoid duplication:
```bash
ls /home/user/testfeed-website/src/content/blog/
```

### 3. Write the Post

#### Frontmatter

All fields below are required unless marked optional:

```yaml
---
title: "[Article Title] | TestFeed"
description: "[150–160 character meta description — must include primary keyword]"
articleTitle: "[Full H1 title displayed on the page]"
author: "[Author name]"
publishDate: [today's date YYYY-MM-DD]
updatedDate: [today's date YYYY-MM-DD]
minutesRead: [estimated reading time as integer]
tags: ["[primary tag]", "[secondary tag]", "[tertiary tag]"]
excerpt: "[2–3 sentence summary for preview cards and social sharing]"
relatedPosts: ["[slug-1]", "[slug-2]"]  # strongly recommended — link to relevant existing posts
keyTakeaways:
  - "[Direct, citable sentence 1 — specific, standalone, optimised for AI overviews]"
  - "[Direct, citable sentence 2]"
  - "[Direct, citable sentence 3]"
authorBio:  # required — use Millie Marconi's details unless another author is specified
  role: "CEO & Co-Founder, TestFeed"
  credentials: "Market research practitioner and founder of TestFeed, an AI-native synthetic audience research platform."
  linkedinUrl: "https://www.linkedin.com/in/millie-marconi/"
  headshotUrl: "/assets/authors/millie-marconi.jpg"
  authorPageUrl: "/authors/millie-marconi/"
faq:  # required — minimum 4 questions matching natural search queries
  - question: "[Question phrased as a user would type it into Google]"
    answer: "[Concise, direct answer — 2–4 sentences]"
schemaMarkup:
  type: "BlogPosting"
  properties:
    datePublished: "[YYYY-MM-DD]"
    dateModified: "[YYYY-MM-DD]"
    image: "https://testfeed.ai/assets/blog/[slug]/cover.webp"
    mainEntityOfPage: "https://testfeed.ai/blog/[slug]/"
finalCtaSection:
  title: "[Compelling CTA headline relevant to the post topic — can include <span class='highlight'>word</span> for emphasis]"
  text: "[1–2 sentence supporting copy — connects the article's topic to TestFeed's value]"
---
```

#### Body rules — non-negotiable

**Structure:**
- **No H1 in body** — `articleTitle` renders it
- Opening paragraph hooks the reader immediately — no heading above it
- H2 and H3 headings only — no H4+ (TOC only maps H2/H3)
- Minimum 1,000 words — required for TOC to be meaningful
- H2 "Frequently asked questions" section at the end — matches `faq` frontmatter
- No closing heading — end with a brief paragraph that leads naturally into the CTA

**Banned elements:**
- ❌ No inline CTA bands, popups, or conversion boxes mid-article — primary source of CLS and reader drop-off per blueprint
- ❌ No `<script>` or dynamic injection — the Astro build is zero-JS by default
- ❌ No H4, H5, H6 headings — they do not appear in the TOC and fragment the structure

**Required elements:**
- ✅ At least one comparison table where the topic warrants it
- ✅ Pull-quotes using `>` blockquote markdown — renders as semantic `<blockquote>`, parseable by crawlers
- ✅ At least 2 internal links to existing TestFeed posts (check `/src/content/blog/` for slugs)
- ✅ 2–3 external authority citations with inline links (not footnotes)
- ✅ Primary keyword in: first 100 words, at least two H2s, and naturally throughout

**Brand voice:**
- Direct, practical — no spin, no filler, no throat-clearing
- British English spelling
- Short paragraphs — 3–4 lines max
- Bold the key phrase in each major section
- Cite sources with inline anchor links

**SEO requirements:**
- `keyTakeaways`: 1–3 standalone sentences a crawler can lift verbatim as a featured snippet
- `faq` questions: match natural search queries (how, what, why, can I…)
- `description`: 150–160 characters, includes primary keyword
- `title`: ends with `| TestFeed`

### 4. Save as Draft and Open PR

Once written, immediately run the full draft workflow without stopping:

1. Derive slug from `articleTitle`: lowercase, hyphens, no punctuation
2. Set `draft: true` in frontmatter
3. Write to `/home/user/testfeed-website/src/content/blog/[slug].md`
4. Commit and push:
```bash
git checkout -b blog/draft-[slug]
git add src/content/blog/[slug].md
git commit -m "draft: [slug]"
git push -u origin blog/draft-[slug]
```
5. Open GitHub PR: title `[DRAFT] [articleTitle]`, head `blog/draft-[slug]`, base `main`

### 5. Confirm

- **Slug:** `[slug]`
- **Status:** Draft — not live
- **PR:** [link]
- **Next step:** Review the PR preview, then run `/publish-blog-post [slug]`

---

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Content schema**: `/home/user/testfeed-website/src/content/config.ts`
- **GitHub repo**: `yesterday-work/testfeed-website`
- **Live site**: `https://testfeed.ai`
