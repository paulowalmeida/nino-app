import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { cartItemAdapterMock } from '@pages/Storefront/adapters/cartItem.adapter/cartItem.adapter.mock'
import { useCartSummary } from '@shared/hooks/useCartSummary/useCartSummary'

import { useStorefrontCart } from './useStorefrontCart'
import { useStorefrontCartMock } from './useStorefrontCart.mock'

vi.mock('@shared/hooks/useCartSummary/useCartSummary')

describe('useStorefrontCart', () => {
  it('adapts and adds an item to the current storefront cart', () => {
    const add = vi.fn(() => true)
    vi.mocked(useCartSummary).mockReturnValue({
      tenantId: useStorefrontCartMock.tenantId,
      lines: {},
      cartLines: [],
      count: 0,
      total: 0,
      add,
      replace: vi.fn(),
      increment: vi.fn(),
      decrement: vi.fn(),
      clear: vi.fn(),
    })

    const { result } = renderHook(() =>
      useStorefrontCart(useStorefrontCartMock.tenantId)
    )

    expect(result.current.addToCart(cartItemAdapterMock.item, 2)).toBe(true)
    expect(add).toHaveBeenCalledWith(
      useStorefrontCartMock.tenantId,
      {
        id: cartItemAdapterMock.item.id,
        name: cartItemAdapterMock.item.name,
        price: cartItemAdapterMock.item.price,
        imageUrl: cartItemAdapterMock.item.images[0].url,
      },
      2
    )
  })

  it('hides lines that belong to another storefront', () => {
    vi.mocked(useCartSummary).mockReturnValue({
      tenantId: 'other-store',
      lines: { item: { item: {} as never, quantity: 1 } },
      cartLines: [{ item: {} as never, quantity: 1 }],
      count: 1,
      total: 25,
      add: vi.fn(),
      replace: vi.fn(),
      increment: vi.fn(),
      decrement: vi.fn(),
      clear: vi.fn(),
    })

    const { result } = renderHook(() =>
      useStorefrontCart(useStorefrontCartMock.tenantId)
    )

    expect(result.current.cart).toEqual({})
    expect(result.current.cartLines).toEqual([])
    expect(result.current.cartCount).toBe(0)
    expect(result.current.cartTotal).toBe(0)
  })
})
