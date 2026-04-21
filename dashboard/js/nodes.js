/* nodes.js — Node Architecture graph (merged) */

/* nodes-data.js — STORAGE_KEY, ICONS, NODES, EDGES, REPS_LIST for tab_nodes */

const STORAGE_KEY = 'phil-pos-nodes';

// ═══════════════════════════════════════════════════
// SERVICE ICONS — maps node id → PNG filename in img/icons/services/
// ═══════════════════════════════════════════════════
const SVC_ICONS = {
  postmark:'postmark', hs:'hubspot', pg:'postgresql', gpu:'nvidia',
  vad:'silero', parakeet:'nvidia', kokoro:'inworld', sonnet:'anthropic',
  haiku:'anthropic', telnyx:'telnyx', matrix:'matrix', claw:'rust',
  backend:'rust', spaces:'digitalocean', zc_data:'postgresql',
  kb:'pipecat'
};

// ═══════════════════════════════════════════════════
// SVG ICONS (20x20 viewBox, stroke-based)
// ═══════════════════════════════════════════════════
const ICONS = {
  spec:    icon('M4,2h8l4,4v12H4V2z M12,2v4h4 M7,10h6 M7,13h6 M7,7h3'),
  intel:   icon('M8.5,3a5.5,5.5 0 1,0 0,11 5.5,5.5 0 0,0 0,-11z M12.5,13.5 L18,19 M8.5,6v5 M6,8.5h5'),
  ranking: icon('M2,17v-7h4v7 M7,17V7h4v10 M12,17v-4h4v4 M1,17h18 M4,7 L6,5 L8,7'),
  zc_data: icon('M3,5 Q3,3 10,3 Q17,3 17,5 L17,15 Q17,17 10,17 Q3,17 3,15Z M3,5 Q3,7 10,7 Q17,7 17,5 M3,10 Q3,12 10,12 Q17,12 17,10'),
  alex:    icon('M10,9 a4,4 0 1,0 .01,0Z M2.5,19 C2.5,14 5.5,12 10,12 S17.5,14 17.5,19'),
  matrix:  icon('M2,3h16v10H2V3z M5,16 L4,20 L11,16h5 M6,8h8 M6,11h5'),
  claw:    icon('M10,7 a3,3 0 1,0 .01,0Z M10,1v3 M10,16v3 M1,10h3 M16,10h3 M3.2,3.2l2.1,2.1 M14.7,14.7l2.1,2.1 M3.2,16.8l2.1,-2.1 M14.7,5.3l2.1,-2.1'),
  pt:      icon('M2,4h16v4H2z M2,9h16v4H2z M2,14h16v4H2z M14,6a1,1 0 1,0 .01,0Z M14,11a1,1 0 1,0 .01,0Z M14,16a1,1 0 1,0 .01,0Z M5,6h6 M5,11h6 M5,16h6'),
  postmark:icon('M2,4h16v12H2V4z M2,4 L10,12 L18,4 M2,16 L7,10 M18,16 L13,10'),
  hs:      icon('M3,16V9h4v7 M8,16V5h4v11 M13,16v-5h4v5 M1,16h18'),
  pg:      icon('M3,5 Q3,3 10,3 Q17,3 17,5 L17,15 Q17,17 10,17 Q3,17 3,15Z M3,5 Q3,7 10,7 Q17,7 17,5 M7,11h6 M7,13.5h4'),
  kb:      icon('M10,17 C5,17 3,15 3,15V4 C3,4 5,3 10,4 M10,17 C15,17 17,15 17,15V4 C17,4 15,3 10,4 M10,4v13 M6,7h3 M6,10h3 M14,7h-3 M14,10h-3'),
  scripts: icon('M4,2h12v16H4V2z M8,7 L9.5,9 L13,5.5 M8,11.5 L9.5,13.5 L13,10 M8,16h5'),
  backend: icon('M10,2 L17,6 L17,14 L10,18 L3,14 L3,6Z M10,2 L10,18 M3,6 L17,14 M17,6 L3,14'),
  gpu:     icon('M5,5h10v10H5V5z M5,3v-1 M10,3v-1 M15,3v-1 M5,17v1 M10,17v1 M15,17v1 M3,5h-1 M3,10h-1 M3,15h-1 M17,5h1 M17,10h1 M17,15h1 M8,8h4v4H8z'),
  parakeet:icon('M1,10h2 M3,10 L4,5 L5,15 L6,7 L7,13 L8,9 L9,11 L10,8 L11,12 L12,10 L13,10 M13,10 L14,7 L15,13 L16,10 h2'),
  sonnet:  icon('M10,4a6,6 0 1,0 .01,0Z M10,4 L7,8 L10,12 L13,8Z M10,12v4 M7,8 L4,10 M13,8 L16,10 M4,10a1.5,1.5 0 1,0 .01,0Z M16,10a1.5,1.5 0 1,0 .01,0Z M10,16a1.5,1.5 0 1,0 .01,0Z'),
  kokoro:  icon('M2,7h4 L10,3 L10,17 L6,13 H2 V7z M13,7 Q15.5,8.5 15.5,10 Q15.5,11.5 13,13 M15,5 Q18.5,7 18.5,10 Q18.5,13 15,15'),
  haiku:   icon('M10,3 a7,7 0 1,0 .01,0Z M10,6v4 L13,12 M10,3 L10,1 M7,2.5 L10,1 L13,2.5'),
  telnyx:  icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M13,3h4v4 M17,3 L13.5,6.5'),
  client:  icon('M3,19 V5 L10,2 L17,5 V19 M7,19 V13 H13 V19 M8,8h4 M8,11h4'),
  reps:    icon('M6.5,8 a3,3 0 1,0 .01,0Z M1,17 C1,13.5 3.5,11.5 6.5,11.5 S12,13.5 12,17 M13,6 C14.5,4.5 17,5 17.5,7 S16,10 14,9 M15,11 C18,12 20,14.5 19.5,17'),
  vad:     icon('M1,10h2 M4,7v6 M6,5v10 M8,8v4 M10,6v8 M12,8v4 M14,5v10 M16,7v6 M18,10h1 M1,14h18'),
  spaces:  icon('M5,16h10 M6,16c-3,0-4,-2-4,-4 2,-6 8,-6 10,0 0,2-1,4-4,4 M10,16v-3 M7,13h6'),
};

// ═══════════════════════════════════════════════════
// NODES
// ═══════════════════════════════════════════════════
const NODES = [
  // INTELLIGENCE column
  {id:'spec',    label:'SPEC v1.0',      sub:'Governing spec \u00b7 \u00a71\u201336\nEphemeral workers \u00b7 Streaming STT', x:310, y:115, c:'#9f00fa'},
  {id:'intel',   label:'Call Intel',     sub:'ZC_COMMUNICATION_INTEL\n110 real deals analyzed',            x:310, y:295, c:'#d36eff'},
  {id:'ranking', label:'Queue Ranking',  sub:'Eligibility filter \u00b7 Scoring\nVIP detect \u00b7 DNC check',       x:310, y:475, c:'#ee9612'},
  {id:'zc_data', label:'Schema + SQL',   sub:'ZC_DATA_MODEL \u00b7 ZC_SQL\nCanonical queries \u00b7 View layer',     x:310, y:665, c:'#60be35'},
  // OPERATOR column
  {id:'alex',    label:'Alex',           sub:'Operator \u00b7 Override\nFinal approval \u00b7 C&C',                  x:90,  y:215, c:'#ee9612'},
  {id:'matrix',  label:'Matrix',         sub:'Intel hub \u00b7 C&C \u00b7 Sales IM\nReps + Alex + SalesClaw',          x:90,  y:435, c:'#60be35'},
  {id:'claw',    label:'SalesClaw',       sub:'Rust \u00b7 Fork of ZeroClaw\nDaemon \u00b7 Queue mgr',                x:90,  y:655, c:'#9f00fa'},
  // DATA LAYER column
  {id:'pt',      label:'FieldTECH',     sub:'Source of truth \u00b7 ERP\nProposals \u00b7 Contacts',               x:555, y:215, c:'#9f00fa'},
  {id:'postmark', label:'Postmark',       sub:'Email delivery \u00b7 $15/mo\nDay 14 \u00b7 Day 44 outreach',           x:555, y:435, c:'#e95400'},
  {id:'hs',      label:'HubSpot',        sub:'CRM mirror \u00b7 Deal sync\nHS engagement feed',                 x:555, y:640, c:'#e95400'},
  {id:'pg',      label:'PostgreSQL',     sub:'Internal DB\nState \u00b7 Logs \u00b7 Sequences',                     x:555, y:845, c:'#60be35'},
  // CORE ENGINE column
  {id:'kb',      label:'Knowledge Base', sub:'SPEC v1.0 + ZC_* docs\n~45k tokens per preheat',           x:785, y:135, c:'#9f00fa'},
  {id:'scripts', label:'Scripts',        sub:'Call \u00b7 VM \u00b7 SMS \u00b7 Email\n12 tiers \u00b7 Script selector',       x:785, y:310, c:'#d36eff'},
  {id:'backend', label:'Sales Backend',   sub:'Rust (Axum) \u00b7 Orchestration\nPre/post call only \u00b7 Attribution', x:785, y:540, c:'#9f00fa', hub:true},
  // VOICE PIPELINE -- GPU column
  {id:'gpu',     label:'PHIL WORKER',    sub:'Ephemeral GPU \u00b7 RunPod Template\nPipecat + STT + VAD + SmartTurn',        x:1020,y:120, c:'#60be35'},
  {id:'vad',     label:'Silero VAD',    sub:'Voice activity detect\n200ms stop_secs + SmartTurn v3',     x:1020,y:280, c:'#60be35'},
  {id:'parakeet',label:'Parakeet RNNT', sub:'Streaming STT \u00b7 1.1B\n~0ms marginal after VAD',            x:1020,y:430, c:'#60be35'},
  {id:'kokoro',  label:'Inworld TTS',      sub:'Cloud API \u00b7 WebSocket\nELO 1577 \u00b7 ~200ms first chunk',  x:1020,y:680, c:'#9f00fa'},
  {id:'spaces',  label:'DO Spaces',      sub:'S3 bucket \u00b7 Call recordings\nDual-channel stereo \u00b7 ~$5/mo', x:1020,y:870, c:'#60be35'},
  // VOICE PIPELINE -- API column
  {id:'sonnet',  label:'Claude Sonnet',  sub:'LLM \u00b7 Live call \u00b7 v4.6\nAnthropic API \u00b7 Preheated',        x:1155,y:555, c:'#9f00fa'},
  {id:'haiku',   label:'Claude Haiku',   sub:'Async extraction\nPost-call \u00b7 v4.5 \u00b7 API',                  x:1155,y:960, c:'#d36eff'},
  // CHANNELS column
  {id:'telnyx',  label:'Telnyx',         sub:'Voice + SMS\nSIP trunk \u00b7 Outbound dial',                   x:1360,y:460, c:'#ee9612'},
  // RECIPIENTS column
  {id:'client',  label:'Client',         sub:'Property Manager\nVoice \u00b7 SMS \u00b7 Email',                    x:1590,y:250, c:'#ff4040'},
  {id:'reps',    label:'Transfer Pool',  sub:'10 reps \u00b7 Priority ring\nJesus #1 \u00b7 Alex fallback',        x:1590,y:630, c:'#ee9612', wide:true},
];

const EDGES = [
  // Operator chain
  {f:'alex',    t:'matrix',   c:'#ee9612', lbl:'commands',      spd:1.5, ctrl:true},
  {f:'matrix',  t:'claw',     c:'#ee9612', lbl:'relay',         spd:1.5, ctrl:true},
  {f:'claw',    t:'backend',  c:'#9f00fa', lbl:'dial propID',   spd:2.5, ctrl:true},
  // Intelligence feeds
  {f:'spec',    t:'kb',       c:'#9f00fa', lbl:'spec load',     spd:0.5},
  {f:'intel',   t:'scripts',  c:'#d36eff', lbl:'call patterns', spd:0.6},
  {f:'intel',   t:'ranking',  c:'#d36eff', lbl:'score signals', spd:0.6},
  {f:'ranking', t:'claw',     c:'#ee9612', lbl:'queue order',   spd:1.2},
  {f:'zc_data', t:'backend',  c:'#60be35', lbl:'schema ref',    spd:0.5},
  {f:'zc_data', t:'pt',       c:'#60be35', lbl:'',              spd:0.5},
  // SalesClaw data reads
  {f:'claw',    t:'pt',       c:'#60be35', lbl:'',              spd:0.7},
  {f:'claw',    t:'hs',       c:'#60be35', lbl:'',              spd:0.7},
  // Backend data
  {f:'backend', t:'pt',       c:'#60be35', lbl:'',              spd:0.8},
  {f:'backend', t:'hs',       c:'#e95400', lbl:'',              spd:0.9},
  {f:'backend', t:'pg',       c:'#60be35', lbl:'state/logs',    spd:0.6, bi:true},
  {f:'kb',      t:'backend',  c:'#9f00fa', lbl:'context',       spd:0.5},
  {f:'scripts', t:'backend',  c:'#d36eff', lbl:'script select', spd:0.5},
  {f:'backend', t:'postmark',  c:'#e95400', lbl:'',              spd:1.0, ctrl:true},
  {f:'postmark', t:'client',   c:'#e95400', lbl:'email',         spd:1.1},
  {f:'backend', t:'claw',     c:'#9f00fa', lbl:'webhook',       spd:2.0, ctrl:true},
  // Worker infra
  {f:'gpu',     t:'vad',      c:'#60be35', lbl:'hosts',         spd:0.4, ctrl:true},
  {f:'gpu',     t:'parakeet', c:'#60be35', lbl:'hosts',         spd:0.4, ctrl:true},
  {f:'gpu',     t:'kokoro',   c:'#60be35', lbl:'fallback only', spd:0.4, ctrl:true},
  {f:'gpu',     t:'spaces',   c:'#60be35', lbl:'recording',     spd:1.0},
  // Live voice path
  {f:'backend', t:'sonnet',   c:'#9f00fa', lbl:'preheat',       spd:2.0, ctrl:true},
  {f:'backend', t:'telnyx',   c:'#ee9612', lbl:'voice + SMS',   spd:3.0, ctrl:true},
  {f:'telnyx',  t:'client',   c:'#ff4040', lbl:'voice call',    spd:5.0, bi:true},
  {f:'telnyx',  t:'client',   c:'#ee9612', lbl:'SMS',           spd:2.2, poff:18},
  {f:'telnyx',  t:'vad',      c:'#ff4040', lbl:'audio in',      spd:5.0},
  {f:'vad',     t:'parakeet', c:'#ff4040', lbl:'streaming',     spd:4.5},
  {f:'parakeet',t:'sonnet',   c:'#9f00fa', lbl:'transcript',    spd:4.0},
  {f:'sonnet',  t:'kokoro',   c:'#9f00fa', lbl:'stream tokens', spd:4.0},
  {f:'kokoro',  t:'telnyx',   c:'#ff4040', lbl:'audio out',     spd:5.0},
  // Worker logs
  {f:'gpu',     t:'pg',       c:'#60be35', lbl:'crash logs',    spd:0.6},
  {f:'telnyx',  t:'reps',     c:'#ee9612', lbl:'warm transfer', spd:4.5, ctrl:true},
  {f:'backend', t:'reps',     c:'#e95400', lbl:'SMS alert',     spd:2.5},
  {f:'backend', t:'haiku',    c:'#d36eff', lbl:'post-turn',     spd:1.2, ctrl:true},
  // Matrix <-> Sales reps
  {f:'matrix',  t:'reps',     c:'#60be35', lbl:'intel + alerts', spd:1.8},
  {f:'reps',    t:'matrix',   c:'#ee9612', lbl:'questions',      spd:1.5},
];

const REPS_LIST = [
  'Marco Diaz \u00b7 P1','Sarah Mitchell \u00b7 P2','Dan M. \u00b7 P3 \u26a0',
  'Ruben Santos \u00b7 P4','Amy Adams \u00b7 P5','Henry Jordan \u00b7 P6',
  'Leah Baker \u00b7 P7','Jenna M. \u00b7 P8 \u26a0','Stacy Kim \u00b7 last resort','Alex \u00b7 fallback'
];

/* nodes-details.js — NODE_DETAILS for tab_nodes tooltip data */

const NODE_DETAILS = {
  spec:    { role:'SPEC v1.0 \u00b7 Governing Architecture', status:'LOADED', sc:'#9f00fa',
    m:[['Sections','36 total \u00b7 Full spec'],['Key changes','Ephemeral workers \u00b7 Streaming STT/TTS \u00b7 VAD \u00b7 Pre-render \u00b7 Barge-in'],['Scope','Sales AI product + PS client config'],['Status','Active \u00b7 April 2026']],
    note:'v1.9: ephemeral template-based workers (RunPod US-CA-2), Parakeet RNNT streaming, Silero VAD, pre-rendered first turn, barge-in, comfort noise, dual-channel call recording.' },
  intel:   { role:'ZC_COMMUNICATION_INTEL \u00b7 Call Intelligence', status:'INDEXED', sc:'#d36eff',
    m:[['Deals analyzed','110 real HubSpot deals'],['Win rate post-30d','34.5% (from data analysis)'],['Best opener','Proposal# + property name \u2014 never generic'],['DNC signal','Hostile tone \u2192 immediate drop + DNC flag'],['Key insight','Last client action matters more than calendar age']],
    note:'110 real deals analyzed for call patterns. This data drives script tier selection and opener strategy. T1 (email history signal) always beats T2 (staleness bucket).' },
  ranking: { role:'Queue Ranking Engine \u00b7 Priority Algorithm', status:'RUNNING', sc:'#ee9612',
    m:[['Eligibility','status=sent + \u22657d stale + not deleted'],['Exclusions','clientID\u226062 \u00b7 blacklists loaded'],['VIP flag','$200k+ \u2192 Alex review'],['DNC','Unsubscribed opt_in_status \u2192 skip'],['Sort','Value \u00d7 staleness \u00d7 rep weight']],
    note:'Nothing gets dialed without passing every check here. Morgan\'s deals (propIDs 10572, 10433, 10835, 8793) are always excluded.' },
  zc_data: { role:'Schema + SQL \u00b7 Data Model Reference', status:'LOADED', sc:'#60be35',
    m:[['Files','ZC_DATA_MODEL.md \u00b7 ZC_SQL_QUERIES.md'],['Key rule','Always query via entity_1.* views'],['Gotcha','_proposal has no clientID \u2014 join via _location'],['Contacts','Tier 1/5/6 resolution only'],['Warning','_location contact fields are NULL in prod']],
    note:'Canonical SQL queries for eligibility, contact resolution, grouping. Never use th_db_live.* directly.' },
  alex:    { role:'Operator \u00b7 Human-in-the-loop', status:'ONLINE', sc:'#60be35',
    m:[['Last action','Batch #12 pending approval'],['Interface','Sales Controller + Matrix'],['Override','Any call \u00b7 any time'],['Phone','(555) 963-0916 (fallback)']],
    note:'Alex approves every batch before it fires. Nothing dials without the green "Go" button.' },
  matrix:  { role:'Intel Hub \u00b7 C&C \u00b7 Sales Communication', status:'CONNECTED', sc:'#60be35',
    m:[['Uptime','2d 14h'],['Last heartbeat','4s ago'],['Channels','#queue #transfers #won #errors #morgan'],['Protocol','Matrix IM \u00b7 End-to-end encrypted'],['Users','Alex (full control) \u00b7 Sales reps (read-only) \u00b7 SalesClaw bot \u00b7 Morgan (Q&A only)'],['Reps see','#transfers and #won only \u2014 read-only']],
    note:'Alex sends commands via Matrix, reps get read-only transfer alerts (#transfers) and win notifications (#won). Morgan gets financial Q&A in #morgan with weekly Friday auto-summary. SalesClaw posts batch updates to #queue. All failures to #errors (Alex only).' },
  claw:    { role:'SalesClaw \u00b7 Rust Daemon (ZeroClaw fork)', status:'RUNNING', sc:'#60be35',
    m:[['Language','Rust \u00b7 Autonomous daemon'],['Base','Fork of zeroclaw-labs/zeroclaw'],['PID','47821'],['Heartbeat','Every 4s'],['Queue pending','24 calls \u00b7 Batch #12'],['Next check','58s']],
    note:'Fork of ZeroClaw \u2014 stripped and customized for Sales AI. SOUL.md/HEARTBEAT.md workspace conventions preserved. Not tracking upstream. Never touches live calls directly.' },
  pt:      { role:'FieldTECH \u00b7 Source of Truth', status:'SSH \u25c8', sc:'#60be35',
    m:[['Access','SSH tunnel \u00b7 port 3307'],['Views','entity_1.* (entityID=1)'],['Proposals','1,357 stale \u00b7 $37.5M'],['Contacts','Tier 1 / 5 / 6 resolution'],['Warning','Never use th_db_live.* directly']],
    note:'_location contact fields are all NULL in production. Use HubSpot for phone/email fallback.' },
  postmark:{ role:'Email Delivery \u00b7 Postmark', status:'READY', sc:'#ee9612',
    m:[['Provider','Postmark \u2014 dedicated transactional infra'],['From','phil.s@pinnacleservices.demo'],['Domain','pinnacleservices.demo (SPF/DKIM/DMARC)'],['Sequence touches','Day 14 \u00b7 Day 44 (final)'],['Cost','~$15/mo'],['Template','SCRIPTS_EMAIL.md']],
    note:'Postmark \u2014 best-in-class inbox placement, no shared IP pool risk. Sends from phil.s@pinnacleservices.demo.' },
  hs:      { role:'HubSpot \u00b7 CRM Mirror', status:'OK \u00b7 4m', sc:'#60be35',
    m:[['App ID','00000000 (Sales AI OAuth)'],['Token expires','23h 14m'],['Last sync','4 min ago'],['Deals','1,322 with HS deal ID'],['Owner match','By hs_owner_id \u2014 NOT by email']],
    note:'Do NOT use _hs_access_token table \u2014 that\'s TripTECH\'s app. 3 confirmed email mismatches.' },
  pg:      { role:'PostgreSQL \u00b7 Internal DB', status:'OK', sc:'#60be35',
    m:[['DB name','phil-internal'],['call_log','47 rows'],['sequences','12 active'],['attribution','6 pending \u00b7 source of truth'],['Host','sales-app (localhost)']],
    note:'FieldTECH CSM dashboard is broken \u2014 this DB is the real attribution source of truth.' },
  kb:      { role:'Knowledge Base \u00b7 Preheat Context', status:'LOADED', sc:'#60be35',
    m:[['Core','SPEC v1.0 (\u00a71\u201336)'],['Includes','ZC_DATA_MODEL \u00b7 ZC_SQL_QUERIES'],['Includes','ZC_CONTACTS \u00b7 ZC_HUBSPOT \u00b7 ZC_DECISIONS'],['Approx tokens','~45k per call load'],['Preheat time','~2s before each call']],
    note:'Entire spec loaded into Claude\'s context window before each call. ZC_COMMUNICATION_INTEL informs script tier selection separately.' },
  scripts: { role:'Script Library \u00b7 12 Tier Variants', status:'READY', sc:'#60be35',
    m:[['Main tiers','T1-A/B/C/D \u00b7 T2-A/B/C \u00b7 T3-A/B (9 variants)'],['Override tiers','T4-A/C/D (enforcement, departed rep, resurrection)'],['Selection','First match wins: P1 overrides \u2192 P2 recency \u2192 P3 email \u2192 P4 staleness'],['Also','SMS \u00b7 Voicemail \u00b7 Email scripts'],['Intel feeds','ZC_COMMUNICATION_INTEL \u2192 tier selection']],
    note:'T1 (email history signal) always beats T2 (staleness bucket). Last client action matters more than the calendar. 12 total tier variants across 4 priority levels \u2014 no T4-B exists.' },
  backend: { role:'Sales Backend \u00b7 Rust (Axum)', status:'STANDBY', sc:'#ee9612',
    m:[['Language','Rust \u00b7 Axum web framework'],['Uptime','2d 14h'],['Memory','1.2 GB / 2 GB'],['Last call','propID #7856 \u00b7 Michelle Forkas'],['Role','Pre/post call only \u00b7 Idle during live calls'],['Host','sales-app (2GB CPU \u00b7 ~$12/mo)']],
    note:'Rust/Axum backend. Idle during live calls \u2014 Worker owns the voice pipeline and all Telnyx call control. Backend handles attribution, HubSpot/FieldTECH sync, phone normalization, worker lifecycle coordination. No Python on sales-app.' },
  gpu:     { role:'Sales Worker \u00b7 Ephemeral GPU \u00b7 RunPod Template', status:'OFFLINE', sc:'#b0b0b0',
    m:[['GPU','RTX 4000 Ada (benchmark-dependent)'],['VRAM','20 GB'],['Cost','$0.26/hr on-demand'],['Lifecycle','booting \u2192 ready \u2192 armed \u2192 in_call \u2192 idle \u2192 dead'],['Boot-to-armed','<4 min from RunPod template (target <2.5 min)'],['Contains','Pipecat + RNNT + Silero VAD + SmartTurn v3'],['Health check','STT/LLM/TTS latency tested before first call']],
    note:'Ephemeral template-based workers (RunPod US-CA-2). Created per-batch, destroyed after. Models pre-loaded on disk. Secrets injected via env vars at boot \u2014 never baked into image.' },
  vad:     { role:'Silero VAD \u00b7 Voice Activity Detection', status:'OFFLINE', sc:'#b0b0b0',
    m:[['Model','Silero VAD'],['Threshold','200ms stop_secs (configurable)'],['Location','Sales Worker GPU'],['Overlap','Runs concurrently with Parakeet RNNT'],['Barge-in','500ms client speech \u2192 interrupt Sales']],
    note:'VAD and RNNT stream concurrently \u2014 ~90% of transcript complete by VAD silence trigger. Barge-in: >500ms client speech interrupts Sales; <500ms ignored as backchannel.' },
  parakeet:{ role:'Parakeet RNNT 1.1B \u00b7 Streaming STT', status:'OFFLINE', sc:'#b0b0b0',
    m:[['Model','Parakeet RNNT 1.1B (NVIDIA)'],['Mode','Streaming \u2014 incremental transcription'],['Marginal latency','~0ms after VAD trigger'],['Host','Sales Worker (ephemeral)'],['Benchmark','Must test on 8kHz G.711 \u03bc-law audio'],['Fallback','Moonshine \u2014 if RNNT underperforms on phone audio'],['Controller','STT Model toggle (manual only, never auto-switches)']],
    note:'Streaming RNNT replaces offline TDT. Near-zero marginal latency because transcription overlaps with audio input \u2014 ~90% of transcript complete by VAD silence trigger. If RNNT accuracy drops on 8kHz G.711 phone audio \u2192 evaluate Moonshine replacement.' },
  sonnet:  { role:'Claude Sonnet 4.6 \u00b7 Live Call LLM', status:'PREHEATED', sc:'#60be35',
    m:[['Model','claude-sonnet-4-6'],['Host','Anthropic API (cloud)'],['Context','200k tokens'],['Usage','Live call ONLY \u2014 never async'],['Preheat','Before each call \u00b7 full spec loaded'],['Caching','Prompt caching \u00b7 ~45k tokens cached'],['Tokens last call','6,204']],
    note:'Never in async path. Prompt caching keeps ~45k spec tokens warm across calls. Claude Haiku handles post-call extraction to keep cost down.' },
  kokoro:  { role:'Inworld TTS Mini \u00b7 Cloud API', status:'READY', sc:'#9f00fa',
    m:[['Provider','Inworld TTS 1.5 Max \u00b7 Cloud API'],['Protocol','WebSocket streaming'],['First chunk','~200ms (Google SJC, 13ms)'],['Quality','ELO 1577 \u00b7 Native format'],['Pre-render','First turn + VM + 2 responses cached before dial'],['Fallback','Kokoro v1 on GPU (if Inworld health check fails)']],
    note:'Primary TTS: Inworld TTS Mini via cloud WebSocket API. ELO 1577 quality. Kokoro v1 on GPU worker as silent fallback only \u2014 activates if Inworld health check fails at boot.' },
  spaces:  { role:'DO Spaces \u00b7 Call Recordings', status:'READY', sc:'#60be35',
    m:[['Type','S3-compatible bucket'],['Format','Dual-channel stereo (client left, Sales right)'],['Streaming','Worker \u2192 sales-app \u2192 Spaces (real-time)'],['Cost','~$5/mo at launch volume'],['Retention','Configurable in Controller (default: keep all)']],
    note:'Recording survives worker death \u2014 audio streams to sales-app in real-time via WebSocket, then to DO Spaces. Post-call: stitched into stereo recording.' },
  haiku:   { role:'Claude Haiku 4.5 \u00b7 Async Extraction', status:'STANDBY', sc:'#b0b0b0',
    m:[['Model','claude-haiku-4-5-20251001'],['Host','Anthropic API (cloud)'],['Usage','Post-call only \u00b7 NEVER live path'],['Tasks','Sentiment \u00b7 Intent \u00b7 HubSpot notes'],['Cost','Fraction of Sonnet']],
    note:'Async extraction after the call. Keeps Sonnet reserved exclusively for the live voice path.' },
  telnyx:  { role:'Telnyx \u00b7 Voice + SMS', status:'OK', sc:'#60be35',
    m:[['Number','\u26a0 TBD \u2014 pre-launch blocker'],['SIP trunk','Outbound PSTN dial'],['Cost','$0.007/min + $0.02/SMS'],['SMS touches','Day 8 \u00b7 Day 18 \u00b7 Day 30'],['Transfer','Parallel ring up to 3 reps \u00b7 16s timeout'],['Call control','Sales Worker owns all Telnyx legs during live calls']],
    note:'Why Telnyx over Twilio: lower cost/min, better SIP flexibility. See ZC_DECISIONS.md. Sales Worker controls all Telnyx call legs directly \u2014 including parallel ring for warm transfer.' },
  client:  { role:'Client \u00b7 Property Manager', status:'TARGETING', sc:'#ff4040',
    m:[['Current target','Michelle Forkas \u00b7 Summit Mgmt Mgmt'],['propID','#7856 \u00b7 $127,400 \u00b7 28d stale'],['Script','T2-A (7\u201330d staleness)'],['Call window','Tue\u2013Fri \u00b7 10:30\u20134:30 PM PT'],['Channels','Voice \u00b7 SMS \u00b7 Email']],
    note:'Sales AI always leads with proposal number AND property name. No generic openers ever.' },
  reps:    { role:'Transfer Pool \u00b7 10 Reps', status:'7 AVAILABLE', sc:'#60be35',
    m:[['Priority 1','Marco Diaz \u00b7 (555) 334-0525'],['Priority 2','Sarah Mitchell \u00b7 (555) 924-5168'],['Default weight','Equal across all reps (Alex adjusts in Controller)'],['Ring logic','Up to 3 simultaneous \u00b7 16s timeout'],['On call','0 active'],['Blockers','OQ-1 Dan phone \u00b7 OQ-2 Jennifer phone \u00b7 OQ-5 shared phone \u00b7 OQ-6 Leah no HS seat']],
    note:'Transfer SMS fires to the rep immediately when ringing starts \u2014 before anyone picks up. Rep matching by hs_owner_id, NOT by email (3 confirmed mismatches).' },
};

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

/* nodes-render.js — edge geometry, SVG edge rendering, node DOM for tab_nodes */

const BIDIR_OFF = 7;

// -- Edge geometry helpers --

const clipToBorder = (n, tx, ty) => {
  let hw, hh;
  if (n.id === 'reps')  { hw = 120; hh = 110; }
  else if (n.hub)       { hw = 103; hh = 50; }
  else if (n.wide)      { hw = 118; hh = 50; }
  else                  { hw = 92;  hh = 46; }
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
  const isGpu = (n.id === 'gpu' || n.id === 'vad' || n.id === 'parakeet' || n.id === 'kokoro' || n.id === 'spaces');
  div.className = 'nd' + (n.hub ? ' hub' : '') + (n.wide ? ' wide' : '') + (isGpu ? ' gpu-node' : '') + (n.id === 'kb' ? ' book-node' : '');
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
  if (n.hub) extra = `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u25c8 CORE HUB</div>`;
  if (n.id === 'reps') {
    extra = `<div class="nd-people">${REPS_LIST.slice(0, 7).map(r => `<div class="nd-person">${r}</div>`).join('')}<div class="nd-person" style="color:var(--dim)">+ 3 more\u2026</div></div>`;
    div.style.width = '212px';
  }
  if (n.id === 'scripts') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">12 TIERS</div>`;
  if (n.id === 'kb')      extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">SPEC + 6 ZC DOCS</div>`;
  if (n.id === 'gpu')     extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u26a1 EPHEMERAL \u00b7 RUNPOD</div>`;
  if (n.id === 'vad')     extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">200ms STOP_SECS</div>`;
  if (n.id === 'intel')   extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">110 DEALS</div>`;
  if (n.id === 'ranking') extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">\u25c8 VIP \u00b7 DNC</div>`;
  if (n.id === 'spec')    extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">v1.9 \u00b7 FULL SPEC</div>`;
  if (n.id === 'spaces')  extra += `<div class="nd-badge" style="background:${n.c}18;color:${n.c};border:1px solid ${n.c}40">DUAL-CHANNEL</div>`;

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

/* nodes-main.js — setup, drag, tooltip, particles, zoom for tab_nodes */

// ═══════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════
restorePositions(NODES, STORAGE_KEY);
const nm = {};
NODES.forEach(n => nm[n.id] = n);

const svg  = document.getElementById('edgeSvg');
const root = document.getElementById('cnv');
const pctx = document.getElementById('partCvs').getContext('2d');
// tt is provided by graph-core.js

// -- Zoom state (declared early — drag uses zoomLevel) --
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
addRegion(svg, 30, 565, 860, 370, '#9f00fa', 'DIGITALOCEAN CPU \u00b7 PHIL-APP \u00b7 ~$12/MO \u00b7 ALWAYS ON', 'Rust (Axum) Backend \u00b7 SalesClaw (ZeroClaw fork) \u00b7 PostgreSQL \u00b7 React Controller');
addRegion(svg, 945, 60, 235, 880, '#60be35', 'PHIL WORKER \u00b7 EPHEMERAL GPU \u00b7 RUNPOD TEMPLATE \u00b7 $0.26/HR', 'Pipecat + RNNT + VAD + SmartTurn + DO Spaces \u00b7 Inworld (cloud)');
addRegion(svg, 1080, 495, 235, 525, '#d36eff', 'ANTHROPIC API \u00b7 CLOUD', 'claude-sonnet-4-6 \u00b7 claude-haiku-4-5');
addRegion(svg, 238, 58, 190, 710, '#9f00fa', 'INTELLIGENCE LAYER', 'SPEC \u00b7 Intel \u00b7 Ranking \u00b7 Schema');

// -- Column headers --
[{x:90,l:'OPERATOR'},{x:310,l:'INTELLIGENCE'},{x:555,l:'DATA LAYER'},
 {x:785,l:'CORE ENGINE'},{x:1080,l:'VOICE PIPELINE'},{x:1360,l:'CHANNELS'},{x:1590,l:'RECIPIENTS'}].forEach(({x,l}) => {
  const t = svgEl('text', {x, y:'36', fill:'#383838', 'font-size':'9',
    'font-family':'JetBrains Mono,monospace', 'text-anchor':'middle', 'letter-spacing':'0.22em'});
  t.textContent = l; svg.appendChild(t);
  svg.appendChild(svgEl('line', {x1:x-72, y1:'43', x2:x+72, y2:'43', stroke:'#2e2e2e', 'stroke-width':'0.5'}));
});

// -- Arrow markers --
const defs = svgEl('defs', {});
['#ee9612','#9f00fa','#60be35','#e95400','#ff4040','#d36eff'].forEach(col => {
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
document.getElementById('graphWrap').scrollTop = 70;
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
