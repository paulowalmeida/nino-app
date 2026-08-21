#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runSkillHook } from './hook-kit.mjs'

export const match = (filePath) => /\/src\/UI\/containers\//.test(filePath)

export const violations = (filePath, toolName, lines) => {
  const found = []

  if (!/Container\.(tsx|jsx)$/.test(filePath)) {
    found.push('arquivo em UI/containers deve usar o sufixo Container')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/from\s+['"][^'"]*(?:@services\/|(?:^|\/)services\/)[^'"]*['"]/.test(line)) {
      found.push(`${at}: Container importando Service — integração deve passar pelo hook de domínio/query`)
    }

    if (/\b(?:fetch\s*\(|axios\s*(?:\.|\()|ky\s*(?:\.|\())/.test(line)) {
      found.push(`${at}: cliente HTTP direto no Container — transporte pertence ao Service`)
    }
  })

  return found
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({ name: 'enforce-containers', match, violations })
}
