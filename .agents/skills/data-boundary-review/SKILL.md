---
name: data-boundary-review
description: Review nino-app services, routers, libraries, constants, types, and adapters for clean data flow, domain/transport separation, authoritative sources, and correct ownership.
---

# Data Boundary Review

## Purpose

Verify that transport, domain policy, transformation, caching, routing, and UI adaptation remain in their intended boundaries and that each concern has one authoritative owner.

## Scope

Apply this Skill to `apps/manager/src/{services,hooks,router,loaders,adapters,utils,constants,types,lib,states}` and their direct consumers when reviewing a data path. It does not replace the dedicated UI, state, or architecture Skills for concerns outside that path.

## Authority

Apply `AGENTS.md`, `.agents/rules/data-boundaries.md`, other applicable `.agents/rules/*`, then objective `enforce-*` results and package-local constraints. Mechanical failures are hard defects.

## External Foundations and Nino Decisions

- React Router routes connect URL segments, route elements, nested routes, and `Outlet` composition: https://reactrouter.com/start/declarative/routing
- TanStack Query caches server data by query keys and supports mutation-driven invalidation: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys and https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations

All ownership boundaries below are Nino decisions. The library documentation explains mechanisms, not permission to place business policy, transport, or presentation in another layer.

## Mandatory Review Sequence

1. Inspect the target unit completely enough to identify its public contract.
2. Trace one representative end-to-end read or write path:

```text
UI intent → Page/Hook/state → Service/transport → representation mapping → consumer
```

3. For a read, identify query key, parameters, cache owner, error path, and representation received by the UI. For a write, identify request type, mutation owner, success/failure behavior, and cache update or invalidation decision.
4. For each boundary, identify who owns validation, transport, domain policy, transformation, caching, and presentation adaptation.
5. Inspect callers/callees where ownership is ambiguous.
6. Search for existing authoritative types, services, adapters, constants, query keys, and paths before proposing a new boundary.
7. Record each finding and disposition.

## Nino Boundary Contracts

The normative contracts are defined by `.agents/rules/data-boundaries.md`.
Use this section to guide the review; do not reinterpret it as an alternative
source of authority.

- **`services/`:** owns named transport operations, endpoint/request construction, and transport errors through the shared HTTP client. It must not own React state, query cache, JSX, route selection, or UI feedback.
- **domain/query Hooks:** own `useQuery`/`useMutation` orchestration, query-key use, cache invalidation or update decisions, and exposing async state to their consumer. They must call an existing Service rather than recreate raw transport.
- **`router/routes.tsx`:** owns URL-to-route, nesting, route elements, and attaching guards/loaders. It must not contain domain mutation, persistence policy, or inline loader implementation when `loaders/` owns it.
- **`adapters/`:** own explicit representation conversion, including a UI-oriented result when JSX is genuinely the adapter's contract. They must not conceal domain policy, transport, or cache mutation.
- **`utils/`:** own narrow deterministic computation or platform interaction with a clear contract. They must not perform raw API transport, render JSX, or become a generic home for domain policy.
- **`constants/`:** own named immutable data/configuration only. They must not contain JSX, executable behavior, or a policy engine hidden behind a data-shaped export.
- **`types/`:** declare one named representation contract. They must not create a duplicate merely to avoid an import; distinct DTO, domain, request, and view-model types require an explicit translation owner.
- **`lib/`:** owns shared technical infrastructure such as a configured query client. It must not own a feature's domain policy or route/UI decision.

Allowed location is not proof of correct ownership. Do not move code, rename a file, add a wrapper, or add a type alias merely to satisfy this list.

## 9/10 Gates

Report a confirmed violation when evidence shows:

- UI performs raw transport/business orchestration outside the approved boundary;
- a Service leaks presentation concerns or acts as a UI controller;
- an Adapter encodes business policy instead of representation mapping;
- domain policy is hidden in a generic utility, formatter, router, or transport helper;
- router modules implement business workflows, persistence policy, or domain mutation;
- constants contain executable behavior/JSX or become hidden policy engines;
- local types create a second source of truth without a real translation need;
- a supposedly generic utility depends on app-specific UI/domain knowledge;
- the boundary exists only in filename/location while actual dependencies violate it;
- a new Service/Adapter/Utility duplicates an existing approved data path without a demonstrated requirement.

## Source-of-Truth Test

For every important type, policy, or data transformation ask:

1. Where is the authoritative definition?
2. Is this unit consuming, transporting, translating, or redefining it?
3. If it translates, is the translation contract explicit?
4. Would a future policy change require editing multiple places?

Duplication is not automatically a defect when the second representation is a deliberate DTO/view model/adapter contract.

## Representation and Cache Test

For each deliberate second representation, record the source type, target type, translation owner, direction, and the concrete reason their contracts differ. A DTO is transport-facing; a domain type represents application meaning; a view model/adaptor result represents consumer/UI needs. Do not use one as a disguised alias for another.

For each Query path, verify that the key uniquely includes every data-shaping parameter, that an existing query-key factory is reused when available, and that the cache owner is a Hook rather than a Service. For each mutation, require an explicit decision to invalidate/update affected cache or document why no cached data becomes stale. A missing invalidation is a violation only when a concrete affected cache entry exists; do not impose invalidation ritualistically.

## Router Test

Navigation and route selection may be route-specific. Business workflows, persistence policy, and domain mutation must remain outside route governance.

## Enforcement Map

Run applicable checks and interpret them narrowly:

- `enforce-services` detects `useState`, raw HTTP calls, and generic Service operation names; it does not prove transport/domain separation.
- `enforce-router` limits router writes to `routes.tsx`/tests and rejects inline loaders and generic paths; it does not prove route behavior is correct.
- `enforce-utils-adapters` rejects JSX or raw API calls in `utils/` and generic exports; it does not decide whether an Adapter's mapping is appropriate.
- `enforce-constants` rejects JSX and generic constant names; it cannot determine whether data conceals a policy.
- `enforce-types` rejects default exports, `any`, and type barrels; both `type` and `interface` remain allowed for accurate contracts. It cannot determine authoritative ownership or runtime transport validity.

Run the hooks relevant to changed paths. Treat a mechanical pass as evidence only for its listed invariants; semantic ownership, cache correctness, and representation intent still require this Skill.

## Boundary Test

Different reasons to change are evidence for separate ownership. Do not create boundaries merely because a file is large, and do not accept a boundary merely because code was moved into a file with the right name.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must state which path, caller, authoritative source, or rule remains unresolved.

## Resolution Protocol

- **VIOLATION:** provide the evidence and required correction.
- **LEGACY:** identify the out-of-scope violation; it MUST NOT justify new code.
- **EXCEPTION:** record explicit project authorization and exact scope. No inferred or convenience exceptions.
- **NEEDS-EVIDENCE:** name the missing evidence and the next concrete inspection. It remains unresolved until evidence is obtained or review is explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

An unresolved `NEEDS-EVIDENCE` item MUST NOT be silently treated as PASS. If required evidence cannot be obtained, final status is **INCOMPLETE**.

## User Decision Gate

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the review or implementation flow that depends on that item. Before any further affected action, present the user with:

1. the classification, exact evidence, applicable rule, and concrete impact;
2. one or more concrete correction or disposition options that stay within the authorized scope;
3. one explicitly recommended option and its justification.

Do not edit the affected code, accept a deviation, choose an option, convert the item to `PASS`, or continue to another target until the user makes an explicit decision. A proposed `EXCEPTION` also requires explicit user authorization and must use this same decision format.

Apply the same gate before choosing between materially different compliant alternatives, including scope, source-of-truth ownership, or correction direction. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

## Evidence Standard

Every confirmed finding MUST include exact file/line, traced data path, current owner, expected owner, authoritative source/destination, impact, and minimal correction. Retrospective PASS requires enough dependency inspection to prove the data path considered.

## Handoffs

- UI layer → `architecture-review`.
- Hook/state → `hook-state-review`.
- Naming/abstraction → `code-quality-review`.
- Structural decomposition → `complexity-refactoring`.
- Mechanical import/type/structure → `enforce-*`.

The receiving Skill owns the final disposition; no ping-pong without new evidence.

## Non-Goals

Do not create layers merely to relocate code. Do not duplicate domain types just to avoid an import. Do not treat every mapping function as a new architectural layer.

Do not demand DTOs, adapters, cache invalidation, or new query-key factories where the path has no distinct representation, cached query, or reusable contract.

## Final Review Gate

Before PASS, confirm authoritative sources, end-to-end path, ownership of each transformation/policy, boundary direction, caller evidence, duplicate-source risk, cache/error behavior when applicable, and objective enforcement results were inspected. A PASS applies only to the traced scope; unresolved required evidence produces **INCOMPLETE**.
