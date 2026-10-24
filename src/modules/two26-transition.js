import gsap from 'gsap';

export function initTwo26Transitions() {
  const transitionOverlay = document.getElementById('about-transition-overlay');
  const transitionPath = document.getElementById('about-transition-path');
  const isAboutPage =
    document.body.classList.contains('about-standalone-page') ||
    window.location.pathname.endsWith('about.html') ||
    window.location.pathname.endsWith('/about');

  function getPathLength() {
    let len = 3500;
    try {
      if (transitionPath && typeof transitionPath.getTotalLength === 'function') {
        const measured = transitionPath.getTotalLength();
        if (measured && !isNaN(measured) && measured > 100) len = measured;
      }
    } catch (e) {
      len = 3500;
    }
    return len;
  }

  const len = getPathLength();

  // 1. Check if entering via page transition
  const transitionFlag = sessionStorage.getItem('yk_transition');
  if (transitionFlag && transitionOverlay && transitionPath) {
    sessionStorage.removeItem('yk_transition');

    // Make sure overlay is visible at peak stroke coverage
    transitionOverlay.style.display = 'flex';
    gsap.set(transitionPath, {
      strokeDasharray: `${len} ${len}`,
      strokeDashoffset: 0,
      strokeWidth: '2200px',
      attr: { 'stroke-width': 2200 }
    });

    // Animate stroke away / peel reveal
    gsap.to(transitionPath, {
      strokeDashoffset: -len,
      strokeWidth: '0px',
      attr: { 'stroke-width': 0 },
      duration: 0.5,
      ease: 'power2.inOut',
      delay: 0.04,
      onComplete: () => {
        transitionOverlay.style.display = 'none';
      }
    });
  } else if (transitionOverlay) {
    transitionOverlay.style.display = 'none';
  }

  // 2. Perform orange brush transition to destination URL
  function transitionTo(targetUrl, flag) {
    if (!transitionOverlay || !transitionPath) {
      window.location.href = targetUrl;
      return;
    }

    try {
      sessionStorage.setItem('yk_transition', flag);
    } catch (e) {}

    transitionOverlay.style.display = 'flex';

    gsap.set(transitionPath, {
      strokeDasharray: `${len} ${len}`,
      strokeDashoffset: len,
      strokeWidth: '0px',
      attr: { 'stroke-width': 0 }
    });

    gsap.to(transitionPath, {
      strokeDashoffset: 0,
      strokeWidth: '2200px',
      attr: { 'stroke-width': 2200 },
      duration: 0.44,
      ease: 'power2.inOut',
      onComplete: () => {
        window.location.href = targetUrl;
      }
    });
  }

  window.two26TransitionTo = transitionTo;

  // 3. Capturing click listener for navigation
  document.addEventListener(
    'click',
    (e) => {
      // About triggers (from home or any page other than about)
      const aboutTrigger = e.target.closest(
        '[data-about-trigger], #more-about-btn, a[href="/about.html"], a[href="about.html"]'
      );
      if (aboutTrigger && !isAboutPage) {
        e.preventDefault();
        e.stopPropagation();
        transitionTo('/about.html', 'to_about');
        return;
      }

      // Return home triggers (from about page)
      const homeTrigger = e.target.closest(
        '#about-back-btn, .about-close-btn, [data-home-trigger], [data-about-close], a[href="/index.html"], a[href="index.html"]'
      );
      if (homeTrigger && isAboutPage) {
        e.preventDefault();
        e.stopPropagation();
        transitionTo('/index.html', 'to_home');
        return;
      }
    },
    true
  );

  // 4. Keyboard ESC returns home when on about page
  if (isAboutPage) {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        transitionTo('/index.html', 'to_home');
      }
    });
  }
}
