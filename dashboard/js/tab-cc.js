/* tab-cc.js — Sub-tab navigation + batch banner for tab_cc.html (Command & Control) */

function showCC(name, btn) {
  document.querySelectorAll('.stb').forEach(function(b) { b.classList.remove('on'); });
  btn.classList.add('on');
  document.querySelectorAll('.ccf').forEach(function(f) { f.classList.remove('on'); });
  var fr = document.getElementById('ccf-' + name);
  if (!fr.getAttribute('src') && fr.dataset.src) { fr.src = fr.dataset.src; }
  fr.classList.add('on');
  document.getElementById('batchbar').style.display = name === 'queue' ? 'flex' : 'none';
}
