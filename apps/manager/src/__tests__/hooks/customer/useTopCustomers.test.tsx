import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTopCustomers } from '@hooks/customer/useTopCustomers'
import { CustomerService } from '@services/customer.service'

import { topCustomers } from './useTopCustomers.mock'

vi.mock('@services/customer.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useTopCustomers.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('exposes the ranking for the given metric and limit', async () => {
    // Arrange
    vi.mocked(CustomerService.getTopCustomers).mockResolvedValue(
      topCustomers
    )

    // Act
    const { result } = renderHook(
      () => useTopCustomers('tenant-1', 'spent', 5),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() =>
      expect(result.current.topCustomers).toEqual(topCustomers)
    )
    expect(CustomerService.getTopCustomers).toHaveBeenCalledWith(
      'tenant-1',
      'spent',
      5
    )
  })

  it('defaults to an empty ranking while the request is pending', () => {
    // Arrange / Act
    const { result } = renderHook(
      () => useTopCustomers('tenant-1', 'spent', 5),
      { wrapper: wrapWithClient() }
    )

    // Assert
    expect(result.current.topCustomers).toEqual([])
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(() => useTopCustomers(null, 'orders', 5), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(CustomerService.getTopCustomers).not.toHaveBeenCalled()
  })
})
