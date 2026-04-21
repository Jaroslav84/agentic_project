/* transfer-main.js — setup, edge building, node rendering, drag for Warm Transfer graph */

// Restore saved positions
restorePositions(NODES, STORAGE_KEY);

// Node lookup map
var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });

// DOM references
var mainSvg = document.getElementById('mainSvg');
var pctx    = document.getElementById('partCvs').getContext('2d');

// Region backdrops (lowest z-order)
addRegion(mainSvg, 580, 38,  440, 580, '#60be35', 'LIVE CALL',  'Engagement detection through rep answer');
addRegion(mainSvg, 580, 640, 390, 340, '#9f00fa', 'POST-CALL',  'Attribution, monitoring, outcomes');
addRegion(mainSvg, 220, 478, 380, 310, '#ff4040', 'FALLBACK',   'All reps unavailable path');

// Arrow markers + glow filter
var defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#d36eff'].forEach(function(col) {
  var m = svgEl('marker', {id:'arr'+col.slice(1),
    markerUnits:'userSpaceOnUse', markerWidth:'8', markerHeight:'6',
    refX:'7', refY:'3', orient:'auto'});
  m.appendChild(svgEl('path', {d:'M0,0 L8,3 L0,6 Z', fill:col+'bb'}));
  defs.appendChild(m);
});
var flt = svgEl('filter', {id:'glow', x:'-50%', y:'-50%', width:'200%', height:'200%'});
flt.appendChild(svgEl('feGaussianBlur', {stdDeviation:'3', result:'blur'}));
var feMerge = svgEl('feMerge', {});
feMerge.appendChild(svgEl('feMergeNode', {'in':'blur'}));
feMerge.appendChild(svgEl('feMergeNode', {'in':'SourceGraphic'}));
flt.appendChild(feMerge);
defs.appendChild(flt);
mainSvg.insertBefore(defs, mainSvg.firstChild);

// SVG layers
var edgeLayer = svgEl('g', {id:'edge-layer'});
mainSvg.appendChild(edgeLayer);
var nodeLayer = svgEl('g', {id:'node-layer', 'pointer-events':'all'});
mainSvg.appendChild(nodeLayer);

// Build edges
var allEdges = [];
EDGES.forEach(function(e) {
  var n1 = nm[e.f], n2 = nm[e.t];
  if (!n1 || !n2) return;
  var b1 = clipToBorder(n1, n2.x, n2.y);
  var b2 = clipToBorder(n2, n1.x, n1.y);
  var fwd = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff||0);
  allEdges.push(Object.assign({}, e, fwd, {rev:false}));
});

// Render edges
allEdges.forEach(function(e) {
  var d = 'M '+e.x1+','+e.y1+' C '+e.cp1x+','+e.cp1y+' '+e.cp2x+','+e.cp2y+' '+e.x2+','+e.y2;
  var glow = svgEl('path', {d:d, fill:'none', stroke:e.c, 'stroke-width':'6', 'stroke-opacity':'0.05'});
  edgeLayer.appendChild(glow); e._glow = glow;
  var dash = e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6');
  var main = svgEl('path', {d:d, fill:'none', stroke:e.c,
    'stroke-width':e.spd >= 4 ? '2' : '1.5',
    'stroke-opacity':'0.42', 'stroke-dasharray':dash,
    'marker-end':'url(#arr'+e.c.slice(1)+')'});
  edgeLayer.appendChild(main); e._main = main;
  if (e.lbl) {
    var mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, .5);
    var bg = svgEl('text', {x:mp.x, y:mp.y-5, fill:'#141414', 'font-size':'8',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle',
      stroke:'#141414', 'stroke-width':'3', 'stroke-linejoin':'round'});
    bg.textContent = e.lbl; edgeLayer.appendChild(bg); e._lblBg = bg;
    var tx = svgEl('text', {x:mp.x, y:mp.y-5, fill:e.c, 'font-size':'8',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle',
      opacity:'0.75', 'letter-spacing':'0.06em'});
    tx.textContent = e.lbl; edgeLayer.appendChild(tx); e._lblTx = tx;
  }
  var hitPath = svgEl('path', {d:d, fill:'none', stroke:'transparent',
    'stroke-width':'18', 'pointer-events':'stroke', cursor:'pointer'});
  edgeLayer.appendChild(hitPath);
  e._hit = hitPath;
  (function(edge) {
    hitPath.addEventListener('mouseenter', function(ev) { showEdgeTooltip(edge, ev); });
    hitPath.addEventListener('mousemove', function(ev) { moveTooltip(ev); });
    hitPath.addEventListener('mouseleave', function() { hideTooltip(); });
  })(e);
});

// Edge highlight refs
var nodeGroups = {};
var edgeHighlight = [];
allEdges.forEach(function(e) {
  if (e._main) edgeHighlight.push({el:e._main, from:e.f, to:e.t, baseOp:'0.42'});
});

// Bind hover + drag events to a node group
function bindNodeEvents(g, n) {
  g.addEventListener('mouseenter', function(e2) {
    if (dragState.id) return;
    var conn = new Set([n.id]);
    EDGES.forEach(function(e) { if (e.f === n.id) conn.add(e.t); if (e.t === n.id) conn.add(e.f); });
    NODES.forEach(function(nd) {
      var grp = nodeGroups[nd.id]; if (!grp) return;
      if (!conn.has(nd.id)) { grp.classList.add('dimmed'); grp.classList.remove('lit'); }
      else { grp.classList.add('lit'); grp.classList.remove('dimmed'); }
    });
    edgeHighlight.forEach(function(h) {
      h.el.setAttribute('stroke-opacity', (h.from === n.id || h.to === n.id) ? '0.9' : '0.025');
    });
    showTooltip(n, e2);
  });
  g.addEventListener('mousemove', function(e2) { if (!dragState.id) moveTooltip(e2); });
  g.addEventListener('mouseleave', function() {
    if (dragState.id) return;
    NODES.forEach(function(nd) { var grp = nodeGroups[nd.id]; if (grp) grp.classList.remove('dimmed','lit'); });
    edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
    hideTooltip();
  });
  g.addEventListener('mousedown', function(e2) { startDrag(e2, n.id); });
}

// Render all nodes
NODES.forEach(function(n) {
  var g = renderNode(n);
  nodeGroups[n.id] = g;
  nodeLayer.appendChild(g);
  bindNodeEvents(g, n);
});

// Update node position (rebuild SVG group in place)
function updateNodePosition(nodeId) {
  var n = nm[nodeId], oldG = nodeGroups[nodeId];
  if (!oldG) return;
  var newG = renderNode(n);
  if (oldG.classList.contains('dragging')) newG.classList.add('dragging');
  nodeLayer.replaceChild(newG, oldG);
  nodeGroups[nodeId] = newG;
  bindNodeEvents(newG, n);
}

// Drag
function startDrag(e, nodeId) {
  hideTooltip();
  var wrap = document.getElementById('graphWrap');
  dragState.id = nodeId;
  dragState.startMx = e.clientX; dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x; dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft; dragState.scrollY = wrap.scrollTop;
  var grp = nodeGroups[nodeId];
  if (grp) grp.classList.add('dragging');
  NODES.forEach(function(nd) { var g = nodeGroups[nd.id]; if (g) g.classList.remove('dimmed','lit'); });
  edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
  e.preventDefault(); e.stopPropagation();
}
document.addEventListener('mousemove', function(e) {
  if (!dragState.id) return;
  var wrap = document.getElementById('graphWrap');
  var dx = e.clientX - dragState.startMx + (wrap.scrollLeft - dragState.scrollX);
  var dy = e.clientY - dragState.startMy + (wrap.scrollTop - dragState.scrollY);
  nm[dragState.id].x = dragState.startNx + dx;
  nm[dragState.id].y = dragState.startNy + dy;
  updateNodePosition(dragState.id);
  rebuildEdgesForNode(dragState.id);
});
document.addEventListener('mouseup', function() {
  if (!dragState.id) return;
  var grp = nodeGroups[dragState.id];
  if (grp) grp.classList.remove('dragging');
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});
