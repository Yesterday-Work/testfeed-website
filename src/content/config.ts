import { defineCollection, z } from 'astro:content';

/**
 * TESTFEED CONTENT SYSTEM
 * ----------------------
 * This file defines the structure for content across the site.
 * 
 * HOW TO USE THIS SYSTEM:
 * 1. Content is created in Markdown files (.md) in the src/content/ folders
 * 2. Each page uses these schemas to validate content structure
 * 3. To create a new page, add a .md file with the appropriate structure
 * 
 * CREATING CONTENT FILES:
 * - Each component has a specific data structure (defined below)
 * - You can include or exclude any component on a page
 * - Follow the examples in existing .md files
 */

// Hero component expects these fields
export const heroSchema = z.object({
  title: z.string().describe("Main headline, allows basic HTML like <span class='highlight'>text</span>"),
  description: z.string(),
  cta1Text: z.string().optional().describe("Primary button text (optional)"),
  cta1Link: z.string().optional().describe("Primary button URL or anchor link like '#section'"),
  cta2Text: z.string().optional().describe("Secondary button text (optional)"),
  cta2Link: z.string().optional().describe("Secondary button URL or anchor link"),
});

// Hero component for generic landing pages
export const landingPageHeroSchema = z.object({
  title: z.string().describe("Main headline, allows basic HTML"),
  description: z.string(),
  imageUrl: z.string().optional().describe("Optional: URL for a hero image (relative path from /public or absolute URL)"),
  imageAlt: z.string().optional().describe("Alt text for the hero image (required if imageUrl is provided)"),
  cta1Text: z.string().optional().describe("Primary button text (optional)"),
  cta1Link: z.string().optional().describe("Primary button URL or anchor link"),
  cta2Text: z.string().optional().describe("Secondary button text (optional)"),
  cta2Link: z.string().optional().describe("Secondary button URL or anchor link"),
}).refine(data => !data.imageUrl || (data.imageUrl && data.imageAlt), {
  message: "Image Alt text is required if Image URL is provided",
  path: ["imageAlt"], 
}).describe("Flexible hero section for landing pages, can include an image.");

// Problem Section component expects these fields
export const problemSectionSchema = z.object({
  title: z.string().describe("Section title, allows HTML formatting"),
  cards: z.array(
    z.object({
      icon: z.string().describe("Lucide icon name (e.g., 'trending-down', 'clock', 'shield-off')"),
      title: z.string().describe("Card title"),
      text: z.string().describe("Card description text"),
    })
  ).min(1).describe("Array of problem cards - can have any number of cards"),
  buttonType: z.enum(['primary', 'secondary']).default('primary').optional()
    .describe("Button style - defaults to primary if not specified"),
});

// Video Section component fields
export const videoSectionSchema = z.object({
  title: z.string().describe("Section title, allows HTML formatting"),
  videoId: z.string().describe("YouTube Video ID (e.g., 'Ic-OcghxCuk' from youtube.com/watch?v=Ic-OcghxCuk)"),
});

// How It Works component fields
export const howItWorksSectionSchema = z.object({
  title: z.string().describe("Section title, allows HTML formatting"),
  steps: z.array(
    z.object({
      title: z.string().describe("Step title"),
      text: z.string().describe("Step description text"),
    })
  ).min(1).describe("Array of steps - can have any number of steps")
});

// Features Section component fields
export const featuresSectionSchema = z.object({
  title: z.string().describe("Section title, allows HTML formatting"),
  features: z.array(
    z.object({
      icon: z.string().describe("Lucide icon name (e.g., 'users', 'bar-chart-2')"),
      title: z.string().describe("Feature title"),
      text: z.string().describe("Feature description text"),
    })
  ).min(1).describe("Array of features - can have any number of feature cards")
});

// Use Cases Section component fields
export const useCasesSectionSchema = z.object({
  title: z.string().describe("Section title, allows HTML formatting"),
  useCases: z.array(
    z.object({
      icon: z.string().describe("Lucide icon name (e.g., 'shield', 'bar-chart')"),
      title: z.string().describe("Use case title"),
      text: z.string().describe("Use case description text"),
    })
  ).min(1).describe("Array of use cases - can have any number of use case items")
});

// Platform Support Section component fields
export const platformSupportSectionSchema = z.object({
  title: z.string().describe("Section title, allows HTML formatting"),
  explanation: z.string().describe("Explanatory text that appears below the platforms, allows HTML"),
  platforms: z.array(
    z.object({
      icon: z.string().describe("Lucide icon name (e.g., 'linkedin', 'twitter')"),
      name: z.string().describe("Platform name"),
      status: z.enum(['available', 'coming-soon']).describe("Platform availability status"),
    })
  ).min(1).describe("Array of supported platforms")
});

// Testimonials Section component fields
export const testimonialsSectionSchema = z.object({
  title: z.string().describe("Section title, allows HTML formatting"),
  testimonials: z.array(
    z.object({
      quote: z.string().describe("The testimonial text/quote"),
      name: z.string().describe("Name of the person giving the testimonial"),
      role: z.string().describe("Role or title of the person"),
      avatar: z.string().optional().describe("Optional avatar image path"),
    })
  ).min(1).describe("Array of testimonials - can have any number of testimonial items")
});

// FAQ Section component fields with schema.org markup
export const faqSectionSchema = z.object({
  title: z.string().describe("Section title, allows HTML formatting"),
  faqs: z.array(
    z.object({
      question: z.string().describe("The FAQ question"),
      answer: z.string().describe("The answer to the question, allows HTML formatting"),
    })
  ).min(1).describe("Array of FAQ items - can have any number of questions and answers")
});

// Final CTA Section component fields
export const finalCtaSectionSchema = z.object({
  title: z.string().describe("CTA heading, allows HTML formatting"),
  text: z.string().describe("Supporting text below the heading"),
  buttonText: z.string().describe("Call-to-action button text"),
  buttonLink: z.string().describe("URL or anchor link for the button"),
  buttonType: z.enum(['primary', 'secondary']).default('primary').optional()
    .describe("Button style - defaults to primary if not specified"),
});

/**
 * MAIN CONTENT SCHEMA
 * ------------------
 * This defines all possible sections a page can have.
 * Add new section schemas here when you create new components.
 */
export const contentSchema = z.object({
  // SEO fields - important for search engine optimization
  pageTitle: z.string().optional().describe("Browser tab title - defaults to site name if not provided"),
  pageDescription: z.string().optional().describe("Meta description for SEO - should be 150-160 characters"),
  
  // Schema.org markup for rich results
  schemaMarkup: z.object({
    type: z.string().describe("Schema.org type (e.g., 'WebPage', 'Product', 'Organization')"),
    properties: z.record(z.any()).optional().describe("Additional schema properties as key-value pairs")
  }).optional().describe("Structured data for rich search results"),
  
  // Component fields - all optional so pages can use only what they need
  hero: heroSchema.optional().describe("Original hero section (used on homepage with PostMockup)"),
  landingPageHero: landingPageHeroSchema.optional().describe("Generic hero section for landing pages (can use image)"),
  problemSection: problemSectionSchema.optional().describe("Problem statement section with cards"),
  videoSection: videoSectionSchema.optional().describe("Video demonstration section"),
  howItWorksSection: howItWorksSectionSchema.optional().describe("How it works section with numbered steps"),
  featuresSection: featuresSectionSchema.optional().describe("Features section with feature cards"),
  useCasesSection: useCasesSectionSchema.optional().describe("Use cases section with example applications"),
  platformSupportSection: platformSupportSectionSchema.optional().describe("Supported platforms section"),
  testimonialsSection: testimonialsSectionSchema.optional().describe("Testimonials section with user quotes"),
  faqSection: faqSectionSchema.optional().describe("FAQ section with schema.org markup"),
  finalCtaSection: finalCtaSectionSchema.optional().describe("Final call-to-action section"),
  
  // Add more component schemas as needed
});

/**
 * BLOG CONTENT SCHEMA
 * ------------------
 * This defines the structure for blog posts.
 */
export const blogSchema = z.object({
  // SEO fields - required for blog posts
  pageTitle: z.string().describe("Browser tab title - should include primary keyword"),
  pageDescription: z.string().describe("Meta description for SEO - should be 150-160 characters with primary keyword"),
  
  // Blog-specific metadata
  articleTitle: z.string().describe("The main H1 title displayed on the blog post page"),
  publishDate: z.date().describe("Publication date for the blog post"),
  author: z.string().describe("Author name"),
  featuredImage: z.string().optional().describe("Path to featured image relative to /public"),
  excerpt: z.string().describe("Short excerpt/summary used for previews and SEO"),
  tags: z.array(z.string()).optional().describe("Categories or tags for the blog post"),
  
  // Schema.org markup for rich results
  schemaMarkup: z.object({
    type: z.string().default("BlogPosting").describe("Schema.org type (almost always 'BlogPosting' for blogs)"),
    properties: z.record(z.any()).optional().describe("Additional schema properties as key-value pairs")
  }).optional().describe("Structured data for rich search results"),
  
  // Component fields that can be used in blog posts
  hero: heroSchema.optional().describe("Hero section at the top of the page"),
  problemSection: problemSectionSchema.optional().describe("Problem statement section with cards"),
  finalCtaSection: finalCtaSectionSchema.optional().describe("Final call-to-action section"),
});

/**
 * CONTENT COLLECTIONS
 * ------------------
 * These define the main content types in the site.
 * Each collection uses a schema that enforces content structure.
 */

// Main pages collection 
const homepageCollection = defineCollection({
  type: 'content',
  schema: contentSchema
});

// Blog collection for articles and blog posts
const blogCollection = defineCollection({
  type: 'content',
  schema: blogSchema
});

// Legal pages collection (for privacy policy, terms, etc.)
const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().describe("The full page title (e.g., 'Privacy Policy | testfeed')"),
    description: z.string().describe("Meta description for the page"),
    lastUpdated: z.date().optional().describe("Optional last updated date"),
    // The main body content will come from the Markdown itself
  }),
});

// Export collections
export const collections = {
  'homepage': homepageCollection,
  'blog': blogCollection,
  'legal': legalCollection,
}; 
