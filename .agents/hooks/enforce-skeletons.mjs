#!/usr/bin/env node
import { runSkillHook, sourceOnly } from './hook-kit.mjs'
const matchesSource = (path) =>
  /\/src\/skeletons\//.test(path) || /\/src\/pages\/[^/]+\/skeletons\//.test(path)
const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => lines.flatMap((line, index) => /^\s*export const (Loading|Placeholder|Skeleton\d*)\b/.test(line) ? [`line ${index + 1} of written text: generic skeleton name`] : [])
await runSkillHook({ name: 'enforce-skeletons', match, violations })
