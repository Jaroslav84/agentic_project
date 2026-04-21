/* intro.js — tab_intro.html charts + seasonality · depends on Chart.js */
var buckets = ["0\u20133d","4\u20137d","8\u201314d","15\u201330d","31\u201390d","91\u2013365d","365d+"];
var deals   = [648, 172, 143, 209, 350, 247, 19];
var values  = [7439685,2390012,2467322,3578719,5517988,5244814,447361];
var avgs    = [11481, 13895, 17254, 17123, 15766, 21234, 23545];
var pcts    = [36.2, 9.6, 8.0, 11.7, 19.6, 13.8, 1.1];

var C='#9f00fa',O='#a78bfa',G='#c0c0c0',R='#7c3aed',Y='#6b6b6b',Cl='#d36eff';
var barColors=[C,Cl,'#b070e8','#c084fc','#8b8b8b','#a0a0a0','#505050'];
var GL='rgba(0,0,0,0.25)';
var TT={backgroundColor:'#2a2a2a',borderColor:'rgba(159,0,250,0.4)',borderWidth:1,titleColor:'#fff',bodyColor:'#d4d4d4',padding:10};
var tickStyle={color:'#969696',font:{size:13,family:'JetBrains Mono'}};

var mainCtx=document.getElementById('mainChart').getContext('2d');
var mainChart=new Chart(mainCtx,{
  type:'bar',
  data:{labels:buckets,datasets:[{label:'Deals Won',data:deals,backgroundColor:barColors.map(function(c){return c+'bb';}),borderColor:barColors,borderWidth:1,borderRadius:0}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:Object.assign({},TT,{callbacks:{label:function(c){return ' '+c.parsed.y.toLocaleString()+' deals';}}})},scales:{x:{ticks:tickStyle,grid:{color:GL}},y:{ticks:tickStyle,grid:{color:GL}}}}
});

var tabData={deals:deals,value:values,avg:avgs,pct:pcts};
var tabFmt={
  deals:function(v){ return ' '+v.toLocaleString()+' deals'; },
  value:function(v){ return ' $'+v.toLocaleString(); },
  avg:function(v){ return ' $'+v.toLocaleString(); },
  pct:function(v){ return ' '+v.toFixed(1)+'%'; }
};
var tabYFmt={
  deals:undefined,
  value:function(v){ return '$'+(v/1000).toFixed(0)+'k'; },
  avg:function(v){ return '$'+(v/1000).toFixed(0)+'k'; },
  pct:function(v){ return v+'%'; }
};

function switchTab(type,btn){
  document.querySelectorAll('.ctab').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  mainChart.data.datasets[0].data=tabData[type];
  mainChart.options.plugins.tooltip.callbacks.label=function(c){ return tabFmt[type](c.parsed.y); };
  mainChart.options.scales.y.ticks.callback=tabYFmt[type];
  mainChart.update();
}

// Pie chart
new Chart(document.getElementById('pieChart').getContext('2d'),{
  type:'doughnut',
  data:{labels:['Won \u226430d','Won >30d \u2014 bot zone'],datasets:[{data:[65.5,34.5],backgroundColor:['#3d3d3d',C],borderColor:['#282828','#6c00b5'],borderWidth:2,hoverOffset:6}]},
  options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false},tooltip:Object.assign({},TT,{callbacks:{label:function(c){return ' '+c.parsed+'%';}}})}}
});

// Avg deal size line chart
new Chart(document.getElementById('avgChart').getContext('2d'),{
  type:'line',
  data:{labels:buckets,datasets:[{label:'Avg Deal Size',data:avgs,borderColor:C,backgroundColor:'rgba(159,0,250,0.07)',fill:true,pointBackgroundColor:avgs.map(function(v){return v>20000?Cl:C;}),pointRadius:avgs.map(function(v){return v>20000?7:5;}),borderWidth:2,tension:.35}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:Object.assign({},TT,{callbacks:{label:function(c){return ' $'+c.parsed.y.toLocaleString();}}})},scales:{x:{ticks:tickStyle,grid:{color:GL}},y:{ticks:Object.assign({},tickStyle,{callback:function(v){return '$'+(v/1000).toFixed(0)+'k';}}),grid:{color:GL}}}}
});

// Seasonality bars
var months=[
  {m:'Jan',v:51,val:556324},{m:'Feb',v:53,val:787521},{m:'Mar',v:77,val:964841},
  {m:'Apr',v:64,val:1386533},{m:'May',v:85,val:1193390},{m:'Jun',v:69,val:1104344},
  {m:'Jul',v:93,val:1512557},{m:'Aug',v:129,val:1502498},{m:'Sep',v:88,val:1536678},
  {m:'Oct',v:119,val:1911181},{m:'Nov',v:72,val:924171},{m:'Dec',v:67,val:760737}
];
var maxM=Math.max.apply(null,months.map(function(m){return m.v;}));
var sb=document.getElementById('seasonBars');
months.forEach(function(m){
  var h=Math.round(m.v/maxM*64)+4;
  var isApr=m.m==='Apr', isOct=m.m==='Oct';
  var col=isApr?C:isOct?'#a0a0a0':m.v>=90?'#8b8b8b':'#3d3d3d';
  var div=document.createElement('div');
  div.className='sbar';
  div.title=m.m+': '+m.v+' deals · $'+(m.val/1000).toFixed(0)+'k';
  div.innerHTML='<div class="sbar-fill" style="height:'+h+'px;background:'+col+'"></div>'
    +'<div class="sbar-lbl" style="color:'+(isApr?C:isOct?'#a0a0a0':'#969696')+'">'+m.m+'</div>'
    +'<div class="sbar-val">'+m.v+'</div>';
  sb.appendChild(div);
});
