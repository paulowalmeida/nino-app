#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hooksDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../hooks'
)
const { fileViolations, match, violations } = await import(
  path.join(hooksDirectory, 'enforce-tests.mjs')
)
const temporaryRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), 'nino-test-structure-')
)
const unitDirectory = path.join(
  temporaryRoot,
  'apps/manager/src/hooks/useOrders'
)
fs.mkdirSync(unitDirectory, { recursive: true })

const testPath = path.join(unitDirectory, 'useOrders.test.tsx')
const mockPath = path.join(unitDirectory, 'useOrders.mock.ts')
const sourcePath = path.join(unitDirectory, 'useOrders.ts')
const validate = (filePath, content) => {
  const lines = content.split('\n')
  return [
    ...violations(filePath, 'Write', lines),
    ...fileViolations(filePath, 'Write', lines),
  ]
}

assert.equal(match(testPath), true)
assert.equal(match(path.join(unitDirectory, 'useOrders.ts')), false)
assert.match(
  validate(testPath, 'it("loads orders", () => {})').join('\n'),
  /source.*mock|mock.*source/s
)

fs.writeFileSync(sourcePath, 'export const useOrders = () => []\n')
fs.writeFileSync(mockPath, 'export const orders = []\n')
assert.deepEqual(validate(testPath, 'it("loads orders", () => {})'), [])
assert.match(
  validate(
    path.join(temporaryRoot, 'apps/manager/src/hooks/useOrders.test.tsx'),
    'it("loads orders", () => {})'
  ).join('\n'),
  /own .* folder/
)
assert.match(validate(mockPath, '').join('\n'), /must not be empty/)
assert.match(
  validate(mockPath, 'export const loadOrders = vi.fn()').join('\n'),
  /behavioral mock/
)
assert.match(
  validate(mockPath, 'export const createOrder = () => ({ id: "1" })').join('\n'),
  /function\/factory/
)

const behaviorPath = path.join(unitDirectory, 'useOrders.behavior.test.tsx')
assert.equal(match(behaviorPath), true)
assert.deepEqual(
  validate(behaviorPath, 'it("steps a line", () => {})'),
  [],
  'a behavior test belongs to the same unit, folder, source and mock'
)

fs.writeFileSync(sourcePath, 'export const useOrders = () => <input onChange={() => undefined} />\n')
assert.match(
  validate(behaviorPath, 'it("keeps the value", () => {})').join('\n'),
  /observable action/,
  'interactive units require an observable test action'
)
assert.deepEqual(
  validate(behaviorPath, 'it("keeps the value", () => { fireEvent.change(input) })'),
  [],
  'an observable interaction satisfies the behavior check'
)

fs.rmSync(mockPath)
assert.match(
  validate(behaviorPath, 'it("steps a line", () => {})').join('\n'),
  /useOrders\.mock/,
  'the behavior test still requires the unit mock'
)

fs.rmSync(temporaryRoot, { recursive: true, force: true })
console.log('Test structure enforcement tests passed.')
