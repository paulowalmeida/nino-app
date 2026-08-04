import type { ReactNode } from 'react'

import { toast } from '@nino/ds/components/Toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOrderStatus } from '@hooks/order/useOrderStatus'
import { OrderService } from '@services/order.service'

import { baseOrder } from './order.mock'

vi.mock('@services/order.service')
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useOrderStatus.name, () => {
  it('updates the order status and confirms the new stage', async () => {
    // Arrange
    vi.mocked(OrderService.updateOrderStatus).mockResolvedValue(baseOrder)
    const { result } = renderHook(() => useOrderStatus('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Act
    result.current.mutate({ orderId: 'order-1', status: 'ACCEPTED' })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('Pedido aceito')
  })

  it('requires a cancel reason when the target is cancelled', async () => {
    // Arrange
    vi.mocked(OrderService.updateOrderStatus).mockResolvedValue(baseOrder)
    const { result } = renderHook(() => useOrderStatus('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Act
    result.current.mutate({
      orderId: 'order-1',
      status: 'CANCELLED',
      cancelReason: 'Cliente desistiu',
    })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(OrderService.updateOrderStatus).toHaveBeenCalledWith(
      'tenant-1',
      'order-1',
      { status: 'CANCELLED', cancelReason: 'Cliente desistiu' }
    )
  })

  it('reports failure when the request is rejected', async () => {
    // Arrange
    vi.mocked(OrderService.updateOrderStatus).mockRejectedValue(
      new Error('boom')
    )
    const { result } = renderHook(() => useOrderStatus('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Act
    result.current.mutate({ orderId: 'order-1', status: 'PREPARING' })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
