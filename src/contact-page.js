import './style.css';
import gsap from 'gsap';
import { initCustomCursor } from './modules/cursor.js';

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();

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

  // Split Headings
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

  // Split Paras
  let paraLines = [];
  contactParas.forEach((para) => {
    const raw = para.innerHTML.trim();
    para.innerHTML = `<span class="contact-para-line-mask" style="display:block; overflow:hidden;"><span class="contact-para-line" style="display:block;">${raw}</span></span>`;
    paraLines = paraLines.concat(Array.from(para.querySelectorAll('.contact-para-line')));
  });

  // Split Email Headings
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

  // Split Email Links with Hover
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

  // Set initial invisible states
  gsap.set(contactPage, { display: 'flex', visibility: 'visible', pointerEvents: 'auto', backgroundColor: 'transparent' });
  if (contactLogo) gsap.set(contactLogo, { scale: 0, opacity: 0, transformOrigin: 'center center' });
  if (closeBtn) gsap.set(closeBtn, { opacity: 0, scale: 0.4, y: 20, transformOrigin: 'center center' });
  if (closeBtnText) gsap.set(closeBtnText, { opacity: 0, y: 15, display: 'inline-block' });
  if (headingChars.length) gsap.set(headingChars, { opacity: 0, scale: 0.5, rotation: 0 });
  if (paraLines.length) gsap.set(paraLines, { y: '115%', opacity: 0 });
  if (emailHeadingWords.length) gsap.set(emailHeadingWords, { y: '105%', opacity: 0 });
  if (emailLinks.length) gsap.set(emailLinks, { opacity: 0, y: 18 });
  if (contactSocials.length) gsap.set(contactSocials, { opacity: 0, scale: 0.4, y: 20, transformOrigin: 'center center' });
  if (contactImg) gsap.set(contactImg, { opacity: 0, scale: 0.8, rotation: gsap.utils.random(-3, 3), transformOrigin: 'bottom center' });

  const totalLen = 3500;
  if (transitionPath) {
    gsap.set(transitionPath, {
      strokeDasharray: totalLen,
      strokeDashoffset: totalLen,
      strokeWidth: '0px',
      attr: { 'stroke-width': 0 }
    });
  }

  // Play Two26 Entrance Animation
  const openTl = gsap.timeline();

  if (transitionPath) {
    openTl.fromTo(
      transitionPath,
      { strokeDashoffset: totalLen, strokeWidth: '0px', attr: { 'stroke-width': 0 } },
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

  openTl.set(contactPage, { backgroundColor: '#FF5400' }, 0.88);

  const contentStart = 0.42;

  if (contactLogo) {
    openTl.to(contactLogo, { scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(2.2)' }, contentStart);
  }

  if (closeBtn) {
    openTl.to(closeBtn, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(2.5)' }, contentStart + 0.08);
    if (closeBtnText) {
      openTl.to(closeBtnText, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }, contentStart + 0.18);
    }
  }

  if (headingChars.length) {
    headingChars.forEach((char, idx) => {
      const randomTilt = gsap.utils.random(-6, 6);
      const charStart = contentStart + 0.12 + idx * 0.022;
      openTl.to(char, { opacity: 1, scale: 1.15, rotation: randomTilt, duration: 0.42, ease: 'back.out(2)' }, charStart);
      openTl.to(char, { scale: 1, rotation: 0, duration: 0.55, ease: 'power2.out' }, charStart + 0.38);
    });
  }

  if (paraLines.length) {
    openTl.to(paraLines, { y: '0%', opacity: 1, duration: 0.85, stagger: 0.1, ease: 'back.out(1.4)' }, contentStart + 0.28);
  }

  if (emailHeadingWords.length) {
    openTl.to(emailHeadingWords, { y: '0%', opacity: 1, duration: 0.68, stagger: 0.05, ease: 'back.out(1.5)' }, contentStart + 0.22);
  }

  if (emailLinks.length) {
    openTl.to(emailLinks, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'back.out(1.5)' }, contentStart + 0.32);
  }

  if (contactSocials.length) {
    openTl.to(contactSocials, { opacity: 1, scale: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'back.out(2.5)' }, contentStart + 0.42);
  }

  if (contactImg) {
    openTl.to(contactImg, { opacity: 1, scale: 1, rotation: 0, duration: 0.75, ease: 'back.out(1.8)' }, contentStart + 0.35);
  }

  // Close Handler (Navigate back to index.html with reverse wipe)
  function handleClose() {
    gsap.set(contactPage, { backgroundColor: 'transparent' });
    const closeTl = gsap.timeline({
      onComplete: () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/index.html';
        }
      }
    });

    closeTl.to([closeBtn, contactContent, contactSocials, contactImg].filter(Boolean), {
      opacity: 0,
      y: -18,
      duration: 0.28,
      ease: 'power2.in'
    }, 0);

    if (contactLogo) {
      closeTl.to(contactLogo, { opacity: 0, scale: 0.85, duration: 0.28, ease: 'power2.in' }, 0);
    }

    if (transitionPath) {
      closeTl.to(transitionPath, {
        strokeDashoffset: totalLen,
        strokeWidth: '0px',
        attr: { 'stroke-width': 0 },
        duration: 0.45,
        ease: 'power2.in'
      }, 0.08);
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleClose();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  });
});
