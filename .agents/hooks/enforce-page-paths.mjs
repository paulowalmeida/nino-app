#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

import { runSkillHook } from './hook-kit.mjs'

const match = (filePath) =>
  /\/apps\/manager\/src\/.*\.[cm]?[jt]sx?$/.test(filePath)

const RESOLVABLE_EXTENSIONS = ['', '.ts', '.tsx', '.css', '.json']
const PAGE_SPECIFIER = /@pages\/([A-Za-z0-9._@/-]+)/g

const violations = (filePath, toolName, lines) => {
  const [managerRoot] = filePath.split('/apps/manager/src/')
  const pagesRoot = path.join(managerRoot, 'apps/manager/src/pages')
  const found = []

  lines.forEach((line, index) => {
    for (const specifier of line.matchAll(PAGE_SPECIFIER)) {
      const target = path.join(pagesRoot, specifier[1])
      const exists = RESOLVABLE_EXTENSIONS.some((extension) =>
        fs.existsSync(`${target}${extension}`)
      )

      if (!exists) {
        found.push(
          `linha ${index + 1} do trecho escrito: @pages/${specifier[1]} não existe no disco — confira o nome e o caixa alta da pasta da page`
        )
      }
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-page-paths', match, violations })
