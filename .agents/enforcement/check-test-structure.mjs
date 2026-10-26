#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const scope = process.argv[2]

if (!scope) {
  console.error('Usage: node enforcement/check-test-structure.mjs <page-domain-root>')
  process.exit(2)
}

const root = path.resolve(scope)
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Test structure scope does not exist: ${root}`)
  process.exit(2)
}

const sourceExtensions = new Set(['.ts', '.tsx'])
const artifactPattern = /\.(?:behavior\.)?(?:test|mock)\.tsx?$/
const excludedDirectoryNames = new Set(['types', 'constants'])
const normalize = (value) => value.replace(/[^a-z\d]/gi, '').toLowerCase()

function walk(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...walk(fullPath))
    else if (sourceExtensions.has(path.extname(entry.name)) && !artifactPattern.test(entry.name)) files.push(fullPath)
  }
  return files
}

/**
 * A state folder never uses a `.state`/`.store` suffix, only the domain name:
 * states/<state>/<state>.state.ts, with its test and mock beside it. Legacy
 * states/<state>/<state>.store.ts files remain accepted during migration.
 */
function isStateStoreUnit(file) {
  const segments = path.relative(root, file).split(path.sep)
  const fileName = segments.at(-1)
  const folderName = segments.at(-2)

  return (
    segments.includes('states') &&
    folderName !== undefined &&
    (fileName === `${folderName}.state.ts` || fileName === `${folderName}.store.ts`)
  )
}

function isExcluded(file) {
  const relative = path.relative(root, file).split(path.sep)
  return relative.at(-1) === 'index.ts' || relative.at(-1) === 'index.tsx' ||
    relative.some((part) => excludedDirectoryNames.has(part)) ||
    relative.at(-1)?.endsWith('.d.ts') || relative.at(-1)?.endsWith('.types.ts')
}

const violations = []
for (const source of walk(root).filter((file) => !isExcluded(file))) {
  const directory = path.dirname(source)
  const unitName = path.basename(source, path.extname(source))
  const folderName = path.basename(directory)

  if (directory.split(path.sep).includes('states') && folderName.endsWith('.store')) {
    violations.push(`${path.relative(root, source)}: state folder cannot use .store; use <state>.state/`)
  }
  const test = path.join(directory, `${unitName}.test.ts`)
  const testTsx = path.join(directory, `${unitName}.test.tsx`)
  const mock = path.join(directory, `${unitName}.mock.ts`)
  const mockTsx = path.join(directory, `${unitName}.mock.tsx`)

  if (!isStateStoreUnit(source) && normalize(folderName) !== normalize(unitName)) {
    violations.push(`${path.relative(root, source)}: unit must own folder ${unitName}/`)
  }
  if (!fs.existsSync(test) && !fs.existsSync(testTsx)) {
    violations.push(`${path.relative(root, source)}: missing ${unitName}.test.ts[x]`)
  }
  if (!fs.existsSync(mock) && !fs.existsSync(mockTsx)) {
    violations.push(`${path.relative(root, source)}: missing ${unitName}.mock.ts[x]`)
  }
}

if (violations.length) {
  for (const violation of violations) console.error(violation)
  process.exit(1)
}

console.log(`Test structure passed: ${walk(root).filter((file) => !isExcluded(file)).length} executable source unit(s).`)
