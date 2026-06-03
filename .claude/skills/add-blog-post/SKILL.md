---
name: add-blog-post
description: Add a new blog post to the testfeed-website. Use when the user wants to publish a markdown file as a blog post. Accepts a file path or pasted markdown content, validates frontmatter, writes the file to the blog directory as a DRAFT, commits, pushes, and opens a PR for review. Posts are always saved as draft:true first — use the publish-blog-post skill to make a post live.
model: claude-haiku-4-5-20251001
---

# Add Blog Post Skill

Add a new blog post to the testfeed-website at `/home/user/testfeed-website`.

Posts are **always saved as `draft: true`** first. They will not appear on the live site until the `publish-blog-post` skill is run.

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Accept the Markdown File

If the user provided a file path or pasted content, use that.

If no file was provided, check the Google Drive "SEO Blog Drops" folder (ID: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`) for any `.md` files using the Google Drive MCP tool `mcp__42347bf1-27cd-4477-ba2e-fd74d0695f38__list_recent_files`. If files are found, ask the user which one to process. If no files are found, ask the user to share the content.

### 2. Determine the Slug

The slug becomes the URL (`/blog/[slug]/`) and the filename (`[slug].md`).

- Derive the slug from the `title` or `articleTitle` frontmatter field: lowercase, replace spaces and special characters with hyphens, strip punctuation.
- If a file already exists at that slug, warn the user and ask whether to overwrite or use a different slug.

### 3. Validate Frontmatter

Parse the YAML frontmatter and check for all **required fields**:

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Browser tab title — should include primary keyword and end with `\| TestFeed` |
| `description` | string | Meta description — 150–160 characters with primary keyword |
| `articleTitle` | string | Main H1 displayed on the page |
| `publishDate` | date | Format: `YYYY-MM-DD` |
| `author` | string | Author name (e.g., `"Millie Marconi"`) |
| `excerpt` | string | Short summary for preview cards |

**If any required field is missing or malformed:**
- List the missing fields clearly
- Infer values where obvious (e.g. derive `articleTitle` from `title`, derive `excerpt` from the opening paragraph)
- Only ask the user for values that cannot be reasonably inferred

**Fix these automatically without asking:**
- `pubDate` → rename to `publishDate`
- `updatedAt` → rename to `updatedDate`
- `image: ""` → remove (empty featuredImage)
- `schemaMarkup: true` → remove (invalid format)
- `title` missing `| TestFeed` suffix → append it
- Map `keyTakeaways` from any "Key Points" or "Key Takeaways" section in the body
- Extract `faq` frontmatter from any FAQ section in the body

**Optional fields** (include if present in the file, don't add if absent):
- `updatedDate` — date, format `YYYY-MM-DD`
- `featuredImage` — string, path relative to `/public`
- `tags` — array of strings
- `minutesRead` — number
- `relatedPosts` — array of blog slugs (filenames without `.md`)
- `keyTakeaways` — array of strings (renders TL;DR box)
- `faq` — array of `{question, answer}` objects (emits FAQPage JSON-LD)
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

Create and push to a branch named `blog/draft-[slug]`:

```bash
git checkout -b blog/draft-[slug]
git add src/content/blog/[slug].md
git commit -m "draft: [slug]"
git push -u origin blog/draft-[slug]
```

If the branch already exists, check it out instead of creating it.

If the push fails due to a network error, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

### 6. Open a Pull Request

Use the GitHub MCP tool to open a PR:
- **title:** `[DRAFT] [articleTitle]`
- **head:** `blog/draft-[slug]`
- **base:** `main`
- **body:** Include the slug, excerpt, author, publish date, and a note that this is a draft — merge with `publish-blog-post` to go live.

### 7. Confirm

Report back to the user with:
- The slug: `[slug]`
- Status: **Draft — not live**
- PR link to review the post
- Next step: run `/publish-blog-post [slug]` to make it live

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Content schema**: `/home/user/testfeed-website/src/content/config.ts`
- **Google Drive SEO Blog Drops folder ID**: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`
