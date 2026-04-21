/* pipeline.js — Chart logic for tab_pipeline.html (Pipeline Deep Dive) */

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

new Chart('closeWindow', { type: 'bar', data: {
  labels: ['0\u20133d', '4\u20137d', '8\u201314d', '15\u201330d', '31\u201390d', '91\u2013365d', '365d+'],
  datasets: [
    { label: 'Deals', data: [648, 172, 143, 209, 350, 247, 19], backgroundColor: C + '55', borderColor: C, borderWidth: 1, yAxisID: 'y' },
    { label: 'Avg Value ($k)', data: [11.5, 13.9, 17.3, 17.1, 15.8, 21.2, 23.5], type: 'line', borderColor: O, backgroundColor: 'transparent', pointBackgroundColor: O, pointRadius: 4, borderWidth: 2, yAxisID: 'y2', tension: .3 }
  ]
}, options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true, labels: { color: '#c8c8c8', font: { size: 12 } } } },
  scales: {
    x: { grid: { color: GL }, ticks: { color: '#888888' } },
    y: { grid: { color: GL }, ticks: { color: C } },
    y2: { position: 'right', grid: { display: false }, ticks: { color: '#c8c8c8', callback: function(v) { return '$' + v + 'k'; } } }
  }
} });

new Chart('ageVal', { type: 'bar', data: {
  labels: ['7\u201330d\n$3.56M', '31\u201390d\n$3.48M', '91\u2013365d\n$15.08M', '365d+\n$13.58M'],
  datasets: [{
    data: [3.56, 3.48, 15.08, 13.58],
    backgroundColor: [G + '88', Y + '88', O + '88', R + '88'],
    borderColor: [G, Y, O, R],
    borderWidth: 1
  }]
}, options: { ...bs, scales: { x: { grid: { color: GL }, ticks: { color: '#888888', font: { size: 12 } } }, y: { grid: { color: GL }, ticks: { color: '#888888', callback: function(v) { return '$' + v + 'M'; } } } } } });

new Chart('cwDonut', { type: 'doughnut', data: {
  labels: ['0\u20133d (648)', '4\u20137d (172)', '8\u201314d (143)', '15\u201330d (209)', '31\u201390d (350)', '91d+ (266)'],
  datasets: [{ data: [648, 172, 143, 209, 350, 266], backgroundColor: [G, G + 'bb', C, C + '88', O, R], borderColor: '#323232', borderWidth: 1 }]
}, options: { responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'bottom', labels: { color: '#c8c8c8', font: { size: 12 } } } } } });

new Chart('cwValDonut', { type: 'doughnut', data: {
  labels: ['0\u20133d $7.4M', '4\u20137d $2.4M', '8\u201314d $2.5M', '15\u201330d $3.6M', '31\u201390d $5.5M', '91d+ $5.7M'],
  datasets: [{ data: [7439685, 2390012, 2467322, 3578719, 5517988, 5692175], backgroundColor: [G, G + 'bb', C, C + '88', O, R], borderColor: '#323232', borderWidth: 1 }]
}, options: { responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'bottom', labels: { color: '#c8c8c8', font: { size: 12 } } } } } });

new Chart('dealSize', { type: 'bar', data: {
  labels: ['<$5k', '$5k\u2013$15k', '$15k\u2013$30k', '$30k\u2013$75k', '$75k\u2013$150k', '$150k+'],
  datasets: [{
    label: 'Proposals',
    data: [189, 421, 412, 185, 98, 52],
    backgroundColor: [R + '66', Y + '66', G + '66', C + '66', O + '66', P + '66'],
    borderColor: [R, Y, G, C, O, P],
    borderWidth: 1
  }]
}, options: { ...bs, scales: { x: { grid: { display: false }, ticks: { color: '#888888', font: { size: 12 } } }, y: { grid: { color: GL }, ticks: { color: '#888888' } } } } });
