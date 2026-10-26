import { describe, expect, it } from 'vitest'

import { cartItemPrice } from './cart-item-price'
import { cartItemPriceMock } from './cart-item-price.mock'

describe('cartItemPrice', () => {
  it('returns the product price when nothing was chosen', () => {
    expect(cartItemPrice(cartItemPriceMock.plain)).toBe(20.5)
  })

  it('adds every chosen option, counting its quantity', () => {
    expect(cartItemPrice(cartItemPriceMock.withExtras)).toBe(32)
  })
})
