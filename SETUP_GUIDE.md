# 🚀 Quick Setup Guide - Ramzaan Perfume Website

## Step 1: Install Dependencies
```bash
cd ramzaan-perfume
npm install
```

## Step 2: Configure Razorpay

1. **Sign up for Razorpay:**
   - Go to https://dashboard.razorpay.com/signup
   - Complete the registration

2. **Get API Keys:**
   - Navigate to Settings → API Keys
   - Click "Generate Test Key" (for testing) or "Generate Live Key" (for production)
   - Copy your **Key ID** (starts with `rzp_test_` or `rzp_live_`)

3. **Add Key to Project:**
   - Open `src/pages/CheckoutPage.jsx`
   - Find line 35: `key: 'YOUR_RAZORPAY_KEY_ID'`
   - Replace with your actual key: `key: 'rzp_test_abc123xyz'`

## Step 3: Test Locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser

### Test the Website:
1. **Homepage**: Browse the product
2. **Add to Cart**: Click "Add to Cart" or "Buy Now"
3. **Checkout**: Fill shipping details
4. **Payment**: Use test card `4111 1111 1111 1111`
5. **Admin Panel**: Login with `admin@alh.com` / `admin123`

## Step 4: Deploy to Netlify

### Option A: Drag & Drop (Easiest)

1. **Build the project:**
```bash
npm run build
```

2. **Deploy:**
   - Go to https://app.netlify.com/drop
   - Drag the `dist` folder into the drop zone
   - Wait for deployment to complete
   - Your site is live!

### Option B: Git Deploy (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import from Git"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

### Option C: Netlify CLI

1. **Install CLI:**
```bash
npm install -g netlify-cli
```

2. **Build and Deploy:**
```bash
npm run build
netlify deploy --prod
```

## Step 5: Post-Deployment

### Update Razorpay for Production
- Switch from test keys to live keys
- Update webhook URLs if needed

### Custom Domain (Optional)
1. In Netlify: Site Settings → Domain Management
2. Add your custom domain
3. Update DNS records as instructed

### SSL Certificate
- Automatically provisioned by Netlify
- HTTPS enabled by default

## Admin Access

After deployment, access admin panel:
- URL: `https://your-site.netlify.app/admin`
- Email: `admin@alh.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the admin password in production!

## Customization Checklist

- [ ] Replace product images with actual photos
- [ ] Update business contact information in Footer
- [ ] Change admin credentials
- [ ] Add real Razorpay keys
- [ ] Update SEO meta tags in `index.html`
- [ ] Add your logo
- [ ] Customize colors in `src/App.css`

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works (scroll to sections)
- [ ] Cart functionality (add/remove items)
- [ ] User signup/login
- [ ] Checkout flow
- [ ] Razorpay payment
- [ ] Order history appears after purchase
- [ ] Admin login works
- [ ] Admin can update product details
- [ ] Admin can manage orders
- [ ] Mobile responsive design
- [ ] All links work

## Support & Troubleshooting

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Razorpay Not Loading
- Check browser console for errors
- Verify script tag in `index.html`
- Confirm API key is correct

### Routes Not Working on Netlify
- Verify `public/_redirects` file exists
- Check `netlify.toml` configuration

### Cart Not Persisting
- Check browser localStorage is enabled
- Clear browser cache and test again

## Need Help?

1. Check `README.md` for detailed documentation
2. Review code comments in source files
3. Check browser console for error messages
4. Verify all dependencies are installed

---

**🎉 You're all set! Happy selling!**
