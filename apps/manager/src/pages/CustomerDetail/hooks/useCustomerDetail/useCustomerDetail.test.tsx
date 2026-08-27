import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CustomerService } from '@shared/services/customer/customer.service'

import { useCustomerDetail } from './useCustomerDetail'
import {
  customerDetailMock,
  customerDetailScopeMock,
} from './useCustomerDetail.mock'

vi.mock('@shared/services/customer/customer.service', () => ({
  CustomerService: { getById: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe('useCustomerDetail', () => {
  afterEach(() => vi.clearAllMocks())

  it('loads the customer and adapts its addresses', async () => {
    vi.mocked(CustomerService.getById).mockResolvedValue(customerDetailMock)

    const { result } = renderHook(
      () =>
        useCustomerDetail(
          customerDetailScopeMock.tenantId,
          customerDetailScopeMock.customerId
        ),
      { wrapper }
    )

    await waitFor(() => expect(result.current.customer).toBeDefined())
    expect(CustomerService.getById).toHaveBeenCalledWith(
      customerDetailScopeMock.tenantId,
      customerDetailScopeMock.customerId
    )
    expect(result.current.addressRows).toHaveLength(1)
    expect(result.current.addressRows[0].streetLine).toBe('Rua Olimpíadas, 55')
  })

  it('does not request without tenant or customer scope', () => {
    const { result } = renderHook(() => useCustomerDetail(null, ''), {
      wrapper,
    })

    expect(CustomerService.getById).not.toHaveBeenCalled()
    expect(result.current.customer).toBeUndefined()
    expect(result.current.addressRows).toEqual([])
  })
})
