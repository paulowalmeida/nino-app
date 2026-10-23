# Audit Mode

When the user asks for an audit, review, inspection, assessment, retrospective audit, or compliance check and does not explicitly request implementation, the task is **read-only**.

## MUST NOT

- modify source code;
- create, delete, rename, or move files;
- add or remove imports;
- create Components, Hooks, Services, utilities, tests, or configuration;
- add comments, documentation comments, TODOs, annotations, or explanatory text inside source files;
- refactor code merely to make the audit result cleaner;
- implement a proposed correction without explicit authorization.

## Allowed Output

Proposed corrections belong in the audit output or handoff only. In a
harness-orchestrated QA run, this output is transient and goes to
`tech-lead`; it MUST distinguish confirmed violations from
recommendations. Do not create a saved report unless the user explicitly asks
for one.

If the user explicitly authorizes one proposed change during the audit, only that specific change becomes implementation scope. Re-run the normal implementation preflight for that change.

Allowing one individual change does not authorize unrelated findings to be fixed.

## Audit Result Integrity

The auditor MUST NOT create code merely to demonstrate that a rule could be satisfied. Existing architecture is evidence to inspect, not a blank slate to redesign during an audit.

## Finding Classification

Each reviewed item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

- **VIOLATION:** confirmed breach within the authorized scope; cite exact evidence, rule, impact, and smallest correction.
- **LEGACY:** confirmed breach outside the authorized scope; do not copy it, normalize it, or fix it without separate authorization.
- **EXCEPTION:** explicit project authorization with exact scope and reason; never infer it from existing code or convenience.
- **NEEDS-EVIDENCE:** required rule, source, caller, configuration, or behavior was not sufficiently inspected; state the missing evidence and next inspection.
- **PASS:** all applicable evidence for the inspected scope was reviewed and no violation was found.

An unresolved `NEEDS-EVIDENCE` item MUST result in **INCOMPLETE**, never a clean PASS. A PASS applies only to the inspected scope and does not certify the repository.

## Evidence and Report Contract

Every confirmed finding MUST identify the file and line when applicable, observed behavior, applicable rule, classification, concrete impact, and smallest in-scope disposition or correction. Distinguish a search result, file inspection, check result, and conclusion; do not claim a broader result than the evidence proves.

The audit output MUST separately list unresolved evidence, legacy items, and
checks run with their exact scope. A passing automated check is evidence only
for the invariant it actually verifies.

## User Decision Gate

After confirming a `VIOLATION` or identifying a `LEGACY`, stop the affected audit flow. Before any change, acceptance, exception, or materially different compliant disposition, present:

1. classification, exact evidence, applicable rule, and impact;
2. concrete in-scope options;
3. one recommended option with justification.

Wait for an explicit user decision. Do not implement, accept a deviation, select an option, or continue to another target that depends on that item. Routine evidence gathering and an outcome mechanically required by an explicit rule do not require a decision request.

## Completion Gate

Before calling an audit complete, review every explicit request, every inspected scope, each finding disposition, applicable checks, and unresolved evidence. Inspect the final audit output for unsupported claims. Do not call a rule or audit 9/10 unless the applicable 9/10 validation gates below have been evaluated explicitly.

## 9/10 Rule Validation Gate

The label **"9/10" is a verification result, not an opinion**.

The agent **MUST NOT** call a rule, Skill, or rule set "9/10" unless every **applicable** gate below has been evaluated explicitly:

```text
[ ] Rules are normative and unambiguous.
[ ] Scope and affected code are explicitly defined.
[ ] Allowed cases are explicit.
[ ] Forbidden cases are explicit.
[ ] Exceptions are explicit and narrowly scoped.
[ ] Common bypasses are explicitly prohibited.
[ ] Dependencies and layer/state boundaries are explicit.
[ ] When an external standard is the basis for the rule, the relevant primary technical documentation was checked and the project-specific deviation, if any, is explicit.
[ ] Relevant repository conventions for the scoped task were inspected.
[ ] Mechanically verifiable rules have a concrete enforcement path, or the rule is explicitly documented as semantic/non-mechanical and therefore requires Skill review.
[ ] The final written rule was reread after editing.
[ ] An adversarial review found no known high-impact ambiguity or contradiction in the scoped rule set.
```

A gate item is **applicable** when the rule or task actually depends on it. For example, an external-standard check is not applicable to a purely project-specific convention. A mechanical-enforcement check is not applicable when the rule is inherently semantic and cannot be verified reliably without judgment.

If an applicable gate item cannot be established, the agent **MUST NOT** claim 9/10. Report which applicable gate items remain unresolved instead of replacing missing evidence with confidence, familiarity, or subjective judgment.

A 9/10 claim MUST be supported by evidence from the scoped repository/rule inspection and, when applicable, primary external documentation. The claim applies only to the inspected scope; it does not certify unrelated rules or the entire repository.
