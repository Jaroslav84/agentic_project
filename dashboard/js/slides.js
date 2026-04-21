/* ─────────────────────────────────────────────────────────
   slides.js — Slide navigation, keyboard, touch, fullscreen
   Globals exposed: goTo, nextSlide, prevSlide, toggleFullscreen
   ───────────────────────────────────────────────────────── */

var total = document.querySelectorAll('.slides-track .slide').length;
var current = 0;
var labels = [
  '00 Hero', '01 Problem', '02 Deal', '03 Mission',
  '04 Intel', '05 Data', '06 Arch', '07 Sequence',
  '08 Scripts', '09 Transfer', '10 Performance', '11 Contacts',
  '12 Gantt', '13 Todos', '14 Questions', '15 Closing'
];

// ── Build nav dots ──
var dotsEl = document.getElementById('navDots');
for (var i = 0; i < total; i++) {
  var d = document.createElement('button');
  d.className = 'nav-dot' + (i === 0 ? ' on' : '');
  d.textContent = i;
  d.title = labels[i] || ('Slide ' + i);
  d.setAttribute('data-i', i);
  d.onclick = (function(idx) { return function() { goTo(idx); }; })(i);
  dotsEl.appendChild(d);
}

// ── Navigation ──
function slideWidth() {
  return document.getElementById('viewport').offsetWidth;
}

function goTo(n) {
  current = Math.max(0, Math.min(total - 1, n));
  document.getElementById('track').style.transform = 'translateX(-' + (current * slideWidth()) + 'px)';
  document.getElementById('navCounter').textContent = (current + 1) + ' / ' + total;
  document.querySelectorAll('.nav-dot').forEach(function(d, i) {
    d.classList.toggle('on', i === current);
  });
  var activeDot = dotsEl.querySelector('.nav-dot.on');
  if (activeDot) activeDot.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

window.addEventListener('resize', function() { goTo(current); });

function nextSlide() { goTo(current + 1); }
function prevSlide() { goTo(current - 1); }

// ── Keyboard ──
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') nextSlide();
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
  if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  if (e.key === 'Escape') exitFullscreen();
});

// ── Fullscreen ──
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(function() {});
    document.getElementById('fsBtn').textContent = '\u2715 Exit Full';
  } else {
    document.exitFullscreen();
    document.getElementById('fsBtn').textContent = '\u26F6 Fullscreen';
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
}

document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) {
    document.getElementById('fsBtn').textContent = '\u26F6 Fullscreen';
  }
  setTimeout(function() { goTo(current); }, 50);
});

// ── Touch swipe ──
var touchX = null;
document.addEventListener('touchstart', function(e) {
  touchX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
  if (touchX === null) return;
  var dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) { dx < 0 ? nextSlide() : prevSlide(); }
  touchX = null;
}, { passive: true });

// ── postMessage API — parent can control slides ──
window.addEventListener('message', function(e) {
  if (!window.matchOrigin(e.origin)) return;
  if (!e.data) return;
  if (e.data.action === 'goto') goTo(e.data.slide || 0);
  if (e.data.action === 'next') nextSlide();
  if (e.data.action === 'prev') prevSlide();
  if (e.data.action === 'fullscreen') toggleFullscreen();
});
