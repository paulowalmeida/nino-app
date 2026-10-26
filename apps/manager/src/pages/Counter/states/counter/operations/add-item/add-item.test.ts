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
        {
          lineId: 'item-1',
          productId: 'item-1',
          name: 'Café',
          unitPrice: '10',
          quantity: 1,
          modifiers: [],
        },
      ],
    })
  })

  it('keeps different configurations in separate lines', () => {
    const set = vi.fn()
    const modifiers = [
      {
        optionId: 'option-1',
        name: 'Ao ponto',
        unitPrice: '0',
        quantity: 1,
      },
      {
        optionId: 'option-2',
        name: 'Bacon extra',
        unitPrice: '6',
        quantity: 1,
      },
    ]

    addItem(set, counterAddItemMock, modifiers)
    const updater = set.mock.calls[0][0]
    expect(updater({ lines: [] })).toEqual({
      lines: [
        expect.objectContaining({
          lineId: 'item-1:option-1:option-2',
          unitPrice: '16',
          modifiers,
        }),
      ],
    })
  })

  it('increments only the matching configuration', () => {
    const set = vi.fn()
    const modifiers = [
      {
        optionId: 'option-1',
        name: 'Ao ponto',
        unitPrice: '0',
        quantity: 1,
      },
    ]
    addItem(set, counterAddItemMock, modifiers)
    const updater = set.mock.calls[0][0]
    const line = {
      lineId: 'item-1:option-1',
      productId: 'item-1',
      name: 'Café',
      unitPrice: '10',
      quantity: 1,
      modifiers,
    }
    expect(updater({ lines: [line] })).toEqual({
      lines: [{ ...line, quantity: 2 }],
    })
  })
})
