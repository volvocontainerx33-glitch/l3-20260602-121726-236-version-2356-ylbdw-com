(() => {
  const ready = (fn) => {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  ready(() => {
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-mobile-nav]');

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    }

    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
      const slides = Array.from(carousel.querySelectorAll('.hero-bg'));
      const dots = Array.from(carousel.querySelectorAll('.hero-dot'));
      const title = carousel.querySelector('[data-hero-title]');
      const summary = carousel.querySelector('[data-hero-summary]');
      const year = carousel.querySelector('[data-hero-year]');
      const category = carousel.querySelector('[data-hero-category]');
      const detailLinks = Array.from(carousel.querySelectorAll('[data-hero-detail]'));
      const categoryLink = carousel.querySelector('[data-hero-category-link]');
      const poster = carousel.querySelector('[data-hero-poster]');
      let current = 0;

      const show = (index) => {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;
        const active = slides[current];

        slides.forEach((slide, idx) => slide.classList.toggle('active', idx === current));
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === current));

        if (title) {
          title.textContent = active.dataset.title || '';
        }
        if (summary) {
          summary.textContent = active.dataset.summary || '';
        }
        if (year) {
          year.textContent = active.dataset.year || '';
        }
        if (category) {
          category.textContent = active.dataset.category || '';
        }
        detailLinks.forEach((link) => {
          link.href = active.dataset.href || '#';
        });
        if (categoryLink) {
          categoryLink.href = active.dataset.categoryHref || '#';
        }
        if (poster) {
          poster.src = active.dataset.image || '';
          poster.alt = active.dataset.title || '';
        }
      };

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => show(idx));
      });

      show(0);

      if (slides.length > 1) {
        window.setInterval(() => show(current + 1), 5200);
      }
    });

    document.querySelectorAll('[data-filter-scope]').forEach((scope) => {
      const input = document.querySelector(`[data-filter-input="${scope.dataset.filterScope}"]`);
      const select = document.querySelector(`[data-filter-select="${scope.dataset.filterScope}"]`);
      const cards = Array.from(scope.querySelectorAll('.movie-card'));

      const apply = () => {
        const q = input ? input.value.trim().toLowerCase() : '';
        const y = select ? select.value : '';

        cards.forEach((card) => {
          const haystack = `${card.dataset.title || ''} ${card.dataset.tags || ''} ${card.dataset.region || ''} ${card.dataset.type || ''}`.toLowerCase();
          const matchText = !q || haystack.includes(q);
          const matchYear = !y || card.dataset.year === y;
          card.classList.toggle('hidden-by-filter', !(matchText && matchYear));
        });
      };

      if (input) {
        input.addEventListener('input', apply);
      }
      if (select) {
        select.addEventListener('change', apply);
      }
    });

    document.querySelectorAll('.player').forEach((player) => {
      const video = player.querySelector('video');
      const layer = player.querySelector('.play-layer');
      const url = player.dataset.stream;
      let hls = null;
      let started = false;

      const start = () => {
        if (!video || !url) {
          return;
        }

        if (!started) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else {
            video.src = url;
          }
          started = true;
        }

        player.classList.add('is-playing');
        video.controls = true;
        const result = video.play();

        if (result && typeof result.catch === 'function') {
          result.catch(() => {
            player.classList.remove('is-playing');
          });
        }
      };

      if (layer) {
        layer.addEventListener('click', start);
      }

      if (video) {
        video.addEventListener('click', () => {
          if (!started || video.paused) {
            start();
          }
        });
      }

      window.addEventListener('pagehide', () => {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
