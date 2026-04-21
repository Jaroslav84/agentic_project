/* callflow.js — Call Flow graph (merged) */

/* callflow-data.js -- STORAGE_KEY, ICONS, NODES, EDGES for callflow graph */

var STORAGE_KEY = 'phil-pos-callflow';

// SVG Icons (20x20 viewBox, stroke-based)
var ICONS = {
  preheat:   icon('M10,4a6,6 0 1,0 .01,0Z M10,4 L7,8 L10,12 L13,8Z M10,12v4 M7,8 L4,10 M13,8 L16,10 M4,10a1.5,1.5 0 1,0 .01,0Z M16,10a1.5,1.5 0 1,0 .01,0Z M10,16a1.5,1.5 0 1,0 .01,0Z'),
  prerender: icon('M4,2h12v16H4V2z M8,7 L9.5,9 L13,5.5 M8,11.5 L9.5,13.5 L13,10 M8,16h5'),
  dial:      icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M13,3h4v4 M17,3 L13.5,6.5'),
  answer:    icon('M10,3 a7,7 0 1,0 .01,0Z M10,6v4 L13,12 M3,14 L1,17 M17,14 L19,17 M7,17 L5.5,19 M13,17 L14.5,19'),
  human:     icon('M10,9 a4,4 0 1,0 .01,0Z M2.5,19 C2.5,14 5.5,12 10,12 S17.5,14 17.5,19'),
  machine:   icon('M2,4h16v10H2V4z M6,17h8 M10,14v3 M5,8h2 M9,8h2 M13,8h2'),
  noanswer:  icon('M10,3 a7,7 0 1,0 .01,0Z M7,7 L13,13 M13,7 L7,13'),
  vad:       icon('M1,10h2 M4,7v6 M6,5v10 M8,8v4 M10,6v8 M12,8v4 M14,5v10 M16,7v6 M18,10h1 M1,14h18'),
  stt:       icon('M1,10h2 M3,10 L4,5 L5,15 L6,7 L7,13 L8,9 L9,11 L10,8 L11,12 L12,10 L13,10 M13,10 L14,7 L15,13 L16,10 h2'),
  llm:       icon('M10,4a6,6 0 1,0 .01,0Z M10,4 L7,8 L10,12 L13,8Z M10,12v4 M7,8 L4,10 M13,8 L16,10 M4,10a1.5,1.5 0 1,0 .01,0Z M16,10a1.5,1.5 0 1,0 .01,0Z M10,16a1.5,1.5 0 1,0 .01,0Z'),
  tts:       icon('M2,7h4 L10,3 L10,17 L6,13 H2 V7z M13,7 Q15.5,8.5 15.5,10 Q15.5,11.5 13,13 M15,5 Q18.5,7 18.5,10 Q18.5,13 15,15'),
  bargein:   icon('M10,3 a7,7 0 1,0 .01,0Z M10,7v3 M10,13v1 M3,10H1 M19,10h-2'),
  postcall:  icon('M10,3 a7,7 0 1,0 .01,0Z M10,6v4 L13,12 M10,3 L10,1 M7,2.5 L10,1 L13,2.5'),
  vm_play:   icon('M2,7h4 L10,3 L10,17 L6,13 H2 V7z M14,8 L18,10 L14,12Z'),
  log_next:  icon('M4,2h12v16H4V2z M7,7h6 M7,10h6 M7,13h4 M16,14 L19,17 M19,14 L16,17')
};

// 15 nodes (13 main + 2 terminal)
var NODES = [
  {id:'preheat',   label:'CLAUDE PREHEAT',  sub:'Load SPEC + ZC docs\n~45k tokens \u00b7 ~2s',              x:700,  y:80,   c:'#9f00fa', shape:'rounded-rect'},
  {id:'prerender', label:'PRE-RENDER',       sub:'Cache T1 opener + VM\n+ 2 fallback responses',           x:700,  y:190,  c:'#9f00fa', shape:'rect'},
  {id:'dial',      label:'TELNYX DIAL',      sub:'SIP trunk \u00b7 Outbound PSTN\nCall initiated',         x:700,  y:310,  c:'#ee9612', shape:'rect'},
  {id:'answer',    label:'ANSWER DETECT',    sub:'Telnyx AMD\n3-way branch',                                x:700,  y:440,  c:'#ee9612', hub:true, shape:'diamond'},
  {id:'human',     label:'HUMAN ANSWER',     sub:'Live person detected\nBegin conversation',                x:700,  y:570,  c:'#60be35', shape:'rect'},
  {id:'machine',   label:'MACHINE / AMD',    sub:'Voicemail detected\nPlay cached VM',                      x:1050, y:520,  c:'#e95400', shape:'rect'},
  {id:'noanswer',  label:'NO ANSWER',        sub:'Timeout \u00b7 Log result\nNext in queue',                x:1050, y:620,  c:'#ff4040', shape:'rect'},
  {id:'vad',       label:'SILERO VAD',       sub:'Voice activity \u00b7 200ms\nstop_secs (Pipecat v0.0.85+)',          x:700,  y:680,  c:'#60be35', gpu:true, shape:'rect'},
  {id:'stt',       label:'PARAKEET RNNT',    sub:'Streaming STT \u00b7 1.1B\n~0ms marginal latency',       x:700,  y:790,  c:'#60be35', gpu:true, shape:'rect'},
  {id:'llm',       label:'CLAUDE SONNET',    sub:'Live LLM \u00b7 Streaming\nresponse \u00b7 v4.6',        x:700,  y:910,  c:'#9f00fa', hub:true, shape:'rect'},
  {id:'tts',       label:'INWORLD TTS',       sub:'Cloud API \u00b7 WebSocket\nStreaming \u00b7 ELO 1577 \u00b7 ~200ms',      x:700,  y:1030, c:'#60be35', shape:'rect'},
  {id:'bargein',   label:'BARGE-IN CHECK',   sub:'>500ms client speech\n\u2192 interrupt Sales',             x:440,  y:900,  c:'#ff4040', shape:'diamond'},
  {id:'postcall',  label:'POST-CALL',        sub:'Transfer or Hangup\nHaiku extraction',                    x:700,  y:1280, c:'#9f00fa', shape:'rounded-rect'},
  {id:'vm_play',   label:'VM PLAY',          sub:'Play cached voicemail\nEnd call',                          x:1280, y:520,  c:'#e95400', term:true, shape:'rounded-rect'},
  {id:'log_next',  label:'LOG / NEXT',       sub:'Log no-answer\nMove to next',                             x:1280, y:620,  c:'#585858',  term:true, shape:'rounded-rect'}
];

var EDGES = [
  {f:'preheat',   t:'prerender', c:'#9f00fa', lbl:'context loaded',   spd:1.8},
  {f:'prerender', t:'dial',      c:'#ee9612', lbl:'ready to dial',    spd:2.0},
  {f:'dial',      t:'answer',    c:'#ee9612', lbl:'ringing',          spd:2.5},
  {f:'answer',    t:'human',     c:'#60be35', lbl:'human',            spd:3.0},
  {f:'human',     t:'vad',       c:'#60be35', lbl:'listening',        spd:3.5},
  {f:'vad',       t:'stt',       c:'#60be35', lbl:'speech detected',  spd:4.0},
  {f:'stt',       t:'llm',       c:'#9f00fa', lbl:'transcript',       spd:4.0},
  {f:'llm',       t:'tts',       c:'#9f00fa', lbl:'tokens',           spd:4.0},
  {f:'tts',       t:'postcall',  c:'#9f00fa', lbl:'output',           spd:2.5},
  {f:'answer',    t:'machine',   c:'#e95400', lbl:'machine',          spd:2.5},
  {f:'answer',    t:'noanswer',  c:'#ff4040', lbl:'no answer',        spd:2.0},
  {f:'machine',   t:'vm_play',   c:'#e95400', lbl:'play VM',          spd:2.0},
  {f:'noanswer',  t:'log_next',  c:'#585858', lbl:'log',              spd:1.2},
  {f:'llm',       t:'bargein',   c:'#ff4040', lbl:'client interrupts',spd:3.0},
  {f:'bargein',   t:'vad',       c:'#ff4040', lbl:'restart listening', spd:3.5, arc:true},
  {f:'stt',       t:'bargein',   c:'#ff4040', lbl:'monitor',          spd:2.0},
  {f:'tts',       t:'vad',       c:'#60be35', lbl:'voice loop',       spd:2.5, loop:true}
];

/* callflow-details.js -- NODE_DETAILS and EDGE_DETAILS for callflow tooltips */

var NODE_DETAILS = {
  preheat:   { role:'Claude Preheat \u00b7 Context Loading', status:'READY', sc:'#9f00fa',
    m:[['Model','claude-sonnet-4-6'],['Context','~45k tokens loaded'],['Includes','SPEC v1.0 + ZC docs + call intel'],['Duration','~2s before each call'],['Host','Anthropic API'],['Caching','enable_prompt_caching=True \u00b7 reuse across calls']],
    note:'Full spec + ZC docs loaded into Claude context window before every call. Prompt caching enabled for cross-call reuse. Script tier pre-selected. Pre-render follows immediately.' },
  prerender: { role:'Pre-Render \u00b7 Audio Cache', status:'READY', sc:'#9f00fa',
    m:[['Cached','T1 opener audio'],['Cached','Voicemail audio'],['Cached','2 fallback responses'],['TTS','Inworld context prewarming'],['Benefit','~200ms playback vs ~550ms live']],
    note:'Pre-rendered first turn + VM + 2 common fallback responses via Inworld TTS prewarming. Eliminates LLM+TTS latency for the critical first impression.' },
  dial:      { role:'Telnyx Dial \u00b7 Outbound PSTN', status:'READY', sc:'#ee9612',
    m:[['Provider','Telnyx SIP trunk'],['Type','Outbound PSTN call'],['AMD','Answer Machine Detection enabled'],['Number','TBD \u2014 pre-launch blocker'],['Cost','$0.007/min + $0.02/SMS']],
    note:'SIP trunk outbound dial via Telnyx API. AMD runs on Telnyx side to detect voicemail vs human. Sales Worker owns all Telnyx call control during live calls including parallel ring for warm transfer.' },
  answer:    { role:'Answer Detect \u00b7 3-Way Branch', status:'ARMED', sc:'#ee9612',
    m:[['Branch 1','Human \u2192 live conversation'],['Branch 2','Machine \u2192 play cached VM'],['Branch 3','No Answer \u2192 log + next'],['Provider','Telnyx AMD'],['Timeout','30s ring']],
    note:'Critical decision node. Telnyx AMD determines call disposition. Human answer enters the voice pipeline. Machine plays pre-rendered voicemail.' },
  human:     { role:'Human Answer \u00b7 Conversation Start', status:'LIVE', sc:'#60be35',
    m:[['Action','Begin conversation'],['First turn','Pre-rendered audio \u2192 ~200ms'],['Opens with','Proposal # + property name'],['Never says','Generic template openers'],['AB 1394','Discloses AI if asked']],
    note:'Live person detected. Sales leads with the specific proposal number and property name. Pre-rendered first turn plays in ~200ms.' },
  machine:   { role:'Machine / AMD \u00b7 Voicemail Detected', status:'DETECT', sc:'#e95400',
    m:[['Action','Play cached voicemail'],['Audio','Pre-rendered via Inworld'],['Duration','~15s'],['Schedule','VM only on 3rd attempt (Day 7) or Day 21'],['Fallback','If AMD uncertain \u2192 treat as human']],
    note:'Voicemail detected by Telnyx AMD. Plays pre-rendered VM audio, then ends call. VM only on specific sequence touches.' },
  noanswer:  { role:'No Answer \u00b7 Timeout', status:'LOGGED', sc:'#ff4040',
    m:[['Action','Log no-answer result'],['Next','Move to next in queue'],['Timeout','30s ring with no pickup'],['Retry','Per sequence schedule'],['Logged to','PostgreSQL call_log']],
    note:'No pickup after 30s. Result logged to PostgreSQL. SalesClaw schedules next touch per outreach sequence.' },
  vad:       { role:'Silero VAD \u00b7 Voice Activity Detection', status:'LISTENING', sc:'#60be35',
    m:[['Model','Silero VAD + SmartTurn v3'],['stop_secs','200ms (Pipecat v0.0.85+)'],['Host','Sales Worker GPU'],['Concurrent','Runs alongside Parakeet RNNT'],['Barge-in','500ms speech \u2192 interrupt Sales'],['Latency','~150ms detection']],
    note:'VAD and RNNT stream concurrently \u2014 ~90% of transcript complete by VAD silence trigger. SmartTurn v3 with 200ms stop_secs via Pipecat v0.0.85+. Barge-in: >500ms client speech interrupts Sales; <500ms ignored as backchannel.' },
  stt:       { role:'Parakeet RNNT 1.1B \u00b7 Streaming STT', status:'STREAMING', sc:'#60be35',
    m:[['Model','Parakeet RNNT 1.1B (NVIDIA)'],['Mode','Streaming \u2014 incremental'],['Marginal latency','~0ms after VAD trigger'],['Benchmark req','\u26a0\ufe0f Must test on 8kHz G.711 \u03bc-law phone audio, not clean 16kHz'],['Host','Sales Worker GPU'],['Fallback','Moonshine if RNNT underperforms on phone audio']],
    note:'Streaming RNNT: near-zero marginal latency because transcription overlaps with audio input. Concurrent with VAD. Pre-launch requirement: benchmark on actual 8kHz G.711 phone-quality audio. If accuracy drops \u2192 evaluate Moonshine (trained on noisier data). Controller toggle for STT model \u2014 manual only, never auto-switches.' },
  llm:       { role:'Claude Sonnet 4.6 \u00b7 Live Call LLM', status:'PREHEATED', sc:'#9f00fa',
    m:[['Model','claude-sonnet-4-6'],['Context','200k tokens'],['Host','Anthropic API'],['Mode','Streaming response'],['Preheat','Full spec loaded before call'],['Caching','enable_prompt_caching=True'],['Latency','~200ms first token (Anthropic DC, SF \u00b7 5.6ms)']],
    note:'Live call LLM with prompt caching enabled. Never used for async tasks \u2014 Haiku handles post-call extraction. Streaming tokens go to Inworld TTS for real-time synthesis.' },
  tts:       { role:'Inworld TTS Mini \u00b7 Cloud API', status:'READY', sc:'#60be35',
    m:[['Model','Inworld TTS 1.5 Max'],['Mode','WebSocket streaming \u00b7 token/sentence'],['First chunk','~200ms (p50) \u00b7 Google SJC, 13ms'],['ELO','1577 (TTS Arena)'],['Host','Inworld Cloud API'],['Output','8kHz G.711 native \u2014 no resample needed'],['Pre-render','First turn + VM cached']],
    note:'Cloud-hosted TTS via Inworld WebSocket API. ELO 1577 on TTS Arena. ~200ms first chunk. Native 8kHz output eliminates resample step entirely.' },
  bargein:   { role:'Barge-In Check \u00b7 Interrupt Detection', status:'MONITORING', sc:'#ff4040',
    m:[['Threshold','>500ms client speech'],['Action','Interrupt Sales immediately'],['Ignore','<500ms (backchannel: uh-huh, yeah)'],['Source','VAD + STT concurrent stream'],['Restart','Cancel current TTS \u2192 restart listening']],
    note:'Monitors client speech during Sales\'s response. >500ms sustained speech = real interruption \u2192 cancel TTS, restart listening loop. <500ms = backchannel, ignored.' },
  postcall:  { role:'Post-Call \u00b7 Wrap-Up + Extraction', status:'STANDBY', sc:'#9f00fa',
    m:[['Actions','Transfer OR Hangup'],['Extraction','Claude Haiku async'],['Pipeline','ParallelPipeline \u2014 Haiku runs in parallel async branch'],['Updates','PostgreSQL + HubSpot + FieldTECH'],['Attribution','manager_userID = 7225 on transfer'],['Recording','Stereo to DO Spaces']],
    note:'If warm transfer: parallel ring reps, write attribution immediately. If hangup: Haiku extracts sentiment/intent via ParallelPipeline (runs in parallel async branch), updates all systems. Recording saved to DO Spaces.' },
  vm_play:   { role:'VM Play \u00b7 Terminal', status:'END', sc:'#585858',
    m:[['Action','Play pre-rendered voicemail'],['Duration','~15s'],['Then','End call \u00b7 Log result'],['Audio','Cached from pre-render step']],
    note:'Terminal node. Plays the cached voicemail audio and ends the call. Result logged to PostgreSQL.' },
  log_next:  { role:'Log / Next \u00b7 Terminal', status:'END', sc:'#585858',
    m:[['Action','Log no-answer to PostgreSQL'],['Then','SalesClaw picks next in queue'],['No retry','Immediate \u2014 per sequence schedule'],['Batch','Continue with remaining calls']],
    note:'Terminal node. No-answer logged and SalesClaw moves to the next call in the batch queue.' }
};

var EDGE_DETAILS = {
  'preheat__prerender': {
    title:'CONTEXT LOADED', sub:'Claude Preheat \u2192 Pre-Render',
    m:[['Payload','~45k tokens \u2014 SPEC v1.0 + ZC docs + call intel'],['Duration','~2s context load'],['Caching','enable_prompt_caching=True \u00b7 reuse across calls'],['Next','Pre-render first turn + VM + 2 fallbacks via Inworld']],
    note:'Full spec and historical call intelligence loaded into Claude context window. Prompt caching enabled for cross-call reuse. Script tier pre-selected. Pre-render follows immediately.'
  },
  'prerender__dial': {
    title:'READY TO DIAL', sub:'Pre-Render \u2192 Telnyx Dial',
    m:[['Cached audio','T1 opener + voicemail + 2 fallback responses'],['Benefit','~200ms first turn vs ~550ms live'],['TTS engine','Inworld prewarming']],
    note:'All pre-rendered audio cached in worker memory. Zero LLM+TTS latency on the critical first impression.'
  },
  'dial__answer': {
    title:'RINGING', sub:'Telnyx Dial \u2192 Answer Detect',
    m:[['Provider','Telnyx SIP trunk'],['AMD','Answer Machine Detection enabled'],['Timeout','30s ring'],['Cost','$0.007/min + $0.02/SMS']],
    note:'Outbound PSTN call via Telnyx. AMD classifies: human, machine, or no answer.'
  },
  'answer__human': {
    title:'HUMAN DETECTED', sub:'Answer Detect \u2192 Human Answer',
    m:[['Action','Play pre-rendered T1 opener'],['Latency','~200ms (cached, zero inference)'],['Opens with','Proposal # + property name'],['Never says','Generic template openers']],
    note:'AMD confirms live person. Pre-rendered first turn plays immediately \u2014 fastest possible first impression.'
  },
  'answer__machine': {
    title:'VOICEMAIL DETECTED', sub:'Answer Detect \u2192 Machine/AMD',
    m:[['Action','Play pre-rendered voicemail (~15s)'],['Schedule','VM only on Day 7 (3rd attempt) or Day 21'],['Rule','One VM per proposal cycle max'],['Fallback','AMD uncertain \u2192 treat as human']],
    note:'Telnyx AMD detects answering machine. Pre-rendered voicemail plays, call ends.'
  },
  'answer__noanswer': {
    title:'NO ANSWER', sub:'Answer Detect \u2192 Timeout',
    m:[['Timeout','30s ring, no pickup'],['Logged to','PostgreSQL call_log'],['Same day','Up to 3 attempts: 10:30 / 1:00 / 3:30 PT'],['Next','SalesClaw schedules per sequence']],
    note:'No pickup after 30 seconds. Result logged, SalesClaw moves to next call in batch.'
  },
  'human__vad': {
    title:'LISTENING', sub:'Human Answer \u2192 Silero VAD',
    m:[['Model','Silero VAD + SmartTurn v3 \u00b7 GPU'],['stop_secs','200ms (Pipecat v0.0.85+)'],['Concurrent','Runs alongside Parakeet RNNT'],['Barge-in','>500ms client speech \u2192 interrupt']],
    note:'VAD and RNNT stream concurrently \u2014 ~90% of transcript complete by VAD silence trigger. SmartTurn v3 with 200ms stop_secs.'
  },
  'vad__stt': {
    title:'SPEECH DETECTED', sub:'Silero VAD \u2192 Parakeet RNNT',
    m:[['Marginal latency','~0ms \u2014 transcript already assembled'],['Model','Parakeet RNNT 1.1B (NVIDIA)'],['Mode','Streaming incremental'],['Overlap','~90% done by VAD trigger']],
    note:'RNNT streams concurrently with VAD, so transcript is nearly complete \u2014 near-zero additional latency.'
  },
  'stt__llm': {
    title:'TRANSCRIPT', sub:'Parakeet RNNT \u2192 Claude Sonnet',
    m:[['Model','Claude Sonnet 4.6'],['First token','~200ms (p50) / ~400ms (p95)'],['Context','Preheated KV cache \u00b7 \u22642000 token prompt'],['Mode','Streaming \u2014 tokens sent as generated']],
    note:'Trimmed transcript sent to preheated Claude. Streaming tokens flow directly to Inworld TTS.'
  },
  'llm__tts': {
    title:'STREAMING TOKENS', sub:'Claude Sonnet \u2192 Inworld TTS Mini',
    m:[['Split','Token/sentence mode \u00b7 WebSocket'],['First chunk','~200ms (p50) / ~300ms (p95) \u00b7 Google SJC, 13ms'],['Engine','Inworld TTS Mini \u00b7 Cloud API'],['Output','8kHz G.711 native'],['ELO','1577 (TTS Arena)']],
    note:'Tokens streamed via WebSocket in token/sentence mode. Inworld renders cloud-side with native 8kHz output \u2014 no resample needed.'
  },
  'tts__postcall': {
    title:'OUTPUT TO PHONE', sub:'Inworld TTS \u2192 Post-Call',
    m:[['Delivery','G.711 audio \u2192 Telnyx \u2192 client (native 8kHz)'],['Post-call','Haiku async extraction via ParallelPipeline'],['Recording','Dual-channel stereo \u2192 DO Spaces'],['Updates','PostgreSQL + HubSpot + FieldTECH']],
    note:'Audio out to client. Native 8kHz from Inworld \u2014 no resample. On hangup: Haiku extracts sentiment, attribution writes to FieldTECH, recording saved.'
  },
  'machine__vm_play': {
    title:'PLAY VOICEMAIL', sub:'Machine/AMD \u2192 VM Play',
    m:[['Audio','Pre-rendered via Inworld (cached)'],['Duration','~15s'],['Then','End call \u00b7 log to PostgreSQL']],
    note:'Terminal. Pre-rendered voicemail plays and call ends.'
  },
  'noanswer__log_next': {
    title:'LOG AND ADVANCE', sub:'No Answer \u2192 Log/Next',
    m:[['Logged to','PostgreSQL call_log'],['Next','SalesClaw picks next in batch'],['No immediate retry','Per outreach sequence schedule']],
    note:'Terminal. No-answer logged, SalesClaw advances to next call.'
  },
  'llm__bargein': {
    title:'CLIENT INTERRUPTS', sub:'Claude \u2192 Barge-In Check',
    m:[['Threshold','>500ms sustained speech'],['Action','Cancel Inworld TTS immediately'],['Context','Claude sees: [interrupted] + new client input'],['Ignore','<500ms backchannel (uh-huh, yeah)']],
    note:'Client speaks >500ms during Sales \u2014 real interruption. TTS stops, listening restarts.'
  },
  'bargein__vad': {
    title:'RESTART LISTENING', sub:'Barge-In \u2192 Silero VAD',
    m:[['Action','Cancel TTS playback'],['Restart','VAD begins listening again'],['Claude','Generates fresh response to interruption'],['Configurable','500ms threshold in Controller']],
    note:'Barge-in confirmed. TTS cancelled, conversation loop restarts from client input.'
  },
  'stt__bargein': {
    title:'CONCURRENT MONITOR', sub:'Parakeet RNNT \u2192 Barge-In',
    m:[['Mode','Passive monitoring during Sales output'],['Source','STT runs alongside TTS playback'],['Trigger','>500ms speech \u2192 interrupt']],
    note:'STT continuously monitors client audio while Sales speaks. Feeds barge-in detection.'
  },
  'tts__vad': {
    title:'VOICE LOOP', sub:'TTS \u2192 VAD (loop back)',
    m:[['Flow','Sales audio \u2192 Telnyx \u2192 client \u2192 Telnyx \u2192 VAD'],['p50 turn','~550ms end-to-end'],['p95 turn','~750ms (800ms hard ceiling)'],['Loop','Continuous until hangup or transfer']],
    note:'Continuous conversation loop. Each iteration is one conversational turn at ~550ms p50 latency.'
  }
};

/* callflow-render.js -- SVG defs, boundary math, edge path, node shapes */
// Shape dimension constants
var SHAPE_RECT_W = 160, SHAPE_RECT_H = 54;
var SHAPE_HUB_W = 188, SHAPE_HUB_H = 58;
var SHAPE_TERM_W = 158, SHAPE_TERM_H = 54;
var DIAMOND_SX = 65, DIAMOND_SY = 50;

// -- SVG defs: patterns, filters, arrow markers --
function buildSvgDefs(targetSvg) {
  var defs = svgEl('defs', {});
  var gpuPat = svgEl('pattern', {id:'gpuTrace', patternUnits:'userSpaceOnUse', width:'8', height:'8'});
  gpuPat.appendChild(svgEl('rect', {width:'8', height:'8', fill:'none'}));
  gpuPat.appendChild(svgEl('line', {x1:'0',y1:'0',x2:'0',y2:'8',stroke:'#60be35','stroke-width':'0.5','stroke-opacity':'0.04'}));
  gpuPat.appendChild(svgEl('line', {x1:'0',y1:'0',x2:'8',y2:'0',stroke:'#60be35','stroke-width':'0.5','stroke-opacity':'0.04'}));
  defs.appendChild(gpuPat);
  var hubGlow = svgEl('filter', {id:'hubGlow',x:'-50%',y:'-50%',width:'200%',height:'200%'});
  var feGauss = svgEl('feGaussianBlur', {stdDeviation:'3',result:'blur'});
  hubGlow.appendChild(feGauss);
  var feMerge = svgEl('feMerge', {});
  feMerge.appendChild(svgEl('feMergeNode', {'in':'blur'}));
  feMerge.appendChild(svgEl('feMergeNode', {'in':'SourceGraphic'}));
  hubGlow.appendChild(feMerge);
  defs.appendChild(hubGlow);
  ['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#585858'].forEach(function(col) {
    var m = svgEl('marker', {id:'arr'+col.slice(1),
      markerUnits:'userSpaceOnUse',markerWidth:'8',markerHeight:'6',
      refX:'7',refY:'3',orient:'auto'});
    m.appendChild(svgEl('path', {d:'M0,0 L8,3 L0,6 Z',fill:col+'bb'}));
    defs.appendChild(m);
  });
  targetSvg.insertBefore(defs, targetSvg.firstChild);
}
// -- Node boundary point (where edges connect) --
function getNodeBoundary(n, targetX, targetY) {
  var dx = targetX - n.x, dy = targetY - n.y;
  var shape = n.shape || 'rect';
  if (shape === 'diamond') {
    var sx = DIAMOND_SX, sy = DIAMOND_SY;
    var absDx = Math.abs(dx) || 0.001, absDy = Math.abs(dy) || 0.001;
    var scale = 1.0 / (absDx/sx + absDy/sy);
    return { x: n.x + dx * scale, y: n.y + dy * scale };
  }
  var hw = (n.hub ? 94 : (n.term ? 79 : 80));
  var hh = 27;
  if (shape === 'rounded-rect') { hw = 79; hh = 27; }
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return { x: n.x, y: n.y + hh };
  }
  var scaleX = hw / (Math.abs(dx) || 0.001);
  var scaleY = hh / (Math.abs(dy) || 0.001);
  var scale = Math.min(scaleX, scaleY);
  return { x: n.x + dx * scale, y: n.y + dy * scale };
}
// -- Edge path (cubic bezier control points) --
function makeEdgePath(x1, y1, x2, y2, perpOff) {
  if (perpOff) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx + dy*dy) || 1;
    x1 += -dy/len * perpOff; y1 += dx/len * perpOff;
    x2 += -dy/len * perpOff; y2 += dx/len * perpOff;
  }
  var dy2 = y2 - y1, dx2 = x2 - x1;
  var absDx = Math.abs(dx2), absDy = Math.abs(dy2);
  var cp1x, cp1y, cp2x, cp2y;
  if (absDy > absDx * 0.5) {
    cp1x = x1; cp1y = y1 + dy2 * 0.4;
    cp2x = x2; cp2y = y2 - dy2 * 0.4;
  } else {
    cp1x = x1 + dx2 * 0.5; cp1y = y1;
    cp2x = x1 + dx2 * 0.5; cp2y = y2;
  }
  return {x1:x1, y1:y1, cp1x:cp1x, cp1y:cp1y, cp2x:cp2x, cp2y:cp2y, x2:x2, y2:y2};
}

// -- Draw process rectangle node --
function drawProcess(n) {
  var w = n.hub ? SHAPE_HUB_W : SHAPE_RECT_W;
  var h = n.hub ? SHAPE_HUB_H : SHAPE_RECT_H;
  var g = svgEl('g', {id:'node-'+n.id, cursor:'grab', 'data-nid':n.id});
  if (n.gpu) {
    g.appendChild(svgEl('rect', {x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'3', fill:'url(#gpuTrace)'}));
  }
  g.appendChild(svgEl('rect', {x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'3',
    fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5'}));
  g.appendChild(svgEl('line', {x1:n.x-w/2, y1:n.y-h/2+3, x2:n.x-w/2, y2:n.y+h/2-3,
    stroke:n.c, 'stroke-width':'2.5', 'stroke-opacity':'0.6'}));
  if (n.gpu) {
    g.appendChild(svgEl('rect', {x:n.x-w/2+1, y:n.y-h/2+1, width:w-2, height:h-2, rx:'2',
      fill:'url(#gpuTrace)', opacity:'1'}));
  }
  var details = NODE_DETAILS[n.id];
  var ledColor = details ? details.sc : '#555';
  g.appendChild(svgEl('circle', {cx:n.x+w/2-10, cy:n.y-h/2+10, r:'2.5', fill:ledColor, opacity:'0.8'}));
  var label = svgEl('text', {x:n.x, y:n.y-6, fill:n.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':n.hub?'14':'13',
    'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.04em'});
  label.textContent = n.label; g.appendChild(label);
  n.sub.split('\n').forEach(function(line, i) {
    var t = svgEl('text', {x:n.x, y:n.y+7+i*11, fill:'#b0b0b0',
      'font-family':'JetBrains Mono, monospace', 'font-size':'9', 'text-anchor':'middle', opacity:'0.7'});
    t.textContent = line; g.appendChild(t);
  });
  return g;
}

// -- Draw diamond decision node --
function drawDiamond(n) {
  var sx = DIAMOND_SX, sy = DIAMOND_SY;
  var g = svgEl('g', {id:'node-'+n.id, cursor:'grab', 'data-nid':n.id});
  var pts = n.x+','+(n.y-sy)+' '+(n.x+sx*1.3)+','+n.y+' '+n.x+','+(n.y+sy)+' '+(n.x-sx*1.3)+','+n.y;
  g.appendChild(svgEl('polygon', {points:pts, fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5'}));
  var details = NODE_DETAILS[n.id];
  var ledColor = details ? details.sc : '#555';
  g.appendChild(svgEl('circle', {cx:n.x, cy:n.y-sy+12, r:'2.5', fill:ledColor, opacity:'0.8'}));
  var label = svgEl('text', {x:n.x, y:n.y-6, fill:n.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'12',
    'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.04em'});
  label.textContent = n.label; g.appendChild(label);
  var st = svgEl('text', {x:n.x, y:n.y+8, fill:'#b0b0b0',
    'font-family':'JetBrains Mono, monospace', 'font-size':'8.5', 'text-anchor':'middle', opacity:'0.7'});
  st.textContent = n.sub.split('\n')[0]; g.appendChild(st);
  var badgeY = n.y + 18;
  g.appendChild(svgEl('rect', {x:n.x-30, y:badgeY-5, width:60, height:11, rx:'2',
    fill:n.c+'18', stroke:n.c+'40', 'stroke-width':'0.5'}));
  var bt = svgEl('text', {x:n.x, y:badgeY+3, fill:n.c,
    'font-family':'JetBrains Mono, monospace', 'font-size':'8', 'text-anchor':'middle', 'letter-spacing':'0.1em'});
  bt.textContent = '\u25C8 DECISION'; g.appendChild(bt);
  return g;
}

// -- Draw rounded-rect (start/end/terminal) node --
function drawRoundedRect(n) {
  var w = SHAPE_TERM_W, h = SHAPE_TERM_H;
  var g = svgEl('g', {id:'node-'+n.id, cursor:'grab', 'data-nid':n.id, opacity:n.term?'0.7':'1'});
  g.appendChild(svgEl('rect', {x:n.x-w/2, y:n.y-h/2, width:w, height:h, rx:'20',
    fill:n.c+'12', stroke:n.c+'50', 'stroke-width':'1.5'}));
  var details = NODE_DETAILS[n.id];
  var ledColor = details ? details.sc : '#555';
  g.appendChild(svgEl('circle', {cx:n.x+w/2-14, cy:n.y-h/2+14, r:'2.5', fill:ledColor, opacity:'0.8'}));
  var label = svgEl('text', {x:n.x, y:n.y-6, fill:n.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'13',
    'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.04em'});
  label.textContent = n.label; g.appendChild(label);
  n.sub.split('\n').forEach(function(line, i) {
    var t = svgEl('text', {x:n.x, y:n.y+7+i*11, fill:'#b0b0b0',
      'font-family':'JetBrains Mono, monospace', 'font-size':'9', 'text-anchor':'middle', opacity:'0.7'});
    t.textContent = line; g.appendChild(t);
  });
  if (n.term) {
    g.appendChild(svgEl('rect', {x:n.x-22, y:n.y+h/2-14, width:44, height:10, rx:'2',
      fill:'#58585818', stroke:'#58585840', 'stroke-width':'0.5'}));
    var tt2 = svgEl('text', {x:n.x, y:n.y+h/2-6, fill:'#585858',
      'font-family':'JetBrains Mono, monospace', 'font-size':'7', 'text-anchor':'middle', 'letter-spacing':'0.1em'});
    tt2.textContent = 'TERMINAL'; g.appendChild(tt2);
  }
  return g;
}

// -- Dispatch to correct shape drawer --
function drawNodeShape(n) {
  switch (n.shape) {
    case 'diamond':      return drawDiamond(n);
    case 'rounded-rect': return drawRoundedRect(n);
    default:             return drawProcess(n);
  }
}

// -- Rebuild edge paths when a node is dragged --
function rebuildEdgesForNode(nodeId) {
  allEdges.forEach(function(e) {
    if (e.f !== nodeId && e.t !== nodeId) return;
    var n1 = nm[e.f], n2 = nm[e.t], ep;
    if (e.arc) {
      var b1 = getNodeBoundary(n1, n1.x-140, n1.y-100);
      var b2 = getNodeBoundary(n2, n2.x-160, n2.y+60);
      ep = {x1:b1.x,y1:b1.y, cp1x:n1.x-140,cp1y:n1.y-100, cp2x:n2.x-160,cp2y:n2.y+60, x2:b2.x,y2:b2.y};
    } else if (e.loop) {
      var b1 = getNodeBoundary(n1, n1.x+260, n1.y-80);
      var b2 = getNodeBoundary(n2, n2.x+260, n2.y+80);
      ep = {x1:b1.x,y1:b1.y, cp1x:n1.x+260,cp1y:n1.y-80, cp2x:n2.x+260,cp2y:n2.y+80, x2:b2.x,y2:b2.y};
    } else {
      var b1 = getNodeBoundary(n1, n2.x, n2.y);
      var b2 = getNodeBoundary(n2, n1.x, n1.y);
      ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, 0);
    }
    e.x1=ep.x1; e.y1=ep.y1; e.cp1x=ep.cp1x; e.cp1y=ep.cp1y;
    e.cp2x=ep.cp2x; e.cp2y=ep.cp2y; e.x2=ep.x2; e.y2=ep.y2;
    var d = 'M '+ep.x1+','+ep.y1+' C '+ep.cp1x+','+ep.cp1y+' '+ep.cp2x+','+ep.cp2y+' '+ep.x2+','+ep.y2;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hit)  e._hit.setAttribute('d', d);
    if (e._lblBg) {
      var mp = cbPt(ep.x1,ep.y1,ep.cp1x,ep.cp1y,ep.cp2x,ep.cp2y,ep.x2,ep.y2,.5);
      var lox=0, loy=-5;
      if (e.arc)  { lox=-30; loy=-10; }
      if (e.loop) { lox=40;  loy=0; }
      e._lblBg.setAttribute('x', mp.x+lox); e._lblBg.setAttribute('y', mp.y+loy);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x+lox); e._lblTx.setAttribute('y', mp.y+loy); }
    }
  });
}

/* callflow-edges.js -- Edge building, rendering, regions, annotations */

// Restore saved positions from localStorage
restorePositions(NODES, STORAGE_KEY);

// Node map for ID lookup
var nm = {};
NODES.forEach(function(n) { nm[n.id] = n; });

// DOM references
var edgeSvg = document.getElementById('edgeSvg');
var nodeSvg = document.getElementById('nodeSvg');
var root    = document.getElementById('cnv');
var pctx    = document.getElementById('partCvs').getContext('2d');

// Build SVG defs (patterns, filters, markers)
buildSvgDefs(edgeSvg);

// Infrastructure region backdrops
addRegion(edgeSvg, 550, 640, 300, 560, '#60be35', 'PHIL WORKER GPU', 'VAD + RNNT + Inworld (cloud)');
addRegion(edgeSvg, 580, 870, 250, 90,  '#9f00fa', 'ANTHROPIC API',   'Claude Sonnet 4.6');
addRegion(edgeSvg, 580, 270, 250, 220, '#ee9612', 'TELNYX',          'SIP trunk + AMD');

// Concurrent annotation (VAD + RNNT)
(function() {
  var g = svgEl('g', {'pointer-events':'none'});
  g.appendChild(svgEl('line', {x1:'608',y1:'680',x2:'590',y2:'680',stroke:'#60be35','stroke-width':'1','stroke-dasharray':'3,3','stroke-opacity':'0.4'}));
  g.appendChild(svgEl('line', {x1:'590',y1:'680',x2:'590',y2:'790',stroke:'#60be35','stroke-width':'1','stroke-dasharray':'3,3','stroke-opacity':'0.4'}));
  g.appendChild(svgEl('line', {x1:'590',y1:'790',x2:'608',y2:'790',stroke:'#60be35','stroke-width':'1','stroke-dasharray':'3,3','stroke-opacity':'0.4'}));
  var t = svgEl('text', {x:'570',y:'740',fill:'#60be35','font-size':'8',
    'font-family':'JetBrains Mono,monospace','text-anchor':'end','letter-spacing':'0.1em',
    opacity:'0.6',transform:'rotate(-90 570 740)'});
  t.textContent = 'CONCURRENT'; g.appendChild(t);
  edgeSvg.appendChild(g);
})();

// Latency annotation: p50 ~550ms
(function() {
  var g = svgEl('g', {'pointer-events':'none'});
  g.appendChild(svgEl('rect', {x:'830',y:'870',width:'160',height:'32',rx:'3',
    fill:'#9f00fa10',stroke:'#9f00fa40','stroke-width':'1'}));
  var t = svgEl('text', {x:'910',y:'890',fill:'#9f00fa','font-size':'13',
    'font-family':'Barlow Condensed,sans-serif','font-weight':'700','text-anchor':'middle',
    'letter-spacing':'0.06em'});
  t.textContent = 'p50 ~ 550ms END-TO-END'; g.appendChild(t);
  edgeSvg.appendChild(g);
})();

// =====================================================
// BUILD EDGES
// =====================================================
var allEdges = [];
EDGES.forEach(function(e) {
  var n1 = nm[e.f], n2 = nm[e.t];
  if (!n1 || !n2) return;
  var ep;
  if (e.arc) {
    var b1 = getNodeBoundary(n1, n1.x-140, n1.y-100);
    var b2 = getNodeBoundary(n2, n2.x-160, n2.y+60);
    ep = {x1:b1.x,y1:b1.y,cp1x:n1.x-140,cp1y:n1.y-100,cp2x:n2.x-160,cp2y:n2.y+60,x2:b2.x,y2:b2.y};
  } else if (e.loop) {
    var b1 = getNodeBoundary(n1, n1.x+260, n1.y-80);
    var b2 = getNodeBoundary(n2, n2.x+260, n2.y+80);
    ep = {x1:b1.x,y1:b1.y,cp1x:n1.x+260,cp1y:n1.y-80,cp2x:n2.x+260,cp2y:n2.y+80,x2:b2.x,y2:b2.y};
  } else {
    var b1 = getNodeBoundary(n1, n2.x, n2.y);
    var b2 = getNodeBoundary(n2, n1.x, n1.y);
    ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.poff || 0);
  }
  allEdges.push({f:e.f,t:e.t,c:e.c,lbl:e.lbl,spd:e.spd,arc:e.arc,loop:e.loop,
    x1:ep.x1,y1:ep.y1,cp1x:ep.cp1x,cp1y:ep.cp1y,cp2x:ep.cp2x,cp2y:ep.cp2y,x2:ep.x2,y2:ep.y2});
});

// Render edge SVG paths + labels + hit areas
allEdges.forEach(function(e) {
  var d = 'M '+e.x1+','+e.y1+' C '+e.cp1x+','+e.cp1y+' '+e.cp2x+','+e.cp2y+' '+e.x2+','+e.y2;
  var glow = svgEl('path', {d:d,fill:'none',stroke:e.c,'stroke-width':'6','stroke-opacity':'0.05','pointer-events':'none'});
  edgeSvg.appendChild(glow); e._glow = glow;
  var dash = e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6');
  var opacity = (e.c === '#585858') ? '0.25' : '0.42';
  var main = svgEl('path', {d:d,fill:'none',stroke:e.c,
    'stroke-width':e.spd>=4?'2':'1.5', 'stroke-opacity':opacity,
    'stroke-dasharray':dash, 'marker-end':'url(#arr'+e.c.slice(1)+')', 'pointer-events':'none'});
  edgeSvg.appendChild(main); e._main = main;
  if (e.lbl) {
    var mp = cbPt(e.x1,e.y1,e.cp1x,e.cp1y,e.cp2x,e.cp2y,e.x2,e.y2,.5);
    var lox = 0, loy = -5;
    if (e.arc)  { lox = -30; loy = -10; }
    if (e.loop) { lox = 40;  loy = 0; }
    var bg = svgEl('text', {x:mp.x+lox,y:mp.y+loy,fill:'#141414','font-size':'8',
      'font-family':'JetBrains Mono,monospace','text-anchor':'middle',
      stroke:'#141414','stroke-width':'3','stroke-linejoin':'round','pointer-events':'none'});
    bg.textContent = e.lbl; edgeSvg.appendChild(bg); e._lblBg = bg;
    var tx = svgEl('text', {x:mp.x+lox,y:mp.y+loy,fill:e.c,'font-size':'8',
      'font-family':'JetBrains Mono,monospace','text-anchor':'middle',
      opacity:'0.75','letter-spacing':'0.06em','pointer-events':'none'});
    tx.textContent = e.lbl; edgeSvg.appendChild(tx); e._lblTx = tx;
  }
  var hitPath = svgEl('path', {d:d,fill:'none',stroke:'transparent','stroke-width':'18','pointer-events':'stroke',cursor:'pointer'});
  edgeSvg.appendChild(hitPath); e._hit = hitPath;
  (function(edge) {
    hitPath.addEventListener('mouseenter', function(ev) { showEdgeTooltip(edge, ev); });
    hitPath.addEventListener('mousemove', function(ev) { moveTooltip(ev); });
    hitPath.addEventListener('mouseleave', function() { hideTooltip(); });
  })(e);
});

// Latency badges on edges
(function() {
  var badges = [
    {label:'~150ms', x:645, y:628, c:'#60be35'},
    {label:'~0ms',   x:645, y:738, c:'#60be35'},
    {label:'~200ms', x:645, y:853, c:'#9f00fa'},
    {label:'~200ms', x:645, y:973, c:'#9f00fa'}
  ];
  badges.forEach(function(b) {
    edgeSvg.appendChild(svgEl('rect', {x:b.x-24,y:b.y-9,width:50,height:16,rx:'3',
      fill:'#141414',stroke:b.c+'40','stroke-width':'0.5','pointer-events':'none'}));
    var t = svgEl('text', {x:b.x,y:b.y+3,fill:b.c,'font-size':'9',
      'font-family':'JetBrains Mono,monospace','text-anchor':'middle',
      'font-weight':'500',opacity:'0.85','pointer-events':'none'});
    t.textContent = b.label; edgeSvg.appendChild(t);
  });
})();

/* callflow-main.js -- Node rendering, drag, tooltips, particle animation */

// =====================================================
// RENDER NODES
// =====================================================
var nodeGroups = {};
var edgeHighlight = [];
allEdges.forEach(function(e) {
  if (e._main) edgeHighlight.push({el:e._main, from:e.f, to:e.t, baseOp:e.c==='#585858'?'0.25':'0.42'});
});

function attachNodeEvents(g, n) {
  g.addEventListener('mouseenter', function(e2) {
    if (dragState.id) return;
    var conn = {}; conn[n.id] = true;
    EDGES.forEach(function(ed) { if (ed.f===n.id) conn[ed.t]=true; if (ed.t===n.id) conn[ed.f]=true; });
    NODES.forEach(function(nd) {
      var ng = nodeGroups[nd.id]; if (!ng) return;
      ng.setAttribute('opacity', conn[nd.id] ? '1' : '0.15');
    });
    edgeHighlight.forEach(function(h) {
      h.el.setAttribute('stroke-opacity', (h.from===n.id||h.to===n.id) ? '0.9' : '0.025');
    });
    showTooltip(n, e2);
  });
  g.addEventListener('mousemove', function(e2) { if (!dragState.id) moveTooltip(e2); });
  g.addEventListener('mouseleave', function() {
    if (dragState.id) return;
    NODES.forEach(function(nd) {
      var ng = nodeGroups[nd.id]; if (!ng) return;
      ng.setAttribute('opacity', nd.term ? '0.7' : '1');
    });
    edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
    hideTooltip();
  });
  g.addEventListener('mousedown', function(e2) { startDrag(e2, n.id); });
}

NODES.forEach(function(n) {
  var g = drawNodeShape(n);
  nodeGroups[n.id] = g;
  attachNodeEvents(g, n);
  nodeSvg.appendChild(g);
});

// Hub pulse + GPU LED animations via SVG style
(function() {
  var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = [
    '@keyframes svg-hub-pulse { 0%{filter:drop-shadow(0 0 0 rgba(159,0,250,.5))} 50%{filter:drop-shadow(0 0 8px rgba(159,0,250,.35))} 100%{filter:drop-shadow(0 0 0 rgba(159,0,250,0))} }',
    '#node-answer, #node-llm { animation: svg-hub-pulse 2.8s infinite; }',
    '@keyframes svg-gpu-led { 0%,100%{opacity:0.55} 50%{opacity:1} }',
    '#node-vad circle:nth-of-type(1), #node-stt circle:nth-of-type(1), #node-tts circle:nth-of-type(1) { animation: svg-gpu-led 2s infinite; }'
  ].join('\n');
  nodeSvg.insertBefore(style, nodeSvg.firstChild);
})();

// =====================================================
// DRAG
// =====================================================
function startDrag(e, nodeId) {
  hideTooltip();
  var wrap = document.getElementById('graphWrap');
  dragState.id = nodeId;
  dragState.startMx = e.clientX; dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x; dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft; dragState.scrollY = wrap.scrollTop;
  NODES.forEach(function(nd) {
    var ng = nodeGroups[nd.id]; if (!ng) return;
    ng.setAttribute('opacity', nd.term ? '0.7' : '1');
  });
  edgeHighlight.forEach(function(h) { h.el.setAttribute('stroke-opacity', h.baseOp); });
  e.preventDefault(); e.stopPropagation();
}

document.addEventListener('mousemove', function(e) {
  if (!dragState.id) return;
  var wrap = document.getElementById('graphWrap');
  var dx = e.clientX - dragState.startMx + (wrap.scrollLeft - dragState.scrollX);
  var dy = e.clientY - dragState.startMy + (wrap.scrollTop - dragState.scrollY);
  var n = nm[dragState.id];
  n.x = dragState.startNx + dx;
  n.y = dragState.startNy + dy;
  updateNodePosition(dragState.id);
  rebuildEdgesForNode(dragState.id);
});

document.addEventListener('mouseup', function() {
  if (!dragState.id) return;
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});

function updateNodePosition(nodeId) {
  var n = nm[nodeId];
  var g = nodeGroups[nodeId]; if (!g) return;
  var parent = g.parentNode;
  var newG = drawNodeShape(n);
  attachNodeEvents(newG, n);
  parent.replaceChild(newG, g);
  nodeGroups[nodeId] = newG;
}

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
  document.getElementById('tt-head-icon').innerHTML = iconLg(n.id, n.c);
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) { return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>'; }).join('');
  var sends = EDGES.filter(function(e) { return e.f===n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2192</span> <span>'+(nm[e.t]?nm[e.t].label:e.t)+(e.lbl?' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>':'')+'</span></div>';
  }).join('');
  var recvs = EDGES.filter(function(e) { return e.t===n.id; }).map(function(e) {
    return '<div class="tt-conn-item"><span style="color:'+e.c+'">\u2190</span> <span>'+(nm[e.f]?nm[e.f].label:e.f)+(e.lbl?' \u00b7 <em style="color:'+e.c+'">'+e.lbl+'</em>':'')+'</span></div>';
  }).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends?'<div class="tt-conn-title">Sends to</div>'+sends:'') +
    (recvs?'<div class="tt-conn-title" style="margin-top:'+(sends?6:0)+'px">Receives from</div>'+recvs:'');
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
  document.getElementById('tt-sv').textContent = 'CONNECTION';
  document.getElementById('tt-sv').style.color = e.c;
  document.getElementById('tt-head-icon').innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(function(kv) { return '<div class="tt-row"><span class="tt-k">'+kv[0]+'</span><span class="tt-v">'+kv[1]+'</span></div>'; }).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
}

// =====================================================
// PARTICLES -- comet trails
// =====================================================
var particles = [];
allEdges.forEach(function(e) {
  var cnt = e.spd>=4.5 ? 4 : e.spd>=3 ? 3 : e.spd>=2 ? 2 : 1;
  for (var j = 0; j < cnt; j++) particles.push({edge:e, t:j/cnt, trail:[]});
});

var lastTime = performance.now();
function animate(now) {
  var dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 1400);
  particles.forEach(function(p) {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    var e = p.edge;
    var pt = cbPt(e.x1,e.y1,e.cp1x,e.cp1y,e.cp2x,e.cp2y,e.x2,e.y2,p.t);
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
