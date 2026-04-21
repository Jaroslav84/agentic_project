/* callflow-main.js -- Node rendering, drag, tooltips, particle animation */

// =====================================================
// RENDER NODES
// =====================================================
var nodeGroups = {};
var edgeHighlight = [];
allEdges.forEach(function(e) {
  if (e._main) edgeHighlight.push({el:e._main, from:e.f, to:e.t, baseOp:e.c==='#585858'?'0.25':'0.42'});
});

function attachNodeEvents(g, n) {
  g.addEventListener('mouseenter', function(e2) {
    if (dragState.id) return;
    var conn = {}; conn[n.id] = true;
    EDGES.forEach(function(ed) { if (ed.f===n.id) conn[ed.t]=true; if (ed.t===n.id) conn[ed.f]=true; });
    NODES.forEach(function(nd) {
      var ng = nodeGroups[nd.id]; if (!ng) return;
      ng.setAttribute('opacity', conn[nd.id] ? '1' : '0.15');
    });
    edgeHighlight.forEach(function(h) {
      h.el.setAttribute('stroke-opacity', (h.from===n.id||h.to===n.id) ? '0.9' : '0.025');
    });
    showTooltip(n, e2);
  });
  g.addEventListener('mousemove', function(e2) { if (!dragState.id) moveTooltip(e2); });
  g.addEventListener('mouseleave', function() {
    if (dragState.id) return;
    NODES.forEach(function(nd) {
      var ng = nodeGroups[nd.id]; if (!ng) return;
      ng.setAttribute('opacity', nd.term ? '0.7' : '1');
    });
    edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
    hideTooltip();
  });
  g.addEventListener('mousedown', function(e2) { startDrag(e2, n.id); });
}

NODES.forEach(function(n) {
  var g = drawNodeShape(n);
  nodeGroups[n.id] = g;
  attachNodeEvents(g, n);
  nodeSvg.appendChild(g);
});

// Hub pulse + GPU LED animations via SVG style
(function() {
  var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = [
    '@keyframes svg-hub-pulse { 0%{filter:drop-shadow(0 0 0 rgba(159,0,250,.5))} 50%{filter:drop-shadow(0 0 8px rgba(159,0,250,.35))} 100%{filter:drop-shadow(0 0 0 rgba(159,0,250,0))} }',
    '#node-answer, #node-llm { animation: svg-hub-pulse 2.8s infinite; }',
    '@keyframes svg-gpu-led { 0%,100%{opacity:0.55} 50%{opacity:1} }',
    '#node-vad circle:nth-of-type(1), #node-stt circle:nth-of-type(1), #node-tts circle:nth-of-type(1) { animation: svg-gpu-led 2s infinite; }'
  ].join('\n');
  nodeSvg.insertBefore(style, nodeSvg.firstChild);
})();

// =====================================================
// DRAG
// =====================================================
function startDrag(e, nodeId) {
  hideTooltip();
  var wrap = document.getElementById('graphWrap');
  dragState.id = nodeId;
  dragState.startMx = e.clientX; dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x; dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft; dragState.scrollY = wrap.scrollTop;
  NODES.forEach(function(nd) {
    var ng = nodeGroups[nd.id]; if (!ng) return;
    ng.setAttribute('opacity', nd.term ? '0.7' : '1');
  });
  edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
  e.preventDefault(); e.stopPropagation();
}

document.addEventListener('mousemove', function(e) {
  if (!dragState.id) return;
  var wrap = document.getElementById('graphWrap');
  var dx = e.clientX - dragState.startMx + (wrap.scrollLeft - dragState.scrollX);
  var dy = e.clientY - dragState.startMy + (wrap.scrollTop - dragState.scrollY);
  var n = nm[dragState.id];
  n.x = dragState.startNx + dx;
  n.y = dragState.startNy + dy;
  updateNodePosition(dragState.id);
  rebuildEdgesForNode(dragState.id);
});

document.addEventListener('mouseup', function() {
  if (!dragState.id) return;
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});

function updateNodePosition(nodeId) {
  var n = nm[nodeId];
  var g = nodeGroups[nodeId]; if (!g) return;
  var parent = g.parentNode;
  var newG = drawNodeShape(n);
  attachNodeEvents(newG, n);
  parent.replaceChild(newG, g);
  nodeGroups[nodeId] = newG;
}

// =====================================================
// TOOLTIP
// =====================================================
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
    d.m.map(function(kv) { return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>'; }).join('');
  var sends = EDGES.filter(function(e) { return e.f===n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2192</span> <span>'+(nm[e.t]?nm[e.t].label:e.t)+(e.lbl?' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>':'')+'</span></div>';
  }).join('');
  var recvs = EDGES.filter(function(e) { return e.t===n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2190</span> <span>'+(nm[e.f]?nm[e.f].label:e.f)+(e.lbl?' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>':'')+'</span></div>';
  }).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends?'<div class="tt-conn-title">Sends to</div>'+sends:'') +
    (recvs?'<div class="tt-conn-title" style="margin-top:'+(sends?6:0)+'px">Receives from</div>'+recvs:'');
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
  document.getElementById('tt-sv').textContent = 'CONNECTION';
  document.getElementById('tt-sv').style.color = e.c;
  document.getElementById('tt-head-icon').innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) { return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>'; }).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
}

// =====================================================
// PARTICLES -- comet trails
// =====================================================
var particles = [];
allEdges.forEach(function(e) {
  var cnt = e.spd>=4.5 ? 4 : e.spd>=3 ? 3 : e.spd>=2 ? 2 : 1;
  for (var j = 0; j < cnt; j++) particles.push({edge:e, t:j/cnt, trail:[]});
});

var lastTime = performance.now();
function animate(now) {
  var dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 1400);
  particles.forEach(function(p) {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    var e = p.edge;
    var pt = cbPt(e.x1,e.y1,e.cp1x,e.cp1y,e.cp2x,e.cp2y,e.x2,e.y2,p.t);
    p.trail.push({x:pt.x, y:pt.y});
    if (p.trail.length > 10) p.trail.shift();
    for (var i = 1; i < p.trail.length; i++) {
      var a = (i / p.trail.length) * 0.5 * 0.85;
      var r = (i / p.trail.length) * (e.spd >= 4 ? 2.8 : 2.2);
      pctx.beginPath();
      pctx.arc(p.trail[i].x, p.trail[i].y, r, 0, Math.PI * 2);
      pctx.fillStyle = e.c;
      pctx.globalAlpha = a;
      pctx.fill();
    }
    pctx.save();
    pctx.shadowColor = e.c; pctx.shadowBlur = e.spd >= 4 ? 14 : 8;
    pctx.fillStyle = e.c; pctx.globalAlpha = 1;
    pctx.beginPath();
    pctx.arc(pt.x, pt.y, e.spd >= 4 ? 3.5 : 2.8, 0, Math.PI * 2);
    pctx.fill(); pctx.restore();
    pctx.globalAlpha = 1;
  });
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
