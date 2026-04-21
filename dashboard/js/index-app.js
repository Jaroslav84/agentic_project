/* ================================================================
   index-app.js  --  App shell for Sales AI controller
   Builds UI after auth, manages tabs / iframes / postMessage.
   ================================================================ */

/* --  Launch the app after authentication  -- */
function launchApp(instant) {
  var gate = document.getElementById('gate');
  if (instant) {
    gate.classList.add('gate-hidden');
  } else {
    gate.classList.add('gate-fade');
    setTimeout(function () { gate.classList.add('gate-hidden'); }, 600);
  }

  document.body.classList.add('app-ready');
  var app = document.getElementById('app');
  app.innerHTML = buildAppHTML();
  app.classList.add('show');

  /* iframe src map -- lazy-loaded on first visit */
  window._frameSrc = {
    'frame-intro':         'tab_intro.html',
    'frame-overview':      'tab_overview.html',
    'frame-pipeline':      'tab_pipeline.html',
    'frame-reps':          'tab_reps.html',
    'frame-clients':       'tab_clients.html',
    'frame-contacts':      'tab_contacts.html',
    'frame-intel':         'tab_intel.html',
    'frame-lists':         'tab_lists.html',
    'frame-scripts':       'tab_scripts.html',
    'frame-browser':       'tab_browser.html',
    'frame-presentation':  'slides.html',
    'frame-nodes':         'cc/cc_graphs.html',
    'frame-todo':          'cc/cc_todo.html',
    'frame-gantt':         'architecture/arch_gantt.html',
    'frame-cc':            'tab_cc.html',
    'frame-certs':              'job/tab_certs.html',
    'frame-providers':          'job/tab_providers.html',
    'frame-legal':              'job/tab_legal.html',
    'frame-apprenticeships':    'job/tab_apprenticeships.html',
    'frame-schools':            'job/tab_schools.html',
    'frame-jobs':               'job/tab_jobs.html',
    'frame-salary':             'job/tab_salary.html',
    'frame-demand':             'job/tab_demand.html',
    'frame-employers':          'job/tab_employers.html',
    'frame-industries':         'job/tab_industries.html',
    'frame-d-architecture':     'design/graph_architecture.html',
    'frame-d-domain':           'design/graph_domain.html',
    'frame-d-userflows':        'design/graph_userflows.html',
    'frame-d-statemachines':    'design/graph_statemachines.html',
    'frame-d-matchengine':      'design/graph_matchengine.html',
    'frame-d-dataschema':       'design/graph_dataschema.html',
    'frame-d-network':          'design/graph_network.html',
    'frame-d-apimap':           'design/graph_apimap.html',
    'frame-d-deployment':       'design/graph_deployment.html',
    'frame-d-processes':        'design/graph_processes.html',
    'frame-cost-est':           'tab_cost_est.html',
    'frame-docs':               'tab_docs.html',
    'frame-changelog':          'tab_changelog.html'
  };

  /* only load the default visible tab (Presentation) */
  var pf = document.getElementById('frame-presentation');
  if (pf) pf.src = window._frameSrc['frame-presentation'];

  initAppJS();
}

/* --  Lazy-load helper: set src on first visit, optional onReady callback  -- */
function ensureLoaded(frameId, onReady) {
  var f = document.getElementById(frameId);
  if (!f) return;
  if (!f.getAttribute('src') && window._frameSrc[frameId]) {
    if (onReady) f.addEventListener('load', function h() { f.removeEventListener('load', h); onReady(f); });
    f.src = window._frameSrc[frameId];
  } else if (onReady) {
    onReady(f);
  }
}

/* --  Wire up all runtime behaviour  -- */
function initAppJS() {
  window.philLogout = function () {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
  };

  var tbUser = document.getElementById('tbUser');
  if (tbUser) {
    tbUser.querySelector('.tb-user-toggle').addEventListener('click', function (e) {
      e.stopPropagation();
      tbUser.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!tbUser.contains(e.target)) tbUser.classList.remove('open');
    });
  }

  window.hideLoader = function (iframe) {
    var id = iframe.id.replace('frame-', 'loader-');
    var l = document.getElementById(id);
    if (l) {
      l.classList.add('hidden');
      setTimeout(function () { l.classList.add('loader-gone'); }, 300);
    }
  };

  var currentPrimary = 'presentation';
  var lastAnalytics = 'overview';
  var lastLists = 'lists';
  var lastBrowser = 'browser';
  var lastProject = 'todo';
  var lastCC = 'cc';
  var lastData = 'certs';
  var lastDesign = 'd-architecture';
  window.currentPrimary = currentPrimary;

  /* -- Primary tab switching -- */
  window.switchPrimary = function (name, btn) {
    document.querySelectorAll('.ptb').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    currentPrimary = name;
    window.currentPrimary = name;

    document.querySelectorAll('.sec-panel').forEach(function (el) {
      el.classList.remove('sec-visible');
    });
    var secEl = document.getElementById('sec-' + name);
    if (secEl) secEl.classList.add('sec-visible');

    document.querySelectorAll('.tab-frame').forEach(function (f) { f.classList.remove('on'); });

    if (name === 'presentation') { ensureLoaded('frame-presentation'); document.getElementById('frame-presentation').classList.add('on'); return; }
    if (name === 'nodes')        { ensureLoaded('frame-nodes');        document.getElementById('frame-nodes').classList.add('on');        return; }
    if (name === 'scripts')      { ensureLoaded('frame-scripts');      document.getElementById('frame-scripts').classList.add('on');      return; }
    if (name === 'cc')           { ensureLoaded('frame-cc');           document.getElementById('frame-cc').classList.add('on');           return; }
    if (name === 'changelog')    { ensureLoaded('frame-changelog');    document.getElementById('frame-changelog').classList.add('on');    return; }

    var show = name === 'analytics' ? lastAnalytics
             : name === 'data'      ? lastData
             : name === 'design'    ? lastDesign
             : name === 'project'   ? lastProject
             : name === 'lists'     ? lastLists
             : lastBrowser;
    ensureLoaded('frame-' + show);
    document.getElementById('frame-' + show).classList.add('on');
  };

  /* -- Fullscreen for presentation -- */
  window.launchFullscreen = function () {
    var frame = document.getElementById('frame-presentation');
    frame.contentWindow.postMessage({ action: 'fullscreen' }, window.SAFE_ORIGIN);
    if (frame.requestFullscreen) frame.requestFullscreen();
  };

  /* -- Secondary tab switching -- */
  window.showFrame = function (name, btn) {
    var secBar = currentPrimary === 'analytics' ? 'sec-analytics'
               : currentPrimary === 'data'      ? 'sec-data'
               : currentPrimary === 'design'    ? 'sec-design'
               : currentPrimary === 'project'   ? 'sec-project'
               : currentPrimary === 'lists'     ? 'sec-lists'
               : currentPrimary === 'browser'   ? 'sec-browser'
               : currentPrimary === 'cc'        ? 'sec-cc'
               : 'sec-browser';
    document.querySelectorAll('#' + secBar + ' .stb').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    document.querySelectorAll('.tab-frame').forEach(function (f) { f.classList.remove('on'); });
    ensureLoaded('frame-' + name);
    document.getElementById('frame-' + name).classList.add('on');

    if      (currentPrimary === 'analytics') lastAnalytics = name;
    else if (currentPrimary === 'data')      lastData      = name;
    else if (currentPrimary === 'design')    lastDesign    = name;
    else if (currentPrimary === 'project')   lastProject   = name;
    else if (currentPrimary === 'lists')     lastLists     = name;
    else if (currentPrimary === 'cc')        lastCC        = name;
    else                                     lastBrowser   = name;
  };

  /* -- Cross-iframe postMessage listener -- */
  window.addEventListener('message', function (e) {
    if (!window.matchOrigin(e.origin)) return;
    if (!e.data || !e.data.action) return;

    if (e.data.action === 'openBrowser') {
      document.querySelectorAll('.ptb').forEach(function (b) { b.classList.remove('on'); });
      document.querySelectorAll('.tb-tabs .ptb').forEach(function (b) {
        if (b.textContent.includes('Data Browser')) b.classList.add('on');
      });
      currentPrimary = 'browser'; window.currentPrimary = 'browser';
      document.querySelectorAll('.sec-panel').forEach(function (el) { el.classList.remove('sec-visible'); });
      document.getElementById('sec-browser').classList.add('sec-visible');
      document.querySelectorAll('.tab-frame').forEach(function (f) { f.classList.remove('on'); });
      var msg = { action: 'filter', key: e.data.filterKey, val: e.data.filterVal };
      ensureLoaded('frame-browser', function (fr) { fr.contentWindow.postMessage(msg, window.SAFE_ORIGIN); });
      document.getElementById('frame-browser').classList.add('on');
      lastBrowser = 'browser';
    }

    if (e.data.action === 'openLists') {
      document.querySelectorAll('.ptb').forEach(function (b) { b.classList.remove('on'); });
      document.querySelectorAll('.tb-tabs .ptb').forEach(function (b) {
        if (b.textContent.includes('Lists')) b.classList.add('on');
      });
      currentPrimary = 'lists'; window.currentPrimary = 'lists';
      document.querySelectorAll('.sec-panel').forEach(function (el) { el.classList.remove('sec-visible'); });
      document.getElementById('sec-lists').classList.add('sec-visible');
      document.querySelectorAll('.tab-frame').forEach(function (f) { f.classList.remove('on'); });
      var msg2 = { action: 'loadFile', key: e.data.listKey };
      ensureLoaded('frame-lists', function (fr) { fr.contentWindow.postMessage(msg2, window.SAFE_ORIGIN); });
      document.getElementById('frame-lists').classList.add('on');
      lastLists = 'lists';
    }
  });
}
