(function() {
  var menuButton = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function() {
      var opened = mobileNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var index = 0;
  var timer = null;

  function showSlide(nextIndex) {
    if (!slides.length) {
      return;
    }

    index = (nextIndex + slides.length) % slides.length;

    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === index);
    });

    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === index);
    });
  }

  function startSlider() {
    if (slides.length < 2) {
      return;
    }

    clearInterval(timer);
    timer = setInterval(function() {
      showSlide(index + 1);
    }, 5600);
  }

  dots.forEach(function(dot) {
    dot.addEventListener("click", function() {
      var target = parseInt(dot.getAttribute("data-target"), 10);
      showSlide(target);
      startSlider();
    });
  });

  startSlider();

  function yearMatches(value, year) {
    if (value === "all") {
      return true;
    }

    if (value === "2025") {
      return year >= 2025;
    }

    if (value === "2020") {
      return year >= 2020 && year <= 2021;
    }

    if (value === "older") {
      return year < 2020;
    }

    return String(year) === value;
  }

  function typeMatches(value, type) {
    if (value === "all") {
      return true;
    }

    return type.indexOf(value) !== -1;
  }

  Array.prototype.slice.call(document.querySelectorAll(".content-section")).forEach(function(section) {
    var search = section.querySelector(".movie-search");
    var yearFilter = section.querySelector(".year-filter");
    var typeFilter = section.querySelector(".type-filter");
    var cards = Array.prototype.slice.call(section.querySelectorAll(".searchable-list [data-search]"));

    if (!cards.length || (!search && !yearFilter && !typeFilter)) {
      return;
    }

    function applyFilters() {
      var keyword = search ? search.value.trim().toLowerCase() : "";
      var yearValue = yearFilter ? yearFilter.value : "all";
      var typeValue = typeFilter ? typeFilter.value : "all";

      cards.forEach(function(card) {
        var searchText = card.getAttribute("data-search") || "";
        var cardYear = parseInt(card.getAttribute("data-year") || "0", 10);
        var cardType = card.getAttribute("data-type") || "";
        var visible = (!keyword || searchText.indexOf(keyword) !== -1) && yearMatches(yearValue, cardYear) && typeMatches(typeValue, cardType);
        card.classList.toggle("is-filtered-out", !visible);
      });
    }

    if (search) {
      search.addEventListener("input", applyFilters);
    }

    if (yearFilter) {
      yearFilter.addEventListener("change", applyFilters);
    }

    if (typeFilter) {
      typeFilter.addEventListener("change", applyFilters);
    }
  });
})();
