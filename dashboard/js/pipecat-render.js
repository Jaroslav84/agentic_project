/* pipecat-render.js — edge geometry, SVG edge rendering, node DOM for graph_pipecat */

const BIDIR_OFF = 7;

// -- Edge geometry helpers --

const clipToBorder = (n, tx, ty) => {
  let hw, hh;
  if (n.hub) { hw = 103; hh = 50; }
  else       { hw = 92;  hh = 46; }
  const dx = tx - n.x, dy = ty - n.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return { x: n.x, y: n.y + hh };
  const scaleX = hw / (Math.abs(dx) || 0.001), scaleY = hh / (Math.abs(dy) || 0.001);
  const scale = Math.min(scaleX, scaleY);
  return { x: n.x + dx * scale, y: n.y + dy * scale };
};

const makeEdgePath = (x1, y1, x2, y2, perpOff) => {
  if (perpOff) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
    x1 += -dy / len * perpOff; y1 += dx / len * perpOff;
    x2 += -dy / len * perpOff; y2 += dx / len * perpOff;
  }
  const dx = x2 - x1;
  return { x1, y1, cp1x: x1 + dx * .5, cp1y: y1, cp2x: x1 + dx * .5, cp2y: y2, x2, y2 };
};

const rebuildEdgesForNode = (nodeId) => {
  allEdges.forEach(e => {
    if (e.f !== nodeId && e.t !== nodeId) return;
    let srcN, dstN;
    if (e.rev) { srcN = nm[e.t]; dstN = nm[e.f]; }
    else       { srcN = nm[e.f]; dstN = nm[e.t]; }
    const b1 = clipToBorder(srcN, dstN.x, dstN.y);
    const b2 = clipToBorder(dstN, srcN.x, srcN.y);
    const pp = e.rev ? BIDIR_OFF : (e.poff || 0);
    const ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, pp);
    Object.assign(e, ep);
    const d = `M ${ep.x1},${ep.y1} C ${ep.cp1x},${ep.cp1y} ${ep.cp2x},${ep.cp2y} ${ep.x2},${ep.y2}`;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hit) e._hit.setAttribute('d', d);
    if (e._lblBg && !e.rev) {
      const mp = cbPt(ep.x1, ep.y1, ep.cp1x, ep.cp1y, ep.cp2x, ep.cp2y, ep.x2, ep.y2, .5);
      e._lblBg.setAttribute('x', mp.x); e._lblBg.setAttribute('y', mp.y - 5);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x); e._lblTx.setAttribute('y', mp.y - 5); }
    }
  });
};

// -- Build all edge SVG elements --

const buildEdges = (svgParent, nm) => {
  const allEdges = [];
  EDGES.forEach(e => {
    const n1 = nm[e.f], n2 = nm[e.t];
    if (!n1 || !n2) return;
    const b1 = clipToBorder(n1, n2.x, n2.y);
    const b2 = clipToBorder(n2, n1.x, n1.y);
    const fwd = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.bi ? BIDIR_OFF : (e.poff || 0));
    allEdges.push({ ...e, ...fwd, rev: false });
    if (e.bi) {
      const bwd = makeEdgePath(b2.x, b2.y, b1.x, b1.y, BIDIR_OFF);
      allEdges.push({ ...e, ...bwd, lbl: '', rev: true, bi: false });
    }
  });

  allEdges.forEach(e => {
    const d = `M ${e.x1},${e.y1} C ${e.cp1x},${e.cp1y} ${e.cp2x},${e.cp2y} ${e.x2},${e.y2}`;
    const glow = svgEl('path', { d, fill: 'none', stroke: e.c, 'stroke-width': '6', 'stroke-opacity': '0.05' });
    svgParent.appendChild(glow); e._glow = glow;
    const isCtrl = e.ctrl && !e.rev;
    const dash = isCtrl ? '' : (e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6'));
    const sw = isCtrl ? '2.5' : (e.spd >= 4 ? '2' : '1.5');
    const sop = e.rev ? '0.15' : (isCtrl ? '0.65' : '0.42');
    const mkr = isCtrl ? `url(#ctrl_arr${e.c.slice(1)})` : `url(#arr${e.c.slice(1)})`;
    const main = svgEl('path', { d, fill: 'none', stroke: e.c,
      'stroke-width': sw, 'stroke-opacity': sop,
      'stroke-dasharray': dash, 'marker-end': mkr });
    svgParent.appendChild(main); e._main = main;
    if (e.lbl && !e.rev) {
      const mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, .5);
      const bg = svgEl('text', { x: mp.x, y: mp.y - 5, fill: '#141414', 'font-size': '8',
        'font-family': 'JetBrains Mono,monospace', 'text-anchor': 'middle',
        stroke: '#141414', 'stroke-width': '3', 'stroke-linejoin': 'round' });
      bg.textContent = e.lbl; svgParent.appendChild(bg); e._lblBg = bg;
      const tx = svgEl('text', { x: mp.x, y: mp.y - 5, fill: e.c, 'font-size': '8',
        'font-family': 'JetBrains Mono,monospace', 'text-anchor': 'middle',
        opacity: '0.75', 'letter-spacing': '0.06em' });
      tx.textContent = e.lbl; svgParent.appendChild(tx); e._lblTx = tx;
    }
    // Edge hover hit area
    if (!e.rev) {
      const hit = svgEl('path', { d, fill: 'none', stroke: 'transparent', 'stroke-width': '18',
        'pointer-events': 'stroke', cursor: 'pointer' });
      svgParent.appendChild(hit); e._hit = hit;
      (function(edge) {
        hit.addEventListener('mouseenter', ev => { showEdgeTooltip(edge, ev); });
        hit.addEventListener('mousemove', ev => { moveTooltip(ev); });
        hit.addEventListener('mouseleave', () => { hideTooltip(); });
      })(e);
    }
  });
  return allEdges;
};

// -- Build edge highlight index --

const buildEdgeHighlight = (allEdges) => {
  const edgeHighlight = [];
  allEdges.forEach(e => {
    if (e._main) edgeHighlight.push({
      el: e._main, from: e.f, to: e.t, rev: e.rev,
      baseOp: e.rev ? '0.15' : (e.ctrl ? '0.65' : '0.42')
    });
  });
  return edgeHighlight;
};

// -- Render a single node card (DOM div) --

const renderNode = (n, root, edgeHighlight) => {
  const div = document.createElement('div');
  const isGpu = (n.id === 'vad' || n.id === 'smartturn' || n.id === 'parakeet' || n.id === 'moonshine');
  const isFlow = n.id.startsWith('fl_');
  div.className = 'nd' + (n.hub ? ' hub' : '') + (isGpu ? ' gpu-node' : '') + (isFlow ? ' flow-node' : '');
  div.id = 'nd-' + n.id;
  div.style.left = n.x + 'px'; div.style.top = n.y + 'px';
  div.style.borderLeftColor = n.c;
  div.style.setProperty('--nd-c', n.c);

  const ico = ICONS[n.id]
    ? ICONS[n.id].replace('stroke="currentColor"', `stroke="${n.c}"`)
    : '';

  const svcFile = SVC_ICONS[n.id];
  const svcIco = svcFile
    ? `<img class="nd-svc" src="img/icons/services/${svcFile}.png" alt="" draggable="false">`
    : '';

  const details = NODE_DETAILS[n.id];
  const ledColor = details ? details.sc : '#555';
  const ledHtml = `<div class="nd-stat"><div class="nd-led" style="background:${ledColor};box-shadow:0 0 5px ${ledColor}"></div><span class="nd-stat-txt" style="color:${ledColor}60;font-size:7.5px">${details ? details.status : '\u2014'}</span></div>`;

  let extra = '';
  if (n.hub) extra = `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u25c8 CORE LLM</div>`;
  // Pipeline badges
  if (n.id === 'vad')       extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">0.2s STOP_SECS</div>`;
  if (n.id === 'smartturn') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">~150ms PROSODY</div>`;
  if (n.id === 'parakeet')  extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">1.1B STREAMING</div>`;
  if (n.id === 'bargein')   extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">500ms THRESHOLD</div>`;
  if (n.id === 'inworld')   extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">ELO 1577</div>`;
  if (n.id === 'kokoro')    extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u26a0 FALLBACK</div>`;
  if (n.id === 'moonshine') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u26a0 FALLBACK</div>`;
  if (n.id === 'prerender') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">~200ms TURN 1</div>`;
  if (n.id === 'cache')     extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">~45K TOKENS</div>`;
  if (n.id === 'haiku')     extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">ASYNC ONLY</div>`;
  if (n.id === 'adapter')   extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">v0.0.108+</div>`;
  if (n.id === 'recording') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">DUAL-CHANNEL</div>`;
  if (n.id === 'transfer_ring') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u22643 REPS \u00b7 16s</div>`;
  // Flows badges
  if (n.id === 'fl_opening')    extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u25b6 ENTRY</div>`;
  if (n.id === 'fl_closing')    extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u25a0 TERMINAL</div>`;

  div.innerHTML = `
<div class="nd-header">
  ${svcIco}<div class="nd-label" style="color:${n.c}">${n.label}</div>
  <div class="nd-icon">${ico}</div>
</div>
<div class="nd-sub">${n.sub.split('\n').join('<br>')}</div>
${ledHtml}${extra}`;

  div.addEventListener('mouseenter', e2 => {
    if (dragState.id) return;
    const conn = new Set([n.id]);
    EDGES.forEach(e => { if (e.f === n.id) conn.add(e.t); if (e.t === n.id) conn.add(e.f); });
    document.querySelectorAll('.nd').forEach(el => {
      const nid = el.id.replace('nd-', '');
      el.classList.toggle('dimmed', !conn.has(nid));
      el.classList.toggle('lit', conn.has(nid));
    });
    edgeHighlight.forEach(({ el, from, to }) => {
      el.setAttribute('stroke-opacity', (from === n.id || to === n.id) ? '0.9' : '0.025');
    });
    showTooltip(n, e2);
  });
  div.addEventListener('mousemove', e2 => { if (!dragState.id) moveTooltip(e2); });
  div.addEventListener('mouseleave', () => {
    if (dragState.id) return;
    document.querySelectorAll('.nd').forEach(el => { el.classList.remove('dimmed', 'lit'); });
    edgeHighlight.forEach(({ el, baseOp }) => el.setAttribute('stroke-opacity', baseOp));
    hideTooltip();
  });
  div.addEventListener('mousedown', e2 => startDrag(e2, n.id));
  root.appendChild(div);
};
