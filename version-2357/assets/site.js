(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var picks = Array.prototype.slice.call(document.querySelectorAll('[data-hero-pick]'));
  var active = 0;
  var timer;

  function showHero(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, idx) {
      slide.classList.toggle('is-active', idx === active);
    });
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('is-active', idx === active);
    });
    picks.forEach(function (pick, idx) {
      pick.classList.toggle('is-active', idx === active);
    });
  }

  function startHero() {
    if (timer) {
      window.clearInterval(timer);
    }
    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showHero(active + 1);
      }, 5200);
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
      startHero();
    });
  });

  picks.forEach(function (pick) {
    pick.addEventListener('mouseenter', function () {
      showHero(Number(pick.getAttribute('data-hero-pick')) || 0);
      startHero();
    });
  });

  showHero(0);
  startHero();

  var keywordInput = document.getElementById('searchKeyword');
  var regionFilter = document.getElementById('regionFilter');
  var yearFilter = document.getElementById('yearFilter');
  var typeFilter = document.getElementById('typeFilter');
  var resetFilters = document.getElementById('resetFilters');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.search-card'));
  var empty = document.querySelector('.search-empty');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applySearch() {
    if (!cards.length) {
      return;
    }
    var keyword = normalize(keywordInput && keywordInput.value);
    var region = normalize(regionFilter && regionFilter.value);
    var year = normalize(yearFilter && yearFilter.value);
    var type = normalize(typeFilter && typeFilter.value);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-category'),
        card.getAttribute('data-tags')
      ].join(' '));
      var matched = true;

      if (keyword && haystack.indexOf(keyword) === -1) {
        matched = false;
      }
      if (region && normalize(card.getAttribute('data-region')) !== region) {
        matched = false;
      }
      if (year && normalize(card.getAttribute('data-year')) !== year) {
        matched = false;
      }
      if (type && normalize(card.getAttribute('data-type')) !== type) {
        matched = false;
      }

      card.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.hidden = visible !== 0;
    }
  }

  if (keywordInput) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q');
    if (initial) {
      keywordInput.value = initial;
    }
    keywordInput.addEventListener('input', applySearch);
  }

  [regionFilter, yearFilter, typeFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('change', applySearch);
    }
  });

  if (resetFilters) {
    resetFilters.addEventListener('click', function () {
      if (keywordInput) {
        keywordInput.value = '';
      }
      [regionFilter, yearFilter, typeFilter].forEach(function (control) {
        if (control) {
          control.value = '';
        }
      });
      applySearch();
    });
  }

  applySearch();
})();
