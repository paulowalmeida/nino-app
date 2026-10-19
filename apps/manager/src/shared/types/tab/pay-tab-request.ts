import type { PaymentMethod } from '@shared/types/order/payment-method'

export type PayTabRequest = {
  method: PaymentMethod
  amountReceived?: number
}
