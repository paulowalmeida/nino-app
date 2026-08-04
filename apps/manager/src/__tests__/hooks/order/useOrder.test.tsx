import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrder } from '@hooks/order/useOrder'
import { OrderService } from '@services/order.service'

import { openOrder } from './useOrder.mock'

vi.mock('@services/order.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useOrder.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the order by id', async () => {
    // Arrange
    vi.mocked(OrderService.getById).mockResolvedValue(openOrder)

    // Act
    const { result } = renderHook(() => useOrder('tenant-1', 'order-1'), {
      wrapper: wrapWithClient(),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(openOrder))
    expect(OrderService.getById).toHaveBeenCalledWith('tenant-1', 'order-1')
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(() => useOrder(null, 'order-1'), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(OrderService.getById).not.toHaveBeenCalled()
  })

  it('stays disabled with no order id', () => {
    // Arrange / Act
    const { result } = renderHook(() => useOrder('tenant-1', ''), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(OrderService.getById).not.toHaveBeenCalled()
  })
})
