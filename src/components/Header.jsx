import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Home, Info, Star, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDropdown from './CartDropdown';
import './Header.css';

// Mobile navigation slide-out component
const MobileNav = ({ isOpen, onClose, onLinkClick }) => {
  const navLinks = [
    { label: 'Home', icon: Home, action: () => { onLinkClick('home'); onClose(); } },
    { label: 'About', icon: Info, action: () => { onLinkClick('about'); onClose(); } },
    { label: 'Reviews', icon: Star, action: () => { onLinkClick('reviews'); onClose(); } },
    { label: 'Contact', icon: Phone, action: () => { onLinkClick('contact'); onClose(); } }
  ];

  return (
    <div className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`}>
      <div className="mobile-nav-drawer">
        <button
          className="mobile-nav-close touch-target"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={24} />
        </button>
        <nav className="mobile-nav-links">
          {navLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <button
                key={index}
                className="mobile-nav-link touch-target"
                onClick={link.action}
              >
                <IconComponent size={20} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const Header = ({ onLogoClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const cartRef = useRef(null);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMobileMenu]);

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
      const headerHeight = document.querySelector('.header').offsetHeight;
      const offsetTop = element.offsetTop - headerHeight - 20; // 20px additional offset for better spacing
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setShowMobileMenu(false);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={onLogoClick}>
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
              className="mobile-menu-toggle touch-target"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Slide-out */}
        <MobileNav
          isOpen={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          onLinkClick={scrollToSection}
        />
      </div>
    </header>
  );
};

export default Header;
