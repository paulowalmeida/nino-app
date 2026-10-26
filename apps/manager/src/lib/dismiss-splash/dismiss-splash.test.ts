import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dismissSplashWhenReady } from './dismiss-splash'
import {
  splashElementIdMock,
  splashMarkupMock,
} from './dismiss-splash.mock'

type PendingFrame = {
  callback: FrameRequestCallback
  cancelled: boolean
}

const pendingFrames = new Map<number, PendingFrame>()
let nextFrameId = 1

const flushNextFrame = () => {
  const entry = [...pendingFrames.entries()].find(([, frame]) => !frame.cancelled)
  if (!entry) return

  const [frameId, frame] = entry
  pendingFrames.delete(frameId)
  frame.callback(0)
}

describe('dismissSplashWhenReady', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.innerHTML = splashMarkupMock
    pendingFrames.clear()
    nextFrameId = 1

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        const frameId = nextFrameId++
        pendingFrames.set(frameId, { callback, cancelled: false })
        return frameId
      })
    )
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((frameId: number) => {
        const frame = pendingFrames.get(frameId)
        if (frame) frame.cancelled = true
      })
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('does nothing when the splash is absent', () => {
    const isReady = vi.fn(() => true)
    document.getElementById(splashElementIdMock)?.remove()

    dismissSplashWhenReady(isReady)

    expect(isReady).not.toHaveBeenCalled()
    expect(requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('waits for readiness and removes the splash after the fade', () => {
    const isReady = vi.fn(() => true)

    dismissSplashWhenReady(isReady)
    flushNextFrame()

    expect(document.getElementById(splashElementIdMock)).not.toHaveAttribute(
      'data-leaving'
    )

    flushNextFrame()

    expect(document.getElementById(splashElementIdMock)).toHaveAttribute(
      'data-leaving',
      'true'
    )

    vi.advanceTimersByTime(260)

    expect(document.getElementById(splashElementIdMock)).not.toBeInTheDocument()
  })

  it('cancels polling when the safety timeout dismisses the splash', () => {
    const isReady = vi.fn(() => false)

    dismissSplashWhenReady(isReady)
    vi.advanceTimersByTime(12000)

    expect(document.getElementById(splashElementIdMock)).toHaveAttribute(
      'data-leaving',
      'true'
    )
    expect(cancelAnimationFrame).toHaveBeenCalledOnce()

    vi.advanceTimersByTime(260)

    expect(document.getElementById(splashElementIdMock)).not.toBeInTheDocument()
  })
})
