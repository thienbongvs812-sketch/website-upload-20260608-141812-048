(function () {
    window.initPlayer = function (playerId, streamUrl) {
        var frame = document.getElementById(playerId);

        if (!frame) {
            return;
        }

        var video = frame.querySelector("video");
        var button = frame.querySelector(".play-layer");
        var hls = null;
        var ready = false;

        function playVideo() {
            frame.classList.add("is-playing");
            video.controls = true;

            var playResult = video.play();

            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    frame.classList.remove("is-playing");
                });
            }
        }

        function loadStream() {
            if (ready) {
                playVideo();
                return;
            }

            ready = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                video.load();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                return;
            }

            video.src = streamUrl;
            video.addEventListener("loadedmetadata", playVideo, { once: true });
            video.load();
        }

        if (button) {
            button.addEventListener("click", loadStream);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                loadStream();
            } else {
                video.pause();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
