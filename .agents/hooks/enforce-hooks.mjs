#!/usr/bin/env node

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (path) =>
  /\/src\/hooks\//.test(path) || /\/src\/pages\/[^/]+\/hooks\//.test(path)

const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`

    if (/(?:^|[^A-Za-z0-9_$])<[A-Z][A-Za-z]*[\s/>]/.test(line)) {
      found.push(`${at}: JSX inside a Hook — Hooks do not return UI`)
    }

    if (/^\s*export const (use[A-Za-z]*(Query|Mutation))\b/.test(line)) {
      found.push(`${at}: Hook name exposes the Query/Mutation mechanism`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-hooks', match, violations })
