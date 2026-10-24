import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis-scroll.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * TWO 26 SIGNATURE KINETIC THREAD LOADER
 * "A glowing thread sweeps in, draws YK., and goes"
 */
export function initPreloader(onComplete) {
  const loader = document.getElementById('thread-loader');
  const path = document.getElementById('thread-yk-path');
  const beacon = document.getElementById('thread-dot-beacon');

  if (!loader || !path) {
    document.body.style.overflow = '';
    const lenis = getLenis();
    if (lenis) lenis.resize();
    ScrollTrigger.refresh();
    if (onComplete) onComplete();
    return;
  }

  // Accessibility: skip animation if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loader.style.display = 'none';
    loader.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    const lenis = getLenis();
    if (lenis) lenis.resize();
    ScrollTrigger.refresh();
    if (onComplete) onComplete();
    return;
  }

  // Prevent background scrolling while thread is drawing
  document.body.style.overflow = 'hidden';

  // Calculate precise path length for accurate stroke-dash animation
  let totalLen = 2454;
  let lenYK = 1847;

  try {
    if (typeof path.getTotalLength === 'function') {
      const measuredTotal = path.getTotalLength();
      if (measuredTotal && measuredTotal > 500) {
        totalLen = measuredTotal;
      }
    }

    // Path portion up to the dot '.'
    const dYK = 'M -100 220 C 50 220, 200 160, 340 140 L 410 220 L 480 140 L 410 220 L 410 310 C 410 335, 450 340, 490 330 C 520 325, 530 300, 530 260 L 530 140 L 530 310 L 530 225 L 605 140 L 530 225 L 610 310 C 625 320, 635 315, 645 305 A 8 8 0 1 1 645 304';
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', dYK);
    if (path.ownerSVGElement) {
      tempPath.style.display = 'none';
      path.ownerSVGElement.appendChild(tempPath);
      const measuredYK = tempPath.getTotalLength();
      if (measuredYK && measuredYK > 500) {
        lenYK = measuredYK;
      }
      path.ownerSVGElement.removeChild(tempPath);
    }
  } catch (e) {
    totalLen = 2454;
    lenYK = 1847;
  }

  const exitLen = Math.max(0, totalLen - lenYK);

  // Initialize stroke state: completely hidden off the start
  path.style.strokeDasharray = `${totalLen} ${totalLen}`;
  path.style.strokeDashoffset = `${totalLen}`;
  gsap.set(path, { strokeDashoffset: totalLen });

  if (beacon) {
    gsap.set(beacon, { scale: 0, opacity: 0 });
  }

  // Master timeline for: Come in -> Draw YK. -> Glow -> Fly away -> Wipe up
  const tl = gsap.timeline({
    delay: 0.1,
    onComplete: () => {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
      document.body.style.overflow = '';
      const lenis = getLenis();
      if (lenis) lenis.resize();
      ScrollTrigger.refresh();
      if (onComplete) onComplete();
    }
  });

  // 1. Thread comes flying in from the left and draws "YK." (fluid 1.15s)
  tl.to(path, {
    strokeDashoffset: exitLen,
    duration: 1.15,
    ease: 'power2.inOut'
  });

  // 2. As the thread completes the dot, burst the glowing beacon
  if (beacon) {
    tl.to(
      beacon,
      {
        scale: 1.25,
        opacity: 1,
        duration: 0.22,
        ease: 'back.out(2)'
      },
      '-=0.2'
    );
    tl.to(
      beacon,
      {
        scale: 1,
        duration: 0.12,
        ease: 'power1.out'
      }
    );
  }

  // 3. Artistic hold where user clearly admires the drawn "YK." monogram
  tl.to({}, { duration: 0.3 });

  // 4. Thread accelerates away off-screen to the right ("and goes")
  if (beacon) {
    tl.to(
      beacon,
      {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      },
      '+=0.02'
    );
  }

  tl.to(
    path,
    {
      strokeDashoffset: -totalLen,
      duration: 0.65,
      ease: 'power2.in'
    },
    '<'
  );

  // 5. As the thread exits, the dark curtain wipes up smoothly into the portfolio
  tl.to(
    loader,
    {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut'
    },
    '-=0.35'
  );
}
