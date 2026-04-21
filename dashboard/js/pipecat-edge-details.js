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
