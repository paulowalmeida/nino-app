#!/usr/bin/env node
/**
 * Mechanical check for the code-standard rules in .claude/rules/css.md and
 * code-style.md that don't need judgment — the counterpart to
 * audit-component-structure.mjs, which only covers folder structure.
 *
 * Reports existing debt across the whole tree (unlike the PostToolUse hook
 * in the repo root .claude/hooks/, which only checks what a single Edit/
 * Write call wrote, on purpose — an audit's job is to surface the backlog,
 * a write-time hook's job is to stop it from growing).
 *
 * Usage: node scripts/audit-code-standard.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const SRC = join(import.meta.dirname, '..', 'src')

const JARGON_CLASS_NAMES = new Set(['trigger', 'content', 'root'])
const ARBITRARY_EXCEPTIONS = /data-\[|transition-\[|grid-cols-\[/

const isDir = (path) => statSync(path).isDirectory()

const walk = (dir) => {
  const files = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (isDir(path)) files.push(...walk(path))
    else files.push(path)
  }
  return files
}

const violations = []

const cssFiles = walk(SRC).filter((f) => f.endsWith('.module.css'))
for (const file of cssFiles) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, index) => {
    const at = `${relative(SRC, file)}:${index + 1}`

    const selector = line.match(/^\.([A-Za-z0-9_-]+)/)
    if (selector && JARGON_CLASS_NAMES.has(selector[1])) {
      violations.push({
        type: 'jargon-class-name',
        path: at,
        message: `.${selector[1]} names the lib concept, not the role`,
      })
    }

    const arbitrary = line.match(/\b([a-zA-Z]+)-\[[^\]]+\]/)
    if (arbitrary && !ARBITRARY_EXCEPTIONS.test(line)) {
      violations.push({
        type: 'arbitrary-value',
        path: at,
        message: `${arbitrary[0]} — no nearest-token step used instead`,
      })
    }
  })
}

const tsxFiles = walk(SRC).filter((f) => extname(f) === '.tsx')
const ORCHESTRATION_ROOTS = ['pages', 'compositions', 'layouts']

for (const file of tsxFiles) {
  const relPath = relative(SRC, file)
  const isOrchestration = ORCHESTRATION_ROOTS.some((root) =>
    relPath.startsWith(`${root}/`)
  )

  const source = readFileSync(file, 'utf8')

  if (!isOrchestration && /<svg[\s>]/.test(source) && !file.includes('DS')) {
    violations.push({
      type: 'raw-svg',
      path: relPath,
      message: 'raw <svg> — confirm this is chart/DS art, not a stray icon',
    })
  }
  if (isOrchestration && /<svg[\s>]/.test(source)) {
    violations.push({
      type: 'raw-svg',
      path: relPath,
      message: 'raw <svg> in page/composition/layout — use <Icon name>',
    })
  }

  if (isOrchestration) {
    const topLevelComponents = [
      ...source.matchAll(/^export const ([A-Z]\w+) = /gm),
    ]
    if (topLevelComponents.length > 1) {
      violations.push({
        type: 'nested-component',
        path: relPath,
        message:
          `${topLevelComponents.length} exported components in one ` +
          `page/composition/layout file — split into their own files`,
      })
    }
  }
}

if (violations.length === 0) {
  console.log('No mechanical violations found.')
  process.exit(0)
}

const byType = Object.groupBy(violations, (v) => v.type)
for (const [type, items] of Object.entries(byType)) {
  console.log(`\n## ${type} (${items.length})`)
  for (const item of items) console.log(`- ${item.path} → ${item.message}`)
}

process.exit(1)
