#!/usr/bin/env node

import { runSkillHook } from './hook-kit.mjs'

const match = (path) => /\.tsx?$/.test(path)

const violations = (path, toolName, lines) => {
  const found = []

  if (/\/src\/types\/[^/]+\/index\.ts$/.test(path)) {
    found.push('barrel em src/types — importar diretamente do arquivo de tipo')
  }

  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const code = line.replace(/\/\/.*$/, '')

    if (/^\s*export\s+default\b/.test(code)) {
      found.push(`${at}: export default — usar named export`)
    }
    if (/(:\s*any\b|\bas\s+any\b|=\s*any\b|<\s*any\b|,\s*any\b)/.test(code)) {
      found.push(`${at}: any — usar o type real`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-types', match, violations })
