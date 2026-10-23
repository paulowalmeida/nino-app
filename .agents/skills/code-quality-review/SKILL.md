---
name: code-quality-review
description: Review nino-app semantic clarity, naming, comments, abstraction quality, cohesion, duplication, and maintainability beyond mechanical enforcement.
---

# Code Quality Review

## Purpose

Review qualities that are difficult to encode safely as blocking rules: whether code communicates intent locally, whether abstractions represent real concepts, and whether changes improve cohesion instead of merely metrics.

## Authority

Apply `AGENTS.md`, applicable `.agents/rules/*`, then objective `enforce-*` results. This Skill supplies semantic judgment; it must not turn personal style into mandatory project policy.

## External Authorities and Nino Decisions

- React event-handler prop naming: https://react.dev/learn/responding-to-events
- Google TypeScript Style Guide — identifiers: https://google.github.io/styleguide/tsguide.html#identifiers
- typescript-eslint naming-convention rule: https://typescript-eslint.io/rules/naming-convention/

React and the Google TypeScript Style Guide inform naming principles; the typescript-eslint rule can enforce syntactic naming conventions but cannot prove semantic clarity. The Nino naming rules below are project-specific and authoritative for this repository.

## Mandatory Review Sequence

1. Read the complete target unit and relevant public API.
2. Identify what a reader must infer from names, control flow, comments, and surrounding context.
3. Identify dominant responsibility and reasons to change.
4. Inspect callers when abstraction quality depends on usage.
5. Check for an existing approved abstraction before proposing a new one.
6. Compare every suspected duplicate's contract, reason to change, and divergence risk.
7. Evaluate the smallest semantic improvement.
8. Record each finding and disposition.

## 9/10 Gates

Report a confirmed defect when evidence shows:

- a name describes implementation shape instead of domain/UI meaning and materially obscures intent;
- a comment restates mechanics or compensates for a name that should carry the meaning;
- an abstraction exists only for LOC reduction, metric compliance, or hypothetical reuse;
- a helper name hides materially unrelated responsibilities;
- a wrapper merely forwards parameters without a semantic contract;
- duplicated knowledge has the same reason to change but remains artificially separate;
- extraction reduces local size while worsening cohesion, parameter plumbing, or indirection;
- a name conceals responsibility, creates relevant ambiguity, or prevents a reader from understanding the represented entity, action, state, or UI role from its bounded context;
- a simple local workflow requires opening several unrelated helpers to understand it;
- concepts are coupled only because they execute sequentially when a clearer local workflow is possible.

## Naming Test

A strong name communicates domain, UI role, state meaning, or action without implementation inspection. A name is a violation only when it conceals responsibility, creates relevant ambiguity, or describes implementation shape/type instead of meaning. The mere existence of a more specific alternative is not a violation.

Use domain-specific event props such as `onPlayMovie` when a custom component exposes an application interaction; platform-mandated APIs such as `onClick`, `children`, `key`, and `ref` are allowed. Conventional concise names are allowed only when unambiguous in a bounded local context, including a short-lived `index`, `event`, or `error`, and a generic type parameter such as `T`. Do not encode information already represented by the type.

For a suspected naming defect, state the bounded context inspected, what a reader cannot determine, and a concrete misreading it permits. A name is a `NEEDS-EVIDENCE` item when its meaning depends on callers that have not been inspected; it is not a style violation merely because the reviewer prefers a longer name.

## Duplication Test

Duplicated knowledge is a violation only when the same business decision, validation, transformation, configuration, policy, or source of truth exists in more than one place and can diverge. Repeated markup, syntax, or visual structure alone is not a violation; report it only when it duplicates one responsibility and creates a concrete inconsistency or maintenance risk.

## Comment Test

Prefer code that explains itself. Keep comments only for facts code cannot express directly: hidden constraints, non-obvious ordering, compatibility/workaround reasoning, or important external assumptions.

Do not remove a comment before checking whether it captures one of those facts. When it merely explains an action, the smallest correction is normally to improve the code/name or remove the redundant comment—not to add another comment.

## Abstraction Test

Before proposing an abstraction, identify:

- concept being abstracted;
- independent reason it exists;
- contract created;
- improvement to caller/consumer clarity;
- existing abstractions checked and why they are insufficient.

Keep separate implementations when any of responsibility, contract, or reason to change differs. An abstraction that only hides parameter forwarding, a one-use trivial operation, or presentational similarity is forbidden even if it reduces lines.

## Cohesion and Locality Test

Treat a local workflow as coherent when its steps serve one outcome and change together. Report a defect only when a reader must cross unrelated helpers or concepts to recover a single responsibility, or when separate policies can change independently. Do not extract callbacks, selectors, or JSX fragments whose only identity is their location.

## Anti-Gaming

Do not refactor because a number feels high, a file looks unfamiliar, or a different style is preferred. Do not optimize for shorter code at the expense of comprehension.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

## Resolution Protocol

- **VIOLATION:** provide exact evidence, concrete maintenance risk, and focused correction.
- **LEGACY:** identify the out-of-scope defect; it MUST NOT justify new weak code.
- **EXCEPTION:** record explicit project authorization and exact scope. No convenience or inferred exceptions.
- **NEEDS-EVIDENCE:** identify missing caller/context evidence and the next concrete inspection. It remains unresolved until evidence is obtained or review is explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

An unresolved `NEEDS-EVIDENCE` item MUST NOT be silently converted to PASS. If required evidence cannot be obtained, final status is **INCOMPLETE**.

## User Decision Gate

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the review or implementation flow that depends on that item. Before any further affected action, present the user with:

1. the classification, exact evidence, applicable rule, and concrete impact;
2. one or more concrete correction or disposition options that stay within the authorized scope;
3. one explicitly recommended option and its justification.

Do not edit the affected code, accept a deviation, choose an option, convert the item to `PASS`, or continue to another target until the user makes an explicit decision. A proposed `EXCEPTION` also requires explicit user authorization and must use this same decision format.

Apply the same gate before choosing between materially different compliant alternatives, including scope, abstraction, or correction direction. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

## Evidence Standard

Every confirmed finding MUST include exact file/line, what the reader must infer, concrete maintenance risk, applicable rule/principle, and smallest semantic improvement. Retrospective PASS requires sufficient surrounding-context inspection.

## Handoffs

- Responsibility/layer → `architecture-review`.
- Hook/state → `hook-state-review`.
- Data/service → `data-boundary-review`.
- Structural complexity → `complexity-refactoring`.

The receiving Skill owns final disposition; no ping-pong without new evidence.

## Non-Goals

Do not refactor merely to make code look different. Do not force DRY, abstraction, comments, or naming conventions beyond project rules and semantic evidence.

## Final Review Gate

Before PASS/complete, confirm naming, comments, abstraction justification, cohesion, caller readability, duplication risk, existing-solution search, applicable enforcement, and resolution of all `NEEDS-EVIDENCE` items were inspected. A PASS means no defect was found in the inspected scope, not that the repository is universally clear. Unresolved required evidence produces INCOMPLETE.
