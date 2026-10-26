import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDockedHeader } from './useDockedHeader'
import { useDockedHeaderMock } from './useDockedHeader.mock'

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void

describe('useDockedHeader', () => {
  let callback: ObserverCallback | null = null
  let options: IntersectionObserverInit | undefined
  const observe = vi.fn()
  const disconnect = vi.fn()

  beforeEach(() => {
    callback = null
    options = undefined
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(fn: ObserverCallback, init?: IntersectionObserverInit) {
          callback = fn
          options = init
        }
        observe = observe
        disconnect = disconnect
      }
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('stays undocked while the target is still on screen', () => {
    const target = document.createElement('input')
    const { result } = renderHook(() =>
      useDockedHeader(target, useDockedHeaderMock.topOffset)
    )

    expect(result.current).toBe(false)
    expect(observe).toHaveBeenCalledWith(target)
  })

  it('docks when the target leaves the area below the fixed top', () => {
    const target = document.createElement('input')
    const { result, rerender } = renderHook(() =>
      useDockedHeader(target, useDockedHeaderMock.topOffset)
    )

    callback?.([{ isIntersecting: false }])
    rerender()

    expect(result.current).toBe(true)
  })

  it('undocks again once the target comes back into view', () => {
    const target = document.createElement('input')
    const { result, rerender } = renderHook(() =>
      useDockedHeader(target, useDockedHeaderMock.topOffset)
    )

    callback?.([{ isIntersecting: false }])
    rerender()
    callback?.([{ isIntersecting: true }])
    rerender()

    expect(result.current).toBe(false)
  })

  it('offsets the observed area by the height of the fixed top', () => {
    const target = document.createElement('input')
    renderHook(() => useDockedHeader(target, useDockedHeaderMock.topOffset))

    expect(options?.rootMargin).toBe(useDockedHeaderMock.rootMargin)
  })

  it('observes nothing until the target is mounted', () => {
    renderHook(() => useDockedHeader(null, useDockedHeaderMock.topOffset))

    expect(observe).not.toHaveBeenCalled()
  })

  it('stops observing when the consumer unmounts', () => {
    const target = document.createElement('input')
    const { unmount } = renderHook(() =>
      useDockedHeader(target, useDockedHeaderMock.topOffset)
    )

    unmount()

    expect(disconnect).toHaveBeenCalled()
  })
})
