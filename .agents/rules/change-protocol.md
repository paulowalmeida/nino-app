# Change Protocol

This protocol governs implementation work across the Nino App. It is the
frontend equivalent of a completion gate: a source edit is not complete merely
because TypeScript or a focused test passes.

## Before editing

The agent MUST establish:

- the requested scope and the exact application/package owning it;
- the current owner of the behavior and its real consumers;
- the public contract being preserved or intentionally changed;
- the narrowest compliant boundary for the change;
- the applicable rule, Skill, hook, checker, and test command;
- whether the target is current code, legacy code, or an unresolved case.

Do not infer ownership from a folder name, an existing violation, a barrel, an
alias, or a visually similar implementation. Inspect the consumer graph before
moving code to `shared`, creating a facade, or extracting a component.

## During implementation

- Keep one responsibility and one owner per unit.
- Preserve observable behavior and public contracts unless the request
  explicitly authorizes a contract change.
- Move tests, mocks, types, styles, and imports with the responsibility they
  protect or represent.
- Do not create abstractions for symmetry, line-count reduction, or speculative
  reuse.
- When an existing mechanical rule rejects the change, fix the cause; do not
  weaken, bypass, or suppress the checker.
- When a defect can recur mechanically, update the corresponding rule, hook,
  checker, or regression test in the same change. A source-only correction is
  incomplete when the repository can generate the same defect again.

## Regression evidence

Every behavior change MUST identify the smallest stable test boundary and cover
the relevant states. For UI and application flows, evaluate at least:

- success and failure;
- loading and empty states;
- permission or access denial;
- retry, duplicate action, stale data, or race conditions when applicable;
- cleanup on unmount or navigation when effects/subscriptions are involved;
- the public request, response, and user-visible contract.

Do not add assertions that only prove delegation, implementation shape, or a
mock's return value. A regression test must fail when the protected behavior is
removed or becomes unsafe.

## Completion evidence

Before reporting completion, inspect the final diff for unrelated or accidental
changes and record:

1. files and ownership reviewed;
2. applicable enforcement checks and what each one proves;
3. scoped lint, type-check, tests, and coverage when required;
4. broader checks and any unrelated failures separately;
5. every finding as `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or
   `PASS`.

An unresolved `NEEDS-EVIDENCE` means the result is `INCOMPLETE`. A scoped pass
must never be reported as a repository-wide pass.

## Retrospective

For each finding, classify it as domain-specific, mechanically detectable, or
requiring human judgment. Mechanically detectable recurrence requires a rule,
hook, checker, or test improvement in the same change. Judgment-only decisions
must record the evidence, limitation, and deferred risk.

Legacy code is context, not permission. It may explain an existing violation,
but it does not authorize reproducing that pattern in new or modified code.
