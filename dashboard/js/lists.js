/* lists.js — tab_lists.html logic · depends on csv_data.js */
if (typeof CSV_DATA === 'undefined') {
  document.getElementById('content-area').innerHTML =
    '<div class="err-wrap"><span class="err-icon">⚠</span>'
    + '<span class="err-msg">csv_data.js failed to load — place it alongside this file</span></div>';
  document.getElementById('sidebar').innerHTML =
    '<div class="err-sidebar">⚠ csv_data.js<br>not found</div>';
  throw new Error('csv_data.js not loaded');
}
var currentKey=null, currentData=[], filteredData=[], sortCol=null, sortDir=1;
var groups = [
  {label:'People', keys:['SALES_PEOPLE']},
  {label:'VIP Lists', keys:['VIP_CLIENTS','VIP_CUSTOMERS','VIP_DEALS','VIP_LOCATIONS']},
  {label:'Blacklists', keys:['BLACKLIST_CLIENTS','BLACKLIST_CUSTOMERS','BLACKLIST_DEALS','BLACKLIST_LOCATIONS','BLACKLIST_SUBS']},
];
var groupBadge = {
  people: '<span class="badge-ppl">PEOPLE</span>',
  vip: '<span class="badge-vip">VIP — ALEX REVIEWS FIRST</span>',
  blacklist: '<span class="badge-bl">BLACKLIST — NEVER CONTACT</span>',
};

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
  document.getElementById('tbl-meta').textContent = d.rows + ' entries · ' + d.cols.length + ' fields';
  document.getElementById('tbl-badge').innerHTML = groupBadge[d.group] || '';
  document.getElementById('searchInput').value = '';
  if (key === 'SALES_PEOPLE') renderPeopleCards(currentData);
  else renderTable();
}

function onSearch() {
  var q = document.getElementById('searchInput').value.toLowerCase().trim();
  filteredData = q ? currentData.filter(function(row) {
    return Object.values(row).some(function(v){ return String(v).toLowerCase().includes(q); });
  }) : currentData.slice();
  if (currentKey === 'SALES_PEOPLE') renderPeopleCards(filteredData);
  else renderTable();
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

function fmtVal(col, val) {
  if (val===''||val===null||val===undefined) return '<span class="dim-dash">\u2014</span>';
  if (['total_price','total_value','total_paid_value','stale_value','paid_value'].includes(col) && !isNaN(parseFloat(val)))
    return '$'+parseFloat(val).toLocaleString('en-US',{maximumFractionDigits:0});
  return String(val);
}

function cellCls(col, val) {
  if (['total_price','total_value','total_paid_value','stale_value','paid_value','propID','userID','clientID','locID','days_stale'].includes(col)) return 'num';
  if (col==='status') {
    var v=String(val).toLowerCase();
    if(v.includes('active')) return 's-active'; if(v.includes('gone')) return 's-gone';
    if(v.includes('owner')) return 's-owner'; if(v.includes('semi')) return 's-semi';
    if(v.includes('admin')||v.includes('hr')||v.includes('inactive')||v.includes('test')) return 's-inactive';
  }
  if (col==='transfer_pool') return val==='yes'?'s-active':val==='yes-last-resort'?'s-semi':'s-inactive';
  if (col==='disabled') return val==1?'s-gone':'s-active';
  if (col==='notes'&&String(val).includes('OQ')) return 'warn';
  return '';
}

function renderTable() {
  var d = CSV_DATA[currentKey];
  document.getElementById('rowCount').textContent = filteredData.length+' / '+currentData.length+' rows';
  var html='<div class="table-wrap"><table><thead><tr>';
  d.cols.forEach(function(col) {
    var cls=sortCol===col?(sortDir===1?'sort-asc':'sort-desc'):'';
    html+='<th class="'+cls+'" onclick="sortTable(\''+col+'\')">'+col+'</th>';
  });
  html+='</tr></thead><tbody>';
  var limit=Math.min(filteredData.length,2000);
  for(var i=0;i<limit;i++){
    var row=filteredData[i]; html+='<tr>';
    d.cols.forEach(function(col){
      var v=row[col];
      html+='<td class="'+cellCls(col,v)+'" title="'+String(v).replace(/"/g,'&quot;')+'">'+fmtVal(col,v)+'</td>';
    });
    html+='</tr>';
  }
  if(filteredData.length>2000)
    html+='<tr><td colspan="'+d.cols.length+'" class="truncation-msg">Showing first 2,000 of '+filteredData.length+' rows — use search to filter</td></tr>';
  html+='</tbody></table></div>';
  var ca=document.getElementById('content-area');
  ca.classList.remove('content-scroll'); ca.classList.add('content-hidden');
  ca.innerHTML=html;
}

var TRANSFER_PRIORITY={5163:1,7075:2,7073:3,6677:4,6571:5,7077:6,6826:7,7202:8,7151:9};

function renderPeopleCards(data) {
  document.getElementById('rowCount').textContent = data.length+' people';
  var sections = {
    'Active Transfer Pool': data.filter(function(p){ return p.transfer_pool==='yes'||p.transfer_pool==='yes-last-resort'; }),
    'Owner / Semi-Retired': data.filter(function(p){ return p.status==='owner'||String(p.status).indexOf('semi')===0; }),
    'Departed Reps': data.filter(function(p){ return String(p.status).startsWith('gone'); }),
    'Admin / Non-Sales': data.filter(function(p){
      return ['admin','hr','inactive','test'].some(function(s){ return String(p.status).includes(s)&&!String(p.status).includes('gone'); });
    }),
  };
  var html='<div class="people-wrap">';
  Object.keys(sections).forEach(function(title) {
    var people=sections[title];
    if(!people.length) return;
    html+='<div class="section-hdr">'+title+' <span class="section-count">('+people.length+')</span></div>';
    html+='<div class="people-grid">';
    people.forEach(function(p) {
      var status=String(p.status);
      var cardCls=status.includes('gone')?'gone':status==='owner'||status.indexOf('semi')===0?'owner semi':status==='active'?'active':'inactive';
      var staleVal=parseFloat(p.stale_value);
      var staleCls=staleVal>1000000?'stale-high':staleVal>100000?'stale-mid':'stale-low';
      var tags='';
      if(p.transfer_pool==='yes') tags+='<span class="tag transfer">TRANSFER POOL</span>';
      if(p.transfer_pool==='yes-last-resort') tags+='<span class="tag transfer">LAST RESORT</span>';
      if(status.includes('gone')) tags+='<span class="tag gone">GONE</span>';
      if(p.hs_owner_id&&p.hs_owner_id!=='') tags+='<span class="tag hs">\u25C8 HUBSPOT</span>';
      else if(p.transfer_pool!=='no') tags+='<span class="tag no-hs">NO HS SEAT</span>';
      if(p.notes&&String(p.notes).includes('OQ')) tags+='<span class="tag oq">OPEN QUESTION</span>';
      var staleStr=staleVal>0?'$'+(staleVal/1e6).toFixed(2)+'M stale':'';
      var paidStr=parseFloat(p.paid_value)>0?'$'+(parseFloat(p.paid_value)/1e6).toFixed(2)+'M paid':'';
      var pri=TRANSFER_PRIORITY[parseInt(p.userID)];
      var personId=findPersonId?findPersonId(p.fName+' '+p.lName):null;
      html+='<div class="person-card '+cardCls+'"'+(personId?' data-person="'+personId+'"':'')+'>';
      if(pri) html+='<div class="p-priority">#'+pri+'</div>';
      var av=(typeof buildAvatar==='function'&&personId)?buildAvatar(personId,36):'';
      if(av) html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">'+av+'<div class="p-name">'+p.fName+' '+p.lName+'</div></div>';
      else html+='<div class="p-name">'+p.fName+' '+p.lName+'</div>';
      html+='<div class="p-role">'+p.role+' · userID='+p.userID+'</div>';
      if(p.phone&&p.phone!=='TBD'&&p.phone!=='') html+='<div class="p-phone">'+p.phone+'</div>';
      else if(p.phone==='TBD') html+='<div class="p-phone phone-tbd">⚠️ Phone TBD</div>';
      html+='<div class="p-email">'+p.email+'</div>';
      if(staleStr) html+='<div class="p-stale '+staleCls+'">'+staleStr+'</div><div class="p-stale-lbl">stale pipeline</div>';
      if(paidStr) html+='<div class="p-paid">'+paidStr+' historical</div>';
      if(tags) html+='<div class="p-tags">'+tags+'</div>';
      if(p.notes) html+='<div class="p-notes">'+p.notes+'</div>';
      html+='</div>';
    });
    html+='</div>';
  });
  html+='</div>';
  var ca=document.getElementById('content-area');
  ca.classList.remove('content-hidden'); ca.classList.add('content-scroll');
  ca.innerHTML=html;
}

window.addEventListener('message', function(e) {
  if (!window.matchOrigin(e.origin)) return;
  if (!e.data || e.data.action !== 'loadFile') return;
  if (e.data.key) loadFile(e.data.key);
});
loadFile('SALES_PEOPLE');
