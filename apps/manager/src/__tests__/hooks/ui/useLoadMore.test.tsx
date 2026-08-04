import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useLoadMore } from '@hooks/ui/useLoadMore'

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void

const stubIntersectionObserver = () => {
  let callback: ObserverCallback | null = null
  const observe = vi.fn()
  const disconnect = vi.fn()

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: ObserverCallback) {
        callback = cb
      }
      observe = observe
      disconnect = disconnect
      unobserve = vi.fn()
      takeRecords = vi.fn(() => [])
    }
  )

  return {
    observe,
    disconnect,
    fireIntersecting: () => callback?.([{ isIntersecting: true }]),
  }
}

describe(useLoadMore.name, () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('observes the sentinel when there is a next page', () => {
    // Arrange
    const { observe } = stubIntersectionObserver()
    const fetchNextPage = vi.fn()
    const { result } = renderHook(() => useLoadMore(true, fetchNextPage))
    const sentinel = document.createElement('div')

    // Act
    result.current(sentinel)

    // Assert
    expect(observe).toHaveBeenCalledWith(sentinel)
  })

  it('fetches the next page when the sentinel comes into view', () => {
    // Arrange
    const { fireIntersecting } = stubIntersectionObserver()
    const fetchNextPage = vi.fn()
    const { result } = renderHook(() => useLoadMore(true, fetchNextPage))
    const sentinel = document.createElement('div')
    result.current(sentinel)

    // Act
    fireIntersecting()

    // Assert
    expect(fetchNextPage).toHaveBeenCalledTimes(1)
  })

  it('does not observe anything with no next page', () => {
    // Arrange
    const { observe } = stubIntersectionObserver()
    const { result } = renderHook(() => useLoadMore(false, vi.fn()))
    const sentinel = document.createElement('div')

    // Act
    result.current(sentinel)

    // Assert
    expect(observe).not.toHaveBeenCalled()
  })

  it('disconnects the previous observer on a new sentinel', () => {
    // Arrange
    const { disconnect } = stubIntersectionObserver()
    const { result } = renderHook(() => useLoadMore(true, vi.fn()))
    result.current(document.createElement('div'))

    // Act
    result.current(document.createElement('div'))

    // Assert
    expect(disconnect).toHaveBeenCalledTimes(1)
  })
})
