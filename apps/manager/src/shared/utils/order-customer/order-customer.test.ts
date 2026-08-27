import { describe, expect, it } from 'vitest'

import { addressOf, customerNameOf } from './order-customer'
import { baseOrderMock, deliveryAddressMock } from './order-customer.mock'

describe('order-customer', () => {
  it('customerNameOf reads the guest name when the order has one', () => {
    const order = { ...baseOrderMock, guestName: 'Ana Silva' }
    expect(customerNameOf(order)).toBe('Ana Silva')
  })

  it('customerNameOf falls back to a generic label without one', () => {
    expect(customerNameOf(baseOrderMock)).toBe('Cliente sem cadastro')
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
