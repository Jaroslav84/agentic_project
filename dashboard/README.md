# Sales AI — Planning Controller

**This is a planning tool.** `dashboard/` is a static browser UI for specifying, designing, costing, and managing a project **before a single line of implementation is written**. No backend, no build step, no real data — every page is a thought artifact.

> If you're looking for the running product, look elsewhere. This is the whiteboard.

---

## What's Here

The controller is a single static site with a login gate and an iframe-based tab shell. Each tab is a self-contained HTML page that either renders a diagram, a data table, a slide deck, or a markdown-like document.

| Tab | Purpose |
|---|---|
| **Presentation** | Investor / stakeholder slide deck. Versioned (v1.0 today). |
| **Analytics** | Pipeline overview, rep analysis, client intelligence, intel digest. Fake data. |
| **Design** | Product flows: architecture, domain model, user flows, state machines, match engine, data schema, network, API map, deployment, processes. |
| **Architecture** | System-level C4-ish node graph + live diagrams (network, pipecat, stateflow, callflow, sequence, transfer, TTS/STT, script select). |
| **Project** | TODO kanban · GANTT · **COST EST** (live running-cost estimator) · **Docs** (README template) · **Changelog**. |
| **Lists** | Sales people · VIP lists · blacklists. All fake. |
| **Scripts** | Call / voicemail / SMS / email templates, T1–T4 tiers. |
| **Data** | Reference tables — certs, providers, licenses, apprenticeships, schools, jobs, salary, demand, employers, industries. |
| **C&C** | Mock command & control — workers, queue, recordings, metrics, logs, chat, debt. |
| **Changelog** | Running log of what's been built into this controller. |

---

## Why This Exists

Because if you ship before you've thought through the architecture, the data model, the call flow, the commission rules, the cost structure, the warm-transfer edge cases, the worker lifecycle, the script tiers, the VIP protections, and the opt-out handling — **you will rebuild it three times.**

This UI forces every one of those decisions onto a page that can be reviewed, argued over, and iterated *before* code exists. Each tab is one slice of the spec made visual.

Priority order:

1. **Spec first.** Write what it should do. Every tab here is a specification artifact.
2. **Design second.** Architecture, flows, state machines, schemas. Argue here until the diagrams stop moving.
3. **Cost third.** The COST EST tab surfaces monthly running cost at a given call volume — decide if the business case survives before building.
4. **Only then, implement.** When you move to code, this controller becomes the reference, not the product.

---

## Run Locally

Static HTML with iframes between same-origin pages — `file://` will fail on the iframe security model. Serve it over HTTP:

```sh
cd dashboard
python3 -m http.server 8000
# open http://localhost:8000/
```

Login accepts any non-empty password in demo mode. No backend is called.

---

## Repo Layout

```
dashboard/
  index.htm           login gate + app shell (topbar, tabs, iframe host)
  slides.html         presentation deck
  tab_*.html          primary-tab content pages
  graph_*.html        architecture / flow diagrams
  cc/                 C&C sub-views (queue, metrics, logs, ...)
  design/             Design-tab diagrams (architecture, domain, ...)
  data/               fake CSV/JSON data (csv_data.js, todo-data.js, ...)
  js/                 shared controller JS (env, gate, app shell, widgets)
  css/                shared CSS + Norwester font
  img/                icons & badges
  .env.example        demo env template
  README.md           this file
```

---

## Conventions

- **No real data, ever.** Every name, company, phone, and email in the Lists/Analytics/Data tabs is synthetic. If you find something that looks real, flag it.
- **Sales AI · SalesClaw · FieldTECH · Pinnacle Services.** These are the canonical names for, respectively: the AI caller, the scheduler daemon, the external CRM stand-in, and the house sales brand. Keep them consistent across every tab and document.
- **Purple accent only** (`#9f00fa`, `#d36eff`). Don't bleed in orange from imported reference material.
- **SPEC v1.0** is the current frozen spec. Bump on material architecture change only.
- **One page, one concern.** If a tab starts trying to do two things, split it.
- **Fake but plausible.** The 30-row fake proposal list, the $37.5M pipeline, the 1,357-proposal count — all synthetic, but sized to match a real maintenance business. Don't invent numbers that break the model (e.g. 10M calls/day).

---

## When to Edit What

| Change | File(s) |
|---|---|
| Add a primary tab | [js/index-html.js](js/index-html.js) (tabs + sec-panel + iframe) and [js/index-app.js](js/index-app.js) (`_frameSrc` map + `switchPrimary`/`showFrame` handlers) |
| Add a sub-tab under an existing primary | Same files — just extend the relevant `sec-*` block and map |
| Add a Design diagram | Drop a new `design/graph_*.html` and wire it in the two files above |
| Add a C&C sub-page | Drop into `cc/` and wire in `tab_cc.html` + `js/index-app.js` |
| Tune the cost model | [tab_cost_est.html](tab_cost_est.html) — `FIXED` / `VAR` arrays near the bottom |
| Add a changelog entry | [tab_changelog.html](tab_changelog.html) — prepend a new `<div class="entry">` block |
| Swap fake Lists data | [data/csv_data.js](data/csv_data.js) — keep the schema, replace the rows |

---

## What This Is Not

- Not a product. There's no server, no DB, no auth.
- Not a prototype. Nothing here runs a real call.
- Not a design system. It's a planning surface. Reuse styles when it's cheap, copy-paste when it's cheaper.
- Not a source of truth for running costs, headcount, or pipeline value. Those belong in vendor quotes and live SQL.

It's a whiteboard that happens to be a static site. Use it to argue, decide, and document — then go build the real thing somewhere else.
