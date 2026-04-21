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
    m:[['Model','claude-sonnet-4-6'],['Context','200k tokens'],['Host','Anthropic API'],['Mode','Streaming response'],['Preheat','Full spec loaded before call'],['Caching','enable_prompt_caching=True'],['Latency','~200ms first token (Anthropic DC, SF · 5.6ms)']],
    note:'Live call LLM with prompt caching enabled. Never used for async tasks \u2014 Haiku handles post-call extraction. Streaming tokens go to Inworld TTS for real-time synthesis.' },
  tts:       { role:'Inworld TTS Mini \u00b7 Cloud API', status:'READY', sc:'#60be35',
    m:[['Model','Inworld TTS 1.5 Max'],['Mode','WebSocket streaming \u00b7 token/sentence'],['First chunk','~200ms (p50) · Google SJC, 13ms'],['ELO','1577 (TTS Arena)'],['Host','Inworld Cloud API'],['Output','8kHz G.711 native \u2014 no resample needed'],['Pre-render','First turn + VM cached']],
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
    m:[['Split','Token/sentence mode \u00b7 WebSocket'],['First chunk','~200ms (p50) / ~300ms (p95) · Google SJC, 13ms'],['Engine','Inworld TTS Mini \u00b7 Cloud API'],['Output','8kHz G.711 native'],['ELO','1577 (TTS Arena)']],
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
