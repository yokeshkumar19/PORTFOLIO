import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis-scroll.js';

gsap.registerPlugin(ScrollTrigger);

export function initProjectsSection(projectsData) {
  const cards = Array.from(document.querySelectorAll('.project-card'));
  const trackerItems = document.querySelectorAll('.tracker-item');
  const isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // 1. Interactive Tracker Item Clicking
  trackerItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetCard = cards[index];
      const targetEl = targetCard?.parentElement?.classList.contains('project-card-clip-mask')
        ? targetCard.parentElement
        : targetCard;
      if (targetEl) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -90, duration: 1.1 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  function setActiveTracker(index) {
    trackerItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  // 2. Exact Two26 Studio 3D Clip-Mask Reveal Animation
  cards.forEach((card, index) => {
    // A. Wrap card in .project-card-clip-mask container
    let maskWrapper = card.parentElement;
    if (!maskWrapper.classList.contains('project-card-clip-mask')) {
      maskWrapper = document.createElement('div');
      maskWrapper.className = 'project-card-clip-mask';
      card.parentNode.insertBefore(maskWrapper, card);
      maskWrapper.appendChild(card);
    }

    if (!isReducedMotion) {
      // Two26 Studio Exact Initial State:
      // Inset mask starts contracted with rounded radius
      gsap.set(maskWrapper, {
        clipPath: 'inset(26% 26% 26% 26%)',
        webkitClipPath: 'inset(26% 26% 26% 26%)',
        borderRadius: '36px',
        overflow: 'hidden',
        willChange: 'clip-path, border-radius',
      });

      // Card starts scaled up with 3D perspective tilt
      const horizontalTilt = index % 2 === 0 ? -12 : 12;
      const zTilt = index % 2 === 0 ? -3 : 3;

      gsap.set(card, {
        scale: isMobile ? 1.15 : 1.35,
        rotationX: isMobile ? 8 : 18,
        rotationY: isMobile ? (index % 2 === 0 ? -4 : 4) : horizontalTilt,
        rotation: isMobile ? 0 : zTilt,
        transformPerspective: 900,
        transformOrigin: 'center center',
        willChange: 'transform',
      });

      // Two26 Studio Exact Scroll Animation
      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: maskWrapper,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });

      cardTl.to(
        maskWrapper,
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          webkitClipPath: 'inset(0% 0% 0% 0%)',
          borderRadius: '1.5em',
          duration: 1.25,
          ease: 'power3.out',
        },
        0
      );

      cardTl.to(
        card,
        {
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          rotation: 0,
          duration: 1.25,
          ease: 'power3.out',
        },
        0
      );

      // Card image subtle parallax scrub
      const visualImg = card.querySelector('.project-card-visual img');
      if (visualImg) {
        gsap.to(visualImg, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: maskWrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }

    // ScrollTrigger to highlight the sticky sidebar tracker
    ScrollTrigger.create({
      trigger: maskWrapper,
      start: 'top 48%',
      end: 'bottom 48%',
      onEnter: () => setActiveTracker(index),
      onEnterBack: () => setActiveTracker(index),
    });

    // Two26 Arrow Elastic Hover Interaction
    const arrow = card.querySelector('.project-action-arrow');
    if (arrow) {
      const arrowTl = gsap.timeline({ paused: true });
      arrowTl
        .to(arrow, { rotation: -45, duration: 0.25, ease: 'power2.out' })
        .to(arrow, { rotation: 0, duration: 0.65, ease: 'elastic.out(1.15, 0.35)' });

      card.addEventListener('mouseenter', () => arrowTl.restart());
    }

    // Case Study Navigation / Modal Trigger
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const projId = card.getAttribute('data-project-id');
      if (projId === 'rit-bustrack') {
        window.location.href = '/rit-bustrack.html';
        return;
      }
      if (projId === 'plantcare-ai') {
        window.location.href = '/plantcare-ai.html';
        return;
      }
      const projData = projectsData?.find((p) => p.id === projId);
      if (projData) {
        openCaseStudyModal(projData);
      }
    });
  });

  // 3. Case Study Modal
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  function openCaseStudyModal(proj) {
    if (!modal) return;

    const titleEl = document.getElementById('modal-title');
    const catEl = document.getElementById('modal-category');
    const badgeEl = document.getElementById('modal-status-badge');
    const roleEl = document.getElementById('modal-role');
    const statusTextEl = document.getElementById('modal-status-text');
    const timelineEl = document.getElementById('modal-timeline');
    const previewImgEl = document.getElementById('modal-preview-img');
    const challengeEl = document.getElementById('modal-challenge');
    const solutionEl = document.getElementById('modal-solution');
    const techStackEl = document.getElementById('modal-tech-stack');

    if (titleEl) titleEl.textContent = proj.name;
    if (catEl) catEl.textContent = proj.category;
    if (badgeEl) {
      badgeEl.innerHTML = `<span class="status-pill ${proj.statusType}"><span class="beacon"></span>${proj.status}</span>`;
    }
    if (roleEl) roleEl.textContent = proj.role || 'Design & Development';
    if (statusTextEl) statusTextEl.textContent = proj.status;
    if (timelineEl) timelineEl.textContent = proj.timeline || 'Active';
    if (previewImgEl) {
      previewImgEl.src = proj.coverImage;
      previewImgEl.alt = proj.name;
    }
    if (challengeEl) challengeEl.textContent = proj.challenge || '';
    if (solutionEl) solutionEl.textContent = proj.solution || '';

    if (techStackEl) {
      const allPills = [...(proj.techStack || []), ...(proj.deliverables || [])];
      techStackEl.innerHTML = allPills
        .map((t) => `<span class="chip-btn">${t}</span>`)
        .join('');
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    gsap.fromTo(modal.querySelector('.modal-content'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
    );
  }

  function closeCaseStudyModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCaseStudyModal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      closeCaseStudyModal();
    }
  });
}
