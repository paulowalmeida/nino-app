import type { CartLine } from '@shared/types/counter/cart-line'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { Recipient } from '@shared/types/order/recipient'

export type CounterSaleInput = {
  lines: CartLine[]
  channel?: OrderChannel
  paymentMethod: PaymentMethod
  consumerName: string
  recipient?: Recipient
  changeFor?: string
}
