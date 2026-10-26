#!/usr/bin/env node

import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const enforcementDirectory = path.dirname(fileURLToPath(import.meta.url))
const harnessRoot = path.resolve(enforcementDirectory, '../..')
const cssPath =
  '/workspace/nino-app/apps/manager/src/pages/catalog/Catalog.module.css'
const { fileViolations, violations } = await import(
  path.join(harnessRoot, 'hooks/enforce-css.mjs')
)
const { introducedViolations } = await import(
  path.join(harnessRoot, 'enforcement/violation-delta.mjs')
)

const compliantFile = [
  '@reference "@nino/ds/globals.css";',
  '.localChange {',
  '  color: var(--ink);',
  '}',
]
assert.deepEqual(violations(cssPath, 'Edit', ['.localChange {']), [])
assert.deepEqual(fileViolations(cssPath, 'Edit', compliantFile), [])

const legacyFile = ['.legacy {', '  color: var(--ink);', '}']
const legacyBaseline = fileViolations(cssPath, 'Edit', legacyFile)
assert.deepEqual(
  introducedViolations(
    fileViolations(cssPath, 'Edit', legacyFile),
    legacyBaseline,
  ),
  [],
  'an unchanged legacy whole-file violation must not block a local edit',
)
assert.match(
  introducedViolations(fileViolations(cssPath, 'Edit', legacyFile), [])[0],
  /missing @reference/,
  'a newly introduced whole-file violation must block the edit',
)
assert.deepEqual(
  introducedViolations(['same violation', 'same violation'], ['same violation']),
  ['same violation'],
  'duplicate violations are compared as occurrences, not only as messages',
)

console.log('Aggregate enforcement runtime tests passed.')
