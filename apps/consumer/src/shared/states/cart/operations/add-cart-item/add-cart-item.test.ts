import { describe, expect, it } from 'vitest'

import { addCartItem } from './add-cart-item'
import { addCartItemMock } from './add-cart-item.mock'

describe('addCartItem', () => {
  it('adds the requested quantity to an existing cart line', () => {
    const lines = addCartItem({}, addCartItemMock.item, 1)

    expect(addCartItem(lines, addCartItemMock.item, 2)['item-1'].quantity).toBe(
      3
    )
  })
})
