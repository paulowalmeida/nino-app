import { describe, expect, it } from 'vitest'

import { clearCart } from './clear-cart'

describe('clearCart', () => {
  it('returns an empty cart line record', () => {
    expect(clearCart()).toEqual({})
  })
})
