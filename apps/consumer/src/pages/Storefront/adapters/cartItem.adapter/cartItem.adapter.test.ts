import { describe, expect, it } from 'vitest'

import { cartItem } from './cartItem.adapter'
import { cartItemAdapterMock } from './cartItem.adapter.mock'

describe('cartItem', () => {
  it('keeps only the menu snapshot required by the cart', () => {
    expect(cartItem(cartItemAdapterMock.item)).toEqual({
      id: 'item-1',
      name: 'Café',
      price: '5',
      imageUrl: 'https://example.com/cafe.jpg',
    })
  })
})
