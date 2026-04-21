# Roles & Approvers

Who does what, and who signs off that a stage is done. Keep this page honest — if a name here isn't actually doing the work, fix the page.

## People

| Role | Name | Contact |
|------|------|---------|
| Product owner | _..._ | _..._ |
| Tech lead | _..._ | _..._ |
| Designer | _..._ | _..._ |
| On-call / ops | _..._ | _..._ |

## RACI

**R** = Responsible (does the work) · **A** = Accountable (signs off, only one) · **C** = Consulted · **I** = Informed

| Activity | Product | Tech lead | Design | Ops |
|---|---|---|---|---|
| `plan/` — idea through business plan | A/R | C | C | I |
| `specs/` — formal specification | A | R | C | C |
| `specs/05-DESIGN_v1.0.md` + `dashboard/` | C | A/R | R | C |
| `src/` — implementation | I | A/R | C | C |
| Testing & release | C | R | I | A |
| Production incidents | I | C | I | A/R |

## Stage-gate approvers

Who must sign off before moving to the next stage (see [04-STAGES.md](04-STAGES.md)).

| Gate | Approver(s) |
|------|-------------|
| Plan → Spec | Product owner |
| Spec → Design | Tech lead |
| Design → Implementation | Tech lead + Product owner |
| Implementation → Release | Tech lead + Ops |
