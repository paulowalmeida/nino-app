import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useKitchenFacade } from './useKitchenFacade'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => ({ tenantId: 'tenant-1' }),
}))
vi.mock('@shared/hooks/order/useOrders/useOrders', () => ({
  useOrders: vi.fn(() => ({ orders: [], isPending: false })),
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

  it('requests only preparation orders in the kitchen stages', async () => {
    const { useOrders } = await import('@shared/hooks/order/useOrders/useOrders')

    renderHook(() => useKitchenFacade())

    expect(useOrders).toHaveBeenCalledWith(
      'tenant-1',
      undefined,
      ['ACCEPTED', 'PREPARING'],
      undefined,
      undefined,
      true
    )
  })
})
