import { describe, expect, it } from 'vitest'

import { hasPickupRecipient } from './hasPickupRecipient'
import { pickupRecipientMock } from './hasPickupRecipient.mock'

describe('hasPickupRecipient', () => {
  it('accepts a complete pickup without complement, CEP or delivery zone', () => {
    expect(hasPickupRecipient(pickupRecipientMock)).toBe(true)
  })

  it.each(['name', 'phone'])('rejects missing %s', (field) => {
    expect(hasPickupRecipient({ ...pickupRecipientMock, [field]: '   ' })).toBe(
      false
    )
  })
  it('accepts name and phone without an address', () => {
    expect(
      hasPickupRecipient({
        ...pickupRecipientMock,
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
      })
    ).toBe(true)
  })
})
