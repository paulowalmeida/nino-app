#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

import {
  isLocalSourceSpecifier,
  lineAt,
  loadTsConfig,
  resolveImport,
} from './module-graph.mjs'

const root = process.argv[2]

if (!root) {
  console.error('Usage: node enforcement/check-module-paths.mjs <manager-src-root>')
  process.exit(2)
}

const sourceRoot = path.resolve(root)
if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
  console.error(`Source root does not exist or is not a directory: ${sourceRoot}`)
  process.exit(2)
}

const SOURCE_EXTENSIONS = ['.ts', '.tsx']
const RESOLVABLE_EXTENSIONS = ['', '.ts', '.tsx', '.css', '.json']
const PAGE_SPECIFIER = /@pages\/([A-Za-z0-9._@/-]+)/g
/**
 * `vi.mock()` recebe uma string, nao um import: nem o TypeScript nem o Vitest
 * reclamam quando ela aponta para um modulo que nao existe — o mock so deixa
 * de valer, em silencio.
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

function resolves(specifier) {
  const target = path.join(sourceRoot, 'pages', specifier)
  return RESOLVABLE_EXTENSIONS.some((extension) => fs.existsSync(`${target}${extension}`))
}

const config = loadTsConfig(sourceRoot)
const violations = []

for (const file of walk(sourceRoot)) {
  const source = fs.readFileSync(file, 'utf8')
  const relative = path.relative(sourceRoot, file).split(path.sep).join('/')

  for (const match of source.matchAll(PAGE_SPECIFIER)) {
    if (resolves(match[1])) continue

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

if (violations.length > 0) {
  console.error(
    'Module paths that do not exist on disk. Renaming a folder does not update an import or a vi.mock() string, and neither TypeScript nor Vitest fails on a mock of a module nobody imports:'
  )
  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line} [BLOCK] unresolved module path: ${violation.specifier}`)
  }
  process.exit(1)
}

console.log('Module paths check passed.')
