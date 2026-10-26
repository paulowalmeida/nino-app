import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useOrders } from './useOrders'
import { ordersHookPageMock } from './useOrders.mock'

vi.mock('@shared/services/order/order.service', () => ({
  ORDER_PAGE_SIZE: 40,
  OrderService: { listOrders: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useOrders.name, () => {
  it('normalizes search and flattens the first page', async () => {
    vi.mocked(OrderService.listOrders).mockResolvedValue(ordersHookPageMock)
    const { result } = renderHook(() => useOrders('unit-1', '  café  '), { wrapper })
    await waitFor(() => expect(result.current.orders).toEqual(ordersHookPageMock.data))
    expect(OrderService.listOrders).toHaveBeenCalledWith(
      'unit-1',
      1,
      'café',
      undefined,
      undefined,
      undefined,
      undefined
    )
  })
})
