import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis-scroll.js';

gsap.registerPlugin(ScrollTrigger);

export function initNavigation(portfolioData) {
  const navHeader = document.querySelector('.nav-header');

  // 1. Navigation Sticky Background & Border Transition on Scroll
  if (navHeader) {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollPos > 40) {
        navHeader.classList.add('is-scrolled');
      } else {
        navHeader.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Active Section Highlighting in Navigation
  const sectionIds = ['hero', 'projects', 'about-summary', 'process'];
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => setActiveNav(id),
      onEnterBack: () => setActiveNav(id)
    });
  });

  function setActiveNav(id) {
    const navLinks = document.querySelectorAll('.nav-link-item');
    const hamLinks = document.querySelectorAll('.ham-nav-item');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${id}` || (id === 'about-summary' && href === '#about')) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });

    hamLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${id}` || (id === 'about-summary' && href === '#about')) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  // 3. Theme Toggle Setup (Two26 Linen / Dark Mode)
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

  // 4. Mobile Drawer Navigation
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

    // Stagger animation on links
    const links = hamMenu.querySelectorAll('.ham-nav-item');
    gsap.fromTo(links,
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

  function toggleMenu() {
    if (isMenuOpen) closeMenu();
    else openMenu();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (hamCloseBtn) {
    hamCloseBtn.addEventListener('click', closeMenu);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });

  // 4. Smooth Scrolling for ALL navigation & internal anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#contact' || href === '#contact-modal' || link.classList.contains('nav-cta-btn') || link.hasAttribute('data-contact-trigger')) {
        e.preventDefault();
        e.stopPropagation();
        if (isMenuOpen) closeMenu();
        if (typeof window.openTwo26ContactModal === 'function') {
          window.openTwo26ContactModal();
        }
        return;
      }

      if (href === '#about' || href === '#about-modal' || link.hasAttribute('data-about-trigger') || link.id === 'more-about-btn') {
        e.preventDefault();
        e.stopPropagation();
        if (isMenuOpen) closeMenu();
        if (typeof window.two26TransitionTo === 'function') {
          window.two26TransitionTo('/about.html', 'to_about');
        } else {
          window.location.href = '/about.html';
        }
        return;
      }

      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (isMenuOpen) closeMenu();

          try {
            window.history.pushState(null, '', href);
          } catch (err) {
            // ignore state push in restricted environments
          }

          const lenis = getLenis();
          let scrolled = false;
          if (lenis && typeof lenis.scrollTo === 'function') {
            try {
              if (typeof lenis.start === 'function') lenis.start();
              lenis.scrollTo(target, { offset: -50, duration: 1.2 });
              scrolled = true;
            } catch (err) {
              scrolled = false;
            }
          }
          if (!scrolled) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  // 5. Email Copy Pill with Floating Toast
  const copyPills = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toast-notice');

  copyPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const email = portfolioData?.profile?.email || 'yokeshkumar192007@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (toast) {
          toast.textContent = 'COPIED TO CLIPBOARD: ' + email;
          toast.classList.add('is-visible');
          setTimeout(() => {
            toast.classList.remove('is-visible');
          }, 3000);
        }
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  });

  // 6. Two26 Orange Brush About Modal Trigger
  const aboutPageLinks = document.querySelectorAll(
    'a[href="/about.html"], a[href="about.html"], a[href="#about"], [data-about-trigger], #more-about-btn'
  );
  aboutPageLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      if (isMenuOpen) closeMenu();
      if (typeof window.openTwo26AboutModal === 'function') {
        window.openTwo26AboutModal();
      }
    });
  });
}

export function playPageTransitionOut(targetUrl) {
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
