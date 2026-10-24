import './style.css';
import './about.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from './portfolio-data.js';
import { initLenisScroll, getLenis } from './modules/lenis-scroll.js';
import { initCustomCursor } from './modules/cursor.js';
import { initPreloader } from './modules/preloader.js';
import { initNavigation } from './modules/navigation.js';
import { initHeroInteractive, playHeroEntrance } from './modules/hero.js';
import { initMagneticHeadings } from './modules/magnetic-headings.js';
import { initCTAButtons } from './modules/cta-buttons.js';
import { initProjectsSection } from './modules/projects.js';
import { initAboutPinned } from './modules/about-pinned.js';
import { initThreadScroll, playHeroThreadsEntrance } from './modules/thread-scroll.js';
import { initScrollReveals } from './modules/scroll-reveals.js';
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

  // 3. Navigation and Drawer Setup
  initNavigation(portfolioData);

  // 4. Hero Interactive Accents
  initHeroInteractive();

  // 5. Magnetic Headings Offset Physics
  initMagneticHeadings();

  // 6. Two26 Interactive Magnetic CTA Buttons
  initCTAButtons();

  // 7. Project Cards 3D Clip-Mask Reveal & Case Study Modal (Two26 Studio Exact)
  initProjectsSection(portfolioData.projects);

  // 8. Pinned About Character Wave Scrub (Two26 Studio Exact)
  initAboutPinned();

  // 9. Two26 Signature Thread-Like Scrolling Animation (Scrubbed Vector Path)
  initThreadScroll();

  // 10. General Scroll-Triggered Reveal Animations
  initScrollReveals();

  // 11. Two26 Studio Signature Fullscreen Contact Modal Experience
  initTwo26ContactModal();

  // 12. Two26 Studio Signature Orange Brush Page Transitions
  initTwo26Transitions();

  // 11. Back to Top Smooth Scroll
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // 10. Two26 Kinetic Thread Preloader ("thread comes, draws YK., and goes")
  initPreloader(() => {
    playHeroEntrance();
    playHeroThreadsEntrance();
    setTimeout(() => {
      const lenis = getLenis();
      if (lenis) lenis.resize();
      ScrollTrigger.refresh();
    }, 300);
  });

  // 11. Window Resize Recalculation
  window.addEventListener('resize', () => {
    const lenis = getLenis();
    if (lenis) lenis.resize();
    ScrollTrigger.refresh();
  });
});
