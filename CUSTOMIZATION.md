# 🎨 Customization Guide - Ramzaan Perfume Website

This guide helps you customize the website to match your brand and products.

## 🎨 Colors & Branding

### Change Color Scheme

Edit `src/App.css` (lines 11-17):

```css
:root {
  --deep-navy: #0A0F1F;      /* Main background */
  --gold-start: #F8D57E;      /* Gradient start */
  --gold-end: #E5B53C;        /* Gradient end */
  --blue-glow: #3FA2F7;       /* Accent color */
  --text-white: #FFFFFF;      /* Primary text */
  --text-gray: #B8C5D6;       /* Secondary text */
}
```

**Example - Purple Theme:**
```css
:root {
  --deep-navy: #1A0B2E;
  --gold-start: #C77DFF;
  --gold-end: #9D4EDD;
  --blue-glow: #7209B7;
  --text-white: #FFFFFF;
  --text-gray: #E0AAFF;
}
```

### Change Brand Name

1. **Logo/Brand Name (Header)**
   - File: `src/components/Header.jsx` (line 42)
   - Change: `<h1>ALH.</h1>` to your brand name

2. **Footer Brand**
   - File: `src/components/Footer.jsx` (line 19)
   - Change: `<h2 className="footer-brand">ALH.</h2>`

3. **Admin Panel**
   - File: `src/pages/AdminPanel.jsx` (line 98)
   - Change: `<h2>ALH Admin</h2>`

4. **HTML Title**
   - File: `index.html` (line 8)
   - Change: `<title>ALH - Ramzaan Luxury Perfume</title>`

## 🖼️ Images & Media

### Replace Product Image

**Current**: Unsplash placeholder

**To Replace:**

1. Add your image to `public/images/` folder
2. Edit `src/pages/HomePage.jsx` (line 15):

```javascript
const product = {
  id: 'ramzaan-001',
  name: 'Ramzaan',
  price: 1499,
  image: '/images/your-perfume.jpg', // ← Change this
  // ...
};
```

**Recommended Image Specs:**
- Format: JPG or WebP
- Size: 800x800px to 1200x1200px
- Aspect ratio: Square (1:1)
- File size: < 500KB

### Replace Hero Background

Edit `src/pages/HomePage.css` (line 7):

```css
.hero-section {
  background: linear-gradient(135deg, rgba(10, 15, 31, 0.8), rgba(5, 8, 18, 0.9)),
    url('/images/your-hero-background.jpg'); /* ← Change this */
  background-size: cover;
  // ...
}
```

**Recommended Hero Image Specs:**
- Format: JPG or WebP
- Size: 1920x1080px or higher
- Aspect ratio: 16:9
- File size: < 1MB

### Add Your Logo

1. Create logo (PNG with transparency)
2. Save to `public/logo.png`
3. Edit `src/components/Header.jsx`:

```jsx
<Link to="/" className="logo">
  <img src="/logo.png" alt="ALH" style={{ height: '40px' }} />
</Link>
```

## 📝 Content Customization

### Product Details

Edit `src/pages/HomePage.jsx` (lines 11-18):

```javascript
const product = {
  id: 'ramzaan-001',           // Unique product ID
  name: 'Ramzaan',             // Product name
  price: 1499,                 // Price in ₹
  image: 'image-url-here',     // Product image
  description: 'Your description',
  notes: ['Oud', 'Amber', 'Musk'], // Scent notes
};
```

### Hero Text

Edit `src/pages/HomePage.jsx` (lines 87-89):

```jsx
<h1 className="hero-title">
  Your headline here<br />signature scent — <span>Product Name</span>
</h1>
<p className="hero-subtitle">Your tagline here</p>
```

### About Section

Edit `src/pages/HomePage.jsx` (lines 165-172):

```jsx
<p className="about-text fade-in-up">
  Your brand story here...
</p>
```

### Hero Statistics

Edit `src/pages/HomePage.jsx` (lines 97-113):

```jsx
<div className="stat-item">
  <Award size={24} className="stat-icon" />
  <div>
    <h3>90+</h3>              {/* ← Change number */}
    <p>Fragrances Sold</p>    {/* ← Change label */}
  </div>
</div>
```

### Customer Reviews

Edit `src/pages/HomePage.jsx` (lines 20-36):

```javascript
const reviews = [
  {
    id: 1,
    name: 'Customer Name',
    rating: 5,
    text: 'Review text here...',
    date: 'Month Year',
  },
  // Add more reviews...
];
```

## 📞 Contact Information

### Footer Contact Details

Edit `src/components/Footer.jsx` (lines 52-64):

```jsx
<li>
  <Mail size={18} />
  <span>your-email@domain.com</span>
</li>
<li>
  <Phone size={18} />
  <span>+91 XXXXX XXXXX</span>
</li>
<li>
  <MapPin size={18} />
  <span>Your Address Here</span>
</li>
```

### Social Media Links

Edit `src/components/Footer.jsx` (lines 22-32):

```jsx
<a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
  <Facebook size={20} />
</a>
<a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer">
  <Instagram size={20} />
</a>
<a href="https://twitter.com/yourpage" target="_blank" rel="noopener noreferrer">
  <Twitter size={20} />
</a>
```

## 🔧 Functionality Customization

### Change Currency

**From INR (₹) to Another Currency:**

1. **Global Search & Replace:**
   - Find: `₹`
   - Replace with: `$` (or your currency symbol)

2. **Files to Update:**
   - `src/pages/HomePage.jsx`
   - `src/components/CartDropdown.jsx`
   - `src/pages/CheckoutPage.jsx`
   - `src/pages/AdminPanel.jsx`

3. **Razorpay Currency:**
   - Edit `src/pages/CheckoutPage.jsx` (line 36)
   - Change: `currency: 'INR'` to `currency: 'USD'`

### Adjust Default Stock

Edit `src/pages/AdminPanel.jsx` (line 27):

```javascript
const [productData, setProductData] = useState({
  name: 'Ramzaan',
  price: 1499,
  stock: 50, // ← Change default stock
  // ...
});
```

### Change Admin Credentials

Edit `src/context/AuthContext.jsx` (line 34):

```javascript
if (email === 'admin@alh.com' && password === 'admin123') {
  // Change email and password here
}
```

**⚠️ Important:** For production, implement proper backend authentication!

## 🎯 Typography

### Change Fonts

**Current Fonts:**
- Headings: Playfair Display
- Body: Poppins

**To Change:**

1. Edit `src/App.css` (line 1):

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&family=YourBodyFont:wght@300;400;600&display=swap');
```

2. Update font families:

```css
h1, h2, h3, h4 {
  font-family: 'YourFont', serif;
}

body {
  font-family: 'YourBodyFont', sans-serif;
}
```

**Recommended Font Pairings:**
- Elegant: Cormorant + Montserrat
- Modern: Space Grotesk + Inter
- Classic: Crimson Pro + Open Sans
- Luxury: Cinzel + Lato

## 📐 Layout Adjustments

### Container Width

Edit `src/App.css` (lines 84-87):

```css
.container {
  max-width: 1200px; /* ← Change max width */
  margin: 0 auto;
  padding: 0 20px;
}
```

### Button Sizes

Edit `src/App.css` (lines 53-60):

```css
.glow-button {
  padding: 14px 32px; /* ← Adjust padding */
  font-size: 16px;    /* ← Adjust font size */
  // ...
}
```

### Card Spacing

Edit specific component CSS files:

**Example - Product Card:**
`src/pages/HomePage.css` (line 101):

```css
.product-card {
  padding: 60px; /* ← Adjust padding */
  gap: 60px;     /* ← Adjust gap */
}
```

## 🌐 SEO & Meta Tags

### Update Page Title & Description

Edit `index.html` (lines 7-8):

```html
<meta name="description" content="Your SEO description here" />
<title>Your Brand - Product Name</title>
```

### Add More Meta Tags

Add to `index.html` `<head>`:

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Your Brand - Product" />
<meta property="og:description" content="Your description" />
<meta property="og:image" content="https://yoursite.com/og-image.jpg" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Your Brand - Product" />
<meta name="twitter:description" content="Your description" />
<meta name="twitter:image" content="https://yoursite.com/twitter-image.jpg" />

<!-- Additional SEO -->
<meta name="keywords" content="perfume, luxury, fragrance" />
<meta name="author" content="Your Brand Name" />
```

## 📱 Mobile Adjustments

### Adjust Mobile Breakpoints

Edit component CSS files:

```css
/* Default mobile breakpoint */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  /* Tablet styles */
}
```

### Mobile Font Sizes

Edit `src/pages/HomePage.css`:

```css
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem; /* ← Adjust mobile heading size */
  }
}
```

## 🔐 Security Customization

### Change Password Complexity

Add to `src/pages/AccountPage.jsx` in form validation:

```javascript
const validatePassword = (password) => {
  if (password.length < 8) {
    alert('Password must be at least 8 characters');
    return false;
  }
  return true;
};
```

### Add Email Validation

```javascript
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

## 🎁 Add More Products

**To support multiple products:**

1. **Create products data file:**

`src/data/products.js`:
```javascript
export const products = [
  {
    id: 'ramzaan-001',
    name: 'Ramzaan',
    price: 1499,
    image: '/images/ramzaan.jpg',
    description: '...',
    notes: ['Oud', 'Amber', 'Musk'],
  },
  {
    id: 'product-002',
    name: 'Product 2',
    // ...
  },
];
```

2. **Update HomePage to map products:**

```jsx
import { products } from '../data/products';

// In component:
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

## 🚀 Performance Optimization

### Optimize Images

1. **Use WebP format:**
   - Convert JPGs to WebP
   - Smaller file size, better quality

2. **Use lazy loading:**

```jsx
<img 
  src={product.image} 
  alt={product.name}
  loading="lazy"
/>
```

3. **Use CDN for images:**
   - Upload to Cloudinary, imgix, or similar
   - Use optimized URLs

### Code Splitting

For larger apps, split by route:

```javascript
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// In Routes:
<Suspense fallback={<div>Loading...</div>}>
  <Route path="/" element={<HomePage />} />
</Suspense>
```

## 📊 Analytics Integration

### Add Google Analytics

1. **Get GA4 Measurement ID**
2. **Add to `index.html` `<head>`:**

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🎨 Advanced Styling

### Add Custom Animations

Create new animations in `src/App.css`:

```css
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-right {
  animation: slideInRight 0.6s ease-out;
}
```

### Add Dark/Light Mode Toggle

```javascript
const [theme, setTheme] = useState('dark');

const toggleTheme = () => {
  setTheme(theme === 'dark' ? 'light' : 'dark');
  document.body.className = theme;
};
```

Then add CSS for `.light` class.

## 📝 Quick Checklist

Before going live, customize:

- [ ] Brand name in header, footer, admin
- [ ] Product name, price, description
- [ ] Product images
- [ ] Hero background image
- [ ] Contact information
- [ ] Social media links
- [ ] Admin credentials
- [ ] Razorpay keys
- [ ] Meta tags & SEO
- [ ] About section text
- [ ] Customer reviews
- [ ] Color scheme (optional)
- [ ] Fonts (optional)
- [ ] Add your logo

---

## 💡 Tips

1. **Test After Each Change:** Use `npm run dev` to see changes live
2. **Mobile First:** Always check mobile view after changes
3. **Keep Backups:** Git commit after each major change
4. **Performance:** Run `npm run build` and check bundle size
5. **Accessibility:** Maintain good color contrast ratios

## 🆘 Need Help?

If something breaks:
1. Check browser console for errors
2. Verify CSS syntax
3. Ensure imports are correct
4. Clear cache and rebuild
5. Check this guide for correct file paths

---

Happy customizing! 🎨✨
