/* avatars.js — shared avatar system for all Sales AI pages
   Provides: AVATAR_PEOPLE, buildAvatar(), initAvatarHover() */

var _M='&hair=short01,short04,short07,short10,short14,short19';
var _F='&hair=long01,long05,long09,long13,long17,long21';
var _AB='https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=';
var AVATAR_PEOPLE = {
  alex:     {name:'Alex',             role:'owner', tier:5, avatar:_AB+'Alex+Alpha'+_M},
  morgan:    {name:'Morgan',            role:'exec',  tier:0, avatar:_AB+'Morgan+Exec'+_M},
  sarah:    {name:'Sarah Mitchell',     role:'rep',   paid:498000, tier:3, avatar:_AB+'Sarah+Star'+_F},
  marco:    {name:'Marco Diaz',  role:'rep',   paid:365000, tier:2, avatar:_AB+'Marco+Knight'+_M},
  dan:    {name:'Dan Harper',  role:'rep',   paid:32000,  tier:1, avatar:_AB+'Dan+Scout'+_M},
  ruben:  {name:'Ruben Santos',    role:'rep',   paid:28000,  tier:1, avatar:_AB+'Ruben+Ranger'+_M},
  leah:   {name:'Leah Baker',  role:'rep',   paid:0,      tier:0, avatar:_AB+'Leah+New'+_F},
  jenna: {name:'Jenna Martinez',   role:'rep',   paid:0,      tier:0, avatar:_AB+'Jennifer+Agent'+_F},
  henry:   {name:'Henry Jordan',    role:'rep',   paid:0,      tier:0, avatar:_AB+'Henry+Guard'+_M},
  stacy:    {name:'Stacy Kim',      role:'rep',   paid:0,      tier:0, avatar:_AB+'Stacy+Clerk'+_F},
  anne:     {name:'Amy Adams',   role:'rep',   paid:0,      tier:0, avatar:_AB+'Anne+Base'+_F},
  phil:     {name:'Sales (AI)',        role:'ai',    tier:0, avatar:'img/icons/icon-192.png'},
  /* departed / non-transfer-pool — still need avatars for tables */
  rachel:   {name:'Rachel Winters',   role:'gone',  paid:11887657, tier:0, avatar:_AB+'Rachel+Legacy'+_F},
  mike:     {name:'Mike Larson',      role:'gone',  paid:406181,   tier:0, avatar:_AB+'Mike+Old'+_M},
  andrea: {name:'Andrea Black',   role:'gone',  paid:5920898,  tier:0, avatar:_AB+'Andrea+Past'+_F},
  eric:     {name:'Edward Knox',      role:'gone',  paid:5681397,  tier:0, avatar:_AB+'Edward+Knox'+_M},
  victor:   {name:'Victor Greene',    role:'gone',  paid:894,      tier:0, avatar:_AB+'Victor+Ghost'+_M},
  nick:     {name:'Nick Ingram',      role:'gone',  paid:58971,    tier:0, avatar:_AB+'Nick+Gone'+_M},
  rena:     {name:'Rena Franklin',    role:'admin', paid:0,        tier:0, avatar:_AB+'Rena+Admin'+_F},
  philr:    {name:'Ray Collins',     role:'semi',  paid:810496,   tier:0, avatar:_AB+'Sales+Rog'+_M}
};

/* name → lookup ID (fuzzy match by first+last or first name) */
var _nameIndex = null;
function _buildNameIndex() {
  _nameIndex = {};
  Object.keys(AVATAR_PEOPLE).forEach(function(id) {
    var p = AVATAR_PEOPLE[id];
    _nameIndex[p.name.toLowerCase()] = id;
    var parts = p.name.split(' ');
    if (parts.length > 1) {
      /* "Marco Diaz" → also match "Marco R." */
      _nameIndex[(parts[0] + ' ' + parts[1].charAt(0) + '.').toLowerCase()] = id;
    }
    /* first name only as last resort */
    _nameIndex[parts[0].toLowerCase()] = _nameIndex[parts[0].toLowerCase()] || id;
  });
}

function findPersonId(name) {
  if (!name) return null;
  if (AVATAR_PEOPLE[name]) return name;
  if (!_nameIndex) _buildNameIndex();
  var n = name.toLowerCase().trim();
  if (_nameIndex[n]) return _nameIndex[n];
  /* partial match: try "Larson" etc */
  var keys = Object.keys(_nameIndex);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].indexOf(n) === 0 || n.indexOf(keys[i]) === 0) return _nameIndex[keys[i]];
  }
  /* last name match */
  for (var i = 0; i < keys.length; i++) {
    var parts = keys[i].split(' ');
    if (parts.length > 1 && n.indexOf(parts[1]) >= 0) return _nameIndex[keys[i]];
  }
  return null;
}

function _avatarNameHue(name) {
  var hash = 0;
  for (var i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

function _esc(s) {
  var d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}

/**
 * Build avatar HTML.
 * @param {string} id — person ID or full name
 * @param {number} size — pixel size (default 24)
 * @returns {string} HTML string
 */
function buildAvatar(id, size) {
  size = size || 24;
  /* resolve name to ID if needed */
  var resolvedId = AVATAR_PEOPLE[id] ? id : findPersonId(id);
  var p = resolvedId ? AVATAR_PEOPLE[resolvedId] : null;
  if (!p) return '';
  var words = p.name.replace(/[()]/g, '').split(' ');
  var initials = words.map(function(w) { return w[0]; }).join('').toUpperCase().substr(0, 2);
  var tier = p.tier || 0;
  var role = p.role || 'rep';
  var fs = Math.round(size * 0.38);

  var cls = 'avatar';
  if (role === 'owner') cls += ' av-admin';
  else if (role === 'ai') cls += ' av-ai';
  else if (role === 'exec') cls += ' av-exec';
  else if (role === 'gone') cls += ' av-disabled';
  else if (tier >= 3) cls += ' av-t3';
  else if (tier === 2) cls += ' av-t2';
  else if (tier === 1) cls += ' av-t1';
  else cls += ' av-t0';

  var avStyle = 'width:' + size + 'px;height:' + size + 'px;';
  if ((tier === 1 || tier === 2) && role === 'rep') {
    var h = _avatarNameHue(p.name);
    avStyle += '--av-c:hsl(' + h + ',60%,50%);';
  }

  var html = '<div class="' + cls + '" style="' + avStyle + '" title="' + _esc(p.name) + '" data-person="' + _esc(resolvedId) + '">';
  if (p.avatar) {
    html += '<img class="av-img" src="' + _esc(p.avatar) + '" alt="" onerror="this.style.display=\'none\'">';
  }
  html += '<span class="av-initials" style="font-size:' + fs + 'px">' + initials + '</span>';
  html += '</div>';
  return html;
}

/**
 * Initialize hover tooltip for all .avatar[data-person] elements.
 * Call after DOM is ready or after rendering.
 */
function initAvatarHover() {
  /* create tooltip element if not exists */
  var tt = document.getElementById('av-tooltip');
  if (!tt) {
    tt = document.createElement('div');
    tt.id = 'av-tooltip';
    document.body.appendChild(tt);
  }

  function show(el, e) {
    var id = el.getAttribute('data-person');
    var p = AVATAR_PEOPLE[id];
    if (!p) return;
    var words = p.name.replace(/[()]/g, '').split(' ');
    var initials = words.map(function(w) { return w[0]; }).join('').toUpperCase().substr(0, 2);

    /* tier label */
    var tierCls = 't0', tierLabel = 'BASE';
    if (p.role === 'owner') { tierCls = 'admin'; tierLabel = 'ADMIN'; }
    else if (p.role === 'ai') { tierCls = 'ai'; tierLabel = 'AI AGENT'; }
    else if (p.role === 'exec') { tierCls = 't0'; tierLabel = 'EXECUTIVE'; }
    else if (p.role === 'gone') { tierCls = 't0'; tierLabel = 'DEPARTED'; }
    else if (p.role === 'semi') { tierCls = 't0'; tierLabel = 'SEMI-RETIRED'; }
    else if (p.role === 'admin') { tierCls = 't0'; tierLabel = 'ADMIN'; }
    else if (p.tier >= 3) { tierCls = 't3'; tierLabel = 'STAR'; }
    else if (p.tier === 2) { tierCls = 't2'; tierLabel = 'VETERAN'; }
    else if (p.tier === 1) { tierCls = 't1'; tierLabel = 'ACTIVE'; }

    /* role display */
    var roleMap = { owner: 'Owner / CTO', exec: 'Executive', rep: 'Sales Rep', ai: 'AI Agent', gone: 'Departed', semi: 'Semi-Retired', admin: 'Admin' };
    var roleStr = roleMap[p.role] || p.role;

    /* big avatar ring class */
    var bigCls = 'avt-big';
    if (p.role === 'owner') bigCls += ' av-admin';
    else if (p.role === 'ai') bigCls += ' av-ai';
    else if (p.role === 'gone') bigCls += ' av-disabled';
    else if (p.tier >= 3) bigCls += ' av-t3';
    else if (p.tier === 2) bigCls += ' av-t2';
    else if (p.tier === 1) bigCls += ' av-t1';

    var html = '<div class="avt-top">';
    html += '<div class="' + bigCls + '">';
    if (p.avatar) html += '<img src="' + _esc(p.avatar) + '" alt="" onerror="this.style.display=\'none\'">';
    html += '<span class="avt-fallback">' + initials + '</span>';
    html += '</div>';
    html += '<div><div class="avt-name">' + _esc(p.name) + '</div><div class="avt-role">' + _esc(roleStr) + '</div></div>';
    html += '</div>';
    html += '<div class="avt-stats">';
    if (p.paid !== undefined && p.paid > 0) {
      html += '<div class="avt-row"><span class="k">Paid</span><span class="v g">$' + (p.paid / 1e3).toFixed(0) + 'k</span></div>';
    } else if (p.paid === 0 && p.role === 'rep') {
      html += '<div class="avt-row"><span class="k">Paid</span><span class="v">$0</span></div>';
    }
    html += '<div class="avt-row"><span class="k">Tier</span><span class="v"><span class="avt-tier ' + tierCls + '">' + tierLabel + '</span></span></div>';
    html += '</div>';

    tt.innerHTML = html;
    tt.classList.add('show');
    positionTooltip(tt, e);
  }

  function positionTooltip(tt, e) {
    var x = e.clientX + 14, y = e.clientY + 14;
    var w = tt.offsetWidth, h = tt.offsetHeight;
    var vw = window.innerWidth, vh = window.innerHeight;
    if (x + w > vw - 10) x = e.clientX - w - 10;
    if (y + h > vh - 10) y = e.clientY - h - 10;
    if (x < 4) x = 4;
    if (y < 4) y = 4;
    tt.style.left = x + 'px';
    tt.style.top = y + 'px';
  }

  function hide() { tt.classList.remove('show'); }

  /* delegate on document for dynamic content */
  document.addEventListener('mouseover', function(e) {
    var av = e.target.closest('.avatar[data-person], .rep-avatar[data-person], [data-person].person-card');
    if (av) show(av, e);
  });
  document.addEventListener('mousemove', function(e) {
    if (tt.classList.contains('show')) positionTooltip(tt, e);
  });
  document.addEventListener('mouseout', function(e) {
    var av = e.target.closest('.avatar[data-person], .rep-avatar[data-person], [data-person].person-card');
    if (av && !av.contains(e.relatedTarget)) hide();
  });
}

/* Auto-init when DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAvatarHover);
} else {
  initAvatarHover();
}
