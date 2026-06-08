(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-search-redirect]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      const input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
      }
    });
  });

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let active = 0;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function cardMatches(card, query, year, type) {
    const haystack = normalize([
      card.getAttribute('data-title'),
      card.getAttribute('data-region'),
      card.getAttribute('data-tags'),
      card.getAttribute('data-type'),
      card.getAttribute('data-year')
    ].join(' '));
    const byQuery = !query || haystack.includes(query);
    const byYear = !year || card.getAttribute('data-year') === year;
    const byType = !type || card.getAttribute('data-type') === type;
    return byQuery && byYear && byType;
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    const input = scope.querySelector('[data-filter-input]');
    const year = scope.querySelector('[data-filter-year]');
    const type = scope.querySelector('[data-filter-type]');
    const cards = Array.from(scope.querySelectorAll('[data-card]'));
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q');

    if (input && initial) {
      input.value = initial;
    }

    function apply() {
      const query = normalize(input ? input.value : '');
      const yearValue = year ? year.value : '';
      const typeValue = type ? type.value : '';
      cards.forEach(function (card) {
        card.hidden = !cardMatches(card, query, yearValue, typeValue);
      });
    }

    [input, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  });

  document.querySelectorAll('[data-play-jump]').forEach(function (link) {
    link.addEventListener('click', function () {
      const button = document.querySelector('.play-cover');
      if (button) {
        button.click();
      }
    });
  });
})();
