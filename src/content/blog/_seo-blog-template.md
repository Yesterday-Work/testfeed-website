---
# ============================================================
# SEO BLOG POST TEMPLATE — testfeed.ai
# Based on: Structural, UX & Technical Optimisation Blueprint
# ============================================================
#
# HOW TO USE:
# 1. Copy this file and rename to your-post-slug.md
# 2. Fill in every field below (remove these comments)
# 3. Write your content in the body section beneath the ---
# 4. Set draft: false when ready to publish
#
# QUICK SEO CHECKLIST:
#   [ ] title includes primary keyword (55–60 chars)
#   [ ] description is 150–160 chars with keyword
#   [ ] keyTakeaways has 2–3 direct, citable sentences
#   [ ] authorBio is complete (E-E-A-T compliance)
#   [ ] relatedPosts links to 2–3 cluster articles
#   [ ] schemaMarkup.dateModified matches updatedDate
#   [ ] featuredImage has descriptive alt text via title
# ============================================================

# ── SEO METADATA ────────────────────────────────────────────
title: "[Primary Keyword: Compelling Title | TestFeed]"
# Browser tab title. 55–60 chars. Include primary keyword near the start.

description: "[150–160 character meta description. State the primary keyword, the reader's benefit, and a clear value proposition. Avoid truncation.]"

# ── ARTICLE METADATA ────────────────────────────────────────
articleTitle: "[Full Display H1: The Article Headline Shown on Page]"
# This is the H1 rendered in the blog hero. Can be longer than `title`.

publishDate: 2026-01-01
# ISO date: YYYY-MM-DD — must match schemaMarkup.datePublished below

updatedDate: 2026-01-01
# Uncomment and set when post is refreshed. Signals freshness to crawlers.
# updatedDate: YYYY-MM-DD

author: "[Author Full Name]"
# Must match schemaMarkup.author.name below

featuredImage: "/assets/blog/[post-slug]/cover.webp"
# Optimise with Astro <Image /> at 1200×630px, WebP, quality 85.
# Leave empty string "" if no image.

excerpt: "[2–3 sentence summary used on blog listing cards and as og:description fallback.]"

tags: ["tag-one", "tag-two", "tag-three"]
# Use lowercase, hyphenated slugs. Max 5 tags. Match content cluster topics.

minutesRead: 8
# Estimated reading time. Reduces bounce by setting reader expectations.

draft: true
# Set to false when ready to publish. Draft posts are excluded from builds.

relatedPosts: ["related-post-slug-1", "related-post-slug-2"]
# Use 2–3 slugs from src/content/blog/. Distributes internal PageRank.

# ── KEY TAKEAWAYS (TL;DR box) ───────────────────────────────
keyTakeaways:
  - "First key insight: one direct, citable sentence that answers the main question."
  - "Second key insight: a concrete finding or actionable conclusion."
  - "Third key insight: a memorable statistic or specific recommendation."
# Rendered immediately below the H1 and metadata.
# Optimises for AI overviews and featured snippets (540-word threshold).
# Keep each item to one sentence. 2–3 items is optimal.

# ── E-E-A-T AUTHOR BIO ──────────────────────────────────────
authorBio:
  role: "Author Role / Title at TestFeed"
  credentials: "Brief credential statement — e.g. '8 years in B2B content strategy, specialising in AI-driven marketing research.'"
  linkedinUrl: "https://linkedin.com/in/author-handle"
  headshotUrl: "/assets/authors/[author-slug].jpg"
  # Genuine headshot (not a logo). 200×200px minimum, WebP preferred.
  authorPageUrl: "/authors/[author-slug]/"
  # Link to internal Author Profile Page for entity-relationship mapping.

# ── SCHEMA.ORG STRUCTURED DATA ──────────────────────────────
schemaMarkup:
  type: "BlogPosting"
  properties:
    headline: "[Same as articleTitle above]"
    description: "[Same as description above]"
    datePublished: "YYYY-MM-DD"
    dateModified: "YYYY-MM-DD"
    # Update dateModified whenever content is revised — keep in sync with updatedDate.
    author:
      "@type": "Person"
      name: "[Author Full Name]"
      url: "https://testfeed.ai/authors/[author-slug]/"
    publisher:
      "@type": "Organization"
      name: "TestFeed"
      url: "https://testfeed.ai"
      logo:
        "@type": "ImageObject"
        url: "https://testfeed.ai/assets/og-image.jpg"
    image: "https://testfeed.ai/assets/blog/[post-slug]/cover.webp"
    mainEntityOfPage:
      "@type": "WebPage"
      "@id": "https://testfeed.ai/blog/[post-slug]/"
---

<!-- ============================================================
     ARTICLE BODY
     
     STRUCTURE GUIDE:
     - The Key Takeaways box is auto-rendered from frontmatter.
     - Start with a tight 3–5 sentence intro paragraph.
     - Use H2 for major sections, H3 for sub-topics.
     - Use > blockquote for pull-quotes and key statistics.
     - No inline CTA bands — they hurt CLS and increase bounce.
     - The social share buttons and author bio are auto-rendered.
     ============================================================ -->

Your opening paragraph should be 3–5 sentences that answer the primary question immediately. Include the primary keyword naturally. This paragraph sets context and signals to AI crawlers what the article is about — the first ~540 words receive the heaviest semantic weighting.

## H2: First Major Section Heading

Write your first substantive section here. H2 headings are auto-linked by `rehype-slug` and power the sticky Table of Contents. Aim for 200–400 words per H2 section.

Use **bold** for key terms on first use and for important statistics.

> **Pull quote:** A compelling insight, statistic, or expert opinion that deserves visual emphasis. Using semantic `<blockquote>` keeps this text in the normal document flow so crawlers can index it.

### H3: Sub-topic Within First Section

H3s appear as nested items in the Table of Contents. Use them to break down complex H2 sections. Three to five H3s per H2 is a good guideline.

## H2: Second Major Section

Continue the article body with clear, well-structured prose. Avoid walls of text — use short paragraphs (2–4 sentences), bulleted lists for multiple items, and numbered lists for sequential steps.

Key content principles:
- **Primary keyword** should appear in the first paragraph, at least one H2, and organically throughout.
- **Secondary keywords** should appear in H3s and body copy.
- **Internal links** to related TestFeed content improve crawl efficiency.
- **External links** open in new tabs automatically (handled by `rehype-external-links`).

## H2: Third Major Section

Continue here...

### H3: Sub-section

Content...

## Frequently Asked Questions

FAQ sections improve featured snippet eligibility. Use a clear question as the H3, with a concise 2–4 sentence answer directly below.

### What is [primary topic]?

Answer in 2–4 sentences. Be direct and citable.

### How does [related question] work?

Answer in 2–4 sentences.

## Conclusion

Summarise the article's core argument in 2–3 sentences. Restate the primary keyword naturally. End with a clear, actionable next step for the reader — this reduces bounce and signals a complete, high-quality article to search crawlers.

<!-- 
  Social share buttons and author bio are rendered automatically
  from the SocialShare and AuthorBio components wired into [slug].astro.
  Do NOT add manual CTA bands here — they increase CLS and drop-off.
-->
