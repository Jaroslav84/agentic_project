// Auto-link propIDs to FieldTECH
// Include this script at the bottom of any page that displays propIDs
(function(){
  var BASE='https://app.fieldtech.example/#/pins?propID=';
  var STYLE='color:var(--Cl,#d36eff);text-decoration:none';

  function linkPropIDs(root){
    var walker=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,null,false);
    var nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      var parent=node.parentNode;
      if(!parent||parent.tagName==='SCRIPT'||parent.tagName==='STYLE'||parent.tagName==='A'||parent.tagName==='INPUT'||parent.tagName==='TEXTAREA') return;
      var text=node.nodeValue;
      // Match propID=#NNNNN, propID=NNNNN, propID #NNNNN, #NNNNN (4-5 digits, not hex colors)
      var re=/(?:propID[=#]\s*)(\d{4,5})|#(\d{4,5})(?!\w)/g;
      var match,pieces=[],last=0,found=false;
      while((match=re.exec(text))!==null){
        var id=match[1]||match[2];
        // Skip if it looks like a hex color (preceded by color-like context)
        var before=text.substring(Math.max(0,match.index-10),match.index);
        if(/[0-9a-fA-F]{2,}$/.test(before)&&match[2]) continue;
        // Skip placeholder "X"
        if(id==='X') continue;
        found=true;
        if(match.index>last) pieces.push(document.createTextNode(text.substring(last,match.index)));
        var a=document.createElement('a');
        a.href=BASE+id;
        a.target='_blank';
        a.rel='noopener noreferrer';
        a.setAttribute('style',STYLE);
        a.title='Open propID '+id+' in FieldTECH';
        a.textContent=match[0];
        pieces.push(a);
        last=re.lastIndex;
      }
      if(found){
        if(last<text.length) pieces.push(document.createTextNode(text.substring(last)));
        var frag=document.createDocumentFragment();
        pieces.forEach(function(p){frag.appendChild(p);});
        parent.replaceChild(frag,node);
      }
    });
  }

  // Run on initial load
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){linkPropIDs();});
  } else {
    linkPropIDs();
  }

  // Observe DOM changes (for JS-generated content like expanded detail rows)
  var observer=new MutationObserver(function(mutations){
    mutations.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType===1) linkPropIDs(n);
      });
    });
  });
  observer.observe(document.body,{childList:true,subtree:true});
})();
