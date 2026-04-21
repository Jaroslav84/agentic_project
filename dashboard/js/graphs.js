/* graphs.js — Sub-tab navigation for cc_graphs.html (Design graphs shell) */

function showG(name, btn) {
  document.querySelectorAll('.stb').forEach(function(b) { b.classList.remove('on'); });
  btn.classList.add('on');
  document.querySelectorAll('.gf').forEach(function(f) { f.classList.remove('on'); });
  var fr = document.getElementById('gf-' + name);
  // Lazy-load: set src from data-src on first visit
  if (!fr.getAttribute('src') && fr.dataset.src) { fr.src = fr.dataset.src; }
  fr.classList.add('on');
}
