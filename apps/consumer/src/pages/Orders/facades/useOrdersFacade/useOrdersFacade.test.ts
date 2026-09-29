import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'
import { useOrdersFacade } from './useOrdersFacade'
import { useOrdersFacadeMock } from './useOrdersFacade.mock'

vi.mock('@shared/hooks/useMyOrders/useMyOrders')

describe('useOrdersFacade', () => {
  it('exposes the orders query state for the Orders Page', () => {
    vi.mocked(useMyOrders).mockReturnValue({
      data: useOrdersFacadeMock.orders,
      isPending: false,
    } as never)

    const { result } = renderHook(() => useOrdersFacade())

    expect(useMyOrders).toHaveBeenCalledWith(true)
    expect(result.current.orders).toBe(useOrdersFacadeMock.orders)
    expect(result.current.isOrdersPending).toBe(false)
  })
})
