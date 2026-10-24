import './style.css';
import './404.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenisScroll, getLenis } from './modules/lenis-scroll.js';
import { initCustomCursor } from './modules/cursor.js';
import { initCTAButtons } from './modules/cta-buttons.js';
import { initTwo26ContactModal } from './modules/contact-modal.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis Smooth Scroll
  initLenisScroll();

  // 2. Custom Magnetic Cursor
  initCustomCursor();

  // 3. Magnetic CTA Buttons
  initCTAButtons();

  // 4. Contact Modal Setup
  initTwo26ContactModal();

  // 5. Theme Switcher (Two26 Linen / Dark Mode)
  initThemeToggle();

  // 6. Mobile Drawer Navigation
  initDrawerNavigation();

  // 7. Page Transition on Outgoing Links
  initOutgoingPageTransitions();

  // 8. Curtain Sweep Loader & 404 Entrance
  init404Loader(() => {
    play404Entrance();
    initDigitsInteractivity();
  });
});

/* -------------------------------------------------------------
   THEME TOGGLE SETUP
   ------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggles = [
    document.getElementById('theme-toggle'),
    document.getElementById('ham-theme-toggle')
  ].filter(Boolean);

  const savedTheme = localStorage.getItem('yk_theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  themeToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('yk_theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('yk_theme', 'dark');
      }
    });
  });
}

/* -------------------------------------------------------------
   MOBILE DRAWER NAVIGATION
   ------------------------------------------------------------- */
function initDrawerNavigation() {
  const menuToggle = document.getElementById('menu-toggle-btn');
  const hamMenu = document.getElementById('ham-menu');
  const hamCloseBtn = document.getElementById('ham-close-btn');
  let isMenuOpen = false;

  function openMenu() {
    if (isMenuOpen || !hamMenu) return;
    isMenuOpen = true;
    if (menuToggle) menuToggle.classList.add('is-open');
    hamMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const links = hamMenu.querySelectorAll('.ham-nav-item');
    gsap.fromTo(
      links,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
    );
  }

  function closeMenu() {
    if (!isMenuOpen || !hamMenu) return;
    isMenuOpen = false;
    if (menuToggle) menuToggle.classList.remove('is-open');
    document.body.style.overflow = '';

    gsap.to(hamMenu, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        hamMenu.classList.remove('is-open');
        hamMenu.style.opacity = '';
      }
    });
  }

  if (menuToggle) menuToggle.addEventListener('click', () => (isMenuOpen ? closeMenu() : openMenu()));
  if (hamCloseBtn) hamCloseBtn.addEventListener('click', closeMenu);
}

/* -------------------------------------------------------------
   OUTGOING PAGE TRANSITIONS (Orange Vector Curtain Wipe)
   ------------------------------------------------------------- */
function initOutgoingPageTransitions() {
  const links = document.querySelectorAll('a[href^="/index.html"], a[href^="index.html"], a[href^="/about.html"], a[href^="about.html"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        e.preventDefault();
        playPageTransitionOut(href);
      }
    });
  });
}

function playPageTransitionOut(targetUrl) {
  let overlay = document.getElementById('page-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:all;overflow:hidden;background:transparent;';
    overlay.innerHTML = `
      <div style="position:absolute;inset:0;width:100%;height:100%;">
        <svg width="100%" height="100%" viewBox="0 0 1500 1093" fill="none" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%;">
          <path id="transition-sweep-path" d="M1500 0C687.437 32.0206 767.477 1069.1 4.43459e-05 1093" stroke="var(--orange)" stroke-width="0" stroke-linecap="round"/>
        </svg>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const path = overlay.querySelector('#transition-sweep-path');
  const len = 3500;
  gsap.fromTo(
    path,
    {
      strokeDasharray: len,
      strokeDashoffset: len,
      strokeWidth: 0,
      y: -400,
      x: -400
    },
    {
      strokeDashoffset: 0,
      strokeWidth: 3200,
      y: 0,
      x: 0,
      duration: 0.42,
      ease: 'power2.inOut',
      onComplete: () => {
        window.location.href = targetUrl;
      }
    }
  );
}

/* -------------------------------------------------------------
   TWO 26 CURTAIN SWEEP LOADER
   ------------------------------------------------------------- */
function init404Loader(onRevealCallback) {
  const loader = document.getElementById('page-loader');
  if (!loader) {
    if (typeof onRevealCallback === 'function') onRevealCallback();
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    loader.style.display = 'none';
    loader.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    if (typeof onRevealCallback === 'function') onRevealCallback();
    return;
  }

  const pathOrangeBg = document.getElementById('loader-path-orange');
  const pathCurtainBg = document.getElementById('loader-path-curtain');
  const innerContent = document.getElementById('loader-inner');
  const loaderFrames = document.querySelectorAll('.loader-frame-top, .loader-frame-bottom, .loader-corner');

  document.body.style.overflow = 'hidden';

  const BG_STROKE_WIDTH_START = 3000;
  const BG_STROKE_WIDTH_END = 1000;

  let lenCurtain = 3500;
  if (pathCurtainBg) {
    lenCurtain = pathCurtainBg.getTotalLength ? pathCurtainBg.getTotalLength() : 3500;
    pathCurtainBg.style.strokeDasharray = `${lenCurtain}`;
    pathCurtainBg.style.strokeDashoffset = '0';
    gsap.set(pathCurtainBg, { x: 0, y: 0, strokeWidth: BG_STROKE_WIDTH_START });
  }

  let lenOrange = 3500;
  if (pathOrangeBg) {
    lenOrange = pathOrangeBg.getTotalLength ? pathOrangeBg.getTotalLength() : 3500;
    pathOrangeBg.style.strokeDasharray = `${lenOrange}`;
    pathOrangeBg.style.strokeDashoffset = '0';
    gsap.set(pathOrangeBg, { x: 0, y: 0, strokeWidth: BG_STROKE_WIDTH_START });
  }

  let heroTriggered = false;
  const triggerHeroOnce = () => {
    if (!heroTriggered) {
      heroTriggered = true;
      if (typeof onRevealCallback === 'function') onRevealCallback();
    }
  };

  const cleanupLoader = () => {
    document.body.style.overflow = '';
    if (loader) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }
    const lenis = getLenis();
    if (lenis) lenis.resize();
    triggerHeroOnce();
  };

  const safetyTimer = setTimeout(() => cleanupLoader(), 2500);

  const SWEEP_DURATION = 0.65;
  const tl = gsap.timeline({
    delay: 0.15,
    onComplete: () => {
      clearTimeout(safetyTimer);
      cleanupLoader();
    }
  });

  // Fade inner content
  tl.to([innerContent, ...loaderFrames], {
    opacity: 0,
    y: -20,
    duration: 0.2,
    ease: 'power2.in'
  });

  // Switch loader background to transparent
  tl.call(() => {
    if (loader) {
      loader.style.backgroundColor = 'transparent';
      loader.style.pointerEvents = 'none';
    }
    document.body.style.overflow = '';
  });

  // Phase 1: Curtain sweeps down & right
  if (pathCurtainBg) {
    tl.to(
      pathCurtainBg,
      {
        strokeDashoffset: -lenCurtain * 0.5,
        strokeWidth: BG_STROKE_WIDTH_END,
        y: 1800,
        x: 900,
        duration: SWEEP_DURATION,
        ease: 'power2.inOut'
      },
      'curtainStart'
    );
  }

  // Phase 2: Orange sweeps down & left
  if (pathOrangeBg) {
    tl.to(
      pathOrangeBg,
      {
        strokeDashoffset: -lenOrange * 0.5,
        strokeWidth: BG_STROKE_WIDTH_END,
        y: 1800,
        x: -900,
        duration: SWEEP_DURATION,
        ease: 'power2.inOut'
      },
      `curtainStart+=${SWEEP_DURATION * 0.25}`
    );
  }

  // Reveal Hook: trigger entrance right as Orange begins peeling
  tl.call(() => triggerHeroOnce(), null, `curtainStart+=${SWEEP_DURATION * 0.25}`);

  tl.set(loader, { display: 'none', pointerEvents: 'none' });
}

/* -------------------------------------------------------------
   404 HERO ENTRANCE ANIMATION
   ------------------------------------------------------------- */
function play404Entrance() {
  const section = document.querySelector('.section-404');
  if (!section) return;

  const telemetry = section.querySelector('.error-telemetry-badge');
  const digits = Array.from(section.querySelectorAll('.error-digit'));
  const pills = Array.from(section.querySelectorAll('.error-floating-pill'));
  const path = section.querySelector('.error-hero-path svg path');
  const headings = Array.from(section.querySelectorAll('[data-404-heading]'));
  const desc = section.querySelector('.error-description');
  const actions = section.querySelector('.error-actions');
  const waypoints = section.querySelector('.error-waypoints');
  const crosshairs = Array.from(section.querySelectorAll('.error-crosshair'));

  // Split headings into overflow masks
  let headingLines = [];
  headings.forEach((h) => {
    let line = h.querySelector('.error-line');
    if (!line) {
      const raw = h.textContent.trim();
      h.innerHTML = `<span class="error-line-mask"><span class="error-line">${raw}</span></span>`;
      line = h.querySelector('.error-line');
    }
    if (line) headingLines.push(line);
    gsap.set(h, { opacity: 1 });
    gsap.set(line, { y: '115%', opacity: 0 });
  });

  // Setup Digits
  digits.forEach((d, i) => {
    const tilt = i === 1 ? 0 : (i === 0 ? -12 : 12);
    gsap.set(d, {
      opacity: 0,
      scale: 0.2,
      rotation: tilt,
      y: 40,
      transformOrigin: 'center center'
    });
  });

  // Setup Pills
  pills.forEach((p) => {
    const isTop = p.classList.contains('pill-top-right');
    const rot = isTop ? 6 : -6;
    gsap.set(p, {
      opacity: 0,
      scale: 0.3,
      y: 20,
      rotation: rot,
      transformOrigin: 'center center'
    });
  });

  // Setup Vector Path
  if (path) {
    let len = 2500;
    try {
      if (typeof path.getTotalLength === 'function') len = path.getTotalLength() || 2500;
    } catch (e) {}
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, strokeWidth: 0 });
  }

  // Initial sets for remaining elements
  if (telemetry) gsap.set(telemetry, { opacity: 0, y: -20 });
  if (desc) gsap.set(desc, { opacity: 0, y: 20 });
  if (actions) gsap.set(actions, { opacity: 0, y: 25 });
  if (waypoints) gsap.set(waypoints, { opacity: 0, y: 30 });
  if (crosshairs.length) gsap.set(crosshairs, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } }).timeScale(0.85);

  // 1. Telemetry badge drops in
  if (telemetry) {
    tl.to(telemetry, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, 0);
  }

  // 2. Digits 4 0 4 pop in with punchy Two26 bounce
  if (digits.length) {
    tl.to(
      digits,
      {
        opacity: 1,
        scale: 1,
        rotation: (i) => (i === 1 ? 0 : (i === 0 ? -4 : 4)),
        y: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'back.out(2.8)'
      },
      0.1
    );
  }

  // 3. S-curve vector path traces through
  if (path) {
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        strokeWidth: 20,
        duration: 1.1,
        ease: 'power2.out'
      },
      0.25
    );
  }

  // 4. Floating pills pop
  pills.forEach((p, i) => {
    const isTop = p.classList.contains('pill-top-right');
    const rot = isTop ? 6 : -6;
    tl.to(
      p,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: rot,
        duration: 0.6,
        ease: 'back.out(2.5)'
      },
      0.35 + i * 0.15
    );
  });

  // 5. Line-by-Line Headings slide up
  if (headingLines.length) {
    tl.to(
      headingLines,
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'back.out(1.4)'
      },
      0.45
    );
  }

  // 6. Description & Action Buttons
  if (desc) {
    tl.to(desc, { opacity: 1, y: 0, duration: 0.6 }, 0.65);
  }
  if (actions) {
    tl.to(actions, { opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.8)' }, 0.75);
  }
  if (waypoints) {
    tl.to(waypoints, { opacity: 1, y: 0, duration: 0.7 }, 0.85);
  }
  if (crosshairs.length) {
    tl.to(crosshairs, { opacity: 1, duration: 0.6, stagger: 0.08 }, 0.9);
  }
}

/* -------------------------------------------------------------
   KINETIC 404 DIGITS PARALLAX & CLICK BOUNCE
   ------------------------------------------------------------- */
function initDigitsInteractivity() {
  const stage = document.querySelector('.error-digits-stage');
  const digits = document.querySelectorAll('.error-digit');
  const pills = document.querySelectorAll('.error-floating-pill');
  if (!stage || !digits.length) return;

  // Gentle 3D Mouse Parallax
  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    digits.forEach((d, i) => {
      const depth = (i + 1) * 0.04;
      gsap.to(d, {
        x: x * depth,
        y: y * depth,
        duration: 0.4,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    });

    pills.forEach((p, i) => {
      const depth = (i + 1) * -0.06;
      gsap.to(p, {
        x: x * depth,
        y: y * depth,
        duration: 0.45,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    });
  });

  stage.addEventListener('mouseleave', () => {
    digits.forEach((d, i) => {
      const defaultRot = i === 1 ? 0 : (i === 0 ? -4 : 4);
      gsap.to(d, {
        x: 0,
        y: 0,
        rotation: defaultRot,
        duration: 0.7,
        ease: 'back.out(2)'
      });
    });

    pills.forEach((p) => {
      const isTop = p.classList.contains('pill-top-right');
      gsap.to(p, {
        x: 0,
        y: 0,
        rotation: isTop ? 6 : -6,
        duration: 0.7,
        ease: 'back.out(2)'
      });
    });
  });

  // Fun interactive bounce when clicking numbers
  digits.forEach((digit) => {
    digit.addEventListener('click', () => {
      const randomRot = gsap.utils.random(-15, 15);
      gsap.fromTo(
        digit,
        { scale: 0.85, rotation: randomRot },
        { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }
      );
    });
  });
}
