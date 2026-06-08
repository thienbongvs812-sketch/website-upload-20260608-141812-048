(function () {
    var mobileButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (mobileButton && mobileMenu) {
        mobileButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var controls = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-control]'));
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });

            controls.forEach(function (control, controlIndex) {
                control.classList.toggle('is-active', controlIndex === activeIndex);
            });
        }

        controls.forEach(function (control, index) {
            control.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        }
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function setupFilter(root) {
        var form = root.querySelector('[data-filter-form]');
        var input = root.querySelector('[data-filter-input]');
        var yearSelect = root.querySelector('[data-filter-year]');
        var typeSelect = root.querySelector('[data-filter-type]');
        var list = document.querySelector('[data-filter-list]');

        if (!form || !list) {
            return;
        }

        var items = Array.prototype.slice.call(list.children);
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query && input) {
            input.value = query;
        }

        function filterItems() {
            var keyword = normalize(input ? input.value : '');
            var year = normalize(yearSelect ? yearSelect.value : '');
            var type = normalize(typeSelect ? typeSelect.value : '');

            items.forEach(function (item) {
                var haystack = normalize([
                    item.getAttribute('data-title'),
                    item.getAttribute('data-year'),
                    item.getAttribute('data-type'),
                    item.getAttribute('data-genre'),
                    item.getAttribute('data-region')
                ].join(' '));
                var itemYear = normalize(item.getAttribute('data-year'));
                var itemType = normalize(item.getAttribute('data-type') + ' ' + item.getAttribute('data-genre'));
                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (year && itemYear.indexOf(year) === -1) {
                    matched = false;
                }

                if (type && itemType.indexOf(type) === -1) {
                    matched = false;
                }

                item.classList.toggle('is-filtered-out', !matched);
            });
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            filterItems();
        });

        [input, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', filterItems);
                control.addEventListener('change', filterItems);
            }
        });

        filterItems();
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]')).forEach(setupFilter);
})();
