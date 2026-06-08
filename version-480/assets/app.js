(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function startHeroTimer() {
    if (!slides.length) {
      return;
    }

    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 6500);
  }

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(current - 1);
      startHeroTimer();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      startHeroTimer();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
      startHeroTimer();
    });
  });

  startHeroTimer();

  var searchInput = document.querySelector("[data-search-input]");
  var clearButton = document.querySelector("[data-search-clear]");
  var regionSelect = document.querySelector("[data-filter-region]");
  var yearSelect = document.querySelector("[data-filter-year]");
  var chipButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
  var activeChip = "";

  function readQueryParam() {
    try {
      return new URLSearchParams(window.location.search).get("q") || "";
    } catch (error) {
      return "";
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function applyFilters() {
    var keyword = normalize(searchInput ? searchInput.value : "");
    var region = normalize(regionSelect ? regionSelect.value : "");
    var year = normalize(yearSelect ? yearSelect.value : "");
    var chip = normalize(activeChip);

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-category")
      ].join(" "));

      var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchesRegion = !region || normalize(card.getAttribute("data-region")) === region;
      var matchesYear = !year || normalize(card.getAttribute("data-year")) === year;
      var matchesChip = !chip || haystack.indexOf(chip) !== -1;

      card.hidden = !(matchesKeyword && matchesRegion && matchesYear && matchesChip);
    });
  }

  if (searchInput) {
    searchInput.value = readQueryParam();
    searchInput.addEventListener("input", applyFilters);
  }

  if (regionSelect) {
    regionSelect.addEventListener("change", applyFilters);
  }

  if (yearSelect) {
    yearSelect.addEventListener("change", applyFilters);
  }

  chipButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-filter-chip") || "";
      activeChip = activeChip === value ? "" : value;
      chipButtons.forEach(function (chipButton) {
        chipButton.classList.toggle("is-active", chipButton === button && activeChip);
      });
      applyFilters();
    });
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      if (searchInput) {
        searchInput.value = "";
      }

      if (regionSelect) {
        regionSelect.value = "";
      }

      if (yearSelect) {
        yearSelect.value = "";
      }

      activeChip = "";
      chipButtons.forEach(function (button) {
        button.classList.remove("is-active");
      });
      applyFilters();
    });
  }

  applyFilters();
})();
