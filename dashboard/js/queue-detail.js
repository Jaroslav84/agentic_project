/* queue-detail.js — detail panel builder + row expansion for cc_queue.html */

function buildDetail(d) {
  var b = d.brief, p = d.proposal, n = d.next, r = d.rating;
  var engPct = Math.min(r.engagement / 5 * 100, 100);
  var scorePct = Math.min(r.contactScore / 5 * 100, 100);

  var html = '<div class="detail-panel">';

  // BRIEFING
  html += '<div class="dp-col wide">';
  html += '<div class="dp-head brief">Pre-Call Briefing</div>';
  html += '<div class="dp-text">' + b.situation + '</div>';
  html += '<div class="dp-briefing-section"><div class="dp-row"><span class="k">Last Contact</span></div>';
  html += '<div class="dp-text dp-text-tight">' + b.lastInteraction + '</div></div>';
  html += '<div class="dp-briefing-section"><div class="dp-row"><span class="k">Signals</span></div>';
  html += '<div class="dp-signals-wrap">' + signals(b.signals) + '</div></div>';
  html += '<div class="dp-briefing-section"><div class="dp-row"><span class="k">Blockers</span></div>';
  html += '<div class="dp-text dp-text-tight">' + b.blockers + '</div></div>';
  html += '<div class="dp-opening">' + b.opening + '</div>';
  html += '</div>';

  // PROPOSAL INFO
  html += '<div class="dp-col">';
  html += '<div class="dp-head prop">Proposal Info</div>';
  html += '<div class="dp-row"><span class="k">Scope</span><span class="v hi">' + p.scope + '</span></div>';
  html += '<div class="dp-row"><span class="k">Brand</span><span class="v">' + p.brand + '</span></div>';
  html += '<div class="dp-row"><span class="k">Value</span><span class="v hi">' + p.value + '</span></div>';
  html += '<div class="dp-row"><span class="k">Sent</span><span class="v">' + p.sent + ' (' + p.daysSent + ')</span></div>';
  html += '<div class="dp-row"><span class="k">Orig. Rep</span><span class="v">' + p.rep + '</span></div>';
  html += '<div class="dp-row"><span class="k">Emails</span><span class="v">' + p.emailsSent + ' sent &middot; ' + p.emailsOpened + ' opened</span></div>';
  html += '<div class="dp-row"><span class="k">Other Props</span><span class="v">' + p.otherProps + '</span></div>';
  html += '<div class="dp-hs-link"><div class="dp-row"><span class="k">HubSpot</span><span class="v"><a href="#" class="dp-hs-anchor">Deal ' + p.hsLink + ' &rarr;</a></span></div></div>';
  html += '</div>';

  // NEXT ACTION + RATING
  html += '<div class="dp-col">';
  html += '<div class="dp-head next">Next Action</div>';
  html += '<div class="dp-next-action">';
  html += '<div class="label">What Sales will do</div>';
  html += n.action;
  html += '</div>';
  html += '<div class="dp-action-rows">';
  html += '<div class="dp-row"><span class="k">Timing</span><span class="v">' + n.timing + '</span></div>';
  html += '<div class="dp-row"><span class="k">Script</span><span class="v purple">' + n.script + '</span></div>';
  html += '<div class="dp-row"><span class="k">Step</span><span class="v">' + n.step + '</span></div>';
  html += '<div class="dp-row"><span class="k">Voicemail</span><span class="v">' + n.voicemail + '</span></div>';
  html += '</div>';

  html += '<div class="dp-rating-section"><div class="dp-head rating">Customer Rating</div></div>';
  html += '<div class="dp-row"><span class="k">Overall</span><span class="v"><div class="dp-stars">' + stars(r.stars) + '</div></span></div>';
  html += '<div class="dp-row"><span class="k">Engagement</span><span class="v">' + r.engagement + ' / 5</span></div>';
  html += meter(engPct, engPct > 60 ? 'var(--G)' : engPct > 30 ? 'var(--Y)' : 'var(--R)');
  html += '<div class="dp-row"><span class="k">Contact Score</span><span class="v hi">' + r.contactScore.toFixed(2) + '</span></div>';
  html += meter(scorePct, scorePct > 60 ? 'var(--G)' : scorePct > 30 ? 'var(--Y)' : 'var(--R)');
  html += '<div class="dp-row"><span class="k">Confidence</span><span class="v ' + confColor(r.confidence) + '">' + r.confidence + '</span></div>';

  // Transcript
  html += '<div class="dp-transcript-section"><div class="dp-head transcript">Previous Calls</div></div>';
  if (!d.transcript) {
    html += '<div class="dp-transcript"><span class="no-calls">No previous calls — first Sales outreach</span></div>';
  }
  html += '</div>';

  html += '</div>';
  return html;
}

// Attach row expansion using shared logic
attachRowExpand({
  skipTags: ['INPUT', 'BUTTON'],
  getPropID: function (tr) {
    var cell = tr.querySelector('td.mono');
    return cell ? cell.textContent.trim() : null;
  },
  getDetail: function (propID, tr) {
    var d = DETAILS[propID] || DEFAULT_DETAIL;
    // Patch default value from row if no mock data
    if (!DETAILS[propID]) {
      var cells = tr.querySelectorAll('td');
      if (cells[5]) d.proposal.value = cells[5].textContent.trim();
    }
    return buildDetail(d);
  }
});
