/* ─────────────────────────────────────────────────────────
   scripts-overview.js — Decision tree overview rendering
   Requires: scripts.js globals (rawTexts, scrollHandler, headingEls)
   Globals exposed: showOverview, countScripts, goToBrowse, buildOverviewToc
   ───────────────────────────────────────────────────────── */

function showOverview() {
  document.getElementById('fileName').textContent = 'Script Decision Tree';
  document.getElementById('fileInfo').textContent = '4 channels \u00b7 live from SCRIPTS_*.md';
  var body = document.getElementById('mdBody');
  var wrap = document.getElementById('mdWrap');

  // detach old scroll handler
  if (scrollHandler) { body.removeEventListener('scroll', scrollHandler); scrollHandler = null; }

  var h = '';

  // ── Channel cards ──
  h += '<div class="ov-grid">';
  var cards = [
    { ch: 'call', icon: '\u260E', title: 'Call Scripts', desc: 'Live call frameworks \u2014 T1\u2013T4 + objection handling', color: 'ov-title-C' },
    { ch: 'voicemail', icon: '\uD83D\uDCE8', title: 'Voicemail', desc: '25-second formula \u2014 anchor, hook, callback number', color: 'ov-title-O' },
    { ch: 'sms', icon: '\uD83D\uDCF1', title: 'SMS Scripts', desc: 'Day 8 + Day 12 follow-ups \u2014 under 160 chars', color: 'ov-title-G' },
    { ch: 'email', icon: '\u2709\uFE0F', title: 'Email Scripts', desc: 'Subject line + 5\u20138 line body \u2014 one ask per email', color: 'ov-title-Y' }
  ];
  cards.forEach(function(c) {
    var n = countScripts(c.ch);
    h += '<div class="ov-card" onclick="goToBrowse(\'' + c.ch + '\')">';
    h += '<div class="ov-icon">' + c.icon + '</div>';
    h += '<div class="ov-title ' + c.color + '">' + c.title + '</div>';
    h += '<div class="ov-desc">' + c.desc + '</div>';
    h += '<div class="ov-count">' + n + ' scripts \u00b7 click to browse</div>';
    h += '</div>';
  });
  h += '</div>';

  // ── Script Selection Logic ──
  h += '<div class="ov-section-row"><span class="ov-section-title">Script Selection Logic</span>';
  h += '<span class="ov-section-sub">PRIORITY ORDER \u00b7 FIRST MATCH WINS</span></div>';
  var steps = [
    { t: 'Override Triggers', d: 'City/code enforcement \u2192 T4-C. Rep departed + first outreach \u2192 T4-A. Unanswered question \u2192 T3-B.', r: 'T4-C / T4-A / T3-B' },
    { t: 'Recency Guard', d: 'Human rep emailed last 7 days \u2192 SKIP. Sales never steps on an active thread.', r: 'SKIP' },
    { t: 'Email History Signal', d: 'Client replied with specific issue \u2192 T1 (A/B/C/D). General reply \u2192 T1-B. Sent, no reply \u2192 staleness.', r: 'T1-A \u2013 T1-D' },
    { t: 'Staleness: 7\u201330 days', d: 'Fresh proposal. Standard follow-up tone.', r: 'T2-A' },
    { t: 'Staleness: 30\u201390 days', d: 'Sitting for a while. More direct \u2014 "is this still moving?"', r: 'T2-B' },
    { t: 'Staleness: 90\u2013365 days', d: 'Long stale. Binary ask \u2014 "close out or move forward?"', r: 'T2-C' },
    { t: 'Staleness: 365+ days', d: 'Very stale. Three options: done, still needed, or close it out.', r: 'T4-D' },
    { t: 'No Email History', d: 'Cold contact. Verify right person first.', r: 'T3-A' }
  ];
  steps.forEach(function(s, i) {
    h += '<div class="lf-step" style="animation-delay:' + (i * 0.06) + 's">';
    h += '<div class="lf-rail"><div class="lf-dot">' + (i + 1) + '</div>';
    h += (i < steps.length - 1 ? '<div class="lf-line"></div>' : '') + '</div>';
    h += '<div class="lf-body"><div class="lf-title">' + s.t + '</div>';
    h += '<div class="lf-desc">' + s.d + '</div>';
    h += '<div class="lf-result">\u2192 ' + s.r + '</div></div>';
    h += '</div>';
  });

  // ── Outreach Sequence ──
  h += '<div class="ov-section-row ov-section-row-lg"><span class="ov-section-title">Outreach Sequence</span>';
  h += '<span class="ov-section-sub">PER CONTACT GROUP</span></div>';
  h += '<div class="seq">';
  var seq = [
    { day: 'D7', lbl: 'Call \u00d73', t: 'call', ic: '\u260E' },
    { day: 'D8', lbl: 'SMS', t: 'sms', ic: '\uD83D\uDCF1' },
    { day: 'D10', lbl: 'Call \u00d73', t: 'call', ic: '\u260E' },
    { day: 'D14', lbl: 'Email', t: 'email', ic: '\u2709' },
    { day: 'D18', lbl: 'SMS', t: 'sms', ic: '\uD83D\uDCF1' },
    { day: 'D21', lbl: 'Call \u00d73', t: 'call', ic: '\u260E' },
    { day: 'D30', lbl: 'SMS', t: 'sms', ic: '\uD83D\uDCF1' },
    { day: 'D44', lbl: 'Email', t: 'email', ic: '\u2709' },
    { day: 'D44+', lbl: 'STOP', t: 'stop', ic: '\u23F9' }
  ];
  seq.forEach(function(s) {
    h += '<div class="seq-s"><div class="seq-d ' + s.t + '">' + s.ic + '</div>';
    h += '<div class="seq-day">' + s.day + '</div>';
    h += '<div class="seq-lbl">' + s.lbl + '</div><div class="seq-ln"></div></div>';
  });
  h += '</div>';

  // ── Call Framework ──
  h += '<div class="ov-section-row"><span class="ov-section-title">Call Framework</span>';
  h += '<span class="ov-section-sub">EVERY CALL HAS 4 PARTS</span></div>';
  var parts = [
    { n: '1', nm: 'Anchor', d: 'Who you are, proposal number, property name. Within the first two sentences.' },
    { n: '2', nm: 'Context', d: 'One thing that shows you know their specific situation.' },
    { n: '3', nm: 'Question', d: 'One question that moves the deal forward.' },
    { n: '4', nm: 'Resolution', d: 'Leave with a yes, a date, a name, or a clear next step.' }
  ];
  parts.forEach(function(p, i) {
    h += '<div class="fw-part" style="animation-delay:' + (i * 0.1 + 0.1) + 's">';
    h += '<div class="fw-num">' + p.n + '</div>';
    h += '<div class="fw-text"><div class="fw-name">' + p.nm + '</div>';
    h += '<div class="fw-desc">' + p.d + '</div></div></div>';
  });

  wrap.innerHTML = h;
  buildOverviewToc();
  body.scrollTop = 0;
}

function countScripts(ch) {
  var md = rawTexts[ch];
  var m = md.match(/^### /gm);
  return m ? m.length : 0;
}

function goToBrowse(ch) {
  var tabs = document.querySelectorAll('.ftab');
  var keys = ['call', 'voicemail', 'sms', 'email'];
  tabs.forEach(function(t, i) { t.classList.toggle('on', keys[i] === ch); });
  currentFile = ch;
  switchMode('browse');
}

// ── OVERVIEW TOC ──
function buildOverviewToc() {
  var toc = document.getElementById('toc');
  toc.innerHTML = '';
  headingEls = [];
  var items = [
    { label: 'Channel Cards', sel: '.ov-grid' },
    { label: 'Script Selection Logic', sel: '.lf-step' },
    { label: 'Outreach Sequence', sel: '.seq' },
    { label: 'Call Framework', sel: '.fw-part' }
  ];
  items.forEach(function(it) {
    var item = document.createElement('div');
    item.className = 'toc-item h2';
    item.textContent = it.label;
    item.onclick = function() {
      document.querySelectorAll('.toc-item').forEach(function(t) { t.classList.remove('on'); });
      item.classList.add('on');
      var el = document.querySelector(it.sel);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    toc.appendChild(item);
  });
}
