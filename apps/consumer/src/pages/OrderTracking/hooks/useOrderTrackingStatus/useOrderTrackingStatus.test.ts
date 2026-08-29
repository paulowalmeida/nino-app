import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useOrderTrackingStatus } from './useOrderTrackingStatus'
import { useOrderTrackingStatusMock } from './useOrderTrackingStatus.mock'
vi.mock('@shared/hooks/useCustomerSession/useCustomerSession', () => ({
  useCustomerSession: () => ({ customer: null, isPending: false }),
}))
vi.mock('@hooks/useGuestOrderStatus/useGuestOrderStatus', () => ({
  useGuestOrderStatus: () => ({
    data: undefined,
    isPending: false,
    isError: false,
  }),
}))
vi.mock('@utils/order-journey', () => ({ isTerminal: () => false }))
describe('useOrderTrackingStatus', () => {
  it('allows lookup when a tracking token is present', () => {
    const { result } = renderHook(() =>
      useOrderTrackingStatus(
        useOrderTrackingStatusMock.orderId,
        useOrderTrackingStatusMock.token
      )
    )
    expect(result.current.canAsk).toBe(true)
    expect(result.current.done).toBe(false)
  })
})
