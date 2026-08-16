import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCustomers } from '@hooks/customer/useCustomers'
import { CustomerService } from '@services/customer.service'

import { oneCustomerPage } from './useCustomers.mock'

vi.mock('@services/customer.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCustomers.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists customers for the current tenant', async () => {
    // Arrange
    vi.mocked(CustomerService.listCustomers).mockResolvedValue(
      oneCustomerPage
    )

    // Act
    const { result } = renderHook(() => useCustomers('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Assert
    await waitFor(() => expect(result.current.customers).toHaveLength(1))
    expect(result.current.total).toBe(1)
  })

  it('does not fetch with no tenant selected', () => {
    // Arrange / Act
    renderHook(() => useCustomers(null), { wrapper: wrapWithClient() })

    // Assert
    expect(CustomerService.listCustomers).not.toHaveBeenCalled()
  })

  it('forwards the search term to the service', async () => {
    // Arrange
    vi.mocked(CustomerService.listCustomers).mockResolvedValue(
      oneCustomerPage
    )

    // Act
    renderHook(() => useCustomers('tenant-1', 'maria'), {
      wrapper: wrapWithClient(),
    })

    // Assert
    await waitFor(() =>
      expect(CustomerService.listCustomers).toHaveBeenCalledWith(
        'tenant-1',
        1,
        'maria'
      )
    )
  })
})
