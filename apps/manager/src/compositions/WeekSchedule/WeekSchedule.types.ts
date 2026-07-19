import type { OpeningHours } from '@custom_types/settings'

export type HoursDraft = {
  id?: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
}

export type WeekScheduleProps = {
  hours: OpeningHours[]
  isPending: boolean
  savingDay?: number
  onSave: (draft: HoursDraft) => void
}
