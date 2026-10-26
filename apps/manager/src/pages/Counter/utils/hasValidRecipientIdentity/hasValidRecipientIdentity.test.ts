import { describe, expect, it } from 'vitest'

import { hasValidRecipientIdentity } from './hasValidRecipientIdentity'
import { validRecipientIdentityMock } from './hasValidRecipientIdentity.mock'

describe(hasValidRecipientIdentity.name, () => {
  it.each([
    { name: 'A', phone: validRecipientIdentityMock.phone },
    { name: 'Ed', phone: validRecipientIdentityMock.phone },
    { name: 'Ana', phone: '9' },
    { name: 'Ana', phone: '(91) 9888-000' },
    { name: 'Ana', phone: '(91) 9803-2687' },
  ])('rejects an incomplete recipient identity', (identity) => {
    expect(
      hasValidRecipientIdentity({ ...validRecipientIdentityMock, ...identity })
    ).toBe(false)
  })

  it.each(['(91) 3207-1243', '(91) 98888-0000'])(
    'accepts the valid phone %s',
    (phone) => {
      expect(
        hasValidRecipientIdentity({ ...validRecipientIdentityMock, phone })
      ).toBe(true)
    }
  )
})
