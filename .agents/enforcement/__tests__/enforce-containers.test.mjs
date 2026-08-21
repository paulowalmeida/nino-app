#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hooksDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../hooks'
)
const settings = path.resolve(path.dirname(hooksDirectory), 'settings.json')
const containerPath = '/home/pw/workspace/nino/nino-app/apps/manager/src/UI/containers/OrdersContainer.tsx'
const { match, violations } = await import(path.join(hooksDirectory, 'enforce-containers.mjs'))

function validate(filePath, content) {
  return violations(filePath, 'Write', content.split('\n'))
}

const configuration = JSON.parse(fs.readFileSync(settings, 'utf8'))
const preToolUse = configuration.hooks.PreToolUse[0].hooks
const postToolUse = configuration.hooks.PostToolUse[0].hooks

assert.ok(preToolUse.some(({ command }) => command.includes('enforce-containers.mjs')))
assert.ok(postToolUse.some(({ command }) => command.includes('enforce-containers.mjs')))
assert.equal(match(containerPath), true)
assert.equal(match('/home/pw/workspace/nino/nino-app/apps/manager/src/UI/organisms/Orders.tsx'), false)
assert.deepEqual(validate(containerPath, 'import { useOrders } from "@hooks/orders/useOrders";'), [])
assert.match(
  validate(
    '/home/pw/workspace/nino/nino-app/apps/manager/src/UI/containers/Orders.tsx',
    'export function Orders() { return null; }'
  ).join('\n'),
  /sufixo Container/
)

for (const source of [
  'import { getOrders } from "@services/orders.service";',
  'import { getOrders } from "../../services/orders.service";',
]) {
  assert.match(validate(containerPath, source).join('\n'), /importando Service/)
}

for (const call of ['fetch("/orders")', 'axios("/orders")', 'ky.get("/orders")']) {
  assert.match(validate(containerPath, call).join('\n'), /cliente HTTP direto/)
}

console.log('Container enforcement tests passed.')
