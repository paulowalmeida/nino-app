import { describe, expect, it } from 'vitest'

import { paymentLabelFor } from '@utils/order-flow'

describe(paymentLabelFor.name, () => {
  it('names a card paid at delivery "Cartão na entrega"', () => {
    // Arrange / Act
    const label = paymentLabelFor('CARD_ON_DELIVERY', 'DELIVERY')

    // Assert
    expect(label).toBe('Cartão na entrega')
  })

  it('shortens the same method to "Cartão" at the counter', () => {
    // Arrange / Act
    const label = paymentLabelFor('CARD_ON_DELIVERY', 'COUNTER')

    // Assert
    expect(label).toBe('Cartão')
  })

  it('leaves every other method as-is regardless of channel', () => {
    // Arrange / Act
    const label = paymentLabelFor('PIX', 'COUNTER')

    // Assert
    expect(label).toBe('Pix')
  })
})
