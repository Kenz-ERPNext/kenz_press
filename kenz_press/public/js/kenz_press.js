/**
 * Kenz Press - Main JavaScript
 * Modern interactions and animations for the website
 */

(function() {
    'use strict';

    // =====================================================
    // THEME TOGGLE
    // =====================================================

    const ThemeManager = {
        storageKey: 'kenz-press-theme',

        init() {
            this.toggle = document.getElementById('theme-toggle');
            this.html = document.documentElement;

            // Load saved theme or default to dark
            const savedTheme = localStorage.getItem(this.storageKey);

            // If no saved theme, default to dark
            if (!savedTheme) {
                this.setTheme('dark');
            } else {
                this.setTheme(savedTheme);
            }

            // Bind toggle click
            if (this.toggle) {
                this.toggle.addEventListener('click', () => this.toggleTheme());
            }
        },

        setTheme(theme) {
            this.html.setAttribute('data-theme', theme);
            localStorage.setItem(this.storageKey, theme);

            // Also set on body for additional specificity
            document.body.setAttribute('data-theme', theme);
        },

        toggleTheme() {
            const currentTheme = this.html.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        }
    };

    // =====================================================
    // MOBILE NAVIGATION
    // =====================================================

    const MobileNav = {
        init() {
            this.toggle = document.getElementById('navbar-toggle');
            this.menu = document.getElementById('mobile-menu');
            this.isOpen = false;

            if (this.toggle && this.menu) {
                this.toggle.addEventListener('click', () => this.toggleMenu());

                // Close menu when clicking links
                const links = this.menu.querySelectorAll('a');
                links.forEach(link => {
                    link.addEventListener('click', () => this.closeMenu());
                });

                // Close menu on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.closeMenu();
                    }
                });
            }
        },

        toggleMenu() {
            this.isOpen = !this.isOpen;
            this.toggle.classList.toggle('active', this.isOpen);
            this.menu.classList.toggle('active', this.isOpen);
            document.body.style.overflow = this.isOpen ? 'hidden' : '';
        },

        closeMenu() {
            this.isOpen = false;
            this.toggle.classList.remove('active');
            this.menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // =====================================================
    // STICKY NAVBAR
    // =====================================================

    const StickyNavbar = {
        init() {
            this.navbar = document.getElementById('navbar');
            this.lastScrollY = 0;
            this.scrollThreshold = 100;

            if (this.navbar) {
                window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
            }
        },

        handleScroll() {
            const currentScrollY = window.scrollY;

            // Add scrolled class for styling
            if (currentScrollY > this.scrollThreshold) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Optional: Hide navbar on scroll down, show on scroll up
            // if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            //     this.navbar.style.transform = 'translateY(-100%)';
            // } else {
            //     this.navbar.style.transform = 'translateY(0)';
            // }

            this.lastScrollY = currentScrollY;
        }
    };

    // =====================================================
    // SMOOTH SCROLL
    // =====================================================

    const SmoothScroll = {
        init() {
            // Handle anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');

                    if (href === '#') return;

                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        this.scrollToElement(target);
                    }
                });
            });
        },

        scrollToElement(element, offset = 100) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // =====================================================
    // INTERSECTION OBSERVER ANIMATIONS
    // =====================================================

    const RevealAnimations = {
        init() {
            // Elements to animate
            const revealElements = document.querySelectorAll(
                '.feature-card, .app-card, .pricing-card, .testimonial-card, .section-header'
            );

            if (!revealElements.length) return;

            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => {
                el.classList.add('reveal');
                observer.observe(el);
            });
        }
    };

    // =====================================================
    // COUNTER ANIMATION
    // =====================================================

    const CounterAnimation = {
        init() {
            const counters = document.querySelectorAll('.stat-value');

            if (!counters.length) return;

            const observerOptions = {
                threshold: 0.5
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            counters.forEach(counter => observer.observe(counter));
        },

        animateCounter(element) {
            const text = element.textContent;
            const match = text.match(/(\d+(?:\.\d+)?)/);

            if (!match) return;

            const targetNumber = parseFloat(match[1]);
            const suffix = text.replace(match[1], '');
            const duration = 2000;
            const startTime = performance.now();
            const isDecimal = text.includes('.');

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentNumber = targetNumber * easeOut;

                if (isDecimal) {
                    element.textContent = currentNumber.toFixed(1) + suffix;
                } else {
                    element.textContent = Math.floor(currentNumber) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = text; // Ensure final value matches original
                }
            };

            requestAnimationFrame(animate);
        }
    };

    // =====================================================
    // TYPING ANIMATION (Optional - for hero)
    // =====================================================

    const TypingAnimation = {
        init(selector, words, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
            const element = document.querySelector(selector);
            if (!element) return;

            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            const type = () => {
                const currentWord = words[wordIndex];

                if (isDeleting) {
                    element.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    element.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                }

                let timeout = isDeleting ? deleteSpeed : typeSpeed;

                if (!isDeleting && charIndex === currentWord.length) {
                    timeout = pauseTime;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }

                setTimeout(type, timeout);
            };

            type();
        }
    };

    // =====================================================
    // PARALLAX EFFECT (Subtle)
    // =====================================================

    const ParallaxEffect = {
        init() {
            this.elements = document.querySelectorAll('.hero-section::before');

            if (!this.elements.length && !document.querySelector('.hero-section')) return;

            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        },

        handleScroll() {
            const scrollY = window.scrollY;
            const heroSection = document.querySelector('.hero-section');

            if (heroSection && scrollY < window.innerHeight) {
                // Subtle parallax on hero gradient
                const offset = scrollY * 0.3;
                heroSection.style.backgroundPosition = `center ${offset}px`;
            }
        }
    };

    // =====================================================
    // DROPDOWN HOVER DELAY
    // =====================================================

    const DropdownManager = {
        init() {
            const dropdowns = document.querySelectorAll('.nav-dropdown');

            dropdowns.forEach(dropdown => {
                let timeout;

                dropdown.addEventListener('mouseenter', () => {
                    clearTimeout(timeout);
                    dropdown.classList.add('active');
                });

                dropdown.addEventListener('mouseleave', () => {
                    timeout = setTimeout(() => {
                        dropdown.classList.remove('active');
                    }, 150);
                });
            });
        }
    };

    // =====================================================
    // FORM HANDLING (For future use)
    // =====================================================

    const FormHandler = {
        init() {
            const forms = document.querySelectorAll('form[data-ajax]');

            forms.forEach(form => {
                form.addEventListener('submit', (e) => this.handleSubmit(e, form));
            });
        },

        async handleSubmit(e, form) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Add your form submission logic here
                console.log('Form data:', data);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Success handling
                form.reset();
                this.showMessage(form, 'success', 'Thank you! We\'ll be in touch soon.');
            } catch (error) {
                this.showMessage(form, 'error', 'Something went wrong. Please try again.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        },

        showMessage(form, type, message) {
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) existingMessage.remove();

            const messageEl = document.createElement('div');
            messageEl.className = `form-message form-message-${type}`;
            messageEl.textContent = message;

            form.appendChild(messageEl);

            setTimeout(() => messageEl.remove(), 5000);
        }
    };

    // =====================================================
    // LOADING STATE
    // =====================================================

    const LoadingManager = {
        init() {
            // Remove loading class when page is ready
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }
    };

    // =====================================================
    // INITIALIZE ALL MODULES
    // =====================================================

    const App = {
        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initModules());
            } else {
                this.initModules();
            }
        },

        initModules() {
            // Core functionality
            ThemeManager.init();
            MobileNav.init();
            StickyNavbar.init();
            SmoothScroll.init();
            DropdownManager.init();

            // Animations
            RevealAnimations.init();
            CounterAnimation.init();

            // Optional features
            // ParallaxEffect.init();
            // FormHandler.init();

            // Loading state
            LoadingManager.init();

            console.log('Kenz Press initialized');
        }
    };

    // Start the application
    App.init();

})();
