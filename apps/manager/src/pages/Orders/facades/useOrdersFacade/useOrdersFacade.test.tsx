import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOrdersFilters } from '@pages/Orders/hooks/useOrdersFilters/useOrdersFilters'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useOrdersFacade } from './useOrdersFacade'
import { useOrdersFacadeMock } from './useOrdersFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/order/useOrderStatus/useOrderStatus')
vi.mock('@shared/hooks/order/useOrders/useOrders')
vi.mock('@shared/hooks/order/useQueueSummary/useQueueSummary')
vi.mock('@pages/Orders/hooks/useOrdersFilters/useOrdersFilters')

describe('useOrdersFacade', () => {
  it('composes filters, list data, summary, and commands', () => {
    const setStage = vi.fn()
    const setTerm = vi.fn()
    const advanceOrder = vi.fn()
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: useOrdersFacadeMock.unitId,
    } as never)
    vi.mocked(useOrdersFilters).mockReturnValue({
      isSearching: true,
      search: useOrdersFacadeMock.search,
      stage: useOrdersFacadeMock.stage,
      statuses: undefined,
      channel: undefined,
      term: useOrdersFacadeMock.search,
      setStage,
      setTerm,
    })
    vi.mocked(useOrders).mockReturnValue({
      orders: [],
      isPending: false,
      isError: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as never)
    vi.mocked(useOrderStatus).mockReturnValue({
      mutate: advanceOrder,
      isPending: false,
      variables: undefined,
    } as never)
    vi.mocked(useQueueSummary).mockReturnValue({ data: undefined } as never)

    const { result } = renderHook(() => useOrdersFacade())

    expect(useOrders).toHaveBeenCalledWith(
      useOrdersFacadeMock.unitId,
      useOrdersFacadeMock.search,
      undefined,
      undefined
    )
    expect(result.current.setStage).toBe(setStage)
    expect(result.current.setTerm).toBe(setTerm)
    expect(result.current.advanceOrder).toBe(advanceOrder)
  })

  it('uses a null unit when no unit is selected', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useOrdersFilters).mockReturnValue({
      isSearching: false,
      search: '',
      stage: 'incoming',
      statuses: ['PENDING'],
      channel: ['DELIVERY', 'PICKUP', 'COUNTER'],
      term: '',
      setStage: vi.fn(),
      setTerm: vi.fn(),
    })
    vi.mocked(useOrders).mockReturnValue({
      orders: [],
      isPending: false,
      isError: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as never)
    vi.mocked(useOrderStatus).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      variables: { orderId: 'order-1' },
    } as never)
    vi.mocked(useQueueSummary).mockReturnValue({ data: undefined } as never)

    renderHook(() => useOrdersFacade())

    expect(useOrders).toHaveBeenLastCalledWith(
      null,
      '',
      ['PENDING'],
      ['DELIVERY', 'PICKUP', 'COUNTER']
    )
    expect(useOrderStatus).toHaveBeenLastCalledWith(null)
    expect(useQueueSummary).toHaveBeenLastCalledWith(null)
  })
})
