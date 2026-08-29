import type { PaymentMethod } from '@shared/types/order/payment-method'

export type PublicTenantSettings = {
  acceptedPaymentMethods: PaymentMethod[]
  preparationMinutes: number
  deliveryMinutes: number
  isDeliveryEnabled: boolean
  isPickupEnabled: boolean
  isCounterEnabled: boolean
}
