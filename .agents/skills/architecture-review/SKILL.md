---
name: architecture-review
description: Review nino-app UI architecture, Atomic Design layer placement, Container/Page governance, responsibility boundaries, and cross-layer behavior. Use when semantic judgment is required beyond enforce-* checks.
---

# Architecture Review

## Purpose

Determine whether each UI/application unit owns the right responsibility at the right layer. Review behavior and dependency direction, not folder names alone.

## Authority

Apply `AGENTS.md`, applicable `.agents/rules/*`, then objective `enforce-*` results. A mechanical violation is a defect, not a semantic preference. Existing code is evidence, never permission.

## External Authorities

- Atomic Design terminology: https://atomicdesign.bradfrost.com/chapter-2/
- Application Shell model: https://developer.chrome.com/docs/workbox/app-shell-model
- React Router layout routes: https://reactrouter.com/start/declarative/routing

Nino uses Atom, Molecule, Organism, and Page from Atomic Design. Container and Layout are Nino application layers outside that methodology. Container owns scoped application/server-state orchestration for one coherent region; Layout owns persistent chrome and route composition around the active Page. Nino's explicit architectural rules remain authoritative when they are stricter than an external source.

## Mandatory Review Sequence

1. Define the review scope and affected UI/application units.
2. Read the applicable architecture, hooks, and data-boundary rules.
3. Inspect the target unit completely enough to understand its public contract.
4. Inspect immediate callers/callees when ownership is ambiguous.
5. Determine the unit's actual responsibility from behavior, not location or name.
6. Classify the unit as Atom, Molecule, Organism, Container, Page, or Layout according to `.agents/rules/architecture.md`.
7. Compare imports, rendered children, state, effects, data access, decisions, and exposed API with that category.
8. For every Page with application/server-state integration, ask whether the integration affects screen governance or belongs to one coherent Container.
9. For every Organism, verify that any Hooks are presentation-only and that no endpoint/query/state integration leaks into the presentation layer.
10. Run `node .agents/enforcement/check-architecture-boundaries.mjs apps/manager/src` when the reviewed scope is in `apps/manager`; record its exact result.
11. Check whether a proposed correction restores ownership or merely relocates code.
12. Record each finding and final disposition.

## Mechanical Boundary Evidence

Interpret the architecture checker narrowly:

- exit `0` proves only that its configured import-boundary policy found no blocking violation;
- exit `1` confirms the reported policy violation. Classify a finding that intersects the review scope as `VIOLATION` or `LEGACY` according to scope; record unrelated results as mechanical context, without treating the target as a clean PASS;
- exit `2` is `NEEDS-EVIDENCE`/incomplete because local source imports could not be resolved or policy execution failed.

The checker enforces configured composition and prohibited integration access. It does not determine responsibility, whether a Page-level query is truly governance, whether a Container is cohesive, business-logic ownership, or whether a permitted import is a good design. Never turn a checker pass into a semantic PASS.

## Layer Contract

- **Atom:** smallest UI unit with one clear responsibility. No higher UI-layer composition, application/server state, Services, APIs, or business logic. Local UI Hooks/state are allowed when they belong only to the Atom's presentation behavior.
- **Molecule:** small coherent unit composed from Atoms. No Molecules, Organisms, Containers, Pages, application/server state, Services, APIs, or business logic. Local UI Hooks/state are allowed for its own interaction.
- **Organism:** significant presentation section composed from Molecules and/or Atoms. It receives presentation-ready data, flags, and callbacks; it does not query application/server state, call domain/query Hooks, call Services/APIs, decide screen governance, or implement domain decisions. Presentation-only Hooks are allowed.
- **Container:** scoped orchestration layer outside Atomic Design. It owns one coherent region, consumes approved application/server-state Hooks, and translates them into props/callbacks for presentation units. It does not own raw transport, domain policy, cache policy, or route-level governance.
- **Page:** concrete route/context and screen-governance layer. It owns params, redirects, access, macro screen composition, and Page-level states. It may consume approved application/server-state Hooks only when the result affects screen governance or Page-level rendering. Region-specific integration belongs in the narrowest coherent Container.
- **Layout:** application structure outside Atomic Design. It provides persistent chrome and route composition around the active Page, and may directly compose lower layers needed by that chrome.

The exact dependency direction is defined by the normative architecture rule, not by this Skill.

## Page vs. Container Decision Test

For each integration owned by a Page, ask:

1. Does this data/action decide whether the screen, a major Page branch, access rule, redirect, or Page-level state exists?
2. Or does it primarily operate one coherent semantic region such as orders list, order details, catalog, account summary, or another self-contained part of the screen?

If the second answer is stronger, prefer a Container.

Do not extract a Container merely because the Page is long. A Container is valid only when the extracted region has one coherent integration responsibility and a distinct reason to change.

Examples:

```text
usePermissions() controls whether the whole screen is accessible → Page
useOrders() feeds only the orders region → OrdersContainer
useOrderDetails(id) feeds only details region → OrderDetailsContainer
```

## Organism Presentation Test

An Organism may own rich UI behavior such as local expansion, selection, disclosure, focus, drag/drop presentation state, or similar interaction.

It MUST NOT own:

- TanStack Query/domain integration Hooks;
- Zustand/application-state Hooks;
- Services/API clients;
- server/cache invalidation decisions;
- domain/business decisions;
- route/screen governance.

If an Organism needs remote/application data, require values/actions through props from an authorized Page/Container boundary.

## Classification and Correction Test

Classify from the smallest coherent responsibility, then apply the dependency matrix; never choose a category to legalize an intended import. An extraction is valid only when it gives the extracted unit a stable responsibility and leaves the caller with clearer ownership.

Reject as a workaround an empty Container, bridge component, category rename, barrel/alias/wrapper that hides a forbidden edge, or moving a dependency to non-TSX without preserving the boundary. Treat the current app's conflicting imports as legacy evidence, never as a new precedent.

For a Layout, distinguish persistent application chrome from Page-specific visual composition. A shell may directly compose lower layers required by its chrome; reject the dependency only when the unit belongs to the active Page or introduces route-specific feature behavior.

## 9/10 Gates

Report a confirmed violation when evidence shows at least one of:

- responsibility belongs to another architectural category;
- a boundary hides materially different reasons to change;
- an Atom, Molecule, or Organism crosses a prohibited application/server-state/infrastructure boundary;
- a Page owns region-specific integration that has a clear, cohesive Container boundary and materially contributes to Page responsibility overload;
- a Container combines unrelated screen regions or becomes a generic integration dump;
- a Container owns route-level governance rather than scoped orchestration;
- a Layout contains Page-specific behavior;
- a boundary change would only move coupling without improving ownership;
- the public contract is misleading enough that correct reuse/extension decisions require reconstructing unrelated context.

Do **not** report a violation solely because:

- a file is large;
- a Page consumes one or more endpoint Hooks when those results genuinely govern Page-level rendering;
- a Container consumes multiple Hooks when they form one coherent regional workflow;
- a UI unit has several sequential steps in one coherent workflow;
- an alternate architecture is imaginable;
- a folder/name is unconventional but behavior is correct.

Do **not** require an artificial Molecule or Container merely to satisfy a visual hierarchy.

## Boundary Test

Ask: **what has the same reason to change?** Responsibilities with materially different reasons to change should not be forced behind one boundary. Conversely, do not split a coherent workflow merely because it contains several steps.

For Page/Container boundaries also ask: **what is the scope of the decision?** Screen-wide governance belongs to Page; coherent region-level orchestration belongs to Container.

## Finding Classification

Every review item MUST end as exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

- **VIOLATION:** demonstrably breaks a rule/boundary.
- **LEGACY:** violates the target architecture but is outside the current task; never use it as precedent.
- **EXCEPTION:** intentional deviation with explicit project authorization and explicit scope.
- **NEEDS-EVIDENCE:** plausible concern with missing required evidence.
- **PASS:** sufficient inspection found no applicable violation.

## User Decision Gate and Resolution Protocol

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the review or implementation flow that depends on that item. Before any further affected action, present the user with:

1. the classification, exact evidence, applicable rule, and concrete impact;
2. one or more concrete correction or disposition options that stay within the authorized scope;
3. one explicitly recommended option and its justification.

Do not edit the affected code, accept a deviation, choose an option, convert the item to `PASS`, or continue to another target until the user makes an explicit decision. A proposed `EXCEPTION` also requires explicit user authorization and must use this same decision format.

Apply the same gate before choosing between materially different compliant alternatives, including scope, layer classification, Page-vs-Container ownership, or correction direction. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

A `NEEDS-EVIDENCE` item MUST name the missing evidence and the next concrete inspection. It remains unresolved until that evidence is obtained or the review is explicitly closed as incomplete.

A review MUST NOT end by silently converting `NEEDS-EVIDENCE` into `PASS`. If required evidence cannot be obtained, the final status is **INCOMPLETE**.

An `EXCEPTION` without explicit authorization is not an exception; classify it as `NEEDS-EVIDENCE` until authorization is established.

## Evidence Standard

A confirmed finding MUST include exact file/line, observed behavior, current owner/category, expected owner/category, violated rule, impact, and the smallest correction that restores the boundary.

For retrospective audits, inspect the complete relevant unit and required dependency context before reporting a clean PASS.

## Handoffs

- Mechanical import/type/CSS/structure rule → corresponding `enforce-*`.
- Atom/Molecule/Organism/Container/Page/Layout responsibility → `architecture-review`.
- Hook/state/effect/provider ownership → `hook-state-review`.
- API/service/router/adapter/data flow → `data-boundary-review`.
- Naming/cohesion/abstraction → `code-quality-review`.
- Complexity-driven decomposition → `complexity-refactoring`.

The receiving Skill owns the final disposition. Do not bounce a finding back without new evidence.

## Non-Goals

Do not create layers for convenience, introduce speculative abstractions, or use folder structure as proof. Do not fix code during review unless implementation was explicitly requested.

Do not interpret Container as a requirement that every Page must route all presentation through Containers. Direct Page → presentation composition is valid when no scoped application integration exists.

## Final Review Gate

Before PASS/complete, confirm scope was fully inspected, applicable enforcement was considered, every finding has a disposition, Page-vs-Container ownership was checked where integration exists, Organism integration boundaries were checked, no mechanical failure was reclassified as subjective, all `NEEDS-EVIDENCE` items are resolved or explicitly reported as INCOMPLETE, and proposed corrections restore responsibility instead of relocating it.
