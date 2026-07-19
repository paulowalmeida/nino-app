/** Uma faixa de funcionamento. `dayOfWeek` vai de 0 (domingo) a 6. */
export type OpeningHours = {
  id: string
  tenantId: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
}
