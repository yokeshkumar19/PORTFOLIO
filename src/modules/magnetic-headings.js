import gsap from 'gsap';

export function initMagneticHeadings() {
  const headingWrappers = Array.from(document.querySelectorAll('.hero-heading-wrapper, .section-heading-wrapper'));

  headingWrappers.forEach((headingWrapper) => {
    const primaryHeading = headingWrapper.querySelector('.heading-hero, .section-heading:not(.orange)');
    const orangeHeading = headingWrapper.querySelector('.heading-hero-orange, .section-heading.orange');
    if (!orangeHeading) return;

    // 1. Ensure absolute layering so orange heading sits directly behind main heading
    headingWrapper.style.position = 'relative';

    if (primaryHeading) {
      primaryHeading.style.position = 'relative';
      primaryHeading.style.zIndex = '2';
      primaryHeading.style.pointerEvents = 'none';
    }

    orangeHeading.style.position = 'absolute';
    orangeHeading.style.top = '0';
    orangeHeading.style.left = '0';
    orangeHeading.style.width = '100%';
    orangeHeading.style.height = '100%';
    orangeHeading.style.zIndex = '1';
    orangeHeading.style.pointerEvents = 'none';
    orangeHeading.style.margin = '0';
    orangeHeading.style.willChange = 'transform';

    // 2. Continuous Directional Tracking (1-4px offset matching Two26 Studio exact physics)
    const hoverZone = headingWrapper.closest('section') || headingWrapper.parentElement || headingWrapper;
    const MAX_OFFSET = 4;

    const handlePointerMove = (e) => {
      const rect = headingWrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const distance = Math.hypot(dx, dy);
      const maxRadius = Math.max(rect.width, rect.height) / 2 || 100;

      // Normalized intensity based on distance from center (1px to 4px)
      const intensity = Math.min(1, Math.max(0.25, distance / maxRadius));
      const angle = Math.atan2(dy, dx);

      const targetX = Math.cos(angle) * (intensity * MAX_OFFSET);
      const targetY = Math.sin(angle) * (intensity * MAX_OFFSET);

      gsap.to(orangeHeading, {
        x: targetX,
        y: targetY,
        duration: 0.2,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    };

    const handlePointerLeave = () => {
      gsap.to(orangeHeading, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto'
      });
    };

    hoverZone.addEventListener('pointermove', handlePointerMove, { passive: true });
    hoverZone.addEventListener('pointerleave', handlePointerLeave);
  });
}
