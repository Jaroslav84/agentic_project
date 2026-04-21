# OMG UML 2.5.1 — Specification Structure

Reference notes on the table of contents of the OMG Unified Modeling Language
specification, version 2.5.1 (formal document `formal/2017-12-05`, December 2017).

## Sources

- Landing page: https://www.omg.org/spec/UML/2.5.1/
- About page: https://www.omg.org/spec/UML/2.5.1/About-UML/
- PDF (large, ~18 MB): https://www.omg.org/spec/UML/2.5.1/PDF
- Document number: `formal/2017-12-05` (https://www.omg.org/cgi-bin/doc?formal/2017-12-05)
- Wikipedia (structure notes): https://en.wikipedia.org/wiki/Unified_Modeling_Language

Note: the live PDF could not be parsed during research (returned as raw binary
stream). The clause list below is reconstructed from the OMG landing pages, the
Wikipedia article, the "What's New in UML 2.5" training material, and
community references. Exact sub-clause numbering should be verified against a
local copy of the PDF before citing in formal work.

## Unification status (2.5 and later)

Before UML 2.5, the spec was published as four companion documents:
**Infrastructure**, **Superstructure**, **OCL**, and **Diagram Interchange**.
Since UML 2.5 the spec has been **unified into a single document** — there is
no longer a Part I / Part II split. OCL is published separately (OCL 2.4), and
Diagram Interchange is handled through a separate XMI file distributed
alongside the UML normative package.

## Top-level clause structure (OMG boilerplate front matter)

Every OMG spec — including UML 2.5.1 — opens with the same six-clause
front-matter skeleton required by OMG's Policies and Procedures:

1. **Scope** — what the specification covers and what it does not.
2. **Conformance** — the compliance points / compliance levels a tool or model
   must meet to claim conformance.
3. **Normative References** — other documents whose provisions are incorporated
   by reference (ISO standards, other OMG specs, etc.).
4. **Terms and Definitions** — vocabulary defined for use inside the spec.
5. **Symbols** — abbreviations and acronyms (often titled "Symbols and
   abbreviated terms").
6. **Additional Information** — change log relative to prior versions,
   acknowledgements, IP statements, etc.

## Body clauses (the technical content)

UML 2.5.1's body clauses correspond roughly to the meta-model packages. The
generally cited clause titles are (approximate order; sub-numbering varies):

7. **Common Structure** — root concepts: Element, Relationship, Namespace,
   Comment, typed elements, multiplicities.
8. **Values** — literals, expressions, opaque expressions, instance
   specifications.
9. **Classification** — classifier, feature, property, operation, generalization,
   redefinition, substitution.
10. **Simple Classifiers** — data types, primitive types, enumerations,
    signals, receptions.
11. **Structured Classifiers** — structured classifier, encapsulated classifier,
    connectors, ports.
12. **Packages** — package, package import, element import, package merge.
13. **Profiles** — stereotypes, tagged values, profile application, extensions.
14. **Classes** — Class, Association, Interface, InterfaceRealization,
    AssociationClass.
15. **Components** — Component, required/provided interfaces, delegation,
    assembly connectors.
16. **Deployments** — Node, Artifact, DeploymentSpecification, CommunicationPath.
17. **Common Behavior** — Behavior (abstract), BehavioredClassifier, Event,
    Trigger, asynchronous vs synchronous invocation.
18. **Activities** — Activity, ActivityNode, ControlFlow, ObjectFlow,
    ActivityPartition, ExpansionRegion, exception handling.
19. **Actions** — the large Actions library: invocation actions, object
    actions, structural-feature actions, link actions, variable actions.
20. **State Machines** — behavioral and protocol state machines, regions,
    transitions, pseudo-states, protocol conformance.
21. **Use Cases** — UseCase, Actor, Extend, Include, Subject.
22. **Interactions** — Interaction, Lifeline, Message, CombinedFragment,
    InteractionUse, (covers sequence / communication / timing / interaction
    overview diagrams).
23. **Information Flows** — InformationItem, InformationFlow, conveyed
    classifiers (modeling abstract information exchange).
24. **Models** — Model element: a Package specializing as a top-level model
    container.

Numbering may be off by one or two clauses depending on the exact TOC layout in
`formal/17-12-05`; treat this as the **topic list** rather than exact clause
numbers. Reconfirm against the PDF before citing numbered clauses.

## Annexes

The standard annex set for UML 2.5.1 is:

- **Annex A — Diagrams** (normative): list of the 14 diagram kinds and the
  notation table.
- **Annex B — Diagram Interchange** (normative): references the companion
  Diagram Interchange XMI package.
- **Annex C — Keywords** (normative): reserved keywords used in notation.
- **Annex D — Tabular Notation** (informative): tabular presentation forms.
- **Annex E — XMI Serialization** (normative): how to serialize UML models.
- **Annex F — Semantics of the UML abstract syntax** (informative): semantic
  discussion not required for conformance.

Verify annex letters and normative/informative tags against the actual PDF —
OMG reshuffles annexes between revisions.

## What is *not* in UML 2.5.1

- **OCL** (Object Constraint Language) — published separately as OCL 2.4.
- **MOF** (Meta Object Facility) — published separately as MOF 2.5.1.
- **Diagram Interchange metamodel** — shipped as a separate XMI file under the
  same spec URL; Annex B references it.

## Key structural takeaway for template design

The six-clause OMG front matter (**Scope, Conformance, Normative References,
Terms and Definitions, Symbols, Additional Information**) is the reusable
"spec skeleton." Project-level specs should keep that skeleton intact and put
all project-specific content into clauses 7+.
