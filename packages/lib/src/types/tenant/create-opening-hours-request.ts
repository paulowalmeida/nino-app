export type CreateOpeningHoursRequest = {
  tenantId?: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen?: boolean
}
