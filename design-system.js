/* ============================================
   ELECTRIC LUXURY - DESIGN SYSTEM
   Quick Reference Guide
   ============================================ */

/**
 * COLOR PALETTE
 */
const colors = {
    // Backgrounds
    blackDeep: '#0a0a0a',      // Main background
    blackPure: '#000000',       // Sections
    grayDark: '#1a1a1a',       // Subtle backgrounds

    // Accent Colors
    redPrimary: '#ff0033',     // Main CTA, highlights
    redNeon: '#ff1744',        // Bright accents, glow
    redDark: '#cc0029',        // Gradient end

    // Metallics
    silverMetallic: '#c0c0c0', // Accents
    silverDark: '#8a8a8a',     // Borders, subtle
    goldWarm: '#ffa500',       // Rare highlights

    // Text
    whitePure: '#ffffff',      // Headers, important
    grayLight: '#a0a0a0',      // Body text
    grayMedium: '#666666',     // Muted text
};

/**
 * TYPOGRAPHY SCALE
 */
const typography = {
    // Font Families
    display: "'Outfit', -apple-system, sans-serif",  // Headers
    body: "'Inter', -apple-system, sans-serif",      // Body text

    // Font Sizes (Fluid with clamp())
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',      // 12-14px
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',        // 14-16px
    base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',      // 16-18px
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',        // 18-24px
    xl: 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)',          // 24-32px
    '2xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',           // 32-48px
    '3xl': 'clamp(3rem, 2rem + 5vw, 5rem)',               // 48-80px
    '4xl': 'clamp(4rem, 3rem + 5vw, 7rem)',               // 64-112px

    // Font Weights
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,

    // Line Heights
    tight: 1.2,
    normal: 1.6,
    relaxed: 1.8,

    // Letter Spacing
    tighter: '-0.05em',  // Ultra-thin headers
    tight: '-0.03em',    // Headers
    normal: '0',         // Body
    wide: '0.05em',      // Buttons
    wider: '0.2em',      // Logo, labels
};

/**
 * SPACING SCALE
 */
const spacing = {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem',   // 96px
    '4xl': '8rem',   // 128px
};

/**
 * EFFECTS
 */
const effects = {
    // Blur (Glassmorphism)
    blurSm: '10px',
    blurMd: '20px',
    blurLg: '40px',

    // Glow (Red shadows)
    glowRed: '0 0 20px rgba(255, 0, 51, 0.5), 0 0 40px rgba(255, 0, 51, 0.3)',
    glowRedStrong: '0 0 30px rgba(255, 0, 51, 0.8), 0 0 60px rgba(255, 0, 51, 0.5)',

    // Shadows (Depth)
    shadowSm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 16px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    shadowXl: '0 16px 64px rgba(0, 0, 0, 0.6)',

    // Border Radius
    radiusSm: '8px',
    radiusMd: '12px',
    radiusLg: '16px',
    radiusXl: '24px',
};

/**
 * ANIMATIONS
 */
const animations = {
    // Easing Functions
    easeDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeElastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',

    // Durations
    fast: '200ms',
    base: '300ms',
    slow: '500ms',
    slower: '600ms',

    // Keyframes
    spin: '@keyframes spin { to { transform: rotate(360deg); } }',
    bounce: '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }',
    glowPulse: '@keyframes glow-pulse { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }',
};

/**
 * COMPONENT PATTERNS
 */
const components = {
    // Glassmorphic Card
    glass: {
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },

    // Primary Button
    buttonPrimary: {
        background: 'linear-gradient(135deg, #ff1744 0%, #cc0029 100%)',
        color: '#ffffff',
        padding: '1rem 2rem',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(255, 0, 51, 0.5)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Secondary Button
    buttonSecondary: {
        background: 'transparent',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        borderRadius: '12px',
    },

    // Form Input
    input: {
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '1rem',
        color: '#ffffff',
        focusBorderColor: '#ff0033',
        focusBoxShadow: '0 0 20px rgba(255, 0, 51, 0.5)',
    },
};

/**
 * BREAKPOINTS (Mobile-First)
 */
const breakpoints = {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1400px',
};

/**
 * USAGE EXAMPLES
 */

// Example 1: Glassmorphic Card
const cardStyle = `
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
`;

// Example 2: Red Glow Hover Effect
const glowHover = `
    .element:hover {
        box-shadow: 
            0 0 30px rgba(255, 0, 51, 0.8),
            0 0 60px rgba(255, 0, 51, 0.5);
        transform: translateY(-8px);
    }
`;

// Example 3: Fluid Typography
const fluidText = `
    font-size: clamp(3rem, 2rem + 5vw, 5rem);
    font-weight: 100;
    letter-spacing: -0.04em;
    line-height: 0.95;
`;

// Example 4: Particle Glow
const particleGlow = `
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
    gradient.addColorStop(0, 'hsla(350, 100%, 50%, 0.8)');
    gradient.addColorStop(1, 'hsla(350, 100%, 50%, 0)');
    ctx.fillStyle = gradient;
`;

/**
 * PERFORMANCE TIPS
 */
const performanceTips = {
    canvas: [
        'Use requestAnimationFrame for all animations',
        'Draw on integer coordinates (Math.floor)',
        'Minimize canvas state changes',
        'Use offscreen canvas for static elements',
        'Clear only dirty regions when possible',
    ],

    scrollAnimations: [
        'Throttle scroll events to ~10ms',
        'Use Intersection Observer when possible',
        'Store scroll calculations in variables',
        'Use CSS transforms instead of position',
        'Add will-change: transform to animated elements',
    ],

    general: [
        'Lazy load images below the fold',
        'Use Page Visibility API to pause animations',
        'Implement progressive loading for large assets',
        'Minify and compress CSS/JS for production',
        'Use CDN for font delivery with preconnect',
    ],
};

/**
 * ACCESSIBILITY CHECKLIST
 */
const a11y = {
    semantic: '✅ Use semantic HTML5 elements',
    headings: '✅ Proper heading hierarchy (h1 → h2 → h3)',
    aria: '✅ ARIA labels for all interactive elements',
    keyboard: '✅ Full keyboard navigation support',
    focus: '✅ Visible focus indicators (red outline)',
    contrast: '✅ WCAG AA color contrast ratios',
    motion: '✅ Respect prefers-reduced-motion',
    alt: '✅ Descriptive alt text for images',
};

/**
 * BROWSER SUPPORT
 */
const browserSupport = {
    chrome: '90+',
    firefox: '88+',
    safari: '14+',
    edge: '90+',

    features: {
        backdropFilter: 'Required for glassmorphism',
        canvas: 'Required for animations',
        customProperties: 'Required for theming',
        grid: 'Required for layouts',
    },
};

export default {
    colors,
    typography,
    spacing,
    effects,
    animations,
    components,
    breakpoints,
    performanceTips,
    a11y,
    browserSupport,
};
