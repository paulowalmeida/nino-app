import { describe, expect, it } from 'vitest'

import { addressCityLine, addressStreetLine } from './addressLine'
import { addressLineMock } from './addressLine.mock'

describe('addressStreetLine', () => {
  it('joins street, number, and complement with a middle dot', () => {
    // Arrange
    // Act
    const line = addressStreetLine(addressLineMock.withComplement)

    // Assert
    expect(line).toBe('Rua das Flores, 123 · Apto 12')
  })

  it('omits the complement when the address has none', () => {
    // Arrange
    // Act
    const line = addressStreetLine(addressLineMock.noComplement)

    // Assert
    expect(line).toBe('Avenida Central, 456')
  })
})

describe('addressCityLine', () => {
  it('joins neighborhood, city, state, and zip code', () => {
    // Arrange
    // Act
    const line = addressCityLine(addressLineMock.withComplement)

    // Assert
    expect(line).toBe('Centro · São Paulo/SP · 01001000')
  })
})
