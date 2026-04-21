/* pipecat.js — Pipecat Pipeline graph (merged) */

/* pipecat-data.js — STORAGE_KEY, ICONS, NODES, EDGES for graph_pipecat (Voice Pipeline) */

const STORAGE_KEY = 'phil-pos-pipecat';

// ═══════════════════════════════════════════════════
// SERVICE ICONS — maps node id → PNG filename in img/icons/services/
// ═══════════════════════════════════════════════════
const SVC_ICONS = {
  telnyx_in:'telnyx', amd:'telnyx',
  vad:'silero', smartturn:'pipecat', parakeet:'nvidia', moonshine:'nvidia', bargein:'pipecat',
  adapter:'pipecat', sonnet:'anthropic', cache:'anthropic', haiku:'anthropic',
  inworld:'inworld', kokoro:'kokoro', prerender:'pipecat', comfort:'pipecat',
  telnyx_out:'telnyx', recording:'digitalocean', transfer_ring:'telnyx',
  fl_opening:'pipecat', fl_voicemail:'pipecat', fl_qualifying:'pipecat',
  fl_objection:'pipecat', fl_transfer:'pipecat', fl_closing:'pipecat'
};

// ═══════════════════════════════════════════════════
// SVG ICONS (20x20 viewBox, stroke-based)
// ═══════════════════════════════════════════════════
const ICONS = {
  telnyx_in: icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M13,3h4v4 M17,3 L13.5,6.5'),
  amd:      icon('M10,3a7,7 0 1,0 .01,0Z M7,8h6 M7,12h6 M10,8v4'),
  vad:      icon('M1,10h2 M4,7v6 M6,5v10 M8,8v4 M10,6v8 M12,8v4 M14,5v10 M16,7v6 M18,10h1 M1,14h18'),
  smartturn:icon('M3,10a7,7 0 0,1 14,0 M10,3v4 M5,4.5 L7,7 M15,4.5 L13,7 M10,10v4 M8,12h4'),
  parakeet: icon('M1,10h2 M3,10 L4,5 L5,15 L6,7 L7,13 L8,9 L9,11 L10,8 L11,12 L12,10 L13,10 M13,10 L14,7 L15,13 L16,10 h2'),
  moonshine:icon('M10,2 Q13,6 13,10 Q13,14 10,18 M10,2 Q7,6 7,10 Q7,14 10,18 M3,10h14 M10,2v16'),
  bargein:  icon('M3,3 L17,17 M17,3 L3,17 M10,2v3 M10,15v3 M2,10h3 M15,10h3'),
  adapter:  icon('M4,4h5v5H4z M11,4h5v5H11z M4,11h5v5H4z M11,11h5v5H11z M9,6.5h2 M6.5,9v2 M13.5,9v2 M9,13.5h2'),
  sonnet:   icon('M10,4a6,6 0 1,0 .01,0Z M10,4 L7,8 L10,12 L13,8Z M10,12v4 M7,8 L4,10 M13,8 L16,10 M4,10a1.5,1.5 0 1,0 .01,0Z M16,10a1.5,1.5 0 1,0 .01,0Z M10,16a1.5,1.5 0 1,0 .01,0Z'),
  cache:    icon('M3,4h14v3H3z M3,9h14v3H3z M3,14h14v3H3z M5,5.5h2 M5,10.5h2 M5,15.5h2 M14,5.5h1 M14,10.5h1 M14,15.5h1'),
  haiku:    icon('M10,3 a7,7 0 1,0 .01,0Z M10,6v4 L13,12 M10,3 L10,1 M7,2.5 L10,1 L13,2.5'),
  inworld:  icon('M2,7h4 L10,3 L10,17 L6,13 H2 V7z M13,7 Q15.5,8.5 15.5,10 Q15.5,11.5 13,13 M15,5 Q18.5,7 18.5,10 Q18.5,13 15,15'),
  kokoro:   icon('M2,7h4 L10,3 L10,17 L6,13 H2 V7z M13,7 Q15.5,8.5 15.5,10 Q15.5,11.5 13,13 M15,5 Q18.5,7 18.5,10 Q18.5,13 15,15'),
  prerender:icon('M3,5 L10,2 L17,5 M3,5v10 L10,18 L17,15V5 M10,2v16 M3,10 L10,13 L17,10'),
  comfort:  icon('M4,10h2 M6,8v4 M9,6v8 M12,8v4 M14,10h2 M3,14h14'),
  telnyx_out:icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z'),
  recording:icon('M10,2v16 M6,6v8 M14,6v8 M3,9v2 M17,9v2'),
  transfer_ring:icon('M6.5,8 a3,3 0 1,0 .01,0Z M1,17 C1,13.5 3.5,11.5 6.5,11.5 S12,13.5 12,17 M13,6 C14.5,4.5 17,5 17.5,7 S16,10 14,9 M15,11 C18,12 20,14.5 19.5,17'),
  fl_opening:  icon('M10,2v6 M7,5 L10,8 L13,5 M3,10h14 M5,14h10 M7,17h6'),
  fl_voicemail:icon('M2,5h16v10H2V5z M2,5 L10,11 L18,5 M2,15 L7,10 M18,15 L13,10'),
  fl_qualifying:icon('M10,2a8,8 0 1,0 .01,0Z M10,6v5 M10,14v1'),
  fl_objection: icon('M3,3h14v11H10l-4,3v-3H3V3z M7,7h6 M7,10h4'),
  fl_transfer:  icon('M2,10h6 M6,7 L9,10 L6,13 M11,10h6 M15,7 L18,10 L15,13'),
  fl_closing:   icon('M10,2a8,8 0 1,0 .01,0Z M7,10 L9.5,12.5 L13.5,7.5')
};

// ═══════════════════════════════════════════════════
// NODES — Pipecat Voice Pipeline
// ═══════════════════════════════════════════════════
const NODES = [
  // TELEPHONY IN column
  {id:'telnyx_in',  label:'Telnyx SIP In',     sub:'G.711 \u03bc-law 8kHz\nClient audio stream',               x:170, y:300, c:'#ff4040'},
  {id:'amd',        label:'AMD Detection',     sub:'Answering machine detect\nBranch to VOICEMAIL',            x:170, y:530, c:'#ff4040'},

  // AUDIO PROCESSING column
  {id:'vad',        label:'Silero VAD',        sub:'Voice activity detection\n0.2s stop_secs',                  x:420, y:180, c:'#60be35'},
  {id:'smartturn',  label:'SmartTurn v3',      sub:'Prosody + VAD\nIntelligent end-of-turn',                   x:420, y:370, c:'#60be35'},
  {id:'parakeet',   label:'Parakeet RNNT',     sub:'1.1B streaming STT\n~0ms marginal latency',               x:420, y:560, c:'#60be35'},
  {id:'moonshine',  label:'Moonshine',         sub:'Fallback STT\nManual toggle only',                        x:420, y:740, c:'#585858'},
  {id:'bargein',    label:'Barge-In',          sub:'500ms threshold\nInterrupt handler',                       x:420, y:900, c:'#ee9612'},

  // LLM column
  {id:'adapter',    label:'AnthropicAdapter',  sub:'Native Claude format\nFunction call handler',              x:700, y:180, c:'#9f00fa'},
  {id:'sonnet',     label:'Claude Sonnet',     sub:'Live call LLM \u00b7 Streaming tokens\nPreheated KV cache \u00b7 ~200ms p50',   x:700, y:400, c:'#d36eff', hub:true},
  {id:'cache',      label:'Prompt Cache',      sub:'~45k tokens KV cache\nenable_prompt_caching=True',         x:700, y:620, c:'#9f00fa'},
  {id:'haiku',      label:'Claude Haiku',      sub:'ParallelPipeline \u00b7 Async\nPost-turn extraction only',     x:700, y:840, c:'#d36eff'},

  // TTS column
  {id:'inworld',    label:'Inworld TTS Mini',  sub:'Model inworld-tts-1.5-max \u00b7 ELO 1577\nWebSocket \u00b7 ~200ms TTFA',  x:990, y:280, c:'#ee9612'},
  {id:'kokoro',     label:'Kokoro v1',         sub:'Fallback TTS \u00b7 ELO 1056\nLocal GPU \u00b7 ~50ms TTFA',     x:990, y:490, c:'#585858'},
  {id:'prerender',  label:'Pre-Rendered',      sub:'Turn 1 + VM cached\n~200ms playback start',                x:990, y:680, c:'#9f00fa'},
  {id:'comfort',    label:'Comfort Noise',     sub:'Processing gap filler\nTelnyx native support',             x:990, y:870, c:'#585858'},

  // OUTPUT column
  {id:'telnyx_out', label:'Telnyx RTP Out',    sub:'Audio delivery\nNo resampling (primary)',                   x:1260, y:280, c:'#ff4040'},
  {id:'recording',  label:'DO Spaces',         sub:'Dual-channel stereo\nReal-time stream',                    x:1260, y:530, c:'#60be35'},
  {id:'transfer_ring',label:'Warm Transfer',   sub:'Parallel ring \u00b7 up to 3 reps\n16s timeout \u00b7 weighted round-robin', x:1260, y:770, c:'#ee9612'},

  // PIPECAT FLOWS column
  {id:'fl_opening',    label:'OPENING',        sub:'Identity + reason\nAMD branch',                            x:1530, y:160, c:'#9f00fa'},
  {id:'fl_voicemail',  label:'VOICEMAIL',      sub:'Cached VM audio\nAMD detected',                            x:1530, y:320, c:'#585858'},
  {id:'fl_qualifying', label:'QUALIFYING',     sub:'Proposal details\nValue discussion',                       x:1530, y:480, c:'#d36eff'},
  {id:'fl_objection',  label:'OBJECTION_HANDLING', sub:'Price \u00b7 Timing \u00b7 Scope\nCompetitor handling',       x:1530, y:640, c:'#ee9612'},
  {id:'fl_transfer',   label:'TRANSFER',       sub:'Warm transfer seq\nConfirm interest',                      x:1530, y:800, c:'#ff4040'},
  {id:'fl_closing',    label:'CLOSING',        sub:'Wrap up \u00b7 Next steps\nOpt-out \u00b7 Terminal',              x:1530, y:940, c:'#585858'},
];

// ═══════════════════════════════════════════════════
// EDGES
// ═══════════════════════════════════════════════════
const EDGES = [
  // ── Main voice pipeline (left to right) ──
  {f:'telnyx_in', t:'vad',       c:'#ff4040', lbl:'audio stream',     spd:5.0, ctrl:true},
  {f:'vad',       t:'smartturn', c:'#60be35', lbl:'voice activity',   spd:3.0},
  {f:'vad',       t:'parakeet',  c:'#60be35', lbl:'concurrent stream',spd:4.5},
  {f:'smartturn', t:'parakeet',  c:'#60be35', lbl:'end-of-turn',      spd:3.5, ctrl:true},
  {f:'parakeet',  t:'sonnet',    c:'#9f00fa', lbl:'transcript',       spd:4.0},
  {f:'sonnet',    t:'inworld',   c:'#ee9612', lbl:'response tokens',  spd:4.0},
  {f:'inworld',   t:'telnyx_out',c:'#ff4040', lbl:'audio out',        spd:5.0, ctrl:true},

  // ── Adapter + cache ──
  {f:'adapter',   t:'sonnet',    c:'#9f00fa', lbl:'native format',    spd:1.5},
  {f:'cache',     t:'sonnet',    c:'#9f00fa', lbl:'KV cache',         spd:1.0},

  // ── Fallback paths ──
  {f:'parakeet',  t:'moonshine', c:'#585858', lbl:'fallback',         spd:0.5},
  {f:'inworld',   t:'kokoro',    c:'#585858', lbl:'fallback',         spd:0.5},

  // ── ParallelPipeline ──
  {f:'sonnet',    t:'haiku',     c:'#d36eff', lbl:'post-turn async',  spd:1.2},

  // ── Pre-render ──
  {f:'sonnet',    t:'prerender', c:'#9f00fa', lbl:'pre-generate',     spd:1.5},
  {f:'inworld',   t:'prerender', c:'#ee9612', lbl:'render audio',     spd:1.5},
  {f:'prerender', t:'telnyx_out',c:'#9f00fa', lbl:'cached audio',     spd:2.0},

  // ── Comfort noise ──
  {f:'comfort',   t:'telnyx_out',c:'#585858', lbl:'gap fill',         spd:1.0},

  // ── Barge-in ──
  {f:'telnyx_in', t:'bargein',   c:'#ee9612', lbl:'client speech',    spd:3.5},
  {f:'bargein',   t:'inworld',   c:'#ee9612', lbl:'cancel TTS',       spd:4.0, ctrl:true},
  {f:'bargein',   t:'parakeet',  c:'#60be35', lbl:'capture speech',   spd:3.5},

  // ── AMD ──
  {f:'telnyx_in', t:'amd',       c:'#ff4040', lbl:'detect',           spd:2.0},
  {f:'amd',       t:'fl_voicemail',c:'#585858',lbl:'machine detected', spd:2.0, ctrl:true},

  // ── Recording ──
  {f:'telnyx_in', t:'recording', c:'#60be35', lbl:'client audio',     spd:2.5},
  {f:'telnyx_out',t:'recording', c:'#60be35', lbl:'phil audio',       spd:2.5},

  // ── Transfer ──
  {f:'sonnet',    t:'transfer_ring',c:'#ee9612',lbl:'transfer trigger',spd:2.5, ctrl:true},

  // ── Sonnet drives Flows ──
  {f:'sonnet',    t:'fl_opening',c:'#9f00fa', lbl:'function calls',   spd:2.0, ctrl:true},

  // ── Pipecat Flows state transitions ──
  {f:'fl_opening',   t:'fl_voicemail', c:'#585858', lbl:'AMD',             spd:2.0},
  {f:'fl_opening',   t:'fl_qualifying',c:'#d36eff', lbl:'engagement',      spd:2.5},
  {f:'fl_opening',   t:'fl_closing',   c:'#585858', lbl:'opt-out',         spd:1.5},
  {f:'fl_voicemail', t:'fl_closing',   c:'#585858', lbl:'VM delivered',    spd:1.5},
  {f:'fl_qualifying',t:'fl_objection', c:'#ee9612', lbl:'objection',       spd:2.0},
  {f:'fl_qualifying',t:'fl_transfer',  c:'#ff4040', lbl:'buy signal',      spd:3.0, ctrl:true},
  {f:'fl_qualifying',t:'fl_closing',   c:'#585858', lbl:'call ending',     spd:1.5},
  {f:'fl_objection', t:'fl_qualifying',c:'#d36eff', lbl:'resolved',        spd:2.0},
  {f:'fl_objection', t:'fl_transfer',  c:'#ff4040', lbl:'wants rep',       spd:3.0, ctrl:true},
  {f:'fl_objection', t:'fl_closing',   c:'#585858', lbl:'call ending',     spd:1.5},
  {f:'fl_transfer',  t:'fl_closing',   c:'#585858', lbl:'complete',        spd:1.5},
];

/* pipecat-details.js — NODE_DETAILS for graph_pipecat tooltip data */

const NODE_DETAILS = {
  telnyx_in: { role:'Telnyx SIP Ingest \u00b7 Client Audio Stream', status:'LISTENING', sc:'#ff4040',
    m:[['Protocol','SIP trunk \u00b7 G.711 \u03bc-law 8kHz'],['Provider','Telnyx PSTN'],['Latency','~5ms to established RTP'],['Format','8kHz mono \u00b7 narrow-band'],['AMD','Answer Machine Detection enabled'],['Call control','Sales Worker owns all Telnyx legs']],
    note:'Client audio enters here via Telnyx SIP trunk. G.711 \u03bc-law 8kHz. Sales Worker controls all call legs directly during live calls.' },

  amd: { role:'Answering Machine Detection', status:'ARMED', sc:'#ee9612',
    m:[['Provider','Telnyx built-in AMD'],['Trigger','Machine greeting detected'],['Action','Branch to VOICEMAIL state'],['Timing','Within first 3\u20134s of call']],
    note:'Telnyx AMD detects answering machines. On detection, Pipecat Flows transitions to VOICEMAIL state and plays pre-rendered VM audio.' },

  vad: { role:'Silero VAD \u00b7 Voice Activity Detection', status:'READY', sc:'#60be35',
    m:[['Model','Silero VAD'],['Threshold','0.2s stop_secs (configurable)'],['Location','Sales Worker GPU'],['Overlap','Runs concurrently with Parakeet RNNT'],['Barge-in','500ms client speech \u2192 interrupt']],
    note:'VAD and RNNT stream concurrently \u2014 ~90% of transcript complete by VAD silence trigger. SmartTurn v3 uses prosodic features + VAD for intelligent turn-end detection.' },

  smartturn: { role:'SmartTurn v3 \u00b7 End-of-Turn Detection', status:'READY', sc:'#60be35',
    m:[['Version','v3 \u00b7 LocalSmartTurnAnalyzerV3'],['Method','Prosody + VAD \u00b7 not silence-only'],['Inference','~65ms CPU inference'],['Latency','Fires ~150ms (prosody, not full 200ms)'],['Validation','< 5% false positive, < 10% false negative'],['Weights','Pre-loaded on RunPod template'],['Config','Controller-adjustable threshold']],
    note:'SmartTurn v3 replaces fixed silence timeout. Uses prosodic features for intelligent end-of-turn detection. Fires early (~150ms) via prosody analysis. Weights: LocalSmartTurnAnalyzerV3 pre-loaded on template.' },

  parakeet: { role:'Parakeet RNNT 1.1B \u00b7 Streaming STT', status:'READY', sc:'#60be35',
    m:[['Model','Parakeet RNNT 1.1B (NVIDIA)'],['Mode','Streaming \u2014 incremental transcription'],['Marginal latency','~0ms after SmartTurn trigger'],['Location','Sales Worker (localhost:8001)'],['Audio','8kHz G.711 \u03bc-law input'],['Benchmark','stt-benchmark CLI tool'],['Fallback','Moonshine \u2014 manual toggle only']],
    note:'Streaming RNNT replaces offline TDT. Near-zero marginal latency because transcription overlaps with audio input \u2014 ~90% of transcript complete by SmartTurn trigger. Must benchmark on 8kHz G.711 phone audio.' },

  moonshine: { role:'Moonshine \u00b7 Fallback STT', status:'STANDBY', sc:'#585858',
    m:[['Purpose','Fallback if RNNT underperforms on phone audio'],['Trained on','Noisier data \u2014 may outperform on narrow-band'],['Toggle','Controller: STT Model \u2014 manual only'],['Auto-switch','NEVER auto-switches'],['Activation','Only if RNNT accuracy drops on 8kHz G.711']],
    note:'Moonshine fallback only activates via manual Controller toggle. Trained on noisier data, may outperform on narrow-band 8kHz despite lower benchmark scores. Never auto-switches.' },

  bargein: { role:'Barge-In Handler \u00b7 Interruption Control', status:'ARMED', sc:'#ee9612',
    m:[['Threshold','500ms (configurable in Controller)'],['> 500ms','Client speech interrupts Sales'],['< 500ms','Backchannel ("uh-huh") \u2192 ignored'],['Action','Cancel TTS + capture speech'],['History','Tuned up from 300ms (too many false triggers)'],['Context','Claude receives [interrupted] + [Client: ...]']],
    note:'Barge-in at 500ms threshold. On interrupt: Inworld TTS cancelled immediately, Parakeet captures client speech, Claude gets interrupted context + new client speech. Does NOT resume interrupted utterance.' },

  adapter: { role:'AnthropicAdapter \u00b7 Native Claude Format', status:'ACTIVE', sc:'#9f00fa',
    m:[['Framework','Pipecat Anthropic integration'],['Format','Native tool_use / function_call'],['Purpose','State transitions via function calls'],['Functions','transition_qualifying(), transition_transfer(), etc.'],['Requires','Pipecat v0.0.108+']],
    note:'AnthropicAdapter handles Claude\'s native tool_use format. Pipecat Flows uses it to execute state transitions via function calls. Each Flows node defines available functions that map to outgoing edges.' },

  sonnet: { role:'Claude Sonnet 4.6 \u00b7 Live Call LLM', status:'PREHEATED', sc:'#60be35',
    m:[['Model','Claude Sonnet (Anthropic API)'],['Preheat','~45k tokens cached before dial'],['First token','~200ms p50 \u00b7 ~400ms p95 (5.6ms network)'],['Turn 3+','~150ms (warm KV cache)'],['Caching','enable_prompt_caching=True'],['Streaming','Token-by-token to TTS'],['Total pipeline','~550ms p50 \u00b7 ~750ms p95 \u00b7 800ms ceiling']],
    note:'Live call LLM. Preheated KV cache keeps ~45k spec tokens warm. Streaming tokens pipe to Inworld TTS on sentence boundaries. Never in async path \u2014 Haiku handles post-call.' },

  cache: { role:'Prompt Caching \u00b7 KV Cache Preheating', status:'WARM', sc:'#60be35',
    m:[['Tokens cached','~45k per call load'],['Includes','SPEC v1.0 + ZC_* docs + call intel'],['Feature','enable_prompt_caching=True'],['Benefit','85% faster first token, 90% cost reduction'],['Turn 3+','Fully warm \u2014 reuses cached prefixes'],['Benchmark','Cache hit rate > 90%']],
    note:'Prompt caching keeps spec/context warm across turns. Pre-call intel goes in preheated context, not repeated per turn. Turns 3+ benefit from fully warm KV cache.' },

  haiku: { role:'Claude Haiku 4.5 \u00b7 ParallelPipeline', status:'STANDBY', sc:'#d36eff',
    m:[['Model','claude-haiku-4-5-20251001'],['Pipeline','ParallelPipeline (async)'],['Timing','Post-turn \u2014 NEVER live path'],['Extracts','Sentiment, intent, objection type, follow-up signals'],['Output','Transcript stream for post-call processing'],['Cost','Fraction of Sonnet']],
    note:'Haiku runs in ParallelPipeline alongside main Sonnet conversation. Extracts structured data post-turn without blocking live path. Results written to transcript stream.' },

  inworld: { role:'Inworld TTS Mini \u00b7 Primary TTS', status:'CONNECTED', sc:'#ee9612',
    m:[['Model','inworld-tts-1.5-max'],['Quality','ELO 1577 (+521 over Kokoro)'],['Protocol','WebSocket streaming'],['TTFA','~200ms p50 \u00b7 ~300ms p95 (13ms network to SJC)'],['Streaming','Sentence-boundary chunking (TOKEN mode tunable post-launch)'],['Pre-warm','on_turn_context_created hook'],['Output','Phone-ready \u2014 no resampling']],
    note:'Primary TTS: Inworld TTS Mini via cloud WebSocket (model inworld-tts-1.5-max). ELO 1577 quality. Sentence-boundary streaming: first sentence pipes to TTS while Claude generates sentence 2. TOKEN mode (Inworld processes tokens as they stream) expected to reduce p50 further \u2014 benchmark from RunPod required. No resampling needed \u2014 native phone-ready output.' },

  kokoro: { role:'Kokoro v1 \u00b7 Fallback TTS', status:'STANDBY', sc:'#585858',
    m:[['Quality','ELO 1056 (Inworld is +521 higher)'],['TTFA','~50ms (130ms faster than Inworld)'],['Location','Sales Worker GPU (localhost:8002)'],['Activation','Only if Inworld health check fails'],['Resampling','24kHz \u2192 8kHz G.711 \u03bc-law (anti-alias at 3.4kHz cutoff)'],['State','Worker signals armed-degraded'],['Toggle','Controller: Force Kokoro TTS'],['Fallback latency','~420ms p50 \u00b7 ~650ms p95']],
    note:'Silent fallback TTS. Kokoro v1 only starts if Inworld health check fails. 130ms faster but ELO 1056 vs 1577. Worker signals armed-degraded when Kokoro active. Requires resampling pipeline with anti-aliasing low-pass filter (3.4kHz cutoff \u2014 G.711 Nyquist limit).' },

  prerender: { role:'Pre-Rendered Audio \u00b7 Cached Responses', status:'CACHED', sc:'#9f00fa',
    m:[['Turn 1','Opening statement pre-rendered'],['Voicemail','VM audio pre-rendered'],['Turn 2','2 likely responses cached'],['Latency','~200ms playback start (zero inference)'],['Hit rate','Track after 50 calls \u2014 drop if < 30%'],['Process','Claude generates \u2192 Inworld renders \u2192 cached']],
    note:'Before Telnyx dials, Worker pre-renders Turn 1 opening + VM variant + 2 likely Turn 2 responses. Turn 1 latency = ~200ms (audio playback, zero inference). If Turn 2 cache hit < 30% after 50 calls, drop second-turn pre-renders.' },

  comfort: { role:'Comfort Noise \u00b7 Processing Gap Filler', status:'ACTIVE', sc:'#585858',
    m:[['Purpose','Fill ~550\u2013750ms processing gaps'],['Method','Subtle ambient tone during silence'],['Support','Telnyx native comfort noise'],['Perception','Caller knows line is still active'],['Alternative','Dead silence feels like dropped call']],
    note:'Injects subtle comfort noise during processing gaps (between client finishing and Sales\'s audio starting). Telnyx supports this natively. Fills the ~550\u2013750ms window.' },

  telnyx_out: { role:'Telnyx RTP Out \u00b7 Audio Delivery', status:'STREAMING', sc:'#ff4040',
    m:[['Delivery','~5ms into established RTP stream'],['Format','No resampling in primary path'],['Sources','Inworld TTS (primary) + pre-rendered + comfort noise'],['Kokoro path','Requires 24kHz \u2192 8kHz resample'],['Provider','Telnyx SIP'],['Latency','~5ms p50, ~10ms p95']],
    note:'Final audio delivery via Telnyx RTP. No resampling needed for Inworld primary path. Kokoro fallback requires 24kHz \u2192 8kHz resample pipeline.' },

  recording: { role:'DO Spaces \u00b7 Dual-Channel Recording', status:'STREAMING', sc:'#60be35',
    m:[['Format','Dual-channel stereo (client left, Sales right)'],['Path','Worker \u2192 sales-app \u2192 DO Spaces'],['Streaming','Real-time via WebSocket'],['Storage','S3-compatible bucket'],['Cost','~$5/mo at launch volume'],['Survives','Recording survives worker death']],
    note:'Dual-channel stereo recording. Audio streams to sales-app in real-time via WebSocket, then to DO Spaces. Post-call: stitched into stereo recording. Survives worker death.' },

  transfer_ring: { role:'Warm Transfer \u00b7 Parallel Ring', status:'READY', sc:'#ee9612',
    m:[['Ring','Parallel ring up to 3 reps'],['Timeout','16s per ring attempt'],['SMS','Transfer SMS fires when ringing starts'],['Weights','Weighted round-robin (default equal, Alex-configurable)'],['Rule','First to answer gets call'],['Trigger','TRANSFER state via Pipecat Flows']],
    note:'Triggered from TRANSFER state. Parallel ring up to 3 reps, 16s timeout. Transfer SMS fires before pickup with client name, propID, value, days stale. First to answer gets the call.' },

  fl_opening: { role:'OPENING \u00b7 Pipecat Flows Node', status:'ACTIVE', sc:'#9f00fa',
    m:[['Purpose','Opening line, identity, reason for call'],['AMD branch','transition_voicemail() on machine detect'],['Engagement','transition_qualifying() on client response'],['Opt-out','transition_closing() on immediate opt-out'],['Prompt','~200\u2013400 tokens focused context'],['Exits to','VOICEMAIL, QUALIFYING, CLOSING'],['Debug','Flows debug mode toggle in Controller \u2014 logs transitions']],
    note:'First Flows node. AMD detection branches to VOICEMAIL. Client engagement triggers QUALIFYING. Opt-out goes to CLOSING. Focused prompt (~200\u2013400 tokens) keeps context lean. Pipecat Flows debug mode (Controller toggle) logs state transitions to live transcript with timestamps.' },

  fl_voicemail: { role:'VOICEMAIL \u00b7 Pipecat Flows Node', status:'READY', sc:'#585858',
    m:[['Purpose','Play cached voicemail audio'],['Trigger','AMD detected in OPENING'],['Audio','Pre-rendered VM audio (cached)'],['Exit','transition_closing() after delivered'],['Duration','Single VM message']],
    note:'Plays pre-rendered voicemail audio when AMD detects answering machine. Single exit to CLOSING after delivery.' },

  fl_qualifying: { role:'QUALIFYING \u00b7 Pipecat Flows Node', status:'READY', sc:'#d36eff',
    m:[['Purpose','Confirm proposal, discuss value, surface opportunities'],['On objection','transition_objection() \u2192 OBJECTION_HANDLING'],['On buy signal','transition_transfer() \u2192 TRANSFER'],['On call ending','transition_closing() \u2192 CLOSING'],['Context','Proposal details + client history in KV cache'],['Key','Lead with proposal# + property name']],
    note:'Core conversation node. Confirms proposal details, discusses value, surfaces opportunities. Buy signals trigger TRANSFER. Objections route to OBJECTION_HANDLING. Cross-cutting context stays in preheated KV cache prefix.' },

  fl_objection: { role:'OBJECTION_HANDLING \u00b7 Pipecat Flows Node', status:'READY', sc:'#ee9612',
    m:[['Purpose','Address price, timing, competitor, scope concerns'],['Resolved','transition_qualifying() \u2192 back to QUALIFYING'],['Wants rep','transition_transfer() \u2192 TRANSFER'],['Call ending','transition_closing() \u2192 CLOSING'],['Strategy','Acknowledge \u2192 reframe \u2192 propose next step']],
    note:'Handles objections (price, timing, competitor, scope). Can return to QUALIFYING if resolved, advance to TRANSFER if client wants a rep, or close.' },

  fl_transfer: { role:'TRANSFER \u00b7 Pipecat Flows Node', status:'READY', sc:'#ff4040',
    m:[['Purpose','Warm transfer sequence'],['Confirm','Verify client interest before ring'],['Ring','Parallel ring up to 3 reps \u00b7 16s timeout'],['Scenarios','Rep answers, no answer (16s timeout), client declines'],['Exit','transition_closing() on complete or failure'],['SMS','Transfer SMS fires at ring start']],
    note:'Warm transfer node. Confirms interest, initiates parallel ring. SMS alert fires when ringing starts. Exits to CLOSING on transfer complete, all reps unavailable, or client declines.' },

  fl_closing: { role:'CLOSING \u00b7 Terminal Pipecat Flows Node', status:'READY', sc:'#585858',
    m:[['Purpose','Wrap up, confirm next steps, goodbye'],['Terminal','No outgoing transitions'],['Handles','Opt-out \u00b7 DNC flag \u00b7 Callback scheduling'],['Post-call','Haiku extracts structured data'],['Audio','Goodbye phrase + call ends']],
    note:'Terminal state. Wraps up the call, confirms next steps, handles opt-out/DNC. After call ends, Haiku extracts structured data via ParallelPipeline.' },
};

/* pipecat-edge-details.js — EDGE_DETAILS for graph_pipecat edge tooltip data */

const EDGE_DETAILS = {
  telnyx_in__vad: {
    title:'AUDIO INGEST', sub:'Telnyx SIP \u2192 Silero VAD',
    m:[['Stream','Client audio stream'],['Format','8kHz G.711 \u03bc-law'],['Purpose','Voice activity detection'],['Latency','~5ms from RTP stream']],
    note:'Client audio enters Sales Worker via Telnyx SIP trunk. Streamed to Silero VAD for voice activity detection.' },
  vad__smartturn: {
    title:'VOICE ACTIVITY', sub:'Silero VAD \u2192 SmartTurn v3',
    m:[['Signal','Voice activity detected / silence'],['Method','VAD feeds SmartTurn for end-of-turn'],['Threshold','200ms stop_secs'],['Prosody','SmartTurn uses prosodic features + VAD']],
    note:'VAD signals voice activity to SmartTurn v3. SmartTurn combines VAD with prosodic analysis for intelligent end-of-turn detection.' },
  vad__parakeet: {
    title:'CONCURRENT STREAM', sub:'Silero VAD \u2192 Parakeet RNNT',
    m:[['Mode','Streaming \u2014 concurrent with VAD'],['Overlap','RNNT transcribes as audio arrives'],['Coverage','~90% transcript ready by SmartTurn trigger'],['Latency','Near-zero added latency']],
    note:'VAD and RNNT stream concurrently. Parakeet transcribes incrementally as audio arrives \u2014 ~90% of transcript complete by the time SmartTurn triggers end-of-speech.' },
  smartturn__parakeet: {
    title:'END-OF-TURN TRIGGER', sub:'SmartTurn v3 \u2192 Parakeet RNNT',
    m:[['Signal','End-of-turn detected'],['Method','Prosody + VAD (fires ~150ms)'],['Action','Final transcript segment emitted'],['Result','Complete transcript sent to Claude']],
    note:'SmartTurn v3 fires end-of-turn trigger (~150ms via prosody). Parakeet emits final transcript segment. Complete transcript forwarded to Claude Sonnet.' },
  parakeet__sonnet: {
    title:'LIVE TRANSCRIPT', sub:'Parakeet RNNT \u2192 Claude Sonnet',
    m:[['Output','Real-time transcript'],['Destination','Claude Sonnet for response generation'],['Mode','Streaming tokens'],['Marginal latency','~0ms after SmartTurn trigger']],
    note:'Real-time transcript forwarded to Claude Sonnet. Near-zero marginal latency since transcription overlapped with audio input.' },
  sonnet__inworld: {
    title:'RESPONSE STREAM', sub:'Claude Sonnet \u2192 Inworld TTS Mini',
    m:[['Output','LLM response tokens'],['Chunking','Sentence-boundary split (SENTENCE mode)'],['Method','First sentence pipes to TTS immediately'],['Overlap','Claude generates sentence 2 while TTS renders sentence 1'],['TOKEN mode','Tunable post-launch \u2014 expected to reduce p50']],
    note:'LLM response tokens streamed to Inworld TTS Mini via WebSocket. Sentence-boundary chunking: first sentence pipes immediately (~200ms), TTS renders while Claude continues generating. TOKEN mode (Inworld processes tokens as they stream) tunable post-launch \u2014 expected to reduce p50.' },
  inworld__telnyx_out: {
    title:'AUDIO DELIVERY', sub:'Inworld TTS Mini \u2192 Telnyx RTP',
    m:[['Input','Synthesized phone-ready audio'],['Resampling','None needed in primary path'],['Delivery','~5ms into established RTP stream'],['TTFA','~200ms for first audio chunk']],
    note:'Inworld TTS audio delivered to phone via Telnyx RTP. No resampling needed \u2014 native phone-ready format. ~5ms delivery into established stream.' },
  adapter__sonnet: {
    title:'NATIVE FORMAT', sub:'AnthropicAdapter \u2192 Claude Sonnet',
    m:[['Format','Native tool_use / function_call'],['Purpose','Pipecat Flows state transitions'],['Functions','transition_qualifying(), transition_transfer(), etc.'],['Framework','Pipecat Anthropic integration']],
    note:'AnthropicAdapter provides native Claude format handling. Pipecat Flows uses function calls for state transitions.' },
  cache__sonnet: {
    title:'KV CACHE', sub:'Prompt Cache \u2192 Claude Sonnet',
    m:[['Tokens','~45k cached per call'],['Includes','SPEC v1.0 + ZC_* docs + call intel'],['Feature','enable_prompt_caching=True'],['Turn 3+','Fully warm, reuses cached prefixes'],['Benefit','85% faster first token']],
    note:'Prompt caching keeps ~45k tokens warm across turns. Pre-call intel in preheated context. 85% faster first token, 90% cost reduction on cached tokens.' },
  parakeet__moonshine: {
    title:'STT FALLBACK', sub:'Parakeet RNNT \u2192 Moonshine',
    m:[['Trigger','Manual Controller toggle only'],['Reason','RNNT underperforms on 8kHz phone audio'],['Advantage','Trained on noisier data'],['Auto-switch','NEVER \u2014 manual only']],
    note:'Moonshine fallback if Parakeet RNNT underperforms on 8kHz G.711 phone audio. Manual toggle only \u2014 never auto-switches. Moonshine trained on noisier data, may outperform on narrow-band.' },
  inworld__kokoro: {
    title:'TTS FALLBACK', sub:'Inworld TTS Mini \u2192 Kokoro v1',
    m:[['Trigger','Inworld health check fails at boot'],['Quality','ELO 1056 vs 1577 (Inworld +521)'],['Speed','~50ms TTFA (130ms faster)'],['Resampling','24kHz \u2192 8kHz G.711 (anti-alias at 3.4kHz)'],['State','Worker signals armed-degraded'],['Fallback latency','~420ms p50 \u00b7 ~650ms p95']],
    note:'Kokoro v1 activates only if Inworld health check fails. Faster (~50ms TTFA) but lower quality (ELO 1056). Requires 24kHz \u2192 8kHz resample pipeline with anti-aliasing low-pass filter (3.4kHz cutoff). Worker signals armed-degraded. Total fallback pipeline: ~420ms p50, ~650ms p95.' },
  sonnet__haiku: {
    title:'PARALLEL PIPELINE', sub:'Claude Sonnet \u2192 Claude Haiku',
    m:[['Pipeline','ParallelPipeline (async, non-blocking)'],['Timing','Post-turn extraction'],['Extracts','Sentiment, intent, objection type, follow-up'],['Model','Claude Haiku (Anthropic API)'],['Path','NEVER in live path']],
    note:'Haiku runs in ParallelPipeline alongside Sonnet. Post-turn: extracts sentiment, intent, objection type, follow-up signals. Never blocks live path. Results written to transcript stream.' },
  sonnet__prerender: {
    title:'PRE-GENERATION', sub:'Claude Sonnet \u2192 Pre-Rendered Audio',
    m:[['Content','Opening statement + VM + 2 likely responses'],['Timing','Before Telnyx dials'],['Process','Claude generates text \u2192 Inworld renders'],['Result','Cached audio bytes']],
    note:'Before dialing, Claude generates opening + VM variant + 2 likely Turn 2 responses. Text forwarded to Inworld TTS for audio rendering.' },
  inworld__prerender: {
    title:'AUDIO PRE-RENDER', sub:'Inworld TTS Mini \u2192 Pre-Rendered Audio',
    m:[['Input','Pre-generated text from Claude'],['Output','Cached audio bytes'],['Items','Opening + VM + 2 responses'],['Quality','Same ELO 1577 as live']],
    note:'Inworld TTS renders pre-generated text into cached audio bytes. Same quality as live TTS (ELO 1577).' },
  prerender__telnyx_out: {
    title:'CACHED PLAYBACK', sub:'Pre-Rendered \u2192 Telnyx RTP',
    m:[['Turn 1','~200ms playback start (zero inference)'],['VM','Cached voicemail audio on AMD'],['Turn 2','Cached if path matches (\u226430% hit rate target)'],['Benefit','Eliminates pipeline latency for Turn 1']],
    note:'Pre-rendered audio plays immediately on client pickup. Turn 1 latency = ~200ms (audio playback, zero inference). VM audio plays on AMD detection.' },
  comfort__telnyx_out: {
    title:'GAP FILLER', sub:'Comfort Noise \u2192 Telnyx RTP',
    m:[['Purpose','Fill ~550\u2013750ms processing gaps'],['Method','Subtle ambient tone'],['Support','Telnyx native comfort noise'],['Perception','Line feels active, not dropped']],
    note:'Comfort noise fills processing gaps between client speech and Sales\'s response. Prevents dead silence that feels like dropped call.' },
  telnyx_in__bargein: {
    title:'SPEECH DETECTION', sub:'Telnyx Audio \u2192 Barge-In Handler',
    m:[['Monitors','Client speech while Sales is talking'],['Threshold','500ms of client speech'],['< 500ms','Backchannel \u2014 ignored'],['> 500ms','Interrupt triggered']],
    note:'Monitors for client speech during Sales\'s TTS output. 500ms threshold separates backchannels from real interrupts.' },
  bargein__inworld: {
    title:'TTS CANCEL', sub:'Barge-In \u2192 Inworld TTS Mini',
    m:[['Action','Immediately cancel Inworld audio stream'],['Method','Telnyx stops sending TTS audio'],['Kokoro','Local audio stops if fallback active'],['Speed','Instantaneous cancellation']],
    note:'On barge-in trigger: Inworld TTS audio stream cancelled immediately. Sales stops talking.' },
  bargein__parakeet: {
    title:'CAPTURE SPEECH', sub:'Barge-In \u2192 Parakeet RNNT',
    m:[['Action','Capture client\'s interrupting speech'],['Context','[Sales was saying: "...(interrupted)"]'],['Result','[Client: "..."] sent to Claude'],['Response','Claude generates fresh response']],
    note:'After barge-in, Parakeet captures client\'s speech. Claude receives interrupted context + client\'s new speech. Generates fresh response \u2014 does NOT resume interrupted utterance.' },
  telnyx_in__amd: {
    title:'MACHINE DETECTION', sub:'Telnyx \u2192 AMD',
    m:[['Method','Telnyx built-in AMD'],['Timing','First 3\u20134 seconds of call'],['Outcome','human or machine'],['On machine','Transition to VOICEMAIL state']],
    note:'Telnyx AMD analyzes first seconds of call audio to detect answering machines.' },
  amd__fl_voicemail: {
    title:'VM TRIGGER', sub:'AMD \u2192 VOICEMAIL State',
    m:[['Condition','Machine greeting detected'],['Action','Pipecat Flows transitions to VOICEMAIL'],['Audio','Pre-rendered VM audio plays'],['State','OPENING \u2192 VOICEMAIL']],
    note:'AMD detects machine \u2192 Pipecat Flows transitions from OPENING to VOICEMAIL state. Pre-rendered VM audio plays.' },
  telnyx_in__recording: {
    title:'CLIENT AUDIO CAPTURE', sub:'Telnyx \u2192 Recording',
    m:[['Channel','Left channel (client audio)'],['Format','Dual-channel stereo'],['Path','Worker \u2192 sales-app \u2192 DO Spaces'],['Streaming','Real-time WebSocket']],
    note:'Client audio captured as left channel of dual-channel stereo recording. Streamed in real-time.' },
  telnyx_out__recording: {
    title:'PHIL AUDIO CAPTURE', sub:'Telnyx Out \u2192 Recording',
    m:[['Channel','Right channel (Sales audio)'],['Format','Dual-channel stereo'],['Post-call','Stitched into stereo file'],['Storage','DO Spaces S3 bucket']],
    note:'Sales\'s audio captured as right channel. Post-call: stitched with client audio into stereo recording in DO Spaces.' },
  sonnet__transfer_ring: {
    title:'TRANSFER TRIGGER', sub:'Claude Sonnet \u2192 Warm Transfer',
    m:[['Trigger','transition_transfer() function call'],['From state','QUALIFYING or OBJECTION'],['Action','Parallel ring up to 3 reps'],['SMS','Transfer SMS fires at ring start']],
    note:'Claude triggers warm transfer via function call. Pipecat Flows transitions to TRANSFER state. Parallel ring + SMS alert to reps.' },
  sonnet__fl_opening: {
    title:'FLOWS ENGINE', sub:'Claude Sonnet \u2192 Pipecat Flows',
    m:[['Mechanism','Function calls drive transitions'],['Adapter','AnthropicAdapter \u2014 native format'],['States','6-node directed graph'],['Functions','transition_qualifying(), transition_transfer(), etc.'],['Prompts','Each node: ~200\u2013400 token focused prompt']],
    note:'Claude drives Pipecat Flows via function calls. Each state node has focused prompt. AnthropicAdapter handles native tool_use format. Requires Pipecat v0.0.108+.' },
  // Pipecat Flows transitions
  fl_opening__fl_voicemail: {
    title:'AMD BRANCH', sub:'OPENING \u2192 VOICEMAIL',
    m:[['Trigger','transition_voicemail()'],['Condition','AMD detects answering machine'],['Audio','Pre-rendered VM plays'],['Terminal','Exits to CLOSING after delivery']],
    note:'AMD detection branches to VOICEMAIL state. Pre-rendered voicemail audio plays.' },
  fl_opening__fl_qualifying: {
    title:'ENGAGEMENT', sub:'OPENING \u2192 QUALIFYING',
    m:[['Trigger','transition_qualifying()'],['Condition','Client engages / responds'],['Next','Proposal discussion begins'],['Context','KV cache supplies proposal details']],
    note:'Client engagement triggers transition to QUALIFYING. Proposal details + client history available from KV cache.' },
  fl_opening__fl_closing: {
    title:'IMMEDIATE OPT-OUT', sub:'OPENING \u2192 CLOSING',
    m:[['Trigger','transition_closing()'],['Condition','Client immediately opts out'],['Action','DNC flag if hostile'],['End','Call wraps up']],
    note:'Immediate opt-out goes directly to CLOSING. DNC flag set if hostile tone detected.' },
  fl_voicemail__fl_closing: {
    title:'VM COMPLETE', sub:'VOICEMAIL \u2192 CLOSING',
    m:[['Trigger','transition_closing()'],['Condition','Voicemail message delivered'],['Action','Call ends'],['Only exit','VOICEMAIL has single exit']],
    note:'After voicemail delivered, transitions to CLOSING. Only exit from VOICEMAIL.' },
  fl_qualifying__fl_objection: {
    title:'OBJECTION RAISED', sub:'QUALIFYING \u2192 OBJECTION',
    m:[['Trigger','transition_objection()'],['Types','Price, timing, competitor, scope'],['Strategy','Acknowledge \u2192 reframe \u2192 propose'],['Can return','Back to QUALIFYING if resolved']],
    note:'Objection raised during qualifying triggers OBJECTION state. Can return to QUALIFYING after resolution.' },
  fl_qualifying__fl_transfer: {
    title:'BUY SIGNAL', sub:'QUALIFYING \u2192 TRANSFER',
    m:[['Trigger','transition_transfer()'],['Condition','Client shows buy intent'],['Action','Warm transfer sequence begins'],['Ring','Parallel ring up to 3 reps']],
    note:'Buy signal during qualifying triggers warm transfer sequence.' },
  fl_qualifying__fl_closing: {
    title:'CALL ENDING', sub:'QUALIFYING \u2192 CLOSING',
    m:[['Trigger','transition_closing()'],['Conditions','No interest, call ending, time constraint'],['Action','Wrap up + next steps'],['Post-call','Haiku extracts structured data']],
    note:'Call ending during qualifying transitions to CLOSING for wrap-up.' },
  fl_objection__fl_qualifying: {
    title:'RESOLVED', sub:'OBJECTION \u2192 QUALIFYING',
    m:[['Trigger','transition_qualifying()'],['Condition','Objection addressed successfully'],['Return','Back to proposal discussion'],['Strategy','Reframe completed']],
    note:'Objection resolved, returns to QUALIFYING to continue proposal discussion.' },
  fl_objection__fl_transfer: {
    title:'WANTS REP', sub:'OBJECTION \u2192 TRANSFER',
    m:[['Trigger','transition_transfer()'],['Condition','Client wants to talk to a rep'],['Action','Warm transfer begins'],['Context','Rep gets SMS with proposal details']],
    note:'Client wants a human rep during objection handling. Warm transfer initiated.' },
  fl_objection__fl_closing: {
    title:'CALL ENDING', sub:'OBJECTION \u2192 CLOSING',
    m:[['Trigger','transition_closing()'],['Condition','Unresolved objection, call ending'],['Action','Wrap up + schedule callback if appropriate']],
    note:'Call ending during objection handling transitions to CLOSING.' },
  fl_transfer__fl_closing: {
    title:'TRANSFER COMPLETE', sub:'TRANSFER \u2192 CLOSING',
    m:[['Trigger','transition_closing()'],['Scenarios','Transfer complete, all reps unavailable, client declines'],['Post-transfer','Rep takes over if answered'],['Timeout','16s per ring attempt']],
    note:'TRANSFER exits to CLOSING. Scenarios: successful transfer, all reps unavailable (16s timeout), or client declines transfer.' },
};

/* pipecat-main.js — setup, drag, tooltip, particles, zoom for graph_pipecat */

// ═══════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════
restorePositions(NODES, STORAGE_KEY);
const nm = {};
NODES.forEach(n => nm[n.id] = n);

const svg  = document.getElementById('edgeSvg');
const root = document.getElementById('cnv');
const pctx = document.getElementById('partCvs').getContext('2d');

// -- Zoom state --
var zoomLevel = 1;
const zoomPct = document.getElementById('zoomPct');
function zoomTo(level, cx, cy) {
  const wrap = document.getElementById('graphWrap');
  const prev = zoomLevel;
  zoomLevel = Math.round(Math.max(0.3, Math.min(3, level)) * 100) / 100;
  root.style.transform = 'scale(' + zoomLevel + ')';
  root.style.transformOrigin = '0 0';
  zoomPct.textContent = Math.round(zoomLevel * 100) + '%';
  if (cx !== undefined) {
    const r = zoomLevel / prev;
    wrap.scrollLeft = cx * r - (cx - wrap.scrollLeft);
    wrap.scrollTop  = cy * r - (cy - wrap.scrollTop);
  }
}

// -- Infrastructure region backdrops --
addRegion(svg, 90, 200, 200, 430, '#ff4040', 'TELEPHONY IN', 'Telnyx SIP \u00b7 G.711 8kHz');
addRegion(svg, 340, 100, 200, 870, '#60be35', 'AUDIO PROCESSING', 'Silero VAD \u00b7 SmartTurn v3 \u00b7 Parakeet RNNT');
addRegion(svg, 610, 100, 210, 820, '#d36eff', 'LLM INTELLIGENCE', 'Claude Sonnet \u00b7 Haiku \u00b7 AnthropicAdapter');
addRegion(svg, 900, 180, 210, 780, '#ee9612', 'TEXT-TO-SPEECH', 'Inworld TTS \u00b7 Kokoro (fallback) \u00b7 Pre-render');
addRegion(svg, 1170, 180, 200, 680, '#ff4040', 'OUTPUT + RECORDING', 'Telnyx RTP \u00b7 DO Spaces \u00b7 Warm Transfer');
addRegion(svg, 1440, 80, 200, 920, '#9f00fa', 'PIPECAT FLOWS', '6-node state machine \u00b7 v0.0.108+');

// -- Column headers --
[{x:170,l:'TELEPHONY'},{x:440,l:'AUDIO / STT'},{x:720,l:'LLM'},
 {x:1000,l:'TTS'},{x:1270,l:'OUTPUT'},{x:1540,l:'FLOWS'}].forEach(({x,l}) => {
  const t = svgEl('text', {x, y:'36', fill:'#383838', 'font-size':'9',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle', 'letter-spacing':'0.22em'});
  t.textContent = l; svg.appendChild(t);
  svg.appendChild(svgEl('line', {x1:x-72, y1:'43', x2:x+72, y2:'43', stroke:'#2e2e2e', 'stroke-width':'0.5'}));
});

// -- Arrow markers --
const defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#d36eff','#585858'].forEach(col => {
  const m = svgEl('marker', {id:'arr'+col.slice(1), markerUnits:'userSpaceOnUse', markerWidth:'8', markerHeight:'6', refX:'7', refY:'3', orient:'auto'});
  m.appendChild(svgEl('path', {d:'M0,0 L8,3 L0,6 Z', fill:col+'bb'}));
  defs.appendChild(m);
  const mc = svgEl('marker', {id:'ctrl_arr'+col.slice(1), markerUnits:'userSpaceOnUse', markerWidth:'10', markerHeight:'8', refX:'9', refY:'4', orient:'auto'});
  mc.appendChild(svgEl('path', {d:'M0,0 L10,4 L0,8 Z', fill:col}));
  defs.appendChild(mc);
});
svg.insertBefore(defs, svg.firstChild);

// -- Build edges and nodes --
const allEdges = buildEdges(svg, nm);
const edgeHighlight = buildEdgeHighlight(allEdges);
NODES.forEach(n => renderNode(n, root, edgeHighlight));

// ═══════════════════════════════════════════════════
// DRAG
// ═══════════════════════════════════════════════════
const startDrag = (e, nodeId) => {
  hideTooltip();
  const wrap = document.getElementById('graphWrap');
  dragState.id = nodeId;
  dragState.startMx = e.clientX; dragState.startMy = e.clientY;
  dragState.startNx = nm[nodeId].x; dragState.startNy = nm[nodeId].y;
  dragState.scrollX = wrap.scrollLeft; dragState.scrollY = wrap.scrollTop;
  document.getElementById('nd-' + nodeId).classList.add('dragging');
  document.querySelectorAll('.nd').forEach(el => { el.classList.remove('dimmed', 'lit'); });
  edgeHighlight.forEach(({ el, baseOp }) => el.setAttribute('stroke-opacity', baseOp));
  e.preventDefault(); e.stopPropagation();
};
document.addEventListener('mousemove', e => {
  if (!dragState.id) return;
  const wrap = document.getElementById('graphWrap');
  const dx = (e.clientX - dragState.startMx + (wrap.scrollLeft - dragState.scrollX)) / zoomLevel;
  const dy = (e.clientY - dragState.startMy + (wrap.scrollTop - dragState.scrollY)) / zoomLevel;
  nm[dragState.id].x = dragState.startNx + dx;
  nm[dragState.id].y = dragState.startNy + dy;
  const el = document.getElementById('nd-' + dragState.id);
  el.style.left = nm[dragState.id].x + 'px';
  el.style.top = nm[dragState.id].y + 'px';
  rebuildEdgesForNode(dragState.id);
});
document.addEventListener('mouseup', () => {
  if (!dragState.id) return;
  document.getElementById('nd-' + dragState.id).classList.remove('dragging');
  savePositions(NODES, STORAGE_KEY);
  dragState.id = null;
});

// ═══════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════
const showTooltip = (n, e2) => {
  const d = NODE_DETAILS[n.id]; if (!d) return;
  document.getElementById('tt-name').textContent = n.label;
  document.getElementById('tt-name').style.color = n.c;
  document.getElementById('tt-role').textContent = d.role;
  const sdot = document.getElementById('tt-sdot');
  sdot.style.background = d.sc; sdot.style.color = d.sc;
  document.getElementById('tt-sv').textContent = d.status;
  document.getElementById('tt-sv').style.color = d.sc;
  document.getElementById('tt-head-icon').innerHTML = iconLg(n.id, n.c);
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(([k,v]) => `<div class="tt-row"><span class="tt-k">${k}</span><span class="tt-v">${v}</span></div>`).join('');
  const sends = EDGES.filter(e => e.f === n.id).map(e => `<div class="tt-conn-item"><span style="color:${e.c}">\u2192</span> <span>${nm[e.t] ? nm[e.t].label : e.t}${e.lbl ? ' \u00b7 <em style="color:' + e.c + '">' + e.lbl + '</em>' : ''}</span></div>`).join('');
  const recvs = EDGES.filter(e => e.t === n.id).map(e => `<div class="tt-conn-item"><span style="color:${e.c}">\u2190</span> <span>${nm[e.f] ? nm[e.f].label : e.f}${e.lbl ? ' \u00b7 <em style="color:' + e.c + '">' + e.lbl + '</em>' : ''}</span></div>`).join('');
  document.getElementById('tt-conns').innerHTML =
    (sends ? `<div class="tt-conn-title">Sends to</div>${sends}` : '') + (recvs ? `<div class="tt-conn-title" style="margin-top:${sends ? 6 : 0}px">Receives from</div>${recvs}` : '');
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(e2);
};
const showEdgeTooltip = (e, ev) => {
  let key = e.f + '__' + e.t;
  if (e.poff) key += '__sms';
  const d = EDGE_DETAILS[key]; if (!d) return;
  document.getElementById('tt-name').textContent = d.title;
  document.getElementById('tt-name').style.color = e.c;
  document.getElementById('tt-role').textContent = d.sub;
  const sdot = document.getElementById('tt-sdot');
  sdot.style.background = e.c; sdot.style.color = e.c;
  document.getElementById('tt-sv').textContent = e.ctrl ? 'CONTROL' : 'CONNECTION';
  document.getElementById('tt-sv').style.color = e.c;
  document.getElementById('tt-head-icon').innerHTML = '';
  document.getElementById('tt-metrics').innerHTML =
    d.m.map(([k,v]) => `<div class="tt-row"><span class="tt-k">${k}</span><span class="tt-v">${v}</span></div>`).join('');
  document.getElementById('tt-conns').innerHTML = '';
  document.getElementById('tt-note').textContent = d.note;
  tt.style.display = 'block'; moveTooltip(ev);
};

// ═══════════════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════════════
const particles = [];
allEdges.forEach(e => {
  const cnt = e.spd >= 4.5 ? 4 : e.spd >= 3 ? 3 : e.spd >= 2 ? 2 : 1;
  for (let j = 0; j < cnt; j++) particles.push({ edge: e, t: j / cnt, trail: [] });
});
let lastTime = performance.now();
const animate = (now) => {
  const dt = Math.min(now - lastTime, 50); lastTime = now;
  pctx.clearRect(0, 0, 1920, 1040);
  particles.forEach(p => {
    p.t += (p.edge.spd / 620) * dt;
    if (p.t > 1) p.t -= 1;
    const e = p.edge;
    const pt = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, p.t);
    p.trail.push({ x: pt.x, y: pt.y });
    if (p.trail.length > 10) p.trail.shift();
    for (let i = 1; i < p.trail.length; i++) {
      pctx.beginPath();
      pctx.arc(p.trail[i].x, p.trail[i].y, (i / p.trail.length) * (e.spd >= 4 ? 2.8 : 2.2), 0, Math.PI * 2);
      pctx.fillStyle = e.c;
      pctx.globalAlpha = (i / p.trail.length) * 0.5 * (e.rev ? 0.35 : 0.85);
      pctx.fill();
    }
    pctx.save();
    pctx.shadowColor = e.c; pctx.shadowBlur = e.spd >= 4 ? 14 : 8;
    pctx.fillStyle = e.c; pctx.globalAlpha = e.rev ? 0.45 : 1;
    pctx.beginPath();
    pctx.arc(pt.x, pt.y, e.spd >= 4 ? 3.5 : 2.8, 0, Math.PI * 2);
    pctx.fill(); pctx.restore();
    pctx.globalAlpha = 1;
  });
  requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

// ═══════════════════════════════════════════════════
// SCROLL + WHEEL ZOOM
// ═══════════════════════════════════════════════════
document.getElementById('graphWrap').scrollTop = 40;
document.getElementById('graphWrap').addEventListener('wheel', function(e) {
  e.preventDefault();
  if (e.ctrlKey) {
    const delta = -e.deltaY * 0.01;
    const rect = this.getBoundingClientRect();
    zoomTo(zoomLevel + delta, e.clientX - rect.left + this.scrollLeft, e.clientY - rect.top + this.scrollTop);
  } else {
    this.scrollLeft += e.deltaX;
    this.scrollTop += e.deltaY;
  }
}, { passive: false });

/* pipecat-render.js — edge geometry, SVG edge rendering, node DOM for graph_pipecat */

const BIDIR_OFF = 7;

// -- Edge geometry helpers --

const clipToBorder = (n, tx, ty) => {
  let hw, hh;
  if (n.hub) { hw = 103; hh = 50; }
  else       { hw = 92;  hh = 46; }
  const dx = tx - n.x, dy = ty - n.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return { x: n.x, y: n.y + hh };
  const scaleX = hw / (Math.abs(dx) || 0.001), scaleY = hh / (Math.abs(dy) || 0.001);
  const scale = Math.min(scaleX, scaleY);
  return { x: n.x + dx * scale, y: n.y + dy * scale };
};

const makeEdgePath = (x1, y1, x2, y2, perpOff) => {
  if (perpOff) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
    x1 += -dy / len * perpOff; y1 += dx / len * perpOff;
    x2 += -dy / len * perpOff; y2 += dx / len * perpOff;
  }
  const dx = x2 - x1;
  return { x1, y1, cp1x: x1 + dx * .5, cp1y: y1, cp2x: x1 + dx * .5, cp2y: y2, x2, y2 };
};

const rebuildEdgesForNode = (nodeId) => {
  allEdges.forEach(e => {
    if (e.f !== nodeId && e.t !== nodeId) return;
    let srcN, dstN;
    if (e.rev) { srcN = nm[e.t]; dstN = nm[e.f]; }
    else       { srcN = nm[e.f]; dstN = nm[e.t]; }
    const b1 = clipToBorder(srcN, dstN.x, dstN.y);
    const b2 = clipToBorder(dstN, srcN.x, srcN.y);
    const pp = e.rev ? BIDIR_OFF : (e.poff || 0);
    const ep = makeEdgePath(b1.x, b1.y, b2.x, b2.y, pp);
    Object.assign(e, ep);
    const d = `M ${ep.x1},${ep.y1} C ${ep.cp1x},${ep.cp1y} ${ep.cp2x},${ep.cp2y} ${ep.x2},${ep.y2}`;
    if (e._glow) e._glow.setAttribute('d', d);
    if (e._main) e._main.setAttribute('d', d);
    if (e._hit) e._hit.setAttribute('d', d);
    if (e._lblBg && !e.rev) {
      const mp = cbPt(ep.x1, ep.y1, ep.cp1x, ep.cp1y, ep.cp2x, ep.cp2y, ep.x2, ep.y2, .5);
      e._lblBg.setAttribute('x', mp.x); e._lblBg.setAttribute('y', mp.y - 5);
      if (e._lblTx) { e._lblTx.setAttribute('x', mp.x); e._lblTx.setAttribute('y', mp.y - 5); }
    }
  });
};

// -- Build all edge SVG elements --

const buildEdges = (svgParent, nm) => {
  const allEdges = [];
  EDGES.forEach(e => {
    const n1 = nm[e.f], n2 = nm[e.t];
    if (!n1 || !n2) return;
    const b1 = clipToBorder(n1, n2.x, n2.y);
    const b2 = clipToBorder(n2, n1.x, n1.y);
    const fwd = makeEdgePath(b1.x, b1.y, b2.x, b2.y, e.bi ? BIDIR_OFF : (e.poff || 0));
    allEdges.push({ ...e, ...fwd, rev: false });
    if (e.bi) {
      const bwd = makeEdgePath(b2.x, b2.y, b1.x, b1.y, BIDIR_OFF);
      allEdges.push({ ...e, ...bwd, lbl: '', rev: true, bi: false });
    }
  });

  allEdges.forEach(e => {
    const d = `M ${e.x1},${e.y1} C ${e.cp1x},${e.cp1y} ${e.cp2x},${e.cp2y} ${e.x2},${e.y2}`;
    const glow = svgEl('path', { d, fill: 'none', stroke: e.c, 'stroke-width': '6', 'stroke-opacity': '0.05' });
    svgParent.appendChild(glow); e._glow = glow;
    const isCtrl = e.ctrl && !e.rev;
    const dash = isCtrl ? '' : (e.spd >= 4 ? '' : (e.spd >= 2 ? '6,3' : '4,6'));
    const sw = isCtrl ? '2.5' : (e.spd >= 4 ? '2' : '1.5');
    const sop = e.rev ? '0.15' : (isCtrl ? '0.65' : '0.42');
    const mkr = isCtrl ? `url(#ctrl_arr${e.c.slice(1)})` : `url(#arr${e.c.slice(1)})`;
    const main = svgEl('path', { d, fill: 'none', stroke: e.c,
      'stroke-width': sw, 'stroke-opacity': sop,
      'stroke-dasharray': dash, 'marker-end': mkr });
    svgParent.appendChild(main); e._main = main;
    if (e.lbl && !e.rev) {
      const mp = cbPt(e.x1, e.y1, e.cp1x, e.cp1y, e.cp2x, e.cp2y, e.x2, e.y2, .5);
      const bg = svgEl('text', { x: mp.x, y: mp.y - 5, fill: '#141414', 'font-size': '8',
        'font-family': 'JetBrains Mono,monospace', 'text-anchor': 'middle',
        stroke: '#141414', 'stroke-width': '3', 'stroke-linejoin': 'round' });
      bg.textContent = e.lbl; svgParent.appendChild(bg); e._lblBg = bg;
      const tx = svgEl('text', { x: mp.x, y: mp.y - 5, fill: e.c, 'font-size': '8',
        'font-family': 'JetBrains Mono,monospace', 'text-anchor': 'middle',
        opacity: '0.75', 'letter-spacing': '0.06em' });
      tx.textContent = e.lbl; svgParent.appendChild(tx); e._lblTx = tx;
    }
    // Edge hover hit area
    if (!e.rev) {
      const hit = svgEl('path', { d, fill: 'none', stroke: 'transparent', 'stroke-width': '18',
        'pointer-events': 'stroke', cursor: 'pointer' });
      svgParent.appendChild(hit); e._hit = hit;
      (function(edge) {
        hit.addEventListener('mouseenter', ev => { showEdgeTooltip(edge, ev); });
        hit.addEventListener('mousemove', ev => { moveTooltip(ev); });
        hit.addEventListener('mouseleave', () => { hideTooltip(); });
      })(e);
    }
  });
  return allEdges;
};

// -- Build edge highlight index --

const buildEdgeHighlight = (allEdges) => {
  const edgeHighlight = [];
  allEdges.forEach(e => {
    if (e._main) edgeHighlight.push({
      el: e._main, from: e.f, to: e.t, rev: e.rev,
      baseOp: e.rev ? '0.15' : (e.ctrl ? '0.65' : '0.42')
    });
  });
  return edgeHighlight;
};

// -- Render a single node card (DOM div) --

const renderNode = (n, root, edgeHighlight) => {
  const div = document.createElement('div');
  const isGpu = (n.id === 'vad' || n.id === 'smartturn' || n.id === 'parakeet' || n.id === 'moonshine');
  const isFlow = n.id.startsWith('fl_');
  div.className = 'nd' + (n.hub ? ' hub' : '') + (isGpu ? ' gpu-node' : '') + (isFlow ? ' flow-node' : '');
  div.id = 'nd-' + n.id;
  div.style.left = n.x + 'px'; div.style.top = n.y + 'px';
  div.style.borderLeftColor = n.c;
  div.style.setProperty('--nd-c', n.c);

  const ico = ICONS[n.id]
    ? ICONS[n.id].replace('stroke="currentColor"', `stroke="${n.c}"`)
    : '';

  const svcFile = SVC_ICONS[n.id];
  const svcIco = svcFile
    ? `<img class="nd-svc" src="img/icons/services/${svcFile}.png" alt="" draggable="false">`
    : '';

  const details = NODE_DETAILS[n.id];
  const ledColor = details ? details.sc : '#555';
  const ledHtml = `<div class="nd-stat"><div class="nd-led" style="background:${ledColor};box-shadow:0 0 5px ${ledColor}"></div><span class="nd-stat-txt" style="color:${ledColor}60;font-size:7.5px">${details ? details.status : '\u2014'}</span></div>`;

  let extra = '';
  if (n.hub) extra = `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u25c8 CORE LLM</div>`;
  // Pipeline badges
  if (n.id === 'vad')       extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">0.2s STOP_SECS</div>`;
  if (n.id === 'smartturn') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">~150ms PROSODY</div>`;
  if (n.id === 'parakeet')  extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">1.1B STREAMING</div>`;
  if (n.id === 'bargein')   extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">500ms THRESHOLD</div>`;
  if (n.id === 'inworld')   extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">ELO 1577</div>`;
  if (n.id === 'kokoro')    extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u26a0 FALLBACK</div>`;
  if (n.id === 'moonshine') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u26a0 FALLBACK</div>`;
  if (n.id === 'prerender') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">~200ms TURN 1</div>`;
  if (n.id === 'cache')     extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">~45K TOKENS</div>`;
  if (n.id === 'haiku')     extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">ASYNC ONLY</div>`;
  if (n.id === 'adapter')   extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">v0.0.108+</div>`;
  if (n.id === 'recording') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">DUAL-CHANNEL</div>`;
  if (n.id === 'transfer_ring') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u22643 REPS \u00b7 16s</div>`;
  // Flows badges
  if (n.id === 'fl_opening')    extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u25b6 ENTRY</div>`;
  if (n.id === 'fl_closing')    extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u25a0 TERMINAL</div>`;

  div.innerHTML = `
<div class="nd-header">
  ${svcIco}<div class="nd-label" style="color:${n.c}">${n.label}</div>
  <div class="nd-icon">${ico}</div>
</div>
<div class="nd-sub">${n.sub.split('\n').join('<br>')}</div>
${ledHtml}${extra}`;

  div.addEventListener('mouseenter', e2 => {
    if (dragState.id) return;
    const conn = new Set([n.id]);
    EDGES.forEach(e => { if (e.f === n.id) conn.add(e.t); if (e.t === n.id) conn.add(e.f); });
    document.querySelectorAll('.nd').forEach(el => {
      const nid = el.id.replace('nd-', '');
      el.classList.toggle('dimmed', !conn.has(nid));
      el.classList.toggle('lit', conn.has(nid));
    });
    edgeHighlight.forEach(({ el, from, to }) => {
      el.setAttribute('stroke-opacity', (from === n.id || to === n.id) ? '0.9' : '0.025');
    });
    showTooltip(n, e2);
  });
  div.addEventListener('mousemove', e2 => { if (!dragState.id) moveTooltip(e2); });
  div.addEventListener('mouseleave', () => {
    if (dragState.id) return;
    document.querySelectorAll('.nd').forEach(el => { el.classList.remove('dimmed', 'lit'); });
    edgeHighlight.forEach(({ el, baseOp }) => el.setAttribute('stroke-opacity', baseOp));
    hideTooltip();
  });
  div.addEventListener('mousedown', e2 => startDrag(e2, n.id));
  root.appendChild(div);
};
