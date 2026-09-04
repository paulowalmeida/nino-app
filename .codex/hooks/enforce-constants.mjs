#!/usr/bin/env node

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (path) => /\/src\/constants\/.+\.tsx?$/.test(path)

const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  if (path.endsWith('.tsx')) found.push('arquivo .tsx em @constants — constants não deve conter JSX')

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    if (/(?:^|[^A-Za-z0-9_$])<[A-Z][A-Za-z]*[\s/>]/.test(line)) found.push(`${at}: JSX dentro de constants — mover para @adapters`)
    if (/^\s*export const (DATA|OPTIONS|LIST|CONFIG|ITEMS)\b/.test(line)) found.push(`${at}: nome genérico de constante — explicitar domínio e formato`)
  })

  return found
}

await runSkillHook({ name: 'enforce-constants', match, violations })
