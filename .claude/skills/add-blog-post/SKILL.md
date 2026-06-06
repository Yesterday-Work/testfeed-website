---
name: add-blog-post
description: Add a pre-written blog post to the testfeed-website as a draft. Accepts a file path, pasted content, or picks up from the Google Drive SEO Blog Drops folder. Validates and fixes frontmatter, saves with draft:true, commits, pushes, and opens a GitHub PR for review. Always saves as draft — use publish-blog-post to go live.
model: claude-haiku-4-5-20251001
---

# Add Blog Post Skill

Save a pre-written blog post as a draft on testfeed.ai.

**Entry Point B** — for posts already written (by you or dropped in Drive):
```
/add-blog-post  →  [review PR]  →  /publish-blog-post
```

For posts you want Claude to write from scratch, use Entry Point A instead:
```
/write-blog-post  →  [auto: draft + PR]  →  /publish-blog-post
```

Posts are **always saved as `draft: true`** — invisible on the live site until `/publish-blog-post` is run.

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Accept the Markdown Content

Check in this order:
1. **File path or pasted content** — if the user provided one, use it
2. **Google Drive** — check the SEO Blog Drops folder (ID: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`) for `.md` files. If files are found, show the list and ask which to process.
3. **Ask** — if Drive is empty, ask the user to paste or share the content.

### 2. Determine the Slug

Derive from `articleTitle` or `title`: lowercase, replace spaces and special characters with hyphens, strip punctuation.

If a file already exists at that slug, warn the user and ask whether to overwrite or use a different slug.

### 3. Validate and Fix Frontmatter

**Required fields:**

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Must end with `\| TestFeed` |
| `description` | string | 150–160 characters with primary keyword |
| `articleTitle` | string | The H1 shown on the page |
| `publishDate` | date | Format: `YYYY-MM-DD` |
| `author` | string | e.g. `"Millie Marconi"` |
| `excerpt` | string | 2–3 sentence summary for preview cards |

**Fix automatically without asking:**
- `pubDate` → rename to `publishDate`
- `updatedAt` → rename to `updatedDate`
- `image: ""` or `featuredImage: ""` → remove
- `schemaMarkup: true` → remove (invalid format)
- `title` missing `| TestFeed` → append it
- Extract `keyTakeaways` from any "Key Points" section in the body
- Extract `faq` from any FAQ section in the body

**Optional fields — include if present, skip if absent:**
- `updatedDate`, `featuredImage`, `tags`, `minutesRead`, `relatedPosts`
- `keyTakeaways` — array of strings (renders TL;DR box)
- `faq` — array of `{question, answer}` (emits FAQPage JSON-LD)
- `authorBio` — object with `role`, `credentials`, `linkedinUrl`, `xUrl`, `headshotUrl` (`/assets/authors/headshot.jpg` for Millie), `authorPageUrl`
- `finalCtaSection` — object with `title` and `text` (renders post-article CTA before newsletter); strongly recommended
- `schemaMarkup` — object with `type: "BlogPosting"` and `properties`

**Always set:**
```yaml
draft: true
```

### 4. Write the File

```
/home/user/testfeed-website/src/content/blog/[slug].md
```

### 5. Commit and Push to Draft Branch

```bash
git checkout -b blog/draft-[slug]
git add src/content/blog/[slug].md
git commit -m "draft: [slug]"
git push -u origin blog/draft-[slug]
```

If the branch already exists, check it out instead of creating it. Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network errors.

### 6. Open a Pull Request

- **title:** `[DRAFT] [articleTitle]`
- **head:** `blog/draft-[slug]`
- **base:** `main`
- **body:** Slug, excerpt, author, publish date, and: *"Review the Netlify/Vercel preview, then run `/publish-blog-post [slug]` to go live."*

### 7. Confirm

- **Slug:** `[slug]`
- **Status:** Draft — not live
- **PR:** [link]
- **Next step:** Review the preview, then run `/publish-blog-post [slug]`

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Google Drive SEO Blog Drops folder ID**: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`
- **GitHub repo**: `yesterday-work/testfeed-website`
- **Live site**: `https://testfeed.ai`
