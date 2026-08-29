import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTableTabItemCancellation } from '@pages/TableTabDetail/hooks/useTableTabItemCancellation/useTableTabItemCancellation'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { useTableTabDetailFacade } from './useTableTabDetailFacade'
import { tableTabDetailFacadeMock } from './useTableTabDetailFacade.mock'

vi.mock('react-router', () => ({ useParams: () => ({ tabId: 'tab-1' }) }))
vi.mock('@shared/hooks/order/useOrders/useOrders')
vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant')
vi.mock(
  '@pages/TableTabDetail/hooks/useTableTabItemCancellation/useTableTabItemCancellation'
)

describe(useTableTabDetailFacade.name, () => {
  it('composes the detail query and item cancellation command', () => {
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: 'tenant-1',
      tenantName: 'Padoca do Bairro',
      tenantSlug: 'padoca-do-bairro',
      companyId: 'company-1',
      companyName: 'Padoca do Bairro',
      role: 'TENANT_OWNER',
      isCurrent: true,
    })
    vi.mocked(useOrders).mockReturnValue({
      orders: [],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useOrders>)
    vi.mocked(useTableTabItemCancellation).mockReturnValue({
      cancelItem: vi.fn(),
      isCancelling: false,
    })

    const { result } = renderHook(() => useTableTabDetailFacade())

    expect(result.current.isPending).toBe(tableTabDetailFacadeMock.isPending)
    expect(result.current.isError).toBe(tableTabDetailFacadeMock.isError)
    expect(useOrders).toHaveBeenCalledWith(
      'tenant-1',
      'tab-1',
      [
        'PENDING',
        'ACCEPTED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED',
      ],
      'TABLE_TAB',
      undefined
    )
  })
})
