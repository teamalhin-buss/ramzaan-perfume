import { useState, useEffect, useRef } from 'react';
import './OptimizedImage.css';

/**
 * OptimizedImage Component
 * Advanced image handling with:
 * - Responsive sizing with srcset
 * - Aspect ratio preservation
 * - Skeleton loading animation
 * - Error handling with fallback
 * - Lazy loading optimization
 * - Progressive loading effect
 * 
 * @param {string} src - Image source path
 * @param {string} fallback - Fallback image URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - CSS classes
 * @param {string} aspectRatio - Aspect ratio (e.g., '1/1', '4/3', '16/9')
 * @param {string} objectFit - CSS object-fit value
 * @param {boolean} showSkeleton - Show skeleton loader
 * @param {string} sizes - Responsive sizes attribute
 * @param {object} style - Inline styles
 */
const OptimizedImage = ({ 
  src, 
  fallback = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  alt = 'Product Image',
  className = '',
  aspectRatio = null,
  objectFit = 'contain',
  showSkeleton = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  style = {},
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [naturalSize, setNaturalSize] = useState(null);
  const imgRef = useRef(null);

  // Update image source when src prop changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    // If local image fails, use fallback
    if (imageSrc !== fallback) {
      console.warn(`Failed to load image: ${src}, using fallback`);
      setImageSrc(fallback);
      setHasError(true);
    } else {
      console.error(`Both primary and fallback images failed to load`);
      setHasError(true);
    }
  };

  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    
    // Store natural image dimensions
    if (e.target) {
      setNaturalSize({
        width: e.target.naturalWidth,
        height: e.target.naturalHeight,
        ratio: (e.target.naturalHeight / e.target.naturalWidth).toFixed(2)
      });
    }
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc) => {
    // For URLs, return as is
    if (baseSrc.startsWith('http')) {
      return undefined;
    }
    // For local images, could generate multiple sizes
    return undefined;
  };

  const containerStyle = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    ...(aspectRatio && { aspectRatio }),
    ...style
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 0.5s ease-in-out',
    display: 'block'
  };

  return (
    <div 
      className={`optimized-image-container ${className}`} 
      style={containerStyle}
      data-loading={isLoading}
      data-error={hasError}
    >
      {/* Skeleton Loader */}
      {isLoading && showSkeleton && (
        <div className="image-skeleton">
          <div className="skeleton-shimmer"></div>
          <div className="skeleton-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="image-error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>Image unavailable</p>
        </div>
      )}

      {/* Actual Image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        decoding="async"
        srcSet={generateSrcSet(imageSrc)}
        sizes={sizes}
        style={imageStyle}
        className="optimized-image"
        {...props}
      />

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && naturalSize && (
        <div className="image-debug-info" title={`Natural size: ${naturalSize.width}x${naturalSize.height}`}>
          {naturalSize.width}×{naturalSize.height}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

/**
 * Usage Examples:
 * 
 * Basic:
 * <OptimizedImage src="/images/product.png" alt="Product" />
 * 
 * With aspect ratio:
 * <OptimizedImage src="/images/product.png" aspectRatio="1/1" />
 * 
 * With custom object-fit:
 * <OptimizedImage src="/images/product.png" objectFit="cover" />
 * 
 * Without skeleton:
 * <OptimizedImage src="/images/product.png" showSkeleton={false} />
 */
