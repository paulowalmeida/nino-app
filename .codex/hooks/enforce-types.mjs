#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runSkillHook } from './hook-kit.mjs'

const match = (path) => /\.tsx?$/.test(path)

const isTypesDirectory = (path) => /\/src\/(?:pages\/[^/]+|shared)\/types\//.test(path)
const isAllowedTypeDirectory = (path) =>
  /\/src\/pages\/[^/]+\/types\//.test(path) ||
  /\/src\/shared\/types\/[^/]+\//.test(path)

export const violations = (path, toolName, lines) => {
  const found = []

  if (/(?:\/types\/[^/]+\/index|\/types\/index)\.ts$/.test(path)) {
    found.push('barrel em types — importar diretamente do arquivo de tipo')
  }

  if (isTypesDirectory(path) && !/\.d\.ts$/.test(path) && !/\.type\.ts$/.test(path)) {
    found.push('arquivo de type deve usar o sufixo singular .type.ts')
  }

  const exportedTypeCount = lines.filter((line) => /^\s*export\s+type\s+[A-Za-z_$][\w$]*/.test(line)).length
  if (isTypesDirectory(path) && !/\.d\.ts$/.test(path) && exportedTypeCount !== 1) {
    found.push('arquivo de type deve declarar exatamente um type nomeado')
  }

  if (exportedTypeCount > 0 && !isAllowedTypeDirectory(path) && !/\.d\.ts$/.test(path)) {
    found.push('type reutilizável deve ficar em pages/<dominio>/types ou shared/types/<dominio>')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const code = line.replace(/\/\/.*$/, '')

    if (/^\s*export\s+default\b/.test(code)) {
      found.push(`${at}: export default — usar named export`)
    }
    if (!/\.d\.ts$/.test(path) && /^\s*(?:export\s+)?interface\b/.test(code)) {
      found.push(`${at}: interface — usar type nomeado`)
    }
    if (/(:\s*any\b|\bas\s+any\b|=\s*any\b|<\s*any\b|,\s*any\b)/.test(code)) {
      found.push(`${at}: any — usar o type real`)
    }
  })

  return found
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({ name: 'enforce-types', match, violations })
}
