# Stages & Exit Criteria

The project walks a one-way pipeline. Each stage has **exit criteria** — you don't advance until every box is checked. `CLAUDE.md` says *don't hurry*. This file is how you know you didn't.

```
Plan → Spec → Design → Implementation → Testing → Release → Maintenance
```

Approvers for each gate live in [05-ROLES.md](05-ROLES.md).

---

## 1. Plan — `plan/`

**Goal:** decide whether the idea is worth building.

**Exit criteria**
- [ ] `01-IDEA.md` is filled in (not a stub)
- [ ] `02-RESEARCH.md` has at least one real data point and one named competitor
- [ ] `03-MISSION.md` lists 1–3 concrete missions
- [ ] `07-DECISIONS.md` has the locked decisions that the spec will depend on
- [ ] `08-BUSINESS_PLAN.md` answers "how does this survive?"
- [ ] Top-3 risks captured in [09-RISKS.md](09-RISKS.md)

---

## 2. Spec — `specs/`

**Goal:** write down exactly what is being built, at a level the next stage can argue with.

**Exit criteria**
- [ ] `01-SPECIFICATION_v1.0.md` replaces every placeholder
- [ ] Functional requirements numbered (FR-001…)
- [ ] Non-functional requirements numbered (NFR-001…)
- [ ] Use cases cover the top-3 user flows
- [ ] Terms used in the spec exist in [10-GLOSSARY.md](10-GLOSSARY.md)
- [ ] Open questions moved from the spec into [09-RISKS.md](09-RISKS.md) or resolved

---

## 3. Design — `specs/05-DESIGN_v1.0.md`

**Goal:** turn the spec into a system you can start coding from.

**Exit criteria**
- [ ] `specs/05-DESIGN_v1.0.md` covers logical, process, development, physical views
- [ ] Data model defined (Annex A of spec) — ERD or class schema
- [ ] Interface contracts defined (Annex B) — OpenAPI / protobuf / equivalent
- [ ] UI artifacts in [`../dashboard/`](../dashboard/) match the spec's use cases
- [ ] Every non-trivial architectural choice has an ADR in [`../docs/adr/`](../docs/adr/)
- [ ] No open questions above medium severity

---

## 4. Implementation — `src/`

**Goal:** build it.

**Exit criteria**
- [ ] All FR-* from the spec have code
- [ ] Lint passes (use the matching linter under `scripts/linters/`, if any)
- [ ] Unit tests exist for every module
- [ ] README / runbook exists for the service

---

## 5. Testing

**Goal:** prove it does what the spec says.

**Exit criteria**
- [ ] Every use case from the spec has an end-to-end test
- [ ] NFRs verified (performance / security / reliability)
- [ ] Known-issues list empty (or each item has an owner)

---

## 6. Release

**Goal:** ship.

**Exit criteria**
- [ ] `CHANGELOG.md` updated
- [ ] Deployment runbook rehearsed at least once
- [ ] Monitoring + alerts live
- [ ] Rollback plan documented

---

## 7. Maintenance

**Goal:** keep it alive without letting it rot.

**Ongoing duties**
- [ ] 09-RISKS.md reviewed monthly
- [ ] ADRs written for any post-release architectural changes
- [ ] Spec + design kept in sync with reality (or marked `legacy`)
