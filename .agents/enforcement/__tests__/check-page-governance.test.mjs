#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const checker = path.resolve('.agents/enforcement/check-page-governance.mjs')
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nino-page-governance-'))
const pageRoot = path.join(root, 'Orders')
fs.mkdirSync(pageRoot, { recursive: true })

try {
  fs.writeFileSync(path.join(pageRoot, 'Orders.tsx'), `
    export const Orders = () => {
      const facade = useOrdersFacade()
      if (facade.isPending) return <OrdersSkeleton />
      return <Box><OrdersHeader /><OrdersQueue /><OrdersSummary /></Box>
    }
  `)
  let result = spawnSync(process.execPath, [checker, pageRoot], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)

  fs.writeFileSync(path.join(pageRoot, 'Orders.tsx'), `
    export const Orders = () => orders.map((order) => <Box onClick={() => openOrder(order.id)}>{order.id}</Box>)
  `)
  result = spawnSync(process.execPath, [checker, pageRoot], { encoding: 'utf8' })
  assert.equal(result.status, 1, 'Page region implementation must fail governance')

  fs.writeFileSync(path.join(pageRoot, 'Orders.tsx'), `
    import { Text } from '@nino/ds/components/Text'
    export const Orders = () => <Box><Text>Orders</Text></Box>
  `)
  result = spawnSync(process.execPath, [checker, pageRoot], { encoding: 'utf8' })
  assert.equal(result.status, 1, 'DS primitives must not hide Page region markup')
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}

console.log('Page governance enforcement tests passed.')
