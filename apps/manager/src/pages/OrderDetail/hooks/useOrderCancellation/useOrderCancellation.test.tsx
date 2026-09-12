import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'

import { useOrderCancellation } from './useOrderCancellation'
import { orderCancellationMock } from './useOrderCancellation.mock'

vi.mock('@shared/hooks/order/useOrderStatus/useOrderStatus')

const mutateAsync = vi.fn()

const renderCancellation = () =>
  renderHook(() =>
    useOrderCancellation(
      orderCancellationMock.tenantId,
      orderCancellationMock.orderId
    )
  )

describe('useOrderCancellation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useOrderStatus).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useOrderStatus>)
  })

  it('cancels the order carrying the reason the consumer will read', async () => {
    mutateAsync.mockResolvedValue({ id: orderCancellationMock.orderId })
    const { result } = renderCancellation()

    let cancelled = false
    await act(async () => {
      cancelled = await result.current.cancelOrder(orderCancellationMock.reason)
    })

    expect(cancelled).toBe(true)
    expect(mutateAsync).toHaveBeenCalledWith({
      orderId: orderCancellationMock.orderId,
      status: 'CANCELLED',
      cancelReason: orderCancellationMock.reason,
    })
  })

  it('reports the refusal instead of throwing at the screen', async () => {
    mutateAsync.mockRejectedValue(new Error('offline'))
    const { result } = renderCancellation()

    let cancelled = true
    await act(async () => {
      cancelled = await result.current.cancelOrder(orderCancellationMock.reason)
    })

    expect(cancelled).toBe(false)
  })

  it('reports the cancellation on its way', () => {
    vi.mocked(useOrderStatus).mockReturnValue({
      mutateAsync,
      isPending: true,
    } as unknown as ReturnType<typeof useOrderStatus>)

    const { result } = renderCancellation()

    expect(result.current.isCancelling).toBe(true)
  })
})
