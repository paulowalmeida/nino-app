export type UpsertTenantSettingsRequest = {
  requireAccount?: boolean
  requireCpf?: boolean
  allowGuestOrder?: boolean
  deliveryFee?: number
  minOrderAmount?: number
  deliveryRadius?: number
  isDeliveryEnabled?: boolean
  isPickupEnabled?: boolean
  loyaltyEnabled?: boolean
  loyaltyPointsPerOrder?: number
  loyaltyPointValue?: number
  allowSharedStaff?: boolean
}
