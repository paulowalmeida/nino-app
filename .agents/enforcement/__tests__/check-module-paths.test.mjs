#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const project = fs.mkdtempSync(path.join(os.tmpdir(), 'nino-module-paths-'))
const root = path.join(project, 'src')
const enforcementDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const { findModulePathViolations } = await import(
  path.join(enforcementDirectory, 'check-module-paths.mjs')
)

function write(relativePath, content) {
  const file = path.join(root, relativePath)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

function run() {
  return findModulePathViolations(root)
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
    'pages/Consumers/Consumers.tsx',
    "import { useConsumersFacade } from '@pages/Consumers/facades/useConsumersFacade/useConsumersFacade'"
  )
  write(
    'pages/Consumers/facades/useConsumersFacade/useConsumersFacade.ts',
    'export const useConsumersFacade = () => null'
  )
  write('pages/Consumers/Consumers.module.css', '.page { color: red }')
  assert.deepEqual(run(), [], 'existing page paths resolve')

  write(
    'pages/Consumers/Consumers.test.tsx',
    "vi.mock('@pages/consumers/facades/useConsumersFacade/useConsumersFacade')"
  )
  const lowercase = run()
  assert.equal(lowercase.length, 1, 'a renamed page folder is caught')
  assert.match(lowercase[0].specifier, /@pages\/consumers/)

  write(
    'pages/Consumers/Consumers.test.tsx',
    "vi.mock('@organisms/ItemPhoto/ItemPhoto')"
  )
  const staleMock = run()
  assert.equal(staleMock.length, 1, 'a vi.mock string of any local alias is checked')
  assert.match(staleMock[0].specifier, /@organisms\/ItemPhoto/)

  fs.rmSync(path.join(root, 'pages', 'Consumers', 'Consumers.test.tsx'))
  write(
    'pages/Consumers/Consumers.mock.ts',
    "export const path = '@pages/Consumers/Consumers.module.css'"
  )
  assert.deepEqual(run(), [], 'a css asset under the page resolves')
} finally {
  fs.rmSync(project, { recursive: true, force: true })
}

console.log('Module path checker tests passed.')
