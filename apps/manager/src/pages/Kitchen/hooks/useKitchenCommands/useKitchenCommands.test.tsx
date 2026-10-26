import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKitchenCommands } from './useKitchenCommands'
import { kitchenCommandsMock } from './useKitchenCommands.mock'

describe('useKitchenCommands', () => {
  it('adapts the card transition to the mutation payload', () => {
    const advanceMutation = vi.fn()
    const { result } = renderHook(() => useKitchenCommands(advanceMutation))

    result.current.advanceOrder(
      kitchenCommandsMock.orderId,
      kitchenCommandsMock.targetStatus
    )

    expect(advanceMutation).toHaveBeenCalledWith({
      orderId: kitchenCommandsMock.orderId,
      status: kitchenCommandsMock.targetStatus,
    })
  })
})
