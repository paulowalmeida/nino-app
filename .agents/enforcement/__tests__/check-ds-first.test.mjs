#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const checker = path.resolve('enforcement/check-ds-first.mjs')
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nino-ds-first-'))
const source = path.join(root, 'List.tsx')

try {
  fs.writeFileSync(source, 'export const List = () => <ul><li className="row">item</li></ul>')
  let result = spawnSync(process.execPath, [checker, root], { encoding: 'utf8' })
  assert.equal(result.status, 1, 'native list layout must fail DS-first')

  fs.writeFileSync(source, 'export const List = () => <Box as="ul"><ListRow>item</ListRow></Box>')
  result = spawnSync(process.execPath, [checker, root], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}

console.log('DS-first enforcement tests passed.')
