(function () {
  var video = document.getElementById('moviePlayer');
  var overlay = document.getElementById('playOverlay');

  if (!video) {
    return;
  }

  function loadVideo() {
    var stream = video.getAttribute('data-stream');

    if (!stream || video.getAttribute('data-loaded') === '1') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.setAttribute('data-loaded', '1');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video.setAttribute('data-loaded', '1');
      return;
    }

    video.src = stream;
    video.setAttribute('data-loaded', '1');
  }

  function playVideo() {
    loadVideo();
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (overlay) {
      overlay.classList.remove('is-hidden');
    }
  });

  video.addEventListener('loadedmetadata', function () {
    if (overlay && !video.paused) {
      overlay.classList.add('is-hidden');
    }
  });
})();
