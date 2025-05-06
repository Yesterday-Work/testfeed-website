import type { AstroIntegration } from 'astro';

export default function googleAnalytics(): AstroIntegration {
  return {
    name: 'astro-google-analytics-integration', // Unique name for the integration
    hooks: {
      'astro:config:setup': ({ injectScript, command }) => {
        // Get the GA ID from environment variables (use process.env here because
        // import.meta.env is not populated in integration hooks during build time)
        const gaId = process.env.PUBLIC_GOOGLE_ANALYTICS_ID;

        // Only run if GA_ID is set and we are building for production
        // (or if you want it during development too, adjust the logic)
        if (!gaId) {
          // console.warn(
          //   "PUBLIC_GOOGLE_ANALYTICS_ID is not set in environment variables. Google Analytics script injection skipped."
          // );
          // return;
        }

        // Optional: Only inject in production builds
        // if (command !== 'build') {
        //   console.log("Skipping Google Analytics injection in development mode.");
        //   return;
        // }

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
            console.log('GA Integration: Scripts Injected for ID:', '${gaId}'); // For verification
          })();
        `);
      }
    }
  };
} 
