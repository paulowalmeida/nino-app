import { describe, expect, it } from 'vitest'

import { toMovedPinAddress } from './toMovedPinAddress'
import { addressAtPinMock, previousAddressMock } from './toMovedPinAddress.mock'

describe(toMovedPinAddress.name, () => {
  it('uses the street number the geocoder found at the pin', () => {
    const result = toMovedPinAddress(previousAddressMock, {
      ...addressAtPinMock,
      number: '88',
    })

    expect(result.number).toBe('88')
  })

  it('keeps the typed number while the pin stays on the same street', () => {
    const result = toMovedPinAddress(previousAddressMock, {
      ...addressAtPinMock,
      street: 'TRAVESSA WÉ 66 ',
    })

    expect(result.number).toBe('1562')
  })

  it('drops the typed number when the pin lands on another street', () => {
    const result = toMovedPinAddress(previousAddressMock, {
      ...addressAtPinMock,
      street: 'Travessa We 67',
    })

    expect(result.number).toBe('')
  })

  it('takes everything else, including the pin coordinates, from the pin address', () => {
    expect(toMovedPinAddress(previousAddressMock, addressAtPinMock)).toEqual({
      ...addressAtPinMock,
      number: '1562',
    })
  })
})
