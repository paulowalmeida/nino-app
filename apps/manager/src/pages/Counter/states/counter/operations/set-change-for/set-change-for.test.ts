import { describe, expect, it, vi } from 'vitest'

import { setChangeFor } from './set-change-for'

describe('setChangeFor', () => {
  it('stores the amount received from the consumer', () => {
    const set = vi.fn()

    setChangeFor(set, '50.00')

    expect(set).toHaveBeenCalledWith({ changeFor: '50.00' })
  })
})
