export type UnitSettings = {
  id: string
  unitId: string
  requireAccount: boolean
  requireCpf: boolean
  allowGuestOrder: boolean
  deliveryFee: number
  minOrderAmount: number
  deliveryRadius: number
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  isCounterEnabled: boolean
  loyaltyEnabled: boolean
  loyaltyPointsPerOrder: number
  loyaltyPointValue: number
  allowSharedStaff: boolean
  createdAt: string
  updatedAt: string
}
