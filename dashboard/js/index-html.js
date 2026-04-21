/* ================================================================
   index-html.js  --  App markup builder for Sales AI controller
   Returns the inner HTML for #app. CSS lives in the HTML <style>.
   ================================================================ */

function buildAppHTML() {
  return '' +
  '<div class="topbar">' +
    '<div class="tb-brand">' +
      '<div class="tb-logo-wrap">' +
        '<img class="tb-avatar" src="img/icons/icon-192.png" alt="Sales AI">' +
      '</div>' +
      '<div class="tb-brand-info">' +
        '<h1>Sales <em>AI</em></h1>' +
        '<span class="pulse">SPEC v1.0</span>' +
        '<div class="tb-date">Apr 2026 · 14 reps</div>' +
      '</div>' +
    '</div>' +
    '<div class="tb-center">' +
      '<div class="tb-tabs">' +
        '<button class="ptb on" onclick="switchPrimary(\'presentation\',this)">Presentation</button>' +
        '<button class="ptb" onclick="switchPrimary(\'analytics\',this)">Analytics</button>' +
        '<button class="ptb" onclick="switchPrimary(\'design\',this)">Design</button>' +
        '<button class="ptb" onclick="switchPrimary(\'nodes\',this)">Architecture</button>' +
        '<button class="ptb" onclick="switchPrimary(\'project\',this)">Project</button>' +
        '<button class="ptb" onclick="switchPrimary(\'lists\',this)">Lists</button>' +
        '<button class="ptb" onclick="switchPrimary(\'scripts\',this)">Scripts</button>' +
        '<button class="ptb" onclick="switchPrimary(\'data\',this)">Data</button>' +
        '<button class="ptb" onclick="switchPrimary(\'cc\',this)">C&amp;C</button>' +
        '<button class="ptb" onclick="switchPrimary(\'changelog\',this)">Changelog <span class="ptb-new" id="changelogNewBadge">NEW</span></button>' +
      '</div>' +
      '<div class="tb-stats">' +
        '<div class="ms"><div class="ms-l">Pipeline</div><div class="ms-v hi">$37.5M</div><div class="ms-s">1,357 proposals</div></div>' +
        '<div class="ms"><div class="ms-l">Orphaned</div><div class="ms-v clr-p2">$24.4M</div><div class="ms-s">Departed reps</div></div>' +
        '<div class="ms"><div class="ms-l">No PT Contact</div><div class="ms-v clr-p3">317</div><div class="ms-s">$10.25M · HS needed</div></div>' +
        '<div class="ms"><div class="ms-l">Callable</div><div class="ms-v clr-lt">1,322</div><div class="ms-s">100% HS coverage</div></div>' +
        '<div class="ms"><div class="ms-l">Auto-Dial</div><div class="ms-v clr-p4">991</div><div class="ms-s">≤$30k · $11.1M</div></div>' +
        '<div class="ms"><div class="ms-l">Human Review</div><div class="ms-v clr-p5">321</div><div class="ms-s">&gt;$30k · $25M</div></div>' +
        '<div class="ms"><div class="ms-l">NULL tstamp</div><div class="ms-v clr-dm">46</div><div class="ms-s">$1.42M excluded</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="tb-user" id="tbUser">' +
      '<div class="tb-user-toggle">' +
        '<img class="tb-user-avatar" src="https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Alex+Alpha&hair=short01,short04,short07,short10,short14,short19" alt="Alex" onerror="this.style.display=\'none\'">' +
        '<span class="tb-user-name">Alex</span>' +
        '<span class="tb-user-caret">&#9662;</span>' +
      '</div>' +
      '<div class="tb-user-menu" id="tbUserMenu">' +
        '<div class="tb-um-header">Alex<div class="tb-um-role">Admin</div></div>' +
        '<div class="tb-um-sep"></div>' +
        '<button class="tb-um-item" onclick="philLogout()">&#x23FB; &nbsp;Sign Out</button>' +
      '</div>' +
    '</div>' +
  '</div>' +

  '<div class="secondary-tabs sec-panel" id="sec-nodes"></div>' +
  '<div class="secondary-tabs sec-panel" id="sec-analytics">' +
    '<button class="stb on" onclick="showFrame(\'overview\',this)">Overview</button>' +
    '<button class="stb" onclick="showFrame(\'intro\',this)">Deal Close Analysis</button>' +
    '<button class="stb" onclick="showFrame(\'pipeline\',this)">Pipeline</button>' +
    '<button class="stb" onclick="showFrame(\'reps\',this)">Reps</button>' +
    '<button class="stb" onclick="showFrame(\'clients\',this)">Clients</button>' +
    '<button class="stb" onclick="showFrame(\'contacts\',this)">Contacts</button>' +
    '<button class="stb" onclick="showFrame(\'intel\',this)">Intel · 20 Stats</button>' +
  '</div>' +
  '<div class="secondary-tabs sec-panel" id="sec-data">' +
    '<button class="stb on" onclick="showFrame(\'certs\',this)">Certifications</button>' +
    '<button class="stb" onclick="showFrame(\'providers\',this)">Providers</button>' +
    '<button class="stb" onclick="showFrame(\'legal\',this)">Licenses</button>' +
    '<button class="stb" onclick="showFrame(\'apprenticeships\',this)">Apprenticeships</button>' +
    '<button class="stb" onclick="showFrame(\'schools\',this)">Schools</button>' +
    '<button class="stb" onclick="showFrame(\'jobs\',this)">Jobs</button>' +
    '<button class="stb" onclick="showFrame(\'salary\',this)">Salary</button>' +
    '<button class="stb" onclick="showFrame(\'demand\',this)">Demand</button>' +
    '<button class="stb" onclick="showFrame(\'employers\',this)">Employers</button>' +
    '<button class="stb" onclick="showFrame(\'industries\',this)">Industries</button>' +
  '</div>' +
  '<div class="secondary-tabs sec-panel" id="sec-design">' +
    '<button class="stb on" onclick="showFrame(\'d-architecture\',this)">Architecture</button>' +
    '<button class="stb" onclick="showFrame(\'d-domain\',this)">Domain Model</button>' +
    '<button class="stb" onclick="showFrame(\'d-userflows\',this)">User Flows</button>' +
    '<button class="stb" onclick="showFrame(\'d-statemachines\',this)">State Machines</button>' +
    '<button class="stb" onclick="showFrame(\'d-matchengine\',this)">Match Engine</button>' +
    '<button class="stb" onclick="showFrame(\'d-dataschema\',this)">Data Schema</button>' +
    '<button class="stb" onclick="showFrame(\'d-network\',this)">Network</button>' +
    '<button class="stb" onclick="showFrame(\'d-apimap\',this)">API Map</button>' +
    '<button class="stb" onclick="showFrame(\'d-deployment\',this)">Deployment</button>' +
    '<button class="stb" onclick="showFrame(\'d-processes\',this)">Processes</button>' +
  '</div>' +
  '<div class="secondary-tabs sec-panel" id="sec-project">' +
    '<button class="stb on" onclick="showFrame(\'todo\',this)">TODO</button>' +
    '<button class="stb" onclick="showFrame(\'gantt\',this)">GANTT</button>' +
    '<button class="stb" onclick="showFrame(\'cost-est\',this)">COST EST</button>' +
    '<button class="stb" onclick="showFrame(\'docs\',this)">Docs</button>' +
  '</div>' +
  '<div class="secondary-tabs sec-panel" id="sec-scripts"></div>' +
  '<div class="secondary-tabs sec-panel" id="sec-lists"></div>' +
  '<div class="secondary-tabs sec-panel" id="sec-browser"><button class="stb on" onclick="showFrame(\'browser\',this)">All Files</button></div>' +
  '<div class="secondary-tabs sec-panel" id="sec-cc"></div>' +
  '<div class="secondary-tabs sec-panel sec-visible" id="sec-presentation">' +
    '<button class="stb on" onclick="showFrame(\'presentation\',this)">v1.0</button>' +
    '<button class="stb stb-fullscreen" onclick="launchFullscreen()">⛶  Fullscreen</button>' +
  '</div>' +
  '<div class="secondary-tabs sec-panel" id="sec-changelog"></div>' +

  '<div class="iframe-wrap" id="iframeWrap">' +
    '<iframe class="tab-frame" id="frame-intro"></iframe>' +
    '<iframe class="tab-frame" id="frame-overview"></iframe>' +
    '<iframe class="tab-frame" id="frame-pipeline"></iframe>' +
    '<iframe class="tab-frame" id="frame-reps"></iframe>' +
    '<iframe class="tab-frame" id="frame-clients"></iframe>' +
    '<iframe class="tab-frame" id="frame-contacts"></iframe>' +
    '<iframe class="tab-frame" id="frame-intel"></iframe>' +
    '<iframe class="tab-frame" id="frame-lists"></iframe>' +
    '<iframe class="tab-frame" id="frame-scripts"></iframe>' +
    '<iframe class="tab-frame" id="frame-browser"></iframe>' +
    '<iframe class="tab-frame on" id="frame-presentation"></iframe>' +
    '<iframe class="tab-frame" id="frame-nodes"></iframe>' +
    '<iframe class="tab-frame" id="frame-todo"></iframe>' +
    '<iframe class="tab-frame" id="frame-gantt"></iframe>' +
    '<iframe class="tab-frame" id="frame-cc"></iframe>' +
    '<iframe class="tab-frame" id="frame-certs"></iframe>' +
    '<iframe class="tab-frame" id="frame-providers"></iframe>' +
    '<iframe class="tab-frame" id="frame-legal"></iframe>' +
    '<iframe class="tab-frame" id="frame-apprenticeships"></iframe>' +
    '<iframe class="tab-frame" id="frame-schools"></iframe>' +
    '<iframe class="tab-frame" id="frame-jobs"></iframe>' +
    '<iframe class="tab-frame" id="frame-salary"></iframe>' +
    '<iframe class="tab-frame" id="frame-demand"></iframe>' +
    '<iframe class="tab-frame" id="frame-employers"></iframe>' +
    '<iframe class="tab-frame" id="frame-industries"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-architecture"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-domain"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-userflows"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-statemachines"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-matchengine"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-dataschema"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-network"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-apimap"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-deployment"></iframe>' +
    '<iframe class="tab-frame" id="frame-d-processes"></iframe>' +
    '<iframe class="tab-frame" id="frame-cost-est"></iframe>' +
    '<iframe class="tab-frame" id="frame-docs"></iframe>' +
    '<iframe class="tab-frame" id="frame-changelog"></iframe>' +
  '</div>';
}
