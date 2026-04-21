# docs/uml — OMG UML and Software-Design-Description Reference

Background notes used as raw material for the project's OOP / UML
specification template. These are *reference* documents: look things up
here rather than re-researching each time.

## Index

- **[OMG_UML_2.5.1_STRUCTURE.md](./OMG_UML_2.5.1_STRUCTURE.md)** — The table
  of contents of the OMG UML 2.5.1 formal specification: the six mandatory
  front-matter clauses, the body clauses for the metamodel topics, and the
  annex list.
- **[OMG_SPEC_CONVENTIONS.md](./OMG_SPEC_CONVENTIONS.md)** — How every OMG
  specification is authored: mandatory front matter, normative vs
  informative content, compliance points and compliance levels, "shall /
  should / may" language, document numbering.
- **[UML_DIAGRAMS.md](./UML_DIAGRAMS.md)** — The 14 UML 2.5 diagram kinds
  organized into Structural, core Behavioral, and the Interaction
  sub-family, with a one-line purpose for each.
- **[IEEE_1016_SDD.md](./IEEE_1016_SDD.md)** — IEEE 1016-2009 Software
  Design Descriptions: its eight-clause skeleton, its twelve standard
  design viewpoints, and its three annexes.
- **[KRUCHTEN_4_PLUS_1.md](./KRUCHTEN_4_PLUS_1.md)** — The Kruchten 4+1
  view model (Logical, Process, Development, Physical, + Scenarios) with
  stakeholder mapping and its relationship to IEEE 1471 and IEEE 1016.

## How to use these files

When filling out a project-level specification, combine:

1. **OMG front-matter skeleton** from `OMG_UML_2.5.1_STRUCTURE.md` and
   `OMG_SPEC_CONVENTIONS.md` — the six-clause header (Scope, Conformance,
   Normative References, Terms, Symbols, Additional Information).
2. **Kruchten 4+1 scaffolding** from `KRUCHTEN_4_PLUS_1.md` — the five
   top-level architecture sub-clauses.
3. **IEEE 1016 viewpoints** from `IEEE_1016_SDD.md` — a detailed checklist
   for each 4+1 view.
4. **UML diagram choice** from `UML_DIAGRAMS.md` — pick the right diagram
   kind per section.
