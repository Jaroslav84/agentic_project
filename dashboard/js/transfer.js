/* transfer.js — Transfer Flow graph (merged) */

/* transfer-data.js — data constants for Warm Transfer graph */

var STORAGE_KEY = 'phil-pos-transfer';

var ICONS = {
  engage:   icon('M10,3 a7,7 0 1,0 .01,0Z M7,10 L9.5,12.5 L13.5,7.5'),
  script:   icon('M4,2h12v16H4V2z M8,7h5 M8,10h5 M8,13h3'),
  select:   icon('M6.5,8 a3,3 0 1,0 .01,0Z M1,17 C1,13.5 3.5,11.5 6.5,11.5 S12,13.5 12,17 M13,6 C14.5,4.5 17,5 17.5,7 S16,10 14,9 M15,11 C18,12 20,14.5 19.5,17'),
  ring:     icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M13,3h4v4 M17,3 L13.5,6.5'),
  sms:      icon('M2,3h16v10H2V3z M5,16 L4,20 L11,16h5 M6,8h8 M6,11h5'),
  answer:   icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M7,10 L9.5,12.5 L13.5,7.5'),
  attrib:   icon('M3,5 Q3,3 10,3 Q17,3 17,5 L17,15 Q17,17 10,17 Q3,17 3,15Z M3,5 Q3,7 10,7 Q17,7 17,5 M7,11h6 M7,13.5h4'),
  post:     icon('M10,7 a3,3 0 1,0 .01,0Z M10,1v3 M10,16v3 M1,10h3 M16,10h3 M3.2,3.2l2.1,2.1 M14.7,14.7l2.1,2.1 M3.2,16.8l2.1,-2.1 M14.7,5.3l2.1,-2.1'),
  unavail:  icon('M10,3 a7,7 0 1,0 .01,0Z M7,7 L13,13 M13,7 L7,13'),
  apology:  icon('M4,2h12v16H4V2z M8,7h5 M8,10h5 M8,13h3 M7,10 L9.5,12.5 L13.5,7.5'),
  sms30:    icon('M2,3h16v10H2V3z M5,16 L4,20 L11,16h5 M6,8h8 M6,11h5'),
  matrix:   icon('M2,3h16v10H2V3z M5,16 L4,20 L11,16h5 M6,8h8 M6,11h5'),
  won:      icon('M10,3 a7,7 0 1,0 .01,0Z M7,10 L9.5,12.5 L13.5,7.5'),
  resume:   icon('M10,3 a7,7 0 1,0 .01,0Z M10,6v4 L13,12 M10,3 L10,1 M7,2.5 L10,1 L13,2.5'),
  lost:     icon('M10,3 a7,7 0 1,0 .01,0Z M7,7 L13,13 M13,7 L7,13'),
  reps:     icon('M6.5,8 a3,3 0 1,0 .01,0Z M1,17 C1,13.5 3.5,11.5 6.5,11.5 S12,13.5 12,17 M13,6 C14.5,4.5 17,5 17.5,7 S16,10 14,9 M15,11 C18,12 20,14.5 19.5,17'),
};

var NODES = [
  {id:'engage',  label:'CLIENT ENGAGEMENT',  sub:'Positive response detected\nIntent signal',                              x:700, y:80,  c:'#60be35'},
  {id:'script',  label:'PHIL SCRIPT',        sub:'"Let me connect you with\nour scheduling team"',                         x:700, y:190, c:'#9f00fa'},
  {id:'select',  label:'SELECT 3 REPS',      sub:'Weighted round-robin\nTransfer pool',                                   x:700, y:310, c:'#ee9612'},
  {id:'ring',    label:'PARALLEL RING',       sub:'Up to 3 reps simultaneous\n16s timeout',                                x:700, y:440, c:'#ff4040', hub:true},
  {id:'sms',     label:'TRANSFER SMS',        sub:'Fires immediately when\nringing starts',                                x:900, y:440, c:'#e95400'},
  {id:'answer',  label:'REP ANSWERS',         sub:'First rep to answer\nConference call connected',                        x:700, y:570, c:'#60be35'},
  {id:'attrib',  label:'ATTRIBUTION',         sub:'POST manager_userID=7225\nFieldTECH note',                             x:700, y:690, c:'#9f00fa'},
  {id:'post',    label:'POST-TRANSFER',       sub:'Monitor for outcome',                                                  x:700, y:820, c:'#9f00fa'},
  {id:'unavail', label:'ALL UNAVAILABLE',     sub:'All 3 reps timed out\n16s each',                                        x:400, y:520, c:'#ff4040'},
  {id:'apology', label:'CLIENT APOLOGY',      sub:'Sales apologizes\nPromises callback',                                    x:400, y:630, c:'#9f00fa'},
  {id:'sms30',   label:'SMS WITHIN 30 MIN',   sub:'Automated SMS to client',                                               x:300, y:740, c:'#e95400'},
  {id:'matrix',  label:'MATRIX ALERT',        sub:'High-priority alert to Alex',                                           x:500, y:740, c:'#ee9612'},
  {id:'won',     label:'WON',                 sub:'approved+ status\nProposal approved',                                    x:550, y:940, c:'#60be35'},
  {id:'resume',  label:'RESUME',              sub:'Still sent 48h later\nResume sequence',                                  x:700, y:940, c:'#9f00fa'},
  {id:'lost',    label:'LOST',                sub:'Closed status\nProposal closed/dead',                                    x:850, y:940, c:'#ff4040'},
  {id:'reps',    label:'REP POOL',            sub:'Transfer pool\n10 reps \u00b7 Weighted priority',                             x:1200,y:400, c:'#ee9612', wide:true},
];

var EDGES = [
  {f:'engage',  t:'script',  c:'#9f00fa', lbl:'engage detected', spd:2.5},
  {f:'script',  t:'select',  c:'#ee9612', lbl:'initiate transfer',spd:2.0},
  {f:'select',  t:'ring',    c:'#ff4040', lbl:'dial 3 reps',     spd:3.5},
  {f:'ring',    t:'answer',  c:'#60be35', lbl:'first answer',    spd:4.0},
  {f:'answer',  t:'attrib',  c:'#9f00fa', lbl:'write attribution',spd:2.5},
  {f:'attrib',  t:'post',    c:'#9f00fa', lbl:'monitor',         spd:1.5},
  {f:'ring',    t:'sms',     c:'#e95400', lbl:'fires before answer',spd:4.5},
  {f:'select',  t:'reps',    c:'#ee9612', lbl:'weighted select', spd:2.0},
  {f:'ring',    t:'unavail', c:'#ff4040', lbl:'all timeout',     spd:2.0},
  {f:'unavail', t:'apology', c:'#9f00fa', lbl:'apologize',       spd:2.0},
  {f:'apology', t:'sms30',   c:'#e95400', lbl:'auto SMS',        spd:2.5},
  {f:'apology', t:'matrix',  c:'#ee9612', lbl:'alert Alex',      spd:2.5},
  {f:'post',    t:'won',     c:'#60be35', lbl:'approved+',       spd:1.5},
  {f:'post',    t:'resume',  c:'#9f00fa', lbl:'still sent 48h',  spd:1.5},
  {f:'post',    t:'lost',    c:'#ff4040', lbl:'closed',          spd:1.5},
  {f:'sms',     t:'reps',    c:'#e95400', lbl:'rep briefing',    spd:2.0},
];

var SHAPE_MAP = {
  engage:  'rounded-rect',
  script:  'rect',
  select:  'rect',
  ring:    'diamond',
  sms:     'parallelogram',
  answer:  'rect',
  attrib:  'rect',
  post:    'rect',
  unavail: 'rect',
  apology: 'rect',
  sms30:   'parallelogram',
  matrix:  'parallelogram',
  won:     'rounded-rect',
  resume:  'rounded-rect',
  lost:    'rounded-rect',
  reps:    'data-panel',
};

var REPS_LIST = [
  'Marco Diaz \u00b7 P1 \u00b7 (555) 508-5930',
  'Sarah Mitchell \u00b7 P2 \u00b7 (555) 324-2266',
  'Dan Harper \u00b7 P3 \u00b7 \u26a0 TBD',
  'Ruben Santos \u00b7 P4 \u00b7 (555) 621-8085',
  'Amy Adams \u00b7 P5 \u00b7 (555) 193-0771',
  'Henry Jordan \u00b7 P6 \u00b7 (555) 981-1796',
  'Leah Baker \u00b7 P7 \u00b7 (555) 256-2621',
  'Jenna Martinez \u00b7 P8 \u00b7 \u26a0 TBD',
  'Stacy Kim \u00b7 P9 \u00b7 (555) 911-6916',
  'Alex \u00b7 Fallback \u00b7 (555) 710-1040',
];

/* transfer-details.js — tooltip detail data for Warm Transfer graph */

var NODE_DETAILS = {
  engage:  { role:'Client Engagement Detection', status:'LISTENING', sc:'#60be35',
    m:[['Trigger','Positive response detected'],['Signal','Intent to proceed \u00b7 scheduling interest'],['Source','Live call \u2014 Pipecat STT + Sonnet'],['Threshold','Affirmative + proposal mention'],['Window','During active call only']],
    note:'Sales detects engagement signals during the live call. A positive response about scheduling or proceeding triggers the warm transfer flow immediately.' },
  script:  { role:'Sales Transfer Script', status:'READY', sc:'#9f00fa',
    m:[['Script','\u201cLet me connect you with our scheduling team right now\u201d'],['Tone','Confident \u00b7 Immediate \u00b7 No hesitation'],['Timing','Fires within 1s of engagement detection'],['Next','Parallel ring initiates'],['Never says','\u201cLet me transfer you\u201d \u2014 always \u201cconnect\u201d']],
    note:'Sales never asks permission to transfer. The script is assertive \u2014 "Let me connect you" not "Would you like me to transfer you?"' },
  select:  { role:'Rep Selection \u00b7 Weighted Round-Robin', status:'SELECTING', sc:'#ee9612',
    m:[['Algorithm','Weighted round-robin'],['Pool size','10 reps total'],['Ring count','Up to 3 simultaneous'],['Weights','Configurable in Controller'],['Priority 1','Marco Diaz \u00b7 highest weight'],['Fallback','Alex \u00b7 absolute last resort']],
    note:'Selects up to 3 reps from the transfer pool based on weighted priority. Weights are configurable via the Sales Controller UI.' },
  ring:    { role:'Parallel Ring \u00b7 Core Transfer Mechanism', status:'RINGING', sc:'#ff4040',
    m:[['Mechanism','Parallel ring via Telnyx'],['Max reps','3 simultaneous'],['Timeout','16 seconds per attempt'],['Winner','First to answer gets the call'],['Losers','Dropped immediately'],['SMS','Fires to all 3 before anyone answers']],
    note:'The core of the warm transfer. Up to 3 reps ring simultaneously for 16 seconds. Transfer SMS fires immediately when ringing starts \u2014 before any rep answers.' },
  sms:     { role:'Transfer SMS \u00b7 Rep Briefing', status:'ARMED', sc:'#e95400',
    m:[['Timing','Fires immediately when ringing starts'],['Before','Before any rep answers'],['Contains','Client name/role \u00b7 propID/value \u00b7 days stale'],['Contains','clientName \u00b7 locationName \u00b7 phone'],['Contains','th_proposal_url \u00b7 internal URL \u00b7 HubSpot deal URL'],['Delivery','Telnyx SMS API']],
    note:'The transfer SMS fires BEFORE any rep answers. This ensures the rep who picks up already has full context on screen.' },
  answer:  { role:'Rep Answer \u00b7 Conference Bridge', status:'WAITING', sc:'#60be35',
    m:[['Action','First rep to answer \u2192 conference call'],['Bridge','Sales + Client + Rep on same call'],['Handoff','Sales introduces, then drops off'],['Others','Non-answering reps dropped'],['Attribution','Writes immediately on answer']],
    note:'First rep to answer gets conferenced in. Sales introduces the client and context, then drops off the call. Attribution writes immediately.' },
  attrib:  { role:'Attribution \u00b7 FieldTECH Write', status:'READY', sc:'#9f00fa',
    m:[['Endpoint','POST /proposal/{propID}'],['Payload','manager_userID: 7225'],['Token','[REDACTED \u2014 see .env]'],['Note','POST /note/proposal_internal/{propID}'],['Timing','Immediate \u2014 not after approval'],['Clear','manager_userID: 0 (null is no-op)']],
    note:'Attribution writes immediately at warm transfer \u2014 not after proposal approval. Sales\'s userID is 7225. To clear: set manager_userID to 0, not null.' },
  post:    { role:'Post-Transfer Monitoring', status:'MONITORING', sc:'#9f00fa',
    m:[['Watch','Proposal status changes'],['Won','status changes to approved+'],['Resume','Still "sent" after 48 hours'],['Lost','status changes to closed'],['Source','FieldTECH polling + HubSpot webhook']],
    note:'After transfer, Sales monitors the proposal outcome. Three possible paths: Won (approved), Resume (still sent after 48h \u2192 re-enter sequence), Lost (closed/dead).' },
  unavail: { role:'All Reps Unavailable \u00b7 Fallback', status:'TIMEOUT', sc:'#ff4040',
    m:[['Trigger','All 3 selected reps timed out'],['Timeout','16 seconds each'],['Next','Sales apologizes to client'],['Escalation','Matrix alert to Alex'],['Client SMS','Within 30 minutes']],
    note:'If all 3 reps fail to answer within 16 seconds, the fallback branch activates. Sales apologizes and promises a callback.' },
  apology: { role:'Client Apology Script', status:'READY', sc:'#9f00fa',
    m:[['Script','Sales apologizes \u00b7 promises callback'],['Tone','Genuine \u00b7 Not robotic'],['Promise','Someone will call back within 30 minutes'],['Parallel','SMS + Matrix alert fire simultaneously'],['Never says','"They\'re busy right now"']],
    note:'Sales apologizes genuinely and promises a callback within 30 minutes. Two parallel actions fire: automated client SMS and high-priority Matrix alert to Alex.' },
  sms30:   { role:'Client SMS \u00b7 30-Minute Promise', status:'ARMED', sc:'#e95400',
    m:[['Timing','Within 30 minutes of failed transfer'],['Content','Apology + callback promise + proposal link'],['Includes','th_proposal_url_for_customers'],['Via','Telnyx SMS'],['Template','SCRIPTS_SMS.md fallback template']],
    note:'Automated SMS sent to the client within 30 minutes of a failed transfer attempt. Includes the proposal link so they can self-serve.' },
  matrix:  { role:'Matrix Alert \u00b7 Alex Escalation', status:'ARMED', sc:'#ee9612',
    m:[['Priority','HIGH \u2014 immediate notification'],['Channel','#transfers or #errors'],['Contains','Client name \u00b7 propID \u00b7 all 3 failed reps'],['Action required','Alex must arrange manual callback'],['SLA','30 minutes from alert']],
    note:'High-priority Matrix alert to Alex. He must arrange a manual callback within 30 minutes to honor Sales\'s promise to the client.' },
  won:     { role:'Outcome: Won \u00b7 Proposal Approved', status:'SUCCESS', sc:'#60be35',
    m:[['Trigger','Proposal status \u2192 approved / scheduled / completed'],['Attribution','manager_userID=7225 already written'],['Sequence','Stopped \u2014 proposal converted'],['Matrix','Posted to #won channel'],['Commission','Sales AI gets attribution credit']],
    note:'The ideal outcome. Proposal moves to approved or beyond. Sales\'s attribution is already written. Posted to the #won Matrix channel.' },
  resume:  { role:'Outcome: Resume \u00b7 Still Sent', status:'PENDING', sc:'#9f00fa',
    m:[['Trigger','Proposal still "sent" 48 hours post-transfer'],['Action','Re-enter outreach sequence'],['Day count','Continues from where it left off'],['Attribution','manager_userID cleared (set to 0)'],['Recency guard','7-day email check still applies']],
    note:'If the proposal is still "sent" 48 hours after transfer, Sales clears attribution and resumes the outreach sequence from where it left off.' },
  lost:    { role:'Outcome: Lost \u00b7 Proposal Closed', status:'CLOSED', sc:'#ff4040',
    m:[['Trigger','Proposal status \u2192 closed'],['Action','Stop all outreach'],['Attribution','Kept \u2014 Sales still gets logged'],['Note','Sales never closes proposals automatically'],['Reason','closed_lost_reason field in HubSpot']],
    note:'Proposal closed/dead. Sales stops all outreach. Sales NEVER closes proposals automatically \u2014 this is always a human action.' },
  reps:    { role:'Transfer Pool \u00b7 10 Reps \u00b7 Weighted Priority', status:'7 AVAILABLE', sc:'#60be35',
    m:[['Priority 1','Marco Diaz \u00b7 (555) 494-6252'],['Priority 2','Sarah Mitchell \u00b7 (555) 710-7668'],['Priority 3','Dan Harper \u00b7 \u26a0 TBD (OQ-1)'],['Ring logic','Up to 3 simultaneous \u00b7 16s timeout'],['Blockers','OQ-1 Dan phone \u00b7 OQ-2 Jennifer phone \u00b7 OQ-5 shared phone \u00b7 OQ-6 Leah no HS seat'],['Shared phone','Henry + Leah: (555) 641-4119 (OQ-5) \u2014 decide before go-live']],
    note:'Sales Worker controls all Telnyx call legs during live calls (\u00a722). Transfer SMS fires to rep immediately on ring start \u2014 before anyone picks up. Stacy Kim is last resort. Alex is absolute fallback. OQ-8: HubSpot email mismatches for Marco, Anne, Stacy need fixing in DB or hs_owner_id matching.' },
};

var EDGE_DETAILS = {
  'engage__script': {
    title:'CLIENT \u2192 PHIL CONVERSATION', sub:'Engagement Detection \u2192 Script Activation',
    m:[['Trigger','Client answers call'],['Script','Sales leads with proposal # + property name'],['Selection','Script tier pre-selected (T1\u2013T4)'],['Source','Pipecat STT \u2192 Sonnet analysis'],['Latency','<1s from engagement signal']],
    note:'Client answers the call. Sales leads with proposal number and property name. Script tier is pre-selected based on staleness bucket and email history signals.'
  },
  'script__select': {
    title:'PHIL \u2192 TRANSFER QUEUE', sub:'Positive Engagement \u2192 Rep Selection',
    m:[['Trigger','Client expresses interest / scheduling intent'],['Script','\u201cLet me connect you with our scheduling team\u201d'],['Cross-sell','Concrete/asphalt/tree bundling check happens here'],['Tone','Assertive \u2014 never asks permission to transfer'],['Timing','Fires within 1s of engagement detection']],
    note:'Client interested. Sales says "Let me connect you with our scheduling team." Cross-sell check happens here \u2014 concrete, asphalt, and tree service bundling opportunities are flagged.'
  },
  'select__ring': {
    title:'QUEUE \u2192 PARALLEL RING', sub:'Rep Selection \u2192 Simultaneous Dial',
    m:[['Mechanism','Up to 3 reps ringed simultaneously via Telnyx'],['Algorithm','Weighted round-robin from transfer pool'],['Timeout','16 seconds per attempt'],['SMS','Transfer SMS fires immediately on ring start'],['Timing','Before any rep answers']],
    note:'Up to 3 reps ringed simultaneously via Telnyx. Weighted round-robin selection. 16s timeout. Transfer SMS fires immediately when ringing starts \u2014 before any rep answers.'
  },
  'ring__answer': {
    title:'RING \u2192 FIRST ANSWER', sub:'Parallel Ring \u2192 Conference Bridge',
    m:[['Winner','First rep to pick up gets the call'],['Losers','Other ringing reps dropped immediately'],['Bridge','Sales Worker conferences client + rep'],['Attribution','Written immediately: manager_userID=7225'],['Recording','Dual-channel recording continues']],
    note:'First rep to pick up gets the call, others dropped. Sales Worker conferences client and rep. Attribution written immediately: manager_userID=7225.'
  },
  'answer__attrib': {
    title:'ANSWER \u2192 ATTRIBUTION', sub:'Conference Connected \u2192 FieldTECH Write',
    m:[['Endpoint','POST /proposal/{propID}'],['Payload','manager_userID: 7225'],['Note','[Sales AI] Day {N} - Warm transfer to {rep} - engaged'],['Timing','Immediate \u2014 not after approval'],['Clear','manager_userID: 0 to clear (null is no-op)']],
    note:'Attribution write is immediate at warm transfer. POST /proposal/{propID} with manager_userID: 7225 plus internal note: [Sales AI] Day {N} - Warm transfer to {rep_name} ({rep_userID}) - engaged.'
  },
  'attrib__post': {
    title:'ATTRIBUTION \u2192 MONITORING', sub:'Write Complete \u2192 Outcome Watch',
    m:[['Watch','Proposal status changes in FieldTECH'],['Paths','Won (approved+) / Resume (still sent 48h) / Lost (closed)'],['Source','FieldTECH polling + HubSpot webhook'],['Sales','Drops off the call after introduction']],
    note:'After attribution is written, Sales monitors for the proposal outcome. Three paths: Won, Resume, or Lost.'
  },
  'ring__sms': {
    title:'RING \u2192 TRANSFER SMS', sub:'Ring Start \u2192 Rep Briefing SMS',
    m:[['Timing','Fires immediately when ringing starts'],['Before','Before any rep answers the call'],['Contains','Client name/role \u00b7 propID/value \u00b7 days stale'],['Contains','clientName \u00b7 locationName \u00b7 phone'],['Contains','Proposal URL \u00b7 internal URL \u00b7 HubSpot deal URL'],['Cross-sell','Included if flagged during call']],
    note:'Transfer SMS fires to all 3 reps BEFORE anyone answers. Contains: client name/role, propID/value/days stale, clientName/locationName, phone, proposal URL, internal URL, HubSpot deal URL, and cross-sell interest if any.'
  },
  'select__reps': {
    title:'SELECTION \u2192 REP POOL', sub:'Weighted Round-Robin Query',
    m:[['Pool','10 reps total \u00b7 weighted priority'],['Select','Up to 3 simultaneous'],['Priority 1','Marco Diaz (highest weight)'],['Last resort','Stacy Kim'],['Fallback','Alex (absolute last resort)'],['Config','Weights configurable in Sales Controller']],
    note:'Weighted round-robin selects up to 3 reps from the transfer pool. Weights are configurable via the Sales Controller UI. Alex is the absolute fallback.'
  },
  'ring__unavail': {
    title:'RING \u2192 ALL UNAVAILABLE', sub:'Timeout \u2192 Fallback Branch',
    m:[['Trigger','All 3 reps + Alex unavailable within 16s'],['Timeout','16 seconds per attempt'],['Script','Sales: \u201cOur team is with other clients right now\u201d'],['Promise','\u201cSomeone will call you back shortly\u201d'],['Next','Client apology + dual escalation']],
    note:'All 3 reps plus Alex unavailable within 16s. Sales tells the client: "Our team is with other clients right now \u2014 someone will call you back shortly."'
  },
  'unavail__apology': {
    title:'UNAVAILABLE \u2192 CLIENT APOLOGY', sub:'Timeout \u2192 Apology Script',
    m:[['Script','Sales apologizes \u00b7 promises callback'],['Tone','Genuine \u2014 not robotic'],['Promise','Callback within 30 minutes'],['Parallel','SMS + Matrix alert fire simultaneously'],['Never says','\u201cThey\'re busy right now\u201d']],
    note:'Sales apologizes genuinely and promises a callback. Two parallel actions fire simultaneously: automated client SMS and high-priority Matrix alert to Alex.'
  },
  'apology__sms30': {
    title:'APOLOGY \u2192 CLIENT SMS', sub:'Failed Transfer \u2192 30-Min SMS',
    m:[['Timing','Within 30 minutes of failed transfer'],['Content','Apology + callback promise + proposal link'],['Includes','th_proposal_url_for_customers'],['Via','Telnyx SMS API'],['Template','SCRIPTS_SMS.md fallback template']],
    note:'Client receives SMS within 30 minutes with callback promise and the proposal link so they can self-serve if desired.'
  },
  'apology__matrix': {
    title:'APOLOGY \u2192 MATRIX ALERT', sub:'Failed Transfer \u2192 Alex Escalation',
    m:[['Priority','HIGH \u2014 immediate notification'],['Channel','#errors channel'],['Contains','Full call context \u00b7 client info \u00b7 all 3 failed reps'],['Action','Alex must arrange manual callback'],['SLA','30 minutes from alert']],
    note:'High-priority alert to Alex in #errors channel. Includes full call context. Alex must arrange a manual callback within 30 minutes to honor Sales\'s promise.'
  },
  'post__won': {
    title:'MONITORING \u2192 WON', sub:'Status Change \u2192 Proposal Approved',
    m:[['Trigger','Proposal status \u2192 approved / scheduled / completed'],['Attribution','manager_userID=7225 already written'],['Sequence','Stopped \u2014 proposal converted'],['Matrix','Posted to #won channel'],['Commission','Sales AI gets attribution credit']],
    note:'The ideal outcome. Proposal moves to approved or beyond. Sales\'s attribution is already written. Outreach sequence stops. Posted to #won Matrix channel.'
  },
  'post__resume': {
    title:'MONITORING \u2192 RESUME', sub:'48h Still Sent \u2192 Re-Enter Sequence',
    m:[['Trigger','Proposal still \u201csent\u201d 48 hours post-transfer'],['Action','Re-enter outreach sequence from where it left off'],['Attribution','Cleared (manager_userID set to 0)'],['Recency guard','7-day email check still applies'],['Day count','Continues from pre-transfer position']],
    note:'If the proposal is still "sent" 48 hours after transfer, Sales clears attribution (sets manager_userID to 0) and resumes the outreach sequence from where it left off.'
  },
  'post__lost': {
    title:'MONITORING \u2192 LOST', sub:'Status Change \u2192 Proposal Closed',
    m:[['Trigger','Proposal status \u2192 closed'],['Action','Stop all outreach permanently'],['Attribution','Kept \u2014 Sales still gets logged'],['Key rule','Sales NEVER closes proposals automatically'],['Reason','closed_lost_reason field in HubSpot']],
    note:'Proposal closed/dead. Sales stops all outreach. Sales NEVER closes proposals automatically \u2014 this is always a human action. closed_lost_reason tracked in HubSpot.'
  },
  'sms__reps': {
    title:'SMS \u2192 REP POOL', sub:'Transfer SMS \u2192 Rep Briefing Delivery',
    m:[['Delivery','SMS sent to all 3 selected reps'],['Contains','Client name/role \u00b7 propID \u00b7 value \u00b7 days stale'],['Contains','clientName \u00b7 locationName \u00b7 phone'],['Contains','Proposal URL \u00b7 internal URL \u00b7 HubSpot deal URL'],['Purpose','Rep has full context before answering']],
    note:'Transfer SMS delivers full briefing to all 3 selected reps. The rep who picks up already has complete context on screen: client info, proposal details, and all relevant URLs.'
  },
};

/* transfer-render.js — edge geometry + shape dimensions for Warm Transfer graph */

// Shape dimension constants
var RECT_W = 168, RECT_H = 62;
var ROUNDED_W = 158, ROUNDED_H = 56;
var DIAMOND_SX = 72, DIAMOND_SY = 55;
var PARA_W = 168, PARA_H = 52, PARA_SKEW = 16;
var PANEL_W = 230, PANEL_H = 270;

// SVG text helper
function svgText(x, y, text, attrs) {
  var el = svgEl('text', Object.assign({x:x, y:y}, attrs));
  el.textContent = text;
  return el;
}

// Clip edge endpoint to node border
function clipToBorder(n, tx, ty) {
  var shape = SHAPE_MAP[n.id];
  var dx = tx - n.x, dy = ty - n.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return {x: n.x, y: n.y + 31};
  if (shape === 'diamond') {
    var sx = DIAMOND_SX * 1.3, sy = DIAMOND_SY;
    var scale = 1.0 / ((Math.abs(dx)||0.001)/sx + (Math.abs(dy)||0.001)/sy);
    return {x: n.x + dx * scale, y: n.y + dy * scale};
  }
  var hw, hh;
  if (shape === 'data-panel')        { hw = PANEL_W/2;  hh = PANEL_H/2; }
  else if (shape === 'rounded-rect') { hw = ROUNDED_W/2; hh = ROUNDED_H/2; }
  else if (shape === 'parallelogram'){ hw = (PARA_W + PARA_SKEW)/2; hh = PARA_H/2; }
  else                               { hw = RECT_W/2; hh = RECT_H/2; }
  var scaleX = hw / (Math.abs(dx)||0.001), scaleY = hh / (Math.abs(dy)||0.001);
  var sc = Math.min(scaleX, scaleY);
  return {x: n.x + dx * sc, y: n.y + dy * sc};
}

// Build cubic bezier control points for an edge path
function makeEdgePath(x1, y1, x2, y2, perpOff) {
  if (perpOff) {
    var ddx = x2-x1, ddy = y2-y1, len = Math.sqrt(ddx*ddx+ddy*ddy)||1;
    x1 += -ddy/len*perpOff; y1 += ddx/len*perpOff;
    x2 += -ddy/len*perpOff; y2 += ddx/len*perpOff;
  }
  var dx = x2-x1, dy = y2-y1;
  var isHoriz = Math.abs(dx) > Math.abs(dy)*1.5;
  if (isHoriz) {
    return {x1:x1, y1:y1, cp1x:x1+dx*.5, cp1y:y1, cp2x:x1+dx*.5, cp2y:y2, x2:x2, y2:y2};
  }
  return {x1:x1, y1:y1, cp1x:x1, cp1y:y1+dy*.4, cp2x:x2, cp2y:y2-dy*.4, x2:x2, y2:y2};
}

// Rebuild edge SVG paths when a node moves
function rebuildEdgesForNode(nodeId) {
  allEdges.forEach(function(e) {
    if (e.f !== nodeId && e.t !== nodeId) return;
    var b1 = clipToBorder(nm[e.f], nm[e.t].x, nm[e.t].y);
    var b2 = clipToBorder(nm[e.t], nm[e.f].x, nm[e.f].y);
    var ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff||0);
    Object.assign(e, ep);
    var d = 'M '+ep.x1+','+ep.y1+' C '+ep.cp1x+','+ep.cp1y+' '+ep.cp2x+','+ep.cp2y+' '+ep.x2+','+ep.y2;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hit) e._hit.setAttribute('d', d);
    if (e._lblBg) {
      var mp = cbPt(ep.x1, ep.y1, ep.cp1x, ep.cp1y, ep.cp2x, ep.cp2y, ep.x2, ep.y2, .5);
      e._lblBg.setAttribute('x', mp.x); e._lblBg.setAttribute('y', mp.y-5);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x); e._lblTx.setAttribute('y', mp.y-5); }
    }
  });
}

// Get bounding box for a node shape
function getNodeBBox(n) {
  var shape = SHAPE_MAP[n.id];
  switch (shape) {
    case 'rounded-rect':   return {w:ROUNDED_W, h:ROUNDED_H};
    case 'rect':           return {w:RECT_W, h:RECT_H};
    case 'diamond':        return {w:DIAMOND_SX*2.6, h:DIAMOND_SY*2};
    case 'parallelogram':  return {w:PARA_W+PARA_SKEW, h:PARA_H};
    case 'data-panel':     return {w:PANEL_W, h:PANEL_H};
    default:               return {w:RECT_W, h:RECT_H};
  }
}

/* transfer-shapes.js — SVG node shape drawing for Warm Transfer graph */

// Draw a rounded-rect node (terminal / engagement nodes)
function drawRoundedRect(n) {
  var w = ROUNDED_W, h = ROUNDED_H, rx = 20;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:rx,
    fill:n.c+'12', stroke:n.c+'60', 'stroke-width':'1.5', class:'node-shape'
  }));
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2+rx/2, width:2, height:h-rx, rx:'1',
    fill:n.c, opacity:'0.5'
  }));
  g.appendChild(svgText(n.x, n.y-6, n.label, {
    fill:n.c, 'font-size':'13', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif',
    'text-anchor':'middle', 'letter-spacing':'0.04em', 'text-transform':'uppercase'
  }));
  n.sub.split('\n').forEach(function(line, i) {
    g.appendChild(svgText(n.x, n.y+10+i*11, line, {
      fill:'#b0b0b0', 'font-size':'10', opacity:'0.7',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
    }));
  });
  return g;
}

// Draw a rectangular node
function drawRect(n) {
  var w = RECT_W, h = RECT_H;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'3',
    fill:n.c+'10', stroke:n.c+'45', 'stroke-width':'1.5', class:'node-shape'
  }));
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2+3, width:2.5, height:h-6, rx:'1',
    fill:n.c, opacity:'0.6'
  }));
  g.appendChild(svgText(n.x, n.y-8, n.label, {
    fill:n.c, 'font-size':'12.5', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif',
    'text-anchor':'middle', 'letter-spacing':'0.04em'
  }));
  n.sub.split('\n').forEach(function(line, i) {
    g.appendChild(svgText(n.x, n.y+6+i*12, line, {
      fill:'#b0b0b0', 'font-size':'9.5', opacity:'0.65',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
    }));
  });
  return g;
}

// Draw a diamond node (decision point)
function drawDiamond(n) {
  var sx = DIAMOND_SX, sy = DIAMOND_SY;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  var points = n.x+','+(n.y-sy)+' '+(n.x+sx*1.3)+','+n.y+' '+n.x+','+(n.y+sy)+' '+(n.x-sx*1.3)+','+n.y;
  g.appendChild(svgEl('polygon', {
    points:points, fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5', class:'node-shape'
  }));
  if (n.hub) {
    var pulse = svgEl('polygon', {
      points:points, fill:'none', stroke:n.c, 'stroke-width':'2', 'stroke-opacity':'0.5'
    });
    pulse.innerHTML = '<animate attributeName="stroke-opacity" values="0.5;0;0" dur="2.8s" repeatCount="indefinite"/>' +
      '<animate attributeName="stroke-width" values="2;14;14" dur="2.8s" repeatCount="indefinite"/>';
    g.appendChild(pulse);
  }
  g.appendChild(svgText(n.x, n.y-5, n.label, {
    fill:n.c, 'font-size':'11.5', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif', 'text-anchor':'middle', 'letter-spacing':'0.04em'
  }));
  g.appendChild(svgText(n.x, n.y+10, 'First answer?', {
    fill:'#60be35', 'font-size':'9.5', opacity:'0.8',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
  }));
  g.appendChild(svgText(n.x, n.y+21, 'All timeout?', {
    fill:'#ff4040', 'font-size':'9.5', opacity:'0.8',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
  }));
  return g;
}

// Draw a parallelogram node (SMS / messaging)
function drawParallelogram(n) {
  var w = PARA_W, h = PARA_H, skew = PARA_SKEW;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  var points = (n.x-w/2+skew)+','+(n.y-h/2)+' '+(n.x+w/2+skew)+','+(n.y-h/2)+' '+
               (n.x+w/2-skew)+','+(n.y+h/2)+' '+(n.x-w/2-skew)+','+(n.y+h/2);
  g.appendChild(svgEl('polygon', {
    points:points, fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5', class:'node-shape'
  }));
  g.appendChild(svgText(n.x, n.y-5, n.label, {
    fill:n.c, 'font-size':'12', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif', 'text-anchor':'middle', 'letter-spacing':'0.04em'
  }));
  n.sub.split('\n').forEach(function(line, i) {
    g.appendChild(svgText(n.x, n.y+9+i*12, line, {
      fill:'#b0b0b0', 'font-size':'9.5', opacity:'0.65',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
    }));
  });
  return g;
}

// Draw the data-panel node (rep pool)
function drawDataPanel(n) {
  var w = PANEL_W, h = PANEL_H;
  var g = svgEl('g', {id:'node-'+n.id, class:'node-group'});
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'4',
    fill:'#1a1a1a', stroke:n.c+'50', 'stroke-width':'1.5', class:'node-shape'
  }));
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2, width:w, height:26, rx:'4', fill:n.c+'18', stroke:'none'
  }));
  g.appendChild(svgEl('rect', {
    x:n.x-w/2, y:n.y-h/2+18, width:w, height:8, fill:n.c+'18', stroke:'none'
  }));
  g.appendChild(svgEl('line', {
    x1:n.x-w/2, y1:n.y-h/2+26, x2:n.x+w/2, y2:n.y-h/2+26,
    stroke:n.c+'30', 'stroke-width':'1'
  }));
  g.appendChild(svgText(n.x, n.y-h/2+17, n.label, {
    fill:n.c, 'font-size':'13', 'font-weight':'700',
    'font-family':'Barlow Condensed,sans-serif', 'text-anchor':'middle', 'letter-spacing':'0.06em'
  }));
  g.appendChild(svgText(n.x, n.y-h/2+40, '10 reps \u00b7 Weighted priority', {
    fill:'#b0b0b0', 'font-size':'9.5', opacity:'0.6',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle'
  }));
  REPS_LIST.forEach(function(rep, i) {
    var isWarn = rep.includes('\u26a0');
    var yPos = n.y - h/2 + 56 + i * 19;
    g.appendChild(svgText(n.x-w/2+12, yPos, '\u25B8', {
      fill:isWarn ? '#ee9612' : '#585858', 'font-size':'8.5',
      'font-family':'JetBrains Mono,monospace'
    }));
    g.appendChild(svgText(n.x-w/2+22, yPos, rep, {
      fill:isWarn ? '#ee9612' : '#d4d4d4', 'font-size':'10',
      'font-family':'JetBrains Mono,monospace'
    }));
  });
  var details = NODE_DETAILS[n.id];
  if (details) {
    g.appendChild(svgEl('circle', {
      cx:n.x-w/2+14, cy:n.y+h/2-12, r:'3', fill:details.sc, opacity:'0.8'
    }));
    g.appendChild(svgText(n.x-w/2+22, n.y+h/2-9, details.status, {
      fill:details.sc, 'font-size':'9', opacity:'0.6',
      'font-family':'JetBrains Mono,monospace', 'letter-spacing':'0.1em'
    }));
  }
  return g;
}

// Add status LED below a non-panel node
function addStatusLED(g, n) {
  var details = NODE_DETAILS[n.id];
  if (!details) return;
  if (SHAPE_MAP[n.id] === 'data-panel') return;
  var bbox = getNodeBBox(n);
  var ledY = n.y + bbox.h/2 + 10;
  g.appendChild(svgEl('circle', {
    cx:n.x-14, cy:ledY, r:'2.5', fill:details.sc, opacity:'0.8',
    style:'filter:drop-shadow(0 0 3px '+details.sc+')'
  }));
  g.appendChild(svgText(n.x-8, ledY+3, details.status, {
    fill:details.sc, 'font-size':'8.5', opacity:'0.5',
    'font-family':'JetBrains Mono,monospace', 'letter-spacing':'0.1em'
  }));
}

// Render a node by shape type
function renderNode(n) {
  var shape = SHAPE_MAP[n.id];
  var g;
  switch (shape) {
    case 'rounded-rect':   g = drawRoundedRect(n); break;
    case 'rect':           g = drawRect(n); break;
    case 'diamond':        g = drawDiamond(n); break;
    case 'parallelogram':  g = drawParallelogram(n); break;
    case 'data-panel':     g = drawDataPanel(n); break;
    default:               g = drawRect(n); break;
  }
  addStatusLED(g, n);
  return g;
}

/* transfer-main.js — setup, edge building, node rendering, drag for Warm Transfer graph */

// Restore saved positions
restorePositions(NODES, STORAGE_KEY);

// Node lookup map
var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });

// DOM references
var mainSvg = document.getElementById('mainSvg');
var pctx    = document.getElementById('partCvs').getContext('2d');

// Region backdrops (lowest z-order)
addRegion(mainSvg, 580, 38,  440, 580, '#60be35', 'LIVE CALL',  'Engagement detection through rep answer');
addRegion(mainSvg, 580, 640, 390, 340, '#9f00fa', 'POST-CALL',  'Attribution, monitoring, outcomes');
addRegion(mainSvg, 220, 478, 380, 310, '#ff4040', 'FALLBACK',   'All reps unavailable path');

// Arrow markers + glow filter
var defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#d36eff'].forEach(function(col) {
  var m = svgEl('marker', {id:'arr'+col.slice(1),
    markerUnits:'userSpaceOnUse', markerWidth:'8', markerHeight:'6',
    refX:'7', refY:'3', orient:'auto'});
  m.appendChild(svgEl('path', {d:'M0,0 L8,3 L0,6 Z', fill:col+'bb'}));
  defs.appendChild(m);
});
var flt = svgEl('filter', {id:'glow', x:'-50%', y:'-50%', width:'200%', height:'200%'});
flt.appendChild(svgEl('feGaussianBlur', {stdDeviation:'3', result:'blur'}));
var feMerge = svgEl('feMerge', {});
feMerge.appendChild(svgEl('feMergeNode', {'in':'blur'}));
feMerge.appendChild(svgEl('feMergeNode', {'in':'SourceGraphic'}));
flt.appendChild(feMerge);
defs.appendChild(flt);
mainSvg.insertBefore(defs, mainSvg.firstChild);

// SVG layers
var edgeLayer = svgEl('g', {id:'edge-layer'});
mainSvg.appendChild(edgeLayer);
var nodeLayer = svgEl('g', {id:'node-layer', 'pointer-events':'all'});
mainSvg.appendChild(nodeLayer);

// Build edges
var allEdges = [];
EDGES.forEach(function(e) {
  var n1 = nm[e.f], n2 = nm[e.t];
  if (!n1 || !n2) return;
  var b1 = clipToBorder(n1, n2.x, n2.y);
  var b2 = clipToBorder(n2, n1.x, n1.y);
  var fwd = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff||0);
  allEdges.push(Object.assign({}, e, fwd, {rev:false}));
});

// Render edges
allEdges.forEach(function(e) {
  var d = 'M '+e.x1+','+e.y1+' C '+e.cp1x+','+e.cp1y+' '+e.cp2x+','+e.cp2y+' '+e.x2+','+e.y2;
  var glow = svgEl('path', {d:d, fill:'none', stroke:e.c, 'stroke-width':'6', 'stroke-opacity':'0.05'});
  edgeLayer.appendChild(glow); e._glow = glow;
  var dash = e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6');
  var main = svgEl('path', {d:d, fill:'none', stroke:e.c,
    'stroke-width':e.spd >= 4 ? '2' : '1.5',
    'stroke-opacity':'0.42', 'stroke-dasharray':dash,
    'marker-end':'url(#arr'+e.c.slice(1)+')'});
  edgeLayer.appendChild(main); e._main = main;
  if (e.lbl) {
    var mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, .5);
    var bg = svgEl('text', {x:mp.x, y:mp.y-5, fill:'#141414', 'font-size':'8',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle',
      stroke:'#141414', 'stroke-width':'3', 'stroke-linejoin':'round'});
    bg.textContent = e.lbl; edgeLayer.appendChild(bg); e._lblBg = bg;
    var tx = svgEl('text', {x:mp.x, y:mp.y-5, fill:e.c, 'font-size':'8',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle',
      opacity:'0.75', 'letter-spacing':'0.06em'});
    tx.textContent = e.lbl; edgeLayer.appendChild(tx); e._lblTx = tx;
  }
  var hitPath = svgEl('path', {d:d, fill:'none', stroke:'transparent',
    'stroke-width':'18', 'pointer-events':'stroke', cursor:'pointer'});
  edgeLayer.appendChild(hitPath);
  e._hit = hitPath;
  (function(edge) {
    hitPath.addEventListener('mouseenter', function(ev) { showEdgeTooltip(edge, ev); });
    hitPath.addEventListener('mousemove', function(ev) { moveTooltip(ev); });
    hitPath.addEventListener('mouseleave', function() { hideTooltip(); });
  })(e);
});

// Edge highlight refs
var nodeGroups = {};
var edgeHighlight = [];
allEdges.forEach(function(e) {
  if (e._main) edgeHighlight.push({el:e._main, from:e.f, to:e.t, baseOp:'0.42'});
});

// Bind hover + drag events to a node group
function bindNodeEvents(g, n) {
  g.addEventListener('mouseenter', function(e2) {
    if (dragState.id) return;
    var conn = new Set([n.id]);
    EDGES.forEach(function(e) { if (e.f === n.id) conn.add(e.t); if (e.t === n.id) conn.add(e.f); });
    NODES.forEach(function(nd) {
      var grp = nodeGroups[nd.id]; if (!grp) return;
      if (!conn.has(nd.id)) { grp.classList.add('dimmed'); grp.classList.remove('lit'); }
      else { grp.classList.add('lit'); grp.classList.remove('dimmed'); }
    });
    edgeHighlight.forEach(function(h) {
      h.el.setAttribute('stroke-opacity', (h.from === n.id || h.to === n.id) ? '0.9' : '0.025');
    });
    showTooltip(n, e2);
  });
  g.addEventListener('mousemove', function(e2) { if (!dragState.id) moveTooltip(e2); });
  g.addEventListener('mouseleave', function() {
    if (dragState.id) return;
    NODES.forEach(function(nd) { var grp = nodeGroups[nd.id]; if (grp) grp.classList.remove('dimmed','lit'); });
    edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
    hideTooltip();
  });
  g.addEventListener('mousedown', function(e2) { startDrag(e2, n.id); });
}

// Render all nodes
NODES.forEach(function(n) {
  var g = renderNode(n);
  nodeGroups[n.id] = g;
  nodeLayer.appendChild(g);
  bindNodeEvents(g, n);
});

// Update node position (rebuild SVG group in place)
function updateNodePosition(nodeId) {
  var n = nm[nodeId], oldG = nodeGroups[nodeId];
  if (!oldG) return;
  var newG = renderNode(n);
  if (oldG.classList.contains('dragging')) newG.classList.add('dragging');
  nodeLayer.replaceChild(newG, oldG);
  nodeGroups[nodeId] = newG;
  bindNodeEvents(newG, n);
}

// Drag
function startDrag(e, nodeId) {
  hideTooltip();
  var wrap = document.getElementById('graphWrap');
  dragState.id = nodeId;
  dragState.startMx = e.clientX; dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x; dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft; dragState.scrollY = wrap.scrollTop;
  var grp = nodeGroups[nodeId];
  if (grp) grp.classList.add('dragging');
  NODES.forEach(function(nd) { var g = nodeGroups[nd.id]; if (g) g.classList.remove('dimmed','lit'); });
  edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
  e.preventDefault(); e.stopPropagation();
}
document.addEventListener('mousemove', function(e) {
  if (!dragState.id) return;
  var wrap = document.getElementById('graphWrap');
  var dx = e.clientX - dragState.startMx + (wrap.scrollLeft - dragState.scrollX);
  var dy = e.clientY - dragState.startMy + (wrap.scrollTop - dragState.scrollY);
  nm[dragState.id].x = dragState.startNx + dx;
  nm[dragState.id].y = dragState.startNy + dy;
  updateNodePosition(dragState.id);
  rebuildEdgesForNode(dragState.id);
});
document.addEventListener('mouseup', function() {
  if (!dragState.id) return;
  var grp = nodeGroups[dragState.id];
  if (grp) grp.classList.remove('dragging');
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});

/* transfer-ui.js — tooltips, particles, animation for Warm Transfer graph */

// Tooltip (node)
function showTooltip(n, e2) {
  var d = NODE_DETAILS[n.id]; if (!d) return;
  document.getElementById('tt-name').textContent = n.label;
  document.getElementById('tt-name').style.color = n.c;
  document.getElementById('tt-role').textContent = d.role;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = d.sc; sdot.style.color = d.sc;
  document.getElementById('tt-sv').textContent = d.status;
  document.getElementById('tt-sv').style.color = d.sc;
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) {
      return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>';
    }).join('');
  var sends = EDGES.filter(function(e) { return e.f === n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2192</span> <span>' +
      (nm[e.t] ? nm[e.t].label : e.t) +
      (e.lbl ? ' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>' : '') +
      '</span></div>';
  }).join('');
  var recvs = EDGES.filter(function(e) { return e.t === n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2190</span> <span>' +
      (nm[e.f] ? nm[e.f].label : e.f) +
      (e.lbl ? ' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>' : '') +
      '</span></div>';
  }).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends ? '<div class="tt-conn-title">Sends to</div>'+sends : '') +
    (recvs ? '<div class="tt-conn-title" style="margin-top:'+(sends ? 6 : 0)+'px">Receives from</div>'+recvs : '');
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(e2);
}

// Tooltip (edge)
function showEdgeTooltip(e, ev) {
  var key = e.f + '__' + e.t;
  var d = EDGE_DETAILS[key]; if (!d) return;
  document.getElementById('tt-name').textContent = d.title;
  document.getElementById('tt-name').style.color = e.c;
  document.getElementById('tt-role').textContent = d.sub;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = e.c; sdot.style.color = e.c;
  document.getElementById('tt-sv').textContent = 'CONNECTION';
  document.getElementById('tt-sv').style.color = e.c;
  var headIcon = document.getElementById('tt-head-icon');
  if (headIcon) headIcon.innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) {
      return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>';
    }).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
}

// Particles
var particles = [];
allEdges.forEach(function(e) {
  var cnt = e.spd >= 4.5 ? 4 : e.spd >= 3 ? 3 : e.spd >= 2 ? 2 : 1;
  for (var j = 0; j < cnt; j++) particles.push({edge:e, t:j/cnt, trail:[]});
});

// Animation loop
var lastTime = performance.now();
function animate(now) {
  var dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 1000);
  particles.forEach(function(p) {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    var e = p.edge;
    var pt = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, p.t);
    p.trail.push({x:pt.x, y:pt.y});
    if (p.trail.length > 10) p.trail.shift();
    for (var i = 1; i < p.trail.length; i++) {
      var a = (i / p.trail.length) * 0.5 * 0.85;
      var r = (i / p.trail.length) * (e.spd >= 4 ? 2.8 : 2.2);
      pctx.beginPath();
      pctx.arc(p.trail[i].x, p.trail[i].y, r, 0, Math.PI * 2);
      pctx.fillStyle = e.c;
      pctx.globalAlpha = a;
      pctx.fill();
    }
    pctx.save();
    pctx.shadowColor = e.c; pctx.shadowBlur = e.spd >= 4 ? 14 : 8;
    pctx.fillStyle = e.c; pctx.globalAlpha = 1;
    pctx.beginPath();
    pctx.arc(pt.x, pt.y, e.spd >= 4 ? 3.5 : 2.8, 0, Math.PI * 2);
    pctx.fill(); pctx.restore();
    pctx.globalAlpha = 1;
  });
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
