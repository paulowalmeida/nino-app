import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import { promotionService } from '@shared/services/promotion/promotion.service/promotion.service'

import { useCheckoutCoupon } from './useCheckoutCoupon'
import { couponUnitIdMock, typedCouponMock } from './useCheckoutCoupon.mock'

vi.mock(
  '@shared/services/promotion/promotion.service/promotion.service',
  () => ({
    promotionService: { findCoupon: vi.fn() },
  })
)

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={
      new QueryClient({ defaultOptions: { mutations: { retry: false } } })
    }
  >
    {children}
  </QueryClientProvider>
)

describe(useCheckoutCoupon.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('applies the coupon the API recognized and removes it on demand', async () => {
    vi.mocked(promotionService.findCoupon).mockResolvedValue(typedCouponMock)
    const { result } = renderHook(() => useCheckoutCoupon(couponUnitIdMock), {
      wrapper,
    })

    act(() => result.current.applyCouponCode(' volta10 '))

    await waitFor(() => expect(result.current.coupon).toBe(typedCouponMock))
    expect(promotionService.findCoupon).toHaveBeenCalledWith(
      couponUnitIdMock,
      'volta10'
    )
    act(() => result.current.removeCoupon())
    expect(result.current.coupon).toBeUndefined()
  })

  it('explains an unknown coupon', async () => {
    vi.mocked(promotionService.findCoupon).mockRejectedValue(
      new ApiError(404, 'Cupom inválido ou indisponível')
    )
    const { result } = renderHook(() => useCheckoutCoupon(couponUnitIdMock), {
      wrapper,
    })

    act(() => result.current.applyCouponCode('NADA'))

    await waitFor(() =>
      expect(result.current.couponError).toBe('Cupom inválido ou indisponível')
    )
    expect(result.current.coupon).toBeUndefined()
  })
})
