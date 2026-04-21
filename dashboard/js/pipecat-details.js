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
