import gsap from 'gsap';
import { getLenis } from './lenis-scroll.js';

export function initTwo26ContactModal() {
  const contactPage = document.getElementById('contact-modal');
  if (!contactPage) return;

  const closeBtn = document.getElementById('contact-close-btn');
  const contactNavbar = contactPage.querySelector('.contact-navbar');
  const contactContent = contactPage.querySelector('.contact-content');
  const contactHeadings = Array.from(contactPage.querySelectorAll('.contact-heading'));
  const contactParas = Array.from(contactPage.querySelectorAll('.contact-para'));
  const emailHeadings = Array.from(contactPage.querySelectorAll('.email-heading'));
  const emailLinks = Array.from(contactPage.querySelectorAll('.email-link'));
  const contactSocials = Array.from(contactPage.querySelectorAll('.contact-social'));
  const transitionPath = document.getElementById('contact-transition-path');
  const contactLogo = contactPage.querySelector('.contact-logo-wordmark, .navbar-logo-contact');
  const closeBtnText = closeBtn ? closeBtn.querySelector('.back-btn-txt, span') : null;
  const contactImg = contactPage.querySelector('.contact-img, .contact-img-wrap img');

  let isOpen = false;
  let openTl = null;

  // Safe path length calculation
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

  // 1. Split Text Preparation (Two26 Studio Signature)
  // A. Left Headings (Characters with kinetic pop & random tilt)
  let headingChars = [];
  contactHeadings.forEach((heading) => {
    const words = heading.textContent.trim().split(' ');
    heading.innerHTML = words
      .map(
        (w) =>
          `<span style="display:inline-block; margin-right:0.2em;">` +
          w
            .split('')
            .map((c) => `<span class="contact-heading-char" style="display:inline-block;">${c}</span>`)
            .join('') +
          `</span>`
      )
      .join(' ');
    headingChars = headingChars.concat(Array.from(heading.querySelectorAll('.contact-heading-char')));
  });

  // B. Left Paragraph Lines (Masked slide up)
  let paraLines = [];
  contactParas.forEach((para) => {
    const raw = para.innerHTML.trim();
    para.innerHTML = `<span class="contact-para-line-mask" style="display:block; overflow:hidden;"><span class="contact-para-line" style="display:block;">${raw}</span></span>`;
    paraLines = paraLines.concat(Array.from(para.querySelectorAll('.contact-para-line')));
  });

  // C. Right Email Headings (Words with overflow mask)
  let emailHeadingWords = [];
  emailHeadings.forEach((eh) => {
    const words = eh.textContent.trim().split(' ');
    eh.innerHTML = words
      .map(
        (w) =>
          `<span class="contact-word-mask" style="display:inline-block; overflow:hidden; margin-right:0.25em;"><span class="contact-word" style="display:inline-block;">${w}</span></span>`
      )
      .join('');
    emailHeadingWords = emailHeadingWords.concat(Array.from(eh.querySelectorAll('.contact-word')));
  });

  // D. Right Email Links (Letter-by-Letter Kinetic Hover with tilt)
  emailLinks.forEach((el) => {
    const raw = el.textContent.trim();
    el.innerHTML = raw
      .split('')
      .map((c) => `<span class="contact-email-char" style="display:inline-block;">${c === ' ' ? '&nbsp;' : c}</span>`)
      .join('');

    const chars = Array.from(el.querySelectorAll('.contact-email-char'));
    el.addEventListener('mouseenter', () => {
      chars.forEach((char, idx) => {
        const randomTilt = gsap.utils.random(-8, 8);
        gsap.to(char, {
          scale: 1.18,
          rotation: randomTilt,
          duration: 0.35,
          delay: idx * 0.03,
          ease: 'back.out(2)',
          overwrite: 'auto',
          onComplete: () => {
            gsap.to(char, {
              scale: 1,
              rotation: 0,
              duration: 0.45,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(chars, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        stagger: 0.015,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });

  // 2. Fresh Reset State
  function resetModalElements() {
    if (openTl) openTl.kill();

    if (contactContent) gsap.set(contactContent, { opacity: 1, y: 0 });
    if (contactNavbar) gsap.set(contactNavbar, { opacity: 1, y: 0 });

    if (contactLogo) {
      gsap.set(contactLogo, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center center'
      });
    }

    if (closeBtn) {
      gsap.set(closeBtn, {
        opacity: 0,
        scale: 0.4,
        y: 20,
        transformOrigin: 'center center'
      });
      if (closeBtnText) {
        gsap.set(closeBtnText, { opacity: 0, y: 15, display: 'inline-block' });
      }
    }

    if (transitionPath) {
      const len = getPathLength();
      gsap.set(transitionPath, {
        strokeDasharray: len,
        strokeDashoffset: len,
        strokeWidth: '0px',
        attr: { 'stroke-width': 0 }
      });
    }

    if (headingChars.length) {
      gsap.set(headingChars, { opacity: 0, scale: 0.5, rotation: 0 });
    }

    if (paraLines.length) {
      gsap.set(paraLines, { y: '115%', opacity: 0 });
    }

    if (emailHeadingWords.length) {
      gsap.set(emailHeadingWords, { y: '105%', opacity: 0 });
    }

    if (emailLinks.length) {
      gsap.set(emailLinks, { opacity: 0, y: 18 });
    }

    if (contactSocials.length) {
      gsap.set(contactSocials, {
        opacity: 0,
        scale: 0.4,
        y: 20,
        transformOrigin: 'center center'
      });
    }

    if (contactImg) {
      gsap.set(contactImg, {
        opacity: 0,
        scale: 0.8,
        rotation: gsap.utils.random(-3, 3),
        transformOrigin: 'bottom center'
      });
    }

    gsap.set(contactPage, { backgroundColor: 'transparent' });
  }

  resetModalElements();

  // 3. Two26 Open Timeline Execution (Thick Orange Vector Wipe & Kinetic Entrance)
  function openContactModal() {
    if (isOpen) return;
    isOpen = true;

    // Lock body scroll and pause Lenis
    document.body.style.overflow = 'hidden';
    const lenis = getLenis();
    if (lenis && typeof lenis.stop === 'function') lenis.stop();

    contactPage.classList.add('is-active');
    contactPage.style.display = 'flex';
    contactPage.style.visibility = 'visible';
    contactPage.style.pointerEvents = 'auto';

    // Push URL hash without jumping/scrolling
    try {
      if (window.location.hash !== '#contact') {
        window.history.pushState({ modal: 'contact' }, 'Contact — YK.', '#contact');
      }
    } catch (e) {}

    resetModalElements();

    openTl = gsap.timeline();

    // Step 1: Signature Two26 S-Curve Transition Path Wipe (Stroke expands to 1600px to carpet the viewport in electric orange!)
    if (transitionPath) {
      const len = getPathLength();
      openTl.fromTo(
        transitionPath,
        {
          strokeDashoffset: len,
          strokeWidth: '0px',
          attr: { 'stroke-width': 0 }
        },
        {
          strokeDashoffset: 0,
          strokeWidth: '1600px',
          attr: { 'stroke-width': 1600 },
          duration: 0.88,
          ease: 'power2.inOut'
        },
        0
      );
    }

    // Solidify backdrop at peak stroke expansion so no corners can bleed
    openTl.set(contactPage, { backgroundColor: '#FF5400' }, 0.88);

    const contentStart = 0.42;

    // Step 2: Navbar Wordmark & Close Button Pop
    if (contactLogo) {
      openTl.to(
        contactLogo,
        {
          scale: 1,
          opacity: 1,
          duration: 0.65,
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
          duration: 0.7,
          ease: 'back.out(2.5)'
        },
        contentStart + 0.08
      );

      if (closeBtnText) {
        openTl.to(
          closeBtnText,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.6)'
          },
          contentStart + 0.18
        );
      }
    }

    // Step 3: Left Heading Characters Kinetic Pop-In with Random Tilt
    if (headingChars.length) {
      headingChars.forEach((char, idx) => {
        const randomTilt = gsap.utils.random(-6, 6);
        const charStart = contentStart + 0.12 + idx * 0.022;

        openTl.to(
          char,
          {
            opacity: 1,
            scale: 1.15,
            rotation: randomTilt,
            duration: 0.42,
            ease: 'back.out(2)'
          },
          charStart
        );

        openTl.to(
          char,
          {
            scale: 1,
            rotation: 0,
            duration: 0.55,
            ease: 'power2.out'
          },
          charStart + 0.38
        );
      });
    }

    // Step 4: Left Paragraph Lines Slide Up behind mask
    if (paraLines.length) {
      openTl.to(
        paraLines,
        {
          y: '0%',
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'back.out(1.4)'
        },
        contentStart + 0.28
      );
    }

    // Step 5: Right Email Heading Words & Email Links Slide Up
    if (emailHeadingWords.length) {
      openTl.to(
        emailHeadingWords,
        {
          y: '0%',
          opacity: 1,
          duration: 0.68,
          stagger: 0.05,
          ease: 'back.out(1.5)'
        },
        contentStart + 0.22
      );
    }

    if (emailLinks.length) {
      openTl.to(
        emailLinks,
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'back.out(1.5)'
        },
        contentStart + 0.32
      );
    }

    // Step 6: Social Pills Pop
    if (contactSocials.length) {
      openTl.to(
        contactSocials,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'back.out(2.5)'
        },
        contentStart + 0.42
      );
    }

    // Step 7: Illustration Pop (Two26 Studio signature bottom art)
    if (contactImg) {
      openTl.to(
        contactImg,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.75,
          ease: 'back.out(1.8)'
        },
        contentStart + 0.35
      );
    }
  }

  // 4. Two26 Close Timeline Execution (Reverse Wipe)
  function closeContactModal() {
    if (!isOpen) return;

    if (openTl) openTl.kill();

    const closeTl = gsap.timeline({
      onComplete: () => {
        contactPage.classList.remove('is-active');
        contactPage.style.display = 'none';
        contactPage.style.visibility = 'hidden';
        contactPage.style.pointerEvents = 'none';
        isOpen = false;
        document.body.style.overflow = '';
        const lenis = getLenis();
        if (lenis && typeof lenis.start === 'function') lenis.start();
        resetModalElements();
      }
    });

    // Make modal background transparent immediately so reverse stroke wipe shows smoothly
    closeTl.set(contactPage, { backgroundColor: 'transparent' }, 0);

    // Fade and slide content up
    closeTl.to(
      [closeBtn, contactContent, contactSocials, contactImg].filter(Boolean),
      {
        opacity: 0,
        y: -18,
        duration: 0.28,
        ease: 'power2.in'
      },
      0
    );

    if (contactLogo) {
      closeTl.to(
        contactLogo,
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.28,
          ease: 'power2.in'
        },
        0
      );
    }

    // Reverse SVG transition stroke wipe
    if (transitionPath) {
      const len = getPathLength();
      closeTl.to(
        transitionPath,
        {
          strokeDashoffset: len,
          strokeWidth: '0px',
          attr: { 'stroke-width': 0 },
          duration: 0.45,
          ease: 'power2.in'
        },
        0.08
      );
    }

    // Restore URL hash
    try {
      if (window.location.hash === '#contact') {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {}
  }

  // Export functions globally immediately
  window.openTwo26ContactModal = openContactModal;
  window.closeTwo26ContactModal = closeContactModal;

  // 5. Global Capturing Event Listener for all "Get in Touch" / "Let's Talk" triggers
  document.addEventListener(
    'click',
    (e) => {
      const trigger = e.target.closest(
        '.nav-cta-btn, [data-contact-trigger], .btn-try-contact, a[href="#contact"], a[href*="contact"]'
      );
      if (
        trigger &&
        !trigger.closest('.contact-page') &&
        !trigger.classList.contains('close-btn') &&
        !trigger.hasAttribute('data-contact-close')
      ) {
        e.preventDefault();
        e.stopPropagation();
        openContactModal();
      }
    },
    true // Capturing phase guarantees instant interception
  );

  // Direct click listeners for extra robustness
  const directTriggers = document.querySelectorAll(
    '.nav-cta-btn, [data-contact-trigger], .btn-try-contact, a[href="#contact"], a[href*="contact"]'
  );
  directTriggers.forEach((trigger) => {
    if (!trigger.closest('.contact-page')) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openContactModal();
      });
    }
  });

  // Close Button handler
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeContactModal();
    });
  }

  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeContactModal();
    }
  });

  // Browser Back/Forward navigation support
  window.addEventListener('popstate', () => {
    if (isOpen && window.location.hash !== '#contact') {
      closeContactModal();
    } else if (!isOpen && window.location.hash === '#contact') {
      openContactModal();
    }
  });

  // Check if page loaded with #contact in URL
  if (window.location.hash === '#contact') {
    setTimeout(openContactModal, 350);
  }
}
