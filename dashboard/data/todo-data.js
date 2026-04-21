/* Todo board data — editable by Claude Code and loaded by cc_todo.html
   Web edits save to localStorage; Claude Code edits this file directly. */
var TODO_DATA = {
  "columns": ["backlog", "todo", "in-progress", "done", "released"],

  "people": {
    "alex":    {"name":"Alex Chen",        "role":"owner", "tier":5, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Alex+Alpha&hair=short01,short04,short07,short10,short14,short19"},
    "morgan":  {"name":"Morgan Ellis",     "role":"exec",  "tier":0, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Morgan+Exec&hair=short01,short04,short07,short10,short14,short19"},
    "sarah":   {"name":"Sarah Mitchell",   "role":"rep",   "paid":498000, "tier":3, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Sarah+Star&hair=long01,long05,long09,long13,long17,long21"},
    "marco":   {"name":"Marco Diaz",       "role":"rep",   "paid":365000, "tier":2, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Marco+Knight&hair=short01,short04,short07,short10,short14,short19"},
    "dan":     {"name":"Dan Harper",       "role":"rep",   "paid":32000,  "tier":1, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Dan+Scout&hair=short01,short04,short07,short10,short14,short19"},
    "ruben":   {"name":"Ruben Santos",     "role":"rep",   "paid":28000,  "tier":1, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Ruben+Ranger&hair=short01,short04,short07,short10,short14,short19"},
    "leah":    {"name":"Leah Baker",       "role":"rep",   "paid":0,      "tier":0, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Leah+New&hair=long01,long05,long09,long13,long17,long21"},
    "jenna":   {"name":"Jenna Martinez",   "role":"rep",   "paid":0,      "tier":0, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Jenna+Agent&hair=long01,long05,long09,long13,long17,long21"},
    "henry":   {"name":"Henry Jordan",     "role":"rep",   "paid":0,      "tier":0, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Henry+Guard&hair=short01,short04,short07,short10,short14,short19"},
    "stacy":   {"name":"Stacy Kim",        "role":"rep",   "paid":0,      "tier":0, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Stacy+Clerk&hair=long01,long05,long09,long13,long17,long21"},
    "amy":     {"name":"Amy Adams",        "role":"rep",   "paid":0,      "tier":0, "avatar":"https://api.dicebear.com/9.x/adventurer/svg?radius=50&seed=Amy+Base&hair=long01,long05,long09,long13,long17,long21"},
    "sales":   {"name":"Sales (AI)",       "role":"ai",    "tier":0, "avatar":"img/icons/icon-192.png"}
  },

  "tagColors": {"BLOCKER":"#ff4444","SPEC":"#4488ff","DESIGN":"#aa66ff","ACCOUNTS":"#ff8844","HUBSPOT":"#ff7a59","TELNYX":"#00c08b","INFRA":"#0080ff","VOICE":"#ff6f00","DATABASE":"#4169e1","MATRIX":"#888888","TESTING":"#44bb44","SCRIPTS":"#ccaa00"},

  "cards": [
    {"id":"design-1","col":"backlog","title":"DESIGN.md §1: Architecture Overview (C4)","tag":"DESIGN","owner":"alex","created":1712700000000},
    {"id":"spec-review","col":"todo","title":"Spec v1.0 final review","desc":"Alex to review all sections","tag":"SPEC","owner":"alex","created":1712700000000},
    {"id":"voice-e2e","col":"in-progress","title":"End-to-end turn latency","desc":"p50 <600ms, p95 <800ms on RunPod (Inworld). Kokoro: p50 <500ms.","tag":"VOICE","owner":"alex","created":1712700000000},
    {"id":"done-gpu","col":"done","title":"GPU card confirmed — RTX 4000 Ada RunPod","desc":"$0.26/hr, 20GB VRAM","tag":"INFRA","owner":"alex","created":1712700000000},
    {"id":"rel-spec","col":"released","title":"SPECIFICATION v1.0","desc":"Initial architecture + voice pipeline released","tag":"SPEC","owner":"alex","created":1712000000000}
  ],

  "ts": 1776200000000
};
