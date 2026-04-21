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
    m:[['Priority 1','Marco Diaz \u00b7 (555) 651-4304'],['Priority 2','Sarah Mitchell \u00b7 (555) 864-9577'],['Priority 3','Dan Harper \u00b7 \u26a0 TBD (OQ-1)'],['Ring logic','Up to 3 simultaneous \u00b7 16s timeout'],['Blockers','OQ-1 Dan phone \u00b7 OQ-2 Jennifer phone \u00b7 OQ-5 shared phone \u00b7 OQ-6 Leah no HS seat'],['Shared phone','Henry + Leah: (555) 538-9560 (OQ-5) \u2014 decide before go-live']],
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
