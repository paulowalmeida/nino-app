import { describe, expect, it } from 'vitest'

import { toGiftProductOptions } from './giftProductOptions.adapter'
import { giftMenuMock } from './giftProductOptions.adapter.mock'

describe(toGiftProductOptions.name, () => {
  it('offers only active products without a required choice', () => {
    expect(toGiftProductOptions(giftMenuMock)).toEqual([
      {
        value: 'coke',
        name: 'Coca-Cola Lata',
        label: 'Coca-Cola Lata · R$ 6,50',
      },
    ])
  })
})
