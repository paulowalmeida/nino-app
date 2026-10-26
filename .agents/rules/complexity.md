# Complexity

Use this rule only for complexity analysis, a metric warning, or metric-driven
refactoring. The objective is maintainable responsibility boundaries, not a
smaller number.

## Evidence

The Nino analyzer reports function LOC, its own cyclomatic and cognitive
counts, maximum nesting, and parameter count. Name each metric precisely; do
not claim equivalence with CodeMetrics, ESLint, or Sonar and do not combine
metrics into a synthetic quality score.

Nino has no calibrated numeric threshold. Raw metrics are diagnostic signals,
not violations. A future threshold must document its metric, function category,
warning/block behavior, evidence, intended effect, and recalibration trigger.
Analyzer or extension configuration must not be weakened to obtain a pass.

## Semantic decision

For a significant signal, use `complexity-refactoring` and inspect the complete
unit, responsibility, callers when relevant, cohesion, coupling, nesting, and
reasons to change. TSX composition may be physically large without mixing
responsibilities.

A valid refactor creates a meaningful named boundary and improves caller
comprehension or cohesion. Do not split coherent workflows into arbitrary
helpers, create forwarding wrappers, relocate the same branch tree, or add
indirection solely to lower a metric. Prefer guard clauses, explicit predicates,
cohesive decisions, and separating orchestration from implementation when those
changes represent real responsibilities.

## Verification

Compare before/after with the same analyzer, version, target, and scope. Review
both structural signals and semantic quality. Run only the commands authorized
by `AGENTS.md`.

Primary references apply only when interpreting or changing this policy:

- https://eslint.org/docs/latest/rules/complexity
- https://www.sonarsource.com/resources/cognitive-complexity/
