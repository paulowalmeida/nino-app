import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCustomer } from '@hooks/customer/useCustomer'
import { CustomerService } from '@services/customer.service'

import { customerHistory } from './useCustomers.mock'

vi.mock('@services/customer.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCustomer.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the customer history by id', async () => {
    // Arrange
    vi.mocked(CustomerService.getById).mockResolvedValue(customerHistory)

    // Act
    const { result } = renderHook(
      () => useCustomer('tenant-1', 'customer-1'),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(customerHistory))
  })

  it('does not fetch with an empty customer id', () => {
    // Arrange / Act
    renderHook(() => useCustomer('tenant-1', ''), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(CustomerService.getById).not.toHaveBeenCalled()
  })
})
