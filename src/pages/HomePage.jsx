import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Sparkles, Heart, Award } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ReviewForm from '../components/ReviewForm';
import LoadingScreen from '../components/LoadingScreen';
import { productService, reviewService } from '../services/firestore';
import './HomePage.css';

const HomePage = () => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Add artificial delay to make loading screen visible
        await new Promise(resolve => setTimeout(resolve, 5000));

        const productResult = await productService.getProduct();
        if (productResult.success) {
          setProduct(productResult.data);
        }

        const reviewsResult = await reviewService.getApprovedReviews();
        if (reviewsResult.success) {
          setReviews(reviewsResult.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleReviewSubmit = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  if (loading) {
    return <LoadingScreen isVisible={true} estimatedTime={5000} />;
  }

  return (
    <div className="homepage">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Ramzaan</h1>
              <p className="hero-subtitle">Premium Fragrance</p>
              <button className="btn-primary">
                <ShoppingBag size={20} />
                Shop Now
              </button>
            </div>
            <div className="hero-image">
              <img
                src="/images/perfume-bottle.png"
                alt="Ramzaan Premium Fragrance"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="product-section">
        <div className="container">
          {product && (
            <ProductCard
              product={{
                ...product,
                image: '/images/perfume-bottle.png',
                imageFallback: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
                notes: product.notes ? product.notes.split(', ') : ['Oud', 'Amber', 'Musk'],
                averageRating: 4.8,
                totalReviews: reviews.length,
                badge: 'Bestseller'
              }}
              onBuyNow={() => window.location.href = '/checkout'}
            />
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>About Ramzaan</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>Crafted with premium natural ingredients, Ramzaan offers a sophisticated blend of oud, amber, and musk notes that lasts all day.</p>
              <p>Loved by customers with an average rating of {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'} stars from {reviews.length} reviews.</p>
              <div className="about-features">
                <div className="feature">
                  <Sparkles size={20} />
                  <span>Premium Quality</span>
                </div>
                <div className="feature">
                  <Heart size={20} />
                  <span>Natural Ingredients</span>
                </div>
                <div className="feature">
                  <Award size={20} />
                  <span>Long-lasting</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img
                src="/images/perfume-bottle.png"
                alt="Ramzaan Fragrance"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-header">
            <h2>Customer Reviews</h2>
          </div>

          <div className="reviews-stats">
            <div className="stat">
              <div className="stat-number">{reviews.length}</div>
              <div className="stat-label">Reviews</div>
            </div>
            <div className="stat">
              <div className="stat-number">
                {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
              </div>
              <div className="stat-label">Rating</div>
            </div>
          </div>

          <div className="reviews-grid">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-name">{review.name}</div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                        className={i < review.rating ? 'filled' : ''}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>

          <div className="reviews-actions">
            <button
              className="btn-secondary"
              onClick={() => setShowReviewForm(true)}
            >
              <Star size={18} />
              Write Review
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default HomePage;