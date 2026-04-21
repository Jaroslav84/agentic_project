# Sales AI Security Audit

**Date:** 2026-04-12
**Scope:** `/web/` — all HTML, JS, CSS, data files
**Method:** Static analysis (automated + manual review)

---

## Executive Summary

The web dashboard has **no server-side auth on `index.html`** — the gate is purely cosmetic client-side JS. All business data (`csv_data.js` with 3,390 proposals + PII) is served as static files accessible without authentication. The `lora-shell.html` variant has proper server-side session management and should be the **only entry point deployed**.

**Findings:** 3 Critical, 5 High, 8 Medium, 3 Low

---

## Risk Matrix

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | CRITICAL | Client-side-only auth on `index.html` — bypassable | KNOWN |
| 2 | CRITICAL | PII data files (`csv_data.js`) served as static assets | KNOWN |
| 3 | CRITICAL | SHA-256 hash of password embedded in JS — crackable | KNOWN |
| 4 | HIGH | FieldTECH API token hardcoded in `transfer-details.js` | FIXED |
| 5 | HIGH | No origin validation on any postMessage handler (5 handlers) | FIXED |
| 6 | HIGH | All postMessage sends use wildcard `'*'` target origin | FIXED |
| 7 | HIGH | No Content Security Policy (CSP) on index.html or tab pages | OPEN |
| 8 | HIGH | CDN scripts (Chart.js, Leaflet) loaded without SRI integrity | OPEN |
| 9 | MEDIUM | No clickjacking protection (X-Frame-Options / frame-ancestors) | OPEN |
| 10 | MEDIUM | URL `?token=` param exposes password in logs/history/referer | KNOWN |
| 11 | MEDIUM | innerHTML used with unescaped data from external sources | OPEN |
| 12 | MEDIUM | Markdown link URLs not validated (`javascript:` protocol XSS) | FIXED |
| 13 | MEDIUM | Google Fonts loaded from CDN (privacy leak, no SRI) | OPEN |
| 14 | MEDIUM | No session timeout / inactivity lock | OPEN |
| 15 | MEDIUM | No rate limiting on login attempts | OPEN |
| 16 | MEDIUM | HubSpot OAuth client_id + App ID exposed in `cc_status.html` | INFO |
| 17 | LOW | `norwester.otf` is a GitHub HTML page, not a font file | OPEN |
| 18 | LOW | `proplink.js` external links lack `rel="noopener noreferrer"` | FIXED |
| 19 | LOW | Title attributes missing full HTML entity escaping | OPEN |

---

## Detailed Findings

### CRITICAL-1: Client-Side-Only Auth (index.html)

**Files:** `js/index-gate.js:6,40,68` | `index.html`

The `index.html` login gate compares a SHA-256 hash entirely in the browser. No server request is made. An attacker can:
- Call `launchApp()` from browser console
- Set `sessionStorage.setItem('lora_auth', '<hash>')` and reload
- Navigate directly to any iframe URL (`tab_overview.html`, `tab_browser.html`)

**Contrast:** `lora-shell.html` correctly calls `createServerSession()` which POSTs to `/chat/elevated/session` and sets an HttpOnly cookie. **Only `lora-shell.html` should be deployed.**

**Remediation:** Remove `index.html` from production deployment. Ensure web server requires auth for all `/lora/` static files.

---

### CRITICAL-2: PII Data Served as Static JS

**Files:** `csv_data.js` (2.4 MB), `scripts_data.js`

`csv_data.js` contains 3,390 real proposals with: client names, contact names, phone numbers, email addresses, physical locations, proposal values, HubSpot IDs. Served as a plain `.js` file — no auth required to fetch it directly.

**Remediation:** Serve data behind authenticated API endpoints. Never embed PII in static JS files. At minimum, configure web server to require the same auth cookie for all `.js` data files.

---

### CRITICAL-3: Password Hash Embedded in Client JS

**Files:** `js/index-gate.js:6` | `lora-shell.html:186`

```
KEY_HASH = '[REDACTED — SHA-256 HASH]'
```

This is the plain SHA-256 of `[REDACTED — PLAINTEXT PASSWORD]` (verified). SHA-256 without salt is trivially crackable via rainbow tables. Anyone who views page source can recover the password.

**Remediation:** Move hash comparison server-side. Use bcrypt/PBKDF2 with salt. The hash should never appear in client code.

---

### HIGH-4: API Token Hardcoded

**File:** `js/transfer-details.js:23`

```javascript
['Token','[REDACTED — API TOKEN]']
```

A FieldTECH API token is embedded as tooltip display data.

**Remediation:** Remove the token value. Replace with `[REDACTED]` or `***` in display data.

---

### HIGH-5: No postMessage Origin Validation

**All 5 handlers accept messages from ANY origin:**

| File | Line | Actions Handled |
|------|------|----------------|
| `js/index-app.js` | 138 | `openBrowser`, `openLists` |
| `lora-shell.html` | 551 | `openBrowser`, `openLists` |
| `js/slides.js` | 92 | `goto`, `next`, `prev`, `fullscreen` |
| `js/lists.js` | 175 | `loadFile` |
| `js/browser.js` | 132 | `filter` |

**Remediation:** Add `if (e.origin !== window.location.origin) return;` to every handler.

---

### HIGH-6: postMessage Sends Use Wildcard Origin

**8 locations send with `'*'`:**

| File | Line |
|------|------|
| `js/index-app.js` | 114, 151, 166 |
| `lora-shell.html` | 539, 564, 578 |
| `js/intel.js` | 5, 9 |

**Remediation:** Replace `'*'` with `window.location.origin`.

---

### HIGH-7: No Content Security Policy

No CSP meta tag or header on `index.html` or any tab page. `lora-shell.html` has nonce placeholders (`__CSP_NONCE__`) but no meta fallback.

**Remediation:** Add server-side CSP headers. Minimum policy:
```
default-src 'self'; script-src 'self' 'nonce-{N}' https://cdnjs.cloudflare.com https://unpkg.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
frame-ancestors 'self'; connect-src 'self' https://fonts.googleapis.com;
```

---

### HIGH-8: CDN Scripts Without SRI

**6 pages load Chart.js from cdnjs without integrity hash. 1 page loads Leaflet from unpkg without integrity hash.**

| CDN Resource | Files |
|-------------|-------|
| `Chart.js 4.4.1` (cdnjs) | tab_clients, tab_contacts, tab_reps, tab_pipeline, tab_overview, tab_intro |
| `Leaflet 1.9.4` (unpkg) | cc_dashboard |

**Remediation:** Add `integrity="sha384-..."` and `crossorigin="anonymous"` to all CDN script/link tags. Or self-host.

---

### MEDIUM-9 through MEDIUM-16

| # | Finding | File(s) | Fix |
|---|---------|---------|-----|
| 9 | No clickjacking protection | All HTML | Server: `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'` |
| 10 | URL `?token=` leaks password | `index-gate.js:66`, `lora-shell.html:218` | Use opaque single-use server tokens instead |
| 11 | innerHTML with unescaped data | `browser.js:122,129`, `lists.js:109,118` | Add `escapeHtml()` to all data values |
| 12 | Markdown `javascript:` URL XSS | `scripts-md.js:14` | Validate URL protocol (http/https/mailto only) |
| 13 | Google Fonts CDN (privacy) | All 34 HTML files | Self-host fonts (WOFF2) |
| 14 | No session timeout | `index-gate.js`, `lora-shell.html` | Add 30-min inactivity auto-lock |
| 15 | No login rate limiting | Both gate implementations | Server-side: 5 attempts/min/IP |
| 16 | HubSpot IDs exposed | `cc_status.html:365` | Low risk — informational only |

---

### LOW-17 through LOW-19

| # | Finding | File | Fix |
|---|---------|------|-----|
| 17 | `norwester.otf` is GitHub HTML, not a font | `web/norwester.otf` | Replace with actual font binary |
| 18 | External links lack `noopener` | `proplink.js` | Add `rel="noopener noreferrer"` |
| 19 | Incomplete HTML escaping in title attrs | `browser.js`, `lists.js` | Escape `<`, `>`, `&` in title attributes |

---

## Positive Findings

- Zero `console.log` / `console.debug` statements in codebase
- Zero `eval()` or `document.write()` usage
- Markdown renderer properly escapes content via `esc()` function
- `lora-shell.html` has proper server-side auth architecture
- URL token is stripped via `history.replaceState()` after use
- `env.js` now deployed — suppresses all console output in production

---

## Remediation Implemented This Session

| # | Action | Status |
|---|--------|--------|
| A | Created `js/env.js` — production console suppression | DONE |
| B | Added `env.js` to all 34 HTML files as first script | DONE |
| C | Production detection: `[REDACTED — PROD HOSTNAME]` = prod, else = local | DONE |
| D | `Lora.log()` / `Lora.warn()` / `Lora.debug()` API available | DONE |
| E | `console.error` preserved in prod (critical errors only) | DONE |
| F | Redacted FieldTECH API token in `transfer-details.js` | DONE |
| G | Added `e.origin` validation to all 5 postMessage handlers | DONE |
| H | Replaced all wildcard `'*'` postMessage targets with `window.location.origin` | DONE |
| I | Fixed markdown XSS — URL protocol validation (http/https/mailto only) | DONE |
| J | Added `rel="noopener noreferrer"` to proplink.js external links | DONE |

---

## Recommended Priority Actions

1. **DEPLOY ONLY `lora-shell.html`** — never serve `index.html` in production
2. **Server-side auth for static files** — `csv_data.js` must require auth cookie
3. **Remove API token** from `transfer-details.js:23`
4. **Add postMessage origin checks** to all 5 handlers
5. **Add SRI hashes** to Chart.js and Leaflet CDN tags
6. **Add CSP headers** server-side
7. **Fix `norwester.otf`** — replace with actual font file

---

## Audit Metadata

- **Scanner:** Claude Opus 4.6 static analysis
- **Files examined:** 34 HTML, 60+ JS, 2 CSS, 1 .env, data files
- **Lines of code scanned:** ~15,000+
- **Next audit recommended:** Before production deployment
