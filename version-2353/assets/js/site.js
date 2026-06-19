(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var menuPanel = document.querySelector('[data-menu-panel]');

    if (menuButton && menuPanel) {
        menuButton.addEventListener('click', function () {
            menuPanel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }

        function startHero() {
            stopHero();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function stopHero() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startHero();
            });
        });

        hero.addEventListener('mouseenter', stopHero);
        hero.addEventListener('mouseleave', startHero);
        startHero();
    }

    function applyFilter(scope) {
        var input = scope.querySelector('[data-filter-input], [data-search-page-input]');
        var select = scope.querySelector('[data-filter-select]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var selected = select ? select.value.trim().toLowerCase() : '';

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchedSelect = !selected || text.indexOf(selected) !== -1;
            card.classList.toggle('is-hidden', !(matchedKeyword && matchedSelect));
        });
    }

    document.querySelectorAll('[data-filter-grid]').forEach(function (grid) {
        var scope = grid.closest('section') || document;
        var input = scope.querySelector('[data-filter-input], [data-search-page-input]');
        var select = scope.querySelector('[data-filter-select]');

        if (input) {
            input.addEventListener('input', function () {
                applyFilter(scope);
            });
        }

        if (select) {
            select.addEventListener('change', function () {
                applyFilter(scope);
            });
        }
    });

    var searchInput = document.querySelector('[data-search-page-input]');
    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
            searchInput.value = q;
            var searchScope = searchInput.closest('section') || document;
            applyFilter(searchScope);
        }
    }
})();

function initMoviePlayer(videoId, buttonId, overlayId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var overlay = document.getElementById(overlayId);
    var loaded = false;
    var hlsInstance = null;

    if (!video || !button || !overlay || !streamUrl) {
        return;
    }

    function attachStream() {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 60
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function startPlayback(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        attachStream();
        overlay.classList.add('is-hidden');
        video.controls = true;
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                overlay.classList.remove('is-hidden');
            });
        }
    }

    button.addEventListener('click', startPlayback);
    overlay.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });
    video.addEventListener('ended', function () {
        overlay.classList.remove('is-hidden');
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
