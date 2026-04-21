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
