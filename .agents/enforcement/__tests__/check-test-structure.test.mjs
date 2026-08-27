#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nino-test-structure-'))
const checker = path.resolve('enforcement/check-test-structure.mjs')

function write(relativePath, content) {
  const file = path.join(root, relativePath)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

function run() {
  return spawnSync(process.execPath, [checker, root], { encoding: 'utf8' })
}

try {
  write('Catalog/Catalog.tsx', 'export const Catalog = () => null')
  write('Catalog/Catalog.test.tsx', 'test("catalog", () => {})')
  write('Catalog/Catalog.mock.ts', 'export const catalogProps = {}')
  write('Catalog/types/Catalog.types.ts', 'export type Catalog = {}')
  write('Catalog/constants/catalog.constants.ts', 'export const CATALOG = []')
  assert.equal(run().status, 0)

  fs.rmSync(path.join(root, 'Catalog', 'Catalog.mock.ts'))
  assert.equal(run().status, 1)

  fs.rmSync(root, { recursive: true, force: true })
  write('Catalog/Catalog.tsx', 'export const Catalog = () => null')
  write('Catalog/Catalog.test.tsx', 'test("catalog", () => {})')
  write('Catalog/Catalog.mock.ts', 'export const catalogProps = {}')
  write(
    'Catalog/states/catalog/catalog.store.ts',
    'export const useCatalogStore = () => null'
  )
  write('Catalog/states/catalog/catalog.store.test.ts', 'test("store", () => {})')
  write('Catalog/states/catalog/catalog.store.mock.ts', 'export const state = {}')
  write(
    'Catalog/states/catalog/operations/set-search/set-search.ts',
    'export const setSearch = () => null'
  )
  write(
    'Catalog/states/catalog/operations/set-search/set-search.test.ts',
    'test("op", () => {})'
  )
  write(
    'Catalog/states/catalog/operations/set-search/set-search.mock.ts',
    'export const term = ""'
  )
  assert.equal(run().status, 0, 'flat store beside its own state folder passes')

  fs.rmSync(root, { recursive: true, force: true })
  write('Profile/states/profile.state/profile.state.ts', 'export const useProfileState = () => null')
  write('Profile/states/profile.state/profile.state.test.ts', 'test("state", () => {})')
  write('Profile/states/profile.state/profile.state.mock.ts', 'export const state = {}')
  write('Profile/states/profile.state/operations/load/load.ts', 'export const load = () => null')
  write('Profile/states/profile.state/operations/load/load.test.ts', 'test("load", () => {})')
  write('Profile/states/profile.state/operations/load/load.mock.ts', 'export const input = {}')
  assert.equal(run().status, 0, 'new .state folder convention passes')

  fs.rmSync(root, { recursive: true, force: true })
  write('Profile/states/profile.store/profile.store.ts', 'export const useProfileStore = () => null')
  write('Profile/states/profile.store/profile.store.test.ts', 'test("state", () => {})')
  write('Profile/states/profile.store/profile.store.mock.ts', 'export const state = {}')
  assert.equal(run().status, 1, 'a .store folder is forbidden')

  write(
    'Catalog/states/catalog/catalog.adapter.ts',
    'export const toCatalog = () => null'
  )
  assert.equal(
    run().status,
    1,
    'the exception covers the store only, not any prefixed file'
  )
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}

console.log('Test structure checker tests passed.')
