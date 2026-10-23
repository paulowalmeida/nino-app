#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.argv[2]
if (!root) {
  console.error('Usage: node enforcement/check-page-governance.mjs <page-domain>')
  process.exit(2)
}

const domainRoot = path.resolve(root)
if (!fs.existsSync(domainRoot) || !fs.statSync(domainRoot).isDirectory()) {
  console.error(`Page domain does not exist: ${domainRoot}`)
  process.exit(2)
}

// Different apps name a Page folder differently: apps/manager uses PascalCase
// folders that match the component name exactly (pages/Catalog/Catalog.tsx),
// while apps/consumer uses lowercase/kebab route-style folders around a
// PascalCase component file (pages/account/Account.tsx, pages/sign-in/SignIn.tsx).
// Both are valid per their app's own convention, so this resolver tries the
// folder name as-is, then its PascalCase form, before falling back to the
// single top-level .tsx file in the domain (excluding test/mock files).
const folderName = path.basename(domainRoot)
const toPascalCase = (value) =>
  value
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const nameCandidates = [...new Set([folderName, toPascalCase(folderName)])]
let pagePath = nameCandidates
  .map((candidate) => path.join(domainRoot, `${candidate}.tsx`))
  .find((candidatePath) => fs.existsSync(candidatePath))

if (!pagePath) {
  const rootTsxFiles = fs
    .readdirSync(domainRoot)
    .filter((file) => file.endsWith('.tsx') && !file.includes('.test.') && !file.includes('.mock.'))
  if (rootTsxFiles.length === 1) {
    pagePath = path.join(domainRoot, rootTsxFiles[0])
  } else {
    const tried = nameCandidates.map((candidate) => `${candidate}.tsx`).join(', ')
    const ambiguous = rootTsxFiles.length > 1
      ? ` Multiple .tsx candidates found in the folder root (${rootTsxFiles.join(', ')}) — name is ambiguous.`
      : ''
    console.error(`Page entry does not exist: tried ${tried} in ${domainRoot}.${ambiguous}`)
    process.exit(2)
  }
}

const pageName = path.basename(pagePath, '.tsx')

const source = fs.readFileSync(pagePath, 'utf8')
const ast = ts.createSourceFile(pagePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const findings = []

const report = (node, message) => {
  const position = ast.getLineAndCharacterOfPosition(node.getStart(ast))
  findings.push(`${path.relative(process.cwd(), pagePath)}:${position.line + 1}:${position.character + 1} [BLOCK] ${message}`)
}

const intrinsicRegions = new Set(['form', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'dl', 'dt', 'dd', 'ul', 'ol', 'li', 'header', 'section', 'article', 'aside', 'footer'])
const shellPrimitives = new Set(['Box', 'Grid'])
const macroPrimitives = new Set(['Alert', 'EmptyState', 'Spinner'])
const regionHandlers = /^(?:onClick|onChange|onSubmit|onValueChange|onBlur|onKeyDown|onKeyUp|onPointerDown|onDrop)$/
const formatterOrFlow = /^(?:format|validate|build|create|parse|serialize|submit|handle|open|close|toggle|remove|delete|update|save)[A-Z_$]/

const importedDesignSystemComponents = new Set()
for (const statement of ast.statements) {
  if (!ts.isImportDeclaration(statement) || !statement.moduleSpecifier.text.includes('@nino/ds/')) continue
  const clause = statement.importClause
  for (const element of clause?.namedBindings && ts.isNamedImports(clause.namedBindings) ? clause.namedBindings.elements : []) {
    importedDesignSystemComponents.add((element.name ?? element.propertyName).text)
  }
}

const jsxTagName = (node) => ts.isIdentifier(node.tagName) ? node.tagName.text : null
const containsJsx = (node) => {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) return true
  let found = false
  ts.forEachChild(node, (child) => { if (!found && containsJsx(child)) found = true })
  return found
}

const validateScreenMap = (node, parentTag = null, isRoot = false) => {
  if (ts.isJsxElement(node)) {
    const tag = jsxTagName(node.openingElement)
    if (!tag) {
      report(node, 'Page uses unnamed JSX composition — extract named components')
    } else if (isRoot && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node.openingElement, `<${tag}> is a visual DS component at the root — create a named domain component`)
    } else if (parentTag && shellPrimitives.has(parentTag) && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node.openingElement, `<${tag}> implements a region inside the shell — extract a named domain component`)
    } else if (parentTag && !shellPrimitives.has(parentTag)) {
      report(node.openingElement, `JSX nested inside <${parentTag}> — a Page may only order named components`)
    }

    if (tag && !shellPrimitives.has(tag) && node.children.some((child) => containsJsx(child))) {
      report(node.openingElement, `<${tag}> receives internal JSX in the Page — compose the component without region markup`)
    }

    if (tag && shellPrimitives.has(tag)) {
      for (const child of node.children) {
        if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) validateScreenMap(child, tag)
        else if (ts.isJsxExpression(child) && child.expression && !ts.isJsxElement(child.expression) && !ts.isJsxSelfClosingElement(child.expression)) {
          const text = child.expression.getText(ast)
          if (!/[<][A-Z]/.test(text) && !/^\s*(?:true|false|null|undefined)\s*$/.test(text)) report(child, 'content expression inside the shell — extract the region into a named component')
        }
      }
    }
  } else if (ts.isJsxSelfClosingElement(node)) {
    const tag = jsxTagName(node)
    if (isRoot && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node, `<${tag}> is a visual DS component at the root — create a named domain component`)
    } else if (parentTag && shellPrimitives.has(parentTag) && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node, `<${tag}> implements a region inside the shell — extract a named domain component`)
    } else if (parentTag && !shellPrimitives.has(parentTag)) {
      report(node, `JSX nested inside <${parentTag}> — a Page may only order named components`)
    }
  }
}

const walk = (node) => {
  if (ts.isJsxOpeningLikeElement(node)) {
    const tag = ts.isIdentifier(node.tagName) ? node.tagName.text : null
    if (tag && intrinsicRegions.has(tag)) report(node, `Page contains a region <${tag}> — extract a domain component`)
    if (tag && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node, `<${tag}> is region UI inside the Page — create a named domain component`)
    }
    for (const property of node.attributes.properties) {
      if (ts.isJsxAttribute(property) && regionHandlers.test(property.name.text)) {
        report(property, `${property.name.text} inside a region — interaction belongs to the domain component`)
      }
    }
  }

  if (ts.isCallExpression(node)) {
    const expression = node.expression
    const calledName = ts.isIdentifier(expression)
      ? expression.text
      : ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name)
        ? expression.name.text
        : null
    if (calledName === 'map') report(node, 'Page renders a collection with .map — extract the list/items into a domain component')
    if (calledName === 'useState' || calledName === 'useReducer') report(node, `${calledName} inside a Page — interaction state belongs to the domain component`)
    if (calledName && formatterOrFlow.test(calledName)) report(node, `${calledName} inside a Page — rules/formatting/flow belong to the responsible layer`)
  }

  if (ts.isVariableDeclaration(node) && node.name.getText(ast) !== pageName && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
    if (node.initializer.body && containsJsx(node.initializer.body)) {
      report(node, `render helper ${node.name.getText(ast)} — a Page must compose named components directly`)
    }
  }

  ts.forEachChild(node, walk)
}

walk(ast)

const inspectReturns = (node) => {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === pageName && node.initializer && ts.isArrowFunction(node.initializer) && !ts.isBlock(node.initializer.body)) {
    if (ts.isJsxElement(node.initializer.body) || ts.isJsxSelfClosingElement(node.initializer.body)) validateScreenMap(node.initializer.body, null, true)
    if (ts.isJsxFragment(node.initializer.body)) {
      for (const child of node.initializer.body.children) {
        if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) validateScreenMap(child, null, true)
      }
    }
  }
  if (ts.isReturnStatement(node) && node.expression) {
    if (ts.isJsxElement(node.expression) || ts.isJsxSelfClosingElement(node.expression)) validateScreenMap(node.expression, null, true)
    if (ts.isJsxFragment(node.expression)) {
      for (const child of node.expression.children) {
        if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) validateScreenMap(child, null, true)
      }
    }
  }
  ts.forEachChild(node, inspectReturns)
}
inspectReturns(ast)

const facadeCalls = []
const collectFacades = (node) => {
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && /Facade$/.test(node.expression.text)) facadeCalls.push(node)
  ts.forEachChild(node, collectFacades)
}
collectFacades(ast)
if (facadeCalls.length > 1) report(facadeCalls[1], 'Page invokes more than one facade — use a single domain facade')

if (findings.length) {
  console.error('Page governance violations: Page must only govern route, macro state, shell, and named domain composition.')
  console.error(findings.join('\n'))
  process.exit(1)
}

console.log(`Page governance passed: ${path.relative(process.cwd(), pagePath)}`)
