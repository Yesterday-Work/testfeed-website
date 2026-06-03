---
name: coworker
description: Weekly content co-worker. Checks the Google Drive SEO Blog Drops folder for new posts, drafts each one, and opens a PR per post for review. Run once a week — or schedule it with GitHub Actions to run automatically.
model: claude-sonnet-4-6
---

# Coworker Skill

Your weekly content co-worker. Checks Google Drive for new blog posts, drafts them all, and lines up PRs for your review.

This skill orchestrates the full pipeline:
```
Google Drive  →  /add-blog-post (×N)  →  PRs ready to review  →  /publish-blog-post
```

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Check the Drive Folder

Use the Google Drive MCP tool to list files in the SEO Blog Drops folder (ID: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`).

Filter for `.md` files only. If there are no files, report back:
> "Nothing new in SEO Blog Drops this week. Drop `.md` files in the folder to queue them for drafting."
Stop here.

### 2. Identify New Files

Cross-reference the Drive files against already-published and already-drafted posts:
```bash
ls /home/user/testfeed-website/src/content/blog/
```

Skip any file whose slug (derived from the filename or title) already exists in the blog directory. Report skipped files to the user so they know.

### 3. Process Each New File

For each new `.md` file in Drive, run the full `add-blog-post` workflow:

1. Download the file content using the Google Drive MCP tool
2. Derive the slug from `articleTitle` or `title` frontmatter
3. Validate and fix frontmatter (same rules as `add-blog-post`):
   - Ensure all required fields are present: `title`, `description`, `articleTitle`, `publishDate`, `author`, `excerpt`
   - Infer missing values where possible
   - Always set `draft: true`
4. Write to `/home/user/testfeed-website/src/content/blog/[slug].md`
5. Create branch `blog/draft-[slug]`, commit, and push
6. Open a GitHub PR titled `[DRAFT] [articleTitle]`

Process files one at a time. Do not move to the next file until the current one is committed and the PR is open.

### 4. Report the Weekly Summary

When all files are processed, report back with a clean summary:

```
Weekly content check complete.

Drafted this week:
- [articleTitle] → PR #[N] — /publish-blog-post [slug]
- [articleTitle] → PR #[N] — /publish-blog-post [slug]

Skipped (already exist):
- [slug]

To publish: review each PR, then run the publish command shown above.
```

## Key Paths

- **Google Drive SEO Blog Drops folder ID**: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`
- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **GitHub repo**: `yesterday-work/testfeed-website`
- **Live site**: `https://testfeed.ai`

## Pipeline

```
/write-blog-post  →  /add-blog-post  →  /publish-blog-post
                          ↑
                     /coworker
                  (runs add-blog-post
                   for every file in Drive)
```

## Running on a Schedule

To run this automatically every week without opening Claude Code, ask to set up the GitHub Actions workflow — it runs `/coworker` on a cron schedule and posts a Slack notification when PRs are ready.
