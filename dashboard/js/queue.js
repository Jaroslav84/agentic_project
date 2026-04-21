/* queue.js — C&C Queue page (merged) */

/* queue.js — data + helpers for cc_queue.html */
// Mock detail data per propID
var DETAILS = {
  '#9399': {
    brief: {
      situation: 'HighRise Mgmt proposal for Hazel Ranch asphalt overlay — <em>$345k, 322 days stale</em>. Sent by Rachel Winters before departure. No follow-up from anyone since. Dennis Loor is the Construction Manager for HighRise Mgmt, manages multiple NorCal properties.',
      lastInteraction: 'Proposal email sent Sep 2025 via FieldTECH. No reply. No email opens detected.',
      signals: [{t:'neu',l:'NO REPLY'},{t:'neg',l:'322d STALE'},{t:'pos',l:'DECISION MAKER'}],
      blockers: 'None identified — cold outreach, no prior objections on record.',
      opening: '"Hi Dennis, this is Sales from Pinnacle Services — I\'m following up on proposal #9399 for the asphalt overlay at Hazel Ranch. I want to make sure that got to the right person."'
    },
    proposal: {
      scope: 'Asphalt Drive Path Overlay 2025',
      brand: 'Alpha Street Asphalt (modeID=2)',
      value: '$345,503',
      sent: '2025-05-22',
      daysSent: '322d',
      rep: 'Rachel Winters (departed)',
      emailsSent: 1, emailsOpened: 0,
      hsLink: '37531636827',
      otherProps: 'None at this location'
    },
    next: {
      action: 'CALL ×3 — Day 7 first outreach',
      timing: '10:30 AM / 1:00 PM / 3:30 PM PT',
      script: 'T2-C — 90+ days stale, email sent, no reply',
      step: 'Sequence Step 1 of 8',
      voicemail: 'Yes — 3rd attempt if no answer'
    },
    rating: { engagement: 0, contactScore: 2.63, confidence: 'Medium', stars: 2 },
    transcript: null
  },
  '#7856': {
    brief: {
      situation: 'Summit Mgmt Management / Sunrise Commons — <em>$127k concrete, 487 days stale</em>. Michelle Forkas replied in Aug 2024 saying she was working on 2025 budget approval. No follow-up since. Now 2026 — budget cycle has reset.',
      lastInteraction: 'Michelle replied Aug 2024: "Working on getting this into the 2025 budget — will let you know once I have approval."',
      signals: [{t:'pos',l:'CLIENT REPLIED'},{t:'pos',l:'BUDGET AWARE'},{t:'neg',l:'487d STALE'},{t:'neu',l:'BUDGET CYCLE RESET'}],
      blockers: 'Budget approval was pending. 2025 cycle passed without action. Need to reframe for 2026.',
      opening: '"Hi Michelle, this is Sales from Pinnacle Services — I know you were working on getting proposal #7856 into the 2025 budget. I wanted to check in now that we\'re in 2026 — where does that stand?"'
    },
    proposal: {
      scope: 'Concrete Trip Hazard Repairs & Remove/Replace',
      brand: 'Trip Hazard LLC (modeID=1)',
      value: '$127,400',
      sent: '2024-12-07',
      daysSent: '487d',
      rep: 'Rachel Winters (departed)',
      emailsSent: 3, emailsOpened: 2,
      hsLink: '28349127651',
      otherProps: '2 other stale proposals at Summit Mgmt properties ($89k total)'
    },
    next: {
      action: 'CALL ×3 — Day 7 first outreach',
      timing: '10:30 AM / 1:00 PM / 3:30 PM PT',
      script: 'T1-C — Client replied, budget next cycle',
      step: 'Sequence Step 1 of 8',
      voicemail: 'Yes — 3rd attempt if no answer'
    },
    rating: { engagement: 3, contactScore: 4.12, confidence: 'High', stars: 4 },
    transcript: null
  },
  '#8201': {
    brief: {
      situation: 'Windward Companies — <em>3 proposals across Loma Linda Commons, 3939 Marlton, Poplar Street ($94k combined)</em>. Rick Daniel is VP Operations. No email history found — cold outreach. Multi-proposal call.',
      lastInteraction: 'No prior interaction on record. Proposals sent by Larson who did zero follow-up.',
      signals: [{t:'neg',l:'NO HISTORY'},{t:'pos',l:'VP — DECISION MAKER'},{t:'pos',l:'MULTI-PROP ×3'}],
      blockers: 'No contact history. Unknown disposition.',
      opening: '"Hi Rick, this is Sales from Pinnacle Services. I\'m actually following up on a few proposals we have with Windward Companies. We have three outstanding: Loma Linda Commons, 3939 Marlton, and Poplar Street. Would it make sense to run through all three quickly while I have you?"'
    },
    proposal: {
      scope: 'Multi-prop: Concrete R&R + Grinding + Asphalt Patch',
      brand: 'Trip Hazard LLC / Alpha Street (mixed)',
      value: '$94,200 (combined)',
      sent: '2025-11-05',
      daysSent: '156d',
      rep: 'Mike Larson (departed)',
      emailsSent: 1, emailsOpened: 0,
      hsLink: '31847291034',
      otherProps: '3 proposals grouped — single call'
    },
    next: {
      action: 'CALL ×3 — Day 7, Multi-Proposal Flow',
      timing: '10:30 AM / 1:00 PM / 3:30 PM PT',
      script: 'T2-B — 30-90 days stale, no reply',
      step: 'Sequence Step 1 of 8',
      voicemail: 'Yes — 3rd attempt if no answer'
    },
    rating: { engagement: 0, contactScore: 1.90, confidence: 'Low', stars: 1 },
    transcript: null
  },
  '#5981': {
    brief: {
      situation: 'Waldman Group / Highland Oaks — <em>$78.5k, only 14 days stale</em>. Sally Brown replied same day proposal was sent: "This is great, let me review with the team." Essentially pre-approved. Fresh and warm.',
      lastInteraction: 'Sally replied Mar 27, 2026: "This is great — I\'ll review with the team and get back to you this week."',
      signals: [{t:'pos',l:'REPLIED SAME DAY'},{t:'pos',l:'POSITIVE TONE'},{t:'pos',l:'14d FRESH'}],
      blockers: 'None — needs light nudge to finalize.',
      opening: '"Hi Sally, this is Sales from Pinnacle Services — I saw your note about proposal #5981 for Highland Oaks. Just wanted to check if you had a chance to review it with the team."'
    },
    proposal: {
      scope: 'Concrete Trip Hazard Grinding & Remove/Replace',
      brand: 'Trip Hazard LLC (modeID=1)',
      value: '$78,500',
      sent: '2026-03-27',
      daysSent: '14d',
      rep: 'Rachel Winters (departed)',
      emailsSent: 1, emailsOpened: 1,
      hsLink: '58885072508',
      otherProps: 'None'
    },
    next: {
      action: 'CALL ×3 — Day 7 first outreach',
      timing: '10:30 AM / 1:00 PM / 3:30 PM PT',
      script: 'T2-A — 7-30 days stale, fresh proposal',
      step: 'Sequence Step 1 of 8',
      voicemail: 'Yes — 3rd attempt if no answer'
    },
    rating: { engagement: 5, contactScore: 4.86, confidence: 'Very High', stars: 5 },
    transcript: null
  },
  '#6823': {
    brief: {
      situation: 'Arroyo Park HOA retaining wall — <em>$51.2k, 48 days stale</em>. Brandon Lee replied March 23 saying HOA board needed to vote on it. No update since. Board likely met by now.',
      lastInteraction: 'Brandon replied Mar 23, 2026: "The board needs to approve this — our next meeting is in April. I\'ll bring it up then."',
      signals: [{t:'pos',l:'HOA BOARD PENDING'},{t:'pos',l:'ACTIVELY ENGAGED'},{t:'neu',l:'WAITING ON BOARD'}],
      blockers: 'HOA board approval required. Meeting should have occurred by now.',
      opening: '"Hi Brandon, this is Sales from Pinnacle Services — last I saw the Arroyo Park retaining wall was waiting on the HOA board. Has there been any movement on their end?"'
    },
    proposal: {
      scope: 'Retaining Wall Remove & Replace',
      brand: 'Trip Hazard LLC (modeID=1)',
      value: '$51,200',
      sent: '2026-02-21',
      daysSent: '48d',
      rep: 'Rachel Winters (departed)',
      emailsSent: 2, emailsOpened: 2,
      hsLink: '44729183562',
      otherProps: 'None'
    },
    next: {
      action: 'CALL ×3 — Day 7 first outreach',
      timing: '10:30 AM / 1:00 PM / 3:30 PM PT',
      script: 'T1-A — HOA board pending approval',
      step: 'Sequence Step 1 of 8',
      voicemail: 'Yes — 3rd attempt if no answer'
    },
    rating: { engagement: 4, contactScore: 3.80, confidence: 'High', stars: 4 },
    transcript: null
  }
};

// Default detail for rows without mock data
var DEFAULT_DETAIL = {
  brief: {
    situation: 'Standard follow-up — proposal sent, no client interaction on record. First Sales outreach.',
    lastInteraction: 'Proposal email sent via FieldTECH. No reply detected.',
    signals: [{t:'neu',l:'NO HISTORY'}],
    blockers: 'None identified.',
    opening: '"Hi [NAME], this is Sales from Pinnacle Services — I\'m following up on your proposal for [PROPERTY]."'
  },
  proposal: {
    scope: 'See proposal details',
    brand: 'Trip Hazard LLC',
    value: '—', sent: '—', daysSent: '—',
    rep: '—', emailsSent: 0, emailsOpened: 0,
    hsLink: '—', otherProps: 'None'
  },
  next: {
    action: 'CALL ×3 — Day 7 first outreach',
    timing: '10:30 AM / 1:00 PM / 3:30 PM PT',
    script: 'Per decision tree',
    step: 'Sequence Step 1 of 8',
    voicemail: 'Yes — 3rd attempt if no answer'
  },
  rating: { engagement: 0, contactScore: 1.0, confidence: 'Low', stars: 1 },
  transcript: null
};

// ── Helpers ──

function stars(n) {
  var h = '';
  for (var i = 1; i <= 5; i++) h += '<span class="star ' + (i <= n ? 'on' : 'off') + '">&#9733;</span>';
  return h;
}

function signals(arr) {
  return arr.map(function (s) {
    return '<span class="dp-signal ' + s.t + '">' + s.l + '</span>';
  }).join('');
}

function meter(pct, color) {
  return '<div class="dp-meter"><div class="fill" style="width:' + pct + '%;background:' + color + '"></div></div>';
}

function confColor(c) {
  if (c === 'Very High' || c === 'High') return 'good';
  if (c === 'Medium') return 'warn';
  return 'bad';
}
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
