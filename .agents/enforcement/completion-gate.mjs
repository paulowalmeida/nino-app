#!/usr/bin/env node

import { readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const root = path.resolve(new URL('../..', import.meta.url).pathname)
const agentsRoot = path.join(root, '.agents')
const workspaceIndex = process.argv.indexOf('--workspace')
const workspace = workspaceIndex >= 0
  ? process.argv[workspaceIndex + 1]
  : undefined
const featureIndex = process.argv.indexOf('--feature')
const feature = featureIndex >= 0 ? process.argv[featureIndex + 1] : undefined

if (process.argv.includes('--help')) {
  console.log(
    'Usage: node .agents/enforcement/completion-gate.mjs [--workspace <name>] [--feature <Page>]',
  )
  process.exit(0)
}

if (!workspace || workspace.startsWith('--')) {
  console.error('--workspace requires a workspace name')
  process.exit(2)
}

if (featureIndex >= 0 && (!feature || feature.startsWith('--'))) {
  console.error('--feature requires a Page name')
  process.exit(2)
}

const run = (label, command, args, cwd = root) => {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    console.error(`FAIL ${label}`)
    process.exit(result.status ?? 2)
  }

  console.log(`PASS ${label}`)
}

run('final diff check', 'git', ['diff', '--check'])

const enforcementTests = readdirSync(path.join(agentsRoot, 'enforcement', '__tests__'))
  .filter((file) => file.endsWith('.test.mjs'))
  .sort()

for (const test of enforcementTests) {
  run(`enforcement/${test}`, process.execPath, [
    path.join(agentsRoot, 'enforcement', '__tests__', test),
  ], agentsRoot)
}

run('repository lint', 'npm', ['run', 'lint'])
run('repository type-check', 'npm', ['run', 'type-check'])
if (workspace) {
  run(`${workspace} tests`, 'npm', ['run', 'test', '--workspace', workspace])
} else {
  run('all workspace tests', 'npm', ['run', 'test', '--workspaces', '--if-present'])
}

if (feature) {
  run(
    `Page gate ${feature}`,
    process.execPath,
    [path.join(agentsRoot, 'enforcement', 'verify-page-feature.mjs'), feature],
  )
}

console.log(
  `COMPLETION GATE PASSED workspace=${workspace ?? 'all'} feature=${feature ?? 'none'}`,
)
