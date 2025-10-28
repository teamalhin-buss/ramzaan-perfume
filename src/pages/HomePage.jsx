import { useState, useEffect, useRef } from 'react';
import { Star, Award, Users, ArrowRight, Check, Sparkles, Filter, SortDesc } from 'lucide-react';
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
  const [averageRating, setAverageRating] = useState(5.0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;
  const [reviewVotes, setReviewVotes] = useState({});

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
        setTotalReviews(reviewsResult.data.length);

        // Calculate average rating
        if (reviewsResult.data.length > 0) {
          const totalRating = reviewsResult.data.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / reviewsResult.data.length;
          setAverageRating(Math.round(avgRating * 10) / 10); // Round to 1 decimal place
        } else {
          setAverageRating(5.0); // Default rating when no reviews
        }
      }

      // Hide loading screen after data is loaded
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Enhanced Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: [0.1, 0.3, 0.5],
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, sectionId]));
          // Add staggered animation classes
          const children = entry.target.querySelectorAll('.animate-slide-up-delay-1, .animate-slide-up-delay-2, .animate-slide-up-delay-3, .animate-slide-up-delay-4');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-triggered');
            }, index * 150);
          });
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax effect for hero background
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroSection = sectionRefs.current.home;
      if (heroSection) {
        const background = heroSection.querySelector('::before');
        if (background) {
          const rate = scrolled * -0.5;
          background.style.transform = `translateY(${rate}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced mouse following effect for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.feature-card, .review-card, .enhanced-product-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle system for background effects
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 20000);
    };

    const particleInterval = setInterval(createParticle, 3000);
    return () => clearInterval(particleInterval);
  }, []);

  // Typing effect for hero title
  useEffect(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !heroTitle.hasAttribute('data-typed')) {
      heroTitle.setAttribute('data-typed', 'true');
      const text = heroTitle.textContent;
      heroTitle.textContent = '';
      let i = 0;

      const typeWriter = () => {
        if (i < text.length) {
          heroTitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        }
      };

      setTimeout(typeWriter, 1000);
    }
  }, []);

  // Scroll progress indicator
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      const progressBar = document.querySelector('.scroll-progress-bar');
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  // Konami Code Easter Egg
  useEffect(() => {
    let konamiCode = [];
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    const handleKeyPress = (e) => {
      konamiCode.push(e.code);

      if (konamiCode.length > secretCode.length) {
        konamiCode.shift();
      }

      if (JSON.stringify(konamiCode) === JSON.stringify(secretCode)) {
        // Unlock secret perfume collection
        setShowSecretCollection(true);
        // Create a custom notification function
        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        notification.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>🎉 Secret Collection Unlocked! ✨</span>
        `;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
        konamiCode = [];
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Hidden click counters for Easter eggs
  const [clickCounts, setClickCounts] = useState({
    logo: 0,
    bottle: 0,
    footer: 0
  });

  const [showSecretCollection, setShowSecretCollection] = useState(false);
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);

  const handleBuyNow = () => {
    window.location.href = '/checkout';
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for sticky header
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleReviewSubmit = (newReview) => {
    // Refresh reviews after submission
    const loadReviews = async () => {
      const reviewsResult = await reviewService.getApprovedReviews();
      if (reviewsResult.success) {
        setReviews(reviewsResult.data);
        setTotalReviews(reviewsResult.data.length);

        // Recalculate average rating
        if (reviewsResult.data.length > 0) {
          const totalRating = reviewsResult.data.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / reviewsResult.data.length;
          setAverageRating(Math.round(avgRating * 10) / 10);
        }
      }
    };
    loadReviews();
  };

  const handleVote = (reviewId, voteType) => {
    setReviewVotes(prev => ({
      ...prev,
      [reviewId]: {
        ...prev[reviewId],
        [voteType]: (prev[reviewId]?.[voteType] || 0) + 1,
        voted: true
      }
    }));
  };

  // Sort and filter reviews
  const getFilteredAndSortedReviews = () => {
    let filteredReviews = [...reviews];

    // Apply rating filter
    if (filterRating !== 'all') {
      filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filterRating));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filteredReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    return filteredReviews;
  };

  // Get paginated reviews
  const getPaginatedReviews = () => {
    const filteredReviews = getFilteredAndSortedReviews();
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return filteredReviews.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(getFilteredAndSortedReviews().length / reviewsPerPage);

  // Mystery item handlers
  const handleLogoTripleClick = () => {
    setClickCounts(prev => ({ ...prev, logo: prev.logo + 1 }));
    if (clickCounts.logo + 1 === 3) {
      // Create a custom notification function
      const notification = document.createElement('div');
      notification.className = 'toast-notification';
      notification.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>🌟 You found the hidden message! Check the console...</span>
      `;
      document.body.appendChild(notification);

      console.log('🎉 SECRET: The true essence of Ramzaan lies in the journey, not the destination. - ALH');
      setShowHiddenMessage(true);
      setTimeout(() => setShowHiddenMessage(false), 5000);

      // Remove notification after 3 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleBottleDoubleClick = () => {
    setClickCounts(prev => ({ ...prev, bottle: prev.bottle + 1 }));
    if (clickCounts.bottle + 1 === 2) {
      // Create a custom notification function
      const notification = document.createElement('div');
      notification.className = 'toast-notification';
      notification.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>💫 A mysterious scent fills the air...</span>
      `;
      document.body.appendChild(notification);

      // Trigger special animation
      const bottle = document.querySelector('.product-main-image');
      if (bottle) {
        bottle.style.animation = 'mysteryGlow 2s ease-in-out';
        setTimeout(() => bottle.style.animation = '', 2000);
      }

      // Remove notification after 3 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleFooterSecretClick = () => {
    setClickCounts(prev => ({ ...prev, footer: prev.footer + 1 }));
    if (clickCounts.footer + 1 === 5) {
      // Create a custom notification function
      const notification = document.createElement('div');
      notification.className = 'toast-notification';
      notification.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>🔮 The ancient formula reveals itself...</span>
      `;
      document.body.appendChild(notification);

      // Show secret modal or effect
      setShowSecretCollection(true);

      // Remove notification after 3 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };

  return (
    <div className="home-page">
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress">
        <div className="scroll-progress-bar"></div>
      </div>

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
        <Header onLogoClick={handleLogoTripleClick} />

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
                <div className="stat-number">{averageRating}</div>
                <div className="stat-label">Rating</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">{totalReviews}</div>
                <div className="stat-label">Reviews</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">1</div>
                <div className="stat-label">Cities</div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
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
            <ProductCard
              product={{
                ...product,
                averageRating,
                totalReviews
              }}
              onBuyNow={handleBuyNow}
              onBottleClick={handleBottleDoubleClick}
            />
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

            {/* Review Controls */}
            <div className="review-controls">
              <div className="control-group">
                <Filter size={16} />
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="control-group">
                <SortDesc size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>

              <button
                className="write-review-btn"
                onClick={() => setShowReviewForm(true)}
              >
                <Star size={16} />
                <span>Write a Review</span>
              </button>
            </div>
          </div>

          <div className="reviews-grid">
            {getPaginatedReviews().map((review, index) => (
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
                    <div className="author-name">
                      {review.name}
                      {review.verified && (
                        <span className="verified-badge" title="Verified Purchase">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <div className="review-date">{review.date}</div>
                  </div>
                </div>
 
                {/* Helpfulness voting */}
                <div className="review-helpfulness">
                  <span className="helpfulness-text">Was this helpful?</span>
                  <button
                    className={`helpfulness-btn ${reviewVotes[review.id]?.voted ? 'voted' : ''}`}
                    onClick={() => handleVote(review.id, 'helpful')}
                    disabled={reviewVotes[review.id]?.voted}
                    title="Yes"
                  >
                    👍 {(review.helpful || 0) + (reviewVotes[review.id]?.helpful || 0)}
                  </button>
                  <button
                    className={`helpfulness-btn ${reviewVotes[review.id]?.voted ? 'voted' : ''}`}
                    onClick={() => handleVote(review.id, 'notHelpful')}
                    disabled={reviewVotes[review.id]?.voted}
                    title="No"
                  >
                    👎 {(review.notHelpful || 0) + (reviewVotes[review.id]?.notHelpful || 0)}
                  </button>
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

      {/* Secret Collection Modal */}
      {showSecretCollection && (
        <div className="secret-modal-overlay" onClick={() => setShowSecretCollection(false)}>
          <div className="secret-modal" onClick={(e) => e.stopPropagation()}>
            <button className="secret-close" onClick={() => setShowSecretCollection(false)}>×</button>
            <div className="secret-content">
              <h2>🔮 The Hidden Collection</h2>
              <p>You've discovered the legendary ALH secret fragrances...</p>
              <div className="secret-perfumes">
                <div className="secret-perfume">
                  <div className="secret-icon">🌙</div>
                  <h3>Midnight Oud</h3>
                  <p>The forbidden essence of the desert night</p>
                </div>
                <div className="secret-perfume">
                  <div className="secret-icon">⭐</div>
                  <h3>Celestial Amber</h3>
                  <p>Whispers from the stars above</p>
                </div>
                <div className="secret-perfume">
                  <div className="secret-icon">🌸</div>
                  <h3>Mystic Rose</h3>
                  <p>The eternal bloom of hidden gardens</p>
                </div>
              </div>
              <p className="secret-note">These fragrances are reserved for the worthy. Contact us for exclusive access.</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Message Toast */}
      {showHiddenMessage && (
        <div className="hidden-message-toast">
          <div className="message-icon">💫</div>
          <div className="message-content">
            <h4>Secret Discovered!</h4>
            <p>The true essence lies in the journey...</p>
          </div>
        </div>
      )}

        <Footer onSecretClick={handleFooterSecretClick} />
      </div>
    </div>
  );
};

export default HomePage;
