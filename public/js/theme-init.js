// Wird blockierend im <head> geladen: setzt ein gespeichertes Design, bevor die Seite gezeichnet wird.
(function () {
  document.documentElement.classList.add('js');
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) { /* kein Speicher verfügbar: System-Einstellung gilt */ }
})();
