import { describe, expect, it } from 'vitest'

import { addressCityLine, addressStreetLine } from './address-line'
import { addressLineMock } from './address-line.mock'

describe('addressStreetLine', () => {
  it('joins street, number, and complement with a middle dot', () => {
    const line = addressStreetLine(addressLineMock.withComplement)
    expect(line).toBe('Rua das Flores, 123 · Apto 12')
  })

  it('omits the complement when the address has none', () => {
    const line = addressStreetLine(addressLineMock.noComplement)
    expect(line).toBe('Avenida Central, 456')
  })
})

describe('addressCityLine', () => {
  it('joins neighborhood, city, state, and zip code', () => {
    const line = addressCityLine(addressLineMock.withComplement)
    expect(line).toBe('Centro · São Paulo/SP · 01001000')
  })
})
