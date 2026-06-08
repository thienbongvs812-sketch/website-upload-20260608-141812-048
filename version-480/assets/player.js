(function () {
  function setupVideo(video, url) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.hlsInstance = hls;
      return;
    }

    video.src = url;
  }

  function mount(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);

    if (!video || !config.url) {
      return;
    }

    setupVideo(video, config.url);

    function playVideo() {
      if (button) {
        button.classList.add("is-hidden");
      }

      video.controls = true;
      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", playVideo);
    }

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
  }

  window.MoviePlayer = {
    mount: mount
  };
})();
