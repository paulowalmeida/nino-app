import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutTotals } from '@pages/checkout/hooks/useCheckoutTotals/useCheckoutTotals'
import { useCreateGuestOrder } from '@pages/checkout/hooks/useCreateGuestOrder/useCreateGuestOrder'
import { useDeliveryQuote } from '@pages/checkout/hooks/useDeliveryQuote/useDeliveryQuote'

import { useGuestCheckout } from './useGuestCheckout'
import { useGuestCheckoutMock } from './useGuestCheckout.mock'

vi.mock('@pages/checkout/hooks/useCheckoutTotals/useCheckoutTotals')
vi.mock('@pages/checkout/hooks/useCreateGuestOrder/useCreateGuestOrder')
vi.mock('@pages/checkout/hooks/useDeliveryQuote/useDeliveryQuote')
vi.mock('@utils/last-order')

describe('useGuestCheckout', () => {
  it('exposes form state and calculated totals for the checkout screen', () => {
    const clearCart = vi.fn()
    vi.mocked(useCreateGuestOrder).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof useCreateGuestOrder>)
    vi.mocked(useDeliveryQuote).mockReturnValue({
      quote: undefined,
      isFetching: false,
    } as unknown as ReturnType<typeof useDeliveryQuote>)
    vi.mocked(useCheckoutTotals).mockReturnValue({
      subtotal: 36,
      deliveryFee: 6.5,
      total: 42.5,
      deliveryNote: 'Chega em cerca de 40 min',
    })

    const { result } = renderHook(() =>
      useGuestCheckout({
        store: { id: 'store-1' } as unknown as Parameters<
          typeof useGuestCheckout
        >[0]['store'],
        zones: [],
        isLoadingZones: false,
        cartLines: [
          {
            item: {
              id: 'item-1',
              name: useGuestCheckoutMock.cartItemName,
              price: useGuestCheckoutMock.cartItemPrice,
            } as unknown as Parameters<
              typeof useGuestCheckout
            >[0]['cartLines'][number]['item'],
            quantity: 2,
          },
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
