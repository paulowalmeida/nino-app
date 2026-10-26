import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderService } from '@shared/services/order/order.service'

import { useOrderStatus } from './useOrderStatus'
import { orderStatusHookMock } from './useOrderStatus.mock'

vi.mock('@shared/services/order/order.service', () => ({
  OrderService: { updateOrderStatus: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useOrderStatus.name, () => {
  it('sends the requested status transition for the selected order', async () => {
    vi.mocked(OrderService.updateOrderStatus).mockResolvedValue(undefined as never)
    const { result } = renderHook(() => useOrderStatus(orderStatusHookMock.unitId), { wrapper })
    await result.current.mutateAsync({
      orderId: orderStatusHookMock.orderId,
      status: orderStatusHookMock.status,
    })
    expect(OrderService.updateOrderStatus).toHaveBeenCalledWith(
      orderStatusHookMock.unitId,
      orderStatusHookMock.orderId,
      { status: orderStatusHookMock.status }
    )
  })
})
