import gsap from 'gsap';

export function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor || matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      cursor.classList.add('is-active');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-active');
    isMoving = false;
  });

  function render() {
    // Smooth lerp
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Attach hover state triggers
  const interactiveTargets = document.querySelectorAll('a, button, input, textarea, .chip-btn, .faq-ques');
  interactiveTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });

  // Project & Screenshot cards trigger "VIEW" badge
  const projectCards = document.querySelectorAll('.project-card, .screenshot-item-card, .mobile-device-frame');
  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cursor.textContent = 'VIEW';
      cursor.classList.add('cursor-view');
    });
    card.addEventListener('mouseleave', () => {
      cursor.textContent = '';
      cursor.classList.remove('cursor-view');
    });
  });

  // Showcase slider triggers "DRAG" badge
  const showcaseSlider = document.querySelector('.section-slider-wrapper');
  if (showcaseSlider) {
    showcaseSlider.addEventListener('mouseenter', () => {
      cursor.textContent = 'DRAG';
      cursor.classList.add('cursor-drag');
    });
    showcaseSlider.addEventListener('mouseleave', () => {
      cursor.textContent = '';
      cursor.classList.remove('cursor-drag');
    });
  }
}
