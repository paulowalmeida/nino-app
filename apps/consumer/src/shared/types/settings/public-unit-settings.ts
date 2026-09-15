import type { PaymentMethod } from '@custom_types/order/payment-method'

export type PublicUnitSettings = {
  acceptedPaymentMethods: PaymentMethod[]
  preparationMinutes: number
  deliveryMinutes: number
  showAddressOnStoreInfo?: boolean
  minOrderAmount: number
}
