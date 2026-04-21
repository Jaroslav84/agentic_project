# {{PROJECT_NAME}} — Software Specification

> OMG-UML-2.5.1-style software specification skeleton.
> Fill every section, or delete it and explain why in § 6.1 Change log.
> Terminology, front-matter structure, and compliance-point convention follow
> OMG UML 2.5.1. Architecture decomposition follows Kruchten 4+1 and
> IEEE 1016-2009 viewpoints. See `docs/uml/` for the source conventions.

| Field | Value |
|---|---|
| **Document title** | {{PROJECT_NAME}} Software Specification |
| **Version** | {{DOC_VERSION}} |
| **Status** | {{DRAFT / REVIEW / ADOPTED}} |
| **Date** | {{YYYY-MM-DD}} |
| **Authors** | {{NAMES}} |
| **License** | {{LICENSE}} |

---

## Table of Contents

**Front Matter (mandatory, mirrors OMG spec convention)**

1. [Scope](#1-scope)
2. [Conformance](#2-conformance)
3. [Normative References](#3-normative-references)
4. [Terms and Definitions](#4-terms-and-definitions)
5. [Symbols and Abbreviated Terms](#5-symbols-and-abbreviated-terms)
6. [Additional Information](#6-additional-information)

**Body**

7. [Architecture Overview (Kruchten 4+1)](#7-architecture-overview-kruchten-41)
8. [Design Viewpoints (IEEE 1016)](#8-design-viewpoints-ieee-1016)
9. [Requirements](#9-requirements)
10. [Use Cases](#10-use-cases)
11. [Open Issues and Risks](#11-open-issues-and-risks)

**Annexes**

- [Annex A (normative) — Data model](#annex-a-normative--data-model)
- [Annex B (normative) — Interface contracts](#annex-b-normative--interface-contracts)
- [Annex C (informative) — Diagrams](#annex-c-informative--diagrams)
- [Annex D (informative) — Worked examples](#annex-d-informative--worked-examples)

---

## 1. Scope

> One paragraph stating what the system IS and what this document covers.
> End with an explicit "This specification does NOT cover..." sentence.

- **In scope:** {{bullet list of capabilities this document defines}}
- **Out of scope:** {{bullet list of things explicitly excluded}}
- **System type:** {{e.g., REST service, CLI, mobile app, distributed platform}}
- **Stakeholder groups:** {{e.g., end users, operators, integrators, regulators}}

---

## 2. Conformance

> Numbered compliance points. Any implementation claiming conformance MUST
> satisfy every point. Use "shall" for normative requirements.

- **2.1 {{Name}} Conformance** — {{Implementations shall ...}}
- **2.2 {{Name}} Conformance** — {{Implementations shall ...}}
- **2.3 {{Name}} Conformance** — {{Implementations shall ...}}

**Conformance levels (optional):** if the spec defines tiers (e.g., Minimal /
Standard / Full), list which compliance points are required at each level.

---

## 3. Normative References

> Documents cited with binding force. Only list standards whose text this
> document relies on — not background reading.

| Reference | Version | Description |
|-----------|---------|-------------|
| {{e.g., OMG UML}} | {{2.5.1}} | {{Unified Modeling Language}} |
| {{e.g., RFC 7231}} | {{-}} | {{HTTP/1.1 Semantics}} |
| {{e.g., JSON Schema}} | {{Draft 2020-12}} | {{Data validation schema}} |

---

## 4. Terms and Definitions

> Project-specific vocabulary. A term defined here overrides its common
> English meaning inside this document.

- **{{Term}}** — {{Definition. One or two sentences.}}
- **{{Term}}** — {{Definition.}}
- **{{Term}}** — {{Definition.}}

---

## 5. Symbols and Abbreviated Terms

> Acronyms and shorthand used throughout the document.

| Symbol | Expansion |
|--------|-----------|
| {{API}} | {{Application Programming Interface}} |
| {{JWT}} | {{JSON Web Token}} |
| {{SLA}} | {{Service Level Agreement}} |

---

## 6. Additional Information

### 6.1 Change log

| Version | Date | Author | Change |
|---------|------|--------|--------|
| {{0.1.0}} | {{YYYY-MM-DD}} | {{Name}} | Initial draft |

### 6.2 Acknowledgements

{{People and prior art that shaped this document.}}

### 6.3 IP and licensing

{{Copyright holder. License under which this spec is published.}}

---

## 7. Architecture Overview (Kruchten 4+1)

> Describe the system through five concurrent views. Each view answers a
> different stakeholder's question. See `docs/uml/KRUCHTEN_4_PLUS_1.md`.

### 7.1 Logical View

> **Audience:** end users, analysts.
> **Answers:** what functionality does the system provide?
> **Typical diagrams:** class, object, state-machine.

{{Describe the domain model, key abstractions, and their relationships.}}

### 7.2 Process View

> **Audience:** systems integrators.
> **Answers:** how does the system behave at runtime?
> **Typical diagrams:** activity, sequence.

{{Describe processes, threads, synchronization, concurrency, performance.}}

### 7.3 Development View

> **Audience:** programmers, project managers.
> **Answers:** how is the code organized?
> **Typical diagrams:** package, component.

{{Describe source tree layout, modules, build graph, dependencies.}}

### 7.4 Physical View

> **Audience:** operations, SRE.
> **Answers:** where does the system run?
> **Typical diagrams:** deployment.

{{Describe deployment topology, nodes, networks, infrastructure.}}

### 7.5 Scenarios (+1)

> **Audience:** all stakeholders.
> **Answers:** how do the four views fit together for representative flows?

{{Two or three end-to-end scenarios that thread through the other views.}}

---

## 8. Design Viewpoints (IEEE 1016)

> Detail for each concern below. Pick the subset relevant to this project;
> delete the rest with a note in 6.1. See `docs/uml/IEEE_1016_SDD.md`.

### 8.1 Context Viewpoint

{{System boundary, external actors, integrations, trust boundaries.}}

### 8.2 Composition Viewpoint

{{Decomposition into modules or subsystems, and their responsibilities.}}

### 8.3 Interface Viewpoint

{{Public APIs and service contracts. Refer to Annex B for full schemas.}}

### 8.4 Information Viewpoint

{{Persistent data schemas, flows, retention, privacy classes. See Annex A.}}

### 8.5 Interaction Viewpoint

{{Message sequences between components for key flows. See Annex C.}}

### 8.6 State Dynamics Viewpoint

{{Life-cycles of reactive components: state machines, timers, events.}}

### 8.7 Resource Viewpoint

{{Memory, threads, connections, rate limits, quotas, scaling limits.}}

---

## 9. Requirements

> Numbered so they can be cited elsewhere. Use RFC 2119 keywords
> (MUST / SHOULD / MAY) consistently.

### 9.1 Functional requirements

- **FR-001** — {{The system SHALL ...}}
- **FR-002** — {{The system SHALL ...}}
- **FR-003** — {{The system SHOULD ...}}

### 9.2 Non-functional requirements

- **NFR-001 (Performance)** — {{P99 latency ≤ N ms under M rps.}}
- **NFR-002 (Security)** — {{All traffic encrypted with TLS ≥ 1.3.}}
- **NFR-003 (Reliability)** — {{Availability ≥ 99.9% monthly.}}
- **NFR-004 (Observability)** — {{Every request SHALL emit a trace span.}}

---

## 10. Use Cases

> Actor-centric scenarios that drive the scope in § 1.

### UC-{{ID}} — {{Name}}

- **Actor:** {{primary actor, e.g., Registered User}}
- **Preconditions:** {{state of the system before the scenario}}
- **Main flow:**
  1. {{Step.}}
  2. {{Step.}}
- **Alternative flows:** {{exceptional paths.}}
- **Postconditions:** {{state of the system after success.}}

{{Repeat per use case.}}

---

## 11. Open Issues and Risks

| ID | Description | Impact | Mitigation | Owner |
|----|-------------|--------|------------|-------|
| OI-001 | {{Open design question}} | {{H/M/L}} | {{Plan}} | {{Name}} |
| R-001  | {{Risk}} | {{H/M/L}} | {{Plan}} | {{Name}} |

---

## Annex A (normative) — Data model

> Entity-relationship or class schemas with normative cardinality and
> nullability. Reference concrete schema files where appropriate.

{{ERD, class diagram, or schema excerpt.}}

---

## Annex B (normative) — Interface contracts

> OpenAPI, protobuf, or equivalent. Inline the authoritative excerpt or
> link to the versioned file.

```yaml
# {{paste or link to}} openapi.yaml
```

---

## Annex C (informative) — Diagrams

> Class, sequence, state-machine, and deployment diagrams that illustrate
> but do not define the system. Use PlantUML or Mermaid sources so they
> can be regenerated. See `docs/uml/UML_DIAGRAMS.md` for diagram choice.

```mermaid
%% {{Replace with an actual diagram.}}
```

---

## Annex D (informative) — Worked examples

> End-to-end examples and test scenarios that illustrate the specification.
> Pair each with the use case in § 10 that it exercises.

{{Example 1 — {{Name}}: steps, inputs, expected outputs.}}
