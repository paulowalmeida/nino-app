#!/usr/bin/env node

import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hooksDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../hooks')
const { violations } = await import(path.join(hooksDirectory, 'enforce-types.mjs'))

const validate = (filePath, source) => violations(filePath, 'Write', source.split('\n'))
const domainType = '/workspace/apps/manager/src/pages/catalog/types/MenuItem.type.ts'
const sharedType = '/workspace/apps/manager/src/shared/types/product/MenuItem.type.ts'

assert.deepEqual(validate(domainType, 'export type MenuItem = { id: string }'), [])
assert.deepEqual(validate(sharedType, 'export type MenuItem = { id: string }'), [])
assert.ok(validate('/workspace/apps/manager/src/pages/catalog/Catalog.tsx', 'export type CatalogProps = {}').length > 0)
assert.ok(validate('/workspace/apps/manager/src/pages/catalog/types/MenuItem.types.ts', 'export type MenuItem = {}').length > 0)
assert.ok(validate(domainType, 'export type MenuItem = {}\nexport type MenuItemPrice = number').length > 0)
assert.ok(validate('/workspace/apps/manager/src/pages/catalog/types/MenuItem.type.ts', 'export interface MenuItem {}').length > 0)
assert.deepEqual(validate('/workspace/apps/manager/src/shared/types/react-query.d.ts', 'interface Register {}'), [])

console.log('Type enforcement tests passed.')
