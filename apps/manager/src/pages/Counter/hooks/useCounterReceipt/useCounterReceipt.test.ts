import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCounterReceipt } from './useCounterReceipt'
import { counterReceiptMock } from './useCounterReceipt.mock'

const dismiss = vi.fn()
const state = { lastSale: counterReceiptMock, clearLastSale: dismiss }

vi.mock('@pages/Counter/states/counter/counter.store', () => ({
  useCounterStore: (selector: (value: typeof state) => unknown) =>
    selector(state),
}))

describe(useCounterReceipt.name, () => {
  it('exposes the last closed sale for the receipt button', () => {
    const { result } = renderHook(() => useCounterReceipt())

    expect(result.current.lastSale).toBe(counterReceiptMock)
  })

  it('exposes the existing dismiss command without wrapping it', () => {
    const { result } = renderHook(() => useCounterReceipt())

    expect(result.current.dismissReceipt).toBe(dismiss)
  })
})
