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
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Testimonial Carousel
    const slides = document.querySelectorAll('.testimonials__slide');
    const btnPrev = document.querySelector('.testimonials__btn.prev');
    const btnNext = document.querySelector('.testimonials__btn.next');
    const carouselContainer = document.querySelector('.testimonials__carousel');
    
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.style.display = 'none');
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        slides[currentSlide].style.display = 'block';
        if(window.gsap) {
            gsap.fromTo(slides[currentSlide], 
                { opacity: 0, y: 15 }, 
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
        }
    }

    if (slides.length > 0) {
        btnNext.addEventListener('click', () => { showSlide(currentSlide + 1); resetInterval(); });
        btnPrev.addEventListener('click', () => { showSlide(currentSlide - 1); resetInterval(); });
        function startInterval() { slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000); }
        function resetInterval() { clearInterval(slideInterval); startInterval(); }
        carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carouselContainer.addEventListener('mouseleave', startInterval);
        showSlide(0);
        startInterval();
    }

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

        // Sections Fade In
        document.querySelectorAll('.section-hidden').forEach(section => {
            gsap.to(section, {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

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
    let ticking = false; // For requestAnimationFrame

    // Resize canvas properly
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Keep drawn image if already loaded
        if (images[0] && images[0].complete) {
            updateCanvasAndText();
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Intersection Observer to prevent rendering when off-screen
    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
        if (isHeroVisible) updateCanvasAndText();
    }, { rootMargin: "0px", threshold: 0 });
    
    if (heroContainer) heroObserver.observe(heroContainer);

    // Cover algorithm for canvas image drawing
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

    // Preload Images
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
                    // First frame loaded: hide spinner, show canvas
                    loadingScreen.style.opacity = '0';
                    canvas.style.opacity = '1';
                    setTimeout(() => loadingScreen.style.display = 'none', 500);
                    drawImageProp(ctx, images[0]);
                }
            };
            
            img.onerror = () => {
                // If a frame fails to load, gracefully fallback to video
                console.warn(`Failed to load frame ${i}`);
                if (!fallbackMode && i === 1) enableFallback();
            };
        }
        
        // Timeout for fallback if nothing loads within 3s
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
        // Make fallback video respond to scroll
        fallbackVideo.pause();
    }

    // Main Update Function
    function updateCanvasAndText() {
        if (!isHeroVisible) return;
        
        // Calculate Scroll Progress (0 to 1)
        const containerRect = heroContainer.getBoundingClientRect();
        const scrollTop = window.scrollY;
        // The sticky container scrolls inside heroContainer.
        // We calculate distance scrolled past the top of the container.
        const containerTop = heroContainer.offsetTop;
        const maxScroll = heroContainer.offsetHeight - window.innerHeight;
        let scrollProgress = (scrollTop - containerTop) / maxScroll;
        
        // Clamp 0-1
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        // 1. Update Video Frame
        if (!fallbackMode) {
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollProgress * frameCount)
            );
            
            if (images[frameIndex] && images[frameIndex].complete) {
                requestAnimationFrame(() => drawImageProp(ctx, images[frameIndex]));
            }
        } else {
            // Video fallback scrub
            if(fallbackVideo.readyState >= 2) { // HAVE_CURRENT_DATA
                requestAnimationFrame(() => {
                    fallbackVideo.currentTime = fallbackVideo.duration * scrollProgress;
                });
            }
        }

        // 2. Update Text Animations
        requestAnimationFrame(() => {
            // Parallax effect (Content moves slightly up while sticky)
            const parallaxY = scrollProgress * -100; // moves up by 100px over the whole scroll
            heroContent.style.transform = `translate(-50%, calc(-50% + ${parallaxY}px))`;

            // Thresholds
            if (scrollProgress >= 0.1) headline.classList.add('is-visible');
            else headline.classList.remove('is-visible');

            if (scrollProgress >= 0.25) subheading.classList.add('is-visible');
            else subheading.classList.remove('is-visible');

            if (scrollProgress >= 0.55) cta.classList.add('is-visible');
            else cta.classList.remove('is-visible');
        });
    }

    // Scroll Listener
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateCanvasAndText();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Start loading frames
    preloadImages();
});
