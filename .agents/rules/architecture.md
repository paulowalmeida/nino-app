# Architecture Rules

This file defines **mandatory implementation constraints** for the Nino application architecture. These are not recommendations and are not merely review criteria.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## Scope and Repository State

For application architecture, the primary target is:

```text
nino-app/apps/manager/src/
```

The repository is a monorepo. Shared packages, including the Design System, are governed by their own package boundaries and MUST NOT be treated as application-layer substitutes.

**Existing implementation is not automatically architectural precedent.** Code already present in `apps/manager` may predate these rules and may violate the desired architecture. Existing violations MUST NOT be copied, generalized, or cited as permission to introduce new violations. New or modified code MUST follow these rules unless an explicit project decision changes them.

## External Methodology Foundation

The Atomic Design terminology used by this project follows the model introduced by Brad Frost. Nino uses Atoms, Molecules, Organisms, and Pages: Molecules combine Atoms into relatively simple modules, Organisms form distinct interface sections, and Pages own concrete screens.

Authoritative references:

```text
https://atomicdesign.bradfrost.com/chapter-2/
https://atomicdesign.bradfrost.com/outline/
```

This project may impose **stricter dependency, state, and composition rules** than the external methodology. When that happens, the Nino project rule wins.

## Atomic Design

The UI follows this hierarchy:

```text
Layout
  ↓
Page
  ↓
Organism
  ↓
Molecule
  ↓
Atom
```

`Layout` is an application-structure responsibility and sits outside the Atomic Design hierarchy. The diagram describes a possible composition path, not a mandatory path: a Page may compose lower UI layers directly.

### Atom

An Atom is the smallest UI unit with one clear responsibility.

**MUST:**
- represent one visual/functional responsibility;
- remain independent of business logic and application infrastructure;
- receive external data and behavior through props/dependency injection when necessary;
- reuse a Design System Atom when the DS already satisfies the requirement;
- be application-specific when the DS has no suitable solution.

**MUST NOT:**
- import or render Molecules, Organisms, or Pages;
- import or render another application Atom;
- access Zustand, application-state Hooks, Services, or APIs;
- contain business logic;
- be created only to group other Atoms;
- discover, create, or fetch external dependencies on its own.

React-local mechanisms used solely for the Atom's own UI behavior, such as `useState`, `useReducer`, `useId`, `useRef`, or equivalent local React APIs, are **not** application-state access and are allowed when necessary for the Atom's own interaction.

**Before creating an Atom, the agent MUST:**

1. search the Design System;
2. search existing Atoms in the app;
3. verify that the requirement is actually atomic;
4. verify whether an existing component can be reused or composed;
5. create the Atom only when no suitable existing solution exists.

### Molecule

A Molecule combines Atoms into a simple, coherent unit with one responsibility.

**MUST:**
- represent one small functional responsibility;
- combine DS and/or application Atoms;
- receive external data and behavior through props/dependency injection when necessary.

**MUST NOT:**
- import or render Organisms or Pages;
- import or render another Molecule;
- access Zustand or application-state Hooks, Services, or APIs directly;
- contain business logic.

React-local state and local React Hooks are allowed when the state belongs exclusively to the Molecule's own UI interaction and does not represent shared/application state.

A combination of Atoms **MUST ONLY be classified as a Molecule when it forms a coherent functional unit**. The number of Atoms alone **MUST NOT determine the layer**.

### Organism

An Organism is a significant UI section composed of Molecules and/or Atoms.

**MAY:**
- use Molecules and Atoms directly;
- skip the Molecule layer when there is no Molecule-level functional unit to represent;
- own local UI state and interactions belonging exclusively to the section itself.

An Organism receives the data and callbacks it needs from its parent Page.
It may express a rich UI interaction, but it does not decide which feature is
mounted, query application state, or implement a domain decision.

**MUST NOT:**
- import or render another Organism;
- import or render Pages;
- access Zustand or application-state Hooks, Services, or APIs directly;
- contain business logic;
- exist only as an arbitrary grouping of Atoms.

If a group of Atoms forms a coherent, reusable functional unit, it **MUST** be extracted into a Molecule.

Local React state is allowed only when it belongs exclusively to the Organism's own UI behavior. Shared/application state follows the explicit state-consumer rules in `rules/hooks.md`.

### Page

A Page represents a concrete application route/context and owns that screen's
governance and composition.

**MUST:**
- govern the concrete route: route params, redirects, access decisions, and route-level concerns;
- compose the lower UI layers that make up its screen;
- own screen-level loading, error, empty, and local interaction states;
- consume application state only when required for route governance and authorized by `rules/hooks.md`.

**MUST NOT:**
- import or render another Page;
- implement domain rules, payload transformations, or API orchestration that belongs in a Hook, Adapter, Service, or Constant;
- become a monolithic visual component;
- pass the Zustand Store Hook to a prohibited lower UI layer.

**Allowed:**

```tsx
// ✅ Page → Zustand Store Hook → lower UI composition
const user = useUserStore((state) => state.user)
return (
  <>
    <UserProfile user={user} />
    <UserOrders userId={user.id} />
  </>
)
```

**Forbidden:**

```tsx
### Layout

Layout is a structural layer outside Atomic Design.

**MUST:**
- provide the application's persistent chrome;
- wrap Pages;
- control shared structure such as header, sidebar, navigation, and persistent content areas;
- use the application's route-composition mechanism to render the active Page;
- freely compose the Organisms, Molecules, and Atoms needed by that chrome;
- consume Zustand application state directly only when the responsibility requires it and as authorized by `rules/hooks.md`.

**MUST NOT:**
- import or render another Layout;
- implement Page-specific visual composition;
- manually import and choose which Page is active;
- contain route-specific business logic;
- depend on internal details of a specific Page;
- pass the Zustand Store Hook to a prohibited UI layer.

## Dependency Matrix

The only permitted **UI composition** dependencies are:

```text
Page       → Organism | Molecule | Atom
Organism   → Molecule | Atom
Molecule   → Atom
Atom       → no UI layer
Layout     → Page | Organism | Molecule | Atom
```

State consumption is governed separately by `rules/hooks.md` and is **not** a UI composition dependency.

Any UI composition dependency outside this matrix is **FORBIDDEN**.

In particular:

```text
Page      → Page       ❌
Organism  → Organism   ❌
Molecule  → Molecule   ❌
Atom      → Atom       ❌
Molecule  → Organism   ❌
Atom      → Molecule   ❌
```

The matrix applies to direct and indirect access. An indirect import, re-export, alias, wrapper, or intermediary component **MUST NOT** be used to obtain a dependency that would be forbidden directly.

## Reuse Before Creation

Before creating any new component, the agent **MUST execute this sequence**:

1. search the Design System;
2. search existing components in the app;
3. identify components with equivalent or closely related responsibility;
4. inspect the candidate's implementation and API/contract;
5. evaluate direct reuse;
6. evaluate composition of existing components;
7. create something new only when no existing solution satisfies the requirement.

Creating a semantically duplicated component when a suitable solution already exists is **FORBIDDEN**.

## Decision Gate Before Writing TSX

Before writing a new TSX file, the agent **MUST** be able to answer:

1. What is this component's responsibility?
2. Which Atomic Design layer does it belong to?
3. What dependency path is allowed for that layer?
4. Which existing components were evaluated?
5. Which Design System solution was evaluated?
6. Why is a new unit necessary?
7. If state is consumed directly, why is this layer authorized to consume that source of truth?
8. Is any conflicting existing implementation being treated as legacy rather than as an architectural precedent?

If any required answer cannot be determined with sufficient confidence, the agent **MUST NOT invent a solution**. It must continue investigating or report the ambiguity.

## Classification Rule

The layer **MUST be determined by the component's responsibility**, not by implementation convenience.

It is **FORBIDDEN** to choose a layer solely to allow an import that would be forbidden in the correct layer.

Example:

```text
"I need a component that can only import an Organism."
            ↓
The component MUST NOT be promoted to a higher layer just to allow the import.
```

## No-Workaround Rule

The agent **MUST NOT:**

- create an empty intermediate component merely to satisfy the hierarchy;
- move logic to another layer merely to bypass an import restriction;
- rename a component to pretend it belongs to another layer;
- create an artificial abstraction to evade a rule;
- use indirect imports, re-exports, aliases, or wrappers to access a forbidden layer;
- move a dependency to a non-TSX file solely to bypass a TSX-layer restriction without preserving the same architectural boundary;
- pass a Store Hook through props, context, wrappers, or intermediary components solely to bypass a prohibited state-consumption boundary;
- use existing `apps/manager` code as justification for violating this architecture in new or modified code.

## Legacy Code Rule

When an existing `apps/manager` implementation conflicts with these rules:

1. treat the existing implementation as **legacy/observed state**, not as permission;
2. do not reproduce the conflicting pattern in new code;
3. if modifying that area, bring the modified code toward compliance when doing so is within task scope;
4. do not perform unrelated migrations solely because a legacy violation exists;
5. report significant pre-existing architectural violations when they materially affect the requested change.

The agent **MUST NOT** claim that the current codebase already conforms unless that has been independently verified.

## External Foundation vs. Nino Constraint

Atomic Design provides the terminology and mental model. The following are **Nino-specific architectural constraints** and are intentionally stricter than the external methodology:

- Pages, Layouts, Guards, Loaders, Providers, and approved Custom Hooks may consume Zustand application state;
- Atoms, Molecules, and Organisms MUST NOT consume Zustand application state;
- UI composition dependencies MUST follow the matrix above.

The agent **MUST NOT** reinterpret an external methodology statement as permission to bypass an explicit Nino constraint.

## Implementation Principle

These rules govern code creation and editing from the beginning of the task.

They **MUST NOT** be treated as a checklist reserved for a later audit.

Whenever a rule can be verified mechanically, it **MUST** be protected by automated enforcement.
