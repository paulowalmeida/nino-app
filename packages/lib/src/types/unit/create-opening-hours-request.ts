export type CreateOpeningHoursRequest = {
  unitId?: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen?: boolean
}
