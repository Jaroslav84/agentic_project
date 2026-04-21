/* ================================================================
   env.js  --  Environment detection & debug logging for Sales AI
   Must be loaded FIRST (before all other scripts).

   Production:  pinnacleservices.demo  →  console suppressed
   Local:       everything else         →  console active
   ================================================================ */
(function () {
  'use strict';

  var host = window.location.hostname || '';
  var IS_PROD = host === 'pinnacleservices.demo';
  var IS_LOCAL = !IS_PROD;

  /* expose globally */
  window.SALES_ENV = {
    IS_PROD: IS_PROD,
    IS_LOCAL: IS_LOCAL,
    HOST: host
  };

  /* ── Safe postMessage helpers ──
     On file:// each page is a unique "null" origin; strict matching breaks
     cross-frame postMessage. Fall back to wildcard only when we're on file://. */
  var _isFile = window.location.protocol === 'file:';
  window.SAFE_ORIGIN = _isFile ? '*' : window.location.origin;
  window.matchOrigin = function (origin) {
    return _isFile || origin === window.location.origin;
  };

  /* ── Debug logger ── */
  var noop = function () {};
  var Sales = {
    log:   IS_LOCAL ? console.log.bind(console, '[Sales]')   : noop,
    warn:  IS_LOCAL ? console.warn.bind(console, '[Sales]')  : noop,
    error: console.error.bind(console, '[Sales]'),
    debug: IS_LOCAL ? console.debug.bind(console, '[Sales]') : noop,
    info:  IS_LOCAL ? console.info.bind(console, '[Sales]')  : noop,
    table: IS_LOCAL ? console.table.bind(console)            : noop
  };
  window.Sales = Sales;

  /* ── Production: suppress ALL console output ── */
  if (IS_PROD) {
    var silent = noop;
    console.log = silent;
    console.debug = silent;
    console.info = silent;
    console.warn = silent;
    console.trace = silent;
    console.table = silent;
    console.dir = silent;
    console.group = silent;
    console.groupEnd = silent;
    console.time = silent;
    console.timeEnd = silent;
    /* keep console.error alive — critical errors should still surface */
  }

  if (IS_LOCAL) {
    Sales.info('Environment: LOCAL (' + (host || window.location.protocol) + ')');
  }
})();
