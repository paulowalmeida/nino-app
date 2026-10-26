import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from './useDebouncedValue'
import { debouncedValueMock } from './useDebouncedValue.mock'

describe(useDebouncedValue.name, () => {
  it('publishes a changed value only after the delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, debouncedValueMock.delay),
      { initialProps: { value: debouncedValueMock.initial } }
    )

    rerender({ value: debouncedValueMock.settled })
    expect(result.current).toBe(debouncedValueMock.initial)
    act(() => vi.advanceTimersByTime(debouncedValueMock.delay))
    expect(result.current).toBe(debouncedValueMock.settled)
    vi.useRealTimers()
  })
})
