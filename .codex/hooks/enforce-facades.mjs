#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesSource = (filePath) =>
  /\/src\/(?:pages\/[^/]+\/)?facades\//.test(filePath)

export const match = sourceOnly(matchesSource)

export const violations = (filePath, toolName, lines) => {
  const found = []
  const source = lines.join('\n')

  if (/export\s+const\s+use[A-Z][A-Za-z0-9]*Facade\s*=\s*\(?(?:\s*[^)]*\s*)?\)?\s*=>\s*use[A-Z][A-Za-z0-9]*\s*\(/.test(source)) {
    found.push('facade pass-through (9/10 rule): do not wrap a single Hook without real composition')
  }

  if (/\b(?:function|const|let|var)\s+(?!use[A-Z][A-Za-z0-9]*Facade\b)[A-Za-z_$][\w$]*\s*(?:=\s*)?(?:async\s*)?\(/.test(source)) {
    found.push('facade declares its own function/helper — expose an existing reference and move behavior')
  }
  if (/\b(?:on|handle|submit|reset|clear|open|close)[A-Z][A-Za-z0-9]*\s*:\s*(?:async\s*)?\(?[^=\n]*=>/.test(source)) {
    found.push('facade creates a callback/command — expose an existing Hook/store reference')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/\b(?:if|switch|for|while|try|catch)\b/.test(line)) {
      found.push(`${at}: control flow in facade — move behavior to a Hook/operation`)
    }

    if (/\bawait\b|\.then\s*\(/.test(line)) {
      found.push(`${at}: async sequencing in facade — the command belongs in the Hook`)
    }

    if (/\.(?:trim|map|filter|reduce|sort|format)\s*\(/.test(line)) {
      found.push(`${at}: transformation in facade — use an adapter or utility`)
    }

    if (/\buse(?:Callback|Memo)\s*\(/.test(line)) {
      found.push(`${at}: callback/derivation implemented in facade — expose the ready result`)
    }
  })

  return found
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({ name: 'enforce-facades', match, violations })
}
