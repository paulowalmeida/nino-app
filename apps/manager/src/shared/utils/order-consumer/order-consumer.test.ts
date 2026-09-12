import { describe, expect, it } from 'vitest'

import { addressOf, consumerNameOf } from './order-consumer'
import { baseOrderMock, deliveryAddressMock } from './order-consumer.mock'

describe('order-consumer', () => {
  it('consumerNameOf reads the guest name when the order has one', () => {
    const order = { ...baseOrderMock, guestName: 'Ana Silva' }
    expect(consumerNameOf(order)).toBe('Ana Silva')
  })

  it('reads the name used by a counter or pickup order', () => {
    expect(consumerNameOf(baseOrderMock)).toBe('Cliente teste')
  })

  it('addressOf formats the structured delivery address', () => {
    // Arrange
    const order = { ...baseOrderMock, deliveryAddress: deliveryAddressMock }

    // Act
    const address = addressOf(order)

    // Assert
    expect(address).toBe('Rua das Flores, 100 — Apto 2 · Centro')
  })

  it('addressOf formats the guest address when there is no structured one', () => {
    // Arrange
    const order = {
      ...baseOrderMock,
      guestStreet: 'Rua das Palmeiras',
      guestNumber: '20',
      guestComplement: null,
      guestNeighborhood: 'Jardins',
    }

    // Act
    const address = addressOf(order)

    // Assert
    expect(address).toBe('Rua das Palmeiras, 20 — Jardins')
  })

  it('addressOf returns null when the order has no address of any kind', () => {
    expect(addressOf(baseOrderMock)).toBeNull()
  })
})
