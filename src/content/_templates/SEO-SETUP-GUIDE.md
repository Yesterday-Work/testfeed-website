# TestFeed SEO Setup Guide

This document explains the SEO architecture of the TestFeed website for SEO experts and content managers.

## 🔍 How SEO Works in TestFeed

The TestFeed website is built using Astro, a modern static site generator that creates highly-optimized websites with excellent SEO characteristics by default. Our implementation adds several additional features.

### Core SEO Architecture

1. **Content-Driven SEO**: All SEO metadata is defined in content files (.md) rather than hardcoded in templates
2. **Centralized SEO Management**: SEO tags are managed in `BaseLayout.astro` which powers every page
3. **Fallback System**: Default SEO values are provided in case content files omit required fields

### URL Structure

- Blog posts: `/blog/[post-slug]`
- Landing pages: `/[page-slug]`
- Legal pages: `/privacy-policy` and `/terms-of-service`

### Technical SEO Implementation

1. **Meta Tags**: Title and description are set from frontmatter in content files
2. **OpenGraph & Twitter Cards**: Generated automatically with proper fallbacks for images
3. **Canonical URLs**: Set automatically to the current page URL
4. **Schema.org**: Generated based on page type with custom properties available

## 📊 Analytics & Tracking

- Google Analytics integration is available in `googleAnalytics.js`
- Search Console should be configured via the Google Search Console interface

## 🔄 SEO Workflow

When creating or editing content:

1. Add appropriate frontmatter SEO fields:
   ```yaml
   pageTitle: "Keyword-Rich Title | TestFeed"
   pageDescription: "Compelling meta description with important keywords (150-160 characters)"
   ```

2. For specific page types, add schema markup:
   ```yaml
   schemaMarkup:
     type: "BlogPosting"
     properties:
       datePublished: "2023-05-01"
       author:
         "@type": "Person"
         name: "Author Name"
   ```

3. For enhanced social sharing, add featured images:
   ```yaml
   featuredImage: "/assets/images/your-image.jpg"
   featuredImageAlt: "Descriptive alt text for the image"
   ```

## 🚫 No-Index Pages

By default, all pages are set to `index, follow`. To prevent a page from being indexed:

```yaml
customMeta:
  - name: "robots"
    content: "noindex, follow"
```

## 🔗 Internal Linking Strategy

- Use descriptive anchor text with keywords when linking between pages
- Favor relevant internal links within body content
- Implement proper site navigation with clear hierarchies

## 📱 Mobile Optimization

All pages are responsive by default, using:
- Fluid layouts with responsive CSS
- Viewport meta tag with appropriate settings
- Touch-friendly navigation and UI elements

## 🚀 Performance Optimization

- Images use `loading="lazy"` for below-the-fold content
- Minimal JavaScript used throughout the site
- Font loading is optimized with preconnect links

If you have any questions about the SEO architecture, please contact the development team. 
