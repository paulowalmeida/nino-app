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
  /**
   * A semana inteira de uma vez — a loja decide a escala como um bloco.
   * Devolve promessa: o botão precisa saber o instante em que gravou, sem
   * esperar o refetch, senão volta a ficar clicável no meio do caminho.
   */
  onSave: (week: HoursDraft[]) => Promise<unknown>
}
