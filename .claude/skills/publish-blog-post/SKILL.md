---
name: publish-blog-post
description: Publish a draft blog post that was saved by write-blog-post, add-blog-post, or coworker. Removes draft:true, commits, merges the PR to main, and the post goes live on testfeed.ai. Run after reviewing the draft PR.
model: claude-haiku-4-5-20251001
---

# Publish Blog Post Skill

Make a draft blog post live on testfeed.ai. This is the final step in both publishing pipelines:

```
/write-blog-post  →  [review PR]  →  /publish-blog-post
/coworker         →  [review PR]  →  /publish-blog-post
```

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Identify the Post to Publish

If the user provided a slug (e.g. `/publish-blog-post best-concept-testing-platforms`), use it.

If no slug was provided, list all current draft posts and ask which to publish:
```bash
grep -rl "draft: true" /home/user/testfeed-website/src/content/blog/
```
Show the slugs (filenames without `.md`) and wait for the user to choose.

### 2. Confirm the Post Is a Draft

Read `/home/user/testfeed-website/src/content/blog/[slug].md` and confirm `draft: true` is present.

If not found, tell the user: *"This post is already published at `https://testfeed.ai/blog/[slug]/`."* Stop here.

### 3. Check Out the Correct Branch

Try to check out the draft branch:
```bash
git fetch origin blog/draft-[slug] 2>/dev/null && git checkout blog/draft-[slug]
```

If the branch doesn't exist remotely or locally, stay on `main` and note this — the push in step 5 will go directly to main.

### 4. Remove the Draft Flag

Edit `/home/user/testfeed-website/src/content/blog/[slug].md`:
- Remove the line `draft: true` entirely (do not replace with `draft: false` — omitting it is correct, the schema defaults to false)

### 5. Commit and Push

**If on the draft branch:**
```bash
git add src/content/blog/[slug].md
git commit -m "publish: [slug]"
git push -u origin blog/draft-[slug]
```
Then proceed to step 6 to merge the PR.

**If no draft branch exists (staying on main):**
```bash
git add src/content/blog/[slug].md
git commit -m "publish: [slug]"
git push origin main
```
Skip step 6 — it's already on main.

Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network errors.

### 6. Merge the PR to Main

Use the GitHub MCP tool:
1. Find the open PR with head `blog/draft-[slug]` using `mcp__github__list_pull_requests`
2. Merge with method `squash`, commit title: `publish: [slug]`

If no open PR is found, the push in step 5 already went to main — skip this step.

### 7. Update Notion SEO Content Pipeline

Find the matching row in the SEO Content Pipeline database and set Status to `Published`.

**Database:** SEO Content Pipeline  
**Data source ID:** `1f3798c8-bb64-4a16-81a0-5ae2cc318d0b`

1. Search the database for a row where `Name` matches `[slug]`
2. If found: update `Status` to `Published` using the Notion MCP `notion-update-page` tool
3. If not found: create a new row with `Name: [slug]`, `Primary Keyword: [primary keyword from frontmatter tags[0]]`, `Status: Published`, `Format: [format type e.g. Guide/Comparison]`

### 8. Confirm

- **Status:** Live
- **URL:** `https://testfeed.ai/blog/[slug]/`
- **Notion:** SEO Content Pipeline updated to Published
- **Note:** Netlify/Vercel takes 1–3 minutes to rebuild — check back shortly.

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **GitHub repo**: `yesterday-work/testfeed-website`
- **Live site**: `https://testfeed.ai`
