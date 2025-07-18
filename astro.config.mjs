// @ts-check
import { defineConfig } from 'astro/config';
import * as dotenv from 'dotenv';
import sitemap from '@astrojs/sitemap';
import googleAnalytics from './src/integrations/google-analytics';
import posthogAnalytics from './src/integrations/posthog';
import customerIoAnalytics from './src/integrations/customer-io';
import icon from 'astro-icon';
import rehypeExternalLinks from 'rehype-external-links';

dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: 'https://testfeed.ai',
  vite: {
    envPrefix: 'PUBLIC_'
  },
  markdown: {
    rehypePlugins: [
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
      },
      customPages: [
        'https://testfeed.ai/features',
        'https://testfeed.ai/privacy-policy',
        'https://testfeed.ai/terms-of-service'
      ]
    }),
    googleAnalytics(),
    posthogAnalytics(),
    customerIoAnalytics(),
    icon()
  ]
});
