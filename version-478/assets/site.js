(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var prev = slider.querySelector('[data-hero-prev]');
        var next = slider.querySelector('[data-hero-next]');
        var current = 0;
        var timer;

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        show(0);
        start();
    }

    var searchInput = document.querySelector('[data-site-search]');
    var scope = document.querySelector('[data-filter-scope]');
    var emptyState = document.querySelector('[data-empty-state]');
    var clearButton = document.querySelector('[data-clear-filter]');
    var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
    var activeYear = '';
    var activeType = '';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function matches(card, query) {
        var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags')
        ].map(normalize).join(' ');

        var okQuery = !query || haystack.indexOf(query) !== -1;
        var okYear = !activeYear || card.getAttribute('data-year') === activeYear;
        var typeText = normalize(card.getAttribute('data-type') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-tags'));
        var okType = !activeType || typeText.indexOf(normalize(activeType)) !== -1;

        return okQuery && okYear && okType;
    }

    function applyFilters() {
        if (!scope) {
            return;
        }

        var query = normalize(searchInput ? searchInput.value : '');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
        var visible = 0;

        cards.forEach(function (card) {
            var show = matches(card, query);
            card.hidden = !show;
            if (show) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('show', visible === 0);
        }
    }

    if (searchInput && scope) {
        searchInput.addEventListener('input', applyFilters);
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var year = chip.getAttribute('data-filter-year');
            var type = chip.getAttribute('data-filter-type');

            if (year) {
                activeYear = activeYear === year ? '' : year;
            }

            if (type) {
                activeType = activeType === type ? '' : type;
            }

            chips.forEach(function (item) {
                item.classList.toggle('active',
                    item.getAttribute('data-filter-year') === activeYear ||
                    item.getAttribute('data-filter-type') === activeType
                );
            });

            applyFilters();
        });
    });

    if (clearButton) {
        clearButton.addEventListener('click', function () {
            activeYear = '';
            activeType = '';
            if (searchInput) {
                searchInput.value = '';
            }
            chips.forEach(function (chip) {
                chip.classList.remove('active');
            });
            applyFilters();
        });
    }
})();
