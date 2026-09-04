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
    const at = `linha ${index + 1} do trecho escrito`

    if (/from ['"][^'"]*(?:@services\/|\/services\/)/.test(line)) {
      found.push(`${at}: page importando @services — API direta não é governança`)
    }

    if (/from ['"][^'"]*(?:@states\/|\/states\/)/.test(line)) {
      found.push(`${at}: page importando store diretamente — usar a facade do domínio`)
    }

    if (/from ['"][^'"]*\/hooks\//.test(line)) {
      found.push(`${at}: page importando hook de integração — usar a facade do domínio`)
    }

    if (/\b(fetch\(|axios\.)/.test(line)) {
      found.push(`${at}: fetch/axios direto na page — busca de dado é do hook`)
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-pages', match, violations })
