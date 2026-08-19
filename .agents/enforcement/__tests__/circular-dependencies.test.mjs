#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nino-cycles-'))
const src = path.join(root, 'src')
const checker = path.resolve('enforcement/check-circular-dependencies.mjs')
const write = (name, content) => fs.writeFileSync(path.join(src, name), content)

fs.mkdirSync(src)
fs.writeFileSync(path.join(root, 'tsconfig.app.json'), JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['src/*'] } } }))

try {
  write('a.ts', 'import "./b"')
  write('b.ts', 'import "@/a"')
  let result = spawnSync(process.execPath, [checker, src], { encoding: 'utf8' })
  assert.equal(result.status, 1)

  write('b.ts', 'export const b = 1')
  result = spawnSync(process.execPath, [checker, src], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}

console.log('Circular dependency checker tests passed.')
