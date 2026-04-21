/* transfer-ui.js — tooltips, particles, animation for Warm Transfer graph */

// Tooltip (node)
function showTooltip(n, e2) {
  var d = NODE_DETAILS[n.id]; if (!d) return;
  document.getElementById('tt-name').textContent = n.label;
  document.getElementById('tt-name').style.color = n.c;
  document.getElementById('tt-role').textContent = d.role;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = d.sc; sdot.style.color = d.sc;
  document.getElementById('tt-sv').textContent = d.status;
  document.getElementById('tt-sv').style.color = d.sc;
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) {
      return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>';
    }).join('');
  var sends = EDGES.filter(function(e) { return e.f === n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2192</span> <span>' +
      (nm[e.t] ? nm[e.t].label : e.t) +
      (e.lbl ? ' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>' : '') +
      '</span></div>';
  }).join('');
  var recvs = EDGES.filter(function(e) { return e.t === n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2190</span> <span>' +
      (nm[e.f] ? nm[e.f].label : e.f) +
      (e.lbl ? ' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>' : '') +
      '</span></div>';
  }).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends ? '<div class="tt-conn-title">Sends to</div>'+sends : '') +
    (recvs ? '<div class="tt-conn-title" style="margin-top:'+(sends ? 6 : 0)+'px">Receives from</div>'+recvs : '');
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(e2);
}

// Tooltip (edge)
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
  var headIcon = document.getElementById('tt-head-icon');
  if (headIcon) headIcon.innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) {
      return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>';
    }).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
}

// Particles
var particles = [];
allEdges.forEach(function(e) {
  var cnt = e.spd >= 4.5 ? 4 : e.spd >= 3 ? 3 : e.spd >= 2 ? 2 : 1;
  for (var j = 0; j < cnt; j++) particles.push({edge:e, t:j/cnt, trail:[]});
});

// Animation loop
var lastTime = performance.now();
function animate(now) {
  var dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 1000);
  particles.forEach(function(p) {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    var e = p.edge;
    var pt = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, p.t);
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
