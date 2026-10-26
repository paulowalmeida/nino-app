import { expect, it } from 'vitest'
import { clearLastOrder, readLastOrder, writeLastOrder } from './last-order'
it('reads a saved order', () => {
  clearLastOrder()
  writeLastOrder({ orderId: '1', token: 't', slug: 'loja' })
  expect(readLastOrder()?.orderId).toBe('1')
})
