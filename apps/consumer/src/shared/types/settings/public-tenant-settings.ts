import type { PaymentMethod } from '@custom_types/order/payment-method'

export type PublicTenantSettings = {
  acceptedPaymentMethods: PaymentMethod[]
  preparationMinutes: number
  deliveryMinutes: number
}
