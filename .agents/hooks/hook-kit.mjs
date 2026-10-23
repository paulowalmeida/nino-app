// Shared runtime for executable enforcement hooks.

import fs from 'node:fs'

/**
 * Source rules do not apply to a unit's test or mock artifact: a renderHook
 * JSX wrapper, an it() title, and declarative fixtures belong to the test and
 * are governed by enforce-tests.
 */
export const isTestArtifact = (path) => /\.(?:test|mock)\.[cm]?[jt]sx?$/.test(path)

export const sourceOnly = (match) => (path) =>
  !isTestArtifact(path) && match(path)

export const readStdin = async () => {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

export const textWrittenBy = (toolName, toolInput) => {
  if (toolName === 'Write') return toolInput?.content ?? null
  if (toolName === 'Edit') return toolInput?.new_string ?? null
  return null
}

export const lineLengthViolations = (lines) =>
  lines.map((line, index) => [index + 1, line.length]).filter(([, length]) => length > 80).map(([number, length]) => `line ${number} of written text: ${length} characters (max 80)`)

export const runSkillHook = async (skill) => {
  // enforce.mjs imports every hook in one process; register instead of exiting.
  if (globalThis.__ninoSkillRegistry) {
    globalThis.__ninoSkillRegistry.push(skill)
    return
  }
  const input = JSON.parse((await readStdin()) || '{}')
  const path = input.tool_input?.file_path ?? ''
  if (!path.includes('nino-app/') || !skill.match(path)) process.exit(0)
  if (input.hook_event_name === 'PreToolUse') {
    const checklist = (skill.checklist ?? []).map((item) => `- ${item}`).join('\n')
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: checklist ? `[${skill.name}] Rules for this file:\n${checklist}` : `[${skill.name}] Enforcement active.` } }))
    process.exit(0)
  }
  const text = textWrittenBy(input.tool_name, input.tool_input)
  if (text === null) process.exit(0)
  const writtenViolations = skill.violations(path, input.tool_name, text.split('\n'))
  const fileLines = fs.existsSync(path) ? fs.readFileSync(path, 'utf8').split('\n') : []
  const wholeFileViolations = skill.fileViolations?.(
    path,
    input.tool_name,
    fileLines,
  ) ?? []
  const found = [...writtenViolations, ...wholeFileViolations]
  if (found.length === 0) process.exit(0)
  console.error(`${path} violates [${skill.name}]. Fix before continuing:\n${found.map((item) => `  ${item}`).join('\n')}`)
  process.exit(2)
}
