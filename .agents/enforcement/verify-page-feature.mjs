#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import path from 'node:path'

const feature = process.argv[2]
if (!feature || !/^[A-Za-z0-9-]+$/.test(feature)) {
  console.error('Usage: node enforcement/verify-page-feature.mjs <feature>')
  process.exit(2)
}

const managerRoot = path.resolve(new URL('../../apps/manager', import.meta.url).pathname)
const domainRoot = path.join(managerRoot, 'src', 'pages', feature)
const structureChecker = path.resolve(new URL('./check-test-structure.mjs', import.meta.url).pathname)
const cssChecker = path.resolve(new URL('./check-css-ownership.mjs', import.meta.url).pathname)
const dsFirstChecker = path.resolve(new URL('./check-ds-first.mjs', import.meta.url).pathname)
const governanceChecker = path.resolve(new URL('./check-page-governance.mjs', import.meta.url).pathname)

const run = (command, args, cwd = process.cwd()) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 2)
}

run(process.execPath, [structureChecker, domainRoot])
run(process.execPath, [cssChecker, path.join(managerRoot, 'src'), feature])
run(process.execPath, [dsFirstChecker, domainRoot])
run(process.execPath, [governanceChecker, domainRoot])
run('npx', ['eslint', `src/pages/${feature}`], managerRoot)

const include = `src/pages/${feature}/**/*.{ts,tsx}`
run('npm', [
  'run',
  'test',
  '--',
  `src/pages/${feature}`,
  '--coverage',
  `--coverage.include=${include}`,
  '--coverage.thresholds.lines=100',
  '--coverage.thresholds.functions=100',
  '--coverage.thresholds.branches=100',
  '--coverage.thresholds.statements=100',
], managerRoot)
