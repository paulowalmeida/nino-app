import type { HoursDraft } from '@custom_types/settings/hours-draft'

export const existingDayDraft: HoursDraft = {
  id: 'hours-1',
  dayOfWeek: 1,
  openTime: '09:00',
  closeTime: '19:00',
  isOpen: true,
}

export const newDayDraft: HoursDraft = {
  dayOfWeek: 2,
  openTime: '08:00',
  closeTime: '18:00',
  isOpen: true,
}
