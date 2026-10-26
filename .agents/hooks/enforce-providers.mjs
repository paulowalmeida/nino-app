#!/usr/bin/env node

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (path) => /\/src\/providers\//.test(path)

const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    if (/\bcreateContext\(/.test(line)) {
      found.push(`line ${index + 1} of written text: createContext inside a Provider — application state must use the project's shared-state strategy`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-providers', match, violations })
