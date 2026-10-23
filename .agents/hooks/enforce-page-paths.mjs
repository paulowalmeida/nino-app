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
          `line ${index + 1} of written text: @pages/${specifier[1]} does not exist on disk — check the Page folder name and casing`
        )
      }
    }
  })

  return found
}

await runSkillHook({ name: 'enforce-page-paths', match, violations })
