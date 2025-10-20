# ⚫⚪ Black & White Theme - Quick Visual Reference

## 🎨 Color Palette

```
┌─────────────────────────────────────────────┐
│  BACKGROUNDS                                 │
├─────────────────────────────────────────────┤
│  Main Background      #000000  ████████████ │
│  Card Background      #1A1A1A  ████████████ │
│  Sidebar Background   #000000  ████████████ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  TEXT COLORS                                 │
├─────────────────────────────────────────────┤
│  Primary Text         #FFFFFF  ░░░░░░░░░░░░ │
│  Secondary Text       #999999  ░░░░░░░░░░░░ │
│  Button Text          #000000  ████████████ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ACCENTS & BORDERS                           │
├─────────────────────────────────────────────┤
│  White Accent         #FFFFFF  ░░░░░░░░░░░░ │
│  Light Gray           #CCCCCC  ░░░░░░░░░░░░ │
│  Border (10%)         rgba(255,255,255,0.1)│
│  Border (20%)         rgba(255,255,255,0.2)│
│  Border (30%)         rgba(255,255,255,0.3)│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  STATUS COLORS                               │
├─────────────────────────────────────────────┤
│  Success              #4caf50  ░░░░░░░░░░░░ │
│  Warning              #ffc107  ░░░░░░░░░░░░ │
│  Error                #ff4444  ░░░░░░░░░░░░ │
└─────────────────────────────────────────────┘
```

## 🖼️ Component Preview

### Buttons
```
┌────────────────────────────────┐
│  ┌──────────────────────────┐  │
│  │   SHOP NOW   (White bg)   │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │   Add to Cart  (Outline)  │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
White gradient → Black text
Border: 2px solid white
Hover: Transforms & glows
```

### Cards
```
┌────────────────────────────────┐
│  ╔══════════════════════════╗  │
│  ║  Glass Card              ║  │
│  ║  Background: #1A1A1A     ║  │
│  ║  Border: White 20%       ║  │
│  ║  Shadow: Black 90%       ║  │
│  ╚══════════════════════════╝  │
└────────────────────────────────┘
```

### Text Hierarchy
```
H1: White, 4rem, Playfair Display
H2: White, 3rem, Playfair Display  
H3: White, 1.5rem, Playfair Display
Body: White, 1rem, Poppins
Secondary: Gray #999, 0.875rem, Poppins
```

## 📐 Spacing System

```
xs:   8px   ●
sm:   16px  ●●
md:   24px  ●●●
lg:   32px  ●●●●
xl:   48px  ●●●●●●
2xl:  64px  ●●●●●●●●
```

## 🎯 Border Radius

```
Small:    8px   (inputs)
Medium:   12px  (cards)
Large:    20px  (containers)
Round:    50px  (buttons)
Circle:   50%   (avatars)
```

## ✨ Effects

### Glassmorphism
```css
background: rgba(26, 26, 26, 0.9);
backdrop-filter: blur(10px);
border: 2px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
```

### Button Hover
```css
transform: translateY(-2px);
box-shadow: 0 6px 25px rgba(255, 255, 255, 0.5);
```

### Card Hover
```css
transform: translateY(-5px);
border-color: rgba(255, 255, 255, 0.4);
box-shadow: 0 10px 40px rgba(255, 255, 255, 0.15);
```

## 🎨 Component Colors

### Header
- Background: Transparent → Pure black (scroll)
- Links: White with underline
- Icons: White
- Badge: White gradient

### Hero
- Overlay: Black 85-95%
- Text: Pure white
- Glow: White shadow
- Stats: Dark glass cards

### Product Card
- Border: White 30%
- Price: White
- Notes: White borders
- Buttons: White gradient

### Footer
- Background: Black gradient
- Social icons: White
- Links: White hover
- Newsletter: White button

### Cart Dropdown
- Background: Black 98%
- Border: White 30%
- Prices: White
- Buttons: White

### Forms
- Input bg: White 5%
- Focus border: White
- Focus shadow: White 10%
- Labels: White

### Admin Panel
- Sidebar: Black 98%
- Active nav: White 10%
- Stats: Colorful icons
- Tables: White text

## 📱 Responsive

### Desktop (1024px+)
```
┌─────────────────────────────┐
│  Header (sticky)             │
├─────────────────────────────┤
│  Hero (full width)           │
├──────────┬──────────────────┤
│  Product │  Details         │
├──────────┴──────────────────┤
│  Reviews (2 columns)         │
├──────────────────────────────┤
│  Footer (4 columns)          │
└──────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│  Header (burger)  │
├──────────────────┤
│  Hero (stacked)   │
├──────────────────┤
│  Product (full)   │
├──────────────────┤
│  Details (full)   │
├──────────────────┤
│  Reviews (single) │
├──────────────────┤
│  Footer (stacked) │
└──────────────────┘
```

## 🎯 Key Measurements

### Max Widths
- Container: 1200px
- Product Card: 1100px
- Auth Card: 450px
- Admin Sidebar: 280px

### Header
- Height: 80px (default)
- Height (scroll): 70px
- Z-index: 1000

### Buttons
- Padding: 14px 32px
- Border radius: 50px
- Font size: 16px
- Font weight: 600

### Cards
- Padding: 40-60px
- Border: 2px
- Border radius: 20px
- Gap: 30-60px

## ⚡ Performance

### Load Times
- Hero image: < 1s
- Product image: < 0.5s
- Icons: Instant (inline)
- Fonts: Preloaded

### Optimizations
- Lazy loading images
- Backdrop filter GPU
- CSS Grid for layout
- Minimal animations

## 🎨 Usage Examples

### White Button
```css
.glow-button {
  background: linear-gradient(135deg, #FFFFFF, #E0E0E0);
  color: #000000;
  padding: 14px 32px;
  border-radius: 50px;
}
```

### Outline Button
```css
.glow-button-outline {
  background: transparent;
  border: 2px solid #FFFFFF;
  color: #FFFFFF;
}
.glow-button-outline:hover {
  background: #FFFFFF;
  color: #000000;
}
```

### Glass Card
```css
.glass-card {
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}
```

## ✅ Checklist

### Visual Consistency
- [x] All blacks are #000000
- [x] All whites are #FFFFFF
- [x] All grays are #999999
- [x] No gold/blue colors
- [x] Borders use white opacity
- [x] Buttons use white gradient

### Accessibility
- [x] 21:1 contrast (white/black)
- [x] Focus states visible
- [x] Touch targets 44px+
- [x] Alt text on images
- [x] ARIA labels present

### Performance
- [x] CSS optimized
- [x] No unused styles
- [x] Efficient selectors
- [x] GPU acceleration

---

**Quick Reference for Development** 📋

Keep this guide handy when styling new components!
