---
name: data-boundary-review
description: Review nino-app Services, query/domain Hooks, Page features, facades, routers, libraries, constants, types, and adapters for clean data flow, domain/transport separation, authoritative sources, and correct ownership.
---

# Data Boundary Review

## Purpose

Verify that transport, query/cache orchestration, domain policy, transformation, routing, and UI adaptation remain in their intended boundaries and that each concern has one authoritative owner.

## Scope

Apply this Skill to `apps/manager/src/{shared,services,hooks,router,loaders,providers,adapters,utils,constants,types,lib,states,pages,layouts}` and to Page-local `facades`, `hooks`, `states`, `operations`, `services`, `adapters`, `utils`, `constants`, and `types` involved in the traced integration path. Inspect `src/UI` only when legacy code participates in that path; it is not a destination for new or refactored code. This Skill does not replace the dedicated UI/state architecture Skills.

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
UI intent → domain component → composition-only facade → domain/query Hook → Adapter → Service/transport
```

3. For a read, identify query key, parameters, cache owner, error path, consuming facade/domain component, and representation received by the presentation layer. For a write, identify request type, mutation owner, success/failure behavior, and cache update/invalidation decision.
4. Determine whether the integration belongs to Page-level governance, a domain facade, a query/command Hook, or client-only feature state.
5. For each boundary, identify who owns validation, transport, domain policy, transformation, caching, and presentation adaptation.
6. Inspect callers/callees where ownership is ambiguous.
7. Search for existing authoritative types, services, adapters, constants, query keys, Hooks, and paths before proposing a new boundary.
8. Record each finding and disposition.

## Nino Boundary Contracts

The normative contracts are defined by `.agents/rules/data-boundaries.md`, `.agents/rules/hooks.md`, and `.agents/rules/architecture.md`.

- **`services/`:** owns named transport operations, endpoint/request construction, and transport errors through the shared HTTP client. It must not own React state, query cache, JSX, route selection, or UI feedback.
- **BFF/security:** `nino-api` is the BFF for every endpoint. Treat the client as untrusted; require server-side authentication, tenant resolution, membership/role authorization, resource ownership checks, field whitelisting, and authoritative derivation of sensitive values. Roles/Helms and client-provided `tenantId` or resource IDs never replace ownership enforcement. Explicit public endpoints must expose only intentionally public data. Audit the full controller → guard/context → service → repository → response path and require regression tests for cross-tenant access and IDOR risks.
- **domain/query Hooks:** own `useQuery`/`useMutation` orchestration, query-key use, cache invalidation/update decisions, and exposing async state to their authorized consumer. They must call an existing Service rather than recreate raw transport.
- **facade:** is the composition-only UI-facing domain boundary. It may select or rename ready values and expose existing command references from Hooks/stores. It must not validate, transform, branch, catch errors, await, or sequence behavior.
- **one facade per domain:** keep one canonical facade for each Page domain.
  It may compose multiple cohesive Hooks and store slices belonging to that
  domain. Split the underlying owners when needed, but do not create multiple
  facades merely because the domain has multiple responsibilities.
- **Page:** owns route/screen governance, macro composition, and screen-wide branches. It consumes its facade rather than Services, QueryClient, stores, or raw integration Hooks.
- **domain component:** owns one named visual/interaction region. It may consume the Page feature's facade and local UI state, but it must not consume Services, raw transport, QueryClient, stores, or raw integration Hooks.
- **Layout:** lives under `src/layouts`, owns persistent application chrome and route composition through `Outlet`, and must not own Page-specific behavior.
- **`router/routes.tsx`:** owns URL-to-route, nesting, route elements, and attaching guards/loaders. It must not contain domain mutation, persistence policy, or inline loader implementation when `loaders/` owns it.
- **`adapters/`:** own explicit representation conversion. They must not conceal domain policy, transport, or cache mutation.
- **`utils/`:** own narrow deterministic computation or platform interaction with a clear contract. They must not perform raw API transport, render JSX, or become a generic home for domain policy.
- **`constants/`:** own named immutable data/configuration only. They must not contain JSX, executable behavior, or hidden policy engines.
- **`types/`:** declare one named representation contract. Distinct DTO/domain/request/view-model types require an explicit translation owner.
- **`lib/`:** owns shared technical infrastructure such as a configured query client. It must not own feature-domain policy or route/UI decisions.

Allowed location is not proof of correct ownership. Do not move code, rename a file, add a wrapper, or add a type alias merely to satisfy this list.

## Integration Ownership Test

When Page UI consumes server/application data, ask:

1. Does the result govern the route/screen as a whole, such as access, redirect, top-level branch, or Page-level empty/error/loading state?
2. Which Hook owns the query or command lifecycle?
3. Which adapter owns representation conversion?
4. Is the facade only exposing a ready value or existing command reference?
5. Is client-only shared interaction state owned by the feature store and its operations?

The Page governs the screen, domain components own named regions, the facade composes integration, Hooks own async workflow/cache, and stores/operations own client-only transitions. Do not create a Container or move behavior into a facade merely to reduce Page or component line count.

## 9/10 Gates

Report a confirmed violation when evidence shows:

- Page or domain component consumes Services, QueryClient, Zustand, raw transport, or raw integration Hooks instead of its facade;
- facade owns validation, transformation, branching, error handling, async sequencing, or mutation-to-state workflow;
- Page owns query/mutation orchestration instead of governing screen composition and macro states;
- UI performs raw transport/business orchestration outside the approved boundary;
- a Service leaks presentation concerns or acts as a UI controller;
- an Adapter encodes business policy instead of representation mapping;
- domain policy is hidden in a generic utility, formatter, router, or transport helper;
- router modules implement business workflows, persistence policy, or domain mutation;
- constants contain executable behavior/JSX or become hidden policy engines;
- local types create a second source of truth without a real translation need;
- a supposedly generic utility depends on app-specific UI/domain knowledge;
- a new Service/Adapter/Utility/Hook duplicates an existing approved data path without a demonstrated requirement.

Do not report a violation merely because one composition-only facade exposes several Hooks/store slices that belong to the same Page domain, or because local React state remains in the component that owns the interaction.

## Source-of-Truth Test

For every important type, policy, or data transformation ask:

1. Where is the authoritative definition?
2. Is this unit consuming, transporting, translating, or redefining it?
3. If it translates, is the translation contract explicit?
4. Would a future policy change require editing multiple places?

Duplication is not automatically a defect when the second representation is a deliberate DTO/view model/adapter contract.

## Representation and Cache Test

For each deliberate second representation, record the source type, target type, translation owner, direction, and concrete reason their contracts differ.

For each Query path, verify that the key uniquely includes every data-shaping parameter, that an existing query-key factory is reused when available, and that the cache owner is a Hook rather than Page/facade/component/Service. For each mutation, require an explicit decision to invalidate/update affected cache or document why no cached data becomes stale.

## Router Test

Navigation and route selection may be route-specific. Business workflows, persistence policy, and domain mutation must remain outside route governance.

## Enforcement Map

Run applicable checks and interpret them narrowly. Architecture-boundary enforcement may prove that configured forbidden dependencies are absent, but it cannot prove facade purity, correct Hook cohesion, or the semantic owner of a transformation. Those decisions remain semantic review work.

## Boundary Test

Different reasons to change are evidence for separate ownership. Do not create boundaries merely because a file is large, and do not accept a boundary merely because code was moved into a file with the right suffix.

Prefer the narrowest stable owner whose contract matches the data/action, without bypassing the Page-feature dependency flow.

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

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the review or implementation flow that depends on that item. Before any further affected action, present classification, exact evidence, applicable rule, concrete impact, compliant options, and one recommended option. Do not silently choose between materially different compliant ownership directions.

## Evidence Standard

Every confirmed finding MUST include exact file/line, traced data path, current owner, expected owner, authoritative source/destination, impact, and minimal correction. Retrospective PASS requires enough dependency inspection to prove the data path considered.

## Handoffs

- Page/domain component/facade/Layout responsibility → `architecture-review`.
- Hook/state/effect ownership → `hook-state-review`.
- Naming/abstraction → `code-quality-review`.
- Structural decomposition → `complexity-refactoring`.
- Mechanical import/type/structure → `enforce-*`.

The receiving Skill owns the final disposition; no ping-pong without new evidence.

## Self-explanatory names

Service operations, query keys, Hooks, adapters, representations, commands,
parameters, fixtures, and tests must name the domain contract they carry.
Reject generic names such as `getData`, `process`, `payload`, `result`,
`handler`, and `helper` when they hide ownership or behavior.

## Non-Goals

Do not create facade callbacks or wrapper components merely to relocate code. Do not duplicate domain types just to avoid an import. Do not treat every mapping function as a new architectural layer. Do not demand cache invalidation or an Adapter where no concrete affected cache/representation boundary exists.

## Final Review Gate

Before PASS, confirm authoritative sources, end-to-end path, Page/component/facade/Hook/store ownership, facade purity, ownership of each transformation/policy, boundary direction, caller evidence, duplicate-source risk, cache/error behavior when applicable, presentation-layer decoupling, and objective enforcement results were inspected. A PASS applies only to the traced scope; unresolved required evidence produces **INCOMPLETE**.
