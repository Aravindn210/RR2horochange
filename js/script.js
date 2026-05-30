
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
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
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

    // --- HERO VIDEO LAZY LOAD ---
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        const source = heroVideo.querySelector('source');
        if (source && source.dataset.src) {
            source.src = source.dataset.src;
            heroVideo.load();
        }
    }

    // --- ACTIVE LINK HIGHLIGHTING ---
    function setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.pill-nav-links a, .mobile-nav-links a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
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

