#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { extractImports, isLocalSourceSpecifier, loadTsConfig, resolveImport, SOURCE_EXTENSIONS } from './module-graph.mjs'

const root = process.argv[2]
const targetFile = process.argv[3] ? path.resolve(process.argv[3]) : null
if (!root) {
  console.error('Usage: node enforcement/check-circular-dependencies.mjs <source-root>')
  process.exit(2)
}

const sourceRoot = path.resolve(root)
const config = loadTsConfig(sourceRoot)
const files = []
const dependencies = new Map()

const isInsideSourceRoot = (file) => file.startsWith(`${sourceRoot}${path.sep}`)

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(target)
    else if (SOURCE_EXTENSIONS.includes(path.extname(entry.name))) files.push(target)
  }
}

if (!targetFile) walk(sourceRoot)

const targetIsSource = targetFile &&
  isInsideSourceRoot(targetFile) &&
  SOURCE_EXTENSIONS.includes(path.extname(targetFile)) &&
  fs.existsSync(targetFile) &&
  fs.statSync(targetFile).isFile()
if (targetFile && !targetIsSource) {
  console.error(`Target file must be a source file inside ${sourceRoot}: ${targetFile}`)
  process.exit(2)
}

const dependenciesOf = (file) => {
  if (dependencies.has(file)) return dependencies.get(file)
  if (!isInsideSourceRoot(file)) return []
  const source = fs.readFileSync(file, 'utf8')
  const resolved = extractImports(source)
    .filter(({ specifier }) => isLocalSourceSpecifier(specifier, config))
    .map(({ specifier }) => resolveImport(specifier, file, config))
    .filter(Boolean)
  dependencies.set(file, resolved)
  return resolved
}

const visiting = new Set()
const visited = new Set()
const stack = []
const cycles = new Set()

const visit = (file) => {
  if (visiting.has(file)) {
    const cycleFiles = [...stack.slice(stack.indexOf(file)), file]
    if (targetFile && !cycleFiles.includes(targetFile)) return
    const cycle = cycleFiles
      .map((item) => path.relative(sourceRoot, item).split(path.sep).join('/'))
    cycles.add(cycle.join(' → '))
    return
  }
  if (visited.has(file)) return
  visiting.add(file)
  stack.push(file)
  for (const dependency of dependenciesOf(file)) visit(dependency)
  stack.pop()
  visiting.delete(file)
  visited.add(file)
}

for (const file of targetFile ? [targetFile] : files) visit(file)
if (cycles.size > 0) {
  for (const cycle of cycles) console.error(`[BLOCK] circular dependency: ${cycle}`)
  process.exit(1)
}

console.log('Circular dependency check passed.')
