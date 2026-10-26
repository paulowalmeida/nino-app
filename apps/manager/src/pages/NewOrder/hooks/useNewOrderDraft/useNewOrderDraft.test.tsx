import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useNewOrderStore } from '@pages/NewOrder/states/new-order/new-order.store'

import { useNewOrderDraft } from './useNewOrderDraft'
import { draftLinesMock, draftSubtotalMock } from './useNewOrderDraft.mock'

describe('useNewOrderDraft', () => {
  beforeEach(() => act(() => useNewOrderStore.getState().reset()))

  it('starts with an empty ticket worth nothing', () => {
    const { result } = renderHook(() => useNewOrderDraft())

    expect(result.current.lines).toEqual([])
    expect(result.current.subtotal).toBe(0)
  })

  it('sums every line by quantity', () => {
    const { result } = renderHook(() => useNewOrderDraft())

    act(() => {
      result.current.add(draftLinesMock[0])
      result.current.add(draftLinesMock[0])
      result.current.add(draftLinesMock[1])
    })

    expect(result.current.subtotal).toBe(draftSubtotalMock)
  })
})
