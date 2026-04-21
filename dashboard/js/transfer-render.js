/* transfer-render.js — edge geometry + shape dimensions for Warm Transfer graph */

// Shape dimension constants
var RECT_W = 168, RECT_H = 62;
var ROUNDED_W = 158, ROUNDED_H = 56;
var DIAMOND_SX = 72, DIAMOND_SY = 55;
var PARA_W = 168, PARA_H = 52, PARA_SKEW = 16;
var PANEL_W = 230, PANEL_H = 270;

// SVG text helper
function svgText(x, y, text, attrs) {
  var el = svgEl('text', Object.assign({x:x, y:y}, attrs));
  el.textContent = text;
  return el;
}

// Clip edge endpoint to node border
function clipToBorder(n, tx, ty) {
  var shape = SHAPE_MAP[n.id];
  var dx = tx - n.x, dy = ty - n.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return {x: n.x, y: n.y + 31};
  if (shape === 'diamond') {
    var sx = DIAMOND_SX * 1.3, sy = DIAMOND_SY;
    var scale = 1.0 / ((Math.abs(dx)||0.001)/sx + (Math.abs(dy)||0.001)/sy);
    return {x: n.x + dx * scale, y: n.y + dy * scale};
  }
  var hw, hh;
  if (shape === 'data-panel')        { hw = PANEL_W/2;  hh = PANEL_H/2; }
  else if (shape === 'rounded-rect') { hw = ROUNDED_W/2; hh = ROUNDED_H/2; }
  else if (shape === 'parallelogram'){ hw = (PARA_W + PARA_SKEW)/2; hh = PARA_H/2; }
  else                               { hw = RECT_W/2; hh = RECT_H/2; }
  var scaleX = hw / (Math.abs(dx)||0.001), scaleY = hh / (Math.abs(dy)||0.001);
  var sc = Math.min(scaleX, scaleY);
  return {x: n.x + dx * sc, y: n.y + dy * sc};
}

// Build cubic bezier control points for an edge path
function makeEdgePath(x1, y1, x2, y2, perpOff) {
  if (perpOff) {
    var ddx = x2-x1, ddy = y2-y1, len = Math.sqrt(ddx*ddx+ddy*ddy)||1;
    x1 += -ddy/len*perpOff; y1 += ddx/len*perpOff;
    x2 += -ddy/len*perpOff; y2 += ddx/len*perpOff;
  }
  var dx = x2-x1, dy = y2-y1;
  var isHoriz = Math.abs(dx) > Math.abs(dy)*1.5;
  if (isHoriz) {
    return {x1:x1, y1:y1, cp1x:x1+dx*.5, cp1y:y1, cp2x:x1+dx*.5, cp2y:y2, x2:x2, y2:y2};
  }
  return {x1:x1, y1:y1, cp1x:x1, cp1y:y1+dy*.4, cp2x:x2, cp2y:y2-dy*.4, x2:x2, y2:y2};
}

// Rebuild edge SVG paths when a node moves
function rebuildEdgesForNode(nodeId) {
  allEdges.forEach(function(e) {
    if (e.f !== nodeId && e.t !== nodeId) return;
    var b1 = clipToBorder(nm[e.f], nm[e.t].x, nm[e.t].y);
    var b2 = clipToBorder(nm[e.t], nm[e.f].x, nm[e.f].y);
    var ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff||0);
    Object.assign(e, ep);
    var d = 'M '+ep.x1+','+ep.y1+' C '+ep.cp1x+','+ep.cp1y+' '+ep.cp2x+','+ep.cp2y+' '+ep.x2+','+ep.y2;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hit) e._hit.setAttribute('d', d);
    if (e._lblBg) {
      var mp = cbPt(ep.x1, ep.y1, ep.cp1x, ep.cp1y, ep.cp2x, ep.cp2y, ep.x2, ep.y2, .5);
      e._lblBg.setAttribute('x', mp.x); e._lblBg.setAttribute('y', mp.y-5);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x); e._lblTx.setAttribute('y', mp.y-5); }
    }
  });
}

// Get bounding box for a node shape
function getNodeBBox(n) {
  var shape = SHAPE_MAP[n.id];
  switch (shape) {
    case 'rounded-rect':   return {w:ROUNDED_W, h:ROUNDED_H};
    case 'rect':           return {w:RECT_W, h:RECT_H};
    case 'diamond':        return {w:DIAMOND_SX*2.6, h:DIAMOND_SY*2};
    case 'parallelogram':  return {w:PARA_W+PARA_SKEW, h:PARA_H};
    case 'data-panel':     return {w:PANEL_W, h:PANEL_H};
    default:               return {w:RECT_W, h:RECT_H};
  }
}
