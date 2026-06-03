---
name: add-blog-post
description: Add a new blog post to the testfeed-website as a draft. Accepts a file path, pasted content, or picks up from the Google Drive SEO Blog Drops folder. Validates and fixes frontmatter, saves with draft:true, commits, pushes, and opens a GitHub PR for review. Always saves as draft — use publish-blog-post to go live.
model: claude-haiku-4-5-20251001
---

# Add Blog Post Skill

Save a blog post as a draft on the testfeed-website at `/home/user/testfeed-website`.

This is **Step 2 of 3** in the publishing pipeline:
1. **`write-blog-post`** — researches and writes the post
2. **`add-blog-post`** (this skill) — saves it as a draft and opens a PR for review
3. **`publish-blog-post`** — merges to main and makes it live

Posts are **always saved as `draft: true`** — they are invisible on the live site until `publish-blog-post` is run.

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Accept the Markdown Content

Check in this order:
1. **File path or pasted content** — if the user provided one, use it
2. **Google Drive** — if nothing was provided, check the SEO Blog Drops folder (ID: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`) for `.md` files using the Google Drive MCP tool. If files are found, show the list and ask which to process.
3. **Ask** — if Drive is empty, ask the user to paste or share the content.

### 2. Determine the Slug

The slug becomes the URL (`/blog/[slug]/`) and the filename (`[slug].md`).

Derive from `articleTitle` or `title`: lowercase, replace spaces and special characters with hyphens, strip punctuation.

If a file already exists at that slug, warn the user and ask whether to overwrite or use a different slug.

### 3. Validate and Fix Frontmatter

**Required fields — must be present before writing the file:**

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Must end with `\| TestFeed` |
| `description` | string | 150–160 characters, includes primary keyword |
| `articleTitle` | string | The H1 shown on the page |
| `publishDate` | date | Format: `YYYY-MM-DD` |
| `author` | string | e.g. `"Millie Marconi"` |
| `excerpt` | string | 2–3 sentence summary for preview cards |

**Fix these automatically without asking:**
- `pubDate` → rename to `publishDate`
- `updatedAt` → rename to `updatedDate`
- `image: ""` → remove
- `schemaMarkup: true` → remove (invalid format)
- `title` missing `| TestFeed` → append it
- `featuredImage: ""` → remove
- Extract `keyTakeaways` from any "Key Points" or "Key Takeaways" section in the body
- Extract `faq` from any FAQ section in the body and add to frontmatter

**Optional fields — include if present, do not add if absent:**
- `updatedDate` — date `YYYY-MM-DD`
- `featuredImage` — path relative to `/public`
- `tags` — array of strings
- `minutesRead` — number
- `relatedPosts` — array of blog slugs
- `keyTakeaways` — array of strings (renders TL;DR box)
- `faq` — array of `{question, answer}` (emits FAQPage JSON-LD)
- `authorBio` — object with `role`, `credentials`, `linkedinUrl`, `headshotUrl`, `authorPageUrl`
- `schemaMarkup` — object with `type: "BlogPosting"` and `properties`

**Always set:**
```yaml
draft: true
```

### 4. Write the File

Write the validated markdown content to:
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

Use the GitHub MCP tool to open a PR:
- **title:** `[DRAFT] [articleTitle]`
- **head:** `blog/draft-[slug]`
- **base:** `main`
- **body:** Slug, excerpt, author, publish date, and: *"Draft post — review the Netlify/Vercel preview, then run `/publish-blog-post [slug]` to go live."*

### 7. Confirm

Report back:
- **Slug:** `[slug]`
- **Status:** Draft — not live
- **PR:** [link]
- **Next step:** Review the preview, then run `/publish-blog-post [slug]`

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Content schema**: `/home/user/testfeed-website/src/content/config.ts`
- **Google Drive SEO Blog Drops folder ID**: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`
- **GitHub repo**: `yesterday-work/testfeed-website`

## Pipeline

```
/write-blog-post  →  /add-blog-post  →  /publish-blog-post
   (write)              (draft PR)           (go live)
```
