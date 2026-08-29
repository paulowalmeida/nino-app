import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useCartStore } from '@shared/states/cart/cart.state'

import { useCartSummary } from './useCartSummary'
import { useCartSummaryMock } from './useCartSummary.mock'

afterEach(() => useCartStore.getState().clear())

describe('useCartSummary', () => {
  it('derives cart lines, item count, and monetary total from the cart store', () => {
    useCartStore.getState().add(useCartSummaryMock.menuItem, 2)

    const { result } = renderHook(() => useCartSummary())

    expect(result.current.cartLines).toHaveLength(1)
    expect(result.current.count).toBe(2)
    expect(result.current.total).toBe(51)
  })

  it('forwards the cart actions for consumers to change the bag', () => {
    const { result } = renderHook(() => useCartSummary())

    expect(result.current.add).toBe(useCartStore.getState().add)
    expect(result.current.clear).toBe(useCartStore.getState().clear)
  })
})
