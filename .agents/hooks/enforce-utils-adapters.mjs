#!/usr/bin/env node
import { runSkillHook, sourceOnly } from './hook-kit.mjs'
const matchesSource = (path) =>
  /\/src\/(utils|adapters)\//.test(path) ||
  /\/src\/pages\/[^/]+\/(utils|adapters)\//.test(path)
const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) => {
  const found = []
  const isUtils = /\/src\/(?:pages\/[^/]+\/)?utils\//.test(path)
  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`
    if (isUtils && /(?:^|[^A-Za-z0-9_$])<[A-Z][A-Za-z]*[\s/>]/.test(line)) found.push(`${at}: JSX inside @utils — this belongs in @adapters`)
    if (isUtils && /\b(fetch\(|axios\.|httpClient\.)/.test(line)) found.push(`${at}: API call inside @utils — this belongs in @services/@hooks`)
    if (/^\s*export const (format|helper|render\d*)\s*=/i.test(line)) found.push(`${at}: generic name — state what it computes/renders`)
  })
  return found
}
await runSkillHook({ name: 'enforce-utils-adapters', match, violations })
