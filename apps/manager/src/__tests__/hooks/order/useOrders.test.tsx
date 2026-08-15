import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrders } from '@hooks/order/useOrders'
import { OrderService } from '@services/order.service'

import { oneOrderPage } from './order.mock'

vi.mock('@services/order.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useOrders.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists orders for the current tenant', async () => {
    // Arrange
    vi.mocked(OrderService.listOrders).mockResolvedValue(oneOrderPage)

    // Act
    const { result } = renderHook(() => useOrders('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Assert
    await waitFor(() => expect(result.current.orders).toHaveLength(1))
  })

  it('does not fetch with no tenant selected', () => {
    // Arrange / Act
    renderHook(() => useOrders(null), { wrapper: wrapWithClient() })

    // Assert
    expect(OrderService.listOrders).not.toHaveBeenCalled()
  })

  it('trims the search term before sending it', async () => {
    // Arrange
    vi.mocked(OrderService.listOrders).mockResolvedValue(oneOrderPage)

    // Act
    renderHook(() => useOrders('tenant-1', '  pizza  '), {
      wrapper: wrapWithClient(),
    })

    // Assert
    await waitFor(() =>
      expect(OrderService.listOrders).toHaveBeenCalledWith(
        'tenant-1',
        1,
        'pizza',
        undefined
      )
    )
  })

  it('forwards the stage statuses to the service', async () => {
    // Arrange
    vi.mocked(OrderService.listOrders).mockResolvedValue(oneOrderPage)

    // Act
    renderHook(
      () => useOrders('tenant-1', undefined, ['DELIVERED', 'COMPLETED']),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() =>
      expect(OrderService.listOrders).toHaveBeenCalledWith(
        'tenant-1',
        1,
        undefined,
        ['DELIVERED', 'COMPLETED']
      )
    )
  })
})
