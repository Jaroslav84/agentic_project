/* transfer-shapes.js — SVG node shape drawing for Warm Transfer graph */

// Draw a rounded-rect node (terminal / engagement nodes)
function drawRoundedRect(n) {
  var w = ROUNDED_W, h = ROUNDED_H, rx = 20;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:rx,
    fill:n.c+'12', stroke:n.c+'60', 'stroke-width':'1.5', class:'node-shape'
  }));
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2+rx/2, width:2, height:h-rx, rx:'1',
    fill:n.c, opacity:'0.5'
  }));
  g.appendChild(svgText(n.x, n.y-6, n.label, {
    fill:n.c, 'font-size':'13', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif',
    'text-anchor':'middle', 'letter-spacing':'0.04em', 'text-transform':'uppercase'
  }));
  n.sub.split('\n').forEach(function(line, i) {
    g.appendChild(svgText(n.x, n.y+10+i*11, line, {
      fill:'#b0b0b0', 'font-size':'10', opacity:'0.7',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
    }));
  });
  return g;
}

// Draw a rectangular node
function drawRect(n) {
  var w = RECT_W, h = RECT_H;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'3',
    fill:n.c+'10', stroke:n.c+'45', 'stroke-width':'1.5', class:'node-shape'
  }));
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2+3, width:2.5, height:h-6, rx:'1',
    fill:n.c, opacity:'0.6'
  }));
  g.appendChild(svgText(n.x, n.y-8, n.label, {
    fill:n.c, 'font-size':'12.5', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif',
    'text-anchor':'middle', 'letter-spacing':'0.04em'
  }));
  n.sub.split('\n').forEach(function(line, i) {
    g.appendChild(svgText(n.x, n.y+6+i*12, line, {
      fill:'#b0b0b0', 'font-size':'9.5', opacity:'0.65',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
    }));
  });
  return g;
}

// Draw a diamond node (decision point)
function drawDiamond(n) {
  var sx = DIAMOND_SX, sy = DIAMOND_SY;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  var points = n.x+','+(n.y-sy)+' '+(n.x+sx*1.3)+','+n.y+' '+n.x+','+(n.y+sy)+' '+(n.x-sx*1.3)+','+n.y;
  g.appendChild(svgEl('polygon', {
    points:points, fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5', class:'node-shape'
  }));
  if (n.hub) {
    var pulse = svgEl('polygon', {
      points:points, fill:'none', stroke:n.c, 'stroke-width':'2', 'stroke-opacity':'0.5'
    });
    pulse.innerHTML = '<animate attributeName="stroke-opacity" values="0.5;0;0" dur="2.8s" repeatCount="indefinite"/>' +
      '<animate attributeName="stroke-width" values="2;14;14" dur="2.8s" repeatCount="indefinite"/>';
    g.appendChild(pulse);
  }
  g.appendChild(svgText(n.x, n.y-5, n.label, {
    fill:n.c, 'font-size':'11.5', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif', 'text-anchor':'middle', 'letter-spacing':'0.04em'
  }));
  g.appendChild(svgText(n.x, n.y+10, 'First answer?', {
    fill:'#60be35', 'font-size':'9.5', opacity:'0.8',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
  }));
  g.appendChild(svgText(n.x, n.y+21, 'All timeout?', {
    fill:'#ff4040', 'font-size':'9.5', opacity:'0.8',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
  }));
  return g;
}

// Draw a parallelogram node (SMS / messaging)
function drawParallelogram(n) {
  var w = PARA_W, h = PARA_H, skew = PARA_SKEW;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  var points = (n.x-w/2+skew)+','+(n.y-h/2)+' '+(n.x+w/2+skew)+','+(n.y-h/2)+' '+
               (n.x+w/2-skew)+','+(n.y+h/2)+' '+(n.x-w/2-skew)+','+(n.y+h/2);
  g.appendChild(svgEl('polygon', {
    points:points, fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5', class:'node-shape'
  }));
  g.appendChild(svgText(n.x, n.y-5, n.label, {
    fill:n.c, 'font-size':'12', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif', 'text-anchor':'middle', 'letter-spacing':'0.04em'
  }));
  n.sub.split('\n').forEach(function(line, i) {
    g.appendChild(svgText(n.x, n.y+9+i*12, line, {
      fill:'#b0b0b0', 'font-size':'9.5', opacity:'0.65',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
    }));
  });
  return g;
}

// Draw the data-panel node (rep pool)
function drawDataPanel(n) {
  var w = PANEL_W, h = PANEL_H;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'4',
    fill:'#1a1a1a', stroke:n.c+'50', 'stroke-width':'1.5', class:'node-shape'
  }));
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2, width:w, height:26, rx:'4', fill:n.c+'18', stroke:'none'
  }));
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2+18, width:w, height:8, fill:n.c+'18', stroke:'none'
  }));
  g.appendChild(svgEl('line', {
    x1:n.x-w/2, y1:n.y-h/2+26, x2:n.x+w/2, y2:n.y-h/2+26,
    stroke:n.c+'30', 'stroke-width':'1'
  }));
  g.appendChild(svgText(n.x, n.y-h/2+17, n.label, {
    fill:n.c, 'font-size':'13', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif', 'text-anchor':'middle', 'letter-spacing':'0.06em'
  }));
  g.appendChild(svgText(n.x, n.y-h/2+40, '10 reps \u00b7 Weighted priority', {
    fill:'#b0b0b0', 'font-size':'9.5', opacity:'0.6',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
  }));
  REPS_LIST.forEach(function(rep, i) {
    var isWarn = rep.includes('\u26a0');
    var yPos = n.y - h/2 + 56 + i * 19;
    g.appendChild(svgText(n.x-w/2+12, yPos, '\u25B8', {
      fill:isWarn ? '#ee9612' : '#585858', 'font-size':'8.5',
      'font-family':'JetBrains Mono,monospace'
    }));
    g.appendChild(svgText(n.x-w/2+22, yPos, rep, {
      fill:isWarn ? '#ee9612' : '#d4d4d4', 'font-size':'10',
      'font-family':'JetBrains Mono,monospace'
    }));
  });
  var details = NODE_DETAILS[n.id];
  if (details) {
    g.appendChild(svgEl('circle', {
      cx:n.x-w/2+14, cy:n.y+h/2-12, r:'3', fill:details.sc, opacity:'0.8'
    }));
    g.appendChild(svgText(n.x-w/2+22, n.y+h/2-9, details.status, {
      fill:details.sc, 'font-size':'9', opacity:'0.6',
      'font-family':'JetBrains Mono,monospace', 'letter-spacing':'0.1em'
    }));
  }
  return g;
}

// Add status LED below a non-panel node
function addStatusLED(g, n) {
  var details = NODE_DETAILS[n.id];
  if (!details) return;
  if (SHAPE_MAP[n.id] === 'data-panel') return;
  var bbox = getNodeBBox(n);
  var ledY = n.y + bbox.h/2 + 10;
  g.appendChild(svgEl('circle', {
    cx:n.x-14, cy:ledY, r:'2.5', fill:details.sc, opacity:'0.8',
    style:'filter:drop-shadow(0 0 3px '+details.sc+')'
  }));
  g.appendChild(svgText(n.x-8, ledY+3, details.status, {
    fill:details.sc, 'font-size':'8.5', opacity:'0.5',
    'font-family':'JetBrains Mono,monospace', 'letter-spacing':'0.1em'
  }));
}

// Render a node by shape type
function renderNode(n) {
  var shape = SHAPE_MAP[n.id];
  var g;
  switch (shape) {
    case 'rounded-rect':   g = drawRoundedRect(n); break;
    case 'rect':           g = drawRect(n); break;
    case 'diamond':        g = drawDiamond(n); break;
    case 'parallelogram':  g = drawParallelogram(n); break;
    case 'data-panel':     g = drawDataPanel(n); break;
    default:               g = drawRect(n); break;
  }
  addStatusLED(g, n);
  return g;
}
