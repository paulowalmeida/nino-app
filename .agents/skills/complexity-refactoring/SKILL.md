---
name: complexity-refactoring
description: Review structural complexity in nino-app and decide whether refactoring materially improves responsibility, cohesion, comprehension, coupling, and maintainability.
---

# Complexity Refactoring

## Purpose

Use structural metrics as risk evidence and decide semantically whether refactoring is justified. The objective is better design, not smaller numbers.

## Authority

Apply `AGENTS.md`, applicable `.agents/rules/*`, then objective enforcement failures. Static analysis informs this Skill; it does not replace semantic judgment or override hard rules.

## Scope and Measurement Contract

Use this Skill for a function, Hook, Service operation, callback, selector, utility, class method, or TSX composition unit whose complexity is reviewed, modified, or signalled by a configured check.

Use Nino's analyzer only for its named TypeScript-AST measurements: LOC, the analyzer's cyclomatic count, the analyzer's cognitive count, maximum nesting, and parameter count. Do not claim equivalence with ESLint, Sonar, or CodeMetrics. [ESLint documents cyclomatic complexity](https://eslint.org/docs/latest/rules/complexity) as a configurable limit on independent paths and advises disabling that rule when no appropriate limit can be determined. [Sonar's cognitive-complexity material](https://www.sonarsource.com/resources/cognitive-complexity/) is background only; Nino has not adopted its implementation as an enforcement source.

Run the baseline only for production-source calibration. `.agents/tools/complexity-baseline.mjs` includes `.ts`, `.tsx`, `.js`, and `.jsx`, and excludes `__tests__/`, `test/`, `__fixtures__/`, `fixtures/`, and files named `*.test.*`, `*.spec.*`, `*.mock.*`, or `*.fixture.*`. Its report records the resolved root, scope, analyzer configuration, TypeScript version, and whether CodeMetrics was collected. `not-collected` means the Node tool did not measure the VS Code extension; it is not evidence that the extension is absent or disabled.

Nino currently has no calibrated numeric threshold. A metric alone is therefore a `NEEDS-EVIDENCE` hotspot, never a `VIOLATION`.

## Mandatory Review Sequence

1. Inspect the complete unit and its architectural layer.
2. When the target contains a reviewed or modified function, is under audit, or has a complexity signal, run the existing `.agents/tools/complexity-analyzer.mjs` when it is available and record its output. If it cannot run, record the concrete limitation.
3. Capture available structural signals: LOC, cyclomatic, cognitive, nesting, parameters, file size, and relevant static metrics.
4. Identify the dominant responsibility and its reasons to change.
5. Determine whether complexity is inherent to a coherent workflow or accidental.
6. Inspect callers/callees when extraction boundaries depend on external usage.
7. Propose only semantic boundaries.
8. Compare before/after structural **and** semantic quality.
9. Record the final disposition.

## Reproducible Evidence

From the repository root, use:

```bash
node .agents/tools/complexity-analyzer.mjs <file-or-directory>
node .agents/tools/complexity-baseline.mjs apps/manager/src
```

For an authorized refactor, run the analyzer on the same target before and after the change. Keep the reported TypeScript version and analyzer scope equal; otherwise report the comparison as unavailable. Use the baseline to inspect distributions and outliers, not to infer a threshold from a percentile.

The analyzer and baseline are deterministic tools, not architectural enforcement. Validate tool behavior with:

```bash
node .agents/tools/__tests__/complexity-analyzer.test.mjs
node .agents/tools/__tests__/complexity-baseline.test.mjs
```

## 9/10 Responsibility Gate

Refactor when distinct responsibilities have materially different reasons to change, coupling makes reasoning difficult, or a meaningful boundary clearly improves comprehension.

Strong signals include mixed validation/persistence policy, transport/domain mixing, unrelated presentation/data workflows, independent policies hidden in one branch tree, or effects mixed with pure transformation.

Sequential steps in one coherent workflow are not automatically multiple responsibilities.

## Extraction Test

Before extraction, identify:

- responsibility extracted;
- genuine inputs;
- owned output/effect;
- independent reason to change;
- semantic name;
- why the caller becomes easier to understand.

If those cannot be stated clearly, do not extract.

## Anti-Gaming / Complexity Relocation

Reject refactors that:

- only lower LOC or metrics;
- move the same branch tree elsewhere;
- create parameter plumbing solely to preserve coupling;
- create forwarding wrappers;
- split coherent linear workflows arbitrarily;
- create speculative abstractions;
- distribute one complex responsibility across many tightly coupled helpers.

A lower metric with worse cohesion, readability, or coupling is a failed refactor.

## TSX Exception

Do not split a coherent UI unit because JSX is verbose. Extract UI only when it has semantic identity, meaningful contract, independent behavior, or a clear architectural boundary. Arbitrary JSX fragments are not valid extraction targets merely because they are long.

When a proposed TSX extraction could create, move, or reclassify a UI layer, hand off the layer decision to `architecture-review`. This Skill may identify the structural hotspot and propose options, but MUST NOT classify the extracted unit or select its UI layer.

## Hook and Service Guidance

A Hook or Service may coordinate several operations when they form one coherent behavior/domain workflow. Split only when responsibilities become independently changeable or understandable. File size alone is not evidence.

## Threshold Policy

Metrics are diagnostic unless the project explicitly defines a hard threshold. Never invent a threshold and present it as project policy. A warning requires semantic review; only an explicit hard gate creates a mandatory refactoring outcome.

Before Nino calibrates thresholds, a raw metric identifies a hotspot and may trigger read-only semantic inspection, but it does not confirm a finding. Treat a metric signal as significant only when configured enforcement reports a warning or hard failure, or when inspection establishes concrete semantic risk. In the absence of configured enforcement, a number alone MUST NOT produce a `VIOLATION`.

## Before/After Gate

Compare both:

```text
Structural
- LOC
- cyclomatic
- cognitive complexity
- nesting
- parameter count

Semantic
- responsibility clarity
- cohesion
- caller readability
- coupling
- abstraction quality
- indirection
```

The final implementation must preserve or improve semantic quality while meaningfully reducing structural risk when risk reduction was the reason for change.

For an authorized refactor, capture the before and after metrics with the same analyzer, version, configuration, target, and scope. If a required measurement is unavailable in either state, report that limitation and do not infer improvement from a different metric or tool.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

## Resolution Protocol

- **VIOLATION:** provide structural and semantic evidence plus the required correction.
- **LEGACY:** identify the out-of-scope complexity; it MUST NOT justify metric-driven decomposition in new work.
- **EXCEPTION:** record explicit project authorization and exact scope. Do not infer exceptions from metric convenience.
- **NEEDS-EVIDENCE:** identify the missing metric/caller/architecture evidence and the next concrete inspection. It remains unresolved until evidence is obtained or review is explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

An unresolved `NEEDS-EVIDENCE` item MUST NOT be silently converted to PASS. If required evidence cannot be obtained, final status is **INCOMPLETE**.

Classify a raw analyzer value with no configured threshold and no established semantic harm as `NEEDS-EVIDENCE`; inspect its unit, callers, callees, and responsibility before selecting any other classification.

## User Decision Gate

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the review or refactoring flow that depends on that item. Before any further affected action, present the user with:

1. the classification, exact evidence, applicable rule, and concrete impact;
2. one or more concrete correction or disposition options that stay within the authorized scope;
3. one explicitly recommended option and its justification.

Do not refactor the affected code, accept a deviation, choose an option, convert the item to `PASS`, or continue to another target until the user makes an explicit decision. A proposed `EXCEPTION` also requires explicit user authorization and must use this same decision format.

Apply the same gate before choosing between materially different compliant refactoring alternatives, including scope, extraction boundary, or correction direction. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

## Evidence Standard

Every confirmed finding MUST identify the structural signal, why it matters semantically, proposed responsibility boundary, and before/after evidence. Never claim success from metrics alone.

## Handoffs

- UI layer mismatch → `architecture-review`.
- Hook/state decomposition → `hook-state-review`.
- Service/data boundary → `data-boundary-review`.
- Naming/cohesion/abstraction → `code-quality-review`.

The receiving Skill owns final disposition; no ping-pong without new evidence.

## Non-Goals

Do not refactor to satisfy an arbitrary metric, create wrappers without semantic boundaries, or split coherent workflows solely because they are long.

## Final Review Gate

Before PASS/complete, confirm the original complexity signal was understood, semantic refactoring reason is explicit, complexity was not relocated, caller comprehension improved, before/after evidence was inspected with the same target and analyzer context, applicable enforcement still passes, and all `NEEDS-EVIDENCE` items are resolved or explicitly reported as INCOMPLETE.

## Final Principle

> Metrics identify risk. They do not define good design. Refactor when responsibility, cohesion, coupling, nesting, or comprehensibility actually improves.
