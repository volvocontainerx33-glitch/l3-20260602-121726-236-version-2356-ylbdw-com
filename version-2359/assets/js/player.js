document.addEventListener('DOMContentLoaded', function () {
  var video = document.querySelector('[data-video-player]');
  var playButton = document.querySelector('[data-play-button]');

  if (!video || !playButton) {
    return;
  }

  var stream = video.getAttribute('data-stream');
  var loaded = false;

  function startPlayer() {
    if (!stream) {
      return;
    }

    if (!loaded) {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        video.src = stream;
      }
      loaded = true;
    }

    video.play().catch(function () {
      video.setAttribute('controls', 'controls');
    });
  }

  playButton.addEventListener('click', startPlayer);
  video.addEventListener('click', startPlayer);
});
