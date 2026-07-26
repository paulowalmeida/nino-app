import { createToaster, CreateToasterReturn } from '@ark-ui/react/toast'

import { ToastPlacement, ToastSettings } from './Toast.types'

/* One Ark toaster per placement: the store binds its corner at creation, so a
 * per-call `placement` needs its own store. They are created on demand — an
 * app that only ever uses one corner pays for one machine. */
const toasters = new Map<ToastPlacement, CreateToasterReturn>()
const listeners = new Set<() => void>()

let placements: ToastPlacement[] = []

let settings: Required<ToastSettings> = {
  placement: 'bottom-end',
  duration: 4200,
  max: 4,
  gap: 12,
  offset: '1.25rem',
  overlap: true,
  pauseOnPageIdle: true,
}

const applySettings = (toaster: CreateToasterReturn) => {
  Object.assign(toaster.attrs, {
    duration: settings.duration,
    max: settings.max,
    gap: settings.gap,
    offsets: settings.offset,
    overlap: settings.overlap,
    pauseOnPageIdle: settings.pauseOnPageIdle,
  })
}

/**
 * Changes the defaults for every toast. Called once at startup, or through the
 * props of `ToastContainer`.
 */
export function configureToasts(next: ToastSettings) {
  settings = { ...settings, ...next }
  toasters.forEach(applySettings)
}

export function getToastSettings() {
  return settings
}

export function getToaster(placement = settings.placement) {
  const existing = toasters.get(placement)
  if (existing) return existing

  const toaster = createToaster({
    placement,
    duration: settings.duration,
    max: settings.max,
    gap: settings.gap,
    offsets: settings.offset,
    overlap: settings.overlap,
    pauseOnPageIdle: settings.pauseOnPageIdle,
  })

  toasters.set(placement, toaster)
  placements = [...toasters.keys()]
  listeners.forEach((listener) => listener())

  return toaster
}

export function getActiveToasters() {
  return toasters
}

export function getActivePlacements() {
  return placements
}

export function subscribeToPlacements(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
