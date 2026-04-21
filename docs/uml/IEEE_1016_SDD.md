# IEEE 1016-2009 — Software Design Descriptions

Top-level structure of the IEEE standard for Software Design Descriptions
(SDD). IEEE 1016-2009 is the current revision (supersedes IEEE 1016-1998).

## Sources

- IEEE catalog entry (paywalled): https://standards.ieee.org/ieee/1016/4502/
- IEEE Xplore record: https://ieeexplore.ieee.org/document/5167255
- Wikipedia article: https://en.wikipedia.org/wiki/Software_design_description
- Cankaya University public mirror of the PDF (used for TOC extraction):
  https://cengproject.cankaya.edu.tr/wp-content/uploads/sites/10/2017/12/SDD-ieee-1016-2009.pdf
- Earlier 1016-1998 for comparison:
  https://people.eecs.ku.edu/~saiedian/Teaching/Stds/1016.pdf

## What the standard does

IEEE 1016-2009 defines the *required information content* and *organization*
of a Software Design Description. It is explicitly method-agnostic: it does
not mandate a design methodology, a modeling language, or a tooling choice.
It tells you **what must be in an SDD**, not **how to design the software**.
It applies equally to forward engineering, reverse engineering, and to any
size/domain of system.

## Top-level clause structure

1. **Scope** — What the standard covers and the kinds of design situations it
   applies to (commercial, scientific, military; forward and reverse
   engineering).
2. **Normative references** — Referenced standards whose text is binding when
   cited.
3. **Definitions and abbreviated terms** — SDD-specific vocabulary (design
   view, viewpoint, concern, rationale, stakeholder, etc.).
4. **Conformance** — An SDD conforms to 1016-2009 if it satisfies all
   requirements in Clauses 4 and 5 (that is, Conformance + Conceptual model).
5. **Conceptual model for software design descriptions** — The meta-model:
   stakeholders have *concerns*, which are addressed by *design views*,
   each produced from a *design viewpoint*. Establishes the vocabulary of
   views/viewpoints used by the rest of the standard.
6. **Design description information content** — The identifying and
   bookkeeping information every SDD must carry (identification, issuing
   organization, date, authorship, version, change history, summary,
   references, glossary, body).
7. **Design viewpoints** — Defines twelve standard viewpoints, each a
   "lens" onto the design:
   - **Context viewpoint** — boundaries, external actors, interfaces with the
     outside world.
   - **Composition viewpoint** — decomposition of the system into smaller
     modules / subsystems.
   - **Logical viewpoint** — abstract classes, types, and their static
     relationships.
   - **Dependency viewpoint** — inter-module dependencies, coupling, sharing.
   - **Information viewpoint** — persistent data structures, schemas,
     information flow.
   - **Patterns use viewpoint** — design patterns and framework reuse.
   - **Interface viewpoint** — services and APIs each module exposes.
   - **Structure viewpoint** — internal structure of each component.
   - **Interaction viewpoint** — message sequences between components.
   - **State dynamics viewpoint** — state-machine behavior of reactive
     components.
   - **Algorithm viewpoint** — detailed procedural logic.
   - **Resource viewpoint** — memory, threads, connections, and other scarce
     runtime resources.
   Users may also define **custom viewpoints** beyond these twelve.
8. **Design description instantiation** — How to assemble the chosen
   viewpoints into a concrete SDD document for a specific project, and how
   tailoring works.

## Annexes

- **Annex A (normative) — Conforming design description languages** —
  requirements a description language (textual, graphical, tabular) must
  meet to be used in a 1016-conformant SDD.
- **Annex B (informative) — Conforming design language description** —
  worked-example annotations of how common languages (e.g. UML) satisfy
  Annex A.
- **Annex C (informative) — Templates for an SDD** — example document
  outlines you can adapt for real projects.

## Relationship to UML and to OMG specs

1016-2009 is **orthogonal** to UML. UML provides the *notation*; 1016 provides
the *document structure and viewpoint catalog*. A typical real-world SDD uses
UML diagrams inside the viewpoint clauses defined by 1016.

## Takeaways for a project spec template

- The twelve viewpoints of clause 7 are a ready-made checklist for the
  "architecture views" section of any project spec.
- 1016's insistence on *identification / version / change history / glossary*
  in clause 6 maps onto OMG's "Additional Information" front-matter clause.
- The **concern → viewpoint → view** triad is a cleaner framing than raw
  UML diagram types for organizing architecture content.
