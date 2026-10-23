#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const toolsDirectory = path.resolve(testDirectory, '..')
const tempDir = fs.mkdtempSync(path.join(testDirectory, 'nino-complexity-baseline-'))
const sourceDirectory = path.join(tempDir, 'src')
const baseline = path.join(toolsDirectory, 'complexity-baseline.mjs')

fs.mkdirSync(path.join(sourceDirectory, '__tests__'), { recursive: true })
fs.mkdirSync(path.join(sourceDirectory, 'test'), { recursive: true })
fs.mkdirSync(path.join(sourceDirectory, 'fixtures'), { recursive: true })
fs.writeFileSync(path.join(sourceDirectory, 'production.ts'), 'export function production() { return 1 }')
fs.writeFileSync(path.join(sourceDirectory, 'production.test.ts'), 'export function testOnly() { return 1 }')
fs.writeFileSync(path.join(sourceDirectory, 'production.spec.ts'), 'export function specOnly() { return 1 }')
fs.writeFileSync(path.join(sourceDirectory, 'fixture.mock.ts'), 'export function mockOnly() { return 1 }')
fs.writeFileSync(path.join(sourceDirectory, 'fixture.fixture.ts'), 'export function fixtureOnly() { return 1 }')
fs.writeFileSync(path.join(sourceDirectory, '__tests__', 'nested.ts'), 'export function nestedTest() { return 1 }')
fs.writeFileSync(path.join(sourceDirectory, 'test', 'setup.ts'), 'export function testSetup() { return 1 }')
fs.writeFileSync(path.join(sourceDirectory, 'fixtures', 'sample.ts'), 'export function fixtureDirectory() { return 1 }')

try {
  const result = spawnSync(process.execPath, [baseline, sourceDirectory], { encoding: 'utf8' })

  assert.equal(result.status, 0, result.stderr)

  const report = JSON.parse(result.stdout)
  assert.equal(report.analyzedFileCount, 1)
  assert.equal(report.functionCount, 1)
  assert.deepEqual(report.analysisScope.excludedDirectories, ['__tests__', 'test', '__fixtures__', 'fixtures'])
  assert.deepEqual(report.analysisScope.excludedFilePatterns, ['*.{test,spec,mock,fixture}.{ts,tsx,js,jsx}'])
  assert.match(report.analysisScope.typescriptVersion, /^\d+\.\d+\.\d+/)
  assert.equal(report.analysisScope.codeMetrics.availability, 'not-collected')
  assert.deepEqual(report.analysisScope.analyzerConfiguration, {
    metrics: ['lines', 'cyclomatic', 'cognitive', 'nesting', 'parameters'],
    excludesTsxCompositionFunctionsFromDistribution: true,
  })
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

console.log('Complexity baseline tests passed.')
