# Change Protocol

This protocol governs implementation work across the Nino App. It is the
frontend equivalent of a completion gate: a source edit is not complete merely
because TypeScript or a focused test passes.

## Proportional scope

Use the full protocol for behavior, ownership, boundary, public-contract,
shared-code, or multi-file changes. A change that qualifies for the fast lane
in `AGENTS.md` needs only the target unit, its direct owner, the applicable
rule sections, and the focused verification allowed by `AGENTS.md`. Do not
build a consumer graph or broaden discovery for a local edit that preserves
imports, exports, contracts, state ownership, and shared boundaries.

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
- When existing enforcement was expected to catch a mechanically detectable
  defect and did not, record the enforcement gap. Update the narrowest hook,
  checker, or regression test when that update is necessary to prevent the
  scoped regression and is authorized by the request. Do not turn every local
  defect into an unrelated harness change.
- When changing a shared package or exported type, inventory every workspace
  consumer and verify it within the command limit in `AGENTS.md`. New required fields MUST be
  supplied by every adapter/provider in the graph; when a legacy provider cannot
  supply them, use a compatible provider-specific type or adapter instead of
  weakening the runtime contract by assumption.

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
3. the focused verification permitted by `AGENTS.md` (currently `tsc` and
   tests of changed folders), with unavailable evidence reported;
4. broader checks and any unrelated failures separately;
5. every finding as `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or
   `PASS`.

An unresolved `NEEDS-EVIDENCE` means the result is `INCOMPLETE`. A scoped pass
must never be reported as a repository-wide pass.

## Retrospective

Perform a retrospective only when the change exposes a reusable governance
lesson or an enforcement gap. Classify that item as domain-specific,
mechanically detectable, or requiring human judgment, then record the narrowest
authorized correction or the deferred risk.

Legacy code is context, not permission. It may explain an existing violation,
but it does not authorize reproducing that pattern in new or modified code.
