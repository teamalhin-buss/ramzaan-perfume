import { useState, useEffect, useRef } from 'react';
import { Star, Award, Users, ArrowRight, Check, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ReviewForm from '../components/ReviewForm';
import { ASSETS } from '../config/assets';
import { reviewService, productService } from '../services/firestore';
import './HomePage.css';

const HomePage = () => {
  const [product, setProduct] = useState({
    id: 'ramzaan-001',
    name: 'Ramzaan',
    price: 150,
    image: ASSETS.product.main,
    imageFallback: ASSETS.product.fallback,
    description: 'A masterfully crafted fragrance that embodies sophistication, luxury, and timeless elegance in every drop.',
    notes: ['Inspired by CR7'],
    badge: 'Premium',
  });

  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const sectionRefs = useRef({});

  useEffect(() => {
    const loadData = async () => {
      // Simulate loading time for the loading screen
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Load product data from Firestore
      const productResult = await productService.getProduct();
      if (productResult.success) {
        setProduct(prevProduct => ({
          ...prevProduct,
          ...productResult.data,
          image: ASSETS.product.main, // Keep static assets
          imageFallback: ASSETS.product.fallback,
          notes: productResult.data.notes ? productResult.data.notes.split(', ') : ['Inspired by CR7'],
        }));
      }

      // Load approved reviews from Firestore
      const reviewsResult = await reviewService.getApprovedReviews();
      if (reviewsResult.success) {
        setReviews(reviewsResult.data);
      }

      // Hide loading screen after data is loaded
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleBuyNow = () => {
    window.location.href = '/checkout';
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleReviewSubmit = (newReview) => {
    // Refresh reviews after submission
    const loadReviews = async () => {
      const reviewsResult = await reviewService.getApprovedReviews();
      if (reviewsResult.success) {
        setReviews(reviewsResult.data);
      }
    };
    loadReviews();
  };

  return (
    <div className="home-page">
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="perfume-bottle">
              <div className="bottle-silhouette">
                <div className="bottle-neck"></div>
                <div className="bottle-body">
                  <div className="bottle-label"></div>
                </div>
                <div className="bottle-cap"></div>
              </div>
              <div className="mist-particles">
                <div className="mist-particle particle-1"></div>
                <div className="mist-particle particle-2"></div>
                <div className="mist-particle particle-3"></div>
                <div className="mist-particle particle-4"></div>
                <div className="mist-particle particle-5"></div>
                <div className="mist-particle particle-6"></div>
              </div>
              <div className="droplets">
                <div className="droplet droplet-1"></div>
                <div className="droplet droplet-2"></div>
                <div className="droplet droplet-3"></div>
              </div>
            </div>
            <div className="loading-text">
              <h1 className="brand-name">Ramzaan</h1>
              <p className="tagline">Timeless elegance in every drop</p>
              <div className="loading-progress">
                <div className="progress-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`main-content ${!isLoading ? 'loaded' : ''}`}>
        <Header />

      {/* Hero Section */}
      <section
        className={`hero-section ${visibleSections.has('home') ? 'animate-in' : ''}`}
        id="home"
        ref={(el) => sectionRefs.current.home = el}
      >
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <div className="hero-badge animate-fade-in">
                <Sparkles size={16} />
                <span>Premium Collection</span>
              </div>

              <h1 className="hero-title animate-slide-up">
                Ramzaan
              </h1>

              <p className="hero-subtitle animate-fade-in-delay">
                Timeless elegance in every drop
              </p>

              <div className="hero-cta-group animate-fade-in-delay-2">
                <button
                  className="hero-cta-primary"
                  onClick={() => scrollToSection('product')}
                >
                  <span>Discover</span>
                  <ArrowRight size={20} />
                </button>
                <button
                  className="hero-cta-secondary"
                  onClick={() => scrollToSection('about')}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Minimal Stats */}
            <div className="hero-stats animate-fade-in-delay-3">
              <div className="stat-item">
                <div className="stat-number">5.0</div>
                <div className="stat-label">Rating</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">5</div>
                <div className="stat-label">Customers</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">1</div>
                <div className="stat-label">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`features-section ${visibleSections.has('features') ? 'animate-in' : ''}`}
        id="features"
        ref={(el) => sectionRefs.current.features = el}
      >
        <div className="container">
          <div className="features-grid">
            <div className="feature-card animate-slide-up-delay-1">
              <div className="feature-icon">
                <Check size={24} />
              </div>
              <h3>Premium Quality</h3>
              <p>100% natural ingredients</p>
            </div>
            <div className="feature-card animate-slide-up-delay-2">
              <div className="feature-icon">
                <Check size={24} />
              </div>
              <h3>Long-Lasting</h3>
              <p>All-day fragrance</p>
            </div>
            <div className="feature-card animate-slide-up-delay-3">
              <div className="feature-icon">
                <Check size={24} />
              </div>
              <h3>Luxury Packaging</h3>
              <p>Perfect for gifting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlight Section */}
      <section
        className={`product-section ${visibleSections.has('product') ? 'animate-in' : ''}`}
        id="product"
        ref={(el) => sectionRefs.current.product = el}
      >
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Signature Fragrance</h2>
            <p className="section-subtitle">Discover the essence of luxury</p>
          </div>

          <div className="animate-slide-up-delay-1">
            <ProductCard product={product} onBuyNow={handleBuyNow} />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        className={`reviews-section ${visibleSections.has('reviews') ? 'animate-in' : ''}`}
        id="reviews"
        ref={(el) => sectionRefs.current.reviews = el}
      >
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Customer Reviews</h2>
            <p className="section-subtitle">Trusted across India</p>
            <button
              className="write-review-btn"
              onClick={() => setShowReviewForm(true)}
            >
              <Star size={16} />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <div key={review.id} className={`review-card animate-slide-up-delay-${(index % 3) + 1}`}>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  <div className="author-avatar">{review.name.charAt(0)}</div>
                  <div>
                    <div className="author-name">{review.name}</div>
                    <div className="review-date">{review.date}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Always show the write review card */}
            <div className="review-card write-review-card animate-slide-up-delay-4" onClick={() => setShowReviewForm(true)}>
              <div className="write-review-content">
                <div className="write-review-icon">
                  <Sparkles size={48} />
                </div>
                <h3>Share Your Experience</h3>
                <p>Help others discover this fragrance by writing a review</p>
                <div className="write-review-benefits">
                  <span className="benefit-tag">⭐ Rate & Review</span>
                  <span className="benefit-tag">💝 Help Others</span>
                  <span className="benefit-tag">🎯 Build Community</span>
                </div>
                <button className="write-review-card-btn" onClick={(e) => {
                  e.stopPropagation();
                  setShowReviewForm(true);
                }}>
                  <Star size={16} />
                  <span>Write a Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        className={`about-section ${visibleSections.has('about') ? 'animate-in' : ''}`}
        id="about"
        ref={(el) => sectionRefs.current.about = el}
      >
        <div className="container">
          <div className="about-content">
            <div className="about-text-block animate-fade-in">
              <h2 className="section-title">About Ramzaan</h2>
              <p className="about-text animate-fade-in-delay">
                Inspired by the essence of purity and devotion, Ramzaan captures the spirit of timeless elegance.
                Each note has been carefully curated to create an unforgettable olfactory experience.
              </p>
              <p className="about-text animate-fade-in-delay-2">
                Crafted with premium natural ingredients from around the world. Made in India with expertise in
                traditional perfumery, this signature fragrance embodies sophistication and luxury in every drop.
              </p>
              <button
                className="about-cta animate-fade-in-delay-3"
                onClick={() => scrollToSection('product')}
              >
                <span>Explore Collection</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
