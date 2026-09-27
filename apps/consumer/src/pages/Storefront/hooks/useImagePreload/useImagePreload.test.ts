import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useImagePreload } from './useImagePreload'
import { useImagePreloadMock } from './useImagePreload.mock'

type StubImage = {
  src: string
  complete: boolean
  naturalWidth: number
  listeners: Record<string, (() => void)[]>
  addEventListener: (event: string, handler: () => void) => void
  removeEventListener: (event: string, handler: () => void) => void
  fire: (event: string) => void
}

describe('useImagePreload', () => {
  let instances: StubImage[] = []

  beforeEach(() => {
    instances = []
    vi.stubGlobal(
      'Image',
      class {
        src = ''
        complete = false
        naturalWidth = 0
        listeners: Record<string, (() => void)[]> = {}

        constructor() {
          instances.push(this as unknown as StubImage)
        }

        addEventListener(event: string, handler: () => void) {
          this.listeners[event] ??= []
          this.listeners[event].push(handler)
        }

        removeEventListener(event: string, handler: () => void) {
          this.listeners[event] = (this.listeners[event] ?? []).filter(
            (registered) => registered !== handler
          )
        }

        fire(event: string) {
          this.listeners[event]?.forEach((handler) => handler())
        }
      }
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('has nothing to wait for without an image url', () => {
    const { result } = renderHook(() => useImagePreload(undefined))

    expect(result.current).toBe(false)
  })

  it('stays pending until the image file loads', () => {
    // Arrange
    const { result } = renderHook(() =>
      useImagePreload(useImagePreloadMock.url)
    )
    expect(result.current).toBe(true)

    // Act
    act(() => instances[0].fire('load'))

    // Assert
    expect(result.current).toBe(false)
  })

  it('stops waiting when the image file fails', () => {
    // Arrange
    const { result } = renderHook(() =>
      useImagePreload(useImagePreloadMock.url)
    )

    // Act
    act(() => instances[0].fire('error'))

    // Assert
    expect(result.current).toBe(false)
  })

  it('resolves right away when the file is already decoded', () => {
    vi.stubGlobal(
      'Image',
      class {
        src = ''
        complete = true
        naturalWidth = 800
        addEventListener() {}
        removeEventListener() {}
      }
    )

    const { result } = renderHook(() =>
      useImagePreload(useImagePreloadMock.url)
    )

    expect(result.current).toBe(false)
  })

  it('waits again after the image url changes', () => {
    const { result, rerender } = renderHook(
      ({ url }: { url: string }) => useImagePreload(url),
      { initialProps: { url: useImagePreloadMock.url } }
    )

    act(() => instances[0].fire('load'))
    expect(result.current).toBe(false)

    rerender({ url: useImagePreloadMock.nextUrl })

    expect(result.current).toBe(true)
  })
})
