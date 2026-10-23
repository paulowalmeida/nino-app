# Architecture Rules

These are the current mandatory architecture rules for the application. They
replace the previous Atomic Design organization. Existing code may still use
the old structure while it is being migrated; new code and modified code must
follow this document.

## Domain-first organization

Application code is organized by domain/module, not by UI abstraction level.
Each domain owns the code that is specific to it:

```text
src/
├── layouts/
├── pages/
│   ├── catalog/
│   │   ├── components/
│   │   ├── facades/
│   │   ├── hooks/
│   │   ├── adapters/
│   │   ├── states/<state>/<state>.state.ts
│   │   ├── states/<state>/operations/<operation>/
│   │   ├── skeletons/
│   │   └── utils/
│   └── account/
└── shared/
    ├── components/
    ├── hooks/
    ├── services/
    ├── states/
    ├── types/
    ├── utils/
    └── styles/
```

The exact folders are created only when the domain needs them. A domain
should not receive abstractions just to make the tree look symmetrical.

The detailed canonical model for manager page features is
`.agents/skills/architecture-review/references/catalog-page-model.md`. It MUST
be read before constructing, editing, refactoring, or auditing `src/pages/**`.

### Domain ownership

- Code that knows a domain rule belongs to that domain.
- Code that is used by more than one domain belongs in `shared`.
- Code that is currently used by one domain stays in that domain, even if it
  appears potentially reusable.
- Moving code to `shared` requires a real sharing need; speculation is not
  sufficient.
- Shared code must not import internal files from a domain.
- A domain may use shared code, but shared code must remain domain-agnostic.

`shared` is not a replacement for the old global folders. It is a deliberate
boundary for code that has no single domain owner or is genuinely consumed by
multiple domains.

## Page governance

A Page is the only governance layer for its route/screen. It decides which
regions and screen-level units exist and how they are composed:

```tsx
export const Catalog = () => (
  <Page>
    <CatalogHeader />
    <CatalogContent />
    <CatalogDeleteItemDialog />
    <CatalogDeleteItemsDialog />
  </Page>
)
```

Pages own:

- route-level concerns;
- redirects and access decisions;
- the macro composition of the screen;
- screen-wide loading, error, and empty states;
- decisions about which page regions are rendered.

Pages must not become transport or business-rule dumping grounds. Domain
logic remains inside the domain's hooks, services, states, adapters, or
utilities.

Pages are governance-only. A Page may own route parameters and redirects,
invoke its facade, choose screen-wide loading/error/empty/content branches,
render the root shell, and order named domain components. It MUST NOT render
the internal JSX of a visual region. Headers, heroes, lists, repeated rows,
receipts, summaries, sidebars, timelines, forms, notes, and action groups are
domain-component responsibilities, even when used once.

Direct domain-item `.map` rendering, `dl`/table row markup, region-level
handlers or interaction state, formatting calls, and domain-flow helpers in a
Page are fail-closed evidence of an architecture violation. Replacing those
tags with Design System primitives does not fix the ownership violation;
extract the named region first. A compliant Page must read as macro-state
branches plus an ordered screen map of named components.

### Page governance contract

| Concern | Page may do | Page must delegate |
| --- | --- | --- |
| Route | read params, navigate, redirect, enforce access | domain workflows and persistence |
| Data | call one feature facade and read its ready contract | raw Hooks, Services, stores, QueryClient |
| Macro state | choose screen loading/error/empty/content branches | region loading, validation, and interaction state |
| Composition | render the root shell and order named domain components | headers, cards, lists, tables, forms, dialogs, and sections |
| Styling | style the Page shell and screen-level layout | region classes and component layout |

The Page source must be reducible to route/access decisions, one facade
invocation, macro-state returns, and an ordered screen map. A `.map` over
domain data, form wiring, named `header`/`section`, region event handler,
region `useState`/`useReducer`, formatter, validator, payload builder, or
workflow helper is a delegation signal. It belongs in a named Page-local
component, Hook, adapter, utility, operation, or Service according to its
responsibility. Using DS primitives around that code does not make it
governance. The Page fails until the region is extracted and the Page reads
as a screen map.

### Page versus domain component

A valid Page governs existence, ordering, and macro states:

```tsx
if (isPending) return <OrdersSkeleton />
if (isError) return <OrdersError />
if (!orders.length) return <OrdersEmpty />

return (
  <Box className={styles.page}>
    <OrdersHeader />
    <OrdersQueue />
    <OrdersSummary />
  </Box>
)
```

An invalid Page implements a region, even when it uses the Design System:

```tsx
return orders.map((order) => (
  <Box key={order.id} onClick={() => openOrder(order.id)}>
    <Text>{formatOrderStatus(order.status)}</Text>
  </Box>
))
```

Decisive test: "If I remove the child components, does the Page still contain
a visual region or domain interaction?" If so, it fails. Size, line count, and
Design System usage do not change the classification.

## CSS ownership

CSS Modules follow rendered ownership. A Page module may style only the Page's
root shell and screen-level layout. A Page-local component MUST import its own
co-located `Component.module.css` for classes applied to its markup. It MUST
NOT import the Page module, a parent component module, or a sibling component
module. The sole exception is a skeleton, which may import the module of the
component it mirrors to preserve geometry; it may not import the Page module.
Classes used by a component belong in that component's stylesheet; Design
System or explicitly approved shared styles are the only other exceptions.

## Components are not governance layers

Components below a Page do not govern the screen. They own their own visual
responsibility and local interaction, but they must not decide the existence
or composition of unrelated page regions.

A domain-specific component accesses its domain through a facade. The facade
is the public integration boundary for the domain; it hides Zustand, API
services, adapters, and transition details from the UI.

Each Page domain has one canonical feature facade. That facade may expose
several cohesive responsibilities owned by the same domain, such as query
data, client state, selection state, loading status, and existing mutation
commands. Do not create multiple facades for one domain merely because the
domain has more than one responsibility. Split the underlying Hooks,
operations, adapters, or components when their ownership or reason to change
differs, while keeping the single facade as the stable UI boundary.

For example, `CatalogHeader` and `CatalogContent` may consume
`useCatalogFacade()`, but they must not import `useCatalogStore` or
`ProductService` directly. The Page still governs the screen by deciding that
those components exist.

## No integration prop drilling

Do not pass facades, Zustand stores, query results, service interfaces, or
domain integration values through a Page merely so one component can forward
them to another component.

Forbidden:

```tsx
<CatalogHeader
  categories={categories}
  categoryId={categoryId}
  onCategoryChange={setCategoryId}
/>
```

when those values exist only because the Page read them from Zustand and the
header will simply pass them to its children.

Preferred:

```tsx
<CatalogHeader />
```

with `CatalogHeader` consuming its own `useCatalogFacade()` boundary.

Props are allowed when they represent a genuine public input of the component:

- a local visual configuration;
- a callback belonging to the component's immediate interaction;
- a value supplied by a different domain boundary;
- a reusable, domain-agnostic component contract.

Props must not be cascaded through multiple `.tsx` files just to transport
state from one integration consumer to another. If a value must be consumed
by multiple distant components, expose it through the domain facade or extract
a genuinely shared contract into `shared`.

## Zustand and state ownership

Use Zustand only for client/application state owned by a domain or feature
flow. Keep stores close to the domain that owns them, and access them through
that domain's facade rather than directly from UI components.

- A store must have a domain-specific name such as `useCatalogStore`.
- Keep the number of stores proportional to the client state that genuinely
  needs to be shared. Do not split one page's flow into multiple stores by
  default.
- Domain facades may read and update their domain stores directly.
- Do not add Context for application state.
- Do not put unrelated domain state into a generic store.
- Model actions and clear/reset transitions explicitly.
- Store actions represent client-state transitions. They must not call
  endpoint services, own query cache, or become a second server-data cache.
- Server data, endpoint loading/error state, backend pagination, and mutations
  belong to TanStack Query hooks.
- The store is an assembly point, not the home of transition algorithms.
  Store methods that contain client-state behavior MUST delegate to operations
  under that state's own `states/<state>/operations/<operation>/` directory.
  `operations` MUST NOT be a root directory under `states/`, such as
  `states/operations/<state>`. Each operation has its own source file,
  colocated test, and declarative props/data mock. This includes synchronous
  transitions, field setters, and clear/reset behavior.
- The state's folder is named after the domain, with no `.state`/`.store`
  suffix: `states/<state>/` IS the state's folder — `<state>.state.ts`,
  `<state>.state.test.ts`, and `<state>.state.mock.ts` sit directly inside it.
  The `.state` suffix belongs on the file name only, never on the folder.
  Do not create `states/<state>.state/` or `states/<state>/<state>.store/`.

Type ownership follows usage. A type used only in one file stays inline in that
file. A reusable type used by multiple files in one domain belongs in
`pages/<domain>/types/`, one named type per `<TypeName>.type.ts`. A type used by
multiple domains belongs in `shared/types/<domain>/`, one named type per file.
Do not place reusable types in `states`, `hooks`, components, or another
implementation layer, and do not create a duplicate type merely to avoid an
import.

## Facade, query, state, and service boundaries

The normal read flow for server data is:

```text
UI
  ↓
domain facade
  ↓
domain query hook
  ↓
request adapter → service → API
  ↓
response adapter
  ↓
React Query cache
  ↓
facade → UI
```

The normal client-state flow is:

```text
UI
  ↓
domain facade
  ↓
Zustand action
  ↓
client-state operation
  ↓
Zustand store
  ↓
facade → UI
```

When one user intent involves both a backend mutation and client state:

```text
UI → facade → existing domain command
                ├─→ React Query mutation → adapter → service → API
                └─→ Zustand action for client-only effects
```

The exact component nesting is decided by responsibility, not by Atomic Design
labels or arbitrary depth.

- Components must not call Zustand, services, or raw HTTP transport directly.
- A facade is a composition-only UI-facing API. It may call domain hooks/store,
  select or rename their returned fields, and expose existing values and
  command references without exposing store or transport details.
- The single facade for a domain may compose multiple cohesive domain Hooks
  and store slices. Multiple responsibilities do not justify multiple facades
  when they belong to the same Page domain.
- A facade must not implement a command or workflow. It must not declare
  callbacks/helpers with behavior, branch, validate, trim, transform, format,
  translate errors, use `try/catch` or `await`, or sequence mutation with a
  store transition. Those responsibilities belong to hooks, operations,
  adapters, or utilities.
- Returning `submitCreate: mutations.submitCreate` is command exposure.
  Declaring `submitCreate` in the facade is command implementation and is
  forbidden.
- Services own API communication.
- Adapters own conversion between transport and domain/view models.
- Query hooks own `useQuery`/`useInfiniteQuery`/`useMutation` orchestration,
  query keys, cache updates, invalidation, and endpoint async state.
- Operations implement client-state transitions invoked by store/domain
  commands. The facade only exposes those existing commands.
- Stores own client-side state transitions only. They do not coordinate API
  calls and do not receive server responses as their source of truth.
- Pure formatting and calculations belong in domain or shared utilities.
- A domain must not reach into another domain's internal files.

## Naming

Names must describe the domain and responsibility:

- `Catalog` for the page;
- `CatalogHeader` for the catalog header region;
- `useCatalogStore` for catalog state;
- `useCatalogFacade` for the UI-facing catalog boundary;
- a Hook is named after what it returns, never after the library mechanism
  behind it: `useConsumerDetail`, `useNewOrderAvailability`. The suffixes
  `Query` and `Mutation` are forbidden in a Hook name and are blocked by
  `enforce-hooks`;
- one operation per file inside the owning state's
  `states/<state>/operations/<operation>/` folder; never place operations in a
  root `states/operations/` folder.

Avoid generic names such as `useStore`, `useData`, `selected`, or `helpers`.

## Migration rule

When migrating an existing feature, preserve behavior first and move code only
when its ownership is clear. Do not reproduce the old global Atomic Design
folders in new work. When a component is shared by multiple domains, keep it
in `shared` until its ownership can be narrowed safely.
