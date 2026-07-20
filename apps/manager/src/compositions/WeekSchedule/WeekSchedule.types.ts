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
  isSaving: boolean
  /** A semana inteira de uma vez — a loja decide a escala como um bloco. */
  onSave: (week: HoursDraft[]) => void
}
