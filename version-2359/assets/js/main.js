document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
  var current = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      setSlide(i);
    });
  });

  if (slides.length > 1) {
    setSlide(0);
    window.setInterval(function () {
      setSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var yearSelect = document.querySelector('[data-year-select]');
  var categorySelect = document.querySelector('[data-category-select]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

  function filterCards() {
    var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var y = yearSelect ? yearSelect.value : '';
    var c = categorySelect ? categorySelect.value : '';

    cards.forEach(function (card) {
      var text = [card.dataset.title, card.dataset.region, card.dataset.genre, card.dataset.category].join(' ').toLowerCase();
      var yearMatch = !y || card.dataset.year === y;
      var categoryMatch = !c || card.dataset.category === c;
      var textMatch = !q || text.indexOf(q) !== -1;
      card.classList.toggle('hidden-card', !(yearMatch && categoryMatch && textMatch));
    });
  }

  [searchInput, yearSelect, categorySelect].forEach(function (el) {
    if (el) {
      el.addEventListener('input', filterCards);
      el.addEventListener('change', filterCards);
    }
  });
});
