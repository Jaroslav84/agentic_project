/* ================================================================
   index-gate.js  --  Auth gate for Sales AI controller
   Demo mode: any non-empty password is accepted.
   ================================================================ */

var AUTH_KEY = 'sales_auth';

/* --  Show the login gate + screensaver  -- */
function showGate() {
  var gate = document.getElementById('gate');
  gate.classList.add('show');

  var cv = document.getElementById('gate-canvas');
  if (cv && window.startGateScreensaver) startGateScreensaver(cv);

  setTimeout(function () {
    document.getElementById('gateCard').classList.add('show');
  }, 400);

  document.getElementById('gateForm').onsubmit = function (e) {
    e.preventDefault();
    var val = (document.getElementById('gatePass').value || '').trim();
    if (!val) return;

    sessionStorage.setItem(AUTH_KEY, '1');
    document.getElementById('gateErr').textContent = '';

    if (window.shrinkGateScreensaver) shrinkGateScreensaver();
    document.getElementById('gateCard').classList.add('gate-out-anim');

    setTimeout(function () {
      if (window.stopGateScreensaver) stopGateScreensaver();
      launchApp();
    }, 700);
  };
}

/* --  Boot sequence  -- */
var _urlToken = (new URLSearchParams(window.location.search)).get('token');

if (sessionStorage.getItem(AUTH_KEY)) {
  launchApp(true);
} else if (_urlToken) {
  sessionStorage.setItem(AUTH_KEY, '1');
  history.replaceState(null, '', window.location.pathname);
  launchApp(true);
} else {
  showGate();
}
