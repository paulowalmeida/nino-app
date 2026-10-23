#!/usr/bin/env node
import { runSkillHook, sourceOnly } from './hook-kit.mjs'
const matchesSource = (path) => /\/src\/lib\//.test(path)
const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => lines.flatMap((line, index) => /^\s*export const (helper|utils|client\d*)\s*=/i.test(line) ? [`line ${index + 1} of written text: generic infrastructure name`] : [])
await runSkillHook({ name: 'enforce-lib', match, violations })
