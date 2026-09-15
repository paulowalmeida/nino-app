export type UnitPaymentMethod = {
  id: string
  unitId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  method: { name: string; description: string | null }
}
