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

  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`
    const code = line.replace(/\/\/.*$/, '')

    if (/^\s*export\s+default\b/.test(code)) {
      found.push(`${at}: default export — use a named export`)
    }
    if (!/\.d\.ts$/.test(path) && /^\s*(?:export\s+)?interface\b/.test(code)) {
      found.push(`${at}: interface — use a named type`)
    }
    if (/(:\s*any\b|\bas\s+any\b|=\s*any\b|<\s*any\b|,\s*any\b)/.test(code)) {
      found.push(`${at}: any — use the real type`)
    }
  })

  return found
}

export const fileViolations = (path, toolName, lines) => {
  const found = []

  if (/(?:\/types\/[^/]+\/index|\/types\/index)\.ts$/.test(path)) {
    found.push('types barrel — import the type file directly')
  }

  if (isTypesDirectory(path) && !/\.d\.ts$/.test(path) && !/\.type\.ts$/.test(path)) {
    found.push('type file must use the singular .type.ts suffix')
  }

  const exportedTypeCount = lines.filter((line) =>
    /^\s*export\s+type\s+[A-Za-z_$][\w$]*/.test(line),
  ).length
  if (isTypesDirectory(path) && !/\.d\.ts$/.test(path) && exportedTypeCount !== 1) {
    found.push('type file must declare exactly one named type')
  }

  if (exportedTypeCount > 0 && !isAllowedTypeDirectory(path) && !/\.d\.ts$/.test(path)) {
    found.push('reusable type must live in pages/<domain>/types or shared/types/<domain>')
  }

  return found
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({ name: 'enforce-types', match, violations, fileViolations })
}
