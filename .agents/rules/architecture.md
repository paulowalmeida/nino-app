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

Nino intentionally adapts Atomic Design with two application-specific structural layers outside the methodology:

- **Container:** scoped application orchestration for a coherent part of a screen;
- **Layout:** persistent application shell/chrome around the active Page.

This project may impose **stricter dependency, state, and composition rules** than the external methodology. When that happens, the Nino project rule wins.

## Architecture Model

The preferred responsibility flow is:

```text
Layout
  ↓
Page
  ↓
Container
  ↓
Organism
  ↓
Molecule
  ↓
Atom
```

The diagram describes responsibility direction, not a mandatory composition path. A Page may compose Organisms, Molecules, or Atoms directly when no Container is required. A Container may compose Organisms, Molecules, or Atoms directly when that is the smallest coherent presentation boundary.

`Container` and `Layout` are outside Atomic Design. They exist to keep presentation layers free from application integration while preventing Pages from becoming integration-heavy monoliths.

### Atom

An Atom is the smallest UI unit with one clear responsibility.

**MUST:**
- represent one visual/functional responsibility;
- remain independent of business logic and application infrastructure;
- receive external data and behavior through props/dependency injection when necessary;
- reuse a Design System Atom when the DS already satisfies the requirement;
- be application-specific when the DS has no suitable solution.

**MUST NOT:**
- import or render Molecules, Organisms, Containers, Pages, or Layouts;
- import or render another application Atom;
- access Zustand, application-state Hooks, endpoint/query Hooks, Services, or APIs;
- contain business logic;
- be created only to group other Atoms;
- discover, create, or fetch external dependencies on its own.

React-local mechanisms used solely for the Atom's own UI behavior, such as `useState`, `useReducer`, `useId`, `useRef`, or equivalent local React APIs, are **not** application-state or endpoint integration and are allowed when necessary for the Atom's own interaction.

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
- import or render Molecules, Organisms, Containers, Pages, or Layouts;
- access Zustand, application-state Hooks, endpoint/query Hooks, Services, or APIs directly;
- contain business logic.

React-local state and local React Hooks are allowed when the state belongs exclusively to the Molecule's own UI interaction and does not represent shared/application/server state.

A combination of Atoms **MUST ONLY be classified as a Molecule when it forms a coherent functional unit**. The number of Atoms alone **MUST NOT determine the layer**.

### Organism

An Organism is a significant presentation section composed of Molecules and/or Atoms.

**MAY:**
- use Molecules and Atoms directly;
- skip the Molecule layer when there is no Molecule-level functional unit to represent;
- own local UI state and interactions belonging exclusively to the section itself;
- receive data, async-state flags, and callbacks through its public props.

An Organism is intentionally presentation-focused. It may express rich UI behavior, but it does not know how application/server data is obtained or persisted.

**MUST NOT:**
- import or render another Organism, Container, Page, or Layout;
- access Zustand or application-state Hooks directly;
- call endpoint/query Hooks such as TanStack Query/domain integration Hooks;
- call Services or APIs directly;
- implement domain decisions or transport/cache orchestration;
- exist only as an arbitrary grouping of Atoms.

If a group of Atoms forms a coherent, reusable functional unit, it **MUST** be extracted into a Molecule.

Local React state is allowed only when it belongs exclusively to the Organism's own UI behavior. Shared/application state follows the explicit state-consumer rules in `rules/hooks.md`.

### Container

A Container is a Nino-specific application orchestration layer for one coherent semantic/functional region of a screen. It exists outside Atomic Design.

A Container should be used when a region needs application integration that
would otherwise bloat a Page or improperly couple an Organism to
application/server state. It is also appropriate for a substantial,
independently coherent Header, Content, or Footer region as defined by the
Page Region Composition rule.

**MUST:**
- own one coherent screen-region responsibility;
- compose Organisms, Molecules, and/or Atoms needed by that region;
- when its region needs server/application data, obtain it through approved
  Hooks/state boundaries;
- when it consumes integration, convert its results into presentation props,
  callbacks, and UI-state flags;
- keep transport and cache mechanics inside their authoritative Hook/Service layers;
- use the `Container` suffix when represented by a component file.

**MAY:**
- consume approved domain/query Hooks such as `useQuery`/`useMutation` wrappers;
- consume Zustand application state when required by the Container's scoped responsibility and authorized by `rules/hooks.md`;
- own local UI state specific to the coordinated region;
- choose which presentation units within its own region render based on data/state it owns.

**MUST NOT:**
- import or render another Container, Page, or Layout;
- perform raw API/HTTP transport;
- call Services directly when an approved domain/query Hook owns the integration path;
- implement domain rules, payload transformation policy, or cache policy that belongs in a Hook, Adapter, Service, Constant, or domain owner;
- become a generic dumping ground for unrelated Page logic;
- own route-level governance that determines the screen as a whole.

A Container is justified by **scoped orchestration or a substantial named Page
region**, not by file size. A small purely presentational fragment without a
Header, Content, or Footer responsibility belongs in Atom/Molecule/Organism,
not in a Container.

### Page

A Page represents a concrete application route/context and owns that screen's governance and macro composition.

**MUST:**
- govern the concrete route: route params, redirects, access decisions, and route-level concerns;
- compose the Containers and/or lower UI layers that make up its screen;
- own screen-level loading, error, empty, and local interaction states only when those states affect the screen as a whole;
- keep region-specific integration in the narrowest appropriate Container;
- consume application/server state only when required for Page-level governance or Page-level render decisions.

**MAY:**
- consume approved application-state Hooks when required for route/screen governance;
- consume approved endpoint/query Hooks when the result determines whether a Page-level element, Container, or screen state should render;
- compose Organisms, Molecules, or Atoms directly when no Container-level orchestration is necessary.

**MUST NOT:**
- import or render another Page or Layout;
- absorb integration merely because it is the route component when that integration belongs to one coherent Container;
- implement domain rules, payload transformations, raw transport, or cache policy;
- become a monolithic visual or integration component;
- pass Store Hooks, query Hooks, Services, or other integration interfaces into prohibited presentation layers.

A Page's core question is **"which parts of this screen exist and how are they governed?"** A Container's core question is **"how does this coherent part of the screen obtain data and expose presentation-ready behavior?"**

### Page Region Composition

Before finalizing a Page's composition, identify its actual semantic regions in
this order when they exist:

```text
Header  → screen context, navigation, identity, summary, and primary context
Content → the screen's main task, sections, lists, panels, or tabs
Footer  → page-specific closing actions, summary, or supplementary controls
```

These are responsibility boundaries, not automatic HTML elements or mandatory
visual wrappers. A Page MUST NOT flatten substantial, independently coherent
regions merely because they receive data from the same Page-level query.

When a region has a stable screen-region responsibility, it MAY be represented
by a named Container such as `FeatureHeaderContainer`,
`FeatureContentContainer`, or `FeatureFooterContainer`. That Container MAY
compose the presentation units that form the region and receive
presentation-ready data from its Page when the query remains Page-level
governance. If the region also needs application/server integration, the
Container remains its narrowest authorized consumer.

This does not authorize generic wrappers: a region Container MUST still name a
real semantic region, own its composition, and give the Page a clearer macro
structure. A `ContentContainer` that merely hides unrelated regions, or a
Container that forwards one child without a region responsibility, is
FORBIDDEN.

### Layout

Layout is a structural layer outside Atomic Design.

**MUST:**
- provide the application's persistent chrome;
- wrap Pages;
- control shared structure such as header, sidebar, navigation, and persistent content areas;
- use the application's route-composition mechanism to render the active Page;
- freely compose Containers, Organisms, Molecules, and Atoms needed by persistent chrome;
- consume Zustand application state directly only when the responsibility requires it and as authorized by `rules/hooks.md`.

**MUST NOT:**
- import or render another Layout;
- implement Page-specific visual composition;
- manually import and choose which Page is active;
- contain route-specific business logic;
- depend on internal details of a specific Page;
- pass Store Hooks or integration interfaces to prohibited presentation layers.

## Dependency Matrix

The only permitted **UI/application composition** dependencies are:

```text
Page       → Container | Organism | Molecule | Atom
Container  → Organism | Molecule | Atom
Organism   → Molecule | Atom
Molecule   → Atom
Atom       → no application UI layer
Layout     → Page | Container | Organism | Molecule | Atom
```

State and server-data consumption are governed separately by `rules/hooks.md` and `rules/data-boundaries.md` and are **not** UI composition dependencies.

Any UI composition dependency outside this matrix is **FORBIDDEN**.

In particular:

```text
Page       → Page        ❌
Container  → Container   ❌
Container  → Page        ❌
Organism   → Container   ❌
Organism   → Organism    ❌
Molecule   → Molecule    ❌
Atom       → Atom        ❌
Molecule   → Organism    ❌
Atom       → Molecule    ❌
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
2. Is it an Atom, Molecule, Organism, Container, Page, or Layout?
3. What dependency path is allowed for that category?
4. Which existing components were evaluated?
5. Which Design System solution was evaluated?
6. Why is a new unit necessary?
7. If application/server state is consumed directly, why is this category authorized and why is this the narrowest stable owner?
8. If the component is a Page, does the integration truly affect Page-level governance rather than one coherent region?
9. If the component is a Container, is its responsibility cohesive enough to justify scoped orchestration?
10. Is any conflicting existing implementation being treated as legacy rather than as an architectural precedent?

If any required answer cannot be determined with sufficient confidence, the agent **MUST NOT invent a solution**. It must continue investigating or report the ambiguity.

## Classification Rule

The category **MUST be determined by the component's responsibility**, not by implementation convenience.

It is **FORBIDDEN** to choose a category solely to allow an import or integration that would be forbidden in the correct category.

Examples:

```text
"I need an Organism to call useOrders()."
            ↓
Do not redefine it as presentational-with-data. Put scoped integration in an appropriate Container.

"This Page has many useQuery/useMutation calls."
            ↓
Do not extract arbitrary Containers. Extract only coherent regions whose integration has a distinct reason to change.
```

## No-Workaround Rule

The agent **MUST NOT:**

- create an empty intermediate component merely to satisfy the hierarchy;
- create a Container that only forwards props and adds no orchestration responsibility;
- move logic to another layer merely to bypass an import restriction;
- rename a component to pretend it belongs to another category;
- create an artificial abstraction to evade a rule;
- use indirect imports, re-exports, aliases, or wrappers to access a forbidden layer;
- move a dependency to a non-TSX file solely to bypass a TSX-layer restriction without preserving the same architectural boundary;
- pass a Store Hook, query Hook, or Service through props/context/wrappers to bypass a prohibited presentation boundary;
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

Atomic Design provides the terminology and mental model. The following are **Nino-specific architectural constraints**:

- Containers and Layouts are application layers outside Atomic Design;
- Atoms, Molecules, and Organisms are presentation-focused and MUST NOT consume application/server integration directly;
- Containers may consume approved application/server integration for one coherent screen region;
- Pages may consume approved application/server integration only for route/screen governance or Page-level render decisions;
- Pages, Containers, Layouts, Guards, Loaders, Providers, and approved Custom Hooks may consume Zustand application state when their responsibility requires it;
- UI/application composition dependencies MUST follow the matrix above.

The agent **MUST NOT** reinterpret an external methodology statement as permission to bypass an explicit Nino constraint.

## Implementation Principle

These rules govern code creation and editing from the beginning of the task.

They **MUST NOT** be treated as a checklist reserved for a later audit.

Whenever a rule can be verified mechanically, it **MUST** be protected by automated enforcement.
