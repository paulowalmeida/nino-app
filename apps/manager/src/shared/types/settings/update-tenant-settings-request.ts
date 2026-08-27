import type { PaymentMethod } from '@shared/types/order/payment-method'

export type UpdateTenantSettingsRequest = {
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  isCounterEnabled: boolean
  allowGuestOrder: boolean
  requireCpf: boolean
  minOrderAmount: number
  estimatedMinutes: number
  acceptedPaymentMethods: PaymentMethod[]
}
