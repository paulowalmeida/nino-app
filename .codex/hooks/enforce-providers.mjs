#!/usr/bin/env node

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (path) => /\/src\/providers\//.test(path)

const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    if (/\bcreateContext\(/.test(line)) {
      found.push(`linha ${index + 1} do trecho escrito: createContext em provider — estado de aplicação deve usar a estratégia de estado compartilhado definida pelo projeto`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-providers', match, violations })
