import type { AstroIntegration } from 'astro';

export default function googleAnalytics(measurementId?: string): AstroIntegration {
  return {
    name: 'astro-google-analytics-integration', // Unique name for the integration
    hooks: {
      'astro:config:setup': ({ injectScript, command }) => {
        // Prefer an explicitly passed ID; fall back to the environment variable.
        const gaId = measurementId || process.env.PUBLIC_GOOGLE_ANALYTICS_ID;

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

          // ---- Custom event tracking (delegated, works on every page) ----
          (function(){
            function track(){ (window.dataLayer = window.dataLayer || []).push(arguments); }

            // Clicks: use-case cards / filters, and Book-a-demo CTAs.
            document.addEventListener('click', function(e){
              var t = e.target;
              if (!t || !t.closest) return;

              var card = t.closest('a.uc');
              if (card) {
                var h3 = card.querySelector('h3');
                track('event', 'use_case_click', {
                  use_case: h3 ? h3.textContent.trim() : '',
                  category: card.getAttribute('data-cat') || ''
                });
                return;
              }

              var filterBtn = t.closest('#filters button');
              if (filterBtn) {
                track('event', 'use_case_filter', { filter: filterBtn.getAttribute('data-filter') || '' });
                return;
              }

              var link = t.closest('a[href]');
              if (link && (link.href || '').indexOf('usemotion.com/meet') !== -1) {
                track('event', 'book_demo_click', {
                  link_text: (link.textContent || '').trim().slice(0, 60),
                  page_path: location.pathname
                });
              }
            }, true);

            // Newsletter signups: fire on a valid submit of either footer form.
            document.addEventListener('submit', function(e){
              var form = e.target;
              if (!form || (form.id !== 'foot-signup-form' && form.id !== 'bf-signup-form')) return;
              var input = form.querySelector('input');
              var val = input ? (input.value || '').trim() : '';
              var at = val.indexOf('@');
              if (at > 0 && val.indexOf('.', at) > at + 1) {
                track('event', 'generate_lead', { method: 'newsletter_footer' });
              }
            }, true);
          })();
        `);
      }
    }
  };
} 
