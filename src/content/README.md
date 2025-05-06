# TestFeed Content System

This directory contains all the content files that power the TestFeed website. The content is structured using Astro's Content Collections system.

## 🚀 QUICK START GUIDE

### Creating a New Blog Post

1. **Copy a template**: Duplicate `src/content/_templates/blog/template-blog-post.md` and rename it with your SEO-friendly title (e.g., `linkedin-tips-2025.md`)
2. **Edit the frontmatter**: Update these key fields:
   ```yaml
   pageTitle: "Your SEO-Optimized Title | TestFeed"
   pageDescription: "150-160 character description with keywords"
   publishDate: 2023-05-01
   author: "Your Name"
   ```
3. **Write content**: Replace the placeholder Markdown content with your actual blog post
4. **That's it!** Your post will appear at `/blog/linkedin-tips-2025` (based on your filename)

### Creating a New Landing Page

1. **Copy the content template**: 
   - Copy `src/content/_templates/landing-page/template.md` to `src/content/homepage/your-page-name.md`
   - Edit the template, following the comments provided
   - Delete any sections you don't need

2. **Copy the page template**:
   - Copy `src/content/_templates/landing-page/template.astro` to `src/pages/your-page-name.astro`
   - Change this line to match your content file name:
     ```js
     const entry = homepageEntries.find(entry => entry.id === 'your-page-name.md');
     ```

3. **Done!** Your page is now available at `/your-page-name`

## How It Works

1. Content is written in Markdown (`.md`) files with YAML frontmatter
2. Pages are built using component-based architecture
3. You can create or modify pages without touching code

## Content Collections

The site has three main content collections:

1. **Homepage**: Content for main pages and landing pages
2. **Blog**: Blog posts and articles
3. **Legal**: Legal pages like privacy policy, terms of service

## Creating or Editing Content

### Homepage Content

The homepage content is in `homepage/main.md`. To edit:

1. Open the file in any text editor
2. Modify the content between the `---` markers
3. Each section (hero, problem, etc.) is clearly labeled
4. Save changes and the site will automatically update

### Example: Adding/Modifying Problem Cards

```yaml
# Problem section
problemSection:
  title: "The post-and-pray <span class='highlight'>problem</span>"
  cards:
    - icon: "trending-down"
      title: "Brand impact cuts both ways"
      text: "Content that resonates builds your brand..."
    # Add a new card by copying the format above and changing values
    - icon: "alert-circle"
      title: "Your new problem"
      text: "Description of the new problem..."
```
