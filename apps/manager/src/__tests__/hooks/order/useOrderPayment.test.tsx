import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOrderPayment } from '@hooks/order/useOrderPayment'
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

describe(useOrderPayment.name, () => {
  it('marks the order as paid', async () => {
    // Arrange
    vi.mocked(OrderService.markOrderPaid).mockResolvedValue(baseOrder)
    const { result } = renderHook(() => useOrderPayment('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Act
    result.current.mutate('order-1')

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(OrderService.markOrderPaid).toHaveBeenCalledWith(
      'tenant-1',
      'order-1'
    )
  })

  it('reports failure when the request is rejected', async () => {
    // Arrange
    vi.mocked(OrderService.markOrderPaid).mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useOrderPayment('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Act
    result.current.mutate('order-1')

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
