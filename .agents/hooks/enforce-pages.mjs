#!/usr/bin/env node

import { runSkillHook } from './hook-kit.mjs'

const match = (path) => {
  if (/\/src\/UI\/pages\//.test(path)) return true

  const page = path.match(/\/src\/pages\/([^/]+)\/([^/]+)\.tsx$/)
  if (!page || /\.(test|mock)$/.test(page[2])) return false

  return page[1].replace(/[-_]/g, '').toLowerCase() ===
    page[2].replace(/[-_]/g, '').toLowerCase()
}

const violations = (path, toolName, lines) => {
  const found = []
  lines.forEach((line, index) => {
    const at = `line ${index + 1} of written text`

    if (/from ['"][^'"]*(?:@services\/|\/services\/)/.test(line)) {
      found.push(`${at}: Page imports @services — direct API access is not governance`)
    }

    if (/from ['"][^'"]*(?:@states\/|\/states\/)/.test(line)) {
      found.push(`${at}: Page imports a store directly — use the domain facade`)
    }

    if (/from ['"][^'"]*\/hooks\//.test(line)) {
      found.push(`${at}: Page imports an integration Hook — use the domain facade`)
    }

    if (/\b(fetch\(|axios\.)/.test(line)) {
      found.push(`${at}: direct fetch/axios inside a Page — data fetching belongs to the Hook`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-pages', match, violations })
