import type { TenantPause } from '@custom_types/store/tenant-pause'
export const openPause: TenantPause = {
  isPaused: false,
  pausedUntil: null,
  pauseReason: null,
}

export const closedPause: TenantPause = {
  isPaused: true,
  pausedUntil: '2026-08-04T15:00:00.000Z',
  pauseReason: 'Sem entregador disponível',
}
