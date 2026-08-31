import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { Order } from '@shared/types/order/order'

import { useCreateOrder } from './useCreateOrder'
import { createOrderRequestMock, orderMock, tenantIdMock } from './useCreateOrder.mock'

vi.mock('@shared/services/order/order.service')

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

describe(useCreateOrder.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
  })

  it('invalidates orders, the queue summary, and the cash session once created', async () => {
    // Arrange
    vi.mocked(OrderService.createOrder).mockResolvedValue(
      orderMock as unknown as Order
    )
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useCreateOrder(tenantIdMock), {
      wrapper,
    })

    // Act
    result.current.mutate(createOrderRequestMock)

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.orders.all(tenantIdMock),
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['order-queue-summary', tenantIdMock],
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.cash.all(tenantIdMock),
    })
  })
})
