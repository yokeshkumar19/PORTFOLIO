import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollReveals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // Respect reduced motion preferences
  }

  // 1. Section Dividers Reveal (Width & Opacity Animation)
  const dividers = document.querySelectorAll('.section-divider-line');
  dividers.forEach((divider) => {
    gsap.fromTo(divider,
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1,
        opacity: 0.6,
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: divider,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 2. Section Headings & Labels Reveal (Smooth upward movement from below)
  const headings = document.querySelectorAll('.section-heading, .section-label, .contact-heading-text');
  headings.forEach((el) => {
    gsap.fromTo(el,
      { y: 38, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 3. Supporting Paragraphs (Fade in and slight upward movement)
  const paragraphs = document.querySelectorAll('.about-sub-para, .contact-supporting-text, .projects-panel-desc');
  paragraphs.forEach((p) => {
    gsap.fromTo(p,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 4. Process Cards Stagger Reveal
  const processCards = document.querySelectorAll('.process-card');
  if (processCards.length) {
    gsap.fromTo(processCards,
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 5. Contact Action Buttons Stagger Reveal
  const contactLinks = document.querySelectorAll('.contact-action-btn');
  if (contactLinks.length) {
    gsap.fromTo(contactLinks,
      { y: 25, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.contact-links-row',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 6. Subtle Scroll Scrub Parallax on Decorative Hero Line Accent
  const heroLine = document.querySelector('.hero-line-accent');
  if (heroLine) {
    gsap.to(heroLine, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }
}
