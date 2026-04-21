# How to fill out `02-TEMPLATE-SPECIFICATION_OMG_v1.0.md`

A guided walkthrough for producing an OMG-UML-2.5.1-style software
specification from the template. Read end to end once; then iterate.

## 0. Before you start

- Copy the template to a project-specific name, e.g.
  `specs/SPECIFICATION_{{PROJECT_SLUG}}_v0.1.0.md`. Keep the unnumbered
  template pristine so future projects can reuse it.
- Read the five reference files in `docs/uml/`. Do not memorize them —
  just know what's there so you can consult them while writing:
  - [OMG_UML_2.5.1_STRUCTURE.md](../docs/uml/OMG_UML_2.5.1_STRUCTURE.md) — why the front matter is six clauses
  - [OMG_SPEC_CONVENTIONS.md](../docs/uml/OMG_SPEC_CONVENTIONS.md) — normative vs informative, conformance points
  - [UML_DIAGRAMS.md](../docs/uml/UML_DIAGRAMS.md) — which of the 14 diagrams to use where
  - [IEEE_1016_SDD.md](../docs/uml/IEEE_1016_SDD.md) — the 12 design viewpoints
  - [KRUCHTEN_4_PLUS_1.md](../docs/uml/KRUCHTEN_4_PLUS_1.md) — the 4+1 view model
- Set the metadata table at the top: title, version (semver), status, date,
  authors, license.

## 1. Write the Front Matter FIRST

Clauses 1–6 are not window dressing. If you can't answer them, you can't
write the rest honestly.

### Clause 1 — Scope
One paragraph. What the system **is**. What this document **covers**.
End with an explicit "does NOT cover" sentence. If the out-of-scope list
is longer than the in-scope list, your scope is too vague.

### Clause 2 — Conformance
These are the *promises* the implementation must keep. Numbered so that
tests, reviews, and downstream specs can cite them (e.g., "See 2.3").
Use **shall** for binding promises.

Good: `2.1 API Conformance — Every endpoint shall accept JSON with
Content-Type: application/json and respond with a 2xx/4xx/5xx code.`

Bad: `2.1 The API should be well-designed.`

### Clause 3 — Normative References
Only list standards whose text is **binding** when you cite them. RFC 7231,
JSON Schema Draft 2020-12, OpenAPI 3.1, etc. Background reading goes in
Annex D, not here.

### Clause 4 — Terms and Definitions
A term defined here **overrides** its common English meaning inside this
document. Define anything that two readers could interpret differently
("session", "user", "resource", "job").

### Clause 5 — Symbols and Abbreviated Terms
Acronyms. Table with two columns: symbol, expansion. Boring but saves
readers Google-ing `TPS` three times.

### Clause 6 — Additional Information
Change log (dated, authored, versioned). Acknowledgements. IP/licensing.
Keep the change log append-only — never rewrite history.

## 2. Draft the architecture (Clause 7)

Use Kruchten 4+1. Every view answers a different stakeholder's question.
You do NOT need every diagram in every view — pick from
[UML_DIAGRAMS.md](../docs/uml/UML_DIAGRAMS.md):

| View | Audience | Default diagrams |
|------|----------|------------------|
| 7.1 Logical | end users, analysts | class, object, state-machine |
| 7.2 Process | integrators | activity, sequence |
| 7.3 Development | programmers | package, component |
| 7.4 Physical | ops/SRE | deployment |
| 7.5 Scenarios | everyone | 2–3 use-case sequences |

Rule of thumb: **one diagram per page, max**. If you need three diagrams
to explain one thing, the thing is too big — decompose it first.

## 3. Drill into viewpoints (Clause 8)

IEEE 1016 defines 12 design viewpoints. The template ships 7 common ones
(context, composition, interface, information, interaction, state
dynamics, resource). **Delete the ones that don't apply** and note the
deletion in § 6.1.

Do not hand-wave. If Clause 8.3 (Interface) says "see Annex B", Annex B
MUST contain the contract. Empty annexes are worse than missing sections.

## 4. Numbered requirements (Clause 9)

- **FR-###** for functional, **NFR-###** for non-functional.
- Use RFC 2119 keywords: `MUST / SHALL / SHOULD / MAY`. Never "will" or
  "needs to" — they are ambiguous.
- Each requirement must be testable. `NFR-001: fast` is not testable.
  `NFR-001: P99 ≤ 200ms at 1000 rps` is.
- Requirements refer **back to** conformance clauses (2.x), not forward.

## 5. Use cases (Clause 10)

One per actor goal. Follow the template structure: actor, preconditions,
main flow, alternatives, postconditions. Keep the main flow under 10
steps; if it's longer, split into sub-use-cases.

Link each use case to at least one entry in Annex D (worked examples).

## 6. Open issues and risks (Clause 11)

Actually fill this in. A spec with no open issues is a spec that hasn't
been read critically yet. Distinguish **open issues** (design questions
you haven't answered) from **risks** (things that might go wrong).

## 7. Annexes

- **Annex A (normative) — Data model** — ER or class diagram with
  cardinality. If a field can be NULL, state it.
- **Annex B (normative) — Interface contracts** — OpenAPI/protobuf.
  Inline the authoritative excerpt or link a versioned file.
- **Annex C (informative) — Diagrams** — PlantUML / Mermaid sources so
  they regenerate. No screenshotted drawings.
- **Annex D (informative) — Worked examples** — end-to-end flows with
  real inputs and outputs. Should match your use cases.

`normative` = binding. `informative` = illustrative only.

## 8. Quality checklist before marking the spec "ADOPTED"

- [ ] Every section from the template is present or explicitly removed
      (with a note in § 6.1).
- [ ] Every "shall" in the body maps to a conformance point in § 2.
- [ ] Every conformance point is testable.
- [ ] Every requirement has an ID.
- [ ] Every use case is exercised by at least one worked example in Annex D.
- [ ] Every diagram has a source (PlantUML/Mermaid), not just an image.
- [ ] Every term used twice or more is defined in § 4.
- [ ] Change log is up to date.
- [ ] Two people other than the author have reviewed the spec.

## 9. Common mistakes

- **Mixing scope with solution.** § 1 says *what*, not *how*. Architecture
  goes in § 7.
- **"Should" sprinkled everywhere.** Every "should" in the spec is a
  future argument with a reviewer. Use "shall" when you mean shall.
- **Empty annexes.** If Annex A exists, it MUST define the data model.
  Don't leave "TBD".
- **Untracked deletions.** If you remove a section from the template,
  say so in § 6.1. Silent deletions break downstream cross-references.
- **Screenshotted diagrams.** They rot. Use PlantUML or Mermaid sources.
- **Domain bleed into terms.** § 4 is for terms specific to *this* spec.
  Don't redefine "HTTP" or "JSON".

## 10. Versioning and lifecycle

- Start at `0.1.0` (pre-release). Status: `DRAFT`.
- First review-ready version → `0.9.0`. Status: `REVIEW`.
- Approved → `1.0.0`. Status: `ADOPTED`.
- Breaking changes bump major. Additive changes bump minor. Editorial
  fixes bump patch. Record every bump in § 6.1.

## See also

- `docs/uml/` — source conventions (OMG, IEEE 1016, Kruchten)
- `specs/02-TEMPLATE-SPECIFICATION_OMG_v1.0.md` — the template to fill
