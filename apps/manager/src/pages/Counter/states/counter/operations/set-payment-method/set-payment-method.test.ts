import { describe, expect, it, vi } from 'vitest'

import { setPaymentMethod } from './set-payment-method'

describe(setPaymentMethod.name, () => {
  it('sets the selected payment method', () => {
    const set = vi.fn()
    setPaymentMethod(set, 'PIX')
    expect(set).toHaveBeenCalledWith({ chosenPaymentMethod: 'PIX' })
  })
})
