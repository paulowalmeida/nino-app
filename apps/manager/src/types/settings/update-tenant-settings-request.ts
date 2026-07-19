import type { PaymentMethod } from '@custom_types/order'

export type UpdateTenantSettingsRequest = {
  acceptedPaymentMethods?: PaymentMethod[]
  allowGuestOrder?: boolean
  requireCpf?: boolean
  minOrderAmount?: number
  isDeliveryEnabled?: boolean
  isPickupEnabled?: boolean
  isCounterEnabled?: boolean
}
