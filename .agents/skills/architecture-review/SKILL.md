---
name: architecture-review
description: Review nino-app UI architecture, Atomic Design layer placement, responsibility boundaries, and cross-layer behavior. Use when semantic judgment is required beyond enforce-* checks.
---

# Architecture Review

## Purpose

Determine whether each UI unit owns the right responsibility at the right Atomic Design layer. Review behavior and dependency direction, not folder names alone.

## Authority

Apply `AGENTS.md`, applicable `.agents/rules/*`, then objective `enforce-*` results. A mechanical violation is a defect, not a semantic preference. Existing code is evidence, never permission.

## External Authorities

- Atomic Design terminology: https://atomicdesign.bradfrost.com/chapter-2/
- Application Shell model: https://developer.chrome.com/docs/workbox/app-shell-model
- React Router layout routes: https://reactrouter.com/start/declarative/routing

Atomic Design defines Atom, Molecule, Organism, Template, and Page. Nino defines Layout as an application-shell layer outside that methodology: it owns persistent chrome and route composition around the active Page. Nino's explicit architectural rules remain authoritative when they are stricter than an external source.

## Mandatory Review Sequence

1. Define the review scope and affected UI units.
2. Read the applicable architecture and coding rules.
3. Inspect the target unit completely enough to understand its public contract.
4. Inspect immediate callers/callees when ownership is ambiguous.
5. Determine the unit's actual responsibility from behavior, not location or name.
6. Classify the unit as Atom, Molecule, Organism, Template, Page, or Layout according to `.agents/rules/architecture.md`.
7. Compare imports, rendered children, state, effects, data access, decisions, and exposed API with that layer.
8. Run `node .agents/enforcement/check-architecture-boundaries.mjs apps/manager/src` when the reviewed scope is in `apps/manager`; record its exact result.
9. Check whether a proposed correction restores ownership or merely relocates code.
10. Record each finding and final disposition.

## Mechanical Boundary Evidence

Interpret the architecture checker narrowly:

- exit `0` proves only that its configured import-boundary policy found no blocking violation;
- exit `1` confirms the reported policy violation. Classify a finding that intersects the review scope as `VIOLATION` or `LEGACY` according to scope; record unrelated results as mechanical context, without treating the target as a clean PASS;
- exit `2` is `NEEDS-EVIDENCE`/incomplete because local source imports could not be resolved or policy execution failed.

The checker enforces direct UI-composition edges and transitive prohibited state access. It does not determine responsibility, layer placement, route specificity, business-logic ownership, or whether a permitted import is a good design. Never turn a checker pass into a semantic PASS.

## Layer Contract

- **Atom:** smallest UI unit with one clear responsibility. No higher UI-layer composition, application state, Services, APIs, or business logic.
- **Molecule:** small coherent unit composed from Atoms. No Organisms, Templates, Pages, application state, Services, APIs, or business logic.
- **Organism:** significant UI section composed from Molecules and/or Atoms. No Templates, Pages, application state, Services, APIs, or business logic.
- **Template:** reusable page structure composed from lower UI layers; no concrete route selection, direct Service/API access, or business logic.
- **Page:** concrete route/context and UI governance layer; follows the architectural composition and state rules defined by `.agents/rules/architecture.md` and `.agents/rules/hooks.md`.
- **Layout:** application structure outside Atomic Design; provides persistent chrome and renders the active Page through the route-composition mechanism.

The exact dependency direction is defined by the normative architecture rule, not by this Skill.

## Classification and Correction Test

Classify from the smallest coherent responsibility, then apply the dependency matrix; never choose a layer to legalize an intended import. An extraction is valid only when it gives the extracted unit a stable responsibility and leaves the caller with clearer ownership.

Reject as a workaround an empty bridge component, a layer rename, a barrel/alias/wrapper that hides a forbidden edge, or moving a dependency to non-TSX without preserving the boundary. Treat the current app's conflicting imports as legacy evidence, never as a new precedent.

For a Layout, distinguish persistent application chrome from Page-specific visual composition. A shell may own route composition and persistent navigation, but it may not import a lower UI layer merely because that UI happens to be persistent.

## 9/10 Gates

Report a confirmed violation when evidence shows at least one of:

- responsibility belongs to another Atomic Design layer;
- a boundary hides materially different reasons to change;
- a Page owns visual composition that belongs to a Template;
- a Template owns route-specific governance;
- an Atom, Molecule, or Organism crosses a prohibited state/data/infrastructure boundary;
- a Layout contains Page-specific behavior;
- a boundary change would only move coupling without improving ownership;
- the public contract is misleading enough that correct reuse/extension decisions require reconstructing unrelated context.

Do **not** report a violation solely because:

- a file is large;
- a UI unit has several sequential steps in one coherent workflow;
- an alternate architecture is imaginable;
- a folder/name is unconventional but behavior is correct.

Do **not** require an artificial Molecule when an Organism's direct Atom composition is the smallest coherent section, or split one coherent UI workflow merely to obtain a lower layer.

## Boundary Test

Ask: **what has the same reason to change?** Responsibilities with materially different reasons to change should not be forced behind one boundary. Conversely, do not split a coherent workflow merely because it contains several steps.

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

Apply the same gate before choosing between materially different compliant alternatives, including scope, layer classification, or correction direction. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

A `NEEDS-EVIDENCE` item MUST name the missing evidence and the next concrete inspection. It remains unresolved until that evidence is obtained or the review is explicitly closed as incomplete.

A review MUST NOT end by silently converting `NEEDS-EVIDENCE` into `PASS`. If required evidence cannot be obtained, the final status is **INCOMPLETE**.

An `EXCEPTION` without explicit authorization is not an exception; classify it as `NEEDS-EVIDENCE` until authorization is established.

## Evidence Standard

A confirmed finding MUST include exact file/line, observed behavior, current owner/layer, expected owner/layer, violated rule, impact, and the smallest correction that restores the boundary.

For retrospective audits, inspect the complete relevant unit and required dependency context before reporting a clean PASS.

## Handoffs

- Mechanical import/type/CSS/structure rule → corresponding `enforce-*`.
- Atomic Design layer responsibility → `architecture-review`.
- Hook/state/effect/provider ownership → `hook-state-review`.
- API/service/router/adapter/data flow → `data-boundary-review`.
- Naming/cohesion/abstraction → `code-quality-review`.
- Complexity-driven decomposition → `complexity-refactoring`.

The receiving Skill owns the final disposition. Do not bounce a finding back without new evidence.

## Non-Goals

Do not create layers for convenience, introduce speculative abstractions, or use folder structure as proof. Do not fix code during review unless implementation was explicitly requested.

## Final Review Gate

Before PASS/complete, confirm scope was fully inspected, applicable enforcement was considered, every finding has a disposition, no mechanical failure was reclassified as subjective, all `NEEDS-EVIDENCE` items are resolved or explicitly reported as INCOMPLETE, and proposed corrections restore responsibility instead of relocating it.
