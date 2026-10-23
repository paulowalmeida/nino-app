#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.argv[2]
if (!root) {
  console.error('Usage: node enforcement/check-ds-first.mjs <page-domain>')
  process.exit(2)
}

const replacements = new Map([
  ['div', 'Box'],
  ['p', 'Text'],
  ['button', 'Button'],
  ['input', 'Input'],
  ['textarea', 'Textarea'],
  ['select', 'Select'],
  ['label', 'Label or FormField'],
  ['header', 'Box as="header"'],
  ['section', 'Box as="section"'],
  ['ul', 'Box as="ul"'],
  ['li', 'ListRow'],
  ['span', 'Text or a documented decorative exception'],
])

const files = []
const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) visit(target)
    else if (entry.name.endsWith('.tsx') && !/(\.test|\.mock)\.tsx$/.test(entry.name)) files.push(target)
  }
}
visit(path.resolve(root))

const findings = []
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  const walk = (node) => {
    if (ts.isJsxOpeningLikeElement(node)) {
      const tag = ts.isIdentifier(node.tagName) ? node.tagName.text : null
      const replacement = tag && replacements.get(tag)
      if (replacement) {
        const decorative = tag === 'span' && node.attributes.properties.some((property) =>
          ts.isJsxAttribute(property) && property.name.text === 'aria-hidden' &&
          property.initializer?.getText(ast).replace(/\s/g, '') === '"true"'
        )
        if (!decorative) {
          const position = ast.getLineAndCharacterOfPosition(node.getStart(ast))
          findings.push(`${path.relative(process.cwd(), file)}:${position.line + 1}:${position.character + 1} <${tag}> [BLOCK] use ${replacement}`)
        }
      }
    }
    ts.forEachChild(node, walk)
  }
  walk(ast)
}

if (findings.length > 0) {
  console.error('DS-first violations: native JSX has a Design System equivalent:')
  console.error(findings.join('\n'))
  process.exit(1)
}

console.log(`DS-first check passed: ${files.length} source component(s).`)
