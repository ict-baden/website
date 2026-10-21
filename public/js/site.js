// Allgemeine Bedienung: Umschalter Hell/Dunkel, mobiles Menü, Markierung des sichtbaren Abschnitts im One-Pager,
// Sprache (Umschalter merken, Hinweis auf die englische Fassung bei nicht-deutscher Browsersprache).
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
    document.querySelectorAll('picture[data-theme-pic] > source[data-dark]').forEach(function (s) {
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

  // Sprache: Wer selbst umschaltet, dessen Wahl gilt künftig (localStorage „lang“). Keine automatische Umleitung –
  // geteilte Links und Suchmaschinen behalten immer die aufgerufene Sprache. Stattdessen zeigt eine deutsche Seite bei
  // nicht-deutscher Browsersprache unten einen schmalen Hinweis „English version →“ (auf die englische Fassung dieser Seite,
  // sonst /en/). Schließen merkt sich die Seite („lang-hint“).
  function language() {
    document.querySelectorAll('[data-lang-switch]').forEach(function (a) {
      a.addEventListener('click', function () { try { localStorage.setItem('lang', a.dataset.langSwitch); } catch (e) {} });
    });
    if ((root.getAttribute('lang') || 'de').indexOf('de') !== 0) return;
    var chosen = null, dismissed = null;
    try { chosen = localStorage.getItem('lang'); dismissed = localStorage.getItem('lang-hint'); } catch (e) {}
    if (chosen === 'de' || dismissed) return;
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'de'];
    if (String(langs[0] || 'de').toLowerCase().indexOf('de') === 0) return;
    var alt = document.querySelector('link[rel="alternate"][hreflang="en"]');
    var href = alt ? new URL(alt.href).pathname + location.hash : '/en/';
    var bar = document.createElement('div');
    bar.className = 'lang-hint';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Language');
    bar.lang = 'en';
    var link = document.createElement('a');
    link.href = href;
    link.hreflang = 'en';
    link.textContent = alt ? 'This page is also available in English →' : 'English version of this site →';
    link.addEventListener('click', function () { try { localStorage.setItem('lang', 'en'); } catch (e) {} });
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lang-hint-close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';
    close.addEventListener('click', function () {
      try { localStorage.setItem('lang-hint', '1'); } catch (e) {}
      bar.remove();
    });
    bar.appendChild(link);
    bar.appendChild(close);
    // Unten fixiert: verschiebt beim Einblenden nichts (kein Layout-Sprung); nach dem Sprunglink im DOM
    var skip = document.querySelector('.skip-link');
    document.body.insertBefore(bar, skip ? skip.nextSibling : document.body.firstChild);
  }

  function start() { language(); init(); spy(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
