/* gantt.js — Gantt Chart (merged) */

/* gantt-data.js — data + config for Sales AI Gantt chart */

// ── Coordinate system ──
var gridLeft = 320, gridRight = 1720;
var MONTHS = ['APR','MAY','JUN','JUL','AUG'];
var monthW = (gridRight - gridLeft) / 5;
var MONTH_X = {};
MONTHS.forEach(function(m, i) { MONTH_X[m] = gridLeft + i * monthW; });

function monthToX(month, day) {
  var idx = MONTHS.indexOf(month);
  if (idx < 0) return gridLeft;
  var dayFrac = ((day || 1) - 1) / 30;
  return gridLeft + (idx + dayFrac) * monthW;
}

var MONTH_NAMES = {
  JAN:'Jan',FEB:'Feb',MAR:'Mar',APR:'Apr',MAY:'May',
  JUN:'Jun',JUL:'Jul',AUG:'Aug',SEP:'Sep',OCT:'Oct'
};

// ── Phase & task data ──
var PHASES = [
  {
    id:'p1', label:'PHASE 1 \u2014 SPECIFICATION', status:'complete', c:'#60be35',
    start:['APR',1], end:['APR',11],
    tasks:[
      {id:'t1_1', label:'Spec v1.0\u2013v1.5 + Data Analysis', start:['APR',1], end:['APR',8], status:'complete',
        note:'Initial specification drafts, architecture decisions, pipeline analysis ($37.5M / 1,357 proposals), contact resolution, script library.'},
      {id:'t1_2', label:'Spec v1.0\u2013v1.7', start:['APR',8], end:['APR',11], status:'complete',
        note:'Final spec. Worker lifecycle, warm transfer, script selection, blocker tracking, full data model.'},
      {id:'t1_3', label:'HubSpot OAuth + Integrations', start:['APR',8], end:['APR',10], status:'complete',
        note:'Sales OAuth app (ID 00000000), contact resolution tiers, engagement feed, sales-email-read scope confirmed.'}
    ]
  },
  {
    id:'p2', label:'PHASE 2 \u2014 ALPHA (FIRST SPEECH)', status:'active', c:'#9f00fa',
    start:['APR',11], end:['APR',18],
    tasks:[
      {id:'t2_1', label:'GPU Pod + Voice Stack', start:['APR',11], end:['APR',15], status:'active',
        note:'Parakeet RNNT + Kokoro on RTX 4000 Ada. Validate STT/TTS latency on real hardware.'},
      {id:'t2_2', label:'Pipecat Pipeline (STT\u2192LLM\u2192TTS)', start:['APR',13], end:['APR',17], status:'planned',
        note:'Silero VAD + Parakeet RNNT + Claude Sonnet + Kokoro TTS. End-to-end voice pipeline.'},
      {id:'t2_3', label:'First Speech Output', start:['APR',17], end:['APR',18], status:'planned',
        note:'Sales speaks for the first time. Audio in, audio out. Validate voice quality and latency.'}
    ]
  },
  {
    id:'p3', label:'PHASE 3 \u2014 BETA (FIRST CALL)', status:'planned', c:'#3a3a3a',
    start:['APR',18], end:['APR',25],
    tasks:[
      {id:'t3_1', label:'Telnyx Integration (PSTN)', start:['APR',18], end:['APR',21], status:'planned',
        note:'Outbound dial via Telnyx. Caller ID, call control, DTMF. Real phone call over PSTN.'},
      {id:'t3_2', label:'Sales Backend (pre/post call)', start:['APR',18], end:['APR',23], status:'planned',
        note:'Data assembly, Claude preheating, attribution writes, FieldTECH/HubSpot sync.'},
      {id:'t3_3', label:'First Live Call (test number)', start:['APR',24], end:['APR',25], status:'planned',
        note:'Sales dials a real phone number, has a conversation, and handles the full call flow.'}
    ]
  },
  {
    id:'p4', label:'PHASE 4 \u2014 V1 PRODUCTION (MISSION 1)', status:'planned', c:'#3a3a3a',
    start:['APR',25], end:['MAY',11],
    tasks:[
      {id:'t4_1', label:'SalesClaw (scheduler + sequences)', start:['APR',25], end:['MAY',2], status:'planned',
        note:'Rust daemon. Queue checks, outreach sequences, worker lifecycle, Matrix C&C.'},
      {id:'t4_2', label:'Warm Transfer + Parallel Ring', start:['APR',28], end:['MAY',4], status:'planned',
        note:'Ring 3 reps, 16s timeout, transfer SMS, attribution write. Fallback to Alex.'},
      {id:'t4_3', label:'Sales Controller (Web UI)', start:['APR',28], end:['MAY',7], status:'planned',
        note:'Alex\u2019s command center. Batch approval, live transcript, rep management, config.'},
      {id:'t4_4', label:'PostgreSQL + Attribution', start:['APR',25], end:['MAY',2], status:'planned',
        note:'Call log, sequence state, attribution tracking. manager_userID=7225 writes.'},
      {id:'t4_5', label:'E2E Testing + Pilot Batch', start:['MAY',5], end:['MAY',9], status:'planned',
        note:'12 test scenarios. Alex approves first real batch. Nothing dials without green "Go".'},
      {id:'t4_6', label:'Mission 1 Go-Live', start:['MAY',9], end:['MAY',11], status:'planned',
        note:'Full Mission 1: recover stale sent proposals 7+ days. $37.5M pipeline. All blockers resolved.'}
    ]
  },
  {
    id:'p5', label:'V2 \u2014 NEW CLIENT PROSPECTING', status:'planned', c:'#3a3a3a',
    start:['MAY',11], end:['JUN',8],
    tasks:[
      {id:'t5_1', label:'Mission 2 Spec + Build', start:['MAY',11], end:['MAY',25], status:'planned',
        note:'Cold outreach to new prospects. Lead sourcing, qualification, appointment setting.'},
      {id:'t5_2', label:'Integration + Go-Live', start:['MAY',25], end:['JUN',8], status:'planned',
        note:'New prospect pipeline integrated with Sales\u2019s existing call infrastructure.'}
    ]
  },
  {
    id:'p6', label:'V3 \u2014 UPSELL & REVIEW AUTOMATION', status:'planned', c:'#3a3a3a',
    start:['JUN',8], end:['JUL',6],
    tasks:[
      {id:'t6_1', label:'Mission 3 Spec + Build', start:['JUN',8], end:['JUN',22], status:'planned',
        note:'Post-completion upsell calls, review solicitation, cross-sell from service matrix.'},
      {id:'t6_2', label:'Integration + Go-Live', start:['JUN',22], end:['JUL',6], status:'planned',
        note:'Upsell and review pipeline live alongside Missions 1 and 2.'}
    ]
  },
  {
    id:'p7', label:'V4 \u2014 DEBT COLLECTION', status:'planned', c:'#3a3a3a',
    start:['JUL',6], end:['AUG',3],
    tasks:[
      {id:'t7_1', label:'Mission 4 Spec + Build', start:['JUL',6], end:['JUL',20], status:'planned',
        note:'Overdue invoice follow-up. Escalation tiers, payment reminders, compliance guardrails.'},
      {id:'t7_2', label:'Integration + Go-Live', start:['JUL',20], end:['AUG',3], status:'planned',
        note:'Debt collection pipeline live. All four missions running concurrently.'}
    ]
  }
];

var MILESTONES = [
  {label:'Project started',                     date:['APR',1],  c:'#60be35'},
  {label:'Sales account created (userID 7225)',   date:['APR',8],  c:'#60be35'},
  {label:'HubSpot OAuth resolved',               date:['APR',10], c:'#60be35'},
  {label:'Spec v1.0 complete',                   date:['APR',11], c:'#60be35'},
  {label:'\u03b1 Alpha \u2014 First speech',     date:['APR',18], c:'#9f00fa'},
  {label:'\u03b2 Beta \u2014 First live call',   date:['APR',25], c:'#ee9612'},
  {label:'v1 Mission 1 Go-Live',                 date:['MAY',11], c:'#ff4040'},
  {label:'v2 Prospecting live',                  date:['JUN',8],  c:'#ee9612'},
  {label:'v3 Upsell/Reviews live',               date:['JUL',6],  c:'#ee9612'},
  {label:'v4 Debt Collection live',              date:['AUG',3],  c:'#ee9612'}
];

// Layout constants
var HEADER_Y = 44;
var CONTENT_TOP = 70;
var PHASE_HEADER_H = 30;
var TASK_ROW_H = 24;
var BAR_H = 16;
var TASK_BAR_H = 14;
var LABEL_X = 16;

// Status helpers
function statusLabel(s) {
  switch(s) {
    case 'complete':  return 'COMPLETE';
    case 'active':    return 'IN PROGRESS';
    case 'planned':   return 'PLANNED';
    case 'blocked':   return 'BLOCKED';
    case 'milestone': return 'MILESTONE';
    default:          return s.toUpperCase();
  }
}

function statusColor(s) {
  switch(s) {
    case 'complete':  return '#60be35';
    case 'active':    return '#9f00fa';
    case 'planned':   return '#585858';
    case 'blocked':   return '#ff4040';
    case 'milestone': return '#ee9612';
    default:          return '#585858';
  }
}

/* gantt-render.js — SVG rendering for Gantt chart (grid, phases, tasks) */
var svg = document.getElementById('ganttSvg');

// ── SVG Defs: glow filter + flag symbol ──
var defs = svgEl('defs', {});
var glowFilter = svgEl('filter', {id:'glowActive', x:'-20%', y:'-20%', width:'140%', height:'140%'});
var feGlow = svgEl('feGaussianBlur', {stdDeviation:'3', result:'glow'});
glowFilter.appendChild(feGlow);
var feMerge = svgEl('feMerge', {});
feMerge.appendChild(svgEl('feMergeNode', {'in':'glow'}));
feMerge.appendChild(svgEl('feMergeNode', {'in':'SourceGraphic'}));
glowFilter.appendChild(feMerge);
defs.appendChild(glowFilter);
var flagSym = svgEl('symbol', {id:'flagIcon', viewBox:'0 0 16 16'});
flagSym.appendChild(svgEl('path', {d:'M3,2 L3,14', stroke:'#ff4040', 'stroke-width':'1.5', fill:'none'}));
flagSym.appendChild(svgEl('path', {d:'M3,2 L11,5 L3,8 Z', fill:'#ff4040', opacity:'0.8'}));
defs.appendChild(flagSym);
svg.insertBefore(defs, svg.firstChild);

// ── Time grid: month columns + labels ──
MONTHS.forEach(function(m) {
  var x = MONTH_X[m];
  svg.appendChild(svgEl('line', {x1:x, y1:HEADER_Y+16, x2:x, y2:880, stroke:'rgba(255,255,255,0.06)', 'stroke-width':'1'}));
  var label = svgEl('text', {x:x+monthW/2, y:HEADER_Y, fill:'#b0b0b0',
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'13',
    'font-weight':'600', 'text-anchor':'middle', 'letter-spacing':'0.12em'});
  label.textContent = m;
  svg.appendChild(label);
});
svg.appendChild(svgEl('line', {x1:gridRight, y1:HEADER_Y+16, x2:gridRight, y2:880, stroke:'rgba(255,255,255,0.06)', 'stroke-width':'1'}));
svg.appendChild(svgEl('line', {x1:gridLeft, y1:HEADER_Y+14, x2:gridRight, y2:HEADER_Y+14, stroke:'rgba(255,255,255,0.08)', 'stroke-width':'1'}));
var yearLabel = svgEl('text', {x:(gridLeft+gridRight)/2, y:HEADER_Y+30, fill:'rgba(255,255,255,0.08)',
  'font-family':'Barlow Condensed, sans-serif', 'font-size':'11', 'font-weight':'400', 'text-anchor':'middle', 'letter-spacing':'0.3em'});
yearLabel.textContent = '2026';
svg.appendChild(yearLabel);

// ── TODAY line (Apr 11) ──
var todayX = monthToX('APR', 11);
svg.appendChild(svgEl('line', {x1:todayX, y1:HEADER_Y+16, x2:todayX, y2:880, stroke:'#9f00fa', 'stroke-width':'1.5', 'stroke-dasharray':'6,4', 'stroke-opacity':'0.6'}));
svg.appendChild(svgEl('rect', {x:todayX-22, y:HEADER_Y+16, width:44, height:14, rx:'2', fill:'#9f00fa', opacity:'0.9'}));
var todayLabel = svgEl('text', {x:todayX, y:HEADER_Y+26, fill:'#ffffff',
  'font-family':'JetBrains Mono, monospace', 'font-size':'9.5', 'font-weight':'700', 'text-anchor':'middle', 'letter-spacing':'0.1em'});
todayLabel.textContent = 'TODAY';
svg.appendChild(todayLabel);

// ── Render phases and tasks ──
var rowY = CONTENT_TOP;
var hoverTargets = [];

PHASES.forEach(function(phase) {
  // Phase header background
  svg.appendChild(svgEl('rect', {x:0, y:rowY, width:1920, height:PHASE_HEADER_H, fill:'#1a1a1a'}));
  svg.appendChild(svgEl('line', {
    x1:0, y1:rowY, x2:1920, y2:rowY,
    stroke:'rgba(255,255,255,0.04)', 'stroke-width':'1'
  }));

  // Phase label
  var phaseLabel = svgEl('text', {
    x:LABEL_X, y:rowY + 19, fill:phase.c,
    'font-family':'Barlow Condensed, sans-serif', 'font-size':'13',
    'font-weight':'700', 'letter-spacing':'0.06em'
  });
  phaseLabel.textContent = phase.label;
  svg.appendChild(phaseLabel);

  // Status badge
  var sText = phase.status === 'complete' ? 'COMPLETE' : phase.status === 'active' ? 'IN PROGRESS' : 'PLANNED';
  var sColor = phase.status === 'complete' ? '#60be35' : phase.status === 'active' ? '#9f00fa' : '#585858';
  var sBadge = svgEl('text', {
    x:260, y:rowY + 19, fill:sColor,
    'font-family':'JetBrains Mono, monospace', 'font-size':'9.5',
    'letter-spacing':'0.12em', opacity:'0.7'
  });
  sBadge.textContent = sText;
  svg.appendChild(sBadge);

  // Phase summary bar
  var phaseX1 = monthToX(phase.start[0], phase.start[1]);
  var phaseX2 = monthToX(phase.end[0], phase.end[1]);
  svg.appendChild(svgEl('rect', {
    x:phaseX1, y:rowY + PHASE_HEADER_H/2 - 1, width:phaseX2-phaseX1, height:2, rx:'1',
    fill:phase.c, opacity:'0.15'
  }));

  rowY += PHASE_HEADER_H;

  // Tasks
  phase.tasks.forEach(function(task) {
    var taskY = rowY;

    // Task label
    var tLabel = svgEl('text', {
      x:LABEL_X + 14, y:taskY + 16,
      fill:task.status === 'blocked' ? '#ff4040' : '#b0b0b0',
      'font-family':'JetBrains Mono, monospace', 'font-size':'10',
      'letter-spacing':'0.02em',
      opacity:task.status === 'complete' ? '0.6' : '1'
    });
    tLabel.textContent = task.label;
    svg.appendChild(tLabel);

    // Task bar coordinates
    var bx1 = monthToX(task.start[0], task.start[1]);
    var bx2 = monthToX(task.end[0], task.end[1]);
    var bw = bx2 - bx1;
    var by = taskY + (TASK_ROW_H - TASK_BAR_H) / 2;

    var barColor, barFillOp, barStrokeOp;
    if (task.status === 'complete') {
      barColor = '#60be35'; barFillOp = '0.35'; barStrokeOp = '0.6';
    } else if (task.status === 'active') {
      barColor = '#9f00fa'; barFillOp = '0.35'; barStrokeOp = '0.6';
    } else {
      barColor = '#3a3a3a'; barFillOp = '0.25'; barStrokeOp = '0.4';
    }

    var barRect = svgEl('rect', {
      x:bx1, y:by, width:bw, height:TASK_BAR_H, rx:'4',
      fill:barColor, 'fill-opacity':barFillOp,
      stroke:barColor, 'stroke-opacity':barStrokeOp, 'stroke-width':'1'
    });
    if (task.status === 'active') barRect.classList.add('gantt-bar-active');
    svg.appendChild(barRect);

    // Active: progress fill up to today
    if (task.status === 'active') {
      var progressEnd = Math.min(todayX, bx2);
      if (progressEnd > bx1) {
        svg.appendChild(svgEl('rect', {
          x:bx1, y:by, width:progressEnd - bx1, height:TASK_BAR_H, rx:'4',
          fill:'#9f00fa', 'fill-opacity':'0.25'
        }));
      }
    }

    // Blocked: accent + flag
    if (task.status === 'blocked') {
      svg.appendChild(svgEl('rect', {x:bx1, y:by, width:3, height:TASK_BAR_H, rx:'1', fill:'#ff4040', opacity:'0.8'}));
      svg.appendChild(svgEl('use', {href:'#flagIcon', x:bx2+4, y:by-1, width:'14', height:'14'}));
      var bLabel = svgEl('text', {
        x:bx2+22, y:by+10, fill:'#ff4040',
        'font-family':'JetBrains Mono, monospace', 'font-size':'9.5',
        'letter-spacing':'0.04em', opacity:'0.7'
      });
      bLabel.textContent = task.blocker;
      svg.appendChild(bLabel);
    }

    // Complete checkmark
    if (task.status === 'complete') {
      var cx = bx2 + 6, cy = by + TASK_BAR_H/2;
      svg.appendChild(svgEl('path', {
        d:'M'+cx+','+cy+' L'+(cx+3)+','+(cy+3)+' L'+(cx+8)+','+(cy-4),
        fill:'none', stroke:'#60be35', 'stroke-width':'1.5',
        'stroke-linecap':'round', 'stroke-linejoin':'round', opacity:'0.5'
      }));
    }

    // Hover zone
    var hoverRect = svgEl('rect', {
      x:Math.min(bx1, LABEL_X), y:taskY,
      width:Math.max(bx2, gridRight) - Math.min(bx1, LABEL_X) + 30,
      height:TASK_ROW_H,
      fill:'transparent', opacity:'0', 'pointer-events':'all', cursor:'default'
    });
    hoverTargets.push({el:hoverRect, task:task, phase:phase, bx1:bx1, bx2:bx2, by:by});
    svg.appendChild(hoverRect);

    rowY += TASK_ROW_H;
  });

  rowY += 6;
});

/* gantt-milestones.js — milestone rendering + column header */

// ── Milestones ──
var milestoneY = rowY + 16;

svg.appendChild(svgEl('rect', {x:0, y:milestoneY-6, width:1920, height:28, fill:'#1a1a1a'}));
svg.appendChild(svgEl('line', {
  x1:0, y1:milestoneY-6, x2:1920, y2:milestoneY-6,
  stroke:'rgba(255,255,255,0.04)', 'stroke-width':'1'
}));
var msTitle = svgEl('text', {
  x:LABEL_X, y:milestoneY+12, fill:'#ee9612',
  'font-family':'Barlow Condensed, sans-serif', 'font-size':'12',
  'font-weight':'700', 'letter-spacing':'0.1em'
});
msTitle.textContent = 'MILESTONES';
svg.appendChild(msTitle);

milestoneY += 30;

MILESTONES.forEach(function(ms, idx) {
  var mx = monthToX(ms.date[0], ms.date[1]);
  var my = milestoneY + idx * 22;

  // Diamond marker
  svg.appendChild(svgEl('rect', {
    x:mx-5, y:my-5, width:10, height:10, rx:'1',
    fill:ms.c, 'fill-opacity':'0.3', stroke:ms.c, 'stroke-opacity':'0.7', 'stroke-width':'1',
    transform:'rotate(45 '+mx+' '+my+')'
  }));
  svg.appendChild(svgEl('circle', {cx:mx, cy:my, r:'2', fill:ms.c, opacity:'0.8'}));

  // Milestone label
  var msText = svgEl('text', {
    x:mx+12, y:my+4, fill:ms.c,
    'font-family':'JetBrains Mono, monospace', 'font-size':'9',
    'letter-spacing':'0.04em', opacity:'0.8'
  });
  msText.textContent = ms.label;
  svg.appendChild(msText);

  // Date label
  var dateLabel = svgEl('text', {
    x:mx-12, y:my+4, fill:'#585858',
    'font-family':'JetBrains Mono, monospace', 'font-size':'9.5',
    'text-anchor':'end', 'letter-spacing':'0.04em'
  });
  dateLabel.textContent = (MONTH_NAMES[ms.date[0]] || ms.date[0]) + ' ' + ms.date[1];
  svg.appendChild(dateLabel);

  // Hover zone for milestone
  var msHover = svgEl('rect', {
    x:mx-60, y:my-10, width:300, height:20,
    fill:'transparent', opacity:'0', 'pointer-events':'all', cursor:'default'
  });
  hoverTargets.push({
    el:msHover,
    task:{
      id:'ms_'+idx, label:ms.label, status:'milestone',
      start:ms.date, end:ms.date,
      note:'Milestone: ' + ms.label + ' \u2014 ' + (MONTH_NAMES[ms.date[0]] || ms.date[0]) + ' ' + ms.date[1] + ', 2026'
    },
    phase:{label:'MILESTONES', c:ms.c},
    isMilestone:true
  });
  svg.appendChild(msHover);
});

// ── Left column header ──
var colHeader = svgEl('text', {
  x:LABEL_X, y:HEADER_Y, fill:'#b0b0b0',
  'font-family':'Barlow Condensed, sans-serif', 'font-size':'13',
  'font-weight':'600', 'letter-spacing':'0.12em'
});
colHeader.textContent = 'TASK';
svg.appendChild(colHeader);

// Separator line between label column and grid
svg.appendChild(svgEl('line', {
  x1:gridLeft-10, y1:HEADER_Y-10, x2:gridLeft-10, y2:880,
  stroke:'rgba(255,255,255,0.06)', 'stroke-width':'1'
}));

/* gantt-main.js — tooltip + hover for Gantt chart */

// ── Tooltip display ──
function showTooltip(data, e2) {
  var task = data.task;
  var phase = data.phase;

  document.getElementById('tt-name').textContent = task.label;
  document.getElementById('tt-name').style.color = phase.c;
  document.getElementById('tt-role').textContent = phase.label;

  var sc = statusColor(task.status);
  var sdot = document.getElementById('tt-sdot');
  sdot.style.background = sc;
  sdot.style.color = sc;
  document.getElementById('tt-sv').textContent = statusLabel(task.status);
  document.getElementById('tt-sv').style.color = sc;

  var metrics = [];
  metrics.push(['Status', statusLabel(task.status)]);
  if (!data.isMilestone) {
    var startStr = (MONTH_NAMES[task.start[0]] || task.start[0]) + ' ' + task.start[1] + ', 2026';
    var endStr   = (MONTH_NAMES[task.end[0]]   || task.end[0])   + ' ' + task.end[1]   + ', 2026';
    metrics.push(['Start', startStr]);
    metrics.push(['End', endStr]);
  } else {
    var dateStr = (MONTH_NAMES[task.start[0]] || task.start[0]) + ' ' + task.start[1] + ', 2026';
    metrics.push(['Date', dateStr]);
  }
  if (task.blocker) {
    metrics.push(['Blocker', task.blocker]);
  }

  document.getElementById('tt-metrics').innerHTML =
    metrics.map(function(pair) {
      var valColor = pair[0] === 'Blocker' ? '#ff4040' : 'var(--tm)';
      return '<div class="tt-row"><span class="tt-k">' + pair[0] +
        '</span><span class="tt-v" style="color:' + valColor + '">' +
        pair[1] + '</span></div>';
    }).join('');

  document.getElementById('tt-conns').style.display = 'none';
  document.getElementById('tt-note').textContent = task.note || '';
  document.getElementById('tt-note').style.display = task.note ? 'block' : 'none';

  tt.style.display = 'block';
  moveTooltip(e2);
}

// ── Attach hover events ──
hoverTargets.forEach(function(ht) {
  ht.el.addEventListener('mouseenter', function(e) { showTooltip(ht, e); });
  ht.el.addEventListener('mousemove',  function(e) { moveTooltip(e); });
  ht.el.addEventListener('mouseleave', function()  { hideTooltip(); });
});
