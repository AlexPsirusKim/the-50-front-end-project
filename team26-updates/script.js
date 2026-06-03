// ===== Intersection Observer for Scroll Animations =====
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.feature-card, .overview-card, .key-stats, .partnerships-box, .scale-box'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation for cards within the same parent
          const parent = entry.target.parentElement;
          const siblings = Array.from(parent.querySelectorAll('.feature-card, .overview-card'));
          const siblingIndex = siblings.indexOf(entry.target);
          const delay = siblingIndex >= 0 ? siblingIndex * 80 : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // ===== Sticky Nav Active Section Tracking =====
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const nav = document.getElementById('stickyNav');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');

            // Auto-scroll nav to keep active link visible
            const navInner = document.querySelector('.nav-inner');
            const linkLeft = link.offsetLeft;
            const linkWidth = link.offsetWidth;
            const navWidth = navInner.offsetWidth;
            const scrollLeft = navInner.scrollLeft;

            if (linkLeft < scrollLeft || linkLeft + linkWidth > scrollLeft + navWidth) {
              navInner.scrollTo({
                left: linkLeft - navWidth / 2 + linkWidth / 2,
                behavior: 'smooth',
              });
            }
          }
        });
      }
    });

    // Add shadow on scroll
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 100);
    }
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ===== Smooth scroll for nav links =====
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
});
