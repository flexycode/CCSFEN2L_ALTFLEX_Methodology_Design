/**
 * AltFlex Capstone Methodology Design
 * Interactive JavaScript for Premium Presentation Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    initNavigation();

    // Scroll Effects
    initScrollEffects();

    // Phase Tabs
    initPhaseTabs();

    // Animations
    initScrollAnimations();
});

/**
 * Navigation functionality - FIXED smooth scroll
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';

            // Handle anchor links with smooth scroll
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    // Calculate offset (navbar height + some padding)
                    const navbarHeight = navbar.offsetHeight;
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Update URL hash without jumping
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Also handle CTA buttons and other anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.classList.contains('nav-link')) {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.length > 1) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const target = document.getElementById(targetId);

                    if (target) {
                        const navbarHeight = navbar.offsetHeight;
                        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });

                        history.pushState(null, null, href);
                    }
                }
            });
        }
    });

    // Handle initial hash on page load
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

/**
 * Scroll-based effects and active nav highlighting
 */
function initScrollEffects() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Highlight active nav link based on scroll position
    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        const navbarHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to matching link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Throttle scroll event for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateActiveNav();

    // Parallax effect for gradient orbs (only on desktop)
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const orbs = document.querySelectorAll('.gradient-orb');

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.03;
                orb.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
}

/**
 * Phase tabs functionality
 */
function initPhaseTabs() {
    const tabs = document.querySelectorAll('.phase-tab');
    const panels = document.querySelectorAll('.phase-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPhase = tab.getAttribute('data-phase');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetPhase) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Animate children with stagger effect
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatableElements = document.querySelectorAll(
        '.glass-card, .deliverable-card, .sprint-card, .team-card, ' +
        '.ceremony-card, .tool-card, .reference-card, .success-card, ' +
        '.rationale-card, .stack-category, .factor-item'
    );

    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .nav-link.active {
            color: var(--text-primary) !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Counter animation for stats
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/**
 * Initialize counter animations when stats come into view
 */
function initCounterAnimations() {
    const statValues = document.querySelectorAll('.stat-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;

                // Only animate numeric values
                if (!isNaN(parseInt(text))) {
                    const target = parseInt(text);
                    animateCounter(element, target);
                }

                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => observer.observe(stat));
}

// Initialize counter animations
document.addEventListener('DOMContentLoaded', initCounterAnimations);

/**
 * Chart bar hover effects
 */
document.querySelectorAll('.chart-bar').forEach(bar => {
    bar.addEventListener('mouseenter', function () {
        this.style.filter = 'brightness(1.2)';
    });

    bar.addEventListener('mouseleave', function () {
        this.style.filter = 'brightness(1)';
    });
});

/**
 * Copy code functionality (for future use)
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

/**
 * Toast notification
 */
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Add toast animation styles
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * Handle window resize - close mobile menu on desktop
 */
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

console.log('🔐 AltFlex Capstone Methodology Design loaded successfully!');
