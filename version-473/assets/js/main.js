(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMobileMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = selectAll("[data-hero-slide]", root);
        var dots = selectAll("[data-hero-dot]", root);
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var panels = selectAll("[data-filter-panel]");
        panels.forEach(function (panel) {
            var parent = panel.parentElement || document;
            var input = panel.querySelector("[data-card-filter-input]");
            var year = panel.querySelector("[data-card-filter-year]");
            var type = panel.querySelector("[data-card-filter-type]");
            var cards = selectAll("[data-movie-card]", parent);
            var empty = parent.querySelector("[data-empty-state]");

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function apply() {
                var query = normalize(input && input.value);
                var yearValue = normalize(year && year.value);
                var typeValue = normalize(type && type.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute("data-search"));
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var cardType = normalize(card.getAttribute("data-type"));
                    var matched = true;
                    if (query && text.indexOf(query) === -1) {
                        matched = false;
                    }
                    if (yearValue && cardYear.indexOf(yearValue) === -1) {
                        matched = false;
                    }
                    if (typeValue && cardType.indexOf(typeValue) === -1) {
                        matched = false;
                    }
                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            if (year) {
                year.addEventListener("change", apply);
            }
            if (type) {
                type.addEventListener("change", apply);
            }
            apply();
        });
    }

    function setupSearchPage() {
        var searchInput = document.querySelector("[data-search-page-input]");
        var filterInput = document.querySelector("[data-card-filter-input]");
        if (!searchInput) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        searchInput.value = query;
        if (filterInput && query) {
            filterInput.value = query;
            filterInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    window.initMoviePlayer = function (url) {
        var video = document.querySelector("[data-player-video]");
        var button = document.querySelector("[data-player-button]");
        var cover = document.querySelector("[data-player-cover]");
        var ready = false;
        var hls = null;

        if (!video || !button || !url) {
            return;
        }

        function attach() {
            if (ready) {
                return Promise.resolve();
            }
            ready = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
                return Promise.resolve();
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(url);
                hls.attachMedia(video);
                return new Promise(function (resolve) {
                    hls.on(window.Hls.Events.MANIFEST_PARSED, resolve);
                });
            }
            video.src = url;
            return Promise.resolve();
        }

        function play() {
            attach().then(function () {
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
                button.classList.add("is-hidden");
            });
        }

        button.addEventListener("click", function (event) {
            event.preventDefault();
            play();
        });

        if (cover) {
            cover.addEventListener("click", function (event) {
                if (event.target === video && !video.paused) {
                    return;
                }
                play();
            });
        }

        video.addEventListener("pause", function () {
            if (!video.ended) {
                button.classList.remove("is-hidden");
            }
        });

        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        setupMobileMenu();
        setupHero();
        setupFilters();
        setupSearchPage();
    });
})();
