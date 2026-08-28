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
  it('requests open counter orders for the current tenant', async () => {
    const { useOrders } = await import('@shared/hooks/order/useOrders/useOrders')
    renderHook(() => useTableTabsFacade())

    expect(useOrders).toHaveBeenCalledWith(
      'tenant-1',
      undefined,
      undefined,
      'COUNTER',
      'PENDING'
    )
  })
})
