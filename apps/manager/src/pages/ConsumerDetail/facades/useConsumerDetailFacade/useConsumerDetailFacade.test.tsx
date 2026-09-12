import { MemoryRouter, Route, Routes } from 'react-router'

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerDetail } from '@pages/ConsumerDetail/hooks/useConsumerDetail/useConsumerDetail'
import { useConsumerOrderHistory } from '@pages/ConsumerDetail/hooks/useConsumerOrderHistory/useConsumerOrderHistory'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { useConsumerDetailFacade } from './useConsumerDetailFacade'
import { consumerDetailFacadeMock } from './useConsumerDetailFacade.mock'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant')
vi.mock('@pages/ConsumerDetail/hooks/useConsumerDetail/useConsumerDetail')
vi.mock(
  '@pages/ConsumerDetail/hooks/useConsumerOrderHistory/useConsumerOrderHistory'
)

describe('useConsumerDetailFacade', () => {
  it('exposes detail and history values under the route scope', () => {
    const loadMoreOrders = vi.fn()
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: consumerDetailFacadeMock.tenantId,
    } as unknown as ReturnType<typeof useCurrentTenant>)
    vi.mocked(useConsumerDetail).mockReturnValue({
      consumer: { name: 'Maria' },
      addressRows: [],
      isPending: false,
    } as unknown as ReturnType<typeof useConsumerDetail>)
    vi.mocked(useConsumerOrderHistory).mockReturnValue({
      orderRows: [{ href: '../../pedidos/order-1' }],
      hasNextPage: true,
      isFetchingNextPage: false,
      loadMoreOrders,
    } as unknown as ReturnType<typeof useConsumerOrderHistory>)

    const { result } = renderHook(() => useConsumerDetailFacade(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[consumerDetailFacadeMock.route]}>
          <Routes>
            <Route
              path={consumerDetailFacadeMock.routePattern}
              element={children}
            />
          </Routes>
        </MemoryRouter>
      ),
    })

    expect(useConsumerDetail).toHaveBeenCalledWith(
      consumerDetailFacadeMock.tenantId,
      consumerDetailFacadeMock.consumerId
    )
    expect(useConsumerOrderHistory).toHaveBeenCalledWith(
      consumerDetailFacadeMock.tenantId,
      consumerDetailFacadeMock.consumerId
    )
    expect(result.current.consumer).toEqual({ name: 'Maria' })
    expect(result.current.orderRows).toHaveLength(1)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.loadMoreOrders).toBe(loadMoreOrders)
  })

  it('falls back to an empty scope without tenant or route param', () => {
    vi.mocked(useCurrentTenant).mockReturnValue(null)
    vi.mocked(useConsumerDetail).mockReturnValue({
      consumer: undefined,
      addressRows: [],
      isPending: true,
    } as unknown as ReturnType<typeof useConsumerDetail>)
    vi.mocked(useConsumerOrderHistory).mockReturnValue({
      orderRows: [],
      hasNextPage: false,
      isFetchingNextPage: false,
      loadMoreOrders: vi.fn(),
    } as unknown as ReturnType<typeof useConsumerOrderHistory>)

    renderHook(() => useConsumerDetailFacade(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/clientes']}>{children}</MemoryRouter>
      ),
    })

    expect(useConsumerDetail).toHaveBeenLastCalledWith(null, '')
    expect(useConsumerOrderHistory).toHaveBeenLastCalledWith(null, '')
  })
})
