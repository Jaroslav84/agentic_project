/* browser.js — tab_browser.html logic · depends on csv_data.js */
if (typeof CSV_DATA === 'undefined') {
  document.getElementById('sidebar').innerHTML = '<div class="err-sidebar">⚠ csv_data.js<br>not found</div>';
  document.getElementById('tableWrap').innerHTML =
    '<div class="err-wrap"><span class="err-icon">⚠</span>'
    + '<span class="err-msg">csv_data.js failed to load — place it alongside this file</span></div>';
  throw new Error('csv_data.js not loaded');
}
var currentKey=null, currentData=[], filteredData=[], sortCol=null, sortDir=1;

// Group definitions
var groups = [
  {label:'Proposals', keys:['DATA_PROPOSALS_ALL','WATERFALL_ALL']},
  {label:'People', keys:['SALES_PEOPLE']},
  {label:'VIP Lists', keys:['VIP_CLIENTS','VIP_CUSTOMERS','VIP_DEALS','VIP_LOCATIONS']},
  {label:'Blacklists', keys:['BLACKLIST_CLIENTS','BLACKLIST_CUSTOMERS','BLACKLIST_DEALS','BLACKLIST_LOCATIONS','BLACKLIST_SUBS']},
];

// Build sidebar
var sidebar = document.getElementById('sidebar');
groups.forEach(function(grp) {
  var lbl = document.createElement('div');
  lbl.className = 'grp-label';
  lbl.textContent = grp.label;
  sidebar.appendChild(lbl);
  grp.keys.forEach(function(key) {
    var d = CSV_DATA[key], btn = document.createElement('button');
    btn.className = 'file-btn';
    btn.id = 'btn-' + key;
    btn.innerHTML = '<span class="fname">' + d.label + '</span><span class="fcount">' + d.rows + '</span>';
    btn.onclick = function() { loadFile(key); };
    sidebar.appendChild(btn);
  });
});

function loadFile(key) {
  currentKey = key;
  var d = CSV_DATA[key];
  currentData = d.data;
  filteredData = currentData.slice();
  sortCol = null; sortDir = 1;
  document.querySelectorAll('.file-btn').forEach(function(b){ b.classList.remove('on'); });
  document.getElementById('btn-' + key).classList.add('on');
  document.getElementById('tbl-title').textContent = d.label;
  document.getElementById('tbl-meta').textContent = d.rows + ' rows · ' + d.cols.length + ' columns · ' + key.replace(/_/g,' ').toLowerCase();
  document.getElementById('searchInput').value = '';
  renderTable();
}

function filterTable() {
  var q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!q) { filteredData = currentData.slice(); }
  else {
    filteredData = currentData.filter(function(row) {
      return Object.values(row).some(function(v){ return String(v).toLowerCase().includes(q); });
    });
  }
  renderTable();
}

function sortTable(col) {
  if (sortCol === col) sortDir *= -1; else { sortCol = col; sortDir = 1; }
  filteredData.sort(function(a,b) {
    var av=a[col], bv=b[col], an=parseFloat(av), bn=parseFloat(bv);
    if (!isNaN(an) && !isNaN(bn)) return (an-bn)*sortDir;
    return String(av).localeCompare(String(bv))*sortDir;
  });
  renderTable();
}

var DATE_COLS = ["tstamp_sent","tstamp_created","tstamp_updated","hs_created_date","hs_last_modified_date"];

function fmtDate(v) {
  if (!v || v==="") return "";
  var d = new Date(String(v).replace(" ","T"));
  if (isNaN(d.getTime())) return String(v);
  var now = new Date();
  var days = Math.floor((now-d)/86400000);
  var str = String(v).slice(0,10);
  var cls = days===0 ? 'rel-today' : days<7 ? 'rel-week' : days<30 ? 'rel-month' : days>365 ? 'rel-old' : 'rel-default';
  var label = days===0 ? 'today' : days+'d ago';
  if (days>365) label = Math.floor(days/365)+'y ago';
  return str + ' <span class="' + cls + '">' + label + '</span>';
}

function cellClass(col, val) {
  var numCols = ['total_price','total_value','total_paid_value','paid_proposals','days_stale','propID','userID','clientID','locID'];
  if (numCols.includes(col)) return "num";
  if (DATE_COLS.includes(col)) return "date-col";
  if (col === 'reason' && String(val).toLowerCase().includes('vip')) return 'vip';
  if (col === 'reason') return 'blacklist';
  return '';
}

function formatVal(col, val) {
  if (DATE_COLS.includes(col) && val && val !== "") return fmtDate(val);
  if (val===''||val===null||val===undefined) return '<span class="dim-dash">\u2014</span>';
  if (col === 'propID' && val && val !== '') {
    return '<a href="https://app.fieldtech.example/#/pins?propID=' + val
      + '" target="_blank" class="prop-link" title="Open in FieldTECH">' + val + '</a>';
  }
  if ((col==='total_price'||col==='total_value'||col==='total_paid_value') && !isNaN(parseFloat(val)))
    return '$'+parseFloat(val).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0});
  return String(val);
}

function renderTable() {
  var d = CSV_DATA[currentKey];
  var wrap = document.getElementById('tableWrap');
  document.getElementById('rowCount').textContent = filteredData.length + ' / ' + currentData.length + ' rows';
  var html = '<table><thead><tr>';
  d.cols.forEach(function(col) {
    var cls = sortCol===col ? (sortDir===1 ? 'sort-asc' : 'sort-desc') : '';
    html += '<th class="'+cls+'" onclick="sortTable(\''+col+'\')">'+col+'</th>';
  });
  html += '</tr></thead><tbody>';
  var limit = Math.min(filteredData.length, 2000);
  for (var i=0; i<limit; i++) {
    var row = filteredData[i]; html += '<tr>';
    d.cols.forEach(function(col) {
      var val = row[col], cls = cellClass(col, val);
      html += '<td class="'+cls+'" title="'+String(val).replace(/"/g,'&quot;')+'">'+formatVal(col,val)+'</td>';
    });
    html += '</tr>';
  }
  if (filteredData.length > 2000)
    html += '<tr><td colspan="'+d.cols.length+'" class="truncation-msg">Showing first 2,000 of '+filteredData.length+' rows — use search to filter</td></tr>';
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

window.addEventListener('message', function(e) {
  if (!window.matchOrigin(e.origin)) return;
  if (!e.data || e.data.action !== 'filter') return;
  var key = e.data.key, val = e.data.val || '';
  if (key === 'null_tstamp') {
    loadFile('DATA_PROPOSALS_ALL');
    filteredData = currentData.filter(function(r){ return !r.tstamp_sent || r.tstamp_sent === ''; });
    document.getElementById('searchInput').value = '';
    document.getElementById('searchInput').placeholder = 'Filtered: 46 proposals with NULL tstamp_sent';
    renderTable();
  } else if (key === 'DATA_PROPOSALS_ALL' || key === 'no_contact') {
    loadFile('DATA_PROPOSALS_ALL');
    if (val) { document.getElementById('searchInput').value = val; filterTable(); }
  }
});
loadFile('DATA_PROPOSALS_ALL');
