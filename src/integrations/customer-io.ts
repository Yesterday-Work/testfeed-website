import type { AstroIntegration } from 'astro';

export default function customerIoAnalytics(): AstroIntegration {
  return {
    name: 'astro-customer-io-analytics-integration',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        // Customer.io Forms handler
        const formsSnippet = `
          (function() {
            var t = document.createElement('script'),
                s = document.getElementsByTagName('script')[0];
            t.async = true;
            t.id    = 'cio-forms-handler';
            t.setAttribute('data-site-id', '19cf5b1c78e47a35342d');
            t.setAttribute('data-base-url', 'https://eu.customerioforms.com');
            t.src = 'https://eu.customerioforms.com/assets/forms.js';
            s.parentNode.insertBefore(t, s);
          })();
        `;

        injectScript('head-inline', formsSnippet);
      }
    }
  };
} 
