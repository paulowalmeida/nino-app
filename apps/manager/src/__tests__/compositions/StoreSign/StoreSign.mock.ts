import type { OpeningHours } from '@custom_types/settings/opening-hours'
import type { TenantPause } from '@custom_types/store/tenant-pause'
export const openAllDay: OpeningHours = {
  id: 'hours-1',
  tenantId: 'tenant-1',
  dayOfWeek: new Date().getDay(),
  openTime: '00:00',
  closeTime: '23:59',
  isOpen: true,
}

export const notPaused: TenantPause = {
  isPaused: false,
  pausedUntil: null,
  pauseReason: null,
}

export const paused: TenantPause = {
  isPaused: true,
  pausedUntil: null,
  pauseReason: 'Sem entregador disponível',
}
