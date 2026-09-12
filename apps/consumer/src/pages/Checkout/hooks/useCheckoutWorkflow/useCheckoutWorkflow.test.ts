import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { checkoutTotals } from '@pages/checkout/utils/checkout-totals/checkout-totals'
import { useDeliveryQuote } from '@pages/checkout/hooks/useDeliveryQuote/useDeliveryQuote'
import { usePlaceOrder } from '@pages/checkout/hooks/usePlaceOrder/usePlaceOrder'

import { useCheckoutWorkflow } from './useCheckoutWorkflow'
import { useCheckoutWorkflowMock } from './useCheckoutWorkflow.mock'

vi.mock('@pages/checkout/utils/checkout-totals/checkout-totals')
vi.mock('@pages/checkout/hooks/usePlaceOrder/usePlaceOrder')
vi.mock('@pages/checkout/hooks/useDeliveryQuote/useDeliveryQuote')
vi.mock('@utils/last-order')

describe('useCheckoutWorkflow', () => {
  it('exposes form state and calculated totals for the checkout screen', () => {
    const clearCart = vi.fn()
    vi.mocked(usePlaceOrder).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof usePlaceOrder>)
    vi.mocked(useDeliveryQuote).mockReturnValue({
      quote: undefined,
      isFetching: false,
    } as unknown as ReturnType<typeof useDeliveryQuote>)
    vi.mocked(checkoutTotals).mockReturnValue({
      subtotal: 36,
      deliveryFee: 6.5,
      total: 42.5,
      deliveryNote: 'Chega em cerca de 40 min',
    })

    const { result } = renderHook(() =>
      useCheckoutWorkflow({
        store: { id: 'store-1' } as unknown as Parameters<
          typeof useCheckoutWorkflow
        >[0]['store'],
        consumer: null,
        addresses: [],
        zones: [],
        isLoadingZones: false,
        cartLines: [
          {
            id: 'item-1||',
            item: {
              id: 'item-1',
              name: useCheckoutWorkflowMock.cartItemName,
              price: useCheckoutWorkflowMock.cartItemPrice,
            } as unknown as Parameters<
              typeof useCheckoutWorkflow
            >[0]['cartLines'][number]['item'],
            quantity: 2,
          },
        ],
        estimatedMinutes: 40,
        paymentOptions: ['CASH'],
        clearCart,
        slug: useCheckoutWorkflowMock.slug,
      })
    )

    expect(result.current.isDelivery).toBe(false)
    expect(result.current.total).toBe(42.5)
    expect(result.current.deliveryNote).toBe('Chega em cerca de 40 min')
    expect(clearCart).not.toHaveBeenCalled()
  })
})
