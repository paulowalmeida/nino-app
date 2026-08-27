import type { CartLine } from '@shared/types/counter/cart-line'
import type { PaymentMethod } from '@shared/types/order/payment-method'

export type CounterSaleInput = {
  lines: CartLine[]
  paymentMethod: PaymentMethod
  customerName: string
  tableNumber: string
}
