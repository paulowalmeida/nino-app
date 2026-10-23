# Coding Rules

This file defines **mandatory implementation constraints for source code** that are not specific to Atomic Design or the Design System.

When a rule in this file applies, the agent **MUST** obey it.

The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## External Technical Foundations

Some rules in this file are aligned with official technical guidance:

- React Rules: Components and Hooks must be pure; side effects belong outside render. Official reference: `https://react.dev/reference/rules`
- React Rules of Hooks: `https://react.dev/reference/rules/rules-of-hooks`
- TypeScript Handbook: type assertions affect static checking and do not perform runtime validation. Official reference: `https://www.typescriptlang.org/docs/handbook/2/everyday-types.html`
- TypeScript Compiler API: TypeScript exposes AST/compiler tooling for programmatic source analysis. Official reference: `https://www.typescriptlang.org/docs/handbook/intro`

These sources provide technical foundations, but **Nino project rules may be stricter**. When an explicit Nino rule differs from an external recommendation, the Nino rule wins.

## Core Principle

Code **MUST** be written for the current requirement, existing project conventions, and long-term maintainability.

The agent **MUST** prefer the simplest implementation that fully satisfies the requirement without violating project rules.

The agent **MUST NOT** introduce complexity merely because a more abstract design is possible.

## Single Responsibility

Every function, arrow function, callback, custom Hook, handler, selector, Service operation, utility, and component **MUST have one coherent responsibility**.

A unit has multiple responsibilities when it performs distinct operations, policies, decisions, transformations, side effects, or other behaviors that could reasonably change independently.

The agent **MUST NOT** combine unrelated responsibilities merely because they belong to the same domain or file.

Services MAY contain multiple operations from the same domain. This does **NOT** relax the Single Responsibility rule for each individual operation.

Examples:

```text
useOrders()                  one coherent responsibility
useCreateOrder()             one coherent responsibility
useOrdersAndPermissions()   unrelated responsibilities
OrderService.createOrder()  one operation
OrderService.cancelOrder()  another operation
```

When a function begins accumulating distinct responsibilities, the agent **MUST split it by responsibility instead of adding another branch to the same function**.

## Complexity

Complexity policy lives in `complexity.md` and is loaded only for complexity
analysis, a metric warning, or metric-driven refactoring. Routine source edits
do not require a baseline or complexity Skill unless they expose a significant
hotspot.

## React purity and render-time rules

Components and Hooks **MUST remain pure with respect to rendering**. Code executed during render **MUST NOT** perform side effects that affect external systems or mutate data outside the component's local render state.

Side effects such as network requests, subscriptions, timers, DOM mutations, persistence, and external mutations **MUST NOT** be performed during render. They belong in the appropriate effect, event, or infrastructure layer.

Authoritative React foundation: `https://react.dev/reference/rules`

## TypeScript

TypeScript types **MUST describe the real contract of the code**.

The agent:

- **MUST NOT use `any`** when a concrete or safely generic type can be expressed;
- **MUST NOT use type assertions to silence a type error without verifying the actual runtime contract**;
- **MUST understand that a type assertion does not perform runtime validation**;
- **MUST prefer narrow types over broad types**;
- **MUST preserve discriminated unions and literal types when they carry meaningful constraints**;
- **MUST NOT weaken a type merely to make an implementation compile**.

A type error that exposes a real contract mismatch **MUST** be fixed at the contract or implementation, not hidden with an assertion.

## Null, Undefined, and Optional Values

The agent **MUST handle nullable and optional values explicitly according to the real domain contract**.

Do not use non-null assertions (`!`) merely to silence TypeScript unless the invariant is established by the code and cannot reasonably be represented through typing.

## Error Handling

Errors **MUST be handled at the layer responsible for deciding what the error means**.

The agent **MUST NOT**:

- silently swallow errors;
- catch an error only to rethrow the same error without adding context or changing responsibility;
- return fake success values to hide failures;
- use broad `catch` blocks to conceal programming errors.

When an error cannot be meaningfully handled at the current layer, **let it propagate to the appropriate owner**.

## Async Code

Async operations **MUST** have explicit success/failure behavior appropriate to their caller.

The agent **MUST NOT**:

- create unhandled promises intentionally;
- use `void` merely to hide an async result or error unless the operation is explicitly fire-and-forget by contract;
- introduce sequential `await`s when operations are independent and can safely run concurrently;
- introduce concurrency when ordering or dependency requires sequential execution.

## Side Effects

Side effects **MUST live at the layer responsible for them**.

The agent **MUST NOT** introduce network calls, persistence, subscriptions, timers, global mutations, or other infrastructure side effects into code that is explicitly intended to be pure or presentational.

Do not move a side effect between layers merely to satisfy a local implementation convenience.

## Business Logic

Business rules **MUST NOT** be embedded inside presentation-only code.

For TSX specifically:

> **TSX MUST remain primarily responsible for UI presentation, composition, and UI interaction. Business rules MUST live outside the TSX component.**

The correct non-TSX location depends on responsibility and project architecture; do not move business logic into a generic utility merely to remove it from TSX.

## Constants and Configuration

Values with business or application meaning **MUST** be named and centralized when they are reused or represent policy.

The agent **MUST NOT** scatter duplicated literals when a named constant, configuration object, enum, or domain representation is more accurate.

The agent **MUST NOT** create a constant abstraction for a value used only once when naming it provides no meaningful context.

## Naming

Names **MUST communicate intent, responsibility, or domain meaning**.

The agent **MUST** prefer explicit names over abbreviations, name functions by the operation they perform, and name boolean values with boolean intent (`is`, `has`, `can`, `should`, etc.) when applicable.

The `Page` suffix is optional. A UI unit's layer is defined by its
responsibility and directory, not by a naming suffix.

A name **MUST** survive being read without the implementation next to it:

- abbreviations **MUST NOT** replace the domain word. `cred`, `req`, `cfg`,
  `usr`, `msg`, and `btn` are rejected in favor of the full word. Only an idiom
  already established repository-wide is exempt;
- a variable **MUST** be named for what it holds, not for its position in the
  flow. `current`, `updated`, `final`, `temp`, `next`, and `previous` require
  the domain noun they carry;
- a variable holding an entity **MUST NOT** be named like a boolean. `linked`
  reads as a flag; `linkedOrder` states the entity;
- a boolean **MUST** state what is true, not that something is merely
  acceptable. `isValid` requires its subject and criterion;
- generic names such as `data`, `result`, `item`, `value`, `info`, `payload`,
  and `handler` require a domain qualifier unless the local contract makes the
  meaning unambiguous;
- a function **MUST** name its operation and subject. `listUnitMembers` and
  `cancelPendingOrder` are preferred over `list` and `cancel`.

## Readability over brevity

Conciseness is a formatting preference, never a reason to make the reader
reconstruct intent. When the shorter form costs comprehension, the longer form
wins. A line removed at the cost of a second reading is a bad trade.

The agent **MUST NOT**:

- chain more than two resolution strategies in one expression. Sequential
  fallbacks such as `(a && f(a)) || g() || h()` **MUST** become named steps,
  each stating the strategy it represents;
- hide a branch inside an object or props literal through conditional spread.
  Extract the conditional fragment into a named constant before spreading it;
- use a truthiness-equality trick such as `!!a === !!b` in place of the
  explicit conditions it stands for, especially when each condition means a
  different outcome for the caller;
- write a ternary whose implicit branch encodes a domain rule, such as
  `expiresAt ? expiresAt < now : true`. Name the rule the branch represents;
- compare two values whose equality carries non-obvious meaning without naming
  the predicate;
- use a fallback operand to satisfy the type-checker when an earlier guard
  already established the invariant. Narrow the guard's return type instead,
  so the fallback becomes unnecessary;
- nest ternaries in JSX to choose between rendered regions. Use an early
  return, a named branch variable, or a domain component.

A predicate named `is*`, `has*`, `can*`, or `should*` **MUST** be free of
observable side effects. Move logging, persistence, navigation, and state
writes to the caller that owns the decision.

A getter or derived value **MUST NOT** throw. A dependency that may be absent
is expressed as an explicit `require<Thing>()` call, not as a property access
that fails.

Parameter order **MUST** stay consistent across the functions of one flow. Two
adjacent `string` parameters swapped between caller and callee is a defect the
compiler cannot catch, and the reader is the only remaining check.

Comments **MUST NOT** be used to rescue any of the above. When a reader needs
prose to follow an expression, the expression is what must change. This is the
same boundary the `## Comments` rule draws from the other side.

## Abstractions

An abstraction **MUST have a current, concrete reason to exist**.

The agent **MUST NOT**:

- create abstractions for hypothetical future reuse;
- create wrappers that merely forward props or calls without adding responsibility;
- create generic helpers for one trivial operation when direct code is clearer;
- generalize code before there is demonstrated duplication or a stable common contract.

When two implementations are similar but their responsibilities are not actually the same, **do not force them into one abstraction**.

## Duplication

Not all duplication is harmful.

Before extracting a shared abstraction, verify that the code shares:

1. the same responsibility;
2. the same behavior contract;
3. the same reason to change.

If those conditions are not sufficiently true, keep the implementations separate.

## Imports and Dependencies

Imports **MUST follow the project's established dependency boundaries and public APIs**.

The agent **MUST NOT**:

- create circular dependencies intentionally;
- import private implementation details when a public API exists;
- introduce a dependency only to avoid writing a small amount of local code;
- bypass an architectural boundary through indirect imports, re-exports, aliases, or wrappers.

When an import would violate `rules/architecture.md`, changing the import path **MUST NOT** be used as a workaround.

## Exports

Use the project's established export strategy.

The agent **MUST NOT** introduce barrel files, `index.ts` aggregators, or alternate export conventions when the project rules prohibit them.

## Comments

Source comments are prohibited by default. A comment is allowed only when code
cannot express a relevant fact and the comment begins with `WHY:`,
`CONSTRAINT:`, or `WORKAROUND:`. It **MUST** explain that non-obvious reason,
constraint, or workaround; it **MUST NOT** restate mechanics, summarize a
function, explain an obvious prop, or compensate for unclear naming or
unnecessarily complex code.

Arrange/Act/Assert markers are also allowed inside test files. The comment
enforcement hook blocks any other newly written source comment.

## Dead Code and Temporary Code

The agent **MUST NOT** leave unused imports, unreachable code, obsolete commented-out implementations, or debugging statements in completed changes.

## File Size

There is no universal maximum number of lines that automatically makes a file incorrect.

Growing file size **MUST** be treated as a signal to reassess responsibility and cohesion, not as an automatic decomposition command.

At **250 lines**, a file **MUST** receive an explicit semantic review of its
responsibility and cohesion. This is a review trigger, not a mechanical limit:
the file may remain larger when that review establishes that it is one coherent
unit, and it may require decomposition below 250 lines when it mixes distinct
responsibilities.

## Refactoring During Feature Work

Refactoring is allowed only when it is necessary to satisfy the requested feature safely, satisfy an applicable project rule, remove duplication directly caused by the requested change, or make the implementation correct without expanding unrelated scope.

The agent **MUST NOT** use a feature task as an excuse to modernize unrelated code.

## Decision Gate Before Introducing New Code

Before introducing a new abstraction, utility, dependency, or structural pattern, the agent **MUST** be able to answer:

1. What concrete requirement needs it?
2. Why is existing code insufficient?
3. Why is this the correct layer for it?
4. What existing implementation was evaluated first?
5. What new dependency or maintenance cost does it introduce?

If these answers cannot be established from the repository and task context, **DO NOT invent the abstraction**.

## Verification

Before completing a coding task, the agent **MUST**:

1. inspect the final changed code;
2. verify Single Responsibility semantically;
3. inspect applicable structural metrics;
4. determine whether metric findings represent a real design problem;
5. use the complexity-refactoring Skill when a significant hotspot requires semantic judgment;
6. verify that any refactor improves cohesion, responsibility boundaries, or readability rather than merely lowering a metric;
7. verify React purity and absence of side effects during render where applicable;
8. verify that types and contracts remain correct;
9. verify that no forbidden workaround or dependency was introduced;
10. run only the commands authorized by `AGENTS.md`;
11. inspect the final diff for unrelated changes.

Passing automated checks does not replace reviewing the implementation against these rules.

## Enforcement

The following should be protected mechanically whenever technically possible:

- structural complexity signals reported by the Nino analyzer;
- calibrated hard complexity thresholds once the project baseline justifies them;
- forbidden `any` usage;
- prohibited dependency direction;
- circular dependencies;
- forbidden import paths;
- unused code and imports;
- type errors;
- prohibited export patterns;
- architecture-specific file/folder conventions;
- React Rules of Hooks and render-purity constraints where mechanically detectable.

Complexity warnings **MUST NOT** be converted into hard failures merely to force metric compliance before the thresholds have been calibrated.

When an automated hard check fails, the agent **MUST** fix the implementation rather than weaken the check.

## Final Rule

> **Write the smallest clear implementation that satisfies the current requirement, preserves real type and architectural contracts, keeps responsibilities coherent, treats metrics as structural evidence rather than truth, and never uses decomposition merely to make a number pass.**
