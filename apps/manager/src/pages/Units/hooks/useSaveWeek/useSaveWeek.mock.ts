import type { HoursDraft } from '@shared/types/settings/hours-draft'

export const unitIdMock = 'unit-1'

export const newDayMock = {
  dayOfWeek: 1,
  openTime: '08:00',
  closeTime: '18:00',
  isOpen: true,
} satisfies HoursDraft

export const savedDayMock = {
  id: 'hours-1',
  dayOfWeek: 2,
  openTime: '09:00',
  closeTime: '19:00',
  isOpen: true,
} satisfies HoursDraft
