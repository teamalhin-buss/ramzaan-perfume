import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <h2 className="footer-brand">Ramzaan</h2>
            <p className="footer-tagline">Experience luxury in every drop</p>
            <div className="social-links">
              <a href="https://www.instagram.com/alh.perfumes/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a onClick={() => scrollToSection('home')}>Home</a></li>
              <li><a onClick={() => scrollToSection('about')}>About</a></li>
              <li><a onClick={() => scrollToSection('reviews')}>Reviews</a></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <Mail size={18} />
                <span>help.alh.in@gmail.com</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+91 7012028379</span>
              </li>
              <li>
                <MapPin size={18} />
                <span>Mongam, Malappuram, Kerala, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>Subscribe to get updates on new fragrances</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button className="subscribe-button">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; 2025 Ramzaan. Made in India. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
