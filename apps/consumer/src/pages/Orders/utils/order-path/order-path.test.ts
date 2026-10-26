import { describe, expect, it } from 'vitest'

import { orderPath } from './order-path'

describe('orderPath', () => {
  it('builds a store-scoped order route', () => {
    expect(orderPath('loja', 'order-1')).toBe('/loja/pedido/order-1')
  })

  it('builds the fallback order route without a store slug', () => {
    expect(orderPath(undefined, 'order-1')).toBe('/pedido/order-1')
  })
})
