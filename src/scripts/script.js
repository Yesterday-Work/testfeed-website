document.addEventListener('DOMContentLoaded', function() {
    // Safely initialize Lucide icons with fallback
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide library not available, icons may not display correctly');
        }
    } catch (e) {
        console.warn('Error initializing icons:', e);

    }
    
});   
