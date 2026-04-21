# {{Project Name}} — Software Design Document (OOP Skeleton)

> Based on IEEE 1016-2009, Rational Unified Process (RUP), and Kruchten's 4+1 Architectural View Model.
> Generic template — replace `{{placeholders}}` with project-specific content.

---

## 1. Introduction

### 1.1 Purpose
This document provides a comprehensive architectural overview of the {{Project Name}} system using multiple views to depict different aspects of the system. It is intended to capture and convey the significant architectural decisions which have been made on the system.

### 1.2 Scope
- **System:** {{short system description}}
- **Boundaries:** {{included capabilities}}
- **Exclusions:** {{explicitly out-of-scope capabilities}}

### 1.3 Definitions, Acronyms and Abbreviations
See `{{specification-doc}}` Section 4 (Terms and Definitions).

### 1.4 References
| Document | Description |
|----------|-------------|
| `{{features-doc}}` | Complete feature inventory with priority tiers |
| `{{specification-doc}}` | Formal specification skeleton (UML 2.5 structure) |
| `{{business-doc}}` | Business/product plan |
| `{{roadmap-doc}}` | Technical roadmap |
| `{{analysis-doc}}` | Market / competitor / domain analysis |

### 1.5 Document Overview
This document is organized using the **4+1 Architectural View Model** (Kruchten, 1995):

| View | Stakeholders | Concerns | UML Diagrams |
|------|-------------|----------|--------------|
| **+1 Scenarios** | All | Key use cases that drive architecture | Use Case Diagrams |
| **Logical** | Domain analysts, developers | Object model, design patterns | Class, Sequence, State |
| **Process** | Performance engineers | Concurrency, throughput, distribution | Activity, Sequence |
| **Development** | Programmers, build engineers | Module organization, layers, reuse | Package, Component |
| **Physical** | Ops, infrastructure | Deployment, availability, topology | Deployment Diagrams |

---

## 2. Architectural Representation

### 2.1 Views Used
This document uses all five views of the 4+1 model, plus two additional views:
- **Data View** — persistent data model and ORM strategy
- **Interface View** — external API contracts and third-party integrations

### 2.2 Modeling Conventions
- All diagrams follow UML 2.5.1 notation
- API contracts follow OpenAPI 3.1 specification
- Data models use {{database-flavor}}-compatible types
- Code examples use {{language + version}} with type hints

### 2.3 Architecture Style
- **Phase 1–2:** {{e.g. modular monolith with clean internal boundaries}}
- **Phase 3+:** {{e.g. service extraction where scale demands it}}
- **API style:** {{RESTful / GraphQL / gRPC}} with {{JSON / protobuf}} payloads
- **Async pattern:** {{event-driven / request-response / hybrid}}

---

## 3. Architectural Goals and Constraints

### 3.1 Quality Attributes

| Attribute | Requirement | Design Impact |
|-----------|-------------|---------------|
| **Performance** | {{target}} | {{strategy}} |
| **Availability** | {{SLO}} | {{strategy}} |
| **Scalability** | {{growth target}} | {{strategy}} |
| **Latency** | {{p99 target}} | {{strategy}} |
| **Security** | {{requirement}} | {{strategy}} |
| **{{other}}** | {{requirement}} | {{strategy}} |

### 3.2 Technical Constraints
- [ ] {{language + runtime version}}
- [ ] {{primary database}}
- [ ] {{cache / queue layer}}
- [ ] {{frontend stack}}
- [ ] {{external service dependencies}}

### 3.3 Business Constraints
- [ ] {{budget constraint}}
- [ ] {{team size / staffing}}
- [ ] {{timeline / milestones}}
- [ ] {{distribution / partner constraints}}

### 3.4 Regulatory Constraints
- [ ] {{applicable regulations / standards}}

---

## 4. Use-Case View (+1 Scenarios)

> The "+1" view drives and validates all other architectural views. These are the architecturally significant scenarios.

### 4.1 System Context Diagram

```
                    ┌─────────────────────────────┐
                    │                             │
   {{Actor A}} ────►│                             │◄──── {{Actor B}}
                    │                             │
                    │      {{System Name}}        │
                    │                             │
   {{Actor C}} ────►│                             │◄──── {{Actor D}}
                    │                             │
                    └──────────┬──────────────────┘
                               │
              ┌────────────────┼──────────────────────┐
              │                │                      │
        {{External       {{External           {{External
         Services A}}     Services B}}         Services C}}
```

### 4.2 Architecturally Significant Use Cases

These use cases exercise the critical architectural mechanisms and drive the design:

#### UC-01: {{Use Case Title}}
- **Priority:** {{P0 | P1 | P2}}
- **Touches:** {{modules involved}}
- **Architectural significance:** {{what mechanisms this exercises}}
- **Preconditions:** {{state before}}
- **Main flow:** {{short narrative}}
- **Postconditions:** {{state after}}
- **Quality requirements:** {{perf / latency / other}}

#### UC-02: {{Use Case Title}}
- **Priority:** {{}}
- **Touches:** {{}}
- **Architectural significance:** {{}}
- **Preconditions:** {{}}
- **Main flow:** {{}}
- **Postconditions:** {{}}
- **Quality requirements:** {{}}

#### UC-03..N: {{Additional Use Cases}}
{{Repeat the block above for each architecturally significant use case.}}

---

## 5. Logical View

> Object model, key abstractions, design patterns, and use-case realizations.

### 5.1 Overview — Package Hierarchy

```
{{project_root}}/
├── core/                  # Layer 0: Foundation
│   ├── models.py          # Base entity, auditable entity
│   ├── auth.py            # Authentication, session management
│   ├── config.py          # Environment config, feature flags
│   ├── events.py          # Event bus, domain events
│   └── exceptions.py      # Domain exception hierarchy
│
├── {{domain_module_1}}/   # Layer 1: Domain
│   ├── models.py
│   ├── service.py
│   └── schemas.py
│
├── {{domain_module_2}}/   # Layer 1: Domain
│   ├── models.py
│   ├── service.py
│   └── schemas.py
│
├── {{intelligence_module}}/  # Layer 2: Intelligence (optional)
│   ├── engine.py
│   └── models.py
│
├── notification/          # Layer 3: Infrastructure
│   ├── service.py
│   ├── templates.py
│   └── channels/
│
└── analytics/             # Layer 3: Infrastructure
    ├── metrics.py
    └── models.py
```

### 5.2 Domain Model — Key Abstractions

```
┌──────────────────┐         ┌──────────────────┐
│  {{Entity A}}    │         │  {{Entity B}}    │
├──────────────────┤         ├──────────────────┤
│ {{attribute}}    │         │ {{attribute}}    │
│ {{attribute}}    │◄───────►│ {{attribute}}    │
│ {{attribute}}    │ {{rel}} │ {{attribute}}    │
└────────┬─────────┘         └────────┬─────────┘
         │ {{relation}}               │ {{relation}}
┌────────▼─────────┐         ┌────────▼─────────┐
│  {{Entity C}}    │         │  {{Entity D}}    │
├──────────────────┤         ├──────────────────┤
│ {{attribute}}    │         │ {{attribute}}    │
└──────────────────┘         └──────────────────┘
```

### 5.3 Design Patterns

| Pattern | Where Used | Purpose |
|---------|-----------|---------|
| **Repository** | {{}} | Abstract DB access, enable testing |
| **Strategy** | {{}} | Swap algorithm implementations |
| **Observer / Event Bus** | {{}} | Decouple triggers from handlers |
| **Factory** | {{}} | {{}} |
| **Adapter** | {{}} | Uniform interface across external services |
| **Chain of Responsibility** | {{}} | {{}} |
| **Template Method** | {{}} | {{}} |
| **Facade** | {{}} | {{}} |
| **Specification** | {{}} | Composable filter criteria |

### 5.4 Use-Case Realizations

> Sequence diagrams for architecturally significant use cases.
> See `{{specification-doc}}` Section 17 (Interactions) for detailed sequences.

- [ ] `UC-01` {{title}} — sequence diagram
- [ ] `UC-02` {{title}} — sequence diagram
- [ ] `UC-0N` {{title}} — sequence diagram

### 5.5 State Behavior of Key Objects
> See `{{specification-doc}}` Section 14 (State Machines) for:
- {{Entity A}} lifecycle
- {{Entity B}} lifecycle
- {{Entity C}} lifecycle

---

## 6. Process View

> Concurrency, distribution, performance, fault tolerance.

### 6.1 Processes and Threads

| Process | Type | Purpose |
|---------|------|---------|
| **API Server** | Long-running | Handle HTTP requests |
| **{{Worker A}}** | Background task | {{}} |
| **{{Worker B}}** | Background task | {{}} |
| **{{Cron A}}** | Scheduled ({{cadence}}) | {{}} |
| **{{Aggregator}}** | Scheduled (nightly) | {{}} |

### 6.2 Inter-Process Communication

| Communication | Mechanism | When |
|---------------|-----------|------|
| API → {{Worker}} | {{queue / bus}} | {{trigger}} |
| Cron → {{Worker}} | {{queue / bus}} | {{trigger}} |
| API → External Services | {{protocol}} | {{trigger}} |

### 6.3 Synchronization and Concurrency

| Concern | Solution |
|---------|----------|
| {{shared state concern}} | {{locking / versioning strategy}} |
| {{race condition concern}} | {{ordering / sequencing strategy}} |
| Rate limiting | {{token bucket / leaky bucket / other}} |

### 6.4 Performance Budget

| Operation | Target Latency | Strategy |
|-----------|---------------|----------|
| {{operation A}} | {{<Xms}} | {{}} |
| {{operation B}} | {{<Xms}} | {{}} |
| {{operation C}} | {{<Xms}} | {{}} |

---

## 7. Development View (Implementation View)

> Module organization, layers, build configuration.

### 7.1 Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Layer 4: PRESENTATION                                  │
│  {{web UI, API routes}}                                 │
├─────────────────────────────────────────────────────────┤
│  Layer 3: INFRASTRUCTURE                                │
│  {{notification, analytics, external adapters, cache}}  │
├─────────────────────────────────────────────────────────┤
│  Layer 2: INTELLIGENCE (optional)                       │
│  {{domain-specific algorithms, engines}}                │
├─────────────────────────────────────────────────────────┤
│  Layer 1: DOMAIN                                        │
│  {{entity models + services + schemas}}                 │
├─────────────────────────────────────────────────────────┤
│  Layer 0: CORE / FOUNDATION                             │
│  Base models, auth, config, events, exceptions, DB      │
└─────────────────────────────────────────────────────────┘
```

**Dependency rules:**
- Each layer MAY depend on layers below it
- Each layer SHALL NOT depend on layers above it
- Layer 2 depends on Layer 1 for data, never the reverse
- Layer 3 provides adapters consumed by higher layers via interfaces

### 7.2 Source Code Organization

```
src/
├── api/
│   ├── app.py
│   ├── config.py
│   ├── middleware/
│   └── routes/
│
├── web/
│   └── {{app}}/
│       ├── index.html
│       ├── js/
│       ├── css/
│       └── img/
│
└── scripts/
    └── {{app}}/
        ├── seed_data.{{ext}}
        └── smoke_test.{{ext}}
```

### 7.3 Build and Configuration

| Concern | Tool | Notes |
|---------|------|-------|
| Package management | {{tool}} | {{}} |
| Code formatting | {{tool}} | {{}} |
| Linting | {{tool}} | {{}} |
| Environment config | {{tool}} | Never commit secrets |
| Database migrations | {{tool}} | Versioned schema changes |
| API documentation | OpenAPI 3.1 | {{auto-generated / hand-written}} |

---

## 8. Physical View (Deployment View)

> See `{{specification-doc}}` Section 19 (Deployments) for full topology diagram.

### 8.1 Deployment Overview

| Tier | Components | Technology |
|------|-----------|------------|
| **Edge** | {{CDN, SSL termination, static assets}} | {{}} |
| **Web** | {{API servers, load balancer}} | {{}} |
| **Data** | {{primary DB, replica, cache}} | {{}} |
| **Storage** | {{blob / object storage}} | {{}} |
| **Workers** | {{background processes}} | {{}} |

### 8.2 Environment Matrix

| Env | API Instances | DB | Cache | Purpose |
|-----|--------------|-----|-------|---------|
| `local` | 1 | Local | Local | Development |
| `staging` | 1 | Shared | Shared | Testing |
| `production` | {{N}}+ | Managed (primary + replica) | Managed | Live |

### 8.3 Scaling Strategy

| Phase | Users | API Instances | DB Strategy |
|-------|-------|--------------|-------------|
| MVP | {{}} | {{}} | {{}} |
| Pilot | {{}} | {{}} | {{}} |
| Growth | {{}} | {{}} | {{}} |
| Scale | {{}} | Auto-scaled | {{sharding / managed}} |

---

## 9. Data View

> Persistent data model, ORM strategy, data access patterns.

### 9.1 Database Technology
- **Primary:** {{e.g. PostgreSQL 15+}}
- **Cache:** {{e.g. Redis 7+}}
- **Search:** {{full-text / vector / external}}
- **Object storage:** {{S3-compatible / other}}

### 9.2 Core Tables (Schema Skeleton)

```sql
-- {{Domain A}}
{{table_a}}
{{table_a_detail}}

-- {{Domain B}}
{{table_b}}
{{table_b_detail}}

-- Platform
notifications
audit_log
```

### 9.3 Key Indexes

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| `{{table}}` | `({{columns}})` | {{B-tree / GIN / GiST}} | {{use case}} |

### 9.4 Data Access Patterns

| Pattern | Frequency | Strategy |
|---------|-----------|----------|
| {{read A}} | {{}} | {{cache / index}} |
| {{write B}} | {{}} | {{async / sync}} |
| {{scan C}} | {{}} | {{strategy}} |

---

## 10. Interface View

> External API contracts and third-party integrations.

### 10.1 External REST API

See `{{specification-doc}}` Annex B for full endpoint index.

**Authentication:**
- {{auth mechanism A}}
- {{auth mechanism B}}

**API versioning:** {{URL prefix / header / other}}.

### 10.2 Third-Party Integrations

| Integration | Provider | Protocol | Purpose |
|-------------|----------|----------|---------|
| {{category}} | {{provider}} | {{REST / WS / gRPC}} | {{}} |
| {{category}} | {{provider}} | {{}} | {{}} |

### 10.3 Internal Service Interfaces

| Interface | Provided By | Consumed By | Contract |
|-----------|------------|-------------|----------|
| `{{IInterface}}` | {{module}} | {{consumers}} | {{key methods}} |

---

## 11. Design Decisions and Rationale

> Key architectural decisions recorded in ADR (Architecture Decision Record) format.

### ADR-001: {{Title}}
- **Status:** {{Proposed / Accepted / Superseded}}
- **Context:** {{forces at play}}
- **Decision:** {{the choice}}
- **Rationale:** {{why}}
- **Consequences:** {{positive and negative outcomes}}

### ADR-002: {{Title}}
- **Status:** {{}}
- **Context:** {{}}
- **Decision:** {{}}
- **Rationale:** {{}}
- **Consequences:** {{}}

### ADR-00N: {{Title}}
{{Repeat for each significant decision.}}

---

## 12. Size and Performance

### 12.1 Dimensioning (Phase 1 → Phase 3)

| Metric | Phase 1 (MVP) | Phase 2 (Pilot) | Phase 3 (Growth) |
|--------|--------------|----------------|------------------|
| {{entity A count}} | {{}} | {{}} | {{}} |
| {{entity B count}} | {{}} | {{}} | {{}} |
| {{operations/day}} | {{}} | {{}} | {{}} |
| Notifications/day | {{}} | {{}} | {{}} |
| Storage | {{}} | {{}} | {{}} |

### 12.2 Performance Targets

| Operation | P50 | P99 | Max |
|-----------|-----|-----|-----|
| API response (simple read) | {{}} | {{}} | {{}} |
| {{heavy query}} | {{}} | {{}} | {{}} |
| {{write operation}} | {{}} | {{}} | {{}} |
| Page load (web UI) | {{}} | {{}} | {{}} |

---

## 13. Quality Attributes

| Attribute | Requirement | How Architecture Supports It |
|-----------|-------------|------------------------------|
| **Extensibility** | {{}} | {{data-driven config / plugin architecture / other}} |
| **Reliability** | {{}} | {{WAL + backups / replication / other}} |
| **Testability** | {{}} | {{repository pattern / DI / interfaces}} |
| **Security** | {{}} | {{encryption / authn / authz}} |
| **Maintainability** | {{}} | {{clean boundaries / consistent patterns}} |
| **Portability** | {{}} | {{containerized / no vendor lock-in}} |
| **Accessibility** | {{}} | {{WCAG compliance / semantic HTML}} |
| **Internationalization** | {{}} | {{i18n framework / bilingual content}} |

---

## 14. Appendices

### 14.1 Glossary
See `{{specification-doc}}` Section 4 (Terms and Definitions).

### 14.2 Requirements Traceability Matrix

| Requirement | Use Case | Logical View | Process View | Physical View |
|-------------|---------|-------------|-------------|---------------|
| {{requirement A}} | UC-0X | {{modules}} | {{process}} | {{tier}} |
| {{requirement B}} | UC-0Y | {{modules}} | {{process}} | {{tier}} |

### 14.3 Diagram Index
See `{{specification-doc}}` Annex A for the full list of UML diagrams to be created.

### 14.4 Open Questions

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 1 | {{}} | {{}} | {{}} |
| 2 | {{}} | {{}} | {{}} |

---

*This design document follows the 4+1 Architectural View Model (Kruchten, 1995) and IEEE 1016-2009 structure.*
