import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CustomerService } from '@shared/services/customer/customer.service'

import { useCustomerOrderHistory } from './useCustomerOrderHistory'
import {
  customerOrderHistoryPageMock,
  customerOrderHistoryScopeMock,
} from './useCustomerOrderHistory.mock'

vi.mock('@shared/services/customer/customer.service', () => ({
  CustomerService: { listCustomerOrders: vi.fn() },
  HISTORY_PAGE_SIZE: 15,
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

const renderHistory = () =>
  renderHook(
    () =>
      useCustomerOrderHistory(
        customerOrderHistoryScopeMock.tenantId,
        customerOrderHistoryScopeMock.customerId
      ),
    { wrapper }
  )

describe('useCustomerOrderHistory', () => {
  afterEach(() => vi.clearAllMocks())

  it('adapts the first history page into order rows', async () => {
    vi.mocked(CustomerService.listCustomerOrders).mockResolvedValue(
      customerOrderHistoryPageMock
    )

    const { result } = renderHistory()

    await waitFor(() => expect(result.current.orderRows).toHaveLength(1))
    expect(CustomerService.listCustomerOrders).toHaveBeenCalledWith(
      customerOrderHistoryScopeMock.tenantId,
      customerOrderHistoryScopeMock.customerId,
      1
    )
    expect(result.current.orderRows[0].statusLabel).toBe('entregue')
    expect(result.current.hasNextPage).toBe(false)
  })

  it('fetches the following page through the load-more command', async () => {
    vi.mocked(CustomerService.listCustomerOrders).mockResolvedValue({
      ...customerOrderHistoryPageMock,
      pagination: { total: 30, page: 1, size: 15 },
    })

    const { result } = renderHistory()

    await waitFor(() => expect(result.current.hasNextPage).toBe(true))
    result.current.loadMoreOrders()
    await waitFor(() =>
      expect(CustomerService.listCustomerOrders).toHaveBeenLastCalledWith(
        customerOrderHistoryScopeMock.tenantId,
        customerOrderHistoryScopeMock.customerId,
        2
      )
    )
  })

  it('does not request without tenant or customer scope', () => {
    const { result } = renderHook(() => useCustomerOrderHistory(null, ''), {
      wrapper,
    })

    expect(CustomerService.listCustomerOrders).not.toHaveBeenCalled()
    expect(result.current.orderRows).toEqual([])
  })
})
