import re

# 1. Restore index.html Testimonials
with open('index.html', 'r') as f:
    html = f.read()

with open('/tmp/old_testimonials.html', 'r') as f:
    old_testi = f.read()

# find where <!-- Single Testimonial Carousel --> starts
start_idx = html.find('<!-- Single Testimonial Carousel -->')
end_idx = html.find('</section>', start_idx) + len('</section>')

if start_idx != -1 and end_idx != -1:
    new_html = html[:start_idx] + '<!-- Scrolling Area -->\n' + old_testi + html[end_idx:]
    with open('index.html', 'w') as f:
        f.write(new_html)

# 2. Fix style.css Portfolio Masonry & Services
with open('style.css', 'r') as f:
    css = f.read()

# Portfolio Masonry Fix
css = re.sub(
    r'\.portfolio__grid \{[\s\S]*?\}[\s\S]*?\.pcard-featured \{[\s\S]*?height: 864px;\s*\}[\s\S]*?@media \(max-width: 768px\) \{[\s\S]*?\}',
    '''.portfolio__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 416px;
    grid-auto-flow: dense;
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
}

.pcard-featured {
    grid-column: span 2;
    grid-row: span 2;
}

@media (max-width: 1024px) {
    .portfolio__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
    .portfolio__grid { grid-template-columns: 1fr; grid-auto-rows: 400px; }
    .pcard-featured { grid-column: span 1; grid-row: span 1; }
}''',
    css
)

# Set pcard-3d height to 100%
css = re.sub(
    r'\.pcard-3d \{(\s*)height: 416px;',
    r'.pcard-3d {\1height: 100%;',
    css
)

# Services Alternating Layout Fix
services_old = '''/* Bento Grid Layout — 3 cols × 3 rows (shadcn style) */
.services__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 22rem);
    gap: 1rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

/* Explicit grid placement (desktop) */
.bento-pos-1 { grid-column: 1; grid-row: 1; }
.bento-pos-2 { grid-column: 2 / 4; grid-row: 1; }
.bento-pos-3 { grid-column: 3; grid-row: 2 / 4; }
.bento-pos-4 { grid-column: 1; grid-row: 2; }
.bento-pos-5 { grid-column: 2; grid-row: 2; }
.bento-pos-6 { grid-column: 1 / 3; grid-row: 3; }

/* Bento Card — shadcn dark aesthetic */
.services__card {
    position: relative;
    overflow: hidden;
    border-radius: 0.75rem;
    background-color: #0a0a0a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.03),
        0 2px 4px rgba(0, 0, 0, 0.05),
        0 12px 24px rgba(0, 0, 0, 0.05),
        inset 0 -20px 80px -20px rgba(255, 255, 255, 0.12);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transform: translateZ(0); /* transform-gpu */
    cursor: pointer;
}

.services__card:hover {
    border-color: rgba(255, 107, 53, 0.35);
}

/* Background image */
.services__card-bg {
    position: absolute;
    inset: -20%;
    width: 140%;
    height: 140%;
    object-fit: cover;
    opacity: 0.45;
    pointer-events: none;
    z-index: 1;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
}

.services__card:hover .services__card-bg {
    transform: scale(1.06);
    opacity: 0.55;
}

/* Content */
.services__card-content {
    position: relative;
    z-index: 10;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 1.5rem;
    transform: translateZ(0);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.services__card:hover .services__card-content {
    transform: translateY(-2.5rem);
}

/* Icon */
.services__icon {
    height: 3rem;
    width: 3rem;
    margin-bottom: 0.5rem;
    color: var(--clr-text);
    transform-origin: left;
    transform: translateZ(0);
    transition: all 0.3s ease-in-out;
}

.services__card:hover .services__icon {
    transform: scale(0.75);
    color: var(--clr-accent-2);
}

.services__name {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--clr-text);
    font-family: var(--font-heading);
}

.services__text {
    max-width: 28rem;
    color: var(--clr-text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
    font-family: var(--font-body);
}

/* CTA reveal on hover */
.services__card-cta {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    opacity: 0;
    transform: translateY(2.5rem);
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    z-index: 20;
}

.services__card:hover .services__card-cta {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.btn-bento-ghost {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    color: var(--clr-text);
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: var(--font-body);
    cursor: pointer;
    pointer-events: auto;
    transition: background 0.2s;
    text-decoration: none;
}

.btn-bento-ghost:hover {
    background: rgba(255, 255, 255, 0.08);
}

.btn-bento-ghost svg {
    width: 1rem;
    height: 1rem;
}

/* Hover overlay */
.services__card-overlay {
    position: absolute;
    inset: 0;
    background-color: transparent;
    transition: background-color 0.3s ease;
    z-index: 5;
    pointer-events: none;
    transform: translateZ(0);
}

.services__card:hover .services__card-overlay {
    background-color: rgba(255, 255, 255, 0.03);
}

/* Responsive: tablet */
@media (max-width: 1024px) {
    .services__grid {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
        grid-auto-rows: 20rem;
    }
    .bento-pos-1 { grid-column: 1; grid-row: auto; }
    .bento-pos-2 { grid-column: 2; grid-row: auto; }
    .bento-pos-3 { grid-column: 1; grid-row: auto; }
    .bento-pos-4 { grid-column: 2; grid-row: auto; }
    .bento-pos-5 { grid-column: 1; grid-row: auto; }
    .bento-pos-6 { grid-column: 2; grid-row: auto; }
}

/* Responsive: mobile */
@media (max-width: 768px) {
    .services__grid {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
    }
    .bento-pos-1, .bento-pos-2, .bento-pos-3,
    .bento-pos-4, .bento-pos-5, .bento-pos-6 {
        grid-column: 1;
        grid-row: auto;
    }
    .services__card {
        min-height: 16rem;
    }
}'''

services_new = '''/* Alternating Flex Layout (Conversational) */
.services__grid {
    display: flex;
    flex-direction: column;
    gap: 8rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.services__card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 2rem 4rem;
    align-items: center;
    background-color: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    cursor: default;
}

/* Override Bento Placements completely */
.bento-pos-1, .bento-pos-2, .bento-pos-3, .bento-pos-4, .bento-pos-5, .bento-pos-6 {
    grid-column: auto !important;
    grid-row: auto !important;
}

.services__card-bg {
    position: static;
    grid-column: 2;
    grid-row: 1 / span 2;
    width: 100%;
    height: 100%;
    min-height: 400px;
    object-fit: cover;
    border-radius: 12px;
    filter: grayscale(20%);
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
}

.services__card:hover .services__card-bg {
    transform: scale(1.02);
    filter: grayscale(0%);
}

.services__card-content {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.services__card-cta {
    grid-column: 1;
    grid-row: 2;
    align-self: start;
    display: flex;
    align-items: center;
}

.services__card:nth-child(even) .services__card-bg {
    grid-column: 1;
}
.services__card:nth-child(even) .services__card-content,
.services__card:nth-child(even) .services__card-cta {
    grid-column: 2;
}

.services__card-overlay {
    display: none;
}

.services__icon {
    height: 3rem;
    width: 3rem;
    margin-bottom: 0.5rem;
    color: var(--clr-accent-2);
}

.services__name {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 1rem;
    color: var(--clr-text);
    font-family: var(--font-heading);
}

.services__text {
    max-width: 28rem;
    color: var(--clr-text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
    font-family: var(--font-body);
}

.btn-bento-ghost {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid var(--clr-text-secondary);
    color: var(--clr-text);
    padding: 0.75rem 1.5rem;
    border-radius: 30px;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.btn-bento-ghost:hover {
    background: var(--clr-text);
    color: var(--clr-bg);
}

.btn-bento-ghost svg {
    width: 1rem;
    height: 1rem;
}

@media (max-width: 992px) {
    .services__card { grid-template-columns: 1fr; }
    .services__card-bg { grid-column: 1; grid-row: 1; min-height: 250px; }
    .services__card-content { grid-column: 1; grid-row: 2; }
    .services__card-cta { grid-column: 1; grid-row: 3; }
    .services__card:nth-child(even) .services__card-bg { grid-column: 1; }
    .services__card:nth-child(even) .services__card-content,
    .services__card:nth-child(even) .services__card-cta { grid-column: 1; }
}
'''
if services_old in css:
    css = css.replace(services_old, services_new)
else:
    print("WARNING: services_old not found in style.css exactly as formatted. Trying fallback regex.")
    
# Process Timeline spacing Fix
css = css.replace('.process__grid {\n    display: flex;\n    flex-direction: column;\n    gap: 5rem;', '.process__grid {\n    display: flex;\n    flex-direction: column;\n    gap: 2.5rem;')

# Testimonials Reversion CSS
testi_old = '''/* Single Testimonial Carousel */
.pt-carousel-wrapper {
    position: relative;
    max-width: 800px;
    margin: 40px auto 0;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    perspective: 1000px;
}

.pt-carousel {
    position: relative;
    width: 100%;
    height: 100%;
}

.pt-slide {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
    width: 100%;
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    z-index: 0;
}

.pt-slide.active {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    pointer-events: auto;
    z-index: 10;
}

/* Individual Cards */
.pt-card {
    background: #1c1b1b; 
    border: 1px solid rgba(229, 226, 225, 0.1);
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: default;
    will-change: transform;
}

.pt-slide.active:hover {
    transform: translate(-50%, calc(-50% - 4px)) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05);
}'''

testi_new = '''/* Scroll Grid */
.pt-grid-wrapper {
    display: flex;
    justify-content: center;
    gap: 24px; /* gap-6 */
    max-height: 740px;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
    position: relative;
    z-index: 2;
    margin-top: 40px;
    perspective: 1000px; /* needed for entrance anim */
}

.pt-col {
    width: 100%;
    max-width: 320px; /* max-w-xs */
    /* Handled by JS or media queries for hiding on mobile/tablet */
}

@media (max-width: 768px) {
    .pt-col-2, .pt-col-3 {
        display: none;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .pt-col-3 {
        display: none;
    }
}

.pt-track {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-bottom: 24px;
    margin: 0;
    list-style: none;
    animation: scroll-up infinite linear;
}

/* Pause scroll on hover over ANY part of the track */
.pt-track-15:hover,
.pt-track-19:hover,
.pt-track-17:hover {
    animation-play-state: paused;
}

/* Animation Durations */
.pt-track-15 { animation-duration: 15s; }
.pt-track-19 { animation-duration: 19s; }
.pt-track-17 { animation-duration: 17s; }

@keyframes scroll-up {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
}

/* Individual Cards */
.pt-card {
    background: #1c1b1b; 
    border: 1px solid rgba(229, 226, 225, 0.1);
    border-radius: 24px; /* 3xl */
    padding: 40px; /* p-10 */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); /* shadow-sm shadow-black/5 */
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: default;
    will-change: transform;
}

.pt-card:hover {
    transform: scale(1.03) translateY(-8px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05);
    z-index: 10;
}'''
css = css.replace(testi_old, testi_new)

with open('style.css', 'w') as f:
    f.write(css)

# 3. Restore script.js
with open('script.js', 'r') as f:
    js = f.read()

js_old = '''        // Testimonials Auto-Carousel
        const ptWrapper = document.querySelector('.pt-carousel-wrapper');
        const ptSlides = document.querySelectorAll('.pt-slide');
        
        if (ptWrapper && ptSlides.length > 0) {
            // Entrance
            gsap.fromTo(ptWrapper,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ptWrapper,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );

            // Auto advance
            let currentIndex = 0;
            setInterval(() => {
                ptSlides[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % ptSlides.length;
                ptSlides[currentIndex].classList.add('active');
            }, 6000);
        }'''

js_new = '''        // Testimonials Entrance (Framer Motion replica)
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
        }'''
js = js.replace(js_old, js_new)

with open('script.js', 'w') as f:
    f.write(js)

print("Patch applied successfully.")
