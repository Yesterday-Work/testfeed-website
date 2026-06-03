# TestFeed Blog Publishing Pipeline

## The two entry points

```
ENTRY POINT A — Claude writes from scratch:
/write-blog-post  →  [draft saved + PR opened automatically]  →  /publish-blog-post

ENTRY POINT B — You drop a .md file in Google Drive:
Drop .md in Drive  →  /coworker  →  /publish-blog-post
```

---

## Skill reference

### `/write-blog-post`
**Use when:** You have a topic and want Claude to write the post.

1. Give Claude a topic (and optionally: angle, audience, author)
2. Claude researches, writes, saves as draft, and opens a GitHub PR — all automatically
3. Review the PR preview
4. Run `/publish-blog-post [slug]` to go live

---

### `/add-blog-post`
**Use when:** You've already written a post and want to add it.

1. Paste your .md content, give a file path, or point to a file in the Google Drive SEO Blog Drops folder
2. Claude validates and auto-fixes frontmatter, saves as draft, opens a GitHub PR
3. Review the PR preview
4. Run `/publish-blog-post [slug]` to go live

---

### `/coworker`
**Use when:** You want to batch-process everything in the Google Drive SEO Blog Drops folder.

1. Run `/coworker` (or let GitHub Actions run it automatically every Monday at 9am UTC)
2. Claude scans the Drive folder, skips anything already published, and opens one draft PR per new post
3. Review each PR
4. Run `/publish-blog-post [slug]` for each post you want live

**Google Drive folder:** https://drive.google.com/drive/folders/1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7

---

### `/publish-blog-post`
**Use when:** A draft PR is reviewed and ready to go live.

- With slug: `/publish-blog-post best-concept-testing-platforms`
- Without slug: Claude lists all current drafts and asks which to publish

Takes ~2 minutes for Netlify to rebuild after publishing.

---

## Post lifecycle

```
Draft (draft: true, invisible on site)
  ↓  /publish-blog-post
Live (https://testfeed.ai/blog/[slug]/)
```

Every post goes through draft first. Nothing is ever published without an explicit `/publish-blog-post` command.

---

## GitHub Actions — automatic Monday run

The `/coworker` skill runs automatically every Monday at 9am UTC via GitHub Actions.

**Required GitHub secrets** (Settings → Secrets and variables → Actions):
- `ANTHROPIC_API_KEY` — your Anthropic API key
- `GOOGLE_DRIVE_CREDENTIALS` — service account JSON with access to the SEO Blog Drops folder

You can also trigger it manually from the GitHub Actions tab.

---

## Key paths

| Thing | Location |
|---|---|
| Blog posts | `src/content/blog/` |
| Skills | `.claude/skills/` |
| GitHub repo | `yesterday-work/testfeed-website` |
| Live site | `https://testfeed.ai` |
| Drive drop folder | `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7` |
