# 🎨 CSS Quick Reference Guide

Quick reference for the enhanced CSS system in Ramzaan Perfume website.

---

## 📐 Design Tokens

### Spacing
```css
var(--space-xs)   /* 8px  */
var(--space-sm)   /* 16px */
var(--space-md)   /* 24px */
var(--space-lg)   /* 32px */
var(--space-xl)   /* 48px */
var(--space-2xl)  /* 64px */
var(--space-3xl)  /* 96px */
```

### Border Radius
```css
var(--radius-sm)   /* 8px    */
var(--radius-md)   /* 12px   */
var(--radius-lg)   /* 16px   */
var(--radius-xl)   /* 24px   */
var(--radius-2xl)  /* 32px   */
var(--radius-full) /* 9999px */
```

### Shadows
```css
var(--shadow-sm)   /* Subtle shadow */
var(--shadow-md)   /* Standard card shadow */
var(--shadow-lg)   /* Elevated card shadow */
var(--shadow-xl)   /* Maximum elevation */
var(--shadow-glow) /* White glow effect */
```

### Transitions
```css
var(--transition-fast) /* 0.15s ease */
var(--transition-base) /* 0.3s ease  */
var(--transition-slow) /* 0.5s ease  */
```

### Colors
```css
var(--deep-navy)        /* #000000 - Primary background */
var(--text-white)       /* #FFFFFF - Primary text */
var(--text-gray)        /* #999999 - Secondary text */
var(--text-gray-light)  /* #B8B8B8 - Tertiary text */
var(--text-gray-dark)   /* #666666 - Dark secondary */
var(--bg-secondary)     /* #1A1A1A - Card backgrounds */
var(--bg-tertiary)      /* #0D0D0D - Darker backgrounds */
var(--border-light)     /* rgba(255,255,255,0.1) */
var(--border-medium)    /* rgba(255,255,255,0.2) */
var(--border-strong)    /* rgba(255,255,255,0.4) */
```

---

## 🎯 Fluid Typography

### Using clamp()
```css
/* Syntax: clamp(min, preferred, max) */
font-size: clamp(16px, 2vw, 24px);
/* Scales from 16px to 24px based on viewport */

padding: clamp(20px, 4vw, 40px);
/* Responsive padding */

gap: clamp(12px, 2vw, 20px);
/* Flexible spacing */
```

### Typography Scale
```css
h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); }
h2 { font-size: clamp(2rem, 4vw, 3.5rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
h4 { font-size: clamp(1.25rem, 2.5vw, 1.75rem); }
```

---

## ✨ Animations

### Available Animations
```css
.fade-in-up        /* Fade in with upward motion */
.fade-in           /* Simple fade in */
.slide-in-left     /* Slide from left */
.slide-in-right    /* Slide from right */
.float-animation   /* Floating effect */
.pulse-animation   /* Pulsing opacity */
.shimmer           /* Loading shimmer */
```

### Custom Animations
```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Usage */
.element {
  animation: fadeInUp 0.6s ease-out;
}
```

### Staggered Animations
```css
.item:nth-child(1) { animation-delay: 0s; }
.item:nth-child(2) { animation-delay: 0.1s; }
.item:nth-child(3) { animation-delay: 0.2s; }
```

---

## 🎨 Advanced Effects

### Glassmorphism
```css
.glass-card {
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid var(--border-medium);
  border-radius: var(--radius-xl);
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #FFFFFF, #CCCCCC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Shimmer Effect
```css
.shimmer-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left var(--transition-slow);
}

.shimmer-button:hover::before {
  left: 100%;
}
```

### Ripple Effect
```css
.ripple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.ripple:hover::before {
  width: 300px;
  height: 300px;
}
```

### Glow Effect
```css
.glow {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.7);
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Desktop First */
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile */ }
@media (max-width: 480px)  { /* Small Mobile */ }

/* Landscape */
@media (max-height: 500px) and (orientation: landscape) { }
```

### Responsive Grid
```css
/* Auto-responsive grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(20px, 4vw, 40px);
}
```

### Container Widths
```css
.container {
  max-width: 1280px;
  padding: 0 clamp(20px, 4vw, 32px);
}
```

---

## 🎯 Utility Classes

### Display Utilities
```css
.hide-mobile  /* display: none on mobile */
.show-mobile  /* display: block on mobile only */
.hide-tablet  /* display: none on tablet and below */
.show-tablet  /* display: block on tablet only */
```

### Spacing Utilities
```css
.section-spacing    /* Responsive section padding */
.section-spacing-sm /* Small section padding */
.section-spacing-lg /* Large section padding */
```

### Button Utilities
```css
.glow-button         /* White gradient button */
.glow-button-outline /* White outline button */
```

---

## 🎨 Common Patterns

### Card with Hover Effect
```css
.card {
  background: rgba(26, 26, 26, 0.9);
  border: 2px solid var(--border-medium);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  transition: all var(--transition-base);
}

.card:hover {
  border-color: var(--border-strong);
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

### Animated Button
```css
.btn {
  padding: clamp(12px, 2vw, 16px) clamp(32px, 4vw, 40px);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.btn:hover {
  transform: translateY(-2px) scale(1.02);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}
```

### Input with Focus Effect
```css
.input {
  padding: clamp(12px, 2vw, 14px) clamp(14px, 3vw, 18px);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
  transition: all var(--transition-base);
}

.input:focus {
  border-color: #FFFFFF;
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}
```

---

## ♿ Accessibility

### Focus States
```css
*:focus-visible {
  outline: 2px solid #FFFFFF;
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Targets
```css
/* Minimum 44px for touch */
button, a {
  min-height: 44px;
  min-width: 44px;
}
```

---

## 🎨 Custom Scrollbar

```css
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #FFFFFF, #CCCCCC);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #FFFFFF, #E0E0E0);
}
```

---

## 🎯 Performance Tips

### Hardware Acceleration
```css
/* Use transform instead of top/left */
.element {
  transform: translateX(10px); /* ✅ Good */
  /* left: 10px; ❌ Avoid */
}

/* Use opacity instead of visibility */
.element {
  opacity: 0; /* ✅ Good */
  /* visibility: hidden; ❌ Avoid */
}
```

### Efficient Selectors
```css
/* ✅ Good - Specific */
.card-title { }

/* ❌ Avoid - Too general */
div p span { }
```

---

## 📋 Cheat Sheet

### Common Values
| Property | Value |
|----------|-------|
| `gap` | `clamp(20px, 4vw, 40px)` |
| `padding` | `clamp(24px, 5vw, 48px)` |
| `font-size` | `clamp(14px, 2vw, 16px)` |
| `border-radius` | `var(--radius-xl)` |
| `transition` | `var(--transition-base)` |
| `box-shadow` | `var(--shadow-lg)` |

### Quick Snippets

**Centered Content:**
```css
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Full Width Container:**
```css
.full-width {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 32px);
}
```

**Aspect Ratio Box:**
```css
.aspect-ratio {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
```

---

## 🔗 Related Files

- [`App.css`](./src/App.css) - Global styles & variables
- [`HomePage.css`](./src/pages/HomePage.css) - Homepage styles
- [`Header.css`](./src/components/Header.css) - Navigation styles
- [`Footer.css`](./src/components/Footer.css) - Footer styles

---

## 📚 Learn More

- [STYLE_IMPROVEMENTS.md](./STYLE_IMPROVEMENTS.md) - Detailed documentation
- [STYLE_FIXES.md](./STYLE_FIXES.md) - Style fixes applied
- [THEME_GUIDE.md](./THEME_GUIDE.md) - Theme customization

---

**Quick tip:** Press `Ctrl+F` (or `Cmd+F` on Mac) to search this document!
