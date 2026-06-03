export type TenantSettings = {
  id: string
  tenantId: string
  requireAccount: boolean
  requireCpf: boolean
  allowGuestOrder: boolean
  deliveryFee: number
  minOrderAmount: number
  deliveryRadius: number
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  loyaltyEnabled: boolean
  loyaltyPointsPerOrder: number
  loyaltyPointValue: number
  allowSharedStaff: boolean
  createdAt: string
  updatedAt: string
}
