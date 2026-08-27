import { describe, expect, it, vi } from 'vitest'

import { addItem } from './add-item'
import { counterAddItemMock } from './add-item.mock'

describe(addItem.name, () => {
  it('adds a new item line', () => {
    const set = vi.fn()
    addItem(set, counterAddItemMock)
    const updater = set.mock.calls[0][0]
    expect(updater({ lines: [] })).toEqual({
      lines: [
        { productId: 'item-1', name: 'Café', unitPrice: '10', quantity: 1 },
      ],
    })
  })
})
