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

const pageName = path.basename(domainRoot)
const pagePath = path.join(domainRoot, `${pageName}.tsx`)
if (!fs.existsSync(pagePath)) {
  console.error(`Page entry does not exist: ${pagePath}`)
  process.exit(2)
}

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
      report(node, 'Page usa composição JSX não nomeada — extrair para componentes nomeados')
    } else if (isRoot && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node.openingElement, `<${tag}> é um componente visual do DS na raiz — criar componente de domínio nomeado`)
    } else if (parentTag && shellPrimitives.has(parentTag) && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node.openingElement, `<${tag}> implementa região dentro do shell — extrair componente de domínio nomeado`)
    } else if (parentTag && !shellPrimitives.has(parentTag)) {
      report(node.openingElement, `JSX aninhado em <${parentTag}> — Page só pode ordenar componentes nomeados`)
    }

    if (tag && !shellPrimitives.has(tag) && node.children.some((child) => containsJsx(child))) {
      report(node.openingElement, `<${tag}> recebe JSX interno na Page — o componente deve ser composto sem markup de região`)
    }

    if (tag && shellPrimitives.has(tag)) {
      for (const child of node.children) {
        if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) validateScreenMap(child, tag)
        else if (ts.isJsxExpression(child) && child.expression && !ts.isJsxElement(child.expression) && !ts.isJsxSelfClosingElement(child.expression)) {
          const text = child.expression.getText(ast)
          if (!/[<][A-Z]/.test(text) && !/^\s*(?:true|false|null|undefined)\s*$/.test(text)) report(child, 'expressão de conteúdo no shell — extrair região para componente nomeado')
        }
      }
    }
  } else if (ts.isJsxSelfClosingElement(node)) {
    const tag = jsxTagName(node)
    if (isRoot && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node, `<${tag}> é um componente visual do DS na raiz — criar componente de domínio nomeado`)
    } else if (parentTag && shellPrimitives.has(parentTag) && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node, `<${tag}> implementa região dentro do shell — extrair componente de domínio nomeado`)
    } else if (parentTag && !shellPrimitives.has(parentTag)) {
      report(node, `JSX aninhado em <${parentTag}> — Page só pode ordenar componentes nomeados`)
    }
  }
}

const walk = (node) => {
  if (ts.isJsxOpeningLikeElement(node)) {
    const tag = ts.isIdentifier(node.tagName) ? node.tagName.text : null
    if (tag && intrinsicRegions.has(tag)) report(node, `Page contém <${tag}> de região — extrair para componente de domínio`)
    if (tag && importedDesignSystemComponents.has(tag) && !shellPrimitives.has(tag) && !macroPrimitives.has(tag)) {
      report(node, `<${tag}> é UI de região na Page — criar componente de domínio nomeado`)
    }
    for (const property of node.attributes.properties) {
      if (ts.isJsxAttribute(property) && regionHandlers.test(property.name.text)) {
        report(property, `${property.name.text} em região — interação pertence ao componente de domínio`)
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
    if (calledName === 'map') report(node, 'Page renderiza coleção com .map — extrair lista/itens para componente de domínio')
    if (calledName === 'useState' || calledName === 'useReducer') report(node, `${calledName} na Page — estado de interação pertence ao componente de domínio`)
    if (calledName && formatterOrFlow.test(calledName)) report(node, `${calledName} na Page — regra/formatação/fluxo pertence à camada responsável`)
  }

  if (ts.isVariableDeclaration(node) && node.name.getText(ast) !== pageName && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
    if (node.initializer.body && containsJsx(node.initializer.body)) {
      report(node, `helper de renderização ${node.name.getText(ast)} — Page deve compor componentes nomeados diretamente`)
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
if (facadeCalls.length > 1) report(facadeCalls[1], 'Page invoca mais de uma facade — usar uma única facade do domínio')

if (findings.length) {
  console.error('Page governance violations: Page must only govern route, macro state, shell, and named domain composition.')
  console.error(findings.join('\n'))
  process.exit(1)
}

console.log(`Page governance passed: ${path.relative(process.cwd(), pagePath)}`)
