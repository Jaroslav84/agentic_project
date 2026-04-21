/* clients.js — VIP cards + charts for tab_clients.html (Client Intelligence) */

var BG = '#1a1a1a', C = '#9f00fa', O = '#a78bfa', G = '#c0c0c0', R = '#7c3aed', Y = '#6b6b6b', P = '#d36eff';
var GL = 'rgba(255,255,255,0.04)';

var vipClients = [
  { name: 'BluePine', paid: 4056528, count: 209 },
  { name: 'Coast Mgmt Inc', paid: 2593366, count: 122 },
  { name: 'Summit Mgmt - Corporate', paid: 2555980, count: 195 },
  { name: 'EastRidge Housing', paid: 2454950, count: 141 },
  { name: 'Harbor Group Capital', paid: 1479737, count: 68 },
  { name: 'Interstate Equity', paid: 1308182, count: 51 },
  { name: 'Urban Residences', paid: 948160, count: 63 },
  { name: 'Evergreen', paid: 577841, count: 27 },
  { name: 'ConnectAm', paid: 552704, count: 33 },
  { name: 'Meridian Properties', paid: 521770, count: 33 }
];

var vipGrid = document.getElementById('vipGrid');
var colors = [C, C + 'cc', O, O + 'bb', Y, Y + 'aa', G, G + '88', P, P + '88'];
vipClients.forEach(function(c, i) {
  vipGrid.innerHTML += '<div class="vip-card">' +
    '<div class="vip-name">' + c.name + '</div>' +
    '<div class="vip-paid" style="color:' + colors[i] + '">$' + (c.paid / 1e6).toFixed(1) + 'M</div>' +
    '<div class="vip-count">' + c.count + ' paid proposals</div>' +
    '</div>';
});

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

new Chart('clientsBar', { type: 'bar', data: {
  labels: ['BluePine', 'Summit Corp', 'Urban Resid.', 'Coast Mgmt', 'EastRidge Housing', 'Summit LV', 'Windward Co.', 'HighRise Mgmt', 'Common Int.', 'DataVerse'],
  datasets: [{
    data: [8349735, 3287690, 2445671, 1609270, 1373994, 1140048, 968153, 916275, 789619, 785881],
    backgroundColor: [C, C + 'cc', C + '99', O + 'cc', O + '88', Y + 'aa', Y + '88', G + '88', G + '66', G + '44'],
    borderRadius: 0
  }]
}, options: { ...bs, indexAxis: 'y', scales: { x: { grid: { color: GL }, ticks: { color: '#888888', callback: function(v) { return '$' + (v / 1e6).toFixed(1) + 'M'; } } }, y: { grid: { display: false }, ticks: { color: '#c8c8c8', font: { size: 12 } } } } } });

new Chart('clientDonut', { type: 'doughnut', data: {
  labels: ['BluePine $4.1M', 'Coast Mgmt $2.6M', 'Summit Mgmt $2.6M', 'EastRidge Housing $2.5M', 'Harbor Group $1.5M', 'Rest'],
  datasets: [{
    data: [4056528, 2593366, 2555980, 2454950, 1479737, 3908657],
    backgroundColor: [C, C + 'bb', O, O + 'bb', Y, '#888888'],
    borderColor: '#323232', borderWidth: 1, hoverOffset: 8
  }]
}, options: { responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'bottom', labels: { color: '#c8c8c8', font: { size: 12 } } } } } });
