/* ═══════════════════════════════════════════════════════════
   FFmpeg++ Landing Page — Interactions
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('ffmpegpp-theme', next);
        });
    }

    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Cursor hover states
        const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], [data-tilt]');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }

    // --- Magnetic Elements ---
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                el.style.transition = '';
            }, 400);
        });
    });

    // --- Navigation Scroll Effect ---
    const nav = document.getElementById('nav');
    let lastScrollY = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 50);
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Reveal Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Counter Animation ---
    const counterElements = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, 0, target, 1500);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    function animateCounter(el, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(start + (end - start) * eased);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // --- Tilt Effect ---
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (0.5 - y) * 4;
            const tiltY = (x - 0.5) * 4;

            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                el.style.transition = '';
            }, 500);
        });
    });

    // --- Showcase Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const showcaseImgs = document.querySelectorAll('.showcase-img');
    let currentTab = 'main';
    let isTransitioning = false;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            if (tab === currentTab || isTransitioning) return;

            isTransitioning = true;
            currentTab = tab;

            // Update tab buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Find current and next images
            const currentImg = document.querySelector('.showcase-img.active');
            const nextImg = document.querySelector(`.showcase-img[data-tab="${tab}"]`);

            if (currentImg && nextImg && currentImg !== nextImg) {
                // Fade out current
                currentImg.style.opacity = '0';
                currentImg.style.transform = 'scale(0.98)';

                // After a short delay, swap positions and fade in
                setTimeout(() => {
                    currentImg.classList.remove('active');
                    currentImg.style.position = 'absolute';
                    currentImg.style.top = '0';
                    currentImg.style.left = '0';

                    nextImg.classList.add('active');
                    nextImg.style.position = 'relative';
                    nextImg.style.opacity = '0';
                    nextImg.style.transform = 'scale(0.98)';

                    // Force reflow then animate in
                    requestAnimationFrame(() => {
                        nextImg.style.opacity = '1';
                        nextImg.style.transform = 'scale(1)';
                    });

                    setTimeout(() => {
                        isTransitioning = false;
                    }, 400);
                }, 250);
            } else {
                isTransitioning = false;
            }
        });
    });

    // --- Before/After Slider ---
    const slider = document.getElementById('compareSlider');
    const handle = document.getElementById('compareHandle');

    if (slider && handle) {
        let isDragging = false;

        function updateSlider(clientX) {
            const rect = slider.getBoundingClientRect();
            let x = (clientX - rect.left) / rect.width;
            x = Math.max(0.05, Math.min(0.95, x));

            const percent = x * 100;
            const afterEl = slider.querySelector('.compare-after');
            afterEl.style.clipPath = `inset(0 0 0 ${percent}%)`;
            handle.style.left = `${percent}%`;
        }

        function startDrag(e) {
            isDragging = true;
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        }

        function endDrag() {
            isDragging = false;
            document.body.style.cursor = '';
        }

        function onMove(e) {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        }

        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: false });
        slider.addEventListener('mousedown', startDrag);
        slider.addEventListener('touchstart', startDrag, { passive: false });

        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
    }

    // --- Parallax Effect on Hero ---
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                const translateY = scrollY * 0.1;
                const scale = 1 - scrollY * 0.0001;
                const opacity = Math.max(1 - scrollY * 0.0006, 0.3);

                heroVisual.style.transform = `translateY(${translateY}px) scale(${Math.max(scale, 0.95)})`;
                heroVisual.style.opacity = opacity;
            }
        }, { passive: true });
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Float elements parallax ---
    const floatElements = document.querySelectorAll('.float-element');
    if (floatElements.length > 0) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            floatElements.forEach((el, i) => {
                const factor = (i + 1) * 6;
                el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

})();
