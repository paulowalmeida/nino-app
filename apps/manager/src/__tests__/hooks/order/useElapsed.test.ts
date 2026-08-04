import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useElapsed } from '@hooks/order/useElapsed'

describe(useElapsed.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-04T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the minutes passed since the given instant', () => {
    // Arrange / Act
    const { result } = renderHook(() =>
      useElapsed('2026-08-04T11:50:00.000Z')
    )

    // Assert
    expect(result.current.label).toBe('10 min')
    expect(result.current.isLate).toBe(false)
  })

  it('flags as late after twenty minutes', () => {
    // Arrange / Act
    const { result } = renderHook(() =>
      useElapsed('2026-08-04T11:30:00.000Z')
    )

    // Assert
    expect(result.current.isLate).toBe(true)
  })

  it('ticks the label forward as time passes', () => {
    // Arrange
    const { result } = renderHook(() =>
      useElapsed('2026-08-04T11:58:00.000Z')
    )
    expect(result.current.label).toBe('2 min')

    // Act
    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    // Assert
    expect(result.current.label).toBe('3 min')
  })
})
