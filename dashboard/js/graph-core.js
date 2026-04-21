/* graph-core.js — shared utilities for all Sales AI graph pages */

// SVG element factory
function svgEl(tag, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) Object.keys(attrs).forEach(function(k){ el.setAttribute(k, attrs[k]); });
  return el;
}

// Inline SVG icon (20x20 viewBox, stroke-based)
function icon(path, extra) {
  return '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor"' +
    ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ' +
    (extra||'') + '><path d="' + path + '"/></svg>';
}

// Enlarged icon for tooltip header (reads global ICONS)
function iconLg(id, color) {
  var p = ICONS[id]; if (!p) return '';
  return p.replace('width="20" height="20"', 'width="28" height="28"')
          .replace('stroke="currentColor"', 'stroke="' + color + '"');
}

// Cubic bezier point at parameter t
function cbPt(x1,y1,cx1,cy1,cx2,cy2,x2,y2,t) {
  var u = 1-t;
  return {
    x: u*u*u*x1 + 3*u*u*t*cx1 + 3*u*t*t*cx2 + t*t*t*x2,
    y: u*u*u*y1 + 3*u*u*t*cy1 + 3*u*t*t*cy2 + t*t*t*y2
  };
}

// Fullscreen toggle
function toggleFS() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(function(){});
}
document.addEventListener('fullscreenchange', function() {
  var b = document.getElementById('fsBtn');
  if (b) b.textContent = document.fullscreenElement ? '\u2716' : '\u26F6';
});

// Drag state (shared across drag handlers)
var dragState = { id:null, startMx:0, startMy:0, startNx:0, startNy:0, scrollX:0, scrollY:0 };

// localStorage position persistence
function restorePositions(nodes, key) {
  try {
    var sp = JSON.parse(localStorage.getItem(key));
    if (sp) nodes.forEach(function(n) {
      if (sp[n.id]) { n.x = sp[n.id].x; n.y = sp[n.id].y; }
    });
  } catch(e) {}
}
function savePositions(nodes, key) {
  try {
    var p = {};
    nodes.forEach(function(n) { p[n.id] = {x:n.x, y:n.y}; });
    localStorage.setItem(key, JSON.stringify(p));
  } catch(e) {}
}

// Tooltip positioning + visibility
var tt = document.getElementById('tt');
function moveTooltip(e2) {
  var W = window.innerWidth, H = window.innerHeight;
  var TW = tt.offsetWidth || 404, TH = tt.offsetHeight || 340;
  var x = e2.clientX + 16, y = e2.clientY - 12;
  if (x + TW > W - 8) x = e2.clientX - TW - 16;
  if (y + TH > H - 8) y = H - TH - 8;
  if (y < 8) y = 8;
  tt.style.left = x + 'px'; tt.style.top = y + 'px';
}
function hideTooltip() { tt.style.display = 'none'; }

// Dashed region box (svg parent passed as parameter)
function addRegion(svgParent, x,y,w,h, col, label, sublabel) {
  var g = svgEl('g', {'pointer-events':'none'});
  g.appendChild(svgEl('rect', {x:x, y:y, width:w, height:h, rx:'4',
    fill:col+'07', stroke:col+'20', 'stroke-width':'1', 'stroke-dasharray':'6,4'}));
  var t = svgEl('text', {x:x+10, y:y+15, fill:col+'55', 'font-size':'9',
    'font-family':'var(--mono)', 'letter-spacing':'0.16em', 'font-weight':'500'});
  t.textContent = label; g.appendChild(t);
  if (sublabel) {
    var s = svgEl('text', {x:x+10, y:y+27, fill:col+'35', 'font-size':'8',
      'font-family':'var(--mono)', 'letter-spacing':'0.1em'});
    s.textContent = sublabel; g.appendChild(s);
  }
  svgParent.appendChild(g);
}
