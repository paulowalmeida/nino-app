import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useKitchenFacade } from './useKitchenFacade'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => ({ unitId: 'unit-1' }),
}))
vi.mock('@pages/Kitchen/hooks/useKitchenOrders/useKitchenOrders', () => ({
  useKitchenOrders: vi.fn(() => ({
    orders: [],
    finishedOrders: [],
    ordersByStage: { waiting: [], preparing: [], finished: [] },
    isPending: false,
    isError: false,
  })),
}))
vi.mock('@shared/hooks/settings/useSalesFormats/useSalesFormats', () => ({
  useSalesFormats: () => ({ formats: ['DELIVERY', 'COUNTER'] }),
}))
vi.mock('@shared/hooks/team/useStaff/useStaff', () => ({
  useStaff: () => ({ data: { data: [] } }),
}))
vi.mock('@pages/Kitchen/hooks/useKitchenAssignee/useKitchenAssignee', () => ({
  useKitchenAssignee: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('@shared/hooks/order/useOrderStatus/useOrderStatus', () => ({
  useOrderStatus: () => ({
    mutate: vi.fn(),
    isPending: false,
    variables: undefined,
  }),
}))

describe(useKitchenFacade.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('exposes order data and the existing status command', () => {
    const { result } = renderHook(() => useKitchenFacade())
    expect(result.current.orders).toEqual([])
    expect(result.current.isPending).toBe(false)
    expect(result.current.advanceOrder).toBeTypeOf('function')
  })

  it('requests kitchen orders through the dedicated orders hook', async () => {
    const { useKitchenOrders } =
      await import('@pages/Kitchen/hooks/useKitchenOrders/useKitchenOrders')

    renderHook(() => useKitchenFacade())

    expect(useKitchenOrders).toHaveBeenCalledWith('unit-1')
  })
})
