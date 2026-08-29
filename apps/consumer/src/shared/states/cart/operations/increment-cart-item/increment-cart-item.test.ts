import { describe, expect, it } from 'vitest'

import { addCartItem } from '../add-cart-item/add-cart-item'
import { addCartItemMock } from '../add-cart-item/add-cart-item.mock'
import { incrementCartItem } from './increment-cart-item'
import { incrementCartItemMock } from './increment-cart-item.mock'

describe('incrementCartItem', () => {
  it('increments an existing cart line', () => {
    const lines = addCartItem({}, addCartItemMock.item, 1)

    expect(
      incrementCartItem(lines, incrementCartItemMock.itemId)['item-1'].quantity
    ).toBe(2)
  })
})
