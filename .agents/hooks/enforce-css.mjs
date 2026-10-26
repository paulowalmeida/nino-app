#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runSkillHook } from './hook-kit.mjs'

const match = (path) => /\/apps\/manager\/src\/.*\.(?:module\.css|tsx?)$/.test(path)

const TOKEN_BY_HEX = {
  '#ff6b00': 'brand',
  '#e8540c': 'brand-strong',
  '#fff7ee': 'cream',
  '#ffebd6': 'cream-deep',
  '#1a1206': 'ink',
}

export const violations = (path, toolName, lines) => {
  const found = []
  if (!path.endsWith('.css')) {
    lines.forEach((line, index) => {
      if (/from ['"]@styles\/(?!motion\.module\.css)[^'"]+\.module\.css['"]/.test(line)) {
        found.push(`line ${index + 1} of written text: shared structural stylesheet — move the classes to the component CSS`)
      }
    })
    return found
  }
  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`
    if (line.length > 80) found.push(`${at}: more than 80 characters`)

    const selector = line.match(/^\.([A-Za-z0-9_-]+)/)
    if (selector?.[1].includes('-')) found.push(`${at}: .${selector[1]} class — use camelCase`)

    for (const [hex, token] of Object.entries(TOKEN_BY_HEX)) {
      if (line.toLowerCase().includes(hex)) found.push(`${at}: ${hex} maps to the ${token} token — use the token`)
    }
    if (/!important\b/.test(line)) found.push(`${at}: !important — fix the cascade or composition`)
  })

  return found
}

export const fileViolations = (path, toolName, lines) => {
  if (!path.endsWith('.css')) return []
  return lines[0]?.trim() === '@reference "@nino/ds/globals.css";'
    ? []
    : ['line 1: missing @reference "@nino/ds/globals.css"; at the top']
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({ name: 'enforce-css', match, violations, fileViolations })
}
