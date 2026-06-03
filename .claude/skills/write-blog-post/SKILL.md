---
name: write-blog-post
description: Write a complete, SEO-optimised blog post for testfeed.ai from a topic or brief, then automatically save it as a draft and open a PR for review. One command covers write + draft + PR.
model: claude-sonnet-4-6
---

# Write Blog Post Skill

Write a new SEO-optimised blog post for testfeed.ai, then save it as a draft and open a PR — all in one command.

This is **Entry Point A** of the publishing pipeline (you have the idea, Claude writes it):
```
/write-blog-post  →  [auto: draft + PR]  →  /publish-blog-post
```

For posts you've already written, use Entry Point B:
```
/coworker  →  /publish-blog-post
```

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Gather the Brief

You need at minimum a **topic or target keyword**. Ask for anything not provided:

- **Topic / target keyword** (required) — e.g. "best concept testing platforms"
- **Angle or hook** (optional) — what makes this post different from what's already ranking?
- **Target audience** (optional) — defaults to "operators, marketers, and insights professionals"
- **Author** (optional) — defaults to "TestFeed"
- **Related internal posts to link** (optional) — slugs from `/src/content/blog/`

Do not ask for information already given.

### 2. Research the Topic

Use web search to:
- Find the top 5 ranking pages for the target keyword
- Identify what angles, headings, and questions they cover
- Find 2–3 authoritative external sources worth citing
- Check existing TestFeed posts to avoid duplication: `ls /home/user/testfeed-website/src/content/blog/`

### 3. Write the Post

Write a complete, publish-ready Markdown file:

**Required frontmatter:**
```yaml
---
title: "[Article Title] | TestFeed"
description: "[150–160 character meta description with primary keyword]"
articleTitle: "[Full H1 title]"
author: "[Author name]"
publishDate: [today's date YYYY-MM-DD]
minutesRead: [estimated reading time]
tags: ["[primary tag]", "[secondary tag]"]
excerpt: "[2–3 sentence summary for preview cards]"
keyTakeaways:
  - "[Citable sentence 1 — concrete and specific]"
  - "[Citable sentence 2]"
  - "[Citable sentence 3]"
faq:
  - question: "[Question matching a natural search query]"
    answer: "[Answer]"
schemaMarkup:
  type: "BlogPosting"
  properties:
    datePublished: "[YYYY-MM-DD]"
    dateModified: "[YYYY-MM-DD]"
---
```

**Optional frontmatter (include only if applicable):**
```yaml
relatedPosts: ["[slug-1]", "[slug-2]"]
authorBio:
  role: "CEO & Co-Founder, TestFeed"
  credentials: "Market research practitioner and founder of TestFeed, an AI-native synthetic audience research platform."
  linkedinUrl: "https://www.linkedin.com/in/millie-marconi/"
  headshotUrl: "/assets/authors/millie-marconi.jpg"
  authorPageUrl: "/authors/millie-marconi/"
```

**Body rules:**
- No H1 in the body — `articleTitle` renders it
- Opening paragraph hooks the reader (no heading above it)
- H2 sections covering main angles; keyword variants used naturally
- At least one comparison table where appropriate
- H2 "Frequently asked questions" section at the end
- Closing paragraph with soft CTA to TestFeed — no hard sell

**Brand voice:**
- Direct, practical — no spin, no filler
- British English spelling
- Short paragraphs (3–4 lines max)
- Bold the key phrase in each major section
- Cite sources with inline links, not footnotes

**SEO requirements:**
- Primary keyword in: title, description, articleTitle, first 100 words, at least two H2s
- `keyTakeaways` are citable standalone sentences (optimised for AI overviews)
- `faq` questions match natural search queries
- At least 2 internal links to existing TestFeed posts

### 4. Save as Draft and Open PR

Once written, immediately run the full add-blog-post workflow without stopping:

1. Derive slug from `articleTitle`
2. Set `draft: true` in frontmatter
3. Write to `/home/user/testfeed-website/src/content/blog/[slug].md`
4. Run:
```bash
git checkout -b blog/draft-[slug]
git add src/content/blog/[slug].md
git commit -m "draft: [slug]"
git push -u origin blog/draft-[slug]
```
5. Open a GitHub PR titled `[DRAFT] [articleTitle]` with base `main`

### 5. Confirm

Report back:
- **Slug:** `[slug]`
- **Status:** Draft — not live
- **PR:** [link]
- **Next step:** Review the PR preview, then run `/publish-blog-post [slug]`

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Content schema**: `/home/user/testfeed-website/src/content/config.ts`
- **GitHub repo**: `yesterday-work/testfeed-website`
- **Live site**: `https://testfeed.ai`
