import { afterEach, describe, expect, it } from 'vitest'

import { useCartStore } from './cart.state'
import { cartStateMock } from './cart.state.mock'

afterEach(() => useCartStore.getState().clear())

describe('useCartStore', () => {
  it('persists cart actions through the shared store', () => {
    useCartStore.getState().add(cartStateMock.item, 2)
    useCartStore.getState().decrement(cartStateMock.item.id)

    expect(useCartStore.getState().lines[cartStateMock.item.id].quantity).toBe(
      1
    )
  })
})
