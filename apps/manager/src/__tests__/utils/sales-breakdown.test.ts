import { describe, expect, it } from 'vitest'

import {
  channelBreakdownItems,
  paymentMethodBreakdownItems,
} from '@utils/sales-breakdown'

describe(channelBreakdownItems.name, () => {
  it('formats revenue and pluralizes the order count', () => {
    // Arrange
    const records = [
      { channel: 'DELIVERY' as const, revenue: 150, orderCount: 2 },
      { channel: 'PICKUP' as const, revenue: 50, orderCount: 1 },
    ]

    // Act
    const items = channelBreakdownItems(records, (channel) =>
      channel === 'DELIVERY' ? 'Entrega' : 'Retirada'
    )

    // Assert
    expect(items).toEqual([
      {
        id: 'DELIVERY',
        label: 'Entrega',
        value: 150,
        display: 'R$\u00a0150,00 · 2 pedidos',
      },
      {
        id: 'PICKUP',
        label: 'Retirada',
        value: 50,
        display: 'R$\u00a050,00 · 1 pedido',
      },
    ])
  })

  it('returns an empty list with no records', () => {
    // Arrange / Act
    const items = channelBreakdownItems([], () => '')

    // Assert
    expect(items).toEqual([])
  })

  it('paymentMethodBreakdownItems formats records the same way', () => {
    // Arrange
    const records = [{ method: 'PIX' as const, revenue: 100, orderCount: 1 }]

    // Act
    const items = paymentMethodBreakdownItems(records, () => 'Pix')

    // Assert
    expect(items).toEqual([
      {
        id: 'PIX',
        label: 'Pix',
        value: 100,
        display: 'R$\u00a0100,00 · 1 pedido',
      },
    ])
  })
})
