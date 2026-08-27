import { MemoryRouter, Route, Routes } from 'react-router'

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerDetail } from '@pages/CustomerDetail/hooks/useCustomerDetail/useCustomerDetail'
import { useCustomerOrderHistory } from '@pages/CustomerDetail/hooks/useCustomerOrderHistory/useCustomerOrderHistory'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { useCustomerDetailFacade } from './useCustomerDetailFacade'
import { customerDetailFacadeMock } from './useCustomerDetailFacade.mock'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant')
vi.mock('@pages/CustomerDetail/hooks/useCustomerDetail/useCustomerDetail')
vi.mock(
  '@pages/CustomerDetail/hooks/useCustomerOrderHistory/useCustomerOrderHistory'
)

describe('useCustomerDetailFacade', () => {
  it('exposes detail and history values under the route scope', () => {
    const loadMoreOrders = vi.fn()
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: customerDetailFacadeMock.tenantId,
    } as unknown as ReturnType<typeof useCurrentTenant>)
    vi.mocked(useCustomerDetail).mockReturnValue({
      customer: { name: 'Maria' },
      addressRows: [],
      isPending: false,
    } as unknown as ReturnType<typeof useCustomerDetail>)
    vi.mocked(useCustomerOrderHistory).mockReturnValue({
      orderRows: [{ href: '../../pedidos/order-1' }],
      hasNextPage: true,
      isFetchingNextPage: false,
      loadMoreOrders,
    } as unknown as ReturnType<typeof useCustomerOrderHistory>)

    const { result } = renderHook(() => useCustomerDetailFacade(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[customerDetailFacadeMock.route]}>
          <Routes>
            <Route
              path={customerDetailFacadeMock.routePattern}
              element={children}
            />
          </Routes>
        </MemoryRouter>
      ),
    })

    expect(useCustomerDetail).toHaveBeenCalledWith(
      customerDetailFacadeMock.tenantId,
      customerDetailFacadeMock.customerId
    )
    expect(useCustomerOrderHistory).toHaveBeenCalledWith(
      customerDetailFacadeMock.tenantId,
      customerDetailFacadeMock.customerId
    )
    expect(result.current.customer).toEqual({ name: 'Maria' })
    expect(result.current.orderRows).toHaveLength(1)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.loadMoreOrders).toBe(loadMoreOrders)
  })

  it('falls back to an empty scope without tenant or route param', () => {
    vi.mocked(useCurrentTenant).mockReturnValue(null)
    vi.mocked(useCustomerDetail).mockReturnValue({
      customer: undefined,
      addressRows: [],
      isPending: true,
    } as unknown as ReturnType<typeof useCustomerDetail>)
    vi.mocked(useCustomerOrderHistory).mockReturnValue({
      orderRows: [],
      hasNextPage: false,
      isFetchingNextPage: false,
      loadMoreOrders: vi.fn(),
    } as unknown as ReturnType<typeof useCustomerOrderHistory>)

    renderHook(() => useCustomerDetailFacade(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/clientes']}>{children}</MemoryRouter>
      ),
    })

    expect(useCustomerDetail).toHaveBeenLastCalledWith(null, '')
    expect(useCustomerOrderHistory).toHaveBeenLastCalledWith(null, '')
  })
})
