(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var navPanel = document.querySelector('[data-nav-panel]');
  if (navButton && navPanel) {
    navButton.addEventListener('click', function () {
      navPanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function setHero(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function startHero() {
      stopHero();
      timer = window.setInterval(function () {
        setHero(index + 1);
      }, 5000);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        setHero(i);
        startHero();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        setHero(index - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setHero(index + 1);
        startHero();
      });
    }

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    setHero(0);
    startHero();
  }

  var searchPage = document.querySelector('[data-search-page]');
  if (searchPage) {
    var params = new URLSearchParams(window.location.search);
    var keywordInput = searchPage.querySelector('[data-filter-keyword]');
    var typeSelect = searchPage.querySelector('[data-filter-type]');
    var yearSelect = searchPage.querySelector('[data-filter-year]');
    var sortSelect = searchPage.querySelector('[data-filter-sort]');
    var grid = searchPage.querySelector('[data-movie-grid]');
    var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-title]'));

    if (keywordInput && params.get('q')) {
      keywordInput.value = params.get('q');
    }

    function applyFilters() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var typeValue = typeSelect ? typeSelect.value : '';
      var yearValue = yearSelect ? yearSelect.value : '';

      cards.forEach(function (card) {
        var text = [card.getAttribute('data-title'), card.getAttribute('data-tags')].join(' ').toLowerCase();
        var type = card.getAttribute('data-type') || '';
        var year = card.getAttribute('data-year') || '';
        var okKeyword = !keyword || text.indexOf(keyword) !== -1;
        var okType = !typeValue || type === typeValue;
        var okYear = !yearValue || year === yearValue;
        card.classList.toggle('hidden-card', !(okKeyword && okType && okYear));
      });
    }

    function applySort() {
      if (!grid || !sortSelect) {
        return;
      }
      var mode = sortSelect.value;
      var sorted = cards.slice().sort(function (a, b) {
        if (mode === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
        }
        if (mode === 'year') {
          return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
        }
        return 0;
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
      applyFilters();
    }

    [keywordInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', applySort);
    }

    applySort();
  }
})();
