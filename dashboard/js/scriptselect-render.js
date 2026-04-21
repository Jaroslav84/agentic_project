/* scriptselect-render.js — rendering functions for Script Selection graph */

// =====================================================
// EDGE GEOMETRY
// =====================================================
function clipToBorder(n, tx, ty) {
  var shape = NODE_SHAPES[n.id] || 'leaf';
  var dx = tx - n.x, dy = ty - n.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return {x: n.x, y: n.y + 23};
  if (shape === 'diamond') {
    var s = 48, sw = s * 1.3;
    var scale = 1.0 / ((Math.abs(dx) || 0.001) / sw + (Math.abs(dy) || 0.001) / s);
    return {x: n.x + dx * scale, y: n.y + dy * scale};
  }
  var hw, hh;
  if (shape === 'keyrule') { hw = 95; hh = 36; }
  else { hw = 70; hh = 23; }
  var scaleX = hw / (Math.abs(dx) || 0.001), scaleY = hh / (Math.abs(dy) || 0.001);
  var scale = Math.min(scaleX, scaleY);
  return {x: n.x + dx * scale, y: n.y + dy * scale};
}

function makeEdgePath(x1, y1, x2, y2, perpOff) {
  if (perpOff) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
    x1 += -dy / len * perpOff; y1 += dx / len * perpOff;
    x2 += -dy / len * perpOff; y2 += dx / len * perpOff;
  }
  var dy2 = y2 - y1;
  return {x1:x1, y1:y1, cp1x:x1, cp1y:y1 + dy2 * .5, cp2x:x2, cp2y:y2 - dy2 * .5, x2:x2, y2:y2};
}

// =====================================================
// NODE SVG SHAPES
// =====================================================
function drawDiamond(n) {
  var s = 48, sw = s * 1.3;
  var g = svgEl('g', {id: 'node-' + n.id, cursor: 'grab', 'pointer-events': 'all'});
  // Outer glow for hub pulse effect
  g.appendChild(svgEl('polygon', {
    points: n.x + ',' + (n.y - s) + ' ' + (n.x + sw) + ',' + n.y + ' ' + n.x + ',' + (n.y + s) + ' ' + (n.x - sw) + ',' + n.y,
    fill: 'none', stroke: n.c, 'stroke-width': '2', 'stroke-opacity': '0',
    'class': 'diamond-glow'
  }));
  // Diamond polygon
  g.appendChild(svgEl('polygon', {
    points: n.x + ',' + (n.y - s) + ' ' + (n.x + sw) + ',' + n.y + ' ' + n.x + ',' + (n.y + s) + ' ' + (n.x - sw) + ',' + n.y,
    fill: n.c + '15', stroke: n.c + '60', 'stroke-width': '1.5'
  }));
  // Inner subtle glow line
  g.appendChild(svgEl('polygon', {
    points: n.x + ',' + (n.y - s) + ' ' + (n.x + sw) + ',' + n.y + ' ' + n.x + ',' + (n.y + s) + ' ' + (n.x - sw) + ',' + n.y,
    fill: 'none', stroke: n.c, 'stroke-width': '0.5', 'stroke-opacity': '0.2',
    filter: 'url(#none)'
  }));
  // Priority label
  var label = svgEl('text', {
    x: n.x, y: n.y - 8, fill: n.c,
    'font-family': 'Barlow Condensed, sans-serif', 'font-size': '13',
    'font-weight': '700', 'text-anchor': 'middle', 'letter-spacing': '0.04em'
  });
  label.textContent = n.label;
  g.appendChild(label);
  // Sub text
  var st = svgEl('text', {
    x: n.x, y: n.y + 8, fill: '#b0b0b0',
    'font-family': 'JetBrains Mono, monospace', 'font-size': '9',
    'text-anchor': 'middle', opacity: '0.7'
  });
  st.textContent = n.sub.split('\n')[0];
  g.appendChild(st);
  // Status indicator
  var details = NODE_DETAILS[n.id];
  if (details) {
    g.appendChild(svgEl('circle', {
      cx: n.x, cy: n.y + 20, r: '2.5', fill: details.sc, opacity: '0.8'
    }));
    var statusTxt = svgEl('text', {
      x: n.x, y: n.y + 30, fill: details.sc,
      'font-family': 'JetBrains Mono, monospace', 'font-size': '7',
      'text-anchor': 'middle', opacity: '0.45', 'letter-spacing': '0.1em'
    });
    statusTxt.textContent = details.status;
    g.appendChild(statusTxt);
  }
  return g;
}

function drawLeaf(n) {
  var w = 140, h = 46;
  var g = svgEl('g', {id: 'node-' + n.id, cursor: 'grab', 'pointer-events': 'all'});
  // Main rect
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: '3',
    fill: n.c + '10', stroke: n.c + '40', 'stroke-width': '1'
  }));
  // Left accent border
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: 3, height: h,
    fill: n.c + '80', rx: '1'
  }));
  // Inner glow on left border
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: 1, height: h,
    fill: n.c, opacity: '0.3'
  }));
  // Tier label
  var label = svgEl('text', {
    x: n.x - w / 2 + 14, y: n.y - 4, fill: n.c,
    'font-family': 'Barlow Condensed, sans-serif', 'font-size': '14',
    'font-weight': '700', 'text-anchor': 'start', 'letter-spacing': '0.03em'
  });
  label.textContent = n.label;
  g.appendChild(label);
  // Description (first line)
  var desc = svgEl('text', {
    x: n.x - w / 2 + 14, y: n.y + 10, fill: '#b0b0b0',
    'font-family': 'JetBrains Mono, monospace', 'font-size': '8.5',
    'text-anchor': 'start', opacity: '0.7'
  });
  desc.textContent = n.sub.split('\n')[0];
  g.appendChild(desc);
  // Second line
  var lines = n.sub.split('\n');
  if (lines.length > 1) {
    var desc2 = svgEl('text', {
      x: n.x - w / 2 + 14, y: n.y + 19, fill: '#b0b0b0',
      'font-family': 'JetBrains Mono, monospace', 'font-size': '8',
      'text-anchor': 'start', opacity: '0.5'
    });
    desc2.textContent = lines[1];
    g.appendChild(desc2);
  }
  // Status LED
  var details = NODE_DETAILS[n.id];
  if (details) {
    g.appendChild(svgEl('circle', {
      cx: n.x + w / 2 - 12, cy: n.y - h / 2 + 10, r: '2.5',
      fill: details.sc, opacity: '0.7'
    }));
  }
  return g;
}

function drawKeyRule(n) {
  var w = 190, h = 72;
  var g = svgEl('g', {id: 'node-' + n.id, cursor: 'grab', 'pointer-events': 'all'});
  // Outer glow rect
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2 - 2, y: n.y - h / 2 - 2, width: w + 4, height: h + 4, rx: '5',
    fill: 'none', stroke: n.c + '25', 'stroke-width': '1', 'stroke-dasharray': '4,3'
  }));
  // Main rect
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: '4',
    fill: n.c + '12', stroke: n.c + '50', 'stroke-width': '1.5'
  }));
  // Star icon
  var starY = n.y - h / 2 + 14;
  var starPath = svgEl('text', {
    x: n.x - w / 2 + 14, y: starY, fill: n.c,
    'font-size': '14', 'text-anchor': 'middle', opacity: '0.9'
  });
  starPath.textContent = '\u2605';
  g.appendChild(starPath);
  // "KEY RULE" label
  var label = svgEl('text', {
    x: n.x - w / 2 + 26, y: starY, fill: n.c,
    'font-family': 'Barlow Condensed, sans-serif', 'font-size': '14',
    'font-weight': '700', 'text-anchor': 'start', 'letter-spacing': '0.06em'
  });
  label.textContent = 'KEY RULE';
  g.appendChild(label);
  // Rule text lines
  var lines = n.sub.split('\n');
  lines.forEach(function(line, i) {
    var lt = svgEl('text', {
      x: n.x - w / 2 + 14, y: n.y - h / 2 + 28 + i * 12,
      fill: i === 0 ? '#ffffff' : '#b0b0b0',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': i === 0 ? '10' : '8.5',
      'text-anchor': 'start', opacity: i === 0 ? '0.9' : '0.55',
      'font-weight': i === 0 ? '700' : '400'
    });
    lt.textContent = line;
    g.appendChild(lt);
  });
  return g;
}
