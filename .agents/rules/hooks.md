# Hook and State Rules

These rules are mandatory for React Hooks, facades, local state, Zustand, and
TanStack Query in `apps/manager`. Existing Atomic Design code is migration
evidence, not precedent. For page features, also apply
`.agents/skills/architecture-review/references/catalog-page-model.md`.

## React rules

- Call Hooks only at the top level of React components or Custom Hooks and in
  the same order on every render.
- Never call a Hook in a condition, loop, callback, event handler, ordinary
  helper, or `try`/`catch`/`finally` block.
- A Custom Hook has one cohesive stateful responsibility, returns behavior or
  data rather than JSX, and uses the `use...` naming convention.
- Effects synchronize with an external system. Prefer derivation or an event
  handler when no external system exists. Dependencies and cleanup must match
  the synchronized resource; do not silence Hook lint rules.

## State classification

Classify state before choosing an owner:

- component-only visual interaction stays in local React state;
- shared client feature state belongs to the feature Zustand store;
- server data, endpoint loading/error state, pagination, and mutations belong
  to TanStack Query hooks;
- values safely computed from authoritative inputs remain derived rather than
  duplicated as state.

Do not copy server data into Zustand, globalize local interaction for
convenience, or create Context as a second application-state source.

## Page-feature access

The approved page-feature boundary is:

```text
Page/domain component -> feature facade
feature facade -> query/mutation hooks + feature store
query/mutation hooks -> adapters/services
feature store -> client-state operations
```

- A Page consumes the facade only for screen-level governance and macro
  loading/error/empty/content decisions.
- A domain component may consume its own feature facade directly. This is the
  intended integration boundary and avoids Page-level integration prop
  drilling.
- Keep one canonical feature facade per Page domain. It may expose multiple
  cohesive domain responsibilities through one stable contract; extract the
  underlying Hook, operation, adapter, or component when behavior needs a
  separate owner, not a second facade for the same domain.
- Page and domain components must not import the feature store, service,
  QueryClient, or raw query/mutation implementation directly.
- A facade may call hooks during render and expose already-computed data and
  existing command references. It is composition-only: no callbacks/helpers,
  branching, validation, transformation, `try/catch`, `await`, or sequencing
  of mutation and client-state effects. Command behavior belongs to a cohesive
  hook; synchronous client transitions belong to store operations.
- A store action owns a client-state transition and delegates non-trivial
  behavior to one cohesive operation file. It never performs transport or
  controls the query cache.

Global shell layers such as Layout, Provider, Guard, and Loader may consume
state only when it belongs to their persistent infrastructure or route-entry
responsibility. A Layout must not consume page-feature state to implement the
active Page.

## Selectors, identity, and lifecycle

- Select the smallest stable store slice required by the facade/hook.
- Avoid broad subscriptions and unstable objects/functions that trigger
  unnecessary rerenders or query-key churn.
- Query keys include every request value that changes the returned data.
- Reset mutable store state, QueryClient/cache, timers, subscriptions, globals,
  and mocks between unit-test scenarios.
- Cancel, clean up, or guard asynchronous effects that may outlive their owner
  or input.

## Decision gate

Before adding or changing state/hook code, answer:

1. Is the value local UI, shared client, server, form, or derived state?
2. What is its authoritative source?
3. Which layer has the matching reason to change?
4. Does UI access it through the feature facade?
5. Are lifecycle, cache, reset, and error behavior testable at the narrowest
   meaningful boundary?

## Verification

Inspect the whole target folder and direct consumers; search alone is not an
audit. Run Hook linting, applicable enforcement, focused tests, and the
page-domain coverage gate when the feature is being completed. Mechanical
checks prove only their encoded patterns and never replace responsibility or
lifecycle review.

Official foundations:

- https://react.dev/reference/rules/rules-of-hooks
- https://react.dev/learn/synchronizing-with-effects
- https://zustand.docs.pmnd.rs/learn/getting-started/introduction
- https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
