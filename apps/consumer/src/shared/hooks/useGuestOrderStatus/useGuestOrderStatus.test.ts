import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { orderService } from '@shared/services/order/order.service'

import { useGuestOrderStatus } from './useGuestOrderStatus'
import { useGuestOrderStatusMock } from './useGuestOrderStatus.mock'

let queryOptions:
  | {
      queryKey: unknown
      queryFn: () => unknown
      enabled: boolean
      refetchInterval: (query: {
        state: { data?: { status: string } }
      }) => false | number
    }
  | undefined

vi.mock('@shared/services/order/order.service')
vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: typeof queryOptions) => {
    queryOptions = options
    return { data: undefined }
  },
}))

describe('useGuestOrderStatus', () => {
  it('stays disabled until an order and an access method exist', () => {
    renderHook(() => useGuestOrderStatus(undefined, undefined))

    expect(queryOptions?.queryKey).toEqual(queryKeys.guestOrder.byId(''))
    expect(queryOptions?.enabled).toBe(false)
  })

  it('loads a public order with its tracking token', async () => {
    vi.mocked(orderService.getGuestStatus).mockResolvedValue(
      useGuestOrderStatusMock.activeOrder
    )
    renderHook(() => useGuestOrderStatus('order-1', 'tracking-token'))

    await expect(queryOptions?.queryFn()).resolves.toEqual(
      useGuestOrderStatusMock.activeOrder
    )
    expect(orderService.getGuestStatus).toHaveBeenCalledWith(
      'order-1',
      'tracking-token'
    )
  })

  it('loads the customer order without a tracking token when a session exists', async () => {
    vi.mocked(orderService.getMyStatus).mockResolvedValue(
      useGuestOrderStatusMock.activeOrder
    )
    renderHook(() => useGuestOrderStatus('order-1', undefined, true))

    await expect(queryOptions?.queryFn()).resolves.toEqual(
      useGuestOrderStatusMock.activeOrder
    )
    expect(orderService.getMyStatus).toHaveBeenCalledWith('order-1')
  })

  it('stops polling after a terminal status', () => {
    renderHook(() => useGuestOrderStatus('order-1', 'tracking-token'))

    expect(
      queryOptions?.refetchInterval({
        state: { data: { status: 'DELIVERED' } },
      })
    ).toBe(false)
    expect(
      queryOptions?.refetchInterval({
        state: { data: { status: 'PREPARING' } },
      })
    ).toBe(10000)
  })
})
