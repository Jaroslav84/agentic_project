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
