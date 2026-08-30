import { describe, expect, it, vi } from 'vitest'

import { setLastSale } from './set-last-sale'
import { lastSaleMock } from './set-last-sale.mock'

describe(setLastSale.name, () => {
  it('stores the snapshot of the sale that just closed', () => {
    const set = vi.fn()

    setLastSale(set, lastSaleMock)

    expect(set).toHaveBeenCalledWith({ lastSale: lastSaleMock })
  })
})
