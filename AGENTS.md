# Nino — Agent Rules

## Harness language rule

Harness instructions and handoffs must be written in English. Do not add
Brazilian Portuguese to harness-owned artifacts.

## Harness-delegated QA

When `tech-lead` delegates QA in this repository, the agent must
inspect and return a transient `qa-handoff` to the orchestrator. It must not
create an execution report, change code, or choose the correcting agent.
Findings involving UI, client-side state, interaction, or presentation are
inputs for the orchestrator to decide whether to call `frontend-dev`,
`backend-dev`, or both. After correction, the orchestrator must request a new
QA validation.

This file is the agent's **mandatory operational contract**. Its purpose is to prevent improvisation, architectural drift, incomplete inspection, unsupported claims, and rule circumvention.

## Fundamental Rule

The agent **MUST implement according to the project's rules from the first step of the task**.

The rules are **NOT a post-implementation checklist**.

The agent **MUST NOT edit first and attempt to conform afterward**.

## Authority Hierarchy

1. **Explicit user instructions** have priority, provided they do not violate higher-level system/platform constraints.
2. `rules/` defines the project's permanent rules.
3. Skills define mandatory procedures for specific task types.
4. Hooks, linters, tests, AST checks, and other automated checks are enforcement mechanisms and **MUST NOT** be bypassed.

If project rules conflict and no explicit precedence exists:

- **DO NOT invent a resolution**;
- **DO NOT arbitrarily choose the more convenient rule**;
- stop implementation and identify the conflict.

## Technical Standards and Provenance

Project rules may be based on either:

- a **project-specific decision**, which is authoritative because the project explicitly chose it; or
- an **external technical standard/methodology**, which MUST be tied to an identifiable authoritative source.

When a rule is based on an external standard, the agent **MUST NOT silently replace or reinterpret that standard** using memory, preference, or a different convention.

When a rule names an external implementation, tool, algorithm, or measurement, the named implementation/version/configuration is authoritative until the repository explicitly changes it.

When a project-specific rule is stricter than an external standard, **the project rule wins**.

For any task whose correctness depends on an external standard, the agent MUST verify the relevant primary documentation before calling the result compliant. The verification MUST be specific to the rule being evaluated; a general memory of the standard is insufficient.

## Mandatory Preflight Before Any Change

Before any `Write`, `Edit`, file creation, deletion, rename, or move, the agent **MUST complete these steps in order**:

1. **Understand the request.** Identify exactly what must change and what is explicitly out of scope.
2. **Pick the applicable rules from the index below.** Do not search for them; the index is the complete list. Read only the sections that govern the change, not every file.
3. **Do not pre-read what a hook enforces.** Mechanical rules (line length, CSS tokens, imports, facades, page paths, tests, types, accessibility, boundaries, cycles) are announced once by `PreToolUse` and checked by `PostToolUse`. Write the change, then fix every reported violation in one edit. When the active client does not invoke `.agents/settings.json` for its edit tool, run the relevant scoped checker once after the edit batch instead of emulating hooks after every file.
4. **Inspect existing code.** Read the files being modified and only the directly related components, layers, and dependencies.
5. **Search for existing solutions.** Look for existing components, Hooks, Services, utilities, patterns, APIs, and configuration before creating alternatives.
6. **For UI, search the Design System first.** This is mandatory even when the agent believes it already knows what the DS contains.
7. **Determine the correct responsibility and architectural layer.** Do this before creating or moving code.
8. **Only then implement.**

If a required step cannot be completed with sufficient confidence, **DO NOT invent an answer**. Continue investigating or report the limitation/conflict.

### Proportional fast lane

The preflight above is proportional to the risk of the change. Use the fast
lane only when all of these conditions hold:

- no file is created, moved, renamed, or deleted;
- no import, export, public type, API contract, query key, route, provider,
  shared package, dependency, environment, persistence, or authorization
  boundary changes;
- no application/server-state ownership or Design System primitive changes;
- the edit is local copy, local styling, local markup, a deterministic local
  correction, or maintenance of an existing colocated test.

For a fast-lane change, satisfy steps 3-7 by inspecting the target unit and its
direct owner, reading only the applicable rule sections, and searching only
when the edit introduces a new symbol or the existing owner is unclear. Do not
inventory the repository or consumer graph. A UI fast-lane change may skip a
new Design System search only when it preserves the component already in use;
adding or replacing a control still requires the Design System search.

Any uncertainty about the conditions above exits the fast lane and restores
the full preflight. Verification remains governed by the user-authorized limit
at the end of this file.

### Rule index (`.agents/rules/`)

| Touching | Read |
| --- | --- |
| Folder placement, new module, page/feature structure | `architecture.md` |
| Services, adapters, API types, routing, query keys | `data-boundaries.md` |
| Hooks, facades, Zustand, TanStack Query | `hooks.md` |
| Any UI component or JSX | `design-system.md` |
| `.module.css`, classes, tokens | `styling.md` |
| Naming, constants, comments, types, general source code | `coding.md` |
| `*.test.tsx`, `*.mock.ts` | `testing.md` |
| Multi-file implementation flow | `change-protocol.md` |
| Audit, review, or rating request (read-only) | `audit-mode.md` |

Skills in `.agents/skills/` are **review and audit procedures**. Load one only when the task is that review/audit or the user names it; they are not part of the implementation preflight.

## Implementation Rules

During implementation, the agent:

- **MUST continuously follow all applicable rules**;
- **MUST NOT use personal preference as justification for violating an established project standard**;
- **MUST NOT create a second solution when an adequate existing solution already exists**;
- **MUST NOT introduce new abstractions, libraries, patterns, structures, or dependencies without a demonstrated current need**;
- **MUST NOT create silent architectural exceptions**;
- **MUST NOT turn a task-specific exception into a general project rule**;
- **MUST NOT bypass a prohibited dependency through an indirect import, wrapper, re-export, or alias**;
- when the preferred solution conflicts with a project rule, the project rule wins.

## Closed Scope

Do **ONLY what the task requests and what is strictly necessary to complete it correctly**.

The following are **PROHIBITED**:

- opportunistic refactoring;
- unrelated cleanup;
- file reorganization based on preference;
- renaming outside the requested scope;
- library replacement without necessity;
- unrelated behavior changes;
- abstractions created "for the future" without a current requirement;
- fixing unrelated problems discovered during the task, unless they directly block completion.

The absence of an explicit request MUST be treated as **permission denied for changes**, unless the additional change is technically indispensable to fulfill the request.

## Enforcement — Failure Must Trigger Correction

When a hook, lint, test, AST check, or other automated check blocks a change:

1. **Read the complete violation message.**
2. Identify exactly which rule was violated.
3. Correct the implementation while respecting the rule.
4. Fix every violation reported in the same message with one edit, not one edit per violation.
5. If the same check blocks twice for the same reason, stop and report the conflict instead of looping.

The following are **PROHIBITED**:

- disabling the check;
- lowering its severity;
- editing configuration to hide the violation;
- adding an exception solely to make the change pass;
- suppressing the violation without explicit project authorization;
- ignoring the failure without reporting it.

## Search Is Not Inspection

`grep`, `rg`, `find`, editor searches, code search, and equivalent tools are **location tools**.

A search result:

- **DOES NOT prove** that a file was read;
- **DOES NOT prove** that an entire directory was inspected;
- **DOES NOT prove** that an architecture is correct;
- **MUST NOT** be used as justification for claiming that something does not exist without adequate coverage.

When a task requires complete inspection, the agent **MUST determine the complete relevant file set and inspect every required file**. A sampled subset, search result, directory listing, or summary is not equivalent to reading the required files.

The agent **MUST NOT claim** "I read everything," "audited it," "there are no errors," or equivalent statements when inspection was partial.

## Evidence and Claims

The agent **MUST distinguish discovery, inspection, verification, and conclusion**.

Examples:

- finding a name with `grep` = location evidence;
- reading a file and its relevant context = inspection evidence;
- running a test = evidence for that test;
- running lint = evidence for the rules covered by that lint;
- passing a check = evidence only for what that check actually verifies.

**Never generalize the result of a verification beyond what it actually proved.**

## Mandatory Verification Before Completion

Before stating that the task is complete, the agent **MUST**:

1. review every explicit user requirement individually;
2. review every changed file and confirm that the changes match the request;
3. verify all applicable architectural and task-specific rules;
4. run all relevant available tests/checks;
5. analyze the results, not merely whether output exists or errors are absent;
6. inspect the final diff for unintended changes;
7. for UI work, explicitly confirm the Design System decision: reused component, composed component, or concrete reason for a local implementation;
8. report limitations when a required verification cannot be performed reliably.

**Passing tests does not replace verification of the user's requirements.**

**Do not claim success without sufficient evidence.**

## 9/10 Rule Validation Gate

Only relevant when asked to rate a rule, Skill, or rule set. The gate lives in `.agents/rules/audit-mode.md`; read it only then.

## Fail-Closed Mode

When critical information is missing for an architectural or implementation decision, the default behavior is:

> **Investigate before editing.**

The following are not valid justifications for making an unsupported decision:

- "probably";
- "it should exist";
- "it looks correct";
- "this is simpler";
- "this is probably the project standard";
- "I did not find it quickly".

When the information can be obtained from the repository, **obtain it before deciding**.

If the required information cannot be established reliably, **do not silently choose an arbitrary implementation**. Report the uncertainty.

## General Prohibitions

The agent **MUST NOT**:

- ignore rules because they are stored in another file;
- treat a rule as optional merely because automated enforcement does not exist yet;
- replace a project rule with personal preference;
- claim compliance without sufficient evidence;
- accept an implementation as "good enough" when it violates an explicit rule;
- invent an API, component, pattern, structure, or exception to fill an information gap without investigation;
- edit code based only on memory when the source of truth can be consulted in the repository;
- report a partial inspection as a complete audit;
- claim a rule is 9/10 without passing the 9/10 Rule Validation Gate.

## Final Principle

**Investigate first. Decide second. Implement third. Verify fourth. Report precisely.**

Never reverse this order when the preceding step is necessary to perform the task correctly.

## User-authorized verification limit

The repository owner explicitly authorized a reduced verification scope, and this overrides "Mandatory Verification Before Completion" and the page-domain coverage gate for day-to-day work: run only `tsc` and the tests of the folders changed, never the full suite, `quality:gate` or repository-wide lint unless the owner asks. Run each check once per change, stop and ask if a check exceeds ~30 seconds, and ask the owner to review visual results instead of validating screens. Report what was and was not verified.
