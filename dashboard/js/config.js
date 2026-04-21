/* ─────────────────────────────────────────────────────────
   config.js — cc_config commission preview calculator
   Globals exposed: updatePreview
   ───────────────────────────────────────────────────────── */

function updatePreview() {
  var csm = parseFloat(document.querySelector('input[oninput*="v-csm"]').value) || 3.5;
  var ob = parseFloat(document.querySelector('input[oninput*="v-orphan"]').value) || 1.5;
  var deal = parseInt(document.querySelector('input[oninput*="pv-deal"]').value) || 50000;
  var csmAmt = Math.round(deal * csm / 100);
  var obAmt = Math.round(deal * ob / 100);
  var repAmt = Math.round(deal * 0.08);
  var total = csmAmt + obAmt;
  document.getElementById('pv-val').textContent = '$' + deal.toLocaleString();
  document.getElementById('pv-csm').textContent = '$' + csmAmt.toLocaleString();
  document.getElementById('pv-ob').textContent = '$' + obAmt.toLocaleString();
  document.getElementById('pv-rep').textContent = '$' + repAmt.toLocaleString();
  document.getElementById('pv-total').textContent = '$' + total.toLocaleString();
  document.getElementById('pv-csm-pct').textContent = csm;
  document.getElementById('pv-ob-pct').textContent = ob;
  document.getElementById('pv-deal').textContent = '$' + deal.toLocaleString();
}
