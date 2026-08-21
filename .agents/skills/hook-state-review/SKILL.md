---
name: hook-state-review
description: Review React Hooks, state, providers, guards, loaders, effects, and store consumers in nino-app for correct ownership, lifecycle, data flow, and coherent contracts.
---

# Hook and State Review

## Purpose

Determine whether state and side effects live at the narrowest stable boundary, whether a Hook has one coherent responsibility, and whether providers/stores are used for the correct kind of state.

## Scope

Apply this Skill to `apps/manager/src/{hooks,states,providers,guards,loaders}`, their direct consumers, and components with relevant local state or effects. Hand off transport/cache ownership to `data-boundary-review` and UI composition to `architecture-review`.

## Authority

Apply `AGENTS.md`, applicable `.agents/rules/*`, `.agents/rules/hooks.md`, and objective `enforce-*`/lint failures. React Rules of Hooks are hard constraints; this Skill handles architectural judgment around otherwise-valid code.

## External Foundations and Nino Decisions

- React Hook call restrictions: https://react.dev/reference/rules/rules-of-hooks
- React Effects synchronize with systems outside React and need accurate dependencies/cleanup: https://react.dev/learn/synchronizing-with-effects
- Zustand stores expose a Hook-shaped consumer and selectors subscribe consumers to selected state: https://zustand.docs.pmnd.rs/learn/getting-started/introduction

Nino's state categories, authorized Zustand consumers, and layer boundaries are project decisions. React or Zustand documentation does not authorize a prohibited UI layer to consume application state.

## Mandatory Review Sequence

1. Inspect the complete Hook/component/provider/store consumer.
2. Classify each relevant value as server, local UI, derived, form, or shared application state.
3. Identify authoritative source of truth and smallest stable owner.
4. Trace reads, writes, mutations, effects, provider boundaries, and callers.
5. Determine whether each Hook coordinates one coherent behavior.
6. For each effect, identify the external system it synchronizes with.
7. Check the returned contract for unnecessary coupling or unstable breadth.
8. Run applicable Hook/state enforcement and lint; record what each result proves.
9. Record findings and disposition.

## Nino State and Execution Contracts

- **local component/UI state:** owns one component's interaction or presentation state. Keep it local unless multiple consumers require one stable shared owner.
- **Custom Hook:** owns one reusable stateful behavior or Hook composition. It may compose related Hooks but must not return JSX or act as a UI-layer escape hatch.
- **`states/` Zustand Store:** owns shared client/application state and its named actions. It must not host TanStack Query or become a generic transport/cache boundary. When a store action initializes shared session state, trace the Service and persistence separately rather than assuming all async work is server-state caching.
- **Provider:** installs one coherent technical/shared capability, such as the Query client. It must not create a second application-state source, bundle unrelated workflows, or smuggle a Store Hook into a prohibited UI layer.
- **Guard/Loader:** owns route-entry gating, loading coordination, redirects, and necessary authorized store reads/writes. It must not become a route-specific business workflow, UI controller, or Service substitute.

Only Pages, Layouts, Guards, Loaders, Providers, and Custom Hooks may consume Zustand directly. Atoms, Molecules, and Organisms may receive selected values/actions through props, but never the Store Hook, a wrapper around it, or an equivalent indirect dependency.

## 9/10 Gates

Report a confirmed violation when evidence shows:

- server state is copied into another state layer without a concrete synchronization requirement;
- derived state is stored despite safe derivation from authoritative inputs;
- state is lifted/globalized beyond the actual consumer set;
- a Custom Hook combines unrelated domains or independent reasons to change;
- a Hook contains presentation composition or bypasses component-layer boundaries;
- a Provider owns unrelated workflows or side effects instead of a coherent shared capability;
- an effect mirrors values that should be derived or responds to an event that should be handled at the event boundary;
- an effect lifecycle does not match the thing it synchronizes;
- a store becomes a transport/service boundary or stores server state that belongs elsewhere;
- a guard/loader performs business workflow instead of route gating/loading coordination;
- the Hook contract exposes unrelated capabilities solely to hide internal complexity.

## Ownership Test

Ask:

> Who is the smallest stable owner that needs this state for correct product behavior?

Real shared ownership justifies lifting. Anticipated reuse does not.

## Effect Test

For every effect, identify the external system, setup trigger, dependencies, cleanup, and behavior when inputs change or the owner unmounts. If there is no external system, evaluate derivation or explicit event handling instead.

Require a cleanup for subscriptions, listeners, timers, observers, object URLs, and connections; require cancellation or stale-result protection when asynchronous work can outlive the relevant input/owner. Do not silence exhaustive-dependencies: change the Effect structure when the dependency list exposes an incorrect lifecycle. Do not require an Effect when pure derivation or an event handler expresses the behavior.

## Hook Cohesion Test

Several operations may be valid inside one Hook when they form one coherent behavior/state machine. Length, line count, or operation count alone is not evidence of multiple responsibilities.

Split when responsibilities have materially different reasons to change or can be independently understood without reconstructing the parent Hook.

## State Classification

Do not infer state category from API shape alone. Confirm whether the value is authoritative, derived, temporary UI state, form state, or application-shared state from its lifecycle and consumers.

For a Zustand consumer, identify the selected fields/actions and why a narrower selector cannot express the need. A broad store subscription is a violation only when the inspected consumer needs materially less state; do not optimize selectors speculatively.

## Enforcement Map

Run applicable checks and interpret them narrowly:

- `eslint-plugin-react-hooks` enforces Hook call/dependency rules; it cannot determine Nino ownership or whether an Effect has a valid external system.
- `enforce-hooks` rejects JSX in `hooks/` and names exposing `Query`/`Mutation`; it does not prove Hook cohesion.
- `enforce-states` rejects Context, TanStack Query, and generic store names in `states/`; it does not prove state is authoritative or selectors are narrow.
- `enforce-providers` rejects `createContext` in `providers/`; it does not prove a Provider owns one coherent capability.
- `enforce-guards-loaders` rejects generic names; it does not prove route gating is separate from business workflow.

Treat a mechanical pass as evidence only for the listed invariant. Never disable, weaken, or suppress these checks to accept a state boundary.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must name the missing caller/provider/lifecycle evidence. Never downgrade it to PASS because the local file looks plausible.

## Resolution Protocol

- **VIOLATION:** provide the evidence and required correction.
- **LEGACY:** identify the out-of-scope violation; it MUST NOT justify new code.
- **EXCEPTION:** record the explicit project authorization and exact scope. No inferred or convenience exceptions.
- **NEEDS-EVIDENCE:** name the missing evidence and next concrete inspection. It remains unresolved until evidence is obtained or review is explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

An unresolved `NEEDS-EVIDENCE` item MUST NOT be silently treated as PASS. If required evidence cannot be obtained, the final status is **INCOMPLETE**.

## User Decision Gate

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the review or implementation flow that depends on that item. Before any further affected action, present the user with:

1. the classification, exact evidence, applicable rule, and concrete impact;
2. one or more concrete correction or disposition options that stay within the authorized scope;
3. one explicitly recommended option and its justification.

Do not edit the affected code, accept a deviation, choose an option, convert the item to `PASS`, or continue to another target until the user makes an explicit decision. A proposed `EXCEPTION` also requires explicit user authorization and must use this same decision format.

Apply the same gate before choosing between materially different compliant alternatives, including scope, state ownership, effect boundary, or correction direction. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

## Evidence Standard

Every confirmed finding MUST include exact file/line, state/effect category, current owner, expected owner, dependency/lifecycle evidence, impact, and minimal correction. Retrospective PASS requires inspection of the relevant consumer graph.

## Handoffs

- UI layer responsibility → `architecture-review`.
- Component/composition boundary → `architecture-review`.
- API/service/data ownership → `data-boundary-review`.
- Test consequences → `testing-review`.
- Structural decomposition → `complexity-refactoring`.
- Objective Rules of Hooks or mechanical constraints → enforcement/linting.

The receiving Skill owns final disposition; do not bounce findings without new evidence.

## Non-Goals

Do not split Hooks because they are long, globalize state for convenience, or replace an approved server-state boundary with local/global state without a concrete requirement.

Do not require Zustand, a Provider, a Custom Hook, selector optimization, cleanup, or cancellation when the inspected lifecycle has no shared state, external resource, or stale-work risk.

## Final Review Gate

Before PASS, confirm authoritative source, state category, narrowest owner, effects/lifecycle when applicable, Hook cohesion, provider/store responsibility, returned contract, relevant consumer graph, and objective enforcement results were inspected. A PASS applies only to the inspected scope; unresolved required evidence produces **INCOMPLETE**.
