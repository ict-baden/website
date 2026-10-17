// Produktübersicht: Filter nach Produktlinie und Status. Ohne JavaScript sind alle Produkte sichtbar.
(function () {
  'use strict';
  var root = document.querySelector('[data-filters]');
  if (!root) return;
  var chips = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
  var items = Array.prototype.slice.call(document.querySelectorAll('.pgrid > li'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-line-section]'));
  var grids = Array.prototype.slice.call(document.querySelectorAll('.pgrid'));
  var result = root.querySelector('[data-result]');
  var empty = document.querySelector('[data-empty]');
  var state = { linie: '', status: '' };

  var params = new URLSearchParams(window.location.search);
  ['linie', 'status'].forEach(function (key) {
    var v = params.get(key) || '';
    if (chips.some(function (c) { return c.dataset.filter === key && c.dataset.value === v; })) state[key] = v;
  });

  function word(n) { return n === 1 ? '1 Produkt' : n + ' Produkte'; }

  function apply(push) {
    var visible = 0;
    items.forEach(function (li) {
      var ok = (!state.linie || li.dataset.linie === state.linie) && (!state.status || li.dataset.status === state.status);
      li.hidden = !ok;
      if (ok) visible++;
    });
    grids.forEach(function (g) {
      // Zahl der sichtbaren Karten fürs Raster (data-n, data-r3, data-odd, .is-last – siehe .pgrid im CSS)
      var shown = Array.prototype.filter.call(g.children, function (li) { return !li.hidden; });
      g.hidden = shown.length === 0;
      g.dataset.n = String(shown.length);
      g.dataset.r3 = String(shown.length % 3);
      g.toggleAttribute('data-odd', shown.length % 2 === 1);
      Array.prototype.forEach.call(g.children, function (li) { li.classList.toggle('is-last', li === shown[shown.length - 1]); });
    });
    sections.forEach(function (sec) {
      var n = sec.querySelectorAll('.pgrid > li:not([hidden])').length;
      sec.hidden = n === 0;
      var count = sec.querySelector('[data-line-count]');
      if (count) count.textContent = word(n);
    });
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', state[c.dataset.filter] === c.dataset.value ? 'true' : 'false');
    });
    result.textContent = (state.linie || state.status) ? word(visible) + ' gefunden' : word(visible);
    empty.hidden = visible > 0;
    if (push) {
      var q = new URLSearchParams();
      if (state.linie) q.set('linie', state.linie);
      if (state.status) q.set('status', state.status);
      var qs = q.toString();
      history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
    }
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      state[c.dataset.filter] = c.dataset.value;
      apply(true);
      // Sichtbar halten, falls die Leiste waagerecht scrollt
      if (c.scrollIntoView) c.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });
  var reset = document.querySelector('[data-reset]');
  if (reset) reset.addEventListener('click', function () { state = { linie: '', status: '' }; apply(true); });

  // Klebt die Leiste unter der Kopfzeile, wird sie flach (.is-stuck). Der äußere Abstand gleicht die
  // gesparte Höhe aus, damit der Inhalt darunter nicht springt.
  var stuck = false;
  function setStuck(on) {
    stuck = on;
    if (on) {
      var h = root.offsetHeight;
      root.classList.add('is-stuck');
      root.style.marginBottom = (h - root.offsetHeight) + 'px';
    } else {
      root.classList.remove('is-stuck');
      root.style.marginBottom = '';
    }
  }
  var queued = false;
  function checkStuck() {
    queued = false;
    var cs = window.getComputedStyle(root);
    var on = cs.position === 'sticky' && window.scrollY > 0 && root.getBoundingClientRect().top <= (parseFloat(cs.top) || 0) + 1;
    if (on !== stuck) setStuck(on);
  }
  function queue() { if (!queued) { queued = true; window.requestAnimationFrame(checkStuck); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);

  root.hidden = false;
  apply(false);
  checkStuck();
})();
