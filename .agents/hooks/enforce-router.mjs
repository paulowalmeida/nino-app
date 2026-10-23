#!/usr/bin/env node
import { runSkillHook, sourceOnly } from './hook-kit.mjs'
const matchesSource = (path) => /\/src\/router\//.test(path)
const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  if (toolName === 'Write' && !/\/router\/routes\.tsx$/.test(path) && !/\.test\.tsx?$/.test(path)) found.push('router/ may contain only routes.tsx and tests')
  lines.forEach((line, index) => {
    if (/^\s*loader:\s*(async\s*)?\(/.test(line)) found.push(`line ${index + 1} of written text: inline loader — move it to src/loaders/`)
    if (/path:\s*['"]section-?\d*['"]/.test(line)) found.push(`line ${index + 1} of written text: generic path — name it after the real screen/section`)
  })
  return found
}
await runSkillHook({ name: 'enforce-router', match, violations })
