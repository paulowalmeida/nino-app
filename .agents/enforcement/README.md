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

- `direct`: checks only the source module's immediate imports. Use this for UI composition rules where valid hierarchy paths are intentionally transitive (for example, `Page → Template → Organism` or `Page → Organism`).
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
