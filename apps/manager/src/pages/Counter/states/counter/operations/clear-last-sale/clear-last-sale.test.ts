import { describe, expect, it, vi } from 'vitest'

import { clearLastSale } from './clear-last-sale'
import { clearedLastSaleMock } from './clear-last-sale.mock'

describe(clearLastSale.name, () => {
  it('dismisses the receipt of the last closed sale', () => {
    const set = vi.fn()

    clearLastSale(set)

    expect(set).toHaveBeenCalledWith(clearedLastSaleMock)
  })
})
