import { H as Hls } from './hls-vendor.js';

function findSource(video) {
  const source = video.querySelector('source');
  return source ? source.getAttribute('src') : video.getAttribute('src');
}

function loadVideo(video, sourceUrl, autoPlay) {
  if (!sourceUrl) {
    return;
  }

  if (video.dataset.ready === '1') {
    if (autoPlay) {
      video.play().catch(function () {});
    }
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = sourceUrl;
    video.dataset.ready = '1';
    if (autoPlay) {
      video.play().catch(function () {});
    }
    return;
  }

  if (Hls.isSupported()) {
    const hls = new Hls({
      maxBufferLength: 30,
      enableWorker: true
    });
    hls.loadSource(sourceUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.dataset.ready = '1';
      if (autoPlay) {
        video.play().catch(function () {});
      }
    });
    video._hlsPlayer = hls;
  }
}

document.querySelectorAll('.video-shell').forEach(function (shell) {
  const video = shell.querySelector('.movie-video');
  const cover = shell.querySelector('.play-cover');

  if (!video) {
    return;
  }

  const sourceUrl = findSource(video);

  if (cover) {
    cover.addEventListener('click', function () {
      cover.classList.add('is-hidden');
      loadVideo(video, sourceUrl, true);
    });
  }

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
    loadVideo(video, sourceUrl, false);
  }, { once: true });
});
