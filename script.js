document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. UTILS & UI INTERACTIONS
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

        // Portfolio Section Entrance with Staggered Cards
        const portfolioSection = document.querySelector('.portfolio');
        if (portfolioSection) {
            gsap.to(portfolioSection, {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: portfolioSection,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
            
            // Staggered cards entrance
            gsap.fromTo('.interactive-card', 
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
        }

        // Stagger Cards
        const staggers = [
            { trigger: '.work', elements: '.work__card' },
            { trigger: '.services', elements: '.services__card' },
            { trigger: '.process', elements: '.process__step' },
            { trigger: '.tech', elements: '.tech__category' }
        ];

        staggers.forEach(({ trigger, elements }) => {
            const els = document.querySelectorAll(elements);
            if(els.length > 0) {
                gsap.fromTo(els, 
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
                        scrollTrigger: { trigger: trigger, start: 'top 75%' }
                    }
                );
            }
        });
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
        const cta = document.querySelector('.hero-cta');

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
                heroContent.style.transform = `translate(-50%, calc(-50% + ${parallaxY}px))`;

                if (scrollProgress >= 0.1) headline.classList.add('is-visible');
                else headline.classList.remove('is-visible');

                if (scrollProgress >= 0.25) subheading.classList.add('is-visible');
                else subheading.classList.remove('is-visible');

                if (scrollProgress >= 0.55) cta.classList.add('is-visible');
                else cta.classList.remove('is-visible');
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
    const rotatingWords = document.querySelectorAll('.bridge__word:not(.bridge__word--measure)');
    if (rotatingWords.length > 0) {
        let currentWordIndex = 0;
        
        setInterval(() => {
            const currentWord = rotatingWords[currentWordIndex];
            currentWord.classList.remove('bridge__word--active');
            currentWord.classList.add('bridge__word--exit');
            
            // Revert state subtly after exit transition finishes
            setTimeout(() => {
                currentWord.classList.remove('bridge__word--exit');
            }, 800);
            
            currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
            
            const nextWord = rotatingWords[currentWordIndex];
            nextWord.classList.add('bridge__word--active');
            
        }, 2000);
    }

    // ==========================================================================
    // 5. 3D INTERACTIVE CARDS (PORTFOLIO)
    // ==========================================================================
    const cards = document.querySelectorAll('.interactive-card');
    cards.forEach(card => {
        let xTo, yTo;
        if(window.gsap && gsap.quickTo) {
            // Using GSAP quickTo for highly performant spring-like physics
            xTo = gsap.quickTo(card, "rotateY", {duration: 0.6, ease: "power3.out"});
            yTo = gsap.quickTo(card, "rotateX", {duration: 0.6, ease: "power3.out"});
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const xPct = (e.clientX - rect.left) / rect.width - 0.5;
            const yPct = (e.clientY - rect.top) / rect.height - 0.5;
            
            // Map [-0.5, 0.5] to degrees match Framer Motion logic
            const rotateX = yPct * -21; 
            const rotateY = xPct * 21;  
            
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
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform = `rotateX(0deg) rotateY(0deg)`;
                setTimeout(() => { card.style.transition = ''; }, 600);
            }
        });
    });

});
