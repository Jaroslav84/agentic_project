# Architecture Decision Records (ADRs)

One file per non-trivial architectural decision. Short, append-only, numbered.

## When to write one

Write an ADR when the decision is:
- hard to reverse (schema shape, auth model, sync vs async, cloud provider)
- contested (two or more defensible options were on the table)
- load-bearing for future work (people will ask "why did we pick this?" in 6 months)

Don't write an ADR for taste-level choices (lint rules, file naming). Those go in `CLAUDE.md` or a style guide.

## How it relates to `plan/05-DECISIONS.md`

- `plan/05-DECISIONS.md` — one-line decision ledger. Fast scan. "What did we pick?"
- `docs/adr/NNNN-*.md` — the reasoning behind each decision. Context, options, trade-offs, consequences.

Every row in `05-DECISIONS.md` that needs a "why" links to an ADR here.

## Format

Copy [`TEMPLATE.md`](TEMPLATE.md). Name the file `NNNN-kebab-case-title.md` (e.g. `0001-use-postgres-for-primary-store.md`). Number monotonically — never renumber, never delete. Superseded ADRs get marked `Superseded by ADR-XXXX` and stay in place.

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| _(none yet)_ | | | |
