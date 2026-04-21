/* dashboard.js — C&C Dashboard: data, map, routes, animation (merged) */

// ── DATA ──
var DAY_OF_YEAR   = 100;
var DAILY_ROT_RAD = (DAY_OF_YEAR * 2) * Math.PI / 180;
var DEG           = Math.PI / 180;
var KM_TO_MI      = 0.621371;

var REPS = [
  { id:5163,   short:'Marco D.',   initials:'MD', color:'#ff6b35', lat:38.107, lng:-122.257, active:true,  territory:{km:34, ao:0  } },
  { id:7075,   short:'Sarah M.',   initials:'SM', color:'#9f00fa', lat:38.448, lng:-122.726, active:true,  territory:{km:58, ao:40 } },
  { id:7073,   short:'Dan H.',     initials:'DH', color:'#505050', lat:38.255, lng:-122.040, active:false, territory:null },
  { id:6677,   short:'Ruben S.',   initials:'RS', color:'#60be35', lat:38.297, lng:-122.286, active:true,  territory:{km:44, ao:80 } },
  { id:6571,   short:'Amy A.',     initials:'AA', color:'#ee9612', lat:37.906, lng:-122.065, active:true,  territory:{km:38, ao:130} },
  { id:7077,   short:'Henry J.',   initials:'HJ', color:'#00d4ff', lat:37.783, lng:-122.218, active:true,  territory:{km:26, ao:190} },
  { id:6826,   short:'Leah B.',    initials:'LB', color:'#ff4081', lat:37.671, lng:-122.086, active:true,  territory:{km:24, ao:245} },
  { id:7202,   short:'Jenna M.',   initials:'JM', color:'#505050', lat:38.581, lng:-121.494, active:false, territory:null },
  { id:7151,   short:'Stacy K.',   initials:'SK', color:'#b0b0b0', lat:38.574, lng:-121.488, active:true,  territory:{km:52, ao:300} },
  { id:'ivan', short:'Alex',       initials:'AX', color:'#d36eff', lat:37.812, lng:-122.267, active:true,  territory:{km:130,ao:330} }
];

var CLIENTS = [
  {id:1,  name:'DataVerse / Maple Court',      city:'Fair Oaks',    lat:38.636,lng:-121.283,value:187450,status:'enrolled',   propId:9124,days:42 },
  {id:2,  name:'HighRise Mgmt / Oakridge Commons', city:'Hayward',  lat:37.669,lng:-122.081,value:296791,status:'enrolled',   propId:9347,days:334},
  {id:3,  name:'BluePine / Riverside Plaza',   city:'Walnut Creek', lat:37.906,lng:-122.066,value:94200, status:'not_started',propId:8234,days:63 },
  {id:4,  name:'Harbor Group / Cedar Hills',   city:'Alameda',      lat:37.756,lng:-122.233,value:38700, status:'not_started',propId:8345,days:388},
  {id:5,  name:'Horizon HOA / Lakeview Terrace',city:'Sacramento',  lat:38.595,lng:-121.460,value:62500, status:'enrolled',   propId:7234,days:55 },
  {id:6,  name:'Summit Mgmt / Sunset Park',    city:'Fremont',      lat:37.548,lng:-121.989,value:127400,status:'won',        propId:7856,days:28 },
  {id:7,  name:'Crestwood / Willow Creek',     city:'Napa',         lat:38.299,lng:-122.286,value:89000, status:'enrolled',   propId:8123,days:34 },
  {id:8,  name:'Elm Creek / Ashford Grove',    city:'Antioch',      lat:38.005,lng:-121.806,value:38200, status:'not_started',propId:8456,days:201},
  {id:9,  name:'FirstCall / Park Meadows',     city:'San Rafael',   lat:37.974,lng:-122.531,value:85600, status:'enrolled',   propId:8012,days:33 },
  {id:10, name:'Boulevard / Hillcrest',        city:'Walnut Creek', lat:37.895,lng:-122.058,value:112000,status:'enrolled',   propId:7456,days:47 },
  {id:11, name:'Kendal / Stone Ridge',         city:'Benicia',      lat:38.053,lng:-122.156,value:54200, status:'not_started',propId:9567,days:89 },
  {id:12, name:'Coast Mgmt / Pine Valley',     city:'Belmont',      lat:37.521,lng:-122.276,value:71400, status:'enrolled',   propId:7890,days:21 },
  {id:13, name:'Apex Mgmt / Brookside',        city:'Antioch',      lat:38.014,lng:-121.819,value:33900, status:'not_started',propId:8761,days:178},
  {id:14, name:'Allegiant / Garden Court',     city:'Agua Caliente',lat:38.307,lng:-122.430,value:47200, status:'not_started',propId:9678,days:119},
  {id:15, name:'East Ridge / Bay View',        city:'Mountain View',lat:37.390,lng:-122.082,value:58400, status:'not_started',propId:9234,days:263},
  {id:16, name:'Primrose / Forest Knoll',      city:'San Francisco',lat:37.773,lng:-122.419,value:93200, status:'enrolled',   propId:7654,days:39 },
  {id:17, name:'Windward / Valley Oak',        city:'Sacramento',   lat:38.578,lng:-121.465,value:154800,status:'enrolled',   propId:7321,days:14 },
  {id:18, name:'Ashby / Copper Creek',         city:'Citrus Heights',lat:38.707,lng:-121.281,value:41600,status:'not_started',propId:9012,days:156},
  {id:19, name:'Northstar / Silver Point',     city:'San Jose',     lat:37.260,lng:-121.853,value:178200,status:'enrolled',   propId:6987,days:22 },
  {id:20, name:'SouthPoint / Fairway',         city:'San Jose',     lat:37.309,lng:-121.892,value:52400, status:'not_started',propId:9456,days:341},
  {id:21, name:'DataVerse / 540 Stone Way',    city:'Sacramento',   lat:38.555,lng:-121.490,value:67300, status:'enrolled',   propId:7789,days:29 },
  {id:22, name:'HighRise Mgmt / Antioch Family',city:'Elk Grove',   lat:38.408,lng:-121.371,value:44900, status:'not_started',propId:9123,days:193},
  {id:23, name:'BluePine / Independence Plz',  city:'Folsom',       lat:38.678,lng:-121.176,value:83500, status:'not_started',propId:8567,days:415},
  {id:24, name:'Harbor Group / Cherrywood',    city:'Alameda',      lat:37.760,lng:-122.248,value:35800, status:'not_started',propId:9345,days:228},
  {id:25, name:'Horizon HOA / El Portal',      city:'Sunnyvale',    lat:37.370,lng:-122.036,value:61200, status:'enrolled',   propId:7112,days:51 },
  {id:26, name:'Summit Mgmt / Belage Manor',   city:'Pleasant Hill',lat:37.947,lng:-122.061,value:29800, status:'not_started',propId:9782,days:447},
  {id:27, name:'Crestwood / The Falls',        city:'Benicia',      lat:37.553,lng:-122.267,value:43800, status:'not_started',propId:9018,days:147},
  {id:28, name:'Elm Creek / Mira Vista',       city:'Alamo',        lat:37.851,lng:-121.991,value:67800, status:'not_started',propId:9341,days:97 },
  {id:29, name:'FirstCall / Deer Valley',      city:'Antioch',      lat:38.001,lng:-121.796,value:51200, status:'won',        propId:6782,days:18 },
  {id:30, name:'Boulevard / Rohlff Manor',     city:'Alameda',      lat:37.765,lng:-122.242,value:29800, status:'won',        propId:7234,days:8  }
];

// ── MAP ──
var map = L.map('map', { center:[38.1,-122.1], zoom:9, zoomControl:true, attributionControl:true, scrollWheelZoom:true, zoomSnap:0.5 });
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution:'&copy; OSM &copy; CARTO', subdomains:'abcd', maxZoom:19 }).addTo(map);

// ── ZOOM ANIMATION SYNC ──
var cvs = document.getElementById('cvs');
map.on('zoomstart', function(){ cvs.style.transition='opacity 0.12s'; cvs.style.opacity='0'; });
map.on('zoomend',   function(){ cvs.style.opacity='1'; map.invalidateSize(); });

// ── MAP CANVAS ──
var ctx = cvs.getContext('2d');
var mapSection = document.querySelector('.map-section');
function resizeMapCanvas(){
  cvs.width  = mapSection.offsetWidth  || window.innerWidth;
  cvs.height = mapSection.offsetHeight || Math.round(window.innerHeight * 0.62);
  map.invalidateSize();
}

// ── ROUTE CANVAS ──
var rcvs = document.getElementById('rcvs');
var rctx = rcvs.getContext('2d');
var routeWrap = document.querySelector('.route-cvs-wrap');
function resizeRouteCanvas(){
  rcvs.width  = routeWrap.offsetWidth  || window.innerWidth;
  rcvs.height = routeWrap.offsetHeight || Math.round(window.innerHeight * 0.28);
}

function resizeAll(){ resizeMapCanvas(); resizeRouteCanvas(); }
window.addEventListener('resize', resizeAll);
requestAnimationFrame(function(){ requestAnimationFrame(resizeAll); });

// ── HELPERS ──
function toXY(lat,lng){ var p=map.latLngToContainerPoint([lat,lng]); return [p.x,p.y]; }
function kmToPx(km){ var p1=map.latLngToContainerPoint([38.0,-122.2]),p2=map.latLngToContainerPoint([38.0+km/111.32,-122.2]); return Math.max(5,Math.abs(p1.y-p2.y)); }
function hexRgb(h){ h=h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
function rgba(hex,a){ var c=hexRgb(hex); return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'; }
function lerp(a,b,t){ return a+(b-a)*t; }
function haversine(lat1,lng1,lat2,lng2){
  var R=6371, d2r=Math.PI/180;
  var dlat=(lat2-lat1)*d2r, dlng=(lng2-lng1)*d2r;
  var a=Math.sin(dlat/2)*Math.sin(dlat/2)+Math.cos(lat1*d2r)*Math.cos(lat2*d2r)*Math.sin(dlng/2)*Math.sin(dlng/2);
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// ── NEAREST-NEIGHBOR TSP ──
function nnTSP(home, clients){
  if(!clients.length) return [];
  var unvisited=clients.slice(), route=[];
  var cur=home;
  while(unvisited.length){
    var mi=Infinity,bi=0;
    unvisited.forEach(function(c,i){ var d=haversine(cur.lat,cur.lng,c.lat,c.lng); if(d<mi){mi=d;bi=i;} });
    route.push(unvisited[bi]);
    cur=unvisited[bi];
    unvisited.splice(bi,1);
  }
  return route;
}

// ── ASSIGN CLIENTS TO REPS ──
function buildRoutes(){
  var byRep={};
  REPS.forEach(function(r){ if(r.active&&r.id!==7073&&r.id!==7202) byRep[r.id]=[]; });

  CLIENTS.forEach(function(c){
    var md=Infinity, bId=null;
    REPS.forEach(function(r){
      if(!r.active||r.id===7073||r.id===7202) return;
      var d=haversine(c.lat,c.lng,r.lat,r.lng);
      if(d<md){md=d;bId=r.id;}
    });
    if(bId!=null) byRep[bId].push(c);
  });

  var routes=[];
  REPS.forEach(function(rep,ri){
    if(!rep.active||rep.id===7073||rep.id===7202) return;
    var clients=byRep[rep.id];
    if(!clients.length) return;
    var ordered=nnTSP(rep,clients);
    var wps=[
      {label:'HOME',lat:rep.lat,lng:rep.lng,isHome:true,status:null},
    ].concat(ordered.map(function(c){return {label:c.name,city:c.city,lat:c.lat,lng:c.lng,isHome:false,status:c.status,value:c.value,propId:c.propId};}))
     .concat([{label:'RTN',lat:rep.lat,lng:rep.lng,isHome:true,status:null}]);
    var dists=[0];
    for(var i=1;i<wps.length;i++)
      dists.push(dists[i-1]+haversine(wps[i-1].lat,wps[i-1].lng,wps[i].lat,wps[i].lng));
    var totalKm=dists[dists.length-1];
    var phaseOffset=ri/REPS.length;
    routes.push({rep:rep,wps:wps,dists:dists,totalKm:totalKm,t:phaseOffset%1,speed:0.00035+Math.random()*0.00020,pulses:[]});
  });

  var totalStops=routes.reduce(function(s,r){return s+r.wps.length-2;},0);
  var totalMi=routes.reduce(function(s,r){return s+r.totalKm*KM_TO_MI;},0);
  document.getElementById('route-summary').textContent=
    routes.length+' reps \u00b7 '+totalStops+' stops \u00b7 '+totalMi.toFixed(0)+' mi total';
  return routes;
}

var routes = buildRoutes();

// ── MAP ANIMATION STATE ──
var bees=[];
REPS.forEach(function(rep,ri){
  if(!rep.active||rep.id===7073||rep.id===7202) return;
  var n=rep.id==='ivan'?1:2;
  for(var i=0;i<n;i++){
    bees.push({ri:ri,ci:Math.floor(Math.random()*CLIENTS.length),t:Math.random(),returning:Math.random()>.5,
      speed:0.0008+Math.random()*0.0012,trail:[],state:'flying',pause:0,cs:Math.random()>.5?1:-1});
  }
});
var mapPulses=[];
var radarAngle=0, frame=0;

// ── TOOLTIP ──
var tooltip=document.getElementById('tooltip');
map.on('mousemove',function(e){
  var mx=e.containerPoint.x, my=e.containerPoint.y;
  var sx=e.originalEvent.clientX, sy=e.originalEvent.clientY;
  var hit=null;
  CLIENTS.forEach(function(c){ var xy=toXY(c.lat,c.lng); if(Math.hypot(mx-xy[0],my-xy[1])<14) hit=c; });
  if(hit){
    var sl=hit.status==='won'?'WON':hit.status==='enrolled'?'ENROLLED':'NOT STARTED';
    tooltip.innerHTML='<div class="tn">'+hit.name+' \u00b7 '+hit.city+'</div><div>propID #'+hit.propId+' &nbsp;\u00b7&nbsp; <span class="tv">$'+hit.value.toLocaleString()+'</span></div><div>'+hit.days+'d stale</div><div class="ts '+hit.status+'">'+sl+'</div>';
    tooltip.style.display='block';
    tooltip.style.left=(sx+14)+'px';
    tooltip.style.top=(sy-10)+'px';
  } else {
    var rhit=null;
    REPS.forEach(function(r){ var xy=toXY(r.lat,r.lng); if(Math.hypot(mx-xy[0],my-xy[1])<16) rhit=r; });
    if(rhit){
      tooltip.innerHTML='<div class="tn">'+rhit.short+'</div><div>'+(rhit.active?(rhit.id==='ivan'?'FALLBACK':'ACTIVE'):'DISABLED')+'</div>';
      tooltip.style.display='block';
      tooltip.style.left=(sx+14)+'px';
      tooltip.style.top=(sy-10)+'px';
    } else tooltip.style.display='none';
  }
});
map.on('mouseout',function(){tooltip.style.display='none';});

// ── DRAW MAP CANVAS ──
function drawMap(){
  ctx.clearRect(0,0,cvs.width,cvs.height);
  frame++; radarAngle=(radarAngle+0.007)%(Math.PI*2);

  // 1. territories
  REPS.forEach(function(rep){
    if(!rep.territory||!rep.active||rep.id===7073||rep.id===7202) return;
    var xy=toXY(rep.lat,rep.lng), x=xy[0], y=xy[1], r=kmToPx(rep.territory.km);
    var c=hexRgb(rep.color), rr=c[0], gg=c[1], bb=c[2];
    var g1=ctx.createRadialGradient(x,y,0,x,y,r);
    g1.addColorStop(0,'rgba('+rr+','+gg+','+bb+',0.20)');
    g1.addColorStop(0.55,'rgba('+rr+','+gg+','+bb+',0.09)');
    g1.addColorStop(1,'rgba('+rr+','+gg+','+bb+',0)');
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle=g1; ctx.fill();
    // stripes
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    ctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.07)'; ctx.lineWidth=1;
    for(var i=-r*2;i<r*2;i+=11){ ctx.beginPath(); ctx.moveTo(x+i,y-r); ctx.lineTo(x+i+r,y+r); ctx.stroke(); }
    ctx.restore();
    // dashed border
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.setLineDash([5,8]); ctx.lineDashOffset=-(frame*0.22);
    ctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.38)'; ctx.lineWidth=1.5; ctx.stroke(); ctx.setLineDash([]);
    // sweep sector
    var sd=(rep.territory.ao*DEG)+DAILY_ROT_RAD+frame*0.0022;
    var sw=DEG*36;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.arc(x,y,r*0.82,sd-sw/2,sd+sw/2); ctx.closePath();
    ctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.13)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+Math.cos(sd)*r*0.82,y+Math.sin(sd)*r*0.82);
    ctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.7)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y,r*0.28,0,Math.PI*2);
    ctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.18)'; ctx.lineWidth=1; ctx.stroke();
  });

  // 2. global radar
  var rc=toXY(37.95,-122.35), rCx=rc[0], rCy=rc[1], radarR=kmToPx(185);
  ctx.beginPath(); ctx.moveTo(rCx,rCy); ctx.arc(rCx,rCy,radarR,radarAngle-DEG*13,radarAngle); ctx.closePath();
  ctx.fillStyle='rgba(159,0,250,0.035)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(rCx,rCy); ctx.lineTo(rCx+Math.cos(radarAngle)*radarR,rCy+Math.sin(radarAngle)*radarR);
  ctx.strokeStyle='rgba(159,0,250,0.18)'; ctx.lineWidth=1; ctx.stroke();

  // 3. connection lines
  bees.forEach(function(bee){
    if(bee.state!=='flying') return;
    var rep=REPS[bee.ri],client=CLIENTS[bee.ci];
    var p1=toXY(rep.lat,rep.lng), p2=toXY(client.lat,client.lng);
    var c=hexRgb(rep.color);
    ctx.beginPath(); ctx.moveTo(p1[0],p1[1]); ctx.lineTo(p2[0],p2[1]);
    ctx.setLineDash([2,13]); ctx.lineDashOffset=-(frame*0.5);
    ctx.strokeStyle='rgba('+c[0]+','+c[1]+','+c[2]+',0.14)'; ctx.lineWidth=0.8; ctx.stroke(); ctx.setLineDash([]);
  });

  // 4. map pulses
  for(var i=mapPulses.length-1;i>=0;i--){
    var p=mapPulses[i]; p.r+=1.7; p.a-=0.013;
    if(p.a<=0){mapPulses.splice(i,1);continue;}
    var pc=hexRgb(p.color);
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.strokeStyle='rgba('+pc[0]+','+pc[1]+','+pc[2]+','+p.a+')'; ctx.lineWidth=1.5; ctx.stroke();
    if(p.r>12){ ctx.beginPath(); ctx.arc(p.x,p.y,p.r*0.5,0,Math.PI*2); ctx.strokeStyle='rgba('+pc[0]+','+pc[1]+','+pc[2]+','+(p.a*0.5)+')'; ctx.lineWidth=1; ctx.stroke(); }
  }

  // 5. bees
  bees.forEach(function(bee){
    var rep=REPS[bee.ri],client=CLIENTS[bee.ci];
    var p1=toXY(rep.lat,rep.lng), x1=p1[0], y1=p1[1];
    var p2=toXY(client.lat,client.lng), x2=p2[0], y2=p2[1];
    var c=hexRgb(rep.color), rr=c[0], gg=c[1], bb=c[2];
    if(bee.state==='paused'){
      bee.pause--; if(bee.pause<=0){bee.state='flying';bee.returning=!bee.returning;if(!bee.returning){bee.ci=Math.floor(Math.random()*CLIENTS.length);bee.cs=Math.random()>.5?1:-1;}bee.trail=[];}
      return;
    }
    var mx=(x1+x2)/2+bee.cs*(y2-y1)*0.27, my=(y1+y2)/2-bee.cs*(x2-x1)*0.27;
    var t=bee.returning?(1-bee.t):bee.t;
    var u=1-t,bx=u*u*x1+2*u*t*mx+t*t*x2,by=u*u*y1+2*u*t*my+t*t*y2;
    bee.trail.push([bx,by]); if(bee.trail.length>20) bee.trail.shift();
    for(var j=1;j<bee.trail.length;j++){
      ctx.beginPath(); ctx.moveTo(bee.trail[j-1][0],bee.trail[j-1][1]); ctx.lineTo(bee.trail[j][0],bee.trail[j][1]);
      ctx.strokeStyle='rgba('+rr+','+gg+','+bb+','+(j/bee.trail.length)*0.65+')'; ctx.lineWidth=(j/bee.trail.length)*2; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(bx,by,3.5,0,Math.PI*2); ctx.fillStyle='rgba('+rr+','+gg+','+bb+',1)'; ctx.fill();
    ctx.beginPath(); ctx.arc(bx,by,8,0,Math.PI*2); ctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.17)'; ctx.fill();
    bee.t+=bee.speed;
    if(bee.t>=1){bee.t=0;bee.state='paused';bee.pause=70+Math.floor(Math.random()*120);
      var ap=bee.returning?[x1,y1]:[x2,y2];mapPulses.push({x:ap[0],y:ap[1],r:5,a:0.75,color:rep.color});}
  });

  // 6. client blips
  CLIENTS.forEach(function(c){
    var xy=toXY(c.lat,c.lng), cx=xy[0], cy=xy[1];
    var color=c.status==='won'?'#60be35':c.status==='enrolled'?'#d36eff':'#e95400';
    var cc=hexRgb(color), rr=cc[0], gg=cc[1], bb=cc[2];
    var pulse=0.78+0.22*Math.sin(frame*0.055+c.id*0.8);
    var sz=(c.value>100000?6:c.value>50000?5:4)*pulse;
    ctx.beginPath(); ctx.arc(cx,cy,sz+7,0,Math.PI*2); ctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.07)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx,cy-sz); ctx.lineTo(cx+sz,cy); ctx.lineTo(cx,cy+sz); ctx.lineTo(cx-sz,cy); ctx.closePath();
    ctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.88)'; ctx.fill();
    ctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.5)'; ctx.lineWidth=0.8; ctx.stroke();
    if(c.value>=100000){ ctx.beginPath(); ctx.arc(cx,cy,sz+4,0,Math.PI*2); ctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.28)'; ctx.lineWidth=1; ctx.stroke(); }
  });

  // 7. rep markers
  REPS.forEach(function(rep,ri){
    var xy=toXY(rep.lat,rep.lng), x=xy[0], y=xy[1];
    var c=hexRgb(rep.color), rr=c[0], gg=c[1], bb=c[2];
    var dis=!rep.active||rep.id===7073||rep.id===7202;
    var a=dis?0.22:1, pulse=dis?1:0.65+0.35*Math.sin(frame*0.07+ri*1.1);
    if(!dis){ ctx.beginPath(); ctx.arc(x,y,17*pulse,0,Math.PI*2); ctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.2)'; ctx.lineWidth=1; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2); ctx.strokeStyle='rgba('+rr+','+gg+','+bb+','+(0.7*a)+')'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y,5.5,0,Math.PI*2); ctx.fillStyle='rgba('+rr+','+gg+','+bb+','+(0.95*a)+')'; ctx.fill();
    if(!dis){ ctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.38)'; ctx.lineWidth=0.8;
      ctx.beginPath(); ctx.moveTo(x-13,y); ctx.lineTo(x-7,y); ctx.moveTo(x+7,y); ctx.lineTo(x+13,y); ctx.moveTo(x,y-13); ctx.lineTo(x,y-7); ctx.moveTo(x,y+7); ctx.lineTo(x,y+13); ctx.stroke(); }
    ctx.font="600 10px 'JetBrains Mono',monospace"; ctx.fillStyle='rgba('+rr+','+gg+','+bb+','+(a*0.88)+')';
    ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText(rep.initials,x,y-17);
  });
}

// ── DRAW ROUTES ──
var routePulses = [];
var TRAIL_LEN = 14;
routes.forEach(function(r){ r.trailBuf=[]; r.lastCrossed=-1; });

function drawRoutes(){
  var W=rcvs.width, H=rcvs.height;
  rctx.clearRect(0,0,W,H);
  if(!routes.length) return;

  var LEFT=142, RIGHT=22;
  var TRACK_W=W-LEFT-RIGHT;
  var N=routes.length;
  var ROW_H=Math.min(60, Math.max(34, (H-8)/N));
  var FONT_MONO="'JetBrains Mono',monospace";

  // subtle grid
  rctx.strokeStyle='rgba(255,255,255,0.025)'; rctx.lineWidth=1;
  for(var y=0;y<H;y+=ROW_H){ rctx.beginPath(); rctx.moveTo(0,y); rctx.lineTo(W,y); rctx.stroke(); }

  routes.forEach(function(route,ri){
    var rep=route.rep;
    var c=hexRgb(rep.color), rr=c[0], gg=c[1], bb=c[2];
    var sy=8+ri*ROW_H+ROW_H/2;

    // advance traveler
    route.t=(route.t+route.speed)%1;
    var tx_now=LEFT+route.t*TRACK_W;

    // trail
    route.trailBuf.push(tx_now);
    if(route.trailBuf.length>TRAIL_LEN) route.trailBuf.shift();

    // REMAINING segment (dim)
    rctx.beginPath(); rctx.moveTo(LEFT,sy); rctx.lineTo(LEFT+TRACK_W,sy);
    rctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.18)'; rctx.lineWidth=1; rctx.stroke();

    // COMPLETED segment (bright)
    if(route.t>0){
      rctx.beginPath(); rctx.moveTo(LEFT,sy); rctx.lineTo(tx_now,sy);
      rctx.strokeStyle='rgba('+rr+','+gg+','+bb+',0.55)'; rctx.lineWidth=2; rctx.stroke();
    }

    // NODE WAYPOINTS
    route.wps.forEach(function(wp,wi){
      var nodeX=LEFT+(route.dists[wi]/route.totalKm)*TRACK_W;
      var abv=wi%2===0;
      var passed=route.t>=(route.dists[wi]/route.totalKm);

      var nodeR=wp.isHome?5.5:4;
      var nodeA=passed?1:0.4;
      if(wp.isHome){
        rctx.beginPath();
        rctx.moveTo(nodeX,sy-nodeR); rctx.lineTo(nodeX+nodeR,sy); rctx.lineTo(nodeX,sy+nodeR); rctx.lineTo(nodeX-nodeR,sy); rctx.closePath();
        rctx.fillStyle='rgba('+rr+','+gg+','+bb+','+nodeA+')'; rctx.fill();
      } else {
        var ccolor=wp.status==='won'?'#60be35':wp.status==='enrolled'?'#d36eff':'#e95400';
        var cc=hexRgb(ccolor);
        rctx.beginPath(); rctx.arc(nodeX,sy,nodeR,0,Math.PI*2);
        rctx.fillStyle=passed?'rgba('+cc[0]+','+cc[1]+','+cc[2]+',0.9)':'rgba('+cc[0]+','+cc[1]+','+cc[2]+',0.35)';
        rctx.fill();
        rctx.strokeStyle='rgba('+cc[0]+','+cc[1]+','+cc[2]+','+(passed?0.7:0.2)+')'; rctx.lineWidth=1; rctx.stroke();
      }

      // node label
      rctx.font='9px '+FONT_MONO;
      rctx.fillStyle=passed?'rgba('+rr+','+gg+','+bb+',0.75)':'rgba('+rr+','+gg+','+bb+',0.3)';
      rctx.textAlign='center'; rctx.textBaseline='bottom';
      var lbl=wp.isHome?(wi===0?'HOME':'RTN'):(wp.label.length>11?wp.label.slice(0,10)+'\u2026':wp.label);
      rctx.fillText(lbl, nodeX, abv?sy-nodeR-2:sy+nodeR+13);

      // segment distance label
      if(wi<route.wps.length-1){
        var nx2=LEFT+(route.dists[wi+1]/route.totalKm)*TRACK_W;
        var mx=(nodeX+nx2)/2;
        var segMi=((route.dists[wi+1]-route.dists[wi])*KM_TO_MI).toFixed(1);
        rctx.font='8px '+FONT_MONO;
        rctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.28)';
        rctx.textAlign='center'; rctx.textBaseline='bottom';
        rctx.fillText(segMi+'mi', mx, sy-3);
      }

      // crossing pulse
      var nodeT=route.dists[wi]/route.totalKm;
      if(route.t>=nodeT && route.t<nodeT+0.015 && route.lastCrossed!==wi){
        route.lastCrossed=wi;
        routePulses.push({x:nodeX,y:sy,r:4,a:0.85,color:rep.color});
      }
    });

    // TRAIL
    for(var j=1;j<route.trailBuf.length;j++){
      var a=(j/TRAIL_LEN)*0.55;
      var w=(j/TRAIL_LEN)*2.5;
      rctx.beginPath(); rctx.moveTo(route.trailBuf[j-1],sy); rctx.lineTo(route.trailBuf[j],sy);
      rctx.strokeStyle='rgba('+rr+','+gg+','+bb+','+a+')'; rctx.lineWidth=w; rctx.stroke();
    }

    // TRAVELER DOT
    rctx.beginPath(); rctx.arc(tx_now,sy,9,0,Math.PI*2);
    rctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.12)'; rctx.fill();
    rctx.beginPath(); rctx.arc(tx_now,sy,4.5,0,Math.PI*2);
    rctx.fillStyle='rgba('+rr+','+gg+','+bb+',1)'; rctx.fill();
    rctx.beginPath(); rctx.arc(tx_now,sy,4.5,0,Math.PI*2);
    rctx.strokeStyle='rgba(255,255,255,0.35)'; rctx.lineWidth=0.8; rctx.stroke();

    // REP LABEL (left column)
    rctx.font='600 12px '+FONT_MONO;
    rctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.95)';
    rctx.textAlign='left'; rctx.textBaseline='middle';
    rctx.fillText(rep.short, 28, sy-5);

    // dot
    rctx.beginPath(); rctx.arc(14,sy-5,5,0,Math.PI*2);
    rctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.9)'; rctx.fill();

    // distance + stop count
    var totalMi=(route.totalKm*KM_TO_MI).toFixed(0);
    var stops=route.wps.length-2;
    rctx.font='8px '+FONT_MONO;
    rctx.fillStyle='rgba('+rr+','+gg+','+bb+',0.45)';
    rctx.textAlign='left'; rctx.textBaseline='middle';
    rctx.fillText(totalMi+'mi \u00b7 '+stops+' stops', 28, sy+7);
  });

  // ROUTE PULSES
  for(var i=routePulses.length-1;i>=0;i--){
    var p=routePulses[i]; p.r+=1.4; p.a-=0.025;
    if(p.a<=0){routePulses.splice(i,1);continue;}
    var pc=hexRgb(p.color);
    rctx.beginPath(); rctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    rctx.strokeStyle='rgba('+pc[0]+','+pc[1]+','+pc[2]+','+p.a+')'; rctx.lineWidth=1.5; rctx.stroke();
  }
}

// ── MAIN LOOP ──
function loop(){
  drawMap();
  drawRoutes();
  requestAnimationFrame(loop);
}
loop();
