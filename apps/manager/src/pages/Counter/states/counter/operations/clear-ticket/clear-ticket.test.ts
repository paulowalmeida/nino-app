import { describe, expect, it, vi } from 'vitest'

import { clearTicket } from './clear-ticket'

describe(clearTicket.name, () => {
  it('resets ticket state', () => {
    const set = vi.fn()
    clearTicket(set)
    expect(set).toHaveBeenCalledWith({
      lines: [],
      sheet: false,
      step: 'items',
      channel: null,
      chosenPaymentMethod: null,
      consumerName: '',
      recipient: {
        name: '',
        phone: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        zoneId: '',
      },
      changeFor: '',
    })
  })
})
