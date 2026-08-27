import { describe, expect, it } from 'vitest'

import { toCustomerAddressRows } from './customerAddressRows.adapter'
import { customerAddressesMock } from './customerAddressRows.adapter.mock'

describe('toCustomerAddressRows', () => {
  it('opens the list with the primary address', () => {
    const [first, second] = toCustomerAddressRows(customerAddressesMock)

    expect(first.id).toBe('address-primary')
    expect(first.isPrimary).toBe(true)
    expect(second.isPrimary).toBe(false)
  })

  it('writes the complement into the street line when it exists', () => {
    const [primary, secondary] = toCustomerAddressRows(customerAddressesMock)

    expect(primary.streetLine).toBe('Rua Olimpíadas, 55 — apto 22')
    expect(secondary.streetLine).toBe('Avenida Paulista, 1000')
  })

  it('joins neighborhood, city, state, and masked zip code', () => {
    const [primary] = toCustomerAddressRows(customerAddressesMock)

    expect(primary.cityLine).toBe('Vila Olímpia · São Paulo/SP · CEP 04543-011')
  })

  it('returns no rows when the customer has no address', () => {
    expect(toCustomerAddressRows([])).toEqual([])
  })
})
