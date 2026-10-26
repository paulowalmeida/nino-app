import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useLoadMore } from './useLoadMore'
import { loadMoreMock } from './useLoadMore.mock'

describe(useLoadMore.name, () => {
  it('fetches the next page when the sentinel intersects', () => {
    const fetchNextPage = vi.fn()
    let observerCallback: IntersectionObserverCallback | undefined
    const observe = vi.fn()
    const disconnect = vi.fn()
    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback
      }

      observe = observe
      disconnect = disconnect
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const sentinel = document.createElement('div')
    const { result } = renderHook(() => useLoadMore(loadMoreMock.hasNextPage, fetchNextPage))

    act(() => result.current(sentinel))
    observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(observe).toHaveBeenCalledWith(sentinel)
    expect(fetchNextPage).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })
})
