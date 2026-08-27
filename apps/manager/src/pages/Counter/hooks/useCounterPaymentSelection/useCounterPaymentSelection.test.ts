import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCounterPaymentSelection } from './useCounterPaymentSelection'

const state = { chosenPaymentMethod: 'PIX' as const }

vi.mock('@pages/Counter/states/counter/counter.store', () => ({
  useCounterStore: (selector: (value: typeof state) => unknown) =>
    selector(state),
}))

describe(useCounterPaymentSelection.name, () => {
  it('keeps a selected available method', () => {
    const { result } = renderHook(() =>
      useCounterPaymentSelection(['CASH', 'PIX'])
    )
    expect(result.current.method).toBe('PIX')
  })

  it('falls back to the first available method', () => {
    const { result } = renderHook(() => useCounterPaymentSelection(['CASH']))
    expect(result.current.method).toBe('CASH')
  })

  it('returns null when no method is available', () => {
    const { result } = renderHook(() => useCounterPaymentSelection([]))
    expect(result.current.method).toBeNull()
  })
})
