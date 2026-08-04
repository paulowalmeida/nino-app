import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from '@hooks/ui/useDebouncedValue'

describe(useDebouncedValue.name, () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('keeps the initial value before the delay elapses', () => {
    // Arrange / Act
    const { result } = renderHook(() => useDebouncedValue('a', 350))

    // Assert
    expect(result.current).toBe('a')
  })

  it('settles to the latest value once the delay elapses', () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      { initialProps: { value: 'a' } }
    )

    // Act
    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(350))

    // Assert
    expect(result.current).toBe('b')
  })

  it('restarts the timer on every keystroke, skipping stale values', () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      { initialProps: { value: 'a' } }
    )

    // Act
    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'abc' })
    act(() => vi.advanceTimersByTime(200))

    // Assert
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(150))
    expect(result.current).toBe('abc')
  })
})
