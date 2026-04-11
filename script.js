/* ==============================================
   PAIRSENSE — DARK ATELIER
   GSAP · ScrollTrigger
   Cinematic animations · Parallax · Custom cursor
   ============================================== */

gsap.registerPlugin(ScrollTrigger);

/* ================================================
   LOADER — Vertical split reveal
   =============================================== */
const loaderCounter = document.getElementById('loaderCounter');
const loaderEl      = document.getElementById('loader');
let loadCount = 0;

const loadTick = setInterval(() => {
  loadCount += Math.floor(Math.random() * 12) + 5;
  if (loadCount >= 100) {
    loadCount = 100;
    clearInterval(loadTick);
    setTimeout(openSite, 300);
  }
  loaderCounter.textContent = loadCount;
}, 65);

function openSite() {
  const tl = gsap.timeline({
    onComplete: () => {
      loaderEl.style.display = 'none';
      document.body.style.overflow = '';
      runHeroEntrance();
    }
  });

  tl.to('.loader-content', { opacity: 0, y: -30, duration: 0.4, ease: 'power2.in' })
    .to('.loader-left',    { xPercent: -100, duration: 1.0, ease: 'power4.inOut' }, '-=0.1')
    .to('.loader-right',   { xPercent:  100, duration: 1.0, ease: 'power4.inOut' }, '<');
}

/* ================================================
   CUSTOM CURSOR
   =============================================== */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower || !window.matchMedia('(pointer: fine)').matches) return;

  let cx = -100, cy = -100;
  let fx = -100, fy = -100;

  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });

  (function followLoop() {
    fx += (cx - fx) * 0.1;
    fy += (cy - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(followLoop);
  })();

  const interactables = 'a, button, .service-card, .mosaic-item, .journal-card, input, textarea, .tag';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  });

  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));
})();

/* ================================================
   SCROLL PROGRESS
   =============================================== */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100).toFixed(2) + '%';
  }, { passive: true });
})();

/* ================================================
   HERO ENTRANCE — Staggered cinematic reveal
   =============================================== */
function runHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.hero-bg-img', { scale: 1, duration: 2.0, ease: 'power2.out' })
    .to('.hero-tag', { opacity: 1, y: 0, duration: 0.8 }, '-=1.4')
    .to('.title-line', { opacity: 1, y: 0, duration: 1.0, stagger: 0.12 }, '-=1.0')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-scroll', { opacity: 1, duration: 0.5 }, '-=0.3')
    .to('.hero-meta span', { opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.4');

  // Set initial states
  gsap.set('.hero-bg-img', { scale: 1.08 });
  gsap.set(['.hero-tag', '.hero-sub', '.hero-actions'], { opacity: 0, y: 40 });
  gsap.set('.title-line', { opacity: 0, y: 60 });
  gsap.set('.hero-scroll', { opacity: 0 });
  gsap.set('.hero-meta span', { opacity: 0 });

  // Re-run after sets
  const tl2 = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 });
  tl2.to('.hero-bg-img', { scale: 1, duration: 2.0, ease: 'power2.out' })
     .to('.hero-tag', { opacity: 1, y: 0, duration: 0.8 }, '-=1.4')
     .to('.title-line', { opacity: 1, y: 0, duration: 1.0, stagger: 0.15 }, '-=1.0')
     .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
     .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
     .to('.hero-scroll', { opacity: 1, duration: 0.5 }, '-=0.3')
     .to('.hero-meta span', { opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.4');
}

/* ================================================
   NAVBAR — scroll state
   =============================================== */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  trigger: '#hero',
  start: 'bottom top+=80',
  onEnter:     () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

/* ================================================
   MOBILE MENU
   =============================================== */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

navToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.contains('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';

  const spans = navToggle.querySelectorAll('span');
  if (!isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ================================================
   SMOOTH SCROLL
   =============================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target || id === '#') return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 20,
      behavior: 'smooth',
    });
  });
});

/* ================================================
   SCROLL ANIMATIONS — GSAP ScrollTrigger
   Momentum-based entrances with depth
   =============================================== */

// Generic anim-up elements
gsap.utils.toArray('.anim-up').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true,
    },
  });
});

// Parallax on hero background
gsap.to('.hero-bg-img', {
  y: 120,
  ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
});

// Parallax on about image
gsap.to('.about-img-wrap img', {
  y: -40,
  ease: 'none',
  scrollTrigger: { trigger: '.about-split', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
});

// Philosophy parallax
gsap.to('.philosophy-bg img', {
  y: 80,
  ease: 'none',
  scrollTrigger: { trigger: '.philosophy', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
});

// Service cards entrance
gsap.from('.service-card', {
  opacity: 0,
  x: 80,
  rotateY: 8,
  stagger: 0.15,
  duration: 1.0,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.services-track-wrap', start: 'top 80%' },
});

// Mosaic items
gsap.utils.toArray('.mosaic-item').forEach((item, i) => {
  gsap.from(item, {
    opacity: 0,
    y: 60 + (i % 2) * 30,
    scale: 0.95,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 88%',
      once: true,
    },
  });
});

// Client logos
gsap.from('.clients-row img', {
  opacity: 0, y: 20, stagger: 0.08, duration: 0.6, ease: 'power3.out',
  scrollTrigger: { trigger: '.clients-section', start: 'top 85%' },
});

// Journal cards
gsap.from('.journal-card', {
  opacity: 0, y: 60, stagger: 0.12, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.journal-grid', start: 'top 82%' },
});

// CTA section
gsap.from('.cta-section .cta-title', {
  opacity: 0, y: 80, scale: 0.96, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '.cta-section', start: 'top 70%' },
});

// Footer
gsap.from('.footer-brand, .footer-col', {
  opacity: 0, y: 25, stagger: 0.08, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '#footer', start: 'top 90%' },
});

/* ================================================
   STATS COUNTER
   =============================================== */
document.querySelectorAll('.counter').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val); },
      });
    },
  });
});

/* ================================================
   MAGNETIC BUTTONS
   =============================================== */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(btn, { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
  });
});

/* ================================================
   SERVICES — Drag to scroll
   =============================================== */
const svcWrap = document.querySelector('.services-track-wrap');
if (svcWrap) {
  let isDown = false, startX, scrollLeft;
  svcWrap.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - svcWrap.offsetLeft; scrollLeft = svcWrap.scrollLeft; });
  document.addEventListener('mouseup', () => { isDown = false; });
  svcWrap.addEventListener('mouseleave', () => { isDown = false; });
  svcWrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    svcWrap.scrollLeft = scrollLeft - (e.pageX - svcWrap.offsetLeft - startX) * 1.3;
  });

  // Touch
  let tx = 0, ts = 0;
  svcWrap.addEventListener('touchstart', e => { tx = e.touches[0].pageX; ts = svcWrap.scrollLeft; }, { passive: true });
  svcWrap.addEventListener('touchmove', e => { svcWrap.scrollLeft = ts - (e.touches[0].pageX - tx); }, { passive: true });
}

/* ================================================
   SECTION DEPTH — fade-in as sections enter
   =============================================== */
gsap.utils.toArray('.section').forEach(section => {
  gsap.fromTo(section, { opacity: 0.6 }, {
    opacity: 1,
    scrollTrigger: {
      trigger: section,
      start: 'top 95%',
      end: 'top 50%',
      scrub: true,
    },
  });
});

/* ================================================
   CONTACT FORM
   =============================================== */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sent Successfully';
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
