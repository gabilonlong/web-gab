/* ==========================================================================
   GABRIEL STUDIO - ULTIMATE REDESIGN JAVASCRIPT
   Powered by GSAP + ScrollTrigger
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugin
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.error("GSAP or ScrollTrigger is missing.");
        return;
    }

    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-card, .nav-mobile-toggle, .dot');

    if (cursor) {
        // Update position
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out' // Snappy but smooth follow
            });
        });

        // Hover states
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // --- 2. Header Scroll Effect ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 3. Mobile Navigation Toggle ---
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            // Very simple toggle logic for demo purposes
            const isVisible = navLinks.style.display === 'flex';
            navLinks.style.display = isVisible ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#0a0f1f';
            navLinks.style.padding = '20px';
        });
    }

    // --- 4. ✨ HERO SECTION ANIMATIONS (Page Load) ---
    // Make sure we have the hero elements
    const heroWords = document.querySelectorAll('.hero-title .word');
    const badge = document.querySelector('.hero-badge');
    const subtitle = document.querySelector('.hero-subtitle');
    const ctas = document.querySelectorAll('.hero-ctas .cta');
    const video = document.querySelector('.hero-video');

    const heroTl = gsap.timeline();

    // 4.1 Badge float-in (Delay 0.2s)
    if (badge) {
        heroTl.fromTo(badge, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            0.2
        );
    }

    // 4.2 Title Words Stagger Reveal (Delay 0.3s)
    if (heroWords.length > 0) {
        heroTl.fromTo(heroWords,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power4.out', // Premium deceleration
                stagger: 0.15
            },
            0.3
        );
    }

    // 4.3 Subtitle Fade (Delay 0.6s)
    if (subtitle) {
        heroTl.fromTo(subtitle,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            0.6
        );
    }

    // 4.4 CTAs Stagger In (Delay 0.8s)
    if (ctas.length > 0) {
        heroTl.fromTo(ctas,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.1
            },
            0.8
        );
    }

    // 4.5 Video Parallax ScrollTrigger
    if (video) {
        gsap.to(video, {
            scale: 1.1, // Subtle scale
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5,
                markers: false
            }
        });
    }

    // --- 5. 🎨 PORTFOLIO SECTION ANIMATIONS ---
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (portfolioCards.length > 0) {
        // Scroll Entrance Animation
        gsap.fromTo(portfolioCards,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.12,
                scrollTrigger: {
                    trigger: '.portfolio-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Optional: Manual JS assignment of transform rules if CSS isn't preferred for image reveals.
        // In the current setup, CSS handles the core cubic-bezier magnetic transforms for performance, 
        // mimicking the exact requested patterns. 
    }

    // --- 6. 💼 SERVICES SECTION ANIMATIONS (Alternating Parallax) ---
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach((item, index) => {
        const textContainer = item.querySelector('.service-text');
        const imageContainer = item.querySelector('.service-image img');

        if (!textContainer || !imageContainer) return;

        // Is it the even/right side item?
        const isReverse = index % 2 !== 0; 
        
        // Setup entrance timeline
        const serviceTl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // Stagger Text & Image Entrance
        serviceTl.fromTo(textContainer,
            { opacity: 0, x: isReverse ? 40 : -40 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
            0
        )
        .fromTo(imageContainer.parentElement, // Animate the container
            { opacity: 0, x: isReverse ? -40 : 40 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
            0.2 // Staggered by 0.2s
        );

        // Parallax effect on the actual image within container
        gsap.to(imageContainer, {
            y: -50, // Move opposite to scroll
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1 // smooth scrubbing
            }
        });
    });

    // --- 7. 💬 TESTIMONIALS CAROUSEL ---
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonials-nav .dot');
    
    if (testimonialItems.length > 0 && dots.length > 0) {
        let currentIndex = 0;
        let autoPlayInterval;

        function showTestimonial(index) {
            // Hide current
            document.querySelector('.testimonial-item.active').classList.remove('active');
            document.querySelector('.dot.active').classList.remove('active');

            // Show target
            testimonialItems[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentIndex = index;
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % testimonialItems.length;
                showTestimonial(nextIndex);
            }, 8000); // 8 seconds per user spec
        }

        // Initialize autoplay
        startAutoPlay();

        // Manual Navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index === currentIndex) return; // Ignore if clicking active
                
                // Pause autoplay
                clearInterval(autoPlayInterval);
                
                // Show selected
                showTestimonial(index);
                
                // Restart autoplay
                startAutoPlay();
            });
        });
    }

    // --- 8. 🔥 CTA SECTION ENTRANCE ---
    const ctaContent = document.querySelector('.cta-content');
    if (ctaContent) {
        gsap.fromTo(ctaContent,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.cta-section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
});
