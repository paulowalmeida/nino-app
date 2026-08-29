import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutTotals } from '@hooks/useCheckoutTotals'
import { useCreateGuestOrder } from '@hooks/useCreateGuestOrder'
import { useDeliveryQuote } from '@hooks/useDeliveryQuote'

import { useGuestCheckout } from './useGuestCheckout'
import { useGuestCheckoutMock } from './useGuestCheckout.mock'

vi.mock('@hooks/useCheckoutTotals')
vi.mock('@hooks/useCreateGuestOrder')
vi.mock('@hooks/useDeliveryQuote')
vi.mock('@utils/last-order')

describe('useGuestCheckout', () => {
  it('exposes form state and calculated totals for the checkout screen', () => {
    const clearCart = vi.fn()
    vi.mocked(useCreateGuestOrder).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      data: undefined,
    } as never)
    vi.mocked(useDeliveryQuote).mockReturnValue({
      quote: undefined,
      isFetching: false,
    } as never)
    vi.mocked(useCheckoutTotals).mockReturnValue({
      subtotal: 36,
      deliveryFee: 6.5,
      total: 42.5,
      deliveryNote: 'Chega em cerca de 40 min',
    })

    const { result } = renderHook(() =>
      useGuestCheckout({
        store: { id: 'store-1' } as never,
        zones: [],
        isLoadingZones: false,
        cartLines: [
          { item: { id: 'item-1', name: useGuestCheckoutMock.cartItemName, price: useGuestCheckoutMock.cartItemPrice } as never, quantity: 2 },
        ],
        estimatedMinutes: 40,
        paymentOptions: ['CASH'],
        clearCart,
        slug: useGuestCheckoutMock.slug,
      })
    )

    expect(result.current.isDelivery).toBe(false)
    expect(result.current.total).toBe(42.5)
    expect(result.current.deliveryNote).toBe('Chega em cerca de 40 min')
    expect(clearCart).not.toHaveBeenCalled()
  })
})
