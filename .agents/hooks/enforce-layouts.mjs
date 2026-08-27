#!/usr/bin/env node

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (path) => /\/src\/UI\/layouts\//.test(path)

const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    if (/from ['"]@pages\//.test(line)) {
      found.push(`linha ${index + 1} do trecho escrito: layout importando @pages — layout não escolhe a página ativa`)
    }
  })
  return found
}

await runSkillHook({ name: 'enforce-layouts', match, violations })
