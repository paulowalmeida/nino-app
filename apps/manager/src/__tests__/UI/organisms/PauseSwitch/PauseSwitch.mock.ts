import type { TenantPause } from '@custom_types/store/tenant-pause'
export const openPause: TenantPause = {
  isPaused: false,
  pausedUntil: null,
  pauseReason: null,
}

export const pausedIndefinitely: TenantPause = {
  isPaused: true,
  pausedUntil: null,
  pauseReason: null,
}

export const pausedWithReason: TenantPause = {
  isPaused: true,
  pausedUntil: '2026-08-04T20:00:00.000Z',
  pauseReason: 'Chuva forte',
}
