/* nodes-edge-details.js — EDGE_DETAILS for tab_nodes edge tooltip data */

const EDGE_DETAILS = {
  ivan__matrix: {
    title:'COMMAND CHANNEL', sub:'Alex \u2192 Matrix',
    m:[['Protocol','Matrix IM \u00b7 End-to-end encrypted'],['Sends','Batch approvals, overrides, kill commands'],['Channel','#queue \u00b7 Alex full control'],['Frequency','Per-batch + ad-hoc overrides']],
    note:'Alex sends batch approvals, overrides, kill commands via Matrix. C&C protocol.' },
  matrix__claw: {
    title:'COMMAND RELAY', sub:'Matrix \u2192 SalesClaw',
    m:[['Protocol','Matrix bot listener'],['Heartbeat','Every 4s'],['Commands','Start batch, pause, kill, override'],['Daemon','Rust autonomous scheduler']],
    note:'Matrix relays Alex\'s commands to SalesClaw daemon. Heartbeat every 4s.' },
  claw__backend: {
    title:'DIAL TRIGGER', sub:'SalesClaw \u2192 Sales Backend',
    m:[['Payload','propID + contact + script tier'],['API','Backend REST endpoint'],['Trigger','Per-proposal dial request'],['Queue','Batch #12 \u00b7 24 calls']],
    note:'SalesClaw sends propID + contact + script tier to Backend API to initiate call.' },
  spec__kb: {
    title:'SPEC INJECTION', sub:'SPEC v1.0 \u2192 Knowledge Base',
    m:[['Payload','Full SPEC v1.0 (\u00a71\u201336)'],['Size','~45k tokens'],['Includes','Architecture, rules, parameters, decisions'],['Refresh','On spec version change']],
    note:'Full SPEC v1.0 (\u00a71\u201336) loaded into knowledge base. ~45k tokens.' },
  intel__scripts: {
    title:'CALL PATTERNS', sub:'Call Intel \u2192 Scripts',
    m:[['Source','110-deal analysis'],['Drives','Script tier selection'],['Key finding','T1 always beats T2'],['Signal','Last client action > calendar age']],
    note:'110-deal analysis drives script tier selection. T1 always beats T2.' },
  intel__ranking: {
    title:'SCORE SIGNALS', sub:'Call Intel \u2192 Queue Ranking',
    m:[['Source','ZC_COMMUNICATION_INTEL'],['Feeds','Queue priority scoring algorithm'],['Factors','Recency, engagement, rep history'],['Weight','Communication signals weighted heavily']],
    note:'Communication intel informs queue priority scoring.' },
  ranking__claw: {
    title:'QUEUE ORDER', sub:'Queue Ranking \u2192 SalesClaw',
    m:[['Output','Prioritized, filtered queue'],['Checks','VIP flag \u00b7 DNC check \u00b7 Blacklist'],['Sort','Value \u00d7 staleness \u00d7 rep weight'],['Exclusions','clientID\u226062 \u00b7 Morgan\'s deals']],
    note:'Prioritized, filtered queue delivered to SalesClaw. VIP/DNC checked.' },
  zc_data__backend: {
    title:'SCHEMA REF', sub:'Schema + SQL \u2192 Sales Backend',
    m:[['Files','ZC_DATA_MODEL.md \u00b7 ZC_SQL_QUERIES.md'],['Provides','Canonical SQL queries, entity_1.* view rules'],['Rule','Always query via entity_1.* views'],['Warning','Never use th_db_live.* directly']],
    note:'Canonical SQL queries, entity_1.* view rules, join patterns.' },
  zc_data__pt: {
    title:'DATA MODEL', sub:'Schema + SQL \u2192 FieldTECH',
    m:[['Provides','Schema reference for FieldTECH tables'],['Views','entity_1.* (entityID=1)'],['Gotcha','_proposal has no clientID \u2014 join via _location'],['Contacts','Tier 1/5/6 resolution only']],
    note:'Schema reference for FieldTECH tables and views.' },
  claw__pt: {
    title:'PROPOSAL READ', sub:'SalesClaw \u2192 FieldTECH',
    m:[['Access','SSH tunnel \u00b7 port 3307'],['Reads','Proposals, contacts, locations'],['Views','entity_1.* (entityID=1)'],['Warning','_location contact fields NULL in prod']],
    note:'Reads proposals, contacts, locations via SSH tunnel port 3307.' },
  claw__hs: {
    title:'CRM READ', sub:'SalesClaw \u2192 HubSpot',
    m:[['Access','OAuth app 00000000'],['Reads','Deals, engagement feed, owner data'],['Match','By hs_owner_id \u2014 NOT by email'],['Warning','Do NOT use _hs_access_token table']],
    note:'Reads HubSpot deals, engagement feed, owner data. OAuth app 00000000.' },
  backend__pt: {
    title:'ATTRIBUTION WRITE', sub:'Sales Backend \u2192 FieldTECH',
    m:[['Writes','manager_userID=7225 (Sales AI)'],['Logs','Notes via FieldTECH API'],['Purpose','Attribution tracking'],['Dashboard','CSM dashboard broken \u2014 use pg instead']],
    note:'Writes manager_userID=7225, logs notes via FieldTECH API.' },
  backend__hs: {
    title:'DEAL SYNC', sub:'Sales Backend \u2192 HubSpot',
    m:[['Updates','deal_outreach_status'],['Logs','Engagements to deal timeline'],['Enriches','Contact data when missing'],['Match','By hs_owner_id \u2014 3 confirmed email mismatches']],
    note:'Updates deal_outreach_status, logs engagements, contact enrichment.' },
  backend__pg: {
    title:'STATE + LOGS', sub:'Sales Backend \u2194 PostgreSQL',
    m:[['DB','phil-internal (localhost)'],['Stores','Call logs, sequence state, attribution'],['Tables','call_log \u00b7 sequences \u00b7 attribution'],['Direction','Bidirectional read/write']],
    note:'Call logs, sequence state, attribution tracking. Bidirectional.' },
  kb__backend: {
    title:'CONTEXT LOAD', sub:'Knowledge Base \u2192 Sales Backend',
    m:[['Payload','~45k tokens per call load'],['Includes','SPEC v1.0 + ZC_* docs'],['Timing','Pre-call context injection'],['Preheat','~2s before each dial']],
    note:'Pre-call context injection. ~45k tokens loaded before each dial.' },
  scripts__backend: {
    title:'SCRIPT SELECT', sub:'Scripts \u2192 Sales Backend',
    m:[['Output','Selected script tier (T1-A through T4-D)'],['Selection','First match wins: P1\u2192P2\u2192P3\u2192P4'],['Total','12 tier variants across 4 priority levels'],['Key','T1 (email signal) always beats T2 (staleness)']],
    note:'Selected script tier delivered for call. 12 variants: T1-A/B/C/D, T2-A/B/C, T3-A/B, T4-A/C/D (no T4-B).' },
  backend__postmark: {
    title:'EMAIL TRIGGER', sub:'Sales Backend \u2192 Postmark',
    m:[['Triggers','Outreach emails on Day 14 and Day 44'],['From','phil.s@pinnacleservices.demo'],['Domain','pinnacleservices.demo (SPF/DKIM/DMARC \u2192 Postmark)'],['Template','SCRIPTS_EMAIL.md'],['Provider','Postmark \u2014 dedicated transactional infra']],
    note:'Triggers outreach emails on Day 14 and Day 44 via Postmark API.' },
  postmark__client: {
    title:'EMAIL DELIVERY', sub:'Postmark \u2192 Client',
    m:[['From','phil.s@pinnacleservices.demo'],['Domain','pinnacleservices.demo'],['Day 14','Follow-up email with proposal link'],['Day 44','Final outreach attempt'],['Deliverability','Dedicated Postmark infrastructure \u2014 no shared IP pool']],
    note:'Email delivered via Postmark from phil.s@pinnacleservices.demo. Best-in-class inbox placement.' },
  backend__claw: {
    title:'POST-CALL WEBHOOK', sub:'Sales Backend \u2192 SalesClaw',
    m:[['Payload','Call result, disposition, next step'],['Dispositions','interested / callback / not_interested / no_answer / vm_left'],['Updates','Sequence state machine'],['Timing','Immediately after call ends']],
    note:'Call result, disposition, next sequence step back to daemon.' },
  gpu__vad: {
    title:'HOSTS PROCESS', sub:'Sales Worker \u2192 Silero VAD',
    m:[['Model','Silero VAD'],['Lifecycle','Ephemeral \u2014 destroyed after batch'],['Threshold','200ms stop_secs (configurable)'],['Barge-in','500ms client speech \u2192 interrupt']],
    note:'Ephemeral worker hosts Silero VAD. Destroyed after batch.' },
  gpu__parakeet: {
    title:'HOSTS PROCESS', sub:'Sales Worker \u2192 Parakeet RNNT',
    m:[['Model','Parakeet RNNT 1.1B (NVIDIA)'],['Lifecycle','RunPod template-based boot'],['Mode','Streaming \u2014 incremental transcription'],['Boot','<4 min from RunPod template (target <2.5 min)']],
    note:'Ephemeral worker hosts Parakeet RNNT 1.1B. RunPod template-based.' },
  gpu__kokoro: {
    title:'SILENT FALLBACK', sub:'Sales Worker \u2192 Kokoro v1 (fallback)',
    m:[['Model','Kokoro v1 \u00b7 Self-hosted on GPU'],['Activation','Only if Inworld health check fails at boot'],['Mode','Streaming \u00b7 Sentence boundary split'],['Status','Standby \u2014 Inworld is primary TTS']],
    note:'Silent fallback TTS. Kokoro v1 only starts if Inworld health check fails.' },
  gpu__spaces: {
    title:'RECORDING STREAM', sub:'Sales Worker \u2192 DO Spaces',
    m:[['Format','Dual-channel stereo audio'],['Path','Worker \u2192 sales-app \u2192 Spaces (real-time)'],['Storage','S3-compatible bucket'],['Cost','~$5/mo at launch volume']],
    note:'Dual-channel stereo audio streamed to DO Spaces S3 bucket.' },
  gpu__pg: {
    title:'CRASH LOGS', sub:'Sales Worker \u2192 PostgreSQL',
    m:[['Logs','Worker crash/health data'],['Metrics','Boot time, memory, GPU utilization'],['Health check','STT/LLM/TTS latency tested before first call'],['Lifecycle','booting \u2192 ready \u2192 armed \u2192 in_call \u2192 idle \u2192 dead']],
    note:'Worker crash/health data logged to PostgreSQL.' },
  backend__sonnet: {
    title:'LLM PREHEAT', sub:'Sales Backend \u2192 Claude Sonnet',
    m:[['Payload','Full spec + script + call intel'],['Model','claude-sonnet-4-6'],['Context','200k tokens'],['Timing','Pre-call \u00b7 ~2s context load']],
    note:'Pre-call context load. Full spec + script + call intel \u2192 Claude Sonnet.' },
  backend__telnyx: {
    title:'DIAL COMMAND', sub:'Sales Backend \u2192 Telnyx',
    m:[['Action','Place outbound PSTN call + SMS dispatch'],['SIP','Outbound SIP trunk'],['Cost','$0.007/min + $0.02/SMS'],['Control','Worker owns all call legs during live call']],
    note:'Backend tells Telnyx to place outbound PSTN call + SMS dispatch.' },
  telnyx__client: {
    title:'VOICE CALL', sub:'Telnyx \u2194 Client',
    m:[['Protocol','SIP trunk \u00b7 G.711 \u03bc-law 8kHz'],['Provider','Telnyx PSTN'],['Direction','Bidirectional'],['AMD','Answer Machine Detection enabled']],
    note:'Bidirectional SIP trunk. G.711 \u03bc-law 8kHz. Telnyx PSTN.' },
  'telnyx__client__sms': {
    title:'SMS DELIVERY', sub:'Telnyx \u2192 Client',
    m:[['Touches','Day 8 \u00b7 Day 18 \u00b7 Day 30'],['Content','Outreach SMS with proposal URL'],['Cost','$0.02/SMS'],['Provider','Telnyx']],
    note:'Outreach SMS on Day 8, 18, 30. Includes proposal URL.' },
  telnyx__vad: {
    title:'AUDIO INGEST', sub:'Telnyx \u2192 Silero VAD',
    m:[['Stream','Client audio stream'],['Format','8kHz G.711 \u03bc-law'],['Purpose','Voice activity detection'],['Threshold','200ms stop_secs trigger']],
    note:'Client audio stream \u2192 Silero VAD for activity detection.' },
  vad__parakeet: {
    title:'STREAMING STT', sub:'Silero VAD \u2192 Parakeet RNNT',
    m:[['Trigger','Voice activity detected'],['Latency','~0ms marginal after VAD trigger'],['Mode','Streaming \u2014 incremental transcription'],['Coverage','~90% complete by silence trigger']],
    note:'Voice activity \u2192 Parakeet RNNT. ~0ms marginal after VAD trigger.' },
  parakeet__sonnet: {
    title:'LIVE TRANSCRIPT', sub:'Parakeet RNNT \u2192 Claude Sonnet',
    m:[['Output','Real-time transcript'],['Destination','Claude Sonnet for response generation'],['Mode','Streaming tokens'],['Model','claude-sonnet-4-6']],
    note:'Real-time transcript \u2192 Claude Sonnet for response generation.' },
  sonnet__kokoro: {
    title:'RESPONSE STREAM', sub:'Claude Sonnet \u2192 Inworld TTS',
    m:[['Output','LLM response tokens'],['Processing','Sentence-boundary split'],['TTS','Inworld TTS Mini renders chunk-by-chunk'],['Pre-render','First turn + VM cached before dial']],
    note:'LLM response tokens \u2192 Inworld TTS Mini via WebSocket. Sentence-boundary split.' },
  kokoro__telnyx: {
    title:'AUDIO OUT', sub:'Inworld TTS \u2192 Telnyx',
    m:[['Input','Synthesized audio from Inworld TTS'],['Format','Native format \u00b7 No resampling needed'],['Destination','Phone line via Telnyx SIP'],['First chunk','~200ms']],
    note:'Inworld TTS audio \u2192 phone line via Telnyx SIP. No resampling needed.' },
  telnyx__reps: {
    title:'WARM TRANSFER', sub:'Telnyx \u2192 Transfer Pool',
    m:[['Ring','Parallel ring up to 3 reps'],['Timeout','16s per ring attempt'],['Rule','First to answer gets call'],['Priority','Marco #1 \u00b7 Sarah #2']],
    note:'Parallel ring up to 3 reps, 16s timeout. First to answer gets call.' },
  backend__reps: {
    title:'TRANSFER SMS', sub:'Sales Backend \u2192 Transfer Pool',
    m:[['Content','Client name, propID, value, days stale, proposal URL'],['Timing','Fires when ringing starts \u2014 before pickup'],['Match','By hs_owner_id, NOT by email'],['Purpose','Rep context before answering']],
    note:'SMS with client name, propID, value, days stale, proposal URL.' },
  backend__haiku: {
    title:'ASYNC EXTRACTION', sub:'Sales Backend \u2192 Claude Haiku',
    m:[['Model','claude-haiku-4-5-20251001'],['Tasks','Sentiment, intent, HubSpot notes'],['Timing','Post-call only \u00b7 NEVER live path'],['Cost','Fraction of Sonnet']],
    note:'Post-call sentiment, intent, HubSpot notes. Never live path.' },
  matrix__reps: {
    title:'INTEL + ALERTS', sub:'Matrix \u2192 Transfer Pool',
    m:[['Channels','#transfers \u00b7 #won'],['Content','Transfer alerts, win notifications'],['Access','Read-only for reps'],['Updates','Real-time from SalesClaw']],
    note:'Transfer alerts (#transfers), win notifications (#won). Read-only.' },
  reps__matrix: {
    title:'REP QUESTIONS', sub:'Transfer Pool \u2192 Matrix',
    m:[['Channel','#transfers or DM'],['Content','Questions about proposals, clients'],['Access','Reps can ask questions back'],['Response','Alex or SalesClaw bot responds']],
    note:'Reps can ask questions back via Matrix.' },
};
