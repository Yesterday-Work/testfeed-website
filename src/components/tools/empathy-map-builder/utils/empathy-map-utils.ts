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

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

export async function exportAsImage(element: HTMLElement): Promise<void> {
  try {
    await loadHtml2Canvas();

    if (typeof (window as any).html2canvas !== 'function') {
      alert('Image export feature is not available. Please try again.');
      return;
    }

    const exportContainer = document.createElement('div');
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.background = '#1a1a1a';
    exportContainer.style.padding = '40px';
    exportContainer.style.borderRadius = '12px';

    const clone = element.cloneNode(true) as HTMLElement;
    
    clone.style.position = 'static';
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.maxWidth = 'none';
    clone.style.width = '800px';
    
    exportContainer.appendChild(clone);

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

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await (window as any).html2canvas(exportContainer, {
      scale: 2,
      backgroundColor: '#1a1a1a',
      logging: false,
      useCORS: true,
      width: 880,
      height: exportContainer.scrollHeight
    });

    document.body.removeChild(exportContainer);

    const link = document.createElement('a');
    link.download = `empathy-map-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

  } catch (error) {
    console.error('Error exporting image:', error);
    alert('Failed to export image. Please try again.');
  }
}

export function clearStoredData(): void {
  try {
    localStorage.removeItem('empathy-map-state');
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

export function generateShareableLink(data: any): string {
  const encoded = btoa(JSON.stringify(data));
  return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
}

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
