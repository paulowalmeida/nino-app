import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderTrackingStatus } from './useOrderTrackingStatus'
import { useOrderTrackingStatusMock } from './useOrderTrackingStatus.mock'

const sessionState = vi.hoisted(() => ({
  consumer: null as unknown,
  pending: false,
}))
const orderState = vi.hoisted(() => ({
  data: undefined as unknown,
  pending: false,
  error: false,
}))

vi.mock('@shared/hooks/useConsumerSession/useConsumerSession', () => ({
  useConsumerSession: () => ({
    consumer: sessionState.consumer,
    isPending: sessionState.pending,
  }),
}))
vi.mock('@hooks/useGuestOrderStatus/useGuestOrderStatus', () => ({
  useGuestOrderStatus: () => ({
    data: orderState.data,
    isPending: orderState.pending,
    isError: orderState.error,
  }),
}))
vi.mock('@utils/order-journey', () => ({
  isTerminal: (status: string) => status === 'DELIVERED',
}))
describe('useOrderTrackingStatus', () => {
  beforeEach(() => {
    sessionState.consumer = null
    sessionState.pending = false
    orderState.data = undefined
    orderState.pending = false
    orderState.error = false
  })

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

  it('allows lookup for an authenticated consumer without a token', () => {
    sessionState.consumer = { id: 'consumer-1' }

    const { result } = renderHook(() =>
      useOrderTrackingStatus(useOrderTrackingStatusMock.orderId, undefined)
    )

    expect(result.current.canAsk).toBe(true)
  })

  it('exposes the completed state from the returned order', () => {
    orderState.data = { status: 'DELIVERED' }

    const { result } = renderHook(() =>
      useOrderTrackingStatus(useOrderTrackingStatusMock.orderId, undefined)
    )

    expect(result.current.done).toBe(true)
  })

  it('keeps lookup disabled without a token or consumer', () => {
    const { result } = renderHook(() =>
      useOrderTrackingStatus(useOrderTrackingStatusMock.orderId, undefined)
    )

    expect(result.current.canAsk).toBe(false)
  })
})
