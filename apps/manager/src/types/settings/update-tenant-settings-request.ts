import type { PaymentMethod } from '@custom_types/order/payment-method'
export type UpdateTenantSettingsRequest = {
  acceptedPaymentMethods?: PaymentMethod[]
  allowGuestOrder?: boolean
  requireCpf?: boolean
  minOrderAmount?: number
  estimatedMinutes?: number
  isDeliveryEnabled?: boolean
  isPickupEnabled?: boolean
  isCounterEnabled?: boolean
}
