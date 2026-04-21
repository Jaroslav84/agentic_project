/* debt-detail.js — detail panel builder + row expansion for cc_debt.html */

function buildDebtDetail(d) {
  var inv = d.invoice, con = d.contact, hist = d.history, nxt = d.next;
  var html = '<div class="detail-panel">';

  // INVOICE INFO
  html += '<div class="dp-col">';
  html += '<div class="dp-head inv">Invoice Details</div>';
  html += '<div class="dp-row"><span class="k">Scope</span><span class="v hi">' + inv.scope + '</span></div>';
  html += '<div class="dp-row"><span class="k">Total Invoiced</span><span class="v hi">' + inv.invoiced + '</span></div>';
  html += '<div class="dp-row"><span class="k">Invoice Date</span><span class="v">' + inv.invoiceDate + '</span></div>';
  html += '<div class="dp-row"><span class="k">Due Date</span><span class="v">' + inv.dueDate + '</span></div>';
  html += '<div class="dp-row"><span class="k">Overdue</span><span class="v R">' + inv.overdue + '</span></div>';
  html += '<div class="dp-row"><span class="k">Late Fee</span><span class="v Y">' + inv.lateFee + '</span></div>';
  html += '<div class="dp-row"><span class="k">Mobilization</span><span class="v">' + inv.mobilization + '</span></div>';
  html += '<div class="dp-row"><span class="k">Remaining</span><span class="v R">' + inv.remaining + '</span></div>';
  html += '<div class="dp-inv-footer"><div class="dp-row"><span class="k">Orig. Rep</span><span class="v">' + inv.rep + '</span></div>';
  html += '<div class="dp-row"><span class="k">Brand</span><span class="v">' + inv.brand + '</span></div></div>';
  html += '</div>';

  // CONTACT + NOTES
  html += '<div class="dp-col">';
  html += '<div class="dp-head contact">Contact</div>';
  html += '<div class="dp-row"><span class="k">Name</span><span class="v hi">' + con.name + '</span></div>';
  html += '<div class="dp-row"><span class="k">Role</span><span class="v">' + con.role + '</span></div>';
  html += '<div class="dp-row"><span class="k">Phone</span><span class="v purple">' + con.phone + '</span></div>';
  html += '<div class="dp-row"><span class="k">Email</span><span class="v">' + con.email + '</span></div>';
  html += '<div class="dp-row"><span class="k">Client</span><span class="v">' + con.client + '</span></div>';
  html += '<div class="dp-contact-notes"><div class="dp-row"><span class="k">Notes</span></div>';
  html += '<div class="dp-text">' + con.notes + '</div></div>';

  // COLLECTION HISTORY
  html += '<div class="dp-history-section"><div class="dp-head hist">Collection History</div></div>';
  if (hist.length === 0) {
    html += '<div class="dp-text dp-no-history">No collection contacts yet — first outreach</div>';
  } else {
    html += '<div class="dp-timeline">';
    hist.forEach(function (e) {
      html += '<div class="dp-timeline .evt ' + e.type + '">';
      html += '<span class="edate">' + e.date + '</span>';
      html += '<span class="etype">' + e.text + '</span>';
      html += '</div>';
    });
    html += '</div>';
  }
  html += '</div>';

  // NEXT ACTION
  html += '<div class="dp-col wide">';
  html += '<div class="dp-head next">Next Action</div>';
  html += '<div class="dp-next-action"><div class="label">What Sales will do</div>' + nxt.action + '</div>';
  html += '<div class="dp-script-section"><div class="dp-row"><span class="k">Script</span></div>';
  html += '<div class="dp-opening">' + nxt.script + '</div></div>';
  html += '<div class="dp-esc-section"><div class="dp-row"><span class="k">Escalation</span></div>';
  html += '<div class="dp-text">' + nxt.escalation + '</div></div>';
  html += '</div>';

  html += '</div>';
  return html;
}

// Attach row expansion using shared logic
attachRowExpand({
  skipTags: ['BUTTON'],
  getPropID: function (tr) {
    var cells = tr.querySelectorAll('td');
    return cells[1] ? cells[1].textContent.trim() : null;
  },
  getDetail: function (propID) {
    var d = DEBT_DETAILS[propID];
    if (!d) return null;
    return buildDebtDetail(d);
  },
  colSpan: 11
});
