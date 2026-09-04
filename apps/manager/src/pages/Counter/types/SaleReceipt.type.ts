import type { CartLine } from '@shared/types/counter/cart-line'
import type { PaymentMethod } from '@shared/types/order/payment-method'

export type SaleReceipt = {
  orderNumber: number
  pickupCode?: string | null
  closedAt: string
  lines: CartLine[]
  total: number
  paymentMethod: PaymentMethod
  receivedAmount: number | null
  changeAmount: number
}
