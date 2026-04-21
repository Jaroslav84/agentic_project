/* transfer-data.js — data constants for Warm Transfer graph */

var STORAGE_KEY = 'phil-pos-transfer';

var ICONS = {
  engage:   icon('M10,3 a7,7 0 1,0 .01,0Z M7,10 L9.5,12.5 L13.5,7.5'),
  script:   icon('M4,2h12v16H4V2z M8,7h5 M8,10h5 M8,13h3'),
  select:   icon('M6.5,8 a3,3 0 1,0 .01,0Z M1,17 C1,13.5 3.5,11.5 6.5,11.5 S12,13.5 12,17 M13,6 C14.5,4.5 17,5 17.5,7 S16,10 14,9 M15,11 C18,12 20,14.5 19.5,17'),
  ring:     icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M13,3h4v4 M17,3 L13.5,6.5'),
  sms:      icon('M2,3h16v10H2V3z M5,16 L4,20 L11,16h5 M6,8h8 M6,11h5'),
  answer:   icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M7,10 L9.5,12.5 L13.5,7.5'),
  attrib:   icon('M3,5 Q3,3 10,3 Q17,3 17,5 L17,15 Q17,17 10,17 Q3,17 3,15Z M3,5 Q3,7 10,7 Q17,7 17,5 M7,11h6 M7,13.5h4'),
  post:     icon('M10,7 a3,3 0 1,0 .01,0Z M10,1v3 M10,16v3 M1,10h3 M16,10h3 M3.2,3.2l2.1,2.1 M14.7,14.7l2.1,2.1 M3.2,16.8l2.1,-2.1 M14.7,5.3l2.1,-2.1'),
  unavail:  icon('M10,3 a7,7 0 1,0 .01,0Z M7,7 L13,13 M13,7 L7,13'),
  apology:  icon('M4,2h12v16H4V2z M8,7h5 M8,10h5 M8,13h3 M7,10 L9.5,12.5 L13.5,7.5'),
  sms30:    icon('M2,3h16v10H2V3z M5,16 L4,20 L11,16h5 M6,8h8 M6,11h5'),
  matrix:   icon('M2,3h16v10H2V3z M5,16 L4,20 L11,16h5 M6,8h8 M6,11h5'),
  won:      icon('M10,3 a7,7 0 1,0 .01,0Z M7,10 L9.5,12.5 L13.5,7.5'),
  resume:   icon('M10,3 a7,7 0 1,0 .01,0Z M10,6v4 L13,12 M10,3 L10,1 M7,2.5 L10,1 L13,2.5'),
  lost:     icon('M10,3 a7,7 0 1,0 .01,0Z M7,7 L13,13 M13,7 L7,13'),
  reps:     icon('M6.5,8 a3,3 0 1,0 .01,0Z M1,17 C1,13.5 3.5,11.5 6.5,11.5 S12,13.5 12,17 M13,6 C14.5,4.5 17,5 17.5,7 S16,10 14,9 M15,11 C18,12 20,14.5 19.5,17'),
};

var NODES = [
  {id:'engage',  label:'CLIENT ENGAGEMENT',  sub:'Positive response detected\nIntent signal',                              x:700, y:80,  c:'#60be35'},
  {id:'script',  label:'PHIL SCRIPT',        sub:'"Let me connect you with\nour scheduling team"',                         x:700, y:190, c:'#9f00fa'},
  {id:'select',  label:'SELECT 3 REPS',      sub:'Weighted round-robin\nTransfer pool',                                   x:700, y:310, c:'#ee9612'},
  {id:'ring',    label:'PARALLEL RING',       sub:'Up to 3 reps simultaneous\n16s timeout',                                x:700, y:440, c:'#ff4040', hub:true},
  {id:'sms',     label:'TRANSFER SMS',        sub:'Fires immediately when\nringing starts',                                x:900, y:440, c:'#e95400'},
  {id:'answer',  label:'REP ANSWERS',         sub:'First rep to answer\nConference call connected',                        x:700, y:570, c:'#60be35'},
  {id:'attrib',  label:'ATTRIBUTION',         sub:'POST manager_userID=7225\nFieldTECH note',                             x:700, y:690, c:'#9f00fa'},
  {id:'post',    label:'POST-TRANSFER',       sub:'Monitor for outcome',                                                  x:700, y:820, c:'#9f00fa'},
  {id:'unavail', label:'ALL UNAVAILABLE',     sub:'All 3 reps timed out\n16s each',                                        x:400, y:520, c:'#ff4040'},
  {id:'apology', label:'CLIENT APOLOGY',      sub:'Sales apologizes\nPromises callback',                                    x:400, y:630, c:'#9f00fa'},
  {id:'sms30',   label:'SMS WITHIN 30 MIN',   sub:'Automated SMS to client',                                               x:300, y:740, c:'#e95400'},
  {id:'matrix',  label:'MATRIX ALERT',        sub:'High-priority alert to Alex',                                           x:500, y:740, c:'#ee9612'},
  {id:'won',     label:'WON',                 sub:'approved+ status\nProposal approved',                                    x:550, y:940, c:'#60be35'},
  {id:'resume',  label:'RESUME',              sub:'Still sent 48h later\nResume sequence',                                  x:700, y:940, c:'#9f00fa'},
  {id:'lost',    label:'LOST',                sub:'Closed status\nProposal closed/dead',                                    x:850, y:940, c:'#ff4040'},
  {id:'reps',    label:'REP POOL',            sub:'Transfer pool\n10 reps \u00b7 Weighted priority',                             x:1200,y:400, c:'#ee9612', wide:true},
];

var EDGES = [
  {f:'engage',  t:'script',  c:'#9f00fa', lbl:'engage detected', spd:2.5},
  {f:'script',  t:'select',  c:'#ee9612', lbl:'initiate transfer',spd:2.0},
  {f:'select',  t:'ring',    c:'#ff4040', lbl:'dial 3 reps',     spd:3.5},
  {f:'ring',    t:'answer',  c:'#60be35', lbl:'first answer',    spd:4.0},
  {f:'answer',  t:'attrib',  c:'#9f00fa', lbl:'write attribution',spd:2.5},
  {f:'attrib',  t:'post',    c:'#9f00fa', lbl:'monitor',         spd:1.5},
  {f:'ring',    t:'sms',     c:'#e95400', lbl:'fires before answer',spd:4.5},
  {f:'select',  t:'reps',    c:'#ee9612', lbl:'weighted select', spd:2.0},
  {f:'ring',    t:'unavail', c:'#ff4040', lbl:'all timeout',     spd:2.0},
  {f:'unavail', t:'apology', c:'#9f00fa', lbl:'apologize',       spd:2.0},
  {f:'apology', t:'sms30',   c:'#e95400', lbl:'auto SMS',        spd:2.5},
  {f:'apology', t:'matrix',  c:'#ee9612', lbl:'alert Alex',      spd:2.5},
  {f:'post',    t:'won',     c:'#60be35', lbl:'approved+',       spd:1.5},
  {f:'post',    t:'resume',  c:'#9f00fa', lbl:'still sent 48h',  spd:1.5},
  {f:'post',    t:'lost',    c:'#ff4040', lbl:'closed',          spd:1.5},
  {f:'sms',     t:'reps',    c:'#e95400', lbl:'rep briefing',    spd:2.0},
];

var SHAPE_MAP = {
  engage:  'rounded-rect',
  script:  'rect',
  select:  'rect',
  ring:    'diamond',
  sms:     'parallelogram',
  answer:  'rect',
  attrib:  'rect',
  post:    'rect',
  unavail: 'rect',
  apology: 'rect',
  sms30:   'parallelogram',
  matrix:  'parallelogram',
  won:     'rounded-rect',
  resume:  'rounded-rect',
  lost:    'rounded-rect',
  reps:    'data-panel',
};

var REPS_LIST = [
  'Marco Diaz \u00b7 P1 \u00b7 (555) 510-4386',
  'Sarah Mitchell \u00b7 P2 \u00b7 (555) 167-3456',
  'Dan Harper \u00b7 P3 \u00b7 \u26a0 TBD',
  'Ruben Santos \u00b7 P4 \u00b7 (555) 680-5155',
  'Amy Adams \u00b7 P5 \u00b7 (555) 317-8179',
  'Henry Jordan \u00b7 P6 \u00b7 (555) 505-7517',
  'Leah Baker \u00b7 P7 \u00b7 (555) 246-4339',
  'Jenna Martinez \u00b7 P8 \u00b7 \u26a0 TBD',
  'Stacy Kim \u00b7 P9 \u00b7 (555) 242-4040',
  'Alex \u00b7 Fallback \u00b7 (555) 862-9197',
];
