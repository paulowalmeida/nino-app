# Data Boundary Rules

This file defines **mandatory implementation constraints** for data flow, transport,
routing, representations, shared technical infrastructure, and authorized UI/application
consumers in the Nino application.

When a rule in this file applies, the agent **MUST** obey it. The absence of explicit
permission **MUST NOT** be interpreted as permission to create an exception.

## Scope and Authority

The primary data/integration scope is:

```text
apps/manager/src/{services,hooks,router,loaders,providers,adapters,utils,constants,types,lib,states}
```

Consumer ownership additionally includes:

```text
apps/manager/src/UI/{containers,pages,layouts,organisms,molecules,atoms}
```

Apply `AGENTS.md`, this rule, `rules/architecture.md`, `rules/hooks.md`, and relevant layer rules. Existing code is evidence, never permission: a conflicting implementation is legacy and MUST NOT become precedent for new or modified code.

## External Foundations and Nino Decisions

React Router defines routes as URL-to-element/nesting configuration and renders child routes through an `Outlet`:

```text
https://reactrouter.com/start/declarative/routing
```

TanStack Query caches server data by query key; every data-shaping variable must be in the key, and mutations may invalidate affected queries:

```text
https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
```

The ownership boundaries below are Nino decisions. External library mechanics MUST NOT be interpreted as permission to move transport, domain policy, cache, or presentation responsibility to another layer.

## Authoritative Boundary Matrix

```text
services/          → named domain transport operations through the shared API
domain/query Hooks → query/mutation orchestration and cache decisions
Container          → scoped screen-region integration consumer/orchestrator
Page               → route/screen governance consumer only when integration affects Page scope
router/routes.tsx  → URL, nesting, route elements, guards, and loader links
loaders/           → route-time data/redirect decisions
providers/         → composition of approved application providers
adapters/          → explicit representation conversion
utils/             → narrow deterministic computation or platform interaction
constants/         → immutable named data/configuration
types/             → named representation contracts
lib/               → shared technical infrastructure
```

Atoms, Molecules, and Organisms are presentation layers and MUST NOT directly consume domain/query Hooks, Services, Zustand, or APIs. They receive presentation-ready values, status flags, and callbacks from authorized boundaries.

An allowed folder or suffix is not proof of correct ownership. The agent MUST NOT move code, add a wrapper, or duplicate a type merely to appear compliant.

## Services and Transport

Each Service operation MUST have a specific domain name and own only endpoint, request, and response transport for that operation.

Services MUST use the application's shared API client exported by `services/http.service.ts`. A Service MUST NOT call `fetch`, Axios, Ky, or another raw HTTP client directly. Multipart requests MUST use the shared API client's approved operation; a missing capability MUST be added to the shared client rather than bypassed locally.

Services MUST NOT own React state, query cache mutation/invalidation, JSX, route selection, toast/UI feedback, or domain workflow policy. Services MAY construct request bodies and endpoint paths required by their named operation.

The application `services/http.service.ts` is the sole composition point for shared HTTP client configuration. Feature Services MUST NOT create another HTTP client or alter session/error behavior.

## Query and Domain Hooks

Hooks that use TanStack Query MUST call an existing Service rather than recreate raw transport. They own `useQuery`/`useMutation` orchestration, async-state exposure, and the cache decision for their operation.

A query key MUST uniquely include every parameter that changes returned data. Existing query-key factories MUST be reused when they cover the query. For a mutation that makes a known cached query stale, the Hook MUST explicitly invalidate or update that cache. No invalidation is required when no affected cached query exists.

Hooks MUST NOT place server data in Zustand merely because both are accessed through Hooks. Zustand ownership remains governed by `rules/hooks.md`.

## Container Consumer Boundary

A Container is the preferred direct consumer of domain/query Hooks when the integration belongs to one coherent semantic region of a screen.

A Container MAY:

- call approved domain/query Hooks;
- consume authorized application state;
- combine related async states/actions for one coherent region;
- map Hook results into presentation-ready props/callbacks for Organisms, Molecules, or Atoms.

A Container MUST NOT:

- call raw HTTP APIs;
- duplicate Service transport;
- own cache policy that belongs in a query/domain Hook;
- own domain/business policy that belongs elsewhere;
- combine unrelated screen regions merely to reduce Page code;
- own route-level governance that determines the screen as a whole.

## Page Consumer Boundary

A Page MAY directly consume a domain/query Hook only when the result is required for route/screen governance, including examples such as:

- access/permission decisions for the screen;
- redirects;
- Page-level not-found/error/loading/empty decisions;
- determining whether a major screen branch or Container should render.

A Page MUST NOT absorb region-specific query/mutation orchestration merely because it is the route component. If one coherent region independently owns that integration, use the narrowest appropriate Container.

Page and Container consumers MUST still leave transport, query keys, cache mutation/invalidation, and domain transformation with their authoritative Service/Hook/Adapter owners.

## Presentation Boundary

Atoms, Molecules, and Organisms MUST NOT directly or indirectly consume:

- domain/query Hooks;
- Zustand/application-state Hooks;
- Services;
- API clients/raw transport.

They MAY use local React state and presentation-only Hooks such as approved `hooks/ui` behavior when those dependencies do not cross into application/server state.

Presentation layers receive normal values, presentation-ready models, status flags, and callbacks through their public interfaces.

## Router, Loaders, and Providers

`router/routes.tsx` MUST own route path, nesting, route element, redirect element, and links to guards/loaders. It MUST NOT implement a domain mutation, persistence policy, or inline loader body.

`loaders/` MAY own route-time redirects and data/state decisions required for navigation. A loader MUST NOT render JSX or become a generic domain-Service replacement.

`providers/` MUST only compose approved application/library providers and their configuration. A Provider MUST NOT become a second application-state source or hide domain policy behind Context.

## Representations, Utilities, Constants, and Infrastructure

An Adapter MUST perform an explicit representation conversion. It MAY return JSX only when presentation adaptation is its stated contract. It MUST NOT own transport, cache mutation, or domain policy.

A Utility MUST have a narrow deterministic computation or platform-interaction contract. Utilities MUST NOT perform raw transport, render JSX, or become a generic home for feature policy.

Constants MUST be named immutable data/configuration. They MUST NOT contain JSX, executable behavior, or a hidden policy engine.

Types MUST describe one named representation. A DTO, request, domain type, and view model MAY differ only when their contracts truly differ; the translation owner and direction MUST then be explicit. The agent MUST NOT duplicate a type solely to avoid importing the authoritative contract. Both `type` and `interface` are allowed when they accurately express the contract.

`lib/` MUST contain shared technical infrastructure, such as the configured query client. It MUST NOT contain feature-domain policy or route/UI decisions.

## Page vs. Container Decision Gate

Before adding or moving a domain/query Hook call into a component, the agent MUST answer:

1. What semantic scope owns the data/action?
2. Does the result govern the whole Page or one coherent region?
3. Is the current consumer the narrowest stable owner?
4. Would putting it in Page cause unrelated region integrations to accumulate there?
5. Would extracting a Container create a real cohesive responsibility, or only move code?

Use Page for screen governance and Container for coherent region orchestration. Do not decide based on line count alone.

## No Circumvention and Legacy

The agent MUST NOT bypass these boundaries through aliases, re-exports, wrappers, indirect imports, a second client, an adapter that hides transport, a fake UI Hook, an empty Container, or a type alias that hides duplicated ownership.

When existing code conflicts with this rule, classify it as legacy, do not copy it, and do not migrate it outside the authorized task scope. A new exception requires the user's explicit authorization, exact scope, and documented reason.

## Enforcement and Verification

The following objective invariants MUST remain mechanically enforced where their path/text pattern can be identified reliably:

- presentation layers cannot reach Zustand/application-state, Services, or domain/query Hooks;
- presentation-only `hooks/ui` dependencies remain allowed when they do not transitively reach prohibited integration;
- Container/Page composition follows `rules/architecture.md`;
- `enforce-services`: no React state, raw HTTP client, or generic operation name in Services;
- `enforce-router`: router file scope, no inline loader, and no generic route path;
- `enforce-providers`: no application-state Context creation in Providers;
- `enforce-lib`: no generic infrastructure export name;
- `enforce-utils-adapters`: no JSX/raw transport in `utils` and no generic export name;
- `enforce-constants` and `enforce-types`: their respective naming/export/type-safety invariants.

Mechanical checks do not prove cache correctness, domain ownership, Page-vs-Container semantic scope, or that a representation has a justified translation. For that semantic work, use the relevant review Skill.

Before completing affected work, trace the changed read/write path, identify the authoritative source for each type and policy, verify the consumer is the narrowest correct Page/Container owner, run applicable checks/tests, and inspect the final diff. A passing hook or test proves only the invariant it actually covers.
