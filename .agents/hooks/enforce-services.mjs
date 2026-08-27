#!/usr/bin/env node
import { runSkillHook, sourceOnly } from './hook-kit.mjs'
const matchesSource = (path) => /\/src\/services\//.test(path)
const match = sourceOnly(matchesSource)

const violations = (path, toolName, lines) =>
  lines.flatMap((line, index) => {
    const found = []
    if (/\buseState\(/.test(line))
      found.push(`linha ${index + 1} do trecho escrito: useState em service`)
    if (/\b(fetch\(|axios\.|ky\.)/.test(line))
      found.push(
        `linha ${index + 1} do trecho escrito: transporte HTTP direto em service — usar o cliente compartilhado`
      )
    if (
      /^\s*(export\s+)?(const|async function) (get|show|find|fetchData)\s*[=(]/.test(
        line
      )
    )
      found.push(
        `linha ${index + 1} do trecho escrito: nome genérico de método`
      )
    return found
  })
await runSkillHook({ name: 'enforce-services', match, violations })
