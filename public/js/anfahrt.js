// Interaktive Anfahrt auf der Kontaktseite: Reiter wählen den Weg, der Weg zeichnet sich – auf dem Plan oder auf dem
// Luftbild –, ein Symbol fährt ihn ab und die Schritte leuchten mit. Mit „Bewegung reduzieren“ erscheint der Weg
// sofort vollständig.
(function () {
  var root = document.querySelector('[data-anfahrt]');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var plan = root.querySelector('.anf-plan-svg');
  var sat = root.querySelector('[data-sat]');
  var park = root.querySelector('[data-park]');
  var stop = root.querySelector('[data-stop="auer"]');
  var replay = root.querySelector('[data-replay]');
  var copy = root.querySelector('[data-copy]');
  var current = tabs[0].dataset.mode;
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

  function isSat() { return root.classList.contains('is-sat'); }

  function show(id) {
    cancelAnimationFrame(frame);
    current = id;
    var scope = isSat() ? sat : plan;
    var other = isSat() ? plan : sat;
    root.classList.remove('is-done');
    tabs.forEach(function (t) {
      var on = t.dataset.mode === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    root.querySelectorAll('[data-steps]').forEach(function (s) {
      if (s.dataset.steps === id) s.setAttribute('data-active', ''); else s.removeAttribute('data-active');
    });
    scope.querySelectorAll('[data-route]').forEach(function (g) { g.classList.toggle('is-on', g.dataset.route === id); });
    other.querySelectorAll('[data-route]').forEach(function (g) { g.classList.remove('is-on'); });
    other.querySelectorAll('.g-mover').forEach(function (m) { m.classList.remove('is-on'); });
    var group = scope.querySelector('[data-route="' + id + '"]');
    var rides = Array.prototype.slice.call(group.querySelectorAll('[data-ride]'));
    var glows = Array.prototype.slice.call(group.querySelectorAll('.g-ride-glow'));
    var ride = rides[0] || null;
    var walk = group.querySelector('[data-walk]');
    var walkMask = group.querySelector('[data-walk-mask]');
    var mover = scope.querySelector('[data-mover]');
    // Weitere Fahrtrichtungen (A5 aus Frankfurt und aus Basel) bekommen je ein eigenes Symbol
    scope.querySelectorAll('[data-mover-extra]').forEach(function (m) { m.remove(); });
    var movers = rides.map(function (r, k) {
      if (k === 0) return mover;
      var c = mover.cloneNode(true);
      c.removeAttribute('data-mover');
      c.setAttribute('data-mover-extra', '');
      mover.parentNode.appendChild(c);
      return c;
    });
    var key = isSat() ? 'sat' : 'at';
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-steps="' + id + '"] li'));
    var rideLen = ride ? ride.getTotalLength() : 0;
    var walkLen = walk ? walk.getTotalLength() : 0;
    // Zu Fuß wird langsamer gezeigt: ein Pixel Fußweg zählt dreifach
    var total = rideLen + walkLen * 3;
    var split = rideLen / total;
    park.classList.toggle('is-hit', id === 'a5' || id === 'a8');
    if (stop) stop.classList.toggle('is-hit', id === 'tram');

    function render(p) {
      var r = split > 0 ? Math.min(1, p / split) : 1;
      var pt = null;
      rides.forEach(function (rd, k) {
        setDash(rd, r);
        if (glows[k]) setDash(glows[k], r);
        var q = rd.getPointAtLength(rd.getTotalLength() * r);
        if (k === 0) pt = q;
        else movers[k].setAttribute('transform', 'translate(' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + ')');
      });
      if (walk) {
        // Der Fußweg ist gepunktet: er wird über seine Maske freigelegt
        var w = p <= split ? 0 : (p - split) / (1 - split);
        setDash(walkMask, w);
        if (!ride || p > split) pt = walk.getPointAtLength(walkLen * w);
      }
      if (pt) mover.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
      items.forEach(function (li, i) {
        var at = parseFloat(li.dataset[key]);
        var next = i + 1 < items.length ? parseFloat(items[i + 1].dataset[key]) : 2;
        li.classList.toggle('is-past', p >= at);
        li.classList.toggle('is-now', p >= at && p < next && p < 1);
      });
    }

    movers.concat(rides.length ? [] : [mover]).forEach(function (m) { m.classList.add('is-on'); });
    if (reduce) { render(1); scope.querySelectorAll('.g-mover').forEach(function (m) { m.classList.remove('is-on'); }); root.classList.add('is-done'); return; }
    // Auf dem Luftbild erst loslegen, wenn der Zoom fast steht
    var delay = isSat() ? 1400 : 0;
    var duration = 4200 + walkLen * 4;
    var start = null;
    render(0);
    function tick(ts) {
      if (current !== id) return;
      if (start === null) start = ts + delay;
      var t = Math.max(0, Math.min(1, (ts - start) / duration));
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   // sanft anfahren und bremsen
      render(e);
      if (t < 1) frame = requestAnimationFrame(tick);
      else { root.classList.add('is-done'); items.forEach(function (li) { li.classList.remove('is-now'); }); }
    }
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

  // Ansicht Plan / Luftbild; das Luftbild lädt erst beim ersten Umschalten, der Weg spielt dort neu
  var views = root.querySelector('[data-views]');
  var credit = root.querySelector('[data-credit]');
  if (views && sat) {
    views.hidden = false;
    var img = sat.querySelector('image');
    views.querySelectorAll('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        var toSat = b.dataset.view === 'sat';
        if (toSat === isSat()) return;
        if (toSat && !img.getAttribute('href')) img.setAttribute('href', img.dataset.src);
        views.querySelectorAll('[data-view]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        root.classList.toggle('is-sat', toSat);
        if (credit) credit.hidden = !toSat;
        show(current);
      });
    });
  }

  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', function () {
      navigator.clipboard.writeText(copy.dataset.copy).then(function () {
        var l = copy.querySelector('[data-copy-label]');
        var old = l.textContent;
        l.textContent = copy.dataset.copied || 'Kopiert';
        setTimeout(function () { l.textContent = old; }, 1800);
      });
    });
  }

  // Vor dem Start den ersten Weg vollständig zeigen; abspielen, wenn die Karte ins Bild kommt
  plan.querySelectorAll('[data-route]').forEach(function (g) { g.classList.toggle('is-on', g.dataset.route === current); });
  var started = false;
  function startOnce() { if (!started) { started = true; show(current); } }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); startOnce(); }
    }, { threshold: 0.35 });
    io.observe(root.querySelector('.anf-map'));
  } else startOnce();
})();
