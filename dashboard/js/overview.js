/* overview.js — Chart logic for tab_overview.html (Pipeline Overview) */

var BG = '#1a1a1a', BG2 = '#242424', BG3 = '#2a2a2a';
var C = '#9f00fa', O = '#a78bfa', G = '#c0c0c0', R = '#7c3aed', Y = '#6b6b6b', P = '#d36eff';
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

new Chart('ageBar', { type: 'bar', data: {
  labels: ['7\u201330d\n99 props', '31\u201390d\n132 props', '91\u2013365d\n537 props', '365d+\n522 props'],
  datasets: [{
    label: 'Proposals',
    data: [99, 132, 537, 522],
    backgroundColor: [G + '99', Y + '99', O + '99', R + '99'],
    borderColor: [G, Y, O, R],
    borderWidth: 1
  }]
}, options: { ...bs, scales: { x: { grid: { color: GL }, ticks: { color: '#888888', font: { size: 12 } } }, y: { grid: { color: GL }, ticks: { color: '#888888' } } } } });

new Chart('threshDonut', { type: 'doughnut', data: {
  labels: ['Auto-dial \u2264$30k \u2014 $11.1M (991 props)', 'Human Review >$30k \u2014 $25M (321 props)'],
  datasets: [{ data: [11080844, 24986096], backgroundColor: [G, O], borderColor: '#323232', borderWidth: 1, hoverOffset: 8 }]
}, options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#c8c8c8', font: { size: 12 } } } } } });

new Chart('ageValBar', { type: 'bar', data: {
  labels: ['7\u201330d', '31\u201390d', '91\u2013365d', '365d+'],
  datasets: [{
    label: 'Value ($M)',
    data: [3.56, 3.48, 15.08, 13.58],
    backgroundColor: [G + '99', Y + '99', O + '99', R + '99'],
    borderColor: [G, Y, O, R],
    borderWidth: 1
  }]
}, options: { ...bs, scales: { x: { grid: { color: GL }, ticks: { color: '#888888', font: { size: 12 } } }, y: { grid: { color: GL }, ticks: { color: '#888888', callback: function(v) { return '$' + v + 'M'; } } } } } });

new Chart('contactDonut', { type: 'doughnut', data: {
  labels: ['Has PT tier-1 contact (1,066)', 'No PT contact \u2014 needs HS waterfall (317)'],
  datasets: [{ data: [1066, 317], backgroundColor: [C, R + 'cc'], borderColor: '#323232', borderWidth: 1, hoverOffset: 8 }]
}, options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#c8c8c8', font: { size: 12 } } } } } });

new Chart('tstampDonut', { type: 'doughnut', data: {
  labels: ['Callable (tstamp_sent set) \u2014 $36M', 'NULL tstamp_sent \u2014 $1.42M (46 props)'],
  datasets: [{ data: [36062441, 1422392], backgroundColor: [C, R + 'cc'], borderColor: '#323232', borderWidth: 1, hoverOffset: 8 }]
}, options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#c8c8c8', font: { size: 12 } } } } } });
