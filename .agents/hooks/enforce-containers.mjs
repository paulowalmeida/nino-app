#!/usr/bin/env node

import { runSkillHook } from './hook-kit.mjs'

const match = (path) => /\/src\/UI\/containers\//.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  if (!/Container\.(tsx|jsx)$/.test(path)) {
    found.push('arquivo em UI/containers deve usar o sufixo Container')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`

    if (/from ['"]@services\//.test(line)) {
      found.push(`${at}: Container importando @services — integração deve passar pelo hook de domínio/query`)
    }

    if (/\b(fetch\(|axios\.)/.test(line)) {
      found.push(`${at}: fetch/axios direto no Container — transporte pertence ao Service`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-containers', match, violations })
