#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { analyzeSource } from './complexity-analyzer.mjs'

const metrics = ['lines', 'cyclomatic', 'cognitive', 'nesting', 'parameters']
const sourceFilePattern = /\.(ts|tsx|js|jsx)$/
const excludedDirectoryNames = new Set(['__tests__', 'test', '__fixtures__', 'fixtures'])
const excludedFilePattern = /\.(test|spec|mock|fixture)\.(ts|tsx|js|jsx)$/

const percentile = (values, p) => {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const index = (sorted.length - 1) * p
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower)
}

const collectFiles = (root) => {
  const files = []
  const visit = (entry) => {
    const stat = fs.statSync(entry)
    if (stat.isDirectory()) {
      if (excludedDirectoryNames.has(path.basename(entry))) return
      for (const child of fs.readdirSync(entry)) visit(path.join(entry, child))
      return
    }
    if (sourceFilePattern.test(entry) && !excludedFilePattern.test(entry)) {
      files.push(entry)
    }
  }
  visit(path.resolve(root))
  return files
}

const root = process.argv[2]
if (!root) {
  console.error('Usage: node tools/complexity-baseline.mjs <source-directory>')
  process.exit(1)
}

const all = []
const sourceFiles = collectFiles(root)
for (const file of sourceFiles) {
  const functions = await analyzeSource(file)
  all.push(...functions.map((metric) => ({ file, ...metric })))
}

const implementationFunctions = all.filter((metric) => !metric.tsxCompositionException)
const report = {
  analysisScope: {
    root: path.resolve(root),
    includedExtensions: ['.ts', '.tsx', '.js', '.jsx'],
    excludedDirectories: [...excludedDirectoryNames],
    excludedFilePatterns: [
      '*.{test,spec,mock,fixture}.{ts,tsx,js,jsx}',
    ],
    typescriptVersion: ts.version,
    analyzerConfiguration: {
      metrics,
      excludesTsxCompositionFunctionsFromDistribution: true,
    },
    codeMetrics: {
      availability: 'not-collected',
      reason: 'This Node analyzer does not collect measurements from the VS Code CodeMetrics extension.',
    },
  },
  analyzedFileCount: sourceFiles.length,
  functionCount: all.length,
  nonCompositionFunctionCount: implementationFunctions.length,
  metrics: Object.fromEntries(
    metrics.map((metric) => {
      const values = implementationFunctions.map((item) => item[metric])
      return [metric, {
        min: Math.min(...values),
        p50: percentile(values, 0.5),
        p75: percentile(values, 0.75),
        p90: percentile(values, 0.9),
        p95: percentile(values, 0.95),
        max: Math.max(...values),
      }]
    })
  ),
  highestRiskFunctions: implementationFunctions
    .slice()
    .sort((a, b) =>
      (b.cognitive + b.cyclomatic + b.nesting) -
      (a.cognitive + a.cyclomatic + a.nesting)
    )
    .slice(0, 20),
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
