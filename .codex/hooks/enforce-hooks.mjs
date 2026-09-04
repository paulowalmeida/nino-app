#!/usr/bin/env node

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (path) =>
  /\/src\/hooks\//.test(path) || /\/src\/pages\/[^/]+\/hooks\//.test(path)

const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/(?:^|[^A-Za-z0-9_$])<[A-Z][A-Za-z]*[\s/>]/.test(line)) {
      found.push(`${at}: JSX dentro de hook — hook não retorna UI`)
    }

    if (/^\s*export const (use[A-Za-z]*(Query|Mutation))\b/.test(line)) {
      found.push(`${at}: nome de hook expõe mecanismo Query/Mutation`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-hooks', match, violations })
