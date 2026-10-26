import type { PaymentMethod } from '@shared/types/order/payment-method'

export type TabPayment = {
  id: string
  method: PaymentMethod
  amount: number
  changeAmount: number | null
  paidAt: string
}
