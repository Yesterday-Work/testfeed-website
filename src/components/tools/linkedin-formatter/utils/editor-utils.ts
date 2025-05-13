/**
 * Helper functions for editor text manipulation
 */

/**
 * Insert a symbol at the cursor position in a textarea
 * @param textarea - The textarea element
 * @param symbol - The symbol to insert
 */
export function insertSymbolAtCursor(
  textarea: HTMLTextAreaElement,
  symbol: string
): void {
  if (!textarea || !symbol) return;
  
  const cursorPos = textarea.selectionStart;
  
  const text = textarea.value;
  const newText = text.substring(0, cursorPos) + symbol + text.substring(cursorPos);
  textarea.value = newText;
  
  textarea.selectionStart = cursorPos + symbol.length;
  textarea.selectionEnd = cursorPos + symbol.length;
  
  textarea.dispatchEvent(new Event('input'));
  
  textarea.focus();
}

/**
 * Copy textarea content to clipboard
 * @param textarea - The textarea element
 * @returns Promise<boolean> - Whether the copy was successful
 */
export async function copyToClipboard(textarea: HTMLTextAreaElement): Promise<boolean> {
  if (!textarea || !navigator.clipboard) {
    console.error('Clipboard API not available or no textarea provided.');
    return false;
  }

  const textToCopy = textarea.value;
  if (!textToCopy) {
    console.warn('No text selected or available in textarea to copy.');
    return false; // Nothing to copy
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}

/**
 * Get character count of textarea content
 * @param textarea - The textarea element
 * @returns number - Character count
 */
export function getCharCount(textarea: HTMLTextAreaElement): number {
  if (!textarea) return 0;
  return textarea.value.length;
} 
