/* scriptselect-data.js — data definitions for Script Selection graph */

var STORAGE_KEY = 'phil-pos-scriptselect';

// =====================================================
// SVG ICONS (20x20 viewBox, stroke-based)
// =====================================================
var ICONS = {
  incoming: icon('M6.5,2.5 C4.5,2.5 3,4 3,5.5 C3,12.5 7.5,17 14.5,17 C16,17 17.5,15.5 17.5,13.5 L14.5,10.5 L12,12.5 C10.5,11.5 8.5,9.5 7.5,8 L9.5,5.5Z M14,2v3h3'),
  decision: icon('M10,2 L18,10 L10,18 L2,10Z M10,7v6 M8,10h4'),
  override: icon('M10,2 L19,17 H1Z M10,8v4 M10,14v1'),
  guard:    icon('M10,2 L17,5 V12 C17,16 10,19 10,19 C10,19 3,16 3,12 V5Z M10,8v4 M10,14v1'),
  history:  icon('M2,4h16v12H2V4z M2,4 L10,11 L18,4 M14,14 L17,17'),
  stale:    icon('M10,3 a7,7 0 1,0 .01,0Z M10,6v4 L13,12 M10,3 L10,1 M7,2.5 L10,1 L13,2.5'),
  script:   icon('M4,2h8l4,4v12H4V2z M12,2v4h4 M7,10h6 M7,13h6'),
  skip:     icon('M10,3 a7,7 0 1,0 .01,0Z M7,7 L13,13 M13,7 L7,13'),
  keyrule:  icon('M10,2 L12,8 L18,8 L13,12 L15,18 L10,14 L5,18 L7,12 L2,8 L8,8Z')
};

// =====================================================
// NODES
// =====================================================
var NODES = [
  // ENTRY
  {id:'entry',  label:'INCOMING CALL',         sub:'New call initiated\nCheck priority cascade',                       x:960, y:60,  c:'#9f00fa', hub:true},

  // LEVEL 1 - P1 Override Triggers
  {id:'p1',     label:'P1 \u2014 OVERRIDE TRIGGERS',sub:'Check first \u00b7 Highest priority',                                  x:960, y:180, c:'#ff4040', hub:true},
  {id:'t4c',    label:'T4-C',                  sub:'City/code enforcement\nin email history',                          x:600, y:300, c:'#ff4040'},
  {id:'t4a',    label:'T4-A',                  sub:'Rep departed +\nfirst outreach',                                  x:960, y:300, c:'#e95400'},
  {id:'t3b',    label:'T3-B',                  sub:'Unanswered client\nquestion',                                     x:1320,y:300, c:'#ee9612'},

  // LEVEL 2 - P2 Recency Guard
  {id:'p2',     label:'P2 \u2014 RECENCY GUARD',    sub:'Human rep check',                                                 x:960, y:420, c:'#ee9612', hub:true},
  {id:'skip',   label:'SKIP',                  sub:'Human rep emailed < 7 days\nDO NOT CONTACT',                      x:700, y:520, c:'#ff4040'},

  // LEVEL 3 - P3 Email History
  {id:'p3',     label:'P3 \u2014 EMAIL HISTORY',    sub:'Client reply analysis',                                           x:960, y:600, c:'#60be35', hub:true},
  {id:'t1a',    label:'T1-A',                  sub:'HOA / property mgmt\nreply',                                      x:400, y:720, c:'#60be35'},
  {id:'t1b',    label:'T1-B',                  sub:'Price / general\nreply',                                          x:600, y:720, c:'#60be35'},
  {id:'t1c',    label:'T1-C',                  sub:'Budget concern\nreply',                                           x:800, y:720, c:'#60be35'},
  {id:'t1d',    label:'T1-D',                  sub:'Forwarded reply\nto decision maker',                              x:1000,y:720, c:'#60be35'},
  {id:'t3a',    label:'T3-A',                  sub:'No email history\nNever emailed',                                 x:1250,y:720, c:'#9f00fa'},

  // LEVEL 4 - P4 Staleness Bucket
  {id:'p4',     label:'P4 \u2014 STALENESS BUCKET', sub:'Days since sent\nEmail sent but no reply',                        x:960, y:850, c:'#e95400', hub:true},
  {id:'t2a',    label:'T2-A',                  sub:'7\u201330 days stale\nFresh stale',                               x:600, y:950, c:'#e95400'},
  {id:'t2b',    label:'T2-B',                  sub:'30\u201390 days stale\nModerate stale',                           x:800, y:950, c:'#e95400'},
  {id:'t2c',    label:'T2-C',                  sub:'90\u2013365 days stale\nVery stale',                              x:1000,y:950, c:'#e95400'},
  {id:'t4d',    label:'T4-D',                  sub:'365+ days stale\nAncient',                                       x:1200,y:950, c:'#585858'},

  // KEY RULE callout
  {id:'keyrule',label:'KEY RULE',              sub:'T1 always beats staleness.\nThe last client action matters\nmore than the calendar.', x:200, y:720, c:'#60be35'}
];

// =====================================================
// EDGES
// =====================================================
var EDGES = [
  // Entry -> P1
  {f:'entry', t:'p1',   c:'#ff4040', lbl:'check overrides', spd:2.5},

  // P1 -> terminals
  {f:'p1',    t:'t4c',  c:'#ff4040', lbl:'enforcement',     spd:2.0},
  {f:'p1',    t:'t4a',  c:'#e95400', lbl:'rep left',        spd:2.0},
  {f:'p1',    t:'t3b',  c:'#ee9612', lbl:'question pending', spd:2.0},

  // P1 -> P2 (fall-through)
  {f:'p1',    t:'p2',   c:'#9f00fa', lbl:'no override',     spd:1.5},

  // P2 -> SKIP
  {f:'p2',    t:'skip', c:'#ff4040', lbl:'rep active',      spd:2.0},

  // P2 -> P3 (fall-through)
  {f:'p2',    t:'p3',   c:'#9f00fa', lbl:'clear',           spd:1.5},

  // P3 -> T1 terminals
  {f:'p3',    t:'t1a',  c:'#60be35', lbl:'HOA',             spd:2.0},
  {f:'p3',    t:'t1b',  c:'#60be35', lbl:'price/general',   spd:2.0},
  {f:'p3',    t:'t1c',  c:'#60be35', lbl:'budget',          spd:2.0},
  {f:'p3',    t:'t1d',  c:'#60be35', lbl:'forwarded',       spd:2.0},
  {f:'p3',    t:'t3a',  c:'#9f00fa', lbl:'no history',      spd:1.8},

  // P3 -> P4 (fall-through)
  {f:'p3',    t:'p4',   c:'#9f00fa', lbl:'emailed, no reply', spd:1.5},

  // P4 -> T2 terminals
  {f:'p4',    t:'t2a',  c:'#e95400', lbl:'7\u201330d',      spd:2.0},
  {f:'p4',    t:'t2b',  c:'#e95400', lbl:'30\u201390d',     spd:2.0},
  {f:'p4',    t:'t2c',  c:'#e95400', lbl:'90\u2013365d',    spd:2.0},
  {f:'p4',    t:'t4d',  c:'#585858', lbl:'365d+',           spd:1.0}
];

// =====================================================
// NODE SHAPES
// =====================================================
var NODE_SHAPES = {
  entry:'diamond', p1:'diamond', p2:'diamond', p3:'diamond', p4:'diamond',
  t4c:'leaf', t4a:'leaf', t3b:'leaf', skip:'leaf',
  t1a:'leaf', t1b:'leaf', t1c:'leaf', t1d:'leaf', t3a:'leaf',
  t2a:'leaf', t2b:'leaf', t2c:'leaf', t4d:'leaf',
  keyrule:'keyrule'
};

// =====================================================
// ICON MAPPING
// =====================================================
function getIconId(id) {
  if (id === 'entry')   return 'incoming';
  if (id === 'p1')      return 'override';
  if (id === 'p2')      return 'guard';
  if (id === 'p3')      return 'history';
  if (id === 'p4')      return 'stale';
  if (id === 'skip')    return 'skip';
  if (id === 'keyrule') return 'keyrule';
  if (id === 't4c')     return 'override';
  if (id === 't4a')     return 'script';
  if (id === 't3b')     return 'history';
  if (id === 't3a')     return 'script';
  return 'script';
}
