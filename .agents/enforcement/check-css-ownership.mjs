#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

import { lineAt, loadTsConfig } from './module-graph.mjs'

const root = process.argv[2]
const feature = process.argv[3]
if (!root) {
  console.error('Usage: node enforcement/check-css-ownership.mjs <manager-src-root> [feature]')
  process.exit(2)
}

const sourceRoot = path.resolve(root)
if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
  console.error(`Source root does not exist or is not a directory: ${sourceRoot}`)
  process.exit(2)
}

const config = loadTsConfig(sourceRoot)
const importPattern = /(?:from\s*|import\s*)['"]([^'"]+\.module\.css)['"]/g
const violations = []

function walk(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...walk(fullPath))
    else if (['.ts', '.tsx'].includes(path.extname(entry.name))) files.push(fullPath)
  }
  return files
}

function resolveCssImport(specifier, importer) {
  const candidates = []
  if (specifier.startsWith('.')) {
    candidates.push(path.resolve(path.dirname(importer), specifier))
  }

  for (const [alias, targets] of Object.entries(config.paths)) {
    const prefix = alias.endsWith('/*') ? alias.slice(0, -2) : alias
    const matches = alias.endsWith('/*')
      ? specifier.startsWith(`${prefix}/`)
      : specifier === alias
    if (!matches) continue

    const remainder = specifier.slice(prefix.length).replace(/^\//, '')
    for (const target of targets) {
      const targetPrefix = target.endsWith('/*') ? target.slice(0, -2) : target
      candidates.push(path.resolve(config.baseUrl, targetPrefix, remainder))
    }
  }

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
}

function expectedCssFile(file) {
  const directory = path.dirname(file)
  const name = path.basename(file, path.extname(file))
  return path.join(directory, `${name}.module.css`)
}

function isSkeletonReference(file, importedRelative) {
  const isSkeleton = file.includes(`${path.sep}skeletons${path.sep}`)
  const isComponentStyle = /(^|\/)(components|UI|shared\/components)\//.test(importedRelative)
  return isSkeleton && isComponentStyle
}

for (const file of walk(sourceRoot)) {
  const relative = path.relative(sourceRoot, file).split(path.sep).join('/')
  if (!relative.startsWith('pages/')) continue
  if (feature && !relative.startsWith(`pages/${feature}/`)) continue

  const source = fs.readFileSync(file, 'utf8')
  for (const match of source.matchAll(importPattern)) {
    const imported = resolveCssImport(match[1], file)
    if (!imported) continue
    const importedRelative = path.relative(sourceRoot, imported).split(path.sep).join('/')
    const isApprovedShared = importedRelative === 'styles/motion.module.css'
    if (
      isApprovedShared ||
      path.resolve(imported) === expectedCssFile(file) ||
      isSkeletonReference(file, importedRelative)
    ) continue

    violations.push({
      file: relative,
      line: lineAt(source, match.index),
      imported: importedRelative,
    })
  }
}

if (violations.length > 0) {
  console.error('CSS ownership violations: Page and component styles must be co-located with the rendered owner.')
  for (const violation of violations) {
    console.error(
      `${violation.file}:${violation.line} [BLOCK] imports non-owned CSS module: ${violation.imported}`
    )
  }
  process.exit(1)
}

console.log('CSS ownership check passed.')
