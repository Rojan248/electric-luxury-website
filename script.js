/* ============================================
   ELECTRIC LUXURY - JAVASCRIPT
   Scroll-driven canvas animation with performance optimization
   ============================================ */

// Configuration
const CONFIG = {
    TOTAL_FRAMES: 576,
    SKY_DESCENT_FRAMES: 192,
    SIDE_VIEW_FRAMES: 192,
    EXPANSION_FRAMES: 192,
    TRANSITION_POINT_1: 192,   // Sky → Side
    TRANSITION_POINT_2: 384,   // Side → Expansion
    HERO_PARTICLE_COUNT: 50,
    PRELOAD_BATCH_SIZE: 10,
};

// Get the correct frame path based on animation index (1-384)
function getFramePath(animationIndex) {
    if (animationIndex <= CONFIG.TRANSITION_POINT_1) {
        // Part 1: Sky descent (Frames2/) - 3-digit padded
        const paddedNumber = String(animationIndex).padStart(3, '0');
        return `./Frames2/frame-${paddedNumber}.png`;
    } else if (animationIndex <= CONFIG.TRANSITION_POINT_2) {
        // Part 2: Side view (frames/) - no padding
        const sideFrameIndex = animationIndex - CONFIG.TRANSITION_POINT_1;
        return `./frames/frame-${sideFrameIndex}.png`;
    } else {
        // Part 3: Expansion (frames3/) - no padding
        const expansionIndex = animationIndex - CONFIG.TRANSITION_POINT_2;
        return `./frames3/frame-${expansionIndex}.png`;
    }
}

// State management
const state = {
    frames: [],
    currentFrame: 0,
    targetFrame: 0,
    displayFrame: 0, // Smooth interpolated frame (can be decimal)
    imagesLoaded: 0,
    isLoading: true,
    scrollTicking: false,
    heroAnimationFrame: null,
    videoAnimationFrame: null, // Separate animation loop for video
};

// Expose for debugging/testing
window.state = state;
window.CONFIG = CONFIG;

// Canvas contexts
let heroCanvas, heroCtx;
let videoCanvas, videoCtx;

// Particle system for hero
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hue = Math.random() * 20; // Red spectrum variation
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

        // Keep particles in bounds
        this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        this.y = Math.max(0, Math.min(this.canvas.height, this.y));
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `hsla(${350 + this.hue}, 100%, 50%, ${this.opacity})`);
        gradient.addColorStop(1, 'hsla(350, 100%, 50%, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Initialize particles
let particles = [];

/* ============================================
   INITIALIZATION
   ============================================ */
function init() {
    // Setup canvases
    heroCanvas = document.getElementById('hero-canvas');
    videoCanvas = document.getElementById('video-canvas');

    if (heroCanvas) {
        heroCtx = heroCanvas.getContext('2d', { alpha: true });
        resizeCanvas(heroCanvas);
        initParticles();
        animateHero();
    }

    if (videoCanvas) {
        videoCtx = videoCanvas.getContext('2d', { alpha: false });
        videoCtx.imageSmoothingEnabled = true;
        videoCtx.imageSmoothingQuality = 'high';
        resizeCanvas(videoCanvas);
    }

    // Load frames
    preloadFrames();

    // Setup event listeners
    setupEventListeners();

    // Initialize scroll-based animations
    initScrollAnimations();
}

/* ============================================
   CANVAS MANAGEMENT
   ============================================ */
function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Store display dimensions for drawing calculations
    canvas.displayWidth = rect.width;
    canvas.displayHeight = rect.height;

    // Set canvas buffer size (for sharp rendering on retina displays)
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    // Update canvas display size
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Note: We don't scale the context here - drawFrame handles DPR directly
}

/* ============================================
   FRAME LOADING WITH PROGRESSIVE ENHANCEMENT
   ============================================ */
function preloadFrames() {
    const loadingProgress = document.getElementById('loading-progress');
    const loadingPercentage = document.getElementById('loading-percentage');

    // Create array of frame indices
    const frameIndices = Array.from({ length: CONFIG.TOTAL_FRAMES }, (_, i) => i + 1);

    // Load frames in batches for better UX
    loadFrameBatch(frameIndices, 0);

    function loadFrameBatch(indices, startIndex) {
        const endIndex = Math.min(startIndex + CONFIG.PRELOAD_BATCH_SIZE, indices.length);
        const batch = indices.slice(startIndex, endIndex);

        const batchPromises = batch.map(index => {
            return new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    state.frames[index - 1] = img;
                    state.imagesLoaded++;
                    updateLoadingProgress();
                    resolve();
                };

                img.onerror = () => {
                    console.error(`Failed to load frame ${index}`);
                    // Create placeholder to prevent crashes
                    state.frames[index - 1] = createPlaceholderImage();
                    state.imagesLoaded++;
                    updateLoadingProgress();
                    resolve();
                };

                img.src = getFramePath(index);
            });
        });

        Promise.all(batchPromises).then(() => {
            if (endIndex < indices.length) {
                // Load next batch
                loadFrameBatch(indices, endIndex);
            } else {
                // All frames loaded
                onFramesLoaded();
            }
        });
    }

    function updateLoadingProgress() {
        const progress = (state.imagesLoaded / CONFIG.TOTAL_FRAMES) * 100;
        loadingProgress.style.width = progress + '%';
        loadingPercentage.textContent = Math.round(progress) + '%';
    }
}

function createPlaceholderImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 100, 100);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
}

function onFramesLoaded() {
    state.isLoading = false;

    // Hide loading screen with delay for smooth transition
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');

        // Draw initial frame
        if (state.frames[0] && videoCtx) {
            drawFrame(0);
        }

        // Start the smooth video animation loop
        startVideoAnimationLoop();
    }, 500);
}

/* ============================================
   HERO PARTICLE ANIMATION
   ============================================ */
function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.HERO_PARTICLE_COUNT; i++) {
        particles.push(new Particle(heroCanvas));
    }
}

function animateHero() {
    if (!heroCtx || !heroCanvas) return;

    // Clear canvas
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    // Create ambient gradient background
    const gradient = heroCtx.createRadialGradient(
        heroCanvas.width / 2, heroCanvas.height / 2, 0,
        heroCanvas.width / 2, heroCanvas.height / 2, heroCanvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(255, 0, 51, 0.05)');
    gradient.addColorStop(1, 'rgba(10, 10, 10, 0)');

    heroCtx.fillStyle = gradient;
    heroCtx.fillRect(0, 0, heroCanvas.width, heroCanvas.height);

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw(heroCtx);
    });

    // Draw connection lines between nearby particles
    drawConnections();

    state.heroAnimationFrame = requestAnimationFrame(animateHero);
}

function drawConnections() {
    const maxDistance = 150;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.2;
                heroCtx.strokeStyle = `rgba(255, 0, 51, ${opacity})`;
                heroCtx.lineWidth = 0.5;
                heroCtx.beginPath();
                heroCtx.moveTo(particles[i].x, particles[i].y);
                heroCtx.lineTo(particles[j].x, particles[j].y);
                heroCtx.stroke();
            }
        }
    }
}

/* ============================================
   SCROLL-DRIVEN VIDEO ANIMATION
   ============================================ */

// Smooth interpolation constant (0.1 = slow/smooth, 0.3 = fast/snappy)
const SCROLL_LERP_FACTOR = 0.15;

function handleScroll() {
    // Update target frame based on scroll position
    updateTargetFrame();

    // Update other scroll-dependent elements
    updateNavbar();
    updateVideoOverlay();
    revealFeatureCards();

    // Hero fade effect
    updateHeroVisuals();
}

function updateHeroVisuals() {
    const heroContent = document.querySelector('.hero-content');
    const heroCanvas = document.querySelector('.hero-canvas');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate progress as user scrolls away from hero (0 to 1)
    // Fade out faster (by 40% of viewport) to avoid clashing with first text
    const fadeProgress = Math.min(1, scrollY / (windowHeight * 0.4));

    if (heroContent) {
        if (fadeProgress < 1) {
            heroContent.style.opacity = 1 - fadeProgress;
            heroContent.style.transform = `translateY(${fadeProgress * -20}px) scale(${1 - fadeProgress * 0.05})`; // Move UP not down
            heroContent.style.visibility = 'visible';
        } else {
            heroContent.style.opacity = 0;
            heroContent.style.visibility = 'hidden';
        }
    }

    // Fade out particles slightly later
    if (heroCanvas) {
        heroCanvas.style.opacity = Math.max(0, 1 - scrollY / (windowHeight * 0.5));
    }
}

// Continuous animation loop for smooth frame transitions
function startVideoAnimationLoop() {
    function animate() {
        if (state.isLoading) {
            state.videoAnimationFrame = requestAnimationFrame(animate);
            return;
        }

        // Smoothly interpolate displayFrame toward targetFrame
        const diff = state.targetFrame - state.displayFrame;

        // Only update if there's a meaningful difference
        if (Math.abs(diff) > 0.01) {
            // Lerp (linear interpolation) for smooth easing
            state.displayFrame += diff * SCROLL_LERP_FACTOR;

            // Clamp to valid range
            state.displayFrame = Math.max(0, Math.min(CONFIG.TOTAL_FRAMES - 1, state.displayFrame));

            // Get the actual frame index to display
            const frameToDisplay = Math.round(state.displayFrame);

            // Only redraw if frame changed
            if (frameToDisplay !== state.currentFrame) {
                state.currentFrame = frameToDisplay;
                drawFrame(frameToDisplay);
            }
        } else {
            // Snap to target when very close
            state.displayFrame = state.targetFrame;
            const frameToDisplay = Math.round(state.displayFrame);
            if (frameToDisplay !== state.currentFrame) {
                state.currentFrame = frameToDisplay;
                drawFrame(frameToDisplay);
            }
        }

        state.videoAnimationFrame = requestAnimationFrame(animate);
    }

    animate();
}

function updateTargetFrame() {
    // Note: We now use the scroll track element for calculations
    const videoSection = document.getElementById('video-section');
    if (!videoSection || state.frames.length === 0) return;

    const sectionHeight = videoSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calculate scroll progress through the video section
    const scrollTop = window.scrollY;
    const sectionTop = videoSection.offsetTop;
    const scrollProgress = (scrollTop - sectionTop) / (sectionHeight - viewportHeight);

    // Clamp between 0 and 1
    const progress = Math.max(0, Math.min(1, scrollProgress));

    // Calculate target frame (this is what we're smoothly animating toward)
    state.targetFrame = progress * (CONFIG.TOTAL_FRAMES - 1);
}

function updateNavbar() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function drawFrame(index) {
    if (!videoCtx || !state.frames[index]) return;

    const img = state.frames[index];
    const canvas = videoCanvas;

    // Clear canvas
    videoCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Frame dimensions
    const imageWidth = img.naturalWidth || img.width;
    const imageHeight = img.naturalHeight || img.height;
    const imageAspect = imageWidth / imageHeight;

    // Canvas dimensions (already scaled by DPR in resizeCanvas)
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    // COVER MODE: Fill entire canvas, crop if necessary (no black bars)
    if (canvasAspect > imageAspect) {
        // Canvas is WIDER than image - fit to WIDTH (crop top/bottom)
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imageAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
    } else {
        // Canvas is TALLER than image - fit to HEIGHT (crop sides)
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imageAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
    }

    // Use integer values for crisp rendering
    drawWidth = Math.floor(drawWidth);
    drawHeight = Math.floor(drawHeight);
    offsetX = Math.floor(offsetX);
    offsetY = Math.floor(offsetY);

    // Ensure high quality smoothing is maintained
    videoCtx.imageSmoothingEnabled = true;
    videoCtx.imageSmoothingQuality = 'high';

    // Draw image covering entire canvas
    videoCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

/* ============================================
   TEXT OVERLAY ANIMATION
   ============================================ */
function updateVideoOverlay() {
    const videoSection = document.getElementById('video-section');
    if (!videoSection) return;

    // Calculate scroll progress (same as in updateTargetFrame)
    const sectionHeight = videoSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const sectionTop = videoSection.offsetTop;

    // If we haven't reached the video section yet, hide all text
    if (scrollTop < sectionTop - viewportHeight) {
        document.querySelectorAll('.video-overlay-item').forEach(item => {
            item.classList.remove('visible');
        });
        return;
    }

    const scrollProgress = (scrollTop - sectionTop) / (sectionHeight - viewportHeight);
    const progress = Math.max(0, Math.min(1, scrollProgress));

    // 6 segments across 3 sequences (Sky, Side, Expansion)
    // 0-12%: Sky intro
    // 12-25%: Sky→Side transition
    // 25-45%: Side showcase
    // 45-60%: Side detail
    // 60-80%: Side→Expansion
    // 80-100%: Expansion
    let activeIndex = -1;

    if (progress >= 0 && progress < 0.12) {
        activeIndex = 0;
    } else if (progress >= 0.12 && progress < 0.25) {
        activeIndex = 1;
    } else if (progress >= 0.25 && progress < 0.45) {
        activeIndex = 2;
    } else if (progress >= 0.45 && progress < 0.60) {
        activeIndex = 3;
    } else if (progress >= 0.60 && progress < 0.80) {
        activeIndex = 4;
    } else if (progress >= 0.80 && progress <= 1.0) {
        activeIndex = 5;
    }

    // Update visibility classes
    const items = document.querySelectorAll('.video-overlay-item');
    items.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('visible');
        } else {
            item.classList.remove('visible');
        }
    });
}

/* ============================================
   SCROLL-TRIGGERED ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Initial check for elements in viewport
    revealFeatureCards();
}

function revealFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;

        if (isVisible) {
            card.classList.add('visible');
        }
    });
}

/* ============================================
   EVENT LISTENERS
   ============================================ */
function setupEventListeners() {
    // Direct scroll event - no throttle needed, animation loop handles smoothing
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize handling with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
            if (heroCanvas) resizeCanvas(heroCanvas);
            if (videoCanvas) {
                resizeCanvas(videoCanvas);
                drawFrame(state.currentFrame);
            }
            if (heroCanvas) {
                particles.forEach(p => p.reset());
            }
        }, 250);
    }, { passive: true });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Button interactions with ripple effect
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    // Intersection Observer for performance (alternative to scroll events)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
    }
}

/* ============================================
   INTERACTION EFFECTS
   ============================================ */
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    // Remove existing ripples
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log('Form submitted:', data);

    // Show success message (in production, this would send to a server)
    alert('Thank you for your interest! We will contact you soon.');

    // Reset form
    e.target.reset();
}

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */
function logPerformance() {
    if (performance && performance.timing) {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
    }

    // Log frame loading stats
    console.log(`🎬 Frames Loaded: ${state.imagesLoaded}/${CONFIG.TOTAL_FRAMES}`);
}

/* ============================================
   PAGE VISIBILITY API (Battery Optimization)
   ============================================ */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        if (state.heroAnimationFrame) {
            cancelAnimationFrame(state.heroAnimationFrame);
        }
        if (state.videoAnimationFrame) {
            cancelAnimationFrame(state.videoAnimationFrame);
        }
    } else {
        // Resume animations when tab becomes visible
        animateHero();
        startVideoAnimationLoop();
    }
});

/* ============================================
   INITIALIZATION ON DOM READY
   ============================================ */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Log performance after page load
window.addEventListener('load', () => {
    setTimeout(logPerformance, 1000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (state.heroAnimationFrame) {
        cancelAnimationFrame(state.heroAnimationFrame);
    }
});
