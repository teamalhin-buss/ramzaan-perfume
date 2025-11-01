import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Heart, Share2, ZoomIn, Minus, Plus, Check, Sparkles } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

// Swipe gesture hook for image galleries
const useSwipe = (onSwipeLeft, onSwipeRight) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEndX.current = 0;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};

const ProductCard = ({ product, onBuyNow, onBottleClick }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageContainerRef = useRef(null);

  // Mock image gallery for swipe demonstration
  const imageGallery = [
    product.image,
    product.image, // Same image for second slide
    product.image // Repeat for demo
  ];

  // Swipe gesture handlers
  const handleSwipeLeft = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageGallery.length);
  };

  const handleSwipeRight = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageGallery.length) % imageGallery.length);
  };

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

  // Enhanced mouse following effect for product card
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // 3D tilt effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / centerY * -10;
    const tiltY = (x - centerX) / centerX * 10;

    card.style.setProperty('--tilt-x', `${tiltX}deg`);
    card.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  // Perfume spray effect on button click
  const createSprayEffect = (buttonElement) => {
    const rect = buttonElement.getBoundingClientRect();
    const particles = [];

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'spray-particle';
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';
      particle.style.setProperty('--random-x', Math.random() * 2 - 1);
      document.body.appendChild(particle);
      particles.push(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1500);
    }
  };

  const handleAddToCart = (e) => {
    addToCart(product, quantity);
    showNotification('Added to cart!');
    createSprayEffect(e.currentTarget);
  };

  const handleBuyNow = (e) => {
    addToCart(product, quantity);
    createSprayEffect(e.currentTarget);
    if (onBuyNow) {
      onBuyNow();
    } else {
      window.location.href = '/checkout';
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showNotification(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('Link copied to clipboard!');
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="enhanced-product-card" onMouseMove={handleMouseMove}>
      {/* Badge */}
      {product.badge && (
        <div className="product-badge">
          <Sparkles size={14} />
          <span>{product.badge}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="product-quick-actions">
        <button 
          className={`action-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <button 
          className="action-btn"
          onClick={handleShare}
          aria-label="Share product"
        >
          <Share2 size={20} />
        </button>
        <button 
          className="action-btn"
          onClick={() => setIsImageZoomed(!isImageZoomed)}
          aria-label="Zoom image"
        >
          <ZoomIn size={20} />
        </button>
      </div>

      <div className={`product-card-grid ${isImageZoomed ? 'image-zoomed' : ''}`}>
        {/* Image Section */}
        <div className="product-image-section">
          <div
            className="product-image-container swipe-container"
            ref={imageContainerRef}
            {...swipeHandlers}
          >
            {imageGallery.map((imageSrc, index) => (
              <div
                key={index}
                className={`swipe-item ${index === currentImageIndex ? 'active' : index < currentImageIndex ? 'prev' : 'next'}`}
              >
                <OptimizedImage
                  src={imageSrc}
                  fallback={product.imageFallback}
                  alt={`${product.name} - View ${index + 1}`}
                  className="product-main-image"
                  aspectRatio="1/1"
                  objectFit="contain"
                  showSkeleton={true}
                  onClick={onBottleClick}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            ))}
            <div className="image-glow"></div>

            {/* Swipe Indicators */}
            {imageGallery.length > 1 && (
              <div className="swipe-indicators">
                {imageGallery.map((_, index) => (
                  <button
                    key={index}
                    className={`swipe-indicator touch-target ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="product-details-section">
          <div className="product-header">
            <h3 className="product-title">{product.name}</h3>
            <div className="product-rating">
              <span className="rating-value">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.averageRating || 5) ? 'filled' : ''}>★</span>
                ))}
              </span>
              <span className="rating-count">({product.totalReviews || 0} reviews)</span>
            </div>
          </div>

          <p className="product-description">{product.description}</p>

          {/* Scent Notes */}
          <div className="product-scent-notes">
            <h4 className="notes-title">
              <Sparkles size={16} />
              Signature Notes
            </h4>
            <div className="notes-grid">
              {product.notes.map((note, index) => (
                <div key={index} className="note-item">
                  <span className="note-dot"></span>
                  <span className="note-text">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature-item">
              <Check size={16} />
              <span>Long-lasting formula</span>
            </div>
            <div className="feature-item">
              <Check size={16} />
              <span>Premium natural ingredients</span>
            </div>
            <div className="feature-item">
              <Check size={16} />
              <span>Made in India</span>
            </div>
          </div>

          {/* Price */}
          <div className="product-pricing">
            <div className="price-info">
              <span className="price-label">Price</span>
              <div className="price-main">
                <span className="currency">₹</span>
                <span className="price-amount">{product.price.toLocaleString()}</span>
              </div>
              <span className="price-note">Inclusive of GST + Free Delivery</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="product-quantity">
            <label htmlFor="quantity-input" className="quantity-label">
              Quantity
            </label>
            <div className="quantity-selector-enhanced">
              <button 
                className="qty-btn"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <input
                id="quantity-input"
                type="number"
                className="qty-input"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                aria-label="Product quantity"
              />
              <button 
                className="qty-btn"
                onClick={incrementQuantity}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-actions-enhanced">
            <button 
              className="btn-add-to-cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            <button 
              className="btn-buy-now"
              onClick={handleBuyNow}
            >
              <span>Buy Now</span>
              <Sparkles size={18} />
            </button>
          </div>

          {/* Guarantee */}
          <div className="product-guarantee">
            <span className="guarantee-icon">✅</span>
            <div className="guarantee-text">
              <strong>100% Authentic Guarantee</strong>
              <p>Free shipping on orders over ₹999 • COD Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Image Zoom Modal */}
      {isImageZoomed && (
        <div className="image-zoom-modal" onClick={() => setIsImageZoomed(false)}>
          <button className="zoom-close touch-target" aria-label="Close zoom">×</button>
          <div className="swipe-container" {...swipeHandlers}>
            {imageGallery.map((imageSrc, index) => (
              <div
                key={index}
                className={`swipe-item ${index === currentImageIndex ? 'active' : index < currentImageIndex ? 'prev' : 'next'}`}
              >
                <OptimizedImage
                  src={imageSrc}
                  fallback={product.imageFallback}
                  alt={`${product.name} - Zoomed View ${index + 1}`}
                  className="zoomed-image"
                  objectFit="contain"
                  showSkeleton={true}
                />
              </div>
            ))}

            {/* Zoom Modal Swipe Indicators */}
            {imageGallery.length > 1 && (
              <div className="swipe-indicators">
                {imageGallery.map((_, index) => (
                  <button
                    key={index}
                    className={`swipe-indicator touch-target ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`View zoomed image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
