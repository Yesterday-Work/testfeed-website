---
name: write-blog-post
description: Write a complete, SEO-optimised blog post for testfeed.ai from a topic or brief. Researches the topic, writes the full post with correct frontmatter, and hands off to add-blog-post to save as a draft.
model: claude-sonnet-4-6
---

# Write Blog Post Skill

Write a new SEO-optimised blog post for testfeed.ai.

This is **Step 1 of 3** in the publishing pipeline:
1. **`write-blog-post`** (this skill) — researches and writes the post
2. **`add-blog-post`** — saves it as a draft and opens a PR for review
3. **`publish-blog-post`** — merges to main and makes it live

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Gather the Brief

You need at minimum a **topic or target keyword**. Ask the user for anything not provided:

- **Topic / target keyword** (required) — e.g. "best concept testing platforms"
- **Angle or hook** (optional) — what makes this post different from what's already ranking?
- **Target audience** (optional) — defaults to "operators, marketers, and insights professionals"
- **Tone** (optional) — defaults to TestFeed brand voice: direct, practical, no spin
- **Related internal posts to link** (optional) — slugs from `/src/content/blog/`
- **Author** (optional) — defaults to "TestFeed"

If the user provides a brief document or notes, use those. Do not ask for information already given.

### 2. Research the Topic

Use web search to:
- Find the top 5 ranking pages for the target keyword
- Identify what angles, headings, and questions they cover
- Find 2–3 authoritative external sources worth citing
- Check what TestFeed's existing blog covers to avoid duplication (reference `/src/content/blog/`)

### 3. Write the Post

Write a complete, publish-ready Markdown file following the TestFeed blog format:

**Frontmatter (all fields required unless marked optional):**
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
relatedPosts: ["[slug-1]", "[slug-2]"]  # optional — only if relevant posts exist
keyTakeaways:
  - "[Citable sentence 1 — concrete and specific]"
  - "[Citable sentence 2]"
  - "[Citable sentence 3]"
authorBio:  # optional — include if author is Millie Marconi
  role: "CEO & Co-Founder, TestFeed"
  credentials: "Market research practitioner and founder of TestFeed, an AI-native synthetic audience research platform."
  linkedinUrl: "https://www.linkedin.com/in/millie-marconi/"
  headshotUrl: "/assets/authors/millie-marconi.jpg"
  authorPageUrl: "/authors/millie-marconi/"
faq:  # include if the topic warrants a FAQ section
  - question: "[Question]"
    answer: "[Answer]"
schemaMarkup:
  type: "BlogPosting"
  properties:
    datePublished: "[YYYY-MM-DD]"
    dateModified: "[YYYY-MM-DD]"
---
```

**Body structure:**
- No H1 in the body — `articleTitle` renders it
- Opening paragraph: hook the reader without a preamble heading
- H2 sections covering the main angles (use target keyword variants naturally)
- At least one comparison table where appropriate
- H2 "Frequently asked questions" section at the end (feeds FAQPage JSON-LD)
- Closing paragraph with a soft CTA to TestFeed — no hard sell

**Brand voice:**
- Direct and practical — no spin, no filler
- British English spelling
- Short paragraphs (3–4 lines max)
- Bold the most important phrase in each major section
- Cite sources with inline links, not footnotes

**SEO requirements:**
- Primary keyword in: title, description, articleTitle, first 100 words, at least two H2s
- `keyTakeaways` should be citable standalone sentences (optimised for AI overviews)
- `faq` questions should match natural search queries
- At least 2 internal links to existing TestFeed blog posts

### 4. Hand Off to add-blog-post

Once the post is written, output the complete Markdown (frontmatter + body) in a code block, then tell the user:

> "Post written. Run `/add-blog-post` and paste this content to save it as a draft and open a review PR."

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Content schema**: `/home/user/testfeed-website/src/content/config.ts`
- **Live site**: `https://testfeed.ai`

## Pipeline

```
/write-blog-post  →  /add-blog-post  →  /publish-blog-post
   (write)              (draft PR)           (go live)
```
