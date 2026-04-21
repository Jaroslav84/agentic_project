# UML 2.5 Diagram Taxonomy

The 14 diagram kinds defined by UML 2.5 / 2.5.1, organized by family.

## Sources

- https://www.uml-diagrams.org/uml-25-diagrams.html
- https://en.wikipedia.org/wiki/Unified_Modeling_Language
- OMG UML 2.5.1 spec, Annex A "Diagrams": https://www.omg.org/spec/UML/2.5.1/PDF

UML 2.5 keeps the same 14 diagram kinds as UML 2.x and groups them into two
top-level families: **Structural** (static view) and **Behavioral** (dynamic
view). Interaction diagrams are a sub-family inside Behavioral.

## Structural diagrams (7)

Show the static anatomy of a system — what exists, how it's organized, how
parts relate. Used at design time, rarely changed at runtime.

1. **Class diagram** — Classes, interfaces, their attributes/operations, and
   the associations, generalizations, and dependencies between them. Used
   for: domain model, detailed object-oriented design, data model sketches.
2. **Object diagram** — A snapshot of object instances and their values at a
   specific moment. Used for: illustrating a concrete scenario or test case
   configuration of the class model.
3. **Package diagram** — Packages (namespaces / modules) and their
   imports/merges. Used for: showing module-level architecture and source-tree
   organization.
4. **Composite structure diagram** — Internal structure of a classifier:
   parts, ports, connectors, and how the parts collaborate. Used for:
   modeling runtime collaborations inside a component.
5. **Component diagram** — Components, their required and provided
   interfaces, and the wiring between them. Used for: service- and
   component-oriented architecture views.
6. **Deployment diagram** — Nodes (hardware, VMs, containers) with artifacts
   deployed onto them and communication paths between nodes. Used for: the
   physical/infrastructure view.
7. **Profile diagram** — Stereotypes, tagged values, and extensions that
   specialize UML for a platform or domain. Used for: defining a custom UML
   dialect (e.g., SysML builds on profiles).

## Behavioral diagrams — core (3)

Show how the system behaves over time.

8. **Use case diagram** — Actors, system boundary, and use cases they
   participate in, plus include/extend relationships. Used for: capturing
   functional scope from the user's perspective.
9. **Activity diagram** — Control flow and object flow across actions,
   decisions, forks/joins, and swim-lane partitions. Used for: business
   processes, workflows, and algorithm-level behavior.
10. **State machine diagram** — States, transitions, events, and guards for a
    classifier whose behavior is reactive. Used for: modeling objects with
    life-cycle, protocols, and reactive controllers.

## Behavioral diagrams — Interaction sub-family (4)

All four describe the same underlying *Interaction* metamodel element; they
differ only in what they emphasize.

11. **Sequence diagram** — Lifelines down the page, messages across time.
    Used for: showing the chronological message exchange in a scenario (by
    far the most-drawn interaction diagram).
12. **Communication diagram** — The same participants and messages as a
    sequence diagram, but laid out as a graph with sequence numbers on the
    arrows. Used for: emphasizing *who talks to whom* rather than the
    timing.
13. **Timing diagram** — Lifelines along one axis, time along the other,
    with state changes drawn as a waveform. Used for: real-time systems and
    anything where durations and temporal constraints matter.
14. **Interaction overview diagram** — An activity diagram whose nodes are
    whole interactions (or references to them). Used for: stitching multiple
    scenarios together into a high-level behavioral flow.

## Quick chooser

| Need to show...                               | Use                          |
|-----------------------------------------------|------------------------------|
| Domain types and relationships                | Class                        |
| A specific runtime configuration              | Object                       |
| Module / source-tree organization             | Package                      |
| Internals of a component                      | Composite Structure          |
| Service boundaries and wiring                 | Component                    |
| Hardware / deployment layout                  | Deployment                   |
| A UML dialect for your platform               | Profile                      |
| Who the users are and what they want          | Use Case                     |
| A workflow or algorithm                       | Activity                     |
| An object with a life-cycle                   | State Machine                |
| A scenario's chronological message flow       | Sequence                     |
| The call graph between objects                | Communication                |
| Hard real-time timing                         | Timing                       |
| Multiple scenarios glued together             | Interaction Overview         |
