import { describe, expect, it } from 'vitest'

import { toConsumerAddressRows } from './consumerAddressRows.adapter'
import { consumerAddressesMock } from './consumerAddressRows.adapter.mock'

describe('toConsumerAddressRows', () => {
  it('opens the list with the primary address', () => {
    const [first, second] = toConsumerAddressRows(consumerAddressesMock)

    expect(first.id).toBe('address-primary')
    expect(first.isPrimary).toBe(true)
    expect(second.isPrimary).toBe(false)
  })

  it('writes the complement into the street line when it exists', () => {
    const [primary, secondary] = toConsumerAddressRows(consumerAddressesMock)

    expect(primary.streetLine).toBe('Rua Olimpíadas, 55 — apto 22')
    expect(secondary.streetLine).toBe('Avenida Paulista, 1000')
  })

  it('joins neighborhood, city, state, and masked zip code', () => {
    const [primary] = toConsumerAddressRows(consumerAddressesMock)

    expect(primary.cityLine).toBe('Vila Olímpia · São Paulo/SP · CEP 04543-011')
  })

  it('returns no rows when the consumer has no address', () => {
    expect(toConsumerAddressRows([])).toEqual([])
  })
})
