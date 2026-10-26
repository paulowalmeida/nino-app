import { describe, expect, it } from 'vitest'

import { cartLineKey } from './cart-line-key'
import { cartLineKeyMock } from './cart-line-key.mock'

describe('cartLineKey', () => {
  it('separates the same product bought with different choices', () => {
    expect(cartLineKey(cartLineKeyMock.plain)).not.toBe(
      cartLineKey(cartLineKeyMock.withBacon)
    )
  })

  it('joins the same choices picked in a different order', () => {
    expect(cartLineKey(cartLineKeyMock.withBaconReversed)).toBe(
      cartLineKey(cartLineKeyMock.withCheddarFirst)
    )
  })

  it('separates the same product asked with a note', () => {
    expect(cartLineKey(cartLineKeyMock.withNotes)).not.toBe(
      cartLineKey(cartLineKeyMock.plain)
    )
  })
})
