import { describe, expect, it, vi } from 'vitest'

import { setAddressLookupRequested } from './set-address-lookup-requested'
import { counterSetAddressLookupRequestedMock } from './set-address-lookup-requested.mock'

describe(setAddressLookupRequested.name, () => {
  it('marks the address lookup as requested', () => {
    const set = vi.fn()

    setAddressLookupRequested(set, true)

    expect(set).toHaveBeenCalledWith(
      counterSetAddressLookupRequestedMock.requested
    )
  })

  it('clears the request when the lookup is no longer wanted', () => {
    const set = vi.fn()

    setAddressLookupRequested(set, false)

    expect(set).toHaveBeenCalledWith(
      counterSetAddressLookupRequestedMock.notRequested
    )
  })
})
