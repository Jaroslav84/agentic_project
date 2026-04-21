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
