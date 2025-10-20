import { reviewService } from '../services/firestore';
import { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ReviewForm.css';

const ReviewForm = ({ onClose, onSubmit }) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [name, setName] = useState(user?.name || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      alert('Please write a review');
      return;
    }

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
      alert('Failed to submit review: ' + result.error);
      return;
    }

    if (onSubmit) {
      onSubmit(review);
    }

    alert('✅ Review submitted! It will appear after admin approval.');
    onClose();
  };

  return (
    <div className="review-form-overlay" onClick={onClose}>
      <div className="review-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="review-form-header">
          <h3>Write a Review</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
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
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this fragrance..."
              rows="5"
              required
              maxLength={500}
            ></textarea>
            <span className="char-count">{reviewText.length}/500</span>
          </div>

          <button type="submit" className="submit-review-btn">
            <Send size={18} />
            <span>Submit Review</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
