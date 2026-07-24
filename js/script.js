
// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-minimal form') || document.querySelector('.newsletter-box-mini form') || document.querySelector('.newsletter-section form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        if (email) {
            alert('Thank you for subscribing!');
            this.reset();
            // Scroll to news section
            const newsSection = document.querySelector('#news');
            if (newsSection) {
                window.scrollTo({
                    top: newsSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Ignore empty hash links
        
        e.preventDefault();
        try {
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        } catch (err) {
            console.warn('Invalid scroll target selector:', href);
        }
    });
});

// Load More News Functionality
document.addEventListener('DOMContentLoaded', function () {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            const hiddenNews = document.querySelectorAll('.news-hidden');
            hiddenNews.forEach((item, index) => {
                item.classList.remove('d-none');
                setTimeout(() => {
                    item.classList.add('show');
                }, index * 100);
            });
            this.style.display = 'none';
        });
    }

    // --- HERO LOCATION CYCLER ---
    const activeLocSpan = document.getElementById('activeLocation');
    const locations = [
        "Dubai", "Abu Dhabi", "Sharjah", "Fujairah",
        "Ajman", "Umm Al Quwain", "Ras Al Khaimah",
        "Saudi Arabia", "Oman", "Bahrain", "Kuwait", "Qatar"
    ];
    let currentLocIndex = 0;

    if (activeLocSpan) {
        setInterval(() => {
            // Fade out
            activeLocSpan.style.opacity = '0';
            activeLocSpan.style.transform = 'translateY(5px)';

            setTimeout(() => {
                // Change text
                currentLocIndex = (currentLocIndex + 1) % locations.length;
                activeLocSpan.textContent = locations[currentLocIndex];

                // Fade in
                activeLocSpan.style.opacity = '1';
                activeLocSpan.style.transform = 'translateY(0)';
            }, 400); // Matches CSS transition time
        }, 3000);
    }

    // --- SERVICES HOVER LOGIC ---
    const serviceItems = document.querySelectorAll('.v-service-item');
    const serviceCards = document.querySelectorAll('.v-service-card');
    const marqueeTexts = document.querySelectorAll('.marquee-content span');
    const servicesMarquee = document.querySelector('.services-marquee');

    if (serviceItems.length > 0) {
        // Set first item as active by default
        const firstItem = serviceItems[0];
        const firstTarget = firstItem.getAttribute('data-service');
        const firstCard = document.getElementById(`service-${firstTarget}`);

        firstItem.classList.add('active');
        if (firstCard) {
            firstCard.classList.add('active');
            firstCard.style.display = 'block';
            firstCard.style.opacity = '1';
        }

        serviceItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                const target = this.getAttribute('data-service');
                const newMarqueeText = this.getAttribute('data-marquee');

                // Update Menu Items Active States
                serviceItems.forEach(si => si.classList.remove('active'));
                this.classList.add('active');

                // Update Cards visibility
                serviceCards.forEach(card => {
                    card.classList.remove('active');
                    card.style.display = 'none';
                    card.style.opacity = '0';
                });

                const targetCard = document.getElementById(`service-${target}`);
                if (targetCard) {
                    targetCard.classList.add('active');
                    targetCard.style.display = 'block';
                    // Trigger reflow
                    void targetCard.offsetWidth;
                    targetCard.style.opacity = '1';
                }

                // Update Background Marquee
                if (servicesMarquee) {
                    servicesMarquee.classList.add('active');
                }
                if (newMarqueeText && marqueeTexts.length > 0) {
                    marqueeTexts.forEach(span => {
                        span.textContent = newMarqueeText;
                    });
                }
            });

            item.addEventListener('mouseleave', function () {
                serviceItems.forEach(si => si.classList.remove('active'));
                serviceCards.forEach(card => {
                    card.classList.remove('active');
                    card.style.display = 'none';
                    card.style.opacity = '0';
                });
                if (servicesMarquee) {
                    servicesMarquee.classList.remove('active');
                }
            });

            item.addEventListener('click', function () {
                const target = this.getAttribute('data-service');
                if (target === 'events') window.location.href = 'events.html';
                else if (target === 'exhibition') window.location.href = 'exhibitions.html';
                else if (target === 'design') window.location.href = 'design.html';
                else if (target === 'branding') window.location.href = 'branding.html';
            });
        });
    }

    // --- NAVBAR HIDE/SHOW ON SCROLL ---
    let lastScrollTop = 0;
    const scrollThreshold = 10;

    window.addEventListener('scroll', () => {
        const headerWrapper = document.querySelector('.header-main-wrapper');
        if (!headerWrapper) return;

        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll < 0) return; // For iOS bounce
        if (Math.abs(lastScrollTop - currentScroll) <= scrollThreshold) return;

        // Force hide in Team section
        const teamSection = document.getElementById('team');
        let inTeam = false;
        if (teamSection) {
            const rect = teamSection.getBoundingClientRect();
            // If team section is taking up significant space or is at the top
            if (rect.top < 150 && rect.bottom > 100) {
                inTeam = true;
            }
        }

        if (inTeam) {
            headerWrapper.classList.add('nav-hidden');
        } else if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling down
            headerWrapper.classList.add('nav-hidden');
        } else {
            // Scrolling up
            headerWrapper.classList.remove('nav-hidden');
        }
        lastScrollTop = currentScroll;
    }, { passive: true });

    // Team Section Force Hide (using observer for better performance)
    const initTeamObserver = () => {
        const teamSection = document.getElementById('team');
        const headerWrapper = document.querySelector('.header-main-wrapper');

        if (teamSection && headerWrapper) {
            const teamObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        headerWrapper.classList.add('nav-hidden');
                    }
                });
            }, { threshold: 0.1, rootMargin: "-100px 0px 0px 0px" });
            teamObserver.observe(teamSection);
        } else if (!headerWrapper) {
            // Try again in a bit if navbar hasn't loaded
            setTimeout(initTeamObserver, 500);
        }
    };
    initTeamObserver();

    // --- HERO VIDEO LAZY LOAD (disabled) ---
    // const heroVideo = document.getElementById('heroVideo');
    // if (heroVideo) {
    //     const source = heroVideo.querySelector('source');
    //     if (source && source.dataset.src) {
    //         source.src = source.dataset.src;
    //         heroVideo.load();
    //     }
    // }

    // --- ACTIVE LINK HIGHLIGHTING ---
    function setActiveLink() {
        let currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '') {
            currentPath = '/index.html';
        }
        const navLinks = document.querySelectorAll('.pill-nav-links a, .mobile-nav-links a');

        navLinks.forEach(link => {
            let linkPath = link.getAttribute('href');
            if (!linkPath) return;
            
            // Normalize leading slashes
            const normPath = linkPath.startsWith('/') ? linkPath : '/' + linkPath;
            
            // Compare without extensions and trailing slashes for cleanUrl compatibility
            const cleanCurrent = currentPath.replace('.html', '').replace(/\/$/, '');
            const cleanLink = normPath.replace('.html', '').replace(/\/$/, '');
            
            if (cleanLink === cleanCurrent) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Run on load
    setActiveLink();

    // Run again when partials load (navbar is dynamic)
    document.addEventListener('partialsLoaded', setActiveLink);
// Dynamically fetch subscriber count and update UI
fetch('data/subscriberCount.json')
  .then(response => response.json())
  .then(data => {
    const countEl = document.getElementById('subscriberCount');
    if (countEl && typeof data.count === 'number') {
      countEl.textContent = `${data.count} Subscribers`;
    }
  })
  .catch(err => console.error('Failed to load subscriber count:', err));
});

// --- MOBILE MENU LOGIC (Event Delegation for Dynamic Nav) ---
document.addEventListener('click', function (e) {
    const mobileBtn = e.target.closest('#mobileMenuBtn');
    const closeBtn = e.target.closest('#mobileCloseBtn');
    const overlay = document.getElementById('mobileOverlay');
    const mobileLink = e.target.closest('.mobile-nav-links a');

    if (mobileBtn && overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if ((closeBtn || mobileLink) && overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// --- GOOGLE TRANSLATE LOGIC ---
function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

function toggleLanguage() {
    let currentLang = getCookie('googtrans');
    let targetLang = (currentLang && currentLang.endsWith('/ar')) ? 'en' : 'ar';
    
    // Switch cookie
    if (targetLang === 'en') {
        // Clear the googtrans cookie to restore default behavior on reload / subsequent pages
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
    } else {
        document.cookie = `googtrans=/en/${targetLang}; path=/`;
        document.cookie = `googtrans=/en/${targetLang}; domain=${window.location.hostname}; path=/`;
        document.cookie = `googtrans=/en/${targetLang}; domain=.${window.location.hostname}; path=/`;
    }

    // Try to switch using the hidden Google Translate dropdown without reload
    let selectField = document.querySelector('select.goog-te-combo');
    if (selectField) {
        // Check if targetLang option exists in the select dropdown
        let optionExists = Array.from(selectField.options).some(opt => opt.value === targetLang);
        if (optionExists) {
            selectField.value = targetLang;
        } else if (targetLang === 'en') {
            // For English (source language), the dropdown uses empty string "" to restore the original language
            selectField.value = '';
        }
        selectField.dispatchEvent(new Event('change'));
        updateLangUI(); // Update UI without reload
    } else {
        // Fallback to reload if widget is not initialized yet
        location.reload();
    }
}

// Load Google Translate Script
if (!document.getElementById('google-translate-script')) {
    // Ensure the container exists in the DOM regardless of partials loading
    if (!document.getElementById('google_translate_element')) {
        const gtDiv = document.createElement('div');
        gtDiv.id = 'google_translate_element';
        gtDiv.style.display = 'none';
        document.body.appendChild(gtDiv);
    }

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(script);
    
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'ar,en',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
    };
}

// Update the language toggle button UI on load
document.addEventListener('DOMContentLoaded', () => {
    // Also run on partialsLoaded in case button is dynamically loaded
    document.addEventListener('partialsLoaded', updateLangUI);
    updateLangUI();
});

function updateLangUI() {
    let currentLang = getCookie('googtrans');
    let langLabel = document.getElementById('langLabel');
    if (langLabel) {
        if (currentLang && currentLang.endsWith('/ar')) {
            langLabel.textContent = 'EN';
            langLabel.parentElement.title = "Translate to English";
        } else {
            langLabel.textContent = 'AR';
            langLabel.parentElement.title = "Translate to Arabic";
        }
    }
}
