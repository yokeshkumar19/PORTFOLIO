import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initLenisScroll() {
  const isTouch = matchMedia('(pointer: coarse)').matches;

  lenisInstance = new Lenis({
    duration: isTouch ? 0.9 : 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: isTouch ? 1.0 : 1.5,
    infinite: false,
    syncTouch: false, // Prevents fighting native touch scrolling on iOS & Android
  });

  window.lenis = lenisInstance;

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}
