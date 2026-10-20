// Allgemeine Bedienung: Umschalter Hell/Dunkel, mobiles Menü, Markierung des sichtbaren Abschnitts im One-Pager.
(function () {
  'use strict';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function effectiveDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : media.matches;
  }

  function sync(btn) {
    btn.setAttribute('aria-pressed', effectiveDark() ? 'true' : 'false');
  }

  // Bilder oben auf der Seite (<picture data-theme-pic>, siehe ThemeImage.astro) wählen die Fassung per Media-Query
  // nach dem System. Ist das Design über den Schalter gewählt, gilt diese Wahl.
  function syncPictures() {
    var t = root.getAttribute('data-theme');
    var q = t === 'dark' ? 'all' : t === 'light' ? 'not all' : '(prefers-color-scheme: dark)';
    document.querySelectorAll('picture[data-theme-pic] > source').forEach(function (s) {
      if (s.media !== q) s.media = q;
    });
  }

  function init() {
    syncPictures();
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.hidden = false;
      sync(btn);
      btn.addEventListener('click', function () {
        var next = effectiveDark() ? 'light' : 'dark';
        // Entspricht die Wahl dem System, wird nichts gespeichert – dann folgt die Seite wieder dem System
        if ((next === 'dark') === media.matches) {
          root.removeAttribute('data-theme');
          try { localStorage.removeItem('theme'); } catch (e) {}
        } else {
          root.setAttribute('data-theme', next);
          try { localStorage.setItem('theme', next); } catch (e) {}
        }
        sync(btn);
        syncPictures();
      });
      media.addEventListener('change', function () { sync(btn); });
    }

    var mnav = document.querySelector('[data-mnav]');
    if (mnav) {
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mnav.open) {
          mnav.open = false;
          mnav.querySelector('summary').focus();
        }
      });
      document.addEventListener('click', function (e) {
        if (mnav.open && !mnav.contains(e.target)) mnav.open = false;
      });
      mnav.addEventListener('toggle', function () {
        mnav.querySelector('summary').setAttribute('aria-label', mnav.open ? 'Menü schließen' : 'Menü');
      });
    }
  }

  // One-Pager: der Navigationspunkt des Abschnitts, der gerade im Bild ist, wird markiert (aria-current="location");
  // ein Klick im mobilen Menü schließt es
  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.site-header a[href^="/#"]'));
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(2)); }).filter(Boolean);
    var mnav = document.querySelector('[data-mnav]');
    links.forEach(function (a) { a.addEventListener('click', function () { if (mnav) mnav.open = false; }); });
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var visible = {};
    function mark() {
      var best = null;
      sections.forEach(function (s) { if (visible[s.id] && (!best || visible[s.id] > visible[best])) best = s.id; });
      links.forEach(function (a) {
        if (best && a.getAttribute('href') === '/#' + best) a.setAttribute('aria-current', 'location');
        else if (a.getAttribute('aria-current') === 'location') a.removeAttribute('aria-current');
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      mark();
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] });
    sections.forEach(function (s) { io.observe(s); });
  }

  function start() { init(); spy(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
