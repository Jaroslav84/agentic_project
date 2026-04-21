/* stateflow-main.js — setup, drag, tooltips, particle animation */
restorePositions(NODES, STORAGE_KEY);
var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });
nm['_init']  = {id: '_init',  x: 80,   y: 200};
nm['_final'] = {id: '_final', x: 1700, y: 200};
var svg  = document.getElementById('edgeSvg');
var root = document.getElementById('cnv');
var pctx = document.getElementById('partCvs').getContext('2d');

addRegion(svg, 130, 100, 1050, 260, '#60be35', 'PHIL WORKER', 'Ephemeral GPU \u00b7 RunPod Template \u00b7 BOOTING through IDLE');
addRegion(svg, 1280, 100, 350, 200, '#e95400', 'RUNPOD API', 'Teardown \u00b7 DESTROYING through DEAD');
addRegion(svg, 530, 360, 530, 240, '#ff4040', 'ERROR HANDLING', 'Health failures \u00b7 Crash recovery \u00b7 Retry logic');

// Arrow marker definitions
var defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#585858','#ffffff'].forEach(function(col) {
  var m = svgEl('marker', {id: 'arr' + col.slice(1),
    markerUnits: 'userSpaceOnUse', markerWidth: '8', markerHeight: '6',
    refX: '7', refY: '3', orient: 'auto'});
  m.appendChild(svgEl('path', {d: 'M0,0 L8,3 L0,6 Z', fill: col + 'bb'}));
  defs.appendChild(m);
});
svg.insertBefore(defs, svg.firstChild);

// Build all edges (real + pseudo)
var allEdges = [];
EDGES.concat(PSEUDO_EDGES).forEach(function(e) {
  var path = computeEdgePath(e);
  if (!path) return;
  allEdges.push(Object.assign({}, e, path));
});
allEdges.forEach(function(e) {
  var d = 'M ' + e.x1 + ',' + e.y1 + ' C ' + e.cp1x + ',' + e.cp1y + ' ' + e.cp2x + ',' + e.cp2y + ' ' + e.x2 + ',' + e.y2;
  var glow = svgEl('path', {d: d, fill: 'none', stroke: e.c, 'stroke-width': '6', 'stroke-opacity': '0.05'});
  svg.appendChild(glow); e._glow = glow;
  var dash = e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6');
  var main = svgEl('path', {d: d, fill: 'none', stroke: e.c,
    'stroke-width': e.spd >= 3 ? '2' : '1.5', 'stroke-opacity': '0.42',
    'stroke-dasharray': dash, 'marker-end': 'url(#arr' + e.c.slice(1) + ')'});
  svg.appendChild(main); e._main = main;
  if (e.lbl) {
    var mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, 0.5);
    var lblY = mp.y - 5;
    if (e.arc === 'above') lblY = mp.y - 8;
    if (e.arc === 'abort') lblY = mp.y + 14;
    var bg = svgEl('text', {x: mp.x, y: lblY, fill: '#141414', 'font-size': '8',
      'font-family': 'JetBrains Mono,monospace', 'text-anchor': 'middle',
      stroke: '#141414', 'stroke-width': '3', 'stroke-linejoin': 'round', 'font-style': 'italic'});
    bg.textContent = e.lbl; svg.appendChild(bg); e._lblBg = bg;
    var tx = svgEl('text', {x: mp.x, y: lblY, fill: e.c, 'font-size': '8',
      'font-family': 'JetBrains Mono,monospace', 'text-anchor': 'middle',
      opacity: '0.75', 'letter-spacing': '0.06em', 'font-style': 'italic'});
    tx.textContent = e.lbl; svg.appendChild(tx); e._lblTx = tx;
  }
  var hitPath = svgEl('path', {d: d, fill: 'none', stroke: 'transparent', 'stroke-width': '18', 'pointer-events': 'stroke', cursor: 'pointer'});
  svg.appendChild(hitPath); e._hit = hitPath;
  (function(edge) {
    hitPath.addEventListener('mouseenter', function(ev) { showEdgeTooltip(edge, ev); });
    hitPath.addEventListener('mousemove', function(ev) { moveTooltip(ev); });
    hitPath.addEventListener('mouseleave', function() { hideTooltip(); });
  })(e);
});

// State groups, edge highlighting, pseudo-state markers
var stateGroups = {};
var edgeHighlight = [];
allEdges.forEach(function(e) { if (e._main) edgeHighlight.push({el: e._main, from: e.f, to: e.t, baseOp: '0.42'}); });
(function() { // Initial pseudo-state: filled circle
  var g = svgEl('g', {}); g.appendChild(svgEl('circle', {cx: 80, cy: 200, r: '10', fill: '#ffffff', opacity: '0.8'})); svg.appendChild(g);
})();
(function() { // Final pseudo-state: bullseye
  var g = svgEl('g', {});
  g.appendChild(svgEl('circle', {cx: 1700, cy: 200, r: '12', fill: 'none', stroke: '#585858', 'stroke-width': '2'}));
  g.appendChild(svgEl('circle', {cx: 1700, cy: 200, r: '6', fill: '#585858'})); svg.appendChild(g);
})();

// Create all state SVG groups with event handlers
NODES.forEach(function(n) {
  var g = renderState(n);
  svg.appendChild(g);
  stateGroups[n.id] = g;
  g.addEventListener('mouseenter', function(e2) {
    if (dragState.id) return;
    var conn = new Set([n.id]);
    EDGES.forEach(function(edge) { if (edge.f === n.id) conn.add(edge.t); if (edge.t === n.id) conn.add(edge.f); });
    NODES.forEach(function(nd) { var sg = stateGroups[nd.id]; if (sg) sg.setAttribute('opacity', conn.has(nd.id) ? '1' : '0.15'); });
    edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', (h.from === n.id || h.to === n.id) ? '0.9' : '0.025'); });
    showTooltip(n, e2);
  });
  g.addEventListener('mousemove', function(e2) { if (!dragState.id) moveTooltip(e2); });
  g.addEventListener('mouseleave', function() {
    if (dragState.id) return;
    NODES.forEach(function(nd) { var sg = stateGroups[nd.id]; if (sg) sg.setAttribute('opacity', '1'); });
    edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
    hideTooltip();
  });
  g.addEventListener('mousedown', function(e2) { startDrag(e2, n.id); });
});

// Drag handlers
function startDrag(e, nodeId) {
  hideTooltip();
  var wrap = document.getElementById('graphWrap');
  dragState.id = nodeId; dragState.startMx = e.clientX; dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x; dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft; dragState.scrollY = wrap.scrollTop;
  NODES.forEach(function(nd) { var sg = stateGroups[nd.id]; if (sg) sg.setAttribute('opacity', '1'); });
  edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
  e.preventDefault(); e.stopPropagation();
}
document.addEventListener('mousemove', function(e) {
  if (!dragState.id) return;
  var wrap = document.getElementById('graphWrap');
  var dx = e.clientX - dragState.startMx + (wrap.scrollLeft - dragState.scrollX);
  var dy = e.clientY - dragState.startMy + (wrap.scrollTop - dragState.scrollY);
  nm[dragState.id].x = dragState.startNx + dx; nm[dragState.id].y = dragState.startNy + dy;
  updateStatePosition(nm[dragState.id]); rebuildEdgesForNode(dragState.id);
});
document.addEventListener('mouseup', function() {
  if (!dragState.id) return;
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});

// Tooltip functions
function showTooltip(n, e2) {
  var d = NODE_DETAILS[n.id]; if (!d) return;
  document.getElementById('tt-name').textContent = n.label;
  document.getElementById('tt-name').style.color = n.c;
  document.getElementById('tt-role').textContent = d.role;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = d.sc; sdot.style.color = d.sc;
  document.getElementById('tt-sv').textContent = d.status;
  document.getElementById('tt-sv').style.color = d.sc;
  document.getElementById('tt-head-icon').innerHTML = iconLg(n.id, n.c);
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(pair) { return '<div class="tt-row"><span class="tt-k">' + pair[0] + '</span><span class="tt-v">' + pair[1] + '</span></div>'; }).join('');
  var sends = EDGES.filter(function(edge) { return edge.f === n.id; }).map(function(edge) {
    return '<div class="tt-conn-item"><span style="color:' + edge.c + '">\u2192</span> <span>' + (nm[edge.t] ? nm[edge.t].label : edge.t) + (edge.lbl ? ' \u00b7 <em style="color:' + edge.c + '">' + edge.lbl + '</em>' : '') + '</span></div>';
  }).join('');
  var recvs = EDGES.filter(function(edge) { return edge.t === n.id; }).map(function(edge) {
    return '<div class="tt-conn-item"><span style="color:' + edge.c + '">\u2190</span> <span>' + (nm[edge.f] ? nm[edge.f].label : edge.f) + (edge.lbl ? ' \u00b7 <em style="color:' + edge.c + '">' + edge.lbl + '</em>' : '') + '</span></div>';
  }).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends ? '<div class="tt-conn-title">Transitions to</div>' + sends : '') +
    (recvs ? '<div class="tt-conn-title" style="margin-top:' + (sends ? 6 : 0) + 'px">Transitions from</div>' + recvs : '');
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(e2);
}
function showEdgeTooltip(e, ev) {
  var key = e.f + '__' + e.t;
  var d = EDGE_DETAILS[key]; if (!d) return;
  document.getElementById('tt-name').textContent = d.title;
  document.getElementById('tt-name').style.color = e.c;
  document.getElementById('tt-role').textContent = d.sub;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = e.c; sdot.style.color = e.c;
  document.getElementById('tt-sv').textContent = 'TRANSITION';
  document.getElementById('tt-sv').style.color = e.c;
  document.getElementById('tt-head-icon').innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) { return '<div class="tt-row"><span class="tt-k">' + kv[0] + '</span><span class="tt-v">' + kv[1] + '</span></div>'; }).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
}

// Particle animation
var particles = [];
allEdges.forEach(function(e) {
  var cnt = e.spd >= 4 ? 4 : e.spd >= 3 ? 3 : e.spd >= 2 ? 2 : 1;
  for (var j = 0; j < cnt; j++) particles.push({edge: e, t: j / cnt, trail: []});
});
var lastTime = performance.now();
function animate(now) {
  var dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 800);
  particles.forEach(function(p) {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    var e = p.edge;
    var pt = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, p.t);
    p.trail.push({x: pt.x, y: pt.y});
    if (p.trail.length > 10) p.trail.shift();
    for (var i = 1; i < p.trail.length; i++) {
      pctx.beginPath(); pctx.arc(p.trail[i].x, p.trail[i].y, (i / p.trail.length) * (e.spd >= 4 ? 2.8 : 2.2), 0, Math.PI * 2);
      pctx.fillStyle = e.c; pctx.globalAlpha = (i / p.trail.length) * 0.425; pctx.fill();
    }
    pctx.save();
    pctx.shadowColor = e.c; pctx.shadowBlur = e.spd >= 4 ? 14 : 8;
    pctx.fillStyle = e.c; pctx.globalAlpha = 1;
    pctx.beginPath(); pctx.arc(pt.x, pt.y, e.spd >= 4 ? 3.5 : 2.8, 0, Math.PI * 2);
    pctx.fill(); pctx.restore(); pctx.globalAlpha = 1;
  });
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
