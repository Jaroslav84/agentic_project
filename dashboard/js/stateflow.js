/* stateflow.js — State Flow graph (merged) */

/* stateflow-data.js — data for Worker Lifecycle State Flow diagram */
var STORAGE_KEY = 'phil-pos-stateflow';
var ICONS = {
  booting:  icon('M10,2v6 M5.5,4.5 A7,7 0 1,0 14.5,4.5'),
  ready:    icon('M10,2a8,8 0 1,0 .01,0Z M6,10 L9,13 L14,7'),
  armed:    icon('M10,4a6,6 0 1,0 .01,0Z M10,1v3 M10,16v3 M1,10h3 M16,10h3 M10,7a3,3 0 1,0 .01,0Z'),
  armed_degraded: icon('M10,2 L18,17 H2Z M10,8v4 M10,14v1'),
  incall:   icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z'),
  idle:     icon('M10,2a8,8 0 1,0 .01,0Z M8,7v6 M12,7v6'),
  destroy:  icon('M10,2 C8,5 5,7 5,11 A5,5 0 0,0 15,11 C15,7 12,5 10,2Z M10,18 C8,18 7,16 7,14 C7,12 10,10 10,10 C10,10 13,12 13,14 C13,16 12,18 10,18Z'),
  dead:     icon('M4,4h12v12H4V4z M7,8h1 M12,8h1 M7,12h6 M8,12v1 M10,12v1 M12,12v1'),
  hfail:    icon('M10,2 L18,17 H2Z M10,8v4 M10,14v1'),
  crash:    icon('M11,1 L5,10h5 L9,19 L15,10h-5Z'),
  redial:   icon('M3,3h4v4 M3,3 Q3,10 10,10 M17,17h-4v-4 M17,17 Q17,10 10,10'),
  lognext:  icon('M4,2h8l4,4v12H4V2z M12,2v4h4 M7,10h6 M10,8v6 M8,12l2,2 2,-2')
};

var NODES = [
  {id:'booting',  label:'BOOTING',       sub:'Template restore\n~30\u201345s boot-to-armed',     x:200,  y:200, c:'#ee9612'},
  {id:'ready',    label:'READY',          sub:'Models loaded\nInworld health check pass',        x:400,  y:200, c:'#60be35'},
  {id:'armed',    label:'ARMED',          sub:'Inworld context prewarmed\nDial queued',          x:600,  y:200, c:'#9f00fa'},
  {id:'armed_degraded', label:'ARMED-DEGRADED', sub:'Inworld unreachable\nKokoro fallback active', x:725, y:320, c:'#ee9612', sm:true},
  {id:'incall',   label:'IN_CALL',        sub:'Inworld TTS Mini active\n~550ms e2e latency',     x:850,  y:200, c:'#ff4040'},
  {id:'idle',     label:'IDLE',           sub:'Call complete\nParallelPipeline cooldown',        x:1100, y:200, c:'#9f00fa'},
  {id:'destroy',  label:'DESTROYING',     sub:'RunPod API destroy\nBilling stop',                   x:1350, y:200, c:'#e95400'},
  {id:'dead',     label:'DEAD',           sub:'Worker terminated\nLogs archived',               x:1550, y:200, c:'#585858'},
  {id:'hfail',    label:'HEALTH_FAIL',    sub:'Health check failed\nSTT/TTS/LLM error',        x:600,  y:420, c:'#ff4040', sm:true},
  {id:'crash',    label:'CRASH_DETECT',   sub:'Mid-call failure\nPipeline exception',           x:850,  y:420, c:'#ff4040', sm:true},
  {id:'redial',   label:'QUEUE REDIAL',   sub:'Auto-redial ON\nRe-queue contact',              x:750,  y:540, c:'#ee9612', sm:true},
  {id:'lognext',  label:'LOG + NEXT',     sub:'Auto-redial OFF\nLog error, continue',          x:950,  y:540, c:'#585858', sm:true}
];

var EDGES = [
  {f:'booting', t:'ready',   c:'#60be35', lbl:'models loaded',  spd:1.8},
  {f:'ready',   t:'armed',   c:'#9f00fa', lbl:'preheat',        spd:2.0},
  {f:'armed',   t:'incall',  c:'#ff4040', lbl:'telnyx dial',    spd:3.5},
  {f:'incall',  t:'idle',    c:'#9f00fa', lbl:'hangup',         spd:2.5},
  {f:'idle',    t:'destroy', c:'#e95400', lbl:'batch end',      spd:1.5},
  {f:'destroy', t:'dead',    c:'#585858', lbl:'terminated',     spd:1.0},
  {f:'idle',    t:'armed',   c:'#9f00fa', lbl:'next call',      spd:2.8, arc:'above'},
  {f:'armed',   t:'armed_degraded', c:'#ee9612', lbl:'Inworld fail', spd:1.5, arc:'down'},
  {f:'armed_degraded', t:'incall', c:'#ee9612', lbl:'Kokoro fallback dial', spd:2.0},
  {f:'armed',   t:'hfail',   c:'#ff4040', lbl:'fail',           spd:1.5, arc:'down'},
  {f:'hfail',   t:'booting', c:'#ee9612', lbl:'retry',          spd:1.5, arc:'retry'},
  {f:'hfail',   t:'dead',    c:'#585858', lbl:'max retries',    spd:0.8, arc:'abort'},
  {f:'incall',  t:'incall',  c:'#ff4040', lbl:'turn complete',   spd:2.0, arc:'self'},
  {f:'incall',  t:'crash',   c:'#ff4040', lbl:'crash',          spd:1.5, arc:'down'},
  {f:'crash',   t:'redial',  c:'#ee9612', lbl:'auto-redial ON', spd:1.2},
  {f:'crash',   t:'lognext', c:'#585858', lbl:'auto-redial OFF',spd:1.0}
];

var NODE_DETAILS = {
  booting: {
    role:'Worker Provisioning State', status:'PROVISIONING', sc:'#ee9612',
    m:[['Trigger','SalesClaw batch start'],['Action','RunPod API createPod from template'],['Boot-to-armed','~30\u201345s (no Kokoro boot)'],['GPU','gpu-rtx4000-ada-1 \u00b7 $0.26/hr'],['Template','Pre-baked Pipecat + models on disk'],['Secrets','Env vars injected \u2014 never in image']],
    note:'Ephemeral template-based workers (RunPod US-CA-2). Created per-batch via RunPod API. No local Kokoro boot needed \u2014 TTS via Inworld API. Boot-to-armed ~30\u201345s.'
  },
  ready: {
    role:'Worker Ready State', status:'HEALTHY', sc:'#60be35',
    m:[['Trigger','Template restore complete'],['Health check','STT latency + Inworld TTFA + LLM ping'],['Boot-to-ready','~30\u201345s from template'],['Models','Parakeet RNNT 1.1B + Silero VAD'],['Inworld','TTFA health check \u2014 confirm TTS API reachable'],['Validation','8kHz G.711 test audio through full pipeline']],
    note:'Models loaded and verified. Inworld TTFA health check confirms TTS API reachable. Health check confirms STT/TTS/LLM latencies within threshold before accepting any calls.'
  },
  armed: {
    role:'Worker Armed State', status:'PREHEATED', sc:'#9f00fa',
    m:[['Trigger','Health check pass'],['Action','Claude Sonnet preheated \u00b7 ~45k tokens loaded'],['Pre-render','First turn + VM + 2 responses cached via Inworld TTS'],['Preheat time','~2s before each call'],['Model','claude-sonnet-4-6 (Anthropic API)'],['Queue','Next propID from SalesClaw batch'],['Note','Kokoro not started at boot \u2014 Inworld is primary TTS']],
    note:'Claude context window loaded with full spec + deal context. First-turn audio pre-rendered by Inworld TTS for ~200ms playback start. Kokoro not started at boot. Ready to dial.'
  },
  armed_degraded: {
    role:'ARMED-DEGRADED \u00b7 Inworld Unreachable', status:'DEGRADED', sc:'#ee9612',
    m:[['Trigger','Inworld TTFA health check fails'],['Fallback','Kokoro TTS activated as local fallback'],['Inworld','Unreachable \u2014 API timeout or error'],['TTS','Will use Kokoro for all TTS this call'],['Alert','Matrix: Inworld down, Kokoro fallback'],['Latency','Kokoro p50 ~420ms (vs Inworld ~550ms)']],
    note:'Transitional degraded state. Inworld TTS API unreachable during preheat. Worker falls back to local Kokoro for TTS. Calls still proceed but with fallback voice quality. Returns to normal ARMED on next successful Inworld health check.'
  },
  incall: {
    role:'Active Call State', status:'LIVE AUDIO', sc:'#ff4040',
    m:[['Pipeline','Telnyx SIP \u2192 VAD \u2192 Parakeet \u2192 Sonnet \u2192 Inworld TTS \u2192 Telnyx'],['p50 latency','~550ms end-to-end'],['STT','Parakeet RNNT streaming \u00b7 ~0ms marginal'],['TTS','Inworld TTS streaming \u00b7 ~200ms first chunk'],['VAD','Silero \u00b7 200ms silence threshold'],['Barge-in','500ms client speech \u2192 interrupt Sales'],['Recording','Dual-channel stereo \u2192 DO Spaces']],
    note:'Voice pipeline fully active. Sequential \u2014 only one call at a time. Audio streams to sales-app in real-time for recording survival if worker crashes.'
  },
  idle: {
    role:'Worker Idle State', status:'WAITING', sc:'#9f00fa',
    m:[['Trigger','Call hangup (client or Sales)'],['Post-call','Haiku extraction \u00b7 HubSpot sync \u00b7 Attribution write'],['Duration','Until next call or batch end'],['Loop','\u2192 ARMED for next call in batch'],['Exit','\u2192 DESTROYING when batch exhausted'],['Attribution','manager_userID=7225 written on warm transfer']],
    note:'Between calls. Post-call processing runs asynchronously. Worker loops back to ARMED for next queued call, or proceeds to DESTROYING when batch is complete.'
  },
  destroy: {
    role:'Worker Teardown State', status:'DESTROYING', sc:'#e95400',
    m:[['Trigger','Batch complete OR manual kill'],['Action','RunPod API terminatePod (not stop)'],['Billing','Stops immediately on terminate'],['Cost','$0.26/hr \u2014 billed per second'],['Logs','Archived to sales-app before destroy'],['Recordings','Already streamed to DO Spaces']],
    note:'Terminate, not stop. RunPod bills per second \u2014 immediate termination minimizes cost. All recordings and logs already persisted before this state.'
  },
  dead: {
    role:'Terminal State', status:'TERMINATED', sc:'#585858',
    m:[['State','Final \u2014 no transitions out'],['Worker','Fully terminated on RunPod'],['Logs','Archived on sales-app PostgreSQL'],['Recordings','Persisted in DO Spaces'],['Cost','$0.00 \u2014 resource fully released'],['Next batch','New worker created from template']],
    note:'Worker no longer exists. All state persisted to sales-app and DO Spaces. Next batch creates a brand new worker from the latest RunPod template.'
  },
  hfail: {
    role:'Health Check Failure', status:'FAILED', sc:'#ff4040',
    m:[['Trigger','STT/TTS/LLM health check fails'],['Retry','Destroy worker \u2192 spin new from template \u2192 retry once'],['Abort','2nd failure \u2192 abort batch'],['Common cause','Model load timeout \u00b7 GPU memory error'],['Alert','Matrix alert: \u26a0\ufe0f Health check failed 2x \u2014 batch aborted'],['Thresholds','Configurable per component in Controller']],
    note:'Health check verifies all three inference models against configurable latency thresholds (set in Controller). Fail \u2192 destroy worker, spin new one, retry once. Second fail \u2192 abort entire batch, Matrix alert to Alex.'
  },
  crash: {
    role:'Mid-Call Crash Detection', status:'DETECTED', sc:'#ff4040',
    m:[['Trigger','Worker dies during live call'],['Detection','sales-app detects WebSocket disconnect + keep-alive timeout (~5s)'],['Crash intel','Telnyx call answered + STT transcript exists \u2192 mid-conversation drop'],['Crash intel','No answered call or no transcript \u2192 call never connected'],['Recording','Audio survives \u2014 streamed to sales-app in real-time'],['Alert','High-priority Matrix alert to Alex']],
    note:'sales-app detects worker death via WebSocket disconnect and ~5s keep-alive timeout. Crash intelligence: if Telnyx reported answered + STT transcript exists, it was a mid-conversation drop. If not, call never connected. All audio preserved on sales-app.'
  },
  redial: {
    role:'Automatic Redial Queue', status:'QUEUED', sc:'#ee9612',
    m:[['Trigger','Crash with auto-redial toggle ON'],['Action','Redial immediately with context preserved'],['Context','Crash intelligence: mid-conversation vs never connected'],['Toggle','Controller setting \u2014 OFF by default for initial weeks of v1'],['Transcript','All audio + transcript preserved on sales-app'],['Alert','Matrix alert to Alex']],
    note:'When auto-redial is ON in Controller, the worker redials with conversation context preserved. Crash intelligence determines if client was mid-conversation (worse) or call never connected (safe to retry fresh). Toggle OFF by default during initial v1 deployment.'
  },
  lognext: {
    role:'Log Error and Continue', status:'LOGGED', sc:'#585858',
    m:[['Trigger','Crash with auto-redial toggle OFF'],['Action','Log crash + notify Alex via Matrix'],['DB','Crash event written to PostgreSQL call_log'],['Matrix','Error posted to #errors channel'],['Contact','Alex decides whether to manually re-queue'],['Resume','Worker returns to IDLE \u2192 ARMED for next call']],
    note:'When auto-redial is OFF (default for initial v1), the crash is logged to PostgreSQL, posted to Matrix #errors, and Alex decides next steps. Worker continues with remaining calls in the batch.'
  }
};

var EDGE_DETAILS = {
  'booting__ready': {
    title:'MODELS LOADED', sub:'Booting \u2192 Ready',
    m:[['Boot time','~30\u201345s from template'],['Parakeet','RNNT 1.1B loaded to GPU VRAM (localhost:8001)'],['Inworld','TTFA health check pass'],['Signal','HTTP POST "ready" to sales-app']],
    note:'Pod boots from RunPod template. systemd starts Parakeet, Inworld TTFA health check runs. No local Kokoro boot needed. Worker signals ready.'
  },
  'ready__armed': {
    title:'PREHEAT', sub:'Ready \u2192 Armed',
    m:[['Claude','Pre-render first turn text + VM text + 2 fallbacks'],['Inworld','Render all cached text \u2192 audio bytes via Inworld TTS'],['Duration','~30\u201360s pre-render'],['Signal','HTTP POST "armed" to sales-app']],
    note:'Claude generates opening lines, Inworld renders to audio. All cached in memory for instant playback. Worker is now ready to dial.'
  },
  'armed__incall': {
    title:'TELNYX DIAL', sub:'Armed \u2192 In Call',
    m:[['Provider','Telnyx SIP trunk + WebSocket'],['AMD','Answer Machine Detection enabled'],['Audio','Dual-channel RTP streaming'],['Control','Worker owns all Telnyx call legs']],
    note:'Worker dials client via Telnyx. All call control stays on worker during live call \u2014 Backend is idle.'
  },
  'incall__idle': {
    title:'HANGUP', sub:'In Call \u2192 Idle',
    m:[['Post-call','Haiku async extraction \u00b7 attribution write'],['Recording','Dual-channel audio \u2192 DO Spaces via sales-app'],['Updates','PostgreSQL + HubSpot + FieldTECH'],['Gap','~30\u201360s between calls']],
    note:'Call ends. Post-call processing: Haiku extracts sentiment/intent, attribution written, recording saved. Worker stays alive for next call.'
  },
  'idle__destroy': {
    title:'BATCH END', sub:'Idle \u2192 Destroying',
    m:[['Trigger','Last call in batch completed'],['API','RunPod terminatePod mutation'],['Billing','Stops on terminate (not stop)'],['Logged','Worker hours \u2192 PostgreSQL cost tracking']],
    note:'SalesClaw terminates worker after last call. GPU billing stops immediately. Never stop \u2014 always terminate.'
  },
  'destroy__dead': {
    title:'TERMINATED', sub:'Destroying \u2192 Dead',
    m:[['State','Pod fully terminated'],['Cost logged','$0.26/hr \u00d7 active hours'],['No recovery','Worker gone \u2014 new template needed for next batch']],
    note:'Terminal state. Worker terminated, billing stopped, hours logged. Next batch creates fresh worker from RunPod template.'
  },
  'idle__armed': {
    title:'NEXT CALL', sub:'Idle \u2192 Armed',
    m:[['Context','SalesClaw sends next proposal data'],['Preheat','Claude pre-renders new first turn + VM'],['Inworld','Caches new audio bytes via Inworld TTS'],['Duration','~30\u201360s']],
    note:'Same worker handles next call in batch. No re-spinup needed \u2014 just new pre-render cycle.'
  },
  'armed__armed_degraded': {
    title:'INWORLD FAIL', sub:'Armed \u2192 Armed-Degraded',
    m:[['Trigger','Inworld TTFA health check fails or times out'],['Fallback','Switch to local Kokoro TTS'],['Latency','Kokoro p50 ~420ms vs Inworld ~550ms'],['Alert','Matrix: Inworld unreachable, Kokoro fallback active']],
    note:'Inworld TTS unreachable during preheat. Worker degrades to Kokoro fallback for TTS. Calls still proceed but with local model.'
  },
  'armed_degraded__incall': {
    title:'KOKORO FALLBACK DIAL', sub:'Armed-Degraded \u2192 In Call',
    m:[['Provider','Telnyx SIP trunk + WebSocket'],['TTS','Kokoro local fallback (not Inworld)'],['Pipeline','VAD \u2192 RNNT \u2192 Claude \u2192 Kokoro \u2192 Telnyx'],['Note','Degraded quality \u2014 Inworld preferred when available']],
    note:'Worker dials using Kokoro as fallback TTS. Call proceeds normally but without Inworld voice quality. Transitional state.'
  },
  'armed__hfail': {
    title:'HEALTH CHECK FAIL', sub:'Armed \u2192 Health Fail',
    m:[['STT test','Synthetic 8kHz G.711 audio \u2192 accuracy check'],['LLM test','Claude first-token latency check'],['TTS test','Inworld TTFA latency check'],['Thresholds','Configurable in Controller']],
    note:'Pre-batch health check failed. STT accuracy or Inworld TTFA latency below threshold. Worker will be destroyed.'
  },
  'hfail__booting': {
    title:'RETRY', sub:'Health Fail \u2192 Booting (new worker)',
    m:[['Action','Destroy failed worker \u00b7 spin new from template'],['Retries','One retry allowed'],['Delay','~2\u20134 min for new worker boot'],['Buffer','5-min pre-batch buffer accounts for this']],
    note:'Failed worker destroyed, new one created from same RunPod template. If second also fails \u2192 batch aborted.'
  },
  'hfail__dead': {
    title:'MAX RETRIES', sub:'Health Fail \u2192 Dead',
    m:[['Trigger','2nd consecutive health check failure'],['Action','Batch aborted'],['Alert','Matrix: \u26a0\ufe0f Health check failed 2x \u2014 batch aborted'],['Recovery','Alex checks GPU availability manually']],
    note:'Two consecutive health check failures. Batch aborted entirely. Matrix alert sent to Alex.'
  },
  'incall__incall': {
    title:'TURN COMPLETE', sub:'In Call \u2192 In Call (loop)',
    m:[['Pipeline','VAD \u2192 RNNT \u2192 Claude \u2192 Inworld TTS \u2192 Resample \u2192 Telnyx'],['p50 latency','~550ms end-to-end turn'],['p95 latency','~750ms (800ms hard ceiling)'],['Loop','Continuous until hangup or transfer']],
    note:'Each conversation turn loops through the full voice pipeline. Pre-rendered first turn is ~200ms, subsequent turns ~550ms p50.'
  },
  'incall__crash': {
    title:'CRASH', sub:'In Call \u2192 Crash Detected',
    m:[['Detection','WebSocket disconnect + 5s keepalive timeout'],['Intelligence','answered + transcript = mid-conversation drop'],['Audio preserved','All transcript + audio streamed to sales-app in real-time'],['Circuit breaker','3+ crashes in batch \u2192 abort remaining']],
    note:'Worker dies during live call. sales-app detects via WebSocket timeout. Crash intelligence determines if client was mid-conversation.'
  },
  'crash__redial': {
    title:'AUTO-REDIAL ON', sub:'Crash \u2192 Redial',
    m:[['Context','Full prior transcript injected into new Claude context'],['Sales opens','"Sorry about that, looks like the call dropped"'],['Max retries','1 per contact per batch'],['Worker','Same if recovered, or new (~2\u20133 min delay)']],
    note:'Auto-redial enabled (off by default v1). Sales calls back with full conversation history. Max 1 retry per contact.'
  },
  'crash__lognext': {
    title:'AUTO-REDIAL OFF', sub:'Crash \u2192 Log/Next',
    m:[['Logged','Full transcript-to-crash-point \u2192 PostgreSQL'],['Alert','Matrix #errors with crash details'],['Next','Move to next call in batch'],['Review','Alex reviews manually']],
    note:'Default v1 behavior. Crash logged with full context, Matrix alert sent, move to next call.'
  }
};
var PSEUDO_EDGES = [
  {f:'_init', t:'booting', c:'#ffffff', lbl:'', spd:1.0, pseudo:true},
  {f:'dead',  t:'_final',  c:'#585858', lbl:'', spd:0.6, pseudo:true}
];

/* stateflow-render.js — edge path computation + UML state rendering */

function clipToBorder(n, tx, ty) {
  if (n.id === '_init') {
    var dx = tx - n.x, dy = ty - n.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {x: n.x + dx / len * 10, y: n.y + dy / len * 10};
  }
  if (n.id === '_final') {
    var dx = tx - n.x, dy = ty - n.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {x: n.x + dx / len * 12, y: n.y + dy / len * 12};
  }
  var w = n.sm ? 140 : 160, h = n.sm ? 50 : 60;
  var hw = w / 2, hh = h / 2;
  var dx = tx - n.x, dy = ty - n.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return {x: n.x, y: n.y + hh};
  var scaleX = hw / (Math.abs(dx) || 0.001), scaleY = hh / (Math.abs(dy) || 0.001);
  var scale = Math.min(scaleX, scaleY);
  return {x: n.x + dx * scale, y: n.y + dy * scale};
}

function computeEdgePath(e) {
  var n1 = nm[e.f], n2 = nm[e.t];
  if (!n1 || !n2) return null;
  var cp1x, cp1y, cp2x, cp2y, b1, b2;
  if (e.arc === 'self') {
    cp1x = n1.x + 80; cp1y = n1.y - 90;
    cp2x = n1.x - 80; cp2y = n1.y - 90;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n1, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else if (e.arc === 'above') {
    cp1x = n1.x - 100; cp1y = 0;
    cp2x = n2.x + 100; cp2y = 0;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n2, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else if (e.arc === 'down') {
    var dx = n2.x - n1.x;
    cp1x = n1.x + dx * 0.2; cp1y = n1.y + 60;
    cp2x = n1.x + dx * 0.8; cp2y = n2.y - 60;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n2, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else if (e.arc === 'retry') {
    cp1x = n1.x - 120; cp1y = n1.y + 100;
    cp2x = n2.x + 80;  cp2y = n2.y + 160;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n2, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else if (e.arc === 'abort') {
    cp1x = n1.x + 200; cp1y = n1.y + 120;
    cp2x = n2.x - 200; cp2y = n2.y + 120;
    b1 = clipToBorder(n1, cp1x, cp1y);
    b2 = clipToBorder(n2, cp2x, cp2y);
    return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
  } else {
    b1 = clipToBorder(n1, n2.x, n2.y);
    b2 = clipToBorder(n2, n1.x, n1.y);
    var dx2 = b2.x - b1.x;
    cp1x = b1.x + dx2 * 0.5; cp1y = b1.y;
    cp2x = b1.x + dx2 * 0.5; cp2y = b2.y;
  }
  return {x1:b1.x, y1:b1.y, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:b2.x, y2:b2.y};
}

function renderState(n) {
  var w = n.sm ? 140 : 160, h = n.sm ? 50 : 60;
  var g = svgEl('g', {id: 'state-' + n.id, cursor: 'grab', 'pointer-events': 'all'});
  g.setAttribute('transform', 'translate(0,0)');
  // Shadow
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2 + 2, y: n.y - h / 2 + 2, width: w, height: h, rx: '12',
    fill: '#000000', opacity: '0.3'
  }));
  // State body
  g.appendChild(svgEl('rect', {
    x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: '12',
    fill: n.c + '15', stroke: n.c + '60', 'stroke-width': '1.5'
  }));
  // Compartment divider
  var lineY = n.y - h / 2 + (n.sm ? 20 : 22);
  g.appendChild(svgEl('line', {
    x1: n.x - w / 2 + 8, y1: lineY, x2: n.x + w / 2 - 8, y2: lineY,
    stroke: n.c + '30', 'stroke-width': '0.5'
  }));
  // State name
  var name = svgEl('text', {
    x: n.x, y: n.y - h / 2 + (n.sm ? 14 : 16), fill: n.c,
    'font-family': 'Barlow Condensed, sans-serif',
    'font-size': n.sm ? '12' : '14', 'font-weight': '700',
    'text-anchor': 'middle', 'letter-spacing': '0.04em'
  });
  name.textContent = n.label;
  g.appendChild(name);
  // Description lines
  n.sub.split('\n').forEach(function(line, i) {
    var t = svgEl('text', {
      x: n.x, y: lineY + 11 + i * 11, fill: '#b0b0b0',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': n.sm ? '8.5' : '9.5', 'text-anchor': 'middle', opacity: '0.7'
    });
    t.textContent = line;
    g.appendChild(t);
  });
  // Status LED + text
  var details = NODE_DETAILS[n.id];
  if (details) {
    g.appendChild(svgEl('circle', {
      cx: n.x - w / 2 + 10, cy: n.y + h / 2 - 8, r: '2.5',
      fill: details.sc, filter: 'drop-shadow(0 0 3px ' + details.sc + ')'
    }));
    var st = svgEl('text', {
      x: n.x - w / 2 + 16, y: n.y + h / 2 - 5, fill: details.sc + '80',
      'font-family': 'JetBrains Mono, monospace',
      'font-size': '8.5', 'letter-spacing': '0.1em'
    });
    st.textContent = details.status;
    g.appendChild(st);
  }
  g._nodeId = n.id; g._w = w; g._h = h;
  return g;
}

function updateStatePosition(n) {
  var g = stateGroups[n.id];
  if (!g) return;
  var w = g._w, h = g._h, ch = g.childNodes;
  var details = NODE_DETAILS[n.id];
  var lineY = n.y - h / 2 + (n.sm ? 20 : 22);
  var ci = 0;
  // Shadow
  ch[ci].setAttribute('x', n.x - w / 2 + 2); ch[ci].setAttribute('y', n.y - h / 2 + 2); ci++;
  // Main rect
  ch[ci].setAttribute('x', n.x - w / 2); ch[ci].setAttribute('y', n.y - h / 2); ci++;
  // Compartment line
  ch[ci].setAttribute('x1', n.x - w / 2 + 8); ch[ci].setAttribute('y1', lineY);
  ch[ci].setAttribute('x2', n.x + w / 2 - 8); ch[ci].setAttribute('y2', lineY); ci++;
  // State name
  ch[ci].setAttribute('x', n.x); ch[ci].setAttribute('y', n.y - h / 2 + (n.sm ? 14 : 16)); ci++;
  // Description lines
  n.sub.split('\n').forEach(function(line, i) {
    ch[ci].setAttribute('x', n.x); ch[ci].setAttribute('y', lineY + 11 + i * 11); ci++;
  });
  // Status LED + text
  if (details) {
    ch[ci].setAttribute('cx', n.x - w / 2 + 10); ch[ci].setAttribute('cy', n.y + h / 2 - 8); ci++;
    ch[ci].setAttribute('x', n.x - w / 2 + 16); ch[ci].setAttribute('y', n.y + h / 2 - 5);
  }
}

function rebuildEdgesForNode(nodeId) {
  allEdges.forEach(function(e) {
    if (e.f !== nodeId && e.t !== nodeId) return;
    var path = computeEdgePath(e);
    if (!path) return;
    Object.assign(e, path);
    var d = 'M ' + e.x1 + ',' + e.y1 + ' C ' + e.cp1x + ',' + e.cp1y +
            ' ' + e.cp2x + ',' + e.cp2y + ' ' + e.x2 + ',' + e.y2;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hit)  e._hit.setAttribute('d', d);
    if (e._lblBg) {
      var mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, 0.5);
      var lblY = mp.y - 5;
      if (e.arc === 'above') lblY = mp.y - 8;
      if (e.arc === 'abort') lblY = mp.y + 14;
      e._lblBg.setAttribute('x', mp.x); e._lblBg.setAttribute('y', lblY);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x); e._lblTx.setAttribute('y', lblY); }
    }
  });
}

/* stateflow-main.js — setup, drag, tooltips, particle animation */
restorePositions(NODES, STORAGE_KEY);
var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });
nm['_init']  = {id: '_init',  x: 80,   y: 200};
nm['_final'] = {id: '_final', x: 1700, y: 200};
var svg  = document.getElementById('edgeSvg');
var root = document.getElementById('cnv');
var pctx = document.getElementById('partCvs').getContext('2d');

addRegion(svg, 130, 100, 1050, 260, '#60be35', 'PHIL WORKER', 'Ephemeral GPU \u00b7 RunPod Template \u00b7 BOOTING through IDLE');
addRegion(svg, 1280, 100, 350, 200, '#e95400', 'RUNPOD API', 'Teardown \u00b7 DESTROYING through DEAD');
addRegion(svg, 530, 360, 530, 240, '#ff4040', 'ERROR HANDLING', 'Health failures \u00b7 Crash recovery \u00b7 Retry logic');

// Arrow marker definitions
var defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#585858','#ffffff'].forEach(function(col) {
  var m = svgEl('marker', {id: 'arr' + col.slice(1),
    markerUnits: 'userSpaceOnUse', markerWidth: '8', markerHeight: '6',
    refX: '7', refY: '3', orient: 'auto'});
  m.appendChild(svgEl('path', {d: 'M0,0 L8,3 L0,6 Z', fill: col + 'bb'}));
  defs.appendChild(m);
});
svg.insertBefore(defs, svg.firstChild);

// Build all edges (real + pseudo)
var allEdges = [];
EDGES.concat(PSEUDO_EDGES).forEach(function(e) {
  var path = computeEdgePath(e);
  if (!path) return;
  allEdges.push(Object.assign({}, e, path));
});
allEdges.forEach(function(e) {
  var d = 'M ' + e.x1 + ',' + e.y1 + ' C ' + e.cp1x + ',' + e.cp1y + ' ' + e.cp2x + ',' + e.cp2y + ' ' + e.x2 + ',' + e.y2;
  var glow = svgEl('path', {d: d, fill: 'none', stroke: e.c, 'stroke-width': '6', 'stroke-opacity': '0.05'});
  svg.appendChild(glow); e._glow = glow;
  var dash = e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6');
  var main = svgEl('path', {d: d, fill: 'none', stroke: e.c,
    'stroke-width': e.spd >= 3 ? '2' : '1.5', 'stroke-opacity': '0.42',
    'stroke-dasharray': dash, 'marker-end': 'url(#arr' + e.c.slice(1) + ')'});
  svg.appendChild(main); e._main = main;
  if (e.lbl) {
    var mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, 0.5);
    var lblY = mp.y - 5;
    if (e.arc === 'above') lblY = mp.y - 8;
    if (e.arc === 'abort') lblY = mp.y + 14;
    var bg = svgEl('text', {x: mp.x, y: lblY, fill: '#141414', 'font-size': '8',
      'font-family': 'JetBrains Mono,monospace', 'text-anchor': 'middle',
      stroke: '#141414', 'stroke-width': '3', 'stroke-linejoin': 'round', 'font-style': 'italic'});
    bg.textContent = e.lbl; svg.appendChild(bg); e._lblBg = bg;
    var tx = svgEl('text', {x: mp.x, y: lblY, fill: e.c, 'font-size': '8',
      'font-family': 'JetBrains Mono,monospace', 'text-anchor': 'middle',
      opacity: '0.75', 'letter-spacing': '0.06em', 'font-style': 'italic'});
    tx.textContent = e.lbl; svg.appendChild(tx); e._lblTx = tx;
  }
  var hitPath = svgEl('path', {d: d, fill: 'none', stroke: 'transparent', 'stroke-width': '18', 'pointer-events': 'stroke', cursor: 'pointer'});
  svg.appendChild(hitPath); e._hit = hitPath;
  (function(edge) {
    hitPath.addEventListener('mouseenter', function(ev) { showEdgeTooltip(edge, ev); });
    hitPath.addEventListener('mousemove', function(ev) { moveTooltip(ev); });
    hitPath.addEventListener('mouseleave', function() { hideTooltip(); });
  })(e);
});

// State groups, edge highlighting, pseudo-state markers
var stateGroups = {};
var edgeHighlight = [];
allEdges.forEach(function(e) { if (e._main) edgeHighlight.push({el: e._main, from: e.f, to: e.t, baseOp: '0.42'}); });
(function() { // Initial pseudo-state: filled circle
  var g = svgEl('g', {}); g.appendChild(svgEl('circle', {cx: 80, cy: 200, r: '10', fill: '#ffffff', opacity: '0.8'})); svg.appendChild(g);
})();
(function() { // Final pseudo-state: bullseye
  var g = svgEl('g', {});
  g.appendChild(svgEl('circle', {cx: 1700, cy: 200, r: '12', fill: 'none', stroke: '#585858', 'stroke-width': '2'}));
  g.appendChild(svgEl('circle', {cx: 1700, cy: 200, r: '6', fill: '#585858'})); svg.appendChild(g);
})();

// Create all state SVG groups with event handlers
NODES.forEach(function(n) {
  var g = renderState(n);
  svg.appendChild(g);
  stateGroups[n.id] = g;
  g.addEventListener('mouseenter', function(e2) {
    if (dragState.id) return;
    var conn = new Set([n.id]);
    EDGES.forEach(function(edge) { if (edge.f === n.id) conn.add(edge.t); if (edge.t === n.id) conn.add(edge.f); });
    NODES.forEach(function(nd) { var sg = stateGroups[nd.id]; if (sg) sg.setAttribute('opacity', conn.has(nd.id) ? '1' : '0.15'); });
    edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', (h.from === n.id || h.to === n.id) ? '0.9' : '0.025'); });
    showTooltip(n, e2);
  });
  g.addEventListener('mousemove', function(e2) { if (!dragState.id) moveTooltip(e2); });
  g.addEventListener('mouseleave', function() {
    if (dragState.id) return;
    NODES.forEach(function(nd) { var sg = stateGroups[nd.id]; if (sg) sg.setAttribute('opacity', '1'); });
    edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
    hideTooltip();
  });
  g.addEventListener('mousedown', function(e2) { startDrag(e2, n.id); });
});

// Drag handlers
function startDrag(e, nodeId) {
  hideTooltip();
  var wrap = document.getElementById('graphWrap');
  dragState.id = nodeId; dragState.startMx = e.clientX; dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x; dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft; dragState.scrollY = wrap.scrollTop;
  NODES.forEach(function(nd) { var sg = stateGroups[nd.id]; if (sg) sg.setAttribute('opacity', '1'); });
  edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
  e.preventDefault(); e.stopPropagation();
}
document.addEventListener('mousemove', function(e) {
  if (!dragState.id) return;
  var wrap = document.getElementById('graphWrap');
  var dx = e.clientX - dragState.startMx + (wrap.scrollLeft - dragState.scrollX);
  var dy = e.clientY - dragState.startMy + (wrap.scrollTop - dragState.scrollY);
  nm[dragState.id].x = dragState.startNx + dx; nm[dragState.id].y = dragState.startNy + dy;
  updateStatePosition(nm[dragState.id]); rebuildEdgesForNode(dragState.id);
});
document.addEventListener('mouseup', function() {
  if (!dragState.id) return;
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});

// Tooltip functions
function showTooltip(n, e2) {
  var d = NODE_DETAILS[n.id]; if (!d) return;
  document.getElementById('tt-name').textContent = n.label;
  document.getElementById('tt-name').style.color = n.c;
  document.getElementById('tt-role').textContent = d.role;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = d.sc; sdot.style.color = d.sc;
  document.getElementById('tt-sv').textContent = d.status;
  document.getElementById('tt-sv').style.color = d.sc;
  document.getElementById('tt-head-icon').innerHTML = iconLg(n.id, n.c);
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(pair) { return '<div class="tt-row"><span class="tt-k">' + pair[0] + '</span><span class="tt-v">' + pair[1] + '</span></div>'; }).join('');
  var sends = EDGES.filter(function(edge) { return edge.f === n.id; }).map(function(edge) {
    return '<div class="tt-conn-item"><span style="color:' + edge.c + '">\u2192</span> <span>' + (nm[edge.t] ? nm[edge.t].label : edge.t) + (edge.lbl ? ' \u00b7 <em style="color:' + edge.c + '">' + edge.lbl + '</em>' : '') + '</span></div>';
  }).join('');
  var recvs = EDGES.filter(function(edge) { return edge.t === n.id; }).map(function(edge) {
    return '<div class="tt-conn-item"><span style="color:' + edge.c + '">\u2190</span> <span>' + (nm[edge.f] ? nm[edge.f].label : edge.f) + (edge.lbl ? ' \u00b7 <em style="color:' + edge.c + '">' + edge.lbl + '</em>' : '') + '</span></div>';
  }).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends ? '<div class="tt-conn-title">Transitions to</div>' + sends : '') +
    (recvs ? '<div class="tt-conn-title" style="margin-top:' + (sends ? 6 : 0) + 'px">Transitions from</div>' + recvs : '');
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(e2);
}
function showEdgeTooltip(e, ev) {
  var key = e.f + '__' + e.t;
  var d = EDGE_DETAILS[key]; if (!d) return;
  document.getElementById('tt-name').textContent = d.title;
  document.getElementById('tt-name').style.color = e.c;
  document.getElementById('tt-role').textContent = d.sub;
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = e.c; sdot.style.color = e.c;
  document.getElementById('tt-sv').textContent = 'TRANSITION';
  document.getElementById('tt-sv').style.color = e.c;
  document.getElementById('tt-head-icon').innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) { return '<div class="tt-row"><span class="tt-k">' + kv[0] + '</span><span class="tt-v">' + kv[1] + '</span></div>'; }).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
}

// Particle animation
var particles = [];
allEdges.forEach(function(e) {
  var cnt = e.spd >= 4 ? 4 : e.spd >= 3 ? 3 : e.spd >= 2 ? 2 : 1;
  for (var j = 0; j < cnt; j++) particles.push({edge: e, t: j / cnt, trail: []});
});
var lastTime = performance.now();
function animate(now) {
  var dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 800);
  particles.forEach(function(p) {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    var e = p.edge;
    var pt = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, p.t);
    p.trail.push({x: pt.x, y: pt.y});
    if (p.trail.length > 10) p.trail.shift();
    for (var i = 1; i < p.trail.length; i++) {
      pctx.beginPath(); pctx.arc(p.trail[i].x, p.trail[i].y, (i / p.trail.length) * (e.spd >= 4 ? 2.8 : 2.2), 0, Math.PI * 2);
      pctx.fillStyle = e.c; pctx.globalAlpha = (i / p.trail.length) * 0.425; pctx.fill();
    }
    pctx.save();
    pctx.shadowColor = e.c; pctx.shadowBlur = e.spd >= 4 ? 14 : 8;
    pctx.fillStyle = e.c; pctx.globalAlpha = 1;
    pctx.beginPath(); pctx.arc(pt.x, pt.y, e.spd >= 4 ? 3.5 : 2.8, 0, Math.PI * 2);
    pctx.fill(); pctx.restore(); pctx.globalAlpha = 1;
  });
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
