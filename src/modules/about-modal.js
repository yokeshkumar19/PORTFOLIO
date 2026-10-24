import gsap from 'gsap';
import { getLenis } from './lenis-scroll.js';

export function initTwo26AboutModal() {
  const aboutPage = document.getElementById('about-modal');
  if (!aboutPage) return;

  const transitionOverlay = document.getElementById('about-transition-overlay');
  const transitionPath = document.getElementById('about-transition-path');
  const closeBtn = document.getElementById('about-close-btn');
  const aboutNavbar = aboutPage.querySelector('.about-navbar');
  const aboutLogo = aboutPage.querySelector('.about-logo-wordmark, .navbar-logo-about');
  const closeBtnText = closeBtn ? closeBtn.querySelector('.back-btn-txt, span') : null;
  const heroSection = aboutPage.querySelector('.section-about-hero');
  const explicitHeadings = Array.from(aboutPage.querySelectorAll('[data-about-hero-heading]'));
  const headings = explicitHeadings.length > 0
    ? explicitHeadings
    : Array.from(new Set(aboutPage.querySelectorAll('.about-hero-text h1, .about-hero-text .heading')));
  const pills = Array.from(aboutPage.querySelectorAll('.work-hero-pill'));
  const heroPath = aboutPage.querySelector('.about-hero-path svg path');
  const illustration = aboutPage.querySelector('.about-hero-svg-wrapper');
  const paras = Array.from(aboutPage.querySelectorAll('.about-hero-para'));
  const otherSections = Array.from(
    aboutPage.querySelectorAll('.about-story-team, .section-moodboard, .section-values, .section-what-we-do, .footer')
  );

  let isOpen = false;
  let openTl = null;
  let closeTl = null;

  // Safe path length calculation for orange brush stroke
  function getPathLength() {
    let len = 3500;
    try {
      if (transitionPath && typeof transitionPath.getTotalLength === 'function') {
        const measured = transitionPath.getTotalLength();
        if (measured && !isNaN(measured) && measured > 100) {
          len = measured;
        }
      }
    } catch (e) {
      len = 3500;
    }
    return len;
  }

  // 1. Line-by-Line Heading Setup behind overflow masks
  let allHeadingLines = [];
  headings.forEach((heading) => {
    let line = heading.querySelector('.about-hero-line');
    if (!line) {
      const raw = heading.textContent.trim();
      heading.innerHTML = `<span class="about-hero-line-mask" style="display:block; overflow:hidden;"><span class="about-hero-line" style="display:block;">${raw}</span></span>`;
      line = heading.querySelector('.about-hero-line');
    }
    if (line) allHeadingLines.push(line);
  });

  // 2. Line-by-Line Paragraph Setup
  let allParaLines = [];
  paras.forEach((p) => {
    let line = p.querySelector('.about-hero-para-line');
    if (!line) {
      const raw = p.innerHTML.trim();
      p.innerHTML = `<span class="about-hero-line-mask" style="display:block; overflow:hidden;"><span class="about-hero-para-line" style="display:block;">${raw}</span></span>`;
      line = p.querySelector('.about-hero-para-line');
    }
    if (line) allParaLines.push(line);
  });

  // 3. Pill inner text masks
  pills.forEach((pill) => {
    const textEl = pill.querySelector('.hero-pill-text');
    if (textEl && !textEl.closest('.about-hero-pill-text-mask')) {
      const mask = document.createElement('span');
      mask.className = 'about-hero-pill-text-mask';
      mask.style.display = 'inline-block';
      mask.style.overflow = 'hidden';
      textEl.parentNode.insertBefore(mask, textEl);
      mask.appendChild(textEl);
    }
  });

  // Reset elements to initial hidden state
  function resetModalElements() {
    if (aboutLogo) {
      gsap.set(aboutLogo, { scale: 0, opacity: 0, transformOrigin: 'center center' });
    }

    if (closeBtn) {
      gsap.set(closeBtn, { opacity: 0, scale: 0.4, y: 15, transformOrigin: 'center center' });
      if (closeBtnText) {
        gsap.set(closeBtnText, { opacity: 0, y: 10, display: 'inline-block' });
      }
    }

    if (transitionPath) {
      const len = getPathLength();
      gsap.set(transitionPath, {
        strokeDasharray: len * 2,
        strokeDashoffset: len,
        strokeWidth: '0px',
        attr: { 'stroke-width': 0 }
      });
    }

    if (allHeadingLines.length) {
      gsap.set(headings, { opacity: 1 });
      gsap.set(allHeadingLines, { y: '115%', opacity: 0 });
    }

    if (pills.length) {
      pills.forEach((pill) => {
        const isOne = pill.classList.contains('one');
        const isTwo = pill.classList.contains('two');
        const rot = isOne ? -3 : (isTwo ? 3 : 0);
        gsap.set(pill, { opacity: 0, scale: 0.4, y: 20, rotation: rot, transformOrigin: 'center center' });

        const textEl = pill.querySelector('.hero-pill-text');
        if (textEl) gsap.set(textEl, { y: '105%', opacity: 0 });
      });
    }

    if (heroPath) {
      let len = 2500;
      try {
        if (typeof heroPath.getTotalLength === 'function') len = heroPath.getTotalLength() || 2500;
      } catch (e) {}
      gsap.set(heroPath, { strokeDasharray: len, strokeDashoffset: len, strokeWidth: 0 });
    }

    if (illustration) {
      gsap.set(illustration, { opacity: 0, scale: 0.65, rotation: -6, transformOrigin: 'center center' });
    }

    if (allParaLines.length) {
      gsap.set(paras, { opacity: 1 });
      gsap.set(allParaLines, { y: '115%', opacity: 0 });
    }

    if (otherSections.length) {
      gsap.set(otherSections, { opacity: 0, y: 25 });
    }

    gsap.set(aboutPage, { backgroundColor: 'var(--bg-main)' });
  }

  resetModalElements();

  // 4. Two26 Open Timeline Execution (Thick Orange Vector Brush Wipe & Kinetic Entrance)
  function openAboutModal() {
    if (isOpen) return;
    isOpen = true;

    // Lock body scroll and pause Lenis
    document.body.style.overflow = 'hidden';
    const lenis = getLenis();
    if (lenis && typeof lenis.stop === 'function') lenis.stop();

    if (closeTl) closeTl.kill();
    resetModalElements();

    const len = getPathLength();

    if (transitionOverlay) {
      transitionOverlay.classList.add('is-active');
      transitionOverlay.style.display = 'flex';
    }

    openTl = gsap.timeline();

    // Step 1: Signature Two26 Orange Brush Wipe IN (Expanding stroke paints entire viewport)
    if (transitionPath) {
      gsap.set(transitionPath, {
        strokeDasharray: len * 2,
        strokeDashoffset: len,
        strokeWidth: '0px',
        attr: { 'stroke-width': 0 }
      });

      openTl.to(
        transitionPath,
        {
          strokeDashoffset: 0,
          strokeWidth: '2200px',
          attr: { 'stroke-width': 2200 },
          duration: 0.48,
          ease: 'power2.inOut'
        },
        0
      );
    }

    // Step 2: Peak Coverage at 0.48s — Switch View Behind the Solid Orange Brush
    openTl.call(
      () => {
        aboutPage.classList.add('is-active');
        aboutPage.style.display = 'block';
        aboutPage.style.visibility = 'visible';
        aboutPage.style.pointerEvents = 'auto';
        aboutPage.scrollTop = 0;

        try {
          if (window.location.hash !== '#about') {
            window.history.pushState({ modal: 'about' }, 'About — YK.', '#about');
          }
        } catch (e) {}
      },
      null,
      0.48
    );

    // Step 3: Signature Two26 Orange Brush Wipe OUT / Peel Away (Stroke sweeps forward and off)
    if (transitionPath) {
      openTl.to(
        transitionPath,
        {
          strokeDashoffset: -len,
          strokeWidth: '0px',
          attr: { 'stroke-width': 0 },
          duration: 0.48,
          ease: 'power2.inOut',
          onComplete: () => {
            if (transitionOverlay) {
              transitionOverlay.classList.remove('is-active');
              transitionOverlay.style.display = 'none';
            }
          }
        },
        0.48
      );
    }

    const contentStart = 0.52;

    // Step 4: Navbar Wordmark & "Return Home" Back Button Pop
    if (aboutLogo) {
      openTl.to(
        aboutLogo,
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: 'back.out(2.2)'
        },
        contentStart
      );
    }

    if (closeBtn) {
      openTl.to(
        closeBtn,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(2.5)'
        },
        contentStart + 0.06
      );

      if (closeBtnText) {
        openTl.to(
          closeBtnText,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.6)'
          },
          contentStart + 0.14
        );
      }
    }

    // Step 5: Hero Headings slide up from masks
    if (allHeadingLines.length) {
      openTl.to(
        allHeadingLines,
        {
          y: '0%',
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'back.out(1.4)'
        },
        contentStart + 0.08
      );
    }

    const totalLinesTime = allHeadingLines.length * 0.12 + 0.4;

    // Step 6: Floating Pills pop in
    pills.forEach((pill, i) => {
      const isOne = pill.classList.contains('one');
      const isTwo = pill.classList.contains('two');
      const rot = isOne ? -3 : (isTwo ? 3 : 0);
      const pillStart = contentStart + totalLinesTime * (0.25 + i * 0.2);
      const textEl = pill.querySelector('.hero-pill-text');

      openTl.to(
        pill,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: rot,
          duration: 0.55,
          ease: 'back.out(2.5)'
        },
        pillStart
      );

      if (textEl) {
        openTl.to(
          textEl,
          {
            y: '0%',
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(1.6)'
          },
          pillStart + 0.1
        );
      }
    });

    // Step 7: S-Curve Vector Path draws
    if (heroPath) {
      openTl.to(
        heroPath,
        {
          strokeDashoffset: 0,
          strokeWidth: 22,
          duration: 0.85,
          ease: 'power2.out'
        },
        contentStart + totalLinesTime * 0.3
      );
    }

    // Step 8: Character Illustration pop
    if (illustration) {
      openTl.to(
        illustration,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.75,
          ease: 'back.out(2.2)'
        },
        contentStart + totalLinesTime * 0.38
      );
    }

    // Step 9: Paragraph Lines slide up
    if (allParaLines.length) {
      openTl.to(
        allParaLines,
        {
          y: '0%',
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: 'back.out(1.4)'
        },
        contentStart + totalLinesTime * 0.45
      );
    }

    // Step 10: Other Sections reveal
    if (otherSections.length) {
      openTl.to(
        otherSections,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        },
        contentStart + totalLinesTime * 0.52
      );
    }
  }

  // 5. Two26 Close Timeline Execution (Reverse Orange Brush Wipe to Return Home)
  function closeAboutModal(fromPopState = false) {
    if (!isOpen) return;

    if (openTl) openTl.kill();
    isOpen = false;

    const len = getPathLength();

    if (transitionOverlay) {
      transitionOverlay.classList.add('is-active');
      transitionOverlay.style.display = 'flex';
    }

    closeTl = gsap.timeline();

    // Fade and slide content up slightly
    closeTl.to(
      [closeBtn, aboutLogo, heroSection, ...otherSections].filter(Boolean),
      {
        opacity: 0,
        y: -16,
        duration: 0.22,
        ease: 'power2.in'
      },
      0
    );

    // Step 1: Orange Brush Wipe IN over About Modal
    if (transitionPath) {
      gsap.set(transitionPath, {
        strokeDasharray: len * 2,
        strokeDashoffset: len,
        strokeWidth: '0px',
        attr: { 'stroke-width': 0 }
      });

      closeTl.to(
        transitionPath,
        {
          strokeDashoffset: 0,
          strokeWidth: '2200px',
          attr: { 'stroke-width': 2200 },
          duration: 0.42,
          ease: 'power2.inOut'
        },
        0
      );
    }

    // Step 2: Peak Coverage at 0.42s — Hide About Modal and Restore Home View
    closeTl.call(
      () => {
        aboutPage.classList.remove('is-active');
        aboutPage.style.display = 'none';
        aboutPage.style.visibility = 'hidden';
        aboutPage.style.pointerEvents = 'none';

        document.body.style.overflow = '';
        const lenis = getLenis();
        if (lenis && typeof lenis.start === 'function') lenis.start();

        if (!fromPopState && window.location.hash === '#about') {
          try {
            window.history.pushState(null, '', window.location.pathname + window.location.search);
          } catch (e) {}
        }

        resetModalElements();
      },
      null,
      0.42
    );

    // Step 3: Orange Brush Wipe OUT / Peel Away revealing Home Page
    if (transitionPath) {
      closeTl.to(
        transitionPath,
        {
          strokeDashoffset: -len,
          strokeWidth: '0px',
          attr: { 'stroke-width': 0 },
          duration: 0.42,
          ease: 'power2.inOut',
          onComplete: () => {
            if (transitionOverlay) {
              transitionOverlay.classList.remove('is-active');
              transitionOverlay.style.display = 'none';
            }
          }
        },
        0.42
      );
    }
  }

  // Export functions globally
  window.openTwo26AboutModal = openAboutModal;
  window.closeTwo26AboutModal = closeAboutModal;

  // 6. Global Capturing Click Listener for all About triggers
  document.addEventListener(
    'click',
    (e) => {
      const trigger = e.target.closest(
        '[data-about-trigger], #more-about-btn, a[href="#about"], a[href="/about.html"], a[href="about.html"]'
      );
      if (
        trigger &&
        !trigger.closest('.about-page') &&
        !trigger.classList.contains('about-close-btn') &&
        !trigger.hasAttribute('data-about-close')
      ) {
        e.preventDefault();
        e.stopPropagation();
        openAboutModal();
        return;
      }

      // Back / Return Home Button Click
      const closeTrigger = e.target.closest('#about-close-btn, [data-about-close]');
      if (closeTrigger) {
        e.preventDefault();
        e.stopPropagation();
        closeAboutModal();
      }
    },
    true
  );

  // 7. Keyboard Accessibility (Escape key closes)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeAboutModal();
    }
  });

  // 8. Browser Popstate (Back/Forward navigation)
  window.addEventListener('popstate', () => {
    if (isOpen && window.location.hash !== '#about') {
      closeAboutModal(true);
    } else if (!isOpen && window.location.hash === '#about') {
      openAboutModal();
    }
  });

  // 9. Auto-open if URL has #about on load
  if (window.location.hash === '#about') {
    setTimeout(() => {
      openAboutModal();
    }, 350);
  }
}
