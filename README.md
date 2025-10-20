# Ramzaan Perfume - ALH E-Commerce Website

A professional, luxury e-commerce website built with React + Vite for selling the signature "Ramzaan" perfume. Features elegant design with glassmorphism, gold gradients, and complete e-commerce functionality including Razorpay payment integration and admin panel.

## 🌟 Features

### Customer Features
- **Elegant Homepage** with hero section, product showcase, customer reviews, and about section
- **Product Details** with scent notes, pricing, and quantity selector
- **Shopping Cart** with localStorage persistence and dropdown preview
- **User Authentication** - Sign up, login, and profile management
- **Checkout Flow** with Razorpay payment integration
- **Order History** - View past orders and status
- **Responsive Design** - Fully mobile and desktop optimized

### Admin Features
- **Dashboard** with key metrics (orders, revenue, customers)
- **Product Management** - Edit product details, pricing, and stock
- **Order Management** - View orders, update status, manage shipping
- **Review Moderation** - Approve or delete customer reviews
- **Analytics** - Track sales and customer data

### Design Features
- Deep navy blue background (#0A0F1F)
- Gold gradient headings (#F8D57E → #E5B53C)
- Glassmorphism cards with soft shadows
- Smooth scroll animations
- Glow effects on buttons
- Curved section dividers
- Premium typography (Playfair Display + Poppins)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Navigate to project folder**
```bash
cd ramzaan-perfume
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Visit `http://localhost:5173`

## 💳 Razorpay Setup

### Get Your Razorpay Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live API keys
4. Copy your **Key ID**

### Add Razorpay Key to Project

Open `src/pages/CheckoutPage.jsx` and replace the placeholder:

```javascript
const options = {
  key: 'YOUR_RAZORPAY_KEY_ID', // ← Replace this with your actual Razorpay Key ID
  amount: getCartTotal() * 100,
  // ... rest of the config
};
```

**Example:**
```javascript
key: 'rzp_test_1234567890abcd',
```

### Testing Payments

Use Razorpay's [test card numbers](https://razorpay.com/docs/payments/payments/test-card-details/):
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits

## 🔐 Admin Access

### Admin Login Credentials
- **Email:** `admin@alh.com`
- **Password:** `admin123`

### Admin Panel URL
Navigate to `/admin` or click "Go to Admin Panel" from your account page when logged in as admin.

### Admin Capabilities
- View dashboard with sales analytics
- Update product details and pricing
- Manage order status (Pending → Processing → Shipped → Delivered)
- Moderate and approve customer reviews
- View customer list

## 📁 Project Structure

```
ramzaan-perfume/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── CartDropdown.jsx
│   │   └── CartDropdown.css
│   ├── context/
│   │   ├── CartContext.jsx
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── HomePage.css
│   │   ├── AccountPage.jsx
│   │   ├── AccountPage.css
│   │   ├── CheckoutPage.jsx
│   │   ├── CheckoutPage.css
│   │   ├── AdminPanel.jsx
│   │   └── AdminPanel.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

## 🌐 Netlify Deployment

### Method 1: Deploy via Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy to Netlify**
```bash
netlify deploy --prod
```

4. **Follow prompts:**
   - Authorize Netlify
   - Create new site or select existing
   - Set publish directory: `dist`

### Method 2: Deploy via Netlify Dashboard

1. **Build your project**
```bash
npm run build
```

2. **Go to [Netlify](https://app.netlify.com/)**
   - Sign in/Sign up
   - Click "Add new site" → "Deploy manually"
   - Drag and drop your `dist` folder

### Method 3: Deploy via Git

1. **Push code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify:**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import from Git"
   - Select your repository
   - Set build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click "Deploy site"

### Environment Variables on Netlify

If needed, add environment variables:
1. Go to Site Settings → Build & Deploy → Environment
2. Add variables like `VITE_RAZORPAY_KEY`

### Custom Domain

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS settings as instructed

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Adding More Products

To extend beyond a single product:

1. Create a products data file
2. Update `HomePage.jsx` to map through products
3. Modify cart context to handle multiple product types
4. Update admin panel for multi-product management

### Customization

**Colors:**
Edit `src/App.css` CSS variables:
```css
:root {
  --deep-navy: #0A0F1F;
  --gold-start: #F8D57E;
  --gold-end: #E5B53C;
  --blue-glow: #3FA2F7;
}
```

**Fonts:**
Change imports in `src/App.css`

**Images:**
Replace image URLs in components with your own

## 📦 Build Output

The production build will be created in the `dist/` folder:
- Optimized JavaScript bundles
- Minified CSS
- Compressed assets
- Ready for deployment

## 🔧 Troubleshooting

### Razorpay Not Working
- Check if Razorpay script is loaded in `index.html`
- Verify your API key is correct
- Check browser console for errors
- Ensure you're using test mode keys for testing

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear cache
npm cache clean --force
```

### Routing Issues on Netlify
Create `public/_redirects` file:
```
/*    /index.html   200
```

This ensures React Router works correctly on Netlify.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design Credits

- Typography: Google Fonts (Playfair Display, Poppins)
- Icons: Lucide React
- Images: Unsplash (placeholder - replace with actual product photos)

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Support

For issues or questions:
1. Check this README
2. Review code comments
3. Check browser console for errors
4. Verify all dependencies are installed

## 🚀 Going Live Checklist

- [ ] Replace placeholder images with actual product photos
- [ ] Add real Razorpay API keys (switch from test to live)
- [ ] Update admin credentials (change default password)
- [ ] Set up proper backend/database (current uses localStorage)
- [ ] Configure custom domain
- [ ] Test checkout flow end-to-end
- [ ] Add SSL certificate (automatic on Netlify)
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Add privacy policy and terms of service pages
- [ ] Test on multiple devices and browsers
- [ ] Configure email notifications for orders
- [ ] Set up customer support contact

## 🎯 Future Enhancements

- Backend API with Node.js/Express
- Database integration (MongoDB, PostgreSQL)
- Email notifications via SendGrid/Mailgun
- Advanced analytics dashboard
- Multiple product variants
- Wishlist functionality
- Product search and filtering
- Customer reviews submission form
- Blog/Content section
- Multi-language support
- Advanced SEO optimization

---

**Built with ❤️ using React + Vite**

For the best experience, host on Netlify's free tier with automatic deployments from Git.
