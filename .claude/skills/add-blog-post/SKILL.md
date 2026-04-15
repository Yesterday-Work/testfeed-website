---
name: add-blog-post
description: Add a new blog post to the testfeed-website. Use when the user wants to publish a markdown file as a blog post. Accepts a file path or pasted markdown content, validates frontmatter, writes the file to the blog directory, commits, and pushes.
model: claude-haiku-4-5-20251001
---

# Add Blog Post Skill

Add a new blog post to the testfeed-website at `/home/user/testfeed-website`.

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Accept the Markdown File

Ask the user: **"Please share the markdown file — either paste the content here, or give me the file path."**

Wait for their response before proceeding.

### 2. Determine the Slug

The slug becomes the URL (`/blog/[slug]/`) and the filename (`[slug].md`).

- If the user provided a **file path**, use the filename without the `.md` extension as the slug.
- If they **pasted content**, derive the slug from the `title` frontmatter field: lowercase, replace spaces and special characters with hyphens, strip punctuation.
- Confirm the slug with the user if it's ambiguous.

### 3. Validate Frontmatter

Parse the YAML frontmatter and check for all **required fields**:

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Browser tab title — should include primary keyword and end with `\| TestFeed` |
| `description` | string | Meta description — 150–160 characters with primary keyword |
| `articleTitle` | string | Main H1 displayed on the page |
| `publishDate` | date | Format: `YYYY-MM-DD` |
| `author` | string | Author name (e.g., `"Millie"`) |
| `excerpt` | string | Short summary for preview cards |

**If any required field is missing or malformed:**
- List the missing fields clearly
- Ask the user to provide the values
- Do NOT proceed until all required fields are present and valid

**Optional fields** (include if present in the file, don't add if absent):
- `updatedDate` — date, format `YYYY-MM-DD`
- `featuredImage` — string, path relative to `/public`
- `tags` — array of strings
- `minutesRead` — number
- `draft` — boolean (default `false` — omit unless the user wants it hidden)
- `relatedPosts` — array of blog slugs (filenames without `.md`)
- `schemaMarkup` — object with `type` and `properties`
- `finalCtaSection` — object with `title` and `text`

### 4. Write the File

Write the (validated) markdown content to:
```
/home/user/testfeed-website/src/content/blog/[slug].md
```

If a file with that slug already exists, **warn the user** and ask whether to overwrite or choose a different slug.

### 5. Commit and Push

```bash
cd /home/user/testfeed-website
git add src/content/blog/[slug].md
git commit -m "add blog post: [slug]"
git push -u origin claude/add-blog-posts-wgToW
```

If the push fails due to a network error, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

### 6. Confirm

Report back to the user with:
- The file path written: `src/content/blog/[slug].md`
- The URL the post will be live at: `/blog/[slug]/`
- Commit and push status
- Whether the post is published (`draft: false`) or hidden (`draft: true`)

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Content schema**: `/home/user/testfeed-website/src/content/config.ts`
- **Development branch**: `claude/add-blog-posts-wgToW`
