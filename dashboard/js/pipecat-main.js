/* pipecat-main.js — setup, drag, tooltip, particles, zoom for graph_pipecat */

// ═══════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════
restorePositions(NODES, STORAGE_KEY);
const nm = {};
NODES.forEach(n => nm[n.id] = n);

const svg  = document.getElementById('edgeSvg');
const root = document.getElementById('cnv');
const pctx = document.getElementById('partCvs').getContext('2d');

// -- Zoom state --
var zoomLevel = 1;
const zoomPct = document.getElementById('zoomPct');
function zoomTo(level, cx, cy) {
  const wrap = document.getElementById('graphWrap');
  const prev = zoomLevel;
  zoomLevel = Math.round(Math.max(0.3, Math.min(3, level)) * 100) / 100;
  root.style.transform = 'scale(' + zoomLevel + ')';
  root.style.transformOrigin = '0 0';
  zoomPct.textContent = Math.round(zoomLevel * 100) + '%';
  if (cx !== undefined) {
    const r = zoomLevel / prev;
    wrap.scrollLeft = cx * r - (cx - wrap.scrollLeft);
    wrap.scrollTop  = cy * r - (cy - wrap.scrollTop);
  }
}

// -- Infrastructure region backdrops --
addRegion(svg, 90, 200, 200, 430, '#ff4040', 'TELEPHONY IN', 'Telnyx SIP \u00b7 G.711 8kHz');
addRegion(svg, 340, 100, 200, 870, '#60be35', 'AUDIO PROCESSING', 'Silero VAD \u00b7 SmartTurn v3 \u00b7 Parakeet RNNT');
addRegion(svg, 610, 100, 210, 820, '#d36eff', 'LLM INTELLIGENCE', 'Claude Sonnet \u00b7 Haiku \u00b7 AnthropicAdapter');
addRegion(svg, 900, 180, 210, 780, '#ee9612', 'TEXT-TO-SPEECH', 'Inworld TTS \u00b7 Kokoro (fallback) \u00b7 Pre-render');
addRegion(svg, 1170, 180, 200, 680, '#ff4040', 'OUTPUT + RECORDING', 'Telnyx RTP \u00b7 DO Spaces \u00b7 Warm Transfer');
addRegion(svg, 1440, 80, 200, 920, '#9f00fa', 'PIPECAT FLOWS', '6-node state machine \u00b7 v0.0.108+');

// -- Column headers --
[{x:170,l:'TELEPHONY'},{x:440,l:'AUDIO / STT'},{x:720,l:'LLM'},
 {x:1000,l:'TTS'},{x:1270,l:'OUTPUT'},{x:1540,l:'FLOWS'}].forEach(({x,l}) => {
  const t = svgEl('text', {x, y:'36', fill:'#383838', 'font-size':'9',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle', 'letter-spacing':'0.22em'});
  t.textContent = l; svg.appendChild(t);
  svg.appendChild(svgEl('line', {x1:x-72, y1:'43', x2:x+72, y2:'43', stroke:'#2e2e2e', 'stroke-width':'0.5'}));
});

// -- Arrow markers --
const defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#d36eff','#585858'].forEach(col => {
  const m = svgEl('marker', {id:'arr'+col.slice(1), markerUnits:'userSpaceOnUse', markerWidth:'8', markerHeight:'6', refX:'7', refY:'3', orient:'auto'});
  m.appendChild(svgEl('path', {d:'M0,0 L8,3 L0,6 Z', fill:col+'bb'}));
  defs.appendChild(m);
  const mc = svgEl('marker', {id:'ctrl_arr'+col.slice(1), markerUnits:'userSpaceOnUse', markerWidth:'10', markerHeight:'8', refX:'9', refY:'4', orient:'auto'});
  mc.appendChild(svgEl('path', {d:'M0,0 L10,4 L0,8 Z', fill:col}));
  defs.appendChild(mc);
});
svg.insertBefore(defs, svg.firstChild);

// -- Build edges and nodes --
const allEdges = buildEdges(svg, nm);
const edgeHighlight = buildEdgeHighlight(allEdges);
NODES.forEach(n => renderNode(n, root, edgeHighlight));

// ═══════════════════════════════════════════════════
// DRAG
// ═══════════════════════════════════════════════════
const startDrag = (e, nodeId) => {
  hideTooltip();
  const wrap = document.getElementById('graphWrap');
  dragState.id = nodeId;
  dragState.startMx = e.clientX; dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x; dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft; dragState.scrollY = wrap.scrollTop;
  document.getElementById('nd-' + nodeId).classList.add('dragging');
  document.querySelectorAll('.nd').forEach(el => { el.classList.remove('dimmed', 'lit'); });
  edgeHighlight.forEach(({ el, baseOp }) => el.setAttribute('stroke-opacity', baseOp));
  e.preventDefault(); e.stopPropagation();
};
document.addEventListener('mousemove', e => {
  if (!dragState.id) return;
  const wrap = document.getElementById('graphWrap');
  const dx = (e.clientX - dragState.startMx + (wrap.scrollLeft - dragState.scrollX)) / zoomLevel;
  const dy = (e.clientY - dragState.startMy + (wrap.scrollTop - dragState.scrollY)) / zoomLevel;
  nm[dragState.id].x = dragState.startNx + dx;
  nm[dragState.id].y = dragState.startNy + dy;
  const el = document.getElementById('nd-' + dragState.id);
  el.style.left = nm[dragState.id].x + 'px';
  el.style.top = nm[dragState.id].y + 'px';
  rebuildEdgesForNode(dragState.id);
});
document.addEventListener('mouseup', () => {
  if (!dragState.id) return;
  document.getElementById('nd-' + dragState.id).classList.remove('dragging');
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});

// ═══════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════
const showTooltip = (n, e2) => {
  const d = NODE_DETAILS[n.id]; if (!d) return;
  document.getElementById('tt-name').textContent = n.label;
  document.getElementById('tt-name').style.color = n.c;
  document.getElementById('tt-role').textContent = d.role;
  const sdot = document.getElementById('tt-sdot');
  sdot.style.background = d.sc; sdot.style.color = d.sc;
  document.getElementById('tt-sv').textContent = d.status;
  document.getElementById('tt-sv').style.color = d.sc;
  document.getElementById('tt-head-icon').innerHTML = iconLg(n.id, n.c);
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(([k,v]) => `<div class="tt-row"><span class="tt-k">${k}</span><span class="tt-v">${v}</span></div>`).join('');
  const sends = EDGES.filter(e => e.f === n.id).map(e => `<div class="tt-conn-item"><span style="color:${e.c}">\u2192</span> <span>${nm[e.t] ? nm[e.t].label : e.t}${e.lbl ? ' \u00b7 <em style="color:' + e.c + '">' + e.lbl + '</em>' : ''}</span></div>`).join('');
  const recvs = EDGES.filter(e => e.t === n.id).map(e => `<div class="tt-conn-item"><span style="color:${e.c}">\u2190</span> <span>${nm[e.f] ? nm[e.f].label : e.f}${e.lbl ? ' \u00b7 <em style="color:' + e.c + '">' + e.lbl + '</em>' : ''}</span></div>`).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends ? `<div class="tt-conn-title">Sends to</div>${sends}` : '') + (recvs ? `<div class="tt-conn-title" style="margin-top:${sends ? 6 : 0}px">Receives from</div>${recvs}` : '');
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(e2);
};
const showEdgeTooltip = (e, ev) => {
  let key = e.f + '__' + e.t;
  if (e.poff) key += '__sms';
  const d = EDGE_DETAILS[key]; if (!d) return;
  document.getElementById('tt-name').textContent = d.title;
  document.getElementById('tt-name').style.color = e.c;
  document.getElementById('tt-role').textContent = d.sub;
  const sdot = document.getElementById('tt-sdot');
  sdot.style.background = e.c; sdot.style.color = e.c;
  document.getElementById('tt-sv').textContent = e.ctrl ? 'CONTROL' : 'CONNECTION';
  document.getElementById('tt-sv').style.color = e.c;
  document.getElementById('tt-head-icon').innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(([k,v]) => `<div class="tt-row"><span class="tt-k">${k}</span><span class="tt-v">${v}</span></div>`).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
};

// ═══════════════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════════════
const particles = [];
allEdges.forEach(e => {
  const cnt = e.spd >= 4.5 ? 4 : e.spd >= 3 ? 3 : e.spd >= 2 ? 2 : 1;
  for (let j = 0; j < cnt; j++) particles.push({ edge: e, t: j / cnt, trail: [] });
});
let lastTime = performance.now();
const animate = (now) => {
  const dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 1040);
  particles.forEach(p => {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    const e = p.edge;
    const pt = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, p.t);
    p.trail.push({ x: pt.x, y: pt.y });
    if (p.trail.length > 10) p.trail.shift();
    for (let i = 1; i < p.trail.length; i++) {
      pctx.beginPath();
      pctx.arc(p.trail[i].x, p.trail[i].y, (i / p.trail.length) * (e.spd >= 4 ? 2.8 : 2.2), 0, Math.PI * 2);
      pctx.fillStyle = e.c;
      pctx.globalAlpha = (i / p.trail.length) * 0.5 * (e.rev ? 0.35 : 0.85);
      pctx.fill();
    }
    pctx.save();
    pctx.shadowColor = e.c; pctx.shadowBlur = e.spd >= 4 ? 14 : 8;
    pctx.fillStyle = e.c; pctx.globalAlpha = e.rev ? 0.45 : 1;
    pctx.beginPath();
    pctx.arc(pt.x, pt.y, e.spd >= 4 ? 3.5 : 2.8, 0, Math.PI * 2);
    pctx.fill(); pctx.restore();
    pctx.globalAlpha = 1;
  });
  requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

// ═══════════════════════════════════════════════════
// SCROLL + WHEEL ZOOM
// ═══════════════════════════════════════════════════
document.getElementById('graphWrap').scrollTop = 40;
document.getElementById('graphWrap').addEventListener('wheel', function(e) {
  e.preventDefault();
  if (e.ctrlKey) {
    const delta = -e.deltaY * 0.01;
    const rect = this.getBoundingClientRect();
    zoomTo(zoomLevel + delta, e.clientX - rect.left + this.scrollLeft, e.clientY - rect.top + this.scrollTop);
  } else {
    this.scrollLeft += e.deltaX;
    this.scrollTop += e.deltaY;
  }
}, { passive: false });
