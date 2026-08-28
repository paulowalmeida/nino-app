import { describe, expect, it, vi } from 'vitest'

import { clearTicket } from './clear-ticket'

describe(clearTicket.name, () => {
  it('resets ticket state', () => {
    const set = vi.fn()
    clearTicket(set)
    expect(set).toHaveBeenCalledWith({
      lines: [],
      sheet: false,
      chosenPaymentMethod: null,
      customerName: '',
      tableNumber: '',
      changeFor: '',
    })
  })
})
