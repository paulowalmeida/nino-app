#!/usr/bin/env node

// Single-process entry point for every runSkillHook-based enforce-*.mjs hook.
// One node spawn per tool call instead of one per hook.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { introducedViolations } from '../enforcement/violation-delta.mjs'
import { readStdin, textWrittenBy } from './hook-kit.mjs'

const SPAWNING_HOOKS = new Set([
  'enforce-architecture-boundaries.mjs',
  'enforce-circular-dependencies.mjs',
])

const input = JSON.parse((await readStdin()) || '{}')
const file = input.tool_input?.file_path ?? ''
if (!file.includes('nino-app/')) process.exit(0)

const stateFile = path.join(
  os.tmpdir(),
  `nino-enforce-${String(input.session_id ?? 'none').replace(/[^A-Za-z0-9_-]/g, '_')}.json`,
)

const readState = () => {
  try {
    const stored = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
    if (Array.isArray(stored)) return { seen: stored, baselines: {} }
    return { seen: stored.seen ?? [], baselines: stored.baselines ?? {} }
  } catch {
    return { seen: [], baselines: {} }
  }
}

const writeState = (state) => {
  try {
    fs.writeFileSync(stateFile, JSON.stringify(state))
  } catch {}
}

const readFileLines = () =>
  fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n') : []

const hooksDir = path.dirname(fileURLToPath(import.meta.url))
const hookFiles = fs
  .readdirSync(hooksDir)
  .filter((name) => /^enforce-.+\.mjs$/.test(name) && !SPAWNING_HOOKS.has(name))

globalThis.__ninoSkillRegistry = []
for (const name of hookFiles) {
  const hookPath = path.join(hooksDir, name)
  // Some hooks only call runSkillHook when they are the executed script.
  process.argv[1] = hookPath
  await import(pathToFileURL(hookPath).href)
}

const skills = globalThis.__ninoSkillRegistry.filter((skill) => skill.match(file))
if (skills.length === 0) process.exit(0)

if (input.hook_event_name === 'PreToolUse') {
  const state = readState()
  const currentLines = readFileLines()
  state.baselines[file] = Object.fromEntries(
    skills
      .filter((skill) => skill.fileViolations)
      .map((skill) => [
        skill.name,
        skill.fileViolations(file, input.tool_name, currentLines),
      ]),
  )

  // The checklist is static per skill: inject it once per session, not per edit.
  const fresh = skills.filter((skill) => !state.seen.includes(skill.name))
  state.seen = [...state.seen, ...fresh.map((skill) => skill.name)]
  writeState(state)
  if (fresh.length === 0) process.exit(0)
  const context = fresh
    .map((skill) => {
      const checklist = (skill.checklist ?? []).map((item) => `- ${item}`).join('\n')
      return checklist ? `[${skill.name}] Rules for this file type:\n${checklist}` : `[${skill.name}] Enforcement active.`
    })
    .join('\n\n')
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: context } }),
  )
  process.exit(0)
}

const text = textWrittenBy(input.tool_name, input.tool_input)
if (text === null) process.exit(0)
const lines = text.split('\n')
const state = readState()
const baseline = state.baselines[file] ?? {}
const currentLines = readFileLines()
const report = skills
  .map((skill) => {
    const written = skill.violations(file, input.tool_name, lines)
    const introduced = introducedViolations(
      skill.fileViolations?.(file, input.tool_name, currentLines) ?? [],
      baseline[skill.name],
    )
    return { name: skill.name, found: [...written, ...introduced] }
  })
  .filter(({ found }) => found.length > 0)
delete state.baselines[file]
writeState(state)
if (report.length === 0) process.exit(0)

console.error(
  report
    .map(({ name, found }) => `${file} violates [${name}]:\n${found.map((item) => `  ${item}`).join('\n')}`)
    .join('\n\n') + '\n\nFix every violation above in a single edit before continuing.',
)
process.exit(2)
