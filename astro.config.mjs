// @ts-check
import { defineConfig } from 'astro/config';
import * as dotenv from 'dotenv';
import sitemap from '@astrojs/sitemap';
import googleAnalytics from './src/integrations/google-analytics';
import posthogAnalytics from './src/integrations/posthog';

dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: 'https://testfeed.ai',
  vite: {
    envPrefix: 'PUBLIC_'
  },
  integrations: [
    sitemap(),
    googleAnalytics(),
    posthogAnalytics()
  ]
});
