---
name: hook-state-review
description: Review React Hooks, local UI state, application/server state, Page features, facades, providers, guards, loaders, effects, and store consumers in nino-app for correct ownership, lifecycle, data flow, and coherent contracts.
---

# Hook and State Review

## Purpose

Determine whether state and side effects live at the narrowest stable boundary, whether a Hook has one coherent responsibility, and whether application/server-state consumers respect the Nino Page-feature, facade, Hook, store, and component boundaries.

## Scope

Apply this Skill to `apps/manager/src/{hooks,states,providers,guards,loaders,pages,layouts,shared}`, including Page-local `facades`, `hooks`, `states`, `operations`, and components with relevant local state/effects. Inspect `src/UI` only when legacy code participates in the traced path; it is not a destination for new or refactored code. Hand off transport/cache ownership to `data-boundary-review` and UI composition/classification to `architecture-review`.

## Authority

Apply `AGENTS.md`, applicable `.agents/rules/*`, `.agents/rules/hooks.md`, `.agents/rules/architecture.md`, and objective `enforce-*`/lint failures. React Rules of Hooks are hard constraints; this Skill handles architectural judgment around otherwise-valid code.

## External Foundations and Nino Decisions

- React Hook call restrictions: https://react.dev/reference/rules/rules-of-hooks
- React Effects synchronize with systems outside React and need accurate dependencies/cleanup: https://react.dev/learn/synchronizing-with-effects
- Zustand stores expose a Hook-shaped consumer and selectors subscribe consumers to selected state: https://zustand.docs.pmnd.rs/learn/getting-started/introduction

Nino's state categories, Page/facade/Hook/store responsibilities, and component boundaries are project decisions. React or Zustand documentation does not authorize a prohibited consumer to bypass them.

## Mandatory Review Sequence

1. Inspect the complete Hook/component/provider/store consumer.
2. Classify each relevant value as server, local UI, derived, form, or shared application state.
3. Identify authoritative source of truth and smallest stable owner.
4. Trace reads, writes, mutations, effects, provider boundaries, and callers.
5. Determine whether each Hook coordinates one coherent behavior.
6. For consumers, determine whether the responsibility is local component interaction, facade composition, Hook orchestration, store transition, or Page-level governance.
7. For each effect, identify the external system it synchronizes with.
8. Check the returned contract for unnecessary coupling or unstable breadth.
9. Run applicable Hook/state enforcement and lint; record what each result proves.
10. Record findings and disposition.

## Nino State and Execution Contracts

- **local component/UI state:** owns one component's interaction or presentation state. Keep it local unless multiple consumers require one stable shared owner.
- **presentation-only UI Hook (`hooks/ui`):** may encapsulate reusable local presentation behavior and may be consumed by components only when it does not reach application/server state, Services, stores, or domain/query Hooks.
- **Custom domain/query Hook:** owns one reusable application/server-state behavior or cohesive Hook composition. Page-feature integration exposes it through the composition-only facade. It must not return JSX or act as a layer escape hatch.
- **`states/` Zustand Store:** owns shared client/application state and named actions. It must not host TanStack Query or become a generic transport/cache boundary.
- **facade:** selects/renames ready values and exposes existing command references from Hooks/store. It must not create callbacks, validate, transform, branch, catch, await, or sequence behavior.
- **Page:** owns route/screen governance, macro composition, and screen-wide branches. It consumes the facade instead of raw Hooks/store.
- **domain component:** owns a named visual region and local interaction state. It may consume the feature facade but not raw Hooks/store/Services/QueryClient.
- **Provider:** installs one coherent technical/shared capability. It must not create a second application-state source, bundle unrelated workflows, or smuggle state into prohibited presentation layers.
- **Guard/Loader:** owns route-entry gating, loading coordination, redirects, and necessary authorized state reads/writes. It must not become a route-specific business workflow, UI controller, or Service substitute.

Domain components may consume selected ready values/actions through their feature facade and may use presentation-only Hooks/local React state, but they must never consume Zustand, domain/query Hooks, Services, QueryClient, or equivalent integration directly.

## Authorized Direct Consumers

For Zustand/application state:

```text
Facade          ✅ composition-only selection/exposure
Custom Hook     ✅ cohesive state behavior
Guard/Loader    ✅ route-entry responsibility only
Provider        ✅ approved application infrastructure only
Layout          ✅ persistent shell responsibility only
Page            ❌ consume through facade
Domain component❌ consume through facade
```

For domain/query server-state Hooks:

```text
Facade          ✅ composition-only selection/exposure
Custom Hook     ✅ when composition is cohesive
Guard/Loader    ✅ route-entry responsibility only
Layout          ✅ persistent shell responsibility only
Page            ❌ consume through facade
Domain component❌ consume through facade
```

## State Ownership Test

Ask:

> What is the smallest stable semantic owner that needs this state for correct product behavior?

Classify the state before choosing its owner. Page governs screen-wide branches, the facade exposes ready state, Hooks own server/async state, store operations own shared client-only transitions, and components own local interaction. Do not use line count as the extraction criterion.

Examples:

```text
screen access permission → route Hook/Guard exposed to Page governance
route-dependent top-level not-found decision → query Hook exposed by facade to Page
orders list query → query Hook exposed by facade to OrdersList
selected order remote details → query Hook exposed by facade to OrderDetails
local row expansion → domain component local UI state
```

## 9/10 Gates

Report a confirmed violation when evidence shows:

- server state is copied into another state layer without a concrete synchronization requirement;
- derived state is stored despite safe derivation from authoritative inputs;
- state is lifted/globalized beyond the actual consumer set;
- a Custom Hook combines unrelated domains or independent reasons to change;
- a Page or domain component consumes application/server integration directly instead of through its facade;
- a facade contains callbacks, validation, transformation, branching, error handling, awaiting, or command sequencing;
- a Page accumulates state/query orchestration instead of screen governance;
- a Hook contains presentation composition or bypasses component-layer boundaries;
- a Provider owns unrelated workflows or side effects instead of a coherent shared capability;
- an effect mirrors values that should be derived or responds to an event that should be handled at the event boundary;
- an effect lifecycle does not match the thing it synchronizes;
- a store becomes a transport/service boundary or stores server state that belongs elsewhere;
- a guard/loader performs business workflow instead of route gating/loading coordination;
- the Hook contract exposes unrelated capabilities solely to hide internal complexity.

Do not report a violation merely because a presentation component uses `useState`, `useReducer`, `useRef`, or a pure `hooks/ui` Hook for its own interaction.

## Effect Test

For every effect, identify the external system, setup trigger, dependencies, cleanup, and behavior when inputs change or the owner unmounts. If there is no external system, evaluate derivation or explicit event handling instead.

Require cleanup for subscriptions, listeners, timers, observers, object URLs, and connections; require cancellation or stale-result protection when asynchronous work can outlive the relevant input/owner. Do not silence exhaustive-dependencies.

## Hook Cohesion Test

Several operations may be valid inside one Hook when they form one coherent behavior/state machine. Length, line count, or operation count alone is not evidence of multiple responsibilities.

Split when responsibilities have materially different reasons to change or can be independently understood without reconstructing the parent Hook.

## State Classification

Do not infer state category from API shape alone. Confirm whether the value is authoritative, derived, temporary UI state, form state, application-shared state, or server state from its lifecycle and consumers.

For a Zustand consumer, identify selected fields/actions and why a narrower selector cannot express the need. For a query consumer, identify why the current Hook is the narrowest stable semantic owner and how the facade exposes it.

## Enforcement Map

Run applicable checks and interpret them narrowly:

- `eslint-plugin-react-hooks` enforces Hook call/dependency rules; it cannot determine Nino ownership.
- architecture boundary enforcement can detect configured Page/component-to-state/domain-hook/service dependencies, but it cannot prove facade purity or Hook cohesion.
- `enforce-hooks` checks configured Hook structure/naming constraints; it does not prove Hook cohesion.
- `enforce-states` checks configured store constraints; it does not prove state is authoritative.

Treat a mechanical pass as evidence only for the listed invariant. Never disable, weaken, or suppress checks to accept a state boundary.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must name the missing caller/provider/lifecycle evidence. Never downgrade it to PASS because the local file looks plausible.

## Resolution Protocol

- **VIOLATION:** provide evidence and required correction.
- **LEGACY:** identify the out-of-scope violation; it MUST NOT justify new code.
- **EXCEPTION:** record explicit project authorization and exact scope.
- **NEEDS-EVIDENCE:** name missing evidence and next concrete inspection.
- **PASS:** only after the Final Review Gate is satisfied.

## User Decision Gate

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the dependent review/implementation flow and present exact evidence, applicable rule, impact, compliant options, and one recommended option. Do not silently choose between materially different ownership directions.

## Evidence Standard

Every confirmed finding MUST include exact file/line, state/effect category, current owner, expected owner, dependency/lifecycle evidence, impact, and minimal correction. Retrospective PASS requires inspection of the relevant consumer graph.

## Handoffs

- Page/domain component/facade/Layout responsibility → `architecture-review`.
- API/service/cache/data ownership → `data-boundary-review`.
- Test consequences → `testing-review`.
- Structural decomposition → `complexity-refactoring`.
- Objective Rules of Hooks or mechanical constraints → enforcement/linting.

The receiving Skill owns final disposition; do not bounce findings without new evidence.

## Non-Goals

Do not split Hooks because they are long, create facade callbacks or wrapper components only to reduce Page line count, globalize state for convenience, or replace an approved server-state boundary with local/global state without a concrete requirement.

Do not prohibit local React state or presentation-only Hooks in presentation layers when they genuinely own only UI interaction.

## Self-explanatory names and code

Hook, selector, action, state, effect helper, facade field, fixture, and test
names must expose their owner and behavior without opening unrelated files.
Do not use comments to compensate for unclear names or structure; follow the
comment policy in `.agents/rules/coding.md`.

## Final Review Gate

Before PASS, confirm authoritative source, state category, narrowest semantic owner, Page/component/facade/Hook/store ownership, facade purity, presentation decoupling, effects/lifecycle, Hook cohesion, provider/store responsibility, returned contract, relevant consumer graph, and objective enforcement results were inspected. A PASS applies only to the inspected scope; unresolved required evidence produces **INCOMPLETE**.
