import { useSyncExternalStore } from 'react'

import type { Elapsed } from '@custom_types/ui'
import { elapsedSince } from '@utils/elapsed'

/** O relógio da cozinha bate junto: um timer só para a tela inteira. */
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
 * O tempo decorrido que continua andando: sem isso o cartão congela no
 * minuto em que a lista chegou e a cozinha passa a ler um número morto.
 */
export const useElapsed = (iso: string): Elapsed => {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return elapsedSince(iso)
}
