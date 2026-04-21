/* ─────────────────────────────────────────────────────────
   scripts-md.js — Markdown → HTML renderer for tab_scripts
   Globals exposed: mdToHtml(src)
   ───────────────────────────────────────────────────────── */

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inl(s) {
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, text, url) {
    if (/^(https?:|mailto:|#)/.test(url)) return '<a href="' + url + '" class="md-link" rel="noopener noreferrer">' + text + '</a>';
    return text;
  });
  return s;
}

function mdToHtml(src) {
  var lines = src.split('\n');
  var out = '';
  var inUl = false, inOl = false, inTable = false, inBq = false;
  var hIdx = 0;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    // close open blocks
    if (inBq && !line.match(/^>/)) { out += '</blockquote>'; inBq = false; }
    if (inUl && !line.match(/^[\s]*[-*] /)) { out += '</ul>'; inUl = false; }
    if (inOl && !line.match(/^[\s]*\d+\. /)) { out += '</ol>'; inOl = false; }
    if (inTable && !line.match(/^\|/)) { out += '</tbody></table>'; inTable = false; }

    if (!line.trim()) continue;
    if (line.match(/^---+\s*$/)) { out += '<hr>'; continue; }

    var hm = line.match(/^(#{1,3}) (.+)/);
    if (hm) {
      var lvl = hm[1].length;
      out += '<h' + lvl + ' id="hd-' + hIdx + '">' + inl(esc(hm[2].trim())) + '</h' + lvl + '>';
      hIdx++; continue;
    }
    if (line.match(/^> /)) {
      if (!inBq) { out += '<blockquote>'; inBq = true; }
      out += '<p>' + inl(esc(line.replace(/^> ?/, ''))) + '</p>'; continue;
    }
    if (line.match(/^>$/)) {
      if (!inBq) { out += '<blockquote>'; inBq = true; }
      continue;
    }
    if (line.match(/^\|/)) {
      var cells = line.split('|').slice(1, -1);
      if (!cells.length) cells = line.split('|').filter(function(c) { return c.trim(); });
      if (cells.every(function(c) { return c.trim().match(/^[-:]+$/); })) continue;
      if (!inTable) {
        out += '<table><thead><tr>';
        cells.forEach(function(c) { out += '<th>' + inl(esc(c.trim())) + '</th>'; });
        out += '</tr></thead><tbody>'; inTable = true; continue;
      }
      out += '<tr>';
      cells.forEach(function(c) { out += '<td>' + inl(esc(c.trim())) + '</td>'; });
      out += '</tr>'; continue;
    }
    if (line.match(/^[\s]*[-*] /)) {
      if (!inUl) { out += '<ul>'; inUl = true; }
      out += '<li>' + inl(esc(line.replace(/^[\s]*[-*] /, ''))) + '</li>'; continue;
    }
    if (line.match(/^[\s]*\d+\. /)) {
      if (!inOl) { out += '<ol>'; inOl = true; }
      out += '<li>' + inl(esc(line.replace(/^[\s]*\d+\. /, ''))) + '</li>'; continue;
    }
    out += '<p>' + inl(esc(line)) + '</p>';
  }
  if (inBq) out += '</blockquote>';
  if (inUl) out += '</ul>';
  if (inOl) out += '</ol>';
  if (inTable) out += '</tbody></table>';
  return out;
}
