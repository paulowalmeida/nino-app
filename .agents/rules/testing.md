# Testing Rules

This file defines mandatory testing constraints. The rules are target architecture, not a description of every current repository configuration.

## Current Code Is Not Architectural Precedent

Existing code in `nino-app/apps/manager` is current/legacy evidence. If existing code conflicts with this file, it MUST NOT be copied, extended, or used as justification for a new violation.

## Test Runner Baseline

`apps/manager` uses Vitest through its declared `test` (`vitest run`) and `test:watch` scripts. Its authoritative configuration is `apps/manager/vitest.config.ts`, which uses `jsdom` and `src/test/setup.ts`; that setup defines the browser API shims required by manager tests. The configuration declares V8 coverage reporters, but the package does not currently expose a dedicated coverage script.

Run the declared package script from the manager package when the relevant suite is configured. The agent MUST NOT invent an alternate manager test command, assume coverage is run by the normal test script, or introduce Jest, Mocha, or another runner merely for familiarity.

## Test Location

Every tested application unit under `src/` MUST own one folder. Its source,
test, and mock/fixture file MUST live together and share the unit name:

```text
useOrders/
├── useOrders.ts
├── useOrders.test.tsx
└── useOrders.mock.ts

OrderCard/
├── OrderCard.tsx
├── OrderCard.test.tsx
├── OrderCard.mock.ts
└── OrderCard.module.css
```

This applies to Hooks, components, Pages, facades, adapters, services, stores,
operations, utilities, skeletons, and every other unit with a test. A directory
such as `hooks/` MUST NOT contain several loose Hook source/test pairs; each
Hook owns `hooks/<hook-name>/`.

A unit MAY own a second test file named `<Unit>.behavior.test.tsx` when
separating interaction from render keeps both readable. It is the same unit:
same folder, same `<Unit>.mock.ts`, and no source file of its own.

Every `*.test.ts`/`*.test.tsx` MUST have its same-name
`*.mock.ts`/`*.mock.tsx` sibling. The mock file is declarative only: it owns
typed props and immutable fixture/input data for that unit. It MUST NOT contain
`vi.fn`, spies, callbacks, factories, functions, Service/Hook implementations,
mock return configuration, or any other behavioral double. All behavioral
mocking and scenario-specific setup remain inside the test. The mock file MUST
NOT be empty or exist only to satisfy structure.

A legacy test or fixture still under `src/__tests__/` MUST be migrated into
the unit folder before it is edited.

The manager package is migrating away from the centralized `src/__tests__/` tree domain by domain; a domain not yet migrated MUST NOT be moved wholesale just to clean up legacy layout — migrate its tests when that domain's source is migrated.

The required Page verification command is
`node .agents/enforcement/verify-page-feature.mjs <feature>` from `nino-app/`.
It MUST complete the global source-to-test-to-mock inventory before running
Vitest with 100% statements, branches, functions, and lines for the selected
Page domain. It is owned by `.agents/enforcement`; consuming apps MUST NOT
mirror it as a package script.

## Observable Behavior

UI tests MUST prefer observable behavior and public contracts over implementation details. Testing Library's guiding principles require tests to resemble user interaction and discourage dependence on internal state, methods, lifecycle details, and child implementation.

The agent MUST NOT normally assert internal component state, private helpers, implementation-only structure, or CSS classes when a semantic query expresses the behavior.

## UI Queries

When Testing Library is used, prefer:

1. `getByRole` / `findByRole` when applicable;
2. `getByLabelText` / `findByLabelText` for form controls;
3. other accessible/user-oriented queries;
4. test IDs only when no suitable semantic query exists.

Brittle implementation selectors MUST NOT be used when an appropriate semantic query exists.

## Test Responsibility

Each test case, fixture, factory, and helper MUST have one coherent responsibility. Tests SHOULD verify one behavior or one coherent contract. Test names MUST describe observable behavior or a contract rather than implementation mechanics.

## Arrange / Act / Assert

Tests SHOULD make Arrange → Act → Assert boundaries clear. Complex setup MUST NOT obscure the behavior under test; when setup acquires unrelated responsibilities it MUST be simplified or decomposed.

## Mocking

Mocks MUST be limited to external, expensive, nondeterministic, unavailable, or otherwise inappropriate dependencies for the test's purpose. The unit under test MUST NOT be mocked merely to simplify assertions. Meaningful behavior MUST NOT be mocked away and then claimed as verified.

## Zustand Tests

When Zustand application state is introduced:

- tests MUST verify observable state and actions;
- tests MUST NOT depend on Zustand internals;
- each test MUST isolate or reset relevant application state;
- tests MUST NOT depend on state leaked by another test.

Pages and domain components MUST remain testable through their public facade
boundary without direct application-level Zustand, Service, QueryClient, or
raw integration-Hook consumption.

## Business Logic and Regression

Business rules outside TSX SHOULD be independently testable whenever practical. Utilities, domain logic, Service operations, selectors, and meaningful Custom Hooks SHOULD have focused contract tests.

Business logic MUST NOT be moved into TSX merely to avoid focused tests.

When fixing a bug, the agent MUST add or update a regression test unless a documented technical reason makes that impractical. The regression MUST fail before the fix and pass after it when executable.

The agent MUST consider invalid inputs, missing values, empty inputs, boundaries, failure responses, and relevant authorization outcomes.

Coverage is evidence, not proof. Meaningless tests MUST NOT be added merely to increase coverage.

## Async Tests

Async behavior MUST be awaited and verified deterministically. Use Vitest's documented async mechanisms and Testing Library's `findBy*`/`waitFor` when appropriate.

The agent MUST NOT use arbitrary sleeps, unawaited assertions whose result matters, or timing hacks that conceal race conditions.

## Isolation

Each test MUST be independently executable and MUST NOT depend on execution order, leaked module state, leaked Zustand state, prior output, or uncontrolled external services.

Where Vitest isolation is configured, it MUST NOT be disabled merely to make tests pass.

## No Test Circumvention

The agent MUST NOT disable failing tests, add unjustified skips, weaken assertions, mock away the behavior under investigation, alter configuration to conceal defects, delete regression tests for convenience, or disable isolation to hide shared-state problems.

A failing test MUST be investigated, not hidden.

## Verification Before Completion

The agent MUST:

1. identify changed behavior requiring tests;
2. inspect existing relevant tests before creating duplicates;
3. ensure the package test workflow actually exists before invoking package-specific commands;
4. add or update focused tests;
5. use semantic/user-oriented queries where applicable;
6. run the relevant configured test command(s);
7. investigate unexpected failures;
8. verify no test was weakened, skipped, or removed without explicit justification;
9. verify async assertions are awaited;
10. inspect the final diff.

For a refactored page domain, the agent MUST additionally inventory every
folder and executable source file, pair it with a colocated test, and run
coverage scoped to `src/pages/<feature>/**/*`. Completion requires 100%
statements, branches, functions, and lines unless the user explicitly approves
a documented exclusion. Type-only files, CSS, declarations, behaviorless
barrels, and mocks are not executable coverage targets. Search results and a
coverage percentage do not replace file-by-file inspection or meaningful
behavior assertions.

Passing a suite does not prove every requirement was implemented correctly.

## Mechanical Enforcement

Where technically possible, automated checks MUST enforce test location/naming, TypeScript correctness, test linting, forbidden skip/focused modes, configured coverage thresholds, package test configuration, and objectively detectable violations of required query conventions.

The agent MUST fix the underlying problem rather than weaken the test or enforcement.

## Technical References

- https://testing-library.com/docs/guiding-principles/
- https://testing-library.com/docs/queries/about/
- https://vitest.dev/guide/learn/async
- https://vitest.dev/config/isolate.html

External guidance defines testing principles; Nino-specific structure and architecture remain authoritative.

## Final Rule

> Tests MUST prove observable behavior, protect contracts and regressions, remain isolated and deterministic, and never be weakened merely to make the suite pass. Current manager tooling MUST be inspected before test commands are assumed or invented.
