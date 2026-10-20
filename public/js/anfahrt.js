// Interaktive Anfahrt auf der Kontaktseite: Reiter wählen den Weg, der Weg zeichnet sich, ein Symbol fährt
// ihn ab und die Schritte leuchten mit. Mit „Bewegung reduzieren“ erscheint der Weg sofort vollständig.
(function () {
  var root = document.querySelector('[data-anfahrt]');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var mover = root.querySelector('[data-mover]');
  var park = root.querySelector('[data-park]');
  var stop = root.querySelector('[data-stop="auer"]');
  var replay = root.querySelector('[data-replay]');
  var copy = root.querySelector('[data-copy]');
  var current = null;
  var frame = 0;

  root.classList.add('is-live');
  root.querySelector('[data-tabs]').hidden = false;
  if (replay) replay.hidden = false;

  // Strich bis zum Anteil drawn (0..1) sichtbar
  function setDash(path, drawn) {
    var len = path.getTotalLength();
    path.style.strokeDasharray = len + ' ' + len;
    path.style.strokeDashoffset = String(len * (1 - drawn));
  }

  function show(id) {
    cancelAnimationFrame(frame);
    current = id;
    root.classList.remove('is-done');
    tabs.forEach(function (t) {
      var on = t.dataset.mode === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    root.querySelectorAll('[data-steps]').forEach(function (s) {
      if (s.dataset.steps === id) s.setAttribute('data-active', ''); else s.removeAttribute('data-active');
    });
    root.querySelectorAll('[data-route]').forEach(function (g) { g.classList.toggle('is-on', g.dataset.route === id); });
    var group = root.querySelector('[data-route="' + id + '"]');
    var ride = group.querySelector('[data-ride]');
    var walk = group.querySelector('[data-walk]');
    var walkMask = group.querySelector('[data-walk-mask]');
    var glow = group.querySelector('.g-ride-glow');
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-steps="' + id + '"] li'));
    var rideLen = ride.getTotalLength();
    var walkLen = walk ? walk.getTotalLength() : 0;
    // Zu Fuß wird langsamer gezeigt: ein Pixel Fußweg zählt dreifach
    var total = rideLen + walkLen * 3;
    var split = rideLen / total;
    park.classList.toggle('is-hit', id === 'a5' || id === 'a8');
    if (stop) stop.classList.toggle('is-hit', id === 'tram');

    function render(p) {
      var r = Math.min(1, p / split);
      setDash(ride, r);
      setDash(glow, r);
      var pt = ride.getPointAtLength(rideLen * r);
      if (walk) {
        // Der Fußweg ist gepunktet: er wird über seine Maske freigelegt
        var w = p <= split ? 0 : (p - split) / (1 - split);
        setDash(walkMask, w);
        if (p > split) pt = walk.getPointAtLength(walkLen * w);
      }
      mover.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
      items.forEach(function (li, i) {
        var at = parseFloat(li.dataset.at);
        var next = i + 1 < items.length ? parseFloat(items[i + 1].dataset.at) : 2;
        li.classList.toggle('is-past', p >= at);
        li.classList.toggle('is-now', p >= at && p < next && p < 1);
      });
    }

    mover.classList.add('is-on');
    if (reduce) { render(1); mover.classList.remove('is-on'); root.classList.add('is-done'); return; }
    var duration = 4200 + walkLen * 4;
    var start = null;
    function tick(ts) {
      if (current !== id) return;
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   // sanft anfahren und bremsen
      render(e);
      if (t < 1) frame = requestAnimationFrame(tick);
      else { root.classList.add('is-done'); items.forEach(function (li) { li.classList.remove('is-now'); }); }
    }
    render(0);
    frame = requestAnimationFrame(tick);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.dataset.mode); });
    t.addEventListener('keydown', function (ev) {
      var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      ev.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus();
      show(n.dataset.mode);
    });
  });
  if (replay) replay.addEventListener('click', function () { show(current); });

  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', function () {
      navigator.clipboard.writeText(copy.dataset.copy).then(function () {
        var l = copy.querySelector('[data-copy-label]');
        var old = l.textContent;
        l.textContent = 'Kopiert';
        setTimeout(function () { l.textContent = old; }, 1800);
      });
    });
  }

  // Erst abspielen, wenn die Karte ins Bild kommt
  var started = false;
  function startOnce() { if (!started) { started = true; show(tabs[0].dataset.mode); } }
  render0();
  function render0() {
    root.querySelectorAll('[data-route]').forEach(function (g) { g.classList.toggle('is-on', g.dataset.route === tabs[0].dataset.mode); });
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); startOnce(); }
    }, { threshold: 0.35 });
    io.observe(root.querySelector('.anf-map'));
  } else startOnce();
})();
