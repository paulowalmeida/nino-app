import { afterEach, describe, expect, it } from 'vitest'

import { useCartStore } from './cart.state'
import { cartStateMock } from './cart.state.mock'

afterEach(() => {
  useCartStore.getState().clear()
  window.localStorage.clear()
})

describe('useCartStore', () => {
  it('persists cart actions through the shared store', () => {
    useCartStore.getState().add(cartStateMock.unitId, cartStateMock.item, 2)
    useCartStore.getState().decrement(cartStateMock.item.id)

    expect(useCartStore.getState().lines[cartStateMock.item.id].quantity).toBe(
      1
    )
  })

  it('refuses to mix items from different stores', () => {
    useCartStore.getState().add(cartStateMock.unitId, cartStateMock.item)

    const added = useCartStore
      .getState()
      .add(cartStateMock.otherUnitId, cartStateMock.item)

    expect(added).toBe(false)
    expect(useCartStore.getState().unitId).toBe(cartStateMock.unitId)
    expect(useCartStore.getState().lines[cartStateMock.item.id].quantity).toBe(
      1
    )
  })

  it('replaces the previous store cart only after an explicit command', () => {
    useCartStore.getState().add(cartStateMock.unitId, cartStateMock.item, 2)

    useCartStore
      .getState()
      .replace(cartStateMock.otherUnitId, cartStateMock.item)

    expect(useCartStore.getState().unitId).toBe(cartStateMock.otherUnitId)
    expect(useCartStore.getState().lines[cartStateMock.item.id].quantity).toBe(
      1
    )
  })

  it('removes the unit ownership when the last line leaves the cart', () => {
    useCartStore.getState().add(cartStateMock.unitId, cartStateMock.item)

    useCartStore.getState().decrement(cartStateMock.item.id)

    expect(useCartStore.getState().unitId).toBeNull()
    expect(useCartStore.getState().lines).toEqual({})
  })

  it('discards persisted carts created before unit ownership existed', async () => {
    window.localStorage.setItem(
      'nino.cart',
      JSON.stringify({
        state: { lines: { legacy: { item: cartStateMock.item, quantity: 1 } } },
        version: 1,
      })
    )

    await useCartStore.persist.rehydrate()

    expect(useCartStore.getState().unitId).toBeNull()
    expect(useCartStore.getState().lines).toEqual({})
  })
})
