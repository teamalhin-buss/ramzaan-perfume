import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const loadData = async () => {
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
    };

    loadData();
  }, []);

  const handleBuyNow = () => {
    window.location.href = '/checkout';
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
      <Header />

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <div className="hero-badge">
                <Sparkles size={16} />
                <span>Premium Collection</span>
              </div>
              
              <h1 className="hero-title">
                Ramzaan
              </h1>
              
              <p className="hero-subtitle">
                Timeless elegance in every drop
              </p>
              
              <div className="hero-cta-group">
                <button 
                  className="hero-cta-primary"
                  onClick={() => document.getElementById('product').scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>Discover</span>
                  <ArrowRight size={20} />
                </button>
                <button 
                  className="hero-cta-secondary"
                  onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Minimal Stats */}
            <div className="hero-stats">
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
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Check size={24} />
              </div>
              <h3>Premium Quality</h3>
              <p>100% natural ingredients</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Check size={24} />
              </div>
              <h3>Long-Lasting</h3>
              <p>All-day fragrance</p>
            </div>
            <div className="feature-card">
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
      <section className="product-section" id="product">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Signature Fragrance</h2>
            <p className="section-subtitle">Discover the essence of luxury</p>
          </div>
          
          <ProductCard product={product} onBuyNow={handleBuyNow} />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="section-header">
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
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
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
            <div className="review-card write-review-card" onClick={() => setShowReviewForm(true)}>
              <div className="write-review-content">
                <div className="write-review-icon">
                  <Sparkles size={48} />
                </div>
                <h3>Share Your Experience</h3>
                <p>Help others discover this fragrance by writing a review</p>
                <button className="write-review-card-btn">
                  <Star size={16} />
                  <span>Write a Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text-block">
              <h2 className="section-title">About Ramzaan</h2>
              <p className="about-text">
                Inspired by the essence of purity and devotion, Ramzaan captures the spirit of timeless elegance. 
                Each note has been carefully curated to create an unforgettable olfactory experience.
              </p>
              <p className="about-text">
                Crafted with premium natural ingredients from around the world. Made in India with expertise in 
                traditional perfumery, this signature fragrance embodies sophistication and luxury in every drop.
              </p>
              <button 
                className="about-cta"
                onClick={() => document.getElementById('product').scrollIntoView({ behavior: 'smooth' })}
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
  );
};

export default HomePage;
