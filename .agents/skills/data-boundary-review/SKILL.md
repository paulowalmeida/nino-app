---
name: data-boundary-review
description: Review nino-app services, query/domain hooks, Containers/Pages, routers, libraries, constants, types, and adapters for clean data flow, domain/transport separation, authoritative sources, and correct ownership.
---

# Data Boundary Review

## Purpose

Verify that transport, query/cache orchestration, domain policy, transformation, routing, and UI adaptation remain in their intended boundaries and that each concern has one authoritative owner.

## Scope

Apply this Skill to `apps/manager/src/{services,hooks,router,loaders,adapters,utils,constants,types,lib,states}`, plus directly involved `UI/containers` and `UI/pages` when reviewing who consumes an integration path. It does not replace the dedicated UI/state architecture Skills.

## Authority

Apply `AGENTS.md`, `.agents/rules/data-boundaries.md`, `.agents/rules/architecture.md`, `.agents/rules/hooks.md`, other applicable rules, then objective `enforce-*` results and package-local constraints. Mechanical failures are hard defects.

## External Foundations and Nino Decisions

- React Router routes connect URL segments, route elements, nested routes, and `Outlet` composition: https://reactrouter.com/start/declarative/routing
- TanStack Query caches server data by query keys and supports mutation-driven invalidation: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys and https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations

All ownership boundaries below are Nino decisions. Library documentation explains mechanisms, not permission to place business policy, transport, cache, or presentation in another layer.

## Mandatory Review Sequence

1. Inspect the target unit completely enough to identify its public contract.
2. Trace one representative end-to-end read or write path:

```text
UI intent → Page/Container → domain/query Hook → Service/transport → representation mapping → presentation consumer
```

3. For a read, identify query key, parameters, cache owner, error path, consuming Page/Container, and representation received by the presentation layer. For a write, identify request type, mutation owner, success/failure behavior, and cache update/invalidation decision.
4. Determine whether the integration belongs to Page governance or one coherent Container region.
5. For each boundary, identify who owns validation, transport, domain policy, transformation, caching, and presentation adaptation.
6. Inspect callers/callees where ownership is ambiguous.
7. Search for existing authoritative types, services, adapters, constants, query keys, Hooks, and paths before proposing a new boundary.
8. Record each finding and disposition.

## Nino Boundary Contracts

The normative contracts are defined by `.agents/rules/data-boundaries.md`, `.agents/rules/hooks.md`, and `.agents/rules/architecture.md`.

- **`services/`:** owns named transport operations, endpoint/request construction, and transport errors through the shared HTTP client. It must not own React state, query cache, JSX, route selection, or UI feedback.
- **domain/query Hooks:** own `useQuery`/`useMutation` orchestration, query-key use, cache invalidation/update decisions, and exposing async state to their authorized consumer. They must call an existing Service rather than recreate raw transport.
- **Container:** owns one coherent screen-region integration boundary. It consumes approved domain/query Hooks and converts their results into presentation-ready data, flags, and callbacks for Organisms/Molecules/Atoms. It must not perform raw transport or own cache/domain policy.
- **Page:** owns route/screen governance. It may consume a domain/query Hook only when the result controls Page-level access, routing, screen state, or whether major screen elements/Containers render. Region-specific integration belongs in a Container.
- **Organism/Molecule/Atom:** presentation only. They may receive values/status/callbacks; they must not consume domain/query Hooks, Services, Zustand, or APIs directly.
- **`router/routes.tsx`:** owns URL-to-route, nesting, route elements, and attaching guards/loaders. It must not contain domain mutation, persistence policy, or inline loader implementation when `loaders/` owns it.
- **`adapters/`:** own explicit representation conversion. They must not conceal domain policy, transport, or cache mutation.
- **`utils/`:** own narrow deterministic computation or platform interaction with a clear contract. They must not perform raw API transport, render JSX, or become a generic home for domain policy.
- **`constants/`:** own named immutable data/configuration only. They must not contain JSX, executable behavior, or hidden policy engines.
- **`types/`:** declare one named representation contract. Distinct DTO/domain/request/view-model types require an explicit translation owner.
- **`lib/`:** owns shared technical infrastructure such as a configured query client. It must not own feature-domain policy or route/UI decisions.

Allowed location is not proof of correct ownership. Do not move code, rename a file, add a wrapper, or add a type alias merely to satisfy this list.

## Page vs. Container Data Ownership Test

When a Page consumes server/application data, ask:

1. Does the result govern the route/screen as a whole, such as access, redirect, top-level branch, or Page-level empty/error/loading state?
2. Or is the data/action meaningful primarily to one coherent semantic region?

Use the Page for the first case and the narrowest coherent Container for the second.

Do not create a Container solely to reduce line count. Do not leave region-specific queries in a Page solely because the Page is already the consumer.

## 9/10 Gates

Report a confirmed violation when evidence shows:

- Atom/Molecule/Organism consumes domain/query Hooks, Services, Zustand, or raw transport;
- Page owns region-specific query/mutation orchestration despite a clear coherent Container boundary;
- Container combines unrelated integration responsibilities or owns route-level governance;
- UI performs raw transport/business orchestration outside the approved boundary;
- a Service leaks presentation concerns or acts as a UI controller;
- an Adapter encodes business policy instead of representation mapping;
- domain policy is hidden in a generic utility, formatter, router, or transport helper;
- router modules implement business workflows, persistence policy, or domain mutation;
- constants contain executable behavior/JSX or become hidden policy engines;
- local types create a second source of truth without a real translation need;
- a supposedly generic utility depends on app-specific UI/domain knowledge;
- a new Service/Adapter/Utility/Hook duplicates an existing approved data path without a demonstrated requirement.

Do not report a violation merely because a Container consumes several Hooks when those Hooks serve one coherent region, or because a Page consumes a query whose result genuinely controls Page-level governance.

## Source-of-Truth Test

For every important type, policy, or data transformation ask:

1. Where is the authoritative definition?
2. Is this unit consuming, transporting, translating, or redefining it?
3. If it translates, is the translation contract explicit?
4. Would a future policy change require editing multiple places?

Duplication is not automatically a defect when the second representation is a deliberate DTO/view model/adapter contract.

## Representation and Cache Test

For each deliberate second representation, record the source type, target type, translation owner, direction, and concrete reason their contracts differ.

For each Query path, verify that the key uniquely includes every data-shaping parameter, that an existing query-key factory is reused when available, and that the cache owner is a Hook rather than Page/Container/Service. For each mutation, require an explicit decision to invalidate/update affected cache or document why no cached data becomes stale.

## Router Test

Navigation and route selection may be route-specific. Business workflows, persistence policy, and domain mutation must remain outside route governance.

## Enforcement Map

Run applicable checks and interpret them narrowly. Architecture-boundary enforcement may prove that presentation layers do not reach configured integration directories, but it cannot prove that a Page query belongs at Page scope or that a Container is cohesive. Those decisions remain semantic review work.

## Boundary Test

Different reasons to change are evidence for separate ownership. Do not create boundaries merely because a file is large, and do not accept a boundary merely because code was moved into a file with the right suffix.

For Page/Container decisions, prefer the narrowest stable owner whose semantic scope matches the data/action.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must state which path, caller, authoritative source, or rule remains unresolved.

## Resolution Protocol

- **VIOLATION:** provide evidence and required correction.
- **LEGACY:** identify the out-of-scope violation; it MUST NOT justify new code.
- **EXCEPTION:** record explicit project authorization and exact scope. No inferred convenience exceptions.
- **NEEDS-EVIDENCE:** name missing evidence and next concrete inspection.
- **PASS:** only after the Final Review Gate is satisfied.

## User Decision Gate

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the review or implementation flow that depends on that item. Before any further affected action, present classification, exact evidence, applicable rule, concrete impact, compliant options, and one recommended option. Do not silently choose between materially different compliant Page/Container ownership directions.

## Evidence Standard

Every confirmed finding MUST include exact file/line, traced data path, current owner, expected owner, authoritative source/destination, impact, and minimal correction. Retrospective PASS requires enough dependency inspection to prove the data path considered.

## Handoffs

- Atom/Molecule/Organism/Container/Page/Layout responsibility → `architecture-review`.
- Hook/state/effect ownership → `hook-state-review`.
- Naming/abstraction → `code-quality-review`.
- Structural decomposition → `complexity-refactoring`.
- Mechanical import/type/structure → `enforce-*`.

The receiving Skill owns the final disposition; no ping-pong without new evidence.

## Non-Goals

Do not create Containers merely to relocate code. Do not duplicate domain types just to avoid an import. Do not treat every mapping function as a new architectural layer. Do not demand cache invalidation or an Adapter where no concrete affected cache/representation boundary exists.

## Final Review Gate

Before PASS, confirm authoritative sources, end-to-end path, Page-vs-Container consumer ownership, ownership of each transformation/policy, boundary direction, caller evidence, duplicate-source risk, cache/error behavior when applicable, presentation-layer decoupling, and objective enforcement results were inspected. A PASS applies only to the traced scope; unresolved required evidence produces **INCOMPLETE**.
