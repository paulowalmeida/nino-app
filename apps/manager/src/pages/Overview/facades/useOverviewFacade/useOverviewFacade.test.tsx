import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePause } from '@pages/Overview/hooks/usePause/usePause'
import { usePauseActions } from '@pages/Overview/hooks/usePauseActions/usePauseActions'
import { useStoreOpen } from '@pages/Overview/hooks/useStoreOpen/useStoreOpen'
import { useTopConsumers } from '@pages/Overview/hooks/useTopConsumers/useTopConsumers'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useSalesReport } from '@shared/hooks/order/useSalesReport/useSalesReport'
import { useSalesSeries } from '@shared/hooks/order/useSalesSeries/useSalesSeries'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useSessionStore } from '@shared/states/session/session.state'

import { useOverviewFacade } from './useOverviewFacade'
import { useOverviewFacadeMock } from './useOverviewFacade.mock'

vi.mock('@pages/Overview/hooks/useTopConsumers/useTopConsumers')
vi.mock('@shared/hooks/order/useOrders/useOrders')
vi.mock('@shared/hooks/order/useQueueSummary/useQueueSummary')
vi.mock('@shared/hooks/order/useSalesReport/useSalesReport')
vi.mock('@shared/hooks/order/useSalesSeries/useSalesSeries')
vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@pages/Overview/hooks/usePause/usePause')
vi.mock('@pages/Overview/hooks/usePauseActions/usePauseActions')
vi.mock('@pages/Overview/hooks/useStoreOpen/useStoreOpen')
vi.mock('@shared/states/session/session.state')

describe('useOverviewFacade', () => {
  it('composes unit context and overview data hooks', () => {
    vi.mocked(useSessionStore).mockImplementation((selector) =>
      selector({ user: { name: 'Ana Silva', timezone: useOverviewFacadeMock.timezone } } as never)
    )
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: useOverviewFacadeMock.unitId,
      unitName: 'Sua loja',
      unitSlug: 'sua-loja',
    } as never)
    vi.mocked(useStoreOpen).mockReturnValue({ isOpen: true, isPending: false, hasSchedule: true })
    vi.mocked(usePause).mockReturnValue({} as never)
    vi.mocked(usePauseActions).mockReturnValue({} as never)
    vi.mocked(useOrders).mockReturnValue({} as never)
    vi.mocked(useQueueSummary).mockReturnValue({} as never)
    vi.mocked(useSalesReport).mockReturnValue({} as never)
    vi.mocked(useSalesSeries).mockReturnValue({} as never)
    vi.mocked(useTopConsumers).mockReturnValue({} as never)

    const { result } = renderHook(() => useOverviewFacade())

    expect(result.current.firstName).toBe('Ana')
    expect(result.current.unitId).toBe(useOverviewFacadeMock.unitId)
    expect(useOrders).toHaveBeenCalledWith(useOverviewFacadeMock.unitId)
    expect(useSalesSeries).toHaveBeenCalledWith(useOverviewFacadeMock.unitId, { period: 'week' })
  })

  it('keeps the facade safe without a user or unit', () => {
    vi.mocked(useSessionStore).mockImplementation((selector) =>
      selector({ user: null } as never)
    )
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useStoreOpen).mockReturnValue({ isOpen: false, isPending: false, hasSchedule: false })
    vi.mocked(usePause).mockReturnValue({} as never)
    vi.mocked(usePauseActions).mockReturnValue({} as never)
    vi.mocked(useOrders).mockReturnValue({} as never)
    vi.mocked(useQueueSummary).mockReturnValue({} as never)
    vi.mocked(useSalesReport).mockReturnValue({} as never)
    vi.mocked(useSalesSeries).mockReturnValue({} as never)
    vi.mocked(useTopConsumers).mockReturnValue({} as never)

    const { result } = renderHook(() => useOverviewFacade())

    expect(result.current.firstName).toBe('')
    expect(result.current.unitId).toBeNull()
    expect(useStoreOpen).toHaveBeenLastCalledWith(null, null)
  })
})
