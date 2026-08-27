---
name: architecture-review
description: Review nino-app domain-first Page features, Layouts, facades, components, Hooks, state, responsibility boundaries, and cross-layer behavior. Use when semantic judgment is required beyond enforce-* checks.
---

Facade gate (9/10 rule): Pages and Page components always access data and
commands through a screen-specific facade, never through raw integration
Hooks. Creating one facade per domain is not mandatory. The facade must provide
a real UI contract; `return useX()`, `() => useX()`, a spread/rename-only
wrapper, and a wrapper without composition are pass-through patterns and do not
justify a facade.

# Architecture Review

## Purpose

Determine whether each UI/application unit owns the right responsibility at the right layer. Review behavior and dependency direction, not folder names alone.

## Authority

Apply `AGENTS.md`, applicable `.agents/rules/*`, then objective `enforce-*` results. A mechanical violation is a defect, not a semantic preference. Existing code is evidence, never permission.

## External Authorities and Project Model

- Application Shell model: https://developer.chrome.com/docs/workbox/app-shell-model
- React Router layout routes: https://reactrouter.com/start/declarative/routing

Nino uses a domain-first Page-feature architecture. Atomic Design and `src/UI`
are legacy, not destinations for new or refactored code. The implemented
reference is `references/catalog-page-model.md`; read it completely for every
construction, edit, refactor, or audit under `apps/manager/src/pages/**`.
Layouts are direct children of `src` and own persistent chrome plus route
composition around the active Page.

## Mandatory Review Sequence

1. Define the review scope and affected UI/application units.
2. Read the applicable architecture, hooks, and data-boundary rules.
3. Inspect the target unit completely enough to understand its public contract.
4. Inspect immediate callers/callees when ownership is ambiguous.
5. Determine the unit's actual responsibility from behavior, not location or name.
6. Classify the unit as Page, domain component, composition-only facade, Hook, store/operation, Adapter, Service, shared unit, or Layout according to `.agents/rules/architecture.md`.
7. Compare imports, rendered children, state, effects, data access, decisions, and exposed API with that category.
8. When the target is a Page (new, edited, or under audit), list every direct
   JSX child in its return statement and give each one an explicit
   disposition: route governance, one facade invocation, a macro-state
   branch, a named domain component, or a shell primitive carrying no static
   copy of its own. A DS primitive rendering literal text (a `Heading`,
   `Text`, `Label`, even one word) is content, not shell, and fails this step
   regardless of size. Do not classify the unit as `Page`-compliant until
   every listed child has a disposition; a passing mechanical check in step 11
   does not substitute for this enumeration — it does not inspect JSX content
   depth.
9. For every Page feature, trace Page → domain components → facade → Hooks/store → adapters/Services or operations.
10. Verify facade purity and that Page/domain components do not bypass it to consume raw integration dependencies.
11. Run `node .agents/enforcement/check-architecture-boundaries.mjs apps/manager/src` when the reviewed scope is in `apps/manager`; record its exact result.
12. Check whether a proposed correction restores ownership or merely relocates code.
13. Record each finding and final disposition.

## Mechanical Boundary Evidence

Interpret the architecture checker narrowly:

- exit `0` proves only that its configured import-boundary policy found no blocking violation;
- exit `1` confirms the reported policy violation. Classify a finding that intersects the review scope as `VIOLATION` or `LEGACY` according to scope; record unrelated results as mechanical context, without treating the target as a clean PASS;
- exit `2` is `NEEDS-EVIDENCE`/incomplete because local source imports could not be resolved or policy execution failed.

The checker enforces configured composition and prohibited integration access. It does not determine responsibility, facade purity, Hook cohesion, business-logic ownership, or whether a permitted import is a good design. Never turn a checker pass into a semantic PASS.

For a Page feature, also run `node .agents/enforcement/check-page-governance.mjs
apps/manager/src/pages/<Feature>`. Any result other than exit `0` is blocking
evidence. A pass proves only the allowlisted Page source shape; the semantic
review must still inspect every named child for real responsibility ownership.

## Layer Contract

- **Page:** concrete route/context and screen-governance layer. It owns params, redirects, access, macro composition, and Page-level loading/error/empty branches. It consumes its facade instead of raw Hooks, stores, Services, or QueryClient. Accept it only when its source is reducible to route/access decisions, one facade invocation, macro-state branches, root-shell markup, and an ordered screen map. A domain `.map`, form wiring, table/list row markup, named visual region, region handler/state, formatter, validator, payload builder, or workflow helper is a delegation signal even when written with DS primitives.
- **domain component:** one self-explanatory visual/interaction region inside a Page feature. It may consume the feature facade and own local UI state. It does not own transport, cache, store access, or raw integration Hooks.
- **facade:** composition-only UI-facing domain boundary. It may select or rename ready values and expose existing command references. It never validates, transforms, branches, catches errors, awaits, creates callbacks, or sequences behavior.
- **one facade per domain when needed:** a Page domain may have one canonical
  facade when it composes several cohesive responsibilities such as queries,
  client state, selection, status, and mutation commands. This is not a reason
  to invent a facade for a single-consumer workflow; the 9/10 rule gate below
  wins and pass-through facades must be removed.
- **query/command Hook:** owns React Query, async workflow, mutation lifecycle, cache decisions, and coordination that crosses integration boundaries.
- **store/operation:** the store declares state and delegates deterministic
  client-only transitions; each meaningful transition lives in one operation
  under `states/<state>/operations/<operation>/`. Operations are scoped to
  their owning state, never collected in a root `states/operations/` folder.
  Neither store nor operation mirrors server data or calls Services/QueryClient.
- **Adapter:** owns pure request, response, domain, or view representation conversion.
- **Service:** owns named API transport through the shared HTTP client.
- **Layout:** direct child of `src`; owns persistent application chrome and route composition through `Outlet`, never Page-specific behavior.
- **shared unit:** reusable across Page domains and forbidden from importing Page internals.

The exact dependency direction is defined by the normative architecture rule, not by this Skill.

## Cross-domain ownership gate

For every resource touched during construction, editing, or audit, inspect its
actual consumers before deciding its location. A resource required by more than
one Page domain MUST live in the corresponding approved `src/shared` boundary
and be consumed by each domain from that shared contract. This includes
components, Hooks, Services, adapters, utilities, types, state resources, and
other domain-supporting files. A resource exclusive to one Page remains inside
that Page domain. Duplication, aliases, re-export bridges, and wrapper
components do not satisfy this rule and must not hide shared ownership.

When a component or other resource is moved or promoted to `src/shared`, the
destination boundary requires a fresh audit. For a shared TSX component, run
the complete `audit-components` review, including every rendered JSX tag and
its DS-first decision. A prior Page or composition audit does not transfer
across an ownership change.

External-dependency ownership is part of every Page review. Inspect all
components and supporting resources imported from outside the Page domain,
including legacy `src/UI` resources. If a resource serves more than one Page
domain, its `src/UI` location is an ownership violation and the resource MUST
be owned by `src/shared`; legacy status never makes it ignorable. Trace and
classify its transitive dependencies before closing the review.

## Page Region Map

Before deciding component boundaries, map the
screen's macro composition from top to bottom:

```text
Header  → navigation, identity, summary, and contextual controls
Content → the main screen task, sections, lists, panels, or tabs
Footer  → page-specific closing actions or supplementary controls, when present
```

Treat these as semantic boundaries, not an automatic requirement for HTML
elements or wrappers. Do not flatten substantial regions just because a
Page-level query provides their data. Review whether each region has one stable
reason to change and whether representing it with a self-explanatory domain component
would make the Page's macro composition clearer.

A domain component must own a real Header, Content, Footer, section, list, or
dialog responsibility. Reject generic wrappers, one-child pass-through
components, and names such as `ContentComponent` that conceal unrelated
regions. Integration flows through the composition-only feature facade.

## Page Feature Ownership Test

For each Page integration, ask:

1. Does this data/action decide whether the screen, a major Page branch, access rule, redirect, or Page-level state exists?
2. Which domain component presents or triggers it?
3. Which Hook owns its async/cache behavior?
4. Is the facade only exposing ready values or existing commands?
5. Does any client-only shared state belong to a feature store/operation?

Do not extract a component merely because the Page is long. A domain component is valid only when it has one coherent named responsibility and a distinct reason to change.

Examples:

```text
usePermissions() controls whether the whole screen is accessible → Page governance Hook/facade value
useOrders() owns orders server state → query Hook exposed by the facade to OrdersList
useOrderDetails(id) owns details server state → query Hook exposed by the facade to OrderDetails
```

## Domain Component Test

A domain component may own rich local UI behavior such as expansion, selection, disclosure, focus, drag/drop presentation state, or similar interaction.

It MUST NOT own:

- TanStack Query/domain integration Hooks;
- Zustand/application-state Hooks;
- Services/API clients;
- server/cache invalidation decisions;
- domain/business decisions;
- route/screen governance.

If a domain component needs remote/application data, require ready values/actions through its feature facade.

## Classification and Correction Test

Classify from the smallest coherent responsibility, then apply the dependency matrix; never choose a category to legalize an intended import. An extraction is valid only when it gives the extracted unit a stable responsibility and leaves the caller with clearer ownership.

Reject as a workaround an empty facade, bridge component, category rename, barrel/alias/wrapper that hides a forbidden edge, or moving a dependency to non-TSX without preserving the boundary. Treat the current app's conflicting imports as legacy evidence, never as a new precedent.

For a Layout, distinguish persistent application chrome from Page-specific visual composition. A shell may directly compose lower layers required by its chrome; reject the dependency only when the unit belongs to the active Page or introduces route-specific feature behavior.

## 9/10 Gates

Before creating a facade, apply the 9/10 rule: in nine out of ten cases, a
facade wrapping a single Hook is only a pass-through layer. Mentally remove the
facade: if the consumer would only replace `useFacade()` with `useHook()`
without losing ownership, composition, or encapsulation, do not create it.
Accept the layer only when it provides real composition of two or more cohesive
sources and a UI contract that hides their integration.

Report a confirmed violation when evidence shows at least one of:

- responsibility belongs to another architectural category;
- a boundary hides materially different reasons to change;
- a Page or domain component crosses the facade to consume a prohibited application/server-state/infrastructure dependency;
- a facade owns callbacks, validation, transformation, branching, error handling, awaiting, or command sequencing;
- a Page owns query/mutation/store orchestration instead of screen governance;
- a Layout contains Page-specific behavior;
- a boundary change would only move coupling without improving ownership;
- the public contract is misleading enough that correct reuse/extension decisions require reconstructing unrelated context.

Do **not** report a violation solely because:

- a file is large;
- a Page consumes one or more endpoint Hooks when those results genuinely govern Page-level rendering;
- a composition-only facade exposes multiple cohesive feature Hooks/store slices;
- a UI unit has several sequential steps in one coherent workflow;
- an alternate architecture is imaginable;
- a folder/name is unconventional but behavior is correct.

Do **not** require an artificial wrapper or layer merely to satisfy a visual hierarchy.

## Boundary Test

Ask: **what has the same reason to change?** Responsibilities with materially different reasons to change should not be forced behind one boundary. Conversely, do not split a coherent workflow merely because it contains several steps.

For Page-feature boundaries also ask: **what is the scope of the decision?** Screen-wide governance belongs to Page; presentation/local interaction belongs to domain components; integration composition belongs to the facade; async/cache behavior belongs to Hooks.

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

Apply the same gate before choosing between materially different compliant alternatives, including scope, layer classification, ownership, or correction direction. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

A `NEEDS-EVIDENCE` item MUST name the missing evidence and the next concrete inspection. It remains unresolved until that evidence is obtained or the review is explicitly closed as incomplete.

A review MUST NOT end by silently converting `NEEDS-EVIDENCE` into `PASS`. If required evidence cannot be obtained, the final status is **INCOMPLETE**.

An `EXCEPTION` without explicit authorization is not an exception; classify it as `NEEDS-EVIDENCE` until authorization is established.

## Evidence Standard

A confirmed finding MUST include exact file/line, observed behavior, current owner/category, expected owner/category, violated rule, impact, and the smallest correction that restores the boundary.

For retrospective audits, inspect the complete relevant unit and required dependency context before reporting a clean PASS.

## Handoffs

- Mechanical import/type/CSS/structure rule → corresponding `enforce-*`.
- Page/domain component/facade/Hook/store/Adapter/Service/Layout responsibility → `architecture-review`.
- Hook/state/effect/provider ownership → `hook-state-review`.
- API/service/router/adapter/data flow → `data-boundary-review`.
- Naming/cohesion/abstraction → `code-quality-review`.
- Complexity-driven decomposition → `complexity-refactoring`.

The receiving Skill owns the final disposition. Do not bounce a finding back without new evidence.

## Non-Goals

Do not create layers for convenience, introduce speculative abstractions, or use folder structure as proof. Do not fix code during review unless implementation was explicitly requested.

Do not introduce Atomic Design categories, `src/UI`, or Containers in new or refactored Page features. Direct Page → domain-component composition is valid; integration remains behind the feature facade.

## Self-explanatory names and code

Folders, files, exports, facade fields, commands, state, operations, props,
fixtures, and tests must communicate domain and responsibility without opening
unrelated files. Do not use comments to compensate for unclear names or
structure; follow the comment policy in `.agents/rules/coding.md`.

## Final Review Gate

Before PASS/complete, confirm scope was fully inspected, applicable enforcement was considered, every finding has a disposition, Page/component/facade/Hook/store ownership was checked where integration exists, facade purity was checked, no mechanical failure was reclassified as subjective, all `NEEDS-EVIDENCE` items are resolved or explicitly reported as INCOMPLETE, and proposed corrections restore responsibility instead of relocating it.
