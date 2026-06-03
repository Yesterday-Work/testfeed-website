// @ts-check
import { defineConfig } from 'astro/config';
import * as dotenv from 'dotenv';
import sitemap from '@astrojs/sitemap';
import googleAnalytics from './src/integrations/google-analytics';
import posthogAnalytics from './src/integrations/posthog';
import customerIoAnalytics from './src/integrations/customer-io';
import icon from 'astro-icon';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: 'https://testfeed.ai',
  trailingSlash: 'always',
  redirects: {
    '/blog/ai_market_research_guide': '/blog/ai-market-research-guide',
    '/blog/potentially_sensitive_language': '/blog/potentially-sensitive-language',
  },
  vite: {
    envPrefix: 'PUBLIC_'
  },
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer']
      }]
    ]
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => {
        // Include all pages except draft blog posts
        return !page.includes('draft');
      }
    }),
    googleAnalytics(),
    posthogAnalytics(),
    customerIoAnalytics(),
    icon()
  ]
});
