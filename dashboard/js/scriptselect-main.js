/* scriptselect-main.js — setup, edges, nodes, drag, tooltips, animation */

// =====================================================
// SETUP
// =====================================================
restorePositions(NODES, STORAGE_KEY);

var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });

var edgeSvg  = document.getElementById('edgeSvg');
var nodeSvg  = document.getElementById('nodeSvg');
var pctx     = document.getElementById('partCvs').getContext('2d');

// -- Regions --
addRegion(edgeSvg, 520, 150, 880, 200, '#ff4040', 'P1 \u2014 OVERRIDE',  'Highest priority \u2014 check first');
addRegion(edgeSvg, 620, 385, 420, 180, '#ee9612', 'P2 \u2014 GUARD',     'Human rep recency check');
addRegion(edgeSvg, 320, 565, 1010,200, '#60be35', 'P3 \u2014 HISTORY',   'Client email reply analysis');
addRegion(edgeSvg, 520, 810, 760, 190, '#e95400', 'P4 \u2014 STALENESS', 'Days since sent \u2014 fallback');

// "FIRST MATCH WINS" annotation
(function() {
  var g = svgEl('g', {});
  g.appendChild(svgEl('rect', {
    x: '820', y: '8', width: '280', height: '22', rx: '3',
    fill: '#9f00fa12', stroke: '#9f00fa40', 'stroke-width': '1'
  }));
  var t = svgEl('text', {
    x: '960', y: '23', fill: '#9f00fa',
    'font-family': 'Barlow Condensed, sans-serif', 'font-size': '13',
    'font-weight': '700', 'text-anchor': 'middle', 'letter-spacing': '0.18em'
  });
  t.textContent = '\u25C8  FIRST MATCH WINS  \u2014  PRIORITY CASCADE  \u25C8';
  g.appendChild(t);
  edgeSvg.appendChild(g);
})();

// -- Arrow markers --
var defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#d36eff','#585858'].forEach(function(col) {
  var m = svgEl('marker', {id: 'arr' + col.slice(1),
    markerUnits: 'userSpaceOnUse', markerWidth: '8', markerHeight: '6',
    refX: '7', refY: '3', orient: 'auto'});
  m.appendChild(svgEl('path', {d: 'M0,0 L8,3 L0,6 Z', fill: col + 'bb'}));
  defs.appendChild(m);
});
var style = svgEl('style', {});
style.textContent = '@keyframes diamond-pulse{0%{filter:drop-shadow(0 0 0 rgba(159,0,250,.5))}50%{filter:drop-shadow(0 0 8px rgba(159,0,250,.3))}100%{filter:drop-shadow(0 0 0 rgba(159,0,250,.5))}}';
defs.appendChild(style);
edgeSvg.insertBefore(defs, edgeSvg.firstChild);

// =====================================================
// EDGES
// =====================================================
var allEdges = [];
EDGES.forEach(function(e) {
  var n1 = nm[e.f], n2 = nm[e.t];
  if (!n1 || !n2) return;
  var b1 = clipToBorder(n1, n2.x, n2.y);
  var b2 = clipToBorder(n2, n1.x, n1.y);
  var fwd = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff || 0);
  allEdges.push({f:e.f, t:e.t, c:e.c, lbl:e.lbl, spd:e.spd, poff:e.poff,
    x1:fwd.x1, y1:fwd.y1, cp1x:fwd.cp1x, cp1y:fwd.cp1y,
    cp2x:fwd.cp2x, cp2y:fwd.cp2y, x2:fwd.x2, y2:fwd.y2, rev:false});
});

allEdges.forEach(function(e) {
  var d = 'M ' + e.x1 + ',' + e.y1 + ' C ' + e.cp1x + ',' + e.cp1y + ' ' + e.cp2x + ',' + e.cp2y + ' ' + e.x2 + ',' + e.y2;
  e._glow = svgEl('path', {d:d, fill:'none', stroke:e.c, 'stroke-width':'6', 'stroke-opacity':'0.05'});
  edgeSvg.appendChild(e._glow);
  var dash = e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6');
  e._main = svgEl('path', {d:d, fill:'none', stroke:e.c,
    'stroke-width': e.spd >= 4 ? '2' : '1.5', 'stroke-opacity': '0.42',
    'stroke-dasharray': dash, 'marker-end': 'url(#arr' + e.c.slice(1) + ')'});
  edgeSvg.appendChild(e._main);
  if (e.lbl) {
    var mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, .5);
    e._lblBg = svgEl('text', {x:mp.x, y:mp.y - 5, fill:'#141414', 'font-size':'8',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle',
      stroke:'#141414', 'stroke-width':'3', 'stroke-linejoin':'round'});
    e._lblBg.textContent = e.lbl; edgeSvg.appendChild(e._lblBg);
    e._lblTx = svgEl('text', {x:mp.x, y:mp.y - 5, fill:e.c, 'font-size':'8',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle',
      opacity:'0.75', 'letter-spacing':'0.06em'});
    e._lblTx.textContent = e.lbl; edgeSvg.appendChild(e._lblTx);
  }
  // Hit-area for edge hover
  e._hitPath = svgEl('path', {d:d, fill:'none', stroke:'transparent', 'stroke-width':'18', 'pointer-events':'stroke', cursor:'pointer'});
  edgeSvg.appendChild(e._hitPath);
  (function(edge) {
    edge._hitPath.addEventListener('mouseenter', function(ev) { showEdgeTooltip(edge, ev); });
    edge._hitPath.addEventListener('mousemove', function(ev) { moveTooltip(ev); });
    edge._hitPath.addEventListener('mouseleave', function() { hideTooltip(); });
  })(e);
});

function rebuildEdgesForNode(nodeId) {
  allEdges.forEach(function(e) {
    if (e.f !== nodeId && e.t !== nodeId) return;
    var b1 = clipToBorder(nm[e.f], nm[e.t].x, nm[e.t].y);
    var b2 = clipToBorder(nm[e.t], nm[e.f].x, nm[e.f].y);
    var ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff || 0);
    e.x1 = ep.x1; e.y1 = ep.y1; e.cp1x = ep.cp1x; e.cp1y = ep.cp1y;
    e.cp2x = ep.cp2x; e.cp2y = ep.cp2y; e.x2 = ep.x2; e.y2 = ep.y2;
    var d = 'M ' + ep.x1 + ',' + ep.y1 + ' C ' + ep.cp1x + ',' + ep.cp1y +
            ' ' + ep.cp2x + ',' + ep.cp2y + ' ' + ep.x2 + ',' + ep.y2;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hitPath) e._hitPath.setAttribute('d', d);
    if (e._lblBg) {
      var mp = cbPt(ep.x1, ep.y1, ep.cp1x, ep.cp1y, ep.cp2x, ep.cp2y, ep.x2, ep.y2, .5);
      e._lblBg.setAttribute('x', mp.x); e._lblBg.setAttribute('y', mp.y - 5);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x); e._lblTx.setAttribute('y', mp.y - 5); }
    }
  });
}

// =====================================================
// NODES
// =====================================================
var nodeGroups = {};
var edgeHighlight = [];
allEdges.forEach(function(e) {
  if (e._main) edgeHighlight.push({el: e._main, from: e.f, to: e.t, baseOp: '0.42'});
});

function attachNodeEvents(g, n) {
  g.addEventListener('mouseenter', function(e2) {
    if (dragState.id) return;
    var conn = {}; conn[n.id] = true;
    EDGES.forEach(function(e) {
      if (e.f === n.id) conn[e.t] = true;
      if (e.t === n.id) conn[e.f] = true;
    });
    NODES.forEach(function(nd) {
      var grp = nodeGroups[nd.id];
      if (grp) grp.setAttribute('opacity', conn[nd.id] ? '1' : '0.15');
    });
    edgeHighlight.forEach(function(item) {
      item.el.setAttribute('stroke-opacity', (item.from === n.id || item.to === n.id) ? '0.9' : '0.025');
    });
    showTooltip(n, e2);
  });
  g.addEventListener('mousemove', function(e2) { if (!dragState.id) moveTooltip(e2); });
  g.addEventListener('mouseleave', function() {
    if (dragState.id) return;
    NODES.forEach(function(nd) { var grp = nodeGroups[nd.id]; if (grp) grp.setAttribute('opacity', '1'); });
    edgeHighlight.forEach(function(item) { item.el.setAttribute('stroke-opacity', item.baseOp); });
    hideTooltip();
  });
  g.addEventListener('mousedown', function(e2) { startDrag(e2, n.id); });
}

NODES.forEach(function(n) {
  var shape = NODE_SHAPES[n.id] || 'leaf';
  var g = shape === 'diamond' ? drawDiamond(n) : shape === 'keyrule' ? drawKeyRule(n) : drawLeaf(n);
  nodeGroups[n.id] = g;
  attachNodeEvents(g, n);
  nodeSvg.appendChild(g);
});

// =====================================================
// UPDATE NODE POSITION (for drag)
// =====================================================
function updateNodePosition(nodeId) {
  var n = nm[nodeId], g = nodeGroups[nodeId];
  if (!g || !n) return;
  var shape = NODE_SHAPES[nodeId] || 'leaf';
  var parent = g.parentNode, nextSibling = g.nextSibling;
  parent.removeChild(g);
  var newG = shape === 'diamond' ? drawDiamond(n) : shape === 'keyrule' ? drawKeyRule(n) : drawLeaf(n);
  nodeGroups[nodeId] = newG;
  attachNodeEvents(newG, n);
  if (nextSibling) parent.insertBefore(newG, nextSibling);
  else parent.appendChild(newG);
}
