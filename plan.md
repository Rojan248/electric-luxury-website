# Website Theme Plan: "Electric Luxury"

## Project Overview
Apple-style website with smooth scroll-driven video transitions for an automotive/luxury vehicle brand.

## Theme Direction: Electric Luxury

### Aesthetic Vision
A futuristic, sleek website that combines luxury automotive aesthetics with premium EV technology vibes. Think Tesla's configurator meets Porsche's website meets futuristic concept car reveals.

### Color Palette
- **Primary Background**: Deep midnight black (#0a0a0a, #000000)
- **Accent Colors**: 
  - Electric red/neon (#ff0033, #ff1744) ⭐ PRIMARY THEME
  - Metallic silver (#c0c0c0, #8a8a8a)
  - Warm gold accents (#ffa500) - subtle use only
- **Text Colors**:
  - Primary: Pure white (#ffffff)
  - Secondary: Light gray (#a0a0a0)
  - Muted: Medium gray (#666666)

### Typography
- **Display/Headers**: Ultra-thin sans-serif (Sohne, Satoshi, or SF Pro Display Light)
  - Large, dramatic sizes (80px-120px for hero)
  - Thin weights (200-300)
  - Tight letter spacing (-0.03em to -0.05em)
- **Body Text**: Refined sans-serif (SF Pro Text, Inter, or similar)
  - Clean, readable sizes (16px-20px)
  - Regular to medium weights
  - Generous line height (1.6-1.8)

### Visual Effects & Animations

#### Glass Morphism
- Frosted blur backgrounds (backdrop-filter: blur(20px))
- Semi-transparent panels with subtle borders
- Layered depth with shadows

#### Gradient Effects
- Animated gradient meshes that shift like car paint under light
- Radial gradients for ambient lighting effects
- Linear gradients for metallic sheens

#### Micro-interactions
- Chromatic aberration on hover (RGB split effect)
- Smooth accelerations with cubic-bezier easing
- Elastic animations for premium feel
- Glow effects on interactive elements

#### Motion Design
- Speed lines or motion blur for transitions
- Parallax scrolling effects
- Smooth video scrubbing tied to scroll position
- Floating UI elements with subtle animations

### Section Breakdown

#### 1. Hero Section
- Animated gradient background (simulating car headlights/ambient lighting)
- Large, bold typography with gradient text effects
- Floating particles or light streaks
- Smooth scroll indicator

#### 2. Video Section (Scroll-Driven)
- Sticky video container that stays centered
- Video playback controlled by scroll position (scrubbing effect)
- Parallax depth effects
- Overlay text that fades out as user scrolls
- Premium border-radius and shadows

#### 3. Feature/Details Section
- Glass morphism cards
- Hover effects with glow and lift
- Staggered animations on scroll
- Metallic accents and reflective surfaces

### Technical Requirements

#### Scroll-Driven Video Implementation
- Extended scroll height (400vh-500vh) for video section
- requestAnimationFrame for smooth 60fps performance
- Video currentTime mapped to scroll progress
- Sticky positioning for video container
- Scale and opacity transitions

#### Performance Optimizations
- Throttled scroll events
- CSS transforms for animations (GPU acceleration)
- Lazy loading for assets
- Preload video metadata

#### Responsive Design
- Mobile-first approach
- Fluid typography with clamp()
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

### Design Inspiration Keywords
- Tesla configurator
- Porsche Taycan website
- Mercedes EQ series
- Rivian product pages
- Lucid Motors aesthetics
- Premium EV dashboard lighting
- Concept car reveals
- Futuristic automotive UI

### Mood & Atmosphere
- **Primary**: Luxurious & premium
- **Secondary**: Innovative & cutting-edge
- **Tertiary**: Sleek, fast, powerful

### Key Differentiators
- Not typical Apple minimalism - more dramatic and bold
- Automotive-specific visual language (speed, motion, luxury)
- High contrast with glowing accents
- Premium materials feel (glass, metal, carbon fiber)
- Futuristic without being sci-fi

---

## Implementation Notes
- Use CSS custom properties for color theming
- Implement smooth scroll with CSS scroll-behavior or JS library
- Consider adding sound effects for premium feel (optional)
- Video should be high-quality automotive footage (driving shots, detail shots, etc.)
