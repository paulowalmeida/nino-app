import type { OpeningHours } from '@shared/types/settings/opening-hours'

export const weekScheduleMock = {
  hours: [],
  isPending: false,
  isSaving: false,
  onSave: async () => undefined,
}

export const savedMondayMock = {
  id: 'hours-1',
  dayOfWeek: 1,
  openTime: '09:00',
  closeTime: '19:00',
  isOpen: true,
} as OpeningHours
