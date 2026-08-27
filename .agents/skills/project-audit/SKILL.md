---
name: project-audit
description: Orchestrate a read-only Nino App audit from mechanical baseline through tests, data, state, UI architecture, code quality, and complexity. Use when the user asks for a project audit, audit phase, audit plan, or `/project-audit`.
---

# Project Audit

Audit the Nino App in controlled phases. Apply `CLAUDE.md`, `AGENTS.md`, all applicable rules, and the specialized review Skill for the current phase.

## Operating Contract

- Begin read-only. Do not edit source, rules, Skills, hooks, configuration, or tests during an audit unless the user explicitly changes the task to an approved correction.
- Inspect evidence before classifying it. A search result is location evidence, not proof that a unit or boundary was inspected.
- Distinguish a current defect from known legacy. Existing code never authorizes a new pattern.
- For every `VIOLATION`, `LEGACY`, proposed exception, or materially different compliant direction, stop and present exact evidence, impact, options, and one recommended option. Wait for the user's explicit choice.
- Never report the whole repository as clean or 9/10 from a partial phase.

## Select the Phase

Interpret an explicit phase in the user's request. If none is supplied, begin with **Baseline** only. After a phase completes, report its result and offer the next recommended phase; do not silently continue into a new phase.

```text
baseline    → mechanical health and enforcement integrity
tests       → test location, isolation, behavior, and regression quality
data        → Services, query Hooks, facades/Pages as consumers, router, loaders, providers, adapters, types
state       → Hooks, Zustand, facades/Pages, Providers, Guards, and Loaders
ui          → Layout, Page, domain components, facades, accessibility
quality     → naming, comments, duplication, cohesion, maintainability
complexity  → structural hotspots and semantic refactoring decisions
full        → run baseline, then offer each later phase one at a time
```

## Baseline Phase

1. Read `CLAUDE.md`, `AGENTS.md`, and relevant rule/Skill inventory.
2. Inspect `git status --short`; record user work separately from audit findings.
3. Run applicable Manager checks from the repository root:

```text
npm run lint --workspace nino-manager
npm run type-check --workspace nino-manager
npm run test --workspace nino-manager
```

4. Run enforcement tests from the `.agents` directory, because their relative test paths depend on that working directory:

```text
node enforcement/__tests__/module-graph.test.mjs
node enforcement/__tests__/architecture-boundaries.test.mjs
node enforcement/__tests__/architecture-boundaries-policy.test.mjs
node enforcement/__tests__/boundary-integration.test.mjs
node enforcement/__tests__/circular-dependencies.test.mjs
node tools/__tests__/complexity-analyzer.test.mjs
node tools/__tests__/complexity-baseline.test.mjs
```

5. Report each result narrowly: new failure, known warning, legacy inventory, or verification limitation. Do not run the global architecture checker as a cleanliness claim. When a Page or component imports a pre-standardization `src/UI` resource, that resource is in scope for ownership analysis; inspect its consumers and report a shared-ownership violation when it serves more than one Page domain.

## Specialized Phases

Before inspecting a phase, read the named specialized Skill completely and use its mandatory sequence and finding classifications.

```text
tests       → testing-review
data        → data-boundary-review
state       → hook-state-review
ui          → architecture-review
quality     → code-quality-review
complexity  → complexity-refactoring
```

### UI Phase Order

For UI, inspect responsibilities from governance downward:

```text
Page governance
  ↓
Domain components for named visual/interaction regions
  ↓
Composition-only feature facade
  ↓
Query/command Hooks or feature store/operations
  ↓
Adapters/Services or deterministic state transitions
```

For each Page:

1. identify route/screen-governance responsibilities;
2. identify every application/server-state integration and its facade field;
3. verify the Page and domain components do not bypass the facade;
4. verify the facade only selects/renames ready values and exposes existing commands;
5. trace behavior to the owning Hook, store operation, Adapter, or Service;
6. proceed downward only after required finding dispositions are resolved.

Do not introduce Atomic Design categories, `src/UI`, or Containers as the target architecture. Do not accept a component or facade merely because it reduces Page line count; require a named responsibility and correct ownership.

Treat known pre-standardization UI implementation as legacy; do not mass-migrate it during an audit.

For `full`, run only Baseline first. Then recommend the next phase in this order: tests, data, state, UI, quality, complexity.

## Reporting Format

For each phase, report:

```text
Scope inspected
Evidence executed and what it proves
Findings: PASS | VIOLATION | LEGACY | EXCEPTION | NEEDS-EVIDENCE
Unresolved limitations
Recommended next phase or required user decision
```

For UI/data/state findings involving integration ownership, explicitly state whether the expected owner is Page, domain component, facade, Hook, store/operation, Adapter, Service, or Layout.

## Self-explanatory names and code

Every phase audits names across folders, layers, exports, state, commands,
props, fixtures, and tests. The `quality` phase additionally audits whether
comments violate `.agents/rules/coding.md` or compensate for unclear code.
Removing Atomic Design terminology never authorizes removing these rules.

Do not combine separate phase results into a repository-wide compliance claim.
