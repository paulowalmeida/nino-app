import { describe, expect, it } from 'vitest'

import { paymentMethodsFor } from '@utils/order-flow'

describe(paymentMethodsFor.name, () => {
  it('drops the online card at the counter — no checkout to run', () => {
    // Arrange / Act
    const methods = paymentMethodsFor(
      ['CASH', 'CARD_ON_DELIVERY', 'CARD_ONLINE', 'PIX'],
      'COUNTER'
    )

    // Assert
    expect(methods).toEqual(['CASH', 'CARD_ON_DELIVERY', 'PIX'])
  })

  it('keeps every accepted method for a delivery order', () => {
    // Arrange / Act
    const methods = paymentMethodsFor(
      ['CASH', 'CARD_ON_DELIVERY', 'CARD_ONLINE', 'PIX'],
      'DELIVERY'
    )

    // Assert
    expect(methods).toEqual(['CASH', 'CARD_ON_DELIVERY', 'CARD_ONLINE', 'PIX'])
  })

  it('returns an empty list untouched', () => {
    // Arrange / Act
    const methods = paymentMethodsFor([], 'COUNTER')

    // Assert
    expect(methods).toEqual([])
  })
})
