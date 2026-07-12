(function () {
  // News pagination
  const list = document.querySelector('[data-news-list]');
  const nav = document.querySelector('[data-pagination]');
  if (list && nav) {
    const items = Array.from(list.querySelectorAll('[data-news-item]'));
    const pageSize = parseInt(list.dataset.pageSize, 10) || 10;
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const prev = nav.querySelector('[data-page-prev]');
    const next = nav.querySelector('[data-page-next]');
    const numbers = nav.querySelector('[data-page-numbers]');
    let current = 1;

    function render(page) {
      current = Math.min(Math.max(1, page), totalPages);
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      items.forEach((el, i) => {
        el.hidden = i < start || i >= end;
      });
      prev.disabled = current === 1;
      next.disabled = current === totalPages;
      renderNumbers();
      const news = document.getElementById('news');
      if (news) news.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function pageBtn(n) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pagination-num';
      b.textContent = n;
      if (n === current) b.setAttribute('aria-current', 'page');
      else b.addEventListener('click', () => render(n));
      return b;
    }

    function ellipsis() {
      const s = document.createElement('span');
      s.className = 'pagination-ellipsis';
      s.textContent = '…';
      return s;
    }

    function renderNumbers() {
      numbers.innerHTML = '';
      // Compact numbers: always show first, last, current ± 1
      const shown = new Set([1, totalPages, current, current - 1, current + 1]);
      let last = 0;
      for (let n = 1; n <= totalPages; n++) {
        if (!shown.has(n)) continue;
        if (n - last > 1) numbers.appendChild(ellipsis());
        numbers.appendChild(pageBtn(n));
        last = n;
      }
    }

    prev.addEventListener('click', () => render(current - 1));
    next.addEventListener('click', () => render(current + 1));
    // Initial render without scroll
    (function initial() {
      current = 1;
      items.forEach((el, i) => { el.hidden = i >= pageSize; });
      prev.disabled = true;
      next.disabled = totalPages === 1;
      renderNumbers();
    })();
  }

  // Mobile nav toggle
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;
  const track = carousel.querySelector('[data-carousel-track]');
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');

  function step(dir) {
    const slide = track.querySelector('.carousel-slide');
    if (!slide) return;
    const delta = slide.getBoundingClientRect().width + 16;
    track.scrollBy({ left: dir * delta, behavior: 'smooth' });
  }

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));

  // Keyboard navigation when carousel is focused
  carousel.tabIndex = 0;
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
