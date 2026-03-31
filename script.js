document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. HEADER GSAP ANIMATIONS & MAGNETIC BUTTONS
    // ==========================================================================
    
    if (window.gsap) {
        // Entrance Stagger
        const headerTl = gsap.timeline();
        headerTl.fromTo('.nav__logo', 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
        )
        .fromTo('.nav__item',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
            "-=0.6"
        );

        // Magnetic Effect
        const magneticElements = document.querySelectorAll('.nav__link, .nav__btn, .nav__logo, .contact__social-link, .btn-contact-primary, .footer__links a');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const position = el.getBoundingClientRect();
                const x = e.clientX - position.left - position.width / 2;
                const y = e.clientY - position.top - position.height / 2;
                
                gsap.to(el, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }

    // ==========================================================================
    // 1.5. HERO SPLIT-TEXT & MOUSE PARALLAX
    // ==========================================================================
    const heroHeadline = document.querySelector('.hero-headline');
    if (heroHeadline && window.gsap) {
        // Simple SplitText replica
        const words = heroHeadline.innerText.split(' ');
        heroHeadline.innerHTML = '';
        words.forEach(word => {
            const wordWrap = document.createElement('span');
            wordWrap.style.display = 'inline-block';
            wordWrap.style.overflow = 'hidden';
            wordWrap.style.marginRight = '0.3em'; // Space logic

            const wordInner = document.createElement('span');
            wordInner.style.display = 'inline-block';
            wordInner.innerText = word;
            wordInner.classList.add('hero-word-inner');
            
            wordWrap.appendChild(wordInner);
            heroHeadline.appendChild(wordWrap);
        });

        // Entrance animation
        const heroTl = gsap.timeline({ delay: 0.5 }); // Let loading finish
        heroTl.fromTo('.hero-word-inner',
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 1.2, stagger: 0.08, ease: 'power4.out' }
        )
        .fromTo(['.hero-subtitle', '.hero-cta'],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' },
            "-=0.6"
        );
    }

    // Hero Background Mouse Parallax
    const heroSection = document.querySelector('.hero-container');
    const heroMedia = document.querySelector('.hero-video-wrapper');
    if (heroSection && heroMedia && window.gsap) {
        // slightly scale up the wrapper to allow panning without showing edges
        heroMedia.style.transform = 'scale(1.05)';
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(heroMedia, {
                x: x * 40,
                y: y * 40,
                duration: 1,
                ease: 'power2.out'
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroMedia, { x: 0, y: 0, duration: 1, ease: 'power2.out' });
        });
    }

    // ==========================================================================
    // 2. UTILS & UI INTERACTIONS
    // ==========================================================================
    
    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, .nav__menu-btn');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.nav__menu-btn');
    const navList = document.querySelector('.nav__list');
    const navLinksList = document.querySelectorAll('.nav__link, .nav__btn');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navList.classList.toggle('active');
    });

    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navList.classList.remove('active');
        });
    });

    // Navbar Scrolled State & Active Link Highlight
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Set active link based on current URL path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath || (href === '#home' && currentPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Testimonials Carousel (Removed - Replaced by Infinite Scroll CSS)

    // Form Validation (Simulation)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.form__submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            setTimeout(() => {
                submitBtn.textContent = 'Sent Successfully';
                contactForm.reset();
                setTimeout(() => submitBtn.textContent = originalText, 3000);
            }, 1000);
        });
    }

    // General GSAP Animations
    if(window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Video Scale Parallax
        const heroVideoWrapper = document.querySelector('.hero-video-wrapper');
        const heroContainer = document.querySelector('.hero-container');
        if (heroVideoWrapper && heroContainer) {
            gsap.fromTo(heroVideoWrapper, 
                { scale: 1 },
                { 
                    scale: 1.2, 
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroContainer,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }

        // Sections Fade In (General)
        document.querySelectorAll('.section-hidden:not(.portfolio)').forEach(section => {
            gsap.to(section, {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Portfolio Section Entrance & 3D Tilt Logic
        const portfolioSection = document.querySelector('.portfolio');
        const pCards = document.querySelectorAll('.pcard-3d');
        
        if (portfolioSection && pCards.length > 0) {
            // Entrance animation
            gsap.fromTo(pCards, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    ease: 'power3.out',
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: '.portfolio__grid',
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            // 3D Tilt & Shine Logic
            pCards.forEach(card => {
                const inner = card.querySelector('.pcard-inner');
                const shine = card.querySelector('.pcard-shine');
                
                // GSAP quick setters for 60fps performance
                const xTo = gsap.quickTo(inner, "rotationY", { duration: 0.5, ease: "power2.out" });
                const yTo = gsap.quickTo(inner, "rotationX", { duration: 0.5, ease: "power2.out" });
                const shineXTo = gsap.quickTo(shine, "x", { duration: 0.1, ease: "none" });
                const shineYTo = gsap.quickTo(shine, "y", { duration: 0.1, ease: "none" });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Calculate rotation angles (-15deg to 15deg for more impact)
                    const rotateY = ((x / width) - 0.5) * 30;
                    const rotateX = ((y / height) - 0.5) * -30;
                    
                    xTo(rotateY);
                    yTo(rotateX);

                    // Move shine overlay based on mouse
                    const moveX = ((x / width) - 0.5) * 40;
                    const moveY = ((y / height) - 0.5) * 40;
                    gsap.set(shine, {
                        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, transparent 80%)`
                    });
                });

                card.addEventListener('mouseleave', () => {
                    xTo(0);
                    yTo(0);
                    gsap.to(inner, { 
                        scale: 1, 
                        duration: 0.6, 
                        ease: "elastic.out(1, 0.75)" 
                    });
                });
                
                card.addEventListener('mouseenter', () => {
                    gsap.to(inner, { 
                        scale: 1.04, 
                        duration: 0.4, 
                        ease: "power2.out" 
                    });
                });
            });
        }

        // Process Section Staggered Entrance
        const processCards = document.querySelectorAll('.process__card');
        if (processCards.length > 0) {
            gsap.fromTo(processCards, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, 
                    duration: 0.8, 
                    stagger: 0.15, 
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.process__grid',
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // Services Entrance (Custom Physics)
        const servicesGrid = document.querySelector('.services__grid');
        const servicesCards = document.querySelectorAll('.services__card');
        if (servicesGrid && servicesCards.length > 0) {
            gsap.fromTo(servicesCards,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: servicesGrid,
                        start: "top 80%", // wait until 20% in view
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        // Contact Entrance (Custom Physics)
        const contactOptions = document.querySelector('.contact__options');
        const contactCards = document.querySelectorAll('.contact__card');
        if (contactOptions && contactCards.length > 0) {
            gsap.fromTo(contactCards,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    delay: 0.2, // global delay specified by user
                    ease: "power3.out",
                    stagger: 0.1, // delay between option1 and option2
                    scrollTrigger: {
                        trigger: contactOptions,
                        start: "top 85%", 
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        // Testimonials Entrance (Framer Motion replica)
        const ptGrid = document.querySelector('.pt-grid-wrapper');
        const ptCols = document.querySelectorAll('.pt-col');
        if (ptGrid && ptCols.length > 0) {
            gsap.fromTo(ptCols,
                { opacity: 0, y: 50, rotation: -2 },
                {
                    opacity: 1, y: 0, rotation: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: ptGrid,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    }


    // ==========================================================================
    // 2. HERO VIDEO SCROLL LOGIC
    // ==========================================================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const heroContainer = document.getElementById('home');
        const fallbackVideo = document.getElementById('hero-video-fallback');
        const loadingScreen = document.getElementById('hero-loading');
        
        // Text Elements
        const heroContent = document.querySelector('.hero-content');
        const headline = document.querySelector('.hero-headline');
        const subheading = document.querySelector('.hero-subheading');

        // Configuration
        const frameCount = 480;
        const currentFrame = index => `assets/frames/frame_${index.toString().padStart(4, '0')}.jpg`;
        
        let images = [];
        let loadedImages = 0;
        let fallbackMode = false;
        let ticking = false;

        function resizeCanvas() {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (images[0] && images[0].complete) updateCanvasAndText();
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let isHeroVisible = true;
        const heroObserver = new IntersectionObserver((entries) => {
            isHeroVisible = entries[0].isIntersecting;
            if (isHeroVisible) updateCanvasAndText();
        }, { rootMargin: "0px", threshold: 0 });
        
        if (heroContainer) heroObserver.observe(heroContainer);

        function drawImageProp(ctx, img) {
            if (!img || !img.complete || img.width === 0) return;
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.width;
            const ih = img.height;
            const r = Math.max(cw / iw, ch / ih);
            const nw = iw * r;
            const nh = ih * r;
            const cx = (cw - nw) / 2;
            const cy = (ch - nh) / 2;
            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(img, cx, cy, nw, nh);
        }

        function preloadImages() {
            let firstFrameLoaded = false;
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                images.push(img);
                
                img.onload = () => {
                    loadedImages++;
                    if (i === 1 && !firstFrameLoaded) {
                        firstFrameLoaded = true;
                        loadingScreen.style.opacity = '0';
                        canvas.style.opacity = '1';
                        setTimeout(() => loadingScreen.style.display = 'none', 500);
                        drawImageProp(ctx, images[0]);
                    }
                };
                
                img.onerror = () => {
                    console.warn(`Failed to load frame ${i}`);
                    if (!fallbackMode && i === 1) enableFallback();
                };
            }
            
            setTimeout(() => {
                if (!firstFrameLoaded) enableFallback();
            }, 3000);
        }

        function enableFallback() {
            if (fallbackMode) return;
            fallbackMode = true;
            console.log("Using video fallback");
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 500);
            canvas.style.display = 'none';
            fallbackVideo.style.opacity = '1';
            fallbackVideo.style.display = 'block';
            fallbackVideo.pause();
        }

        function updateCanvasAndText() {
            if (!isHeroVisible) return;
            
            const scrollTop = window.scrollY;
            const containerTop = heroContainer.offsetTop;
            const maxScroll = heroContainer.offsetHeight - window.innerHeight;
            let scrollProgress = (scrollTop - containerTop) / maxScroll;
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));

            if (!fallbackMode) {
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(scrollProgress * frameCount)
                );
                
                if (images[frameIndex] && images[frameIndex].complete) {
                    requestAnimationFrame(() => drawImageProp(ctx, images[frameIndex]));
                }
            } else {
                if(fallbackVideo.readyState >= 2) {
                    requestAnimationFrame(() => {
                        fallbackVideo.currentTime = fallbackVideo.duration * scrollProgress;
                    });
                }
            }

            requestAnimationFrame(() => {
                const parallaxY = scrollProgress * -100;
                heroContent.style.transform = `translateY(${parallaxY}px)`;

                if (scrollProgress >= 0.1) headline.classList.add('is-visible');
                else headline.classList.remove('is-visible');

                if (scrollProgress >= 0.25) subheading.classList.add('is-visible');
                else subheading.classList.remove('is-visible');
            });
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateCanvasAndText();
                    ticking = false;
                });
                ticking = true;
            }
        });

        if (heroContainer) {
            heroContainer.style.cursor = 'pointer';
            heroContainer.title = 'Click to open the door';
            heroContainer.addEventListener('click', () => {
                const start = window.scrollY;
                const end = heroContainer.offsetTop + (heroContainer.offsetHeight - window.innerHeight);
                const duration = 1800; // 1.8 seconds smooth play
                const startTime = performance.now();
                
                function smoothScroll(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // EaseInOutCubic
                    const ease = progress < 0.5 
                        ? 4 * progress * progress * progress 
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                        
                    window.scrollTo(0, start + (end - start) * ease);
                    
                    if (progress < 1) {
                        requestAnimationFrame(smoothScroll);
                    }
                }
                requestAnimationFrame(smoothScroll);
            });
        }

        preloadImages();
    }

    // ==========================================================================
    // 3. IMMERSIVE CONTACT COMPONENT LOGIC
    // ==========================================================================
    const revealBtn = document.getElementById('reveal-form-btn');
    
    if (revealBtn) {
        const stateInitial = document.getElementById('contact-initial');
        const stateSuccess = document.getElementById('contact-success');
        const badge = document.querySelector('.availability-badge');
        const subtext = document.querySelector('.contact-subtext');

        revealBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add clicked state to arrow/lines
            revealBtn.classList.add('clicked-state');
            
            // Animate items out
            if (badge) badge.classList.add('clicked-opacity-out');
            if (subtext) subtext.classList.add('clicked-opacity-out-down');
            
            // Fade out main wrapper slightly delayed
            setTimeout(() => {
                revealBtn.classList.add('clicked-scale-out');
            }, 100);

            // After 600ms show success state
            setTimeout(() => {
                stateInitial.classList.remove('active-state');
                stateInitial.classList.add('hidden-state');
                
                setTimeout(() => {
                    stateInitial.style.display = 'none';
                    stateSuccess.classList.remove('hidden-state');
                    stateSuccess.classList.add('active-state');
                }, 50);
            }, 600);
        });
    }

    // ==========================================================================
    // 4. ANIMATED HERO (BRIDGE SECTION) LOGIC
    // ==========================================================================
    const rotatingWords = document.querySelectorAll('.bridge__word');
    if (rotatingWords.length > 0) {
        let currentWordIndex = 0;
        
        setInterval(() => {
            const currentWord = rotatingWords[currentWordIndex];
            currentWord.classList.remove('bridge__word--active');
            currentWord.classList.add('bridge__word--exit');
            
            // Revert state after exit transition finishes (1000ms per user spec)
            setTimeout(() => {
                currentWord.classList.remove('bridge__word--exit');
            }, 1000);
            
            currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
            
            const nextWord = rotatingWords[currentWordIndex];
            nextWord.classList.add('bridge__word--active');
            
        }, 2000); // Rotate every 2s
    }

    // ==========================================================================
    // 6. 3D INTERACTIVE CARDS (PORTFOLIO)
    // ==========================================================================
    const cards = document.querySelectorAll('.interactive-card');
    cards.forEach(card => {
        // Custom Cursor "Voir" state mapping
        card.addEventListener('mouseenter', () => {
            const cursor = document.querySelector('.custom-cursor');
            if(cursor) {
                cursor.classList.add('view-project');
                cursor.innerHTML = '<span>Voir</span>';
            }
        });

        card.addEventListener('mouseleave', () => {
            const cursor = document.querySelector('.custom-cursor');
            if(cursor) {
                cursor.classList.remove('view-project');
                cursor.innerHTML = '';
            }
        });

        let xTo, yTo;
        if(window.gsap && gsap.quickTo) {
            // Spring physics matching Framer Motion: damping=15, stiffness=150
            // ζ ≈ 0.61 (underdamped), settling ≈ 0.5s → elastic.out for spring overshoot
            xTo = gsap.quickTo(card, "rotateY", {duration: 0.5, ease: "elastic.out(1, 0.4)"});
            yTo = gsap.quickTo(card, "rotateX", {duration: 0.5, ease: "elastic.out(1, 0.4)"});
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const xPct = (e.clientX - rect.left) / rect.width - 0.5;
            const yPct = (e.clientY - rect.top) / rect.height - 0.5;

            // ±10.5deg tilt matching Framer Motion InteractiveTravelCard ref
            const rotateX = yPct * -10.5;
            const rotateY = xPct * 10.5;

            if (xTo && yTo) {
                xTo(rotateY);
                yTo(rotateX);
            } else {
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (xTo && yTo) {
                xTo(0);
                yTo(0);
            } else {
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform = `rotateX(0deg) rotateY(0deg)`;
                setTimeout(() => { card.style.transition = ''; }, 500);
            }
        });
    });

    // ==========================================================================
    // 7. CONTACT REVEAL ANIMATION
    // ==========================================================================
    const contactSection = document.querySelector('.contact');
    const contactContainer = document.querySelector('.contact__container');
    if (contactSection && contactContainer) {
        gsap.fromTo(contactContainer, 
            { opacity: 0, scale: 0.9, y: 50 },
            {
                opacity: 1, scale: 1, y: 0,
                duration: 1.2, ease: 'power3.out',
                scrollTrigger: {
                    trigger: contactSection,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }

});
