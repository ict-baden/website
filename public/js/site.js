// Allgemeine Bedienung: Umschalter Hell/Dunkel, mobiles Menü, Markierung des sichtbaren Abschnitts im One-Pager,
// Sprache (Umschalter merken, beim ersten Besuch nach der Browsersprache).
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
        var sum = mnav.querySelector('summary');
        sum.setAttribute('aria-label', mnav.open ? (sum.dataset.labelClose || 'Menü schließen') : (sum.dataset.labelOpen || 'Menü'));
      });
    }
  }

  // One-Pager: der Navigationspunkt des Abschnitts, der gerade im Bild ist, wird markiert (aria-current="location");
  // ein Klick im mobilen Menü schließt es
  function spy() {
    // Nur Links auf Abschnitte dieser Seite (/#… auf Deutsch, /en/#… auf Englisch)
    var links = Array.prototype.slice.call(document.querySelectorAll('.site-header a[data-spy]')).filter(function (a) {
      return a.pathname === location.pathname && a.hash.length > 1;
    });
    var sections = links.map(function (a) { return document.getElementById(a.hash.slice(1)); }).filter(Boolean);
    var mnav = document.querySelector('[data-mnav]');
    links.forEach(function (a) { a.addEventListener('click', function () { if (mnav) mnav.open = false; }); });
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var visible = {};
    function mark() {
      var best = null;
      sections.forEach(function (s) { if (visible[s.id] && (!best || visible[s.id] > visible[best])) best = s.id; });
      links.forEach(function (a) {
        if (best && a.hash === '#' + best) a.setAttribute('aria-current', 'location');
        else if (a.getAttribute('aria-current') === 'location') a.removeAttribute('aria-current');
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      mark();
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] });
    sections.forEach(function (s) { io.observe(s); });
  }

  // Sprache: Wer selbst umschaltet, dessen Wahl gilt künftig (localStorage). Beim ersten Besuch der deutschen
  // Startseite führt eine Browsersprache, die nicht mit Deutsch beginnt, zur englischen Fassung – nur dort und nur
  // ohne eigene Wahl, damit geteilte Links und Suchmaschinen die gewünschte Sprache behalten.
  function language() {
    document.querySelectorAll('[data-lang-switch]').forEach(function (a) {
      a.addEventListener('click', function () { try { localStorage.setItem('lang', a.dataset.langSwitch); } catch (e) {} });
    });
    if (location.pathname !== '/') return;
    var chosen = null;
    try { chosen = localStorage.getItem('lang'); } catch (e) {}
    if (chosen) return;
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'de'];
    var first = String(langs[0] || 'de').toLowerCase();
    if (first.indexOf('de') !== 0) location.replace('/en/' + location.hash.replace(/^#.*/, ''));
  }

  function start() { language(); init(); spy(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
