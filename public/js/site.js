// Allgemeine Bedienung: Umschalter Hell/Dunkel, mobiles Menü.
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
