/* ==============================================
   PAIRSENSE — SCRIPT.JS
   Uses GSAP + ScrollTrigger.
   All content is visible by default in CSS —
   GSAP animates "from" hidden state so content
   shows even if JS is slow or fails.
   ============================================== */

gsap.registerPlugin(ScrollTrigger);

/* ================================================
   LOADER
   =============================================== */
const loader    = document.getElementById('loader');
const loaderBar = document.querySelector('.loader-bar');

gsap.to(loaderBar, {
  width: '100%',
  duration: 1.0,
  ease: 'power2.inOut',
  onComplete: () => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.classList.add('out');
        animateHero();
      }
    });
  }
});

/* ================================================
   HERO ENTRANCE
   =============================================== */
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.hero-eyebrow', { opacity: 0, y: 18, duration: 0.7 })
    .from('.hero-heading', { opacity: 0, y: 36, duration: 0.9 }, '-=0.4')
    .from('.hero-sub',     { opacity: 0, y: 24, duration: 0.7 }, '-=0.55')
    .from('.hero-ctas',    { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
    .from('.hero-img-wrap',{ opacity: 0, scale: 0.95, duration: 1.0 }, '-=0.8')
    .from('.hero-badge',   { opacity: 0, y: 16, duration: 0.5 }, '-=0.4')
    .from('.hero-scroll-hint', { opacity: 0, duration: 0.5 }, '-=0.2');
}

/* ================================================
   NAVBAR — scroll state
   =============================================== */
const navbar = document.getElementById('navbar');

ScrollTrigger.create({
  trigger: '#hero',
  start: 'bottom top+=80',
  onEnter:      () => navbar.classList.add('scrolled'),
  onLeaveBack:  () => navbar.classList.remove('scrolled'),
});

/* ================================================
   MOBILE MENU
   =============================================== */
const burger     = document.querySelector('.nav-burger');
const mobileMenu = document.getElementById('mobile-menu');
const closeBtn   = document.querySelector('.mobile-close');

function openMenu() {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
  burger.querySelectorAll('span')[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
  burger.querySelectorAll('span')[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  burger.querySelectorAll('span')[0].style.transform = '';
  burger.querySelectorAll('span')[1].style.transform = '';
}

burger.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
closeBtn.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* ================================================
   SCROLL ANIMATIONS
   =============================================== */

// Clients logos
gsap.from('.clients-logos img', {
  opacity: 0,
  y: 20,
  stagger: 0.08,
  duration: 0.6,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.section-clients',
    start: 'top 85%',
  }
});

// About section
gsap.from('.about-img-wrap', {
  opacity: 0,
  x: -50,
  duration: 1.0,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.section-about',
    start: 'top 75%',
  }
});
gsap.from('.about-float-card', {
  opacity: 0,
  scale: 0.9,
  duration: 0.6,
  ease: 'back.out(1.5)',
  delay: 0.4,
  scrollTrigger: {
    trigger: '.about-img-wrap',
    start: 'top 75%',
  }
});
gsap.from(['.about-text-col .section-label', '.about-text-col .section-heading', '.about-body', '.about-pillars'], {
  opacity: 0,
  y: 30,
  stagger: 0.12,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-text-col',
    start: 'top 80%',
  }
});

// Services section heading
gsap.from('.services-header', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.section-services',
    start: 'top 80%',
  }
});

// Service cards — staggered
gsap.from('.svc-card', {
  opacity: 0,
  y: 50,
  stagger: 0.15,
  duration: 0.85,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.services-cards',
    start: 'top 80%',
  }
});

// Segments heading
gsap.from('.section-segments .section-label, .section-segments .section-heading', {
  opacity: 0,
  y: 30,
  stagger: 0.1,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.section-segments',
    start: 'top 80%',
  }
});

// Segment cards
gsap.from('.seg-card', {
  opacity: 0,
  x: 40,
  stagger: 0.12,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.segments-track-outer',
    start: 'top 85%',
  }
});

// Blog section
gsap.from('.blog-header', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.section-blog',
    start: 'top 80%',
  }
});
gsap.from('.blog-card', {
  opacity: 0,
  y: 40,
  stagger: 0.12,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.blog-grid',
    start: 'top 80%',
  }
});

// CTA band
gsap.from('.cta-content', {
  opacity: 0,
  y: 40,
  duration: 1.0,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.section-cta',
    start: 'top 70%',
  }
});

// Contact section
gsap.from('.contact-img-col', {
  opacity: 0,
  x: -40,
  duration: 1.0,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.section-contact',
    start: 'top 75%',
  }
});
gsap.from('.contact-form-col > *', {
  opacity: 0,
  y: 25,
  stagger: 0.1,
  duration: 0.7,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.contact-form-col',
    start: 'top 80%',
  }
});

// Footer
gsap.from('.footer-brand, .fl-col', {
  opacity: 0,
  y: 20,
  stagger: 0.08,
  duration: 0.6,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#footer',
    start: 'top 90%',
  }
});

/* ================================================
   HERO PARALLAX
   =============================================== */
gsap.to('.shape-1', {
  y: -80,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  }
});
gsap.to('.shape-2', {
  y: -50,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 2,
  }
});
gsap.to('.hero-img', {
  y: 40,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  }
});

/* ================================================
   SEGMENTS DRAG-TO-SCROLL
   =============================================== */
const segOuter = document.querySelector('.segments-track-outer');
if (segOuter) {
  let isDown = false;
  let startX, scrollLeft;

  segOuter.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - segOuter.offsetLeft;
    scrollLeft = segOuter.scrollLeft;
  });
  document.addEventListener('mouseup', () => { isDown = false; });
  segOuter.addEventListener('mouseleave', () => { isDown = false; });
  segOuter.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - segOuter.offsetLeft;
    segOuter.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });

  // Touch
  let touchStartX = 0, touchScrollLeft = 0;
  segOuter.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = segOuter.scrollLeft;
  }, { passive: true });
  segOuter.addEventListener('touchmove', (e) => {
    segOuter.scrollLeft = touchScrollLeft - (e.touches[0].pageX - touchStartX);
  }, { passive: true });
}

/* ================================================
   CONTACT FORM
   =============================================== */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.style.background = '#5e8c55';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

/* ================================================
   SMOOTH SCROLL — account for fixed nav height
   =============================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target || id === '#') return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});
