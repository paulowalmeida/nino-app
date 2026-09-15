# Nino Mechanical Enforcement

This directory contains reusable mechanical-enforcement runtime and Nino
enforcement policies. The runtime can consume an explicit policy file; the
checked-in `architecture-boundaries.json` is the Nino-specific policy source
of truth for architecture imports.

## Contract

Mechanical enforcement must:

- inspect only properties that can be determined reliably from source structure;
- emit deterministic diagnostics;
- distinguish warnings from blocking violations;
- never treat a metric as a semantic maintainability verdict;
- fail closed for explicit architectural boundary violations when the rule defines them as blocking;
- remain usable by a consuming repository without requiring that repository to be modified.

## Boundary modes

Each architecture rule declares one dependency mode:

- `direct`: checks only the source module's immediate imports. Use this when a
  boundary concerns the consumer's own dependency, such as Page/domain
  component → facade.
- `transitive`: checks the reachable dependency graph. Use this for boundaries that must not be bypassed through barrels, wrappers, aliases, or intermediary modules (for example, prohibited application-state access from lower UI layers).

This distinction is intentional. A generic transitive ban on UI layers would incorrectly reject valid composition through an authorized intermediate layer.

## Current enforcement model

The legacy `audit-*` family is not the current enforcement authority. It may
remain temporarily as compatibility adapters according to
`docs/legacy-audit-migration.md`. The current hook layer is composed of narrow
`enforce-*` hooks for objectively observable invariants, backed by shared
executable runtime in `hooks/hook-kit.mjs`.

Semantic responsibilities such as component responsibility, cohesion, abstraction quality, and maintainability remain owned by Skills and rules rather than being encoded as brittle blocking regexes.

Complexity remains diagnostic: `tools/complexity-analyzer.mjs` produces structural signals that feed semantic review. It is not a universal hard gate based on arbitrary thresholds.

## Repository checkers

Run these from `.agents/`:

```bash
node enforcement/check-architecture-boundaries.mjs ../apps/manager/src
node enforcement/check-circular-dependencies.mjs ../apps/manager/src
node enforcement/check-module-paths.mjs ../apps/manager/src
node enforcement/check-test-structure.mjs ../apps/manager/src/pages/<Feature>
node enforcement/check-css-ownership.mjs ../apps/manager/src [Feature]
node enforcement/check-page-governance.mjs ../apps/manager/src/pages/<Feature>
node enforcement/verify-page-feature.mjs <Feature>
```

`verify-page-feature.mjs` is the composed Page-feature gate referenced by the
`audit-pages` skill. Keep it in `.agents/enforcement`; consuming apps must not
mirror it in package scripts. It also runs the scoped ESLint check before the
coverage gate.

`check-module-paths.mjs` covers what neither TypeScript nor Vitest reports:
a `@pages/...` specifier whose folder no longer exists (a page renamed from
`new-order` to `NewOrder` keeps compiling through a stale alias on a
case-insensitive resolve) and a `vi.mock('<local alias>')` string pointing at
a module nobody imports, which silently stops mocking instead of failing.
The `enforce-page-paths` hook applies the same check to each written chunk.

Every checker has a regression test in `enforcement/__tests__/`. Run them all
with:

```bash
for test in enforcement/__tests__/*.test.mjs; do node "$test" || break; done
```

## Completion gate

The repository-level implementation gate is:

```bash
npm run quality:gate
```

It runs the final diff check, all enforcement regression tests, repository lint,
repository type-check, and all workspace test suites that declare a `test`
script. Pass `--workspace <name>` to select only one workspace's test suite and
`--feature <Page>` to add the composed Page-feature gate:

```bash
node .agents/enforcement/completion-gate.mjs \
  --workspace nino-manager \
  --feature Catalog
```

The gate reports its scope explicitly. A passing single-workspace suite is not
a claim that every workspace or every Page has been tested; omit
`--workspace` when the change crosses package boundaries.

The gate is mechanical evidence. Ownership, cohesion, consumer graphs,
public-contract compatibility, and the decision to move code to `shared`
remain semantic responsibilities of the applicable Skills and the
`change-protocol` rule.
