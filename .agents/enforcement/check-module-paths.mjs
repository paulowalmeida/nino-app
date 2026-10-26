#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  isLocalSourceSpecifier,
  lineAt,
  loadTsConfig,
  resolveImport,
} from './module-graph.mjs'

const SOURCE_EXTENSIONS = ['.ts', '.tsx']
const RESOLVABLE_EXTENSIONS = ['', '.ts', '.tsx', '.css', '.json']
const PAGE_SPECIFIER = /@pages\/([A-Za-z0-9._@/-]+)/g
/**
 * `vi.mock()` receives a string rather than an import. Neither TypeScript nor
 * Vitest reports a missing module that nothing imports, so the mock silently
 * stops applying.
 */
const MOCK_SPECIFIER = /vi\.mock\(\s*['"]([^'"]+)['"]/g

function walk(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...walk(fullPath))
    else if (SOURCE_EXTENSIONS.includes(path.extname(entry.name))) files.push(fullPath)
  }
  return files
}

function resolves(sourceRoot, specifier) {
  const target = path.join(sourceRoot, 'pages', specifier)
  return RESOLVABLE_EXTENSIONS.some((extension) => fs.existsSync(`${target}${extension}`))
}

export function findModulePathViolations(root) {
  const sourceRoot = path.resolve(root)
  if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
    throw new Error(`Source root does not exist or is not a directory: ${sourceRoot}`)
  }

  const config = loadTsConfig(sourceRoot)
  const violations = []

  for (const file of walk(sourceRoot)) {
    const source = fs.readFileSync(file, 'utf8')
    const relative = path.relative(sourceRoot, file).split(path.sep).join('/')

    for (const match of source.matchAll(PAGE_SPECIFIER)) {
      if (resolves(sourceRoot, match[1])) continue

      violations.push({
        file: relative,
        line: lineAt(source, match.index),
        specifier: `@pages/${match[1]}`,
      })
    }

    for (const match of source.matchAll(MOCK_SPECIFIER)) {
      const specifier = match[1]
      if (specifier.startsWith('@pages/')) continue
      if (!isLocalSourceSpecifier(specifier, config)) continue
      if (resolveImport(specifier, file, config)) continue

      violations.push({
        file: relative,
        line: lineAt(source, match.index),
        specifier,
      })
    }
  }

  return violations
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  const root = process.argv[2]
  if (!root) {
    console.error('Usage: node enforcement/check-module-paths.mjs <manager-src-root>')
    process.exit(2)
  }

  let violations
  try {
    violations = findModulePathViolations(root)
  } catch (error) {
    console.error(error.message)
    process.exit(2)
  }

  if (violations.length === 0) {
    console.log('Module paths check passed.')
    process.exit(0)
  }

  console.error(
    'Module paths that do not exist on disk. Renaming a folder does not update an import or a vi.mock() string, and neither TypeScript nor Vitest fails on a mock of a module nobody imports:'
  )
  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line} [BLOCK] unresolved module path: ${violation.specifier}`)
  }
  process.exit(1)
}
