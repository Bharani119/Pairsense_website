/* ==============================================
   PAIRSENSE — PREMIUM INTERACTIVE SCRIPT
   GSAP · ScrollTrigger · Three.js · Matter.js
   ============================================== */

gsap.registerPlugin(ScrollTrigger);

/* ================================================
   CINEMATIC LOADER — split-panel reveal
   =============================================== */
const loaderCountEl  = document.getElementById('loaderCount');
const loaderFill     = document.getElementById('loaderFill');
const loaderPanelTop = document.querySelector('.loader-panel--top');
const loaderPanelBot = document.querySelector('.loader-panel--bottom');
const loaderCenter   = document.querySelector('.loader-center');
const loaderEl       = document.getElementById('loader');

let count = 0;
const tick = setInterval(() => {
  count += Math.floor(Math.random() * 14) + 4;
  if (count >= 100) {
    count = 100;
    clearInterval(tick);
    setTimeout(revealPage, 220);
  }
  loaderCountEl.textContent = count;
  loaderFill.style.width = count + '%';
}, 70);

function revealPage() {
  const tl = gsap.timeline({
    onComplete: () => {
      loaderEl.style.display = 'none';
      animateHero();
    }
  });
  tl.to(loaderCenter, { opacity: 0, duration: 0.35, ease: 'power2.in' })
    .to(loaderPanelTop, { yPercent: -100, duration: 1.0, ease: 'power4.inOut' }, '-=0.05')
    .to(loaderPanelBot, { yPercent:  100, duration: 1.0, ease: 'power4.inOut' }, '<');
}

/* ================================================
   THREE.JS — Hero particle network
   =============================================== */
function initThreeHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.clientWidth  || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
  camera.position.z = 65;

  // Particles
  const COUNT = 130;
  const pos   = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) pos[i] = (Math.random() - 0.5) * 110;

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const ptMat = new THREE.PointsMaterial({
    color: 0xb8813a,
    size: 0.55,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(ptGeo, ptMat);

  // Connection lines
  const linePts = [];
  for (let i = 0; i < COUNT; i++) {
    for (let j = i + 1; j < COUNT; j++) {
      const dx = pos[i*3]   - pos[j*3];
      const dy = pos[i*3+1] - pos[j*3+1];
      const dz = pos[i*3+2] - pos[j*3+2];
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 20) {
        linePts.push(pos[i*3], pos[i*3+1], pos[i*3+2]);
        linePts.push(pos[j*3], pos[j*3+1], pos[j*3+2]);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePts), 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0xb8813a, transparent: true, opacity: 0.12 });
  const lines   = new THREE.LineSegments(lineGeo, lineMat);

  const group = new THREE.Group();
  group.add(points, lines);
  scene.add(group);

  // Mouse influence
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animate
  (function loop() {
    requestAnimationFrame(loop);
    group.rotation.y += 0.0008 + mx * 0.0003;
    group.rotation.x += 0.0004 + my * 0.0002;
    renderer.render(scene, camera);
  })();

  // Resize
  window.addEventListener('resize', () => {
    const nw = canvas.clientWidth, nh = canvas.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
}

/* ================================================
   MATTER.JS — Physics ingredient universe
   =============================================== */
function initPhysics() {
  const canvas = document.getElementById('physics-canvas');
  if (!canvas || typeof Matter === 'undefined') return;

  const { Engine, Render, Runner, Bodies, Body, Events,
          Mouse, MouseConstraint, Composite, World } = Matter;

  const W = canvas.clientWidth  || window.innerWidth;
  const H = 520;
  canvas.width  = W;
  canvas.height = H;

  const engine = Engine.create({ gravity: { x: 0, y: 0.35 } });

  const render = Render.create({
    canvas,
    engine,
    options: {
      width: W,
      height: H,
      wireframes: false,
      background: 'transparent',
    }
  });

  // Walls (invisible)
  const wall = (x, y, w, h) =>
    Bodies.rectangle(x, y, w, h, { isStatic: true, render: { fillStyle: 'transparent', strokeStyle: 'transparent' } });

  World.add(engine.world, [
    wall(W / 2, H + 30, W, 60),
    wall(W / 2, -30, W, 60),
    wall(-30, H / 2, 60, H),
    wall(W + 30, H / 2, 60, H),
  ]);

  // Ingredient balls
  const ingredients = [
    'Vanilla', 'Rose', 'Jasmine', 'Bergamot', 'Citrus',
    'Cedar', 'Vetiver', 'Musk', 'Amber', 'Sandalwood',
    'Lavender', 'Neroli', 'Ylang', 'Patchouli',
  ];
  const palette = ['#b8813a', '#c49a3d', '#a0722f', '#5e8c55', '#8b6914', '#d4a85c'];

  ingredients.forEach((name, i) => {
    const r  = Math.random() * 22 + 36;
    const x  = r + Math.random() * (W - r * 2);
    const y  = r + Math.random() * (H * 0.55);
    const body = Bodies.circle(x, y, r, {
      restitution: 0.62,
      friction: 0.08,
      frictionAir: 0.01,
      render: {
        fillStyle: palette[i % palette.length],
        strokeStyle: 'rgba(255,255,255,0.15)',
        lineWidth: 1,
      },
      label: name,
    });
    Body.setVelocity(body, { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 });
    World.add(engine.world, body);
  });

  // Mouse interaction
  const mouse = Mouse.create(canvas);
  const mc    = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.25, render: { visible: false } },
  });
  World.add(engine.world, mc);

  // Draw ingredient labels after Matter renders
  Events.on(render, 'afterRender', () => {
    const ctx = render.context;
    ctx.font = `600 11px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    Composite.allBodies(engine.world).forEach(b => {
      if (!b.label || !ingredients.includes(b.label)) return;
      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.angle);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillText(b.label, 0, 0);
      ctx.restore();
    });
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  // Lazy-init: only start when section is in view
  ScrollTrigger.create({
    trigger: '.section-physics',
    start: 'top 80%',
    once: true,
    onEnter: () => { /* already running */ },
  });
}

/* ================================================
   HERO ENTRANCE ANIMATION
   =============================================== */
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.hero-eyebrow',      { opacity: 0, y: 20, duration: 0.7 })
    .from('.hero-heading',      { opacity: 0, y: 44, duration: 1.0 }, '-=0.45')
    .from('.hero-sub',          { opacity: 0, y: 28, duration: 0.75 }, '-=0.55')
    .from('.hero-ctas',         { opacity: 0, y: 24, duration: 0.65 }, '-=0.5')
    .from('.hero-img-wrap',     { opacity: 0, scale: 0.94, duration: 1.1 }, '-=0.85')
    .from('.hero-badge',        { opacity: 0, y: 18, duration: 0.55 }, '-=0.45')
    .from('.hero-scroll-hint',  { opacity: 0, duration: 0.5 }, '-=0.2');

  // Init Three.js after hero is visible
  initThreeHero();
}

/* ================================================
   NAVBAR — scroll state
   =============================================== */
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
  trigger: '#hero',
  start: 'bottom top+=80',
  onEnter:     () => navbar.classList.add('scrolled'),
  onLeaveBack: () => navbar.classList.remove('scrolled'),
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

burger.addEventListener('click', () =>
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
);
closeBtn.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* ================================================
   SMOOTH SCROLL — account for fixed nav
   =============================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target || id === '#') return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16,
      behavior: 'smooth',
    });
  });
});

/* ================================================
   CLIP-PATH REVEALS
   =============================================== */
gsap.utils.toArray('.clip-reveal').forEach(el => {
  gsap.to(el, {
    clipPath: 'inset(0 0 0% 0)',
    duration: 1.3,
    ease: 'power4.out',
    scrollTrigger: { trigger: el, start: 'top 82%' },
  });
});

/* ================================================
   STATS COUNTER
   =============================================== */
document.querySelectorAll('.stat-num').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.round(this.targets()[0].val);
        },
      });
    },
  });
});

/* ================================================
   HORIZONTAL SERVICES SCROLL
   =============================================== */
(function initHorizontalServices() {
  const outer = document.querySelector('.services-sticky-outer');
  const inner = document.querySelector('.services-sticky-inner');
  const track = document.getElementById('servicesHTrack');
  const bar   = document.getElementById('servicesProgress');
  if (!outer || !track || window.innerWidth < 1025) return;

  // Compute how far to scroll horizontally
  function getScrollX() {
    return -(track.scrollWidth - (inner.clientWidth - inner.clientWidth * 0.1));
  }

  gsap.to(track, {
    x: getScrollX,
    ease: 'none',
    scrollTrigger: {
      trigger: outer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.4,
      onUpdate(self) {
        if (bar) bar.style.width = (self.progress * 100) + '%';
      },
    },
  });

  window.addEventListener('resize', () => ScrollTrigger.refresh());
})();

/* ================================================
   3D CARD TILT — all .tilt-card elements
   =============================================== */
document.querySelectorAll('.tilt-card').forEach(card => {
  let raf;

  card.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `perspective(900px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateZ(12px)`;
      card.style.boxShadow = `
        ${-dx * 12}px ${-dy * 12}px 40px rgba(28,27,24,0.12),
        0 20px 60px rgba(28,27,24,0.14)
      `;

      // Spotlight glow
      const glow = card.querySelector('.svc-hover-glow');
      if (glow) {
        const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        glow.style.setProperty('--mx', mx + '%');
        glow.style.setProperty('--my', my + '%');
      }
    });
  });

  card.addEventListener('mouseleave', () => {
    cancelAnimationFrame(raf);
    gsap.to(card, {
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      boxShadow: '',
      duration: 0.6,
      ease: 'power3.out',
    });
  });
});

/* ================================================
   MAGNETIC BUTTONS
   =============================================== */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx   = e.clientX - (rect.left + rect.width  / 2);
    const dy   = e.clientY - (rect.top  + rect.height / 2);
    gsap.to(btn, { x: dx * 0.38, y: dy * 0.38, duration: 0.4, ease: 'power2.out' });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.45)' });
  });
});

/* ================================================
   HERO PARALLAX
   =============================================== */
gsap.to('.shape-1', {
  y: -90, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
});
gsap.to('.shape-2', {
  y: -55, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2.0 },
});
gsap.to('.hero-img', {
  y: 45, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.0 },
});

/* ================================================
   SCROLL ANIMATIONS — section reveals
   =============================================== */

// Clients
gsap.from('.clients-logos img', {
  opacity: 0, y: 22, stagger: 0.07, duration: 0.65, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-clients', start: 'top 85%' },
});

// About text
gsap.from([
  '.about-text-col .section-label',
  '.about-text-col .section-heading',
  '.about-body',
  '.about-pillars',
], {
  opacity: 0, y: 35, stagger: 0.12, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-text-col', start: 'top 78%' },
});

// About float card
gsap.from('.about-float-card', {
  opacity: 0, scale: 0.88, duration: 0.65, ease: 'back.out(1.6)', delay: 0.35,
  scrollTrigger: { trigger: '.about-img-wrap', start: 'top 78%' },
});

// Stats
gsap.from('.stat-item', {
  opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.stats-row', start: 'top 82%' },
});

// Physics section header
gsap.from('.physics-header > *', {
  opacity: 0, y: 30, stagger: 0.12, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-physics', start: 'top 80%' },
});

// Services header
gsap.from('.services-h-header > *', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.services-sticky-inner', start: 'top 85%' },
});

// Segment cards
gsap.from('.seg-card', {
  opacity: 0, x: 50, stagger: 0.1, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.segments-track-outer', start: 'top 82%' },
});

// Segments header
gsap.from(['.section-segments .section-label', '.section-segments .section-heading'], {
  opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-segments', start: 'top 82%' },
});

// Blog
gsap.from('.blog-header > *', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-blog', start: 'top 82%' },
});
gsap.from('.blog-card', {
  opacity: 0, y: 45, stagger: 0.1, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.blog-grid', start: 'top 82%' },
});

// CTA
gsap.from('.cta-content > *', {
  opacity: 0, y: 40, stagger: 0.12, duration: 1.0, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-cta', start: 'top 72%' },
});

// Contact form col
gsap.from('.contact-form-col > *', {
  opacity: 0, y: 28, stagger: 0.09, duration: 0.75, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-form-col', start: 'top 80%' },
});

// Footer
gsap.from('.footer-brand, .fl-col', {
  opacity: 0, y: 22, stagger: 0.07, duration: 0.65, ease: 'power3.out',
  scrollTrigger: { trigger: '#footer', start: 'top 90%' },
});

/* ================================================
   SEGMENTS DRAG-TO-SCROLL
   =============================================== */
const segOuter = document.querySelector('.segments-track-outer');
if (segOuter) {
  let isDown = false, startX, scrollLeft;

  segOuter.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - segOuter.offsetLeft;
    scrollLeft = segOuter.scrollLeft;
  });
  document.addEventListener('mouseup', () => { isDown = false; });
  segOuter.addEventListener('mouseleave', () => { isDown = false; });
  segOuter.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    segOuter.scrollLeft = scrollLeft - (e.pageX - segOuter.offsetLeft - startX) * 1.2;
  });

  let tx = 0, ts = 0;
  segOuter.addEventListener('touchstart', e => {
    tx = e.touches[0].pageX;
    ts = segOuter.scrollLeft;
  }, { passive: true });
  segOuter.addEventListener('touchmove', e => {
    segOuter.scrollLeft = ts - (e.touches[0].pageX - tx);
  }, { passive: true });
}

/* ================================================
   CTA IMAGE PARALLAX
   =============================================== */
gsap.to('.cta-img-bg img', {
  y: 60, ease: 'none',
  scrollTrigger: { trigger: '.section-cta', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
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
    btn.textContent = 'Message Sent ✓';
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
   INIT MATTER.JS — run immediately so physics
   warms up before user scrolls there
   =============================================== */
initPhysics();
