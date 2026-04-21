/* Sales AI Gate Screensaver — purple graph clusters flying through 3D space
   Ported from megfigyelo, recolored purple (#9f00fa → #d36eff) */
(function(){
'use strict';

/* ═══ CONSTANTS ═══ */
var MAX_CLUSTERS=68,SPAWN_INTERVAL=0.27,GROW_DURATION=4,DIE_DURATION=0.9,
    MIN_LIFE=8,MAX_LIFE=18,FLY_SPEED=70,REF_DEPTH=350,
    SPAWN_DEPTH_NEAR=180,SPAWN_DEPTH_FAR=650,SAFETY_DEPTH=-1500,
    FLY_BY_EXTRA_SEC=1,OFFSCREEN_MARGIN=80,
    CENTER_HIT_RECT_W=0.33,CENTER_HIT_RECT_H=0.33,
    MISS_COLLAPSE_DURATION=0.5,CARD_PHYSICS_DURATION=1.4,
    CARD_GENTLE_REPEL_DURATION=0.8,
    CARD_BLACK_HOLE_DURATION=6,CARD_BLACK_HOLE_DRAG_MAX_SEC=22,
    CARD_BANG_DURATION=2.8,CARD_BIG_BANG_RADIUS=90,
    MISS_COLLAPSE_STEPS=[100,50,25,20,15,12,10,8,6,5,4,3,2,1],
    HIT_ZONE_DEPTH_MAX=250,HIT_ZONE_DEPTH_MIN=-400,
    WORLD_SPREAD_X=0.5,WORLD_SPREAD_Y=0.45,
    STEP_DELAY=0.3,LINE_GROW_DUR=0.6,NODE_ARRIVAL_DUR=0.25;

/* ═══ QUALITY TIERS ═══ */
var _isMobile=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||(typeof innerWidth!=='undefined'&&innerWidth<768);
if(_isMobile){MAX_CLUSTERS=34;SPAWN_INTERVAL=0.45;}
var INITIAL_SPAWN=_isMobile?9:18;
var SKIP_LABELS=_isMobile;
var SKIP_HULL=_isMobile;
var MAX_DPR=_isMobile?1.5:3;
var _lastFrameMs=0;

/* ═══ GRAPH GENERATORS ═══ */
function buildPathGraph(size){
  var n=5+Math.floor(Math.random()*8),nodes=[],edges=[],step=size*0.25,start=-((n-1)*step)/2;
  for(var i=0;i<n;i++) nodes.push({ox:start+i*step,oy:(Math.random()-0.5)*10,adj:[],r:0.7});
  for(var i=0;i<n-1;i++){edges.push([i,i+1]);nodes[i].adj.push(i+1);nodes[i+1].adj.push(i);}
  return{nodes:nodes,edges:edges,type:'Path Graph'};
}
function buildCycleGraph(size){
  var n=[4,6,7,8,9,10][Math.floor(Math.random()*6)],nodes=[],edges=[],R=size*0.5;
  for(var i=0;i<n;i++){var a=(i/n)*Math.PI*2-Math.PI/2;nodes.push({ox:Math.cos(a)*R,oy:Math.sin(a)*R,adj:[],r:0.75});}
  for(var i=0;i<n;i++){var j=(i+1)%n;edges.push([i,j]);nodes[i].adj.push(j);nodes[j].adj.push(i);}
  return{nodes:nodes,edges:edges,type:'Cycle Graph'};
}
function buildStarGraph(size){
  var n=4+Math.floor(Math.random()*6),nodes=[],edges=[],R=size*0.5;
  nodes.push({ox:0,oy:0,adj:[],r:0.9});
  for(var i=0;i<n;i++){var a=(i/n)*Math.PI*2-Math.PI/2;nodes.push({ox:Math.cos(a)*R,oy:Math.sin(a)*R,adj:[],r:0.7});}
  for(var i=1;i<=n;i++){edges.push([0,i]);nodes[0].adj.push(i);nodes[i].adj.push(0);}
  return{nodes:nodes,edges:edges,type:'Star Graph'};
}
function buildCompleteGraph(size){
  var n=Math.min(4+Math.floor(Math.random()*4),8),nodes=[],edges=[],R=size*0.5;
  for(var i=0;i<n;i++){var a=(i/n)*Math.PI*2-Math.PI/2;nodes.push({ox:Math.cos(a)*R,oy:Math.sin(a)*R,adj:[],r:0.8});}
  for(var i=0;i<n;i++)for(var j=i+1;j<n;j++){edges.push([i,j]);nodes[i].adj.push(j);nodes[j].adj.push(i);}
  return{nodes:nodes,edges:edges,type:'Complete Graph'};
}
function buildTree(size){
  var n=5+Math.floor(Math.random()*10),nodes=[],edges=[],children=[];
  for(var i=0;i<n;i++){children.push([]);nodes.push(null);}
  for(var i=1;i<n;i++){var p=Math.floor(Math.random()*i);children[p].push(i);edges.push([p,i]);}
  var R=size*0.8,maxD=Math.max(1,Math.ceil(Math.log2(n)));
  (function lay(v,d,as,aw){
    var r=(d/maxD)*R*(0.3+0.7/maxD),a=as+aw*0.5;
    nodes[v]={ox:Math.cos(a)*r,oy:Math.sin(a)*r,adj:children[v].slice(),r:0.6+Math.random()*0.8};
    var step=aw/Math.max(1,children[v].length),ca=as;
    for(var k=0;k<children[v].length;k++){lay(children[v][k],d+1,ca,step);ca+=step;}
  })(0,0,0,Math.PI*2);
  return{nodes:nodes,edges:edges,type:'Tree'};
}
function buildWeightedGraph(size){
  var n=5+Math.floor(Math.random()*7),nodes=[],edges=[],spread=size*0.5,thresh=size*0.55,ew={};
  for(var i=0;i<n;i++) nodes.push({ox:(Math.random()-0.5)*spread,oy:(Math.random()-0.5)*spread,adj:[],r:0.65+Math.random()*0.5});
  for(var i=1;i<n;i++){var p=Math.floor(Math.random()*i),w=1+Math.floor(Math.random()*12);edges.push([p,i]);ew[Math.min(p,i)+'-'+Math.max(p,i)]=w;nodes[p].adj.push(i);nodes[i].adj.push(p);}
  for(var i=0;i<n;i++)for(var j=i+1;j<n;j++){if(nodes[i].adj.indexOf(j)>=0)continue;var d=Math.hypot(nodes[j].ox-nodes[i].ox,nodes[j].oy-nodes[i].oy);if(d<thresh&&Math.random()<0.35){var w=1+Math.floor(Math.random()*12);edges.push([i,j]);ew[i+'-'+j]=w;nodes[i].adj.push(j);nodes[j].adj.push(i);}}
  return{nodes:nodes,edges:edges,edgeWeights:ew,type:'Weighted Graph'};
}
function buildWheelGraph(size){
  var n=5+Math.floor(Math.random()*5),nodes=[],edges=[],R=size*0.5;
  nodes.push({ox:0,oy:0,adj:[],r:0.9});
  for(var i=0;i<n;i++){var a=(i/n)*Math.PI*2-Math.PI/2;nodes.push({ox:Math.cos(a)*R,oy:Math.sin(a)*R,adj:[],r:0.7});}
  for(var i=1;i<=n;i++){var j=i<n?i+1:1;edges.push([i,j]);nodes[i].adj.push(j);nodes[j].adj.push(i);}
  for(var i=1;i<=n;i++){edges.push([0,i]);nodes[0].adj.push(i);nodes[i].adj.push(0);}
  return{nodes:nodes,edges:edges,type:'Wheel Graph'};
}
function buildBipartiteGraph(size){
  var a=2+Math.floor(Math.random()*4),b=2+Math.floor(Math.random()*4),nodes=[],edges=[],gap=size*0.4;
  for(var i=0;i<a;i++){var y=((i-(a-1)/2)/Math.max(1,a-1))*size*0.7;nodes.push({ox:-gap,oy:y,adj:[],r:0.75});}
  for(var i=0;i<b;i++){var y=((i-(b-1)/2)/Math.max(1,b-1))*size*0.7;nodes.push({ox:gap,oy:y,adj:[],r:0.75});}
  for(var i=0;i<a;i++)for(var j=0;j<b;j++){edges.push([i,a+j]);nodes[i].adj.push(a+j);nodes[a+j].adj.push(i);}
  return{nodes:nodes,edges:edges,type:'K_{a,b}'};
}
function buildConnectedGraph(size){
  var n=5+Math.floor(Math.random()*8),nodes=[],edges=[],sp=size*0.5;
  for(var i=0;i<n;i++) nodes.push({ox:(Math.random()-0.5)*sp,oy:(Math.random()-0.5)*sp,adj:[],r:0.7});
  for(var i=1;i<n;i++){var p=Math.floor(Math.random()*i);edges.push([p,i]);nodes[p].adj.push(i);nodes[i].adj.push(p);}
  for(var i=0;i<n;i++)for(var j=i+1;j<n;j++){if(nodes[i].adj.indexOf(j)>=0)continue;var d=Math.hypot(nodes[j].ox-nodes[i].ox,nodes[j].oy-nodes[i].oy);if(d<size*0.4&&Math.random()<0.3){edges.push([i,j]);nodes[i].adj.push(j);nodes[j].adj.push(i);}}
  return{nodes:nodes,edges:edges,type:'Connected Graph'};
}
function buildRandomGraph(size){
  var pool=[buildPathGraph,buildPathGraph,buildPathGraph,buildWeightedGraph,buildWeightedGraph,buildCycleGraph,buildStarGraph,buildBipartiteGraph,buildWheelGraph,buildTree,buildCompleteGraph,buildConnectedGraph];
  var fn=pool[Math.floor(Math.random()*pool.length)];
  try{var d=fn(size);if(d&&d.nodes&&d.nodes.length&&d.edges)return d;}catch(e){}
  return buildPathGraph(size);
}

/* ═══ GRAPH TRAVERSAL ═══ */
function dfs(adj,start){
  var vis=new Set(),order=[],stack=[start];
  while(stack.length){var v=stack.pop();if(vis.has(v))continue;vis.add(v);order.push(v);var nb=adj[v]||[];for(var i=nb.length-1;i>=0;i--)if(!vis.has(nb[i]))stack.push(nb[i]);}
  return order;
}
function bfsOrder(adj,start){
  var vis=new Set([start]),order=[start],q=[start];
  while(q.length){var v=q.shift();for(var u of(adj[v]||[]))if(!vis.has(u)){vis.add(u);order.push(u);q.push(u);}}
  return order;
}
function postOrder(adj,start){
  var vis=new Set(),order=[],stack=[[start,false]];
  while(stack.length){var item=stack.pop(),v=item[0],done=item[1];if(done){order.push(v);continue;}if(vis.has(v))continue;vis.add(v);stack.push([v,true]);var nb=adj[v]||[];for(var i=nb.length-1;i>=0;i--)if(!vis.has(nb[i]))stack.push([nb[i],false]);}
  return order;
}
function bfsPath(adj,start,end){
  var vis=new Map();vis.set(start,-1);var q=[start];
  while(q.length){var v=q.shift();if(v===end)break;for(var u of(adj[v]||[]))if(!vis.has(u)){vis.set(u,v);q.push(u);}}
  if(!vis.has(end))return[start];var path=[];for(var v=end;v!==-1;v=vis.get(v))path.push(v);return path.reverse();
}
function dijkstraPath(adj,weights,start,end){
  var n=adj.length,dist=Array(n).fill(Infinity),prev=Array(n).fill(-1);dist[start]=0;var pq=[[0,start]];
  while(pq.length){pq.sort(function(a,b){return a[0]-b[0]});var item=pq.shift(),d=item[0],v=item[1];if(d>dist[v])continue;for(var u of(adj[v]||[])){var key=v<u?v+'-'+u:u+'-'+v;var w=weights[key]||1;if(dist[v]+w<dist[u]){dist[u]=dist[v]+w;prev[u]=v;pq.push([dist[u],u]);}}}
  if(dist[end]===Infinity)return{path:[start],dist:0};var path=[];for(var v=end;v!==-1;v=prev[v])path.push(v);return{path:path.reverse(),dist:dist[end]};
}

/* ═══ GEOMETRY ═══ */
function getClusterBounds(cluster,depth,width,height){
  var scale=Math.max(0.15,REF_DEPTH/(REF_DEPTH+depth));
  var cx=width/2+cluster.worldX*scale,cy=height/2+cluster.worldY*scale;
  var minX=cx,maxX=cx,minY=cy,maxY=cy;
  var maxRadius=(cluster.spawnRadius||50)*scale*1.5;
  for(var node of cluster.nodes){var px=cx+(node.ox||0)*scale,py=cy+(node.oy||0)*scale;minX=Math.min(minX,px-maxRadius);maxX=Math.max(maxX,px+maxRadius);minY=Math.min(minY,py-maxRadius);maxY=Math.max(maxY,py+maxRadius);}
  return{minX:minX,maxX:maxX,minY:minY,maxY:maxY,cx:cx,cy:cy,scale:scale};
}
function overlapsCenterHitRect(cluster,depth,width,height){
  var b=getClusterBounds(cluster,depth,width,height),rw=width*CENTER_HIT_RECT_W,rh=height*CENTER_HIT_RECT_H;
  var rx1=width/2-rw/2,ry1=height/2-rh/2,rx2=rx1+rw,ry2=ry1+rh;
  return!(b.maxX<rx1||b.minX>rx2||b.maxY<ry1||b.minY>ry2);
}
function hasFullyFlownBy(cluster,depth,width,height){
  var b=getClusterBounds(cluster,depth,width,height);
  return b.maxX<-OFFSCREEN_MARGIN||b.minX>width+OFFSCREEN_MARGIN||b.maxY<-OFFSCREEN_MARGIN||b.minY>height+OFFSCREEN_MARGIN;
}
function isAboutToFlyOut(cluster,depth,width,height){
  var b=getClusterBounds(cluster,depth,width,height),ez=0.28;
  var near=b.minX>width*(1-ez)||b.maxX<width*ez||b.minY>height*(1-ez)||b.maxY<height*ez;
  return(near||depth<HIT_ZONE_DEPTH_MIN)&&!hasFullyFlownBy(cluster,depth,width,height);
}
function convexHull(pts){
  if(pts.length<3)return pts;
  var cross=function(o,a,b){return(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x)};
  var start=0;for(var i=1;i<pts.length;i++)if(pts[i].x<pts[start].x||(pts[i].x===pts[start].x&&pts[i].y<pts[start].y))start=i;
  var hull=[],p=start;
  do{hull.push(pts[p]);var q=0;if(q===p)q=1;for(var i=0;i<pts.length;i++)if(i!==p&&cross(pts[p],pts[i],pts[q])>0)q=i;p=q;}while(p!==start);
  return hull;
}

/* ═══ CLUSTER SPAWNING ═══ */
function spawnCluster(clusters,width,height,timeSec,cameraZ){
  if(width<1||height<1)return;
  var data;
  try{var baseSize=Math.min(width,height)*(0.08+Math.random()*0.12),sizeMult=0.6+Math.random()*0.9,sizeScale=1+Math.random()*3;data=buildRandomGraph(Math.max(10,baseSize*sizeMult*sizeScale));}catch(e){return;}
  if(!data||!data.nodes||!data.nodes.length||!data.edges)return;
  var spawnRadius=Math.max(15,data.nodes.reduce(function(max,n){return Math.max(max,Math.hypot(n.ox,n.oy)||0)},0)*1.2);
  var worldX=(Math.random()-0.5)*width*WORLD_SPREAD_X*2.2;
  var worldY=(Math.random()-0.5)*height*WORLD_SPREAD_Y*2.2;
  var spawnDepth=cameraZ+SPAWN_DEPTH_NEAR+Math.random()*(SPAWN_DEPTH_FAR-SPAWN_DEPTH_NEAR);
  var adj=data.nodes.map(function(n){return n.adj});
  var n=data.nodes.length,pathArr,pathDist;
  if(data.edgeWeights&&Object.keys(data.edgeWeights).length>0){var dk=dijkstraPath(adj,data.edgeWeights,0,n-1);pathArr=dk.path;pathDist=dk.dist;}
  else{pathArr=bfsPath(adj,0,n-1);pathDist=pathArr.length-1;}
  var pathNodes=new Set(pathArr),pathEdges=new Set();
  for(var j=0;j<pathArr.length-1;j++){var a=pathArr[j],b=pathArr[j+1];pathEdges.add(a<b?a+'-'+b:b+'-'+a);}
  var isTree=data.type&&(data.type.indexOf('Tree')>=0||data.type.indexOf('Spanning')>=0);
  var travOpts=['dfs','bfs','post'];
  var trav=isTree?travOpts[Math.floor(Math.random()*travOpts.length)]:'dfs';
  var growOrder=trav==='bfs'?bfsOrder(adj,0):trav==='post'?postOrder(adj,0):dfs(adj,0);
  var travLabel=trav==='bfs'?'BFS (level-order)':trav==='post'?'DFS (post-order)':'DFS (pre-order)';
  var roll=Math.random(),autoBlackHole=roll<1/70,autoExplode=!autoBlackHole&&roll<2/70;
  clusters.push({worldX:worldX,worldY:worldY,spawnDepth:spawnDepth,spawnRadius:spawnRadius,birthTime:timeSec,maxAge:MIN_LIFE+Math.random()*(MAX_LIFE-MIN_LIFE),dfsOrder:growOrder,growOrder:growOrder,traversalAlgo:isTree?travLabel:null,pathArr:pathArr,pathNodes:pathNodes,pathEdges:pathEdges,pathDist:pathDist,visited:new Set(),autoBlackHole:autoBlackHole,autoExplode:autoExplode,nodes:data.nodes,edges:data.edges,edgeWeights:data.edgeWeights||null,type:data.type||null});
}

/* ═══ EASING & COLORS ═══ */
var easeOutCubic=function(t){return 1-Math.pow(1-t,3)};
var easeOutQuad=function(t){return 1-Math.pow(1-t,2)};
var easeInQuad=function(t){return t*t};
var easeInCubic=function(t){return t*t*t};

var _c1={r:159,g:0,b:250},_c2={r:211,g:110,b:255},_bgColor='#030206';

function lerpPurple(t){
  return{r:Math.round(_c1.r+(_c2.r-_c1.r)*t),g:Math.round(_c1.g+(_c2.g-_c1.g)*t),b:Math.round(_c1.b+(_c2.b-_c1.b)*t)};
}

/* ═══ NODE GLOW SPRITE (single cached offscreen canvas) ═══ */
var _glowSprite=null;
function getGlowSprite(){
  if(_glowSprite)return _glowSprite;
  var s=128,c=document.createElement('canvas');c.width=c.height=s;
  var g=c.getContext('2d'),gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  gr.addColorStop(0,'rgba(159,0,250,0.9)');gr.addColorStop(0.35,'rgba(159,0,250,0.5)');
  gr.addColorStop(0.7,'rgba(124,0,195,0.15)');gr.addColorStop(1,'transparent');
  g.fillStyle=gr;g.beginPath();g.arc(s/2,s/2,s/2,0,Math.PI*2);g.fill();
  _glowSprite=c;return c;
}

/* ═══ PHYSICS PIECES ═══ */
function countComponents(n,edges,brokenSet){
  var adj=[];for(var i=0;i<n;i++)adj.push([]);
  edges.forEach(function(e){var key=e[0]<e[1]?e[0]+'-'+e[1]:e[1]+'-'+e[0];if(brokenSet.has(key))return;adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
  var vis=new Set(),count=0;
  for(var i=0;i<n;i++){if(!vis.has(i)){count++;var q=[i];vis.add(i);while(q.length){var v=q.shift();for(var u of adj[v])if(!vis.has(u)){vis.add(u);q.push(u);}}}}
  return count;
}
function computePhysicsPieces(cluster,cx,cy,scale,rect){
  var nodes=cluster.nodes,edges=cluster.edges,n=nodes.length;
  var cardCx=rect?(rect.left+rect.right)/2:cx,cardCy=rect?(rect.top+rect.bottom)/2:cy;
  var impactDx=cx-cardCx,impactDy=cy-cardCy,impactLen=Math.hypot(impactDx,impactDy)||1;
  var edgeList=edges.map(function(e){var mx=cx+((nodes[e[0]].ox||0)+(nodes[e[1]].ox||0))/2*scale,my=cy+((nodes[e[0]].oy||0)+(nodes[e[1]].oy||0))/2*scale;var toCard=Math.hypot(mx-cardCx,my-cardCy);var cross=Math.abs((mx-cardCx)*impactDy-(my-cardCy)*impactDx)/impactLen;return{a:e[0],b:e[1],score:toCard*0.2+cross*0.8+Math.random()*0.3}}).sort(function(x,y){return x.score-y.score});
  var targetPieces=Math.min(6,Math.max(2,2+Math.floor(Math.random()*4))),brokenSet=new Set();
  for(var e of edgeList){var key=e.a<e.b?e.a+'-'+e.b:e.b+'-'+e.a;brokenSet.add(key);var nc=countComponents(n,edges,brokenSet);if(nc>=targetPieces)break;if(nc>10){brokenSet.delete(key);break;}}
  var compId=Array(n),adj2=[];for(var i=0;i<n;i++)adj2.push([]);
  edges.forEach(function(e){var key=e[0]<e[1]?e[0]+'-'+e[1]:e[1]+'-'+e[0];if(brokenSet.has(key))return;adj2[e[0]].push(e[1]);adj2[e[1]].push(e[0]);});
  var cid=0,vis=new Set();
  for(var i=0;i<n;i++){if(!vis.has(i)){var q=[i];vis.add(i);compId[i]=cid;while(q.length){var v=q.shift();for(var u of adj2[v])if(!vis.has(u)){vis.add(u);compId[u]=cid;q.push(u);}}cid++;}}
  var comps={};for(var i=0;i<n;i++){var c=compId[i];if(!comps[c])comps[c]={nodes:[],cx:0,cy:0};comps[c].nodes.push(i);}
  Object.values(comps).forEach(function(c){var sx=0,sy=0;c.nodes.forEach(function(i){sx+=cx+(nodes[i].ox||0)*scale;sy+=cy+(nodes[i].oy||0)*scale;});c.cx=sx/c.nodes.length;c.cy=sy/c.nodes.length;});
  return{compId:compId,brokenSet:brokenSet,comps:comps};
}

/* ═══ RENDER: PHYSICS BREAKUP ═══ */
function renderPhysicsBreakup(ctx,cluster,ci,cx,cy,scale,timeSec){
  var elapsed=timeSec-cluster.cardPhysicsBreakupStart,progress=Math.min(1,elapsed/CARD_PHYSICS_DURATION);
  var ease=easeOutQuad(progress),col=lerpPurple(progress),alpha=1-progress*0.85;
  var nodes=cluster.nodes,edges=cluster.edges,rect=cluster._cardRect,baseSpeed=70*scale;
  if(!cluster._physicsPieces)cluster._physicsPieces=computePhysicsPieces(cluster,cx,cy,scale,rect);
  var pp=cluster._physicsPieces,compId=pp.compId,brokenSet=pp.brokenSet,comps=pp.comps;
  var compDirs={};
  Object.entries(comps).forEach(function(entry){var cid=entry[0],comp=entry[1],nx=comp.cx,ny=comp.cy,dx,dy;
    if(rect){var nearX=Math.max(rect.left,Math.min(rect.right,nx)),nearY=Math.max(rect.top,Math.min(rect.bottom,ny));dx=nx-nearX;dy=ny-nearY;if(dx===0&&dy===0){dx=nx-(rect.left+rect.right)/2;dy=ny-(rect.top+rect.bottom)/2;}}else{dx=comp.cx-cx;dy=comp.cy-cy;}
    var len=Math.hypot(dx,dy)||0.01,w=Math.sin(parseInt(cid)*1.3)*0.08;compDirs[cid]={x:dx/len+w,y:dy/len+Math.cos(parseInt(cid)*0.7)*0.06,dist:len/scale};});
  var disp=baseSpeed*ease;
  var positions=nodes.map(function(node,i){var bx=cx+(node.ox||0)*scale,by=cy+(node.oy||0)*scale,d=compDirs[compId[i]];if(!d)return{x:bx,y:by};var piece=comps[compId[i]],relX=bx-piece.cx,relY=by-piece.cy;var rot=ease*0.15*Math.sin(parseInt(String(compId[i]))*0.9+elapsed),cosR=Math.cos(rot),sinR=Math.sin(rot);var ddx=d.x*disp*(0.92+d.dist*0.08),ddy=d.y*disp*(0.92+d.dist*0.08),wob=ease*1.5*scale*Math.sin(i*0.6+elapsed*3);return{x:piece.cx+(relX*cosR-relY*sinR)+ddx+wob*0.1,y:piece.cy+(relX*sinR+relY*cosR)+ddy+Math.cos(i*0.4+elapsed*2.5)*wob*0.08};});
  ctx.save();ctx.globalAlpha=alpha;
  edges.forEach(function(e){var key=e[0]<e[1]?e[0]+'-'+e[1]:e[1]+'-'+e[0];if(brokenSet.has(key))return;var pa=positions[e[0]],pb=positions[e[1]];if(!pa||!pb)return;ctx.strokeStyle='rgba('+col.r+','+col.g+','+col.b+','+(0.5*(1-progress*0.6))+')';ctx.lineWidth=1.2*scale;ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();});
  var nsm=0.95-progress*0.5;
  nodes.forEach(function(node,i){var p=positions[i];if(!p)return;var rG=(node.r||1)*10*scale*nsm,rC=(node.r||1)*3.5*scale*nsm;var grd=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rG);grd.addColorStop(0,'rgba('+col.r+','+col.g+','+col.b+',0.85)');grd.addColorStop(0.5,'rgba('+col.r+','+col.g+','+col.b+',0.4)');grd.addColorStop(1,'transparent');ctx.fillStyle=grd;ctx.beginPath();ctx.arc(p.x,p.y,rG,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba('+col.r+','+col.g+','+col.b+',0.9)';ctx.beginPath();ctx.arc(p.x,p.y,rC,0,Math.PI*2);ctx.fill();});
  ctx.restore();
}

/* ═══ RENDER: BLACK HOLE ═══ */
function renderBlackHole(ctx,cluster,ci,cx,cy,scale,timeSec){
  var elapsed=timeSec-cluster.cardBlackHoleStart,fromDrag=cluster._blackHoleFromDrag===true;
  var nodes=cluster.nodes,edges=cluster.edges,rect=cluster._cardRect;
  var bhCx=rect?(rect.left+rect.right)/2:cx,bhCy=rect?(rect.top+rect.bottom)/2:cy;
  if(!cluster._blackHoleInit){cluster._blackHoleInit=nodes.map(function(node){var x=cx+(node.ox||0)*scale,y=cy+(node.oy||0)*scale,dx=x-bhCx,dy=y-bhCy;return{x:x,y:y,dist:Math.hypot(dx,dy)||0.01,angle:Math.atan2(dy,dx)};});}
  var inSuck,bangPhase;
  if(fromDrag){inSuck=cluster._bangPhaseStart==null;bangPhase=inSuck?0:Math.min(1,(timeSec-cluster._bangPhaseStart)/CARD_BANG_DURATION);}
  else{var progress=Math.min(1,elapsed/CARD_BLACK_HOLE_DURATION);inSuck=progress<0.82;bangPhase=inSuck?0:(progress-0.82)/0.18;}
  var maxSuckSec=fromDrag?CARD_BLACK_HOLE_DRAG_MAX_SEC:CARD_BLACK_HOLE_DURATION;
  var suckProgress=inSuck?Math.min(1,elapsed/(maxSuckSec*0.82)):1;
  ctx.save();
  if(inSuck){
    var shrink=1-easeInCubic(suckProgress),spin=Math.pow(elapsed,1.9)*0.9,baseScale=scale*(0.9+0.1*shrink);
    var waveAmp=12*scale*(1-shrink*0.7),waveT=elapsed*1.2;
    var rideX=Math.sin(waveT)*waveAmp,rideY=Math.sin(waveT*2)*waveAmp*0.6;
    var rideCx=bhCx+rideX,rideCy=bhCy+rideY;
    var positions=cluster._blackHoleInit.map(function(init,i){var newDist=init.dist*shrink,angle=init.angle+spin*(1+(i/nodes.length)*0.2);var px=rideCx+Math.cos(angle)*newDist,py=rideCy+Math.sin(angle)*newDist;var surfAmp=8*scale*(1-shrink)*(0.3+0.7*Math.min(1,newDist/80));var surf=surfAmp*Math.sin(waveT*1.5+i*0.4);return{x:px+(-Math.sin(angle))*surf,y:py+Math.cos(angle)*surf};});
    var al=1-suckProgress*0.35;ctx.globalAlpha=al;
    var col={r:_c1.r,g:_c1.g,b:_c1.b};
    var growP=Math.min(1,suckProgress/0.9),bhSizeMult=0.15+0.85*easeInCubic(growP);
    var horizonR=6*scale*bhSizeMult,diskInner=horizonR*2.5,diskOuter=18*scale*bhSizeMult,diskTilt=0.6;
    /* accretion disk */
    ctx.save();ctx.translate(rideCx,rideCy);ctx.rotate(-0.4+elapsed*0.15);ctx.scale(1,diskTilt);ctx.translate(-rideCx,-rideCy);
    var dg=ctx.createRadialGradient(rideCx,rideCy,diskInner,rideCx,rideCy,diskOuter);
    dg.addColorStop(0,'transparent');dg.addColorStop(0.25,'rgba(40,0,80,0.5)');dg.addColorStop(0.5,'rgba(140,30,200,0.85)');dg.addColorStop(0.7,'rgba(190,100,255,0.6)');dg.addColorStop(0.9,'rgba(120,20,180,0.25)');dg.addColorStop(1,'transparent');
    ctx.fillStyle=dg;ctx.beginPath();ctx.arc(rideCx,rideCy,diskOuter,0,Math.PI*2);ctx.arc(rideCx,rideCy,horizonR*1.8,0,Math.PI*2,true);ctx.fill();
    var spinAngle=elapsed*0.8;
    for(var i=0;i<3;i++){var a=spinAngle+(i/3)*Math.PI*2,hotX=rideCx+Math.cos(a)*diskOuter*0.5,hotY=rideCy+Math.sin(a)*diskOuter*0.5*diskTilt;var hg=ctx.createRadialGradient(hotX,hotY,0,rideCx,rideCy,diskOuter);hg.addColorStop(0,'rgba(230,200,255,0.9)');hg.addColorStop(0.3,'rgba(180,60,255,0.4)');hg.addColorStop(1,'transparent');ctx.fillStyle=hg;ctx.globalAlpha=al*(0.5+0.15*Math.sin(elapsed*8+i));ctx.beginPath();ctx.arc(rideCx,rideCy,diskOuter,0,Math.PI*2);ctx.arc(rideCx,rideCy,diskInner,0,Math.PI*2,true);ctx.fill();}
    ctx.restore();
    /* photon ring */
    ctx.globalAlpha=al;var pg=ctx.createRadialGradient(rideCx,rideCy,horizonR,rideCx,rideCy,horizonR*2.2);
    pg.addColorStop(0,'transparent');pg.addColorStop(0.85,'rgba(230,200,255,0.6)');pg.addColorStop(0.95,'rgba(220,180,255,0.9)');pg.addColorStop(1,'transparent');
    ctx.fillStyle=pg;ctx.beginPath();ctx.arc(rideCx,rideCy,horizonR*2.2,0,Math.PI*2);ctx.arc(rideCx,rideCy,horizonR*1.2,0,Math.PI*2,true);ctx.fill();
    /* event horizon */
    ctx.fillStyle='#000';ctx.beginPath();ctx.arc(rideCx,rideCy,horizonR,0,Math.PI*2);ctx.fill();
    /* edges + nodes */
    edges.forEach(function(e){var pa=positions[e[0]],pb=positions[e[1]];if(!pa||!pb)return;ctx.strokeStyle='rgba('+col.r+','+col.g+','+col.b+','+(0.5*al)+')';ctx.lineWidth=1.2*baseScale;ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();});
    nodes.forEach(function(node,i){var p=positions[i],rC=(node.r||1)*3.5*baseScale;ctx.fillStyle='rgba('+col.r+','+col.g+','+col.b+',0.9)';ctx.beginPath();ctx.arc(p.x,p.y,rC,0,Math.PI*2);ctx.fill();});
  } else {
    /* BIG BANG phase */
    var bangElapsed=cluster._bangPhaseStart!=null?timeSec-cluster._bangPhaseStart:elapsed-(fromDrag?CARD_BLACK_HOLE_DRAG_MAX_SEC:CARD_BLACK_HOLE_DURATION*0.82);
    var spiralSpin=bangElapsed*2.5,extR=Math.max(1200,CARD_BIG_BANG_RADIUS*8)*easeOutQuad(Math.min(1,bangPhase*1.2));
    var al=(1-bangPhase)*0.92;ctx.globalAlpha=Math.max(0.01,al);ctx.save();
    var nArms=6,turns=4,ptsPerArm=80;
    for(var arm=0;arm<nArms;arm++){
      var baseAngle=(arm/nArms)*Math.PI*2+spiralSpin;ctx.beginPath();
      for(var i=0;i<=ptsPerArm;i++){var t=i/ptsPerArm,r=t*extR,sa=baseAngle+turns*Math.PI*2*t,x=bhCx+Math.cos(sa)*r,y=bhCy+Math.sin(sa)*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
      var grad=ctx.createLinearGradient(bhCx,bhCy,bhCx+Math.cos(baseAngle)*extR,bhCy+Math.sin(baseAngle)*extR);
      grad.addColorStop(0,'rgba(230,180,255,'+(0.95*al)+')');
      grad.addColorStop(0.15,'rgba(159,0,250,'+(0.9*al)+')');
      grad.addColorStop(0.35,'rgba(200,80,255,'+(0.8*al)+')');
      grad.addColorStop(0.55,'rgba(20,0,80,'+(0.6*al)+')');
      grad.addColorStop(0.8,'rgba(40,10,60,'+(0.3*al)+')');
      grad.addColorStop(1,'transparent');
      ctx.strokeStyle=grad;ctx.lineWidth=Math.max(3,18*(1-bangPhase*0.7));ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

/* ═══ RENDER: GENTLE REPEL ═══ */
function renderGentleRepel(ctx,cluster,ci,cx,cy,scale,timeSec){
  var elapsed=timeSec-cluster.cardGentleRepelStart,progress=Math.min(1,elapsed/CARD_GENTLE_REPEL_DURATION);
  var ease=easeOutQuad(progress),nodes=cluster.nodes,edges=cluster.edges,rect=cluster._cardRect,gs=22*scale;
  if(!cluster._gentleDirs){var cardCx=rect?(rect.left+rect.right)/2:cx,cardCy=rect?(rect.top+rect.bottom)/2:cy;
    cluster._gentleDirs=nodes.map(function(node,i){var nx=cx+(node.ox||0)*scale,ny=cy+(node.oy||0)*scale,dx,dy;if(rect){var nrX=Math.max(rect.left,Math.min(rect.right,nx)),nrY=Math.max(rect.top,Math.min(rect.bottom,ny));dx=nx-nrX;dy=ny-nrY;if(dx===0&&dy===0){dx=nx-cardCx;dy=ny-cardCy;}}else{dx=nx-cx;dy=ny-cy;}var len=Math.hypot(dx,dy)||0.01;return{x:dx/len,y:dy/len};});}
  var disp=gs*ease;
  var positions=nodes.map(function(node,i){var bx=cx+(node.ox||0)*scale,by=cy+(node.oy||0)*scale,d=cluster._gentleDirs[i];return{x:bx+d.x*disp,y:by+d.y*disp};});
  ctx.save();ctx.globalAlpha=1-progress*0.3;
  edges.forEach(function(e){var pa=positions[e[0]],pb=positions[e[1]];if(!pa||!pb)return;ctx.strokeStyle='rgba(130,0,200,'+(0.45*(1-progress*0.4))+')';ctx.lineWidth=1.2*scale;ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();});
  nodes.forEach(function(node,i){var p=positions[i],rG=(node.r||1)*10*scale,rC=(node.r||1)*3.5*scale;var grd=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rG);grd.addColorStop(0,'rgba(159,0,250,0.85)');grd.addColorStop(0.5,'rgba(130,0,200,0.4)');grd.addColorStop(1,'transparent');ctx.fillStyle=grd;ctx.beginPath();ctx.arc(p.x,p.y,rG,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(130,0,200,0.9)';ctx.beginPath();ctx.arc(p.x,p.y,rC,0,Math.PI*2);ctx.fill();});
  ctx.restore();
}

/* ═══ RENDER: MAIN CLUSTER ═══ */
function renderCluster(ctx,cluster,ci,depth,width,height,timeSec,shrinking,collapseProgress){
  if(depth>=HIT_ZONE_DEPTH_MIN&&depth<=HIT_ZONE_DEPTH_MAX&&overlapsCenterHitRect(cluster,depth,width,height))cluster.hitCenter=true;
  if(isAboutToFlyOut(cluster,depth,width,height)&&!cluster.hitCenter&&cluster.missCollapseStart==null)cluster.missCollapseStart=timeSec;
  var bounds=getClusterBounds(cluster,depth,width,height),cx=bounds.cx,cy=bounds.cy,scale=bounds.scale;
  if(cluster.cardPhysicsBreakupStart!=null){renderPhysicsBreakup(ctx,cluster,ci,cx,cy,scale,timeSec);return;}
  if(cluster.cardBlackHoleStart!=null){renderBlackHole(ctx,cluster,ci,cx,cy,scale,timeSec);return;}
  if(cluster.cardGentleRepelStart!=null){renderGentleRepel(ctx,cluster,ci,cx,cy,scale,timeSec);return;}
  var age=timeSec-cluster.birthTime,n=cluster.nodes.length,dfsSteps=Math.floor(timeSec/STEP_DELAY)+1;
  var visibleCount,dieProgress;
  if(shrinking){dieProgress=Math.min(1,collapseProgress);var step=dieProgress<0.2?n:dieProgress<0.45?Math.max(2,Math.floor(n/2)):dieProgress<0.7?2:dieProgress<0.88?1:0;visibleCount=step;}
  else if(cluster.missCollapseStart!=null){var me=timeSec-cluster.missCollapseStart,mp=Math.min(1,me/MISS_COLLAPSE_DURATION);var stepsForN=[n];MISS_COLLAPSE_STEPS.forEach(function(s){if(s<=n&&stepsForN.indexOf(s)<0)stepsForN.push(s)});stepsForN.sort(function(a,b){return b-a});var np=stepsForN.length+1,phase=mp*np;if(phase>=np-1){dieProgress=0.88+0.12*Math.min(1,(phase-(np-1))*np);visibleCount=0;}else{visibleCount=stepsForN[Math.floor(phase)]||1;dieProgress=visibleCount<=1?0.88:0;}}
  else{dieProgress=0;if(age<GROW_DURATION){var prog=age/GROW_DURATION;visibleCount=Math.min(n,Math.max(1,Math.floor(1+prog*(n-1))));}else if(age<cluster.maxAge-DIE_DURATION){visibleCount=n;}else{dieProgress=(age-(cluster.maxAge-DIE_DURATION))/DIE_DURATION;var step=dieProgress<0.2?n:dieProgress<0.45?Math.max(2,Math.floor(n/2)):dieProgress<0.7?2:dieProgress<0.88?1:0;visibleCount=step;}if(age>=cluster.maxAge-DIE_DURATION)dieProgress=(age-(cluster.maxAge-DIE_DURATION))/DIE_DURATION;}
  var inBoom=dieProgress>=0.88,col=lerpPurple(0);
  if(visibleCount<=0){if(inBoom){var t=(dieProgress-0.88)/0.12,pulse=0.5+0.5*Math.sin(t*Math.PI*5),radius=(4+pulse*6)*scale,al=(1-t)*0.85;ctx.save();ctx.globalAlpha=al;var grd=ctx.createRadialGradient(cx,cy,0,cx,cy,radius);grd.addColorStop(0,'rgba('+col.r+','+col.g+','+col.b+','+(0.7+pulse*0.2)+')');grd.addColorStop(0.6,'rgba('+col.r+','+col.g+','+col.b+','+(0.3*pulse)+')');grd.addColorStop(1,'transparent');ctx.fillStyle=grd;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.fill();ctx.restore();}return;}

  var visibleSet=new Set(cluster.growOrder.slice(0,visibleCount));
  var nodes=cluster.nodes,edges=cluster.edges,dfsOrder=cluster.dfsOrder,pathNodes=cluster.pathNodes,pathEdges=cluster.pathEdges,visited=cluster.visited;
  for(var i=0;i<dfsSteps&&i<dfsOrder.length;i++)visited.add(dfsOrder[i]);
  var localT=age;
  if(!cluster._cDist){cluster._cDist=Array(nodes.length).fill(-1);cluster._cDist[0]=0;var q3=[0];while(q3.length){var v3=q3.shift();for(var u3 of(nodes[v3].adj||[]))if(cluster._cDist[u3]<0){cluster._cDist[u3]=cluster._cDist[v3]+1;q3.push(u3);}}cluster._cDeg=nodes.map(function(nd){return(nd.adj?nd.adj.length:0)});}
  var nodeDegrees=cluster._cDeg,distFrom0=cluster._cDist;
  var nodeDepths=null;
  if(cluster.type&&(cluster.type.indexOf('Tree')>=0||cluster.type.indexOf('Spanning')>=0))nodeDepths=distFrom0;
  var edgeMult={};edges.forEach(function(e){var key=e[0]<e[1]?e[0]+'-'+e[1]:e[1]+'-'+e[0];edgeMult[key]=(edgeMult[key]||0)+1;});

  /* formula display (skipped on mobile) */
  if(!SKIP_LABELS){
  var visV=visibleCount,visE=edges.filter(function(e){return visibleSet.has(e[0])&&visibleSet.has(e[1])}).length;
  var visDegs=nodes.map(function(node,i){return visibleSet.has(i)?(node.adj?node.adj.filter(function(u){return visibleSet.has(u)}).length:0):-1}).filter(function(d){return d>=0});
  var visSumDeg=visDegs.reduce(function(a,d){return a+d},0);
  var visDelta=visDegs.length?Math.max.apply(null,visDegs):0;
  var visDeltaMin=visDegs.length?Math.min.apply(null,visDegs):0;
  var visOddCount=visDegs.filter(function(d){return d%2===1}).length;
  var ecc0=Math.max.apply(null,[-1].concat(distFrom0.filter(function(_,i){return visibleSet.has(i)})));
  var isWeighted=!!cluster.edgeWeights;
  var isTreeType=cluster.type&&(cluster.type.indexOf('Tree')>=0||cluster.type.indexOf('Spanning')>=0);
  var isComplete=cluster.type&&cluster.type.indexOf('Complete')>=0;
  var isBipartite=cluster.type&&(cluster.type.indexOf('K_{a,b}')>=0||cluster.type.indexOf('bipartite')>=0||cluster.type.indexOf('Star')>=0);
  var knownTypes=['Petersen','K_{a,b}','Wheel','Prism','Complete','Star','Cycle','Path','Hamiltonian','Euler','Tree'];
  var isKnown=knownTypes.some(function(k){return cluster.type&&cluster.type.indexOf(k)>=0});
  var visPathLen=0;
  if(cluster.pathArr&&cluster.pathArr.length){for(var j=0;j<cluster.pathArr.length-1;j++){if(visibleSet.has(cluster.pathArr[j])&&visibleSet.has(cluster.pathArr[j+1]))visPathLen++;else break;}}
  if(visibleCount===n&&n<=18&&cluster.girth==null){var girth=Infinity;for(var root=0;root<n;root++){var dist=Array(n).fill(-1),parent=Array(n).fill(-1);dist[root]=0;var queue=[root];for(var qi=0;qi<queue.length;qi++){var v=queue[qi];for(var u of(nodes[v].adj||[])){if(dist[u]<0){dist[u]=dist[v]+1;parent[u]=v;queue.push(u);}else if(parent[v]!==u){girth=Math.min(girth,dist[v]+dist[u]+1);}}}}cluster.girth=girth===Infinity?0:girth;}
  var g=cluster.girth||0,F=2-visV+visE;
  var cayley=visV>=2?Math.pow(visV,visV-2):1,mantelBound=Math.floor((visV*visV)/4);
  var formulaPairs=[].concat(
    isWeighted?[]:[{rule:'Shortest path (BFS)',f:function(){return'd(0,n\u22121) = '+visPathLen}}],
    isWeighted?[{rule:'Shortest path (Dijkstra)',f:function(){return'd(0,n\u22121) = '+(cluster.pathDist||0)}}]:[],
    [{rule:'Brooks\' theorem',f:function(){return'\u03C7(G) \u2264 \u0394 + 1 = '+(visDelta+1)}}],
    [{rule:'Degree bounds',f:function(){return'\u03B4 = '+visDeltaMin+'   \u0394 = '+visDelta}}],
    g>=3?[{rule:'Girth',f:function(){return'g(G) = '+g}}]:[],
    g>3?[{rule:'Mantel (triangle-free)',f:function(){return'|E| \u2264 \u230An\u00B2/4\u230B = '+mantelBound}}]:[],
    [{rule:'Euler (planar)',f:function(){return'V \u2212 E + F = 2 \u21D2 F = '+F}}],
    [{rule:'Euler trail theorem',f:function(){return visOddCount<=2?'odd deg: '+visOddCount+' \u21D2 Eulerian':'odd deg: '+visOddCount}}],
    isComplete?[{rule:'Cayley\'s formula',f:function(){return'\u03C4(K_n) = n^(n\u22122) = '+cayley}}]:[],
    isTreeType?[{rule:'Prufer encoding',f:function(){return'|labeled trees| = n^(n\u22122) = '+cayley}}]:[],
    isBipartite?[{rule:'K_{a,b} edge count',f:function(){return'|E| = a\u00B7b = '+visE}}]:[],
    [{rule:'Eccentricity e(0)',f:function(){return'e(0) = '+ecc0}}],
    [{rule:'Degree sequence',f:function(){return'('+visDegs.slice().sort(function(a,b){return b-a}).slice(0,6).join(',')+(visDegs.length>6?'\u2026':'')+')'}}],
    cluster.traversalAlgo?[{rule:'Traversal',f:function(){return cluster.traversalAlgo}}]:[],
    isKnown?[{rule:'Isomorphism',f:function(){return'G \u2245 '+cluster.type}}]:[],
    [{rule:'Handshaking',f:function(){return'\u03A3deg = 2|E| = '+visSumDeg}}],
    [{rule:'|E| bound',f:function(){return'|E| \u2264 n(n\u22121)/2 = '+Math.floor(visV*(visV-1)/2)}}]
  );
  if(n>=2&&!shrinking){
    var idx=Math.floor(localT/2.5)%formulaPairs.length;var fp=formulaPairs[idx],formula=fp.f();
    var topY=cy+Math.min.apply(null,nodes.map(function(node){return(node.oy||0)*scale}))-22*scale;
    ctx.save();ctx.globalAlpha=0.9;ctx.font=Math.max(7,10*scale)+'px "JetBrains Mono",monospace';ctx.fillStyle='rgba('+col.r+','+col.g+','+col.b+',0.85)';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText(fp.rule,cx,topY);ctx.font=Math.max(10,14*scale)+'px "JetBrains Mono",monospace';ctx.fillStyle='rgba('+col.r+','+col.g+','+col.b+',1)';ctx.fillText(formula,cx,topY+14*scale);ctx.restore();
  }
  }/* end SKIP_LABELS */
  var nodeSizeMult=(!SKIP_LABELS&&cluster.edgeWeights)?1.4:1;
  /* convex hull glow */
  var isClosed=visibleCount===n&&age>=GROW_DURATION&&age<cluster.maxAge-DIE_DURATION;
  if(isClosed&&n>=3&&!shrinking&&!SKIP_HULL){
    var pts=nodes.filter(function(_,i){return visibleSet.has(i)}).map(function(node){return{x:cx+node.ox*scale,y:cy+node.oy*scale}});
    var hull=convexHull(pts);
    if(hull.length>=3){var pulse=0.06+0.04*Math.sin(timeSec*1.5+ci);ctx.save();ctx.globalAlpha=0.5+pulse;ctx.beginPath();ctx.moveTo(hull[0].x,hull[0].y);for(var i=1;i<hull.length;i++)ctx.lineTo(hull[i].x,hull[i].y);ctx.closePath();
      var maxR=Math.max.apply(null,pts.map(function(p){return Math.hypot(p.x-cx,p.y-cy)}))*1.2;
      var grd=ctx.createRadialGradient(cx,cy,0,cx,cy,maxR);grd.addColorStop(0,'rgba('+col.r+','+col.g+','+col.b+',0.08)');grd.addColorStop(0.5,'rgba('+Math.round(col.r*0.78)+','+Math.round(col.g*0.6)+','+Math.round(col.b*0.88)+',0.04)');grd.addColorStop(1,'rgba(80,0,120,0.01)');ctx.fillStyle=grd;ctx.fill();ctx.restore();
      ctx.save();ctx.globalAlpha=0.15;ctx.strokeStyle='rgba('+col.r+','+col.g+','+col.b+',0.2)';ctx.lineWidth=1*scale;ctx.setLineDash([3*scale,4*scale]);ctx.beginPath();ctx.moveTo(hull[0].x,hull[0].y);for(var i=1;i<hull.length;i++)ctx.lineTo(hull[i].x,hull[i].y);ctx.closePath();ctx.stroke();ctx.restore();
    }
  }
  /* edges */
  ctx.save();ctx.globalAlpha=1;
  edges.forEach(function(e){
    var a=e[0],b=e[1];if(!visibleSet.has(a)||!visibleSet.has(b))return;
    var key=a<b?a+'-'+b:b+'-'+a,onPath=pathEdges.has(key);
    var vA=visited.has(a),vB=visited.has(b),highlight=(vA||vB)||onPath;
    var idxA=cluster.growOrder.indexOf(a),idxB=cluster.growOrder.indexOf(b);
    var pStart,pEnd;if(idxA<idxB){pStart={x:cx+nodes[a].ox*scale,y:cy+nodes[a].oy*scale};pEnd={x:cx+nodes[b].ox*scale,y:cy+nodes[b].oy*scale};}else{pStart={x:cx+nodes[b].ox*scale,y:cy+nodes[b].oy*scale};pEnd={x:cx+nodes[a].ox*scale,y:cy+nodes[a].oy*scale};}
    var maxIdx=Math.max(idxA,idxB),activationTime=(maxIdx+1)/n*GROW_DURATION;
    var growthRaw=Math.min(1,Math.max(0,(localT-activationTime)/LINE_GROW_DUR)),growth=easeOutCubic(growthRaw);
    if(growth<=0)return;
    var pe={x:pStart.x+(pEnd.x-pStart.x)*growth,y:pStart.y+(pEnd.y-pStart.y)*growth};
    var d=Math.hypot(pEnd.x-pStart.x,pEnd.y-pStart.y)||1;
    var lineAlpha=highlight?0.5:0.18*(1-Math.min(d,60)/60);
    if(highlight){ctx.strokeStyle='rgba('+col.r+','+col.g+','+col.b+',0.2)';ctx.lineWidth=4*scale;ctx.beginPath();ctx.moveTo(pStart.x,pStart.y);ctx.lineTo(pe.x,pe.y);ctx.stroke();}
    ctx.strokeStyle='rgba('+col.r+','+col.g+','+col.b+','+lineAlpha+')';ctx.lineWidth=(highlight?1.5:1)*scale;ctx.beginPath();ctx.moveTo(pStart.x,pStart.y);ctx.lineTo(pe.x,pe.y);ctx.stroke();
    if(growth<1&&growth>0.02){ctx.fillStyle='rgba('+col.r+','+col.g+','+col.b+','+(0.4*(1-growth))+')';ctx.beginPath();ctx.arc(pe.x,pe.y,3*scale,0,Math.PI*2);ctx.fill();}
    if(growth>=1&&!shrinking&&!SKIP_LABELS){var midX=(pStart.x+pEnd.x)/2,midY=(pStart.y+pEnd.y)/2;var edgeWeight=cluster.edgeWeights?cluster.edgeWeights[key]:null;var mult=edgeMult[key]||1;var geomDist=Math.round(Math.hypot(nodes[b].ox-nodes[a].ox,nodes[b].oy-nodes[a].oy));var label=edgeWeight!=null?'w='+edgeWeight:mult>1?'\u00D7'+mult:'d='+geomDist;ctx.font=Math.max(7,(edgeWeight!=null?11:9)*scale)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='rgba('+col.r+','+col.g+','+col.b+',0.8)';ctx.fillText(label,midX,midY);}
  });
  /* nodes */
  nodes.forEach(function(node,i){
    if(!visibleSet.has(i))return;
    var p={x:cx+node.ox*scale,y:cy+node.oy*scale,r:(node.r||1)*scale};
    var isPath=pathNodes.has(i),isVisited=visited.has(i);
    var glow=0.35+0.12*Math.sin(timeSec*1.2+ci*1.5+i*0.2);if(isVisited)glow=0.6+0.25*Math.sin(localT*2.5);else if(isPath)glow=0.7;
    var idxInOrder=cluster.growOrder.indexOf(i),arriveTime=(idxInOrder+1)/n*GROW_DURATION;
    var arrivalProgress=Math.max(0,Math.min(1,(localT-arriveTime)/NODE_ARRIVAL_DUR));
    var arriveScale=0.4+0.6*(1-Math.pow(1-arrivalProgress,2));
    var pulse=0.88+0.35*Math.sin(timeSec*2.2+ci*0.9+i*0.15);
    var rG=(node.r||1)*12*pulse*arriveScale*scale*nodeSizeMult,rC=(node.r||1)*4*pulse*arriveScale*scale*nodeSizeMult;
    var sp=getGlowSprite();ctx.globalAlpha=glow;ctx.drawImage(sp,p.x-rG,p.y-rG,rG*2,rG*2);ctx.globalAlpha=1;
    ctx.fillStyle=isPath?'rgba('+col.r+','+col.g+','+col.b+',0.9)':'rgba('+col.r+','+col.g+','+col.b+',0.85)';ctx.beginPath();ctx.arc(p.x,p.y,rC,0,Math.PI*2);ctx.fill();
    if(!shrinking&&!SKIP_LABELS){var deg=nodeDegrees[i],distVal=distFrom0[i];var nodeLabel=nodeDepths&&nodeDepths[i]>=0?'\u2113'+nodeDepths[i]:distVal>=0?'\u03B4'+deg+' d'+distVal:'\u03B4'+deg;ctx.font=Math.max(6,9*scale)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle='rgba('+col.r+','+col.g+','+col.b+',0.9)';ctx.fillText(nodeLabel,p.x,p.y+rC+2*scale);}
  });
  ctx.restore();
}

/* ═══ MAIN LOOP & LIFECYCLE ═══ */
var _rafId=0,_resizeHandler=null,_resizeObserver=null,_shrinkingStart=null;

window.startGateScreensaver=function(canvas,opts){
  opts=opts||{};
  if(opts.color1){_c1=opts.color1;_c2=opts.color2||opts.color1;}
  if(opts.bg){_bgColor=opts.bg;}
  if(!canvas)return;
  var ctx=canvas.getContext('2d');if(!ctx)return;
  _shrinkingStart=null;
  var clusters=[],lastSpawn=0,phaseStart=Date.now(),logicalW=0,logicalH=0,scaleFactor=1,resizeRaf=0,resizeTimer=0;
  var doResize=function(){logicalW=Math.max(1,window.innerWidth||300);logicalH=Math.max(1,window.innerHeight||150);scaleFactor=Math.min(MAX_DPR,window.devicePixelRatio||1);canvas.width=Math.max(1,Math.round(logicalW*scaleFactor));canvas.height=Math.max(1,Math.round(logicalH*scaleFactor));canvas.style.cssText='width:100%;height:100%;padding:0;margin:0;border:0;box-sizing:border-box;display:block';lastSpawn=0;};
  var scheduleResize=function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(function(){if(resizeRaf)cancelAnimationFrame(resizeRaf);resizeRaf=requestAnimationFrame(function(){resizeRaf=0;doResize();});},100);};
  _resizeHandler=scheduleResize;
  _resizeObserver=new ResizeObserver(function(){scheduleResize()});
  _resizeObserver.observe(canvas);
  var firstFrame=true;
  var tick=function(){
    if(!ctx||!canvas.parentElement){return;}
    var _t0=performance.now();
    ctx.setTransform(1,0,0,1,0,0);ctx.scale(scaleFactor,scaleFactor);
    var width=logicalW,height=logicalH,timeSec=(Date.now()-phaseStart)/1000;
    var shrinking=_shrinkingStart!=null,collapseProgress=shrinking?(Date.now()-_shrinkingStart)/700:0;
    var cameraZ=timeSec*FLY_SPEED;
    if(firstFrame){firstFrame=false;for(var i=0;i<INITIAL_SPAWN;i++){spawnCluster(clusters,width,height,0,cameraZ+i*45+Math.random()*30);}}
    ctx.fillStyle=_bgColor;ctx.fillRect(0,0,width,height);
    if(!shrinking&&clusters.length<MAX_CLUSTERS&&timeSec-lastSpawn>SPAWN_INTERVAL&&_lastFrameMs<25){lastSpawn=timeSec;spawnCluster(clusters,width,height,timeSec,cameraZ);}
    clusters=clusters.filter(function(cluster){
      var depth=cluster.spawnDepth-cameraZ,ageDead=(timeSec-cluster.birthTime)>=cluster.maxAge+DIE_DURATION;
      var offScreen=hasFullyFlownBy(cluster,depth,width,height),wayBehind=depth<SAFETY_DEPTH-FLY_SPEED*FLY_BY_EXTRA_SEC;
      var inMissCollapse=cluster.missCollapseStart!=null&&(timeSec-cluster.missCollapseStart)<MISS_COLLAPSE_DURATION+0.3;
      var inCardPhysics=cluster.cardPhysicsBreakupStart!=null&&(timeSec-cluster.cardPhysicsBreakupStart)<CARD_PHYSICS_DURATION+0.2;
      var inGentleRepel=cluster.cardGentleRepelStart!=null&&(timeSec-cluster.cardGentleRepelStart)<CARD_GENTLE_REPEL_DURATION+0.15;
      var bangElapsed=cluster._bangPhaseStart!=null?timeSec-cluster._bangPhaseStart:0;
      var inBlackHole=cluster.cardBlackHoleStart!=null&&((cluster._bangPhaseStart==null&&(cluster._blackHoleFromDrag?(timeSec-cluster.cardBlackHoleStart)<CARD_BLACK_HOLE_DRAG_MAX_SEC:(timeSec-cluster.cardBlackHoleStart)<CARD_BLACK_HOLE_DURATION))||(cluster._bangPhaseStart!=null&&bangElapsed<CARD_BANG_DURATION+0.5));
      return!ageDead&&!wayBehind&&(!offScreen||inMissCollapse||inCardPhysics||inGentleRepel||inBlackHole);
    });
    clusters.sort(function(a,b){return(b.spawnDepth-cameraZ)-(a.spawnDepth-cameraZ)});
    /* auto-trigger black hole / explode for clusters hitting center */
    if(!shrinking){
      var rw=width*CENTER_HIT_RECT_W,rh=height*CENTER_HIT_RECT_H,margin=80;
      clusters.forEach(function(cluster){
        var depth=cluster.spawnDepth-cameraZ;
        if(depth>=HIT_ZONE_DEPTH_MIN&&depth<=HIT_ZONE_DEPTH_MAX&&overlapsCenterHitRect(cluster,depth,width,height)&&cluster.cardPhysicsBreakupStart==null&&cluster.cardGentleRepelStart==null&&cluster.cardBlackHoleStart==null&&cluster.missCollapseStart==null){
          if(cluster.autoBlackHole){var useCenter=Math.random()<0.6;var bx=useCenter?width/2:margin+Math.random()*(width-2*margin);var by=useCenter?height/2:margin+Math.random()*(height-2*margin);cluster._cardRect={left:bx-rw/2,top:by-rh/2,right:bx+rw/2,bottom:by+rh/2};cluster.cardBlackHoleStart=timeSec;}
          else if(cluster.autoExplode){cluster._cardRect={left:width/2-rw/2,top:height/2-rh/2,right:width/2+rw/2,bottom:height/2+rh/2};cluster.cardPhysicsBreakupStart=timeSec;}
        }
      });
    }
    /* bang phase timeout for drag-triggered black holes */
    clusters.forEach(function(cluster){if(cluster.cardBlackHoleStart==null||!cluster._blackHoleFromDrag)return;var elapsed=timeSec-cluster.cardBlackHoleStart;if(cluster._bangPhaseStart==null&&elapsed>=CARD_BLACK_HOLE_DRAG_MAX_SEC)cluster._bangPhaseStart=timeSec;});
    /* render all */
    clusters.forEach(function(cluster,ci){var depth=cluster.spawnDepth-cameraZ;renderCluster(ctx,cluster,ci,depth,width,height,timeSec,shrinking,collapseProgress);});
    _lastFrameMs=performance.now()-_t0;
    _rafId=requestAnimationFrame(tick);
  };
  window.addEventListener('resize',scheduleResize);
  requestAnimationFrame(function(){doResize();tick();});
};

window.shrinkGateScreensaver=function(){_shrinkingStart=Date.now();};

window.stopGateScreensaver=function(){
  if(_rafId){cancelAnimationFrame(_rafId);_rafId=0;}
  if(_resizeHandler){window.removeEventListener('resize',_resizeHandler);_resizeHandler=null;}
  if(_resizeObserver){_resizeObserver.disconnect();_resizeObserver=null;}
  _shrinkingStart=null;
};

})();
