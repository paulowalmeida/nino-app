import { describe, expect, it } from 'vitest'

import { hasPickupRecipient } from './hasPickupRecipient'

const recipient = {
  name: 'Ana',
  phone: '91980326878',
  street: 'Travessa We-26',
  number: '471',
  neighborhood: 'Cidade Nova V',
  city: 'Ananindeua',
  state: 'PA',
  complement: '',
  zoneId: '',
}

describe('hasPickupRecipient', () => {
  it('accepts a complete pickup without complement, CEP or delivery zone', () => {
    expect(hasPickupRecipient(recipient)).toBe(true)
  })

  it.each([
    'name',
    'phone',
    'street',
    'number',
    'neighborhood',
    'city',
    'state',
  ])('rejects missing %s', (field) => {
    expect(hasPickupRecipient({ ...recipient, [field]: '   ' })).toBe(false)
  })
})
