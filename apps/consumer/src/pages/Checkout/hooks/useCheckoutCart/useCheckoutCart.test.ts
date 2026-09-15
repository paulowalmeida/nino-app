import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCartSummary } from '@hooks/useCartSummary/useCartSummary'

import { useCheckoutCart } from './useCheckoutCart'
import { useCheckoutCartMock } from './useCheckoutCart.mock'

vi.mock('@hooks/useCartSummary/useCartSummary')

describe('useCheckoutCart', () => {
  it('keeps cart lines for the current store', () => {
    vi.mocked(useCartSummary).mockReturnValue(
      useCheckoutCartMock.cart as never
    )

    const { result } = renderHook(() =>
      useCheckoutCart(useCheckoutCartMock.storeId)
    )

    expect(result.current.cartLines).toBe(
      useCheckoutCartMock.cart.cartLines
    )
  })

  it('hides cart lines belonging to another store', () => {
    vi.mocked(useCartSummary).mockReturnValue({
      ...useCheckoutCartMock.cart,
      unitId: 'other-unit',
    } as never)

    const { result } = renderHook(() =>
      useCheckoutCart(useCheckoutCartMock.storeId)
    )

    expect(result.current.cartLines).toEqual([])
  })
})
