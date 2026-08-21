# Hooks Rules

This file defines mandatory rules for React Hooks, custom Hooks, local UI state, Zustand application-state consumption, and the component categories authorized to consume integrated state.

React-specific rules in this file are grounded in the official React documentation. Zustand-specific implementation facts are grounded in the official Zustand documentation. Nino-specific rules define application-state boundaries and are additional project constraints.

Existing implementation in `nino-app/apps/manager` is repository evidence, not automatic architectural precedent. New or modified code MUST follow these rules even when legacy code does not.

Official references:
- React Rules of Hooks: https://react.dev/reference/rules/rules-of-hooks
- React Rules: https://react.dev/reference/rules
- React Hooks reference: https://react.dev/reference/react/hooks
- Zustand introduction and store-hook model: https://zustand.docs.pmnd.rs/learn/getting-started/introduction
- Zustand selector subscriptions: https://zustand.docs.pmnd.rs/reference/middlewares/subscribe-with-selector

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## Rules of Hooks

The agent **MUST** follow React's Rules of Hooks exactly.

Hooks MUST:

- be called only at the top level of a React function component or Custom Hook;
- be called in the same order on every render;
- preserve the normal Rules of Hooks across every execution path.

Hooks MUST NOT be called inside conditions, loops, nested callbacks, event handlers, ordinary non-Hook helpers, class components, or `try`/`catch`/`finally` blocks.

A Hook call MUST NOT be placed after a conditional early return when that changes whether the Hook executes.

The agent **MUST NOT** bypass the Rules of Hooks by wrapping a Hook call in another function, alias, callback, or conditional abstraction.

The project's official React Hooks linting rules **MUST** be enabled for applicable source code and **MUST NOT** be disabled or weakened to make an implementation pass.

## Custom Hooks

A Custom Hook is a function whose primary responsibility is encapsulating reusable React stateful behavior or Hook composition.

Every Custom Hook **MUST** have one coherent responsibility and **MUST** follow `rules/coding.md`, including its Single Responsibility requirement and applicable structural-complexity review.

A Custom Hook **MUST NOT** become a collection of unrelated domain operations merely because those operations can be reached from the same component.

Examples:

```text
useOrders()                  one coherent responsibility
useCreateOrder()             one coherent responsibility
useOrdersAndPermissions()    unrelated responsibilities
useUserProfileAndBilling()   unrelated responsibilities
```

When a Custom Hook accumulates distinct responsibilities or independent reasons to change, the agent **SHOULD** separate those responsibilities into cohesive Hooks or lower-level operations. A metric warning alone is **NOT** sufficient justification for extraction.

A Custom Hook **MUST NOT** be used as an architectural escape hatch to bypass component-layer restrictions defined by `rules/architecture.md`.

## Local UI State and UI Hooks

Local UI state is state that exists solely to control the local interaction or presentation behavior of the component that owns it.

Examples include:

- open/closed state of a local dialog;
- selected local tab;
- temporary input state;
- local hover/focus interaction state;
- local expansion/collapse state.

Local UI state **MAY** use React state mechanisms such as `useState` or `useReducer` when that state belongs exclusively to the component's own UI behavior.

Pure UI Custom Hooks may also be consumed by Atoms, Molecules, and Organisms when they encapsulate presentation-only behavior and do not read application/server state, call Services/APIs, use TanStack Query, or hide an otherwise prohibited dependency. In the current repository, `hooks/ui` is the designated location for such application UI Hooks.

Examples of acceptable presentation-only responsibilities include disclosure state, media-query behavior, local keyboard/focus behavior, or reusable local interaction mechanics.

Local UI state or a UI Hook **MUST NOT** be used to hide application state, domain state, server state, shared state, or endpoint integration merely to avoid an approved boundary.

## Application State — Zustand

Zustand is the project's source of truth for application state when the application-state architecture requires shared client state.

A Zustand store normally exposes a Hook-shaped consumer interface. The fact that a store consumer is a Hook **MUST NOT** cause it to be treated as ordinary local React state for architectural purposes.

For this project:

> **A Zustand Store Hook is the consumer interface of application state, not merely a local UI Hook.**

Therefore, access to a Zustand Store Hook is governed by the application-state boundary rules below.

## Authorized Direct Consumers of Zustand Application State

The following component or execution categories are authorized to consume Zustand Store Hooks directly:

```text
Page        ✅
Container   ✅
Layout      ✅
Guard       ✅
Loader      ✅
Provider    ✅
Custom Hook ✅
```

These categories may select application-state data and actions from the Zustand store when required by their responsibility.

Authorization to consume Zustand **does NOT** authorize a category to expose the Store Hook itself to a prohibited UI layer.

A Page SHOULD consume Zustand only when the selected state affects Page-level governance or screen-level rendering. Region-specific application-state consumption SHOULD live in the narrowest coherent Container instead of accumulating in the Page.

## Forbidden Direct Consumers of Zustand Application State

The following presentation layers **MUST NOT** consume Zustand Store Hooks directly:

```text
Atom       ❌
Molecule   ❌
Organism   ❌
```

This restriction applies regardless of whether the store contains one field, many fields, derived state, or actions.

The reason is architectural: Atoms, Molecules, and Organisms remain presentation units and **MUST NOT** become directly coupled to the application's global state source.

## No Indirect Circumvention

The prohibition on direct Zustand consumption applies to indirect access as well.

A prohibited component **MUST NOT** obtain application state through:

- a Store Hook passed as a prop;
- a Store Hook re-exported from another module;
- a wrapper that calls the Store Hook internally and exposes it to the prohibited component;
- an alias created only to hide the Zustand import;
- a helper or utility whose sole purpose is to conceal Store Hook access;
- an intermediary component created solely to bypass the boundary;
- a context/provider whose only purpose is to smuggle the Store Hook into a prohibited component.

The prohibition follows the dependency itself, not merely the import statement.

## Passing Data Across the Boundary

An authorized consumer **MAY** pass application-state data and actions to a lower presentation layer through its normal public interface, provided that the lower layer does not receive the Store Hook or otherwise gain direct access to application state.

Allowed:

```tsx
function UserContainer() {
  const user = useUserStore((state) => state.user)
  const saveUser = useUserStore((state) => state.saveUser)

  return <UserProfile user={user} onSave={saveUser} />
}
```

Forbidden:

```tsx
function UserContainer() {
  return <UserProfile storeHook={useUserStore} />
}
```

The lower presentation layer receives values and actions, not the source-of-truth interface.

## Application State Responsibility

Authorized consumers **MUST** consume only the application state needed for their responsibility.

A component **MUST NOT** subscribe to a broad portion of the store merely because it is convenient when a narrower selector can express the actual requirement.

When using Zustand selectors, the agent **SHOULD** select the smallest relevant state required by the component or Hook.

The agent **MUST NOT** move application-state logic into Atoms, Molecules, or Organisms merely to reduce code in an authorized consumer.

When Page state usage grows because multiple independent regions have distinct integration needs, the agent MUST evaluate whether those regions belong in separate Containers rather than leaving the Page as a broad integration owner.

## Endpoint and Server-State Boundary

Hooks that consume server state, endpoint state, or tools such as TanStack Query **MUST** follow `rules/data-boundaries.md` and `rules/architecture.md`.

For component consumption:

```text
Page        ✅ only for Page-level governance/render decisions
Container   ✅ for its coherent region responsibility
Layout      ✅ only when persistent chrome genuinely requires it
Atom        ❌
Molecule    ❌
Organism    ❌
```

Atoms, Molecules, and Organisms MAY consume presentation-ready values, status flags, and callbacks produced by an authorized Page/Container boundary; they MUST NOT consume domain/query Hooks, Services, or APIs directly.

A Page MUST NOT absorb region-specific endpoint orchestration merely because it is the route component. Prefer the narrowest coherent Container when the integration exists to operate one semantic region of the screen.

The agent **MUST NOT** infer that every endpoint request belongs in Zustand solely because both can be accessed through Hooks.

## Hook-to-Hook Composition

A Custom Hook **MAY** call other Hooks when that composition is part of the Custom Hook's single responsibility and complies with React's Rules of Hooks.

A Custom Hook **MUST NOT** combine unrelated Hooks solely to create a convenient catch-all API.

## Hook Naming

Custom Hooks **MUST** follow the project's established naming convention and React's `use...` convention for functions intended to be Hooks.

A function **MUST NOT** be named as a Hook merely to gain permission to call Hooks or consume application state.

Naming a function `useSomething` does not grant it authority to cross an architectural boundary.

## State Consumption Decision Gate

Before a new or modified Hook/component consumes state, the agent **MUST** be able to answer:

1. What kind of state is this?
2. Is it local UI state, application state, server/remote state, or another category defined by project rules?
3. Which source of truth owns that state?
4. Is the current layer/category authorized to consume that source directly?
5. If this is a Page, does the state affect screen governance as a whole, or should it move to a coherent Container?
6. If this is a Container, is the state actually scoped to that Container's responsibility?
7. Can the presentation requirement be satisfied through values/actions without exposing the integration source to an Atom, Molecule, or Organism?

If the source-of-truth category or authorization cannot be established from the repository rules, the agent **MUST** investigate before editing and **MUST NOT** invent a boundary exception.

## Verification Before Completion

Before completing Hook or state-related work, the agent **MUST**:

1. verify compliance with React's Rules of Hooks;
2. verify the Custom Hook's Single Responsibility;
3. inspect applicable structural complexity signals when the changed Hook is a relevant hotspot;
4. identify every direct Zustand Store Hook consumer introduced or modified;
5. verify that each direct consumer is an authorized category;
6. identify endpoint/query Hook consumers introduced or modified and verify Page-vs-Container ownership;
7. verify that no prohibited presentation component receives or obtains an integration Hook indirectly;
8. verify that only necessary application state is selected;
9. run the relevant React Hooks linting and project checks;
10. inspect the final diff for unrelated state-management changes.

Passing the Rules of Hooks lint alone does **NOT** prove compliance with Nino's application-state or endpoint-consumption boundaries.

## Enforcement

The following rules **MUST** be protected mechanically whenever technically possible:

- React Rules of Hooks through the official `eslint-plugin-react-hooks` rules;
- prohibited Zustand imports by layer/path;
- prohibited domain/query Hook or Service access from presentation layers;
- indirect Store Hook/integration access where objective dependency analysis can identify it;
- forbidden re-exports or wrapper-based boundary circumvention;
- Custom Hook naming and location conventions where the project defines them;
- structural-complexity signals through the project's complexity analyzer.

Objective violations **MUST** fail the relevant check.

The agent **MUST** fix the implementation rather than weaken, disable, suppress, or bypass the enforcement.

Complexity findings MUST follow the layered policy in `rules/coding.md`: a metric signal does not automatically require decomposition, and semantic refactoring decisions belong to the `complexity-refactoring` Skill.

## External Technical Authority

React behavior and Rules of Hooks **MUST** follow the official React documentation linked at the top of this file.

Zustand's store-as-Hook and selector behavior **MUST** be interpreted according to the official Zustand documentation linked at the top of this file.

Nino-specific application-state rules in this file are project constraints and are not presented as React or Zustand requirements.

## Final Rule

> **Use React Hooks according to React's official rules. Keep Atoms, Molecules, and Organisms presentation-focused. Put coherent region-level application/server integration in Containers, and keep Page integration limited to screen governance or Page-level render decisions.**
