#!/usr/bin/env node
/**
 * Mechanical check for the two structural rules in .claude/rules/components.md
 * and .claude/rules/css.md that don't need judgment:
 *
 *   1. No component folder nested inside another component's folder —
 *      every real component is a sibling, one level under components/,
 *      elements/ or compositions/.
 *   2. No component importing a `.module.css` that isn't its own —
 *      `@styles/*` shared chrome modules are the only sanctioned exception.
 *
 * Usage: node scripts/audit-component-structure.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SRC = join(import.meta.dirname, '..', 'src')
const ROOTS = ['components', 'elements', 'compositions']
const STYLE_IMPORT = /^import\s+\w+\s+from\s+['"](.+\.module\.css)['"]/gm

/*
 * Sanctioned exceptions: a component's own inline skeleton block reuses the
 * exact classes of the component it mirrors (components.md, "Skeleton de
 * tela — estratégia de construção"). Format: 'Consumer' -> 'Owner'.
 */
const ALLOWED_FOREIGN_CSS = new Set(['MenuBoard->MenuRow'])

const isDir = (path) => statSync(path).isDirectory()

const violations = []

for (const root of ROOTS) {
  const rootPath = join(SRC, root)
  let topFolders
  try {
    topFolders = readdirSync(rootPath).filter((name) =>
      isDir(join(rootPath, name))
    )
  } catch {
    continue
  }

  for (const folder of topFolders) {
    const folderPath = join(rootPath, folder)
    const entries = readdirSync(folderPath)

    // Check 1: nested component folder
    for (const entry of entries) {
      const entryPath = join(folderPath, entry)
      if (!isDir(entryPath)) continue
      const hasOwnTsx = readdirSync(entryPath).some((f) => f.endsWith('.tsx'))
      if (hasOwnTsx) {
        violations.push({
          type: 'nested-folder',
          path: relative(SRC, entryPath),
          message:
            `"${entry}" is a real component nested inside "${root}/${folder}" — ` +
            `move it to "${root}/${entry}", a sibling folder.`,
        })
      }
    }

    // Check 2: css imported from outside the component's own folder
    const ownTsx = entries.find((f) => f === `${folder}.tsx`)
    if (!ownTsx) continue

    const contents = readFileSync(join(folderPath, ownTsx), 'utf8')
    for (const match of contents.matchAll(STYLE_IMPORT)) {
      const importPath = match[1]
      const isOwnFile = importPath === `./${folder}.module.css`
      const isSharedChrome = importPath.startsWith('@styles/')
      const owner = importPath.match(/@compositions\/(\w+)\//)?.[1]
      const isAllowedException =
        owner && ALLOWED_FOREIGN_CSS.has(`${folder}->${owner}`)
      if (!isOwnFile && !isSharedChrome && !isAllowedException) {
        violations.push({
          type: 'foreign-css',
          path: relative(SRC, join(folderPath, ownTsx)),
          message: `imports "${importPath}" instead of its own .module.css`,
        })
      }
    }
  }
}

if (violations.length === 0) {
  console.log('audit-component-structure: no violations found.')
  process.exit(0)
}

console.error(`audit-component-structure: ${violations.length} violation(s)\n`)
for (const v of violations) {
  console.error(`[${v.type}] ${v.path}`)
  console.error(`  ${v.message}\n`)
}
process.exit(1)
