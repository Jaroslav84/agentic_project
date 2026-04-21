/* contacts.js — Chart logic for tab_contacts.html (Contact Coverage & Transfer Pool) */

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

new Chart('tierBar', { type: 'bar', data: {
  labels: ['T1: userlocation', 'T5: HubSpot deal', 'T6: HS engagement', 'Unreachable'],
  datasets: [{
    data: [1066, 317, 100, 3],
    backgroundColor: [G, C + 'bb', P + '66', R],
    borderColor: [G, C, P, R],
    borderWidth: 1
  }]
}, options: { ...bs, scales: { x: { grid: { display: false }, ticks: { color: '#888888', font: { size: 11 } } }, y: { grid: { color: GL }, ticks: { color: '#888888' } } } } });

new Chart('rolesBar', { type: 'bar', data: {
  labels: ['No role', 'Prop.Mgr', 'Reg.Mgr', 'Prop.Maint', 'Hoa PM', 'Reg.Maint', 'Asset Mgr', 'Constr.Mgr', 'Owner', 'VP'],
  datasets: [
    { label: 'Total', data: [1663, 701, 206, 110, 59, 67, 55, 48, 43, 19], backgroundColor: '#888888', borderWidth: 0, yAxisID: 'y' },
    { label: 'Has Phone', data: [955, 591, 149, 92, 46, 54, 34, 38, 31, 14], backgroundColor: C + '77', borderColor: C, borderWidth: 1, yAxisID: 'y' }
  ]
}, options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true, labels: { color: '#c8c8c8', font: { size: 12 } } } },
  scales: { x: { grid: { display: false }, ticks: { color: '#888888', font: { size: 11 } } }, y: { grid: { color: GL }, ticks: { color: '#888888' } } }
} });
