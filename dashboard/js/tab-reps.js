/* tab-reps.js — Rep table + charts for tab_reps.html (Sales Rep Analysis) */

var BG = '#1a1a1a', C = '#9f00fa', O = '#a78bfa', G = '#c0c0c0', R = '#7c3aed', Y = '#6b6b6b', P = '#d36eff';
var GL = 'rgba(255,255,255,0.04)';
var bs = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#2a2a2a',
      titleColor: '#ffffff',
      bodyColor: '#c8c8c8',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1
    }
  }
};

var reps = [
  { name: 'Rachel Winters', status: 'gone', props: 538, value: 14133675, paid: 11887657, color: R, queue: 'Auto-dial \ud83d\udd34', hs: '\u2718' },
  { name: 'Mike Larson', status: 'gone', props: 268, value: 8190383, paid: 406181, color: R, queue: 'Auto-dial \ud83d\udd34', hs: '\u2718' },
  { name: 'Sarah Mitchell', status: 'active', props: 130, value: 4847620, paid: 498008, color: O, queue: 'Escalation \ud83d\udfe1', hs: '<span class="hs-dot">\u25C8</span>' },
  { name: 'Marco Diaz', status: 'active', props: 156, value: 4259879, paid: 364831, color: G, queue: 'Auto-dial \ud83d\udd34', hs: '<span class="hs-dot">\u25C8</span>' },
  { name: 'Morgan Ellis', status: 'owner', props: 40, value: 2180799, paid: 270651, color: Y, queue: 'Alex reviews \ud83d\udfe1', hs: '<span class="hs-dot">\u25C8</span>' },
  { name: 'Andrea Black', status: 'gone', props: 91, value: 1211628, paid: 5920898, color: R, queue: 'Auto-dial \ud83d\udd34', hs: '\u2718' },
  { name: 'Dan Harper', status: 'active', props: 47, value: 895186, paid: 31741, color: G, queue: 'Auto-dial \ud83d\udfe0', hs: '<span class="hs-dot">\u25C8</span>' },
  { name: 'Ray C.', status: 'semi', props: 29, value: 702149, paid: 810496, color: P, queue: 'Auto-dial \ud83d\udfe0', hs: '<span class="hs-dot">\u25C8</span>' },
  { name: 'Ruben Santos', status: 'active', props: 15, value: 423034, paid: 28405, color: G, queue: 'Auto-dial \ud83d\udfe0', hs: '<span class="hs-dot">\u25C8</span>' },
  { name: 'Edward Knox', status: 'gone', props: 16, value: 355696, paid: 5681397, color: R, queue: 'Auto-dial \ud83d\udfe0', hs: '\u2718' },
  { name: 'Victor Greene', status: 'gone', props: 14, value: 146122, paid: 894, color: R, queue: 'Auto-dial \ud83d\udfe2', hs: '\u2718' },
  { name: 'Leah Baker', status: 'active', props: 7, value: 115724, paid: 0, color: G, queue: 'Auto-dial \ud83d\udfe2', hs: '\u2718 NO SEAT' },
  { name: 'Rena Franklin', status: 'admin', props: 5, value: 22935, paid: 0, color: P, queue: 'Alex queue \ud83d\udfe2', hs: '<span class="hs-dot">\u25C8</span>' },
  { name: 'Nick Ingram', status: 'gone', props: 1, value: 0, paid: 58971, color: R, queue: 'Auto-dial \ud83d\udfe2', hs: '\u2718' }
];

var maxVal = Math.max.apply(null, reps.map(function(r) { return r.value; }));
var tbody = document.getElementById('repTableBody');
reps.forEach(function(r) {
  var pct = (r.value / maxVal * 100).toFixed(1);
  var pipelinePct = (r.value / 37484833 * 100).toFixed(1);
  var statusMap = { gone: 'gone', active: 'active', owner: 'active', semi: 'active', admin: 'gone' };
  var labelMap = { gone: 'GONE', active: 'ACTIVE', owner: 'OWNER', semi: 'SEMI-RETIRED', admin: 'ADMIN' };
  var av = (typeof buildAvatar === 'function') ? buildAvatar(r.name, 26) : '';
  tbody.innerHTML += '<tr>' +
    '<td style="white-space:nowrap"><span style="display:inline-flex;align-items:center;gap:8px">' + av + '<span class="rep-name">' + r.name + '</span></span></td>' +
    '<td><span class="badge ' + statusMap[r.status] + '">' + labelMap[r.status] + '</span></td>' +
    '<td style="color:' + r.color + '">' + r.props + '</td>' +
    '<td style="color:' + r.color + '">$' + (r.value / 1e6).toFixed(2) + 'M</td>' +
    '<td style="width:160px"><div style="display:flex;align-items:center;gap:6px"><div class="val-bar" style="flex:1"><div class="val-fill" style="width:' + pct + '%;background:' + r.color + '"></div></div><span style="font-size:11px;color:var(--td);width:32px;text-align:right">' + pipelinePct + '%</span></div></td>' +
    '<td style="color:#c8c8c8">$' + (r.paid / 1e6).toFixed(2) + 'M</td>' +
    '<td style="color:#c8c8c8;font-size:11px">' + r.queue + '</td>' +
    '<td style="font-size:12px">' + r.hs + '</td>' +
    '</tr>';
});

// Rep bar chart
new Chart('repBar', { type: 'bar', data: {
  labels: reps.map(function(r) { return r.name.split(' ').slice(-1)[0]; }),
  datasets: [{
    data: reps.map(function(r) { return r.value / 1e6; }),
    backgroundColor: reps.map(function(r) { return r.color + '99'; }),
    borderColor: reps.map(function(r) { return r.color; }),
    borderWidth: 1
  }]
}, options: { ...bs, scales: { x: { grid: { display: false }, ticks: { color: '#888888', font: { size: 11 } } }, y: { grid: { color: GL }, ticks: { color: '#888888', callback: function(v) { return '$' + v + 'M'; } } } } } });

// Rep donut
new Chart('repDonut', { type: 'doughnut', data: {
  labels: ['Winters $14.1M', 'Larson $8.2M', 'Sarah $4.8M', 'Marco $4.3M', 'Morgan $2.2M', 'Other $4.0M'],
  datasets: [{
    data: [14133675, 8190383, 4847620, 4259879, 2180799, 3872476],
    backgroundColor: [R, R + 'bb', O, G, Y, P + '88'],
    borderColor: '#323232', borderWidth: 1, hoverOffset: 8
  }]
}, options: { responsive: true, maintainAspectRatio: false, cutout: '55%', plugins: { legend: { position: 'bottom', labels: { color: '#c8c8c8', font: { size: 12 } } } } } });
