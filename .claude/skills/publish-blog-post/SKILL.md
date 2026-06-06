---
name: publish-blog-post
description: Publish a draft blog post. First pulls any pending posts from the Google Drive SEO Blog Drops folder into the repo as drafts so nothing gets missed, then removes draft:true, commits, merges the PR to main, and the post goes live on testfeed.ai.
model: claude-haiku-4-5-20251001
---

# Publish Blog Post Skill

Make a draft blog post live on testfeed.ai. Before publishing, the skill sweeps
the Google Drive SEO Blog Drops folder so any pre-written post that was never
drafted into the repo gets picked up first — nothing slips through.

```
[Google Drive SEO Blog Drops]  ┐
                               ├─→  /publish-blog-post  →  [review]  →  live
[existing draft .md in repo]   ┘
```

## Workflow

Make a todo list and work through these steps one at a time.

### 1. Intake from Google Drive (so nothing gets missed)

Check the **SEO Blog Drops** folder (ID: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`)
for `.md` files using the Google Drive MCP tools.

For each file found, derive its slug (see step 3) and check whether
`src/content/blog/[slug].md` already exists in the repo:
- **Already in repo** → skip it (it's already a draft or already published).
- **Not in repo** → import it as a new draft: validate/fix the frontmatter
  (see "Frontmatter Rules" below), set `draft: true`, and write it to
  `src/content/blog/[slug].md`.

Show the user a summary of what was imported (e.g. *"Imported 2 new drafts from
Drive: `slug-a`, `slug-b`"*). If Drive is empty or unreachable, note that and
carry on with whatever drafts already exist in the repo.

### 2. Identify the Post(s) to Publish

If the user provided a slug (e.g. `/publish-blog-post best-concept-testing-platforms`), use it.

If no slug was provided, list all current draft posts (including any just
imported in step 1) and ask which to publish:
```bash
grep -rl "draft: true" /home/user/testfeed-website/src/content/blog/
```
Show the slugs (filenames without `.md`) and wait for the user to choose. Do
not auto-publish freshly imported Drive posts without confirmation.

### 3. Determine the Slug & Confirm the Post Is a Draft

Slug derivation (for Drive imports): from `articleTitle` or `title` — lowercase,
replace spaces and special characters with hyphens, strip punctuation.

Read `/home/user/testfeed-website/src/content/blog/[slug].md` and confirm `draft: true` is present.

If not found, tell the user: *"This post is already published at `https://testfeed.ai/blog/[slug]/`."* Stop here.

### 4. Check Out the Correct Branch

Try to check out the draft branch:
```bash
git fetch origin blog/draft-[slug] 2>/dev/null && git checkout blog/draft-[slug]
```

If the branch doesn't exist remotely or locally, create it from `main` for the
import case, or stay on `main` for an existing in-repo draft and note this — the
push in step 6 will go directly to main.

### 5. Remove the Draft Flag

Edit `/home/user/testfeed-website/src/content/blog/[slug].md`:
- Remove the line `draft: true` entirely (do not replace with `draft: false` — omitting it is correct, the schema defaults to false)

### 6. Commit and Push

**If on the draft branch:**
```bash
git add src/content/blog/[slug].md
git commit -m "publish: [slug]"
git push -u origin blog/draft-[slug]
```
Then proceed to step 7 to merge the PR.

**If no draft branch exists (staying on main):**
```bash
git add src/content/blog/[slug].md
git commit -m "publish: [slug]"
git push origin main
```
Skip step 7 — it's already on main.

Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network errors.

### 7. Merge the PR to Main

Use the GitHub MCP tool:
1. Find the open PR with head `blog/draft-[slug]` using `mcp__github__list_pull_requests`
2. Merge with method `squash`, commit title: `publish: [slug]`

If no open PR is found, the push in step 6 already went to main — skip this step.

### 8. Submit to Search Engines

Wait 90 seconds for the site to rebuild, then run both submissions:

```bash
# Submit to Google Indexing API (uses GOOGLE_INDEXING_CREDENTIALS env var)
node -e "
const crypto = require('crypto');
const https = require('https');

const creds = JSON.parse(process.env.GOOGLE_INDEXING_CREDENTIALS);
const now = Math.floor(Date.now() / 1000);
const header = Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url');
const payload = Buffer.from(JSON.stringify({
  iss: creds.client_email,
  scope: 'https://www.googleapis.com/auth/indexing',
  aud: 'https://oauth2.googleapis.com/token',
  exp: now + 3600,
  iat: now
})).toString('base64url');
const sign = crypto.createSign('RSA-SHA256');
sign.update(header + '.' + payload);
const jwt = header + '.' + payload + '.' + sign.sign(creds.private_key, 'base64url');

const tokenBody = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt;
const tokenReq = https.request({hostname:'oauth2.googleapis.com',path:'/token',method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'}}, res => {
  let d=''; res.on('data',c=>d+=c); res.on('end',()=>{
    const token = JSON.parse(d).access_token;
    const body = JSON.stringify({url:'https://testfeed.ai/blog/[slug]/',type:'URL_UPDATED'});
    const req = https.request({hostname:'indexing.googleapis.com',path:'/v3/urlNotifications:publish',method:'POST',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json','Content-Length':body.length}}, r=>{
      let o=''; r.on('data',c=>o+=c); r.on('end',()=>console.log('Google:', r.statusCode, o));
    }); req.write(body); req.end();
  });
}); tokenReq.write(tokenBody); tokenReq.end();
"

# Submit to IndexNow (Bing/Yandex) — no auth needed
curl -s -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json" \
  -d "{\"host\":\"testfeed.ai\",\"key\":\"a7f3c2e1-9b4d-4f8a-b6e2-1d5c8a3f7e9b\",\"keyLocation\":\"https://testfeed.ai/a7f3c2e1-9b4d-4f8a-b6e2-1d5c8a3f7e9b.txt\",\"urlList\":[\"https://testfeed.ai/blog/[slug]/\"]}"
```

Replace `[slug]` with the actual slug. Google returning `200` and IndexNow returning `200` or `202` means success.

### 9. Update Notion SEO Content Pipeline

Find the matching row in the SEO Content Pipeline database and set Status to `Published`.

**Database:** SEO Content Pipeline  
**Data source ID:** `1f3798c8-bb64-4a16-81a0-5ae2cc318d0b`

1. Search the database for a row where `Name` matches `[slug]`
2. If found: update `Status` to `Published` using the Notion MCP `notion-update-page` tool
3. If not found: create a new row with `Name: [slug]`, `Primary Keyword: [primary keyword from frontmatter tags[0]]`, `Status: Published`, `Format: [format type e.g. Guide/Comparison]`

### 10. Confirm

- **Status:** Live
- **URL:** `https://testfeed.ai/blog/[slug]/`
- **Notion:** SEO Content Pipeline updated to Published
- **Indexing:** Submitted to Google Indexing API and IndexNow
- **Note:** Cloudflare takes 1–3 minutes to rebuild — check back shortly.

## Frontmatter Rules (for Drive imports)

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
- `finalCtaSection` — object with `title` and `text`; strongly recommended
- `schemaMarkup` — object with `type: "BlogPosting"` and `properties`

**Always set on import:** `draft: true`

## Key Paths

- **Blog directory**: `/home/user/testfeed-website/src/content/blog/`
- **Google Drive SEO Blog Drops folder ID**: `1246GXzreY3HR0KP4HfFwyWWrOw4N-o_7`
- **GitHub repo**: `yesterday-work/testfeed-website`
- **Live site**: `https://testfeed.ai`
