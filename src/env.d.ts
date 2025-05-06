/// <reference types="astro/client" />

// Add declarations for Google Tag Manager
interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
} 
