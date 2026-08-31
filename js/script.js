/* HomeFinder Realty — shared behaviour */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.site-header');
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      header.classList.toggle('is-open');
      toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', header.classList.contains('is-open'));
    });
    header.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('is-open');
        toggle.classList.remove('is-open');
      });
    });
  }

  /* ---------- Hero image slider ---------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots button');
  if (slides.length) {
    let current = 0;
    let timer;

    const show = (index) => {
      slides.forEach(s => s.classList.remove('is-active'));
      dots.forEach(d => d.classList.remove('is-active'));
      slides[index].classList.add('is-active');
      if (dots[index]) dots[index].classList.add('is-active');
      current = index;
    };

    const next = () => show((current + 1) % slides.length);

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { show(i); restart(); });
    });

    show(0);
    restart();
  }

  /* ---------- Scroll reveal (single pass, respects reduced motion) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Listings filter (listings.html only) ---------- */
  const filterForm = document.querySelector('.filter-bar');
  const cards = document.querySelectorAll('[data-card]');
  const resultsCount = document.querySelector('.results-count');
  const noResults = document.querySelector('.no-results');

  if (filterForm && cards.length) {
    const typeSel = document.getElementById('filter-type');
    const locSel = document.getElementById('filter-location');
    const bedsSel = document.getElementById('filter-beds');
    const priceSel = document.getElementById('filter-price');

    const applyFilters = () => {
      const type = typeSel.value;
      const loc = locSel.value;
      const beds = bedsSel.value;
      const price = priceSel.value;
      let visible = 0;

      cards.forEach(card => {
        const matchType = type === 'all' || card.dataset.type === type;
        const matchLoc = loc === 'all' || card.dataset.location === loc;
        const matchBeds = beds === 'all' || Number(card.dataset.beds) >= Number(beds);
        const matchPrice = price === 'all' || Number(card.dataset.price) <= Number(price);
        const match = matchType && matchLoc && matchBeds && matchPrice;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (resultsCount) {
        resultsCount.textContent = visible === 1
          ? '1 property found'
          : `${visible} properties found`;
      }
      if (noResults) noResults.classList.toggle('is-visible', visible === 0);
    };

    [typeSel, locSel, bedsSel, priceSel].forEach(sel => {
      if (sel) sel.addEventListener('change', applyFilters);
    });

    const resetBtn = document.querySelector('.filter-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        [typeSel, locSel, bedsSel, priceSel].forEach(sel => { if (sel) sel.value = 'all'; });
        applyFilters();
      });
    }

    applyFilters();
  }

  /* ---------- Contact form (front-end only demo) ---------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const successMsg = document.querySelector('.form-success');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (successMsg) {
        successMsg.classList.add('is-visible');
        successMsg.textContent = 'Thank you — your message has been received. A member of our team will reply within one working day.';
      }
      contactForm.reset();
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
