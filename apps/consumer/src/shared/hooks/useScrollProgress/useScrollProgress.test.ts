import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useScrollProgress } from './useScrollProgress'
import { useScrollProgressMock } from './useScrollProgress.mock'

describe('useScrollProgress', () => {
  it('starts from the current scroll position and caps progress at one', () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 300 })

    const { result } = renderHook(() =>
      useScrollProgress(useScrollProgressMock.distance)
    )

    expect(result.current).toBe(1)
  })

  it('updates after scrolling inside the configured distance', () => {
    const requestFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0)
        return 1
      })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    const { result } = renderHook(() =>
      useScrollProgress(useScrollProgressMock.distance)
    )

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        value: 100,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(0.5)
    requestFrame.mockRestore()
  })
})
