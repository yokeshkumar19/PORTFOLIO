import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAboutPinned() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const section = document.querySelector('.section-about');
  if (!section) return;

  const aboutPara = section.querySelector('.about-para');
  const pills = Array.from(section.querySelectorAll('.about-pill'));
  if (!aboutPara) return;

  // Responsive scroll distance calculation matching Two26 Studio
  const getPinDistance = () => {
    const width = window.innerWidth;
    if (width < 480) return 900;
    if (width < 992) return 1300;
    return 1800;
  };

  // 1. Hardware acceleration & anti-blur
  gsap.set(section, {
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    force3D: true,
  });

  // 2. Split Text into individual characters
  const rawText = aboutPara.textContent.trim();
  aboutPara.innerHTML = rawText
    .split('')
    .map((c) => {
      if (c === ' ') {
        return '<span class="about-char space" style="display:inline-block; width:0.3em;">&nbsp;</span>';
      }
      return `<span class="about-char" style="display:inline-block;">${c}</span>`;
    })
    .join('');

  const chars = Array.from(aboutPara.querySelectorAll('.about-char:not(.space)'));
  if (!chars.length) return;

  // 3. Set Initial State
  // Chars start with muted accent color
  gsap.set(chars, {
    color: 'rgba(255, 84, 0, 0.32)',
    scale: 1,
    rotation: 0,
    display: 'inline-block',
    transformOrigin: 'center center',
    textShadow: '0px 0px 0px rgba(255,84,0,0)',
    willChange: 'transform, color',
    backfaceVisibility: 'hidden',
  });

  // Pills start hidden and scaled down
  if (pills.length) {
    gsap.set(pills, {
      opacity: 0,
      scale: 0.6,
      y: 24,
      transformOrigin: 'center center',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
    });
  }

  // 4. Create Responsive Scrubbed Pinned Timeline (Two26 Studio Signature Wave)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${getPinDistance()}`,
      pin: section,
      pinSpacing: true,
      scrub: window.innerWidth < 992 ? 0.6 : 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      preventOverlaps: true,
    },
  });

  const totalChars = chars.length;
  const letterAnimSpan = 70; // 0 to 70% of timeline

  chars.forEach((char, i) => {
    const startTime = (i / totalChars) * letterAnimSpan;

    // Stage 1: Scale 1.15, Random ±4 deg tilt, Glowing Electric Orange #FF5400
    tl.to(
      char,
      {
        color: '#FF5400',
        scale: 1.15,
        rotation: () => gsap.utils.random(-4, 4),
        textShadow: '0.6px 0.6px 0 #FF5400, -0.6px -0.6px 0 #FF5400',
        duration: 3.5,
        ease: 'power1.out',
      },
      startTime
    );

    // Stage 2: Settle to normal scale 1, 0 deg, full text color
    tl.to(
      char,
      {
        color: 'var(--text-main)',
        scale: 1,
        rotation: 0,
        textShadow: '0px 0px 0px rgba(0,0,0,0)',
        duration: 3.5,
        ease: 'power1.inOut',
      },
      startTime + 3.5
    );
  });

  // 5. Pop-in Pills at milestones matching Two26 Studio
  pills.forEach((pill, idx) => {
    const milestone = 30 + (idx / Math.max(1, pills.length - 1)) * 55;
    tl.to(
      pill,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 5,
        ease: 'back.out(2)',
      },
      milestone
    );
  });
}
