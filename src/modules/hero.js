import gsap from 'gsap';

export function playHeroEntrance() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set('.hero-meta-label, .heading-hero, .heading-hero-orange, .hero-supporting-text, .hero-cta-group, .hero-pill, .hero-line, .hero-pill-text', {
      opacity: 1,
      y: 0,
      scale: 1
    });
    return;
  }

  const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // 1. Meta label entrance
  heroTl.fromTo('.hero-meta-label',
    { y: -18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    0
  );

  // 2. Line-by-Line Heading Mask Reveal (Exact Two26 Studio parameters)
  const lines = Array.from(document.querySelectorAll('.heading-hero .hero-line, .heading-hero-orange .hero-line'));
  if (lines.length) {
    gsap.set(lines, { y: '115%', opacity: 0 });
    heroTl.to(
      lines,
      {
        y: '0%',
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: 'back.out(1.4)'
      },
      0.08
    );
  } else {
    heroTl.fromTo('.heading-hero, .heading-hero-orange',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'back.out(1.4)' },
      0.08
    );
  }

  // 3. Floating Interactive Pills – shell pops in, inner text slides up from mask
  const pills = Array.from(document.querySelectorAll('.section-hero .hero-pill'));
  pills.forEach((pill, i) => {
    const pillText = pill.querySelector('.hero-pill-text');
    const pillStart = 0.22 + i * 0.14;

    // Phase 1: Pill shell pops in with bouncy spring
    heroTl.fromTo(
      pill,
      { opacity: 0, scale: 0.4, y: 22 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.55,
        ease: 'back.out(2.5)'
      },
      pillStart
    );

    // Phase 2: Inner text slides up from mask
    if (pillText) {
      heroTl.fromTo(
        pillText,
        { y: '105%', opacity: 0 },
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

  // 4. Supporting text slide & fade
  heroTl.fromTo('.hero-supporting-text',
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
    0.45
  );

  // 5. Two26 CTA Buttons pop-in
  heroTl.fromTo('.hero-cta-group .cta-btn',
    { scale: 0.85, opacity: 0, y: 22 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: 'back.out(2)'
    },
    0.6
  );
}

export function initHeroInteractive() {
  // Ensure pill texts are wrapped in .hero-pill-text-mask if not done in markup
  const pills = document.querySelectorAll('.section-hero .hero-pill');
  pills.forEach((pill) => {
    const textEl = pill.querySelector('.hero-pill-text');
    if (textEl && !textEl.closest('.hero-pill-text-mask')) {
      const mask = document.createElement('span');
      mask.className = 'hero-pill-text-mask';
      textEl.parentNode.insertBefore(mask, textEl);
      mask.appendChild(textEl);
    }
  });
}
