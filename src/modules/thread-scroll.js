import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function getPathLength(path, fallback) {
  let len = 0;
  try {
    len = path && path.getTotalLength ? path.getTotalLength() : 0;
  } catch (e) {
    len = 0;
  }
  return len > 100 ? len : fallback;
}

export function playHeroThreadsEntrance() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroPaths = [
      document.getElementById('hero-path-left'),
      document.getElementById('hero-path-right')
    ].filter(Boolean);
    heroPaths.forEach(p => { p.style.strokeDashoffset = '0'; });
    return;
  }

  const heroPathLeft = document.getElementById('hero-path-left');
  const heroPathRight = document.getElementById('hero-path-right');
  const heroPaths = [heroPathLeft, heroPathRight].filter(Boolean);

  if (heroPaths.length) {
    gsap.to(heroPaths, {
      strokeDashoffset: 0,
      duration: 1.5,
      stagger: 0.18,
      ease: 'power2.out',
      delay: 0.2
    });
  }
}

export function initThreadScroll() {
  const section = document.querySelector('.section-process');
  const servicesBody = document.getElementById('services-body') || section;
  if (!section || !servicesBody) return;

  const desktopDarkPath = document.getElementById('process-thread-desktop');
  const mobileDarkPath = document.getElementById('process-thread-mobile');
  const heroPathLeft = document.getElementById('hero-path-left');
  const heroPathRight = document.getElementById('hero-path-right');
  const isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Setup Hero Decorative Threads
  if (heroPathLeft) {
    const len = getPathLength(heroPathLeft, 1175);
    heroPathLeft.style.strokeDasharray = `${len} ${len}`;
    heroPathLeft.style.strokeDashoffset = `${len}`;
  }
  if (heroPathRight) {
    const len = getPathLength(heroPathRight, 1425);
    heroPathRight.style.strokeDasharray = `${len} ${len}`;
    heroPathRight.style.strokeDashoffset = `${len}`;
  }

  // Hero Threads Parallax on scroll
  if (heroPathLeft || heroPathRight) {
    ScrollTrigger.create({
      trigger: '.section-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        if (heroPathLeft) {
          gsap.set('.hero-path-svg-left', { y: -130 * p, rotation: 10 * p });
        }
        if (heroPathRight) {
          gsap.set('.hero-path-svg-right', { y: -95 * p, rotation: -8 * p });
        }
      }
    });
  }

  // 2. Setup Process Scrubbed Thread Paths
  let desktopLen = 6535;
  if (desktopDarkPath) {
    desktopDarkPath.style.strokeLinecap = 'round';
    desktopDarkPath.style.strokeLinejoin = 'round';
    desktopLen = getPathLength(desktopDarkPath, 6535);
    desktopDarkPath.style.strokeDasharray = `${desktopLen} ${desktopLen}`;
    desktopDarkPath.style.strokeDashoffset = `${desktopLen}`;
  }

  let mobileLen = 2885;
  if (mobileDarkPath) {
    mobileDarkPath.style.strokeLinecap = 'round';
    mobileDarkPath.style.strokeLinejoin = 'round';
    mobileLen = getPathLength(mobileDarkPath, 2885);
    mobileDarkPath.style.strokeDasharray = `${mobileLen} ${mobileLen}`;
    mobileDarkPath.style.strokeDashoffset = `${mobileLen}`;
  }

  // 3. Setup Step Layers (Icons & Floating Pills)
  const layers = Array.from(section.querySelectorAll('.services-layers .service-layer'));
  layers.forEach((layer) => {
    const block = layer.querySelector('.service-block') || layer;
    const centerSvg = block.querySelector('.service-svg');
    const paraWrapper = block.querySelector('.service-block-para-wrapper');

    if (centerSvg) {
      centerSvg.style.transformOrigin = 'center center';
      centerSvg.style.willChange = 'transform, opacity';
      if (!isReducedMotion) {
        gsap.set(centerSvg, {
          scale: 0.2,
          rotation: -40,
          opacity: 0
        });
      }
    }

    if (paraWrapper) {
      paraWrapper.style.transformOrigin = 'center center';
      paraWrapper.style.willChange = 'transform, opacity';
      if (!isReducedMotion) {
        gsap.set(paraWrapper, {
          scale: 0,
          rotation: 0,
          opacity: 0
        });
      }
    }
  });

  if (isReducedMotion) {
    if (desktopDarkPath) desktopDarkPath.style.strokeDashoffset = '0';
    if (mobileDarkPath) mobileDarkPath.style.strokeDashoffset = '0';
    return;
  }

  // 4. Two26 Studio Exact Master Process Thread Scrub Timeline
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: servicesBody,
      start: 'top 70%',
      end: 'bottom 65%',
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  // A. Thread draws from 0% to 100% across the full scroll duration
  if (desktopDarkPath) {
    masterTl.to(desktopDarkPath, {
      strokeDashoffset: 0,
      ease: 'none',
      duration: 1
    }, 0);
  }

  if (mobileDarkPath) {
    masterTl.to(mobileDarkPath, {
      strokeDashoffset: 0,
      ease: 'none',
      duration: 1
    }, 0);
  }

  // B. Exact Arc-Length Proximity Milestones for the 4 Process Loops
  // Calculated from the authentic Two26 Studio Bezier curve geometry:
  // Step 01 (Discover): ~16% along curve
  // Step 02 (Design):   ~40% along curve
  // Step 03 (Build):    ~63% along curve
  // Step 04 (Refine):   ~84% along curve
  const loopMilestones = [0.16, 0.40, 0.63, 0.84];
  const stepDuration = 0.14;

  layers.forEach((layer, index) => {
    const block = layer.querySelector('.service-block') || layer;
    const num = block.querySelector('.service-step-num');
    const centerSvg = block.querySelector('.service-svg');
    const paraWrapper = block.querySelector('.service-block-para-wrapper');

    const startTime = loopMilestones[index] !== undefined ? loopMilestones[index] : index * 0.25;

    // Pop in icon badge with authentic Two26 elastic bounce
    if (centerSvg) {
      masterTl.to(centerSvg, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: stepDuration,
        ease: 'back.out(3.5)'
      }, startTime);
    }

    // Pop in floating pill with playful alternating angle
    if (paraWrapper) {
      masterTl.to(paraWrapper, {
        scale: 1,
        rotation: index % 2 === 0 ? -5 : 4,
        opacity: 1,
        duration: stepDuration,
        ease: 'back.out(3.5)'
      }, startTime + 0.02);
    }

    // Subtle punch on step number
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

  // C. End Bead activation when thread terminates
  const endBead = document.getElementById('process-thread-end');
  if (endBead) {
    masterTl.fromTo(endBead,
      { scale: 0.9, opacity: 0.6 },
      { scale: 1.25, opacity: 1, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' },
      0.94
    );
  }
}
