/* stateflow-render.js — edge path computation + UML state rendering */

function clipToBorder(n, tx, ty) {
  if (n.id === '_init') {
    var dx = tx - n.x, dy = ty - n.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {x: n.x + dx / len * 10, y: n.y + dy / len * 10};
  }
  if (n.id === '_final') {
    var dx = tx - n.x, dy = ty - n.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {x: n.x + dx / len * 12, y: n.y + dy / len * 12};
  }
  var w = n.sm ? 140 : 160, h = n.sm ? 50 : 60;
  var hw = w / 2, hh = h / 2;
  var dx = tx - n.x, dy = ty - n.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return {x: n.x, y: n.y + hh};
  var scaleX = hw / (Math.abs(dx) || 0.001), scaleY = hh / (Math.abs(dy) || 0.001);
  var scale = Math.min(scaleX, scaleY);
  return {x: n.x + dx * scale, y: n.y + dy * scale};
}

function computeEdgePath(e) {
  var n1 = nm[e.f], n2 = nm[e.t];
  if (!n1 || !n2) return null;
  var cp1x, cp1y, cp2x, cp2y, b1, b2;
  if (e.arc === 'self') {
    cp1x = n1.x + 80; cp1y = n1.y - 90;
    cp2x = n1.x - 80; cp2y = n1.y - 90;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n1, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else if (e.arc === 'above') {
    cp1x = n1.x - 100; cp1y = 0;
    cp2x = n2.x + 100; cp2y = 0;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n2, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else if (e.arc === 'down') {
    var dx = n2.x - n1.x;
    cp1x = n1.x + dx * 0.2; cp1y = n1.y + 60;
    cp2x = n1.x + dx * 0.8; cp2y = n2.y - 60;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n2, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else if (e.arc === 'retry') {
    cp1x = n1.x - 120; cp1y = n1.y + 100;
    cp2x = n2.x + 80;  cp2y = n2.y + 160;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n2, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else if (e.arc === 'abort') {
    cp1x = n1.x + 200; cp1y = n1.y + 120;
    cp2x = n2.x - 200; cp2y = n2.y + 120;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n2, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else {
    b1 = clipToBorder(n1, n2.x, n2.y);
    b2 = clipToBorder(n2, n1.x, n1.y);
    var dx2 = b2.x - b1.x;
    cp1x = b1.x + dx2 * 0.5; cp1y = b1.y;
    cp2x = b1.x + dx2 * 0.5; cp2y = b2.y;
  }
  return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
}

function renderState(n) {
  var w = n.sm ? 140 : 160, h = n.sm ? 50 : 60;
  var g = svgEl('g', {id: 'state-' + n.id, cursor: 'grab', 'pointer-events': 'all'});
  g.setAttribute('transform', 'translate(0,0)');
  // Shadow
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2 + 2, y: n.y - h / 2 + 2, width: w, height: h, rx: '12',
    fill: '#000000', opacity: '0.3'
  }));
  // State body
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: '12',
    fill: n.c + '15', stroke: n.c + '60', 'stroke-width': '1.5'
  }));
  // Compartment divider
  var lineY = n.y - h / 2 + (n.sm ? 20 : 22);
  g.appendChild(svgEl('line', {
    x1: n.x - w / 2 + 8, y1: lineY, x2: n.x + w / 2 - 8, y2: lineY,
    stroke: n.c + '30', 'stroke-width': '0.5'
  }));
  // State name
  var name = svgEl('text', {
    x: n.x, y: n.y - h / 2 + (n.sm ? 14 : 16), fill: n.c,
    'font-family': 'Barlow Condensed, sans-serif',
    'font-size': n.sm ? '12' : '14', 'font-weight': '700',
    'text-anchor': 'middle', 'letter-spacing': '0.04em'
  });
  name.textContent = n.label;
  g.appendChild(name);
  // Description lines
  n.sub.split('\n').forEach(function(line, i) {
    var t = svgEl('text', {
      x: n.x, y: lineY + 11 + i * 11, fill: '#b0b0b0',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': n.sm ? '8.5' : '9.5', 'text-anchor': 'middle', opacity: '0.7'
    });
    t.textContent = line;
    g.appendChild(t);
  });
  // Status LED + text
  var details = NODE_DETAILS[n.id];
  if (details) {
    g.appendChild(svgEl('circle', {
      cx: n.x - w / 2 + 10, cy: n.y + h / 2 - 8, r: '2.5',
      fill: details.sc, filter: 'drop-shadow(0 0 3px ' + details.sc + ')'
    }));
    var st = svgEl('text', {
      x: n.x - w / 2 + 16, y: n.y + h / 2 - 5, fill: details.sc + '80',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '8.5', 'letter-spacing': '0.1em'
    });
    st.textContent = details.status;
    g.appendChild(st);
  }
  g._nodeId = n.id; g._w = w; g._h = h;
  return g;
}

function updateStatePosition(n) {
  var g = stateGroups[n.id];
  if (!g) return;
  var w = g._w, h = g._h, ch = g.childNodes;
  var details = NODE_DETAILS[n.id];
  var lineY = n.y - h / 2 + (n.sm ? 20 : 22);
  var ci = 0;
  // Shadow
  ch[ci].setAttribute('x', n.x - w / 2 + 2); ch[ci].setAttribute('y', n.y - h / 2 + 2); ci++;
  // Main rect
  ch[ci].setAttribute('x', n.x - w / 2); ch[ci].setAttribute('y', n.y - h / 2); ci++;
  // Compartment line
  ch[ci].setAttribute('x1', n.x - w / 2 + 8); ch[ci].setAttribute('y1', lineY);
  ch[ci].setAttribute('x2', n.x + w / 2 - 8); ch[ci].setAttribute('y2', lineY); ci++;
  // State name
  ch[ci].setAttribute('x', n.x); ch[ci].setAttribute('y', n.y - h / 2 + (n.sm ? 14 : 16)); ci++;
  // Description lines
  n.sub.split('\n').forEach(function(line, i) {
    ch[ci].setAttribute('x', n.x); ch[ci].setAttribute('y', lineY + 11 + i * 11); ci++;
  });
  // Status LED + text
  if (details) {
    ch[ci].setAttribute('cx', n.x - w / 2 + 10); ch[ci].setAttribute('cy', n.y + h / 2 - 8); ci++;
    ch[ci].setAttribute('x', n.x - w / 2 + 16); ch[ci].setAttribute('y', n.y + h / 2 - 5);
  }
}

function rebuildEdgesForNode(nodeId) {
  allEdges.forEach(function(e) {
    if (e.f !== nodeId && e.t !== nodeId) return;
    var path = computeEdgePath(e);
    if (!path) return;
    Object.assign(e, path);
    var d = 'M ' + e.x1 + ',' + e.y1 + ' C ' + e.cp1x + ',' + e.cp1y +
            ' ' + e.cp2x + ',' + e.cp2y + ' ' + e.x2 + ',' + e.y2;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hit)  e._hit.setAttribute('d', d);
    if (e._lblBg) {
      var mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, 0.5);
      var lblY = mp.y - 5;
      if (e.arc === 'above') lblY = mp.y - 8;
      if (e.arc === 'abort') lblY = mp.y + 14;
      e._lblBg.setAttribute('x', mp.x); e._lblBg.setAttribute('y', lblY);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x); e._lblTx.setAttribute('y', lblY); }
    }
  });
}
