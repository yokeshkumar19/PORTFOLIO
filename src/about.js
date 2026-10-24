import './style.css';
import './about.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenisScroll, getLenis } from './modules/lenis-scroll.js';
import { initCustomCursor } from './modules/cursor.js';
import { initCTAButtons } from './modules/cta-buttons.js';
import { initTwo26ContactModal } from './modules/contact-modal.js';
import { initTwo26Transitions } from './modules/two26-transition.js';

gsap.registerPlugin(ScrollTrigger);

function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

onReady(() => {
  // 1. Initialize Lenis Smooth Scroll
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

  // 7. Signature Two26 Orange Brush Page Transitions
  initTwo26Transitions();

  // 8. Two26 About Hero Entrance Sequence & Values Stack (NO LOADING SCREEN)
  playAboutHeroEntrance();
  initValuesStack();

  setTimeout(() => {
    const lenis = getLenis();
    if (lenis) lenis.resize();
    ScrollTrigger.refresh();
  }, 400);

  // 9. Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 10. Window Resize Refresh
  window.addEventListener('resize', () => {
    const lenis = getLenis();
    if (lenis) lenis.resize();
    ScrollTrigger.refresh();
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
   BACK BUTTON TO RETURN HOME (Reverse Orange Brush Animation)
   ------------------------------------------------------------- */
function initReturnHomeButton() {
  const backButtons = document.querySelectorAll('#about-back-btn, .about-close-btn, [data-about-close]');
  backButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const transitionPath = document.getElementById('about-transition-path');
      const transitionLayer = document.querySelector('.about-transition-overlay, .about-transition');
      if (transitionLayer) {
        transitionLayer.classList.add('is-active');
        transitionLayer.style.display = 'flex';
      }

      if (transitionPath) {
        let len = 3500;
        try {
          if (typeof transitionPath.getTotalLength === 'function') {
            len = transitionPath.getTotalLength() || 3500;
          }
        } catch (err) {}

        // Reverse orange brush stroke paints the screen then returns home
        gsap.fromTo(
          transitionPath,
          { strokeDasharray: len * 2, strokeDashoffset: len, strokeWidth: '0px', attr: { 'stroke-width': 0 } },
          {
            strokeDashoffset: 0,
            strokeWidth: '2200px',
            attr: { 'stroke-width': 2200 },
            duration: 0.45,
            ease: 'power2.inOut',
            onComplete: () => {
              window.location.href = '/index.html';
            }
          }
        );
      } else {
        window.location.href = '/index.html';
      }
    });
  });
}

/* -------------------------------------------------------------
   SIGNATURE ORANGE BRUSH ENTRANCE (Zero Loading Screen)
   ------------------------------------------------------------- */
function initAboutOrangeBrushEntrance(onRevealCallback) {
  const transitionPath = document.getElementById('about-transition-path');
  const transitionLayer = document.querySelector('.about-transition-overlay, .about-transition');

  let len = 3500;
  if (transitionPath) {
    try {
      if (typeof transitionPath.getTotalLength === 'function') {
        len = transitionPath.getTotalLength() || 3500;
      }
    } catch (e) {}
  }

  if (transitionPath) {
    gsap.set(transitionPath, {
      strokeDasharray: len * 2,
      strokeDashoffset: 0,
      strokeWidth: '2200px',
      attr: { 'stroke-width': 2200 }
    });
  }

  let heroTriggered = false;
  const triggerHeroOnce = () => {
    if (!heroTriggered) {
      heroTriggered = true;
      if (typeof onRevealCallback === 'function') onRevealCallback();
    }
  };

  const tl = gsap.timeline({
    delay: 0.04,
    onComplete: () => {
      if (transitionLayer) {
        transitionLayer.classList.remove('is-active');
        transitionLayer.style.display = 'none';
      }
      triggerHeroOnce();
    }
  });

  // Orange brush peels away revealing the page
  if (transitionPath) {
    tl.to(
      transitionPath,
      {
        strokeDashoffset: -len,
        strokeWidth: '0px',
        attr: { 'stroke-width': 0 },
        duration: 0.55,
        ease: 'power2.inOut'
      },
      0
    );
  }

  // Trigger hero entrance as orange brush begins peeling
  tl.call(() => {
    triggerHeroOnce();
  }, null, 0.15);

  // Safety fallback
  setTimeout(() => {
    if (transitionLayer) transitionLayer.style.display = 'none';
    triggerHeroOnce();
  }, 1200);
}

/* -------------------------------------------------------------
   TWO 26 — ABOUT PAGE HERO ENTRANCE COMPONENT
   ------------------------------------------------------------- */
export function playAboutHeroEntrance() {
  const heroSection = document.querySelector('.section-about-hero');
  if (!heroSection) return;

  // 1. Select Unique Headings (never duplicate selection)
  const explicitHeadings = Array.from(heroSection.querySelectorAll('[data-about-hero-heading]'));
  const headings = explicitHeadings.length > 0
    ? explicitHeadings
    : Array.from(new Set(heroSection.querySelectorAll('.about-hero-text h1, .about-hero-text .heading')));

  const pills = Array.from(heroSection.querySelectorAll('.work-hero-pill'));
  const path = heroSection.querySelector('.about-hero-path svg path');
  const svgIllustration = heroSection.querySelector('.about-hero-svg-wrapper');
  const paras = Array.from(heroSection.querySelectorAll('.about-hero-para'));

  // A. Line-by-Line Heading Splitting behind overflow-hidden masks
  let allHeadingLines = [];
  headings.forEach((heading) => {
    let line = heading.querySelector('.about-hero-line');
    if (!line) {
      const raw = heading.textContent.trim();
      heading.innerHTML = `<span class="about-hero-line-mask"><span class="about-hero-line">${raw}</span></span>`;
      line = heading.querySelector('.about-hero-line');
    }
    if (line) allHeadingLines.push(line);
    gsap.set(heading, { opacity: 1 });
    gsap.set(line, { y: '115%', opacity: 0 });
  });

  // B. Floating Pills Setup (Preserves Two26 -3deg and 3deg rotations)
  pills.forEach((pill) => {
    const isOne = pill.classList.contains('one');
    const isTwo = pill.classList.contains('two');
    const targetRotation = isOne ? -3 : (isTwo ? 3 : 0);

    const textEl = pill.querySelector('.hero-pill-text');
    if (textEl && !textEl.closest('.about-hero-pill-text-mask')) {
      const mask = document.createElement('span');
      mask.className = 'about-hero-pill-text-mask';
      textEl.parentNode.insertBefore(mask, textEl);
      mask.appendChild(textEl);
      gsap.set(textEl, { y: '105%', opacity: 0 });
    }

    gsap.set(pill, {
      opacity: 0,
      scale: 0.4,
      y: 20,
      rotation: targetRotation,
      transformOrigin: 'center center'
    });
  });

  // C. Curving Decorative S-Curve Vector Path (Draws stroke 0 to 22)
  if (path) {
    let len = 2500;
    try {
      if (typeof path.getTotalLength === 'function') len = path.getTotalLength() || 2500;
    } catch (e) {}
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    gsap.set(path, {
      strokeDasharray: len,
      strokeDashoffset: len,
      strokeWidth: 0
    });
  }

  // D. Character Illustration Setup
  if (svgIllustration) {
    gsap.set(svgIllustration, {
      opacity: 0,
      scale: 0.65,
      rotation: -6,
      transformOrigin: 'center center'
    });
  }

  // E. Paragraph Lines Setup
  let allParaLines = [];
  paras.forEach((p) => {
    let line = p.querySelector('.about-hero-para-line');
    if (!line) {
      const raw = p.innerHTML.trim();
      p.innerHTML = `<span class="about-hero-line-mask"><span class="about-hero-para-line">${raw}</span></span>`;
      line = p.querySelector('.about-hero-para-line');
    }
    if (line) allParaLines.push(line);
    gsap.set(p, { opacity: 1 });
    gsap.set(line, { y: '115%', opacity: 0 });
  });

  // F. Master Timeline (0.8x pace matching Two26 Studio silky flow)
  const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } }).timeScale(0.8);

  // 1. Line-by-Line Heading Entrance
  if (allHeadingLines.length) {
    heroTl.to(
      allHeadingLines,
      {
        y: '0%',
        opacity: 1,
        duration: 0.85,
        stagger: 0.14,
        ease: 'back.out(1.4)'
      },
      0
    );
  }

  const totalLinesTime = allHeadingLines.length * 0.14 + 0.5;

  // 2. Pills pop in and inner text slides up from behind mask
  pills.forEach((pill, i) => {
    const isOne = pill.classList.contains('one');
    const isTwo = pill.classList.contains('two');
    const targetRotation = isOne ? -3 : (isTwo ? 3 : 0);
    const pillStart = totalLinesTime * (0.28 + i * 0.24);
    const textEl = pill.querySelector('.hero-pill-text');

    heroTl.to(
      pill,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: targetRotation,
        duration: 0.55,
        ease: 'back.out(2.5)'
      },
      pillStart
    );

    if (textEl) {
      heroTl.to(
        textEl,
        {
          y: '0%',
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.6)'
        },
        pillStart + 0.12
      );
    }
  });

  // 3. SVG Curving Path draws across smoothly
  if (path) {
    heroTl.to(
      path,
      {
        strokeDashoffset: 0,
        strokeWidth: 22,
        duration: 0.95,
        ease: 'power2.out'
      },
      totalLinesTime * 0.35
    );
  }

  // 4. Character Illustration Pop
  if (svgIllustration) {
    heroTl.to(
      svgIllustration,
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.85,
        ease: 'back.out(2.2)'
      },
      totalLinesTime * 0.45
    );
  }

  // 5. Paragraph Lines slide up
  if (allParaLines.length) {
    heroTl.to(
      allParaLines,
      {
        y: '0%',
        opacity: 1,
        duration: 0.85,
        stagger: 0.1,
        ease: 'back.out(1.4)'
      },
      totalLinesTime * 0.52
    );
  }
}

/* -------------------------------------------------------------
   TWO 26 — SECTION VALUES STACKING PINNED CARDS
   ------------------------------------------------------------- */
function initValuesStack() {
  const section = document.querySelector('.section-values');
  if (!section) return;

  const wrapper = section.querySelector('.section-values-wrapper') || section;
  const cards = Array.from(section.querySelectorAll('.value-card'));
  const totalCards = cards.length;
  if (totalCards === 0) return;

  const isMobile = window.innerWidth < 768;
  const baseTop = isMobile ? 80 : 100;
  const stepOffset = isMobile ? 45 : 70;

  cards.forEach((card, index) => {
    const stickyTop = baseTop + index * stepOffset;
    card.style.position = 'sticky';
    card.style.top = `${stickyTop}px`;
    card.style.zIndex = 10 + index * 10;

    const progress = card.querySelector('.value-progress');
    if (progress) {
      gsap.fromTo(
        progress,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top ' + stickyTop + 'px',
            end: '+=200',
            scrub: true
          }
        }
      );
    }
  });

  // Add spacer so last card pins cleanly
  const existingSpacer = wrapper.querySelector('.values-sticky-spacer');
  if (!existingSpacer) {
    const spacer = document.createElement('div');
    spacer.className = 'values-sticky-spacer';
    spacer.style.cssText = 'height: 120px; width: 100%; pointer-events: none;';
    wrapper.appendChild(spacer);
  }
}
