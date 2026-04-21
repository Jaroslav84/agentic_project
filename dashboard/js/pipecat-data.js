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
