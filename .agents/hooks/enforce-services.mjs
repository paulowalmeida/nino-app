#!/usr/bin/env node
import { runSkillHook, sourceOnly } from './hook-kit.mjs'
const matchesSource = (path) => /\/src\/services\//.test(path)
const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) =>
  lines.flatMap((line, index) => {
    const found = []
    if (/\buseState\(/.test(line))
      found.push(`line ${index + 1} of written text: useState inside a Service`)
    if (/\b(fetch\(|axios\.|ky\.)/.test(line))
      found.push(
        `line ${index + 1} of written text: direct HTTP transport inside a Service — use the shared client`
      )
    if (
      /^\s*(export\s+)?(const|async function) (get|show|find|fetchData)\s*[=(]/.test(
        line
      )
    )
      found.push(
        `line ${index + 1} of written text: generic method name`
      )
    return found
  })
await runSkillHook({ name: 'enforce-services', match, violations })
