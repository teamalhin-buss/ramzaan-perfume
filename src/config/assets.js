/**
 * Asset Configuration
 * Central location for all image and asset paths
 * 
 * To use your own images:
 * 1. Add images to public/images/ folder
 * 2. Update the paths below
 * 3. Rebuild the project
 */

export const ASSETS = {
  // Product Images (PNG format for transparency and quality)
  product: {
    main: '/images/perfume-bottle.png',
    // Fallback to Unsplash if local image doesn't exist
    fallback: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  },

  // Hero Section
  hero: {
    background: '/images/hero-background.png',
    fallback: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600&q=80',
  },

  // Branding
  logo: {
    main: '/images/logo.png',
    // Alternative: Use text logo if image doesn't exist
    useText: true, // Set to false when you add logo.png
  },

  // Icons
  icons: {
    favicon: '/icons/favicon.ico',
    favicon192: '/icons/favicon-192.png',
    favicon512: '/icons/favicon-512.png',
  },

  // About Section (optional)
  about: {
    background: '/images/about-background.png',
    fallback: null, // No background by default
  },
};

/**
 * Helper function to get image path with fallback
 * @param {string} category - Asset category (e.g., 'product', 'hero')
 * @param {string} key - Asset key (e.g., 'main', 'background')
 * @returns {string} Image path or fallback
 */
export const getAssetPath = (category, key = 'main') => {
  const asset = ASSETS[category];
  if (!asset) return '';
  
  // Return main path, fallback to fallback if specified
  return asset[key] || asset.fallback || '';
};

/**
 * Check if we should use local assets or fallbacks
 * In production, you'll want to use local assets
 */
export const USE_LOCAL_ASSETS = false; // Set to true when you add your images

export default ASSETS;
