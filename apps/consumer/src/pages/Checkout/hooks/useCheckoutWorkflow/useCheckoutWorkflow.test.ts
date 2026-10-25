import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { checkoutTotals } from '@pages/checkout/utils/checkout-totals/checkout-totals'
import { useDeliveryQuote } from '@pages/checkout/hooks/useDeliveryQuote/useDeliveryQuote'
import { usePlaceOrder } from '@pages/checkout/hooks/usePlaceOrder/usePlaceOrder'
import { ApiError } from '@nino/lib/utils/api-error'

import { useCheckoutWorkflow } from './useCheckoutWorkflow'
import {
  freeDeliveryOfferMock,
  promotionEndedErrorBodyMock,
  useCheckoutWorkflowMock,
} from './useCheckoutWorkflow.mock'

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
      deliveryDiscount: 0,
      freeDeliveryCoverage: 'none',
      promotionDiscount: 0,
      appliedDiscount: undefined,
      appliedGift: undefined,
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

it('shows a friendly message when guest checkout is throttled', () => {
  const clearCart = vi.fn()
  vi.mocked(usePlaceOrder).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isError: true,
    error: new ApiError(429, 'ThrottlerException: Too Many Requests'),
    data: undefined,
  } as unknown as ReturnType<typeof usePlaceOrder>)
  vi.mocked(useDeliveryQuote).mockReturnValue({
    quote: undefined,
    isFetching: false,
  } as unknown as ReturnType<typeof useDeliveryQuote>)
  vi.mocked(checkoutTotals).mockReturnValue({
    subtotal: 36,
    deliveryFee: 0,
    deliveryDiscount: 0,
    freeDeliveryCoverage: 'none',
    promotionDiscount: 0,
    appliedDiscount: undefined,
    appliedGift: undefined,
    total: 36,
    deliveryNote: '',
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
      cartLines: [],
      estimatedMinutes: undefined,
      paymentOptions: ['CASH'],
      clearCart,
      slug: useCheckoutWorkflowMock.slug,
    })
  )

  expect(result.current.submitErrorMessage).toBe(
    'Muitas tentativas em pouco tempo. Aguarde alguns segundos e tente novamente.'
  )
})

it('drops free delivery and shows the new fee when the campaign ends mid-order', () => {
  const refetchOffer = vi.fn()
  const promotionEnded = new ApiError(
    409,
    promotionEndedErrorBodyMock.message,
    promotionEndedErrorBodyMock
  )
  const placeOrder = {
    mutate: vi.fn(
      (_input: unknown, options: { onError: (error: unknown) => void }) =>
        options.onError(promotionEnded)
    ),
    isPending: false,
    isError: false,
    error: null as unknown,
    data: undefined,
  }
  vi.mocked(usePlaceOrder).mockImplementation(
    () => placeOrder as unknown as ReturnType<typeof usePlaceOrder>
  )
  vi.mocked(useDeliveryQuote).mockReturnValue({
    quote: undefined,
    isFetching: false,
  } as unknown as ReturnType<typeof useDeliveryQuote>)
  vi.mocked(checkoutTotals).mockImplementation(({ freeDelivery }) => ({
    subtotal: 70,
    deliveryFee: 7,
    deliveryDiscount: freeDelivery ? 7 : 0,
    freeDeliveryCoverage: freeDelivery ? 'applied' : 'none',
    promotionDiscount: 0,
    appliedDiscount: undefined,
    appliedGift: undefined,
    total: freeDelivery ? 70 : 77,
    deliveryNote: '',
  }))

  const { result, rerender } = renderHook(() =>
    useCheckoutWorkflow({
      store: { id: 'store-1' } as unknown as Parameters<
        typeof useCheckoutWorkflow
      >[0]['store'],
      consumer: null,
      addresses: [],
      zones: [],
      isLoadingZones: false,
      cartLines: [],
      estimatedMinutes: undefined,
      paymentOptions: ['CASH'],
      clearCart: vi.fn(),
      slug: useCheckoutWorkflowMock.slug,
      freeDelivery: freeDeliveryOfferMock,
      refetchOffers: refetchOffer,
    })
  )
  expect(result.current.total).toBe(70)

  act(() =>
    result.current.onSubmit({} as Parameters<typeof result.current.onSubmit>[0])
  )
  placeOrder.isError = true
  placeOrder.error = promotionEnded
  rerender()

  expect(placeOrder.mutate).toHaveBeenCalledWith(
    expect.objectContaining({
      promotions: expect.objectContaining({ expectsFreeDelivery: true }),
    }),
    expect.anything()
  )
  expect(refetchOffer).toHaveBeenCalled()
  expect(result.current.promotionEndedFee).toBe(7)
  expect(result.current.total).toBe(77)
})
