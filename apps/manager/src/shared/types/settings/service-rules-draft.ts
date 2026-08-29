import type { PaymentMethod } from '@shared/types/order/payment-method'

export type ServiceRulesDraft = {
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  isCounterEnabled: boolean
  allowGuestOrder: boolean
  requireCpf: boolean
  minOrderAmount: string
  preparationMinutes: string
  deliveryMinutes: string
  acceptedPaymentMethods: PaymentMethod[]
}
