---
name: publish-blog-post
description: Publish a draft blog post that was saved by the add-blog-post skill. Removes draft:true, commits, merges the PR to main, and the post goes live on testfeed.ai. Run after reviewing the draft PR.
model: claude-haiku-4-5-20251001
---

# Publish Blog Post Skill

Publish a draft blog post on testfeed.ai.

This is **Step 3 of 3** in the publishing pipeline:
1. **`write-blog-post`** — researches and writes the post
2. **`add-blog-post`** — saves it as a draft and opens a PR for review
3. **`publish-blog-post`** (this skill) — merges to main and makes it live

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Identify the Post to Publish

If the user provided a slug (e.g. `/publish-blog-post best-concept-testing-platforms`), use that.

If no slug was provided, list all current draft posts and ask which to publish:
```bash
grep -rl "draft: true" /home/user/testfeed-website/src/content/blog/
```
Show the slugs (filenames without `.md`) and wait for the user to choose.

### 2. Confirm the Post Is a Draft

Read `/home/user/testfeed-website/src/content/blog/[slug].md` and confirm `draft: true` is present.

If `draft: true` is not in the file, tell the user: *"This post is already published at `https://testfeed.ai/blog/[slug]/`."* Stop here.

### 3. Check Out the Draft Branch

```bash
git fetch origin blog/draft-[slug]
git checkout blog/draft-[slug]
```

If the branch doesn't exist, stay on main and proceed.

### 4. Remove the Draft Flag

Edit `/home/user/testfeed-website/src/content/blog/[slug].md`:
- Remove the line `draft: true` entirely
- Do not replace it with `draft: false` — omitting it is correct (schema defaults to false)

### 5. Commit and Push

```bash
git add src/content/blog/[slug].md
git commit -m "publish: [slug]"
git push -u origin blog/draft-[slug]
```

Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network errors.

### 6. Merge the PR to Main

Use the GitHub MCP tool:
1. Find the open PR with head `blog/draft-[slug]` using `mcp__github__list_pull_requests`
2. Merge it with method `squash`, commit title: `publish: [slug]`

If no open PR exists, merge directly:
```bash
git checkout main
git pull origin main
git merge blog/draft-[slug]
git push origin main
```

### 7. Confirm

Report back:
- **Status:** Live
- **URL:** `https://testfeed.ai/blog/[slug]/`
- **Note:** Netlify/Vercel will take 1–3 minutes to rebuild — check back shortly.

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Live site**: `https://testfeed.ai`
- **GitHub repo**: `yesterday-work/testfeed-website`

## Pipeline

```
/write-blog-post  →  /add-blog-post  →  /publish-blog-post
   (write)              (draft PR)           (go live)
```
