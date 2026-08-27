import { describe, expect, it, vi } from 'vitest'

import { setCustomerName } from './set-customer-name'

describe(setCustomerName.name, () => {
  it('sets the customer name', () => {
    const set = vi.fn()
    setCustomerName(set, 'Ana')
    expect(set).toHaveBeenCalledWith({ customerName: 'Ana' })
  })
})
