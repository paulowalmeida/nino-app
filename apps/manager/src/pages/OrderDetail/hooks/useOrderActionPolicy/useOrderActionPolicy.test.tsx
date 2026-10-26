import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useOrderActionPolicy } from './useOrderActionPolicy'
import {
  cancelledOrderMock,
  deliveredOrderMock,
  pendingOrderMock,
} from './useOrderActionPolicy.mock'

describe('useOrderActionPolicy', () => {
  it('offers the next stage, the payment and the cancel of a fresh order', () => {
    const { result } = renderHook(() => useOrderActionPolicy(pendingOrderMock))

    expect(result.current.nextStep?.target).toBe('ACCEPTED')
    expect(result.current.canAdvance).toBe(true)
    expect(result.current.canMarkPaid).toBe(true)
    expect(result.current.canCancelOrder).toBe(true)
  })

  it('never charges a cancelled order', () => {
    const { result } = renderHook(() =>
      useOrderActionPolicy(cancelledOrderMock)
    )

    expect(result.current.canMarkPaid).toBe(false)
    expect(result.current.canCancelOrder).toBe(false)
    expect(result.current.canAdvance).toBe(false)
  })

  it('closes every action of a finished order', () => {
    const { result } = renderHook(() =>
      useOrderActionPolicy(deliveredOrderMock)
    )

    expect(result.current.canAdvance).toBe(false)
    expect(result.current.canMarkPaid).toBe(false)
    expect(result.current.canCancelOrder).toBe(false)
  })

  it('offers nothing while the order has not arrived', () => {
    const { result } = renderHook(() => useOrderActionPolicy(undefined))

    expect(result.current).toEqual({
      nextStep: null,
      canAdvance: false,
      canMarkPaid: false,
      canCancelOrder: false,
    })
  })
})
