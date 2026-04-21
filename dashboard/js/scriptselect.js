/* scriptselect.js — Script Selection graph (merged) */

/* scriptselect-data.js — data definitions for Script Selection graph */

var STORAGE_KEY = 'phil-pos-scriptselect';

// =====================================================
// SVG ICONS (20x20 viewBox, stroke-based)
// =====================================================
var ICONS = {
  incoming: icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M14,2v3h3'),
  decision: icon('M10,2 L18,10 L10,18 L2,10Z M10,7v6 M8,10h4'),
  override: icon('M10,2 L19,17 H1Z M10,8v4 M10,14v1'),
  guard:    icon('M10,2 L17,5 V12 C17,16 10,19 10,19 C10,19 3,16 3,12 V5Z M10,8v4 M10,14v1'),
  history:  icon('M2,4h16v12H2V4z M2,4 L10,11 L18,4 M14,14 L17,17'),
  stale:    icon('M10,3 a7,7 0 1,0 .01,0Z M10,6v4 L13,12 M10,3 L10,1 M7,2.5 L10,1 L13,2.5'),
  script:   icon('M4,2h8l4,4v12H4V2z M12,2v4h4 M7,10h6 M7,13h6'),
  skip:     icon('M10,3 a7,7 0 1,0 .01,0Z M7,7 L13,13 M13,7 L7,13'),
  keyrule:  icon('M10,2 L12,8 L18,8 L13,12 L15,18 L10,14 L5,18 L7,12 L2,8 L8,8Z')
};

// =====================================================
// NODES
// =====================================================
var NODES = [
  // ENTRY
  {id:'entry',  label:'INCOMING CALL',         sub:'New call initiated\nCheck priority cascade',                       x:960, y:60,  c:'#9f00fa', hub:true},

  // LEVEL 1 - P1 Override Triggers
  {id:'p1',     label:'P1 \u2014 OVERRIDE TRIGGERS',sub:'Check first \u00b7 Highest priority',                                  x:960, y:180, c:'#ff4040', hub:true},
  {id:'t4c',    label:'T4-C',                  sub:'City/code enforcement\nin email history',                          x:600, y:300, c:'#ff4040'},
  {id:'t4a',    label:'T4-A',                  sub:'Rep departed +\nfirst outreach',                                  x:960, y:300, c:'#e95400'},
  {id:'t3b',    label:'T3-B',                  sub:'Unanswered client\nquestion',                                     x:1320,y:300, c:'#ee9612'},

  // LEVEL 2 - P2 Recency Guard
  {id:'p2',     label:'P2 \u2014 RECENCY GUARD',    sub:'Human rep check',                                                 x:960, y:420, c:'#ee9612', hub:true},
  {id:'skip',   label:'SKIP',                  sub:'Human rep emailed < 7 days\nDO NOT CONTACT',                      x:700, y:520, c:'#ff4040'},

  // LEVEL 3 - P3 Email History
  {id:'p3',     label:'P3 \u2014 EMAIL HISTORY',    sub:'Client reply analysis',                                           x:960, y:600, c:'#60be35', hub:true},
  {id:'t1a',    label:'T1-A',                  sub:'HOA / property mgmt\nreply',                                      x:400, y:720, c:'#60be35'},
  {id:'t1b',    label:'T1-B',                  sub:'Price / general\nreply',                                          x:600, y:720, c:'#60be35'},
  {id:'t1c',    label:'T1-C',                  sub:'Budget concern\nreply',                                           x:800, y:720, c:'#60be35'},
  {id:'t1d',    label:'T1-D',                  sub:'Forwarded reply\nto decision maker',                              x:1000,y:720, c:'#60be35'},
  {id:'t3a',    label:'T3-A',                  sub:'No email history\nNever emailed',                                 x:1250,y:720, c:'#9f00fa'},

  // LEVEL 4 - P4 Staleness Bucket
  {id:'p4',     label:'P4 \u2014 STALENESS BUCKET', sub:'Days since sent\nEmail sent but no reply',                        x:960, y:850, c:'#e95400', hub:true},
  {id:'t2a',    label:'T2-A',                  sub:'7\u201330 days stale\nFresh stale',                               x:600, y:950, c:'#e95400'},
  {id:'t2b',    label:'T2-B',                  sub:'30\u201390 days stale\nModerate stale',                           x:800, y:950, c:'#e95400'},
  {id:'t2c',    label:'T2-C',                  sub:'90\u2013365 days stale\nVery stale',                              x:1000,y:950, c:'#e95400'},
  {id:'t4d',    label:'T4-D',                  sub:'365+ days stale\nAncient',                                       x:1200,y:950, c:'#585858'},

  // KEY RULE callout
  {id:'keyrule',label:'KEY RULE',              sub:'T1 always beats staleness.\nThe last client action matters\nmore than the calendar.', x:200, y:720, c:'#60be35'}
];

// =====================================================
// EDGES
// =====================================================
var EDGES = [
  // Entry -> P1
  {f:'entry', t:'p1',   c:'#ff4040', lbl:'check overrides', spd:2.5},

  // P1 -> terminals
  {f:'p1',    t:'t4c',  c:'#ff4040', lbl:'enforcement',     spd:2.0},
  {f:'p1',    t:'t4a',  c:'#e95400', lbl:'rep left',        spd:2.0},
  {f:'p1',    t:'t3b',  c:'#ee9612', lbl:'question pending', spd:2.0},

  // P1 -> P2 (fall-through)
  {f:'p1',    t:'p2',   c:'#9f00fa', lbl:'no override',     spd:1.5},

  // P2 -> SKIP
  {f:'p2',    t:'skip', c:'#ff4040', lbl:'rep active',      spd:2.0},

  // P2 -> P3 (fall-through)
  {f:'p2',    t:'p3',   c:'#9f00fa', lbl:'clear',           spd:1.5},

  // P3 -> T1 terminals
  {f:'p3',    t:'t1a',  c:'#60be35', lbl:'HOA',             spd:2.0},
  {f:'p3',    t:'t1b',  c:'#60be35', lbl:'price/general',   spd:2.0},
  {f:'p3',    t:'t1c',  c:'#60be35', lbl:'budget',          spd:2.0},
  {f:'p3',    t:'t1d',  c:'#60be35', lbl:'forwarded',       spd:2.0},
  {f:'p3',    t:'t3a',  c:'#9f00fa', lbl:'no history',      spd:1.8},

  // P3 -> P4 (fall-through)
  {f:'p3',    t:'p4',   c:'#9f00fa', lbl:'emailed, no reply', spd:1.5},

  // P4 -> T2 terminals
  {f:'p4',    t:'t2a',  c:'#e95400', lbl:'7\u201330d',      spd:2.0},
  {f:'p4',    t:'t2b',  c:'#e95400', lbl:'30\u201390d',     spd:2.0},
  {f:'p4',    t:'t2c',  c:'#e95400', lbl:'90\u2013365d',    spd:2.0},
  {f:'p4',    t:'t4d',  c:'#585858', lbl:'365d+',           spd:1.0}
];

// =====================================================
// NODE SHAPES
// =====================================================
var NODE_SHAPES = {
  entry:'diamond', p1:'diamond', p2:'diamond', p3:'diamond', p4:'diamond',
  t4c:'leaf', t4a:'leaf', t3b:'leaf', skip:'leaf',
  t1a:'leaf', t1b:'leaf', t1c:'leaf', t1d:'leaf', t3a:'leaf',
  t2a:'leaf', t2b:'leaf', t2c:'leaf', t4d:'leaf',
  keyrule:'keyrule'
};

// =====================================================
// ICON MAPPING
// =====================================================
function getIconId(id) {
  if (id === 'entry')   return 'incoming';
  if (id === 'p1')      return 'override';
  if (id === 'p2')      return 'guard';
  if (id === 'p3')      return 'history';
  if (id === 'p4')      return 'stale';
  if (id === 'skip')    return 'skip';
  if (id === 'keyrule') return 'keyrule';
  if (id === 't4c')     return 'override';
  if (id === 't4a')     return 'script';
  if (id === 't3b')     return 'history';
  if (id === 't3a')     return 'script';
  return 'script';
}

/* scriptselect-details.js — NODE_DETAILS and EDGE_DETAILS for Script Selection graph */

var NODE_DETAILS = {
  entry: { role:'ENTRY \u00b7 New Call Initiated', status:'ACTIVE', sc:'#9f00fa',
    m:[['Type','Entry point'],['Action','Begin priority cascade'],['First check','P1 Override Triggers'],['Rule','First match wins'],['Calls per batch','~24 sequential']],
    note:'Every new call starts here. The priority cascade checks P1 through P4 in order. The first match determines which script tier to use. No parallel evaluation.' },
  p1: { role:'P1 \u00b7 Override Triggers \u00b7 Highest Priority', status:'CHECK FIRST', sc:'#ff4040',
    m:[['Priority','1 (highest)'],['Signals checked','3 override conditions'],['T4-C','City/code enforcement in email history'],['T4-A','Rep departed + first outreach'],['T3-B','Unanswered client question'],['Fall-through','If no override \u2192 P2']],
    note:'Override triggers are checked first because they represent time-sensitive situations that outweigh all other signals. Code enforcement letters mean the client has external pressure to act.' },
  t4c: { role:'T4-C \u00b7 City/Code Enforcement Script', status:'TERMINAL', sc:'#ff4040',
    m:[['Tier','T4-C'],['Trigger','City or code enforcement found in email history'],['Urgency','HIGH \u2014 external pressure on client'],['Opener','Reference enforcement notice + proposal'],['Goal','Leverage urgency to schedule work'],['Source','SCRIPTS_CALL.md']],
    note:'Code enforcement means the client has a deadline imposed by the city. This is the highest-urgency script \u2014 the client is already motivated to act.' },
  t4a: { role:'T4-A \u00b7 Rep Departed Script', status:'TERMINAL', sc:'#e95400',
    m:[['Tier','T4-A'],['Trigger','Rep who sent proposal has departed + first outreach'],['Opener','Introduce as new point of contact'],['Tone','Reassuring \u2014 continuity message'],['Goal','Re-establish relationship'],['Source','SCRIPTS_CALL.md']],
    note:'When the original sales rep has left PS, the client may feel abandoned. Sales bridges the gap by introducing himself as the new contact for their proposal.' },
  t3b: { role:'T3-B \u00b7 Unanswered Question Script', status:'TERMINAL', sc:'#ee9612',
    m:[['Tier','T3-B'],['Trigger','Client asked a question in email that went unanswered'],['Opener','Acknowledge the unanswered question'],['Tone','Apologetic + helpful'],['Goal','Answer the question, then close'],['Source','SCRIPTS_CALL.md']],
    note:'Unanswered questions are low-hanging fruit. The client was engaged enough to ask \u2014 they just need a response. Sales references the specific question from email history.' },
  p2: { role:'P2 \u00b7 Recency Guard \u00b7 Human Rep Check', status:'GUARD ACTIVE', sc:'#ee9612',
    m:[['Priority','2'],['Check','Did a human rep email this contact in the last 7 days?'],['If yes','SKIP \u2014 do not contact'],['If no','Fall through to P3'],['Source','HubSpot engagement feed'],['Rule','Sales never steps on an active human thread']],
    note:'The recency guard prevents Sales from calling someone who is already in an active conversation with a human rep. 7-day lookback window on HubSpot email engagements.' },
  skip: { role:'SKIP \u00b7 Do Not Contact', status:'BLOCKED', sc:'#ff4040',
    m:[['Action','Skip this contact entirely for this touch'],['Reason','Human rep emailed within 7 days'],['Next','Contact re-evaluated at next sequence touch'],['Rule','Sales never steps on active human threads'],['Source','HubSpot engagement feed']],
    note:'This is not a permanent block. The contact will be re-evaluated at the next scheduled touch in the outreach sequence. If the 7-day window has passed, they proceed normally.' },
  p3: { role:'P3 \u00b7 Email History \u00b7 Client Reply Analysis', status:'ANALYZING', sc:'#60be35',
    m:[['Priority','3'],['Signals','Client email replies analyzed for intent'],['T1-A','HOA / property management signal'],['T1-B','Price concern or general reply'],['T1-C','Budget mention'],['T1-D','Forwarded to decision maker'],['T3-A','No email history at all'],['Fall-through','Emailed but no reply \u2192 P4']],
    note:'T1 scripts are the strongest \u2014 they mean the client has already engaged. The specific reply content determines which T1 variant to use. T1 always beats staleness (T2).' },
  t1a: { role:'T1-A \u00b7 HOA / Property Management Reply', status:'TERMINAL', sc:'#60be35',
    m:[['Tier','T1-A'],['Trigger','Client replied with HOA or property management signal'],['Opener','Reference their HOA/board process'],['Tone','Patient \u2014 understands approval cycles'],['Goal','Align timeline with board meeting schedule'],['Source','SCRIPTS_CALL.md']],
    note:'HOA clients often need board approval before proceeding. Sales acknowledges this and offers to present at the next board meeting or provide materials for the client to present.' },
  t1b: { role:'T1-B \u00b7 Price/General Reply', status:'TERMINAL', sc:'#60be35',
    m:[['Tier','T1-B'],['Trigger','Client replied with price concern OR general reply'],['Opener','Acknowledge their specific concern'],['Tone','Consultative \u2014 value-focused'],['Goal','Address pricing, offer alternatives, close'],['Source','SCRIPTS_CALL.md']],
    note:'Most common T1 script. Covers clients who replied asking about price, requesting changes, or with general interest. Sales references the specific email content.' },
  t1c: { role:'T1-C \u00b7 Budget Concern Reply', status:'TERMINAL', sc:'#60be35',
    m:[['Tier','T1-C'],['Trigger','Client replied mentioning budget constraints'],['Opener','Acknowledge budget reality'],['Tone','Empathetic \u2014 phased approach'],['Goal','Offer phased pricing or priority items'],['Source','SCRIPTS_CALL.md']],
    note:'Budget-constrained clients need creative solutions. Sales can suggest phasing the work, prioritizing safety items, or splitting across fiscal years.' },
  t1d: { role:'T1-D \u00b7 Forwarded Reply', status:'TERMINAL', sc:'#60be35',
    m:[['Tier','T1-D'],['Trigger','Client forwarded proposal to a decision maker'],['Opener','Reference the forward, ask about decision maker'],['Tone','Strategic \u2014 identify the real buyer'],['Goal','Connect with decision maker directly'],['Source','SCRIPTS_CALL.md']],
    note:'A forwarded email means the original contact is not the decision maker. Sales needs to identify and reach the actual buyer. This often leads to a warm introduction.' },
  t3a: { role:'T3-A \u00b7 No Email History', status:'TERMINAL', sc:'#9f00fa',
    m:[['Tier','T3-A'],['Trigger','No email history exists for this contact'],['Opener','Cold open with proposal number + property name'],['Tone','Direct \u2014 first contact'],['Goal','Introduce proposal, gauge interest'],['Source','SCRIPTS_CALL.md']],
    note:'No prior email communication. Sales leads with the proposal number and property name to establish context. This is effectively a warm-ish cold call since a proposal was already sent.' },
  p4: { role:'P4 \u00b7 Staleness Bucket \u00b7 Days Since Sent', status:'BUCKETING', sc:'#e95400',
    m:[['Priority','4 (lowest)'],['Condition','Email was sent but client never replied'],['T2-A','7\u201330 days stale (fresh)'],['T2-B','30\u201390 days stale (moderate)'],['T2-C','90\u2013365 days stale (very stale)'],['T4-D','365+ days (ancient)'],['Basis','Days since tstamp_sent']],
    note:'Staleness-based scripts are the fallback when there is no email history signal. The tone shifts progressively from "just checking in" (T2-A) to "we found this in our records" (T4-D).' },
  t2a: { role:'T2-A \u00b7 Fresh Stale (7\u201330 days)', status:'TERMINAL', sc:'#e95400',
    m:[['Tier','T2-A'],['Window','7\u201330 days since sent'],['Opener','Reference proposal + timing'],['Tone','Casual \u2014 still fresh'],['Goal','Quick close \u2014 proposal still top of mind'],['Source','SCRIPTS_CALL.md']],
    note:'Proposal was sent recently. Client likely remembers it. Sales references the specific proposal and property name with a light touch.' },
  t2b: { role:'T2-B \u00b7 Moderate Stale (30\u201390 days)', status:'TERMINAL', sc:'#e95400',
    m:[['Tier','T2-B'],['Window','30\u201390 days since sent'],['Opener','Acknowledge time has passed'],['Tone','Re-engagement \u2014 check if still relevant'],['Goal','Confirm interest, update if needed'],['Source','SCRIPTS_CALL.md']],
    note:'A month or more has passed. Sales acknowledges the delay and checks whether the client still needs the work done. May offer to update the proposal if scope has changed.' },
  t2c: { role:'T2-C \u00b7 Very Stale (90\u2013365 days)', status:'TERMINAL', sc:'#e95400',
    m:[['Tier','T2-C'],['Window','90\u2013365 days since sent'],['Opener','Longer time reference \u2014 seasonal angle'],['Tone','Consultative \u2014 re-assess needs'],['Goal','Determine if project is still viable'],['Source','SCRIPTS_CALL.md']],
    note:'Significantly stale. Sales uses seasonal angles (e.g., "before rainy season") and checks if conditions have changed. May need a site revisit to update the proposal.' },
  t4d: { role:'T4-D \u00b7 Ancient (365+ days)', status:'TERMINAL', sc:'#585858',
    m:[['Tier','T4-D'],['Window','365+ days since sent'],['Opener','Found in records \u2014 verify still relevant'],['Tone','Low pressure \u2014 archival'],['Goal','Qualify out or refresh'],['Win rate','Very low \u2014 last resort'],['Source','SCRIPTS_CALL.md']],
    note:'Over a year old. These proposals are likely dead but worth one attempt. Sales frames it as "cleaning up records" and checks if the property still needs work. Most will qualify out.' },
  keyrule: { role:'KEY RULE \u00b7 Script Selection Priority', status:'ALWAYS', sc:'#60be35',
    m:[['Rule','T1 always beats staleness'],['Meaning','If client replied (any T1), use T1 regardless of age'],['Example','Client replied 180 days ago about budget \u2192 T1-C, not T2-C'],['Spec ref','SPECIFICATION_v1.9.md \u00b7 Script Selection Logic'],['Rationale','Last client action > calendar time']],
    note:'This is the single most important rule in script selection. A client who replied 6 months ago with a budget concern gets T1-C (budget), not T2-C (very stale). Their reply is the strongest signal we have.' }
};

var EDGE_DETAILS = {
  'entry__p1': {
    title:'PRIORITY CASCADE START', sub:'Entry \u2192 P1 Override Check',
    m:[['Direction','Entry point to first priority check'],['Action','Begin checking P1 override triggers'],['Rule','First match wins \u2014 priority waterfall'],['Sequence','P1 \u2192 P2 \u2192 P3 \u2192 P4']],
    note:'Every new call enters the priority cascade here. The system checks P1 through P4 in strict order. The first matching condition determines the script tier. No parallel evaluation.'
  },
  'p1__t4c': {
    title:'OVERRIDE: ENFORCEMENT', sub:'P1 \u2192 T4-C City/Code Enforcement',
    m:[['Trigger','City notice or code enforcement found in email history'],['Script','T4-C \u2014 Urgent municipal compliance'],['Priority','1 (highest)'],['Urgency','HIGH \u2014 external deadline on client'],['Action','Reference enforcement notice + proposal']],
    note:'Code enforcement letters mean the client has a government-imposed deadline. This is the highest-urgency override \u2014 the client is already under pressure to act. Sales leverages this urgency.'
  },
  'p1__t4a': {
    title:'OVERRIDE: REP DEPARTED', sub:'P1 \u2192 T4-A Introduce New Contact',
    m:[['Trigger','Original sales rep has left PS + this is first outreach'],['Script','T4-A \u2014 Rep departed introduction'],['Priority','1 (highest)'],['Tone','Reassuring \u2014 continuity message'],['Action','Introduce Sales as new point of contact']],
    note:'When the original rep who sent the proposal has departed, the client may feel abandoned. Sales bridges the gap by introducing himself as the new contact for their proposal.'
  },
  'p1__t3b': {
    title:'OVERRIDE: UNANSWERED Q', sub:'P1 \u2192 T3-B Address Pending Question',
    m:[['Trigger','Client asked a question in email that was never answered'],['Script','T3-B \u2014 Unanswered question follow-up'],['Priority','1 (highest)'],['Tone','Apologetic + helpful'],['Action','Acknowledge and answer the specific question']],
    note:'Unanswered questions are low-hanging fruit. The client was engaged enough to ask \u2014 they just need a response. Sales references the specific question from email history.'
  },
  'p1__p2': {
    title:'NO OVERRIDE \u2192 FALL-THROUGH', sub:'P1 \u2192 P2 Recency Guard',
    m:[['Condition','No override triggers matched'],['Action','Fall through to P2 recency guard'],['Next check','Was a human rep active in last 7 days?'],['Type','Priority cascade continuation']],
    note:'None of the three P1 override conditions were found (no enforcement, no departed rep, no unanswered question). The cascade continues to P2 to check if a human rep is actively working this contact.'
  },
  'p2__skip': {
    title:'RECENCY GUARD: SKIP', sub:'Human Rep Active \u2192 Do Not Contact',
    m:[['Condition','Human rep emailed this contact within last 7 days'],['Action','Skip this touch entirely'],['Recheck','Contact re-evaluated at next sequence touch'],['Source','HubSpot engagement feed'],['Rule','Sales never steps on active human threads']],
    note:'The recency guard protects active sales conversations. If any rep has emailed this contact via HubSpot in the last 7 days, Sales backs off completely. This is not permanent \u2014 the contact is re-evaluated at the next scheduled touch.'
  },
  'p2__p3': {
    title:'GUARD CLEAR \u2192 FALL-THROUGH', sub:'P2 \u2192 P3 Email History Analysis',
    m:[['Condition','No human rep emailed in last 7 days'],['Action','Fall through to P3 email history check'],['Next check','Analyze client email replies for intent signals'],['Type','Priority cascade continuation']],
    note:'The recency guard is clear \u2014 no human rep is actively working this contact. The cascade continues to P3 to analyze whether the client has replied to any emails and what their reply signals.'
  },
  'p3__t1a': {
    title:'EMAIL SIGNAL: HOA/BOARD', sub:'P3 \u2192 T1-A HOA Approval Pending',
    m:[['Trigger','Client replied mentioning HOA or board approval process'],['Script','T1-A \u2014 HOA / property management reply'],['Tier','T1 (email history \u2014 strongest signal)'],['Tone','Patient \u2014 understands approval cycles'],['Goal','Align timeline with board meeting schedule']],
    note:'HOA clients often need board approval before proceeding. Sales acknowledges this process and offers to help \u2014 present at the next board meeting or provide materials. T1 always beats staleness.'
  },
  'p3__t1b': {
    title:'EMAIL SIGNAL: PRICE/GENERAL', sub:'P3 \u2192 T1-B Price or General Reply',
    m:[['Trigger','Client replied with price concern or general interest'],['Script','T1-B \u2014 Price/general reply (most common T1)'],['Tier','T1 (email history \u2014 strongest signal)'],['Tone','Consultative \u2014 value-focused'],['Goal','Address pricing, offer alternatives, close']],
    note:'The most common T1 script. Covers clients who replied asking about price, requesting changes, or with general interest. Also the default T1 when client replied but intent is unclear. Sales references specific email content.'
  },
  'p3__t1c': {
    title:'EMAIL SIGNAL: BUDGET', sub:'P3 \u2192 T1-C Budget Constraint Reply',
    m:[['Trigger','Client replied mentioning budget constraints or next fiscal cycle'],['Script','T1-C \u2014 Budget concern reply'],['Tier','T1 (email history \u2014 strongest signal)'],['Tone','Empathetic \u2014 phased approach'],['Goal','Offer phased pricing or priority items']],
    note:'Budget-constrained clients need creative solutions. Sales can suggest phasing the work, prioritizing safety items, or splitting across fiscal years. The client already engaged \u2014 just needs a workable plan.'
  },
  'p3__t1d': {
    title:'EMAIL SIGNAL: FORWARDED', sub:'P3 \u2192 T1-D Forwarded to Decision Maker',
    m:[['Trigger','Client forwarded proposal internally to a decision maker'],['Script','T1-D \u2014 Forwarded reply / decision maker'],['Tier','T1 (email history \u2014 strongest signal)'],['Tone','Strategic \u2014 identify the real buyer'],['Goal','Connect with the actual decision maker directly']],
    note:'A forwarded email means the original contact is not the final decision maker. Sales needs to identify and reach the actual buyer. This often leads to a warm introduction to someone higher up.'
  },
  'p3__t3a': {
    title:'NO EMAIL HISTORY', sub:'P3 \u2192 T3-A Cold Open with Proposal',
    m:[['Trigger','No email history exists for this contact at all'],['Script','T3-A \u2014 No email history / first contact'],['Tier','T3 (no prior communication)'],['Tone','Direct \u2014 cold open'],['Goal','Introduce proposal, gauge interest']],
    note:'No prior email communication found in HubSpot. Sales leads with the proposal number and property name to establish context. This is a warm-ish cold call since a proposal was already sent.'
  },
  'p3__p4': {
    title:'EMAILED, NO REPLY \u2192 FALL-THROUGH', sub:'P3 \u2192 P4 Staleness Bucket',
    m:[['Condition','Email was sent to client but they never replied'],['Action','Fall through to P4 staleness-based script selection'],['Next check','How many days since proposal was sent?'],['Key rule','T1 always beats staleness \u2014 this path means NO T1 match']],
    note:'The client was emailed but never replied. Since there is no email history signal to work with, the system falls back to staleness-based bucketing. The tone shifts based on how old the proposal is.'
  },
  'p4__t2a': {
    title:'STALENESS: FRESH', sub:'P4 \u2192 T2-A 7\u201330 Days Stale',
    m:[['Window','7\u201330 days since tstamp_sent'],['Script','T2-A \u2014 Soft, fresh proposal'],['Tier','T2 (staleness-based)'],['Tone','Casual \u2014 proposal still top of mind'],['Goal','Quick close \u2014 still fresh']],
    note:'Proposal was sent recently. Client likely remembers it. Sales references the specific proposal and property name with a light touch. Highest conversion potential in the staleness tier.'
  },
  'p4__t2b': {
    title:'STALENESS: MODERATE', sub:'P4 \u2192 T2-B 30\u201390 Days Stale',
    m:[['Window','30\u201390 days since tstamp_sent'],['Script','T2-B \u2014 Direct, "where does this stand"'],['Tier','T2 (staleness-based)'],['Tone','Re-engagement \u2014 acknowledge time passed'],['Goal','Confirm interest, offer to update proposal']],
    note:'A month or more has passed. Sales acknowledges the delay and checks whether the client still needs the work. May offer to update the proposal if scope or conditions have changed.'
  },
  'p4__t2c': {
    title:'STALENESS: VERY STALE', sub:'P4 \u2192 T2-C 90\u2013365 Days Stale',
    m:[['Window','90\u2013365 days since tstamp_sent'],['Script','T2-C \u2014 Binary, "still on radar or close it"'],['Tier','T2 (staleness-based)'],['Tone','Consultative \u2014 seasonal angles'],['Goal','Determine if project is still viable']],
    note:'Significantly stale. Sales uses seasonal angles (e.g., "before rainy season") and checks if conditions have changed. May need a site revisit to update the proposal. Binary question: still interested or close it out?'
  },
  'p4__t4d': {
    title:'STALENESS: ANCIENT', sub:'P4 \u2192 T4-D 365+ Days \u2014 Resurrection',
    m:[['Window','365+ days since tstamp_sent'],['Script','T4-D \u2014 Resurrection, upfront about timeline'],['Tier','T4 (special case)'],['Tone','Low pressure \u2014 archival framing'],['Win rate','Very low \u2014 last resort'],['Goal','Qualify out or refresh']],
    note:'Over a year old. These proposals are likely dead but worth one attempt. Sales frames it as "cleaning up records" and checks if the property still needs work. Most will qualify out, but some resurrect.'
  }
};

/* scriptselect-render.js — rendering functions for Script Selection graph */

// =====================================================
// EDGE GEOMETRY
// =====================================================
function clipToBorder(n, tx, ty) {
  var shape = NODE_SHAPES[n.id] || 'leaf';
  var dx = tx - n.x, dy = ty - n.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return {x: n.x, y: n.y + 23};
  if (shape === 'diamond') {
    var s = 48, sw = s * 1.3;
    var scale = 1.0 / ((Math.abs(dx) || 0.001) / sw + (Math.abs(dy) || 0.001) / s);
    return {x: n.x + dx * scale, y: n.y + dy * scale};
  }
  var hw, hh;
  if (shape === 'keyrule') { hw = 95; hh = 36; }
  else { hw = 70; hh = 23; }
  var scaleX = hw / (Math.abs(dx) || 0.001), scaleY = hh / (Math.abs(dy) || 0.001);
  var scale = Math.min(scaleX, scaleY);
  return {x: n.x + dx * scale, y: n.y + dy * scale};
}

function makeEdgePath(x1, y1, x2, y2, perpOff) {
  if (perpOff) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
    x1 += -dy / len * perpOff; y1 += dx / len * perpOff;
    x2 += -dy / len * perpOff; y2 += dx / len * perpOff;
  }
  var dy2 = y2 - y1;
  return {x1:x1, y1:y1, cp1x:x1, cp1y:y1 + dy2 * .5, cp2x:x2, cp2y:y2 - dy2 * .5, x2:x2, y2:y2};
}

// =====================================================
// NODE SVG SHAPES
// =====================================================
function drawDiamond(n) {
  var s = 48, sw = s * 1.3;
  var g = svgEl('g', {id: 'node-' + n.id, cursor: 'grab', 'pointer-events': 'all'});
  // Outer glow for hub pulse effect
  g.appendChild(svgEl('polygon', {
    points: n.x + ',' + (n.y - s) + ' ' + (n.x + sw) + ',' + n.y + ' ' + n.x + ',' + (n.y + s) + ' ' + (n.x - sw) + ',' + n.y,
    fill: 'none', stroke: n.c, 'stroke-width': '2', 'stroke-opacity': '0',
    'class': 'diamond-glow'
  }));
  // Diamond polygon
  g.appendChild(svgEl('polygon', {
    points: n.x + ',' + (n.y - s) + ' ' + (n.x + sw) + ',' + n.y + ' ' + n.x + ',' + (n.y + s) + ' ' + (n.x - sw) + ',' + n.y,
    fill: n.c + '15', stroke: n.c + '60', 'stroke-width': '1.5'
  }));
  // Inner subtle glow line
  g.appendChild(svgEl('polygon', {
    points: n.x + ',' + (n.y - s) + ' ' + (n.x + sw) + ',' + n.y + ' ' + n.x + ',' + (n.y + s) + ' ' + (n.x - sw) + ',' + n.y,
    fill: 'none', stroke: n.c, 'stroke-width': '0.5', 'stroke-opacity': '0.2',
    filter: 'url(#none)'
  }));
  // Priority label
  var label = svgEl('text', {
    x: n.x, y: n.y - 8, fill: n.c,
    'font-family': 'Barlow Condensed, sans-serif', 'font-size': '13',
    'font-weight': '700', 'text-anchor': 'middle', 'letter-spacing': '0.04em'
  });
  label.textContent = n.label;
  g.appendChild(label);
  // Sub text
  var st = svgEl('text', {
    x: n.x, y: n.y + 8, fill: '#b0b0b0',
    'font-family': 'JetBrains Mono, monospace', 'font-size': '9',
    'text-anchor': 'middle', opacity: '0.7'
  });
  st.textContent = n.sub.split('\n')[0];
  g.appendChild(st);
  // Status indicator
  var details = NODE_DETAILS[n.id];
  if (details) {
    g.appendChild(svgEl('circle', {
      cx: n.x, cy: n.y + 20, r: '2.5', fill: details.sc, opacity: '0.8'
    }));
    var statusTxt = svgEl('text', {
      x: n.x, y: n.y + 30, fill: details.sc,
      'font-family': 'JetBrains Mono, monospace', 'font-size': '7',
      'text-anchor': 'middle', opacity: '0.45', 'letter-spacing': '0.1em'
    });
    statusTxt.textContent = details.status;
    g.appendChild(statusTxt);
  }
  return g;
}

function drawLeaf(n) {
  var w = 140, h = 46;
  var g = svgEl('g', {id: 'node-' + n.id, cursor: 'grab', 'pointer-events': 'all'});
  // Main rect
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: '3',
    fill: n.c + '10', stroke: n.c + '40', 'stroke-width': '1'
  }));
  // Left accent border
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: 3, height: h,
    fill: n.c + '80', rx: '1'
  }));
  // Inner glow on left border
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: 1, height: h,
    fill: n.c, opacity: '0.3'
  }));
  // Tier label
  var label = svgEl('text', {
    x: n.x - w / 2 + 14, y: n.y - 4, fill: n.c,
    'font-family': 'Barlow Condensed, sans-serif', 'font-size': '14',
    'font-weight': '700', 'text-anchor': 'start', 'letter-spacing': '0.03em'
  });
  label.textContent = n.label;
  g.appendChild(label);
  // Description (first line)
  var desc = svgEl('text', {
    x: n.x - w / 2 + 14, y: n.y + 10, fill: '#b0b0b0',
    'font-family': 'JetBrains Mono, monospace', 'font-size': '8.5',
    'text-anchor': 'start', opacity: '0.7'
  });
  desc.textContent = n.sub.split('\n')[0];
  g.appendChild(desc);
  // Second line
  var lines = n.sub.split('\n');
  if (lines.length > 1) {
    var desc2 = svgEl('text', {
      x: n.x - w / 2 + 14, y: n.y + 19, fill: '#b0b0b0',
      'font-family': 'JetBrains Mono, monospace', 'font-size': '8',
      'text-anchor': 'start', opacity: '0.5'
    });
    desc2.textContent = lines[1];
    g.appendChild(desc2);
  }
  // Status LED
  var details = NODE_DETAILS[n.id];
  if (details) {
    g.appendChild(svgEl('circle', {
      cx: n.x + w / 2 - 12, cy: n.y - h / 2 + 10, r: '2.5',
      fill: details.sc, opacity: '0.7'
    }));
  }
  return g;
}

function drawKeyRule(n) {
  var w = 190, h = 72;
  var g = svgEl('g', {id: 'node-' + n.id, cursor: 'grab', 'pointer-events': 'all'});
  // Outer glow rect
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2 - 2, y: n.y - h / 2 - 2, width: w + 4, height: h + 4, rx: '5',
    fill: 'none', stroke: n.c + '25', 'stroke-width': '1', 'stroke-dasharray': '4,3'
  }));
  // Main rect
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: '4',
    fill: n.c + '12', stroke: n.c + '50', 'stroke-width': '1.5'
  }));
  // Star icon
  var starY = n.y - h / 2 + 14;
  var starPath = svgEl('text', {
    x: n.x - w / 2 + 14, y: starY, fill: n.c,
    'font-size': '14', 'text-anchor': 'middle', opacity: '0.9'
  });
  starPath.textContent = '\u2605';
  g.appendChild(starPath);
  // "KEY RULE" label
  var label = svgEl('text', {
    x: n.x - w / 2 + 26, y: starY, fill: n.c,
    'font-family': 'Barlow Condensed, sans-serif', 'font-size': '14',
    'font-weight': '700', 'text-anchor': 'start', 'letter-spacing': '0.06em'
  });
  label.textContent = 'KEY RULE';
  g.appendChild(label);
  // Rule text lines
  var lines = n.sub.split('\n');
  lines.forEach(function(line, i) {
    var lt = svgEl('text', {
      x: n.x - w / 2 + 14, y: n.y - h / 2 + 28 + i * 12,
      fill: i === 0 ? '#ffffff' : '#b0b0b0',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': i === 0 ? '10' : '8.5',
      'text-anchor': 'start', opacity: i === 0 ? '0.9' : '0.55',
      'font-weight': i === 0 ? '700' : '400'
    });
    lt.textContent = line;
    g.appendChild(lt);
  });
  return g;
}

/* scriptselect-main.js — setup, edges, nodes, drag, tooltips, animation */

// =====================================================
// SETUP
// =====================================================
restorePositions(NODES, STORAGE_KEY);

var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });

var edgeSvg  = document.getElementById('edgeSvg');
var nodeSvg  = document.getElementById('nodeSvg');
var pctx     = document.getElementById('partCvs').getContext('2d');

// -- Regions --
addRegion(edgeSvg, 520, 150, 880, 200, '#ff4040', 'P1 \u2014 OVERRIDE',  'Highest priority \u2014 check first');
addRegion(edgeSvg, 620, 385, 420, 180, '#ee9612', 'P2 \u2014 GUARD',     'Human rep recency check');
addRegion(edgeSvg, 320, 565, 1010,200, '#60be35', 'P3 \u2014 HISTORY',   'Client email reply analysis');
addRegion(edgeSvg, 520, 810, 760, 190, '#e95400', 'P4 \u2014 STALENESS', 'Days since sent \u2014 fallback');

// "FIRST MATCH WINS" annotation
(function() {
  var g = svgEl('g', {});
  g.appendChild(svgEl('rect', {
    x: '820', y: '8', width: '280', height: '22', rx: '3',
    fill: '#9f00fa12', stroke: '#9f00fa40', 'stroke-width': '1'
  }));
  var t = svgEl('text', {
    x: '960', y: '23', fill: '#9f00fa',
    'font-family': 'Barlow Condensed, sans-serif', 'font-size': '13',
    'font-weight': '700', 'text-anchor': 'middle', 'letter-spacing': '0.18em'
  });
  t.textContent = '\u25C8  FIRST MATCH WINS  \u2014  PRIORITY CASCADE  \u25C8';
  g.appendChild(t);
  edgeSvg.appendChild(g);
})();

// -- Arrow markers --
var defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#d36eff','#585858'].forEach(function(col) {
  var m = svgEl('marker', {id: 'arr' + col.slice(1),
    markerUnits: 'userSpaceOnUse', markerWidth: '8', markerHeight: '6',
    refX: '7', refY: '3', orient: 'auto'});
  m.appendChild(svgEl('path', {d: 'M0,0 L8,3 L0,6 Z', fill: col + 'bb'}));
  defs.appendChild(m);
});
var style = svgEl('style', {});
style.textContent = '@keyframes diamond-pulse{0%{filter:drop-shadow(0 0 0 rgba(159,0,250,.5))}50%{filter:drop-shadow(0 0 8px rgba(159,0,250,.3))}100%{filter:drop-shadow(0 0 0 rgba(159,0,250,.5))}}';
defs.appendChild(style);
edgeSvg.insertBefore(defs, edgeSvg.firstChild);

// =====================================================
// EDGES
// =====================================================
var allEdges = [];
EDGES.forEach(function(e) {
  var n1 = nm[e.f], n2 = nm[e.t];
  if (!n1 || !n2) return;
  var b1 = clipToBorder(n1, n2.x, n2.y);
  var b2 = clipToBorder(n2, n1.x, n1.y);
  var fwd = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff || 0);
  allEdges.push({f:e.f, t:e.t, c:e.c, lbl:e.lbl, spd:e.spd, poff:e.poff,
    x1:fwd.x1, y1:fwd.y1, cp1x:fwd.cp1x, cp1y:fwd.cp1y,
    cp2x:fwd.cp2x, cp2y:fwd.cp2y, x2:fwd.x2, y2:fwd.y2, rev:false});
});

allEdges.forEach(function(e) {
  var d = 'M ' + e.x1 + ',' + e.y1 + ' C ' + e.cp1x + ',' + e.cp1y + ' ' + e.cp2x + ',' + e.cp2y + ' ' + e.x2 + ',' + e.y2;
  e._glow = svgEl('path', {d:d, fill:'none', stroke:e.c, 'stroke-width':'6', 'stroke-opacity':'0.05'});
  edgeSvg.appendChild(e._glow);
  var dash = e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6');
  e._main = svgEl('path', {d:d, fill:'none', stroke:e.c,
    'stroke-width': e.spd >= 4 ? '2' : '1.5', 'stroke-opacity': '0.42',
    'stroke-dasharray': dash, 'marker-end': 'url(#arr' + e.c.slice(1) + ')'});
  edgeSvg.appendChild(e._main);
  if (e.lbl) {
    var mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, .5);
    e._lblBg = svgEl('text', {x:mp.x, y:mp.y - 5, fill:'#141414', 'font-size':'8',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle',
      stroke:'#141414', 'stroke-width':'3', 'stroke-linejoin':'round'});
    e._lblBg.textContent = e.lbl; edgeSvg.appendChild(e._lblBg);
    e._lblTx = svgEl('text', {x:mp.x, y:mp.y - 5, fill:e.c, 'font-size':'8',
      'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle',
      opacity:'0.75', 'letter-spacing':'0.06em'});
    e._lblTx.textContent = e.lbl; edgeSvg.appendChild(e._lblTx);
  }
  // Hit-area for edge hover
  e._hitPath = svgEl('path', {d:d, fill:'none', stroke:'transparent', 'stroke-width':'18', 'pointer-events':'stroke', cursor:'pointer'});
  edgeSvg.appendChild(e._hitPath);
  (function(edge) {
    edge._hitPath.addEventListener('mouseenter', function(ev) { showEdgeTooltip(edge, ev); });
    edge._hitPath.addEventListener('mousemove', function(ev) { moveTooltip(ev); });
    edge._hitPath.addEventListener('mouseleave', function() { hideTooltip(); });
  })(e);
});

function rebuildEdgesForNode(nodeId) {
  allEdges.forEach(function(e) {
    if (e.f !== nodeId && e.t !== nodeId) return;
    var b1 = clipToBorder(nm[e.f], nm[e.t].x, nm[e.t].y);
    var b2 = clipToBorder(nm[e.t], nm[e.f].x, nm[e.f].y);
    var ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff || 0);
    e.x1 = ep.x1; e.y1 = ep.y1; e.cp1x = ep.cp1x; e.cp1y = ep.cp1y;
    e.cp2x = ep.cp2x; e.cp2y = ep.cp2y; e.x2 = ep.x2; e.y2 = ep.y2;
    var d = 'M ' + ep.x1 + ',' + ep.y1 + ' C ' + ep.cp1x + ',' + ep.cp1y +
            ' ' + ep.cp2x + ',' + ep.cp2y + ' ' + ep.x2 + ',' + ep.y2;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hitPath) e._hitPath.setAttribute('d', d);
    if (e._lblBg) {
      var mp = cbPt(ep.x1, ep.y1, ep.cp1x, ep.cp1y, ep.cp2x, ep.cp2y, ep.x2, ep.y2, .5);
      e._lblBg.setAttribute('x', mp.x); e._lblBg.setAttribute('y', mp.y - 5);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x); e._lblTx.setAttribute('y', mp.y - 5); }
    }
  });
}

// =====================================================
// NODES
// =====================================================
var nodeGroups = {};
var edgeHighlight = [];
allEdges.forEach(function(e) {
  if (e._main) edgeHighlight.push({el: e._main, from: e.f, to: e.t, baseOp: '0.42'});
});

function attachNodeEvents(g, n) {
  g.addEventListener('mouseenter', function(e2) {
    if (dragState.id) return;
    var conn = {}; conn[n.id] = true;
    EDGES.forEach(function(e) {
      if (e.f === n.id) conn[e.t] = true;
      if (e.t === n.id) conn[e.f] = true;
    });
    NODES.forEach(function(nd) {
      var grp = nodeGroups[nd.id];
      if (grp) grp.setAttribute('opacity', conn[nd.id] ? '1' : '0.15');
    });
    edgeHighlight.forEach(function(item) {
      item.el.setAttribute('stroke-opacity', (item.from === n.id || item.to === n.id) ? '0.9' : '0.025');
    });
    showTooltip(n, e2);
  });
  g.addEventListener('mousemove', function(e2) { if (!dragState.id) moveTooltip(e2); });
  g.addEventListener('mouseleave', function() {
    if (dragState.id) return;
    NODES.forEach(function(nd) { var grp = nodeGroups[nd.id]; if (grp) grp.setAttribute('opacity', '1'); });
    edgeHighlight.forEach(function(item) { item.el.setAttribute('stroke-opacity', item.baseOp); });
    hideTooltip();
  });
  g.addEventListener('mousedown', function(e2) { startDrag(e2, n.id); });
}

NODES.forEach(function(n) {
  var shape = NODE_SHAPES[n.id] || 'leaf';
  var g = shape === 'diamond' ? drawDiamond(n) : shape === 'keyrule' ? drawKeyRule(n) : drawLeaf(n);
  nodeGroups[n.id] = g;
  attachNodeEvents(g, n);
  nodeSvg.appendChild(g);
});

// =====================================================
// UPDATE NODE POSITION (for drag)
// =====================================================
function updateNodePosition(nodeId) {
  var n = nm[nodeId], g = nodeGroups[nodeId];
  if (!g || !n) return;
  var shape = NODE_SHAPES[nodeId] || 'leaf';
  var parent = g.parentNode, nextSibling = g.nextSibling;
  parent.removeChild(g);
  var newG = shape === 'diamond' ? drawDiamond(n) : shape === 'keyrule' ? drawKeyRule(n) : drawLeaf(n);
  nodeGroups[nodeId] = newG;
  attachNodeEvents(newG, n);
  if (nextSibling) parent.insertBefore(newG, nextSibling);
  else parent.appendChild(newG);
}

/* scriptselect-ui.js — drag, tooltips, particles, animation */

// =====================================================
// DIAMOND PULSE ANIMATION
// =====================================================
(function() {
  var pulsePhase = 0;
  var hubNodes = NODES.filter(function(n) { return n.hub; });
  function animatePulse() {
    pulsePhase += 0.02;
    var opacity = 0.15 + Math.sin(pulsePhase) * 0.15;
    hubNodes.forEach(function(n) {
      var g = nodeGroups[n.id];
      if (!g || dragState.id === n.id) return;
      var glow = g.querySelector('.diamond-glow');
      if (glow) {
        glow.setAttribute('stroke-opacity', Math.max(0, opacity).toFixed(3));
        glow.setAttribute('stroke-width', (3 + Math.sin(pulsePhase) * 2).toFixed(1));
      }
    });
    requestAnimationFrame(animatePulse);
  }
  requestAnimationFrame(animatePulse);
})();

// =====================================================
// DRAG
// =====================================================
function startDrag(e, nodeId) {
  hideTooltip();
  var wrap = document.getElementById('graphWrap');
  dragState.id = nodeId;
  dragState.startMx = e.clientX;
  dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x;
  dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft;
  dragState.scrollY = wrap.scrollTop;
  NODES.forEach(function(nd) {
    var grp = nodeGroups[nd.id];
    if (grp) grp.setAttribute('opacity', '1');
  });
  edgeHighlight.forEach(function(item) { item.el.setAttribute('stroke-opacity', item.baseOp); });
  e.preventDefault();
  e.stopPropagation();
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
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});

// =====================================================
// TOOLTIP
// =====================================================
function showTooltip(n, e2) {
  var d = NODE_DETAILS[n.id]; if (!d) return;
  document.getElementById('tt-name').textContent = n.label;
  document.getElementById('tt-name').style.color = n.c;
  document.getElementById('tt-role').textContent = d.role;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = d.sc; sdot.style.color = d.sc;
  document.getElementById('tt-sv').textContent = d.status;
  document.getElementById('tt-sv').style.color = d.sc;
  document.getElementById('tt-head-icon').innerHTML = iconLg(getIconId(n.id), n.c);
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) {
      return '<div class="tt-row"><span class="tt-k">' + kv[0] + '</span><span class="tt-v">' + kv[1] + '</span></div>';
    }).join('');
  var sends = EDGES.filter(function(e) { return e.f === n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:' + e.c + '">\u2192</span> <span>' +
      (nm[e.t] ? nm[e.t].label : e.t) + (e.lbl ? ' \u00b7 <em style="color:' + e.c + '">' + e.lbl + '</em>' : '') + '</span></div>';
  }).join('');
  var recvs = EDGES.filter(function(e) { return e.t === n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:' + e.c + '">\u2190</span> <span>' +
      (nm[e.f] ? nm[e.f].label : e.f) + (e.lbl ? ' \u00b7 <em style="color:' + e.c + '">' + e.lbl + '</em>' : '') + '</span></div>';
  }).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends ? '<div class="tt-conn-title">Sends to</div>' + sends : '') +
    (recvs ? '<div class="tt-conn-title" style="margin-top:' + (sends ? 6 : 0) + 'px">Receives from</div>' + recvs : '');
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block';
  moveTooltip(e2);
}

function showEdgeTooltip(e, ev) {
  var key = e.f + '__' + e.t;
  var d = EDGE_DETAILS[key]; if (!d) return;
  document.getElementById('tt-name').textContent = d.title;
  document.getElementById('tt-name').style.color = e.c;
  document.getElementById('tt-role').textContent = d.sub;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = e.c; sdot.style.color = e.c;
  document.getElementById('tt-sv').textContent = 'DECISION';
  document.getElementById('tt-sv').style.color = e.c;
  document.getElementById('tt-head-icon').innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) {
      return '<div class="tt-row"><span class="tt-k">' + kv[0] + '</span><span class="tt-v">' + kv[1] + '</span></div>';
    }).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block';
  moveTooltip(ev);
}

// =====================================================
// PARTICLES
// =====================================================
var particles = [];
allEdges.forEach(function(e) {
  var cnt = e.spd >= 4.5 ? 4 : e.spd >= 3 ? 3 : e.spd >= 2 ? 2 : 1;
  for (var j = 0; j < cnt; j++) particles.push({edge: e, t: j / cnt, trail: []});
});

var lastTime = performance.now();
function animate(now) {
  var dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 1000);
  particles.forEach(function(p) {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    var e = p.edge;
    var pt = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, p.t);
    p.trail.push({x: pt.x, y: pt.y});
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
    pctx.shadowColor = e.c;
    pctx.shadowBlur = e.spd >= 4 ? 14 : 8;
    pctx.fillStyle = e.c;
    pctx.globalAlpha = 1;
    pctx.beginPath();
    pctx.arc(pt.x, pt.y, e.spd >= 4 ? 3.5 : 2.8, 0, Math.PI * 2);
    pctx.fill();
    pctx.restore();
    pctx.globalAlpha = 1;
  });
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
