/* cc-shared.js — shared row-expansion logic for cc_queue, cc_debt, etc. */

/**
 * Attach expand/collapse behavior to a table's tbody.
 *
 * @param {object} opts
 *   opts.skipTags   - array of tagNames that should NOT trigger expand (e.g. ['INPUT','BUTTON'])
 *   opts.getPropID  - fn(tr) → string  (extract the propID text from the row)
 *   opts.getDetail  - fn(propID, tr) → string|null  (return detail HTML or null to skip)
 *   opts.colSpan    - number of columns for the detail <td>
 */
function attachRowExpand(opts) {
  var tbody = document.querySelector('tbody');
  if (!tbody) return;

  tbody.addEventListener('click', function (e) {
    // Skip clicks on interactive elements
    var skip = opts.skipTags || ['BUTTON'];
    if (skip.indexOf(e.target.tagName) !== -1) return;
    // Also skip anchor clicks
    if (e.target.tagName === 'A') return;

    var tr = e.target.closest('tr');
    if (!tr || tr.classList.contains('detail-row')) return;

    var propID = opts.getPropID(tr);
    if (!propID) return;

    // Toggle: if already expanded, collapse
    var existing = tr.nextElementSibling;
    if (existing && existing.classList.contains('detail-row')) {
      tr.classList.remove('active-row');
      existing.remove();
      return;
    }

    // Collapse any other open detail
    var prev = document.querySelector('tr.active-row');
    if (prev) {
      prev.classList.remove('active-row');
      var pd = prev.nextElementSibling;
      if (pd && pd.classList.contains('detail-row')) pd.remove();
    }

    // Build detail
    var html = opts.getDetail(propID, tr);
    if (!html) return;

    var colSpan = opts.colSpan || tr.querySelectorAll('td').length;
    var detailTr = document.createElement('tr');
    detailTr.className = 'detail-row';
    detailTr.innerHTML = '<td colspan="' + colSpan + '">' + html + '</td>';
    tr.classList.add('active-row');
    tr.parentNode.insertBefore(detailTr, tr.nextSibling);
  });
}
