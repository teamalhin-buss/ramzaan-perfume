# ⚡ Quick Reference Card

## 🚀 Essential Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 Important URLs & Credentials

### Local Development
- **Homepage:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **Account Page:** http://localhost:5173/account
- **Checkout:** http://localhost:5173/checkout

### Admin Login
- **Email:** admin@alh.com
- **Password:** admin123

### Razorpay Test Cards
- **Card:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits

## 📁 Key Files to Edit

### Branding
- `src/components/Header.jsx` - Line 42: Brand name
- `index.html` - Line 8: Page title
- `src/components/Footer.jsx` - Line 19: Footer brand

### Product Details
- `src/pages/HomePage.jsx` - Lines 11-18: Product info

### Contact Info
- `src/components/Footer.jsx` - Lines 52-64: Contact details

### Colors
- `src/App.css` - Lines 11-17: Color variables

### Razorpay
- `src/pages/CheckoutPage.jsx` - Line 35: API key

## 🎨 Quick Color Changes

```css
/* src/App.css */
:root {
  --deep-navy: #0A0F1F;    /* Background */
  --gold-start: #F8D57E;    /* Accent start */
  --gold-end: #E5B53C;      /* Accent end */
  --blue-glow: #3FA2F7;     /* Highlights */
}
```

## 📦 Project Structure

```
src/
├── components/      # Header, Footer, Cart
├── context/         # State management
├── pages/           # Main pages
├── utils/           # Helper functions
├── App.jsx          # Router setup
└── main.jsx         # Entry point
```

## 🌐 Deployment (Netlify)

### Method 1: Drag & Drop
```bash
npm run build
# Drag 'dist' folder to netlify.com/drop
```

### Method 2: Git
1. Push to GitHub
2. Import in Netlify
3. Build: `npm run build`
4. Publish: `dist`

## 🔧 Common Tasks

### Add New Product Image
1. Save image to `public/images/`
2. Update `src/pages/HomePage.jsx` line 15

### Change Admin Password
- Edit `src/context/AuthContext.jsx` line 34

### Update Social Links
- Edit `src/components/Footer.jsx` lines 22-32

### Modify Hero Text
- Edit `src/pages/HomePage.jsx` lines 87-89

## 🐛 Quick Fixes

### Build fails
```bash
rm -rf node_modules
npm install
npm run build
```

### Routes not working on Netlify
- Check `public/_redirects` exists
- Verify `netlify.toml` is present

### Cart not persisting
- Check browser localStorage enabled
- Clear cache and retry

## 📊 Browser DevTools

### Test Responsive
- Chrome: F12 → Toggle device toolbar
- Test breakpoints: 375px, 768px, 1024px, 1920px

### Debug Cart
```javascript
// In browser console
localStorage.getItem('cart')
localStorage.getItem('user')
localStorage.getItem('orders')
```

## 🎯 Feature Locations

- **Shopping Cart:** CartContext.jsx
- **User Auth:** AuthContext.jsx
- **Payment:** CheckoutPage.jsx
- **Admin Dashboard:** AdminPanel.jsx
- **Product Display:** HomePage.jsx

## 📱 Test Checklist (Quick)

- [ ] Add to cart works
- [ ] Cart icon shows count
- [ ] Login/signup works
- [ ] Checkout opens Razorpay
- [ ] Admin panel accessible
- [ ] Mobile menu works
- [ ] All links functional

## 🎨 Design Specs

- **Max Width:** 1200px
- **Mobile Breakpoint:** 768px
- **Tablet Breakpoint:** 1024px
- **Primary Font:** Poppins
- **Heading Font:** Playfair Display

## 🔗 Important Links

- **Razorpay Docs:** https://razorpay.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **React Router:** https://reactrouter.com
- **Vite Guide:** https://vitejs.dev/guide

## 💡 Pro Tips

1. Always test in mobile view
2. Build before deploying
3. Keep Razorpay in test mode initially
4. Use Git for version control
5. Check browser console for errors
6. Test payments with test cards only
7. Change admin password in production
8. Replace demo images before launch

## 📞 Quick Help

**Issue:** Can't login as admin
**Fix:** Use exact credentials (case-sensitive)

**Issue:** Payment not working
**Fix:** Check Razorpay key is added correctly

**Issue:** Page not found after refresh
**Fix:** Ensure _redirects file exists in public/

**Issue:** Styles not loading
**Fix:** Clear cache, rebuild, hard refresh

## ⚡ Shortcuts

- **Force refresh:** Ctrl+Shift+R (or Cmd+Shift+R)
- **Open DevTools:** F12
- **View mobile:** Ctrl+Shift+M (or Cmd+Shift+M)
- **Search files:** Ctrl+P (or Cmd+P)

## 🎊 Ready to Launch?

1. ✅ Customize branding
2. ✅ Add Razorpay key
3. ✅ Update product details
4. ✅ Test locally
5. ✅ Build project
6. ✅ Deploy to Netlify
7. ✅ Test live site
8. ✅ Configure domain

---

**Save this file for quick reference! 📌**
