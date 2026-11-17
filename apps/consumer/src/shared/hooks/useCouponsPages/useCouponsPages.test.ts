import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCouponsPages } from './useCouponsPages'
import {
  couponsPagesCouponIdMock,
  couponsPagesOtherCouponIdMock,
} from './useCouponsPages.mock'

describe(useCouponsPages.name, () => {
  it('starts on the list unless the caller names a coupon', () => {
    const { result } = renderHook(() => useCouponsPages(true, null))

    expect(result.current.isDetail).toBe(false)
  })

  it('opens straight on the detail of the coupon the caller named', () => {
    const { result } = renderHook(() =>
      useCouponsPages(true, couponsPagesCouponIdMock)
    )

    expect(result.current.detailId).toBe(couponsPagesCouponIdMock)
  })

  it('goes back to the list but keeps the last coupon for the slide out', () => {
    const { result } = renderHook(() => useCouponsPages(true, null))

    act(() => result.current.openDetail(couponsPagesCouponIdMock))
    act(() => result.current.back())

    expect(result.current.isDetail).toBe(false)
    expect(result.current.shownId).toBe(couponsPagesCouponIdMock)
  })

  it('starts over from the caller choice every time it opens', () => {
    const { result, rerender } = renderHook(
      ({ open, initial }) => useCouponsPages(open, initial),
      { initialProps: { open: true, initial: null as string | null } }
    )

    act(() => result.current.openDetail(couponsPagesOtherCouponIdMock))
    rerender({ open: false, initial: null })
    rerender({ open: true, initial: couponsPagesCouponIdMock })

    expect(result.current.detailId).toBe(couponsPagesCouponIdMock)
  })
})
