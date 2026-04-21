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
