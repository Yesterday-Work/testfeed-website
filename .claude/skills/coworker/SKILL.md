---
name: coworker
description: Weekly content co-worker. Checks the Google Drive SEO Blog Drops folder for new posts, drafts each one, and opens a PR per post for review. Run once a week — or schedule via GitHub Actions to run automatically every Monday.
model: claude-sonnet-4-6
---

# Coworker Skill

Your weekly content co-worker. Checks Google Drive for new posts, drafts them all, and lines up PRs for your review.

**Entry Point B** — for posts already written and dropped in Drive:
```
[Drop .md in Drive]  →  /coworker  →  [review PRs]  →  /publish-blog-post
```

For posts you want Claude to write from scratch, use Entry Point A instead:
```
/write-blog-post  →  [review PR]  →  /publish-blog-post
```

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Check the Drive Folder

Use the Google Drive MCP tool (`mcp__42347bf1-27cd-4477-ba2e-fd74d0695f38__list_recent_files`) to list files in the SEO Blog Drops folder (ID: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`).

Filter for `.md` files only. If none found:
> "Nothing new in SEO Blog Drops this week. Drop `.md` files in the folder to queue them."

Stop here.

### 2. Identify New Files

Cross-reference Drive files against the blog directory to skip anything already processed:
```bash
ls /home/user/testfeed-website/src/content/blog/
```

A file is considered already processed if a post with the same slug (derived from its filename or title) exists in the blog directory. List skipped files in the final summary.

### 3. Process Each New File

For each new file, follow the same rules as `add-blog-post` — download, validate, fix, save, branch, commit, push, PR:

**Download:** Use the Google Drive MCP tool to get the file content.

**Validate and fix frontmatter** (same rules as `add-blog-post`):
- Required: `title` (must end `| TestFeed`), `description` (150–160 chars), `articleTitle`, `publishDate`, `author`, `excerpt`
- Auto-fix: rename `pubDate`→`publishDate`, `updatedAt`→`updatedDate`, remove empty `image`/`featuredImage`, remove `schemaMarkup: true`, append `| TestFeed` if missing from title, extract `keyTakeaways` and `faq` from body sections
- Always set: `draft: true`

**Write file:**
```
/home/user/testfeed-website/src/content/blog/[slug].md
```

**Branch, commit, push:**
```bash
git checkout -b blog/draft-[slug]
git add src/content/blog/[slug].md
git commit -m "draft: [slug]"
git push -u origin blog/draft-[slug]
```

**Open PR:** title `[DRAFT] [articleTitle]`, head `blog/draft-[slug]`, base `main`. Body: slug, excerpt, author, and *"Review then run `/publish-blog-post [slug]` to go live."*

Process files one at a time. Do not move to the next until the PR is open.

### 4. Weekly Summary

```
Weekly content check complete.

Drafted this week:
- [articleTitle] → PR #[N] → /publish-blog-post [slug]
- [articleTitle] → PR #[N] → /publish-blog-post [slug]

Skipped (already exist):
- [slug]

Review each PR, then run the publish command when ready.
```

## Key Paths

- **Google Drive SEO Blog Drops folder ID**: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`
- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **GitHub repo**: `yesterday-work/testfeed-website`
- **Live site**: `https://testfeed.ai`

## Scheduling

This skill runs automatically every Monday at 9am UTC via GitHub Actions (`.github/workflows/weekly-coworker.yml`). It can also be triggered manually from the GitHub Actions tab, or run on demand here by typing `/coworker`.

**Required GitHub secrets for the scheduled run:**
- `ANTHROPIC_API_KEY` — your Anthropic API key
- `GOOGLE_DRIVE_CREDENTIALS` — service account JSON with access to the SEO Blog Drops folder
