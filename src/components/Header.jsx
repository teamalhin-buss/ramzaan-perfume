import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDropdown from './CartDropdown';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const cartRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close cart dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
    };

    if (showCartDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCartDropdown]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowMobileMenu(false);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <h1>ALH.</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links desktop-nav">
            <a onClick={() => scrollToSection('home')} className="nav-link">Home</a>
            <a onClick={() => scrollToSection('about')} className="nav-link">About</a>
            <a onClick={() => scrollToSection('reviews')} className="nav-link">Reviews</a>
            <a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a>
          </nav>

          {/* Right Section */}
          <div className="header-actions">
            {/* Cart Icon */}
            <div 
              className="cart-icon-wrapper"
              ref={cartRef}
            >
              <button 
                className="icon-button"
                onClick={() => setShowCartDropdown(!showCartDropdown)}
              >
                <ShoppingCart size={24} />
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </button>
              {showCartDropdown && <CartDropdown />}
            </div>

            {/* Account Button */}
            <Link to="/account" className="account-button">
              <User size={20} />
              <span>{user ? user.name : 'My Account'}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="mobile-nav">
            <a onClick={() => scrollToSection('home')} className="nav-link">Home</a>
            <a onClick={() => scrollToSection('about')} className="nav-link">About</a>
            <a onClick={() => scrollToSection('reviews')} className="nav-link">Reviews</a>
            <a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
