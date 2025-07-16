/**
 * Utility functions for empathy map builder
 */

// Load html2canvas script dynamically
let html2canvasLoaded = false;

async function loadHtml2Canvas(): Promise<void> {
  if (html2canvasLoaded) return;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    script.onload = () => {
      html2canvasLoaded = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Save data to localStorage
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load data from localStorage
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Export empathy map as image
 */
export async function exportAsImage(element: HTMLElement): Promise<void> {
  try {
    // Load html2canvas if not already loaded
    await loadHtml2Canvas();

    // Check if html2canvas is available
    if (typeof (window as any).html2canvas !== 'function') {
      alert('Image export feature is not available. Please try again.');
      return;
    }

    // Create a container for export
    const exportContainer = document.createElement('div');
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.background = '#1a1a1a'; // Dark background
    exportContainer.style.padding = '40px';
    exportContainer.style.borderRadius = '12px';

    // Clone the empathy map
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Ensure proper styling for export
    clone.style.position = 'static';
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.maxWidth = 'none';
    clone.style.width = '800px';
    
    exportContainer.appendChild(clone);

    // Add watermark
    const watermark = document.createElement('div');
    watermark.textContent = 'Created with TestFeed Empathy Map Builder';
    watermark.style.position = 'absolute';
    watermark.style.bottom = '10px';
    watermark.style.right = '20px';
    watermark.style.fontSize = '12px';
    watermark.style.color = 'rgba(255, 255, 255, 0.5)';
    watermark.style.fontFamily = 'Arial, sans-serif';
    exportContainer.appendChild(watermark);

    document.body.appendChild(exportContainer);

    // Wait a moment for rendering
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate canvas
    const canvas = await (window as any).html2canvas(exportContainer, {
      scale: 2,
      backgroundColor: '#1a1a1a',
      logging: false,
      useCORS: true,
      width: 880, // 800 + padding
      height: exportContainer.scrollHeight
    });

    // Clean up
    document.body.removeChild(exportContainer);

    // Create download
    const link = document.createElement('a');
    link.download = `empathy-map-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

  } catch (error) {
    console.error('Error exporting image:', error);
    alert('Failed to export image. Please try again.');
  }
}

/**
 * Clear all localStorage data for empathy map
 */
export function clearStoredData(): void {
  try {
    localStorage.removeItem('empathy-map-state');
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Generate a shareable link (for future implementation)
 */
export function generateShareableLink(data: any): string {
  // This could be expanded to create shareable links in the future
  const encoded = btoa(JSON.stringify(data));
  return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
}

/**
 * Parse data from URL (for future implementation)
 */
export function parseDataFromUrl(): any | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    return data ? JSON.parse(atob(data)) : null;
  } catch (error) {
    console.error('Failed to parse data from URL:', error);
    return null;
  }
} 
