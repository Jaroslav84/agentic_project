/* callflow-edges.js -- Edge building, rendering, regions, annotations */

// Restore saved positions from localStorage
restorePositions(NODES, STORAGE_KEY);

// Node map for ID lookup
var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });

// DOM references
var edgeSvg = document.getElementById('edgeSvg');
var nodeSvg = document.getElementById('nodeSvg');
var root    = document.getElementById('cnv');
var pctx    = document.getElementById('partCvs').getContext('2d');

// Build SVG defs (patterns, filters, markers)
buildSvgDefs(edgeSvg);

// Infrastructure region backdrops
addRegion(edgeSvg, 550, 640, 300, 560, '#60be35', 'PHIL WORKER GPU', 'VAD + RNNT + Inworld (cloud)');
addRegion(edgeSvg, 580, 870, 250, 90,  '#9f00fa', 'ANTHROPIC API',   'Claude Sonnet 4.6');
addRegion(edgeSvg, 580, 270, 250, 220, '#ee9612', 'TELNYX',          'SIP trunk + AMD');

// Concurrent annotation (VAD + RNNT)
(function() {
  var g = svgEl('g', {'pointer-events':'none'});
  g.appendChild(svgEl('line', {x1:'608',y1:'680',x2:'590',y2:'680',stroke:'#60be35','stroke-width':'1','stroke-dasharray':'3,3','stroke-opacity':'0.4'}));
  g.appendChild(svgEl('line', {x1:'590',y1:'680',x2:'590',y2:'790',stroke:'#60be35','stroke-width':'1','stroke-dasharray':'3,3','stroke-opacity':'0.4'}));
  g.appendChild(svgEl('line', {x1:'590',y1:'790',x2:'608',y2:'790',stroke:'#60be35','stroke-width':'1','stroke-dasharray':'3,3','stroke-opacity':'0.4'}));
  var t = svgEl('text', {x:'570',y:'740',fill:'#60be35','font-size':'8',
    'font-family':'JetBrains Mono,monospace','text-anchor':'end','letter-spacing':'0.1em',
    opacity:'0.6',transform:'rotate(-90 570 740)'});
  t.textContent = 'CONCURRENT'; g.appendChild(t);
  edgeSvg.appendChild(g);
})();

// Latency annotation: p50 ~550ms
(function() {
  var g = svgEl('g', {'pointer-events':'none'});
  g.appendChild(svgEl('rect', {x:'830',y:'870',width:'160',height:'32',rx:'3',
    fill:'#9f00fa10',stroke:'#9f00fa40','stroke-width':'1'}));
  var t = svgEl('text', {x:'910',y:'890',fill:'#9f00fa','font-size':'13',
    'font-family':'Barlow Condensed,sans-serif','font-weight':'700','text-anchor':'middle',
    'letter-spacing':'0.06em'});
  t.textContent = 'p50 ~ 550ms END-TO-END'; g.appendChild(t);
  edgeSvg.appendChild(g);
})();

// =====================================================
// BUILD EDGES
// =====================================================
var allEdges = [];
EDGES.forEach(function(e) {
  var n1 = nm[e.f], n2 = nm[e.t];
  if (!n1 || !n2) return;
  var ep;
  if (e.arc) {
    var b1 = getNodeBoundary(n1, n1.x-140, n1.y-100);
    var b2 = getNodeBoundary(n2, n2.x-160, n2.y+60);
    ep = {x1:b1.x,y1:b1.y,cp1x:n1.x-140,cp1y:n1.y-100,cp2x:n2.x-160,cp2y:n2.y+60,x2:b2.x,y2:b2.y};
  } else if (e.loop) {
    var b1 = getNodeBoundary(n1, n1.x+260, n1.y-80);
    var b2 = getNodeBoundary(n2, n2.x+260, n2.y+80);
    ep = {x1:b1.x,y1:b1.y,cp1x:n1.x+260,cp1y:n1.y-80,cp2x:n2.x+260,cp2y:n2.y+80,x2:b2.x,y2:b2.y};
  } else {
    var b1 = getNodeBoundary(n1, n2.x, n2.y);
    var b2 = getNodeBoundary(n2, n1.x, n1.y);
    ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff || 0);
  }
  allEdges.push({f:e.f,t:e.t,c:e.c,lbl:e.lbl,spd:e.spd,arc:e.arc,loop:e.loop,
    x1:ep.x1,y1:ep.y1,cp1x:ep.cp1x,cp1y:ep.cp1y,cp2x:ep.cp2x,cp2y:ep.cp2y,x2:ep.x2,y2:ep.y2});
});

// Render edge SVG paths + labels + hit areas
allEdges.forEach(function(e) {
  var d = 'M '+e.x1+','+e.y1+' C '+e.cp1x+','+e.cp1y+' '+e.cp2x+','+e.cp2y+' '+e.x2+','+e.y2;
  var glow = svgEl('path', {d:d,fill:'none',stroke:e.c,'stroke-width':'6','stroke-opacity':'0.05','pointer-events':'none'});
  edgeSvg.appendChild(glow); e._glow = glow;
  var dash = e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6');
  var opacity = (e.c === '#585858') ? '0.25' : '0.42';
  var main = svgEl('path', {d:d,fill:'none',stroke:e.c,
    'stroke-width':e.spd>=4?'2':'1.5', 'stroke-opacity':opacity,
    'stroke-dasharray':dash, 'marker-end':'url(#arr'+e.c.slice(1)+')', 'pointer-events':'none'});
  edgeSvg.appendChild(main); e._main = main;
  if (e.lbl) {
    var mp = cbPt(e.x1,e.y1,e.cp1x,e.cp1y,e.cp2x,e.cp2y,e.x2,e.y2,.5);
    var lox = 0, loy = -5;
    if (e.arc)  { lox = -30; loy = -10; }
    if (e.loop) { lox = 40;  loy = 0; }
    var bg = svgEl('text', {x:mp.x+lox,y:mp.y+loy,fill:'#141414','font-size':'8',
      'font-family':'JetBrains Mono,monospace','text-anchor':'middle',
      stroke:'#141414','stroke-width':'3','stroke-linejoin':'round','pointer-events':'none'});
    bg.textContent = e.lbl; edgeSvg.appendChild(bg); e._lblBg = bg;
    var tx = svgEl('text', {x:mp.x+lox,y:mp.y+loy,fill:e.c,'font-size':'8',
      'font-family':'JetBrains Mono,monospace','text-anchor':'middle',
      opacity:'0.75','letter-spacing':'0.06em','pointer-events':'none'});
    tx.textContent = e.lbl; edgeSvg.appendChild(tx); e._lblTx = tx;
  }
  var hitPath = svgEl('path', {d:d,fill:'none',stroke:'transparent','stroke-width':'18','pointer-events':'stroke',cursor:'pointer'});
  edgeSvg.appendChild(hitPath); e._hit = hitPath;
  (function(edge) {
    hitPath.addEventListener('mouseenter', function(ev) { showEdgeTooltip(edge, ev); });
    hitPath.addEventListener('mousemove', function(ev) { moveTooltip(ev); });
    hitPath.addEventListener('mouseleave', function() { hideTooltip(); });
  })(e);
});

// Latency badges on edges
(function() {
  var badges = [
    {label:'~150ms', x:645, y:628, c:'#60be35'},
    {label:'~0ms',   x:645, y:738, c:'#60be35'},
    {label:'~200ms', x:645, y:853, c:'#9f00fa'},
    {label:'~200ms', x:645, y:973, c:'#9f00fa'}
  ];
  badges.forEach(function(b) {
    edgeSvg.appendChild(svgEl('rect', {x:b.x-24,y:b.y-9,width:50,height:16,rx:'3',
      fill:'#141414',stroke:b.c+'40','stroke-width':'0.5','pointer-events':'none'}));
    var t = svgEl('text', {x:b.x,y:b.y+3,fill:b.c,'font-size':'9',
      'font-family':'JetBrains Mono,monospace','text-anchor':'middle',
      'font-weight':'500',opacity:'0.85','pointer-events':'none'});
    t.textContent = b.label; edgeSvg.appendChild(t);
  });
})();
