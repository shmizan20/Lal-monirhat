document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis (Super Smooth Scroll)
    const lenis = new Lenis({
        duration: 1,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        normalizeWheel: true,
        smoothTouch: false,
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // 2. Scroll Progress Bar & Header Effect
    const header = document.querySelector('.main-header');
    const progressBar = document.querySelector('.scroll-progress');

    lenis.on('scroll', (e) => {
        // Header Effect
        if (e.animatedScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Progress Bar
        const scrollPercent = (e.animatedScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    });

    // 3. Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');

            // Animate hamburger lines
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
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            }
        });
    });

    // 4. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                // Elements that are out of view (both above and below) get reset
                // Checking boundingClientRect to see if it's truly beyond the margin
                const rect = entry.boundingClientRect;
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    entry.target.classList.remove('revealed');
                }
            }
        });
    }, { 
        threshold: 0.01, // Detect as soon as a tiny part enters
        rootMargin: '-5% 0px -5% 0px' // Buffer to prevent flickering
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

    // 5. Smooth scroll for anchors (Connected to Lenis)
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

// Language Switcher & Translator Logic
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'bn',
        includedLanguages: 'en,bn',
        autoDisplay: false
    }, 'google_translate_element');
}

// Dynamic script injection
(function() {
    if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.head.appendChild(script);
    }
})();

// Set cookie for Google Translate
function setTranslateCookie(lang) {
    document.cookie = `googtrans=/bn/${lang}; path=/;`;
    document.cookie = `googtrans=/bn/${lang}; path=/; domain=${window.location.hostname};`;
}

function changeLanguage(lang) {
    // 1. Update UI
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        const label = btn.innerText.toLowerCase();
        if ((lang === 'bn' && label.includes('বাং')) || (lang === 'en' && label.includes('en'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. Set Cookie & Storage
    localStorage.setItem('selectedLang', lang);
    setTranslateCookie(lang);

    // 3. Trigger Translation via Widget
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
    } else {
        // Fallback for first-time load: reload with the cookie/hash set
        window.location.hash = `#googtrans(bn|${lang})`;
        location.reload();
    }
}

// Check for saved language on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang');
    if (savedLang && savedLang !== 'bn') {
        // Update UI immediately
        const btns = document.querySelectorAll('.lang-btn');
        btns.forEach(btn => {
            if (btn.innerText.toLowerCase().includes('en')) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Wait for Google Translate but don't force reload if it doesn't load
        setTimeout(() => {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = savedLang;
                select.dispatchEvent(new Event('change'));
            }
        }, 1500);
    }
});
