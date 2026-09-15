import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrders } from '@shared/hooks/order/useOrders/useOrders'

import {
  finishedOrderMock,
  preparingOrderMock,
  waitingOrderMock,
} from '../useKitchenWall/useKitchenWall.mock'
import { useKitchenOrders } from './useKitchenOrders'

vi.mock('@shared/hooks/order/useOrders/useOrders', () => ({
  useOrders: vi.fn(),
}))

describe('useKitchenOrders', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-08-01T13:00:00.000Z'))
    vi.mocked(useOrders)
      .mockReturnValueOnce({
        orders: [waitingOrderMock, preparingOrderMock],
      } as unknown as ReturnType<typeof useOrders>)
      .mockReturnValueOnce({
        orders: [finishedOrderMock],
      } as unknown as ReturnType<typeof useOrders>)
  })

  afterEach(() => vi.useRealTimers())

  it('groups active orders and keeps recent finished orders together', () => {
    const { result } = renderHook(() => useKitchenOrders('unit-1'))

    expect(result.current.ordersByStage.waiting).toEqual([waitingOrderMock])
    expect(result.current.ordersByStage.preparing).toEqual([preparingOrderMock])
    expect(result.current.ordersByStage.finished).toEqual([finishedOrderMock])
    expect(result.current.orders).toEqual([
      waitingOrderMock,
      preparingOrderMock,
    ])
  })
})
