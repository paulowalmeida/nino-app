# Canonical Page-Feature Model

This document is the canonical model for a domain-owned page feature. Use it
when constructing, editing, or auditing a manager page.

`apps/manager/src/pages/Catalog` is where the model came from, and it is the
reference for the **responsibility model and dependency direction** only. Its
file layout is an unfinished migration and MUST NOT be copied: the facade,
three hooks, the adapter and one utility still sit loose instead of owning a
folder, several units have no `.mock.ts`, the operations are grouped by theme
instead of one per folder, and two hooks carry the forbidden `...Query` name.
Running `node .agents/enforcement/check-test-structure.mjs
apps/manager/src/pages/Catalog` prints the current list.

For the **file layout** of a finished domain, read the tree below and look at
`pages/ConsumerDetail`, `pages/NewOrder`, or `pages/NewProduct`, which pass
`node .agents/enforcement/verify-page-feature.mjs <feature>`.

Never copy page names, accidental markup, or domain rules from any of them.

## Why this model exists

Catalog evolved from globally classified Atomic Design UI into an isolated
page workspace. The useful outcome of that evolution is domain ownership:
files that change because of catalog live together, while reusable primitives
remain outside the domain. Atomic labels and folder depth no longer determine
responsibility.

`Layout` was not removed. Layouts are direct children of `src`, own persistent
application chrome, and render the active route through `<Outlet />`. They must
not contain behavior that belongs to one page feature.

## Canonical anatomy

Create only folders required by the feature:

```text
src/
├── layouts/
└── pages/<feature>/
    ├── <Feature>.tsx
    ├── <Feature>.module.css
    ├── <Feature>.test.tsx
    ├── <Feature>.mock.ts
    ├── adapters/
    │   └── <feature>.adapter/
    │       ├── <feature>.adapter.ts
    │       ├── <feature>.adapter.test.ts
    │       └── <feature>.adapter.mock.ts
    ├── components/
    │   └── <Component>/
    │       ├── <Component>.tsx
    │       ├── <Component>.module.css
    │       ├── <Component>.test.tsx
    │       └── <Component>.mock.ts
    ├── constants/
    ├── facades/
    │   └── use<Feature>Facade/
    │       ├── use<Feature>Facade.ts
    │       ├── use<Feature>Facade.test.tsx
    │       └── use<Feature>Facade.mock.ts
    ├── hooks/
    │   └── use<WhatItReturns>/            # never use<Feature>Query/Mutation
    │       ├── use<WhatItReturns>.ts
    │       ├── use<WhatItReturns>.test.tsx
    │       └── use<WhatItReturns>.mock.ts
    ├── skeletons/
    │   └── <Skeleton>/
    │       ├── <Skeleton>.tsx
    │       ├── <Skeleton>.test.tsx
    │       └── <Skeleton>.mock.ts
    ├── states/
    │   └── <state>/
    │       ├── <state>.state.ts
    │       ├── <state>.state.test.ts
    │       ├── <state>.state.mock.ts
    │       └── operations/<operation>/
    │           ├── <operation>.ts
    │           ├── <operation>.test.ts
    │           └── <operation>.mock.ts
    ├── types/                            # reusable types owned by this domain
    │   └── <TypeName>.type.ts            # one named type per file
    └── utils/
        └── <utilName>/
            ├── <utilName>.ts
            ├── <utilName>.test.ts
            └── <utilName>.mock.ts
```

A Hook is named after the data or command it returns, never after the
TanStack mechanism behind it: `useConsumerDetail`, `useConsumersList`,
`useNewOrderAvailability` — not `useConsumerDetailQuery` or
`useCatalogMutations`. `enforce-hooks` blocks `export const use...Query` and
`use...Mutation`, and this naming rule is the reason.

A unit MAY own a second test file named `<Unit>.behavior.test.tsx` when
separating interaction from render makes both readable. It belongs to the same
unit: same folder, same `<Unit>.mock.ts`, no source file of its own.

Every tested unit owns one folder, including each Hook, facade, adapter,
service, operation, utility, Page, component, and skeleton. The store is the
one exception: it is the state folder's own unit, so `<state>.state.ts` lives
directly inside `states/<state>/` — named after the domain, with no
`.state`/`.store` suffix — beside `<state>.state.test.ts` and
`<state>.state.mock.ts`. A `states/<state>.state/` or nested
`states/<state>/<state>.store/` folder is wrong, and the exception covers the
state alone — every other file inside `states/<state>/` still owns its
folder. Source,
test, and mandatory meaningful props/data mock file share the unit name and
live together. A `.mock.ts[x]` is declarative only: no `vi.fn`, callbacks,
factories, functions, dependency implementations, or configured behavior.
Never keep several loose Hook/test pairs directly in `hooks/`, `adapters/`,
or `utils/` — each of these folders is a bucket of one-unit-per-subfolder
entries, exactly like `components/`; a file sitting directly inside them,
sibling to its own `.test.ts`/`.mock.ts` with no wrapping folder, is a
violation even when the tree diagram's leaf line for that folder (e.g.
`└── utils/`) does not spell out the nested example again for brevity — the
"every tested unit owns one folder" rule above applies uniformly regardless
of how compactly a given branch is drawn. `types/` and `constants/` are the
only folders that stay flat, because their entries are pure declarations with
no colocated test/mock contract. Never create an empty mock merely to satisfy
the tree.

Component folders preserve the direct composition hierarchy. `components/`
contains the Page's root components. A component used exclusively by one
parent belongs inside that parent's folder, with its source, test, mock, and
CSS colocated; descendants nest recursively. A component consumed by multiple
branches belongs at their nearest common parent. Do not flatten exclusive
children beside their parent. Every folder containing a TSX component uses
PascalCase and matches the component name exactly, including nested children.

## Dependency and execution flows

```text
Page -> domain components -> facade
                            |-> query/mutation hooks -> adapters -> services -> API
                            `-> Zustand store -> state-local operations
```

Read flow:

```text
UI -> facade -> query hook -> request adapter -> service -> API
API -> service -> response adapter -> React Query cache -> facade -> UI
```

Client-state flow:

```text
UI -> facade -> store action -> operation -> store -> facade -> UI
```

Mutation flow:

```text
UI intent -> facade -> existing command hook -> adapter/service -> API
                                             -> invalidate/update domain query
                                             -> store action for client effects
```

Frontend ordering, grouping, filtering, and selection do not change backend
ordering unless the request adapter explicitly serializes them into request
parameters. A visual reorder is client state; backend order is a transport
contract and must be modeled explicitly.

## Layer contracts

- **Page:** thin route/screen governor. Chooses macro regions and
  loading/error/empty/content branches. It does not perform transport, hold
  domain algorithms, or relay integration props between children.
- **Page governance gate:** the Page may contain route governance, one facade
  invocation, macro-state branches, the root shell, and ordered named domain
  components only. Substantial or nameable visual JSX belongs below the Page,
  including headers, heroes, receipts, lists, repeated rows, summaries,
  sidebars, timelines, forms, notes, and action groups. A `.map`, `dl`, table
  row, region-level handler/state, formatting call, or domain flow helper in a
  Page is fail-closed evidence until extracted. Replacing the markup with DS
  primitives is not extraction and does not pass the gate.
- **Domain component:** owns one named visual region or interaction. It may
  consume its feature facade directly. It does not import the store, service,
  HTTP client, QueryClient, or raw query/mutation infrastructure.
- **Facade:** composition-only UI-facing API for the feature. It calls the
  owning hooks/store, selects and renames returned fields, and exposes values
  and command references that are already implemented elsewhere. It does not
  implement commands, workflows, validation, transformation, or error policy.
- **Query/mutation hook:** owns TanStack Query execution, keys, pagination,
  async state, cache update/invalidation, and service orchestration. Server
  data never becomes Zustand's source of truth.
- **Adapter:** pure conversion between transport request/response and
  domain/view shapes. It does not fetch, render, or own mutable state.
- **Service:** endpoint communication through the shared HTTP client. It does
  not own React state, UI decisions, or transport-to-view presentation rules.
- **Store:** client-only shared state such as filters, selection, dialogs, and
  drafts. The store declares state and delegates every meaningful transition to
  one cohesive operation per file under that state's own
  `states/<state>/operations/<operation>/` folder. Never create a root
  `states/operations/` folder.
- **Utility:** pure domain calculation or formatting with no React, transport,
  cache, or mutable application state.
- **Constant:** immutable declarative data; no JSX, behavior, or environment
  access.
- **Skeleton:** mirrors the owned visual region's loading geometry and has no
  data access.
- **Layout:** persistent shell under `src/layouts`; composes chrome and
  `<Outlet />`, never feature-specific branches.

Props remain correct for genuine component inputs. They are wrong when the
Page reads a facade/store/query only to forward integration data or commands
to descendants. In that case, the owning domain component consumes the facade.

## Construction and refactor procedure

1. Inspect the complete existing page folder, then its direct callers and
   dependencies. Search locates files; it is not proof that every folder and
   file was inspected.

### Facade purity gate

“Expose a command” means returning an existing hook/store function reference.
It does not mean creating the command inside the facade.

A facade may:

- invoke feature hooks and the feature store during render;
- select, rename, group, and expose their already-computed return fields;
- expose an existing command reference such as `mutations.submitCreate`;
- provide the stable UI-facing shape for Page and domain components.

A facade must not:

- declare a function, callback, or helper that implements behavior;
- use `if`, `switch`, loops, `try/catch`, `await`, or promise sequencing;
- trim, validate, sort, filter, map, reduce, format, or translate errors;
- coordinate “mutate, then update/clear/close/reset state”;
- wrap an existing command merely to reshape its arguments or result.

Put server-command lifecycle in a mutation/domain hook, client transitions in
store operations, transport/view conversion in adapters, and pure derivation
in adapters or utilities. If a facade behavior deserves its own test, that is
evidence the behavior belongs below the facade. Facade tests verify composition
and public mapping only.

2. Inventory every executable source file by folder and record its current
   responsibility, dependencies, and test counterpart.
3. Draw the current Page/component/facade/query/store/adapter/service flow.
4. Preserve observable behavior before moving ownership. Do not redesign the
   backend contract as a side effect of UI restructuring.
5. Move each responsibility to the layer contract above. Avoid pass-through
   containers, duplicate facades, speculative `shared` extraction, and
   integration prop drilling.
6. Keep the Page readable as a screen map. Domain components may independently
   consume the same facade; the facade is the stable public boundary.
7. Add or update tests alongside each executable unit as it is changed.
8. Re-inventory the final tree folder by folder and compare it with the source
   inventory. Then run `node .agents/enforcement/verify-page-feature.mjs
   <feature>`, followed by
   lint/type/build checks required by the task, and architecture enforcement.

## Unit-test contract

For a page feature refactor, build a source-to-test matrix. Include Page,
components, facade, hooks, adapters, store, operations, utilities, and
skeletons. Exclude type-only files, CSS, declarations, barrels with no runtime
behavior, and mocks from the executable coverage inventory.

Each matrix row must resolve to one unit folder containing source, test, and a
non-empty same-name props/data mock file. Missing folder ownership, missing
mock, or behavioral code inside the mock is an incomplete refactor even when
coverage is 100%.

Tests must protect behavior:

- Page: screen-wide branches and macro composition.
- Component: accessible output and user interaction.
- Facade: composition and public field/command mapping only.
- Query/mutation hook: enabled conditions, request inputs, pagination,
  success/error state, invalidation, and command lifecycle where applicable.
- Adapter/utility/operation: input/output, boundaries, empty/null cases, and
  domain rules.
- Store: initial state, transitions, reset/clear, and isolation.
- Skeleton: meaningful rendered loading structure, not class snapshots.

Mocks stop at the closest external boundary and must not replace the decision
being tested. Every mutable QueryClient, store, timer, global, and mock is reset
per scenario. Prefer semantic queries and deterministic awaited behavior.

For a completed page-domain refactor, run scoped coverage only when explicitly
authorized by `AGENTS.md`. Coverage is supporting evidence, not permission to
add assertion-free or implementation-detail tests.

Before creating or moving any Page resource, inspect all consumers. If the
resource is used by more than one Page domain, promote it to the approved
`src/shared` boundary and have both domains consume that shared contract. Do
not duplicate it or hide cross-domain ownership behind aliases, re-exports, or
wrappers. Resources exclusive to one domain remain inside that domain.

## Audit completion gate

Do not claim the feature is complete from `rg`, filenames, a passing suite, or
coverage alone. Completion requires all of the following:

1. every folder was opened and every eligible source file was inspected;
2. the source-to-test matrix has no unexplained gap;
3. dependency direction and each layer contract were checked semantically;
4. focused tests pass and scoped coverage meets the required gate;
5. applicable lint, architecture, and package checks pass;
6. no skipped, focused, weakened, or meaningless test was introduced;
7. the final diff was inspected for unrelated or accidental changes.
