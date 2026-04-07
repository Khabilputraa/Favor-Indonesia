/* ============================================
   FAVOR INDONESIA — ABOUT PAGE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar hover dropdown ── */
    if (window.innerWidth >= 992) {
        document.querySelectorAll('.navbar .dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu   = dropdown.querySelector('.dropdown-menu');
            dropdown.addEventListener('mouseenter', () => {
                dropdown.classList.add('show');
                toggle?.setAttribute('aria-expanded', 'true');
                menu?.classList.add('show');
            });
            dropdown.addEventListener('mouseleave', () => {
                dropdown.classList.remove('show');
                toggle?.setAttribute('aria-expanded', 'false');
                menu?.classList.remove('show');
            });
        });
    }

    /* ── Hero load animation ── */
    const hero = document.getElementById('about-hero');
    if (hero) {
        setTimeout(() => hero.classList.add('loaded'), 100);
    }

    /* ── Intersection Observer: scroll reveals ── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal-up, [data-reveal]').forEach(el => {
        observer.observe(el);
    });

    /* ── Staggered children within sections ── */
    function staggerChildren(parentSelector, childSelector, baseDelay = 0) {
        document.querySelectorAll(parentSelector).forEach(parent => {
            const childObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    parent.querySelectorAll(childSelector).forEach((child, i) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, baseDelay + i * 100);
                    });
                    childObserver.unobserve(parent);
                }
            }, { threshold: 0.1 });
            childObserver.observe(parent);
        });
    }

    /* Apply initial hidden state for staggered elements */
    const staggerTargets = document.querySelectorAll('.phil-card, .std-item, .vm-card-new');
    staggerTargets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    });

    staggerChildren('.philosophy-track', '.phil-card', 0);
    staggerChildren('.standards-right', '.std-item', 0);
    staggerChildren('.vm-cards', '.vm-card-new', 120);

    /* ── Animated counter ── */
    function animateCounter(el, target, duration = 1800) {
        const start = performance.now();
        const isLarge = target >= 1000;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            if (isLarge) {
                el.textContent = current.toLocaleString('id-ID');
            } else {
                el.textContent = current;
            }

            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = isLarge ? target.toLocaleString('id-ID') : target;
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                if (!isNaN(target) && !el.dataset.counted) {
                    el.dataset.counted = '1';
                    animateCounter(el, target);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

    /* ── Parallax hero bg ── */
    const heroBg = document.querySelector('.hero-bg-img');
    if (heroBg && window.innerWidth > 768) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.18}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* ── Drag-scroll philosophy track ── */
    const scrollContainer = document.querySelector('.philosophy-scroll-container');
    if (scrollContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.style.cursor = 'grabbing';
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener('mouseleave', () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        });

        scrollContainer.addEventListener('mouseup', () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        });

        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 1.5;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
    }

    /* ── Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    /* ── Navbar scroll behavior ── */
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

});