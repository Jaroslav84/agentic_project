/* callflow-render.js -- SVG defs, boundary math, edge path, node shapes */
// Shape dimension constants
var SHAPE_RECT_W = 160, SHAPE_RECT_H = 54;
var SHAPE_HUB_W = 188, SHAPE_HUB_H = 58;
var SHAPE_TERM_W = 158, SHAPE_TERM_H = 54;
var DIAMOND_SX = 65, DIAMOND_SY = 50;

// -- SVG defs: patterns, filters, arrow markers --
function buildSvgDefs(targetSvg) {
  var defs = svgEl('defs', {});
  var gpuPat = svgEl('pattern', {id:'gpuTrace', patternUnits:'userSpaceOnUse', width:'8', height:'8'});
  gpuPat.appendChild(svgEl('rect', {width:'8', height:'8', fill:'none'}));
  gpuPat.appendChild(svgEl('line', {x1:'0',y1:'0',x2:'0',y2:'8',stroke:'#60be35','stroke-width':'0.5','stroke-opacity':'0.04'}));
  gpuPat.appendChild(svgEl('line', {x1:'0',y1:'0',x2:'8',y2:'0',stroke:'#60be35','stroke-width':'0.5','stroke-opacity':'0.04'}));
  defs.appendChild(gpuPat);
  var hubGlow = svgEl('filter', {id:'hubGlow',x:'-50%',y:'-50%',width:'200%',height:'200%'});
  var feGauss = svgEl('feGaussianBlur', {stdDeviation:'3',result:'blur'});
  hubGlow.appendChild(feGauss);
  var feMerge = svgEl('feMerge', {});
  feMerge.appendChild(svgEl('feMergeNode', {'in':'blur'}));
  feMerge.appendChild(svgEl('feMergeNode', {'in':'SourceGraphic'}));
  hubGlow.appendChild(feMerge);
  defs.appendChild(hubGlow);
  ['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#585858'].forEach(function(col) {
    var m = svgEl('marker', {id:'arr'+col.slice(1),
      markerUnits:'userSpaceOnUse',markerWidth:'8',markerHeight:'6',
      refX:'7',refY:'3',orient:'auto'});
    m.appendChild(svgEl('path', {d:'M0,0 L8,3 L0,6 Z',fill:col+'bb'}));
    defs.appendChild(m);
  });
  targetSvg.insertBefore(defs, targetSvg.firstChild);
}
// -- Node boundary point (where edges connect) --
function getNodeBoundary(n, targetX, targetY) {
  var dx = targetX - n.x, dy = targetY - n.y;
  var shape = n.shape || 'rect';
  if (shape === 'diamond') {
    var sx = DIAMOND_SX, sy = DIAMOND_SY;
    var absDx = Math.abs(dx) || 0.001, absDy = Math.abs(dy) || 0.001;
    var scale = 1.0 / (absDx/sx + absDy/sy);
    return { x: n.x + dx * scale, y: n.y + dy * scale };
  }
  var hw = (n.hub ? 94 : (n.term ? 79 : 80));
  var hh = 27;
  if (shape === 'rounded-rect') { hw = 79; hh = 27; }
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return { x: n.x, y: n.y + hh };
  }
  var scaleX = hw / (Math.abs(dx) || 0.001);
  var scaleY = hh / (Math.abs(dy) || 0.001);
  var scale = Math.min(scaleX, scaleY);
  return { x: n.x + dx * scale, y: n.y + dy * scale };
}
// -- Edge path (cubic bezier control points) --
function makeEdgePath(x1, y1, x2, y2, perpOff) {
  if (perpOff) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx + dy*dy) || 1;
    x1 += -dy/len * perpOff; y1 += dx/len * perpOff;
    x2 += -dy/len * perpOff; y2 += dx/len * perpOff;
  }
  var dy2 = y2 - y1, dx2 = x2 - x1;
  var absDx = Math.abs(dx2), absDy = Math.abs(dy2);
  var cp1x, cp1y, cp2x, cp2y;
  if (absDy > absDx * 0.5) {
    cp1x = x1; cp1y = y1 + dy2 * 0.4;
    cp2x = x2; cp2y = y2 - dy2 * 0.4;
  } else {
    cp1x = x1 + dx2 * 0.5; cp1y = y1;
    cp2x = x1 + dx2 * 0.5; cp2y = y2;
  }
  return {x1:x1, y1:y1, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:x2, y2:y2};
}

// -- Draw process rectangle node --
function drawProcess(n) {
  var w = n.hub ? SHAPE_HUB_W : SHAPE_RECT_W;
  var h = n.hub ? SHAPE_HUB_H : SHAPE_RECT_H;
  var g = svgEl('g', {id:'node-'+n.id, cursor:'grab', 'data-nid':n.id});
  if (n.gpu) {
    g.appendChild(svgEl('rect', {x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'3', fill:'url(#gpuTrace)'}));
  }
  g.appendChild(svgEl('rect', {x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'3',
    fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5'}));
  g.appendChild(svgEl('line', {x1:n.x-w/2, y1:n.y-h/2+3, x2:n.x-w/2, y2:n.y+h/2-3,
    stroke:n.c, 'stroke-width':'2.5', 'stroke-opacity':'0.6'}));
  if (n.gpu) {
    g.appendChild(svgEl('rect', {x:n.x-w/2+1, y:n.y-h/2+1, width:w-2, height:h-2, rx:'2',
      fill:'url(#gpuTrace)', opacity:'1'}));
  }
  var details = NODE_DETAILS[n.id];
  var ledColor = details ? details.sc : '#555';
  g.appendChild(svgEl('circle', {cx:n.x+w/2-10, cy:n.y-h/2+10, r:'2.5', fill:ledColor, opacity:'0.8'}));
  var label = svgEl('text', {x:n.x, y:n.y-6, fill:n.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':n.hub?'14':'13',
    'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.04em'});
  label.textContent = n.label; g.appendChild(label);
  n.sub.split('\n').forEach(function(line, i) {
    var t = svgEl('text', {x:n.x, y:n.y+7+i*11, fill:'#b0b0b0',
      'font-family':'JetBrains Mono, monospace', 'font-size':'9', 'text-anchor':'middle', opacity:'0.7'});
    t.textContent = line; g.appendChild(t);
  });
  return g;
}

// -- Draw diamond decision node --
function drawDiamond(n) {
  var sx = DIAMOND_SX, sy = DIAMOND_SY;
  var g = svgEl('g', {id:'node-'+n.id, cursor:'grab', 'data-nid':n.id});
  var pts = n.x+','+(n.y-sy)+' '+(n.x+sx*1.3)+','+n.y+' '+n.x+','+(n.y+sy)+' '+(n.x-sx*1.3)+','+n.y;
  g.appendChild(svgEl('polygon', {points:pts, fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5'}));
  var details = NODE_DETAILS[n.id];
  var ledColor = details ? details.sc : '#555';
  g.appendChild(svgEl('circle', {cx:n.x, cy:n.y-sy+12, r:'2.5', fill:ledColor, opacity:'0.8'}));
  var label = svgEl('text', {x:n.x, y:n.y-6, fill:n.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'12',
    'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.04em'});
  label.textContent = n.label; g.appendChild(label);
  var st = svgEl('text', {x:n.x, y:n.y+8, fill:'#b0b0b0',
    'font-family':'JetBrains Mono, monospace', 'font-size':'8.5', 'text-anchor':'middle', opacity:'0.7'});
  st.textContent = n.sub.split('\n')[0]; g.appendChild(st);
  var badgeY = n.y + 18;
  g.appendChild(svgEl('rect', {x:n.x-30, y:badgeY-5, width:60, height:11, rx:'2',
    fill:n.c+'18', stroke:n.c+'40', 'stroke-width':'0.5'}));
  var bt = svgEl('text', {x:n.x, y:badgeY+3, fill:n.c,
    'font-family':'JetBrains Mono, monospace', 'font-size':'8', 'text-anchor':'middle', 'letter-spacing':'0.1em'});
  bt.textContent = '\u25C8 DECISION'; g.appendChild(bt);
  return g;
}

// -- Draw rounded-rect (start/end/terminal) node --
function drawRoundedRect(n) {
  var w = SHAPE_TERM_W, h = SHAPE_TERM_H;
  var g = svgEl('g', {id:'node-'+n.id, cursor:'grab', 'data-nid':n.id, opacity:n.term?'0.7':'1'});
  g.appendChild(svgEl('rect', {x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'20',
    fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5'}));
  var details = NODE_DETAILS[n.id];
  var ledColor = details ? details.sc : '#555';
  g.appendChild(svgEl('circle', {cx:n.x+w/2-14, cy:n.y-h/2+14, r:'2.5', fill:ledColor, opacity:'0.8'}));
  var label = svgEl('text', {x:n.x, y:n.y-6, fill:n.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'13',
    'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.04em'});
  label.textContent = n.label; g.appendChild(label);
  n.sub.split('\n').forEach(function(line, i) {
    var t = svgEl('text', {x:n.x, y:n.y+7+i*11, fill:'#b0b0b0',
      'font-family':'JetBrains Mono, monospace', 'font-size':'9', 'text-anchor':'middle', opacity:'0.7'});
    t.textContent = line; g.appendChild(t);
  });
  if (n.term) {
    g.appendChild(svgEl('rect', {x:n.x-22, y:n.y+h/2-14, width:44, height:10, rx:'2',
      fill:'#58585818', stroke:'#58585840', 'stroke-width':'0.5'}));
    var tt2 = svgEl('text', {x:n.x, y:n.y+h/2-6, fill:'#585858',
      'font-family':'JetBrains Mono, monospace', 'font-size':'7', 'text-anchor':'middle', 'letter-spacing':'0.1em'});
    tt2.textContent = 'TERMINAL'; g.appendChild(tt2);
  }
  return g;
}

// -- Dispatch to correct shape drawer --
function drawNodeShape(n) {
  switch (n.shape) {
    case 'diamond':      return drawDiamond(n);
    case 'rounded-rect': return drawRoundedRect(n);
    default:             return drawProcess(n);
  }
}

// -- Rebuild edge paths when a node is dragged --
function rebuildEdgesForNode(nodeId) {
  allEdges.forEach(function(e) {
    if (e.f !== nodeId && e.t !== nodeId) return;
    var n1 = nm[e.f], n2 = nm[e.t], ep;
    if (e.arc) {
      var b1 = getNodeBoundary(n1, n1.x-140, n1.y-100);
      var b2 = getNodeBoundary(n2, n2.x-160, n2.y+60);
      ep = {x1:b1.x,y1:b1.y, cp1x:n1.x-140,cp1y:n1.y-100, cp2x:n2.x-160,cp2y:n2.y+60, x2:b2.x,y2:b2.y};
    } else if (e.loop) {
      var b1 = getNodeBoundary(n1, n1.x+260, n1.y-80);
      var b2 = getNodeBoundary(n2, n2.x+260, n2.y+80);
      ep = {x1:b1.x,y1:b1.y, cp1x:n1.x+260,cp1y:n1.y-80, cp2x:n2.x+260,cp2y:n2.y+80, x2:b2.x,y2:b2.y};
    } else {
      var b1 = getNodeBoundary(n1, n2.x, n2.y);
      var b2 = getNodeBoundary(n2, n1.x, n1.y);
      ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, 0);
    }
    e.x1=ep.x1; e.y1=ep.y1; e.cp1x=ep.cp1x; e.cp1y=ep.cp1y;
    e.cp2x=ep.cp2x; e.cp2y=ep.cp2y; e.x2=ep.x2; e.y2=ep.y2;
    var d = 'M '+ep.x1+','+ep.y1+' C '+ep.cp1x+','+ep.cp1y+' '+ep.cp2x+','+ep.cp2y+' '+ep.x2+','+ep.y2;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hit)  e._hit.setAttribute('d', d);
    if (e._lblBg) {
      var mp = cbPt(ep.x1,ep.y1,ep.cp1x,ep.cp1y,ep.cp2x,ep.cp2y,ep.x2,ep.y2,.5);
      var lox=0, loy=-5;
      if (e.arc)  { lox=-30; loy=-10; }
      if (e.loop) { lox=40;  loy=0; }
      e._lblBg.setAttribute('x', mp.x+lox); e._lblBg.setAttribute('y', mp.y+loy);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x+lox); e._lblTx.setAttribute('y', mp.y+loy); }
    }
  });
}
