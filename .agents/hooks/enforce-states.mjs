#!/usr/bin/env node
import { runSkillHook, sourceOnly } from './hook-kit.mjs'
const matchesSource = (path) =>
  /\/src\/states\//.test(path) || /\/src\/pages\/[^/]+\/states\//.test(path)
const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => lines.flatMap((line, index) => {
  const at = `line ${index + 1} of written text`
  if (/\bcreateContext\(/.test(line)) return [`${at}: createContext inside states — use Zustand`]
  if (/\buseQuery\(|\buseMutation\(/.test(line)) return [`${at}: React Query inside a store — server data does not belong in Zustand`]
  if (/^\s*export const useStore\s*=/.test(line)) return [`${at}: useStore is generic — name it after the domain`]
  return []
})
await runSkillHook({ name: 'enforce-states', match, violations })
