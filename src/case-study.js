import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenisScroll, getLenis } from './modules/lenis-scroll.js';
import { initCustomCursor } from './modules/cursor.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * =========================================================================
 * RIT BUSTRACK APK DOWNLOAD CONFIGURATION
 * =========================================================================
 * Replace the empty string below with your direct APK download URL
 * (e.g. from GitHub Releases, Firebase App Distribution, or Google Drive).
 * When empty, clicking "Try the App" displays a polite status toast.
 */
export const APK_DOWNLOAD_URL = "https://drive.google.com/file/d/1ktA_iCK7zsgUa-DeUGg_S3tz9vdBIFUm/view?usp=drivesdk";

// Screenshot Data Catalog
export const screenshotsData = [
  {
    id: "live-trip-tracking",
    src: "/assets/rit-bustrack/01-live-trip-tracking.jpg",
    tag: "Live Navigation & Telemetry",
    title: "Real-Time Bus Tracking Map",
    caption: "Live transit map displaying active route polyline from Dhamal through Arcot, live bus location marker, upcoming stop indicators, 9-minute ETA countdown, and active trip telemetry."
  },
  {
    id: "student-home-dashboard",
    src: "/assets/rit-bustrack/04-student-home-dashboard.jpg",
    tag: "Commuter Portal",
    title: "Student Transit Dashboard",
    caption: "Commuter home screen displaying live transport status, active campus buses (Bus R15 Kanchipuram & Bus R24 Arcot), next-stop estimates, and quick-action shortcuts."
  },
  {
    id: "driver-trip-dashboard",
    src: "/assets/rit-bustrack/02-driver-trip-dashboard.jpg",
    tag: "Driver Console",
    title: "Driver Schedule & Trip Dispatch",
    caption: "Dedicated driver portal with assigned bus specifications, shift schedule (morning, afternoon return, and evening trips), and one-tap Start Trip dispatch trigger."
  },
  {
    id: "user-profile-navigation",
    src: "/assets/rit-bustrack/03-user-profile-navigation.jpg",
    tag: "Account & Pass Hub",
    title: "Student Profile & Pass Management",
    caption: "Profile settings screen featuring verified college credentials, digital bus pass access, stop request history, notification preferences, and account controls."
  },
  {
    id: "bus-r15-route-details",
    src: "/assets/rit-bustrack/05-bus-r15-route-details.jpg",
    tag: "Route Intelligence",
    title: "Bus R15 Corridor Overview",
    caption: "Route inspection for Bus R15 (Kanchipuram - RIT), driver assignment details, GPS status availability, and pickup point reservation request."
  },
  {
    id: "bus-r24-route-details",
    src: "/assets/rit-bustrack/06-bus-r24-route-details.jpg",
    tag: "Route Intelligence",
    title: "Bus R24 Return Route Details",
    caption: "Return journey breakdown for the Arcot - RIT transit line, showing remaining stop counts, ETA calculations, driver details, and pickup point reservation."
  },
  {
    id: "student-registration",
    src: "/assets/rit-bustrack/07-student-registration.jpg",
    tag: "Campus Security",
    title: "Institutional Email Registration",
    caption: "Student account creation strictly validated against official college email domains (@ritchennai.edu.in) to preserve verified campus transit security."
  },
  {
    id: "student-signin",
    src: "/assets/rit-bustrack/08-student-signin.jpg",
    tag: "Authentication",
    title: "Secure Student Authentication",
    caption: "Authentication screen featuring student sign-in, session persistence, and self-service password recovery workflows."
  }
];

let currentLightboxIndex = 0;

function showToast(message) {
  let toast = document.getElementById('case-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'case-toast';
    toast.className = 'case-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function initTheme() {
  const savedTheme = localStorage.getItem('yk-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('yk-theme', next);
    });
  }
}

function initActionButtons() {
  const tryAppBtns = document.querySelectorAll('.btn-try-app');
  tryAppBtns.forEach((btn) => {
    if (APK_DOWNLOAD_URL && APK_DOWNLOAD_URL.trim() !== '') {
      if (btn.tagName.toLowerCase() === 'a') {
        btn.setAttribute('href', APK_DOWNLOAD_URL);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');
      } else {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(APK_DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
        });
      }
    } else {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('APK build is currently being prepared. Download link will be available soon.');
      });
    }
  });

  const viewScreenshotBtns = document.querySelectorAll('.btn-view-screenshots');
  viewScreenshotBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('inside-the-app');
      if (target) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(target, { offset: -60, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Smooth scroll for nav anchor links
  const navLinks = document.querySelectorAll('.case-nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(target, { offset: -70, duration: 1.1 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });
}

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const tagEl = document.getElementById('lightbox-tag');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const counterEl = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (!modal) return;

  function updateLightbox(index) {
    currentLightboxIndex = (index + screenshotsData.length) % screenshotsData.length;
    const item = screenshotsData[currentLightboxIndex];
    if (imgEl) {
      imgEl.src = item.src;
      imgEl.alt = item.title;
    }
    if (tagEl) tagEl.textContent = item.tag;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.caption;
    if (counterEl) {
      counterEl.textContent = `${String(currentLightboxIndex + 1).padStart(2, '0')} / ${String(screenshotsData.length).padStart(2, '0')}`;
    }
  }

  function openLightbox(index) {
    updateLightbox(index);
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    gsap.fromTo('.lightbox-content-wrap',
      { scale: 0.94, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }

  function closeLightbox() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Bind click handlers to gallery items
  const galleryCards = document.querySelectorAll('.screenshot-item-card');
  galleryCards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  // Hero phone click opens first screenshot
  const heroPhone = document.querySelector('.hero-phone-container');
  if (heroPhone) {
    heroPhone.style.cursor = 'pointer';
    heroPhone.addEventListener('click', () => openLightbox(0));
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => updateLightbox(currentLightboxIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateLightbox(currentLightboxIndex + 1));

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  modal.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          updateLightbox(currentLightboxIndex + 1); // Swipe left
        } else {
          updateLightbox(currentLightboxIndex - 1); // Swipe right
        }
      }
    }
  }, { passive: true });

  // Modal backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentLightboxIndex + 1);
  });
}

function initGalleryFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab-pill');
  const cards = document.querySelectorAll('.screenshot-item-card');
  if (filterTabs.length === 0 || cards.length === 0) return;

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
      ScrollTrigger.refresh();
    });
  });
}

// 1. Hero Vector Thread Entrance & Parallax
function initHeroThread() {
  const heroPath = document.getElementById('case-hero-thread');
  if (!heroPath) return;

  const len = heroPath.getTotalLength ? heroPath.getTotalLength() : 1425;
  heroPath.style.strokeDasharray = `${len} ${len}`;
  heroPath.style.strokeDashoffset = `${len}`;

  gsap.to(heroPath, {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: 'power2.out',
    delay: 0.35
  });

  ScrollTrigger.create({
    trigger: '.section-case-hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8,
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set('.case-hero-thread-svg', { y: -120 * p, rotation: -10 * p });
    }
  });
}

// 2. Interactive 3D Perspective Tilt for Hero Phone
function initHeroPhoneTilt() {
  const heroPhone = document.querySelector('.hero-phone-container');
  if (!heroPhone || matchMedia('(pointer: coarse)').matches) return;

  const wrapper = heroPhone.parentElement;
  if (!wrapper) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(heroPhone, {
      rotationY: x * 18,
      rotationX: -y * 18,
      transformPerspective: 900,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  wrapper.addEventListener('mouseleave', () => {
    gsap.to(heroPhone, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'elastic.out(1.15, 0.4)'
    });
  });
}

// 3. Two26 Studio Signature Transit Route Winding Thread Animation
function initTransitRouteThread() {
  const routeSection = document.getElementById('route-thread');
  const servicesBody = document.getElementById('route-services-body');
  if (!routeSection || !servicesBody) return;

  const desktopDarkPath = document.getElementById('case-route-thread-desktop');
  const mobileDarkPath = document.getElementById('case-route-thread-mobile');
  const isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let desktopLen = 6535;
  if (desktopDarkPath) {
    desktopDarkPath.style.strokeLinecap = 'round';
    desktopDarkPath.style.strokeLinejoin = 'round';
    try {
      const l = desktopDarkPath.getTotalLength();
      if (l > 100) desktopLen = l;
    } catch (e) {}
    desktopDarkPath.style.strokeDasharray = `${desktopLen} ${desktopLen}`;
    desktopDarkPath.style.strokeDashoffset = `${desktopLen}`;
  }

  let mobileLen = 2885;
  if (mobileDarkPath) {
    mobileDarkPath.style.strokeLinecap = 'round';
    mobileDarkPath.style.strokeLinejoin = 'round';
    try {
      const l = mobileDarkPath.getTotalLength();
      if (l > 100) mobileLen = l;
    } catch (e) {}
    mobileDarkPath.style.strokeDasharray = `${mobileLen} ${mobileLen}`;
    mobileDarkPath.style.strokeDashoffset = `${mobileLen}`;
  }

  const layers = Array.from(routeSection.querySelectorAll('.services-layers .service-layer'));
  layers.forEach((layer) => {
    const block = layer.querySelector('.service-block') || layer;
    const centerSvg = block.querySelector('.service-svg');
    const paraWrapper = block.querySelector('.service-block-para-wrapper');

    if (centerSvg && !isReducedMotion) {
      centerSvg.style.transformOrigin = 'center center';
      centerSvg.style.willChange = 'transform, opacity';
      gsap.set(centerSvg, { scale: 0.2, rotation: -40, opacity: 0 });
    }

    if (paraWrapper && !isReducedMotion) {
      paraWrapper.style.transformOrigin = 'center center';
      paraWrapper.style.willChange = 'transform, opacity';
      gsap.set(paraWrapper, { scale: 0, rotation: 0, opacity: 0 });
    }
  });

  if (isReducedMotion) {
    if (desktopDarkPath) desktopDarkPath.style.strokeDashoffset = '0';
    if (mobileDarkPath) mobileDarkPath.style.strokeDashoffset = '0';
    return;
  }

  // Master Scrub Timeline for the Transit Route Thread
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: servicesBody,
      start: 'top 70%',
      end: 'bottom 65%',
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  if (desktopDarkPath) {
    masterTl.to(desktopDarkPath, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
  }
  if (mobileDarkPath) {
    masterTl.to(mobileDarkPath, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
  }

  // Exact Arc-Length Proximity Milestones for the 4 Pipeline Stages
  const loopMilestones = [0.16, 0.40, 0.63, 0.84];
  const stepDuration = 0.14;

  layers.forEach((layer, index) => {
    const block = layer.querySelector('.service-block') || layer;
    const num = block.querySelector('.service-step-num');
    const centerSvg = block.querySelector('.service-svg');
    const paraWrapper = block.querySelector('.service-block-para-wrapper');

    const startTime = loopMilestones[index] !== undefined ? loopMilestones[index] : index * 0.25;

    if (centerSvg) {
      masterTl.to(centerSvg, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: stepDuration,
        ease: 'back.out(3.5)'
      }, startTime);
    }

    if (paraWrapper) {
      masterTl.to(paraWrapper, {
        scale: 1,
        rotation: index % 2 === 0 ? -5 : 4,
        opacity: 1,
        duration: stepDuration,
        ease: 'back.out(3.5)'
      }, startTime + 0.02);
    }

    if (num) {
      masterTl.to(num, {
        scale: 1.15,
        duration: stepDuration * 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'power1.out'
      }, startTime);
    }
  });

  const endBead = document.getElementById('case-thread-end');
  if (endBead) {
    masterTl.fromTo(endBead,
      { scale: 0.9, opacity: 0.6 },
      { scale: 1.3, opacity: 1, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' },
      0.94
    );
  }

  // Mobile Dedicated Transit Pipeline Card Reveals
  const mobileCards = document.querySelectorAll('.mobile-pipe-card');
  if (mobileCards.length > 0) {
    mobileCards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }
}

// 4. Section Divider & General Scroll Reveals
function initScrollAnimations() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Hero entrance
  const heroTl = gsap.timeline({ delay: 0.15 });
  heroTl.fromTo('.case-hero-meta-row',
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
  );
  heroTl.fromTo('.case-hero-title',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.85, ease: 'power4.out' },
    '-=0.4'
  );
  heroTl.fromTo('.case-hero-subtitle, .case-hero-desc',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1 },
    '-=0.5'
  );
  heroTl.fromTo('.case-cta-group, .case-tech-chips-wrap',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.1 },
    '-=0.4'
  );
  heroTl.fromTo('.case-hero-visual',
    { scale: 0.9, opacity: 0, y: 40 },
    { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
    '-=0.7'
  );

  // Section reveals
  const blocks = document.querySelectorAll('.section-case-block');
  blocks.forEach((block) => {
    gsap.fromTo(block.querySelectorAll('.case-section-header, .editorial-split-grid, .capabilities-grid, .gallery-filter-bar, .screenshots-gallery-grid, .tech-stack-row'),
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Animated section dividers
  const dividers = document.querySelectorAll('.section-divider-line');
  dividers.forEach((divider) => {
    gsap.fromTo(divider,
      { scaleX: 0, transformOrigin: 'center center' },
      {
        scaleX: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: divider,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis Smooth Scroll
  initLenisScroll();

  // 2. Custom Magnetic Cursor with VIEW badge
  initCustomCursor();

  // 3. Theme Toggle & State
  initTheme();

  // 4. Hero Visual Interactive Parallax & 3D Tilt
  initHeroThread();
  initHeroPhoneTilt();

  // 5. Signature Transit Route Serpentine Thread & Mobile Pipeline
  initTransitRouteThread();

  // 6. Action Buttons, Filters & Lightbox
  initActionButtons();
  initGalleryFilters();
  initLightbox();

  // 7. General Scroll Reveals
  initScrollAnimations();
});
