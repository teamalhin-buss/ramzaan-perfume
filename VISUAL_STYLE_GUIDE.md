# 🎨 Visual Style Guide - Ramzaan Perfume

A visual reference guide for the enhanced styling system.

---

## 🎯 Color Palette

### Primary Colors
```
████████  #000000  --deep-navy (Pure Black)
████████  #1A1A1A  --bg-secondary (Dark Gray)
████████  #0D0D0D  --bg-tertiary (Darker)
```

### Text Colors
```
████████  #FFFFFF  --text-white (Pure White)
████████  #B8B8B8  --text-gray-light
████████  #999999  --text-gray
████████  #666666  --text-gray-dark
```

### Border Colors
```
▓▓▓▓▓▓▓▓  rgba(255,255,255,0.1)  --border-light
▓▓▓▓▓▓▓▓  rgba(255,255,255,0.2)  --border-medium
▓▓▓▓▓▓▓▓  rgba(255,255,255,0.4)  --border-strong
```

### Status Colors
```
████████  #4caf50  Success / Delivered
████████  #ffc107  Warning / Pending
████████  #ff4444  Error / Delete
```

---

## 📏 Spacing Scale

```
┌────┐
│ xs │ 8px
└────┘

┌────────┐
│   sm   │ 16px
└────────┘

┌────────────┐
│     md     │ 24px
└────────────┘

┌────────────────┐
│       lg       │ 32px
└────────────────┘

┌────────────────────────┐
│          xl            │ 48px
└────────────────────────┘

┌────────────────────────────────┐
│             2xl                │ 64px
└────────────────────────────────┘

┌────────────────────────────────────────────────┐
│                    3xl                         │ 96px
└────────────────────────────────────────────────┘
```

---

## 🔘 Border Radius

```css
/* sm - 8px */
┌────────┐
│        │  Small elements
└────────┘

/* md - 12px */
┌─────────┐
│         │  Input fields
└─────────┘

/* lg - 16px */
┌──────────┐
│          │  Cards
└──────────┘

/* xl - 24px */
┌───────────┐
│           │  Large cards
└───────────┘

/* 2xl - 32px */
┌────────────┐
│            │  Hero sections
└────────────┘

/* full - 9999px */
╭──────────╮
│ Buttons  │  Pills/Buttons
╰──────────╯
```

---

## 📊 Typography Scale

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Hero Title (H1)             ┃  clamp(2.5rem, 5vw, 4.5rem)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Section Title (H2)    ┃  clamp(2rem, 4vw, 3.5rem)
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━┓
┃ Card Title (H3) ┃  clamp(1.5rem, 3vw, 2.25rem)
┗━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━┓
┃ Label (H4)  ┃  clamp(1.25rem, 2.5vw, 1.75rem)
┗━━━━━━━━━━━━━┛

Body Text  clamp(14px, 2vw, 16px)
```

---

## 🎬 Animation Timeline

### Fade In Up
```
Step 1: ▼ opacity: 0, translateY(30px)
        ↓ (0.6s ease-out)
Step 2: ● opacity: 1, translateY(0)
```

### Slide In Left
```
← ● opacity: 0, translateX(-30px)
  ↓ (0.5s ease-out)
  ● opacity: 1, translateX(0)
```

### Float Animation
```
    ●
   ↗ ↘
  ●   ●
 ↗     ↘
●       ●  (3s infinite)
```

### Pulse
```
100% ●━━━━━● 100%
      ↓   ↑
      70% (2s infinite)
```

---

## 🎨 Button States

### Glow Button
```
┌──────────────────┐
│  Default State   │  White gradient, black text
└──────────────────┘

┌──────────────────┐
│  :hover ↗️        │  Scaled up, shimmer effect
└──────────────────┘

┌──────────────────┐
│  :active ↘️       │  Scaled down
└──────────────────┘
```

### Outline Button
```
╭──────────────────╮
│  Default State   │  Transparent, white border
╰──────────────────╯

╭──────────────────╮
│  :hover ○ Ripple │  White background, ripple effect
╰──────────────────╯
```

---

## 📱 Responsive Breakpoints

```
┌─────────────────────────────────────────────┐
│              Desktop (1280px+)              │  Full layout
├─────────────────────────────────────────────┤
│           Laptop (1024px - 1280px)          │  Adjusted spacing
├─────────────────────────────────────────────┤
│            Tablet (768px - 1024px)          │  2-col → 1-col
├─────────────────────────────────────────────┤
│            Mobile (480px - 768px)           │  Stacked
├─────────────────────────────────────────────┤
│            Small Mobile (< 480px)           │  Compact
└─────────────────────────────────────────────┘
```

---

## 🃏 Card Variations

### Glass Card
```
╔═══════════════════════════════╗
║                               ║
║  Semi-transparent background  ║
║  Backdrop blur effect         ║
║  White border (20% opacity)   ║
║                               ║
╚═══════════════════════════════╝
```

### Elevated Card (Hover)
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                             ┃
┃  Lifted up (translateY)     ┃
┃  Stronger border            ┃
┃  Enhanced shadow            ┃
┃                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
      ▒▒▒▒▒ Shadow ▒▒▒▒▒
```

---

## 💫 Shadow Levels

### sm - Subtle
```
┌──────┐
│ Card │
└──────┘
  ░░░░
```

### md - Standard
```
┌──────┐
│ Card │
└──────┘
  ▒▒▒▒
```

### lg - Elevated
```
┌──────┐
│ Card │
└──────┘
  ▓▓▓▓
```

### xl - Maximum
```
┌──────┐
│ Card │
└──────┘
  ████
```

### glow - White Glow
```
    ○
  ○   ○
○ Card ○
  ○   ○
    ○
```

---

## 🎯 Focus States

### Default
```
┌──────────────┐
│    Input     │
└──────────────┘
```

### Focus
```
┏━━━━━━━━━━━━━━┓  ← 2px white outline
┃    Input     ┃    + 2px offset
┗━━━━━━━━━━━━━━┛    + shadow ring
   ▒▒▒▒▒▒▒▒▒▒▒
```

---

## 🔄 Transform Effects

### Scale Up (Hover)
```
Before: ●
After:  ⬤  (scale 1.05)
```

### Translate Up (Hover)
```
Before: ━━━━
          ●
After:    ↑
        ━━━━  (translateY -4px)
          ●
```

### Rotate (Hover)
```
Before: ▢
After:  ◇  (rotate 5deg)
```

---

## 🎨 Gradient Effects

### Linear Gradient (Buttons)
```
█████████████
█ White → █
█ Gray    █
█████████████
```

### Radial Gradient (Backgrounds)
```
    ░░░
  ░░▒▒░░
 ░▒▓▓▓▒░
  ░░▒▒░░
    ░░░
```

### Gradient Text
```
W h i t e → G r a y
█ ▇ ▆ ▅ ▄ ▃ ▂ ▁
```

---

## 📊 Grid Layouts

### 3-Column Grid
```
┌─────────┬─────────┬─────────┐
│  Col 1  │  Col 2  │  Col 3  │
├─────────┼─────────┼─────────┤
│  Col 4  │  Col 5  │  Col 6  │
└─────────┴─────────┴─────────┘
```

### Auto-Fit Grid
```
Desktop:  ┌───┬───┬───┐
          │ 1 │ 2 │ 3 │
          └───┴───┴───┘

Tablet:   ┌───┬───┐
          │ 1 │ 2 │
          ├───┼───┤
          │ 3 │   │
          └───┴───┘

Mobile:   ┌───┐
          │ 1 │
          ├───┤
          │ 2 │
          ├───┤
          │ 3 │
          └───┘
```

---

## 🎪 Component Showcase

### Header (Sticky)
```
╔═══════════════════════════════════════════════╗
║ Logo    Home Products About    🛒 Account    ║
╠═══════════════════════════════════════════════╣
║  (Backdrop blur when scrolled)                ║
╚═══════════════════════════════════════════════╝
```

### Product Card
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ┌─────────┐  ┏━━━━━━━━━━━━━━━━━━━━━━┓  ┃
┃  │         │  ┃ Product Name         ┃  ┃
┃  │  Image  │  ┃ Description...       ┃  ┃
┃  │         │  ┃ ●●●● Notes           ┃  ┃
┃  └─────────┘  ┃ $99.99               ┃  ┃
┃               ┃ [- 1 +] [Add to Cart]┃  ┃
┃               ┗━━━━━━━━━━━━━━━━━━━━━━┛  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Footer
```
╔═══════════════════════════════════════════════╗
║  RAMZAAN                                      ║
║  Luxury fragrances                            ║
║                                               ║
║  Quick Links    Contact      Newsletter      ║
║  ○ Home         📧 Email     [Enter Email]   ║
║  ○ Products     📱 Phone     [Subscribe]     ║
║                                               ║
║  ◯ ◯ ◯ ◯  Social Icons (rotate on hover)    ║
╠═══════════════════════════════════════════════╣
║        © 2024 Ramzaan Perfume                ║
╚═══════════════════════════════════════════════╝
```

---

## 🎨 Hover Effect Examples

### Link Underline
```
Default:  Text
          ────  (0% width)

Hover:    Text
          ════  (100% width, gradient)
```

### Button Shimmer
```
Before:   ┌──────────┐
          │ Button   │
          └──────────┘

Hover:    ┌──────────┐
          ▓░ Button  │  ← Shimmer effect
          └──────────┘
```

### Card Lift
```
Before:   ┌──────┐
          │ Card │
          └──────┘

Hover:      ↑
          ┌──────┐
          │ Card │  (translateY -4px)
          └──────┘
            ▓▓▓▓  (enhanced shadow)
```

---

## 📐 Layout Examples

### Centered Container
```
┌─────────────────────────────────────────┐
│                                         │
│      ┌─────────────────────┐           │
│      │   Centered Content  │           │
│      │   Max-width 1280px  │           │
│      └─────────────────────┘           │
│                                         │
└─────────────────────────────────────────┘
```

### Flexbox Centering
```
┌─────────────────────┐
│                     │
│         ●           │  Horizontally & 
│      Content        │  Vertically Centered
│                     │
└─────────────────────┘
```

---

## 🎯 Accessibility Features

### Focus Indicator
```
┌──────────────┐
┃ ┏━━━━━━━━━┓ ┃  ← 2px white outline
┃ ┃ Button  ┃ ┃    with offset
┃ ┗━━━━━━━━━┛ ┃
└──────────────┘
```

### Touch Target (44px minimum)
```
┌────────────────┐
│    ●           │  Minimum
│   Button       │  44 x 44px
│                │
└────────────────┘
```

---

## 🎨 Custom Scrollbar

```
┌──┐
│  │
│▓▓│  ← Thumb (gradient)
│  │
│  │
│░░│  ← Track (dark)
│  │
│  │
└──┘
```

---

## 💡 Quick Tips

1. **Use clamp() for fluid sizing**
   ```
   Small Screen  →  Scales  →  Large Screen
      16px       →          →     24px
   ```

2. **Use CSS variables for consistency**
   ```
   var(--space-md)  =  24px everywhere
   ```

3. **Leverage hover effects**
   ```
   Static → Hover → Active
     ●   →   ⬤   →   ●
   ```

4. **Stack on mobile**
   ```
   Desktop: ┌─┬─┬─┐
           │1│2│3│
           └─┴─┴─┘
   
   Mobile:  ┌─┐
           │1│
           ├─┤
           │2│
           ├─┤
           │3│
           └─┘
   ```

---

**📖 For implementation details, see [CSS_QUICK_REFERENCE.md](./CSS_QUICK_REFERENCE.md)**

**📚 For complete guide, see [STYLE_IMPROVEMENTS.md](./STYLE_IMPROVEMENTS.md)**
