# Data Boundary Rules

This file defines **mandatory implementation constraints** for data flow, transport,
routing, representations, shared technical infrastructure, and authorized UI/application
consumers in the Nino application.

When a rule in this file applies, the agent **MUST** obey it. The absence of explicit
permission **MUST NOT** be interpreted as permission to create an exception.

## Scope and Authority

The primary data/integration scope is:

```text
apps/manager/src/{shared,services,hooks,router,loaders,providers,adapters,utils,constants,types,lib,states,pages,layouts}
```

This includes Page-local facades, hooks, states, operations, services,
adapters, utilities, constants, and types. `src/UI` is legacy evidence only;
it is not a destination for new or refactored code.

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
Page               → route/screen governance and macro branches
domain component   → named visual/interaction region consuming its facade
facade              → composition-only selection/exposure of ready values and commands
domain/query Hook  → query/mutation orchestration and cache decisions
feature store      → client-only shared state through named operations
adapter            → explicit representation conversion
Service            → named domain transport through the shared API
Layout             → persistent shell and Outlet under src/layouts
router/routes.tsx  → URL, nesting, route elements, guards, and loader links
loaders/           → route-time data/redirect decisions
providers/         → composition of approved application providers
utils/             → narrow deterministic computation or platform interaction
constants/         → immutable named data/configuration
domain/types/      → reusable named contracts owned by one Page domain
shared/types/      → reusable named contracts shared across domains
lib/               → shared technical infrastructure
```

Pages and domain components MUST NOT directly consume Services, QueryClient,
Zustand, raw integration Hooks, or APIs. They consume the Page feature's
composition-only facade.

An allowed folder or suffix is not proof of correct ownership. The agent MUST NOT move code, add a wrapper, or duplicate a type merely to appear compliant.

## Services and Transport

Each Service operation MUST have a specific domain name and own only endpoint, request, and response transport for that operation.

Services MUST use the application's shared API client exported by `services/http.service.ts`. A Service MUST NOT call `fetch`, Axios, Ky, or another raw HTTP client directly. Multipart requests MUST use the shared API client's approved operation; a missing capability MUST be added to the shared client rather than bypassed locally.

Services MUST NOT own React state, query cache mutation/invalidation, JSX, route selection, toast/UI feedback, or domain workflow policy. Services MAY construct request bodies and endpoint paths required by their named operation.

The application `services/http.service.ts` is the sole composition point for shared HTTP client configuration. Feature Services MUST NOT create another HTTP client or alter session/error behavior.

## BFF and Security Boundary

`nino-api` is the Backend-for-Frontend for the application. This applies to
every endpoint, not only catalog endpoints. The browser/client is an
untrusted caller and MUST NOT be treated as the authority for tenant scope,
resource ownership, prices, roles, permissions, or workflow decisions.

For every authenticated endpoint, the API MUST resolve the effective user and
tenant from trusted server-side context, validate the user's membership and
role for that tenant, and enforce ownership/scoping in the Service/Repository
path. A `tenantId`, resource ID, role, permission, price, or derived value
received from the client is only an input candidate; it MUST be validated or
derived server-side before use. Repositories MUST apply tenant scoping to
every multi-tenant read, update, delete, and relation lookup so an ID cannot
cross the tenant boundary (including IDOR and nested-resource access).

Roles and Helms are authorization inputs and coarse access gates, not a
substitute for ownership checks. They MUST be evaluated together with the
resource's tenant and lifecycle state. Public endpoints MUST be explicit and
limited to intentionally public representations; making an endpoint public
MUST NOT expose private fields or bypass server-side resource constraints.

The API MUST whitelist mutable fields, reject unauthorized relation changes,
resolve sensitive derived values such as catalog prices from authoritative
server data, and return only the BFF response contract needed by the caller.
Controller input validation, authentication guards, tenant/ownership checks,
and security regression tests are mandatory parts of the endpoint contract.
When auditing or implementing an endpoint, trace the complete path
`controller → guard/context → service → repository → response` and explicitly
check authentication, tenant isolation, ownership, field assignment, public
exposure, and error leakage. A frontend filter, hidden field, role selector,
Helm, or UI restriction is never a security boundary.

## Query and Domain Hooks

Hooks that use TanStack Query MUST call an existing Service rather than recreate raw transport. They own `useQuery`/`useMutation` orchestration, async-state exposure, and the cache decision for their operation.

A query key MUST uniquely include every parameter that changes returned data. Existing query-key factories MUST be reused when they cover the query. For a mutation that makes a known cached query stale, the Hook MUST explicitly invalidate or update that cache. No invalidation is required when no affected cached query exists.

Hooks MUST NOT place server data in Zustand merely because both are accessed through Hooks. Zustand ownership remains governed by `rules/hooks.md`.

## Facade Consumer Boundary

The Page feature facade is the UI-facing integration boundary. It MAY invoke
feature Hooks/store during render, select or rename already-computed fields,
and expose existing command references.

A facade MUST NOT declare callbacks/helpers, validate, transform, format,
branch, catch errors, await, sequence promises, or coordinate mutation-to-state
workflows. Such behavior belongs to the owning Hook, operation, Adapter, or
utility.

## Page Consumer Boundary

A Page consumes its feature facade when integration affects route/screen
governance, including examples such as:

- access/permission decisions for the screen;
- redirects;
- Page-level not-found/error/loading/empty decisions;
- determining whether a major screen branch or domain component should render.

A Page MUST NOT absorb query/mutation/store orchestration merely because it is
the route component. Domain components own named regions and may consume the
same feature facade directly. Transport, query keys, cache
mutation/invalidation, and domain transformation remain with their
authoritative Service/Hook/Adapter owners.

The Page consumer boundary is also a markup boundary: a Page may compose named
regions but MUST NOT implement their internal JSX, repeated domain items,
region-level interactions, formatting, or domain-flow decisions. If a Page
cannot be read as route governance, macro-state branching, and an ordered list
of named components, the Page fails architecture review and must be split
before styling or test completion is accepted.

## Presentation Boundary

Pages and domain components MUST NOT directly or indirectly consume:

- domain/query Hooks;
- Zustand/application-state Hooks;
- Services;
- API clients/raw transport.

Domain components MAY use local React state and presentation-only Hooks when
those dependencies do not cross into application/server state.

Presentation layers receive normal values, presentation-ready models, status flags, and callbacks through their public interfaces.

## Router, Loaders, and Providers

`router/routes.tsx` MUST own route path, nesting, route element, redirect element, and links to guards/loaders. It MUST NOT implement a domain mutation, persistence policy, or inline loader body.

`loaders/` MAY own route-time redirects and data/state decisions required for navigation. A loader MUST NOT render JSX or become a generic domain-Service replacement.

`providers/` MUST only compose approved application/library providers and their configuration. A Provider MUST NOT become a second application-state source or hide domain policy behind Context.

## Representations, Utilities, Constants, and Infrastructure

An Adapter MUST perform an explicit representation conversion. It MAY return JSX only when presentation adaptation is its stated contract. It MUST NOT own transport, cache mutation, or domain policy.

A Utility MUST have a narrow deterministic computation or platform-interaction contract. Utilities MUST NOT perform raw transport, render JSX, or become a generic home for feature policy.

Constants MUST be named immutable data/configuration. They MUST NOT contain JSX, executable behavior, or a hidden policy engine.

Types MUST describe one named representation. A type used only in one file MUST
remain inline. A reusable type used by multiple files in one domain MUST live in
`pages/<domain>/types/`; a type used by multiple domains MUST live in
`shared/types/<domain>/`. There is one named type per `<TypeName>.type.ts` file
and no barrel. A DTO, request, domain type, and view model MAY differ only when
their contracts truly differ; the translation owner and direction MUST then be
explicit. The agent MUST NOT duplicate a type solely to avoid importing the
authoritative contract. Use `type`, not `interface`, for application contracts.

`lib/` MUST contain shared technical infrastructure, such as the configured query client. It MUST NOT contain feature-domain policy or route/UI decisions.

## Page-Feature Ownership Gate

Before adding or moving a domain/query Hook call into a component, the agent MUST answer:

1. What semantic scope owns the data/action?
2. Does Page governance or a named domain component present the result?
3. Does the facade only expose an already-implemented value or command?
4. Does a Hook own server/async/cache behavior?
5. Does a store operation own client-only shared transitions?

Use Page for screen governance, domain components for named regions, the
facade for composition, Hooks for async/cache behavior, and store operations
for client-only transitions. Do not decide based on line count alone.

## No Circumvention and Legacy

The agent MUST NOT bypass these boundaries through aliases, re-exports,
wrappers, indirect imports, a second client, an adapter that hides transport,
a fake UI Hook, a facade callback, or a type alias that hides duplicated
ownership.

When existing code conflicts with this rule, classify it as legacy, do not copy it, and do not migrate it outside the authorized task scope. A new exception requires the user's explicit authorization, exact scope, and documented reason.

## Enforcement and Verification

The following objective invariants MUST remain mechanically enforced where their path/text pattern can be identified reliably:

- Pages/domain components cannot reach Zustand/application-state, Services,
  QueryClient, or raw domain/query Hooks;
- presentation-only `hooks/ui` dependencies remain allowed when they do not transitively reach prohibited integration;
- Page/component/facade composition follows `rules/architecture.md`;
- `enforce-facades`: facade remains composition-only;
- `enforce-services`: no React state, raw HTTP client, or generic operation name in Services;
- `enforce-router`: router file scope, no inline loader, and no generic route path;
- `enforce-providers`: no application-state Context creation in Providers;
- `enforce-lib`: no generic infrastructure export name;
- `enforce-utils-adapters`: no JSX/raw transport in `utils` and no generic export name;
- `enforce-constants` and `enforce-types`: their respective naming/export/type-safety invariants.

Mechanical checks do not prove cache correctness, domain ownership, facade
purity beyond detectable syntax, or that a representation has a justified
translation. For that semantic work, use the relevant review Skill.

Before completing affected work, trace the changed read/write path, identify
the authoritative source for each type and policy, verify Page/component/
facade/Hook/store ownership, run applicable checks/tests, and inspect the final
diff. A passing hook or test proves only the invariant it actually covers.
