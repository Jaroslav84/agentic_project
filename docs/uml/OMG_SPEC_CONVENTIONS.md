# OMG Specification Authoring Conventions

How the Object Management Group structures its formal specifications. These
conventions apply to UML, SysML, MOF, CORBA, BPMN, DMN, and every other OMG
standard.

## Sources

- OMG Policies and Procedures landing: https://www.omg.org/policies/p-and-p.htm
  (members-only document; public page confirms its existence as
  `pp/25-10-01` v4.0)
- OMG Specifications Catalog: https://www.omg.org/spec/
- OMG Terms and Acronyms: https://www.omg.org/gettingstarted/terms_and_acronyms.htm
- PTC (Platform Technology Committee) overview: https://www.omg.org/about/ptc.htm
- Example of conventions in the wild: https://www.omg.org/spec/SysML/2.0/Beta2/About-SysML
- Open Group standards-authoring guidance (closely mirrors OMG style):
  https://pubs.opengroup.org/standards-guide/handbook-publications-development/latest/chap03-intro.html

The full P&P (Policies and Procedures of the OMG Technical Process v4.0) is
OMG-member-only; the conventions below are observable in the published specs
themselves and in OMG's public terms glossary.

## Mandatory front-matter clauses

Every OMG specification opens with six numbered clauses in a fixed order:

1. **Scope** — a single short clause stating the subject of the spec and its
   boundaries (what's covered, what's explicitly *not* covered).
2. **Conformance** — defines what it means to claim compliance. Usually lists
   **compliance points** (discrete features a tool must implement) and, for
   large specs, **compliance levels** (nested subsets, e.g. Level 0 / 1 / 2 /
   3). A tool may only claim conformance if it matches *all* points in the
   level it claims.
3. **Normative References** — list of other documents whose provisions are
   incorporated by reference. Everything listed here is binding. Includes
   undated references (always latest) and dated references (locked).
4. **Terms and Definitions** — vocabulary glossary used throughout the spec.
   Terms defined here override their common English meaning when used inside
   the document.
5. **Symbols** (often "Symbols and abbreviated terms") — acronyms and symbols
   used in the spec.
6. **Additional Information** — a catch-all for *informative* front matter:
   change log / change bars relative to prior revision, acknowledgements,
   IP/licensing notices, known issues.

Clauses 7 onward are the **technical body** and are spec-specific.

## Normative vs informative

- **Normative** = required for conformance. Uses "**shall**" for mandatory
  requirements and "**shall not**" for prohibitions.
- **Informative** = explanatory only, not required for conformance. Uses
  "**should**", "**may**", "**can**", or plain prose.
- Non-normative content must be **clearly separated** — either physically (a
  dedicated informative clause or annex) or typographically (a shaded box,
  italic note, or "NOTE —" lead-in).
- Each annex is explicitly labelled `(normative)` or `(informative)` in its
  heading, e.g. *Annex A (normative) Diagrams*.

## Conformance levels and compliance points

- A **compliance point** is one discrete, testable capability the spec calls
  out. A tool either implements it or it doesn't.
- A **compliance level** groups compliance points into a named tier. Lower
  levels are subsets of higher levels. Example from UML: `L1 ⊂ L2 ⊂ L3`.
- A vendor claiming "compliant with level N" must implement *all* points in
  levels 1..N. Partial implementations may only claim "based on" the spec.
- Conformance is **claim-based**, not audited — OMG does not certify tools
  itself; it just defines what a valid claim looks like.

## Document numbering and status

OMG documents carry a document number of the form `<category>/<yy>-<mm>-<nn>`:

- `formal/` — final adopted specification (stable).
- `ptc/` — PTC-stage document, past adoption vote but not yet published as
  `formal/`.
- `dtc/` — DTC-stage (Domain Technology Committee) equivalent.
- `ad/` — Architecture Board–approved draft.
- `ab/`, `bmi/`, `mars/`, etc. — task-force working drafts.

Example: UML 2.5.1 is `formal/2017-12-05`.

## Metamodel-generated content

Specs based on a MOF metamodel (UML, SysML, CWM, …) have a **generated
documentation section per clause**. Each technical clause typically contains:

- **Summary** — prose introduction.
- **Abstract Syntax** — class diagram of the metamodel fragment.
- **Semantics** — prose rules.
- **Notation** — concrete-syntax rendering.
- **Examples** — non-normative.

Project-level specs don't need this structure, but the *Summary / Abstract
Syntax / Semantics / Notation / Examples* pattern is a useful sub-structure
inside architecture clauses.

## Takeaways for a project-level spec template

- Keep the six-clause OMG front matter verbatim — it's a proven, battle-tested
  skeleton.
- Define your own compliance points in clause 2; skip compliance *levels*
  unless the project has obvious tiering.
- Mark every annex `(normative)` or `(informative)`.
- Use "shall / should / may" consistently inside any requirement.
- Put the change log in clause 6 (Additional Information), not in a floating
  "Revision History" section.
