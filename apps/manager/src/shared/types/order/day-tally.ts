import type { PaymentMethod } from './payment-method'

export type DayTally = {
  orders: number
  revenue: number
  average: number
  byPaymentMethod: { method: PaymentMethod; amount: number }[]
}
