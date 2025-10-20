import { reviewService } from '../services/firestore';
import { useState } from 'react';
import { Star, Send, X, Heart, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ReviewForm.css';

const ReviewForm = ({ onClose, onSubmit }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      alert('Please share your experience with this fragrance');
      return;
    }

    if (reviewText.trim().length < 10) {
      alert('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const review = {
        id: 'REV' + Date.now(),
        userId: user?.id || 'guest',
        name: name.trim(),
        rating,
        text: reviewText.trim(),
        date: new Date().toLocaleDateString('en-IN', {
          month: 'short',
          year: 'numeric'
        }),
        createdAt: new Date().toISOString(),
        approved: false, // Needs admin approval
      };

      // Save to Firestore
      const result = await reviewService.createReview(review);
      if (!result.success) {
        alert('❌ Failed to submit review. Please try again.');
        return;
      }

      if (onSubmit) {
        onSubmit(review);
      }

      // Success message with better UX
      alert('🎉 Thank you for your review! It will be published after admin approval.');
      onClose();
    } catch (error) {
      console.error('Review submission error:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-overlay" onClick={onClose}>
      <div className="review-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="review-form-header">
          <div className="header-content">
            <div className="header-icon">
              <Sparkles size={24} />
            </div>
            <div>
              <h3>Share Your Experience</h3>
              <p className="header-subtitle">Help others discover this fragrance</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>
              <Heart size={16} style={{ marginRight: '8px' }} />
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we call you?"
              required
              maxLength={50}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label>
              <Award size={16} style={{ marginRight: '8px' }} />
              How would you rate this fragrance?
            </label>
            <div className="rating-section">
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={32}
                      fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                      className={(hoverRating || rating) >= star ? 'active' : ''}
                    />
                  </button>
                ))}
              </div>
              <div className="rating-text">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>
              <Sparkles size={16} style={{ marginRight: '8px' }} />
              Share your thoughts
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience with Ramzaan fragrance...

What did you love about the scent? How does it make you feel? Does it last all day? Any special occasions you've worn it?

Share your honest thoughts - your review helps others discover this fragrance! ✨"
              rows="8"
              required
              maxLength={500}
              className={reviewText.length > 450 ? 'near-limit' : ''}
              autoComplete="off"
              spellCheck="true"
            ></textarea>
            <div className="textarea-footer">
              <div className="char-count-container">
                <span className={`char-count ${reviewText.length > 450 ? 'warning' : ''}`}>
                  {reviewText.length}/500
                </span>
                {reviewText.length > 450 && (
                  <span className="char-warning">⚠️ Approaching limit</span>
                )}
              </div>
              <div className="writing-tips">
                <small>💡 Tip: Be specific about scent, longevity, and occasions</small>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-review-btn"
              disabled={isSubmitting || !reviewText.trim() || reviewText.length < 10}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Share Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
