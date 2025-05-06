# TestFeed Website

A modern, content-driven website for TestFeed built with Astro.

## Overview

This codebase runs the TestFeed marketing website. The site is built with Astro, a modern static site generator that combines the best of static sites and dynamic components.

- **Content-driven**: Most content is managed through Markdown files
- **Component-based**: UI is built with reusable components
- **Fast & SEO-friendly**: Optimized for performance and search engines

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Use This Codebase

### Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── content/        # Content files (Markdown)
  │    ├── blog/      # Blog posts
  │    ├── homepage/  # Homepage and landing pages
  │    └── legal/     # Legal pages (privacy, terms)
  ├── layouts/        # Page layouts
  ├── pages/          # Routes/URLs for the website
  ├── scripts/        # JavaScript files
  └── styles/         # CSS styles
```

## Creating New Content

### Creating a New Page

1. **Add content file**: Create a new `.md` file in `src/content/homepage/`
   ```markdown
   ---
   pageTitle: "Page Title | TestFeed"
   pageDescription: "Brief page description for SEO"
   
   # Add any components you want to use
   landingPageHero:
     title: "Main <span class='highlight'>Headline</span>"
     description: "Supporting text that explains the value proposition"
     cta1Text: "Primary Button"
     cta1Link: "#section-id"
     # More hero properties...
   
   featuresSection:
     title: "Features <span class='highlight'>Section</span>"
     features:
       - icon: "star" # Lucide icon name
         title: "Feature Name"
         text: "Feature description text"
       # Add more features...
   
   # Add more sections as needed
   ---
   ```

2. **Create page file**: Add a new `.astro` file in `src/pages/` with the same name
   ```astro
   ---
   import { getCollection } from 'astro:content';
   import BaseLayout from '../layouts/BaseLayout.astro';
   import LandingPageHero from '../components/LandingPageHero.astro';
   import FeaturesSection from '../components/FeaturesSection.astro';
   
   // Get your content
   const pages = await getCollection('homepage');
   const page = pages.find(p => p.slug === 'your-page-name');
   
   if (!page) {
     return new Response(null, { status: 404 });
   }
   ---
   
   <BaseLayout title={page.data.pageTitle} description={page.data.pageDescription}>
     {page.data.landingPageHero && (
       <LandingPageHero {...page.data.landingPageHero} />
     )}
     
     {page.data.featuresSection && (
       <FeaturesSection {...page.data.featuresSection} />
     )}
     
     <!-- Add more components as needed -->
   </BaseLayout>
   ```

### Creating a Blog Post

1. Create a new `.md` file in `src/content/blog/` directory:
   ```markdown
   ---
   pageTitle: "Blog Post Title | TestFeed"
   pageDescription: "Brief description for SEO (150-160 characters)"
   
   articleTitle: "Main Blog Post Title"
   publishDate: 2024-06-15
   author: "Author Name"
   excerpt: "Brief summary for preview cards"
   tags: ["tag1", "tag2"]
   featuredImage: "/assets/images/blog/image.jpg"
   
   finalCtaSection:
     title: "Ready to <span class='highlight'>try TestFeed</span>?"
     text: "Join our waitlist today to get early access."
     buttonText: "Join Waitlist"
     buttonLink: "#signup"
     buttonType: "primary"
   ---
   
   ## First Header
   
   Regular content goes here, written in Markdown.
   
   ## Second Header
   
   More content...
   ```

2. The blog post will automatically appear in the blog listing page and get its own URL at `/blog/your-post-slug`.

## Styling Content

### Basic Text Styling

- Use `<span class='highlight'>text</span>` to highlight important phrases
- Use `<span class='testfeed-font'>testfeed</span>` for the TestFeed logo font

### CSS Variables

The site uses CSS variables for consistent styling. Main variables:

```css
--color-primary: #FFFFFF;       /* Primary color */
--color-secondary: #222222;     /* Secondary color */
--color-text: #FFFFFF;          /* Body text */
--color-text-light: #AAAAAA;    /* Secondary text */
--color-background: #111111;    /* Page background */
--color-card-bg: #222222;       /* Card background */

--spacing-sm: 10px;             /* Small spacing */
--spacing-md: 20px;             /* Medium spacing */
--spacing-lg: 40px;             /* Large spacing */

--border-radius: 10px;          /* Standard border radius */
```

## Creating a New Component

If you need a new component that doesn't exist yet:

1. Create new file in `src/components/YourComponent.astro`
2. Define the component structure and props
3. Update the content schema in `src/content/config.ts` to include the new component
4. Use the component in your pages

## Content Management Tips

- All content is managed in the `/src/content/` directory
- Use descriptive filenames for content files
- SEO fields (`pageTitle`, `pageDescription`) are required for all pages
- Use the template files in `/src/content/_templates/` as starting points

## Development Workflow

1. Make changes to content or code
2. Test changes with `npm run dev`
3. Build and preview with `npm run build` and `npm run preview`

For detailed Astro documentation, visit [docs.astro.build](https://docs.astro.build/).
