import { act, fireEvent, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useLongPress } from '@hooks/ui/useLongPress'

const HOLD_MS = 450

const pointerDownEvent = (x = 0, y = 0) =>
  ({ button: 0, clientX: x, clientY: y }) as React.PointerEvent

const pointerMoveEvent = (x: number, y: number) =>
  ({ clientX: x, clientY: y }) as React.PointerEvent

describe(useLongPress.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not fire on a quick tap released before the hold time', () => {
    // Arrange
    const onLongPress = vi.fn()
    const { result } = renderHook(() => useLongPress({ onLongPress }))

    // Act
    act(() => result.current.handlers.onPointerDown(pointerDownEvent()))
    act(() => vi.advanceTimersByTime(HOLD_MS - 50))
    act(() => fireEvent.pointerUp(document))

    // Assert
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('fires and calls onRelease when held past the hold time', () => {
    // Arrange
    const onLongPress = vi.fn()
    const onRelease = vi.fn()
    const { result } = renderHook(() =>
      useLongPress({ onLongPress, onRelease })
    )

    // Act
    act(() => result.current.handlers.onPointerDown(pointerDownEvent()))
    act(() => vi.advanceTimersByTime(HOLD_MS))
    act(() => fireEvent.pointerUp(document))

    // Assert
    expect(onLongPress).toHaveBeenCalledTimes(1)
    expect(onRelease).toHaveBeenCalledTimes(1)
  })

  it('cancels the hold when the pointer slips past the threshold', () => {
    // Arrange
    const onLongPress = vi.fn()
    const { result } = renderHook(() => useLongPress({ onLongPress }))

    // Act
    act(() => result.current.handlers.onPointerDown(pointerDownEvent(0, 0)))
    act(() => result.current.handlers.onPointerMove(pointerMoveEvent(30, 0)))
    act(() => vi.advanceTimersByTime(HOLD_MS))

    // Assert
    expect(onLongPress).not.toHaveBeenCalled()
    expect(result.current.isPressing).toBe(false)
  })

  it('ignores secondary button presses', () => {
    // Arrange
    const onLongPress = vi.fn()
    const { result } = renderHook(() => useLongPress({ onLongPress }))

    // Act
    act(() =>
      result.current.handlers.onPointerDown({
        button: 2,
        clientX: 0,
        clientY: 0,
      } as React.PointerEvent)
    )
    act(() => vi.advanceTimersByTime(HOLD_MS))

    // Assert
    expect(onLongPress).not.toHaveBeenCalled()
    expect(result.current.isPressing).toBe(false)
  })
})
