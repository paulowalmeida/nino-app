#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { runSkillHook, sourceOnly } from './hook-kit.mjs'

const matchesUiSource = (path) =>
  /\/apps\/manager\/src\/(?:pages|layouts|shared\/components|skeletons)\//.test(path) &&
  (path.endsWith('.tsx') || path.endsWith('.module.css'))

export const match = sourceOnly(matchesUiSource)

export const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`
    const removesOutline = /outline:\s*none/.test(line) || /\boutline-none\b/.test(line)
    const hasVisibleFocusReplacement = /focus-visible:(?:ring|shadow)-/.test(line)
    if (/<img(?![^>]*\balt=)[^>]*\/?>/.test(line)) found.push(`${at}: <img> without alt`)
    if (/aria-label=["'](?:\u00cdcone|Bot\u00e3o|\x49\x6d\x61\x67\x65\x6d|Icon|Button|Image)["']/i.test(line)) found.push(`${at}: generic aria-label`)
    if (removesOutline && !hasVisibleFocusReplacement) {
      found.push(`${at}: outline removed without a visible focus replacement`)
    }
  })
  return found
}

export const fileViolations = (path, toolName, lines) => {
  const found = []
  const phoneInputs = lines.join('\n').match(/<PhoneInput\b[\s\S]*?>/g) ?? []
  phoneInputs.forEach((openingTag) => {
    if (!/(?:aria-label|aria-labelledby)=/.test(openingTag)) {
      found.push('PhoneInput has no accessible name — provide aria-label/aria-labelledby or wrap it in FormField')
    }
  })
  return found
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({
    name: 'enforce-ui-accessibility',
    match,
    violations,
    fileViolations,
  })
}
