import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CustomerService } from '@shared/services/customer/customer.service'

import { useCustomersList } from './useCustomersList'
import {
  customersListScopeMock,
  customersPageMock,
} from './useCustomersList.mock'

vi.mock('@shared/services/customer/customer.service', () => ({
  CustomerService: { listCustomers: vi.fn() },
  CUSTOMER_PAGE_SIZE: 30,
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe('useCustomersList', () => {
  afterEach(() => vi.clearAllMocks())

  it('adapts the first page and reports the base total', async () => {
    vi.mocked(CustomerService.listCustomers).mockResolvedValue(
      customersPageMock
    )

    const { result } = renderHook(
      () => useCustomersList(customersListScopeMock.tenantId, ''),
      { wrapper }
    )

    await waitFor(() => expect(result.current.rows).toHaveLength(1))
    expect(result.current.rows[0].name).toBe('Maria Clara Souza')
    expect(result.current.total).toBe(1)
    expect(result.current.hasNextPage).toBe(false)
    expect(CustomerService.listCustomers).toHaveBeenCalledWith(
      customersListScopeMock.tenantId,
      1,
      undefined
    )
  })

  it('trims the search term before asking the API', async () => {
    vi.mocked(CustomerService.listCustomers).mockResolvedValue(
      customersPageMock
    )

    renderHook(
      () =>
        useCustomersList(
          customersListScopeMock.tenantId,
          customersListScopeMock.search
        ),
      { wrapper }
    )

    await waitFor(() =>
      expect(CustomerService.listCustomers).toHaveBeenCalledWith(
        customersListScopeMock.tenantId,
        1,
        customersListScopeMock.trimmedSearch
      )
    )
  })

  it('fetches the following page through the load-more command', async () => {
    vi.mocked(CustomerService.listCustomers).mockResolvedValue({
      ...customersPageMock,
      pagination: { total: 60, page: 1, size: 30 },
    })

    const { result } = renderHook(
      () => useCustomersList(customersListScopeMock.tenantId, ''),
      { wrapper }
    )

    await waitFor(() => expect(result.current.hasNextPage).toBe(true))
    result.current.loadMoreCustomers()
    await waitFor(() =>
      expect(CustomerService.listCustomers).toHaveBeenLastCalledWith(
        customersListScopeMock.tenantId,
        2,
        undefined
      )
    )
  })

  it('reports the failure without rows', async () => {
    vi.mocked(CustomerService.listCustomers).mockRejectedValue(
      new Error('offline')
    )

    const { result } = renderHook(() => useCustomersList('tenant-1', ''), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.rows).toEqual([])
    expect(result.current.total).toBeUndefined()
  })

  it('does not request without a tenant', () => {
    const { result } = renderHook(() => useCustomersList(null, ''), {
      wrapper,
    })

    expect(CustomerService.listCustomers).not.toHaveBeenCalled()
    expect(result.current.rows).toEqual([])
  })
})
