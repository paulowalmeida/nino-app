import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCustomerOrders } from '@hooks/customer/useCustomerOrders'
import { CustomerService } from '@services/customer.service'

import { oneOrderHistoryPage } from './useCustomers.mock'

vi.mock('@services/customer.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCustomerOrders.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists the order history for a customer', async () => {
    // Arrange
    vi.mocked(CustomerService.listCustomerOrders).mockResolvedValue(
      oneOrderHistoryPage
    )

    // Act
    const { result } = renderHook(
      () => useCustomerOrders('tenant-1', 'customer-1'),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() => expect(result.current.orders).toHaveLength(1))
    expect(result.current.total).toBe(1)
  })
})
