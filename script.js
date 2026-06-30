// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const topBar = document.querySelector('.top-bar');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dots = document.querySelectorAll('.slider-dots .dot');
const modal = document.getElementById('contact-form');
const modalClose = document.querySelector('.modal .close');
const contactLinks = document.querySelectorAll('a[href="#contact-form"]');
const contactForm = document.querySelector('.contact-form');
const serviceLinks = document.querySelectorAll('.service-link');
const serviceModalCTAs = document.querySelectorAll('.service-modal-cta a');
const projectCards = document.querySelectorAll('.project-card[data-modal]');
const principleSlides = document.querySelectorAll('.principle-slide');
const principlesPrevBtn = document.querySelector('.principles-prev');
const principlesNextBtn = document.querySelector('.principles-next');
const principleDots = document.querySelectorAll('.principles-dots .dot');

function updateTopBarHeight() {
    if (!topBar) return;
    const wasCollapsed = topBar.classList.contains('collapsed');
    if (wasCollapsed) topBar.classList.remove('collapsed');
    const h = topBar.scrollHeight;
    topBar.style.setProperty('--topbar-max-height', h + 'px');
    if (wasCollapsed) topBar.classList.add('collapsed');
}

function syncHeroOffset() {
    const header = document.querySelector('.header');
    const heroEl = document.querySelector('.hero');
    const pageEl = document.querySelector('.page-content');
    if (!header) return;
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
    if (heroEl) {
        heroEl.style.marginTop = header.offsetHeight + 'px';
    } else if (pageEl) {
        pageEl.style.marginTop = header.offsetHeight + 'px';
    }
}
// Current slide index
let currentSlide = 0;
let slideInterval;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentPrinciple = 0;
let principleInterval;

// Mobile Navigation Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    if (navMenu.classList.contains('active')) {
        navToggle.classList.add('open');
    } else {
        navToggle.classList.remove('open');
    }
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
    });
});

// Hero Slider Functions
function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Reset and restart animation
    const slideContent = slides[index].querySelector('.slide-content');
    const title = slideContent.querySelector('.slide-title');
    const description = slideContent.querySelector('.slide-description');
    const button = slideContent.querySelector('.btn');
    
    // Remove and re-add animation classes
    [title, description, button].forEach(el => {
        if (el) {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = '';
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    resetAutoSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    resetAutoSlide();
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    if (!prefersReducedMotion) {
        slideInterval = setInterval(nextSlide, 6000);
    }
}
function showPrincipleSlide(index) {
    principleSlides.forEach(s => s.classList.remove('active'));
    principleDots.forEach(d => d.classList.remove('active'));
    if (principleSlides[index]) principleSlides[index].classList.add('active');
    if (principleDots[index]) principleDots[index].classList.add('active');
}
function nextPrincipleSlide() {
    currentPrinciple = (currentPrinciple + 1) % principleSlides.length;
    showPrincipleSlide(currentPrinciple);
    resetPrincipleAutoSlide();
}
function prevPrincipleSlide() {
    currentPrinciple = (currentPrinciple - 1 + principleSlides.length) % principleSlides.length;
    showPrincipleSlide(currentPrinciple);
    resetPrincipleAutoSlide();
}
function resetPrincipleAutoSlide() {
    clearInterval(principleInterval);
    if (!prefersReducedMotion && principleSlides.length > 0) {
        principleInterval = setInterval(nextPrincipleSlide, 8000);
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Modal Functions
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Header scroll effect
let lastScrollY = window.scrollY;
let downDistance = 0;
let upDistance = 0;
const DOWN_THRESHOLD = 120;
const UP_THRESHOLD = 80;
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const current = window.scrollY;
    if (current > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--bg-white)';
        header.style.backdropFilter = 'none';
    }
    if (topBar) {
        if (current < 20) {
            topBar.classList.remove('collapsed');
            downDistance = 0;
            upDistance = 0;
        } else if (current > lastScrollY) {
            downDistance += current - lastScrollY;
            upDistance = 0;
            if (!topBar.classList.contains('collapsed') && downDistance > DOWN_THRESHOLD) {
                topBar.classList.add('collapsed');
            }
        } else if (current < lastScrollY) {
            upDistance += lastScrollY - current;
            downDistance = 0;
            if (topBar.classList.contains('collapsed') && upDistance > UP_THRESHOLD) {
                topBar.classList.remove('collapsed');
                updateTopBarHeight();
            }
        }
    }
    lastScrollY = current;
    syncHeroOffset();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .about-content, .partners-grid, .brand-list li, .brand-slogan, .about-list li, .about-slogan, .services-list li, .services-slogan, .services-lead, .principle-text, .clients-list li, .flags-list li');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 20);
    });
}

// Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        closeModal();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Newsletter form handling
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Show success message
    alert('Thank you for subscribing! You will receive our newsletter at: ' + email);
    e.target.reset();
}

// Event Listeners
navToggle.addEventListener('click', toggleMobileMenu);

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        resetAutoSlide();
    });
    dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            currentSlide = index;
            showSlide(currentSlide);
            resetAutoSlide();
        }
    });
});
if (principlesPrevBtn && principlesNextBtn) {
    principlesPrevBtn.addEventListener('click', prevPrincipleSlide);
    principlesNextBtn.addEventListener('click', nextPrincipleSlide);
}
principleDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentPrinciple = index;
        showPrincipleSlide(currentPrinciple);
        resetPrincipleAutoSlide();
    });
});

contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const id = link.dataset.modal;
        if (id) {
            e.preventDefault();
            openModalById(id);
        }
    });
});

serviceModalCTAs.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const val = btn.dataset.service;
        closeAllModals();
        openModal();
        const sel = document.getElementById('service');
        if (sel && val) sel.value = val;
    });
});

projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const id = card.dataset.modal;
        if (id) openModalById(id);
    });
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const id = card.dataset.modal;
            if (id) openModalById(id);
        }
    });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
document.querySelectorAll('.modal .close').forEach(btn => btn.addEventListener('click', closeAllModals));

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
    document.querySelectorAll('.modal').forEach(m => {
        if (e.target === m) {
            closeAllModals();
        }
    });
});



if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
    
    if (slides.length > 0) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
});

// Initialize slider
if (slides.length > 0) {
    showSlide(currentSlide);
    resetAutoSlide();
}
if (principleSlides.length > 0) {
    showPrincipleSlide(currentPrinciple);
    resetPrincipleAutoSlide();
}

const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(slideInterval));
    hero.addEventListener('mouseleave', resetAutoSlide);
    hero.addEventListener('focusin', () => clearInterval(slideInterval));
    hero.addEventListener('focusout', resetAutoSlide);
}
const principlesSection = document.querySelector('.principles');
if (principlesSection) {
    principlesSection.addEventListener('mouseenter', () => clearInterval(principleInterval));
    principlesSection.addEventListener('mouseleave', resetPrincipleAutoSlide);
}

// Animate counters when about section is visible
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
}

// Lazy loading for images
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedScroll = debounce(handleHeaderScroll, 10);
window.addEventListener('scroll', debouncedScroll);
document.addEventListener('DOMContentLoaded', () => { updateTopBarHeight(); });
window.addEventListener('resize', updateTopBarHeight);
document.addEventListener('DOMContentLoaded', syncHeroOffset);
window.addEventListener('resize', syncHeroOffset);
document.addEventListener('DOMContentLoaded', initServiceModals);
document.addEventListener('DOMContentLoaded', initAboutSlider);
document.addEventListener('DOMContentLoaded', initServiceProcess);
document.addEventListener('DOMContentLoaded', initLanguageSwitch);
document.addEventListener('DOMContentLoaded', initProjectFilters);
document.addEventListener('DOMContentLoaded', initProjectTimeline);

if (topBar) {
    topBar.addEventListener('transitionend', () => {
        updateTopBarHeight();
        syncHeroOffset();
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const overlay = this.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.background = 'rgba(0,0,0,0.8)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const overlay = this.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.background = 'rgba(0,0,0,0.7)';
        }
    });
});

// Add CSS for smooth transitions
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) * {
        transition: none !important;
    }
    
    .loaded .service-card,
    .loaded .project-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    }
    
    .loaded .btn {
        transition: all 0.3s ease !important;
    }
    
    .loaded .nav-link {
        transition: color 0.3s ease, background-color 0.3s ease !important;
    }
    
    .loaded img {
        transition: transform 0.3s ease, filter 0.3s ease !important;
    }
`;
document.head.appendChild(style);
let projectFilterState = { cat: 'all', start: null, end: null };
function getCardYears(card) {
    const ds = card.dataset;
    let a = ds.yearStart ? parseInt(ds.yearStart) : NaN;
    let b = ds.yearEnd ? parseInt(ds.yearEnd) : NaN;
    if (isNaN(a) || isNaN(b)) {
        const t = card.querySelector('.project-title');
        const s = t ? t.textContent : '';
        const m = s.match(/(\d{4})(?:\s*[-–]\s*(\d{4}))?/);
        if (m) {
            a = parseInt(m[1]);
            b = m[2] ? parseInt(m[2]) : a;
        }
    }
    return [a, b];
}
function applyProjectFilters() {
    const cards = document.querySelectorAll('#implemented-projects .project-card');
    cards.forEach(card => {
        const c = card.dataset.category;
        const y = getCardYears(card);
        let show = true;
        if (projectFilterState.cat && projectFilterState.cat !== 'all') {
            show = show && c === projectFilterState.cat;
        }
        if (projectFilterState.start != null && projectFilterState.end != null && !isNaN(y[0]) && !isNaN(y[1])) {
            show = show && y[1] >= projectFilterState.start && y[0] <= projectFilterState.end;
        }
        card.style.display = show ? '' : 'none';
    });
}
function initProjectFilters() {
    const chips = document.querySelectorAll('.project-categories .category-chip');
    if (chips.length === 0) return;
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const active = chip.classList.contains('active');
            chips.forEach(c => c.classList.remove('active'));
            if (active) {
                projectFilterState.cat = 'all';
                applyProjectFilters();
            } else {
                chip.classList.add('active');
                projectFilterState.cat = chip.dataset.cat;
                applyProjectFilters();
            }
        });
        chip.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                chip.click();
            }
        });
    });
    const allChip = document.querySelector('.project-categories .category-chip[data-cat="all"]');
    if (allChip) {
        allChip.classList.add('active');
        projectFilterState.cat = 'all';
        applyProjectFilters();
    }
}
function initProjectTimeline() {
    const container = document.querySelector('#implemented-projects .project-timeline');
    if (!container) return;
    const s = container.querySelector('.year-start');
    const e = container.querySelector('.year-end');
    const sl = container.querySelector('#timeline-year-start');
    const el = container.querySelector('#timeline-year-end');
    const scale = container.querySelector('.timeline-scale');
    const track = scale ? scale.querySelector('.scale-track') : null;
    const fill = scale ? scale.querySelector('.scale-fill') : null;
    const tStart = scale ? scale.querySelector('.thumb-start') : null;
    const tEnd = scale ? scale.querySelector('.thumb-end') : null;
    const yearsEl = scale ? scale.querySelector('.timeline-years') : null;
    const cards = document.querySelectorAll('#implemented-projects .project-card');
    let min = Infinity, max = -Infinity;
    cards.forEach(card => {
        const y = getCardYears(card);
        if (!isNaN(y[0])) min = Math.min(min, y[0]);
        if (!isNaN(y[1])) max = Math.max(max, y[1]);
    });
    if (!isFinite(min) || !isFinite(max)) return;
    s.min = String(min);
    s.max = String(max);
    e.min = String(min);
    e.max = String(max);
    s.value = String(min);
    e.value = String(max);
    projectFilterState.start = parseInt(s.value);
    projectFilterState.end = parseInt(e.value);
    if (sl) sl.textContent = s.value;
    if (el) el.textContent = e.value;
    function toPercent(y) {
        const r = max - min;
        if (r <= 0) return 0;
        return ((y - min) / r) * 100;
    }
    function niceStep(range, maxLabels) {
        const raw = Math.ceil(range / maxLabels);
        const pow = Math.pow(10, Math.floor(Math.log10(raw)));
        const base = raw / pow;
        let stepBase = base <= 1 ? 1 : base <= 2 ? 2 : base <= 5 ? 5 : 10;
        return stepBase * pow;
    }
    function updateTicks() {
        if (!yearsEl) return;
        yearsEl.innerHTML = '';
        const isMobile = window.innerWidth < 768;
        const maxLabels = isMobile ? 6 : 12;
        const range = max - min;
        const step = Math.max(1, niceStep(range, maxLabels));
        const addTick = (y) => {
            const b = document.createElement('button');
            b.className = 'year-tick';
            b.textContent = String(y);
            b.dataset.year = String(y);
            b.style.left = toPercent(y) + '%';
            b.addEventListener('click', () => {
                const ys = projectFilterState.start;
                const ye = projectFilterState.end;
                const dyS = Math.abs(y - ys);
                const dyE = Math.abs(y - ye);
                if (dyS <= dyE) {
                    projectFilterState.start = Math.min(y, projectFilterState.end);
                } else {
                    projectFilterState.end = Math.max(y, projectFilterState.start);
                }
                s.value = String(projectFilterState.start);
                e.value = String(projectFilterState.end);
                updateUI();
                applyProjectFilters();
            });
            yearsEl.appendChild(b);
        };
        addTick(min);
        const startTick = Math.ceil(min / step) * step;
        for (let y = startTick; y < max; y += step) {
            if (y !== min && y !== max) addTick(y);
        }
        if (max !== min) addTick(max);
    }
    function updateUI() {
        if (tStart && tEnd && fill) {
            const ps = toPercent(projectFilterState.start);
            const pe = toPercent(projectFilterState.end);
            tStart.style.left = ps + '%';
            tEnd.style.left = pe + '%';
            fill.style.left = ps + '%';
            fill.style.width = (pe - ps) + '%';
        }
        if (yearsEl) {
            yearsEl.querySelectorAll('.year-tick').forEach(t => {
                const y = parseInt(t.dataset.year);
                const inRange = y >= projectFilterState.start && y <= projectFilterState.end;
                t.classList.toggle('in-range', inRange);
            });
        }
        if (sl) sl.textContent = String(projectFilterState.start);
        if (el) el.textContent = String(projectFilterState.end);
    }
    updateTicks();
    updateUI();
    function updateFromStart() {
        let a = parseInt(s.value);
        let b = parseInt(e.value);
        if (a > b) { b = a; e.value = String(b); }
        projectFilterState.start = a;
        projectFilterState.end = b;
        if (sl) sl.textContent = String(a);
        if (el) el.textContent = String(b);
        updateUI();
        applyProjectFilters();
    }
    function updateFromEnd() {
        let a = parseInt(s.value);
        let b = parseInt(e.value);
        if (b < a) { a = b; s.value = String(a); }
        projectFilterState.start = a;
        projectFilterState.end = b;
        if (sl) sl.textContent = String(a);
        if (el) el.textContent = String(b);
        updateUI();
        applyProjectFilters();
    }
    s.addEventListener('input', updateFromStart);
    e.addEventListener('input', updateFromEnd);
    const reset = container.querySelector('.timeline-reset');
    if (reset) reset.addEventListener('click', () => {
        s.value = String(min);
        e.value = String(max);
        projectFilterState.start = min;
        projectFilterState.end = max;
        if (sl) sl.textContent = String(min);
        if (el) el.textContent = String(max);
        updateUI();
        applyProjectFilters();
    });
    function getYearFromClientX(x) {
        const rect = track.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        const y = Math.round(min + p * (max - min));
        return Math.max(min, Math.min(max, y));
    }
    function attachDrag(thumb, which) {
        if (!thumb || !track) return;
        let down = false;
        const onDown = (ev) => { down = true; ev.preventDefault(); thumb.focus(); };
        const onMove = (ev) => {
            if (!down) return;
            const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
            let y = getYearFromClientX(clientX);
            if (which === 'start') {
                y = Math.min(y, projectFilterState.end);
                projectFilterState.start = y;
                s.value = String(y);
            } else {
                y = Math.max(y, projectFilterState.start);
                projectFilterState.end = y;
                e.value = String(y);
            }
            updateUI();
            applyProjectFilters();
        };
        const onUp = () => { down = false; };
        thumb.addEventListener('mousedown', onDown);
        thumb.addEventListener('touchstart', onDown, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchend', onUp);
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const delta = e.key === 'ArrowLeft' ? -1 : 1;
                if (which === 'start') {
                    let y = Math.max(min, Math.min(projectFilterState.start + delta, projectFilterState.end));
                    projectFilterState.start = y;
                    s.value = String(y);
                } else {
                    let y = Math.max(projectFilterState.start, Math.min(projectFilterState.end + delta, max));
                    projectFilterState.end = y;
                    e.value = String(y);
                }
                updateUI();
                applyProjectFilters();
            }
        });
    }
    attachDrag(tStart, 'start');
    attachDrag(tEnd, 'end');
    window.addEventListener('resize', () => { updateTicks(); updateUI(); });
    if (track) {
        track.addEventListener('click', (ev) => {
            const y = getYearFromClientX(ev.clientX);
            const ds = Math.abs(y - projectFilterState.start);
            const de = Math.abs(y - projectFilterState.end);
            if (ds <= de) {
                projectFilterState.start = Math.min(y, projectFilterState.end);
                s.value = String(projectFilterState.start);
            } else {
                projectFilterState.end = Math.max(y, projectFilterState.start);
                e.value = String(projectFilterState.end);
            }
            updateUI();
            applyProjectFilters();
        });
    }
}
function openModalById(id) {
    const m = document.getElementById(id);
    if (m) {
        resetServiceModal(id);
        m.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.body.style.overflow = 'auto';
}

function initServiceModals() {
    document.querySelectorAll('.service-modal').forEach(modal => {
        if (modal.dataset.initialized === 'true') return;
        modal.dataset.initialized = 'true';
        const slides = modal.querySelectorAll('.modal-slide');
        const dots = modal.querySelectorAll('.modal-dots .dot');
        const prev = modal.querySelector('.modal-prev');
        const next = modal.querySelector('.modal-next');
        let index = 0;
        function show(i) {
            if (slides.length === 0) return;
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            index = (i + slides.length) % slides.length;
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
        }
        if (prev) prev.addEventListener('click', () => show(index - 1));
        if (next) next.addEventListener('click', () => show(index + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
    });
}

function resetServiceModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const slides = modal.querySelectorAll('.modal-slide');
    const dots = modal.querySelectorAll('.modal-dots .dot');
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[0]) slides[0].classList.add('active');
    if (dots[0]) dots[0].classList.add('active');
}

function initAboutSlider() {
    document.querySelectorAll('.about-gallery').forEach(gallery => {
        if (gallery.dataset.initialized === 'true') return;
        gallery.dataset.initialized = 'true';
        const slides = gallery.querySelectorAll('.modal-slide');
        const dots = gallery.querySelectorAll('.modal-dots .dot');
        const prev = gallery.querySelector('.modal-prev');
        const next = gallery.querySelector('.modal-next');
        let index = 0;
        function show(i) {
            if (slides.length === 0) return;
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            index = (i + slides.length) % slides.length;
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
        }
        if (prev) prev.addEventListener('click', () => show(index - 1));
        if (next) next.addEventListener('click', () => show(index + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
        show(0);
    });
}

function initServiceProcess() {
    const container = document.querySelector('.vertical-process');
    if (!container) return;
    const fill = container.querySelector('.vp-line-fill');
    const steps = container.querySelectorAll('.vp-step');
    function update() {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = rect.top + window.scrollY - vh * 0.2;
        const end = rect.bottom + window.scrollY - vh * 0.8;
        const cur = window.scrollY;
        let p = (cur - start) / (end - start);
        p = Math.max(0, Math.min(1, p));
        if (fill) fill.style.height = Math.round(p * 100) + '%';
    }
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.35 });
    steps.forEach(s => stepObserver.observe(s));
    const d = debounce(update, 10);
    window.addEventListener('scroll', d);
    window.addEventListener('resize', update);
    update();
}

function initLanguageSwitch() {
    const switchers = document.querySelectorAll('.lang-switch');
    if (switchers.length === 0) return;
    const pageLang = document.documentElement.lang || 'en';
    const stored = localStorage.getItem('lang');
    const initial = stored && stored === pageLang ? stored : pageLang;
    const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const base = path.replace(/(_az)?\.html$/, '').replace(/\.html$/, '');
    const map = {
        index: { en: 'index.html', az: 'index_az.html' },
        about: { en: 'about.html', az: 'about_az.html' },
        services: { en: 'services.html', az: 'services_az.html' },
        news: { en: 'news.html', az: 'news_az.html' },
        contact: { en: 'contact.html', az: 'contact_az.html' },
        projects: { en: 'projects.html', az: 'projects_az.html' }
    };
    function resolveTarget(code) {
        const entry = map[base] || map.index;
        const target = entry[code] || entry.en;
        const hash = window.location.hash || '';
        return target + hash;
    }
    function setLangAll(code) {
        localStorage.setItem('lang', code);
        document.documentElement.lang = code;
        switchers.forEach(sw => {
            const currentSpan = sw.querySelector('.lang-button .lang-current');
            if (currentSpan) currentSpan.textContent = code.toUpperCase();
        });
    }
    setLangAll(initial);
    switchers.forEach(sw => {
        const button = sw.querySelector('.lang-button');
        const items = sw.querySelectorAll('.lang-menu [data-lang]');
        if (button) button.addEventListener('click', (e) => {
            e.preventDefault();
            sw.classList.toggle('open');
        });
        items.forEach(item => item.addEventListener('click', (e) => {
            e.preventDefault();
            const code = item.dataset.lang;
            if (code) {
                setLangAll(code);
                const target = resolveTarget(code);
                if (target) window.location.href = target;
            }
            sw.classList.remove('open');
        }));
    });
    document.addEventListener('click', (e) => {
        switchers.forEach(sw => { if (!sw.contains(e.target)) sw.classList.remove('open'); });
    });
}
