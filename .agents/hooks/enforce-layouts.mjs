#!/usr/bin/env node

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (path) => /\/src\/UI\/layouts\//.test(path)

const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    if (/from ['"]@pages\//.test(line)) {
      found.push(`line ${index + 1} of written text: Layout imports @pages — a Layout does not choose the active Page`)
    }
  })
  return found
}

await runSkillHook({ name: 'enforce-layouts', match, violations })
