# Kruchten 4+1 Architectural View Model

Philippe Kruchten's influential model for describing software architecture
from multiple, concurrent perspectives.

## Sources

- Original paper: Philippe Kruchten, *"Architectural Blueprints — The '4+1'
  View Model of Software Architecture,"* **IEEE Software 12(6)**, November
  1995, pp. 42–50. Public PDF:
  https://www.cs.ubc.ca/~gregor/teaching/papers/4+1view-architecture.pdf
- Wikipedia summary: https://en.wikipedia.org/wiki/4%2B1_architectural_view_model
- Kruchten's later writings (Rational Unified Process) generalize the model
  beyond the original paper.

## Why it exists

A single architecture diagram cannot satisfy every stakeholder — end users,
programmers, sysadmins, and integrators all care about different things.
Kruchten proposed describing the architecture through **four concurrent
views**, each tuned for one stakeholder group, plus a **fifth ("+1") view of
use-case scenarios** that validates and cross-cuts the other four.

Kruchten explicitly framed the model as notation-agnostic: any modeling
language can be used for each view. In practice UML is the default choice
and this pairing is assumed in most modern RUP-style usage.

## The four views

### Logical view

Describes the functionality the system delivers to end users: the domain
model, object model, and the major abstractions. Audience: end users,
analysts, architects. Typical UML diagrams: **class diagrams**, **object
diagrams**, **state machine diagrams** for reactive objects.

### Process view

Describes the system at runtime — processes, threads, tasks, and their
interactions; concurrency, synchronization, performance, and scalability
properties. Audience: system integrators and performance engineers. Typical
UML diagrams: **sequence diagrams**, **communication diagrams**, **activity
diagrams**, sometimes extended with timing or throughput annotations.

### Development view (a.k.a. Implementation view)

Describes the static organization of the software in its development
environment — module breakdown, source-tree layout, subsystem boundaries,
build dependencies, and library reuse. Audience: programmers and software
managers. Typical UML diagrams: **package diagrams**, **component diagrams**.

### Physical view (a.k.a. Deployment view)

Describes the mapping of software onto hardware — nodes, networks, physical
topology, placement of processes on machines, and non-functional attributes
like availability, reliability, and scalability at the infrastructure
level. Audience: system engineers, SREs, operations. Typical UML diagram:
**deployment diagrams**.

### +1 — Scenarios / Use-case view

A small set of carefully chosen use cases / scenarios that illustrate how
elements from the other four views work together. Serves three purposes:
(1) driving the discovery of architectural elements during design; (2)
validating the architecture once drafted; (3) providing the starting point
for integration and acceptance testing. Audience: everyone — it's the
"tour" through the architecture. Typical UML diagrams: **use case
diagrams**, plus a few representative **sequence diagrams**.

## View-to-stakeholder map

| View         | Primary audience          | Answers the question...              |
|--------------|---------------------------|--------------------------------------|
| Logical      | End users, analysts       | What does the system *do*?           |
| Process      | Integrators, performance  | How does it behave at runtime?       |
| Development  | Programmers, PMs          | How is the code organized?           |
| Physical     | System engineers, ops     | Where does it run?                   |
| Scenarios    | Everyone                  | How do the views fit together?       |

## Relationship to other frameworks

- **IEEE 1471 / ISO 42010** (architecture description) generalizes Kruchten:
  any number of stakeholder-defined viewpoints, not just five.
- **IEEE 1016-2009** (SDD) defines twelve viewpoints, several of which map
  directly onto Kruchten's four (Context/Composition → Logical; Interaction
  → Process; Dependency → Development; Resource → Physical).
- **C4 Model** (Simon Brown) is a popular lightweight descendant that
  collapses the views into four zoom levels (Context, Containers,
  Components, Code).

## Takeaway for a project spec template

Use 4+1 as the scaffolding for the "Architecture" clause of any project
spec. Five sub-clauses — Logical, Process, Development, Physical,
Scenarios — give immediate structure and force you to think about every
stakeholder before you pick a notation.
