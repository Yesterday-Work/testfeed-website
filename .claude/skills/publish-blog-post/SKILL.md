---
name: publish-blog-post
description: Publish a blog post that was previously saved as a draft by the add-blog-post skill. Sets draft:false, commits, and merges the PR to main so the post goes live. Use after reviewing the draft PR created by add-blog-post.
model: claude-haiku-4-5-20251001
---

# Publish Blog Post Skill

Publish a draft blog post on the testfeed-website at `/home/user/testfeed-website`.

This skill is the second step in the two-step publishing workflow:
1. **`add-blog-post`** — saves the post as `draft: true`, opens a PR for review
2. **`publish-blog-post`** (this skill) — flips `draft: false`, merges to main → post goes live

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Identify the Post to Publish

If the user provided a slug (e.g. `/publish-blog-post best-concept-testing-platforms`), use that.

If no slug was provided, list all current draft posts:
```bash
grep -rl "draft: true" /home/user/testfeed-website/src/content/blog/
```
Show the list to the user and ask which one to publish.

### 2. Confirm the Post Exists as a Draft

Read the file at `/home/user/testfeed-website/src/content/blog/[slug].md` and confirm:
- The file exists
- `draft: true` is set in the frontmatter

If `draft` is already `false` or missing, tell the user the post is already published.

### 3. Check Out the Draft Branch

The draft branch is named `blog/draft-[slug]`. Check it out:

```bash
git fetch origin blog/draft-[slug]
git checkout blog/draft-[slug]
```

If the branch doesn't exist locally or remotely, stay on the current branch and proceed.

### 4. Set draft: false

Edit the file `/home/user/testfeed-website/src/content/blog/[slug].md`:
- Find the line `draft: true`
- Remove it entirely (the schema defaults to false, so omitting it is correct)

### 5. Commit and Push

```bash
git add src/content/blog/[slug].md
git commit -m "publish: [slug]"
git push -u origin blog/draft-[slug]
```

If the push fails due to a network error, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

### 6. Merge the PR to Main

Use the GitHub MCP tool `mcp__github__merge_pull_request` to merge the open PR for this draft branch:
- Find the open PR with head branch `blog/draft-[slug]` using `mcp__github__list_pull_requests`
- Merge it using the `squash` method
- commit_title: `publish: [slug]`

If no open PR exists, push the change to main directly:
```bash
git checkout main
git pull origin main
git merge blog/draft-[slug]
git push origin main
```

### 7. Confirm

Report back to the user with:
- **Status: Live**
- **URL:** `https://testfeed.ai/blog/[slug]/`
- Remind them that Netlify/Vercel will take 1–3 minutes to rebuild

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Live site**: `https://testfeed.ai`
- **GitHub repo**: `yesterday-work/testfeed-website`
