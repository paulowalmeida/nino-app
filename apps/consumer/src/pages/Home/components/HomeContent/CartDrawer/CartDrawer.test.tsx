import { describe, expect, it } from 'vitest'
import { CartDrawer } from './CartDrawer'
import { cartDrawerMock } from './CartDrawer.mock'

describe('CartDrawer', () => {
  it('exports the cart drawer contract', () => {
    expect(CartDrawer).toBeDefined()
    expect(cartDrawerMock.open).toBe(true)
  })
})
