import { useSyncExternalStore } from 'react'

import type { Elapsed } from '@custom_types/ui/elapsed'
import { elapsedSince } from '@utils/elapsed'

/** The kitchen clock ticks together: a single timer for the whole screen. */
const TICK_MS = 15_000

let now = Date.now()
let timer: ReturnType<typeof setInterval> | null = null
const listeners = new Set<() => void>()

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener)

  timer ??= setInterval(() => {
    now = Date.now()
    listeners.forEach((notify) => notify())
  }, TICK_MS)

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

const getSnapshot = (): number => now

/**
 * Elapsed time that keeps ticking: without this the card freezes at the
 * minute the list loaded, and the kitchen ends up reading a dead number.
 */
export const useElapsed = (iso: string): Elapsed => {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return elapsedSince(iso)
}
