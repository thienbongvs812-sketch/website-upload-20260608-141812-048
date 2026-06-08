(function () {
    function loadHlsLibrary() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }

        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    window.initMoviePlayer = function (source, videoId, overlayId) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var prepared = false;
        var hlsInstance = null;

        if (!video || !overlay || !source) {
            return;
        }

        function attachSource() {
            if (prepared) {
                return Promise.resolve();
            }

            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return Promise.resolve();
            }

            return loadHlsLibrary().then(function (Hls) {
                if (Hls && Hls.isSupported()) {
                    hlsInstance = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    return;
                }

                video.src = source;
            }).catch(function () {
                video.src = source;
            });
        }

        function play() {
            overlay.classList.add('is-hidden');
            video.setAttribute('controls', 'controls');
            attachSource().then(function () {
                var attempt = video.play();

                if (attempt && typeof attempt.catch === 'function') {
                    attempt.catch(function () {
                        overlay.classList.remove('is-hidden');
                    });
                }
            });
        }

        overlay.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (!prepared) {
                play();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
