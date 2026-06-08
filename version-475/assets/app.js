(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        if (toggle) {
            toggle.addEventListener("click", function () {
                var open = document.body.classList.toggle("nav-open");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (slides.length > 1) {
            var current = 0;
            var activate = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === current);
                });
            };
            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    activate(Number(dot.getAttribute("data-slide")) || 0);
                });
            });
            window.setInterval(function () {
                activate(current + 1);
            }, 5600);
        }

        Array.prototype.slice.call(document.querySelectorAll(".filter-board")).forEach(function (board) {
            var search = board.querySelector('[data-filter="search"]');
            var reset = board.querySelector('[data-filter="reset"]');
            var cards = Array.prototype.slice.call(board.querySelectorAll(".filter-card"));
            var noResults = board.querySelector(".no-results");
            var selects = Array.prototype.slice.call(board.querySelectorAll("select[data-filter]"));
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q");

            if (search && initialQuery) {
                search.value = initialQuery;
            }

            var apply = function () {
                var q = search ? search.value.trim().toLowerCase() : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var matched = !q || text.indexOf(q) !== -1;
                    selects.forEach(function (select) {
                        var key = select.getAttribute("data-filter");
                        var value = select.value;
                        if (value && card.getAttribute("data-" + key) !== value) {
                            matched = false;
                        }
                    });
                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });
                if (noResults) {
                    noResults.classList.toggle("show", visible === 0);
                }
            };

            if (search) {
                search.addEventListener("input", apply);
            }
            selects.forEach(function (select) {
                select.addEventListener("change", apply);
            });
            if (reset) {
                reset.addEventListener("click", function () {
                    if (search) {
                        search.value = "";
                    }
                    selects.forEach(function (select) {
                        select.value = "";
                    });
                    apply();
                });
            }
            apply();
        });
    });
})();
