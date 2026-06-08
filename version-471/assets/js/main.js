(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");

    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    var filterWrap = document.querySelector("[data-filter-wrap]");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));

    if (filterWrap && filterButtons.length) {
        var filterCards = Array.prototype.slice.call(filterWrap.querySelectorAll("[data-card]"));

        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var value = button.getAttribute("data-filter");

                filterButtons.forEach(function (item) {
                    item.classList.toggle("active", item === button);
                });

                filterCards.forEach(function (card) {
                    var type = card.getAttribute("data-type") || "";
                    var matched = value === "all" || type.indexOf(value) !== -1;
                    card.classList.toggle("hidden", !matched);
                });
            });
        });
    }

    var searchPage = document.querySelector("[data-search-page]");

    if (searchPage) {
        var input = searchPage.querySelector("[data-search-input]");
        var channel = searchPage.querySelector("[data-channel-select]");
        var type = searchPage.querySelector("[data-type-select]");
        var state = searchPage.querySelector("[data-search-state]");
        var cards = Array.prototype.slice.call(searchPage.querySelectorAll("[data-card]"));
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";

        if (input && initial) {
            input.value = initial;
        }

        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : "";
            var channelValue = channel ? channel.value : "all";
            var typeValue = type ? type.value : "all";
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-tags") || "",
                    card.getAttribute("data-year") || ""
                ].join(" ").toLowerCase();
                var cardChannel = card.getAttribute("data-channel") || "";
                var cardType = card.getAttribute("data-type") || "";
                var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var okChannel = channelValue === "all" || cardChannel === channelValue;
                var okType = typeValue === "all" || cardType.indexOf(typeValue) !== -1;
                var matched = okKeyword && okChannel && okType;

                card.classList.toggle("hidden", !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (state) {
                state.textContent = visible ? "已显示符合条件的影片。" : "没有匹配到相关影片。";
            }
        }

        [input, channel, type].forEach(function (node) {
            if (node) {
                node.addEventListener("input", apply);
                node.addEventListener("change", apply);
            }
        });

        apply();
    }
})();
