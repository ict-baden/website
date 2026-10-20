// Portfolio-Video auf der Startseite: großer Play-Knopf über dem Vorschaubild; ohne JavaScript bleiben die
// Steuerelemente des Browsers. Das Video lädt erst beim Abspielen (preload="none").
(function () {
  document.querySelectorAll('[data-film]').forEach(function (fig) {
    var video = fig.querySelector('video');
    var btn = fig.querySelector('[data-film-play]');
    if (!video || !btn) return;
    btn.hidden = false;
    video.controls = false;
    function start() {
      btn.hidden = true;
      video.controls = true;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
    btn.addEventListener('click', start);
    video.addEventListener('play', function () { btn.hidden = true; video.controls = true; });
  });
})();
