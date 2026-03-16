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

/* Language Switcher & Translator Logic */

// Global Initialization for Google Translate
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'bn',
        includedLanguages: 'en,bn',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
};

function setTranslateCookie(lang) {
    const domain = window.location.hostname;
    const cookieValue = `/bn/${lang}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;
    
    // Support for subdomains and apex domains
    const domainParts = domain.split('.');
    if (domainParts.length > 2) {
        const rootDomain = domainParts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieValue}; path=/; domain=.${rootDomain};`;
    }
}

function syncLangUI(lang) {
    console.log('[Lang] Syncing UI to:', lang);
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function changeLanguage(lang) {
    if (!lang) return;
    
    console.log('[Lang] changeLanguage called with:', lang);
    localStorage.setItem('selectedLang', lang);
    setTranslateCookie(lang);
    syncLangUI(lang);

    const select = document.querySelector('.goog-te-combo');
    if (select) {
        console.log('[Lang] Found widget, switching select value');
        select.value = lang;
        select.dispatchEvent(new Event('change'));
    } else {
        console.log('[Lang] Widget not found, using hash and reload');
        const targetHash = `#googtrans(bn|${lang})`;
        if (window.location.hash !== targetHash) {
            window.location.hash = targetHash;
            // Force reload to let Google Translate read the hash/cookie
            setTimeout(() => location.reload(), 100);
        }
    }
}

// Initial Sync & Polling for Widget
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'bn';
    console.log('[Lang] DOMContentLoaded state:', savedLang);
    syncLangUI(savedLang);

    if (savedLang !== 'bn') {
        let attempts = 0;
        const maxAttempts = 40; // 20 seconds
        
        const checkAndApply = () => {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                console.log('[Lang] Widget ready, applying saved lang:', savedLang);
                select.value = savedLang;
                select.dispatchEvent(new Event('change'));
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkAndApply, 500);
            }
        };
        // Delay slightly to give the engine time to load
        setTimeout(checkAndApply, 1500);
    }
});

// Dynamic Script Injection - more robust
(function() {
    if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.async = true;
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.head.appendChild(script);
    }
})();
