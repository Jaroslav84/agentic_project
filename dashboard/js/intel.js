/* intel.js — Navigation helpers for tab_intel.html (Intelligence Digest) */

function goToBrowser(filterKey, filterVal) {
  // Send message to parent frame to switch to Data Browser and pre-filter
  window.parent.postMessage({ action: 'openBrowser', filterKey: filterKey, filterVal: filterVal }, window.SAFE_ORIGIN);
}

function goToLists(listKey) {
  window.parent.postMessage({ action: 'openLists', listKey: listKey }, window.SAFE_ORIGIN);
}
