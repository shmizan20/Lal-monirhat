/* main.js */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis (Super Smooth Scroll)
    const lenis = new Lenis({
        duration: 1,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        normalizeWheel: true,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Scroll Progress Bar & Header Effect
    const header = document.querySelector('.main-header');
    const progressBar = document.querySelector('.scroll-progress');

    if (lenis && header) {
        lenis.on('scroll', (e) => {
            if (e.animatedScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            const scrollPercent = (e.animatedScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (progressBar) {
                progressBar.style.width = `${scrollPercent}%`;
            }
        });
    }

    // 3. Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');

            const spans = menuBtn.querySelectorAll('span');
            if (menuBtn.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Dropdown for Mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                }
            });
        }
    });

    // 4. Intersection Observer for Scroll Animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                const rect = entry.boundingClientRect;
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    entry.target.classList.remove('revealed');
                }
            }
        });
    }, { 
        threshold: 0.01,
        rootMargin: '-5% 0px -5% 0px'
    });

    const elementsToAnimate = document.querySelectorAll(
        '.section-header, .stat-item, .mission-text, .objective-item, .bento-item, .news-card, .video-card, .hero-content, .hero-visual-container, .hero-content h1, .hero-content p'
    );

    elementsToAnimate.forEach(el => {
        if (!el.classList.contains('reveal-element')) {
            el.classList.add('reveal-element');
        }
        revealObserver.observe(el);
    });

    // 5. Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                lenis.scrollTo(targetElement);
            }
        });
    });
});

