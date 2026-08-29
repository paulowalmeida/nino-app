import { describe, expect, it } from 'vitest'

import { addCartItem } from '../add-cart-item/add-cart-item'
import { addCartItemMock } from '../add-cart-item/add-cart-item.mock'
import { decrementCartItem } from './decrement-cart-item'
import { decrementCartItemMock } from './decrement-cart-item.mock'

describe('decrementCartItem', () => {
  it('removes a one-unit line from the cart', () => {
    const lines = addCartItem({}, addCartItemMock.item, 1)

    expect(decrementCartItem(lines, decrementCartItemMock.itemId)).toEqual({})
  })
})
