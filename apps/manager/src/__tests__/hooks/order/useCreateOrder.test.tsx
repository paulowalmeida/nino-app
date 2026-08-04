import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCreateOrder } from '@hooks/order/useCreateOrder'
import { OrderService } from '@services/order.service'

import { baseOrder } from './order.mock'

vi.mock('@services/order.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCreateOrder.name, () => {
  it('creates an order for the current tenant', async () => {
    // Arrange
    vi.mocked(OrderService.createOrder).mockResolvedValue(baseOrder)
    const { result } = renderHook(() => useCreateOrder('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Act
    result.current.mutate({
      channel: 'DELIVERY',
      paymentMethod: 'PIX_ONLINE',
      items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
    })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(OrderService.createOrder).toHaveBeenCalledWith(
      'tenant-1',
      expect.objectContaining({ channel: 'DELIVERY' })
    )
  })

  it('reports failure when the request is rejected', async () => {
    // Arrange
    vi.mocked(OrderService.createOrder).mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useCreateOrder('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Act
    result.current.mutate({
      channel: 'COUNTER',
      paymentMethod: 'CASH',
      items: [],
    })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
