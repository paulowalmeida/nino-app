#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const project = fs.mkdtempSync(path.join(os.tmpdir(), 'nino-module-paths-'))
const root = path.join(project, 'src')
const checker = path.resolve('enforcement/check-module-paths.mjs')

function write(relativePath, content) {
  const file = path.join(root, relativePath)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

function run() {
  return spawnSync(process.execPath, [checker, root], { encoding: 'utf8' })
}

try {
  fs.mkdirSync(root, { recursive: true })
  fs.writeFileSync(
    path.join(project, 'tsconfig.app.json'),
    JSON.stringify({
      compilerOptions: {
        baseUrl: '.',
        paths: { '@organisms/*': ['src/UI/organisms/*'] },
      },
    })
  )
  write(
    'pages/Customers/Customers.tsx',
    "import { useCustomersFacade } from '@pages/Customers/facades/useCustomersFacade/useCustomersFacade'"
  )
  write(
    'pages/Customers/facades/useCustomersFacade/useCustomersFacade.ts',
    'export const useCustomersFacade = () => null'
  )
  write('pages/Customers/Customers.module.css', '.page { color: red }')
  assert.equal(run().status, 0, 'existing page paths resolve')

  write(
    'pages/Customers/Customers.test.tsx',
    "vi.mock('@pages/customers/facades/useCustomersFacade/useCustomersFacade')"
  )
  const lowercase = run()
  assert.equal(lowercase.status, 1, 'a renamed page folder is caught')
  assert.match(lowercase.stderr, /unresolved module path: @pages\/customers/)

  write(
    'pages/Customers/Customers.test.tsx',
    "vi.mock('@organisms/ItemPhoto/ItemPhoto')"
  )
  const staleMock = run()
  assert.equal(staleMock.status, 1, 'a vi.mock string of any local alias is checked')
  assert.match(staleMock.stderr, /unresolved module path: @organisms\/ItemPhoto/)

  fs.rmSync(path.join(root, 'pages', 'Customers', 'Customers.test.tsx'))
  write(
    'pages/Customers/Customers.mock.ts',
    "export const path = '@pages/Customers/Customers.module.css'"
  )
  assert.equal(run().status, 0, 'a css asset under the page resolves')
} finally {
  fs.rmSync(project, { recursive: true, force: true })
}

console.log('Module path checker tests passed.')
