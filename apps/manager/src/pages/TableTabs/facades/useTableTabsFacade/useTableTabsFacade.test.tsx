import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTableTabsFacade } from './useTableTabsFacade'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => ({ tenantId: 'tenant-1' }),
}))
vi.mock('@shared/hooks/order/useOrders/useOrders', () => ({
  useOrders: vi.fn(() => ({ orders: [], isPending: false, isError: false })),
}))

describe(useTableTabsFacade.name, () => {
  it('requests open and closed table-tab orders for the current tenant', async () => {
    const { useOrders } =
      await import('@shared/hooks/order/useOrders/useOrders')
    renderHook(() => useTableTabsFacade())

    expect(useOrders).toHaveBeenNthCalledWith(
      1,
      'tenant-1',
      undefined,
      ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'],
      'TABLE_TAB',
      undefined
    )
    expect(useOrders).toHaveBeenNthCalledWith(
      2,
      'tenant-1',
      undefined,
      ['DELIVERED', 'COMPLETED', 'CANCELLED'],
      'TABLE_TAB',
      undefined
    )
  })
})
