/* ==============================================
   PAIRSENSE — IMMERSIVE MOTION-DRIVEN SCRIPT
   GSAP · ScrollTrigger · Three.js
   3D Hero · Parallax · Perspective Entrances
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
   THREE.JS — Enhanced 3D Hero Scene
   Metallic floating geometry + mouse-reactive
   camera & lighting + volumetric fog
   =============================================== */
function initThreeHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.clientWidth  || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene  = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xeef2eb, 0.012);

  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.z = 55;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xfaf8f4, 0.4);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xeef2eb, 0x1a2b18, 0.5);
  scene.add(hemiLight);

  const pointLight = new THREE.PointLight(0xb8813a, 1.2, 120);
  pointLight.position.set(20, 15, 30);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0xd4a85c, 0.6, 100);
  pointLight2.position.set(-15, -10, 25);
  scene.add(pointLight2);

  // Metallic material
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xb8813a,
    metalness: 0.7,
    roughness: 0.25,
    transparent: true,
    opacity: 0.55,
  });

  const sageMat = new THREE.MeshStandardMaterial({
    color: 0x5e8c55,
    metalness: 0.5,
    roughness: 0.4,
    transparent: true,
    opacity: 0.35,
  });

  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xd4a85c,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.4,
  });

  // Floating geometry objects
  const objects = [];

  // TorusKnot
  const tk = new THREE.Mesh(
    new THREE.TorusKnotGeometry(4, 1.2, 80, 16, 2, 3),
    goldMat
  );
  tk.position.set(18, 8, -10);
  tk.userData = { speed: 0.3, axis: new THREE.Vector3(0.5, 1, 0.2).normalize() };
  objects.push(tk);
  scene.add(tk);

  // Icosahedron
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.5, 0),
    sageMat
  );
  ico.position.set(-16, -5, -8);
  ico.userData = { speed: 0.25, axis: new THREE.Vector3(1, 0.3, 0.5).normalize() };
  objects.push(ico);
  scene.add(ico);

  // Sphere cluster
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.5 + Math.random() * 1.2, 24, 24),
      lightMat.clone()
    );
    s.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 30
    );
    s.material.opacity = 0.2 + Math.random() * 0.3;
    s.userData = {
      speed: 0.15 + Math.random() * 0.2,
      axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
      floatOffset: Math.random() * Math.PI * 2,
      floatRadius: 0.3 + Math.random() * 0.5,
    };
    objects.push(s);
    scene.add(s);
  }

  // Torus
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.4, 16, 48),
    goldMat.clone()
  );
  torus.material.opacity = 0.3;
  torus.position.set(-8, 12, -15);
  torus.userData = { speed: 0.18, axis: new THREE.Vector3(0.2, 1, 0.3).normalize() };
  objects.push(torus);
  scene.add(torus);

  // Particle field (subtle background depth)
  const particleCount = 80;
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 100;
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const ptMat = new THREE.PointsMaterial({
    color: 0xb8813a,
    size: 0.3,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(ptGeo, ptMat);
  scene.add(particles);

  // Mouse tracking
  let mx = 0, my = 0;
  let targetMx = 0, targetMy = 0;
  document.addEventListener('mousemove', e => {
    targetMx = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime();

    // Smooth mouse interpolation
    mx += (targetMx - mx) * 0.04;
    my += (targetMy - my) * 0.04;

    // Camera follows mouse subtly
    camera.position.x = mx * 4;
    camera.position.y = -my * 3;
    camera.lookAt(0, 0, 0);

    // Point light follows mouse
    pointLight.position.x = 20 + mx * 15;
    pointLight.position.y = 15 - my * 10;

    // Rotate and float objects
    objects.forEach(obj => {
      const d = obj.userData;
      obj.rotateOnAxis(d.axis, d.speed * 0.008);

      // Gentle floating motion
      if (d.floatOffset !== undefined) {
        obj.position.y += Math.sin(t * 0.5 + d.floatOffset) * d.floatRadius * 0.01;
      }

      // React to mouse
      obj.rotation.x += my * 0.001;
      obj.rotation.y += mx * 0.001;
    });

    // Slow particle rotation
    particles.rotation.y = t * 0.02;
    particles.rotation.x = t * 0.01;

    renderer.render(scene, camera);
  })();

  // Resize handler
  window.addEventListener('resize', () => {
    const nw = canvas.clientWidth || window.innerWidth;
    const nh = canvas.clientHeight || window.innerHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
}

/* ================================================
   CUSTOM CURSOR — dot + lagging ring + ambient glow
   =============================================== */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow');

  if (!dot || !ring || !window.matchMedia('(pointer: fine)').matches) return;

  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener('mousemove', e => {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }
  });

  // Ring follows with smooth lag
  (function ringLoop() {
    ringX += (dotX - ringX) * 0.11;
    ringY += (dotY - ringY) * 0.11;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(ringLoop);
  })();

  // Expand ring on interactive elements
  const hoverables = 'a, button, .tilt-card, .seg-card, .blog-card, .svc-item, input, textarea';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));
})();

/* ================================================
   SCROLL PROGRESS BAR
   =============================================== */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
})();

/* ================================================
   SCROLL VELOCITY TRACKER
   Tracks scroll speed for skew / momentum effects
   =============================================== */
const scrollState = { velocity: 0, lastScroll: 0, lastTime: Date.now() };

(function trackVelocity() {
  window.addEventListener('scroll', () => {
    const now = Date.now();
    const dt = now - scrollState.lastTime;
    if (dt > 0) {
      scrollState.velocity = (window.scrollY - scrollState.lastScroll) / dt;
    }
    scrollState.lastScroll = window.scrollY;
    scrollState.lastTime = now;
  }, { passive: true });

  // Decay velocity when not scrolling
  (function decay() {
    requestAnimationFrame(decay);
    scrollState.velocity *= 0.92;
  })();
})();

/* ================================================
   VELOCITY-BASED SKEW on sections
   =============================================== */
(function initVelocitySkew() {
  const skewTargets = document.querySelectorAll('.velocity-skew');
  if (!skewTargets.length) return;

  // Also apply subtle skew to major content sections
  const sections = document.querySelectorAll(
    '.section-about, .section-services, .section-segments, .section-blog'
  );

  function applySkew() {
    const skew = Math.max(-3, Math.min(3, scrollState.velocity * 25));
    sections.forEach(s => {
      s.style.transform = `skewY(${skew * 0.3}deg)`;
    });
    skewTargets.forEach(el => {
      el.style.transform = `skewY(${skew}deg)`;
    });
    requestAnimationFrame(applySkew);
  }
  applySkew();
})();

/* ================================================
   MULTI-SPEED PARALLAX — data-speed attributes
   Elements with data-speed move at different rates
   =============================================== */
(function initMultiSpeedParallax() {
  const els = document.querySelectorAll('[data-speed]');
  if (!els.length) return;

  els.forEach(el => {
    const speed = parseFloat(el.dataset.speed);
    gsap.to(el, {
      y: () => -(window.innerHeight * 0.3) * (speed - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  });
})();

/* ================================================
   MOUSE-FOLLOW PARALLAX on hero floating elements
   =============================================== */
(function initMouseParallax() {
  const floaters = document.querySelectorAll('.hf');
  if (!floaters.length || !window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    floaters.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 1;
      const tx = currentX * 25 * speed;
      const ty = currentY * 18 * speed;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ================================================
   PERSPECTIVE-BASED SCROLL ENTRANCES
   Replaces basic fade-ins with 3D perspective reveals
   =============================================== */
(function initPerspectiveReveals() {
  const reveals = document.querySelectorAll('.perspective-reveal');
  if (!reveals.length) return;

  reveals.forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('revealed'),
    });
  });
})();

/* ================================================
   SERVICES ACCORDION
   =============================================== */
(function initServicesAccordion() {
  const items  = document.querySelectorAll('.svc-item');
  const panels = document.querySelectorAll('.svc-vp-img');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const idx = item.dataset.idx;

      if (item.classList.contains('active')) return;

      items.forEach(i  => i.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const panel = document.querySelector(`.svc-vp-img[data-panel="${idx}"]`);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ================================================
   HERO ENTRANCE ANIMATION
   Momentum-based staggered reveal
   =============================================== */
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.hero-eyebrow', {
    opacity: 0, y: 40, rotateX: 15, duration: 0.9,
    transformOrigin: 'center bottom',
  })
  .from('.hero-heading', {
    opacity: 0, y: 70, rotateX: 12, scale: 0.95, duration: 1.2,
    transformOrigin: 'center bottom',
  }, '-=0.55')
  .from('.hero-sub', {
    opacity: 0, y: 35, duration: 0.85,
  }, '-=0.65')
  .from('.hero-ctas', {
    opacity: 0, y: 30, scale: 0.96, duration: 0.75,
  }, '-=0.5')
  .from('.hero-img-wrap', {
    opacity: 0, scale: 0.88, rotateY: -8, duration: 1.3,
    transformOrigin: 'center center',
  }, '-=0.95')
  .from('.hero-badge', {
    opacity: 0, y: 24, scale: 0.9, duration: 0.65,
  }, '-=0.5')
  .from('.hero-scroll-hint', { opacity: 0, duration: 0.5 }, '-=0.2')
  .from('.hf', {
    opacity: 0, scale: 0.5, stagger: 0.08, duration: 0.6,
  }, '-=0.8');

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
   SCROLL ANIMATIONS — momentum-based entrances
   Perspective transforms + staggered depth
   =============================================== */

// Clients
gsap.from('.clients-logos img', {
  opacity: 0, y: 30, rotateX: 8, stagger: 0.07, duration: 0.75, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-clients', start: 'top 85%' },
});

// About text — cascading perspective entrance
gsap.from('.about-text-col .section-label', {
  opacity: 0, y: 25, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-text-col', start: 'top 80%' },
});
gsap.from('.about-body', {
  opacity: 0, y: 40, stagger: 0.12, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-text-col', start: 'top 75%' },
});
gsap.from('.about-pillars', {
  opacity: 0, y: 35, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-pillars', start: 'top 88%' },
});

// About float card — elastic pop
gsap.from('.about-float-card', {
  opacity: 0, scale: 0.8, y: 20, duration: 0.75, ease: 'back.out(1.8)', delay: 0.4,
  scrollTrigger: { trigger: '.about-img-wrap', start: 'top 78%' },
});

// Stats — staggered rise with rotateX
gsap.from('.stat-item', {
  opacity: 0, y: 40, rotateX: 10, stagger: 0.1, duration: 0.85, ease: 'power3.out',
  transformOrigin: 'center bottom',
  scrollTrigger: { trigger: '.stats-row', start: 'top 82%' },
});

// Services intro
gsap.from('.services-intro > *', {
  opacity: 0, y: 35, stagger: 0.12, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-services', start: 'top 82%' },
});

// Services accordion items — slide from left with depth
gsap.from('.svc-item', {
  opacity: 0, x: -40, rotateY: -5, stagger: 0.12, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.services-list', start: 'top 82%' },
});

// Services visual panel — scale entrance
gsap.from('.services-visual-panel', {
  opacity: 0, scale: 0.92, rotateY: 5, duration: 1.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.services-visual-panel', start: 'top 82%' },
});

// Segment cards — horizontal slide with perspective
gsap.from('.seg-card', {
  opacity: 0, x: 60, rotateY: 8, stagger: 0.12, duration: 0.9, ease: 'power3.out',
  transformOrigin: 'left center',
  scrollTrigger: { trigger: '.segments-track-outer', start: 'top 82%' },
});

// Segments header
gsap.from(['.section-segments .section-label', '.section-segments .section-heading'], {
  opacity: 0, y: 35, stagger: 0.1, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-segments', start: 'top 82%' },
});

// Blog header
gsap.from('.blog-header > *', {
  opacity: 0, y: 30, stagger: 0.1, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-blog', start: 'top 82%' },
});

// Blog cards — staggered rise with depth
gsap.from('.blog-card', {
  opacity: 0, y: 55, rotateX: 6, stagger: 0.12, duration: 0.95, ease: 'power3.out',
  transformOrigin: 'center bottom',
  scrollTrigger: { trigger: '.blog-grid', start: 'top 82%' },
});

// CTA — dramatic entrance
gsap.from('.cta-content > *', {
  opacity: 0, y: 50, scale: 0.95, stagger: 0.14, duration: 1.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-cta', start: 'top 72%' },
});

// Contact form col
gsap.from('.contact-form-col > *', {
  opacity: 0, y: 30, stagger: 0.09, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-form-col', start: 'top 80%' },
});

// Footer
gsap.from('.footer-brand, .fl-col', {
  opacity: 0, y: 25, stagger: 0.07, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '#footer', start: 'top 90%' },
});

/* ================================================
   3D CARD TILT — all .tilt-card elements
   Enhanced with perspective + depth translation
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

      card.style.transform = `perspective(900px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) translateZ(16px) scale(1.02)`;
      card.style.boxShadow = `
        ${-dx * 14}px ${-dy * 14}px 45px rgba(28,27,24,0.12),
        0 22px 65px rgba(28,27,24,0.15)
      `;
    });
  });

  card.addEventListener('mouseleave', () => {
    cancelAnimationFrame(raf);
    gsap.to(card, {
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
      boxShadow: '',
      duration: 0.7,
      ease: 'elastic.out(1, 0.55)',
    });
  });
});

/* ================================================
   MAGNETIC BUTTONS — elastic snap-back
   =============================================== */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx   = e.clientX - (rect.left + rect.width  / 2);
    const dy   = e.clientY - (rect.top  + rect.height / 2);
    gsap.to(btn, { x: dx * 0.38, y: dy * 0.38, duration: 0.4, ease: 'power2.out' });

    // Update button glow position
    const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    btn.style.setProperty('--mx', mx + '%');
    btn.style.setProperty('--my', my + '%');
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.85, ease: 'elastic.out(1, 0.4)' });
  });
});

/* ================================================
   HERO PARALLAX — multi-layer depth
   =============================================== */
gsap.to('.shape-1', {
  y: -110, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
});
gsap.to('.shape-2', {
  y: -70, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2.0 },
});
gsap.to('.shape-3', {
  y: -45, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2.5 },
});
gsap.to('.hero-img', {
  y: 55, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.0 },
});

// Hero text parallax — slower than visual for depth split
gsap.to('.hero-text', {
  y: -30, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
});
gsap.to('.hero-visual', {
  y: 20, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.0 },
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
  y: 70, ease: 'none',
  scrollTrigger: { trigger: '.section-cta', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
});

/* ================================================
   DEPTH BLUR — sections transition with opacity
   Creates spatial feeling between sections
   =============================================== */
gsap.utils.toArray('.section-about, .section-services, .section-segments, .section-blog, .section-contact').forEach(section => {
  // Fade in content as section enters viewport
  gsap.fromTo(section, {
    opacity: 0.7,
  }, {
    opacity: 1,
    duration: 0.5,
    scrollTrigger: {
      trigger: section,
      start: 'top 90%',
      end: 'top 40%',
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
