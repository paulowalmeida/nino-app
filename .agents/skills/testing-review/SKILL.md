---
name: testing-review
description: Review nino-app tests for behavior coverage, boundary quality, isolation, failure-path confidence, selector/assertion stability, and maintainability.
---

# Testing Review

## Purpose

Determine whether tests protect important contracts, fail for the right reasons, remain stable under valid implementation change, and exercise the correct architectural boundary.

## Scope

Apply this Skill to colocated `*.test.*` and `*.mock.*` files, their source
units, `src/test/setup.ts`, and `vitest.config.ts`. Legacy `src/__tests__`
content follows the migration rule in `.agents/rules/testing.md`. Manager tests
use the declared `npm run test` workflow, Vitest `jsdom`, and the shared setup
file; do not assume a different runner or environment.

## Authority

Apply `AGENTS.md`, applicable `.agents/rules/*`, and objective test enforcement first. This Skill evaluates semantic test quality; it does not replace linting or structural hooks.

## External Foundations and Nino Decisions

- Testing Library favors tests resembling real software use and accessible DOM queries: https://testing-library.com/docs/guiding-principles/ and https://testing-library.com/docs/queries/about/
- Vitest async tests must await the work/assertions that determine completion: https://vitest.dev/guide/learn/async
- Vitest isolation configuration: https://vitest.dev/config/isolate.html

Nino's test locations, required regression behavior, and architectural boundaries are project decisions. These references do not require E2E tests, snapshots, a query type, or mocking strategy when a different boundary proves the contract better.

## Mandatory Review Sequence

1. State the behavior/contract the test claims to protect.
2. Inventory every folder and executable source file in scope and pair each
   with its same-name test and mandatory mock file inside the unit's own
   folder. Search and coverage are supporting evidence only.
3. Identify the narrowest stable boundary that can prove it.
4. Inspect setup, mocks, fixtures, selectors, assertions, and cleanup.
5. Inspect the configured environment, shared setup, state/cache reset, and mock lifecycle when they affect the scenario.
6. Check success, failure, boundary, permission, loading/empty, and concurrency-sensitive behavior where relevant.
7. Determine whether failures correspond to meaningful regressions.
8. Check for duplicate coverage or missing risk coverage.
9. Run applicable configured tests and `enforce-tests`; for a completed page
   refactor, run scoped coverage and require 100% in all four metrics unless an
   explicit documented exception exists.
10. Record each finding and disposition.

## Nino Test-Boundary Contracts

Before semantic review, require this structural contract for every tested
unit: `<Unit>/<Unit>.ts[x]`, `<Unit>/<Unit>.test.ts[x]`, and
`<Unit>/<Unit>.mock.ts[x]`. A Hook uses `hooks/<useHookName>/`. The mock file
contains only meaningful typed props and immutable fixture/input data. It must
never contain behavioral mocks, `vi.fn`, callbacks, factories, functions,
dependency implementations, or configured returns; those remain in the test.

- **pure utility/domain rule:** test input/output and edge cases directly; do not mock the pure unit.
- **Service:** mock the shared HTTP/API boundary and assert the public request/response/error contract, not the transport implementation beneath it.
- **Custom Hook:** render the real Hook; mock its Service boundary when transport is irrelevant. Create a fresh `QueryClient` per scenario when TanStack Query state participates.
- **component/page:** render the real target and assert accessible output and user-visible interaction. Mock upstream Hooks/services only when the component boundary, rather than their implementation, is the contract under test.
- **router/guard/loader or cross-module flow:** use an integration boundary when route behavior, providers, cache, or module interaction is the contract.

Do not mock the unit under test, its only meaningful decision, or an in-process collaborator whose interaction is the asserted contract. Do not promote a focused test to E2E, or force an E2E workflow, without a cross-system risk that requires it.

## 9/10 Gates

Report a confirmed defect when evidence shows:

- implementation details are asserted while the public behavior remains unprotected;
- a meaningful failure/error/permission path is absent;
- the test mocks the unit under test instead of an external boundary;
- mocks are so broad the target behavior can be bypassed;
- selectors/assertions depend on incidental DOM structure or formatting;
- snapshots replace clearer behavioral assertions without a justified value;
- shared setup hides required preconditions or makes the scenario hard to understand;
- fixtures are so large that the actual scenario is obscured;
- duplicate tests add no meaningful risk coverage;
- coverage-oriented tests exist without a concrete regression contract.

## Test Quality Test

Ask:

> What exact behavior would regress if the implementation changed, and would this test fail for the right reason?

A test is suspect when it survives removing the behavior under test, or fails because incidental markup/internal structure changed.

## Boundary Selection

Prefer the cheapest boundary that proves the behavior:

- pure transformation → unit;
- observable Hook/component state → Hook/component test;
- real module/service contract → integration;
- critical cross-system user workflow → end-to-end.

Do not force all behavior into E2E or all logic into unit tests.

## Isolation and Async Test

Create or reset every mutable dependency controlled by the scenario: Zustand state, QueryClient/cache, fake timers, browser globals, subscriptions, and mock calls/implementations. A shared fixture may provide data but must not hide mutable behavior or test-specific preconditions.

Await `userEvent`, promises, `findBy*`, `waitFor`, and rejection assertions that determine the result. Use fake timers only when time itself is the contract, restore real timers afterward, and never use arbitrary sleeps to make a test pass. Use `getBy*` for required immediate presence, `queryBy*` for absence, and `findBy*`/`waitFor` for an expected asynchronous change.

## Enforcement Map

`enforce-tests` mechanically detects selected test-path violations, `as never`, behavioral functions in `.mock.ts`, and generic test names. It cannot prove behavior coverage, mock-boundary correctness, semantic query choice, isolation, or regression value. Vitest passing proves only the executed assertions in its configured environment; Testing Library queries prove only the queried rendered behavior.

Run the declared `npm run test` from `apps/manager` when manager tests are relevant. Do not weaken, skip, focus, or reconfigure tests to hide a failure.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must name the missing behavior contract, dependency, or execution path. It is not a soft PASS.

## Resolution Protocol

- **VIOLATION:** provide the concrete risk and focused correction.
- **LEGACY:** identify the out-of-scope defect; it MUST NOT justify new weak tests.
- **EXCEPTION:** record explicit project authorization and scope. Do not infer exceptions from convenience.
- **NEEDS-EVIDENCE:** identify the missing contract/execution evidence and next concrete inspection. It remains unresolved until evidence is obtained or explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

An unresolved `NEEDS-EVIDENCE` item MUST NOT be silently treated as PASS. If required evidence cannot be obtained, final status is **INCOMPLETE**.

## User Decision Gate

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the review or implementation flow that depends on that item. Before any further affected action, present the user with:

1. the classification, exact evidence, applicable rule, and concrete impact;
2. one or more concrete correction or disposition options that stay within the authorized scope;
3. one explicitly recommended option and its justification.

Do not edit the affected code, accept a deviation, choose an option, convert the item to `PASS`, or continue to another target until the user makes an explicit decision. A proposed `EXCEPTION` also requires explicit user authorization and must use this same decision format.

Apply the same gate before choosing between materially different compliant alternatives, including scope, test boundary, or correction direction. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

## Evidence Standard

Every confirmed finding MUST include exact test location, intended contract, current boundary, concrete blind spot/coupling, regression risk, and focused improvement. Retrospective PASS requires inspection of the relevant test and implementation contract, not test-name inference alone.

## Handoffs

- Objective test structure → `enforce-tests`.
- Hook/state behavior → `hook-state-review`.
- UI layer/architectural boundary → `architecture-review`.
- API/service boundary → `data-boundary-review`.
- Test-setup complexity → `complexity-refactoring` only when structural evidence is material.

The receiving Skill owns final disposition; no ping-pong without new evidence.

## Non-Goals

Do not equate coverage percentage with quality. Do not add tests for trivial implementation details. Do not use snapshots as a substitute for meaningful behavioral assertions.

Do not require every test to use a UI query, user event, mock, QueryClient, fake timer, or failure path when that mechanism is not part of its contract.

## Final Review Gate

Before PASS, confirm the contract, boundary, success/failure coverage when applicable, mock boundary, selector/assertion stability, setup/cleanup clarity, regression signal, and objective enforcement results were inspected. A PASS applies only to the reviewed test scope; unresolved required evidence produces **INCOMPLETE**.
