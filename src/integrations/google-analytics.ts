import type { AstroIntegration } from 'astro';

export default function googleAnalytics(): AstroIntegration {
  return {
    name: 'astro-google-analytics-integration', // Unique name for the integration
    hooks: {
      'astro:config:setup': ({ injectScript, command }) => {
        // Get the GA ID from environment variables (use process.env here because
        // import.meta.env is not populated in integration hooks during build time)
        const gaId = process.env.PUBLIC_GOOGLE_ANALYTICS_ID;

        // Skip injection entirely if no ID is configured, otherwise we'd ship a
        // broken `gtag/js?id=undefined` tag on every page.
        if (!gaId) {
          console.warn(
            "[google-analytics] PUBLIC_GOOGLE_ANALYTICS_ID is not set — skipping Google Analytics injection."
          );
          return;
        }

        // Inject the script loader and the inline config script using 'head-inline'
        injectScript('head-inline', `
          (function() {
            var gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=${gaId}';
            document.head.appendChild(gaScript);

            window.dataLayer = window.dataLayer || [];
            function gtag(){ window.dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', '${gaId}');
          })();
        `);
      }
    }
  };
} 
