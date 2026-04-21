/* debt.js — C&C Debt page (merged) */

/* debt.js — data for cc_debt.html */

var DEBT_DETAILS = {
  '#10201': {
    invoice: {
      scope:'Concrete Remove & Replace — completed Nov 2025',
      invoiced:'$87,400', invoiceDate:'2025-12-03', dueDate:'2026-01-02',
      overdue:'127 days', lateFee:'$3,934 (accruing $43.70/day)',
      mobilization:'$26,220 paid at approval (30%)', remaining:'$61,180 outstanding',
      rep:'Sarah Mitchell', brand:'Trip Hazard LLC'
    },
    contact: {
      name:'Jon Araiza', role:'Property Manager', phone:'(555) 489-4554',
      email:'oakandironmgr@bluepine.example', client:'BluePine',
      notes:'Manages Oak and Iron — 130 units, Walnut Creek. BluePine corporate may need to approve large payments. Has been responsive in past but slow on AP.'
    },
    history: [
      {date:'Apr 3', type:'call', text:'Sales called — Jon said "I\'ll send it to AP this week." No payment received.'},
      {date:'Mar 20', type:'sms', text:'SMS reminder sent — read receipt confirmed.'},
      {date:'Mar 10', type:'call', text:'Sales called — voicemail left. No callback.'},
      {date:'Feb 15', type:'sms', text:'1st overdue notice sent via SMS.'}
    ],
    next: {
      action:'CALL — 3rd collection attempt',
      script:'"Hi Jon, this is Sales from Pinnacle Services. I\'m following up on invoice #10201 for Oak and Iron — $61,180 outstanding, now 127 days past due. You mentioned sending this to AP three weeks ago — can you confirm that went through?"',
      escalation:'If no payment by Apr 17 → escalate to Morgan for direct BluePine corporate contact.'
    }
  },
  '#9876': {
    invoice: {
      scope:'Concrete Trip Hazard Grinding — completed Nov 2025',
      invoiced:'$62,100', invoiceDate:'2025-12-18', dueDate:'2026-01-17',
      overdue:'112 days', lateFee:'$1,552 (accruing $31.05/day)',
      mobilization:'$18,630 paid at approval (30%)', remaining:'$43,470 outstanding',
      rep:'Rachel Winters (departed)', brand:'Trip Hazard LLC'
    },
    contact: {
      name:'Anya Belton', role:'Property Manager', phone:'(555) 564-5977',
      email:'anya.belton@summitmgmt.example', client:'Summit Mgmt',
      notes:'Summit Mgmt corporate — large portfolio. Anya manages Sommerset Place in Sacramento. Summit Mgmt typically processes payments through central AP with 45-60 day cycles.'
    },
    history: [],
    next: {
      action:'CALL — 1st collection contact',
      script:'"Hi Anya, this is Sales from Pinnacle Services. I\'m calling about invoice #9876 for the concrete work at Sommerset Place — $43,470 remaining, invoiced back in December. I want to make sure this is in your AP system. Can you check on the status?"',
      escalation:'Standard first contact — firm but professional. If AP delay cited, request specific timeline.'
    }
  },
  '#10045': {
    invoice: {
      scope:'Concrete R&R + Grinding — completed Dec 2025',
      invoiced:'$47,200', invoiceDate:'2026-01-15', dueDate:'2026-02-14',
      overdue:'84 days', lateFee:'$708 (accruing $23.60/day)',
      mobilization:'$14,160 paid at approval (30%)', remaining:'$33,040 outstanding',
      rep:'Marco Diaz', brand:'Trip Hazard LLC'
    },
    contact: {
      name:'Russ Clark', role:'Property Manager', phone:'(555) 266-6065',
      email:'rclark@edenhousing.org', client:'EAH Housing',
      notes:'EAH Housing — affordable/HUD-funded. Russ promised payment by Apr 15 on last call. HUD-funded properties sometimes have longer AP cycles due to grant accounting.'
    },
    history: [
      {date:'Mar 28', type:'call', text:'Sales called — Russ said "Check is being processed, should arrive by April 15." Promised date set.'},
      {date:'Mar 15', type:'sms', text:'SMS reminder sent.'},
      {date:'Mar 5', type:'call', text:'Sales called — Russ aware of balance, said he\'d check with accounting.'}
    ],
    next: {
      action:'WAIT — Payment promised by Apr 15',
      script:'If no payment by Apr 16: "Hi Russ, this is Sales from Pinnacle Services. I\'m checking in on invoice #10045 for Maple Orchards — you mentioned the check would arrive by the 15th. Has that gone out?"',
      escalation:'If promise broken twice → escalate to Alex for EAH corporate contact.'
    }
  },
  '#10312': {
    invoice: {
      scope:'Concrete Trip Hazard Grinding — completed Jan 2026',
      invoiced:'$38,500', invoiceDate:'2026-02-01', dueDate:'2026-03-03',
      overdue:'68 days', lateFee:'$577 (accruing $19.25/day)',
      mobilization:'$11,550 paid at approval (30%)', remaining:'$26,950 outstanding',
      rep:'Andrea Black (departed)', brand:'Trip Hazard LLC'
    },
    contact: {
      name:'Courtney Mack', role:'HOA Property Manager', phone:'(555) 463-3432',
      email:'courtneym@silvercreekmgmt.com', client:'Silvercreek Horizon HOAtion Mgmt',
      notes:'HOA — payment requires board approval for amounts over $25k. Courtney is cooperative but hands are tied until board meets. Next board meeting TBD.'
    },
    history: [
      {date:'Apr 1', type:'call', text:'Sales called — Courtney said board needs to approve payment over $25k. Next meeting not yet scheduled.'},
      {date:'Mar 18', type:'sms', text:'SMS reminder sent — Courtney replied "Working on it."'}
    ],
    next: {
      action:'CALL — Follow up on board meeting date',
      script:'"Hi Courtney, this is Sales from Pinnacle Services. Following up on invoice #10312 for The Willows — $26,950 outstanding. I know the board needs to approve this. Has a meeting date been set? I want to make sure this is on the agenda."',
      escalation:'If no board date after 2 more weeks → escalate to Alex.'
    }
  },
  '#10198': {
    invoice: {
      scope:'Deck Waterproofing — completed Jan 2026',
      invoiced:'$24,300', invoiceDate:'2026-02-10', dueDate:'2026-03-12',
      overdue:'59 days', lateFee:'Not yet applied (grace period)',
      mobilization:'$7,290 paid at approval (30%)', remaining:'$17,010 outstanding',
      rep:'Ray Collins', brand:'Trip Hazard LLC'
    },
    contact: {
      name:'Brian Smith', role:'Community Director', phone:'(555) 786-4374',
      email:'bsmith@dataverse.example', client:'DataVerse',
      notes:'Brian manages Midtown HOA in Hayward. DataVerse is a mid-size HOA management company. First overdue notice — no collection contact yet.'
    },
    history: [],
    next: {
      action:'CALL — 1st collection contact',
      script:'"Hi Brian, this is Sales from Pinnacle Services. I\'m calling about invoice #10198 for the deck waterproofing at Midtown — $17,010 remaining, due back in March. Just want to make sure this is in your payment queue."',
      escalation:'Standard first contact — professional tone, no pressure. Confirm they received the invoice.'
    }
  },
  '#9934': {
    invoice: {
      scope:'Concrete Specific Spot Repairs — completed Dec 2025',
      invoiced:'$14,800', invoiceDate:'2026-01-22', dueDate:'2026-02-21',
      overdue:'78 days', lateFee:'Suspended — dispute pending',
      mobilization:'$4,440 paid at approval (30%)', remaining:'$10,360 outstanding',
      rep:'Ray Collins', brand:'Trip Hazard LLC'
    },
    contact: {
      name:'Tammy Ellis', role:'Property Manager', phone:'(555) 818-1169',
      email:'crossingsmgr@newearthres.com', client:'New Earth Residential',
      notes:'DISPUTED — Tammy claims 2 areas were not completed to spec. Crew foreman says work was done per scope. Photos requested from field team. Morgan to review.'
    },
    history: [
      {date:'Mar 25', type:'esc', text:'Escalated to Morgan — Tammy claims incomplete work on 2 areas.'},
      {date:'Mar 20', type:'call', text:'Sales called — Tammy said "Two sections don\'t look right, I\'m not paying until someone comes back out."'},
      {date:'Mar 10', type:'sms', text:'1st overdue notice. Tammy replied: "I have concerns about the work quality."'}
    ],
    next: {
      action:'HOLD — Escalated to Morgan',
      script:'No further Sales contact until Morgan resolves dispute. Morgan reviewing crew photos and scope vs. completion.',
      escalation:'Active escalation — Morgan handling directly.'
    }
  },
  '#10410': {
    invoice: {
      scope:'Asphalt Patching & Seal Coat — completed Feb 2026',
      invoiced:'$10,330', invoiceDate:'2026-02-28', dueDate:'2026-03-30',
      overdue:'41 days', lateFee:'$41 (accruing $5.17/day)',
      mobilization:'$3,099 paid at approval (30%)', remaining:'$7,231 outstanding',
      rep:'Mike Larson\' (departed)', brand:'Alpha Street Asphalt LLC'
    },
    contact: {
      name:'Tasha Williams', role:'Property Manager', phone:'(555) 723-2803',
      email:'twilliams@harborassoc.com', client:'Harbor Horizon HOAtes',
      notes:'First overdue notice sent. Tasha not yet contacted by phone. Harbor Horizon HOAtes is a small firm — usually pays on time. Likely just fell through the cracks.'
    },
    history: [
      {date:'Apr 5', type:'sms', text:'1st overdue notice sent via SMS. No response yet.'}
    ],
    next: {
      action:'CALL — 1st collection contact',
      script:'"Hi Tasha, this is Sales from Pinnacle Services. I\'m following up on invoice #10410 for the asphalt work at Seabreeze II — $7,231 remaining, just a bit past due. Wanted to make sure you received the invoice and check if there\'s anything holding it up."',
      escalation:'Light touch — likely just needs a reminder. Escalate only if no response after 2 attempts.'
    }
  }
};

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
