
(function(){
  var menuButton=document.querySelector('[data-menu-button]');
  var menu=document.querySelector('[data-menu]');
  if(menuButton&&menu){menuButton.addEventListener('click',function(){menu.classList.toggle('is-open')})}
  var searches=document.querySelectorAll('[data-search]');
  searches.forEach(function(input){
    input.addEventListener('input',function(){
      var q=input.value.trim().toLowerCase();
      document.querySelectorAll('[data-movie-card]').forEach(function(card){
        var k=(card.getAttribute('data-keywords')||card.textContent||'').toLowerCase();
        card.classList.toggle('hidden-card',q&&k.indexOf(q)===-1);
      });
    });
  });
  var slides=[].slice.call(document.querySelectorAll('[data-hero-slide]'));
  if(slides.length){
    var i=0;
    var dots=document.querySelector('.hero-dots');
    function show(n){
      i=(n+slides.length)%slides.length;
      slides.forEach(function(s,idx){s.classList.toggle('is-active',idx===i)});
      if(dots){[].slice.call(dots.children).forEach(function(d,idx){d.classList.toggle('is-active',idx===i)})}
    }
    if(dots){slides.forEach(function(_,idx){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','切换');b.addEventListener('click',function(){show(idx)});dots.appendChild(b)})}
    var prev=document.querySelector('[data-hero-prev]');
    var next=document.querySelector('[data-hero-next]');
    if(prev){prev.addEventListener('click',function(){show(i-1)})}
    if(next){next.addEventListener('click',function(){show(i+1)})}
    show(0);
    setInterval(function(){show(i+1)},5200);
  }
  window.initMoviePlayer=function(url){
    var video=document.getElementById('moviePlayer');
    var layer=document.getElementById('playLayer');
    if(!video||!url){return}
    var ready=false;
    function attach(){
      if(ready){return}
      ready=true;
      if(video.canPlayType('application/vnd.apple.mpegurl')){
        video.src=url;
      }else if(window.Hls&&window.Hls.isSupported()){
        var hls=new window.Hls({enableWorker:true,lowLatencyMode:true});
        hls.loadSource(url);
        hls.attachMedia(video);
      }else{
        video.src=url;
      }
    }
    function start(){
      attach();
      if(layer){layer.classList.add('is-hidden')}
      var p=video.play();
      if(p&&p.catch){p.catch(function(){})}
    }
    if(layer){layer.addEventListener('click',start)}
    video.addEventListener('click',function(){if(video.paused){start()}else{video.pause()}});
  };
})();
