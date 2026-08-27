import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomersList } from '@pages/Customers/hooks/useCustomersList/useCustomersList'
import { useCustomersStore } from '@pages/Customers/states/customers/customers.store'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { useCustomersFacade } from './useCustomersFacade'
import { customersFacadeMock } from './useCustomersFacade.mock'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant')
vi.mock('@pages/Customers/hooks/useCustomersList/useCustomersList')

describe('useCustomersFacade', () => {
  it('feeds the committed term to the list and exposes both contracts', () => {
    const loadMoreCustomers = vi.fn()
    useCustomersStore.getState().setSearch(customersFacadeMock.search)
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: customersFacadeMock.tenantId,
    } as unknown as ReturnType<typeof useCurrentTenant>)
    vi.mocked(useCustomersList).mockReturnValue({
      rows: [{ id: 'customer-1' }],
      total: 1,
      isPending: false,
      isError: false,
      hasNextPage: true,
      loadMoreCustomers,
    } as unknown as ReturnType<typeof useCustomersList>)

    const { result } = renderHook(() => useCustomersFacade())

    expect(useCustomersList).toHaveBeenCalledWith(
      customersFacadeMock.tenantId,
      customersFacadeMock.search
    )
    expect(result.current.search).toBe(customersFacadeMock.search)
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.total).toBe(1)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.loadMoreCustomers).toBe(loadMoreCustomers)
    expect(result.current.setSearch).toBe(
      useCustomersStore.getState().setSearch
    )
  })

  it('asks the whole base without tenant or term', () => {
    useCustomersStore.getState().setSearch('')
    vi.mocked(useCurrentTenant).mockReturnValue(null)
    vi.mocked(useCustomersList).mockReturnValue({
      rows: [],
      total: undefined,
      isPending: true,
      isError: false,
      hasNextPage: false,
      loadMoreCustomers: vi.fn(),
    } as unknown as ReturnType<typeof useCustomersList>)

    const { result } = renderHook(() => useCustomersFacade())

    expect(useCustomersList).toHaveBeenLastCalledWith(null, '')
    expect(result.current.isPending).toBe(true)
  })
})
