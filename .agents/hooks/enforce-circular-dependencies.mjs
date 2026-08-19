#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { readStdin } from './hook-kit.mjs'

const input = JSON.parse((await readStdin()) || '{}')
const file = input.tool_input?.file_path ?? ''
if (!file.includes('/apps/manager/src/') || !/\.tsx?$/.test(file)) process.exit(0)

const checker = new URL('../enforcement/check-circular-dependencies.mjs', import.meta.url).pathname
const sourceRoot = path.resolve(process.cwd(), 'apps/manager/src')
const result = spawnSync(process.execPath, [checker, sourceRoot], { stdio: 'inherit' })

if (result.error) {
  console.error(`Failed to execute circular-dependency enforcement: ${result.error.message}`)
  process.exit(2)
}

process.exit(result.status ?? 2)
