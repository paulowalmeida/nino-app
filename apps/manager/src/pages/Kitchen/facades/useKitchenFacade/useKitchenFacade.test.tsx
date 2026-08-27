import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKitchenFacade } from './useKitchenFacade'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({ useCurrentTenant: () => ({ tenantId: 'tenant-1' }) }))
vi.mock('@shared/hooks/order/useOrders/useOrders', () => ({ useOrders: () => ({ orders: [], isPending: false }) }))
vi.mock('@shared/hooks/order/useOrderStatus/useOrderStatus', () => ({ useOrderStatus: () => ({ mutate: vi.fn(), isPending: false, variables: undefined }) }))

describe(useKitchenFacade.name, () => {
  it('exposes order data and the existing status command', () => {
    const { result } = renderHook(() => useKitchenFacade())
    expect(result.current.orders).toEqual([])
    expect(result.current.isPending).toBe(false)
    expect(result.current.advanceOrder).toBeTypeOf('function')
  })
})
