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
  const source = lines.join('\n')
  const phoneInputs = source.match(/<PhoneInput\b[\s\S]*?>/g) ?? []
  phoneInputs.forEach((openingTag) => {
    if (!/(?:aria-label|aria-labelledby)=/.test(openingTag)) {
      found.push('PhoneInput sem nome acessível — fornecer aria-label/aria-labelledby ou envolver em FormField')
    }
  })
  lines.forEach((line, index) => {
    const at = `linha ${index + 1} do trecho escrito`
    const removesOutline = /outline:\s*none/.test(line) || /\boutline-none\b/.test(line)
    const hasVisibleFocusReplacement = /focus-visible:(?:ring|shadow)-/.test(line)
    if (/<img(?![^>]*\balt=)[^>]*\/?>/.test(line)) found.push(`${at}: <img> sem alt`)
    if (/aria-label=["'](Ícone|Botão|Imagem)["']/i.test(line)) found.push(`${at}: aria-label genérico`)
    if (removesOutline && !hasVisibleFocusReplacement) {
      found.push(`${at}: outline removido sem foco visível substituto`)
    }
  })
  return found
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runSkillHook({ name: 'enforce-ui-accessibility', match, violations })
}
