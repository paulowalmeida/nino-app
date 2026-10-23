#!/usr/bin/env node

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (path) => /\/src\/constants\/.+\.tsx?$/.test(path)

const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  if (path.endsWith('.tsx')) found.push('.tsx file inside @constants — constants must not contain JSX')

  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`
    if (/(?:^|[^A-Za-z0-9_$])<[A-Z][A-Za-z]*[\s/>]/.test(line)) found.push(`${at}: JSX inside constants — move it to @adapters`)
    if (/^\s*export const (DATA|OPTIONS|LIST|CONFIG|ITEMS)\b/.test(line)) found.push(`${at}: generic constant name — state its domain and format`)
  })

  return found
}

await runSkillHook({ name: 'enforce-constants', match, violations })
