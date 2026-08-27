import type { PaymentMethod } from './payment-method'

export type SalesByPaymentMethod = {
  method: PaymentMethod
  revenue: number
  orderCount: number
}
