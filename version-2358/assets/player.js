(function() {
  function initWatchPlayer(playerId, sourceUrl) {
    var root = document.getElementById(playerId);

    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var cover = root.querySelector(".player-cover");
    var loaded = false;
    var hls = null;

    if (!video || !cover) {
      return;
    }

    function attachSource() {
      if (loaded) {
        return;
      }

      loaded = true;
      video.controls = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
          video.play().catch(function() {});
        });
        return;
      }

      video.src = sourceUrl;
    }

    function startPlayback() {
      attachSource();
      cover.classList.add("is-hidden");
      video.play().catch(function() {
        cover.classList.remove("is-hidden");
      });
    }

    cover.addEventListener("click", startPlayback);

    video.addEventListener("click", function() {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", function() {
      cover.classList.add("is-hidden");
    });

    video.addEventListener("ended", function() {
      cover.classList.remove("is-hidden");
    });

    window.addEventListener("beforeunload", function() {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initWatchPlayer = initWatchPlayer;
})();
