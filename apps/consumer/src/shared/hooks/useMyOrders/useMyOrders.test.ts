import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { orderService } from '@shared/services/order/order.service'

import { useMyOrders } from './useMyOrders'
import { useMyOrdersMock } from './useMyOrders.mock'

vi.mock('@shared/services/order/order.service')

let queryOptions:
  | { queryKey: unknown; queryFn: unknown; enabled: boolean }
  | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: (options: typeof queryOptions) => {
      queryOptions = options
      return { data: undefined, isPending: true }
    },
  }
})

describe('useMyOrders', () => {
  it('queries the orders list under the my-orders cache key', () => {
    // Arrange
    // Act
    renderHook(() => useMyOrders(true))

    // Assert
    expect(queryOptions?.queryKey).toEqual(queryKeys.myOrders.all)
    expect(queryOptions?.queryFn).toBe(orderService.listMine)
  })

  it('resolves to the orders the service returns', async () => {
    // Arrange
    vi.mocked(orderService.listMine).mockResolvedValue(useMyOrdersMock.orders)
    renderHook(() => useMyOrders(true))

    // Act
    const result = await (queryOptions?.queryFn as () => Promise<unknown>)()

    // Assert
    expect(result).toEqual(useMyOrdersMock.orders)
  })

  it('stays disabled while there is no consumer session', () => {
    // Arrange
    // Act
    renderHook(() => useMyOrders(false))

    // Assert
    expect(queryOptions?.enabled).toBe(false)
  })
})
