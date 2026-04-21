/* sequence.js — Sequence Diagram graph (merged) */

/* sequence-data.js — data for 44-Day Outreach Sequence diagram */

// SVG icon paths (20x20 viewBox, stroke-based)
var ICONS = {
  call:  icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M13,3h4v4 M17,3 L13.5,6.5'),
  sms:   icon('M3,3h14v10H9l-4,4v-4H3V3z M7,8h6 M7,11h4'),
  email: icon('M2,4h16v12H2V4z M2,4 L10,12 L18,4 M2,16 L7,10 M18,16 L13,10'),
  stop:  icon('M10,2 a8,8 0 1,0 .01,0Z M6,6 L14,14 M14,6 L6,14')
};

// Sequence nodes
var NODES = [
  {id:'d7',   day:7,  label:'DAY 7 \u2014 CALL',    channel:'CALL',  sub:'Call \u00d73 attempts\n10:30 / 1:00 / 3:30 PM PT', c:'#ff4040', icon:'call'},
  {id:'d8',   day:8,  label:'DAY 8 \u2014 SMS',     channel:'SMS',   sub:'Day-after-voicemail\nfollow-up SMS',               c:'#d36eff', icon:'sms'},
  {id:'d10',  day:10, label:'DAY 10 \u2014 CALL',   channel:'CALL',  sub:'Call \u00d73 attempts\nSame timing \u00b7 No VM',   c:'#ff4040', icon:'call'},
  {id:'d14',  day:14, label:'DAY 14 \u2014 EMAIL',  channel:'EMAIL', sub:'Via Postmark\nSCRIPTS_EMAIL.md',                     c:'#e95400', icon:'email'},
  {id:'d18',  day:18, label:'DAY 18 \u2014 SMS',    channel:'SMS',   sub:'Mid-sequence\ncheck-in SMS',                        c:'#d36eff', icon:'sms'},
  {id:'d21',  day:21, label:'DAY 21 \u2014 CALL',   channel:'CALL',  sub:'Call \u00d73 attempts\nVM if zero engagement',      c:'#ff4040', icon:'call'},
  {id:'d30',  day:30, label:'DAY 30 \u2014 SMS',    channel:'SMS',   sub:'Late-sequence\nreminder SMS',                       c:'#d36eff', icon:'sms'},
  {id:'d44',  day:44, label:'DAY 44 \u2014 EMAIL',  channel:'EMAIL', sub:'Final \u201clast note\u201d\nemail via Postmark',    c:'#e95400', icon:'email'},
  {id:'stop', day:99, label:'STOP',                  channel:'STOP',  sub:'Zero response after Day 44\nLeave in sent \u00b7 Never close automatically', c:'#585858', icon:'stop', terminal:true}
];

var EDGES = [
  {f:'d7',  t:'d8',   c:'#ff4040', lbl:'next day'},
  {f:'d8',  t:'d10',  c:'#d36eff', lbl:'+2 days'},
  {f:'d10', t:'d14',  c:'#ff4040', lbl:'+4 days'},
  {f:'d14', t:'d18',  c:'#e95400', lbl:'+4 days'},
  {f:'d18', t:'d21',  c:'#d36eff', lbl:'+3 days'},
  {f:'d21', t:'d30',  c:'#ff4040', lbl:'+9 days'},
  {f:'d30', t:'d44',  c:'#d36eff', lbl:'+14 days'},
  {f:'d44', t:'stop', c:'#585858', lbl:'terminal'}
];

// Tooltip detail data per node
var NODE_DETAILS = {
  d7:  { role:'Day 7 \u2014 First Contact \u00b7 Triple Call Attempt', status:'ARMED', sc:'#ff4040',
    m:[['Channel','Voice call \u00d73'],['Times','10:30 AM / 1:00 PM / 3:30 PM PT'],['Voicemail','On 3rd attempt if no answer'],['Window','Tue\u2013Fri only'],['Scripts','SCRIPTS_CALL.md \u00b7 Tier-selected'],['Note','First touch \u2014 highest conversion window']],
    note:'3 call attempts on Day 7. If all unanswered, leave voicemail on the 3rd attempt. Script tier selected based on email history, staleness, and override triggers.' },
  d8:  { role:'Day 8 \u2014 SMS Follow-up', status:'QUEUED', sc:'#d36eff',
    m:[['Channel','SMS via Telnyx'],['Trigger','Day after voicemail'],['Contains','Proposal URL (th_proposal_url_for_customers)'],['Script','SCRIPTS_SMS.md'],['Tone','Casual, reference yesterday\'s call attempt']],
    note:'Fires the day after Day 7 voicemail. References the voicemail and includes the client-facing proposal URL.' },
  d10: { role:'Day 10 \u2014 Second Call Attempt', status:'QUEUED', sc:'#ff4040',
    m:[['Channel','Voice call \u00d73'],['Times','10:30 AM / 1:00 PM / 3:30 PM PT'],['Voicemail','None \u2014 no VM on Day 10'],['Window','Tue\u2013Fri only'],['Scripts','SCRIPTS_CALL.md'],['Gap from last','2 days after SMS']],
    note:'Same triple-call timing as Day 7, but NO voicemail. Let the SMS from Day 8 do the work.' },
  d14: { role:'Day 14 \u2014 Email Outreach', status:'QUEUED', sc:'#e95400',
    m:[['Channel','Email via Postmark'],['Template','SCRIPTS_EMAIL.md'],['From','Sales @ Pinnacle Services'],['Contains','Proposal details + URL'],['Domain','pinnacleservices.demo'],['Gap from last','4 days after call']],
    note:'First email touch. Via Postmark from phil.s@pinnacleservices.demo. Different channel to catch email-preferred contacts.' },
  d18: { role:'Day 18 \u2014 Mid-Sequence SMS', status:'QUEUED', sc:'#d36eff',
    m:[['Channel','SMS via Telnyx'],['Purpose','Mid-sequence check-in'],['Contains','Proposal URL'],['Script','SCRIPTS_SMS.md'],['Tone','Light touch \u2014 \u201cstill available\u201d'],['Gap from last','4 days after email']],
    note:'Mid-sequence check-in. Light touch to keep the proposal top-of-mind without being pushy.' },
  d21: { role:'Day 21 \u2014 Third Call Attempt', status:'QUEUED', sc:'#ff4040',
    m:[['Channel','Voice call \u00d73'],['Times','10:30 AM / 1:00 PM / 3:30 PM PT'],['Voicemail','ONLY if client has NEVER engaged'],['Window','Tue\u2013Fri only'],['Scripts','SCRIPTS_CALL.md'],['Condition','Zero engagement = VM; any engagement = no VM']],
    note:'Final call round. Voicemail ONLY if the client has shown zero engagement across all prior touches. If they replied to SMS or opened email, no VM.' },
  d30: { role:'Day 30 \u2014 Late SMS Reminder', status:'QUEUED', sc:'#d36eff',
    m:[['Channel','SMS via Telnyx'],['Purpose','Late-sequence reminder'],['Contains','Proposal URL'],['Script','SCRIPTS_SMS.md'],['Tone','Gentle urgency \u2014 \u201cproposal still open\u201d'],['Gap from last','9 days after call']],
    note:'Late-sequence SMS. Longest gap in the sequence (9 days). Gentle nudge before the final email.' },
  d44: { role:'Day 44 \u2014 Final Email', status:'QUEUED', sc:'#e95400',
    m:[['Channel','Email via Postmark'],['Template','SCRIPTS_EMAIL.md \u2014 \u201clast note\u201d variant'],['Purpose','Sequence terminus'],['Tone','Professional close-out'],['Contains','Proposal details + URL'],['After this','STOP \u2014 no more touches']],
    note:'Final touch in the 44-day sequence. "Last note" email. If zero response after this, the contact group is permanently stopped. Proposal stays in sent status \u2014 never closed automatically.' },
  stop:{ role:'Sequence Terminated \u2014 Zero Response', status:'TERMINAL', sc:'#585858',
    m:[['Condition','Zero response across all 8 touches'],['Action','Stop permanently'],['Proposal status','Leave in sent \u2014 never close'],['Reason','Preserves re-engagement option'],['Override','Alex can manually re-enroll']],
    note:'After Day 44 with zero response, stop permanently. Leave proposal in sent status. Never mark dead or close automatically. Alex can manually re-enroll via Controller if needed.' }
};

var EDGE_DETAILS = {
  'd7__d8': {
    title:'DAY 7 \u2192 DAY 8', sub:'Call \u00d73 then SMS next day',
    m:[['Day 7','Call \u00d73: 10:30 / 1:00 / 3:30 PT'],['Voicemail','On 3rd no-answer (Day 7 only)'],['Day 8','SMS follow-up \u2014 day-after-voicemail'],['Gap','1 day'],['Recency guard','Skip if human rep emailed last 7 days']],
    note:'Day 7 is first outreach. Three call attempts same day. If all miss, voicemail on 3rd. SMS follows next day as backup channel.'
  },
  'd8__d10': {
    title:'DAY 8 \u2192 DAY 10', sub:'SMS sent, 2-day gap before next calls',
    m:[['Day 8','SMS follow-up sent'],['Gap','2 days'],['Day 10','Call \u00d73: 10:30 / 1:00 / 3:30 PT'],['Voicemail','No VM on Day 10 (one per cycle)'],['Window','Tue\u2013Fri only, 10:30\u20134:30 PT']],
    note:'Brief pause after SMS. Next attempt is another 3-call day. No voicemail on Day 10 \u2014 already left one on Day 7.'
  },
  'd10__d14': {
    title:'DAY 10 \u2192 DAY 14', sub:'Calls done, switch to email',
    m:[['Day 10','Call \u00d73, no voicemail'],['Gap','4 days'],['Day 14','Email via Postmark'],['Template','SCRIPTS_EMAIL.md Day 14'],['Includes','Proposal approval URL (th_proposal_url_for_customers)']],
    note:'Two call rounds done with no response. Switch channels to email. Proposal URL included for easy one-click approval.'
  },
  'd14__d18': {
    title:'DAY 14 \u2192 DAY 18', sub:'Email sent, 4-day gap to SMS',
    m:[['Day 14','Email sent'],['Gap','4 days'],['Day 18','SMS check-in nudge'],['Template','SCRIPTS_SMS.md Day 18'],['URL','th_proposal_url_for_customers in SMS']],
    note:'Email sent, wait 4 days. If no reply, SMS nudge. SMS always includes proposal approval URL.'
  },
  'd18__d21': {
    title:'DAY 18 \u2192 DAY 21', sub:'SMS sent, 3-day gap to final calls',
    m:[['Day 18','SMS nudge sent'],['Gap','3 days'],['Day 21','Call \u00d73: 10:30 / 1:00 / 3:30 PT'],['Voicemail','Only if client has NEVER engaged'],['Last call','Final call attempt in sequence']],
    note:'Last call attempt. Voicemail only if zero engagement across all prior touches. This is the final chance for live conversation.'
  },
  'd21__d30': {
    title:'DAY 21 \u2192 DAY 30', sub:'Final calls done, 9-day gap to SMS',
    m:[['Day 21','Final call attempt'],['Gap','9 days \u2014 longest gap in sequence'],['Day 30','SMS \u2014 last SMS touch'],['Template','SCRIPTS_SMS.md Day 30'],['Tone','Light check-in, no pressure']],
    note:'Longest gap in the sequence. Gives client breathing room. Day 30 SMS is the last text message touch.'
  },
  'd30__d44': {
    title:'DAY 30 \u2192 DAY 44', sub:'Last SMS, 14-day gap to final email',
    m:[['Day 30','Last SMS sent'],['Gap','14 days'],['Day 44','Email \u2014 "last note" template'],['Template','SCRIPTS_EMAIL.md Day 44'],['Tone','Final, respectful close']],
    note:'Two-week gap before the final touch. Day 44 email is a "last note" \u2014 gives client one final opportunity to respond.'
  },
  'd44__stop': {
    title:'DAY 44 \u2192 STOP', sub:'Sequence ends permanently',
    m:[['After Day 44','Stop permanently if zero response'],['Status','Leave proposal in sent \u2014 never close'],['Never','Auto-close, mark dead, or archive'],['Total touches','8 across 44 days (3 call days + 3 SMS + 2 email)']],
    note:'Terminal. After 44 days with zero engagement \u2014 sequence stops permanently. Proposal stays in sent status. Sales never auto-closes proposals.'
  }
};

// Node lookup map
var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });

// Actor lifelines
var ACTORS = [
  {id:'salesclaw', label:'SALESCLAW',     x:250,  c:'#9f00fa'},
  {id:'backend',  label:'PHIL BACKEND', x:550,  c:'#9f00fa'},
  {id:'telnyx',   label:'TELNYX',       x:850,  c:'#ee9612'},
  {id:'client',   label:'CLIENT',       x:1150, c:'#60be35'},
  {id:'rep',      label:'REP',          x:1400, c:'#60be35'},
  {id:'hubspot',  label:'HUBSPOT',      x:1650, c:'#e95400'}
];

// Day positions (for rendering and hover zones)
var DAYS = [
  {id:'d7',  label:'DAY 7',  channel:'CALL \u00d73',  y:160,  c:'#ff4040'},
  {id:'d8',  label:'DAY 8',  channel:'SMS',            y:360,  c:'#d36eff'},
  {id:'d10', label:'DAY 10', channel:'CALL \u00d73',   y:480,  c:'#ff4040'},
  {id:'d14', label:'DAY 14', channel:'EMAIL',           y:620,  c:'#e95400'},
  {id:'d18', label:'DAY 18', channel:'SMS',             y:740,  c:'#d36eff'},
  {id:'d21', label:'DAY 21', channel:'CALL \u00d73',   y:860,  c:'#ff4040'},
  {id:'d30', label:'DAY 30', channel:'SMS',             y:1000, c:'#d36eff'},
  {id:'d44', label:'DAY 44', channel:'EMAIL',           y:1120, c:'#e95400'}
];

// Rule cards (right sidebar)
var RULE_CARDS = [
  {title:'RECENCY GUARD',  desc:'If any human rep emailed < 7 days \u2192 skip', c:'#ee9612', y:180},
  {title:'CALL WINDOW',    desc:'Tue\u2013Fri \u00b7 10:30 AM\u20134:30 PM PT',       c:'#60be35', y:320},
  {title:'MONDAY SHIFT',   desc:'Monday/holiday touches shift to next eligible day',    c:'#e95400', y:460},
  {title:'VOICEMAIL LIMIT', desc:'VM on Day 7 (3rd) + Day 21 (if zero engagement)',     c:'#ff4040', y:600}
];

// Arrowhead colors used in the diagram
var ARROW_COLORS = ['#9f00fa','#ee9612','#ff4040','#d36eff','#e95400','#60be35','#585858'];

// Lifeline x-position aliases
var PX = 250, BX = 550, TX = 850, CX = 1150, RX = 1400, HX = 1650;

// STOP annotation y-position
var STOP_Y = 1260;

/* sequence-render.js — SVG rendering for the 44-Day Outreach Sequence diagram */

var svg = document.getElementById('edgeSvg');

// ── SVG Defs: arrowheads ──
var defs = svgEl('defs', {});

ARROW_COLORS.forEach(function(col) {
  // Solid arrowhead
  var m = svgEl('marker', {
    id:'arr-'+col.slice(1),
    markerUnits:'userSpaceOnUse', markerWidth:'10', markerHeight:'8',
    refX:'9', refY:'4', orient:'auto'
  });
  m.appendChild(svgEl('path', {d:'M0,0 L10,4 L0,8 Z', fill:col}));
  defs.appendChild(m);
  // Open arrowhead (for dashed/response arrows)
  var m2 = svgEl('marker', {
    id:'arr-open-'+col.slice(1),
    markerUnits:'userSpaceOnUse', markerWidth:'10', markerHeight:'8',
    refX:'9', refY:'4', orient:'auto'
  });
  m2.appendChild(svgEl('path', {d:'M0,0 L10,4 L0,8', fill:'none', stroke:col, 'stroke-width':'1.5'}));
  defs.appendChild(m2);
});

svg.insertBefore(defs, svg.firstChild);

// ── Drawing helpers ──
function drawArrow(fromX, toX, y, color, label, dashed, markerType) {
  var direction = toX > fromX ? 1 : -1;
  var lineEndX = toX - direction * 10;
  var attrs = {
    x1:fromX, y1:y, x2:lineEndX, y2:y,
    stroke:color, 'stroke-width':'1.5', 'stroke-opacity':'0.85',
    'marker-end':'url(#arr-'+(markerType==='open'?'open-':'')+color.slice(1)+')'
  };
  if (dashed) {
    attrs['stroke-dasharray'] = '6,4';
    attrs['stroke-opacity'] = '0.6';
  }
  var line = svgEl('line', attrs);
  line.setAttribute('pointer-events', 'none');
  svg.appendChild(line);
  if (label) {
    var midX = (fromX + toX) / 2;
    var bg = svgEl('text', {
      x:midX, y:y-7, fill:'#141414',
      'font-family':'JetBrains Mono, monospace', 'font-size':'9',
      'text-anchor':'middle', stroke:'#141414', 'stroke-width':'4', 'stroke-linejoin':'round'
    });
    bg.textContent = label;
    svg.appendChild(bg);
    var tx = svgEl('text', {
      x:midX, y:y-7, fill:color,
      'font-family':'JetBrains Mono, monospace', 'font-size':'9',
      'text-anchor':'middle', 'letter-spacing':'0.04em', opacity:'0.9'
    });
    tx.textContent = label;
    svg.appendChild(tx);
  }
  return line;
}

function drawActivation(x, yStart, yEnd, color) {
  svg.appendChild(svgEl('rect', {
    x:x-5, y:yStart, width:10, height:yEnd-yStart, rx:'2',
    fill:color+'20', stroke:color+'40', 'stroke-width':'1'
  }));
}

// ── Render actor lifelines ──
ACTORS.forEach(function(a) {
  svg.appendChild(svgEl('rect', {
    x:a.x-80, y:40, width:160, height:36, rx:'4',
    fill:a.c+'15', stroke:a.c+'50', 'stroke-width':'1'
  }));
  var t = svgEl('text', {x:a.x, y:63, fill:a.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'14',
    'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.06em'});
  t.textContent = a.label;
  svg.appendChild(t);
  svg.appendChild(svgEl('line', {
    x1:a.x, y1:80, x2:a.x, y2:1350,
    stroke:a.c+'25', 'stroke-width':'1', 'stroke-dasharray':'6,4'
  }));
});

// ── Day labels and separators ──
DAYS.forEach(function(d) {
  var label = svgEl('text', {
    x:50, y:d.y+5, fill:d.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'16',
    'font-weight':'700', 'letter-spacing':'0.04em'
  });
  label.textContent = d.label;
  svg.appendChild(label);
  var badge = svgEl('text', {
    x:50, y:d.y+20, fill:d.c+'80',
    'font-family':'JetBrains Mono, monospace', 'font-size':'11', 'letter-spacing':'0.12em'
  });
  badge.textContent = d.channel;
  svg.appendChild(badge);
  svg.appendChild(svgEl('line', {
    x1:120, y1:d.y-25, x2:1800, y2:d.y-25,
    stroke:'#ffffff08', 'stroke-width':'1', 'stroke-dasharray':'4,8'
  }));
});

// ── STOP label ──
svg.appendChild(svgEl('line', {
  x1:120, y1:STOP_Y-25, x2:1800, y2:STOP_Y-25,
  stroke:'#ffffff08', 'stroke-width':'1', 'stroke-dasharray':'4,8'
}));
var stopLabel = svgEl('text', {
  x:50, y:STOP_Y+5, fill:'#585858',
  'font-family':'Barlow Condensed, sans-serif', 'font-size':'16',
  'font-weight':'700', 'letter-spacing':'0.04em'
});
stopLabel.textContent = 'STOP';
svg.appendChild(stopLabel);
var stopBadge = svgEl('text', {
  x:50, y:STOP_Y+20, fill:'#58585880',
  'font-family':'JetBrains Mono, monospace', 'font-size':'11', 'letter-spacing':'0.12em'
});
stopBadge.textContent = 'TERMINAL';
svg.appendChild(stopBadge);

// Message arrows, stop annotation, and rule cards rendered below

/* sequence-arrows.js — message arrows, stop annotation, rule cards */

// ── DAY 7: CALL x3 ──
var d7y = 160;
drawActivation(PX, d7y-10, d7y+20, '#9f00fa');
drawActivation(BX, d7y+10, d7y+100, '#9f00fa');
drawActivation(TX, d7y+30, d7y+120, '#ee9612');
drawArrow(PX, BX, d7y, '#9f00fa', 'trigger_call_batch', false);
drawArrow(BX, TX, d7y+30, '#ee9612', 'dial \u00d73 (10:30/1:00/3:30)', false);
drawArrow(TX, CX, d7y+55, '#ff4040', 'ring', false);
drawArrow(CX, TX, d7y+80, '#ff4040', 'no answer \u00d72', true, 'open');
drawArrow(TX, CX, d7y+105, '#ff4040', 'ring + VM on 3rd', false);

// ── [opt] WARM TRANSFER (Day 7 -- client answers) ──
var optY = 290;
svg.appendChild(svgEl('rect', {
  x:200, y:optY, width:1300, height:50, rx:'0',
  fill:'none', stroke:'#60be35', 'stroke-width':'1', 'stroke-dasharray':'6,4', 'stroke-opacity':'0.5'
}));
var optLabel = svgEl('text', {
  x:210, y:optY+12, fill:'#60be35',
  'font-family':'JetBrains Mono, monospace', 'font-size':'9',
  'letter-spacing':'0.06em', opacity:'0.8'
});
optLabel.textContent = '[opt] client answers';
svg.appendChild(optLabel);
drawActivation(RX, optY+18, optY+42, '#60be35');
drawArrow(TX, RX, optY+30, '#60be35', 'warm transfer', false);

// ── DAY 8: SMS ──
var d8y = 360;
drawActivation(BX, d8y-10, d8y+20, '#9f00fa');
drawActivation(TX, d8y+10, d8y+50, '#ee9612');
drawArrow(BX, TX, d8y, '#d36eff', 'send_sms', false);
drawArrow(TX, CX, d8y+30, '#d36eff', 'SMS: follow-up', false);

// ── DAY 10: CALL x3 ──
var d10y = 480;
drawActivation(PX, d10y-10, d10y+20, '#9f00fa');
drawActivation(BX, d10y+10, d10y+50, '#9f00fa');
drawActivation(TX, d10y+30, d10y+75, '#ee9612');
drawArrow(PX, BX, d10y, '#9f00fa', 'trigger_calls', false);
drawArrow(BX, TX, d10y+20, '#ee9612', 'dial \u00d73', false);
drawArrow(TX, CX, d10y+50, '#ff4040', 'ring (no VM)', false);

// ── DAY 14: EMAIL ──
var d14y = 620;
drawActivation(BX, d14y-10, d14y+20, '#9f00fa');
drawActivation(HX, d14y+10, d14y+50, '#e95400');
drawArrow(BX, HX, d14y, '#e95400', 'send_email', false);
drawArrow(HX, CX, d14y+30, '#e95400', 'email: Day 14', false);

// ── DAY 18: SMS ──
var d18y = 740;
drawActivation(BX, d18y-10, d18y+20, '#9f00fa');
drawActivation(TX, d18y+10, d18y+50, '#ee9612');
drawArrow(BX, TX, d18y, '#d36eff', 'send_sms', false);
drawArrow(TX, CX, d18y+30, '#d36eff', 'SMS: check-in', false);

// ── DAY 21: CALL x3 ──
var d21y = 860;
drawActivation(PX, d21y-10, d21y+20, '#9f00fa');
drawActivation(BX, d21y+10, d21y+50, '#9f00fa');
drawActivation(TX, d21y+30, d21y+75, '#ee9612');
drawArrow(PX, BX, d21y, '#9f00fa', 'trigger_calls', false);
drawArrow(BX, TX, d21y+20, '#ee9612', 'dial \u00d73', false);
drawArrow(TX, CX, d21y+50, '#ff4040', 'ring + VM if zero engagement', false);

// ── DAY 30: SMS ──
var d30y = 1000;
drawActivation(BX, d30y-10, d30y+20, '#9f00fa');
drawActivation(TX, d30y+10, d30y+50, '#ee9612');
drawArrow(BX, TX, d30y, '#d36eff', 'send_sms', false);
drawArrow(TX, CX, d30y+30, '#d36eff', 'SMS: reminder', false);

// ── DAY 44: EMAIL ──
var d44y = 1120;
drawActivation(BX, d44y-10, d44y+20, '#9f00fa');
drawActivation(HX, d44y+10, d44y+50, '#e95400');
drawArrow(BX, HX, d44y, '#e95400', 'send_email', false);
drawArrow(HX, CX, d44y+30, '#e95400', 'email: final \'last note\'', false);

// ── STOP annotation ──
svg.appendChild(svgEl('line', {
  x1:200, y1:STOP_Y, x2:1700, y2:STOP_Y,
  stroke:'#585858', 'stroke-width':'1.5', 'stroke-dasharray':'8,6', 'stroke-opacity':'0.5'
}));
var stopBlock = svgEl('text', {
  x:700, y:STOP_Y+25, fill:'#585858',
  'font-family':'Barlow Condensed, sans-serif', 'font-size':'14',
  'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.08em'
});
stopBlock.textContent = 'STOP \u2014 zero response after Day 44 \u2192 leave in sent';
svg.appendChild(stopBlock);

// X marks on lifelines at STOP
[PX, BX, TX, CX, RX, HX].forEach(function(x) {
  svg.appendChild(svgEl('line', {x1:x-6, y1:STOP_Y-6, x2:x+6, y2:STOP_Y+6, stroke:'#585858', 'stroke-width':'2', 'stroke-opacity':'0.5'}));
  svg.appendChild(svgEl('line', {x1:x+6, y1:STOP_Y-6, x2:x-6, y2:STOP_Y+6, stroke:'#585858', 'stroke-width':'2', 'stroke-opacity':'0.5'}));
});

// ── Rule cards (right side) ──
var ruleX = 1480, ruleW = 340, ruleH = 56;

RULE_CARDS.forEach(function(r) {
  svg.appendChild(svgEl('rect', {
    x:ruleX, y:r.y, width:ruleW, height:ruleH, rx:'0',
    fill:'#1a1a1a', stroke:'#ffffff0d', 'stroke-width':'1'
  }));
  svg.appendChild(svgEl('rect', {x:ruleX, y:r.y, width:3, height:ruleH, fill:r.c}));
  svg.appendChild(svgEl('rect', {x:ruleX, y:r.y, width:1, height:ruleH, fill:r.c, opacity:'0.6'}));
  svg.appendChild(svgEl('line', {
    x1:ruleX+0.5, y1:r.y, x2:ruleX+0.5, y2:r.y+ruleH,
    stroke:r.c, 'stroke-width':'1', 'stroke-opacity':'0.5'
  }));
  var title = svgEl('text', {
    x:ruleX+14, y:r.y+18, fill:r.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'12',
    'font-weight':'700', 'letter-spacing':'0.05em'
  });
  title.textContent = r.title;
  svg.appendChild(title);
  var desc = svgEl('text', {
    x:ruleX+14, y:r.y+36, fill:'#b0b0b0',
    'font-family':'JetBrains Mono, monospace', 'font-size':'10',
    'letter-spacing':'0.02em', opacity:'0.75'
  });
  desc.textContent = r.desc;
  svg.appendChild(desc);
});

/* sequence-main.js — tooltip + hover zones for Sequence diagram */

// ── Node tooltip ──
function showTooltip(n, e2) {
  var d = NODE_DETAILS[n.id]; if (!d) return;
  document.getElementById('tt-name').textContent = n.label;
  document.getElementById('tt-name').className = 'tt-name seq-tt-name';
  document.getElementById('tt-name').setAttribute('data-color', n.c);
  document.getElementById('tt-name').style.color = n.c;
  document.getElementById('tt-role').textContent = d.role;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = d.sc; sdot.style.color = d.sc;
  document.getElementById('tt-sv').textContent = d.status;
  document.getElementById('tt-sv').style.color = d.sc;
  document.getElementById('tt-head-icon').innerHTML = iconLg(n.icon, n.c);
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(pair) {
      return '<div class="tt-row"><span class="tt-k">'+pair[0]+'</span><span class="tt-v">'+pair[1]+'</span></div>';
    }).join('');
  // Connections
  var sends = EDGES.filter(function(e) { return e.f === n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2192</span> <span>'
      +(nm[e.t]?nm[e.t].label:e.t)
      +(e.lbl?' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>':'')
      +'</span></div>';
  }).join('');
  var recvs = EDGES.filter(function(e) { return e.t === n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2190</span> <span>'
      +(nm[e.f]?nm[e.f].label:e.f)
      +(e.lbl?' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>':'')
      +'</span></div>';
  }).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends ? '<div class="tt-conn-title">Next touch</div>'+sends : '') +
    (recvs ? '<div class="tt-conn-title" style="margin-top:'+(sends?6:0)+'px">Previous touch</div>'+recvs : '');
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(e2);
}

// ── Edge tooltip ──
function showEdgeTooltip(e, ev) {
  var key = e.f + '__' + e.t;
  var d = EDGE_DETAILS[key]; if(!d) return;
  document.getElementById('tt-name').textContent = d.title;
  document.getElementById('tt-name').style.color = e.c;
  document.getElementById('tt-role').textContent = d.sub;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = e.c; sdot.style.color = e.c;
  document.getElementById('tt-sv').textContent = 'SEQUENCE';
  document.getElementById('tt-sv').style.color = e.c;
  document.getElementById('tt-head-icon').innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) {
      return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>';
    }).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
}

// ── Invisible hover zones (per day group) ──
var hoverZones = [
  {id:'d7',   y:d7y-30,  h:160},
  {id:'d8',   y:d8y-30,  h:90},
  {id:'d10',  y:d10y-30, h:100},
  {id:'d14',  y:d14y-30, h:60},
  {id:'d18',  y:d18y-30, h:90},
  {id:'d21',  y:d21y-30, h:100},
  {id:'d30',  y:d30y-30, h:90},
  {id:'d44',  y:d44y-30, h:60},
  {id:'stop', y:STOP_Y-30, h:70}
];

hoverZones.forEach(function(zone) {
  var leftRect = svgEl('rect', {
    x:20, y:zone.y, width:110, height:zone.h,
    fill:'transparent', opacity:'0', 'pointer-events':'all', cursor:'default'
  });
  leftRect.dataset.nodeId = zone.id;
  svg.appendChild(leftRect);

  var mainRect = svgEl('rect', {
    x:180, y:zone.y, width:1550, height:zone.h,
    fill:'transparent', opacity:'0', 'pointer-events':'all', cursor:'default'
  });
  mainRect.dataset.nodeId = zone.id;
  svg.appendChild(mainRect);

  [leftRect, mainRect].forEach(function(rect) {
    rect.addEventListener('mouseenter', function(e) { showTooltip(nm[zone.id], e); });
    rect.addEventListener('mousemove', function(e) { moveTooltip(e); });
    rect.addEventListener('mouseleave', function() { hideTooltip(); });
  });
});

// ── Edge hover zones (gaps between day groups) ──
(function(){
  var dayYMap = {d7:d7y, d8:d8y, d10:d10y, d14:d14y, d18:d18y, d21:d21y, d30:d30y, d44:d44y, stop:STOP_Y};
  var zoneHMap = {};
  hoverZones.forEach(function(z){ zoneHMap[z.id] = z.h; });

  EDGES.forEach(function(e){
    var fromY = dayYMap[e.f];
    var toY   = dayYMap[e.t];
    if(fromY === undefined || toY === undefined) return;
    var fromBottom = fromY - 30 + (zoneHMap[e.f] || 80);
    var toTop      = toY - 30;
    if(toTop <= fromBottom) return;
    var gapRect = svgEl('rect', {
      x:20, y:fromBottom, width:1710, height:toTop - fromBottom,
      fill:'transparent', opacity:'0', 'pointer-events':'all', cursor:'pointer'
    });
    svg.appendChild(gapRect);
    (function(edge){
      gapRect.addEventListener('mouseenter', function(ev){ showEdgeTooltip(edge, ev); });
      gapRect.addEventListener('mousemove',  function(ev){ moveTooltip(ev); });
      gapRect.addEventListener('mouseleave', function(){ hideTooltip(); });
    })(e);
  });
})();
