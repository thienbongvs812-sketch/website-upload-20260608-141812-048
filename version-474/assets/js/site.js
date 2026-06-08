(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var select = scope.querySelector("[data-sort-select]");
      var grid = scope.parentElement.querySelector("[data-card-grid]");
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
      function filterCards() {
        var query = normalize(input ? input.value : "");
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-tags"),
            card.textContent
          ].join(" "));
          card.classList.toggle("card-hidden", query && haystack.indexOf(query) === -1);
        });
      }
      function sortCards() {
        var mode = select ? select.value : "year-desc";
        var sorted = cards.slice().sort(function (a, b) {
          var ay = Number(a.getAttribute("data-year") || 0);
          var by = Number(b.getAttribute("data-year") || 0);
          var aw = Number(a.getAttribute("data-weight") || 0);
          var bw = Number(b.getAttribute("data-weight") || 0);
          var at = normalize(a.getAttribute("data-title"));
          var bt = normalize(b.getAttribute("data-title"));
          if (mode === "year-asc") {
            return ay - by;
          }
          if (mode === "weight-desc") {
            return bw - aw;
          }
          if (mode === "title-asc") {
            return at.localeCompare(bt, "zh-Hans-CN");
          }
          return by - ay;
        });
        sorted.forEach(function (card) {
          grid.appendChild(card);
        });
      }
      if (input) {
        input.addEventListener("input", filterCards);
      }
      if (select) {
        select.addEventListener("change", sortCards);
      }
      sortCards();
    });
  }

  function setupPlayer() {
    var wrapper = document.querySelector("[data-player]");
    if (!wrapper) {
      return;
    }
    var video = wrapper.querySelector("video");
    var button = wrapper.querySelector("[data-play-button]");
    if (!video || !button) {
      return;
    }
    var stream = video.getAttribute("data-stream");
    var started = false;
    function playVideo() {
      if (!stream) {
        return;
      }
      button.hidden = true;
      video.controls = true;
      if (started) {
        video.play();
        return;
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        video.play();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });
        return;
      }
      video.src = stream;
      video.play();
    }
    button.addEventListener("click", playVideo);
    wrapper.addEventListener("click", function (event) {
      if (event.target === wrapper) {
        playVideo();
      }
    });
    video.addEventListener("click", function () {
      if (!started) {
        playVideo();
      }
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayer();
  });
})();
